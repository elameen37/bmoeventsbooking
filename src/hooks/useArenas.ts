import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Arena = Tables<"arenas">;

export const useArenas = () => {
  return useQuery({
    queryKey: ["arenas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arenas")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Arena[];
    },
  });
};

export const useArena = (id: string | null) => {
  return useQuery({
    queryKey: ["arenas", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("arenas")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Arena | null;
    },
    enabled: !!id,
  });
};
