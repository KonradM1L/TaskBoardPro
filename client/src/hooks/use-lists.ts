import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { List, InsertList } from "@shared/schema";

export function useLists(boardId: number) {
  return useQuery<List[]>({
    queryKey: ["/api/boards", boardId, "lists"],
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertList) => {
      const response = await apiRequest("POST", "/api/lists", data);
      return response.json();
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", boardId, "lists"] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertList> }) => {
      const response = await apiRequest("PUT", `/api/lists/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedList: List) => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards", updatedList.boardId, "lists"] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/lists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
    },
  });
}
