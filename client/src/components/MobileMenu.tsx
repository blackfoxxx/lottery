import { Link } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, ShoppingBag, Ticket, Gift, Package, User, LogIn, Settings, LogOut, Trophy, Heart, GitCompare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { APP_TITLE } from "@/const";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{APP_TITLE}</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-8">
          {/* Main Navigation */}
          <div className="space-y-2">
            <Link href="/" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
            </Link>
            
            <Link href="/products" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Products
              </Button>
            </Link>
            
            <Link href="/lottery" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Ticket className="mr-2 h-5 w-5" />
                Lottery
              </Button>
            </Link>
            
            <Link href="/gift-cards" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Gift className="mr-2 h-5 w-5" />
                Gift Cards
              </Button>
            </Link>
            
            <Link href="/bundles" onClick={handleLinkClick}>
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-5 w-5" />
                Bundles
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t my-4" />

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="px-3 py-2 bg-muted rounded-lg">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              
              <Link href="/profile" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-5 w-5" />
                  My Profile
                </Button>
              </Link>
              
              <Link href="/orders" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-5 w-5" />
                  My Orders
                </Button>
              </Link>
              
              <Link href="/my-lottery" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <Ticket className="mr-2 h-5 w-5" />
                  My Lottery
                </Button>
              </Link>
              
              <Link href="/wishlist" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
              </Link>
              
              <Link href="/compare" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare
                </Button>
              </Link>
              
              <Link href="/loyalty" onClick={handleLinkClick}>
                <Button variant="ghost" className="w-full justify-start">
                  <Trophy className="mr-2 h-5 w-5" />
                  Loyalty Rewards
                </Button>
              </Link>
              
              {user?.role === "admin" && (
                <>
                  <div className="border-t my-2" />
                  <Link href="/admin" onClick={handleLinkClick}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-5 w-5" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </>
              )}
              
              <div className="border-t my-2" />
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/signin" onClick={handleLinkClick}>
                <Button variant="default" className="w-full">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
              
              <Link href="/signup" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
