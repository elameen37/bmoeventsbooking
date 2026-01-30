import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ArenaStatus = Database["public"]["Enums"]["arena_status"];

export interface ArenaFormData {
  name: string;
  location: string;
  capacity: number;
  price_per_hour: number;
  description?: string;
  image_url?: string;
  amenities?: string[];
  status?: ArenaStatus;
}

export const useUpdateArenaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arenaId,
      status,
    }: {
      arenaId: string;
      status: ArenaStatus;
    }) => {
      const { data, error } = await supabase
        .from("arenas")
        .update({ status })
        .eq("id", arenaId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
    },
  });
};

export const useCreateArena = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ArenaFormData) => {
      const { data: arena, error } = await supabase
        .from("arenas")
        .insert({
          name: data.name,
          location: data.location,
          capacity: data.capacity,
          price_per_hour: data.price_per_hour,
          description: data.description || null,
          image_url: data.image_url || null,
          amenities: data.amenities || [],
          status: data.status || "available",
        })
        .select()
        .single();

      if (error) throw error;
      return arena;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
    },
  });
};

export const useUpdateArena = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arenaId,
      data,
    }: {
      arenaId: string;
      data: Partial<ArenaFormData>;
    }) => {
      const { data: arena, error } = await supabase
        .from("arenas")
        .update({
          name: data.name,
          location: data.location,
          capacity: data.capacity,
          price_per_hour: data.price_per_hour,
          description: data.description,
          image_url: data.image_url,
          amenities: data.amenities,
          status: data.status,
        })
        .eq("id", arenaId)
        .select()
        .single();

      if (error) throw error;
      return arena;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
    },
  });
};

export const useDeleteArena = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arenaId: string) => {
      const { error } = await supabase
        .from("arenas")
        .delete()
        .eq("id", arenaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
    },
  });
};
