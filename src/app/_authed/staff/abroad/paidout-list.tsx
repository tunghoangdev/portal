import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/paidout-list/page.client'))

export const Route = createFileRoute('/_authed/staff/abroad/paidout-list')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})

function StaffAbroadPaidoutListPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thanh toán thành viên</h1>
        <p className="text-muted-foreground">
          Đường dẫn: <code className="bg-muted px-1.1 rounded">/staff/abroad/paidout-list</code>
        </p>
      </div>
      
      <div className="min-h-[400px] flex items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-xl font-semibold tracking-tight">Trang đang phát triển</h3>
          <p className="text-sm text-muted-foreground">
            Bạn có thể bắt đầu chỉnh sửa file <code>src/routes/_authed/staff/abroad/paidout-list.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}
