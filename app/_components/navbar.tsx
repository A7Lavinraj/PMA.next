"use client";

import { usePathname } from "next/navigation";

export default function Navbar({
  children,
  routes,
}: {
  children: React.ReactNode;
  routes: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-screen max-w-160 mx-auto">
      <main className="flex-1 p-5">{children}</main>
      <footer>
        <ul className="flex items-center justify-center h-10 gap-6">
          {routes.map((route) => {
            const classname =
              pathname === route.href ? "text-bold" : "text-black/50";
            return (
              <li key={route.name} className={classname}>
                <a href={route.href}>{route.name}</a>
              </li>
            );
          })}
        </ul>
      </footer>
    </div>
  );
}
