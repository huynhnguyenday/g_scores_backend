import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongodbUri: required('MONGODB_URI'),
  csvPath: path.resolve(process.env.CSV_PATH ?? './diem_thi_thpt_2024.csv'),
  seedBatchSize: Number(process.env.SEED_BATCH_SIZE ?? 5000),
  seedDropCollection: process.env.SEED_DROP_COLLECTION === 'true',
};
