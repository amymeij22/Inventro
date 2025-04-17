"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RequestDetailDialog, type RequestType } from "@/components/request-detail-dialog"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

// Dummy data untuk permintaan peminjaman
const allRequests: RequestType[] = [
  {
    id: 1,
    name: "Budi Santoso",
    nim: "2021010001",
    type: "barang",
    items: [
      { name: "Multimeter Digital", quantity: 2 },
      { name: "Breadboard", quantity: 1 },
    ],
    startDate: "2025-04-17",
    endDate: "2025-04-20",
    status: "pending",
    requestDate: "2025-04-16",
    purpose: "Praktikum Elektronika Dasar",
    notes: "Mohon dipersiapkan sebelum tanggal peminjaman",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    nim: "2021010002",
    type: "barang",
    items: [{ name: "Oscilloscope", quantity: 1 }],
    startDate: "2025-04-18",
    endDate: "2025-04-19",
    status: "approved",
    requestDate: "2025-04-15",
    purpose: "Pengerjaan Tugas Akhir",
  },
  {
    id: 3,
    name: "Ahmad Rizki",
    nim: "2022010003",
    type: "lab",
    lab: {
      startTime: "08:00",
      endTime: "12:00",
    },
    startDate: "2025-04-20",
    endDate: "2025-04-20",
    status: "completed",
    requestDate: "2025-04-14",
    purpose: "Penelitian Skripsi",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    nim: "2022010004",
    type: "lab",
    lab: {
      startTime: "13:00",
      endTime: "17:00",
    },
    startDate: "2025-04-19",
    endDate: "2025-04-19",
    status: "rejected",
    requestDate: "2025-04-15",
    purpose: "Praktikum Mikrokontroler",
  },
  {
    id: 5,
    name: "Hendra Wijaya",
    nim: "2021010005",
    type: "barang",
    items: [
      { name: "Logic Analyzer", quantity: 1 },
      { name: "Kabel Jumper", quantity: 10 },
    ],
    startDate: "2025-04-22",
    endDate: "2025-04-25",
    status: "pending",
    requestDate: "2025-04-15",
    purpose: "Praktikum Digital",
  },
  {
    id: 6,
    name: "Rina Putri",
    nim: "2022010006",
    type: "lab",
    lab: {
      startTime: "09:00",
      endTime: "15:00",
    },
    startDate: "2025-04-21",
    endDate: "2025-04-21",
    status: "approved",
    requestDate: "2025-04-16",
    purpose: "Workshop IoT",
  },
  {
    id: 7,
    name: "Tono Hartono",
    nim: "2021010007",
    type: "barang",
    items: [
      { name: "Arduino Uno", quantity: 3 },
      { name: "Sensor DHT11", quantity: 3 },
    ],
    startDate: "2025-04-18",
    endDate: "2025-04-20",
    status: "completed",
    requestDate: "2025-04-13",
    purpose: "Proyek Mikrokontroler",
  },
  {
    id: 8,
    name: "Lisa Permata",
    nim: "2022010008",
    type: "barang",
    items: [{ name: "Function Generator", quantity: 1 }],
    startDate: "2025-04-23",
    endDate: "2025-04-24",
    status: "rejected",
    requestDate: "2025-04-16",
    purpose: "Eksperimen Sinyal",
  },
];

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

export default function RequestsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [requests, setRequests] = useState<RequestType[]>(allRequests)
  const [filteredRequests, setFilteredRequests] = useState<RequestType[]>(allRequests)
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    setIsClient(true)

    // Simulasi pengecekan autentikasi
    const isAuthenticated = true // Ganti dengan logika autentikasi yang sebenarnya
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [router])

  // Handle filtering and searching
  useEffect(() => {
    let filtered = requests

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(request => request.status === activeTab)
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(request => request.type === typeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(request => 
        request.name.toLowerCase().includes(query) || 
        request.nim.toLowerCase().includes(query) ||
        request.purpose.toLowerCase().includes(query)
      )
    }

    setFilteredRequests(filtered)
  }, [activeTab, typeFilter, searchQuery, requests])

  const handleOpenDetail = (request: RequestType) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  const handleStatusChange = (requestId: number, newStatus: "approved" | "rejected" | "completed") => {
    setRequests(prev =>
      prev.map(request => (request.id === requestId ? { ...request, status: newStatus } : request))
    )
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Daftar Permintaan</h1>
              <p className="text-muted-foreground">
                Kelola seluruh permintaan peminjaman barang dan penggunaan laboratorium
              </p>
            </div>

            {/* Tabs dan Filter */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="pending">Menunggu</TabsTrigger>
                  <TabsTrigger value="approved">Disetujui</TabsTrigger>
                  <TabsTrigger value="completed">Selesai</TabsTrigger>
                  <TabsTrigger value="rejected">Ditolak</TabsTrigger>
                </TabsList>

                <div className="flex items-center w-full md:w-auto gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Jenis Peminjaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="barang">Peminjaman Barang</SelectItem>
                      <SelectItem value="lab">Penggunaan Lab</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1 md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari nama, NIM..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <TabsContent value={activeTab} className="m-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">ID</th>
                          <th className="px-4 py-3 text-left font-medium">Nama</th>
                          <th className="px-4 py-3 text-left font-medium">NIM</th>
                          <th className="px-4 py-3 text-left font-medium">Jenis Permintaan</th>
                          <th className="px-4 py-3 text-left font-medium">Tanggal Pinjam</th>
                          <th className="px-4 py-3 text-left font-medium">Tanggal Pengajuan</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.length > 0 ? (
                          filteredRequests.map((request) => (
                            <tr key={request.id} className="border-b">
                              <td className="px-4 py-3">#{request.id}</td>
                              <td className="px-4 py-3">{request.name}</td>
                              <td className="px-4 py-3">{request.nim}</td>
                              <td className="px-4 py-3 capitalize">
                                {request.type === "barang" ? "Peminjaman Barang" : "Penggunaan Lab"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {new Date(request.startDate).toLocaleDateString("id-ID")}
                                {request.startDate !== request.endDate && 
                                  ` - ${new Date(request.endDate).toLocaleDateString("id-ID")}`}
                              </td>
                              <td className="px-4 py-3">
                                {new Date(request.requestDate).toLocaleDateString("id-ID")}
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={getStatusBadgeVariant(request.status)}>
                                  {getStatusText(request.status)}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleOpenDetail(request)}
                                >
                                  Detail
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                              Tidak ada permintaan yang ditemukan
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Inventro - Lab Elektronika STMKG
          </p>
        </div>
      </footer>

      {/* Dialog Detail Permintaan */}
      <RequestDetailDialog
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
