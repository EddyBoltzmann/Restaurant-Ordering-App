"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { MenuNotificationButton } from "@/components/menu-notification"

export function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-8">
            FoodConnect
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/restaurants" className="text-sm font-medium transition-colors hover:text-primary">
              Restaurants
            </Link>
            <Link href="/loyalty" className="text-sm font-medium transition-colors hover:text-primary">
              Loyalty
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <MenuNotificationButton />

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {user ? (
            <div className="relative group">
              <Button variant="ghost" size="icon" aria-label="User Account">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-background border hidden group-hover:block">
                <div className="px-4 py-2 text-sm border-b">
                  Signed in as <span className="font-medium">{user.username}</span>
                </div>
                <Link href="/account/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">
                  Dashboard
                </Link>
                <Link href="/account/payments" className="block px-4 py-2 text-sm hover:bg-muted">
                  Payment Methods
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">
                    Admin Dashboard
                  </Link>
                )}
                {user.role === "developer" && (
                  <Link href="/developer/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">
                    Developer Dashboard
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-500"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/account/login">
              <Button variant="ghost" size="icon" aria-label="User Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/restaurants" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                  Restaurants
                </Link>
                <Link href="/loyalty" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                  Loyalty
                </Link>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                  Contact
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/account/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium"
                    >
                      Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === "developer" && (
                      <Link
                        href="/developer/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-medium"
                      >
                        Developer Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="text-lg font-medium text-left text-red-500"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link href="/account/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">
                    Sign in
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
