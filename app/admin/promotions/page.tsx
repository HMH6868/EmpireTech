"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { promotions } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminPromotionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    status: "active",
    usageLimit: "",
  })

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Promotion created!",
      description: `Promo code "${formData.code}" has been created.`,
    })
    setIsCreateOpen(false)
    setFormData({
      code: "",
      description: "",
      discountPercent: "",
      startDate: "",
      endDate: "",
      status: "active",
      usageLimit: "",
    })
  }

  const handleDelete = (id: string) => {
    toast({
      title: "Promotion deleted",
      description: "The promotion has been permanently deleted.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 bg-muted/30 p-8 md:ml-64">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions Management</h1>
            <p className="mt-2 text-muted-foreground">Manage discount codes and special offers</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>Add a new discount code or special offer</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Promo Code *</Label>
                    <Input
                      id="code"
                      placeholder="SUMMER2024"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount Percent *</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="20"
                      min="1"
                      max="100"
                      value={formData.discountPercent}
                      onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="Summer Sale - 20% off everything"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      placeholder="1000"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Promotion</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              All Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No promotions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPromotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-mono font-semibold">{promo.code}</TableCell>
                        <TableCell>{promo.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{promo.discountPercent}% OFF</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {promo.startDate} to {promo.endDate}
                        </TableCell>
                        <TableCell>
                          {promo.usageLimit ? `${promo.usedCount} / ${promo.usageLimit}` : "Unlimited"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              promo.status === "active"
                                ? "default"
                                : promo.status === "scheduled"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {promo.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(promo.id)}>
                              <Trash2 className="h-4 w-4" />
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
        </Card>
      </main>
    </div>
  )
}
