import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Menu, ChevronDown, Bell, LifeBuoy } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Item = { to: string; label: string; roles?: Array<"PENSIONER" | "STAFF" | "ADMIN" | "*">; badge?: string };

const baseItems: Item[] = [
  { to: "/payments", label: "Payments", roles: ["PENSIONER", "ADMIN", "STAFF"] },
  { to: "/requests", label: "Requests", roles: ["PENSIONER", "ADMIN", "STAFF"], badge: "New" },
  { to: "/profile", label: "Profile", roles: ["PENSIONER", "ADMIN", "STAFF"] },
];

const staffItems: Item[] = [
  { to: "/admin/requests", label: "Requests Queue", roles: ["STAFF", "ADMIN"], badge: "Staff" },
];

const adminItems: Item[] = [
  { to: "/admin", label: "Dashboard", roles: ["ADMIN"] },
  { to: "/admin/users", label: "User Management", roles: ["ADMIN"] },
  { to: "/admin/reports", label: "Reports", roles: ["ADMIN"] },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white font-bold">N</div>
      <span className="hidden sm:inline text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        NSSF Portal
      </span>
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
              "px-3 py-2 rounded-md text-sm font-medium relative group",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            ].join(" ")
          }
        >
          {i.label}
          {i.badge && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {i.badge}
            </Badge>
          )}
          <span className={`
            absolute left-1/2 -bottom-1 w-0 h-0.5 bg-primary 
            transition-all duration-300 group-hover:w-4/5 
            ${isActive ? "w-4/5" : ""} 
            transform -translate-x-1/2
          `} />
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
      <SheetContent side="left" className="w-72 px-0">
        <div className="px-4 py-4">
          <Brand />
        </div>
        <Separator className="my-2" />
        <div className="grid gap-1 px-2">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                [
                  "px-4 py-3 rounded-md text-sm font-medium flex items-center justify-between",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                ].join(" ")
              }
            >
              <span>{i.label}</span>
              {i.badge && (
                <Badge variant="secondary" className="text-xs">
                  {i.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/support" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              Support Center
            </Link>
          </Button>
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
    return all.filter((i) => !i.roles || i.roles.includes("*") || (role && i.roles.includes(role)));
  }, [role]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav items={items} />
        <div className="md:flex"><Brand /></div>
        <div className="flex-1" />
        <TopNavLinks items={items} />
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <button className="relative p-2 rounded-full hover:bg-accent">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1 pr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {(user.full_name || user.email || "U").slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left text-sm leading-tight md:block">
                      <div className="font-medium line-clamp-1 max-w-[120px]">
                        {user.full_name || user.email}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">{user.role?.toLowerCase()}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user.role?.toLowerCase()}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/requests" className="w-full">
                        My Requests
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {role === "STAFF" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Staff</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/requests" className="w-full">
                          Requests Queue
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="w-full">
                          User Management
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/reports" className="w-full">
                          Reports
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => { logout(); nav("/", { replace: true }); }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}