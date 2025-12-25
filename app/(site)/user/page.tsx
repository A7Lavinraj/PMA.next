"use client";

import { useState } from "react";

import UserPageSettingsTab from "./_components/tabs/settings";
import UserPageTabs from "./_components/tabs";
import UserPageHomeTab from "./_components/tabs/home";
import UserPageHistoryTab from "./_components/tabs/history";
import UserPageTicketTab from "./_components/tabs/ticket";
import { TUserPageTab } from "@/types";

export function UserPageCurrentTab({
  userPageTab,
}: {
  userPageTab: TUserPageTab;
}) {
  switch (userPageTab) {
    case "HOME":
      return <UserPageHomeTab />;
    case "TICKET":
      return <UserPageTicketTab />;
    case "HISTORY":
      return <UserPageSettingsTab />;
    case "SETTINGS":
      return <UserPageHistoryTab />;
    default:
      return null;
  }
}

export default function UserPage() {
  const [activeUserPageTab, setActiveUserPageTab] =
    useState<TUserPageTab>("HOME");

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md px-4 py-5 pb-24">
        <UserPageCurrentTab userPageTab={activeUserPageTab} />
        <UserPageTabs
          activeTab={activeUserPageTab}
          setActiveTab={setActiveUserPageTab}
        />
      </div>
    </div>
  );
}
