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
    <div className="h-screen max-w-160 mx-auto relative">
      <main className="h-full overflow-y-auto p-5 pb-16">{children}</main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white">
        <ul className="flex items-center justify-center h-14 gap-6 max-w-160 mx-auto border-t-2 border-gray-200">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <li
                key={route.name}
                className={
                  isActive ? "font-medium text-black" : "text-black/50"
                }
              >
                <a href={route.href}>{route.name}</a>
              </li>
            );
          })}
        </ul>
      </footer>
    </div>
  );
}
