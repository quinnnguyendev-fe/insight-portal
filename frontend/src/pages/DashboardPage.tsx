import { useEffect, useState } from "react";
import type { DashboardStats } from "../features/dashboard/dashboard.types";
import { DashboardStats as DashboardStatsComponent } from "../features/dashboard/components/DashboardStats";
import type { Report } from "../features/reports/reports.types";
import {
  getRecentReports,
  getDashboardStats,
} from "../features/dashboard/dashboard.api";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        setError(null);
        const reponse = await getDashboardStats();
        setStats(reponse);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard stats",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setError(null);
        const [statsResponse, reportsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentReports(),
        ]);
        setStats(statsResponse);
        setRecentReports(reportsResponse);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <p>Loading dashboard stats...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!stats) {
    return <p>No dashboard data.</p>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <DashboardStatsComponent stats={stats} />
        <section>
          <h2>Recent Reports</h2>

          {recentReports.length === 0 ? (
            <p>No recent reports.</p>
          ) : (
            <ul>
              {recentReports.map((report) => (
                <li key={report.id}>
                  <Link to={`/reports/${report.id}`}>
                    <h3>{report.title}</h3>
                  </Link>

                  {report.description && <p>{report.description}</p>}

                  <p>Status: {report.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
