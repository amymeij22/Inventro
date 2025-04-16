import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()

  // Create server-side Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Sign out on server side
  await supabase.auth.signOut()

  // Clear auth cookies
  const authCookies = ['sb-access-token', 'sb-refresh-token']
  authCookies.forEach(cookieName => {
    cookieStore.set({
      name: cookieName,
      value: '',
      expires: new Date(0),
      path: '/',
    })
  })

  return NextResponse.json({ success: true })
}