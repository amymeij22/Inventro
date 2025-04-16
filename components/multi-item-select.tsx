"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getInventoryItems } from "@/lib/api"
import type { InventoryItem } from "@/lib/supabase"

export type SelectedItem = {
  id: string
  quantity: number
}

interface MultiItemSelectProps {
  selectedItems: SelectedItem[]
  onChange: (items: SelectedItem[]) => void
}

export function MultiItemSelect({ selectedItems, onChange }: MultiItemSelectProps) {
  const [currentItemId, setCurrentItemId] = useState("")
  const [currentQuantity, setCurrentQuantity] = useState(1)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maxQuantity, setMaxQuantity] = useState(1)

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true)
      try {
        // Fetch only available items
        const items = await getInventoryItems(undefined, undefined, "available")
        // Filter items with quantity > 0
        const availableItems = items.filter((item) => item.available_quantity > 0)
        setInventoryItems(availableItems)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch inventory:", err)
        setError("Gagal memuat data inventaris")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [])

  // Filter out items that are already selected
  const availableItems = inventoryItems.filter(
    (item) => !selectedItems.some((selected) => selected.id === item.id.toString()),
  )

  // Update max quantity when an item is selected
  useEffect(() => {
    if (currentItemId) {
      const item = inventoryItems.find((item) => item.id.toString() === currentItemId)
      if (item) {
        setMaxQuantity(item.available_quantity)
        setCurrentQuantity(1) // Reset to 1 when changing items
      }
    }
  }, [currentItemId, inventoryItems])

  const addItem = () => {
    if (!currentItemId || currentQuantity < 1) return

    // Find the item to check available quantity
    const item = inventoryItems.find((item) => item.id.toString() === currentItemId)
    if (!item) return

    // Validate quantity against available stock
    const requestedQuantity = Math.min(currentQuantity, item.available_quantity)
    if (requestedQuantity <= 0) {
      setError("Item tidak tersedia")
      return
    }

    const newItems = [
      ...selectedItems,
      {
        id: currentItemId,
        quantity: requestedQuantity,
      },
    ]

    onChange(newItems)
    setCurrentItemId("")
    setCurrentQuantity(1)
    setError(null)
  }

  const removeItem = (id: string) => {
    const newItems = selectedItems.filter((item) => item.id !== id)
    onChange(newItems)
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    // Find the inventory item to check its available quantity
    const inventoryItem = inventoryItems.find((item) => item.id.toString() === id)
    if (!inventoryItem) return

    // Ensure we don't exceed available quantity
    const validQuantity = Math.min(quantity, inventoryItem.available_quantity)

    const newItems = selectedItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: validQuantity }
      }
      return item
    })

    onChange(newItems)
  }

  const getItemDetails = (id: string) => {
    const item = inventoryItems.find((item) => item.id.toString() === id)
    return item ? { name: item.name, available: item.available_quantity } : { name: "", available: 0 }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Memuat data inventaris...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Barang yang Dipinjam</Label>
        {selectedItems.length === 0 ? (
          <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
            Belum ada barang yang dipilih
          </div>
        ) : (
          <div className="space-y-4">
            {selectedItems.map((item) => {
              const details = getItemDetails(item.id)
              return (
                <div key={item.id} className="flex items-center space-x-2">
                  <div className="flex-1 border rounded-md p-2 bg-muted/30">
                    <div className="font-medium">{details.name}</div>
                    <div className="text-xs text-muted-foreground">Tersedia: {details.available} unit</div>
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min={1}
                      max={details.available}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                      className="h-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-10 w-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {availableItems.length > 0 ? (
        <div className="flex items-end space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="itemId">Tambah Barang</Label>
            <Select value={currentItemId} onValueChange={setCurrentItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih barang" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()} data-value={item.id}>
                    {item.name} (Tersedia: {item.available_quantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-24 space-y-2">
            <Label htmlFor="quantity">Jumlah</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={maxQuantity}
              value={currentQuantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 1
                setCurrentQuantity(Math.min(value, maxQuantity))
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            disabled={!currentItemId || currentQuantity < 1}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Semua barang tersedia sudah dipilih</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
