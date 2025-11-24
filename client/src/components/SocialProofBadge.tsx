import { useEffect, useState } from "react";
import { Eye, ShoppingBag, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

interface SocialProofBadgeProps {
  productId: number;
  showViewers?: boolean;
  showPurchases?: boolean;
  compact?: boolean;
}

interface ActivityData {
  viewing_now: number;
  purchased_last_24h: number;
}

export default function SocialProofBadge({
  productId,
  showViewers = true,
  showPurchases = true,
  compact = false,
}: SocialProofBadgeProps) {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [productId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/social-proof/product/${productId}`
      );
      const data = await response.json();
      setActivity(data);
    } catch (error) {
      console.error("Failed to fetch social proof data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !activity) return null;

  const showViewersBadge = showViewers && activity.viewing_now > 0;
  const showPurchasesBadge = showPurchases && activity.purchased_last_24h > 0;

  if (!showViewersBadge && !showPurchasesBadge) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {showViewersBadge && (
          <div className="flex items-center gap-1 text-blue-600">
            <Eye className="w-3 h-3" />
            <span>{activity.viewing_now}</span>
          </div>
        )}
        {showPurchasesBadge && (
          <div className="flex items-center gap-1 text-green-600">
            <ShoppingBag className="w-3 h-3" />
            <span>{activity.purchased_last_24h}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {showViewersBadge && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          <Eye className="w-3.5 h-3.5" />
          <span>
            {activity.viewing_now} {activity.viewing_now === 1 ? "person" : "people"} viewing
          </span>
        </div>
      )}
      {showPurchasesBadge && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{activity.purchased_last_24h} sold in 24h</span>
        </div>
      )}
    </div>
  );
}
