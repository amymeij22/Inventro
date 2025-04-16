import { getClientSupabaseClient } from './supabase'
import type { InventoryItem, Category, BorrowingRequest, LabUsageRequest, BorrowedItem } from './supabase'

// Fungsi untuk mendapatkan semua kategori
export async function getCategories(): Promise<Category[]> {
  const supabase = getClientSupabaseClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
  
  return data || []
}

// Fungsi untuk mendapatkan semua item inventaris
export async function getInventoryItems(
  search?: string,
  categoryId?: number,
  status?: string
): Promise<InventoryItem[]> {
  const supabase = getClientSupabaseClient()
  let query = supabase
    .from('inventory_items')
    .select(`
      *,
      categories (
        name
      )
    `)
  
  // Filter berdasarkan pencarian
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
  }
  
  // Filter berdasarkan kategori
  if (categoryId && categoryId !== 0) {
    query = query.eq('category_id', categoryId)
  }
  
  // Filter berdasarkan status
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query.order('name')
  
  if (error) {
    console.error('Error fetching inventory items:', error)
    throw new Error('Failed to fetch inventory items')
  }
  
  return data || []
}

// Fungsi untuk mendapatkan item inventaris berdasarkan ID
export async function getInventoryItemById(id: number): Promise<InventoryItem | null> {
  const supabase = getClientSupabaseClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Item tidak ditemukan
    }
    console.error('Error fetching inventory item:', error)
    throw new Error('Failed to fetch inventory item')
  }
  
  return data
}

// Fungsi untuk membuat permintaan peminjaman barang
export async function createBorrowingRequest(
  requestData: {
    name: string
    npt: string
    phone: string
    purpose: string
    notes?: string
    start_date: string
    end_date: string
  },
  items: { id: string; quantity: number }[]
): Promise<number> {
  const supabase = getClientSupabaseClient()
  
  // Mulai transaksi dengan membuat permintaan peminjaman
  const { data: request, error: requestError } = await supabase
    .from('borrowing_requests')
    .insert({
      name: requestData.name,
      npt: requestData.npt,
      phone: requestData.phone,
      purpose: requestData.purpose,
      notes: requestData.notes || null,
      start_date: requestData.start_date,
      end_date: requestData.end_date,
      status: 'pending'
    })
    .select('id')
    .single()
  
  if (requestError) {
    console.error('Error creating borrowing request:', requestError)
    throw new Error('Failed to create borrowing request')
  }
  
  // Tambahkan item yang dipinjam
  const borrowedItems = items.map(item => ({
    borrowing_request_id: request.id,
    inventory_item_id: parseInt(item.id),
    quantity: item.quantity
  }))
  
  const { error: itemsError } = await supabase
    .from('borrowed_items')
    .insert(borrowedItems)
  
  if (itemsError) {
    console.error('Error adding borrowed items:', itemsError)
    throw new Error('Failed to add borrowed items')
  }
  
  return request.id
}

// Fungsi untuk membuat permintaan penggunaan lab
export async function createLabUsageRequest(
  requestData: {
    name: string
    npt: string
    phone: string
    purpose: string
    notes?: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
  }
): Promise<number> {
  const supabase = getClientSupabaseClient()
  
  const { data, error } = await supabase
    .from('lab_usage_requests')
    .insert({
      name: requestData.name,
      npt: requestData.npt,
      phone: requestData.phone,
      purpose: requestData.purpose,
      notes: requestData.notes || null,
      start_date: requestData.start_date,
      end_date: requestData.end_date,
      start_time: requestData.start_time,
      end_time: requestData.end_time,
      status: 'pending'
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Error creating lab usage request:', error)
    throw new Error('Failed to create lab usage request')
  }
  
  return data.id
}

// Fungsi untuk mendapatkan semua permintaan peminjaman
export async function getBorrowingRequests(
  status?: string
): Promise<BorrowingRequest[]> {
  const supabase = getClientSupabaseClient()
  let query = supabase
    .from('borrowing_requests')
    .select(`
      *,
      borrowed_items (
        *,
        inventory_items (
          name,
          status
        )
      )
    `)
  
  // Filter berdasarkan status
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query.order('request_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching borrowing requests:', error)
    throw new Error('Failed to fetch borrowing requests')
  }
  
  return data || []
}

// Fungsi untuk mendapatkan semua permintaan penggunaan lab
export async function getLabUsageRequests(
  status?: string
): Promise<LabUsageRequest[]> {
  const supabase = getClientSupabaseClient()
  let query = supabase
    .from('lab_usage_requests')
    .select('*')
  
  // Filter berdasarkan status
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query.order('request_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching lab usage requests:', error)
    throw new Error('Failed to fetch lab usage requests')
  }
  
  return data || []
}

