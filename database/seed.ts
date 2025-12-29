import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, locations, vehicles } from "./schema";
import * as bcrypt from "bcrypt";
import { reset } from "drizzle-seed";

dotenv.config({ path: [".env.local", ".env"] });

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log("Starting database seed...");

  try {
    await reset(db, users);
    await reset(db, locations);
    await reset(db, vehicles);

    const seededLocations = await db
      .insert(locations)
      .values([
        {
          name: "Phoenix Mall",
          address: "Lower Parel, Mumbai",
        },
        {
          name: "Central Plaza",
          address: "Andheri West, Mumbai",
        },
        {
          name: "City Center Mall",
          address: "Bandra East, Mumbai",
        },
        {
          name: "Cyber Hub",
          address: "Gurgaon, Delhi NCR",
        },
        {
          name: "Forum Mall",
          address: "Koramangala, Bangalore",
        },
      ])
      .returning();

    const hashedPassword = await bcrypt.hash("password123", 10);
    const seededUsers = await db
      .insert(users)
      .values([
        {
          name: "Admin",
          email: "admin@example.com",
          password: hashedPassword,
          phone: "+91 98765 43210",
          role: "admin",
        },
        {
          name: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
          phone: "+91 98765 43211",
          role: "user",
        },
        {
          name: "Valet Driver",
          email: "valet@example.com",
          password: hashedPassword,
          phone: "+91 98765 43212",
          role: "driver",
          drivingLicenseNumber: "MH1234567890",
        },
        {
          name: "Manager User",
          email: "manager@example.com",
          password: hashedPassword,
          phone: "+91 98765 43213",
          role: "manager",
        },
      ])
      .returning();

    const testUser = seededUsers[0];
    const seededVehicles = await db
      .insert(vehicles)
      .values([
        {
          brand: "Honda",
          model: "City",
          plate: "MH12AB1234",
          customerId: testUser.id,
        },
        {
          brand: "Hyundai",
          model: "Creta",
          plate: "MH14CD5678",
          customerId: testUser.id,
        },
      ])
      .returning();

    seededLocations.forEach((loc) => {
      console.log(`ID ${loc.id}: ${loc.name} - ${loc.address}`);
    });

    seededVehicles.forEach((veh) => {
      console.log(`${veh.brand} ${veh.model} (${veh.plate})`);
    });

    process.exit(0);
  } catch (error: any) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
