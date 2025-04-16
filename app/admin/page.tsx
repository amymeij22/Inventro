"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getClientSupabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = getClientSupabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Check if user has admin role
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (!error && userData && userData.role === 'admin') {
          router.push("/admin/dashboard")
        } else {
          // Sign out if not admin
          await supabase.auth.signOut()
        }
      }
    }
    
    checkSession()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.session) {
        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single()
        
        if (userError || !userData || userData.role !== 'admin') {
          // Logout if not admin
          await supabase.auth.signOut()
          setError("Anda tidak memiliki akses ke panel admin")
          return
        }

        toast({
          title: "Login berhasil",
          description: "Selamat datang di panel admin",
        })
        router.push("/admin/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login Admin</CardTitle>
            <CardDescription>Masukkan kredensial untuk mengakses panel admin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Inventro - Lab Elektronika STMKG
          </p>
        </div>
      </footer>
    </div>
  )
}
