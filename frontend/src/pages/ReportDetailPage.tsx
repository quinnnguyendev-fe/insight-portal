import { useParams } from "react-router-dom";

export function ReportDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h1>Report Detail Page</h1>
            <p>Report ID: {id}</p>
        </>
    )
}