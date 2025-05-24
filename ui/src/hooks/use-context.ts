import { useApi } from "./use-api";

interface ContextDetails {
    context_id: string;
    name: string;
    prompt: string;
    created_at: string;
    entities: {
        entity_id: string;
        name: string;
        type: string;
    }[];
}

export function useContext(contextId: string) {
    return useApi<ContextDetails>(`/context/${contextId}`);
}
