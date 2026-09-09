import { apiFetch } from '../../services/api';
import type {
  CreateReportData,
  Report,
} from './reports.types';

export function getReports(token: string): Promise<Report[]> {
  return apiFetch<Report[]>('/reports', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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