import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-600 text-white hover:bg-primary-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "text-slate-950 border border-slate-200 dark:border-slate-800 dark:text-slate-50",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
