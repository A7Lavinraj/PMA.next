"use client";

import { usePathname } from "next/navigation";

const subRoutes = [
  {
    name: "Home",
    href: "/user/home",
  },
  {
    name: "Tickets",
    href: "/user/tickets",
  },
  {
    name: "History",
    href: "/user/history",
  },
  {
    name: "Settings",
    href: "/user/settings",
  },
];

export default function Navbar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-screen max-w-160 mx-auto">
      <main className="flex-1 p-5">{children}</main>
      <footer>
        <ul className="flex items-center justify-center h-10 gap-6">
          {subRoutes.map((subRoute) => {
            const classname =
              pathname === subRoute.href ? "text-bold" : "text-black/50";
            return (
              <li key={subRoute.name} className={classname}>
                <a href={subRoute.href}>{subRoute.name}</a>
              </li>
            );
          })}
        </ul>
      </footer>
    </div>
  );
}
