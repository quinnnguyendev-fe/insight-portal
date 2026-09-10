
interface ReportsToolbarProps {
  search: string;
  status: "draft" | "published" | "archived" | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export function ReportsToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: ReportsToolbarProps) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search reports..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <select
        value={status ?? ""}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>

      <button
        type="button"
        onClick={onClear}
        disabled={!search && !status}
      >
        Clear
      </button>
    </div>
  );
}
