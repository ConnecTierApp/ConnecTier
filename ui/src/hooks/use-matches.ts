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

// Accepts either a contextId or a full endpoint (with query params)
export function useMatches(endpointOrContextId: string, config?: SWRConfiguration) {
  let endpoint: string | null = null;
  if (!endpointOrContextId) {
    endpoint = null;
  } else if (endpointOrContextId.startsWith('/contexts/')) {
    endpoint = endpointOrContextId;
  } else {
    endpoint = `/contexts/${endpointOrContextId}/matches/`;
  }
  return useApi<{ results: Match[] }>(endpoint, config);
}
