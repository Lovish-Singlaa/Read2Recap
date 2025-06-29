import HeaderSection from "@/components/HeaderSection";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />
      <main>
        {children}
      </main>
    </div>
  );
}
