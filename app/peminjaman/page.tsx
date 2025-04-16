"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/date-picker"
import { MultiItemSelect, type SelectedItem } from "@/components/multi-item-select"
import { BorrowingPageSkeleton } from "@/components/skeleton-loader"
import { createBorrowingRequest, createLabUsageRequest } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function BorrowingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const itemId = searchParams.get("item")

  const [formData, setFormData] = useState({
    name: "",
    npt: "",
    phone: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "08:00",
    endTime: "16:00",
    purpose: "",
    notes: "",
    documentation: null as File | null,
  })

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [formType, setFormType] = useState("peminjaman")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Initialize selected items if an item ID is provided in the URL
  useEffect(() => {
    if (itemId) {
      setSelectedItems([{ id: itemId, quantity: 1 }])
    }
  }, [itemId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateChange = (name: string, date: Date) => {
    setFormData((prev) => ({ ...prev, [name]: date }))

    // Clear error when date is changed
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, documentation: "Ukuran file maksimal 5MB" }))
        return
      }

      setFormData((prev) => ({ ...prev, documentation: file }))

      // Clear error when file is changed
      if (formErrors.documentation) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.documentation
          return newErrors
        })
      }
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Required fields
    if (!formData.name.trim()) errors.name = "Nama harus diisi"
    if (!formData.npt.trim()) errors.npt = "NPT harus diisi"
    if (!formData.phone.trim()) errors.phone = "Nomor HP harus diisi"
    if (!formData.purpose.trim()) errors.purpose = "Keperluan harus diisi"

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = "Nomor HP harus 10-15 digit angka"
    }

    // Date validation
    if (formData.startDate > formData.endDate) {
      errors.endDate = "Tanggal selesai harus setelah tanggal mulai"
    }

    // For peminjaman type, validate selected items
    if (formType === "peminjaman" && selectedItems.length === 0) {
      errors.items = "Pilih minimal satu barang"
    }

    // For penggunaan lab, validate time
    if (formType === "penggunaan") {
      if (formData.startTime >= formData.endTime) {
        errors.endTime = "Waktu selesai harus setelah waktu mulai"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (formType === "peminjaman") {
        // Submit borrowing request to Supabase
        await createBorrowingRequest(
          {
            name: formData.name,
            npt: formData.npt,
            phone: formData.phone,
            purpose: formData.purpose,
            notes: formData.notes,
            start_date: formData.startDate.toISOString().split("T")[0],
            end_date: formData.endDate.toISOString().split("T")[0],
          },
          selectedItems,
        )
      } else {
        // Submit lab usage request to Supabase
        await createLabUsageRequest({
          name: formData.name,
          npt: formData.npt,
          phone: formData.phone,
          purpose: formData.purpose,
          notes: formData.notes,
          start_date: formData.startDate.toISOString().split("T")[0],
          end_date: formData.endDate.toISOString().split("T")[0],
          start_time: formData.startTime,
          end_time: formData.endTime,
        })
      }

      // Show success message
      toast({
        title: "Permohonan berhasil dikirim",
        description: "Permohonan Anda telah berhasil dikirim dan akan segera diproses.",
      })

      // Format pesan WhatsApp untuk notifikasi admin
      let message = encodeURIComponent(
        `*Permohonan ${formType === "peminjaman" ? "Peminjaman Barang" : "Penggunaan Lab"}*\n\n` +
          `Nama: ${formData.name}\n` +
          `NPT: ${formData.npt}\n` +
          `No. HP: ${formData.phone}\n`,
      )

      if (formType === "peminjaman" && selectedItems.length > 0) {
        // Tambahkan informasi barang yang dipinjam
        const itemsText = selectedItems
          .map((item) => {
            const itemName = document.querySelector(`[data-value="${item.id}"]`)?.textContent || `Item ID: ${item.id}`
            return `- ${itemName.split(" (Tersedia")[0]} (${item.quantity} unit)`
          })
          .join("\n")

        message += encodeURIComponent(
          `\nBarang yang Dipinjam:\n${itemsText}\n\n` +
            `Tanggal Mulai: ${formData.startDate.toLocaleDateString("id-ID")}\n` +
            `Tanggal Selesai: ${formData.endDate.toLocaleDateString("id-ID")}\n`,
        )
      } else {
        // Penggunaan lab
        message += encodeURIComponent(
          `Tanggal Mulai: ${formData.startDate.toLocaleDateString("id-ID")}\n` +
            `Tanggal Selesai: ${formData.endDate.toLocaleDateString("id-ID")}\n` +
            `Waktu Mulai: ${formData.startTime}\n` +
            `Waktu Selesai: ${formData.endTime}\n`,
        )
      }

      message += encodeURIComponent(
        `\nKeperluan: ${formData.purpose}\n` +
          `${formData.notes ? `Catatan: ${formData.notes}\n\n` : ""}` +
          `${formData.documentation ? "Dokumentasi akan dikirimkan segera." : ""}`,
      )

      // Nomor WhatsApp admin (contoh)
      const adminPhone = "6282283475043"

      // Buka WhatsApp
      window.open(`https://wa.me/${adminPhone}?text=${message}`, "_blank")

      // Reset form or redirect
      router.push("/")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Gagal mengirim permohonan",
        description: "Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 md:pb-0">
        {isLoading ? (
          <BorrowingPageSkeleton />
        ) : (
          <div className="container py-8">
            <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold tracking-tight">Formulir Permohonan</h1>
              <p className="text-muted-foreground">
                Silakan isi formulir di bawah ini untuk mengajukan permohonan peminjaman barang atau penggunaan
                laboratorium
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Pilih Jenis Permohonan</CardTitle>
                  <CardDescription>Pilih jenis permohonan yang ingin diajukan</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="peminjaman"
                    onValueChange={(value) => {
                      setFormType(value)
                      setFormErrors({}) // Clear errors when changing tab
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
                      <TabsTrigger value="peminjaman">Peminjaman Barang</TabsTrigger>
                      <TabsTrigger value="penggunaan">Penggunaan Lab</TabsTrigger>
                    </TabsList>
                    <TabsContent value="peminjaman">
                      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nama Lengkap</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Masukkan nama lengkap"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className={formErrors.name ? "border-red-500" : ""}
                              />
                              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="npt">NPT</Label>
                              <Input
                                id="npt"
                                name="npt"
                                placeholder="Masukkan NPT"
                                required
                                value={formData.npt}
                                onChange={handleInputChange}
                                className={formErrors.npt ? "border-red-500" : ""}
                              />
                              {formErrors.npt && <p className="text-xs text-red-500 mt-1">{formErrors.npt}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Nomor HP</Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="Masukkan nomor HP"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={formErrors.phone ? "border-red-500" : ""}
                            />
                            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                          </div>

                          {/* Multi-item selection */}
                          <div className={formErrors.items ? "pb-1" : ""}>
                            <MultiItemSelect selectedItems={selectedItems} onChange={setSelectedItems} />
                            {formErrors.items && <p className="text-xs text-red-500 mt-1">{formErrors.items}</p>}
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Tanggal Mulai</Label>
                              <DatePicker
                                date={formData.startDate}
                                setDate={(date) => handleDateChange("startDate", date)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tanggal Selesai</Label>
                              <DatePicker
                                date={formData.endDate}
                                setDate={(date) => handleDateChange("endDate", date)}
                              />
                              {formErrors.endDate && <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="purpose">Keperluan</Label>
                            <Textarea
                              id="purpose"
                              name="purpose"
                              placeholder="Jelaskan keperluan peminjaman"
                              required
                              value={formData.purpose}
                              onChange={handleInputChange}
                              className={formErrors.purpose ? "border-red-500" : ""}
                            />
                            {formErrors.purpose && <p className="text-xs text-red-500 mt-1">{formErrors.purpose}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                            <Textarea
                              id="notes"
                              name="notes"
                              placeholder="Tambahkan catatan jika diperlukan"
                              value={formData.notes}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* File upload */}
                          <div className="space-y-2">
                            <Label htmlFor="documentation">Dokumentasi (Opsional)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="documentation"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("documentation")?.click()}
                                className={`w-full ${formErrors.documentation ? "border-red-500" : ""}`}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {formData.documentation ? formData.documentation.name : "Pilih File"}
                              </Button>
                              {formData.documentation && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setFormData((prev) => ({ ...prev, documentation: null }))}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {formErrors.documentation ? (
                              <p className="text-xs text-red-500 mt-1">{formErrors.documentation}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                Format yang didukung: JPG, PNG, PDF. Maksimal 5MB.
                              </p>
                            )}
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting || selectedItems.length === 0}>
                          {isSubmitting ? "Memproses..." : "Kirim Permohonan"}
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="penggunaan">
                      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nama Lengkap</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Masukkan nama lengkap"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className={formErrors.name ? "border-red-500" : ""}
                              />
                              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="npt">NPT</Label>
                              <Input
                                id="npt"
                                name="npt"
                                placeholder="Masukkan NPT"
                                required
                                value={formData.npt}
                                onChange={handleInputChange}
                                className={formErrors.npt ? "border-red-500" : ""}
                              />
                              {formErrors.npt && <p className="text-xs text-red-500 mt-1">{formErrors.npt}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Nomor HP</Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="Masukkan nomor HP"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={formErrors.phone ? "border-red-500" : ""}
                            />
                            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Tanggal Mulai</Label>
                              <DatePicker
                                date={formData.startDate}
                                setDate={(date) => handleDateChange("startDate", date)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tanggal Selesai</Label>
                              <DatePicker
                                date={formData.endDate}
                                setDate={(date) => handleDateChange("endDate", date)}
                              />
                              {formErrors.endDate && <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>}
                            </div>
                          </div>

                          {/* Waktu mulai dan selesai */}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="startTime">Waktu Mulai</Label>
                              <Input
                                id="startTime"
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endTime">Waktu Selesai</Label>
                              <Input
                                id="endTime"
                                name="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                                className={formErrors.endTime ? "border-red-500" : ""}
                              />
                              {formErrors.endTime && <p className="text-xs text-red-500 mt-1">{formErrors.endTime}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="purpose">Keperluan</Label>
                            <Textarea
                              id="purpose"
                              name="purpose"
                              placeholder="Jelaskan keperluan penggunaan lab"
                              required
                              value={formData.purpose}
                              onChange={handleInputChange}
                              className={formErrors.purpose ? "border-red-500" : ""}
                            />
                            {formErrors.purpose && <p className="text-xs text-red-500 mt-1">{formErrors.purpose}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                            <Textarea
                              id="notes"
                              name="notes"
                              placeholder="Tambahkan catatan jika diperlukan"
                              value={formData.notes}
                              onChange={handleInputChange}
                            />
                          </div>

                          {/* File upload */}
                          <div className="space-y-2">
                            <Label htmlFor="documentation-lab">Dokumentasi (Opsional)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="documentation-lab"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("documentation-lab")?.click()}
                                className={`w-full ${formErrors.documentation ? "border-red-500" : ""}`}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {formData.documentation ? formData.documentation.name : "Pilih File"}
                              </Button>
                              {formData.documentation && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setFormData((prev) => ({ ...prev, documentation: null }))}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {formErrors.documentation ? (
                              <p className="text-xs text-red-500 mt-1">{formErrors.documentation}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                Format yang didukung: JPG, PNG, PDF. Maksimal 5MB.
                              </p>
                            )}
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? "Memproses..." : "Kirim Permohonan"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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
