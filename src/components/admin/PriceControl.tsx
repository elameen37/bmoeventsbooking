import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, Check, X, Clock, Building2, ArrowRight, Send } from "lucide-react";
import { useArenas } from "@/hooks/useArenas";
import { useIsAdmin } from "@/hooks/useUserRole";
import {
  usePriceChangeRequests,
  useCreatePriceRequest,
  useApprovePriceRequest,
  useRejectPriceRequest,
  useDirectPriceUpdate,
} from "@/hooks/usePriceRequests";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const requestStatusStyles = {
  pending: "bg-warning/20 text-warning border-warning/30",
  approved: "bg-success/20 text-success border-success/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

const PriceControl = () => {
  const { data: arenas, isLoading: arenasLoading } = useArenas();
  const { data: requests, isLoading: requestsLoading } = usePriceChangeRequests();
  const { isAdmin } = useIsAdmin();
  const createRequest = useCreatePriceRequest();
  const approveRequest = useApprovePriceRequest();
  const rejectRequest = useRejectPriceRequest();
  const directUpdate = useDirectPriceUpdate();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArena, setSelectedArena] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");
  const [reason, setReason] = useState("");

  const handleOpenDialog = (arena: any) => {
    setSelectedArena(arena);
    setNewPrice("");
    setReason("");
    setDialogOpen(true);
  };

  const handleSubmitPriceChange = async () => {
    if (!selectedArena || !newPrice) return;

    const proposedPrice = Number(newPrice);
    if (proposedPrice <= 0) {
      toast({ title: "Invalid Price", description: "Price must be greater than 0.", variant: "destructive" });
      return;
    }

    if (proposedPrice === selectedArena.price_per_hour) {
      toast({ title: "No Change", description: "The new price is the same as the current price.", variant: "destructive" });
      return;
    }

    try {
      if (isAdmin) {
        // Admin can directly update
        await directUpdate.mutateAsync({ arenaId: selectedArena.id, newPrice: proposedPrice });
        toast({ title: "Price Updated", description: `Price for ${selectedArena.name} updated to ₦${proposedPrice.toLocaleString()}.` });
      } else {
        // Manager submits a request
        await createRequest.mutateAsync({
          arenaId: selectedArena.id,
          currentPrice: selectedArena.price_per_hour,
          proposedPrice,
          reason: reason || "Price update request",
        });
        toast({ title: "Request Submitted", description: "Your price change request has been sent to the admin for approval." });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to process price change.", variant: "destructive" });
    }
  };

  const handleApprove = async (request: any) => {
    try {
      await approveRequest.mutateAsync({
        requestId: request.id,
        arenaId: request.arena_id,
        proposedPrice: request.proposed_price,
        requestedBy: request.requested_by,
      });
      toast({ title: "Approved", description: "Price change has been approved and applied." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve request.", variant: "destructive" });
    }
  };

  const handleReject = async (request: any) => {
    try {
      await rejectRequest.mutateAsync({
        requestId: request.id,
        requestedBy: request.requested_by,
      });
      toast({ title: "Rejected", description: "Price change request has been rejected." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject request.", variant: "destructive" });
    }
  };

  if (arenasLoading || requestsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
  const pastRequests = requests?.filter((r) => r.status !== "pending") || [];

  return (
    <div className="space-y-6">
      {/* Current Prices */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Current Arena Prices
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {arenas?.map((arena) => (
            <Card key={arena.id} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">{arena.name}</h4>
                  </div>
                  <Badge variant="outline" className={arena.status === "available" ? "bg-success/20 text-success border-success/30" : "bg-muted"}>
                    {arena.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Price</p>
                    <p className="text-2xl font-bold gold-text">₦{arena.price_per_hour.toLocaleString()}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(arena)}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    {isAdmin ? "Update Price" : "Request Change"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Requests (Admin only sees action buttons) */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Price Requests
            <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
              {pendingRequests.length}
            </Badge>
          </h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-warning/30">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{request.arenas?.name}</p>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-muted-foreground">₦{request.current_price.toLocaleString()}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">₦{request.proposed_price.toLocaleString()}</span>
                      </div>
                      {request.reason && (
                        <p className="text-xs text-muted-foreground mt-1">Reason: {request.reason}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-success border-success/30 hover:bg-success/10"
                          onClick={() => handleApprove(request)}
                          disabled={approveRequest.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => handleReject(request)}
                          disabled={rejectRequest.isPending}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Request History</h3>
          <div className="space-y-2">
            {pastRequests.slice(0, 10).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 text-sm">
                <div className="flex-1">
                  <span className="font-medium">{request.arenas?.name}</span>
                  <span className="text-muted-foreground mx-2">
                    ₦{request.current_price.toLocaleString()} → ₦{request.proposed_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={requestStatusStyles[request.status]} variant="outline">
                    {request.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Change Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              {isAdmin ? "Update Price" : "Request Price Change"}
            </DialogTitle>
            <DialogDescription>
              {isAdmin
                ? "Directly update the pricing for this arena."
                : "Submit a price change request for admin approval."}
            </DialogDescription>
          </DialogHeader>

          {selectedArena && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm font-medium">{selectedArena.name}</p>
                <p className="text-xs text-muted-foreground">{selectedArena.location}</p>
                <p className="text-lg font-bold gold-text mt-1">
                  Current: ₦{selectedArena.price_per_hour.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPrice">New Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input
                    id="newPrice"
                    type="number"
                    className="pl-7"
                    placeholder="Enter new price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
              </div>

              {!isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Change</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why this price change is needed..."
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              )}

              {newPrice && Number(newPrice) > 0 && Number(newPrice) !== selectedArena.price_per_hour && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price Change</span>
                    <div className="flex items-center gap-2">
                      <span>₦{selectedArena.price_per_hour.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">₦{Number(newPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="premium"
              onClick={handleSubmitPriceChange}
              disabled={!newPrice || Number(newPrice) <= 0 || createRequest.isPending || directUpdate.isPending}
            >
              {isAdmin ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {directUpdate.isPending ? "Updating..." : "Update Price"}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  {createRequest.isPending ? "Submitting..." : "Submit Request"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceControl;
