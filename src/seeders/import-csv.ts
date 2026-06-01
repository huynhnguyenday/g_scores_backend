import fs from "fs";
import { parse } from "csv-parse";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { StudentScore } from "../models/StudentScore.js";
import { csvRowToDocument } from "../utils/csv-row.js";

async function flushBatch(
  batch: Array<{ insertOne: { document: Record<string, unknown> } }>,
): Promise<number> {
  if (batch.length === 0) return 0;
  const result = await StudentScore.bulkWrite(batch, { ordered: false });
  batch.length = 0;
  return result.insertedCount + (result.upsertedCount ?? 0);
}

async function run() {
  if (!fs.existsSync(env.csvPath)) {
    throw new Error(`CSV not found: ${env.csvPath}`);
  }

  await connectDatabase();

  if (env.seedDropCollection) {
    await StudentScore.collection.drop().catch(() => undefined);
    console.log("Dropped collection student_scores");
  }

  const batch: Array<{ insertOne: { document: Record<string, unknown> } }> = [];
  let line = 0;
  let inserted = 0;
  let skipped = 0;

  const parser = fs.createReadStream(env.csvPath).pipe(
    parse({
      columns: true,
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }),
  );

  for await (const row of parser) {
    line++;
    const doc = csvRowToDocument(row as Record<string, string>);
    if (!doc.sbd) {
      skipped++;
      continue;
    }

    batch.push({ insertOne: { document: doc as Record<string, unknown> } });

    if (batch.length >= env.seedBatchSize) {
      try {
        inserted += await flushBatch(batch);
      } catch (err: unknown) {
        const mongoErr = err as { code?: number; writeErrors?: unknown[] };
        if (mongoErr.code === 11000) {
          skipped += batch.length;
          batch.length = 0;
        } else {
          throw err;
        }
      }
      if (line % 100_000 === 0) {
        console.log(
          `Processed ${line.toLocaleString()} rows, inserted ~${inserted.toLocaleString()}`,
        );
      }
    }
  }

  inserted += await flushBatch(batch);

  const total = await StudentScore.countDocuments();
  console.log("Import finished");
  console.log({
    csvLines: line,
    insertedApprox: inserted,
    skipped,
    totalInDb: total,
  });

  await disconnectDatabase();
}

run().catch(async (err) => {
  console.error(err);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