// Fungsi untuk mengubah status permintaan peminjaman
export async function updateBorrowingRequestStatus(
  id: number,
  status: 'pending' | 'approved' | 'rejected' | 'completed'
): Promise<void> {
  const supabase = getClientSupabaseClient()
  
  const { error } = await supabase
    .from('borrowing_requests')
    .update({ status })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating borrowing request status:', error)
    throw new Error('Failed to update borrowing request status')
  }
  
  // Jika status adalah 'approved', kurangi available_quantity dari inventory_items
  if (status === 'approved') {
    // Dapatkan semua item yang dipinjam
    const { data: borrowedItems, error: fetchError } = await supabase
      .from('borrowed_items')
      .select('inventory_item_id, quantity')
      .eq('borrowing_request_id', id)
    
    if (fetchError) {
      console.error('Error fetching borrowed items:', fetchError)
      throw new Error('Failed to fetch borrowed items')
    }
    
    // Update available_quantity untuk setiap item
    for (const item of borrowedItems) {
      // Dapatkan item inventaris saat ini
      const { data: inventoryItem, error: itemError } = await supabase
        .from('inventory_items')
        .select('available_quantity, total_quantity')
        .eq('id', item.inventory_item_id)
        .single()
      
      if (itemError) {
        console.error('Error fetching inventory item:', itemError)
        continue
      }
      
      // Hitung available_quantity baru
      const newAvailableQuantity = Math.max(0, inventoryItem.available_quantity - item.quantity)
      
      // Update status berdasarkan available_quantity baru
      let newStatus = 'available'
      if (newAvailableQuantity === 0) {
        newStatus = 'unavailable'
      } else if (newAvailableQuantity < inventoryItem.total_quantity / 3) {
        newStatus = 'limited'
      }
      
      // Update item inventaris
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          available_quantity: newAvailableQuantity,
          status: newStatus
        })
        .eq('id', item.inventory_item_id)
      
      if (updateError) {
        console.error('Error updating inventory item:', updateError)
      }
    }
  }
  
  // Jika status adalah 'completed' atau 'rejected' setelah 'approved', kembalikan available_quantity
  if ((status === 'completed' || status === 'rejected')) {
    // Dapatkan status sebelumnya
    const { data: prevRequest, error: prevError } = await supabase
      .from('borrowing_requests')
      .select('status')
      .eq('id', id)
      .single()
    
    if (prevError) {
      console.error('Error fetching previous request status:', prevError)
    } else if (prevRequest.status === 'approved') {
      // Dapatkan semua item yang dipinjam
      const { data: borrowedItems, error: fetchError } = await supabase
        .from('borrowed_items')
        .select('inventory_item_id, quantity')
        .eq('borrowing_request_id', id)
      
      if (fetchError) {
        console.error('Error fetching borrowed items:', fetchError)
      } else {
        // Update available_quantity untuk setiap item
        for (const item of borrowedItems) {
          // Dapatkan item inventaris saat ini
          const { data: inventoryItem, error: itemError } = await supabase
            .from('inventory_items')
            .select('available_quantity, total_quantity')
            .eq('id', item.inventory_item_id)
            .single()
          
          if (itemError) {
            console.error('Error fetching inventory item:', itemError)
            continue
          }
          
          // Hitung available_quantity baru
          const newAvailableQuantity = Math.min(
            inventoryItem.total_quantity, 
            inventoryItem.available_quantity + item.quantity
          )
          
          // Update status berdasarkan available_quantity baru
          let newStatus = 'available'
          if (newAvailableQuantity === 0) {
            newStatus = 'unavailable'
          } else if (newAvailableQuantity < inventoryItem.total_quantity / 3) {
            newStatus = 'limited'
          }
          
          // Update item inventaris
          const { error: updateError } = await supabase
            .from('inventory_items')
            .update({ 
              available_quantity: newAvailableQuantity,
              status: newStatus
            })
            .eq('id', item.inventory_item_id)
          
          if (updateError) {
            console.error('Error updating inventory item:', updateError)
          }
        }
      }
    }
  }
}

// Fungsi untuk mengubah status permintaan penggunaan lab
export async function updateLabUsageRequestStatus(
  id: number,
  status: 'pending' | 'approved' | 'rejected' | 'completed'
): Promise<void> {
  const supabase = getClientSupabaseClient()
  
  const { error } = await supabase
    .from('lab_usage_requests')
    .update({ status })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating lab usage request status:', error)
    throw new Error('Failed to update lab usage request status')
  }
}

