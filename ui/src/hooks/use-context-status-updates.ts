import { SWRConfiguration } from "swr";
import { useApi } from "./use-api";

export interface StatusUpdate {
  status_update_id: string;
  context_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  the_match: string | null;
  created_at: string;
}

/**
 * Fetches status updates for a given context.
 * Returns SWR response with { results: StatusUpdate[] }
 */
export function useContextStatusUpdates(contextId: string, config?: SWRConfiguration) {
  const endpoint = contextId ? `/contexts/${contextId}/status-updates/` : null;
  return useApi<{ results: StatusUpdate[] }>(endpoint, config);
}
