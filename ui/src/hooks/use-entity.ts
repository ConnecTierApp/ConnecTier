import { useApi } from "./use-api";

interface EntityDetails {
    entity_id: string;
    name: string;
    type: 'startup' | 'mentor';
    organization_id: string;
    document_ids: string[];
    context_ids: string[];
    created_at: string;
}

export function useEntity(entityId: string) {
    return useApi<EntityDetails>(`/entity/${entityId}`);
}