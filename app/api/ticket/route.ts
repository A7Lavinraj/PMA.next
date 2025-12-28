import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { tickets, payments } from "@/database/schema";
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

  console.log(userId);
  try {
    const userTickets = await db.query.tickets.findMany({
      where: (t, { eq }) => eq(t.customerId, userId),
      with: {
        location: true,
        vehicle: true,
        payment: true,
        assignments: {
          with: {
            valet: {
              columns: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });
    console.log(await db.query.tickets.findMany());
    console.log(userTickets);

    return NextResponse.json({
      success: true,
      data: userTickets,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const customerId = await getUserId(req);

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { locationId, vehicleId, amount } = body;

    if (!locationId || !vehicleId || !amount) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 },
      );
    }

    const [ticket] = await db
      .insert(tickets)
      .values({
        status: "parked",
        customerId,
        vehicleId,
        locationId,
      })
      .returning();

    await db.insert(payments).values({
      ticketId: ticket.id,
      amount,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Ticket creation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
