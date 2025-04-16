"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, Package, ClipboardList, LayoutDashboard, FileText, Inbox, Beaker, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Cek apakah pengguna berada di halaman admin
  const isAdminPage = pathname.startsWith("/admin")

  // Menu untuk pengguna biasa
  const userNavItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/inventaris", label: "Inventaris", icon: Package },
    { href: "/peminjaman", label: "Ajukan Peminjaman", icon: ClipboardList },
  ]

  // Menu untuk admin
  const adminNavItems = [
    { href: "/admin/dashboard", label: "Beranda", icon: Home },
    { href: "/admin/inventaris", label: "Inventaris", icon: Package },
    { href: "/admin/peminjaman", label: "Peminjaman", icon: ClipboardList },
    { href: "/admin/penggunaan-lab", label: "Penggunaan Lab", icon: Beaker },
    { href: "/admin/laporan", label: "Laporan", icon: FileText },
  ]

  // Pilih menu yang akan ditampilkan berdasarkan jenis pengguna
  const navItems = isAdminPage ? adminNavItems : userNavItems

  // Modifikasi menu untuk tampilan mobile admin, dengan menggabungkan Peminjaman dan Penggunaan Lab
  const mobileNavItems = isAdminPage ? [
    adminNavItems[0], // Beranda
    adminNavItems[1], // Inventaris
    { href: "#", label: "Permintaan", icon: ClipboardList, isDropdown: true }, // Combined menu
    adminNavItems[4], // Laporan
  ] : userNavItems;

  // Dropdown items untuk menu Permintaan
  const permintaanDropdownItems = [
    { href: "/admin/peminjaman", label: "Peminjaman Barang" },
    { href: "/admin/penggunaan-lab", label: "Penggunaan Ruangan" }
  ]

  return (
    <>
      <div className="flex items-center w-full relative">
        <Link href={isAdminPage ? "/admin/dashboard" : "/"} className="flex items-center space-x-2">
          <span className="font-bold text-xl">
            {isAdminPage ? "Inventro" : "Inventro"}
          </span>
        </Link>
        
        {/* Desktop navigation - Centered, visible only on md and above */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-10 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary font-medium",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 md:hidden">
        <div className="flex justify-between items-center h-16 px-6">
          {mobileNavItems.map((item, index) => {
            const Icon = item.icon
            // Distribute icons evenly for mobile
            const position = index === 0 ? "justify-start" : 
                             index === mobileNavItems.length - 1 ? "justify-end" : "justify-center"
                             
            // Special handling for the dropdown item
            if (item.isDropdown && isAdminPage) {
              return (
                <div key={item.href} className={`flex-1 flex ${position}`}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex flex-col items-center justify-center p-2",
                          (pathname === '/admin/peminjaman' || pathname === '/admin/penggunaan-lab') 
                            ? "text-primary" 
                            : "text-muted-foreground",
                        )}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs mt-1 flex items-center">
                          {item.label.split(" ")[0]}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 bottom-16">
                      {permintaanDropdownItems.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.href} asChild>
                          <Link
                            href={dropdownItem.href}
                            className={cn(
                              "w-full text-center py-2",
                              pathname === dropdownItem.href ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {dropdownItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            }

            return (
              <div key={item.href} className={`flex-1 flex ${position}`}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-2",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.label.split(" ")[0]}</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
