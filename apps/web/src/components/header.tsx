import { Link, useRouterState } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { cn } from "@/lib/utils";

export default function Header() {
  const routerState = useRouterState();
  const links = [
    { to: "/", label: "Codex" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="navbar-glass mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-5">
        <nav className="flex items-center gap-0.5 rounded-xl p-0.5">
          {links.map(({ to, label }) => {
            const isActive =
              routerState.location.pathname === to ||
              (to !== "/" && routerState.location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1.5 rounded-xl p-0.5">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
