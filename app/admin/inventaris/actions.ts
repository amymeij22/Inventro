"use server"

import { getCategories, addInventoryItem } from "@/lib/api"
import { formatExcelDataForInventoryImport } from "@/lib/excel-utils"
import * as XLSX from "xlsx"

// Fungsi untuk mengimpor data inventaris dari Excel
export async function importInventoryFromExcel(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        error: "File tidak ditemukan",
      }
    }

    // Baca file Excel
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse file Excel menggunakan xlsx
    const workbook = XLSX.read(buffer, { type: "buffer" })

    // Ambil worksheet pertama
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]

    // Konversi worksheet ke JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // Dapatkan kategori untuk mapping
    const categories = await getCategories()

    // Format data untuk impor
    const formattedData = formatExcelDataForInventoryImport(jsonData, categories)

    // Validasi data
    const invalidItems = formattedData.filter((item) => !item.name || !item.category_id)
    if (invalidItems.length > 0) {
      return {
        success: false,
        error: `${invalidItems.length} item tidak valid. Pastikan semua item memiliki nama dan kategori yang valid.`,
      }
    }

    // Tambahkan item ke database
    const results = await Promise.all(
      formattedData.map(async (item) => {
        try {
          const id = await addInventoryItem({
            name: item.name,
            category_id: item.category_id,
            total_quantity: item.total_quantity,
            description: item.description,
            location: item.location,
          })
          return { success: true, id }
        } catch (error) {
          console.error(`Error adding item ${item.name}:`, error)
          return { success: false, name: item.name, error }
        }
      }),
    )

    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    return {
      success: true,
      message: `Berhasil mengimpor ${successCount} item${failCount > 0 ? `, ${failCount} item gagal diimpor` : ""}.`,
    }
  } catch (error) {
    console.error("Error importing inventory from Excel:", error)
    return {
      success: false,
      error: "Gagal mengimpor data inventaris",
    }
  }
}
