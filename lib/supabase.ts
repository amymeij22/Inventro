import { createBrowserClient } from '@supabase/ssr'

// Tipe untuk item inventaris dari database
export type InventoryItem = {
  id: number
  name: string
  category_id: number
  total_quantity: number
  available_quantity: number
  description: string | null
  location: string | null
  status: 'available' | 'limited' | 'unavailable'
  image_url: string | null
  created_at: string
  updated_at: string
  // Join dengan tabel categories
  categories?: {
    name: string
  }
}

// Tipe untuk kategori
export type Category = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

// Tipe untuk permintaan peminjaman
export type BorrowingRequest = {
  id: number
  name: string
  npt: string
  phone: string
  purpose: string
  notes: string | null
  start_date: string
  end_date: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  request_date: string
  documentation_url: string | null
  created_at: string
  updated_at: string
  // Relasi dengan borrowed_items
  borrowed_items?: BorrowedItem[]
}

// Tipe untuk item yang dipinjam
export type BorrowedItem = {
  id: number
  borrowing_request_id: number
  inventory_item_id: number
  quantity: number
  created_at: string
  updated_at: string
  // Join dengan inventory_items
  inventory_items?: {
    name: string
    status: string
  }
}

// Tipe untuk permintaan penggunaan lab
export type LabUsageRequest = {
  id: number
  name: string
  npt: string
  phone: string
  purpose: string
  notes: string | null
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  request_date: string
  documentation_url: string | null
  created_at: string
  updated_at: string
}

// Singleton pattern untuk klien Supabase di sisi klien
let clientSupabaseInstance: ReturnType<typeof createBrowserClient> | null = null

// Fungsi untuk mendapatkan klien Supabase di sisi klien (browser)
export const getClientSupabaseClient = () => {
  if (clientSupabaseInstance) return clientSupabaseInstance
  
  clientSupabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return clientSupabaseInstance
}

// Fungsi untuk mendapatkan klien Supabase dengan service role key (hanya untuk operasi admin sensitif)
export const getServiceSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
