"use client";

import { useEffect, useState } from "react";
import { TParkingTicket } from "@/types";
import { useTicketFilter } from "../_hooks/use-ticket-filter";
import ParkingTicketCard from "../_components/parking-ticket-card";

type Stats = {
  active: number;
  retrieving: number;
  today: number;
  revenue: number;
};

export default function ManagerPage() {
  const [tickets, setTickets] = useState<TParkingTicket[]>([]);
  const [stats, setStats] = useState<Stats>({
    active: 0,
    retrieving: 0,
    today: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { filter, search, setFilter, setSearch, filteredTickets } =
    useTicketFilter(tickets);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manager-assignment", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch assignments");
      }

      setTickets(data.data || []);
      setStats(
        data.stats || { active: 0, retrieving: 0, today: 0, revenue: 0 },
      );
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-xl px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="mt-4 text-gray-600">Loading assignments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-xl px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchAssignments}
              className="bg-gray-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
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
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plate, customer or valet..."
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "ALL", label: `All (${tickets.length})` },
            { key: "PARKED", label: "Parked" },
            { key: "RETRIEVING", label: "Retrieving" },
            { key: "RETRIEVED", label: "Retrieved" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm border whitespace-nowrap transition-colors
                ${
                  filter === f.key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Assignments Found
            </h3>
            <p className="text-gray-600">
              {search
                ? "Try adjusting your search or filter"
                : "No assignments match the selected filter"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <ParkingTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}

        <button
          onClick={fetchAssignments}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Refresh Assignments
        </button>
      </div>
    </div>
  );
}
