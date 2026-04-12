import Link from "next/link";
import { LayoutDashboard, Package, Map, Settings, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Live Map", href: "/map", icon: Map },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("hidden w-64 flex-col border-r border-border bg-card lg:flex", className)}>
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Map className="h-6 w-6 text-primary-600 mr-2" />
        <span className="font-bold text-lg tracking-tight">OmniTrack</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
