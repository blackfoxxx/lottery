import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: number;
  onSubmit: (review: { rating: number; comment: string }) => void;
}

export default function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating">Your Rating</Label>
        <div className="mt-2">
          <StarRating
            rating={rating}
            interactive
            onRatingChange={setRating}
            size="lg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          className="mt-2"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {comment.length} characters (minimum 10)
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
