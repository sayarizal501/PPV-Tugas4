// Aplikasi Tugas 4 — pengembangan Tugas 3 (Pencatat Tugas Kuliah)
const $ = (id) => document.getElementById(id);
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navigasi 3 view (pola fix G1: hidden + reflow agar transisi terlihat)
let viewAktif = 'daftar';
function pindahView(nama) {
  if (nama === viewAktif) return;
  viewAktif = nama;
  document.querySelectorAll('.nav button').forEach((b) => {
    if (b.dataset.view === nama) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach((v) => {
    const aktif = v.id === `view-${nama}`;
    if (aktif) {
      v.hidden = false;
      if (!kurangiGerak()) { void v.offsetWidth; }
      v.classList.add('aktif');
    } else {
      v.classList.remove('aktif');
      if (kurangiGerak()) { v.hidden = true; return; }
      window.setTimeout(() => { if (!v.classList.contains('aktif')) v.hidden = true; }, 210);
    }
  });
  if (nama === 'statistik') animasikanStatistik();
}
document.querySelector('.nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-view]');
  if (b) pindahView(b.dataset.view);
});
$('btnKeDaftar').addEventListener('click', () => pindahView('daftar'));

const form = $('taskForm'), nameI = $('taskName'), courseI = $('course'),
  deadI = $('deadline'), prioI = $('priority'), list = $('taskList'),
  emptyEl = $('empty'), loadEl = $('loading'), stat = $('stat'),
  searchI = $('search'), filterI = $('filter'), preview = $('preview');

let tasks = [];
try { tasks = JSON.parse(localStorage.getItem('tugas') || '[]'); } catch { tasks = []; }
let idSeq = tasks.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1;
const save = () => localStorage.setItem('tugas', JSON.stringify(tasks));
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
deadI.min = todayStr();

function validate() {
  let ok = true;
  const set = (input, errId, msg) => {
    $(errId).textContent = msg || '';
    input.classList.toggle('invalid', !!msg);
    if (msg) ok = false;
  };
  const nama = nameI.value.trim();
  set(nameI, 'errName', !nama ? 'Nama tugas wajib diisi.' : nama.length < 3 ? 'Nama tugas minimal 3 huruf.' : '');
  const mk = courseI.value.trim();
  set(courseI, 'errCourse', !mk ? 'Mata kuliah wajib diisi.' : '');
  const dl = deadI.value;
  set(deadI, 'errDeadline', !dl ? 'Deadline wajib diisi.' : dl < todayStr() ? 'Deadline tidak boleh tanggal lampau.' : '');
  return ok;
}

// A-02: umpan balik validasi gagal — getar via transform (bukan left), 300ms
function getar(el) {
  if (kurangiGerak()) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-out' });
}

