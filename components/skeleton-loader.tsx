import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// Skeleton untuk halaman beranda
export function HomePageSkeleton() {
  return (
    <div className="space-y-10">
      {/* Hero Section Skeleton */}
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-[200px] mx-auto" />
              <Skeleton className="h-6 w-[300px] mx-auto" />
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[180px] mx-auto" />
              <Skeleton className="h-6 w-[250px] mx-auto" />
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section Skeleton */}
      <div className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[150px] mx-auto" />
              <Skeleton className="h-6 w-[220px] mx-auto" />
            </div>
          </div>
          <div className="mx-auto mt-8">
            <div className="grid w-full grid-cols-2 rounded-lg border">
              <Skeleton className="h-10 rounded-l-lg" />
              <Skeleton className="h-10 rounded-r-lg" />
            </div>
            <div className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-6 w-[100px] mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%] mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk halaman inventaris
export function InventoryPageSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-5 w-[350px]" />

        {/* Filter dan Pencarian Skeleton */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Skeleton className="h-10 w-full md:w-[60%]" />
          <Skeleton className="h-10 w-full md:w-[20%]" />
          <Skeleton className="h-10 w-full md:w-[20%]" />
        </div>

        {/* Daftar Inventaris Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </div>
              <Skeleton className="h-4 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[100px] mb-4" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk halaman peminjaman
export function BorrowingPageSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-5 w-[350px]" />

        <div className="rounded-lg border">
          <div className="p-6">
            <Skeleton className="h-7 w-[200px] mb-2" />
            <Skeleton className="h-5 w-[250px] mb-6" />

            <div className="grid w-full grid-cols-2 rounded-lg border mb-6">
              <Skeleton className="h-10 rounded-l-lg" />
              <Skeleton className="h-10 rounded-r-lg" />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-[76px]" />
                <Skeleton className="h-[76px]" />
              </div>
              <Skeleton className="h-[76px]" />
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[76px]" />
              <Skeleton className="h-[76px]" />
              <Skeleton className="h-[76px]" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk halaman admin dashboard
export function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 pt-2 pb-10 md:pb-0">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-5 w-[250px]" />
            </div>
            <Skeleton className="h-10 w-[180px] hidden md:block" />
          </div>
          <Skeleton className="h-10 w-[180px] md:hidden" />
        </div>

        {/* Kartu Statistik Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          ))}
        </div>

        {/* Tabel Permintaan Skeleton */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-[150px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="rounded-md border">
            <div className="p-1">
              <div className="rounded-md bg-muted/50 p-3 mb-2">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-b p-3">
                  <div className="grid grid-cols-6 gap-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="h-5 w-[60px] ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk halaman inventaris admin
export function AdminInventorySkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>

        {/* Filter dan Pencarian Skeleton */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <Skeleton className="h-10 w-full md:w-[50%]" />
            <Skeleton className="h-10 w-full md:w-[25%]" />
            <Skeleton className="h-10 w-full md:w-[25%]" />
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        {/* Tabel Inventaris Skeleton */}
        <div className="rounded-md border">
          <div className="p-1">
            <div className="rounded-md bg-muted/50 p-3 mb-2">
              <div className="grid grid-cols-6 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b p-3">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-[40px] ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk halaman laporan admin
export function AdminReportSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Skeleton className="h-10 w-full sm:w-[250px]" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-[120px]" />
              <Skeleton className="h-9 w-[120px]" />
            </div>
          </div>

          {/* Filter Card Skeleton */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-[150px] mb-1" />
            <Skeleton className="h-4 w-[250px] mb-4" />
            <div className="flex flex-col space-y-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 sm:space-y-0">
              <Skeleton className="h-[76px] w-full sm:w-[200px]" />
              <Skeleton className="h-10 w-full sm:w-[150px]" />
            </div>
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <Skeleton className="h-6 w-[150px] mb-1" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>
            <div className="rounded-lg border p-6">
              <Skeleton className="h-6 w-[150px] mb-1" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-[150px] mb-1" />
            <Skeleton className="h-4 w-[250px] mb-4" />
            <div className="rounded-md border">
              <div className="p-1">
                <div className="rounded-md bg-muted/50 p-3 mb-2">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-b p-3">
                    <div className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-12 w-[300px] mx-auto sm:w-[400px] md:w-[500px]" />
              <Skeleton className="h-6 w-[250px] mx-auto sm:w-[350px] md:w-[450px]" />
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section Skeleton */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function RequestsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-[150px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="p-1">
          <div className="rounded-md bg-muted/50 p-3 mb-2">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b p-3">
              <div className="grid grid-cols-6 gap-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[60px] ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
