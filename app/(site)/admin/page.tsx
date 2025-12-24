"use client";

import { useState } from "react";

type TDashboardTab = "OVERVIEW" | "APPROVALS";

type SiteStats = {
  ticketsIssuedToday: number;
  todayCollection: number;
  totalTickets: number;
  totalCollection: number | string;
  activeParking: number;
};

type Site = {
  id: string;
  name: string;
  location: string;
  stats: SiteStats;
};

const SITES: Site[] = [
  {
    id: "phoenix",
    name: "Pheonix Mall - Lower Parel",
    location: "Lower Parel, Mumbai",
    stats: {
      ticketsIssuedToday: 87,
      todayCollection: 13050,
      totalTickets: 1247,
      totalCollection: "186,450",
      activeParking: 45,
    },
  },
  {
    id: "inorbit",
    name: "Inorbit Mall - Malad",
    location: "Malad, Mumbai",
    stats: {
      ticketsIssuedToday: 64,
      todayCollection: 9840,
      totalTickets: 980,
      totalCollection: "142,300",
      activeParking: 32,
    },
  },
  {
    id: "infiniti",
    name: "Infiniti Mall - Andheri",
    location: "Andheri, Mumbai",
    stats: {
      ticketsIssuedToday: 102,
      todayCollection: 15750,
      totalTickets: 1630,
      totalCollection: "214,900",
      activeParking: 58,
    },
  },
];

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-xl border-2 transition-colors duration-200 ${
        isActive
          ? "bg-[#8200DB] text-white border-[#8200DB]"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

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

function OverviewTab() {
  const [selectedSiteId, setSelectedSiteId] = useState(SITES[0].id);
  const selectedSite = SITES.find((s) => s.id === selectedSiteId)!;

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <p>Select Site</p>
        <select
          className="border-2 border-[#E5E7EB] p-3 rounded-xl w-full bg-white"
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
        >
          {SITES.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p>Today's Performance</p>
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

      <div className="bg-linear-150 from-[#F3E8FE] to-[#FCE7F3] w-full p-5 rounded-xl border-2 border-[#E9D4FF] flex flex-col gap-1">
        <p>{selectedSite.name}</p>
        <span className="text-neutral-600">{selectedSite.location}</span>
      </div>
    </>
  );
}

function ApprovalsTab() {
  return (
    <div className="w-full flex flex-col gap-40">
      <p>Pending Driver Approvals</p>
      <div className="flex flex-col items-center gap-2">
        <h3>All Caught Up!</h3>
        <p className="text-gray-700 text-sm">
          No pending driver approvals at the moment
        </p>
      </div>
    </div>
  );
}

function CurrentTab({ tab }: { tab: TDashboardTab }) {
  if (tab === "OVERVIEW") return <OverviewTab />;
  if (tab === "APPROVALS") return <ApprovalsTab />;
  return null;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<TDashboardTab>("OVERVIEW");

  return (
    <div className="w-screen bg-linear-180 from-[#FBF3FB] flex items-center justify-center">
      <div className="w-full max-w-160 mx-4 flex flex-col items-center p-4 gap-6 text-lg tracking-wide">
        <div className="flex gap-4 w-full">
          <TabButton
            label="Overview"
            isActive={tab === "OVERVIEW"}
            onClick={() => setTab("OVERVIEW")}
          />
          <TabButton
            label="Approvals"
            isActive={tab === "APPROVALS"}
            onClick={() => setTab("APPROVALS")}
          />
        </div>

        <CurrentTab tab={tab} />
      </div>
    </div>
  );
}
