interface ReportsPaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ReportsPagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: ReportsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button type="button" onClick={onPrevious} disabled={page === 1}>
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button type="button" onClick={onNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
