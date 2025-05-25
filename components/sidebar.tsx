"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Star, Calendar, Settings, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarLinkProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

function SidebarLink({ href, icon: Icon, children, active, onClick }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  )
}

interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Menu items shared between mobile and desktop sidebars
  const menuItems = (onItemClick?: () => void) => (
    <>
      <SidebarLink
        href="/account/dashboard"
        icon={Home}
        active={pathname === "/account/dashboard"}
        onClick={onItemClick}
      >
        Dashboard
      </SidebarLink>
      <SidebarLink href="/restaurants" icon={ShoppingBag} active={pathname === "/restaurants"} onClick={onItemClick}>
        Restaurants
      </SidebarLink>
      <SidebarLink
        href="/account/orders"
        icon={ShoppingBag}
        active={pathname === "/account/orders"}
        onClick={onItemClick}
      >
        My Orders
      </SidebarLink>
      <SidebarLink href="/loyalty" icon={Star} active={pathname === "/loyalty"} onClick={onItemClick}>
        Loyalty Program
      </SidebarLink>
      <SidebarLink href="/reservations" icon={Calendar} active={pathname === "/reservations"} onClick={onItemClick}>
        Reservations
      </SidebarLink>
      <SidebarLink
        href="/account/settings"
        icon={Settings}
        active={pathname === "/account/settings"}
        onClick={onItemClick}
      >
        Settings
      </SidebarLink>
    </>
  )

  return (
    <div className="flex">
      {/* Mobile sidebar trigger */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar-background border-r border-sidebar-accent/20 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-sidebar-accent/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="text-sidebar-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 px-2 py-4 overflow-auto">
                <nav className="space-y-1">{menuItems(() => setMobileOpen(false))}</nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-sidebar-background border-r border-sidebar-accent/20 pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <h1 className="text-xl font-bold text-sidebar-foreground">FoodConnect</h1>
          </div>
          <div className="flex-grow flex flex-col px-3">
            <nav className="flex-1 space-y-1">{menuItems()}</nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">{children}</div>
    </div>
  )
}
