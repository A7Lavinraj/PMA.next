import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { tickets, payments, assignments } from "@/database/schema";
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
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

async function getAvailableValet(): Promise<number | null> {
  const valets = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.role, "driver"),
  });

  if (valets.length === 0) {
    return null;
  }

  const valetWorkload = await Promise.all(
    valets.map(async (valet) => {
      const activeAssignments = await db.query.assignments.findMany({
        where: (assignments, { and, eq, isNull }) =>
          and(
            eq(assignments.valetId, valet.id),
            isNull(assignments.unassignedAt),
          ),
      });
      return {
        valetId: valet.id,
        activeCount: activeAssignments.length,
      };
    }),
  );

  valetWorkload.sort((a, b) => a.activeCount - b.activeCount);
  return valetWorkload[0].valetId;
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

    const valetId = await getAvailableValet();

    if (valetId) {
      await db.insert(assignments).values({
        ticketId: ticket.id,
        valetId: valetId,
      });
    } else {
      console.warn("No valets available to assign ticket:", ticket.id);
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    console.error("Ticket creation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
