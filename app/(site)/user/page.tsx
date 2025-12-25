"use client";

import { useState } from "react";

type ParkingItem = {
  mall: string;
  location: string;
  amount: number;
  date: string;
  plate: string;
  duration: string;
};

const parkingHistory: ParkingItem[] = [
  {
    mall: "Phoenix Mall",
    location: "Lower Parel, Mumbai",
    amount: 180,
    date: "8 Dec 2025",
    plate: "MH 12 AB 1234",
    duration: "4h 15m",
  },
  {
    mall: "Central Plaza",
    location: "Andheri West, Mumbai",
    amount: 120,
    date: "5 Dec 2025",
    plate: "MH 14 CD 5678",
    duration: "2h 50m",
  },
  {
    mall: "City Center Mall",
    location: "Bandra East, Mumbai",
    amount: 200,
    date: "3 Dec 2025",
    plate: "MH 12 AB 1234",
    duration: "4h 30m",
  },
];

export default function UserPage() {
  const [activeTab, setActiveTab] = useState<
    "home" | "ticket" | "history" | "settings"
  >("home");

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md px-4 py-5 pb-24">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "ticket" && <Placeholder title="Ticket" />}

        <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

function HomeTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">Scan to Park</p>
          <p className="text-sm text-gray-600">
            Scan QR code at parking entrance
          </p>
        </div>
        <span className="text-gray-400 text-xl">›</span>
      </div>

      <RecentParking />
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-medium text-gray-800">Recent Parking</h2>
      <RecentParking />
    </div>
  );
}

function RecentParking() {
  return (
    <div className="flex flex-col gap-4">
      {parkingHistory.map((item, index) => (
        <ParkingHistoryCard key={index} {...item} />
      ))}
    </div>
  );
}

function ParkingHistoryCard({
  mall,
  location,
  amount,
  date,
  plate,
  duration,
}: ParkingItem) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{mall}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">₹{amount}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            completed
          </span>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{date}</span>
        <span>{plate}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-sm text-gray-600">+91 98765 43210</p>
        </div>
        <span className="text-indigo-500 text-lg">Edit</span>
      </div>

      <SettingsItem title="Manage Vehicles" subtitle="2 vehicles saved" />
      <SettingsItem title="Transaction History" subtitle="View all payments" />
      <SettingsItem title="Help & Support" subtitle="Get assistance" />
      <SettingsItem title="FAQ" subtitle="Frequently Asked Questions" />
    </div>
  );
}

function SettingsItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <span className="text-gray-400 text-xl">›</span>
    </div>
  );
}

function BottomTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-6 py-3 flex justify-between text-sm">
        {["home", "ticket", "history", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-[60vh] flex items-center justify-center text-gray-400">
      {title} tab coming soon
    </div>
  );
}
