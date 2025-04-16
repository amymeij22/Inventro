"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle, Clock, MoreHorizontal } from "lucide-react"
import { RequestsPageSkeleton } from "@/components/skeleton-loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getBorrowingRequests, updateBorrowingRequestStatus } from "@/lib/api"
import type { BorrowingRequest } from "@/lib/supabase"

export default function AdminBorrowingRequestsPage() {
  const [requests, setRequests] = useState<BorrowingRequest[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<BorrowingRequest | null>(null)
  const [newStatus, setNewStatus] = useState<"pending" | "approved" | "rejected" | "completed">("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data permintaan peminjaman
  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch permintaan peminjaman dengan filter
      const requestsData = await getBorrowingRequests(statusFilter !== "all" ? statusFilter : undefined)
      setRequests(requestsData)

      setError(null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Gagal memuat data. Silakan coba lagi nanti.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  // Handler untuk filter status
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  // Handler untuk membuka dialog detail
  const openDetailsDialog = (request: BorrowingRequest) => {
    setCurrentRequest(request)
    setIsDetailsDialogOpen(true)
  }

  // Handler untuk membuka dialog ubah status
  const openStatusDialog = (request: BorrowingRequest, status: "pending" | "approved" | "rejected" | "completed") => {
    setCurrentRequest(request)
    setNewStatus(status)
    setIsStatusDialogOpen(true)
  }

  // Handler untuk mengubah status permintaan
  const handleUpdateStatus = async () => {
    if (!currentRequest) return

    setIsSubmitting(true)

    try {
      await updateBorrowingRequestStatus(currentRequest.id, newStatus)

      toast({
        title: "Berhasil",
        description: "Status permintaan berhasil diperbarui",
      })

      setIsStatusDialogOpen(false)
      fetchData() // Refresh data
    } catch (err) {
      console.error("Error updating request status:", err)
      toast({
        title: "Gagal",
        description: "Gagal memperbarui status permintaan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return new Date(dateString).toLocaleDateString("id-ID", options)
  }

  // Get status badge color and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4 mr-1" />,
          text: "Menunggu",
        }
      case "approved":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Disetujui",
        }
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-4 w-4 mr-1" />,
          text: "Ditolak",
        }
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Selesai",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Clock className="h-4 w-4 mr-1" />,
          text: status,
        }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-2">
        <main className="flex w-full flex-col overflow-hidden pb-16 md:pb-0">
          <div className="flex-1 space-y-4 pt-2 pb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Permintaan Peminjaman</h2>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pesan Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Daftar Permintaan */}
            {isLoading ? (
              <RequestsPageSkeleton />
            ) : requests.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">Tidak ada permintaan peminjaman yang ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((request) => {
                  const statusBadge = getStatusBadge(request.status)
                  return (
                    <Card key={request.id}>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{request.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={`flex items-center ${statusBadge.color}`}>
                              {statusBadge.icon}
                              {statusBadge.text}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openDetailsDialog(request)}>
                                  Lihat Detail
                                </DropdownMenuItem>
                                {request.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => openStatusDialog(request, "approved")}>
                                      Setujui
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openStatusDialog(request, "rejected")}>
                                      Tolak
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {request.status === "approved" && (
                                  <DropdownMenuItem onClick={() => openStatusDialog(request, "completed")}>
                                    Tandai Selesai
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <p className="text-sm text-muted-foreground">NPT: {request.npt}</p>
                            <p className="text-sm text-muted-foreground">No. HP: {request.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Tanggal: {formatDate(request.start_date)} - {formatDate(request.end_date)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Diajukan: {formatDate(request.request_date)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Keperluan:</p>
                          <p className="text-sm text-muted-foreground">{request.purpose}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => openDetailsDialog(request)}>
                          Lihat Detail
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Permintaan Peminjaman</DialogTitle>
          </DialogHeader>
          {currentRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Informasi Peminjam</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Nama:</span> {currentRequest.name}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">NPT:</span> {currentRequest.npt}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">No. HP:</span> {currentRequest.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Informasi Peminjaman</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Tanggal Mulai:</span>{" "}
                      {formatDate(currentRequest.start_date)}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Tanggal Selesai:</span>{" "}
                      {formatDate(currentRequest.end_date)}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge className={getStatusBadge(currentRequest.status).color}>
                        {getStatusBadge(currentRequest.status).text}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Keperluan</h3>
                <p className="text-sm mt-2">{currentRequest.purpose}</p>
              </div>

              {currentRequest.notes && (
                <div>
                  <h3 className="font-medium">Catatan</h3>
                  <p className="text-sm mt-2">{currentRequest.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium">Barang yang Dipinjam</h3>
                {currentRequest.borrowed_items && currentRequest.borrowed_items.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {currentRequest.borrowed_items.map((item) => (
                      <div key={item.id} className="border rounded-md p-2">
                        <p className="text-sm font-medium">
                          {item.inventory_items?.name || `Item #${item.inventory_item_id}`}
                        </p>
                        <p className="text-sm text-muted-foreground">Jumlah: {item.quantity} unit</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">Tidak ada data barang yang dipinjam</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Tutup
                </Button>
                {currentRequest.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsDetailsDialogOpen(false)
                        openStatusDialog(currentRequest, "rejected")
                      }}
                    >
                      Tolak
                    </Button>
                    <Button
                      onClick={() => {
                        setIsDetailsDialogOpen(false)
                        openStatusDialog(currentRequest, "approved")
                      }}
                    >
                      Setujui
                    </Button>
                  </>
                )}
                {currentRequest.status === "approved" && (
                  <Button
                    onClick={() => {
                      setIsDetailsDialogOpen(false)
                      openStatusDialog(currentRequest, "completed")
                    }}
                  >
                    Tandai Selesai
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "approved"
                ? "Setujui Permintaan"
                : newStatus === "rejected"
                  ? "Tolak Permintaan"
                  : "Tandai Selesai"}
            </DialogTitle>
            <DialogDescription>
              {newStatus === "approved"
                ? "Apakah Anda yakin ingin menyetujui permintaan peminjaman ini?"
                : newStatus === "rejected"
                  ? "Apakah Anda yakin ingin menolak permintaan peminjaman ini?"
                  : "Apakah Anda yakin ingin menandai permintaan peminjaman ini sebagai selesai?"}
            </DialogDescription>
          </DialogHeader>
          {currentRequest && (
            <div className="py-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium">{currentRequest.name}</h3>
                <p className="text-sm text-muted-foreground">NPT: {currentRequest.npt}</p>
                <p className="text-sm text-muted-foreground">
                  Tanggal: {formatDate(currentRequest.start_date)} - {formatDate(currentRequest.end_date)}
                </p>
              </div>
              {newStatus === "approved" && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Menyetujui permintaan ini akan mengurangi jumlah barang yang tersedia di inventaris.
                  </AlertDescription>
                </Alert>
              )}
              {newStatus === "completed" && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Menandai permintaan ini sebagai selesai akan mengembalikan jumlah barang yang tersedia di
                    inventaris.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant={newStatus === "rejected" ? "destructive" : "default"}
              onClick={handleUpdateStatus}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
