import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Clipboard, ClipboardCheck, Clock } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { HomePageSkeleton } from "@/components/skeleton-loader"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<HomePageSkeleton />}>
          {/* Hero Section */}
          <section className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
            <div className="container px-4 md:px-6 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-6 text-center max-w-3xl mx-auto">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Inventro</h1>
                  <p className="text-muted-foreground text-lg md:text-xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed max-w-2xl mx-auto">
                    Sistem Manajemen Inventaris dan Peminjaman Barang Lab Elektronika STMKG
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/inventaris">
                    <Button size="lg">
                      Lihat Inventaris
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/peminjaman">
                    <Button size="lg" variant="outline">Ajukan Peminjaman</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full h-screen flex items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto mb-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Fitur Utama</h2>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">Kelola inventaris dan peminjaman dengan mudah</p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10 mt-8">
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Inventaris Digital</CardTitle>
                    <Clipboard className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-muted-foreground">Akses data inventaris secara real-time</div>
                  </CardContent>
                </Card>
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Peminjaman Mudah</CardTitle>
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-muted-foreground">Ajukan peminjaman barang dengan cepat</div>
                  </CardContent>
                </Card>
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Status Real-time</CardTitle>
                    <Clock className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-base text-muted-foreground">Pantau status peminjaman secara langsung</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full h-screen flex items-center justify-center bg-muted/30">
            <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto mb-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Cara Kerja</h2>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">Proses peminjaman barang yang sederhana</p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-5xl mt-8">
                <Tabs defaultValue="peminjaman" className="w-full">
                  <div className="flex justify-center mb-10">
                    <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground shadow-md">
                      <TabsTrigger 
                        value="peminjaman" 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-3 text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Peminjaman Barang
                      </TabsTrigger>
                      <TabsTrigger 
                        value="penggunaan" 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-8 py-3 text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      >
                        Penggunaan Lab
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="peminjaman" className="mt-6">
                    <div className="grid gap-8 md:grid-cols-3">
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">1. Cari Barang</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            Cari dan pilih barang yang ingin dipinjam dari daftar inventaris
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">2. Isi Formulir</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">Lengkapi formulir peminjaman dengan data diri dan keperluan</CardDescription>
                        </CardContent>
                      </Card>
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">3. Konfirmasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            Kirim bukti pendukung melalui WhatsApp dan tunggu persetujuan
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="penggunaan" className="mt-6">
                    <div className="grid gap-8 md:grid-cols-3">
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">1. Cek Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            Periksa ketersediaan laboratorium pada jadwal yang diinginkan
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">2. Isi Formulir</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            Lengkapi formulir penggunaan lab dengan data diri dan keperluan
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card className="transition-all duration-300 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl">3. Konfirmasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            Kirim bukti pendukung melalui WhatsApp dan tunggu persetujuan
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </Suspense>
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
