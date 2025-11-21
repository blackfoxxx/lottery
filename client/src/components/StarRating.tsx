import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "fill-yellow-500 text-yellow-500"
                  : isHalf
                  ? "fill-yellow-500/50 text-yellow-500"
                  : "fill-none text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
