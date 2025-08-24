"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { showError, showSuccess, showInfo, showWarning } from "@/hooks/use-toast"
import { Lock, User, Mail, Shield, Wifi, Loader2 } from "lucide-react"

// Extend the User type to include trustedIp
interface ExtendedUser {
  id: number
  name: string
  email: string
  password?: string
  role: "ADMINISTRATOR" | "EDITOR" | "READER"
  department?: string
  trustedIp?: string
}

export default function ProfilePage() {
  const { state, addRecentActivity } = useApp()
  const { user, updateCurrentUser } = useAuthStore() as any

  const currentUser = user as ExtendedUser | null

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false)

  const [newIpAddress, setNewIpAddress] = useState(currentUser?.trustedIp || "")
  const [isIpUpdateLoading, setIsIpUpdateLoading] = useState(false)
  const [autoDetectingIp, setAutoDetectingIp] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsPasswordChangeLoading(true)

    if (currentPassword !== currentUser.password) {
      showError({
        title: "Password Change Error",
        description: "Current password is incorrect."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      showError({
        title: "Password Change Error",
        description: "New password and confirmation do not match."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    if (newPassword.length < 6) {
      showError({
        title: "Password Change Error",
        description: "New password must be at least 6 characters long."
      })
      setIsPasswordChangeLoading(false)
      return
    }

    // Simulate a delay for better UX
    setTimeout(() => {
      updateCurrentUser({ password: newPassword })

      addRecentActivity({
        type: "Password Change",
        description: `Password changed for user ${currentUser.name} (${currentUser.role}).`,
        date: new Date().toLocaleString(),
        details: { userId: currentUser.id, userName: currentUser.name },
      })
      showSuccess({
        title: "Password Updated",
        description: "Your password has been changed successfully."
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      setIsPasswordChangeLoading(false)
    }, 800)
  }

  const handleIpUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsIpUpdateLoading(true)

    // Basic IP validation (can be more robust)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    if (newIpAddress && !ipRegex.test(newIpAddress)) {
      showError({
        title: "IP Update Error",
        description: "Invalid IP address format."
      })
      setIsIpUpdateLoading(false)
      return
    }

    // Simulate a delay for better UX
    setTimeout(() => {
      // Use any to avoid type issues with trustedIp
      updateCurrentUser({ trustedIp: newIpAddress } as any)

      addRecentActivity({
        type: "Trusted IP Update",
        description: `Trusted IP for user ${currentUser.name} (${currentUser.role}) updated to ${newIpAddress || "N/A"}.`,
        date: new Date().toLocaleString(),
        details: { userId: currentUser.id, userName: currentUser.name, newIp: newIpAddress },
      })
      showSuccess({
        title: "Trusted IP Updated",
        description: "The trusted IP address has been updated successfully."
      })

      setIsIpUpdateLoading(false)
    }, 800)
  }

  const handleAutoDetectIp = () => {
    setAutoDetectingIp(true)

    // Immediate progress toast
    showInfo({
      title: "Detecting IP...",
      description: "Checking current IP address"
    })

    // Simulate automatic IP detection with validation
    setTimeout(() => {
      const simulatedIp = "192.168.1." + Math.floor(Math.random() * 255)
      setNewIpAddress(simulatedIp)
      setAutoDetectingIp(false)

      // Validate that detected IP is not the same as current
      if (currentUser?.trustedIp === simulatedIp) {
        showWarning({
          title: "No IP Changes",
          description: "The detected IP is the same as your current configuration"
        })
      } else {
        showSuccess({
          title: "IP Automatically Detected",
          description: `New IP found: ${simulatedIp}`
        })
      }
    }, 1500)
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading user information...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Information */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label>Name</Label>
              <p className="text-lg font-medium">{currentUser.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {currentUser.email}
              </p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {currentUser.role}
              </p>
            </div>
            {currentUser.department && (
              <div>
                <Label>Department</Label>
                <p className="text-lg font-medium">{currentUser.department}</p>
              </div>
            )}
            <div>
              <Label>Status</Label>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-muted/40">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full transition-colors duration-200"
                disabled={isPasswordChangeLoading}
              >
                {isPasswordChangeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPasswordChangeLoading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Assign Trusted IP (Only for Administrators/Editors) */}
        {(currentUser.role === "ADMINISTRATOR" || currentUser.role === "EDITOR") && (
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/40">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                Trusted IP
              </CardTitle>
              <CardDescription>Assign an IP address for quick access without full authentication.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleIpUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trusted-ip">Trusted IP Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="trusted-ip"
                      type="text"
                      placeholder="e.g. 192.168.1.100"
                      value={newIpAddress}
                      onChange={(e) => setNewIpAddress(e.target.value)}
                      className="focus:ring-2 focus:ring-primary transition-colors duration-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutoDetectIp}
                      disabled={autoDetectingIp}
                    >
                      {autoDetectingIp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Detect"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Leave empty to disable trusted IP.</p>
                </div>
                <Button
                  type="submit"
                  className="w-full transition-colors duration-200"
                  disabled={isIpUpdateLoading}
                >
                  {isIpUpdateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isIpUpdateLoading ? "Updating..." : "Update IP"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  (Note: In a real environment, your IP would be detected automatically. This is a simulation.)
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
