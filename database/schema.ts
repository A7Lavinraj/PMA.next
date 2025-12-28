import { relations } from "drizzle-orm";
import {
  serial,
  pgTable,
  varchar,
  pgEnum,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "driver",
  "manager",
  "admin",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "parked",
  "retrieving",
  "retrieved",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),

  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),

  driverPhoto: varchar("driver_photo"),
  drivingLicenseNumber: varchar("driving_license_number"),
  licenseExpiryDate: timestamp("license_expiry_date", {
    withTimezone: true,
  }),
  licensePhoto: varchar("license_photo"),

  role: userRoleEnum("role").notNull().default("user"),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  plate: varchar("plate", { length: 20 }).notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),

  status: ticketStatusEnum("status").notNull(),

  customerId: integer("customer_id")
    .notNull()
    .references(() => users.id),

  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),

  locationId: integer("location_id")
    .notNull()
    .references(() => locations.id),

  entryTime: timestamp("entry_time", { withTimezone: true })
    .notNull()
    .defaultNow(),

  exitTime: timestamp("exit_time", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),

  ticketId: integer("ticket_id")
    .notNull()
    .references(() => tickets.id),

  valetId: integer("valet_id")
    .notNull()
    .references(() => users.id),

  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  unassignedAt: timestamp("unassigned_at", { withTimezone: true }),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),

  ticketId: integer("ticket_id")
    .notNull()
    .unique()
    .references(() => tickets.id),

  amount: integer("amount").notNull(),

  status: paymentStatusEnum("status").notNull(),

  paidAt: timestamp("paid_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets, {
    relationName: "customerTickets",
  }),
  valetAssignments: many(assignments),
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  tickets: many(tickets),
  customer: one(users, {
    fields: [vehicles.customerId],
    references: [users.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  customer: one(users, {
    fields: [tickets.customerId],
    references: [users.id],
  }),

  vehicle: one(vehicles, {
    fields: [tickets.vehicleId],
    references: [vehicles.id],
  }),

  location: one(locations, {
    fields: [tickets.locationId],
    references: [locations.id],
  }),

  assignments: many(assignments),

  payment: one(payments, {
    fields: [tickets.id],
    references: [payments.ticketId],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [assignments.ticketId],
    references: [tickets.id],
  }),

  valet: one(users, {
    fields: [assignments.valetId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [payments.ticketId],
    references: [tickets.id],
  }),
}));
