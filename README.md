# Inventro - Sistem Manajemen Inventaris Laboratorium Elektronika STMKG

Inventro adalah sistem manajemen inventaris dan peminjaman barang yang dikembangkan untuk Laboratorium Elektronika STMKG. Aplikasi ini menyediakan solusi digital untuk mengelola inventaris laboratorium, memproses permintaan peminjaman barang, dan mengatur penggunaan laboratorium.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 15+ dengan App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Backend/Database**: [Supabase](https://supabase.com)
- **Authentication**: Supabase Auth
- **Data Visualization**: Recharts
- **Ekspor Data**: XLSX, jsPDF
- **Language**: TypeScript

## Fitur Utama

### 1. Manajemen Inventaris
- Pelacakan barang dengan status (tersedia, terbatas, tidak tersedia)
- Kategorisasi barang
- Pelacakan lokasi penyimpanan
- Import/export data melalui Excel dengan template otomatis
- Informasi detail barang dengan deskripsi
- Pengelolaan stok otomatis

### 2. Sistem Peminjaman
- Formulir pengajuan peminjaman barang
- Alur persetujuan admin
- Pelacakan status (menunggu, disetujui, ditolak, selesai)
- Peminjaman multi-item
- Spesifikasi tanggal peminjaman dan pengembalian
- Upload dokumentasi pendukung
- Pembaruan stok otomatis saat peminjaman dan pengembalian

### 3. Pengelolaan Penggunaan Laboratorium
- Penjadwalan penggunaan laboratorium
- Pengecekan ketersediaan
- Manajemen permintaan penggunaan lab
- Spesifikasi waktu mulai dan selesai
- Upload dokumentasi pendukung

### 4. Laporan dan Visualisasi Data
- Laporan inventaris dengan grafik status dan kategori
- Riwayat peminjaman dengan filter periode
- Statistik penggunaan laboratorium
- Ekspor laporan ke format Excel dan PDF
- Visualisasi data dengan chart interaktif
- Filter laporan berdasarkan rentang tanggal

### 5. Dashboard Admin
- Ringkasan statistik inventaris dan peminjaman
- Tampilan permintaan terbaru
- Status inventaris secara real-time
- Informasi barang yang paling sering dipinjam

### 6. Utilitas
- Template untuk impor data inventaris
- Ekspor data ke Excel dan PDF
- Manajemen dokumen pendukung
- Pencarian dan filter data

## Struktur Aplikasi

```
├── app/                    # Next.js App Router
│   ├── admin/              # Halaman admin
│   │   ├── dashboard/      # Dashboard admin
│   │   ├── inventaris/     # Manajemen inventaris
│   │   ├── laporan/        # Laporan
│   │   ├── peminjaman/     # Manajemen peminjaman
│   │   ├── penggunaan-lab/ # Manajemen penggunaan lab
│   │   └── setup-utility/  # Utilitas setup dan konfigurasi
│   ├── inventaris/         # Halaman inventaris publik
│   └── peminjaman/         # Halaman pengajuan peminjaman publik
├── components/             # Komponen React
├── lib/                    # Utility functions dan API clients
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Cara Penggunaan

### 1. Sebagai Pengguna
- Lihat daftar inventaris di halaman Inventaris
- Filter barang berdasarkan kategori atau status
- Ajukan peminjaman barang melalui form Peminjaman
- Pilih barang, tentukan jumlah, dan jadwal peminjaman
- Upload dokumen pendukung (opsional)
- Konfirmasi dengan mengirim bukti pendukung melalui WhatsApp
- Pantau status peminjaman

### 2. Sebagai Admin
- Login ke halaman admin
- Kelola inventaris (tambah, edit, hapus barang)
- Import/export data inventaris dengan Excel
- Proses permintaan peminjaman (setujui/tolak)
- Kelola penggunaan laboratorium
- Lihat dan ekspor laporan ke Excel atau PDF
- Akses statistik dan visualisasi data
- Pembaruan status permintaan dan pengaruhnya pada stok

## Memulai Pengembangan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.0 atau lebih tinggi
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/) (direkomendasikan)
- Akun [Supabase](https://supabase.com)

### Cloning Repository

1. Clone repository ini ke mesin lokal:

```bash
git clone [repository-url]
cd inventro
```

2. Install dependencies:

```bash
npm install
# atau
pnpm install
# atau
yarn install
```

3. Salin file `.env.example` menjadi `.env.local` dan isi variabel lingkungan yang diperlukan:

4. Jalankan development server:

```bash
npm run dev
# atau
pnpm dev
# atau
yarn dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

### Setup Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan migrasi database (SQL tersedia di folder `migrations` jika ada)
3. Atur kebijakan keamanan Supabase sesuai kebutuhan
4. Pastikan tabel-tabel berikut sudah tersedia:
   - `inventory_items` (untuk inventaris)
   - `categories` (untuk kategori barang)
   - `borrowing_requests` (untuk permintaan peminjaman)
   - `borrowed_items` (untuk item yang dipinjam)
   - `lab_usage_requests` (untuk permintaan penggunaan lab)

## Deployment

Aplikasi ini dioptimalkan untuk di-deploy di platform [Vercel](https://vercel.com).

## Kontribusi

Kontribusi terhadap proyek ini sangat diterima. Silakan fork repository ini dan buat pull request dengan perubahan Anda.

## Lisensi

This project is open source and available under the [MIT License](LICENSE)

---

Dibuat dengan ❤️ untuk Laboratorium Elektronika STMKG
