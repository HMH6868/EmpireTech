"use client"

import { useState } from "react"
import { Eye, Search, Shield, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminUsers, type AdminUser } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const [userList, setUserList] = useState(adminUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChangeRole = (userId: string, newRole: "user" | "admin") => {
    setUserList(userList.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const handleToggleStatus = (userId: string) => {
    setUserList(
      userList.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "banned" : "active" } : user,
      ),
    )
  }

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="mt-2 text-muted-foreground">View and manage user accounts, roles, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{user.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? (
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </span>
                        ) : (
                          "User"
                        )}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status === "active" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Ban className="h-3 w-3" />
                            Banned
                          </span>
                        )}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{user.createdAt}</td>
                    <td className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, "admin")}
                            disabled={user.role === "admin"}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, "user")}
                            disabled={user.role === "user"}
                          >
                            Make User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id)}
                            className={user.status === "active" ? "text-destructive" : ""}
                          >
                            {user.status === "active" ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unban User
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the selected user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedUser.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Email:</span>
                <span className="col-span-2">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Role:</span>
                <span className="col-span-2">
                  <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>{selectedUser.role}</Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  <Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
                    {selectedUser.status}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Created:</span>
                <span className="col-span-2">{selectedUser.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
