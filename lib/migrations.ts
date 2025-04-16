import { createClient } from '@supabase/supabase-js'

/**
 * Fungsi untuk menjalankan migrasi dan setup tabel-tabel yang diperlukan
 * untuk autentikasi admin
 */
export async function runAuthMigrations() {
  // Gunakan createClient langsung untuk menghindari dependencies next/headers
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Cek apakah tabel profiles sudah ada
  const { data: profilesExist, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
  
  if (checkError && checkError.code === '42P01') { // Tabel tidak ada
    console.log('Creating profiles table...')
    
    // Buat tabel profiles
    const { error: createError } = await supabase.rpc('create_profiles_table')
    
    if (createError) {
      console.error('Error creating profiles table:', createError)
      
      // Alternatif menggunakan SQL langsung
      const { error: sqlError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            role VARCHAR(255) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Trigger untuk mengisi tabel profiles saat user baru dibuat
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS TRIGGER AS $$
          BEGIN
            INSERT INTO public.profiles (id, role)
            VALUES (NEW.id, 'user');
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          
          CREATE OR REPLACE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        `
      })
      
      if (sqlError) {
        console.error('Error running SQL:', sqlError)
        throw new Error('Failed to create profiles table')
      }
    }
    
    console.log('Profiles table created successfully')
  } else if (checkError) {
    console.error('Error checking profiles table:', checkError)
    throw new Error('Failed to check profiles table')
  } else {
    console.log('Profiles table exists')
  }
  
  return { success: true }
}