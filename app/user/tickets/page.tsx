"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  status: "parked" | "retrieving" | "retrieved";
  entryTime: string;
  exitTime: string | null;
  createdAt: string;
  location: {
    name: string;
    address: string;
  };
  vehicle: {
    brand: string;
    model: string;
    plate: string;
  };
  payment?: {
    amount: number;
    status: "pending" | "paid" | "failed";
  };
};

const STATUS_STYLES = {
  parked: {
    card: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  retrieving: {
    card: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-700",
  },
  retrieved: {
    card: "border-green-300",
    badge: "bg-green-100 text-green-700",
  },
};

const PAYMENT_STYLES = {
  pending: "bg-yellow-600/10 text-yellow-600",
  paid: "bg-green-600/10 text-green-600",
  failed: "bg-red-600/10 text-red-600",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ticket")
      .then((res) => res.json())
      .then((res) => setTickets(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading tickets...</div>;
  }

  if (!tickets.length) {
    return <div className="p-6 text-gray-500">No tickets found</div>;
  }

  console.log(tickets);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-gray-800">My Parking Tickets</h2>

      {tickets.map((ticket) => {
        const statusStyle = STATUS_STYLES[ticket.status];

        return (
          <div
            key={ticket.id}
            className={`rounded-2xl p-4 space-y-3 border ${statusStyle.card}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{ticket.location.name}</p>
                <p className="text-sm text-gray-500">
                  {ticket.location.address}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyle.badge}`}
              >
                {ticket.status}
              </span>
            </div>

            <div className="text-sm">
              <p>
                <span className="text-gray-500">Vehicle:</span>{" "}
                {ticket.vehicle.brand} {ticket.vehicle.model} (
                {ticket.vehicle.plate})
              </p>
              <p>
                <span className="text-gray-500">Entry:</span>{" "}
                {new Date(ticket.entryTime).toLocaleString()}
              </p>
              {ticket.exitTime && (
                <p>
                  <span className="text-gray-500">Exit:</span>{" "}
                  {new Date(ticket.exitTime).toLocaleString()}
                </p>
              )}
            </div>

            {ticket.payment && (
              <div className="flex justify-between text-sm">
                <span
                  className={`capitalize px-2 py-1 rounded-lg ${PAYMENT_STYLES[ticket.payment.status]}`}
                >
                  Payment {ticket.payment.status}
                </span>
                <span className="font-medium">₹{ticket.payment.amount}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
