# PPV Tugas 4, Prototipe Terpadu (Iqgam Afrizal, 5125500042)

## 1. Tabel perbaikan bug latihan (`latihan-debug/`)

| No | Gejala | Penyebab (berkas:baris) | Perbaikan | Bukti |
|----|--------|-------------------------|-----------|-------|
| G1 | Pindah ke Statistik terjadi seketika; transisi memudar yang ditulis di CSS tidak pernah terlihat. | `main.js:14-26`, tampilan disembunyikan dan ditampilkan dalam satu langkah; transisi tidak pernah terlihat. | Tampilkan dulu baru tambah `.aktif`; sembunyikan via `timeout 210ms`. | Klik Daftar-Statistik: fade 200ms terlihat dua arah. |
| G2 | Pesan kesalahan muncul, tetapi kotak isian tidak bergetar sama sekali. | `main.js:72`, kotak isian digeser lewat posisi kiri; kotak tidak punya posisi sehingga tidak bergerak sama sekali. | Bergetar via `element.animate()` keyframes `translateX`, 300ms. | Isi "ab" + Tambah: bergetar, pesan muncul, fokus kembali. |
| G3 | Setiap kali satu tugas ditambahkan, semua kartu ikut beranimasi masuk lagi. | `main.js:29-51`, setiap tambah data seluruh kartu dibuat ulang; semuanya ikut beranimasi masuk lagi. | Hanya kartu baru yang animate via `buatItem(t, denganAnimasi)`. | Tambah 3 tugas: hanya kartu baru yang masuk. |
| G4 | Teks yang diketik pengguna diperlakukan sebagai HTML. | `main.js:29`, tulisan pengguna ditempel sebagai HTML; kode jahat bisa ikut berjalan. | Tampilkan tulisan via `textContent`, bukan `innerHTML`. | Tambah `<b>tebal</b>`: tampil sebagai teks polos. |
| G5 | Setelah beberapa tugas ditambahkan, mencentang tugas kadang tidak mencoretnya. | `main.js:51-55`, pencatat klik didaftarkan setiap daftar digambar; satu klik dihitung berkali-kali. | Listener dipindah ke luar, daftar 1x. | Tambah 3 tugas, centang pertama: langsung tercoret. |
| G6 | Saat Hapus diklik, kartu langsung lenyap; animasi keluar tidak pernah terlihat. | `main.js:59-70`, kartu langsung dibuang; animasi keluar tidak pernah terlihat. | Tunggu `animation.finished` baru filter + `remove()`. | Klik Hapus: fade-out 220ms terlihat penuh. |
| G7 | Bolak-balik ke Statistik membuat angka progres makin cepat, kadang meloncat-loncat, dan pekerjaan di latar tidak pernah berhenti. | `main.js:104-114`, setiap buka Statistik membuat penghitung baru; yang lama tidak pernah berhenti. | Simpan `idProgres`; matikan tiap panggil dan saat target tercapai. | Buka-tutup 5x: kecepatan tetap, panel Performance bersih. |
| G8 | Bilah progres dianimasikan dengan properti yang memaksa peramban menghitung ulang tata letak di setiap langkah. | `main.js:114` dan `style.css`, lebar bilah diubah tiap langkah; tata letak dihitung ulang setiap kali. | Lebar penuh + `transform scaleX()`. | Rekam Performance: tanpa peristiwa Layout. |
| G9 | Pengguna yang mengaktifkan pengaturan "kurangi gerak" di sistem operasinya tetap mendapat semua animasi. | `main.js:2` dan `style.css`, pengaturan kurangi-gerak tidak pernah diperiksa; semua animasi tetap berjalan. | Periksa `kurangiGerak()` di semua animasi + `@media reduce`. | Emulasi reduce di DevTools: langsung nilai akhir. |

## 2. Peta navigasi aplikasi (`aplikasi/`)

Daftar Tugas (form + list) ke Statistik (angka + bar) ke Matkul (kelola daftar mata kuliah untuk dropdown) ke Tentang (profil + cara pakai). Satu header nav, `aria-current` menandai menu aktif.

```
Header (semua halaman): [Daftar Tugas] [Statistik] [Matkul] [Tentang]
           |                  |              |             |
           v                  v              v             v
     Daftar Tugas        Statistik         Matkul        Tentang
     form + list         angka + bar       kelola list   info + cara pakai
```

## 3. Tabel animasi aplikasi

| ID | Fungsi | Pemicu | Properti | Durasi | Implementasi |
|----|--------|--------|----------|--------|--------------|
| A-01 | Menunjukkan di mana data baru muncul | submit form valid | opacity dan transform | 250ms ease-out | `li.animate()` di `buatLi()` |
| A-02 | Menandai isian yang salah | submit form invalid | translateX keyframes | 300ms ease-out | `getar()` via `element.animate()` |
| A-03 | Menunjukkan progres penyelesaian | klik tab Statistik | scaleX dan opacity | 350ms / 200ms | `requestAnimationFrame` + transisi CSS |

Semua hormat `prefers-reduced-motion` (JS `matchMedia` + CSS `@media`).

## 4. Media

1. `assets/hero.svg`: ilustrasi clipboard, kalender, dan pensil di keadaan kosong. Ada `alt` dan kalimat pengganti bila gagal dimuat.
2. `assets/ikon-tugas.svg`: ikon tas kuliah. Ada `alt` dan disembunyikan rapi bila gagal dimuat.

## 5. Uji coba (Fara dan Nio, 10 Okt 2026)

| ID | Temuan (penguji, kapan) | Perbaikan | Uji ulang |
|----|-------------------------|-----------|-----------|
| U-01 | Fara tidak paham menu Daftar, dikira pendaftaran akun. 1 dari 2 penguji, 10 Okt 2026, 40 detik | Ganti label nav jadi "Daftar Tugas" | Uji ulang: langsung paham tanpa tanya |
| U-02 | Nio sulit bedakan Tinggi vs Sedang saat tugas banyak, takut kelewat. 1 dari 2 penguji, 10 Okt 2026, 50 detik | Daftar diurutkan Tinggi teratas + garis merah | Uji ulang: tugas Tinggi ketemu tanpa mencari |

Cara uji: berikan aplikasi ke teman lalu diam; minta tambah dan selesaikan 1 tugas tanpa didampingi.

## 6. Sumber

Font Inter: Google Fonts https://fonts.google.com/specimen/Inter (lisensi SIL OFL). Basis kode aplikasi adalah Tugas 3 milik sendiri; tanpa salinan dari sumber luar.
