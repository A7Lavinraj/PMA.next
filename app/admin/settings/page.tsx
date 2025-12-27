"use client";

import { FormEvent } from "react";

export default function UserPageSettingsTab() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch("/api/auth/signout", { method: "POST" });

    window.location.replace("/");
  }
  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className="border border-rose-500/20 p-4 rounded-lg text-rose-500 bg-rose-500/10 cursor-pointer w-full"
      >
        Sign Out
      </button>
    </form>
  );
}
