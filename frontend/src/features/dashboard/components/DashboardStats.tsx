import type { DashboardStats as DashboardStatsData } from "../dashboard.types";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div>
      <div>
        <h2>Total Reports</h2>
        <p>{stats.total}</p>
      </div>

      <div>
        <h2>Draft</h2>
        <p>{stats.draft}</p>
      </div>

      <div>
        <h2>Published</h2>
        <p>{stats.published}</p>
      </div>

      <div>
        <h2>Archived</h2>
        <p>{stats.archived}</p>
      </div>
    </div>
  );
}