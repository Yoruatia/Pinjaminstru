/* ==========================================================
   main.js - logika tampilan untuk index.html dan catalog.html.
   Butuh api.js dimuat lebih dulu.
   ========================================================== */

/* ---------- Navbar (menu HP) ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- Helper ---------- */
function esc(text) {
  const d = document.createElement("div");
  d.textContent = text ?? "";
  return d.innerHTML;
}

// "MET-WND-001" -> "WND" (dipakai sebagai gambar sementara)
function codeTag(code) {
  return (code || "").split("-")[1] || "MET";
}

function cardHTML(item) {
  const canBorrow = item.status === "available";
  const borrowHref = `borrowing.html?code=${encodeURIComponent(item.instrument_code)}`;
  const thumb = item.image_url
    ? `<img src="${esc(item.image_url)}" alt="${esc(item.instrument_name)}">`
    : esc(codeTag(item.instrument_code));
  return `
    <article class="instrument-card">
      <div class="instrument-thumb" aria-hidden="${item.image_url ? "false" : "true"}">${thumb}</div>
      <div class="instrument-body">
        <span class="instrument-code">${esc(item.instrument_code)}</span>
        <h3>${esc(item.instrument_name)}</h3>
        <p class="instrument-meta">${esc(item.brand)} ${esc(item.model)} &middot; ${esc(item.category_name)}</p>
        <div class="instrument-foot">
          <span class="badge badge--${esc(item.status)}">${STATUS_LABEL[item.status] || esc(item.status)}</span>
          <a class="btn btn-dark btn-small" href="${borrowHref}" ${canBorrow ? "" : 'aria-disabled="true" tabindex="-1"'}>Pinjam</a>
        </div>
      </div>
    </article>`;
}

/* ---------- Halaman beranda ---------- */
async function initHome() {
  const featured = document.getElementById("featured-grid");
  if (!featured) return;
  try {
    const items = await getInstruments();
    const count = (s) => items.filter((i) => i.status === s).length;
    document.getElementById("stat-total").textContent = items.length;
    document.getElementById("stat-available").textContent = count("available");
    document.getElementById("stat-borrowed").textContent = count("borrowed");
    document.getElementById("stat-maintenance").textContent = count("maintenance");
    // 4 instrumen pertama yang tersedia
    const pick = items.filter((i) => i.status === "available").slice(0, 4);
    featured.innerHTML = pick.map(cardHTML).join("");
  } catch (err) {
    featured.innerHTML = `<p class="state-msg">Data instrumen belum bisa dimuat. Coba muat ulang halaman.</p>`;
  }
}

/* ---------- Halaman katalog ---------- */
async function initCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const searchEl = document.getElementById("search");
  const statusEl = document.getElementById("status-filter");
  const chipsEl = document.getElementById("category-chips");
  const countEl = document.getElementById("result-count");
  const resetEl = document.getElementById("reset-filter");

  let items = [];
  let activeCategory = "all";

  try {
    items = await getInstruments();
  } catch (err) {
    grid.innerHTML = `<p class="state-msg">Data instrumen belum bisa dimuat. Coba muat ulang halaman.</p>`;
    return;
  }

  // Chip kategori dibuat otomatis dari data
  const categories = [...new Set(items.map((i) => i.category_name))].sort();
  chipsEl.innerHTML =
    `<button type="button" class="chip" data-cat="all" aria-pressed="true">Semua</button>` +
    categories.map((c) => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("");

  function render() {
    const q = searchEl.value.trim().toLowerCase();
    const status = statusEl.value;
    const shown = items.filter((i) => {
      const text = `${i.instrument_name} ${i.instrument_code} ${i.brand} ${i.model}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (activeCategory === "all" || i.category_name === activeCategory) &&
        (status === "all" || i.status === status)
      );
    });
    countEl.textContent = `${shown.length} dari ${items.length} instrumen`;
    grid.innerHTML = shown.length
      ? shown.map(cardHTML).join("")
      : `<div class="state-msg">Tidak ada instrumen yang cocok. Hapus sebagian filter atau ubah kata kunci.</div>`;
  }

  searchEl.addEventListener("input", render);
  statusEl.addEventListener("change", render);
  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    chipsEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === btn)));
    render();
  });
  resetEl.addEventListener("click", () => {
    searchEl.value = "";
    statusEl.value = "all";
    activeCategory = "all";
    chipsEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === "all")));
    render();
  });

  render();
}

initHome();
initCatalog();
