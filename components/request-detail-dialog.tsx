"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

// Tipe data untuk permintaan
export type RequestType = {
  id: number
  name: string
  npt: string
  type: "barang" | "lab"
  items?: { name: string; quantity: number }[]
  lab?: { startTime: string; endTime: string }
  startDate: string
  endDate: string
  status: "pending" | "approved" | "rejected" | "completed"
  requestDate: string
  purpose: string
  notes?: string
  documentation?: string
}

interface RequestDetailDialogProps {
  request: RequestType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (requestId: number, newStatus: "approved" | "rejected" | "completed") => void
}

export function RequestDetailDialog({ request, open, onOpenChange, onStatusChange }: RequestDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!request) return null

  const handleStatusChange = async (newStatus: "approved" | "rejected" | "completed") => {
    setIsSubmitting(true)

    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onStatusChange(request.id, newStatus)
    setIsSubmitting(false)
    onOpenChange(false)
  }

  // Fungsi untuk mendapatkan teks status dalam Bahasa Indonesia
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu"
      case "approved":
        return "Disetujui"
      case "completed":
        return "Selesai"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  // Fungsi untuk mendapatkan warna badge berdasarkan status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detail Permintaan #{request.id}</span>
            <Badge className={getStatusBadgeVariant(request.status)}>{getStatusText(request.status)}</Badge>
          </DialogTitle>
          <DialogDescription>
            Diajukan pada {new Date(request.requestDate).toLocaleDateString("id-ID")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Nama</h4>
              <p>{request.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">NPT</h4>
              <p>{request.npt}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Jenis Permintaan</h4>
            <p className="capitalize">{request.type === "barang" ? "Peminjaman Barang" : "Penggunaan Lab"}</p>
          </div>

          {request.type === "barang" && request.items && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Barang yang Dipinjam</h4>
              <ul className="mt-1 space-y-1">
                {request.items.map((item, index) => (
                  <li key={index} className="text-sm bg-muted p-2 rounded-md">
                    {item.name} ({item.quantity} unit)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Tanggal Mulai</h4>
              <p>{new Date(request.startDate).toLocaleDateString("id-ID")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Tanggal Selesai</h4>
              <p>{new Date(request.endDate).toLocaleDateString("id-ID")}</p>
            </div>
          </div>

          {request.type === "lab" && request.lab && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Waktu Mulai</h4>
                <p>{request.lab.startTime}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Waktu Selesai</h4>
                <p>{request.lab.endTime}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Keperluan</h4>
            <p className="text-sm">{request.purpose}</p>
          </div>

          {request.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Catatan</h4>
              <p className="text-sm">{request.notes}</p>
            </div>
          )}

          {request.documentation && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Dokumentasi</h4>
              <div className="mt-1">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline flex items-center"
                  onClick={(e) => e.preventDefault()}
                >
                  Lihat Dokumentasi
                </a>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {request.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => handleStatusChange("rejected")}
                disabled={isSubmitting}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={() => handleStatusChange("approved")}
                disabled={isSubmitting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Setujui
              </Button>
            </>
          )}

          {request.status === "approved" && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => handleStatusChange("completed")}
              disabled={isSubmitting}
            >
              <Clock className="mr-2 h-4 w-4" />
              Selesai
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
