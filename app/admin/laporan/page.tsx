"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, FileIcon as FilePdf, Calendar, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { AdminReportSkeleton } from "@/components/skeleton-loader"
import { useToast } from "@/components/ui/use-toast"
import { exportToExcel, exportToPDF } from "@/lib/excel-utils"
import { getInventoryReportData, getBorrowingReportData, getLabUsageReportData } from "./actions"

export default function ReportPage() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("inventaris")
  const [dateRange, setDateRange] = useState("bulan-ini")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  // State untuk data laporan
  const [inventoryData, setInventoryData] = useState<any[]>([])
  const [borrowingData, setBorrowingData] = useState<any[]>([])
  const [labUsageData, setLabUsageData] = useState<any[]>([])

  // State untuk data chart
  const [inventoryPieData, setInventoryPieData] = useState<any[]>([])
  const [inventoryCategoryData, setInventoryCategoryData] = useState<any[]>([])
  const [borrowingPieData, setBorrowingPieData] = useState<any[]>([])
  const [borrowingMonthData, setBorrowingMonthData] = useState<any[]>([])

  // State untuk detail peminjaman
  const [borrowingDetails, setBorrowingDetails] = useState<any[]>([])

  // Inisialisasi tanggal saat komponen dimuat
  useEffect(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    setStartDate(firstDayOfMonth.toISOString().split("T")[0])
    setEndDate(lastDayOfMonth.toISOString().split("T")[0])

    fetchReportData()
  }, [])

  // Fungsi untuk mengambil data laporan
  const fetchReportData = async () => {
    setIsLoading(true)

    try {
      // Tentukan rentang tanggal berdasarkan filter
      let dateRangeFilter = undefined
      if (dateRange !== "all") {
        dateRangeFilter = {
          startDate,
          endDate,
        }
      }

      // Ambil data laporan inventaris
      const inventoryResult = await getInventoryReportData(dateRangeFilter)
      if (inventoryResult.success && inventoryResult.data) {
        setInventoryData(inventoryResult.data)

        // Hitung data untuk pie chart
        const totalAvailable = inventoryResult.data.reduce(
          (sum, item) => sum + Number.parseInt(String(item["Jumlah Tersedia"] || "0")),
          0,
        )
        const totalBorrowed = inventoryResult.data.reduce((sum, item) => {
          const total = Number.parseInt(String(item["Jumlah Total"] || "0"))
          const available = Number.parseInt(String(item["Jumlah Tersedia"] || "0"))
          return sum + (total - available)
        }, 0)

        setInventoryPieData([
          { name: "Tersedia", value: totalAvailable, color: "#3b82f6" },
          { name: "Dipinjam", value: totalBorrowed, color: "#ef4444" },
        ])

        // Hitung data kategori untuk pie chart
        const categoryData: { [key: string]: number } = {}
        inventoryResult.data.forEach((item) => {
          const category = item["Kategori"]
          if (!categoryData[category]) {
            categoryData[category] = 0
          }
          categoryData[category] += Number.parseInt(String(item["Jumlah Total"] || "0"))
        })

        const categoryColors: { [key: string]: string } = {
          "Alat Ukur": "#3b82f6",
          Mikrokontroler: "#10b981",
          Komponen: "#f59e0b",
        }

        const categoryChartData = Object.keys(categoryData).map((category) => ({
          name: category,
          value: categoryData[category],
          color: categoryColors[category] || "#8b5cf6",
        }))

        setInventoryCategoryData(categoryChartData)
      }

      // Ambil data laporan peminjaman
      const borrowingResult = await getBorrowingReportData(dateRangeFilter)
      if (borrowingResult.success && borrowingResult.data) {
        console.log("Borrowing data received:", borrowingResult.data)
        setBorrowingData(borrowingResult.data)
        setBorrowingDetails(borrowingResult.data)

        // Hitung data untuk pie chart
        const completed = borrowingResult.data.filter((item) => item["Status"] === "Selesai").length
        const rejected = borrowingResult.data.filter((item) => item["Status"] === "Ditolak").length

        setBorrowingPieData([
          { name: "Selesai", value: completed, color: "#10b981" },
          { name: "Ditolak", value: rejected, color: "#ef4444" },
        ])

        // Hitung data bulanan untuk pie chart
        const monthData: { [key: string]: number } = {}
        borrowingResult.data.forEach((item) => {
          if (item["Tanggal Permintaan"]) {
            try {
              // Konversi string tanggal ke objek Date
              const dateParts = item["Tanggal Permintaan"].split("/")
              if (dateParts.length === 3) {
                const day = Number.parseInt(dateParts[0])
                const month = Number.parseInt(dateParts[1]) - 1 // Bulan dalam JavaScript dimulai dari 0
                const year = Number.parseInt(dateParts[2])

                const requestDate = new Date(year, month, day)
                const monthName = requestDate.toLocaleString("id-ID", { month: "long" })

                if (!monthData[monthName]) {
                  monthData[monthName] = 0
                }
                monthData[monthName]++
              }
            } catch (error) {
              console.error("Error parsing date:", item["Tanggal Permintaan"], error)
            }
          }
        })

        const monthColors: { [key: string]: string } = {
          Januari: "#3b82f6",
          Februari: "#10b981",
          Maret: "#f59e0b",
          April: "#8b5cf6",
          Mei: "#ec4899",
          Juni: "#8b5cf6",
          Juli: "#14b8a6",
          Agustus: "#f97316",
          September: "#6366f1",
          Oktober: "#84cc16",
          November: "#7c3aed",
          Desember: "#ef4444",
        }

        const monthChartData = Object.keys(monthData).map((month) => ({
          name: month,
          value: monthData[month],
          color: monthColors[month] || "#8b5cf6",
        }))

        setBorrowingMonthData(monthChartData)
      } else {
        console.error("Failed to fetch borrowing data:", borrowingResult.error)
        toast({
          title: "Error",
          description: borrowingResult.error || "Gagal mengambil data laporan peminjaman",
          variant: "destructive",
        })
      }

      // Ambil data laporan penggunaan lab
      const labUsageResult = await getLabUsageReportData(dateRangeFilter)
      if (labUsageResult.success && labUsageResult.data) {
        setLabUsageData(labUsageResult.data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast({
        title: "Error",
        description: "Gagal mengambil data laporan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi untuk mengekspor laporan
  const exportReport = async (format: "xlsx" | "pdf") => {
    setIsExporting(true)

    try {
      let data = []
      let columns = []
      let title = ""
      let fileName = ""

      // Tentukan data yang akan diekspor berdasarkan jenis laporan
      if (reportType === "inventaris") {
        data = inventoryData
        columns = ["Nama Barang", "Kategori", "Jumlah Total", "Jumlah Tersedia", "Status", "Lokasi", "Deskripsi"]
        title = "Laporan Inventaris"
        fileName = "laporan-inventaris"
      } else if (reportType === "peminjaman") {
        data = borrowingData
        columns = [
          "ID",
          "Nama Peminjam",
          "NPT",
          "No. Telepon",
          "Tujuan",
          "Catatan",
          "Tanggal Mulai",
          "Tanggal Selesai",
          "Status",
          "Barang Dipinjam",
          "Tanggal Permintaan",
        ]
        title = "Laporan Peminjaman"
        fileName = "laporan-peminjaman"
      } else {
        data = labUsageData
        columns = [
          "ID",
          "Nama Peminjam",
          "NPT",
          "No. Telepon",
          "Tujuan",
          "Catatan",
          "Tanggal Mulai",
          "Tanggal Selesai",
          "Waktu Mulai",
          "Waktu Selesai",
          "Status",
          "Tanggal Permintaan",
        ]
        title = "Laporan Penggunaan Lab"
        fileName = "laporan-penggunaan-lab"
      }

      // Tambahkan rentang tanggal ke nama file jika ada
      if (dateRange !== "all") {
        fileName += `-${startDate}-${endDate}`
      }

      // Ekspor berdasarkan format
      if (format === "xlsx") {
        exportToExcel(data, fileName)
      } else {
        exportToPDF(data, columns, title, fileName)
      }

      toast({
        title: "Sukses",
        description: `Laporan berhasil diekspor dalam format ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      toast({
        title: "Error",
        description: `Gagal mengekspor laporan dalam format ${format.toUpperCase()}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Fungsi untuk menerapkan filter tanggal
  const applyDateFilter = () => {
    fetchReportData()
  }

  // Fungsi untuk mendapatkan warna badge berdasarkan status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-500"
      case "Disetujui":
        return "bg-blue-500"
      case "Selesai":
        return "bg-green-500"
      case "Ditolak":
        return "bg-red-500"
      default:
        return "bg-secondary"
    }
  }

  // Konfigurasi chart
  const chartConfig = {
    Tersedia: { label: "Tersedia", color: "#3b82f6" },
    Dipinjam: { label: "Dipinjam", color: "#ef4444" },
    Selesai: { label: "Selesai", color: "#10b981" },
    Ditolak: { label: "Ditolak", color: "#ef4444" },
    "Alat Ukur": { label: "Alat Ukur", color: "#3b82f6" },
    Mikrokontroler: { label: "Mikrokontroler", color: "#10b981" },
    Komponen: { label: "Komponen", color: "#f59e0b" },
    Januari: { label: "Januari", color: "#3b82f6" },
    Februari: { label: "Februari", color: "#10b981" },
    Maret: { label: "Maret", color: "#f59e0b" },
    April: { label: "April", color: "#8b5cf6" },
    Mei: { label: "Mei", color: "#ec4899" },
    Juni: { label: "Juni", color: "#8b5cf6" },
    Juli: { label: "Juli", color: "#14b8a6" },
    Agustus: { label: "Agustus", color: "#f97316" },
    September: { label: "September", color: "#6366f1" },
    Oktober: { label: "Oktober", color: "#84cc16" },
    November: { label: "November", color: "#7c3aed" },
    Desember: { label: "Desember", color: "#ef4444" },
  }

  // Custom tooltip renderer untuk pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {isLoading ? (
          <AdminReportSkeleton />
        ) : (
          <div className="container pt-2 pb-20 md:pb-10">
            <div className="flex flex-col space-y-4 md:space-y-8">
              <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
                <p className="text-muted-foreground">Lihat dan ekspor laporan inventaris dan peminjaman</p>
              </div>

              <Tabs defaultValue="inventaris" onValueChange={setReportType} className="space-y-4">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="inventaris" className="flex-1 sm:flex-none">
                      Laporan Inventaris
                    </TabsTrigger>
                    <TabsTrigger value="peminjaman" className="flex-1 sm:flex-none">
                      Laporan Peminjaman
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => exportReport("xlsx")}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                      )}
                      Ekspor Excel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => exportReport("pdf")}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FilePdf className="mr-2 h-4 w-4" />
                      )}
                      Ekspor PDF
                    </Button>
                  </div>
                </div>

                {/* Filter Tanggal */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Filter Laporan</CardTitle>
                    <CardDescription>Pilih rentang waktu untuk laporan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 sm:space-y-0">
                      <div className="space-y-2 w-full sm:w-auto sm:flex-1">
                        <Label>Rentang Waktu</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih rentang waktu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hari-ini">Hari Ini</SelectItem>
                            <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                            <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                            <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
                            <SelectItem value="kustom">Kustom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {dateRange === "kustom" && (
                        <>
                          <div className="space-y-2 w-full sm:w-auto">
                            <Label htmlFor="start-date">Tanggal Mulai</Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 w-full sm:w-auto">
                            <Label htmlFor="end-date">Tanggal Selesai</Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                      <Button className="w-full sm:w-auto" onClick={applyDateFilter}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Terapkan Filter
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <TabsContent value="inventaris" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Pie Chart Ketersediaan Inventaris */}
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Status Ketersediaan</CardTitle>
                        <CardDescription>Perbandingan inventaris tersedia dan dipinjam</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-48 md:h-64 flex items-center justify-center">
                          <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                  data={inventoryPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="40%"
                                  outerRadius="70%"
                                  paddingAngle={2}
                                  dataKey="value"
                                  nameKey="name"
                                  labelLine={false}
                                  fill="#8884d8"
                                >
                                  {inventoryPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }}
                                  formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart Distribusi Kategori */}
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Distribusi Kategori</CardTitle>
                        <CardDescription>Perbandingan jumlah berdasarkan kategori</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-48 md:h-64">
                          <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                  data={inventoryCategoryData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="0%"
                                  outerRadius="70%"
                                  paddingAngle={2}
                                  dataKey="value"
                                  nameKey="name"
                                  labelLine={false}
                                  fill="#8884d8"
                                >
                                  {inventoryCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }}
                                  formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabel Inventaris */}
                  <Card className="overflow-x-auto">
                    <CardHeader>
                      <CardTitle>Detail Inventaris</CardTitle>
                      <CardDescription>Data lengkap inventaris berdasarkan kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="text-right">Jumlah Total</TableHead>
                            <TableHead className="text-right">Tersedia</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Lokasi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                Tidak ada data yang ditemukan
                              </TableCell>
                            </TableRow>
                          ) : (
                            inventoryData.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item["Nama Barang"]}</TableCell>
                                <TableCell>{item["Kategori"]}</TableCell>
                                <TableCell className="text-right">{item["Jumlah Total"]}</TableCell>
                                <TableCell className="text-right">{item["Jumlah Tersedia"]}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      item["Status"] === "Tersedia"
                                        ? "default"
                                        : item["Status"] === "Terbatas"
                                          ? "outline"
                                          : "secondary"
                                    }
                                    className={
                                      item["Status"] === "Tersedia"
                                        ? "bg-green-500"
                                        : item["Status"] === "Terbatas"
                                          ? "border-yellow-500 text-yellow-500"
                                          : "bg-red-500"
                                    }
                                  >
                                    {item["Status"]}
                                  </Badge>
                                </TableCell>
                                <TableCell>{item["Lokasi"] || "-"}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="peminjaman" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Pie Chart Status Peminjaman */}
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Status Peminjaman</CardTitle>
                        <CardDescription>Perbandingan peminjaman selesai dan ditolak</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-48 md:h-64">
                          <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                  data={borrowingPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="40%"
                                  outerRadius="70%"
                                  paddingAngle={2}
                                  dataKey="value"
                                  nameKey="name"
                                  labelLine={false}
                                  fill="#8884d8"
                                >
                                  {borrowingPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }}
                                  formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart Peminjaman per Bulan */}
                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Peminjaman Bulanan</CardTitle>
                        <CardDescription>Distribusi peminjaman per bulan</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-48 md:h-64">
                          <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Pie
                                  data={borrowingMonthData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="0%"
                                  outerRadius="70%"
                                  paddingAngle={2}
                                  dataKey="value"
                                  nameKey="name"
                                  labelLine={false}
                                  fill="#8884d8"
                                >
                                  {borrowingMonthData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "10px" }}
                                  formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabel Peminjaman */}
                  <Card className="overflow-x-auto">
                    <CardHeader>
                      <CardTitle>Detail Peminjaman</CardTitle>
                      <CardDescription>Data lengkap peminjaman</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>NPT</TableHead>
                            <TableHead>Barang</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {borrowingDetails.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                Tidak ada data yang ditemukan
                              </TableCell>
                            </TableRow>
                          ) : (
                            borrowingDetails.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item["ID"]}</TableCell>
                                <TableCell className="font-medium">{item["Nama Peminjam"]}</TableCell>
                                <TableCell>{item["NPT"]}</TableCell>
                                <TableCell>{item["Barang Dipinjam"]}</TableCell>
                                <TableCell>
                                  {item["Tanggal Mulai"]} - {item["Tanggal Selesai"]}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadgeVariant(item["Status"])}>{item["Status"]}</Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
