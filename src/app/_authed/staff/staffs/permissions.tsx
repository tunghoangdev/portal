import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/staff/staffs/permissions')({
  component: StaffStaffsPermissionsPage,
})

function StaffStaffsPermissionsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thiết lập quyền</h1>
        <p className="text-muted-foreground">
          Đường dẫn: <code className="bg-muted px-1.1 rounded">/staff/staffs/permissions</code>
        </p>
      </div>
      
      <div className="min-h-[400px] flex items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold tracking-tight">Trang đang phát triển</h3>
          <p className="text-sm text-muted-foreground">
            Bạn có thể bắt đầu chỉnh sửa file <code>src/routes/_authed/staff/staffs/permissions.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}
