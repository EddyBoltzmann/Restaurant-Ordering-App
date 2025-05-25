"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import MenuNotificationService from "@/lib/menu-notification-service"

// Mock menu item data
const mockMenuItems = [
  {
    id: "item-001",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "pizza",
    restaurantId: "1",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "item-002",
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.5,
    category: "pasta",
    restaurantId: "1",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "item-003",
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in a creamy tomato sauce with Indian spices",
    price: 16.99,
    category: "curry",
    restaurantId: "2",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "item-004",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
    price: 10.99,
    category: "burger",
    restaurantId: "3",
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Categories for menu items
const categories = [
  { value: "pizza", label: "Pizza" },
  { value: "pasta", label: "Pasta" },
  { value: "burger", label: "Burger" },
  { value: "curry", label: "Curry" },
  { value: "salad", label: "Salad" },
  { value: "dessert", label: "Dessert" },
  { value: "beverage", label: "Beverage" },
]

export function MenuManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const notificationService = MenuNotificationService.getInstance()
  const [menuItems, setMenuItems] = useState(mockMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof mockMenuItems)[0] | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  // Filter menu items based on user role and restaurant
  const filteredMenuItems = menuItems.filter((item) => {
    // If admin user with a restaurant, only show their restaurant's items
    if (user?.role === "admin" && user.restaurantId) {
      if (item.restaurantId !== user.restaurantId) return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(newItem.price)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      })
      return
    }

    const newMenuItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: price,
      category: newItem.category,
      restaurantId: user?.restaurantId || "1",
      image: newItem.image || "/placeholder.svg?height=100&width=100",
    }

    setMenuItems([...menuItems, newMenuItem])
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    })
    setIsAddDialogOpen(false)

    // Send notification about the new menu item
    notificationService.notify(
      notificationService.createNotification(
        "addition",
        newMenuItem.name,
        user?.restaurantId || "1",
        user?.restaurantName || "Restaurant",
        `New item added to the ${newItem.category} category.`,
      ),
    )

    toast({
      title: "Item Added",
      description: "The menu item has been added successfully.",
    })
  }

  const handleEditItem = () => {
    if (!selectedItem) return

    if (!selectedItem.name || !selectedItem.price || !selectedItem.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setMenuItems(menuItems.map((item) => (item.id === selectedItem.id ? selectedItem : item)))
    setIsEditDialogOpen(false)
    setSelectedItem(null)

    // Send notification about the updated menu item
    notificationService.notify(
      notificationService.createNotification(
        "modification",
        selectedItem.name,
        user?.restaurantId || "1",
        user?.restaurantName || "Restaurant",
        `Menu item updated in the ${selectedItem.category} category.`,
      ),
    )

    toast({
      title: "Item Updated",
      description: "The menu item has been updated successfully.",
    })
  }

  const handleDeleteItem = () => {
    if (!selectedItem) return

    setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id))
    setIsDeleteDialogOpen(false)
    setSelectedItem(null)

    // Send notification about the deleted menu item
    notificationService.notify(
      notificationService.createNotification(
        "removal",
        selectedItem.name,
        user?.restaurantId || "1",
        user?.restaurantName || "Restaurant",
        `Item removed from the menu.`,
      ),
    )

    toast({
      title: "Item Deleted",
      description: "The menu item has been deleted successfully.",
    })
  }

  const handleCreatePromotion = () => {
    if (!selectedItem) return

    // Send notification about the promotion
    notificationService.notify(
      notificationService.createPromotionNotification(
        selectedItem.name,
        user?.restaurantId || "1",
        user?.restaurantName || "Restaurant",
        `Special promotion: ${selectedItem.name} is now featured!`,
      ),
    )

    toast({
      title: "Promotion Created",
      description: `${selectedItem.name} has been promoted.`,
    })

    setIsEditDialogOpen(false)
    setSelectedItem(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Menu Manager</CardTitle>
          <CardDescription>Add, edit, and remove menu items</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>Create a new menu item. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddItem}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No menu items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMenuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{categories.find((c) => c.value === item.category)?.label || item.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Make changes to the menu item. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={selectedItem.price}
                  onChange={(e) => setSelectedItem({ ...selectedItem, price: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={selectedItem.category}
                  onValueChange={(value) => setSelectedItem({ ...selectedItem, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="edit-image"
                  value={selectedItem.image}
                  onChange={(e) => setSelectedItem({ ...selectedItem, image: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCreatePromotion}>
              Create Promotion
            </Button>
            <Button type="submit" onClick={handleEditItem}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <p>
                <span className="font-medium">Item:</span> {selectedItem.name}
              </p>
              <p>
                <span className="font-medium">Price:</span> ${selectedItem.price.toFixed(2)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
