import { apiFetch } from '../../services/api';
import type {
  CreateReportData,
  Report,
  ReportsResponse,
} from "./reports.types";


export interface ReportsParams {
  search?: string;
  status?: "draft" | "published" | "archived";
  page?: number;
  limit?: number;
}

export async function getReports(
  params: ReportsParams = {},
): Promise<ReportsResponse> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.page) {
    query.set("page", params.page.toString());
  }

  if (params.limit) {
    query.set("limit", params.limit.toString());
  }

  const response = await apiFetch<ReportsResponse>(
    `/reports?${query.toString()}`,
  );

  return response;
}

export function createReport(
  token: string,
  data: CreateReportData,
): Promise<Report> {
  return apiFetch<Report>('/reports', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function updateReport(token: string, id: number, data: CreateReportData): Promise<Report> {
    return apiFetch<Report>(`/reports/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export function deleteReport(token: string, id: number): Promise<void> {
    return apiFetch<void>(`/reports/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}