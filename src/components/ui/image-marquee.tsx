import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageMarqueeProps {
  images: string[];
  className?: string;
  speed?: number;
}

const ImageMarquee = ({ images, className, speed = 30 }: ImageMarqueeProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });
    
    setStart(true);
  }, []);

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        ref={scrollerRef}
        className={cn(
          "flex gap-2 w-max",
          start && "animate-marquee"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden"
          >
            <img
              src={image}
              alt={`Venue image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageMarquee;
