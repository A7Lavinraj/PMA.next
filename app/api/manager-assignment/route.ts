import { NextResponse } from "next/server";
import { db } from "@/database";

export async function GET() {
  try {
    const allAssignments = await db.query.assignments.findMany({
      with: {
        ticket: {
          with: {
            vehicle: true,
            customer: true,
            location: true,
            payment: true,
          },
        },
        valet: true,
      },
      orderBy: (assignments, { desc }) => [desc(assignments.assignedAt)],
    });

    const formattedAssignments = allAssignments.map((assignment) => {
      const ticket = assignment.ticket;

      const entryTime = new Date(ticket.entryTime);
      const exitTime = ticket.exitTime ? new Date(ticket.exitTime) : new Date();
      const diffMs = exitTime.getTime() - entryTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const duration = `${hours}h ${minutes}m`;

      const formattedEntryTime = entryTime.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: `PKG-${ticket.id}`,
        vehicle: `${ticket.vehicle.brand} ${ticket.vehicle.model}`,
        plate: ticket.vehicle.plate,
        customer: ticket.customer.name,
        valet: assignment.valet.name,
        valetId: `V${String(assignment.valet.id).padStart(3, "0")}`,
        location: ticket.location.name,
        area: ticket.location.address,
        entryTime: formattedEntryTime,
        duration: duration,
        payment: ticket.payment?.amount || 0,
        status: ticket.status.toUpperCase(),
        paymentStatus: ticket.payment?.status,
        assignedAt: assignment.assignedAt,
        unassignedAt: assignment.unassignedAt,
      };
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAssignments = formattedAssignments.filter((a) => {
      const assignedDate = new Date(a.assignedAt);
      return assignedDate >= today;
    });

    const stats = {
      active: formattedAssignments.filter((a) => a.status === "PARKED").length,
      retrieving: formattedAssignments.filter((a) => a.status === "RETRIEVING")
        .length,
      today: todayAssignments.length,
      revenue: todayAssignments.reduce((sum, a) => sum + (a.payment || 0), 0),
    };

    return NextResponse.json({
      success: true,
      data: formattedAssignments,
      stats: stats,
    });
  } catch (error: any) {
    console.error("Fetch assignments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}
