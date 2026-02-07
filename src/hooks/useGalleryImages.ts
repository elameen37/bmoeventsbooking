import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GalleryImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImageInput {
  title?: string | null;
  description?: string | null;
  image_url: string;
  display_order?: number;
  is_active?: boolean;
}

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as GalleryImage[];
    },
  });
};

export const useAdminGalleryImages = () => {
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ["admin-gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (image: GalleryImageInput) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .insert(image)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Gallery image added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add gallery image: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryImage> & { id: string }) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Gallery image updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update gallery image: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Gallery image deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete gallery image: " + error.message);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedImages: { id: string; display_order: number }[]) => {
      const updates = orderedImages.map(({ id, display_order }) =>
        supabase
          .from("gallery_images")
          .update({ display_order })
          .eq("id", id)
      );
      
      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast.success("Gallery order updated");
    },
    onError: (error) => {
      toast.error("Failed to reorder images: " + error.message);
    },
  });

  return {
    images: imagesQuery.data ?? [],
    isLoading: imagesQuery.isLoading,
    error: imagesQuery.error,
    createImage: createMutation.mutate,
    updateImage: updateMutation.mutate,
    deleteImage: deleteMutation.mutate,
    reorderImages: reorderMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
};
