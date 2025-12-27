import Navbar from "../_components/navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Navbar
      routes={[
        {
          name: "Overviews",
          href: "/admin/overviews",
        },
        {
          name: "Approvals",
          href: "/admin/approvals",
        },
        {
          name: "Settings",
          href: "/admin/settings",
        },
      ]}
    >
      {children}
    </Navbar>
  );
}
