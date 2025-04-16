"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getClientSupabaseClient } from "@/lib/supabase"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  
  // Skip auth check for the main login page
  const isLoginPage = pathname === '/admin'

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (isLoginPage) {
        setLoading(false)
        return
      }
      
      const supabase = getClientSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin')
        return
      }

      // Verify admin role
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !userData || userData.role !== 'admin') {
        await supabase.auth.signOut()
        router.push('/admin')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, isLoginPage])

  // Return children directly for login page
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}