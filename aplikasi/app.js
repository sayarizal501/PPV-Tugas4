const $ = (id) => document.getElementById(id);
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  emptyEl = $('empty'), noMatchEl = $('noMatch'), loadEl = $('loading'),
  searchI = $('search'), filterI = $('filter'), preview = $('preview');

let tasks = [];
try { tasks = JSON.parse(localStorage.getItem('tugas') || '[]'); } catch { tasks = []; }
let idSeq = tasks.reduce((m, t) => Math.max(m, t.id || 0), 0) + 1;
const save = () => localStorage.setItem('tugas', JSON.stringify(tasks));
const MK_AWAL = ['PRAKTIKUM ANIMASI 2D', 'ANIMASI 2D', 'SISTEM PEMANCAR', 'PRAKTIKUM SISTEM PEMANCAR', 'WORKSHOP UI/UX', 'PEMROGRAMAN VISUAL', 'JURNALISTIK', 'PRAKTIKUM PEMROGRAMAN VISUAL', 'JARINGAN KOMPUTER', 'PRAKTIKUM JARINGAN KOMPUTER', 'TEKNIK PENYIARAN', 'PRODUKSI KONTEN DIGITAL'];
let matkuls = null;
try { matkuls = JSON.parse(localStorage.getItem('matkul') || 'null'); } catch { matkuls = null; }
if (!Array.isArray(matkuls) || !matkuls.length) matkuls = [...MK_AWAL];
const saveMk = () => localStorage.setItem('matkul', JSON.stringify(matkuls));
function renderMkOptions() {
  const pilih = courseI.value;
  courseI.replaceChildren(...matkuls.map((m) => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    return o;
  }));
  if (matkuls.includes(pilih)) courseI.value = pilih;
}
function renderMatkul() {
  $('matkulList').replaceChildren(...matkuls.map((m) => {
    const li = document.createElement('li');
    const nama = document.createElement('span');
    nama.textContent = m;
    const hapus = document.createElement('button');
    hapus.type = 'button'; hapus.className = 'mini'; hapus.textContent = 'Hapus';
    hapus.addEventListener('click', () => {
      if (matkuls.length <= 1) { $('matkulMsg').textContent = 'Minimal 1 mata kuliah harus ada.'; return; }
      matkuls = matkuls.filter((x) => x !== m);
      saveMk(); renderMkOptions(); renderMatkul();
    });
    li.append(nama, hapus);
    return li;
  }));
}
$('matkulForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = $('matkulName').value.trim();
  if (nama.length < 3) { $('matkulMsg').textContent = 'Nama minimal 3 huruf.'; return; }
  if (matkuls.some((m) => m.toLowerCase() === nama.toLowerCase())) { $('matkulMsg').textContent = 'Sudah ada di daftar.'; return; }
  matkuls.push(nama);
  saveMk(); renderMkOptions(); renderMatkul();
  $('matkulName').value = '';
  $('matkulMsg').textContent = '';
});
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

function getar(el) {
  if (kurangiGerak()) return;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease-out' });
}

function buatLi(t, animasi) {
  const li = document.createElement('li');
  if (t.done) li.classList.add('done');
  if (t.prio === 'Tinggi') li.classList.add('tinggi');
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
const bobotPrio = { Tinggi: 0, Sedang: 1, Rendah: 2 };
function render() {
  preview.textContent = '';
  const q = searchI.value.trim().toLowerCase(), f = filterI.value;
  const shown = tasks.filter((t) => {
    if (!( `${t.nama} ${t.mk}`.toLowerCase().includes(q))) return false;
    if (f === 'aktif') return !t.done;
    if (f === 'selesai') return t.done;
    if (f === 'Tinggi') return t.prio === 'Tinggi';
    return true;
  }).sort((a, b) => (bobotPrio[a.prio] - bobotPrio[b.prio]) || (b.id - a.id));
  list.replaceChildren(...shown.map((t) => buatLi(t, t.id === idAnimasiBaru)));
  idAnimasiBaru = null;
  emptyEl.style.display = tasks.length ? 'none' : 'block';
  noMatchEl.hidden = tasks.length === 0 || shown.length > 0;
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
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pindahView('daftar'); nameI.focus(); }
  if (e.key === 'Escape' && !e.target.closest('#matkulForm')) { form.reset(); $('charCount').textContent = '0/60'; validate(); }
});
$('btnReset').addEventListener('click', () => { form.reset(); $('charCount').textContent = '0/60'; validate(); });

renderMkOptions();
render();
renderMatkul();
updateStatCepat();
