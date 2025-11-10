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
import { useLanguage } from "@/hooks/use-language"

export default function UserOrdersPage() {
  const { language, currency, formatCurrency } = useLanguage()
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredOrders = selectedFilter === "all" ? orders : orders.filter((order) => order.status === selectedFilter)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{language === "vi" ? "Đơn hàng của tôi" : "My Orders"}</h1>
            <p className="mt-2 text-muted-foreground">
              {language === "vi" ? "Theo dõi lịch sử mua hàng của bạn" : "View and manage your purchase history"}
            </p>
          </div>

          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">{language === "vi" ? "Tất cả" : "All Orders"}</TabsTrigger>
              <TabsTrigger value="completed">{language === "vi" ? "Hoàn tất" : "Completed"}</TabsTrigger>
              <TabsTrigger value="pending">{language === "vi" ? "Đang xử lý" : "Pending"}</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedFilter} className="mt-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {language === "vi" ? "Không có đơn hàng" : "No orders found"}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      {language === "vi" ? "Bạn chưa có đơn hàng nào." : "You haven't placed any orders yet."}
                    </p>
                    <Link href="/accounts">
                      <Button>{language === "vi" ? "Bắt đầu mua sắm" : "Start Shopping"}</Button>
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
                              <h3 className="text-lg font-semibold">
                                {language === "vi" ? "Đơn hàng" : "Order"} #{order.id}
                              </h3>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {order.status === "completed"
                                  ? language === "vi"
                                    ? "Hoàn tất"
                                    : "Completed"
                                  : order.status === "pending"
                                    ? language === "vi"
                                      ? "Đang xử lý"
                                      : "Pending"
                                    : language === "vi"
                                      ? "Đã huỷ"
                                      : "Cancelled"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {language === "vi" ? "Tạo ngày" : "Placed on"} {order.createdAt}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {order.items.length}{" "}
                              {language === "vi"
                                ? order.items.length > 1
                                  ? "sản phẩm"
                                  : "sản phẩm"
                                : order.items.length > 1
                                  ? "items"
                                  : "item"}
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
                                  <DialogDescription>
                                    {language === "vi" ? "Đặt ngày" : "Order placed on"} {order.createdAt}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Order Items */}
                                  <div>
                                    <h4 className="mb-3 font-semibold">
                                      {language === "vi" ? "Sản phẩm" : "Items"}
                                    </h4>
                                    <div className="space-y-3">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 rounded-lg border p-3">
                                          <div className="flex-1">
                                            <p className="font-medium">{item.name[language]}</p>
                                            {item.variant && (
                                              <p className="text-sm text-muted-foreground">{item.variant[language]}</p>
                                            )}
                                            <p className="mt-1 text-sm font-semibold">
                                              {formatCurrency(item.price[currency], { currency })}
                                            </p>
                                            {item.credentials && order.status === "completed" && (
                                              <div className="mt-2 rounded bg-muted p-2">
                                                <p className="text-xs font-medium">
                                                  {language === "vi" ? "Thông tin tài khoản:" : "Credentials:"}
                                                </p>
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
                                      <h4 className="mb-2 font-semibold">
                                        {language === "vi" ? "Thông tin giao hàng" : "Delivery Information"}
                                      </h4>
                                      <div className="rounded-lg border p-3">
                                        <p className="text-sm">
                                          <span className="text-muted-foreground">
                                            {language === "vi" ? "Email nhận hàng:" : "Delivery Email:"}
                                          </span>{" "}
                                          {order.deliveryEmail}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Total */}
                                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                    <span>{language === "vi" ? "Thành tiền" : "Total"}</span>
                                    <span>{formatCurrency(order.total[currency], { currency })}</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {order.status === "completed" && (
                              <Button size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                {language === "vi" ? "Tải xuống" : "Download"}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                              <p className="text-sm">{item.name[language]}</p>
                              {item.variant && (
                                <span className="text-xs text-muted-foreground">({item.variant[language]})</span>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center rounded-lg border bg-muted/30 px-3 py-2">
                              <p className="text-sm text-muted-foreground">
                                +{order.items.length - 3} {language === "vi" ? "sản phẩm khác" : "more"}
                              </p>
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
