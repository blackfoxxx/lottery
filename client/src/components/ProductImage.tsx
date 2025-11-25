import { useState } from "react";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}

export default function ProductImage({ src, alt, category, className = "" }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!src || imageError) {
    return <ProductImagePlaceholder category={category} alt={alt} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0">
          <ProductImagePlaceholder category={category} alt={alt} className="w-full h-full" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
