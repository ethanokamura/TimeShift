import NavMenu from "@/app/components/navbar/NavMenu";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavMenu />
      {children}
    </div>
  );
}
