import { apiFetch } from "../../services/api";
import type { DashboardStats } from "./dashboard.types";
import type { Report } from "../reports/reports.types";
import { getReports } from "../reports/reports.api";

export function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/reports/stats");
}

export function getRecentReports(): Promise<Report[]> {
  return getReports({ page: 1, limit: 5 }).then((response) => response.data);
}
