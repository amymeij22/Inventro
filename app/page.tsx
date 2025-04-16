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
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<HomePageSkeleton />}>
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Inventro</h1>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Sistem Manajemen Inventaris dan Peminjaman Barang Lab Elektronika STMKG
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/inventaris">
                    <Button>
                      Lihat Inventaris
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/peminjaman">
                    <Button variant="outline">Ajukan Peminjaman</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Fitur Utama</h2>
                  <p className="text-muted-foreground md:text-lg">Kelola inventaris dan peminjaman dengan mudah</p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventaris Digital</CardTitle>
                    <Clipboard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Akses data inventaris secara real-time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peminjaman Mudah</CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Ajukan peminjaman barang dengan cepat</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status Real-time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Pantau status peminjaman secara langsung</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Cara Kerja</h2>
                  <p className="text-muted-foreground md:text-lg">Proses peminjaman barang yang sederhana</p>
                </div>
              </div>
              <div className="mx-auto mt-8">
                <Tabs defaultValue="peminjaman" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="peminjaman">Peminjaman Barang</TabsTrigger>
                    <TabsTrigger value="penggunaan">Penggunaan Lab</TabsTrigger>
                  </TabsList>
                  <TabsContent value="peminjaman" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">1. Cari Barang</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Cari dan pilih barang yang ingin dipinjam dari daftar inventaris
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">2. Isi Formulir</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>Lengkapi formulir peminjaman dengan data diri dan keperluan</CardDescription>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">3. Konfirmasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Kirim bukti pendukung melalui WhatsApp dan tunggu persetujuan
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="penggunaan" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">1. Cek Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Periksa ketersediaan laboratorium pada jadwal yang diinginkan
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">2. Isi Formulir</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Lengkapi formulir penggunaan lab dengan data diri dan keperluan
                          </CardDescription>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">3. Konfirmasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
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
