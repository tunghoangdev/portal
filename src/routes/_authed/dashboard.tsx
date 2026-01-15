import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="p-2">
      <h3>Welcome Dashboard!!!</h3>
    </div>
  )
}
