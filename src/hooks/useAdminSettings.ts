import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminSettings = (key: string) => {
  return useQuery({
    queryKey: ["admin-settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("setting_key", key)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAdminSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }) => {
      // Try to update first
      const { data: existing } = await supabase
        .from("admin_settings")
        .select("id")
        .eq("setting_key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("admin_settings")
          .update({ setting_value: value, updated_at: new Date().toISOString() })
          .eq("setting_key", key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_settings")
          .insert({ setting_key: key, setting_value: value });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings", variables.key] });
    },
  });
};
