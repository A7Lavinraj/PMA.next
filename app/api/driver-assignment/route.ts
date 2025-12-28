import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { jwtVerify } from "jose";
import { assignments } from "@/database/schema";
import { eq } from "drizzle-orm";

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
  const driverId = await getUserId(req);

  if (!driverId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const driverAssignments = await db.query.assignments.findMany({
      where: (assignments, { and, eq, isNull }) =>
        and(
          eq(assignments.valetId, driverId),
          isNull(assignments.unassignedAt),
        ),
      with: {
        ticket: {
          with: {
            vehicle: true,
            customer: true,
            location: true,
          },
        },
      },
      orderBy: (assignments, { desc }) => [desc(assignments.assignedAt)],
    });

    const currentAssignment = driverAssignments.find(
      (a) => a.ticket.status === "parked",
    );

    const newAssignment = driverAssignments.find(
      (a) => a.ticket.status === "retrieving",
    );

    const formattedCurrent = currentAssignment
      ? {
          id: currentAssignment.id,
          vehicleName: `${currentAssignment.ticket.vehicle.brand} ${currentAssignment.ticket.vehicle.model}`,
          vehicleNumber: currentAssignment.ticket.vehicle.plate,
          status: "PARK" as const,
          customer: currentAssignment.ticket.customer.name,
          parkAt: "Level 2 - B34",
          location: {
            name: currentAssignment.ticket.location.name,
            area: currentAssignment.ticket.location.address,
          },
          assignedAt: new Date(currentAssignment.assignedAt).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            },
          ),
        }
      : null;

    const formattedNew = newAssignment
      ? {
          vehicleName: `${newAssignment.ticket.vehicle.brand} ${newAssignment.ticket.vehicle.model}`,
          vehicleNumber: newAssignment.ticket.vehicle.plate,
          status: "RETRIEVE" as const,
        }
      : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allDriverAssignments = await db.query.assignments.findMany({
      where: (assignments, { eq }) => eq(assignments.valetId, driverId),
      with: {
        ticket: true,
      },
    });

    const todayAssignments = allDriverAssignments.filter((a) => {
      const assignedDate = new Date(a.assignedAt);
      return assignedDate >= today;
    });

    const stats = {
      today: todayAssignments.length,
      parked: todayAssignments.filter((a) => a.ticket.status === "retrieved")
        .length,
      retrieved: todayAssignments.filter((a) => a.ticket.status === "retrieved")
        .length,
    };

    return NextResponse.json({
      success: true,
      data: {
        newAssignment: formattedNew,
        currentAssignment: formattedCurrent,
        stats: stats,
      },
    });
  } catch (error) {
    console.error("Fetch driver assignments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const driverId = await getUserId(req);

  if (!driverId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { assignmentId } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID required" },
        { status: 400 },
      );
    }

    const [assignment] = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, assignmentId));

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    if (assignment.valetId !== driverId) {
      return NextResponse.json(
        { error: "Not your assignment" },
        { status: 403 },
      );
    }

    await db
      .update(assignments)
      .set({ unassignedAt: new Date() })
      .where(eq(assignments.id, assignmentId));

    return NextResponse.json({
      success: true,
      message: "Assignment completed",
    });
  } catch (error) {
    console.error("Complete assignment error:", error);
    return NextResponse.json(
      { error: "Failed to complete assignment" },
      { status: 500 },
    );
  }
}
