"use client";

import { TDashboardTab } from "@/types";

import { useState } from "react";
import AdminPageOverviewsTab from "./_components/tabs/overviews";
import AdminPageApprovalsTab from "./_components/tabs/approvals";

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

function AdminPageCurrentTab({ activeTab }: { activeTab: TDashboardTab }) {
  switch (activeTab) {
    case "OVERVIEW":
      return <AdminPageOverviewsTab />;
    case "APPROVALS":
      return <AdminPageApprovalsTab />;
    default:
      return null;
  }
}

export default function AdminPage() {
  const [adminPageActiveTab, setAdminPageActiveTab] =
    useState<TDashboardTab>("OVERVIEW");

  return (
    <div className="w-screen bg-linear-180 from-[#FBF3FB] flex items-center justify-center">
      <div className="w-full max-w-160 mx-4 flex flex-col items-center p-4 gap-6 text-lg tracking-wide">
        <div className="flex gap-4 w-full">
          <TabButton
            label="Overview"
            isActive={adminPageActiveTab === "OVERVIEW"}
            onClick={() => setAdminPageActiveTab("OVERVIEW")}
          />
          <TabButton
            label="Approvals"
            isActive={adminPageActiveTab === "APPROVALS"}
            onClick={() => setAdminPageActiveTab("APPROVALS")}
          />
        </div>

        <AdminPageCurrentTab activeTab={adminPageActiveTab} />
      </div>
    </div>
  );
}
