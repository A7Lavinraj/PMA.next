import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { usersTable } from "./schemas/user";

dotenv.config({ path: [".env.local", ".env"] });

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  const tables = { usersTable };

  await reset(db, tables);
  await seed(db, tables);
}

main();
