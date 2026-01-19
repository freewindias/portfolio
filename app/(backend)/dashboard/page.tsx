import ContributionChart from "../_components/contribution-chart";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <ContributionChart />
    </div>
  )
}
