"use client";

import { TParkingTicket } from "@/types";
import { useTicketFilter } from "./_hooks/use-ticket-filter";
import ParkingTicketCard from "./_components/parking-ticket-card";

const TICKETS: TParkingTicket[] = [
  {
    id: "PKG-1234",
    vehicle: "Honda City",
    plate: "MH02AB1234",
    customer: "Amit Sharma",
    valet: "Rajesh Kumar",
    valetId: "V001",
    location: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
    entryTime: "25 Dec, 08:43 am",
    duration: "2h 0m",
    payment: 150,
    status: "PARKED",
  },
  {
    id: "PKG-1235",
    vehicle: "Maruti Swift",
    plate: "MH12CD5678",
    customer: "Neha Verma",
    valet: "Aakash Singh",
    valetId: "V004",
    location: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
    entryTime: "25 Dec, 09:10 am",
    duration: "1h 20m",
    payment: 120,
    status: "RETRIEVING",
  },
  {
    id: "PKG-1236",
    vehicle: "Hyundai i20",
    plate: "MH01EF4455",
    customer: "Rohit Mehta",
    valet: "Vikas Patil",
    valetId: "V007",
    location: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
    entryTime: "25 Dec, 07:30 am",
    duration: "3h 15m",
    payment: 200,
    status: "PARKED",
  },
  {
    id: "PKG-1237",
    vehicle: "Toyota Innova",
    plate: "MH04JK7788",
    customer: "Pooja Nair",
    valet: "Suresh Yadav",
    valetId: "V009",
    location: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
    entryTime: "25 Dec, 06:50 am",
    duration: "4h 10m",
    payment: 250,
    status: "RETRIEVED",
  },
  {
    id: "PKG-1238",
    vehicle: "Kia Seltos",
    plate: "MH14LM9911",
    customer: "Ankit Jain",
    valet: "Rajesh Kumar",
    valetId: "V001",
    location: "Phoenix Mall",
    area: "Lower Parel, Mumbai",
    entryTime: "25 Dec, 09:45 am",
    duration: "45m",
    payment: 105,
    status: "PARKED",
  },
];

export default function ManagerPage() {
  const { stats, filter, search, setFilter, setSearch, filteredTickets } =
    useTicketFilter(TICKETS);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-xl px-4 py-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Active Cars", value: stats.active },
            { label: "Retrieving", value: stats.retrieving },
            { label: "Total Today", value: stats.today },
            { label: "Revenue", value: `₹${stats.revenue}` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-2xl p-4"
            >
              <p className="text-gray-500 text-sm">{s.label}</p>
              <pre className="text-2xl font-semibold">{s.value}</pre>
            </div>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plate, customer or valet..."
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm"
        />

        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "ALL", label: `All (${TICKETS.length})` },
            { key: "PARKED", label: "Parked" },
            { key: "RETRIEVING", label: "Retrieving" },
            { key: "RETRIEVED", label: "Retrieved" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 rounded-xl text-sm border
                ${
                  filter === f.key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <ParkingTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}
