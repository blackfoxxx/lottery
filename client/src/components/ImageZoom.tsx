import { useState, useRef, MouseEvent } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  }

  function handleMouseEnter() {
    setIsZoomed(true);
  }

  function handleMouseLeave() {
    setIsZoomed(false);
  }

  function openFullscreen() {
    setIsFullscreen(true);
  }

  function closeFullscreen() {
    setIsFullscreen(false);
  }

  return (
    <>
      {/* Main Image with Zoom */}
      <div
        ref={imageRef}
        className="relative aspect-square bg-card rounded-lg overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openFullscreen}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: isZoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
        
        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <ZoomIn className="h-4 w-4" />
          <span className="text-sm">Click to view fullscreen</span>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeFullscreen}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative max-w-6xl max-h-full">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
            Press ESC or click X to close
          </div>
        </div>
      )}
    </>
  );
}
