export type ReportStatus = "draft" | "published" | "archived";

export interface Report {
    id: number;
    title: string;
    description: string | null;
    status: ReportStatus;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReportData {
    title: string;
    description?: string;
}