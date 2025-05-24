import { useApi } from "./use-api";

interface DocumentDetails {
    document_id: string;
    content: string;
    created_at: string;
}

export function useDocument(documentId: string) {
    return useApi<DocumentDetails>(`/document/${documentId}`);
}