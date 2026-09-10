import { useEffect, useState, type SyntheticEvent } from "react";
import { useAuth } from "../features/auth/auth.context";
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} from "../features/reports/reports.api";
import type { Report } from "../features/reports/reports.types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReportsToolbar } from "../components/ReportsToolbar";
import { ReportsPagination } from "../components/ReportsPagination";
import { ReportForm } from "../components/ReportForm";

export function ReportsPage() {
  const { token, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const statusParam = searchParams.get("status");
  const status =
    statusParam === "draft" ||
    statusParam === "published" ||
    statusParam === "archived"
      ? statusParam
      : undefined;

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReports() {
      if (!token) return;

      try {
        // setIsLoading(true);
        setError(null);

        const response = await getReports({ search, status, page, limit: 5 });
        setReports(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load reports");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [token, search, status, page]);

  if (isLoading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  async function handleSubmitReport(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !title.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      if (editingReport) {
        const updatedReport = await updateReport(token, editingReport.id, data);

        setReports((currentReports) =>
          currentReports.map((report) =>
            report.id === updatedReport.id ? updatedReport : report,
          ),
        );

        setEditingReport(null);
      } else {
        const newReport = await createReport(token, data);
        setReports((currentReports) => [newReport, ...currentReports]);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create report");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleEdit(report: Report) {
    setEditingReport(report);
    setTitle(report.title);
    setDescription(report.description || "");
  }

  function handleClearFilters() {
    setSearchParams({});
  }

  async function handleDeleteReport(id: number) {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmed) return;

    try {
      setDeleteId(id);
      setError(null);
      await deleteReport(token, id);
      setReports((currentReports) =>
        currentReports.filter((report) => report.id !== id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete report");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <>
      <h1>Reports Page</h1>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <h2>{report.title}</h2>
              {report.description && <p>{report.description}</p>}
              <p>Status: {report.status}</p>
              <button type="button" onClick={() => handleEdit(report)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReport(report.id)}
                disabled={deleteId === report.id}
              >
                {deleteId === report.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <ReportsToolbar
        search={search}
        status={status}
        onSearchChange={(value) =>
          setSearchParams((params) => {
            if (value) {
              params.set("search", value);
            } else {
              params.delete("search");
            }

            params.set("page", "1");

            return params;
          })
        }
        onStatusChange={(value) =>
          setSearchParams((params) => {
            if (value) {
              params.set("status", value);
            } else {
              params.delete("status");
            }

            params.set("page", "1");

            return params;
          })
        }
        onClear={handleClearFilters}
      />

      <ReportsPagination
        page={page}
        totalPages={totalPages}
        onPrevious={() => {
          setSearchParams((params) => {
            params.set("page", String(Math.max(page - 1, 1)));
            return params;
          });
        }}
        onNext={() => {
          setSearchParams((params) => {
            params.set("page", String(Math.min(page + 1, totalPages)));
            return params;
          });
        }}
      />

      <ReportForm
        editingReport={editingReport}
        title={title}
        description={description}
        isSubmitting={isSubmitting}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSubmit={handleSubmitReport}
        onLogout={handleLogout}
      />
    </>
  );
}
