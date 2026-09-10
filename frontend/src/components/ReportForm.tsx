import type { SyntheticEvent } from "react";
import type { Report } from "../features/reports/reports.types";

interface ReportFormProps {
  editingReport: Report | null;
  title: string;
  description: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  onLogout: () => void;
}
export function ReportForm({
  editingReport,
  title,
  description,
  isSubmitting,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onLogout,
}: ReportFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving..."
          : editingReport
            ? "Update Report"
            : "Create Report"}
      </button>

      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </form>
  );
}
