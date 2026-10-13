# PPV Tugas 4, Prototipe Terpadu (Iqgam Afrizal)

## 1. Tabel perbaikan bug latihan (`latihan-debug/`)

| No | Gejala | Penyebab (berkas:baris awal) | Perbaikan | Bukti |
|----|--------|-------------------------------|-----------|-------|
| G1 | Pindah Statistik seketika, tanpa fade | `main.js:17-21`: `hidden` + `toggle aktif` satu frame, transisi mati | Tampilkan dulu (`hidden=false` + `void offsetWidth`), tambah `.aktif`; sembunyikan lama via `setTimeout 210ms` | Klik Daftar ke Statistik: fade 200ms terlihat |
| G2 | Input salah tidak bergetar | `main.js:getar`: `el.style.left` tanpa `position` | `el.animate()` keyframes `translateX`, 300ms | Isi "ab" + Tambah: getar + pesan error |
| G3 | Semua kartu animasi tiap tambah 1 | `main.js:tampil/buatItem`: `replaceChildren(map(buatItem))` semua di-animate | `buatItem(t, denganAnimasi)` + `tampil(idBaru)`; hanya id baru animate | Tambah 3 tugas: hanya kartu baru masuk |
| G4 | Input `<b>`/`<img onerror>` dieksekusi | `main.js:buatItem`: `innerHTML ${t.judul}` | `createElement` + `textContent` | Tambah `<b>tebal</b>`: tampil sebagai teks |
| G5 | Centang kadang tidak mencoret | `main.js:tampil`: `addEventListener` di dalam `tampil()` menumpuk | Listener dipindah ke luar, daftar 1x | Tambah 3, centang pertama: langsung tercoret |
| G6 | Hapus langsung lenyap | handler hapus: `animate()` lalu `remove()` sinkron | `await animation.finished` baru filter + `remove()` | Klik Hapus: fade-out 220ms terlihat |
| G7 | Bolak-balik Statistik makin cepat | `animasikanProgres`: `setInterval` tanpa `clear` | Simpan `idProgres`, `clearInterval` tiap panggil + saat target tercapai | Klik Daftar-Statistik 5x: kecepatan tetap |
| G8 | Progres pakai `width` (layout tiap frame) | `isiProgres.style.width` + `.isi{width:0}` | `.isi{width:100%; transform:scaleX(0)}` + `style.transform=scaleX()` | Performance: tanpa Layout berulang |
| G9 | Reduce-motion diabaikan | tanpa `matchMedia` / `@media` | `kurangiGerak()` guard semua animasi + `@media (prefers-reduced-motion: reduce){transition:none}` | Emulasi reduce di DevTools: animasi diskip |

## 2. Peta navigasi aplikasi (`aplikasi/`)

Daftar Tugas (form + list) ke Statistik (angka + bar) ke Matkul (kelola daftar mata kuliah untuk dropdown) ke Tentang (profil + cara pakai). Satu header nav, `aria-current` menandai menu aktif.

## 3. Tabel animasi aplikasi

| ID | Fungsi | Pemicu | Properti | Durasi | Implementasi |
|----|--------|--------|----------|--------|--------------|
| A-01 | Tunjukkan posisi kartu baru | submit valid | opacity + transform translateY | 250ms ease-out | `li.animate()` di `buatLi()` |
| A-02 | Tandai isian salah | submit invalid | transform translateX keyframes | 300ms ease-out | `getar()` via `element.animate()` |
| A-03 | Progres + pindah view | klik tab Statistik | transform scaleX + opacity | 350ms / 200ms | `requestAnimationFrame` + CSS transition; `transform` saja |

Semua hormat `prefers-reduced-motion` (JS `matchMedia` + CSS `@media`).

## 4. Media

1. `assets/hero.svg`: ilustrasi clipboard, kalender, dan pensil di keadaan kosong. Ada `alt` dan kalimat pengganti bila gagal dimuat.
2. `assets/ikon-tugas.svg`: ikon tas kuliah. Ada `alt` dan disembunyikan rapi bila gagal dimuat.

## 5. Uji coba (ISI MANUAL: nama + tanggal)

| ID | Temuan (penguji, kapan) | Perbaikan | Uji ulang |
|----|-------------------------|-----------|-----------|
| U-01 | Fara bingung menu "Daftar" dikira pendaftaran akun, 10 Okt 2026, 40 detik | Ganti label nav jadi "Daftar Tugas" | Uji ulang: langsung paham tanpa tanya |
| U-02 | Nio sulit bedakan Tinggi vs Sedang saat tugas banyak, takut kelewat, 10 Okt 2026, 50 detik | Daftar diurutkan Tinggi teratas + garis merah | Uji ulang: tugas Tinggi ketemu tanpa mencari |

Cara uji: buka `aplikasi/index.html`, minta teman tambah + selesaikan 1 tugas tanpa didampingi, catat waktu + bingungnya.

## 6. Menjalankan ulang

1. `latihan-debug/index.html`: klik ganda di Chrome/Firefox, F12.
2. `aplikasi/index.html`: sama; data tersimpan di `localStorage`.
3. Responsif: DevTools device 400px + laptop, pastikan tanpa scroll horizontal.

## 7. Eviden pengumpulan

- `git-log.txt`: dari `git log --oneline`
- Rekaman 15 sampai 30 dtk MP4: rekam A-01 + A-02 (pakai Xbox Game Bar `Win+G` / OBS)
- PDF max 4 hal: salin isi README ini + screenshot HP/laptop
- ZIP `NRP_Nama_PPV_Tugas4.zip` isi `latihan-debug/ + aplikasi/ + git-log.txt + MP4`

## 8. Catatan desain aplikasi (satu baris per keputusan)

- Header terang dengan nav pil: kemauan pemilik, dipertahankan dari Tugas 3.
- Nav pil terpisah: status aktif terbaca dari isi penuh biru.
- Biru hanya di Simpan, nav aktif, progres: menandai aksi utama dan status selesai.
- Prioritas sebagai teks, merah hanya untuk Tinggi: merah berarti peringatan.
- Kartu datar bergaris tepi: tidak ada yang melayang, jadi tanpa bayangan.
- Radius dua tingkat: 12px kartu, 6px semua kontrol dan baris. Nav pil milik pemilik.
- Ilustrasi keadaan kosong: clipboard + kalender + pensil flat, sepalet aplikasi.
- Fokus keyboard terlihat di semua kontrol: syarat pakai tanpa mouse.
- Inter disematkan lokal (400/600/700): satu keluarga untuk aplikasi padat data, tetap jalan offline.
- Angka statistik tabular: digit tidak bergeser saat animasi berjalan.
