import { useEffect, useState } from "react";
import { getReports } from "../reports.api";
import type { Report } from "../reports.types";

interface UseReportsParams {
  search: string;
  status?: "draft" | "published" | "archived" | undefined;
  page: number;
  limit?: number;
}

export function useReports({
  search,
  status,
  page,
  limit = 5,
}: UseReportsParams) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchReports() {
      try {
        setError(null);

        const response = await getReports({ search, status, page, limit });
        setReports(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load reports");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [search, status, page, limit]);
  return {
    reports,
    setReports,
    isLoading,
    error,
    setError,
    totalPages,
  };
}
