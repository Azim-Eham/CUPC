import { PublicNavbar } from "@/components/public-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
