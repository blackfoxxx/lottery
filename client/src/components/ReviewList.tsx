import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import StarRating from "./StarRating";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  user_found_helpful?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  onVote?: (reviewId: number, helpful: boolean) => void;
}

export default function ReviewList({ reviews, onVote }: ReviewListProps) {
  const [votedReviews, setVotedReviews] = useState<Record<number, boolean>>({});

  const handleVote = (reviewId: number, helpful: boolean) => {
    if (votedReviews[reviewId] !== undefined) {
      return; // Already voted
    }
    
    setVotedReviews({ ...votedReviews, [reviewId]: helpful });
    onVote?.(reviewId, helpful);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const userVote = votedReviews[review.id];
        const hasVoted = userVote !== undefined;

        return (
          <Card key={review.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {review.user_name.charAt(0).toUpperCase()}
                </span>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.user_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground mb-3">{review.comment}</p>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Was this helpful?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={userVote === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(review.id, true)}
                      disabled={hasVoted}
                      className="gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{review.helpful_count}</span>
                    </Button>
                    <Button
                      variant={userVote === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(review.id, false)}
                      disabled={hasVoted}
                      className="gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span>{review.not_helpful_count}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
