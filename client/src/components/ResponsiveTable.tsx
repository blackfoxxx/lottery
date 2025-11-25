import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("overflow-x-auto -mx-4 sm:mx-0", className)}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
