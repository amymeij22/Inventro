"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { generateInventoryImportTemplate } from "./template-action"
import { useToast } from "@/components/ui/use-toast"

export function DownloadTemplateButton() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDownloadTemplate = async () => {
    setIsLoading(true)

    try {
      const result = await generateInventoryImportTemplate()

      if (result.success && result.buffer) {
        // Buat blob dari buffer
        const blob = new Blob([result.buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        // Buat URL untuk blob
        const url = URL.createObjectURL(blob)

        // Buat link untuk download
        const a = document.createElement("a")
        a.href = url
        a.download = "template-import-inventaris.xlsx"
        document.body.appendChild(a)
        a.click()

        // Bersihkan
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Sukses",
          description: "Template berhasil diunduh",
        })
      } else {
        throw new Error(result.error || "Gagal mengunduh template")
      }
    } catch (error) {
      console.error("Error downloading template:", error)
      toast({
        title: "Error",
        description: "Gagal mengunduh template",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadTemplate} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
      Download Template
    </Button>
  )
}

export default DownloadTemplateButton
