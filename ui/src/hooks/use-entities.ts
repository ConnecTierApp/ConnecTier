import { useApi } from "./use-api";

interface ListEntity {
    entity_id: string;
    name: string;
    type: string;
    organization: string;
    documentIds: string[];
    contextIds: string[];
    createdAt: string;
}

export function useEntities(type?: string) {
    return useApi<{ results: ListEntity[] }>(`/entities?type=${type}`);
}