import { useApi } from "./use-api";

interface ListContext {
    context_id: string;
    name: string;
    created_at: string;
}

export function useContexts() {
    return useApi<{ results: ListContext[] }>("/contexts");
}
