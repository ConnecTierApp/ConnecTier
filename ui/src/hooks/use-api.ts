import useSWR, { SWRConfiguration, useSWRConfig } from 'swr';
import { api } from '../app/api-client';

// Generic type for API responses
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
};

type EntityData = {
  entity_id: string;
  name: string;
  type: string;
  organization_id: string;
};

type DocumentData = {
  document_id: string;
  entity_id: string;
  type: string;
  content: string;
  created_at: string;
};

export type MutateKey = string | null | undefined;

/**
 * Custom fetcher function that uses our API client
 */
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

/**
 * Hook to fetch data from an API endpoint
 */
export function useApi<T>(url: string | null, config?: SWRConfiguration): ApiResponse<T> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    url,
    fetcher,
    config
  );

  return {
    data,
    error: error ? (error.toString ? error.toString() : 'An error occurred') : undefined,
    isLoading,
    isValidating,
    mutate: async () => {
      await mutate();
    },
  };
}

/**
 * Hook for creating API mutation functions
 */
export function useApiMutation() {
  const { mutate: globalMutate } = useSWRConfig();

  const createEntity = async (data: { name: string; type: string }): Promise<EntityData> => {
    const response = await api.post('/entity/', data);
    // Invalidate any relevant cache keys
    await globalMutate((key: MutateKey) => typeof key === 'string' && key.startsWith('/entities'));
    return response.data;
  };

  const createDocument = async (data: { entity_id: string; type: string; content: string }): Promise<DocumentData> => {
    const response = await api.post('/document/', data);
    // Invalidate any relevant cache keys
    await globalMutate((key: MutateKey) => typeof key === 'string' && (
      key.startsWith('/documents') || 
      key.startsWith(`/entity/${data.entity_id}`)
    ));
    return response.data;
  };

  // const createContext = async (data: { name: string; entity_ids: string[], prompt: string }): Promise<DocumentData> => {
  //   const response = await api.post('/contexts/', data);
  //   // Invalidate any relevant cache keys
  //   await globalMutate((key: MutateKey) => typeof key === 'string' && key.startsWith('/contexts'));
  //   return response.data;
  // };

  return {
    createEntity,
    createDocument,
  };
}
