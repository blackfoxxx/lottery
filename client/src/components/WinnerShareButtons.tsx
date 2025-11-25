import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface WinnerShareButtonsProps {
  winnerName: string;
  prize: number;
  ticketNumber: string;
  drawName: string;
}

export default function WinnerShareButtons({
  winnerName,
  prize,
  ticketNumber,
  drawName,
}: WinnerShareButtonsProps) {
  const { t } = useLanguage();

  const shareText = `🎉 I just won $${prize.toLocaleString()} in the ${drawName}! Ticket: ${ticketNumber}`;
  const shareUrl = window.location.href;

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("Opening Facebook share dialog");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    toast.success("Opening Twitter share dialog");
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
    toast.success("Opening WhatsApp");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Share2 className="w-4 h-4" />
        <span>Share Your Win</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleFacebookShare}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </Button>
        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </Button>
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
