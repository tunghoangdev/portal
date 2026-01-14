import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: () => (
    <div className="italic">
      Chào mừng bạn quay lại! Hãy chọn một mục ở Sidebar.
    </div>
  ),
});
