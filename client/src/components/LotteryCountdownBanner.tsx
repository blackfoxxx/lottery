import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trophy, Ticket } from "lucide-react";

interface LotteryDraw {
  id: number;
  category: string;
  prize: string;
  draw_date: string;
  color: string;
  total_tickets: number;
  icon: string;
}

export default function LotteryCountdownBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdowns, setCountdowns] = useState<{ [key: number]: string }>({});

  // Mock lottery draws - in production, fetch from API
  const lotteryDraws: LotteryDraw[] = [
    {
      id: 1,
      category: "Golden Draw",
      prize: "$10,000 Grand Prize",
      draw_date: "2025-12-31T23:59:59",
      color: "#FFD700",
      total_tickets: 15420,
      icon: "🏆",
    },
    {
      id: 2,
      category: "Silver Draw",
      prize: "$5,000 Cash Prize",
      draw_date: "2025-12-25T20:00:00",
      color: "#C0C0C0",
      total_tickets: 8930,
      icon: "🥈",
    },
    {
      id: 3,
      category: "Bronze Draw",
      prize: "$1,000 Shopping Voucher",
      draw_date: "2025-12-20T18:00:00",
      color: "#CD7F32",
      total_tickets: 5240,
      icon: "🥉",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: { [key: number]: string } = {};
      lotteryDraws.forEach((draw) => {
        newCountdowns[draw.id] = calculateCountdown(draw.draw_date);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % lotteryDraws.length);
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [lotteryDraws.length]);

  function calculateCountdown(drawDate: string): string {
    const now = new Date().getTime();
    const target = new Date(drawDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return "Draw Completed";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % lotteryDraws.length);
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + lotteryDraws.length) % lotteryDraws.length);
  }

  const currentDraw = lotteryDraws[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
      {/* Banner Content */}
      <div className="relative px-8 py-12 md:px-16 md:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Left Side - Draw Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
              <span className="text-6xl">{currentDraw.icon}</span>
              <div>
                <h2
                  className="text-4xl font-bold"
                  style={{ color: currentDraw.color }}
                >
                  {currentDraw.category}
                </h2>
                <p className="text-xl text-gray-300">{currentDraw.prize}</p>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-center gap-2 text-gray-400 md:justify-start">
              <Ticket className="h-5 w-5" />
              <span className="text-sm">
                {currentDraw.total_tickets.toLocaleString()} tickets issued
              </span>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Draw in:
              </p>
              <div className="text-5xl font-bold text-white">
                {countdowns[currentDraw.id] || "Loading..."}
              </div>
            </div>

            <button className="mt-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg">
              View My Tickets
            </button>
          </div>

          {/* Right Side - Visual */}
          <div className="flex-shrink-0">
            <div
              className="relative h-64 w-64 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 p-8 shadow-2xl"
              style={{
                boxShadow: `0 0 60px ${currentDraw.color}40`,
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-4 border-dashed"
                style={{ borderColor: currentDraw.color }}
              >
                <Trophy
                  className="mb-4 h-24 w-24"
                  style={{ color: currentDraw.color }}
                />
                <p className="text-center text-sm font-semibold text-gray-300">
                  Win Amazing Prizes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {lotteryDraws.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
