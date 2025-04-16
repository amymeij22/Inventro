# Inventro - Sistem Manajemen Inventaris Laboratorium Elektronika STMKG

Inventro adalah sistem manajemen inventaris dan peminjaman barang yang dikembangkan untuk Laboratorium Elektronika STMKG. Aplikasi ini menyediakan solusi digital untuk mengelola inventaris laboratorium, memproses permintaan peminjaman barang, dan mengatur penggunaan laboratorium.

## Live Application

Aplikasi ini dapat diakses secara online di [inventro.amymeij.web.id](https://inventro.amymeij.web.id)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 14+ dengan App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Backend/Database**: [Supabase](https://supabase.com)
- **Authentication**: Supabase Auth
- **Language**: TypeScript

## Fitur Utama

### 1. Manajemen Inventaris
- Pelacakan barang dengan status (tersedia, terbatas, tidak tersedia)
- Kategorisasi barang
- Pelacakan lokasi penyimpanan
- Import/export data melalui Excel
- Informasi detail barang dengan deskripsi

### 2. Sistem Peminjaman
- Formulir pengajuan peminjaman barang
- Alur persetujuan admin
- Pelacakan status (menunggu, disetujui, ditolak, selesai)
- Peminjaman multi-item
- Spesifikasi tanggal peminjaman dan pengembalian

### 3. Pengelolaan Penggunaan Laboratorium
- Penjadwalan penggunaan laboratorium
- Pengecekan ketersediaan
- Manajemen permintaan penggunaan lab

### 4. Laporan
- Laporan inventaris
- Riwayat peminjaman
- Statistik penggunaan laboratorium

## Struktur Aplikasi

```
├── app/                    # Next.js App Router
│   ├── admin/              # Halaman admin
│   │   ├── dashboard/      # Dashboard admin
│   │   ├── inventaris/     # Manajemen inventaris
│   │   ├── laporan/        # Laporan
│   │   ├── peminjaman/     # Manajemen peminjaman
│   │   └── penggunaan-lab/ # Manajemen penggunaan lab
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
- Ajukan peminjaman barang melalui form Peminjaman
- Konfirmasi dengan mengirim bukti pendukung melalui WhatsApp
- Pantau status peminjaman

### 2. Sebagai Admin
- Login ke halaman admin
- Kelola inventaris (tambah, edit, hapus barang)
- Proses permintaan peminjaman (setujui/tolak)
- Kelola penggunaan laboratorium
- Akses laporan dan statistik

## Memulai Pengembangan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18.0 atau lebih tinggi
- [npm](https://www.npmjs.com/) atau [pnpm](https://pnpm.io/) (direkomendasikan)
- Akun [Supabase](https://supabase.com)

### Cloning Repository

1. Clone repository ini ke mesin lokal:

```bash
git clone [repository-url]
cd myinventro
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

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

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

## Deployment

Aplikasi ini dioptimalkan untuk di-deploy di platform [Vercel](https://vercel.com).

## Kontribusi

Kontribusi terhadap proyek ini sangat diterima. Silakan fork repository ini dan buat pull request dengan perubahan Anda.

## Lisensi

Hak Cipta © STMKG

---

Dibuat dengan ❤️ untuk Laboratorium Elektronika STMKG
