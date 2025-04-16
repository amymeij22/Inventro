"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ClipboardList, FileText, Clock, LogOut } from "lucide-react"
import { getClientSupabaseClient } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Inventaris",
      href: "/admin/inventaris",
      icon: Package,
    },
    {
      title: "Peminjaman",
      href: "/admin/peminjaman",
      icon: ClipboardList,
    },
    {
      title: "Penggunaan Lab",
      href: "/admin/penggunaan-lab",
      icon: Clock,
    },
    {
      title: "Laporan",
      href: "/admin/laporan",
      icon: FileText,
    },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const supabase = getClientSupabaseClient()
      await supabase.auth.signOut()
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari panel admin",
      })
      router.push('/admin')
    } catch (error) {
      console.error("Error during logout:", error)
      toast({
        title: "Logout gagal",
        description: "Terjadi kesalahan saat mencoba keluar",
        variant: "destructive"
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="hidden w-[220px] flex-col md:flex lg:w-[240px]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-transparent hover:underline",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
            
            <div className="pt-6">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
