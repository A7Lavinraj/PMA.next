import { serial, pgTable, varchar, pgEnum, date } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "driver",
  "manager",
  "admin",
]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 255 }),
  address: varchar({ length: 255 }),
  dateOfBirth: date("date_of_birth"),
  driverPhoto: varchar("driver_photo"),
  drivingLicenseNumber: varchar("driving_license_number"),
  licenseExpiryDate: varchar("license_expiry_date"),
  licensePhoto: varchar("license_photo"),
  role: userRoleEnum().notNull(),
});
