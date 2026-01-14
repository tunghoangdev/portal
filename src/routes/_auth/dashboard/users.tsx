import { createFileRoute } from "@tanstack/react-router";

// Giả lập hàm lấy dữ liệu từ API
async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Không thể lấy dữ liệu");
  return res.json();
}

export const Route = createFileRoute("/_auth/dashboard/users")({
  // Loader: Fetch dữ liệu trước khi vào trang
  loader: () => fetchUsers(),
  component: UsersPage,
});

function UsersPage() {
  // Lấy dữ liệu đã được fetch từ loader với Type-safe hoàn toàn
  const users = Route.useLoaderData();

  return (
    <div>
      <h3 className="text-xl mb-4">Danh sách người dùng</h3>
      <ul className="grid gap-4">
        {users.map((user: any) => (
          <li key={user.id} className="p-4 border rounded shadow-sm bg-white">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
