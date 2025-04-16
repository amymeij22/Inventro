"use client"

import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getClientSupabaseClient } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Check if we're in the admin section
  const isAdminPage = pathname?.startsWith('/admin') && pathname !== '/admin'
  const isAdminLoginPage = pathname === '/admin'

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Call our server-side logout API endpoint with the new path
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Logout failed')
      }
      
      // Clear any local storage items as well
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari panel admin",
      })
      
      // Force refresh to ensure state is fully reset
      router.refresh()
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
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Show MainNav only when not on the admin login page */}
        {isAdminLoginPage ? (
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl">Inventro</Link>
          </div>
        ) : (
          <MainNav />
        )}
        
        {/* Right-aligned container with conditional order of elements */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <>
              <ModeToggle /> {/* Toggle is on the left of logout button on admin pages */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            /* Toggle is on the right (alone) on login page */
            <ModeToggle />
          )}
        </div>
      </div>
    </header>
  )
}
