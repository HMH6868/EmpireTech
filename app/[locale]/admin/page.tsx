import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,428",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: "2,540",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Orders Today",
      value: "48",
      change: "+23.1%",
      icon: ShoppingCart,
      color: "text-orange-600",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+4.3%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", product: "ChatGPT Plus", amount: "$15.99", status: "Completed" },
    { id: "ORD-002", customer: "Jane Smith", product: "Canva Pro", amount: "$12.99", status: "Pending" },
    { id: "ORD-003", customer: "Mike Johnson", product: "Netflix Premium", amount: "$9.99", status: "Completed" },
    { id: "ORD-004", customer: "Sarah Williams", product: "Spotify Premium", amount: "$6.99", status: "Completed" },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{order.id}</td>
                    <td className="py-3 text-sm">{order.customer}</td>
                    <td className="py-3 text-sm">{order.product}</td>
                    <td className="py-3 text-sm font-medium">{order.amount}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {order.status}
                      </span>
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
