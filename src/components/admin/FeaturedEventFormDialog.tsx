import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAdminFeaturedEvents, FeaturedEvent } from "@/hooks/useFeaturedEvents";

const formSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.string().min(1, "Event type is required"),
  event_date: z.string().min(1, "Event date is required"),
  attendees: z.coerce.number().min(1, "Attendees must be at least 1"),
  rating: z.coerce.number().min(1).max(5).default(4.5),
  image_url: z.string().url().optional().or(z.literal("")),
  highlights: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface FeaturedEventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: FeaturedEvent | null;
}

export const FeaturedEventFormDialog = ({
  open,
  onOpenChange,
  event,
}: FeaturedEventFormDialogProps) => {
  const { createEvent, updateEvent, isCreating, isUpdating } = useAdminFeaturedEvents();
  const isEditing = !!event;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_type: "",
      event_date: "",
      attendees: 100,
      rating: 4.5,
      image_url: "",
      highlights: "",
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        event_name: event.event_name,
        event_type: event.event_type,
        event_date: event.event_date,
        attendees: event.attendees,
        rating: event.rating,
        image_url: event.image_url || "",
        highlights: event.highlights?.join(", ") || "",
        display_order: event.display_order,
        is_active: event.is_active,
      });
    } else {
      form.reset({
        event_name: "",
        event_type: "",
        event_date: "",
        attendees: 100,
        rating: 4.5,
        image_url: "",
        highlights: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [event, form]);

  const onSubmit = (values: FormValues) => {
    const highlights = values.highlights
      ? values.highlights.split(",").map((h) => h.trim()).filter(Boolean)
      : [];

    const eventData = {
      event_name: values.event_name,
      event_type: values.event_type,
      event_date: values.event_date,
      attendees: values.attendees,
      rating: values.rating,
      image_url: values.image_url || null,
      highlights,
      display_order: values.display_order,
      is_active: values.is_active,
    };

    if (isEditing && event) {
      updateEvent({ id: event.id, ...eventData }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createEvent(eventData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Featured Event" : "Add Featured Event"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Corporate Gala Night" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Corporate Event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input placeholder="January 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="attendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendees</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Live Band, Gourmet Dinner, Networking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel className="text-sm">Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
