// src/components/layout/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { useMemo } from "react";

type Item = { to: string; label: string; roles?: Array<"PENSIONER" | "STAFF" | "ADMIN" | "*"> };

const baseItems: Item[] = [
  { to: "/payments", label: "Payments", roles: ["PENSIONER", "ADMIN", "STAFF"] },
  { to: "/requests", label: "Requests", roles: ["PENSIONER", "ADMIN", "STAFF"] },
  { to: "/profile", label: "Profile",  roles: ["PENSIONER", "ADMIN", "STAFF"] },
];

const staffItems: Item[] = [
  { to: "/admin/requests", label: "Requests Queue", roles: ["STAFF", "ADMIN"] },
];

const adminItems: Item[] = [
  { to: "/admin", label: "Admin Dashboard", roles: ["ADMIN"] },
  { to: "/admin/users", label: "Users", roles: ["ADMIN"] },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">N</div>
      <span className="hidden sm:inline">NSSF Portal</span>
    </Link>
  );
}

function TopNavLinks({ items }: { items: Item[] }) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            [
              "px-3 py-2 rounded-md text-sm font-medium",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            ].join(" ")
          }
        >
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
}

function MobileNav({ items }: { items: Item[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="py-2">
          <Brand />
        </div>
        <Separator className="my-3" />
        <div className="grid gap-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                [
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                ].join(" ")
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;
  const logout = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  const items = useMemo(() => {
    let all = [...baseItems];
    if (role === "STAFF") all = [...all, ...staffItems];
    if (role === "ADMIN") all = [...all, ...staffItems, ...adminItems];
    // filter by role if roles specified
    return all.filter((i) => !i.roles || i.roles.includes("*") || (role && i.roles.includes(role)));
  }, [role]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <MobileNav items={items} />
        <div className="md:flex"><Brand /></div>
        <div className="flex-1" />
        <TopNavLinks items={items} />
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>
              <Button asChild size="sm" variant="outline"><Link to="/register">Register</Link></Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{(user.full_name || user.email || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left text-sm leading-tight md:block">
                    <div className="font-medium">{user.full_name || user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/requests">My requests</Link></DropdownMenuItem>
                {role === "STAFF" && (
                  <DropdownMenuItem asChild><Link to="/admin/requests">Requests queue</Link></DropdownMenuItem>
                )}
                {role === "ADMIN" && (
                  <>
                    <DropdownMenuItem asChild><Link to="/admin">Admin dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/admin/users">Users</Link></DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => { logout(); nav("/", { replace: true }); }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
