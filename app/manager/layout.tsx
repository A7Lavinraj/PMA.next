import Navbar from "../_components/navbar";

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Navbar
      routes={[
        {
          name: "Home",
          href: "/manager/home",
        },
        {
          name: "Settings",
          href: "/manager/settings",
        },
      ]}
    >
      {children}
    </Navbar>
  );
}
