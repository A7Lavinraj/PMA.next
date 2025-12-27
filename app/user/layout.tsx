import Navbar from "./_components/navbar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Navbar>{children}</Navbar>;
}
