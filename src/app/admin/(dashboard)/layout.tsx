"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { adminNavItems } from "@/components/admin/nav-config";
import { AdminGuard } from "@/components/admin/admin-guard";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

function useCurrentCrumb() {
  const pathname = usePathname();
  return useMemo(() => {
    if (!pathname) return { label: "Admin", parentHref: null as string | null };
    const match = adminNavItems.find((i) =>
      pathname === i.href || pathname.startsWith(i.href.split("?")[0] ?? i.href)
    );
    if (!match) return { label: "Admin", parentHref: null };
    return { label: match.label, parentHref: "/admin/dashboard" };
  }, [pathname]);
}

function AdminTopbar() {
  const { signOut, user } = useAuth();
  const { label, parentHref } = useCurrentCrumb();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    window.location.href = "/admin";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="hidden md:flex" />
      <MobileSidebarTrigger />

      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {parentHref && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={parentHref}>Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search admin…"
            className="h-8 w-56 pl-8 text-sm"
            aria-label="Search admin"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
        </Button>

        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
          <Link href="/" target="_blank">
            <ExternalLink className="size-4" />
            View Store
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-1.5">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-[11px] font-semibold text-primary-foreground">
                  {user?.name?.charAt(0) ?? "S"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {user?.name ?? "Shahbaz Ahmad"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-sm font-medium">{user?.name ?? "Shahbaz Ahmad"}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.email ?? "shahbazahmad9783@gmail.com"}
              </span>
              <Badge variant="secondary" className="mt-1 w-fit">Store Owner</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <UserIcon className="size-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" target="_blank">
                <ExternalLink className="size-4" />
                View Storefront
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu className="size-4" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="flex min-h-svh flex-col bg-muted/20">
          <AdminTopbar />
          <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
