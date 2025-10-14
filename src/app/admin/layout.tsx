import { MainSideBar } from "./_components/main-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      <MainSideBar />
      <main className="flex-1 p-6 md:ml-0">{children}</main>
    </div>
  );
}
