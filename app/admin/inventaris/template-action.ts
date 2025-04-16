"use server"

import * as XLSX from "xlsx"
import { getCategories } from "@/lib/api"

// Fungsi untuk membuat template Excel untuk impor inventaris
export async function generateInventoryImportTemplate() {
  try {
    // Dapatkan kategori untuk dropdown
    const categories = await getCategories()

    // Buat workbook baru
    const wb = XLSX.utils.book_new()

    // Buat data template
    const templateData = [
      {
        "Nama Barang": "Contoh: Multimeter Digital",
        Kategori: categories[0]?.name || "Alat Ukur",
        "Jumlah Total": 10,
        "Jumlah Tersedia": 10,
        Lokasi: "Contoh: Rak A1",
        Deskripsi: "Contoh: Multimeter digital untuk mengukur tegangan, arus, dan resistansi",
      },
      {
        "Nama Barang": "Contoh: Oscilloscope",
        Kategori: categories[1]?.name || "Alat Ukur",
        "Jumlah Total": 5,
        "Jumlah Tersedia": 5,
        Lokasi: "Contoh: Rak A2",
        Deskripsi: "Contoh: Oscilloscope digital 100MHz",
      },
    ]

    // Buat worksheet dari data template
    const ws = XLSX.utils.json_to_sheet(templateData)

    // Tambahkan validasi untuk kolom kategori (dropdown)
    const categoryNames = categories.map((cat) => cat.name)

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template")

    // Tambahkan worksheet untuk kategori
    const categoryWs = XLSX.utils.aoa_to_sheet([["Kategori yang Tersedia"], ...categoryNames.map((name) => [name])])
    XLSX.utils.book_append_sheet(wb, categoryWs, "Kategori")

    // Konversi workbook ke array buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return {
      success: true,
      buffer,
    }
  } catch (error) {
    console.error("Error generating template:", error)
    return {
      success: false,
      error: "Gagal membuat template",
    }
  }
}
