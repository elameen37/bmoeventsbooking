import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PriceChangeRequest {
  id: string;
  arena_id: string;
  requested_by: string;
  current_price: number;
  proposed_price: number;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  arenas?: { name: string } | null;
}

export const usePriceChangeRequests = () => {
  return useQuery({
    queryKey: ["price-change-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_change_requests")
        .select("*, arenas(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PriceChangeRequest[];
    },
  });
};

export const useCreatePriceRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      arenaId,
      currentPrice,
      proposedPrice,
      reason,
    }: {
      arenaId: string;
      currentPrice: number;
      proposedPrice: number;
      reason: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("price_change_requests")
        .insert({
          arena_id: arenaId,
          requested_by: user.id,
          current_price: currentPrice,
          proposed_price: proposedPrice,
          reason,
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for all admins
      const { data: admins } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (admins) {
        const notifications = admins.map((admin) => ({
          user_id: admin.user_id,
          title: "Price Change Request",
          message: `A price change has been requested. Review it in the Admin Panel.`,
          type: "warning" as const,
          link: "/admin",
        }));

        await supabase.from("notifications").insert(notifications);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useApprovePriceRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      requestId,
      arenaId,
      proposedPrice,
      requestedBy,
    }: {
      requestId: string;
      arenaId: string;
      proposedPrice: number;
      requestedBy: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Update request status
      const { error: reqError } = await supabase
        .from("price_change_requests")
        .update({ status: "approved", reviewed_by: user.id, updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (reqError) throw reqError;

      // Update arena price
      const { error: arenaError } = await supabase
        .from("arenas")
        .update({ price_per_hour: proposedPrice })
        .eq("id", arenaId);

      if (arenaError) throw arenaError;

      // Notify the requester
      await supabase.from("notifications").insert({
        user_id: requestedBy,
        title: "Price Change Approved",
        message: `Your price change request has been approved. The new price is now ₦${proposedPrice.toLocaleString()}.`,
        type: "success",
        link: "/admin",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useRejectPriceRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      requestId,
      requestedBy,
    }: {
      requestId: string;
      requestedBy: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("price_change_requests")
        .update({ status: "rejected", reviewed_by: user.id, updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;

      // Notify the requester
      await supabase.from("notifications").insert({
        user_id: requestedBy,
        title: "Price Change Rejected",
        message: `Your price change request has been rejected.`,
        type: "error",
        link: "/admin",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useDirectPriceUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      arenaId,
      newPrice,
    }: {
      arenaId: string;
      newPrice: number;
    }) => {
      const { error } = await supabase
        .from("arenas")
        .update({ price_per_hour: newPrice })
        .eq("id", arenaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arenas"] });
    },
  });
};
