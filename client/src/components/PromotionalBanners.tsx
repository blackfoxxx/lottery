import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  position: number;
}

export default function PromotionalBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadBanners();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  function loadBanners() {
    // Mock data - replace with API call
    const mockBanners: Banner[] = [
      {
        id: 1,
        title: "Summer Sale 2025",
        description: "Up to 50% off on selected items",
        image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
        link_url: "/products?category=sale",
        start_date: "2025-06-01",
        end_date: "2025-08-31",
        is_active: true,
        position: 1,
      },
      {
        id: 2,
        title: "New Arrivals",
        description: "Check out our latest products",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
        link_url: "/products?sort=newest",
        start_date: "2025-01-01",
        end_date: "2025-12-31",
        is_active: true,
        position: 2,
      },
    ];

    // Filter active banners within date range
    const now = new Date();
    const activeBanners = mockBanners
      .filter((banner) => {
        const startDate = new Date(banner.start_date);
        const endDate = new Date(banner.end_date);
        return banner.is_active && now >= startDate && now <= endDate;
      })
      .sort((a, b) => a.position - b.position);

    setBanners(activeBanners);
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-12">
      {/* Banner Image */}
      <Link href={currentBanner.link_url}>
        <div className="relative w-full h-full group cursor-pointer">
          <img
            src={currentBanner.image_url}
            alt={currentBanner.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {currentBanner.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-6">
                  {currentBanner.description}
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-75 hover:opacity-100"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-75 hover:opacity-100"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
