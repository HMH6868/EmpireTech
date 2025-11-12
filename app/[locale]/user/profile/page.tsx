"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Lock, Camera } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function UserProfilePage() {
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Password changed!",
      description: "Your password has been successfully updated.",
    })
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold">{profileData.name}</h3>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/user/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/user/orders">
                        <Mail className="mr-2 h-4 w-4" />
                        My Orders
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/user/courses">
                        <Lock className="mr-2 h-4 w-4" />
                        My Courses
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="profile">Profile Info</TabsTrigger>
                  <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          />
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="password" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit">Update Password</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
