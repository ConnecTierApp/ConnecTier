import { api } from "@/app/api-client";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { MutateKey } from "./use-api";

interface CreateContextArgs {
  name: string;
  prompt: string;
  entity_ids: string[];
}

interface CreateContextResponse {
  context_id: string;
  name: string;
  // add any other fields returned by the API
}

export function useCreateContext() {
  const { mutate: globalMutate } = useSWRConfig();
  return useSWRMutation<
    CreateContextResponse, // return type
    unknown,               // error type
    "/context/",          // key type
    CreateContextArgs      // argument type
  >(
    '/context/',
    async (url, { arg }) => {
      const response = await api.post(url, arg);
      // Invalidate any relevant cache keys
      await globalMutate((key: MutateKey) => typeof key === 'string' && key.startsWith('/contexts'));
      return response.data;
    }
  );
}



