"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Bell } from "lucide-react"
import MenuNotificationService, { type MenuChangeNotification } from "@/lib/menu-notification-service"

export function MenuNotificationButton() {
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Subscribe to menu notifications
    const notificationService = MenuNotificationService.getInstance()

    const unsubscribe = notificationService.subscribe((notification) => {
      // Update notification count
      setNotificationCount((prev) => prev + 1)

      // Show toast notification
      toast({
        title: getNotificationTitle(notification),
        description: notification.details || getDefaultDescription(notification),
        action: (
          <Button variant="outline" size="sm" onClick={() => setNotificationCount(0)}>
            Clear
          </Button>
        ),
      })
    })

    // Cleanup subscription
    return () => {
      unsubscribe()
    }
  }, [])

  function getNotificationTitle(notification: MenuChangeNotification): string {
    switch (notification.type) {
      case "addition":
        return `New item added at ${notification.restaurantName}`
      case "removal":
        return `Item removed from ${notification.restaurantName}`
      case "modification":
        return `Menu item updated at ${notification.restaurantName}`
      case "promotion":
        return `New promotion at ${notification.restaurantName}`
      default:
        return "Menu notification"
    }
  }

  function getDefaultDescription(notification: MenuChangeNotification): string {
    switch (notification.type) {
      case "addition":
        return `${notification.itemName} has been added to the menu.`
      case "removal":
        return `${notification.itemName} has been removed from the menu.`
      case "modification":
        return `${notification.itemName} has been updated.`
      case "promotion":
        return `Special promotion for ${notification.itemName} is now available.`
      default:
        return "Menu has been updated."
    }
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Menu Notifications" className="relative">
      <Bell className="h-5 w-5" />
      {notificationCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
          {notificationCount}
        </span>
      )}
    </Button>
  )
}
