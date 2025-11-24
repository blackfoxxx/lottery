import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface WishlistShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wishlistId?: string;
}

export default function WishlistShare({ open, onOpenChange, wishlistId }: WishlistShareProps) {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // Generate or use existing wishlist ID
  const shareId = wishlistId || generateWishlistId();
  const shareUrl = `${window.location.origin}/shared-wishlist/${shareId}`;

  function generateWishlistId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  }

  function shareToTwitter() {
    const text = "Check out my wishlist on Belkhair!";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  }

  function shareToWhatsApp() {
    const text = `Check out my wishlist: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function handlePrivacyToggle(checked: boolean) {
    setIsPublic(checked);
    localStorage.setItem(`wishlist_${shareId}_public`, checked.toString());
    toast.success(checked ? "Wishlist is now public" : "Wishlist is now private");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Wishlist
          </DialogTitle>
          <DialogDescription>
            Share your wishlist with friends and family via link or social media
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="privacy">Public Wishlist</Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view your wishlist
              </p>
            </div>
            <Switch
              id="privacy"
              checked={isPublic}
              onCheckedChange={handlePrivacyToggle}
            />
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <Label>Share via Social Media</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex-col h-auto py-3"
                onClick={shareToFacebook}
              >
                <Facebook className="h-5 w-5 mb-1 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3"
                onClick={shareToTwitter}
              >
                <Twitter className="h-5 w-5 mb-1 text-sky-500" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3"
                onClick={shareToWhatsApp}
              >
                <MessageCircle className="h-5 w-5 mb-1 text-green-600" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> People can view your wishlist and add items to their own cart.
              {isPublic ? " Your wishlist is visible to anyone with the link." : " Only people you share the link with can see your wishlist."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
