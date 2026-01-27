import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, arenas(*)")
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUserBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("*, arenas(*)")
        .eq("user_id", user.id)
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: Omit<BookingInsert, "user_id">) => {
      if (!user) throw new Error("You must be logged in to create a booking");

      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...booking, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },
  });
};

export const useUpcomingBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["upcoming-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("bookings")
        .select("*, arenas(*)")
        .eq("user_id", user.id)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useAllBookingsForCalendar = () => {
  return useQuery({
    queryKey: ["calendar-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, arenas(name)")
        .in("status", ["pending", "confirmed"])
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};
