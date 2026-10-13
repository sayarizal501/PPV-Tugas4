# PPV Tugas 4, Prototipe Terpadu (Iqgam Afrizal)

## 1. Tabel perbaikan bug latihan (`latihan-debug/`)

| No | Gejala | Penyebab (berkas:baris) | Perbaikan | Bukti |
|----|--------|-------------------------|-----------|-------|
| G1 | Pindah ke Statistik terjadi seketika; transisi memudar tidak terlihat | `main.js:17-21`, `hidden` dan `toggle aktif` dalam satu frame sehingga transisi mati | Tampilkan dulu (`hidden=false` + reflow) baru tambah `.aktif`; sembunyikan via `timeout 210ms` | Klik Daftar-Statistik: fade 200ms terlihat dua arah |
| G2 | Pesan salah muncul, kotak isian tidak bergetar | `main.js getar`: `style.left` tanpa `position` | `element.animate()` keyframes `translateX`, 300ms | Isi "ab" + Tambah: bergetar, pesan muncul, fokus kembali |
| G3 | Tiap tambah 1 tugas, semua kartu ikut beranimasi masuk | `main.js tampil/buatItem`: render ulang semua ikut animate | `buatItem(t, denganAnimasi)`; hanya id baru yang animate | Tambah 3 tugas: hanya kartu baru yang masuk |
| G4 | Ketik `<b>`/`onerror` dieksekusi sebagai HTML | `main.js buatItem`: `innerHTML` + judul | `createElement` + `textContent` | Tambah `<b>tebal</b>`: tampil sebagai teks polos |
| G5 | Centang kadang tidak mencoret | `main.js tampil`: listener di dalam `tampil()` sehingga menumpuk | Listener dipindah ke luar, daftar 1x | Tambah 3 tugas, centang pertama: langsung tercoret |
| G6 | Hapus langsung lenyap; animasi keluar tak terlihat | handler hapus: `animate` lalu `remove()` sinkron | `await animation.finished` baru filter + `remove()` | Klik Hapus: fade-out 220ms terlihat penuh |
| G7 | Bolak-balik Statistik makin cepat dan tak pernah berhenti | `animasikanProgres`: `setInterval` tanpa `clear` | Simpan `idProgres`; `clearInterval` tiap panggil dan saat target tercapai | Buka-tutup 5x: kecepatan tetap, panel Performance bersih |
| G8 | Progres memaksa hitung ulang layout tiap langkah | `isiProgres.style.width` tiap 16ms | `width 100%` + `transform scaleX()` | Rekam Performance: tanpa peristiwa Layout |
| G9 | Reduce-motion diabaikan sistem | tanpa `matchMedia`/`@media` | `kurangiGerak()` menjaga semua animasi + `@media reduce` | Emulasi reduce di DevTools: langsung nilai akhir |

## 2. Peta navigasi aplikasi (`aplikasi/`)

Daftar Tugas (form + list) ke Statistik (angka + bar) ke Matkul (kelola daftar mata kuliah untuk dropdown) ke Tentang (profil + cara pakai). Satu header nav, `aria-current` menandai menu aktif.

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

- Nav pil terpisah: status aktif terbaca dari isi penuh biru.
- Biru hanya di Simpan, nav aktif, progres: menandai aksi utama dan status selesai.
- Prioritas sebagai teks, merah hanya untuk Tinggi: merah berarti peringatan.
- Kartu datar bergaris tepi: tidak ada yang melayang, jadi tanpa bayangan.
- Radius dua tingkat: 12px kartu, 6px semua kontrol dan baris. Nav pil milik pemilik.
- Ilustrasi keadaan kosong: clipboard + kalender + pensil flat, sepalet aplikasi.
- Fokus keyboard terlihat di semua kontrol: syarat pakai tanpa mouse.
- Inter disematkan lokal (400/600/700): satu keluarga untuk aplikasi padat data, tetap jalan offline. Sumber: Google Fonts https://fonts.google.com/specimen/Inter (lisensi SIL OFL). Basis kode aplikasi adalah Tugas 3 milik sendiri; tanpa salinan dari sumber luar.
- Angka statistik tabular: digit tidak bergeser saat animasi berjalan.
