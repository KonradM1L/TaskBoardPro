import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Board, InsertBoard } from "@shared/schema";

export function useBoards() {
  return useQuery<Board[]>({
    queryKey: ["/api/boards"],
  });
}

export function useBoard(id: number) {
  return useQuery<Board>({
    queryKey: ["/api/boards", id],
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertBoard) => {
      const response = await apiRequest("POST", "/api/boards", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBoard> }) => {
      const response = await apiRequest("PUT", `/api/boards/${id}`, data);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/boards", id] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/boards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boards"] });
    },
  });
}
