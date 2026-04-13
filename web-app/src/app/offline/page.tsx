import { WifiOff, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 rounded-full animate-pulse" />
        <div className="relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <WifiOff className="h-20 w-20 text-red-500 mx-auto" strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Telemetry Synchronisation Lost
      </h1>
      
      <p className="max-w-md text-slate-500 dark:text-slate-400 mb-8">
        Your link to the global logistics network has been interrupted. 
        OmniTrack will automatically attempt to reconnect once your signal returns.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="outline">Try Reloading</Button>
        </Link>
        <div className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300">
          <ShieldAlert className="mr-2 h-4 w-4" />
          Offline-First Mode Active
        </div>
      </div>
    </div>
  );
}
