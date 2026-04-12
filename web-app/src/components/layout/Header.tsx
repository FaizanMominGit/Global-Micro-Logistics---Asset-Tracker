import { Search, Bell, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        <form className="relative flex w-full max-w-lg" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search</label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400 ml-2"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-10 w-full border-0 py-0 pl-10 pr-3 focus:ring-0 sm:text-sm bg-transparent shadow-none"
            placeholder="Search assets, shipments, or users..."
            type="search"
            name="search"
          />
        </form>
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6 ml-4">
        <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-sm font-semibold">{session?.user?.name || "Guest Access"}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {session ? (session.user as any).role : "Unregistered"}
            </span>
          </div>
          <div className="flex items-center p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            <User className="h-4 w-4" />
          </div>
          
          {session && (
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: '/login' });
            }}>
              <button 
                type="submit" 
                title="Disconnect from OmniTrack"
                className="flex items-center p-2 ml-1 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
