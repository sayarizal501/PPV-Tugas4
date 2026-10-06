// Kode latihan Tugas 4 — Praktikum Pemrograman Visual (TB033109)
// Aplikasi ini BERJALAN, tetapi animasi dan interaksinya bermasalah.
// Jalankan, amati gejalanya, temukan penyebabnya, lalu perbaiki.
const state = { tugas: [], tampilan: 'daftar' };
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('#list');
const kosong = document.querySelector('#kosong');
const form = document.querySelector('#form');
const isian = document.querySelector('#isian');
const pesan = document.querySelector('#pesan');
// Pindah tampilan
document.querySelector('.tab').addEventListener('click', (e) => {
  const tombol = e.target.closest('button[data-view]');
  if (!tombol || tombol.dataset.view === state.tampilan) return;
  state.tampilan = tombol.dataset.view;
  document.querySelectorAll('.tab button').forEach((b) =>
    b.toggleAttribute('aria-current', b === tombol));
  document.querySelectorAll('.view').forEach((v) => {
    const aktif = v.id === state.tampilan;
    if (aktif) {
      v.hidden = false;
      if (kurangiGerak()) { v.classList.add('aktif'); return; }
      void v.offsetWidth;
      v.classList.add('aktif');
    } else {
      v.classList.remove('aktif');
      if (kurangiGerak()) { v.hidden = true; return; }
      window.setTimeout(() => { if (v.id !== state.tampilan) v.hidden = true; }, 210);
    }
  });
  if (state.tampilan === 'statistik') animasikanProgres(persenSelesai());
});
function buatItem(t, denganAnimasi = false) {
  const li = document.createElement('li');
  li.dataset.id = t.id;
  li.classList.toggle('selesai', t.selesai);
  const centang = document.createElement('input');
  centang.type = 'checkbox';
  centang.setAttribute('aria-label', 'Tandai selesai');
  centang.checked = t.selesai;
  const label = document.createElement('span');
  label.textContent = t.judul;
  const hapus = document.createElement('button');
  hapus.type = 'button';
  hapus.setAttribute('aria-label', 'Hapus tugas');
  hapus.textContent = 'Hapus';
  li.append(centang, label, hapus);
  if (denganAnimasi && !kurangiGerak()) {
    li.animate(
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 250, easing: 'ease-out' });
  }
  return li;
}
function tampil(animateId = null) {
  list.replaceChildren(...state.tugas.map((t) => buatItem(t, t.id === animateId)));
  kosong.hidden = state.tugas.length > 0;
}
list.addEventListener('click', async (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.matches('input[type="checkbox"]')) {
      const t = state.tugas.find((x) => x.id === id);
      t.selesai = !t.selesai;
      li.classList.toggle('selesai', t.selesai);
      return;
    }
    if (!e.target.matches('button')) return;
    const anim = li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in' });
    try { await anim.finished; } catch { /* abaikan bila dibatalkan */ }
    state.tugas = state.tugas.filter((x) => x.id !== id);
    li.remove();
    kosong.hidden = state.tugas.length > 0;
});
// Umpan balik salah isi: kotak isian bergetar
function getar(el) {
  if (kurangiGerak()) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-out' });
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const judul = isian.value.trim();
  if (judul.length < 3) {
    pesan.textContent = 'Tulis minimal 3 huruf agar tugasnya jelas.';
    isian.setAttribute('aria-invalid', 'true');
    getar(isian);
    isian.focus();
    return;
  }
  pesan.textContent = '';
  isian.removeAttribute('aria-invalid');
  const idBaru = Date.now();
  state.tugas.push({ id: idBaru, judul, selesai: false });
  isian.value = '';
  tampil(idBaru);
});
// Angka dan bilah progres bergerak ke nilai baru
const angka = document.querySelector('#angka');
const isiProgres = document.querySelector('#isi-progres');
const bilah = document.querySelector('.progres');
let nilaiTampil = 0;
let idProgres = null;
function persenSelesai() {
  if (state.tugas.length === 0) return 0;
  return Math.round((state.tugas.filter((t) => t.selesai).length / state.tugas.length) * 100);
}
function animasikanProgres(target) {
  if (idProgres !== null) { clearInterval(idProgres); idProgres = null; }
  if (kurangiGerak()) {
    nilaiTampil = target;
    angka.textContent = target;
    isiProgres.style.transform = `scaleX(${target / 100})`;
    bilah.setAttribute('aria-valuenow', String(target));
    return;
  }
  const arah = target >= nilaiTampil ? 1 : -1;
  idProgres = setInterval(() => {
    if (Math.round(nilaiTampil) === target) { clearInterval(idProgres); idProgres = null; return; }
    nilaiTampil += arah;
    angka.textContent = Math.round(nilaiTampil);
    isiProgres.style.transform = `scaleX(${nilaiTampil / 100})`;
  }, 16);
  bilah.setAttribute('aria-valuenow', String(target));
}
tampil();
