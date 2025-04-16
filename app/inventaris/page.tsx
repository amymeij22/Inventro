"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { InventoryPageSkeleton } from "@/components/skeleton-loader"
import { getInventoryItems, getCategories } from "@/lib/api"
import type { InventoryItem, Category } from "@/lib/supabase"

// Fungsi untuk mendapatkan teks status dalam Bahasa Indonesia
const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Tersedia"
    case "limited":
      return "Terbatas"
    case "unavailable":
      return "Tidak Tersedia"
    default:
      return status
  }
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data inventaris dan kategori
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch kategori
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Fetch inventaris dengan filter
        const categoryId = categoryFilter !== "all" ? Number.parseInt(categoryFilter) : undefined
        const status = statusFilter !== "all" ? statusFilter : undefined
        const items = await getInventoryItems(searchQuery || undefined, categoryId, status)
        setInventoryItems(items)

        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Gagal memuat data. Silakan coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, categoryFilter, statusFilter])

  // Handler untuk pencarian
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handler untuk filter kategori
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
  }

  // Handler untuk filter status
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<InventoryPageSkeleton />}>
          <div className="container py-8">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">Inventaris Lab Elektronika</h1>
              <p className="text-muted-foreground">Daftar barang yang tersedia di Laboratorium Elektronika STMKG</p>

              {/* Filter dan Pencarian */}
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari barang..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="available">Tersedia</SelectItem>
                    <SelectItem value="limited">Terbatas</SelectItem>
                    <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pesan Error */}
              {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

              {/* Daftar Inventaris */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="h-6 w-24 bg-muted rounded"></div>
                          <div className="h-6 w-16 bg-muted rounded-full"></div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-24 bg-muted rounded"></div>
                      </CardContent>
                      <CardFooter className="p-4">
                        <div className="h-9 w-full bg-muted rounded"></div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : inventoryItems.length === 0 ? (
                <div className="text-center p-8 border rounded-lg mt-6">
                  <p className="text-muted-foreground">Tidak ada barang yang ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                  {inventoryItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <Badge
                            variant={
                              item.status === "available"
                                ? "default"
                                : item.status === "limited"
                                  ? "outline"
                                  : "secondary"
                            }
                            className={
                              item.status === "available"
                                ? "bg-green-500"
                                : item.status === "limited"
                                  ? "border-yellow-500 text-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Kategori: {item.categories?.name || "Tidak ada kategori"}
                        </p>
                        <p className="text-sm">
                          Jumlah: {item.available_quantity} / {item.total_quantity} unit
                        </p>
                        {item.location && <p className="text-sm text-muted-foreground mt-1">Lokasi: {item.location}</p>}
                      </CardContent>
                      <CardFooter className="p-4">
                        <Button variant="outline" className="w-full" disabled={item.status === "unavailable"} asChild>
                          <Link href={`/peminjaman?item=${item.id}`}>
                            {item.status === "unavailable" ? "Tidak Tersedia" : "Pinjam"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Suspense>
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
