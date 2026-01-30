import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDeleteArena } from "@/hooks/useAdminArenas";
import type { Arena } from "@/hooks/useArenas";

interface DeleteArenaDialogProps {
  arena: Arena;
}

export const DeleteArenaDialog = ({ arena }: DeleteArenaDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const deleteArena = useDeleteArena();

  const handleDelete = async () => {
    try {
      await deleteArena.mutateAsync(arena.id);
      toast({
        title: "Arena Deleted",
        description: `${arena.name} has been removed successfully.`,
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message?.includes("foreign key")
          ? "Cannot delete venue with existing bookings."
          : "Failed to delete arena. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">Delete Venue?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{arena.name}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteArena.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteArena.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteArena.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
