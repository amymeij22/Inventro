"use server"

import { getInventoryItems, getCategories, getBorrowingRequests, getLabUsageRequests } from "@/lib/api"
import {
  formatInventoryDataForExport,
  formatBorrowingDataForExport,
  formatLabUsageDataForExport,
} from "@/lib/excel-utils"

// Fungsi untuk mendapatkan data laporan inventaris
export async function getInventoryReportData(dateRange?: { startDate: string; endDate: string }) {
  try {
    const [items, categories] = await Promise.all([getInventoryItems(), getCategories()])

    // Format data untuk ekspor
    const formattedData = formatInventoryDataForExport(items, categories)

    return {
      success: true,
      data: formattedData,
      columns: ["Nama Barang", "Kategori", "Jumlah Total", "Jumlah Tersedia", "Status", "Lokasi", "Deskripsi"],
      title: "Laporan Inventaris",
    }
  } catch (error) {
    console.error("Error getting inventory report data:", error)
    return {
      success: false,
      error: "Gagal mendapatkan data laporan inventaris",
    }
  }
}

// Fungsi untuk mendapatkan data laporan peminjaman
export async function getBorrowingReportData(dateRange?: { startDate: string; endDate: string }) {
  try {
    const [requests, items] = await Promise.all([getBorrowingRequests(), getInventoryItems()])

    console.log("Borrowing requests:", requests.length)

    // Filter berdasarkan rentang tanggal jika ada
    let filteredRequests = requests
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59, 999) // Set to end of day

      filteredRequests = requests.filter((req) => {
        const requestDate = new Date(req.request_date)
        return requestDate >= startDate && requestDate <= endDate
      })
    }

    console.log("Filtered requests:", filteredRequests.length)

    // Format data untuk ekspor
    const formattedData = formatBorrowingDataForExport(filteredRequests, items)

    console.log("Formatted data:", formattedData.length)

    return {
      success: true,
      data: formattedData,
      columns: [
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
      ],
      title: "Laporan Peminjaman",
    }
  } catch (error) {
    console.error("Error getting borrowing report data:", error)
    return {
      success: false,
      error: "Gagal mendapatkan data laporan peminjaman",
    }
  }
}

// Fungsi untuk mendapatkan data laporan penggunaan lab
export async function getLabUsageReportData(dateRange?: { startDate: string; endDate: string }) {
  try {
    const requests = await getLabUsageRequests()

    // Filter berdasarkan rentang tanggal jika ada
    let filteredRequests = requests
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59, 999) // Set to end of day

      filteredRequests = requests.filter((req) => {
        const requestDate = new Date(req.request_date)
        return requestDate >= startDate && requestDate <= endDate
      })
    }

    // Format data untuk ekspor
    const formattedData = formatLabUsageDataForExport(filteredRequests)

    return {
      success: true,
      data: formattedData,
      columns: [
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
      ],
      title: "Laporan Penggunaan Lab",
    }
  } catch (error) {
    console.error("Error getting lab usage report data:", error)
    return {
      success: false,
      error: "Gagal mendapatkan data laporan penggunaan lab",
    }
  }
}
