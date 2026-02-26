"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, LogOut, Menu, X, LayoutDashboard, Ticket, ChevronDown } from "lucide-react";
import { clearAuth, getRole, getUserEmail, isLoggedIn } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "CLIENT" | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setRole(getRole());
    setEmail(getUserEmail());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-foreground">Event<span className="text-primary">Hub</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/events" active={pathname.startsWith("/events")}>
            Events
          </NavLink>
          {role === "ADMIN" && (
            <NavLink href="/admin" active={pathname.startsWith("/admin")}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
                  {email?.[0] ?? "?"}
                </span>
                <span className="hidden lg:block max-w-[160px] truncate">{email}</span>
                {role && (
                  <span className={cn(
                    "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded",
                    role === "ADMIN" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  )}>
                    {role}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/85 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-4">
          <Link href="/events" className="text-sm text-foreground" onClick={() => setMenuOpen(false)}>
            Events
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin" className="text-sm text-foreground" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          <hr className="border-border" />
          {loggedIn ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-sm text-left text-destructive"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-foreground" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="text-sm text-primary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
        active
          ? "bg-secondary text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      {children}
    </Link>
  );
}
