import { Check, Package, Truck, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  status: string;
  label: string;
  icon: React.ReactNode;
  date?: string;
}

interface ShipmentTimelineProps {
  currentStatus: string;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export default function ShipmentTimeline({
  currentStatus,
  trackingNumber,
  carrier,
  shippedAt,
  deliveredAt,
}: ShipmentTimelineProps) {
  const steps: TimelineStep[] = [
    {
      status: 'processing',
      label: 'Order Processing',
      icon: <Package className="h-5 w-5" />,
    },
    {
      status: 'shipped',
      label: 'Shipped',
      icon: <Truck className="h-5 w-5" />,
      date: shippedAt,
    },
    {
      status: 'in_transit',
      label: 'In Transit',
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: <Truck className="h-5 w-5" />,
    },
    {
      status: 'delivered',
      label: 'Delivered',
      icon: <Home className="h-5 w-5" />,
      date: deliveredAt,
    },
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const isStepCompleted = (stepStatus: string) => {
    const stepIndex = statusOrder.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  const isStepActive = (stepStatus: string) => {
    return stepStatus === currentStatus;
  };

  return (
    <div className="space-y-6">
      {/* Tracking Info */}
      {trackingNumber && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tracking Number: </span>
            <span className="font-mono font-semibold">{trackingNumber}</span>
          </div>
          {carrier && (
            <div>
              <span className="text-muted-foreground">Carrier: </span>
              <span className="font-semibold">{carrier}</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const completed = isStepCompleted(step.status);
            const active = isStepActive(step.status);

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                    completed || active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  {completed && !active ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "font-semibold",
                        active ? "text-primary" : completed ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </h4>
                    {step.date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(step.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {active && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Current status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancelled Status */}
      {currentStatus === 'cancelled' && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-destructive font-semibold">Order Cancelled</p>
          <p className="text-sm text-muted-foreground mt-1">
            This order has been cancelled. Please contact support for more information.
          </p>
        </div>
      )}
    </div>
  );
}
