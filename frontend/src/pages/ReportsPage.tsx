import { useEffect, useState, type SyntheticEvent } from "react";
import { useAuth } from "../features/auth/auth.context";
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} from "../features/reports/reports.api";
import type { Report } from "../features/reports/reports.types";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

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

      <div className="search-container">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;

            setSearchParams((params) => {
              const newParams = new URLSearchParams(params);
              if (value) {
                newParams.set("search", value);
              } else {
                newParams.delete("search");
              }
              newParams.set("page", "1"); // Reset to first page on search change
              return newParams;
            });
          }}
        />

        <select
          value={status ?? ""}
          onChange={(e) => {
            const value = e.target.value as
              | "draft"
              | "published"
              | "archived"
              | "";
            setSearchParams((params) => {
              const newParams = new URLSearchParams(params);
              if (value) {
                newParams.set("status", value);
              } else {
                newParams.delete("status");
              }
              newParams.set("page", "1");
              return newParams;
            });
          }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
          disabled={!search && !status}
        >
          Clear
        </button>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() =>
              setSearchParams((params) => {
                const newParams = new URLSearchParams(params);
                newParams.set("page", String(Math.max(page - 1, 1)));
                return newParams;
              })
            }
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setSearchParams((params) => {
                const newParams = new URLSearchParams(params);
                newParams.set("page", String(Math.min(page + 1, totalPages)));
                return newParams;
              })
            }
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitReport}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : editingReport
              ? "Update Report"
              : "Create Report"}
        </button>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </form>
    </>
  );
}
