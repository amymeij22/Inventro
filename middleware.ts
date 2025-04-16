import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Setting cookies on the response
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // Removing cookies from the response
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  // Check session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Check if the request is for the admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && 
                        request.nextUrl.pathname !== '/admin'  // Exclude main admin login page
  
  if (isAdminRoute && !session) {
    // Redirect to admin login if not authenticated
    const redirectUrl = new URL('/admin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // For authenticated users trying to access admin dashboard pages,
  // check if they have admin role
  if (isAdminRoute && session) {
    try {
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (error || !userData || userData.role !== 'admin') {
        // Redirect to admin login if not an admin
        const redirectUrl = new URL('/admin', request.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error checking admin role:', error)
      // Redirect to admin login on error
      const redirectUrl = new URL('/admin', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

// Match all admin pages except the main login page
export const config = {
  matcher: ['/admin/:path*']
}