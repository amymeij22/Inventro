"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileSpreadsheet, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminInventorySkeleton } from "@/components/skeleton-loader"
import { useToast } from "@/components/ui/use-toast"
import { getInventoryItems, getCategories, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/api"
import { importInventoryFromExcel } from "./actions"
// Tambahkan import untuk DownloadTemplateButton
import { DownloadTemplateButton } from "./download-template"

// Tipe data untuk inventaris
type InventoryItem = {
  id: number
  name: string
  category_id: number
  categories?: {
    name: string
  }
  status: "available" | "limited" | "unavailable"
  available_quantity: number
  total_quantity: number
  description?: string
  location?: string
}

// Tipe data untuk kategori
type Category = {
  id: number
  name: string
}

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

// Fungsi untuk mendapatkan warna badge berdasarkan status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500"
    case "limited":
      return "border-yellow-500 text-yellow-500"
    case "unavailable":
      return "bg-red-500"
    default:
      return "bg-secondary"
  }
}

export default function InventoryManagementPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State untuk dialog tambah barang baru
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category_id: 0,
    total_quantity: 1,
    description: "",
    location: "",
  })

  const [isLoading, setIsLoading] = useState(true)

  // Fetch data saat komponen dimuat
  useEffect(() => {
    fetchData()
  }, [])

  // Fungsi untuk mengambil data inventaris dan kategori
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getInventoryItems(
          searchQuery,
          categoryFilter !== "all" ? Number.parseInt(categoryFilter) : undefined,
          statusFilter !== "all" ? statusFilter : undefined,
        ),
        getCategories(),
      ])

      setItems(itemsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Gagal mengambil data inventaris",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handler untuk form tambah barang
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === "category_id" ? Number.parseInt(value) : value }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData((prev) => ({ ...prev, [name]: numValue }))
    }
  }

  // Reset form tambah barang
  const resetAddForm = () => {
    setFormData({
      name: "",
      category_id: categories.length > 0 ? categories[0].id : 0,
      total_quantity: 1,
      description: "",
      location: "",
    })
  }

  // Submit form tambah barang
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (formData.category_id === 0 && categories.length > 0) {
        // Ensure a valid category is selected
        setFormData(prev => ({...prev, category_id: categories[0].id}))
      }
      
      await addInventoryItem({
        name: formData.name,
        category_id: formData.category_id,
        total_quantity: formData.total_quantity,
        description: formData.description,
        location: formData.location,
      })

      toast({
        title: "Sukses",
        description: "Barang berhasil ditambahkan",
      })

      // Refresh data
      fetchData()

      // Reset form dan tutup dialog
      resetAddForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding item:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan barang",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fungsi untuk menerapkan filter
  const applyFilters = () => {
    fetchData()
  }

  // Fungsi untuk mengedit item
  const handleEditItem = (item: InventoryItem) => {
    setEditItem(item)
    setIsEditDialogOpen(true)
  }

  // Fungsi untuk menyimpan perubahan item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editItem) {
      try {
        await updateInventoryItem(editItem.id, {
          name: editItem.name,
          category_id: editItem.category_id,
          total_quantity: editItem.total_quantity,
          available_quantity: editItem.available_quantity,
          description: editItem.description,
          location: editItem.location,
        })

        toast({
          title: "Sukses",
          description: "Barang berhasil diperbarui",
        })

        // Refresh data
        fetchData()

        // Tutup dialog
        setIsEditDialogOpen(false)
        setEditItem(null)
      } catch (error) {
        console.error("Error updating item:", error)
        toast({
          title: "Error",
          description: "Gagal memperbarui barang",
          variant: "destructive",
        })
      }
    }
  }

  // Fungsi untuk menghapus item
  const handleDeleteItem = (id: number) => {
    setDeleteItemId(id)
    setIsDeleteDialogOpen(true)
  }

  // Fungsi untuk konfirmasi penghapusan
  const confirmDelete = async () => {
    if (deleteItemId) {
      try {
        await deleteInventoryItem(deleteItemId)

        toast({
          title: "Sukses",
          description: "Barang berhasil dihapus",
        })

        // Refresh data
        fetchData()
      } catch (error) {
        console.error("Error deleting item:", error)
        toast({
          title: "Error",
          description: "Gagal menghapus barang",
          variant: "destructive",
        })
      } finally {
        setIsDeleteDialogOpen(false)
        setDeleteItemId(null)
      }
    }
  }

  // Fungsi untuk menghandle import Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0])
    }
  }

  // Fungsi untuk memproses file Excel
  const processExcelImport = async () => {
    if (!importFile) return

    setIsImporting(true)

    try {
      const formData = new FormData()
      formData.append("file", importFile)

      const result = await importInventoryFromExcel(formData)

      if (result.success) {
        toast({
          title: "Sukses",
          description: result.message,
        })

        // Refresh data
        fetchData()

        // Reset form dan tutup dialog
        setImportFile(null)
        setIsImportDialogOpen(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing Excel:", error)
      toast({
        title: "Error",
        description: "Gagal mengimpor data dari Excel",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {isLoading ? (
          <AdminInventorySkeleton />
        ) : (
          <div className="container pt-2 pb-20 md:pb-10">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Manajemen Inventaris</h1>
                <p className="text-muted-foreground">Kelola inventaris laboratorium elektronika</p>
              </div>

              {/* Filter dan Pencarian */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex flex-1 flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari barang..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <Button className="w-full md:w-auto" onClick={applyFilters}>
                    Filter
                  </Button>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full md:w-auto">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Import Excel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%] max-w-[400px] sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Import Data dari Excel</DialogTitle>
                        <DialogDescription>Upload file Excel (.xlsx) yang berisi data inventaris</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="excel-file">File Excel</Label>
                          <Input
                            id="excel-file"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleImportExcel}
                            ref={fileInputRef}
                          />
                          <p className="text-xs text-muted-foreground">
                            Format: Nama Barang, Kategori, Jumlah Total, Jumlah Tersedia, Lokasi, Deskripsi
                          </p>
                        </div>
                        {importFile && (
                          <div className="rounded-md bg-muted p-2 text-sm">File dipilih: {importFile.name}</div>
                        )}

                        {/* Tambahkan tombol download template di sini */}
                        <div className="pt-2">
                          <DownloadTemplateButton />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsImportDialogOpen(false)
                            setImportFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                        >
                          Batal
                        </Button>
                        <Button onClick={processExcelImport} disabled={!importFile || isImporting}>
                          {isImporting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengimpor...
                            </>
                          ) : (
                            "Import"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Dialog untuk tambah barang baru */}
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                      setIsAddDialogOpen(open)
                      if (!open) resetAddForm()
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Barang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%] max-w-[400px] sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Tambah Barang Baru</DialogTitle>
                        <DialogDescription>Tambahkan barang baru ke inventaris</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddSubmit}>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Barang</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Masukkan nama barang"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="category_id">Kategori</Label>
                              <Select
                                value={formData.category_id.toString()}
                                onValueChange={(value) => handleSelectChange("category_id", value)}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="total_quantity">Jumlah</Label>
                              <Input
                                id="total_quantity"
                                name="total_quantity"
                                type="number"
                                min={1}
                                placeholder="Masukkan jumlah barang"
                                value={formData.total_quantity}
                                onChange={(e) => handleNumberChange("total_quantity", e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">Lokasi Penyimpanan</Label>
                            <Input
                              id="location"
                              name="location"
                              placeholder="Contoh: Rak A1"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Deskripsi barang"
                              rows={3}
                              value={formData.description}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              "Simpan Barang"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Tabel Inventaris */}
              <div className="rounded-md border mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Tidak ada data yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.categories?.name || "-"}</TableCell>
                          <TableCell>
                            {item.available_quantity} / {item.total_quantity}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "available"
                                  ? "default"
                                  : item.status === "limited"
                                    ? "outline"
                                    : "secondary"
                              }
                              className={getStatusBadgeVariant(item.status)}
                            >
                              {getStatusText(item.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.location || "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dialog Edit Item */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Barang</DialogTitle>
            <DialogDescription>Edit informasi barang dalam inventaris</DialogDescription>
          </DialogHeader>
          {editItem && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Barang</Label>
                <Input
                  id="name"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <Select
                    value={editItem.category_id.toString()}
                    onValueChange={(value) => setEditItem({ ...editItem, category_id: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_quantity">Jumlah Total</Label>
                  <Input
                    id="total_quantity"
                    type="number"
                    min={0}
                    value={editItem.total_quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      setEditItem({
                        ...editItem,
                        total_quantity: value,
                        available_quantity: Math.min(editItem.available_quantity, value),
                      })
                    }}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available_quantity">Jumlah Tersedia</Label>
                  <Input
                    id="available_quantity"
                    type="number"
                    min={0}
                    max={editItem.total_quantity}
                    value={editItem.available_quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      setEditItem({
                        ...editItem,
                        available_quantity: Math.min(value, editItem.total_quantity),
                      })
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={editItem.location || ""}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={editItem.description || ""}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
