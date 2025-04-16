import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { InventoryItem, Category, BorrowingRequest, LabUsageRequest } from "./supabase"

// Fungsi untuk mengekspor data ke Excel
export function exportToExcel(data: any[], fileName: string) {
  // Buat workbook baru
  const wb = XLSX.utils.book_new()

  // Buat worksheet dari data
  const ws = XLSX.utils.json_to_sheet(data)

  // Tambahkan worksheet ke workbook
  XLSX.utils.book_append_sheet(wb, ws, "Data")

  // Ekspor workbook ke file Excel (browser-compatible)
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  // Konversi buffer ke Blob
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  // Buat URL untuk download
  const url = URL.createObjectURL(blob)

  // Buat link untuk download dan klik secara otomatis
  const a = document.createElement("a")
  a.href = url
  a.download = `${fileName}.xlsx`
  document.body.appendChild(a)
  a.click()

  // Bersihkan
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

// Fungsi untuk mengekspor data ke PDF
export function exportToPDF(data: any[], columns: string[], title: string, fileName: string) {
  // Buat dokumen PDF baru
  const doc = new jsPDF()

  // Tambahkan judul
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)

  // Tambahkan tanggal
  doc.text(`Diekspor pada: ${new Date().toLocaleDateString("id-ID")}`, 14, 30)

  // Siapkan data untuk tabel
  const tableColumn = columns
  const tableRows = data.map((item) => {
    return columns.map((col) => (item[col] !== undefined ? item[col].toString() : ""))
  })

  // Tambahkan tabel ke dokumen
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  // Simpan dokumen PDF (browser-compatible)
  doc.save(`${fileName}.pdf`)
}

// Fungsi untuk memformat data inventaris untuk ekspor
export function formatInventoryDataForExport(items: InventoryItem[], categories: Category[]) {
  return items.map((item) => {
    const category = categories.find((cat) => cat.id === item.category_id)
    return {
      "Nama Barang": item.name,
      Kategori: category ? category.name : "",
      "Jumlah Total": item.total_quantity,
      "Jumlah Tersedia": item.available_quantity,
      Status: formatStatus(item.status),
      Lokasi: item.location || "",
      Deskripsi: item.description || "",
    }
  })
}

// Fungsi untuk memformat data peminjaman untuk ekspor
export function formatBorrowingDataForExport(requests: BorrowingRequest[], items: InventoryItem[]) {
  return requests.map((req) => {
    const borrowedItems = req.borrowed_items
      ? req.borrowed_items
          .map((bi) => {
            const item = items.find((i) => i.id === bi.inventory_item_id)
            return `${item ? item.name : "Unknown"} (${bi.quantity})`
          })
          .join(", ")
      : ""

    return {
      ID: req.id,
      "Nama Peminjam": req.name,
      NIM: req.nim,
      "No. Telepon": req.phone,
      Tujuan: req.purpose,
      Catatan: req.notes || "",
      "Tanggal Mulai": formatDate(req.start_date),
      "Tanggal Selesai": formatDate(req.end_date),
      Status: formatStatus(req.status),
      "Barang Dipinjam": borrowedItems,
      "Tanggal Permintaan": formatDate(req.request_date),
    }
  })
}

// Fungsi untuk memformat data penggunaan lab untuk ekspor
export function formatLabUsageDataForExport(requests: LabUsageRequest[]) {
  return requests.map((req) => {
    return {
      ID: req.id,
      "Nama Peminjam": req.name,
      NIM: req.nim,
      "No. Telepon": req.phone,
      Tujuan: req.purpose,
      Catatan: req.notes || "",
      "Tanggal Mulai": formatDate(req.start_date),
      "Tanggal Selesai": formatDate(req.end_date),
      "Waktu Mulai": req.start_time,
      "Waktu Selesai": req.end_time,
      Status: formatStatus(req.status),
      "Tanggal Permintaan": formatDate(req.request_date),
    }
  })
}

// Fungsi untuk memformat status
function formatStatus(status: string) {
  switch (status) {
    case "available":
      return "Tersedia"
    case "limited":
      return "Terbatas"
    case "unavailable":
      return "Tidak Tersedia"
    case "pending":
      return "Menunggu"
    case "approved":
      return "Disetujui"
    case "rejected":
      return "Ditolak"
    case "completed":
      return "Selesai"
    default:
      return status
  }
}

// Fungsi untuk memformat tanggal
function formatDate(dateString: string) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID")
}

// Fungsi untuk mengimpor data dari Excel (browser-compatible)
export async function importFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })

        // Ambil worksheet pertama
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]

        // Konversi worksheet ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsBinaryString(file)
  })
}

// Fungsi untuk memformat data Excel untuk impor inventaris
export function formatExcelDataForInventoryImport(data: any[], categories: Category[]) {
  return data.map((row) => {
    // Cari ID kategori berdasarkan nama
    const categoryName = row["Kategori"]
    const category = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())

    // Tentukan status berdasarkan jumlah
    const totalQuantity = Number.parseInt(row["Jumlah Total"] || "0")
    const availableQuantity = Number.parseInt(row["Jumlah Tersedia"] || row["Jumlah Total"] || "0")

    let status = "available"
    if (availableQuantity === 0) {
      status = "unavailable"
    } else if (availableQuantity < totalQuantity / 3) {
      status = "limited"
    }

    return {
      name: row["Nama Barang"],
      category_id: category ? category.id : null,
      total_quantity: totalQuantity,
      available_quantity: availableQuantity,
      status,
      location: row["Lokasi"] || null,
      description: row["Deskripsi"] || null,
    }
  })
}
