import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-slate-100 p-4 border-r">
        <h2 className="font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="text-blue-600 [&.active]:font-bold">
            Trang chủ DB
          </Link>
          <Link
            to="/dashboard/users"
            className="text-blue-600 [&.active]:font-bold"
          >
            Quản lý User
          </Link>
        </nav>
      </aside>

      {/* Nội dung chính bên phải */}
      <main className="flex-1 p-8">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">Hệ thống quản trị</h1>
        </header>

        {/* Đây là nơi các trang con (index, users) sẽ hiển thị */}
        <Outlet />
      </main>
    </div>
  );
}
