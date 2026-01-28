import { Building2, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArenas } from "@/hooks/useArenas";
import { useUpdateArenaStatus } from "@/hooks/useAdminArenas";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ArenaStatus = Database["public"]["Enums"]["arena_status"];

const statusStyles = {
  available: "bg-success/20 text-success border-success/30",
  booked: "bg-destructive/20 text-destructive border-destructive/30",
  maintenance: "bg-muted text-muted-foreground border-muted-foreground/30",
};

export const ArenaManagement = () => {
  const { data: arenas, isLoading } = useArenas();
  const updateStatus = useUpdateArenaStatus();
  const { toast } = useToast();

  const handleStatusChange = async (arenaId: string, status: ArenaStatus) => {
    try {
      await updateStatus.mutateAsync({ arenaId, status });
      toast({
        title: "Arena Updated",
        description: `Arena status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update arena status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!arenas?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No arenas found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {arenas.map((arena) => (
        <Card key={arena.id} className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold">{arena.name}</CardTitle>
              <Badge className={statusStyles[arena.status]} variant="outline">
                {arena.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {arena.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {arena.capacity} guests
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Change Status:</span>
              <Select
                value={arena.status}
                onValueChange={(value) => handleStatusChange(arena.id, value as ArenaStatus)}
                disabled={updateStatus.isPending}
              >
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
