// Kode latihan Tugas 4 — Praktikum Pemrograman Visual (TB033109)
// Aplikasi ini BERJALAN, tetapi animasi dan interaksinya bermasalah.
// Jalankan, amati gejalanya, temukan penyebabnya, lalu perbaiki.
const state = { tugas: [], tampilan: 'daftar' };
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
    v.hidden = !aktif;
    v.classList.toggle('aktif', aktif);
  });
  if (state.tampilan === 'statistik') animasikanProgres(persenSelesai());
});
function buatItem(t) {
  const li = document.createElement('li');
  li.dataset.id = t.id;
  li.classList.toggle('selesai', t.selesai);
  li.innerHTML = `<input type="checkbox" aria-label="Tandai selesai"><span>${t.judul}</span>
    <button type="button" aria-label="Hapus tugas">Hapus</button>`;
  li.querySelector('input').checked = t.selesai;
  li.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 250, easing: 'ease-out' });
  return li;
}
function tampil() {
  list.replaceChildren(...state.tugas.map((t) => buatItem(t)));
  kosong.hidden = state.tugas.length > 0;
  list.addEventListener('click', (e) => {
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
    li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in' });
    state.tugas = state.tugas.filter((x) => x.id !== id);
    li.remove();
    kosong.hidden = state.tugas.length > 0;
  });
}
// Umpan balik salah isi: kotak isian bergetar
function getar(el) {
  let n = 0;
  const id = setInterval(() => {
    el.style.left = (n % 2 === 0 ? -6 : 6) + 'px';
    n += 1;
    if (n > 6) { clearInterval(id); el.style.left = '0px'; }
  }, 40);
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
  state.tugas.push({ id: Date.now(), judul, selesai: false });
  isian.value = '';
  tampil();
});
// Angka dan bilah progres bergerak ke nilai baru
const angka = document.querySelector('#angka');
const isiProgres = document.querySelector('#isi-progres');
const bilah = document.querySelector('.progres');
let nilaiTampil = 0;
function persenSelesai() {
  if (state.tugas.length === 0) return 0;
  return Math.round((state.tugas.filter((t) => t.selesai).length / state.tugas.length) * 100);
}
function animasikanProgres(target) {
  const arah = target >= nilaiTampil ? 1 : -1;
  setInterval(() => {
    if (Math.round(nilaiTampil) === target) return;
    nilaiTampil += arah;
    angka.textContent = Math.round(nilaiTampil);
    isiProgres.style.width = nilaiTampil + '%';
  }, 16);
  bilah.setAttribute('aria-valuenow', String(target));
}
tampil();
