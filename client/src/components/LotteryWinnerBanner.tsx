import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Winner {
  id: number;
  name: string;
  prize: number;
  ticketNumber: string;
  date: string;
}

// Mock data - replace with API call
const mockWinners: Winner[] = [
  {
    id: 1,
    name: "Ahmad K.",
    prize: 10000,
    ticketNumber: "LT-2024-001234",
    date: "2024-02-01",
  },
  {
    id: 2,
    name: "Sarah M.",
    prize: 5000,
    ticketNumber: "LT-2024-001567",
    date: "2024-01-28",
  },
  {
    id: 3,
    name: "Mohammed A.",
    prize: 2500,
    ticketNumber: "LT-2024-001892",
    date: "2024-01-25",
  },
  {
    id: 4,
    name: "Fatima H.",
    prize: 1000,
    ticketNumber: "LT-2024-002134",
    date: "2024-01-22",
  },
];

export default function LotteryWinnerBanner() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockWinners.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentWinner = mockWinners[currentIndex];

  return (
    <div className="container py-6">
      <Card
        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 border-amber-600 overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left side - Trophy and Title */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                  {t("lottery.recentWinners")}
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  {t("lottery.congratulations")}
                </p>
              </div>
            </div>

            {/* Right side - Winner Info */}
            <div className="flex items-center gap-6 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <div className="text-right">
                <div className="text-white text-2xl md:text-3xl font-bold">
                  {currentWinner.name}
                </div>
                <div className="text-white/90 text-sm md:text-base flex items-center gap-2 justify-end mt-1">
                  <Ticket className="w-4 h-4" />
                  <span className="font-mono">{currentWinner.ticketNumber}</span>
                </div>
              </div>

              <div className="h-12 w-px bg-white/30"></div>

              <div className="text-center">
                <div className="text-white/90 text-xs md:text-sm uppercase tracking-wide mb-1">
                  {t("lottery.wonPrize")}
                </div>
                <div className="text-white text-3xl md:text-4xl font-bold">
                  ${currentWinner.prize.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-4">
            {mockWinners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to winner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
