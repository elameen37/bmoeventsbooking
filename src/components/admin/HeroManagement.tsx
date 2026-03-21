import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, Upload, X, ImageIcon, Settings2 } from "lucide-react";
import { useAdminSettings, useUpdateAdminSetting } from "@/hooks/useAdminSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  active: boolean;
}

interface HeroConfig {
  slides: HeroSlide[];
  transition: "fade" | "slide" | "zoom";
  duration: number; // in seconds
  auto_play: boolean;
}

const DEFAULT_CONFIG: HeroConfig = {
  slides: [],
  transition: "fade",
  duration: 5,
  auto_play: true,
};

const SortableSlideCard = ({ 
  slide, 
  onRemove, 
  onUpdate 
}: { 
  slide: HeroSlide; 
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<HeroSlide>) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm group"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="w-24 h-16 rounded-lg overflow-hidden border bg-muted shrink-0">
        <img src={slide.image_url} alt="Slide" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Input 
            placeholder="Main Title" 
            value={slide.title || ""} 
            onChange={(e) => onUpdate(slide.id, { title: e.target.value })}
            className="h-8 text-sm"
          />
          <Input 
            placeholder="Subtitle / Description" 
            value={slide.subtitle || ""} 
            onChange={(e) => onUpdate(slide.id, { subtitle: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor={`active-${slide.id}`} className="text-xs">Active</Label>
            <Switch 
              id={`active-${slide.id}`}
              checked={slide.active} 
              onCheckedChange={(val) => onUpdate(slide.id, { active: val })}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
            onClick={() => onRemove(slide.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const HeroManagement = () => {
  const { data: configSetting, isLoading } = useAdminSettings("hero_config");
  const updateSetting = useUpdateAdminSetting();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (configSetting?.setting_value) {
      try {
        const parsed = JSON.parse(configSetting.setting_value);
        setConfig(parsed);
      } catch (e) {
        console.error("Failed to parse hero_config", e);
        setConfig(DEFAULT_CONFIG);
      }
    }
  }, [configSetting]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((prev) => {
        const oldIndex = prev.slides.findIndex((s) => s.id === active.id);
        const newIndex = prev.slides.findIndex((s) => s.id === over.id);
        return {
          ...prev,
          slides: arrayMove(prev.slides, oldIndex, newIndex),
        };
      });
    }
  };

  const addSlide = (image_url: string) => {
    const newSlide: HeroSlide = {
      id: crypto.randomUUID(),
      image_url,
      active: true,
    };
    setConfig(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const removeSlide = (id: string) => {
    setConfig(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id),
    }));
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setConfig(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      addSlide(publicUrl);
      toast({ title: "Success", description: "Hero image uploaded." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      await updateSetting.mutateAsync({
        key: "hero_config",
        value: JSON.stringify(config),
      });
      toast({ title: "Settings Saved", description: "Hero section updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-40 bg-muted rounded-xl" />
      <div className="h-60 bg-muted rounded-xl" />
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Configuration */}
        <Card className="md:col-span-1 shadow-md border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="w-5 h-5 text-primary" />
              Slider Settings
            </CardTitle>
            <CardDescription>Adjust how slides behave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Transition effect</Label>
              <Select 
                value={config.transition} 
                onValueChange={(val: any) => setConfig(prev => ({ ...prev, transition: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade (Smooth)</SelectItem>
                  <SelectItem value="slide">Slide (Horizontal)</SelectItem>
                  <SelectItem value="zoom">Zoom (Advanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Auto-play interval (seconds)</Label>
              <Input 
                type="number" 
                value={config.duration} 
                onChange={(e) => setConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/5">
              <div className="space-y-0.5">
                <Label>Auto-play</Label>
                <p className="text-[10px] text-muted-foreground">Cycle slides automatically</p>
              </div>
              <Switch 
                checked={config.auto_play} 
                onCheckedChange={(val) => setConfig(prev => ({ ...prev, auto_play: val }))}
              />
            </div>

            <Button 
              className="w-full gold-gradient hover:opacity-90 transition-all shadow-lg"
              onClick={handleSave}
              disabled={updateSetting.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSetting.isPending ? "Saving..." : "Save Config"}
            </Button>
          </CardContent>
        </Card>

        {/* Slides Management */}
        <Card className="md:col-span-2 shadow-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="w-5 h-5 text-primary" />
                Hero Slides
              </CardTitle>
              <CardDescription>Manage images and text</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <span className="animate-spin w-4 h-4 rounded-full border-2 border-primary border-t-transparent" /> : <Plus className="w-4 h-4" />}
              Add Slide
            </Button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </CardHeader>
          <CardContent>
            {config.slides.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/30">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground italic">No slides added yet. Click "Add Slide" to begin.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={config.slides.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {config.slides.map((slide) => (
                      <SortableSlideCard 
                        key={slide.id} 
                        slide={slide} 
                        onRemove={removeSlide}
                        onUpdate={updateSlide}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
              <GripVertical className="w-3 h-3" />
              Drag slides to reorder them
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroManagement;
