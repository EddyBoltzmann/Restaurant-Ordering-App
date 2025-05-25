"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const mockOrder = {
  total: 42.0,
}

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState<string | null>(null)

  const handlePaymentConfirm = () => {
    // Simulate payment processing
    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`
      setOrderId(newOrderId)

      toast({
        title: "Order Confirmed",
        description: `Your order #${newOrderId} has been placed successfully.`,
      })
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Confirm your order and payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="Your Name" type="text" />
            </div>
            <div className="space-y-2">
              <label htmlFor="card">Card Number</label>
              <Input id="card" placeholder="**** **** **** ****" type="text" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          Total: ${mockOrder.total}
          <Button onClick={handlePaymentConfirm} disabled={!!orderId}>
            {orderId ? `Order Confirmed: ${orderId}` : "Confirm Payment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
