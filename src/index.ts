import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function main() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
