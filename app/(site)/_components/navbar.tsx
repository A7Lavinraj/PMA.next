"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { sessionClaims } = useAuth();
  const userRole = sessionClaims?.metadata?.role;

  const navLinks = [
    { name: "Home", href: "/user" },
    { name: "Ticket", href: "/user/ticket" },
    { name: "History", href: "/user/history" },
    { name: "Settings", href: "/user/settings" },
  ];

  return (
    <nav className="bg-secondary shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16 gap-8">
          {userRole === "user" &&
            navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text hover:text-blue-color px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
