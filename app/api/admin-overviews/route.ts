import { NextResponse } from "next/server";
import { db } from "@/database";

export async function GET() {
  try {
    const locations = await db.query.locations.findMany({
      with: {
        tickets: {
          with: {
            payment: true,
          },
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sitesWithStats = locations.map((location) => {
      const allTickets = location.tickets;
      const todayTickets = allTickets.filter((t) => {
        const createdDate = new Date(t.createdAt);
        return createdDate >= today;
      });

      const todayCollection = todayTickets.reduce((sum, ticket) => {
        return sum + (ticket.payment?.amount || 0);
      }, 0);

      const totalCollection = allTickets.reduce((sum, ticket) => {
        return sum + (ticket.payment?.amount || 0);
      }, 0);

      const activeParking = allTickets.filter(
        (t) => t.status === "parked",
      ).length;

      return {
        id: location.id.toString(),
        name: location.name,
        location: location.address,
        stats: {
          ticketsIssuedToday: todayTickets.length,
          todayCollection: todayCollection,
          totalTickets: allTickets.length,
          totalCollection: totalCollection.toLocaleString("en-IN"),
          activeParking: activeParking,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: sitesWithStats,
    });
  } catch (error: any) {
    console.error("Fetch sites error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sites" },
      { status: 500 },
    );
  }
}
