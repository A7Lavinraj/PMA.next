import { db } from "@/database";
import { usersTable } from "@/database/schemas/user";
import { eq } from "drizzle-orm";

export type TUserInferInsert = typeof usersTable.$inferInsert;

export async function userFindUnique(user: TUserInferInsert) {
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.email));

  return existingUser;
}

export async function userFindMany() {
  return await db.select().from(usersTable);
}

export async function userCreateUnique(user: TUserInferInsert) {
  const [newUser] = await db.insert(usersTable).values(user).returning();
  return newUser;
}

export async function userCreateOrFindUnique(user: TUserInferInsert) {
  const existingUser = userFindUnique(user);

  if (existingUser) {
    return existingUser;
  }

  return userCreateUnique(user);
}

export async function userUpdateUnique(user: TUserInferInsert) {
  const [patchedUser] = await db
    .update(usersTable)
    .set(user)
    .where(eq(usersTable.email, user.email))
    .returning();

  return patchedUser;
}
