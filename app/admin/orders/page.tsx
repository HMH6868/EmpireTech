import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminOrdersPage() {
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "ChatGPT Plus",
      amount: "$15.99",
      status: "Completed",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "Canva Pro",
      amount: "$12.99",
      status: "Pending",
      date: "2024-01-15",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "Netflix Premium",
      amount: "$9.99",
      status: "Completed",
      date: "2024-01-14",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      product: "Spotify Premium",
      amount: "$6.99",
      status: "Completed",
      date: "2024-01-14",
    },
    {
      id: "ORD-005",
      customer: "Tom Brown",
      product: "Google Drive Unlimited",
      amount: "$8.99",
      status: "Processing",
      date: "2024-01-14",
    },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="mt-2 text-muted-foreground">View and manage all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{order.id}</td>
                    <td className="py-3 text-sm">{order.customer}</td>
                    <td className="py-3 text-sm">{order.product}</td>
                    <td className="py-3 text-sm font-medium">{order.amount}</td>
                    <td className="py-3 text-sm">{order.date}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          order.status === "Completed"
                            ? "default"
                            : order.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