// A-01: kartu baru masuk — hanya item baru yang animasi, 250ms
function buatLi(t, animasi) {
  const li = document.createElement('li');
  if (t.done) li.classList.add('done');
  const kiri = document.createElement('div');
  const kuat = document.createElement('strong');
  kuat.textContent = t.nama;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${t.mk} · ${t.deadline}`;
  kiri.append(kuat, meta);
  const kanan = document.createElement('div');
  kanan.style.display = 'flex'; kanan.style.gap = '6px'; kanan.style.alignItems = 'center';
  const tag = document.createElement('span');
  tag.className = `tag ${t.prio}`; tag.textContent = t.prio;
  const bT = document.createElement('button');
  bT.className = 'mini'; bT.textContent = t.done ? 'Batal' : 'Selesai';
  bT.addEventListener('click', () => { t.done = !t.done; save(); render(); updateStatCepat(); });
  const bH = document.createElement('button');
  bH.className = 'mini'; bH.textContent = 'Hapus';
  bH.addEventListener('click', async () => {
    if (!kurangiGerak()) {
      const a = li.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in' });
      try { await a.finished; } catch { /* abaikan */ }
    }
    tasks = tasks.filter((x) => x.id !== t.id);
    save(); render(); updateStatCepat();
  });
  kanan.append(tag, bT, bH);
  li.append(kiri, kanan);
  li.addEventListener('mouseover', () => { preview.textContent = `${t.nama} dari ${t.mk}, deadline ${t.deadline}, prioritas ${t.prio}`; });
  li.addEventListener('mouseout', () => { preview.textContent = ''; });
  if (animasi && !kurangiGerak()) {
    li.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
  }
  return li;
}

let idAnimasiBaru = null;
function render() {
  preview.textContent = '';
  const q = searchI.value.trim().toLowerCase(), f = filterI.value;
  const shown = tasks.filter((t) => {
    if (!( `${t.nama} ${t.mk}`.toLowerCase().includes(q))) return false;
    if (f === 'aktif') return !t.done;
    if (f === 'selesai') return t.done;
    if (f === 'Tinggi') return t.prio === 'Tinggi';
    return true;
  });
  list.replaceChildren(...shown.map((t) => buatLi(t, t.id === idAnimasiBaru)));
  idAnimasiBaru = null;
  const done = tasks.filter((t) => t.done).length;
  stat.textContent = `${tasks.length} tugas tercatat · ${done} sudah selesai`;
  emptyEl.style.display = tasks.length ? 'none' : 'block';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) { getar(nameI.classList.contains('invalid') ? nameI : courseI.classList.contains('invalid') ? courseI : deadI); return; }
  loadEl.hidden = false;
  $('btnSave').disabled = true;
  window.setTimeout(() => {
    idAnimasiBaru = idSeq;
    tasks.unshift({ id: idSeq++, nama: nameI.value.trim(), mk: courseI.value.trim(), deadline: deadI.value, prio: prioI.value, done: false });
    save();
    loadEl.hidden = true;
    $('btnSave').disabled = false;
    form.reset();
    $('charCount').textContent = '0/60';
    render();
    updateStatCepat();
    nameI.focus();
  }, kurangiGerak() ? 50 : 400);
});

// Statistik: angka + bar scaleX (bukan width), rAF 350ms
let rafStat = null;
function persen() {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}
function updateStatCepat() {
  const p = persen();
  $('pct').textContent = p;
  $('doneCount').textContent = tasks.filter((t) => t.done).length;
  $('totalCount').textContent = tasks.length;
  $('bar').style.transform = `scaleX(${p / 100})`;
  document.querySelector('.progres').setAttribute('aria-valuenow', String(p));
}
function animasikanStatistik() {
  if (rafStat) cancelAnimationFrame(rafStat);
  const target = persen();
  const bar = $('bar'), angka = $('pct');
  document.querySelector('.progres').setAttribute('aria-valuenow', String(target));
  $('doneCount').textContent = tasks.filter((t) => t.done).length;
  $('totalCount').textContent = tasks.length;
  if (kurangiGerak()) {
    angka.textContent = target;
    bar.style.transform = `scaleX(${target / 100})`;
    return;
  }
  const awal = performance.now(), dur = 350;
  const dari = parseFloat((bar.style.transform.match(/scaleX\(([\d.]+)\)/) || [0, 0])[1]) || 0;
  const ke = target / 100;
  const step = (nu) => {
    const k = Math.min(1, (nu - awal) / dur);
    const v = dari + (ke - dari) * (1 - Math.pow(1 - k, 3));
    bar.style.transform = `scaleX(${v})`;
    angka.textContent = Math.round(target * k);
    if (k < 1) rafStat = requestAnimationFrame(step);
    else { angka.textContent = target; rafStat = null; }
  };
  rafStat = requestAnimationFrame(step);
}

// Fallback media bila gagal dimuat
$('imgHero').addEventListener('error', () => {
  $('imgHero').hidden = true;
  $('imgFallback').hidden = false;
});
$('imgIkon').addEventListener('error', () => { $('imgIkon').hidden = true; });

nameI.addEventListener('input', () => { $('charCount').textContent = `${nameI.value.length}/60`; validate(); });
courseI.addEventListener('input', validate);
deadI.addEventListener('input', validate);
searchI.addEventListener('input', render);
filterI.addEventListener('change', render);
prioI.addEventListener('change', () => { $('btnSave').textContent = `Simpan Tugas (${prioI.value})`; });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pindahView('daftar'); nameI.focus(); }
  if (e.key === 'Escape') { form.reset(); $('charCount').textContent = '0/60'; validate(); }
});
$('btnReset').addEventListener('click', () => { form.reset(); $('charCount').textContent = '0/60'; validate(); });

render();
updateStatCepat();
