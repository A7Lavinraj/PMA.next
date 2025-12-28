import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { vehicles } from "@/database/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

async function getUserId(req: NextRequest): Promise<number | null> {
  const token = req.cookies.get("__token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );
    return Number(payload.sub);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userVehicles = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.customerId, userId));

    return NextResponse.json({ success: true, data: userVehicles });
  } catch (err) {
    console.error("Fetch vehicles error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    brand: string;
    model: string;
    plate: string;
  };

  if (!body.brand || !body.model || !body.plate) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  try {
    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        brand: body.brand,
        model: body.model,
        plate: body.plate,
        customerId: userId,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newVehicle },
      { status: 201 },
    );
  } catch (err) {
    console.error("Create vehicle error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
