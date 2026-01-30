import { useState, useEffect } from "react";
import { Plus, Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateArena,
  useUpdateArena,
  type ArenaFormData,
} from "@/hooks/useAdminArenas";
import type { Arena } from "@/hooks/useArenas";
import type { Database } from "@/integrations/supabase/types";

type ArenaStatus = Database["public"]["Enums"]["arena_status"];

interface ArenaFormDialogProps {
  arena?: Arena;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

export const ArenaFormDialog = ({
  arena,
  mode,
  trigger,
}: ArenaFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createArena = useCreateArena();
  const updateArena = useUpdateArena();

  const [formData, setFormData] = useState<ArenaFormData>({
    name: "",
    location: "",
    capacity: 1000,
    price_per_hour: 0,
    description: "",
    image_url: "",
    amenities: [],
    status: "available",
  });

  const [amenitiesInput, setAmenitiesInput] = useState("");

  useEffect(() => {
    if (arena && mode === "edit") {
      setFormData({
        name: arena.name,
        location: arena.location,
        capacity: arena.capacity,
        price_per_hour: arena.price_per_hour,
        description: arena.description || "",
        image_url: arena.image_url || "",
        amenities: arena.amenities || [],
        status: arena.status,
      });
      setAmenitiesInput((arena.amenities || []).join(", "));
    } else {
      setFormData({
        name: "",
        location: "",
        capacity: 1000,
        price_per_hour: 0,
        description: "",
        image_url: "",
        amenities: [],
        status: "available",
      });
      setAmenitiesInput("");
    }
  }, [arena, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and location are required.",
        variant: "destructive",
      });
      return;
    }

    const amenitiesArray = amenitiesInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    try {
      if (mode === "create") {
        await createArena.mutateAsync({
          ...formData,
          amenities: amenitiesArray,
        });
        toast({
          title: "Arena Created",
          description: `${formData.name} has been added successfully.`,
        });
      } else if (arena) {
        await updateArena.mutateAsync({
          arenaId: arena.id,
          data: {
            ...formData,
            amenities: amenitiesArray,
          },
        });
        toast({
          title: "Arena Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} arena. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const isPending = createArena.isPending || updateArena.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === "create" ? "premium" : "outline"} size={mode === "create" ? "default" : "sm"}>
            {mode === "create" ? (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </>
            ) : (
              <Pencil className="w-4 h-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {mode === "create" ? "Add New Venue" : "Edit Venue"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new venue."
              : "Update the venue information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., B.M.O Hall - 1"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Plot 174, Riverplate Park, Wuse II, Abuja"
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value) || 0,
                  }))
                }
                min={1}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Hour (₦)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price_per_hour}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price_per_hour: parseInt(e.target.value) || 0,
                  }))
                }
                min={0}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as ArenaStatus,
                }))
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description of the venue..."
              className="bg-background min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="Security Guards, Central AC, Free Parking..."
              className="bg-background"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="premium" disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create Venue"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
