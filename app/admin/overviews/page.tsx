"use client";

import { TSite } from "@/types";
import { useState, useEffect } from "react";

function PerformanceCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="w-full border-2 border-[#E9D4FF] rounded-xl p-5 bg-white">
      <span>{label}</span>
      <pre className="text-[#8200DB]">{value}</pre>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between p-5 border-2 border-[#E5E7EB] rounded-xl bg-white">
      <span>{label}</span>
      <pre>{value}</pre>
    </div>
  );
}

export default function OverviewsPage() {
  const [sites, setSites] = useState<TSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-overviews", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch sites");
      }

      setSites(data.data || []);
      if (data.data.length > 0) {
        setSelectedSiteId(data.data[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load sites");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Loading sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchSites}
          className="bg-[#8200DB] text-white px-6 py-2 rounded-xl font-medium hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Sites Found
        </h3>
        <p className="text-gray-600">Add locations to see statistics</p>
      </div>
    );
  }

  const selectedSite = sites.find((s) => s.id === selectedSiteId)!;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p>Select Site</p>
        <select
          className="border-2 border-[#E5E7EB] p-3 rounded-xl w-full bg-white"
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p>Today&apos;s Performance</p>
        <div className="flex gap-4">
          <PerformanceCard
            label="Tickets Issued"
            value={selectedSite.stats.ticketsIssuedToday}
          />
          <PerformanceCard
            label="Collection"
            value={selectedSite.stats.todayCollection}
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p>Overall Statistics</p>
        <StatRow
          label="Total Tickets"
          value={selectedSite.stats.totalTickets}
        />
        <StatRow
          label="Total Collection"
          value={selectedSite.stats.totalCollection}
        />
        <StatRow
          label="Active Parking"
          value={selectedSite.stats.activeParking}
        />
      </div>

      <div className="w-full p-5 rounded-xl border-2 border-[#E9D4FF] flex flex-col gap-1">
        <p>{selectedSite.name}</p>
        <span className="text-neutral-600">{selectedSite.location}</span>
      </div>

      <button
        onClick={fetchSites}
        className="w-full py-3 rounded-xl border-2 border-[#E5E7EB] bg-white hover:bg-gray-50 transition-colors"
      >
        Refresh Data
      </button>
    </div>
  );
}
