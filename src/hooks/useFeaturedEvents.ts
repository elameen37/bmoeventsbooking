import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FeaturedEvent {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  attendees: number;
  rating: number;
  image_url: string | null;
  highlights: string[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedEventInput {
  event_name: string;
  event_type: string;
  event_date: string;
  attendees: number;
  rating?: number;
  image_url?: string | null;
  highlights?: string[];
  display_order?: number;
  is_active?: boolean;
}

export const useFeaturedEvents = () => {
  return useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_events")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FeaturedEvent[];
    },
  });
};

export const useAdminFeaturedEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ["admin-featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_events")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FeaturedEvent[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (event: FeaturedEventInput) => {
      const { data, error } = await supabase
        .from("featured_events")
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      toast.success("Featured event created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create featured event: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FeaturedEvent> & { id: string }) => {
      const { data, error } = await supabase
        .from("featured_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      toast.success("Featured event updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update featured event: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("featured_events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      toast.success("Featured event deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete featured event: " + error.message);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedEvents: { id: string; display_order: number }[]) => {
      const updates = orderedEvents.map(({ id, display_order }) =>
        supabase
          .from("featured_events")
          .update({ display_order })
          .eq("id", id)
      );
      
      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-featured-events"] });
      queryClient.invalidateQueries({ queryKey: ["featured-events"] });
      toast.success("Event order updated");
    },
    onError: (error) => {
      toast.error("Failed to reorder events: " + error.message);
    },
  });

  return {
    events: eventsQuery.data ?? [],
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    reorderEvents: reorderMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
};
