# Marketzio Web V5

Template supermarket online static untuk **GitHub + Cloudflare Pages gratis**.

## Cara Test Lokal

1. Extract ZIP.
2. Buka folder `marketzio_web_v5` di Visual Studio Code.
3. Klik kanan `index.html`.
4. Pilih **Open with Live Server**.
5. Buka admin lewat:

```text
http://127.0.0.1:5500/admin.html
```

Login demo:

```text
Username: admin
Password: marketzio123
```

## Update V5

- Logo Marketzio bisa diganti dari admin.
- Admin dibuat seperti **Management System** dengan menu terpisah:
  - Dashboard
  - Toko & Logo
  - Banner
  - Kategori
  - Produk
  - Daftar Produk
  - Export
- Banner punya 2 gambar:
  - **Gambar luar banner** sebagai background besar.
  - **Gambar dalam banner** sebagai poster/icon promo kanan.
- Gambar luar dan gambar dalam punya setting:
  - Transparansi / kejelasan gambar.
  - Terang / gelap gambar.
- Banner bisa atur:
  - Ukuran font judul.
  - Warna judul.
  - Ukuran font deskripsi.
  - Warna deskripsi.
  - Ukuran dan warna label kecil.
  - Warna kotak badge.
  - Warna teks badge.
- Kategori bisa pakai foto/icon sendiri.
- Produk 4 kolom x 4 baris = 16 produk per halaman.
- Produk selanjutnya pakai pagination 1, 2, 3, dan seterusnya.

## Catatan Ukuran Gambar

| Bagian | Ukuran disarankan | Format | Ukuran file disarankan |
|---|---:|---|---:|
| Logo toko | 512×512 px atau 256×256 px | PNG / WebP / SVG | Maks 100–200 KB |
| Gambar luar banner | 1600×700 px atau 1920×800 px | JPG / WebP / PNG | Maks 500 KB–1 MB |
| Gambar dalam banner | 900×1200 px atau 800×1100 px | JPG / WebP / PNG | Maks 300–800 KB |
| Foto produk | 800×800 px atau 1000×1000 px | JPG / WebP / PNG | Maks 200–400 KB |
| Icon kategori | 256×256 px | PNG / SVG / WebP | Maks 100 KB |

## Cara Simpan Agar Tampil di Cloudflare

Perubahan dari admin tersimpan dulu di browser lokal.
Supaya tampil untuk semua pengunjung:

1. Buka `admin.html`.
2. Edit toko/banner/kategori/produk.
3. Masuk menu **Export**.
4. Klik **Download products.js**.
5. Replace file `products.js` di GitHub.
6. Cloudflare Pages akan deploy ulang otomatis.

## Catatan Penting

Admin ini masih versi static/localStorage. Untuk admin online yang benar-benar private dan otomatis tersimpan di server, versi berikutnya bisa dibuat pakai **Cloudflare Workers + D1 Database + R2 Storage**.


## Catatan Fix V5

Versi ini memperbaiki error di `script.js` yang membuat halaman market tidak merender kategori dan produk. Fungsi `getProduct()` dan `loadCart()` sudah ditambahkan kembali.


## Update V5.1
- Icon label kecil banner sekarang bisa ON/OFF dari menu Banner. Default dibuat OFF supaya gambar daun/sayur tidak muncul kalau tidak dibutuhkan.

## Update V5.2

- Menu Kategori di admin sekarang bisa mengatur urutan kategori.
- Cara pakai: klik tahan lalu geser kategori ke atas/bawah, atau gunakan tombol ↑ dan ↓.
- Urutan kategori di halaman market mengikuti urutan yang tersimpan di admin.
- Kategori "Semua" tetap tidak bisa dihapus, tetapi bisa dipindah urutannya kalau ingin kategori lain tampil lebih depan.
Update deploy
