import * as React from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.ComponentProps<"div"> {
  /** Slightly stronger glass for emphasis */
  variant?: "default" | "strong";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="glass-card"
        data-variant={variant}
        className={cn(
          "glass rounded-2xl transition-all duration-300",
          "hover:shadow-[0_12px_40px_oklch(0_0_0/0.12)] dark:hover:shadow-[0_12px_40px_oklch(0_0_0/0.4)]",
          "data-[variant=strong]:bg-[oklch(1_0_0/0.75)] dark:data-[variant=strong]:bg-[oklch(0.25_0_0/0.6)]",
          className,
        )}
        {...props}
      />
    );
  },
);

GlassCard.displayName = "GlassCard";

function GlassCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-header"
      className={cn("rounded-t-2xl px-5 pt-5 pb-1", className)}
      {...props}
    />
  );
}

function GlassCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-title"
      className={cn("text-base font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function GlassCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-description"
      className={cn("mt-0.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function GlassCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-content"
      className={cn("px-5 py-3", className)}
      {...props}
    />
  );
}

function GlassCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-card-footer"
      className={cn(
        "rounded-b-2xl px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
};