// Fungsi untuk menambah item inventaris baru
export async function addInventoryItem(item: {
  name: string
  category_id: number
  total_quantity: number
  description?: string
  location?: string
}): Promise<number> {
  const supabase = getClientSupabaseClient()
  
  // Tentukan status berdasarkan total_quantity
  let status = 'available'
  if (item.total_quantity === 0) {
    status = 'unavailable'
  } else if (item.total_quantity < 3) {
    status = 'limited'
  }
  
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      name: item.name,
      category_id: item.category_id,
      total_quantity: item.total_quantity,
      available_quantity: item.total_quantity, // Awalnya available = total
      description: item.description || null,
      location: item.location || null,
      status
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Error adding inventory item:', error)
    throw new Error('Failed to add inventory item')
  }
  
  return data.id
}

// Fungsi untuk mengupdate item inventaris
export async function updateInventoryItem(id: number, item: {
  name?: string
  category_id?: number
  total_quantity?: number
  available_quantity?: number
  description?: string
  location?: string
  status?: 'available' | 'limited' | 'unavailable'
}): Promise<void> {
  const supabase = getClientSupabaseClient()
  
  // Jika total_quantity atau available_quantity diubah, tentukan status baru
  if (item.total_quantity !== undefined || item.available_quantity !== undefined) {
    // Dapatkan data item saat ini
    const { data: currentItem, error: fetchError } = await supabase
      .from('inventory_items')
      .select('total_quantity, available_quantity')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching inventory item:', fetchError)
      throw new Error('Failed to fetch inventory item')
    }
    
    // Hitung nilai baru
    const newTotalQuantity = item.total_quantity !== undefined ? item.total_quantity : currentItem.total_quantity
    const newAvailableQuantity = item.available_quantity !== undefined ? item.available_quantity : currentItem.available_quantity
    
    // Pastikan available_quantity tidak melebihi total_quantity
    const validAvailableQuantity = Math.min(newAvailableQuantity, newTotalQuantity)
    
    // Tentukan status baru
    let newStatus = 'available'
    if (validAvailableQuantity === 0) {
      newStatus = 'unavailable'
    } else if (validAvailableQuantity < newTotalQuantity / 3) {
      newStatus = 'limited'
    }
    
    // Update item dengan status baru
    item.available_quantity = validAvailableQuantity
    item.status = newStatus
  }
  
  const { error } = await supabase
    .from('inventory_items')
    .update(item)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating inventory item:', error)
    throw new Error('Failed to update inventory item')
  }
}

// Fungsi untuk menghapus item inventaris
export async function deleteInventoryItem(id: number): Promise<void> {
  const supabase = getClientSupabaseClient()
  
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting inventory item:', error)
    throw new Error('Failed to delete inventory item')
  }
}

// Fungsi untuk mendapatkan statistik dashboard
export async function getDashboardStats() {
  const supabase = getClientSupabaseClient()
  
  // Dapatkan total item inventaris
  const { data: totalItems, error: totalError } = await supabase
    .from('inventory_items')
    .select('total_quantity')
  
  if (totalError) {
    console.error('Error fetching total items:', totalError)
    throw new Error('Failed to fetch total items')
  }
  
  // Hitung total item
  const totalItemCount = totalItems.reduce((sum, item) => sum + item.total_quantity, 0)
  
  // Dapatkan item yang tersedia
  const { data: availableItems, error: availableError } = await supabase
    .from('inventory_items')
    .select('available_quantity')
  
  if (availableError) {
    console.error('Error fetching available items:', availableError)
    throw new Error('Failed to fetch available items')
  }
  
  // Hitung item yang tersedia
  const availableItemCount = availableItems.reduce((sum, item) => sum + item.available_quantity, 0)
  
  // Dapatkan jumlah permintaan yang tertunda
  const { count: pendingCount, error: pendingError } = await supabase
    .from('borrowing_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  
  if (pendingError) {
    console.error('Error fetching pending requests:', pendingError)
    throw new Error('Failed to fetch pending requests')
  }
  
  // Dapatkan jumlah permintaan yang selesai bulan ini
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
  
  const { count: completedCount, error: completedError } = await supabase
    .from('borrowing_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('updated_at', firstDayOfMonth)
    .lte('updated_at', lastDayOfMonth)
  
  if (completedError) {
    console.error('Error fetching completed requests:', completedError)
    throw new Error('Failed to fetch completed requests')
  }
  
  return {
    totalItems: totalItemCount,
    availableItems: availableItemCount,
    pendingRequests: pendingCount || 0,
    completedRequests: completedCount || 0
  }
}
