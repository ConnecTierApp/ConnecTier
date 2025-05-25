import { SWRConfiguration } from "swr";
import { useApi } from "./use-api";

export interface Match {
  match_id: string;
  context_id: string;
  status?: string;
  score?: string;
  reasoning?: string;
  entities: Array<{ entity_id: string; name: string; type: string }>;
  confidence?: number;
  created_at: string;
  // Add more fields as needed based on your API response
}

export function useMatches(contextId: string, config?: SWRConfiguration) {
  // Only fetch if contextId is present
  const endpoint = contextId ? `/contexts/${contextId}/matches/` : null;
  return useApi<{ results: Match[] }>(endpoint, config);
}
