"use client";

import { useEffect, useState } from "react";
import { TParkingTicket, TTicketStatus } from "@/types";
import { useTicketFilter } from "../_hooks/use-ticket-filter";
import ParkingTicketCard from "../_components/parking-ticket-card";

type Stats = {
  active: number;
  retrieving: number;
  today: number;
  revenue: number;
};

type TicketFilter = TTicketStatus | "ALL";

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
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [creatingDriver, setCreatingDriver] = useState(false);
  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    drivingLicenseNumber: "",
    role: "driver" as const,
  });

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
        data.stats || { active: 0, retrieving: 0, today: 0, revenue: 0 }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load assignments");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDriver(e: React.FormEvent) {
    e.preventDefault();
    setCreatingDriver(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverForm),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create driver");
      }

      setShowDriverForm(false);
      setDriverForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        drivingLicenseNumber: "",
        role: "driver",
      });
      alert("Driver created successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create driver");
    } finally {
      setCreatingDriver(false);
    }
  }

  const FILTERS: { key: TicketFilter; label: string }[] = [
    { key: "ALL", label: `All (${tickets.length})` },
    { key: "PARKED", label: "Parked" },
    { key: "RETRIEVING", label: "Retrieving" },
    { key: "RETRIEVED", label: "Retrieved" },
  ];

  const visibleTickets = filteredTickets();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-xl px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <p className="mt-4 text-gray-600">Loading assignments...</p>
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <button
            onClick={() => setShowDriverForm(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700"
          >
            + Add Driver
          </button>
        </div>

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
          {FILTERS.map((f) => (
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

        {visibleTickets.length === 0 ? (
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
            {visibleTickets.map((ticket) => (
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

        {showDriverForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Add New Driver</h3>
                <button
                  onClick={() => setShowDriverForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDriver} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={driverForm.name}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={driverForm.email}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="driver@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={driverForm.password}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, password: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverForm.phone}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={driverForm.drivingLicenseNumber}
                    onChange={(e) =>
                      setDriverForm({
                        ...driverForm,
                        drivingLicenseNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="MH1234567890"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDriverForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                    disabled={creatingDriver}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingDriver}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 disabled:opacity-60"
                  >
                    {creatingDriver ? "Creating..." : "Create Driver"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
