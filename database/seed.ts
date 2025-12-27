import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { users } from "./schema";

dotenv.config({ path: [".env.local", ".env"] });

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  const tables = { usersTable: users };

  await reset(db, tables);
  await seed(db, tables);
}

main();
