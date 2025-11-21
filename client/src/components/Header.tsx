import { ShoppingCart, Search, User, LogOut, Settings, X, Package, Heart, GitCompare, Trophy } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useProductSearch } from "@/hooks/useProductSearch";
import SearchResults from "./SearchResults";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useComparison } from "@/contexts/ComparisonContext";

export default function Header() {
  const { getTotalItems, openCart } = useCart();
  const { comparison } = useComparison();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const totalItems = getTotalItems();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { results, loading } = useProductSearch(searchQuery);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show results when user types
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleCloseResults() {
    setShowResults(false);
    setSearchQuery("");
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-auto" />}
            <span className="text-xl font-bold text-foreground">{APP_TITLE}</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder={t("header.search")}
                className="pl-10 pr-10 bg-card"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {showResults && (
              <SearchResults
                results={results}
                loading={loading}
                query={searchQuery}
                onClose={handleCloseResults}
              />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link href="/products">
              <Button variant="ghost">{t("header.products")}</Button>
            </Link>
            
            <LanguageSwitcher />
            
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/compare">
              <Button variant="ghost" size="icon" className="relative">
                <GitCompare className="h-5 w-5" />
                {comparison.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {comparison.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/loyalty">
                      <Trophy className="mr-2 h-4 w-4" />
                      Loyalty Rewards
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("header.adminDashboard")}
                      </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLoginOpen(true)} className="hidden sm:flex">
                  {t("header.signIn")}
                </Button>
                <Button onClick={() => setRegisterOpen(true)}>
                  {t("header.signUp")}
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
}
