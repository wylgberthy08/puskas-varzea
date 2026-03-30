import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#0A0E1A] overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main content area scrolls independently */}
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
