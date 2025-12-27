import Navbar from "../_components/navbar";

export default function DriverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Navbar
      routes={[
        {
          name: "Home",
          href: "/driver/home",
        },
        {
          name: "Settings",
          href: "/driver/settings",
        },
      ]}
    >
      {children}
    </Navbar>
  );
}
