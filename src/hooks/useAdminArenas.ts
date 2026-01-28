import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ArenaStatus = Database["public"]["Enums"]["arena_status"];

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
