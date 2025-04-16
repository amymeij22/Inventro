"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AdminDashboardSkeleton } from "@/components/skeleton-loader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getDashboardStats, getBorrowingRequests } from "@/lib/api"
import type { BorrowingRequest } from "@/lib/supabase"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    pendingRequests: 0,
    completedRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState<BorrowingRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch dashboard stats
        const dashboardStats = await getDashboardStats()
        setStats(dashboardStats)

        // Fetch recent borrowing requests
        const requests = await getBorrowingRequests()
        setRecentRequests(requests.slice(0, 5)) // Get only the 5 most recent requests

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Gagal memuat data dashboard. Silakan coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return new Date(dateString).toLocaleDateString("id-ID", options)
  }

  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-500", text: "Menunggu" }
      case "approved":
        return { color: "bg-blue-500", text: "Disetujui" }
      case "rejected":
        return { color: "bg-red-500", text: "Ditolak" }
      case "completed":
        return { color: "bg-green-500", text: "Selesai" }
      default:
        return { color: "bg-secondary", text: status }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1">
        <main className="flex w-full flex-col overflow-hidden pb-16 md:pb-0">
          {isLoading ? (
            <AdminDashboardSkeleton />
          ) : (
            <div className="flex-1 space-y-6 pt-2 pb-10 md:pb-0">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard Admin</h2>
                    <p className="text-muted-foreground">Selamat datang di panel admin Inventro</p>
                  </div>
                  <Button variant="outline" className="hidden md:flex" asChild>
                    <Link href="/admin/inventaris">
                      <Package className="h-4 w-4 mr-2" />
                      Manajemen Inventaris
                    </Link>
                  </Button>
                </div>

                {/* Button for mobile display */}
                <Button variant="outline" className="md:hidden w-fit" asChild>
                  <Link href="/admin/inventaris">
                    <Package className="h-4 w-4 mr-2" />
                    Manajemen Inventaris
                  </Link>
                </Button>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Kartu Statistik */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventaris</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                    <p className="text-xs text-muted-foreground">Item dalam database</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Barang Tersedia</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.availableItems}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalItems > 0
                        ? `${Math.round((stats.availableItems / stats.totalItems) * 100)}% dari total inventaris`
                        : "0% dari total inventaris"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Permintaan Tertunda</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                    <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peminjaman Selesai</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedRequests}</div>
                    <p className="text-xs text-muted-foreground">Bulan ini</p>
                  </CardContent>
                </Card>
              </div>

              {/* Permintaan Peminjaman Terbaru */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Permintaan Terbaru</h3>
                  <Button asChild>
                    <Link href="/admin/peminjaman">Lihat Semua</Link>
                  </Button>
                </div>
                {recentRequests.length === 0 ? (
                  <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground">Tidak ada permintaan peminjaman terbaru</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Nama</th>
                            <th className="px-4 py-3 text-left font-medium">NPT</th>
                            <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-right font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentRequests.map((request) => (
                            <tr key={request.id} className="border-b">
                              <td className="px-4 py-3">{request.name}</td>
                              <td className="px-4 py-3">{request.npt}</td>
                              <td className="px-4 py-3">
                                {formatDate(request.start_date)} - {formatDate(request.end_date)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={getStatusBadge(request.status).color}>
                                  {getStatusBadge(request.status).text}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/admin/peminjaman?id=${request.id}`}>Detail</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
