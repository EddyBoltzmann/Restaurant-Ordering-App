// Simple service to handle menu change notifications
export type MenuChangeType = "addition" | "removal" | "modification" | "promotion"

export interface MenuChangeNotification {
  type: MenuChangeType
  itemName: string
  restaurantId: string
  restaurantName: string
  timestamp: number
  details?: string
}

class MenuNotificationService {
  private static instance: MenuNotificationService
  private subscribers: ((notification: MenuChangeNotification) => void)[] = []

  // Get singleton instance
  public static getInstance(): MenuNotificationService {
    if (!MenuNotificationService.instance) {
      MenuNotificationService.instance = new MenuNotificationService()
    }
    return MenuNotificationService.instance
  }

  // Subscribe to menu notifications
  public subscribe(callback: (notification: MenuChangeNotification) => void) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  // Notify subscribers about menu changes
  public notify(notification: MenuChangeNotification) {
    this.subscribers.forEach((subscriber) => subscriber(notification))

    // In a real implementation, this would also send push notifications,
    // store the notification in a database, etc.
    console.log("Menu notification:", notification)
  }

  // Helper method to create different types of notifications
  public createNotification(
    type: MenuChangeType,
    itemName: string,
    restaurantId: string,
    restaurantName: string,
    details?: string,
  ): MenuChangeNotification {
    return {
      type,
      itemName,
      restaurantId,
      restaurantName,
      timestamp: Date.now(),
      details,
    }
  }

  // Add a method to get all notifications for a user
  public getAllNotificationsForUser(userId: string): MenuChangeNotification[] {
    // In a real app, you would fetch from a database
    // This is just a stub that returns an empty array
    return []
  }

  // Add a method to mark notifications as read
  public markAsRead(notificationIds: string[]): void {
    // In a real app, you would update the database
    console.log("Marking notifications as read:", notificationIds)
  }

  // Add a method to create a promotion notification
  public createPromotionNotification(
    itemName: string,
    restaurantId: string,
    restaurantName: string,
    details?: string,
  ): MenuChangeNotification {
    return this.createNotification("promotion", itemName, restaurantId, restaurantName, details)
  }
}

export default MenuNotificationService
