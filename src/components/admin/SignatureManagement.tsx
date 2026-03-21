import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, Trash2, Save, Upload, RotateCcw } from "lucide-react";
import { useAdminSettings, useUpdateAdminSetting } from "@/hooks/useAdminSettings";
import { useToast } from "@/hooks/use-toast";

const SIGNATURE_KEY = "admin_signature";

const SignatureManagement = () => {
  const { data: signatureSetting, isLoading } = useAdminSettings(SIGNATURE_KEY);
  const updateSetting = useUpdateAdminSetting();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedSignature = signatureSetting?.setting_value || null;

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a1a";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSaveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    try {
      await updateSetting.mutateAsync({ key: SIGNATURE_KEY, value: dataUrl });
      toast({ title: "Signature Saved", description: "Your signature has been saved and will appear on all invoices." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save signature.", variant: "destructive" });
    }
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        await updateSetting.mutateAsync({ key: SIGNATURE_KEY, value: dataUrl });
        toast({ title: "Signature Uploaded", description: "Your signature image has been saved." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to upload signature.", variant: "destructive" });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteSignature = async () => {
    try {
      await updateSetting.mutateAsync({ key: SIGNATURE_KEY, value: "" });
      toast({ title: "Signature Removed", description: "The signature has been removed from invoices." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove signature.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Signature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenTool className="w-5 h-5 text-primary" />
            Current Signature
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedSignature ? (
            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-border bg-white flex items-center justify-center">
                <img
                  src={savedSignature}
                  alt="Admin Signature"
                  className="max-h-24 object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This signature appears on all invoices and receipts.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleDeleteSignature}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove Signature
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <PenTool className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No signature set yet</p>
              <p className="text-xs mt-1">Draw or upload a signature below to display on invoices.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draw Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Draw Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-border bg-white overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair touch-none"
              style={{ height: "180px" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              disabled={!hasDrawn}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="premium"
              size="sm"
              onClick={handleSaveSignature}
              disabled={!hasDrawn || updateSetting.isPending}
            >
              <Save className="w-4 h-4 mr-1" />
              {updateSetting.isPending ? "Saving..." : "Save Signature"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Signature Image</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Upload a PNG or JPG image of your signature. Transparent backgrounds work best.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadSignature}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload Image
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureManagement;
