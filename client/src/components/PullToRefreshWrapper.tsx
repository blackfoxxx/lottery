import { ReactNode } from "react";
import PullToRefresh from "react-pull-to-refresh";
import { RefreshCw } from "lucide-react";

interface PullToRefreshWrapperProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export default function PullToRefreshWrapper({ onRefresh, children }: PullToRefreshWrapperProps) {
  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className="pull-to-refresh-wrapper"
      style={{ minHeight: "100vh" }}
    >
      <div className="refresh-indicator hidden">
        <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
      {children}
    </PullToRefresh>
  );
}
