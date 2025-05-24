import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Card, InsertCard, UpdateCard } from "@shared/schema";

export function useCards() {
  return useQuery<Card[]>({
    queryKey: ["/api/cards"],
    queryFn: async () => {
      // Since we need all cards, we'll fetch them differently
      // This is a workaround since the API is list-specific
      const response = await fetch("/api/cards/all", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }
      return response.json();
    },
  });
}

export function useListCards(listId: number) {
  return useQuery<Card[]>({
    queryKey: ["/api/lists", listId, "cards"],
  });
}

export function useCard(id: number) {
  return useQuery<Card>({
    queryKey: ["/api/cards", id],
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCard) => {
      const response = await apiRequest("POST", "/api/cards", data);
      return response.json();
    },
    onSuccess: (newCard: Card) => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists", newCard.listId, "cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cardId, data }: { cardId: number; data: UpdateCard }) => {
      const response = await apiRequest("PUT", `/api/cards/${cardId}`, data);
      return response.json();
    },
    onSuccess: (updatedCard: Card) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards", updatedCard.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/lists", updatedCard.listId, "cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
    },
  });
}

export function useMoveCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cardId, listId, position }: { cardId: number; listId: number; position: number }) => {
      const response = await apiRequest("POST", `/api/cards/${cardId}/move`, { listId, position });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
    },
  });
}
