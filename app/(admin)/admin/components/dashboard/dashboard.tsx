import { KPICard } from "./KPICard"
import { ElectionTable } from "./ElectionTable"

export default function Dashboard() {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard />
      </div>
        <ElectionTable />
    </div>
  )
}