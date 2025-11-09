"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Eye, Package } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { orders } from "@/lib/mock-data"

export default function UserOrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredOrders = selectedFilter === "all" ? orders : orders.filter((order) => order.status === selectedFilter)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-muted-foreground">View and manage your purchase history</p>
          </div>

          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedFilter} className="mt-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No orders found</h3>
                    <p className="mb-4 text-muted-foreground">You haven't placed any orders yet.</p>
                    <Link href="/accounts">
                      <Button>Start Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Placed on {order.createdAt}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details - #{order.id}</DialogTitle>
                                  <DialogDescription>Order placed on {order.createdAt}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Order Items */}
                                  <div>
                                    <h4 className="mb-3 font-semibold">Items</h4>
                                    <div className="space-y-3">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 rounded-lg border p-3">
                                          <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            {item.variant && (
                                              <p className="text-sm text-muted-foreground">{item.variant}</p>
                                            )}
                                            <p className="mt-1 text-sm font-semibold">${item.price}</p>
                                            {item.credentials && order.status === "completed" && (
                                              <div className="mt-2 rounded bg-muted p-2">
                                                <p className="text-xs font-medium">Credentials:</p>
                                                <p className="text-xs font-mono">{item.credentials}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Delivery Info */}
                                  {order.deliveryEmail && (
                                    <div>
                                      <h4 className="mb-2 font-semibold">Delivery Information</h4>
                                      <div className="rounded-lg border p-3">
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">Delivery Email:</span>{" "}
                                          {order.deliveryEmail}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Total */}
                                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {order.status === "completed" && (
                              <Button size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                              <p className="text-sm">{item.name}</p>
                              {item.variant && <span className="text-xs text-muted-foreground">({item.variant})</span>}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center rounded-lg border bg-muted/30 px-3 py-2">
                              <p className="text-sm text-muted-foreground">+{order.items.length - 3} more</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
