// -------------------- Configuración Inicial --------------------
const body = document.body;

/* Estilos puntuales inyectados por JS:
   - .toast-container: esquina inferior derecha (mismo layout en GitHub Pages y local)
   - .onboard-card: estilos de la tarjeta de onboarding
   - highlight de fila al añadir/editar
*/
(function injectEnhancementStyles() {
  const css = `
  .toast-container{
  position:fixed;
  bottom:1rem;               /* posición base */
  right:1rem;
  display:flex; flex-direction:column; gap:.5rem;
  z-index:10020;             /* por encima del FAB */
}

/* Cuando hay toast visible, súbelo para que no se solape con el FAB (56px alto FAB + ~12px margen) */
body.toast-visible .toast-container{
  bottom: calc(1rem + 56px + 12px);
}
  .toast{min-width:240px;max-width:340px;padding:.75rem 1rem;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;align-items:center;gap:.75rem;opacity:0;transform:translateY(8px);transition:opacity .25s ease,transform .25s ease;background:#4caf50;color:#fff}
  .toast.show{opacity:1;transform:translateY(0)}
  .toast-info{background:#4caf50;color:#fff}
  .toast-success{background:#2ecc71;color:#fff}
  .toast-error{background:#e74c3c;color:#fff}
  .toast__action{margin-left:auto;background:rgba(255,255,255,.2);border:none;border-radius:8px;padding:.35rem .6rem;color:inherit;cursor:pointer}
  .toast__action:hover{background:rgba(255,255,255,.3)}
  .flash-row{animation:flashRow 1.6s ease}
  @keyframes flashRow{0%{box-shadow:inset 0 0 0 3px rgba(76,175,80,.9)}60%{box-shadow:inset 0 0 0 3px rgba(76,175,80,0)}100%{box-shadow:none}}

  /* Onboarding card */
  .onboard-card{margin:.5rem 0 1rem; padding:1rem; border-radius:12px; background:#f1f8e9; border:1px solid rgba(76,175,80,.25); box-shadow:0 6px 16px rgba(76,175,80,.15)}
  body.dark .onboard-card{background:#1f2a1f; border-color:#2c6132}
  .onboard-card h3{margin:.2rem 0 .6rem; font-size:1.05rem}
  .onboard-list{list-style:none; padding:0; margin:.25rem 0 .75rem; display:flex; gap:.5rem; flex-wrap:wrap}
  .onboard-item{display:flex; align-items:center; gap:.45rem; padding:.45rem .6rem; border-radius:999px; background:#fff; border:1px solid #e5e7eb; font-weight:600; color:#2e7d32}
  body.dark .onboard-item{background:#111; border-color:#333; color:#81c995}
  .onboard-item .check{display:inline-grid; place-items:center; width:1.2em; height:1.2em; border-radius:50%; border:2px solid currentColor; font-size:.8em; line-height:1; font-weight:800}
  .onboard-item.done{opacity:.9}
  .onboard-item.done .check{background:#4caf50; color:#fff; border-color:#4caf50}
  .onboard-actions{display:flex; gap:.5rem; justify-content:flex-end}

  /* Asegura que cualquier elemento con [hidden] NO se muestre */
  [hidden]{display:none !important}

  /* Presupuestos por categoría — compacta y con el mismo look */
  .catbudget-card{ margin:.75rem 0; padding:.25rem 0 .5rem; border:0; background:transparent; }
  .catbudget-card h3{ font-size:1rem; margin:.25rem 0 .5rem; font-weight:700; }
  .catbudget-row{ display:flex; gap:.5rem; align-items:center; flex-wrap:wrap; margin:.25rem 0 .25rem; }
  .catbudget-row input{ flex:1 1 200px; }

  .catbudget-list{ display:flex; flex-direction:column; gap:.5rem; margin-top:.25rem; }
  .catbudget-item{
    position:relative;
    padding:.5rem .75rem .6rem .75rem;
    border:1px solid var(--border-color, #e5e7eb);
    border-radius:12px;
    background:transparent;
  }
  body.dark .catbudget-item{ border-color:#333; }

  /* redondeo igual que la app en inputs/botones de esta sección */
  .catbudget-item,
  .catbudget-row input,
  .catbudget-row button{ border-radius:12px !important; }

  /* barra lateral de acento (cambia con el estado) */
  .catbudget-item::before{
    content:""; position:absolute; left:0; top:0; bottom:0; width:4px;
    background: var(--accent,#4caf50); border-radius:12px 0 0 12px; opacity:.8;
  }

  .catbudget-item .cat{ color:#2e7d32; font-weight:600; }
  body.dark .catbudget-item .cat{ color:#81c995; }
  .catbudget-item .amount{ margin-left:auto; opacity:.9; }

  /* Barra de progreso */
  .progress{
    position:relative;
    height:6px;
    background:rgba(0,0,0,.06);
    border-radius:12px;
    overflow:hidden;
    margin-top:.35rem;
  }
  .progress__bar{
  display:block;
  height:100%;
  width:0%; /* el JS pondrá el valor inicial y el final */
  background:#4caf50;
  transition: width .45s ease, background-color .45s ease; /* 👈 también anima el color */
  will-change: width, background-color;
}
.progress__bar.ok   { background:#4caf50; }  /* verde */
.progress__bar.warn { background:#f39c12; }  /* naranja (>=80%) */
.progress__bar.over { background:#e74c3c; }  /* rojo (>=100%) */

@media (prefers-reduced-motion: reduce){
  .progress__bar{ transition:none; }
}
  body.dark .progress{ background:rgba(255,255,255,.12); }
  /* Recurrentes (UI compacta, bordes 12px como la app) */
.recur-inline{
  display:inline-flex; gap:.35rem; align-items:center;
  margin:.25rem .35rem .25rem 0;
}
.recur-card{
  margin:.75rem 0; padding:.75rem;
  border:1px solid var(--border-color,#e5e7eb);
  border-radius:12px; background:transparent;
}
body.dark .recur-card{ border-color:#333; }
.recur-card h3{ margin:.25rem 0 .5rem; font-size:1rem; font-weight:700; }
.recur-list{ display:flex; flex-direction:column; gap:.5rem; }
.recur-item{ display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
.recur-actions{ display:flex; gap:.5rem; margin-top:.5rem; }

/* Botones XS coherentes con la app */
.btn-xs{
  padding:.35rem .6rem; border-radius:12px; border:1px solid #e5e7eb;
  background:#fff; cursor:pointer;
}
body.dark .btn-xs{ border-color:#333; background:#111; color:#eee; }
.btn-primary-xs{ border-color:#4caf50; }
/* Botones XS (visibles en light mode) */
.btn-xs{
  padding:.35rem .6rem;
  border-radius:12px;
  border:1px solid #e5e7eb;
  background:#f8fafc;     /* <- antes #fff */
  color:#222;             /* <- aseguro texto visible */
  cursor:pointer;
  font-weight:600;
}
.btn-xs:hover{ background:#eef2f7; }

.btn-primary-xs{
  border-color:#81c995;
  background:#e8f5e9;     /* verde muy claro */
  color:#2e7d32;          /* texto verde oscuro */
}
.btn-primary-xs:hover{ background:#dff0e3; }

body.dark .btn-xs{
  border-color:#333;
  background:#111;
  color:#eee;
}
body.dark .btn-primary-xs{
  border-color:#4caf50;
  background:#1b3b1b;
  color:#c8f0c8;
}
  .btn-danger-xs{
  border:1px solid #ef9a9a;
  background:#ffebee;
  color:#b71c1c;
}
.btn-danger-xs:hover{ background:#ffe3e6; }

body.dark .btn-danger-xs{
  border-color:#663436;
  background:#2a1415;
  color:#ffb3b3;
}
  /* --- Swipe en filas --- */
#tablaGastos tr.swipeable{
  position: relative;
  touch-action: pan-y;       /* permite scroll vertical; el gesto horizontal lo cojo yo */
  will-change: transform;
}

#tablaGastos tr.swiping{
  cursor: grabbing;
  user-select: none;
  transition: none !important;
}

/* fondos de pista (editar a la izquierda, eliminar a la derecha) */
#tablaGastos tr.swipeable::before,
#tablaGastos tr.swipeable::after{
  content:"";
  position:absolute; top:0; bottom:0; width:88px;
  opacity:0; transition: opacity .15s ease;
  z-index:0; pointer-events:none;
}
#tablaGastos tr.swipeable::before{
  left:0;
  background: #e8f5e9 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%232e7d32'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z'/%3E%3C/svg%3E") center/24px no-repeat;
  border-radius: 12px 0 0 12px;
}
#tablaGastos tr.swipeable::after{
  right:0;
  background:#ffebee url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23b71c1c'%3E%3Cpath d='M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/%3E%3C/svg%3E") center/24px no-repeat;
  border-radius: 0 12px 12px 0;
}

#tablaGastos tr.show-right::before{ opacity:1; }  /* gesto hacia la derecha => editar */
#tablaGastos tr.show-left::after{  opacity:1; }   /* gesto hacia la izquierda => eliminar */

/* Asegura contenido encima de los fondos */
#tablaGastos tr.swipeable > *{ position: relative; z-index:1; }
/* --- Ajuste leve de tamaños en Presupuestos por categoría --- */

/* Aumenta ligeramente el padding de cada tarjeta de la lista */
.catbudget-item{
  padding:.6rem .9rem .7rem .9rem; /* +~2px vs actual */
}

/* Inputs de la cabecera (categoría e importe) un poco más altos */
#catBudgetCategoria,
#catBudgetImporte{
  padding: calc(.5rem + 2px) calc(.6rem + 2px);
  font-size: .98rem;
}

/* Botón Guardar un poquito más grande */
/* Botón Guardar un poquito más grande */
#catBudgetGuardar{
  padding: calc(.5rem + 2px) calc(.8rem + 2px);
  font-size: .98rem;
  border-radius:12px; /* por si el botón no lo hereda */
}

/* --- Tabla ordenable --- */
.table-sortable th{ user-select:none; cursor:pointer; white-space:nowrap; }
.table-sortable th .th-label{ display:inline-block; }
.table-sortable th.sort-asc  .th-label::after{ content:" ▲"; font-size:.8em; opacity:.7; }
.table-sortable th.sort-desc .th-label::after{ content:" ▼"; font-size:.8em; opacity:.7; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

(() => {
  const css = `
  #menuToggle{ position:relative; }
  #menuToggle.has-notifs::after{
    content:"";
    position:absolute; top:6px; right:6px; width:8px; height:8px;
    border-radius:50%;
    background:#4caf50;
    box-shadow:0 0 0 2px var(--notifBorder,#fff);
  }
  body.dark #menuToggle.has-notifs::after{ --notifBorder:#111; }
  `;

  (() => {
  const css = `
/* Redondeo y estilo de inputs/selects en el gestor de recurrentes */
.recur-item input,
.recur-item select{
  border-radius:12px !important;
  padding:.35rem .55rem;
  border:1px solid var(--border-color,#e5e7eb);
  background:#fff;
}
body.dark .recur-item input,
body.dark .recur-item select{
  background:#111; border-color:#333; color:#eee;
}

/* Anclar el botón del menú a la esquina superior derecha */
#menuToggle{
  position:fixed !important;
  right:12px !important;
  left:auto !important;
  top:12px !important;
  z-index:10002;
}
/* Mantenerlo a la vista cuando el panel está abierto */
body.menu-open #menuToggle{ right:12px !important; }
`;

// --- FAB + Quick Add (estilos) ---
(() => {
  const css = `
  .fab-add{
    position:fixed; right:16px; bottom:16px;
    width:56px; height:56px; border:none; border-radius:50%;
    display:grid; place-items:center; font-size:28px; line-height:1;
    background:#4caf50; color:#fff; cursor:pointer;
    box-shadow:0 10px 24px rgba(0,0,0,.22);
    transition:transform .12s ease, box-shadow .12s ease;
    z-index:10003;
  }
  .fab-add:active{ transform:scale(.96); box-shadow:0 6px 16px rgba(0,0,0,.22); }
  .fab-add:focus{ outline:3px solid rgba(76,175,80,.45); outline-offset:2px; }
  body.dark .fab-add{ background:#2e7d32; }

  /* Quick Add: backdrop + sheet */
  .qa-backdrop{
    position:fixed; inset:0; background:rgba(0,0,0,.35);
    opacity:0; pointer-events:none; transition:opacity .2s ease; z-index:10002;
  }
  .qa-backdrop.show{ opacity:1; pointer-events:auto; }

  .qa-sheet{
    position:fixed; left:0; right:0; bottom:0;
    transform:translateY(105%); transition:transform .25s ease;
    background:#fff; border-radius:16px 16px 0 0; padding:12px;
    box-shadow:0 -10px 30px rgba(0,0,0,.25); z-index:10003;
    border:1px solid #e5e7eb;
  }
  .qa-sheet.show{ transform:translateY(0); }
  body.dark .qa-sheet{ background:#111; border-color:#333; color:#eee; }

  .qa-title{ font-weight:700; margin:4px 4px 10px; font-size:1rem; }
  .qa-row{ display:flex; gap:.5rem; align-items:center; margin:.35rem 0; }
  .qa-row input, .qa-row select{
    flex:1; min-width:0; border:1px solid #e5e7eb; border-radius:12px; padding:.5rem .6rem;
    background:#fff;
  }
  body.dark .qa-row input, body.dark .qa-row select{ background:#111; border-color:#333; color:#eee; }

  .qa-actions{ display:flex; gap:.5rem; justify-content:flex-end; margin-top:.5rem; }
  .qa-actions .btn{ border-radius:12px; padding:.5rem .8rem; border:1px solid #e5e7eb; background:#f8fafc; font-weight:600; }
  .qa-actions .btn:hover{ background:#eef2f7; }
  .qa-actions .btn-primary{ border-color:#81c995; background:#e8f5e9; color:#2e7d32; }
  body.dark .qa-actions .btn{ background:#111; border-color:#333; color:#eee; }
  body.dark .qa-actions .btn-primary{ background:#1b3b1b; border-color:#4caf50; color:#c8f0c8; }

  @media (max-width:768px){
    .fab-add{ right:14px; bottom:14px; }
  }

  @media (prefers-reduced-motion: reduce){
    .fab-add, .qa-backdrop, .qa-sheet{ transition:none !important; }
  }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// -------------------- Toasts --------------------
let __toastContainer;
function ensureToastContainer(){
  if(!__toastContainer){
    __toastContainer = document.createElement('div');
    __toastContainer.className = 'toast-container';
    // 👇 Accesibilidad
    __toastContainer.setAttribute('aria-live','polite');
    __toastContainer.setAttribute('aria-atomic','true');
    document.body.appendChild(__toastContainer);
  }
}

function showToast(message, { type='info', duration=3000, actionText, onAction } = {}){
  ensureToastContainer();
  document.body.classList.add('toast-visible'); // deja esto si mueves el FAB cuando hay toast

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="toast__msg">${esc(message)}</span>`;
  if (actionText){
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.textContent = actionText;
    btn.addEventListener('click', () => {
      if (typeof onAction === 'function') onAction();
      remove();
    });
    toast.appendChild(btn);
  }
  __toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  let hideTimer = setTimeout(remove, duration);

  function remove(){
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();

      // 👇 NUEVO: si ya no queda ningún toast, quita la clase del body
      if (!__toastContainer.querySelector('.toast')) {
        document.body.classList.remove('toast-visible');
      }
    }, 250);
  }

  toast.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  toast.addEventListener('mouseleave', () => hideTimer = setTimeout(remove, 1200));
  return remove;
}

// -------------------- Banner offline --------------------
const banner = document.createElement('div');
banner.id = 'network-banner';
banner.className = 'banner-actualizacion';
banner.style.background = '#ffcc00';
banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
document.body.appendChild(banner);

function updateNetworkStatus() {
  if (navigator.onLine) banner.classList.remove('show');
  else {
    banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
    banner.style.background = '#ffcc00';
    banner.classList.add('show');
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// SW actualización (banner “recargar”)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (!event.data) return;
    function showBanner(message, btnText, onClick) {
      if (document.getElementById('reloadApp')) return;
      const refreshBanner = document.createElement('div');
      refreshBanner.className = 'banner-actualizacion';
      refreshBanner.innerHTML = `${message} <button id="reloadApp">${btnText}</button>`;
      document.body.appendChild(refreshBanner);
      setTimeout(() => refreshBanner.classList.add('show'), 50);
      document.getElementById('reloadApp').addEventListener('click', onClick);
    }
    if (event.data.type === 'SW_UPDATED') {
      showBanner('Nueva versión disponible.', 'Recargar', () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      });
    }
    if (event.data.type === 'SW_UPDATED_PARTIAL') {
      showBanner('Algunos recursos se han actualizado.', 'Actualizar recursos', async () => {
        try { await fetch(event.data.url, { cache: "reload" }); } catch {}
        window.location.reload();
      });
    }
  });
}

// -------------------- Variables --------------------
const form = document.getElementById("formulario");
const tipoInput = document.getElementById("tipo");
const categoriaInput = document.getElementById("categoria");
const importeInput = document.getElementById("importe");
const fechaInput = document.getElementById("fecha");
const tabla = document.getElementById("tablaGastos");
const totalEl = document.getElementById("total");
const presupuestoInput = document.getElementById("presupuesto");
const alertaPresupuesto = document.getElementById("alertaPresupuesto");
const buscarCategoria = document.getElementById("buscarCategoria");
const filtrarMes = document.getElementById("filtrarMes");
const estadoVacio = document.getElementById("estadoVacio");
const emptyStateMsg = document.getElementById("emptyStateMsg");
const addFirstBtn = document.getElementById("addFirstBtn");
const exportCSVBtn = document.getElementById("exportCSV");
const exportJSONBtn = document.getElementById("exportJSON");
const importJSONInput = document.getElementById("importJSON");
const toggleDarkBtn = document.getElementById("toggleDark");
const darkIcon = document.getElementById("darkIcon");
// --- Recurrentes (estado global/UI)
const recurrenteChk  = document.getElementById("recurrente");
const recurrenteFreq = document.getElementById("recurrenteFrecuencia");

// --- Ordenación de tabla ---
const SORT_STORAGE_KEY = 'tableSort_v1';
let sortState = (() => {
  try { return JSON.parse(localStorage.getItem(SORT_STORAGE_KEY)) || { key:'fecha', dir:'desc' }; }
  catch { return { key:'fecha', dir:'desc' }; }
})();

function saveSort(){ localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortState)); }

function getSorter() {
  const dir = sortState.dir === 'asc' ? 1 : -1;
  const coll = new Intl.Collator('es', { numeric:true, sensitivity:'base' });
  switch (sortState.key) {
    case 'importe': return (a,b) => dir * ((a.importe||0) - (b.importe||0));
    case 'fecha':   return (a,b) => dir * (String(a.fecha||'').localeCompare(String(b.fecha||'')));
    case 'categoria': return (a,b) => dir * coll.compare(String(a.categoria||''), String(b.categoria||''));
    case 'tipo':      return (a,b) => dir * coll.compare(String(a.tipo||''), String(b.tipo||''));
    default: return () => 0;
  }
}

function setSort(key){
  if (sortState.key === key){
    sortState.dir = (sortState.dir === 'asc') ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    sortState.dir = (key === 'importe' || key === 'fecha') ? 'desc' : 'asc';
  }
  saveSort();
  renderTabla();
  updateSortUI();
}


function updateSortUI(){
  const tableEl = tabla?.closest('table');
  if (!tableEl) return;
  const ths = tableEl.querySelectorAll('thead th[data-sort-key]');
  ths.forEach(th => {
    th.classList.remove('sort-asc','sort-desc');
    if (th.dataset.sortKey === sortState.key){
      th.classList.add(sortState.dir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function setupSortingUI(){
  const tableEl = tabla?.closest('table');
  if (!tableEl) return;
  tableEl.classList.add('table-sortable');

  let thead = tableEl.querySelector('thead');
  if (!thead){
    thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th data-sort-key="tipo"><span class="th-label">Tipo</span></th>
        <th data-sort-key="categoria"><span class="th-label">Categoría</span></th>
        <th data-sort-key="importe"><span class="th-label">Importe (€)</span></th>
        <th data-sort-key="fecha"><span class="th-label">Fecha</span></th>
        <th><span class="th-label">Acciones</span></th>
      </tr>`;
    tableEl.insertBefore(thead, tableEl.firstChild);
  }

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th[data-sort-key]');
    if (!th) return;
    setSort(th.dataset.sortKey);
  });

  updateSortUI();
}

function ensureRecurrenteFrecuenciaOptions(){
  if (!recurrenteFreq) return;
  const want = ['semanal','mensual','anual'];
  const have = new Set([...recurrenteFreq.options].map(o => o.value));
  want.forEach(v => {
    if (!have.has(v)) {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
      recurrenteFreq.appendChild(o);
    }
  });
}
ensureRecurrenteFrecuenciaOptions();

let recurrents = [];
let recurrentsApplied = new Set();

try { recurrents = JSON.parse(localStorage.getItem("recurrents")) || []; } catch { recurrents = []; }
try { recurrentsApplied = new Set(JSON.parse(localStorage.getItem("recurrentsApplied")) || []); } catch { recurrentsApplied = new Set(); }

function saveRecurrents(){ localStorage.setItem("recurrents", JSON.stringify(recurrents)); }
function saveRecurrentsApplied(){ localStorage.setItem("recurrentsApplied", JSON.stringify([...recurrentsApplied])); }

// Habilitar/deshabilitar selector de frecuencia desde el checkbox
if (recurrenteFreq) recurrenteFreq.disabled = !(recurrenteChk?.checked);
recurrenteChk?.addEventListener("change", () => {
  if (recurrenteFreq) recurrenteFreq.disabled = !recurrenteChk.checked;
});
// --- UI Presupuestos por categoría
const catBudgetCategoria = document.getElementById("catBudgetCategoria");
const catBudgetImporte  = document.getElementById("catBudgetImporte");
const catBudgetGuardar  = document.getElementById("catBudgetGuardar");
const catBudgetList     = document.getElementById("catBudgetList");
const categoriasSugeridasDL = document.getElementById("categoriasSugeridas");

// Menú
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
// --- Sección y menú: Gestionar recurrentes ---
(function injectRecurrentManager(){
  const main = document.querySelector('main') || document.body;

  // Sección nueva (queda oculta por defecto)
  const section = document.createElement('section');
  section.id = 'seccionRecurrentes';
  section.className = 'oculto';
  section.innerHTML = `
    <h2 style="margin:.25rem 0 1rem">⚙️ Gestionar recurrentes</h2>
    <div id="recurManagerList" class="recur-list" style="gap:.6rem"></div>
  `;
  main.appendChild(section);

  // Item del menú
  const li = document.createElement('li');
  li.dataset.section = 'seccionRecurrentes';
  li.textContent = 'Gestionar recurrentes';
  li.setAttribute('tabindex','0');
  li.setAttribute('role','button');
  menu.appendChild(li);

  // Navegación del item
  const go = () => {
  document.querySelectorAll('main section').forEach(s => s.classList.add('oculto'));
  section.classList.remove('oculto');
  closeMenu();
  (document.querySelector('main') || document.body).scrollIntoView({ behavior:'smooth', block:'start' });
  renderRecurrentManager();
  const h2 = section.querySelector('h2');
  if (h2){ h2.setAttribute('tabindex','-1'); setTimeout(()=>h2.focus(), 0); }
};
  li.addEventListener('click', go);
  li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
})();
const secciones = document.querySelectorAll("main section");

// Gráficos/histórico
const selectMesHistorico = document.getElementById("selectMesHistorico");
const balanceHistorico = document.getElementById("balanceHistorico");
const graficoHistoricoCanvas = document.getElementById("graficoHistorico");
const tituloGraficoDiario = document.getElementById("tituloGraficoDiario");

// Overlay del menú
const menuOverlay = document.createElement('div');
menuOverlay.id = 'menuOverlay';
document.body.appendChild(menuOverlay);

// ------- UI recordatorio de recurrentes (tarjeta compacta) -------
function mountRecurCard(){
  const host = document.querySelector("#seccionFormulario");
  if (!host) return; // si aún no existe, se reintentará en DOMContentLoaded
  if (document.getElementById("recurReminder")) return; // evitar duplicados

  const card = document.createElement("div");
  card.id = "recurReminder";
  card.className = "recur-card";
  card.hidden = true;
  card.innerHTML = `
    <h3>🔁 Movimientos recurrentes pendientes</h3>
    <div class="recur-list" id="recurList"></div>
    <div class="recur-actions">
      <button id="recurAddAll" class="btn-xs btn-primary-xs">Añadir todos</button>
      <button id="recurDismiss" class="btn-xs">Omitir todos</button>
    </div>
  `;
  host.prepend(card);

  // Añadir TODOS
  document.getElementById("recurAddAll")?.addEventListener("click", () => {
    const mk = filtrarMes.value || mesActual;
    applyDueRecurrentsForMonth(mk);
  });

  // Omitir TODOS + DESHACER
  document.getElementById("recurDismiss")?.addEventListener("click", () => {
    const mk  = filtrarMes.value || mesActual;
    const due = getDueRecurrents(mk);
    const skipped = due.map(d => d.key);
    if (!skipped.length){ hideRecurCard(); return; }

    skipped.forEach(k => recurrentsApplied.add(k));
    saveRecurrentsApplied();
    hideRecurCard();

    const undo = () => {
      skipped.forEach(k => recurrentsApplied.delete(k));
      saveRecurrentsApplied();
      checkRecurrentsReminder();
    };

    showToast("Omitidos todos los recurrentes de este mes", {
      type:"info",
      duration: 3500,
      actionText: "Deshacer",
      onAction: undo
    });
  });
}

// monta ahora (por si el script va al final) y también cuando el DOM cargue
mountRecurCard();
document.addEventListener("DOMContentLoaded", mountRecurCard);

// -------------------- Confirm propio (Promise<boolean>) --------------------
function appConfirm({ title = "Confirmar", message = "", confirmText = "Aceptar", cancelText = "Cancelar", variant = "primary" } = {}) {
  return new Promise((resolve) => {
    const root = document.getElementById("appConfirm");
    const titleEl = document.getElementById("appConfirmTitle");
    const msgEl = document.getElementById("appConfirmMsg");
    const btnOk = document.getElementById("appConfirmOk");
    const btnCancel = document.getElementById("appConfirmCancel");

    titleEl.textContent = title;
    msgEl.textContent = message;
    btnOk.textContent = confirmText;
    btnCancel.textContent = cancelText;

    btnOk.classList.remove("btn-primary", "btn-danger");
    btnOk.classList.add(variant === "danger" ? "btn-danger" : "btn-primary");

    root.classList.add("show");
    root.setAttribute("aria-hidden", "false");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement;
    btnOk.focus();

    const close = (ok) => {
      root.classList.remove("show");
      root.setAttribute("aria-hidden", "true");
      document.body.style.overflow = prevOverflow;
      btnOk.removeEventListener("click", onOk);
      btnCancel.removeEventListener("click", onCancel);
      root.removeEventListener("click", onBackdrop);
      document.removeEventListener("keydown", onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
      resolve(ok);
    };

    const onOk = () => close(true);
    const onCancel = () => close(false);
    const onBackdrop = (e) => { if (e.target === root || e.target.classList.contains("app-confirm__backdrop")) close(false); };
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(false); }
      if (e.key === "Enter")  { e.preventDefault(); close(true); }
      if (e.key === "Tab") {
        const focusables = [btnCancel, btnOk];
        const i = focusables.indexOf(document.activeElement);
        if (e.shiftKey) { e.preventDefault(); focusables[(i <= 0 ? focusables.length : i) - 1].focus(); }
        else            { e.preventDefault(); focusables[(i + 1) % focusables.length].focus(); }
      }
    };

    btnOk.addEventListener("click", onOk);
    btnCancel.addEventListener("click", onCancel);
    root.addEventListener("click", onBackdrop);
    document.addEventListener("keydown", onKey);
  });
}

// -------------------- Datos persistentes --------------------
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let presupuesto = parseFloat(localStorage.getItem("presupuesto")) || 0;
if (presupuesto) presupuestoInput.value = presupuesto;

// Dark mode persistente
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
  darkIcon.textContent = "☀️";
} else {
  darkIcon.textContent = "🌙";
}

document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'enter'){
    if (form) { e.preventDefault(); form.requestSubmit(); }
  }
  if (mod && e.key.toLowerCase() === 'k'){
    if (buscarCategoria){ e.preventDefault(); buscarCategoria.focus(); buscarCategoria.select?.(); }
  }
});

// Header shadow al hacer scroll
const headerEl = document.querySelector('header');
const headerScrollCheck = () => {
  if (!headerEl) return;
  if (window.scrollY > 0) headerEl.classList.add('is-scrolled');
  else headerEl.classList.remove('is-scrolled');
};
window.addEventListener('scroll', headerScrollCheck);
headerScrollCheck();

if (addFirstBtn) {
  addFirstBtn.addEventListener("click", () => {
    secciones.forEach(s => s.classList.add("oculto"));
    document.getElementById("seccionFormulario").classList.remove("oculto");
    if (estadoVacio) estadoVacio.hidden = true;
    (categoriaInput || tipoInput || importeInput || fechaInput)?.focus?.();
    markOnboardStep('primerGasto');
    (document.querySelector('main') || document.body).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


// --- Prefijar valores (móvil)
function fmtDate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmtMonth(d){
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
const _today = new Date();
if (fechaInput && !fechaInput.value) {
  if ("valueAsDate" in fechaInput) fechaInput.valueAsDate = _today;
  else fechaInput.value = fmtDate(_today);
}
if (filtrarMes && !filtrarMes.value) filtrarMes.value = fmtMonth(_today);

// --- Estado: presupuestos por categoría (guardados por nombre "bonito": Capitalizado)
let catBudgets = {};
try { catBudgets = JSON.parse(localStorage.getItem("catBudgets")) || {}; } catch { catBudgets = {}; }
function saveCatBudgets(){ localStorage.setItem("catBudgets", JSON.stringify(catBudgets)); }

/* 👇 recordamos el % y el color anteriores por categoría */
const _lastCatPct = new Map();
const _lastCatStatus = new Map();

// Sugerencias de categorías para el datalist
function refreshCategorySuggestions(){
  if (!categoriasSugeridasDL) return;
  const set = new Set();
  combinarGastos().forEach(g => { if (g && g.categoria) set.add(capitalizeFirst(String(g.categoria).trim())); });
  categoriasSugeridasDL.innerHTML = "";
  set.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    categoriasSugeridasDL.appendChild(opt);
  });
}

// Gastado por categoría en un mes (solo tipo "gasto")
function getSpentByCategory(m){
  const arr = (m === mesActual) ? (gastos || []) : (JSON.parse(localStorage.getItem(`gastos_${m}`)) || []);
  const map = {};
  for (const g of arr){
    if (!g || g.tipo !== "gasto") continue;
    const cat = capitalizeFirst((g.categoria || "").trim());
    const imp = Number(g.importe) || 0;
    if (!cat) continue;
    map[cat] = (map[cat] || 0) + imp;
  }
  return map;
}

// Render del panel de presupuestos
function renderCatBudgets(){
  if (!catBudgetList) return;
  const selMes = filtrarMes.value || mesActual;
  const spent = getSpentByCategory(selMes);

  const entries = Object.entries(catBudgets);
  catBudgetList.innerHTML = "";

  if (entries.length === 0){
    catBudgetList.innerHTML = `<p style="opacity:.8">No has definido presupuestos por categoría.</p>`;
    return;
  }

  entries.forEach(([cat, limit]) => {
    const used   = Number(spent[cat] || 0);
    const lim    = Number(limit) || 0;
    const pct    = lim > 0 ? Math.min(100, Math.round((used / lim) * 100)) : 0;
    const status = used >= lim ? "over" : (used >= lim * 0.8 ? "warn" : "ok");

    const item = document.createElement("div");
    item.className = "catbudget-item";
    item.innerHTML = `
      <div class="catbudget-row">
        <strong class="cat">${esc(cat)}</strong>
        <span class="amount">${used.toFixed(2)} / ${lim.toFixed(2)} €</span>
        <button class="catbudget-del" data-cat="${esc(cat)}" title="Quitar">✖</button>
      </div>
      <div class="progress"><div class="progress__bar"></div></div>
    `;
    const bar = item.querySelector(".progress__bar");
    catBudgetList.appendChild(item);

    // 1) Estado anterior (para animar también al bajar)
    const prevPct    = _lastCatPct.has(cat) ? _lastCatPct.get(cat) : 0;
    const prevStatus = _lastCatStatus.get(cat) || "ok";

    // 2) Pintamos el estado anterior SIN transición
    bar.style.transition = "none";
    bar.classList.remove("ok","warn","over");
    bar.classList.add(prevStatus);
    bar.style.width = `${prevPct}%`;

    // 3) Dos frames para asegurar el “before” está pintado y luego animar al “after”
    requestAnimationFrame(() => {
      bar.style.transition = "";
      requestAnimationFrame(() => {
        bar.classList.remove("ok","warn","over");
        bar.classList.add(status);
        bar.style.width = `${pct}%`;
      });
    });

    // 4) Guardamos el nuevo “anterior” al terminar la animación
    bar.addEventListener("transitionend", () => {
      _lastCatPct.set(cat, pct);
      _lastCatStatus.set(cat, status);
    }, { once:true });
  });
}

// Eventos del panel
catBudgetGuardar?.addEventListener("click", () => {
  const cat = capitalizeFirst((catBudgetCategoria?.value || "").trim());
  const lim = parseFloat(catBudgetImporte?.value);
  if (!cat) { showToast("Indica una categoría", { type:"error" }); return; }
  if (!isFinite(lim) || lim <= 0) { showToast("Indica un importe válido", { type:"error" }); return; }

  catBudgets[cat] = lim;
  saveCatBudgets();
  catBudgetImporte.value = "";
  catBudgetCategoria.value = "";
  renderCatBudgets();
  showToast("Presupuesto guardado", { type:"success" });
});

catBudgetList?.addEventListener("click", (e) => {
  const btn = e.target.closest(".catbudget-del");
  if (!btn) return;
  const cat = btn.dataset.cat;
  delete catBudgets[cat];
  saveCatBudgets();

  _lastCatPct.delete(cat);
  _lastCatStatus.delete(cat);

  renderCatBudgets();
});

// -------------------- Gestión Mensual --------------------
const now = new Date();
const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
if (filtrarMes) filtrarMes.value = mesActual;

let mesGuardado = localStorage.getItem("mesActual");
if (!mesGuardado) {
  localStorage.setItem("mesActual", mesActual);
  mesGuardado = mesActual;
}
if (mesActual !== mesGuardado) {
  const prev = JSON.parse(localStorage.getItem("gastos")) || [];
  if (prev.length > 0) localStorage.setItem(`gastos_${mesGuardado}`, JSON.stringify(prev));
  gastos = [];
  localStorage.setItem("gastos", JSON.stringify(gastos));
  localStorage.setItem("mesActual", mesActual);
  mesGuardado = mesActual;
}
(() => {
  if (!Array.isArray(gastos) || gastos.length === 0) return;
  const actuales = [];
  const porMes = {};
  for (const g of gastos) {
    if (!g || !g.fecha || typeof g.fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(g.fecha)) {
      actuales.push(g); continue;
    }
    const m = g.fecha.slice(0, 7);
    if (m === mesActual) actuales.push(g);
    else (porMes[m] ||= []).push(g);
  }
  for (const [m, arr] of Object.entries(porMes)) {
    const ya = JSON.parse(localStorage.getItem(`gastos_${m}`)) || [];
    localStorage.setItem(`gastos_${m}`, JSON.stringify(ya.concat(arr)));
  }
  if (actuales.length !== gastos.length) {
    gastos = actuales;
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }
})();

// -------------------- Utilidades --------------------
function esc(s = "") {
  return String(s).replace(/[&<>"']/g, m => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]
  ));
}
function normalizeStr(s = "") {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
function capitalizeFirst(str = "") {
  if (!str) return "";
  return str.charAt(0).toLocaleUpperCase('es-ES') + str.slice(1);
}

// Fallback para CSS.escape
const cssEscape = (s) => (window.CSS && typeof CSS.escape === 'function')
  ? CSS.escape(s)
  : String(s).replace(/[^a-zA-Z0-9_\-]/g, '\\$&');

// Paleta/categorías
if (!window.__palette__) {
  window.__palette__ = [
    "#E69F00","#56B4E9","#009E73","#F0E442","#0072B2",
    "#D55E00","#CC79A7","#999999","#8DD3C7","#FB8072",
    "#80B1D3","#FDB462","#B3DE69","#FCCDE5","#BC80BD",
    "#CCEBC5","#FFED6F"
  ];
}
if (!window.__colorMap__) window.__colorMap__ = new Map();
function colorForCategory(label) {
  const key = (label || "Sin categoría").trim();
  const cmap = window.__colorMap__;
  const pal  = window.__palette__;
  if (!cmap.has(key)) {
    const used = new Set(cmap.values());
    const next = pal.find(c => !used.has(c)) || pal[cmap.size % pal.length];
    cmap.set(key, next);
  }
  return cmap.get(key);
}

function maybeToastBudgetBackUnder(catKey, monthKey, removedImporte, tipo){
  if (tipo !== 'gasto') return;
  const lim = Number(catBudgets[catKey] || 0);
  if (!lim) return;
  const spentAfter = Number(getSpentByCategory(monthKey)[catKey] || 0);
  const spentBefore = spentAfter + Number(removedImporte || 0);
  if (spentBefore > lim && spentAfter <= lim){
    showToast(`✅ Vuelves a estar dentro del presupuesto de ${catKey} en ${monthKey}.`, { type:'info', duration: 2200 });
  }
}

function removeRecurrentByRid(rid){
  const idx = recurrents.findIndex(r => r.rid === rid);
  if (idx === -1) return;

  // Quitar la regla
  recurrents.splice(idx, 1);
  saveRecurrents();

  // Limpiar marcas aplicadas relacionadas (rid|fecha)
  const toDelete = [];
  for (const k of recurrentsApplied) {
    if (k.startsWith(rid + "|")) toDelete.push(k);
  }
  toDelete.forEach(k => recurrentsApplied.delete(k));
  saveRecurrentsApplied();

  checkRecurrentsReminder();
  renderTabla();
  showToast("Regla recurrente eliminada", { type:"success" });
}

function renderRecurrentManager(){
  const list = document.getElementById('recurManagerList');
  if (!list) return;
  list.innerHTML = '';

  if (!recurrents.length){
    list.innerHTML = `<p style="opacity:.8">No hay reglas recurrentes guardadas.</p>`;
    return;
  }

  const buildRow = (r, editing = false) => {
    const row = document.createElement('div');
    row.className = 'recur-item';
    row.dataset.rid = r.rid;

    if (!editing){
      row.innerHTML = `
        <span>
          <strong>${esc(capitalizeFirst(r.categoria))}</strong>
          · ${r.tipo === 'gasto' ? '-' : '+'}${Number(r.importe).toFixed(2)} €
          · inicio ${r.startDate}
          · ${r.freq || 'mensual'}
        </span>
        <div class="recur-actions-row">
          <button class="btn-xs" data-action="edit" data-rid="${esc(r.rid)}">Editar</button>
          <button class="btn-xs btn-danger-xs" data-action="delete" data-rid="${esc(r.rid)}">Eliminar</button>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div style="display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; width:100%;">
          <label>Cat.
            <input id="editCat-${r.rid}" type="text" value="${esc(r.categoria)}" list="categoriasSugeridas" style="min-width:140px">
          </label>
          <label>Importe
            <input id="editImp-${r.rid}" type="number" min="0.01" step="0.01" value="${Number(r.importe).toFixed(2)}" style="width:120px">
          </label>
          <label>Frecuencia
            <select id="editFreq-${r.rid}">
              <option value="semanal"${(r.freq==='semanal')?' selected':''}>Semanal</option>
              <option value="mensual"${(!r.freq || r.freq==='mensual')?' selected':''}>Mensual</option>
              <option value="anual"${(r.freq==='anual')?' selected':''}>Anual</option>
            </select>
          </label>
          <div class="recur-actions-row" style="margin-left:auto;">
            <button class="btn-xs btn-primary-xs" data-action="save" data-rid="${esc(r.rid)}">Guardar</button>
            <button class="btn-xs" data-action="cancel" data-rid="${esc(r.rid)}">Cancelar</button>
          </div>
        </div>
      `;
    }
    return row;
  };

  recurrents.forEach(r => list.appendChild(buildRow(r, false)));

  // foco al abrir
  const parentSection = document.getElementById('seccionRecurrentes');
  const h2 = parentSection?.querySelector('h2');
  if (h2){ h2.setAttribute('tabindex','-1'); setTimeout(()=>h2.focus(), 0); }

  list.onclick = async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const rid = btn.dataset.rid;
    const action = btn.dataset.action;
    const idx = recurrents.findIndex(x => x.rid === rid);
    if (idx === -1) return;

    if (action === 'edit'){
      const r = recurrents[idx];
      const editingRow = buildRow(r, true);
      list.replaceChild(editingRow, list.querySelector(`.recur-item[data-rid="${cssEscape(rid)}"]`));
      editingRow.querySelector(`#editCat-${rid}`)?.focus();
      return;
    }
    if (action === 'cancel'){
      const r = recurrents[idx];
      const viewRow = buildRow(r, false);
      list.replaceChild(viewRow, list.querySelector(`.recur-item[data-rid="${cssEscape(rid)}"]`));
      return;
    }
    if (action === 'save'){
      const cat = String(document.getElementById(`editCat-${rid}`)?.value || "").trim();
      const imp = parseFloat(document.getElementById(`editImp-${rid}`)?.value);
      const freq = document.getElementById(`editFreq-${rid}`)?.value || 'mensual';
      if (!cat){ showToast("La categoría no puede estar vacía.", { type:"error" }); return; }
      if (!isFinite(imp) || imp <= 0){ showToast("El importe debe ser > 0.", { type:"error" }); return; }
      recurrents[idx].categoria = cat.replace(/[&<>"']/g, "");
      recurrents[idx].importe = imp;
      recurrents[idx].freq = freq;
      saveRecurrents();
      // repintar manager
      renderRecurrentManager();
      // refrescar recordatorio del mes
      checkRecurrentsReminder();
      showToast("Regla actualizada", { type:"success" });
      return;
    }
    if (action === 'delete'){
      const ok = await appConfirm({
        title: "Eliminar regla recurrente",
        message: "No se eliminarán movimientos ya creados, solo la regla futura. ¿Continuar?",
        confirmText: "Eliminar regla",
        cancelText: "Cancelar",
        variant: "danger"
      });
      if (!ok) return;
      removeRecurrentByRid(rid);
      renderRecurrentManager();
      return;
    }
  };
}

function monthKeyOf(dateStr){ return String(dateStr || "").slice(0,7); }
function lastDayIn(y, m){ return new Date(y, m, 0).getDate(); }

// Próxima fecha para "mensual" en el mes seleccionado (misma 'day' del startDate; si no existe, último día)
function dueDateForMonthly(r, monthKey){
  const [y, m] = monthKey.split("-").map(Number);
  const startMK = monthKeyOf(r.startDate);
  if (monthKey < startMK) return null;
  const dayFromStart = parseInt((r.startDate || "").slice(8,10), 10) || 1;
  const day = Math.min(dayFromStart, lastDayIn(y, m));
  return `${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

function dueDatesForWeekly(r, monthKey){
  const [y, m] = monthKey.split('-').map(Number);
  const firstOfMonth = new Date(y, m-1, 1);
  const start = new Date(r.startDate);
  if (monthKey < monthKeyOf(r.startDate)) return [];
  const targetDow = start.getDay();
  let d = new Date(y, m-1, 1);
  const delta = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  const out = [];
  while (d.getMonth() === m-1) {
    if (d >= start) out.push(fmtDate(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
}
function dueDateForYearly(r, monthKey){
  const [y, m] = monthKey.split('-').map(Number);
  const start = new Date(r.startDate);
  if (monthKey < monthKeyOf(r.startDate)) return null;
  if ((start.getMonth()+1) !== m) return null;
  const day = Math.min(start.getDate(), lastDayIn(y, m));
  return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

// Devuelve pendientes no aplicados todavía para el mes
function getDueRecurrents(monthKey){
  const due = [];
  for (const r of recurrents){
    const freq = r.freq || "mensual";
    if (freq === "mensual"){
      const date = dueDateForMonthly(r, monthKey);
      if (!date) continue;
      const key = `${r.rid}|${date}`;
      if (!recurrentsApplied.has(key)) due.push({ r, date, key });
    } else if (freq === "semanal"){
      const dates = dueDatesForWeekly(r, monthKey);
      for (const date of dates){
        const key = `${r.rid}|${date}`;
        if (!recurrentsApplied.has(key)) due.push({ r, date, key });
      }
    } else if (freq === "anual"){
      const date = dueDateForYearly(r, monthKey);
      if (!date) continue;
      const key = `${r.rid}|${date}`;
      if (!recurrentsApplied.has(key)) due.push({ r, date, key });
    }
  }
  return due;
}

// Pintar / ocultar tarjeta
function hideRecurCard(){ const c = document.getElementById("recurReminder"); if (c) c.hidden = true; }

function showRecurCard(due){
  const card = document.getElementById("recurReminder");
  const list = document.getElementById("recurList");
  if (!card || !list) return;
  list.innerHTML = "";

  due.forEach(({ r, date, key }) => {
    const row = document.createElement("div");
    row.className = "recur-item";
    row.innerHTML = `
      <span><strong>${esc(capitalizeFirst(r.categoria))}</strong> · ${r.tipo === "gasto" ? "-" : "+"}${Number(r.importe).toFixed(2)} € · ${date}</span>
      <div style="display:flex; gap:.4rem;">
        <button class="btn-xs btn-primary-xs" data-action="add" data-key="${esc(key)}">Añadir</button>
        <button class="btn-xs" data-action="skip" data-key="${esc(key)}">Omitir</button>
        <button class="btn-xs btn-danger-xs" data-action="removeRule" data-rid="${esc(r.rid)}">Eliminar regla</button>
      </div>
    `;
    list.appendChild(row);
  });

  // Delegación: añadir / omitir uno / eliminar regla
  list.onclick = async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (action === "add" || action === "skip") {
      const key = btn.dataset.key;
      const item = due.find(d => d.key === key);
      if (!item) return;

      if (action === "add") {
        applyOneRecurrent(item);
      } else {
        recurrentsApplied.add(key);
        saveRecurrentsApplied();
        btn.closest(".recur-item")?.remove();
        if (!list.children.length) hideRecurCard();
        showToast("Recurrente omitido este mes", { type:"info", duration: 1300 });
      }
    } else if (action === "removeRule") {
      const rid = btn.dataset.rid;
      const ok = await appConfirm({
        title: "Eliminar regla recurrente",
        message: "Esto no eliminará movimientos ya creados, solo la regla futura. ¿Continuar?",
        confirmText: "Eliminar regla",
        cancelText: "Cancelar",
        variant: "danger"
      });
      if (!ok) return;
      removeRecurrentByRid(rid);
      btn.closest(".recur-item")?.remove();
      if (!list.children.length) hideRecurCard();
    }
  };

  card.hidden = false;
}

function upsertExpenseForMonth(item){
  const m = String(item.fecha || "").slice(0,7);
  if (m === mesActual) {
    gastos.push(item);
    localStorage.setItem("gastos", JSON.stringify(gastos));
  } else {
    const k = `gastos_${m}`;
    const arr = JSON.parse(localStorage.getItem(k)) || [];
    arr.push(item);
    localStorage.setItem(k, JSON.stringify(arr));
  }
}

function applyOneRecurrent({ r, date, key }){
  const newItem = {
    id: generarId(),
    tipo: r.tipo,
    categoria: r.categoria,
    importe: Number(r.importe),
    fecha: date
  };

  upsertExpenseForMonth(newItem);
  recurrentsApplied.add(key);
  saveRecurrentsApplied();

  renderTabla();
  scrollToRowById(newItem.id);
  showToast("Recurrente añadido", { type:"success", duration: 1500 });
  checkRecurrentsReminder();
}

function applyDueRecurrentsForMonth(monthKey){
  const due = getDueRecurrents(monthKey);
  if (!due.length) { hideRecurCard(); return; }
  due.forEach(applyOneRecurrent);
}

function checkRecurrentsReminder(){
  const mk = filtrarMes.value || mesActual;
  const due = getDueRecurrents(mk);
  if (due.length) showRecurCard(due); else hideRecurCard();
  // 👇 Puntito en el icono del menú
  if (menuToggle) menuToggle.classList.toggle('has-notifs', due.length > 0);
}

// Mensaje “sin datos” en canvas
function drawNoDataMessage(canvas, text) {
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.style.width = '100%';
  canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
  canvas.height = Math.max(120, Math.floor(rect.height * dpr));

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = body.classList.contains('dark') ? "#eee" : "#333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rect.width / 2, rect.height / 2);
  ctx.restore();
}

// -------------------- Gráficos --------------------
let chartPorcentaje, chartDiario, chartHistorico;

const baseBarOpts = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  animation: { duration: 1000, easing: "easeOutCubic" },
  animations: {
    y: {
      type: "number",
      from: (ctx) => ctx.chart.scales.y.getPixelForValue(0),
      duration: 1000,
      easing: "easeOutCubic"
    }
  }
};

function renderGraficoPorcentaje(mesFiltrado) {
  const seccion = document.getElementById("seccionGraficoPorcentaje");
  if (seccion && seccion.classList.contains("oculto")) return;

  const gastosAMostrar = mesFiltrado === mesActual
    ? gastos
    : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];

  const categorias = {};
  gastosAMostrar
    .filter(g => g.tipo === "gasto")
    .forEach(g => {
      const key = capitalizeFirst((g.categoria || "").trim());
      categorias[key] = (categorias[key] || 0) + g.importe;
    });

  const canvas = document.getElementById("graficoGastos");
  canvas.style.height = '400px';
  canvas.style.maxHeight = '400px';

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext("2d");

  if (Object.keys(categorias).length === 0) {
    if (chartPorcentaje) chartPorcentaje.destroy();
    drawNoDataMessage(canvas, "No hay gastos este mes");
    return;
  }

  if (chartPorcentaje) chartPorcentaje.destroy();

  const labels     = Object.keys(categorias);
  const dataValues = Object.values(categorias);
  const isDark     = body.classList.contains('dark');
  const bordePastel = isDark ? '#fff' : '#000';
  const textColor   = isDark ? '#fff' : '#000';
  const bgColors    = labels.map(lbl => colorForCategory(lbl));

  const hover = Math.min(12, Math.max(6, Math.round(rect.width * 0.02)));
  const pad   = hover + 12;

  chartPorcentaje = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: bgColors,
        radius: "88%",
        hoverOffset: hover,
        borderColor: bordePastel,
        borderWidth: 2,
        hoverBorderColor: bordePastel,
        hoverBorderWidth: 2,
        borderAlign: "inner"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: pad, right: pad, bottom: pad, left: pad } },
      animation: { duration: 1200, easing: 'easeOutQuart' },
      animations: {
        circumference: { from: 0, duration: 1200, easing: 'easeOutQuart' },
        rotation:      { from: -Math.PI, duration: 1200, easing: 'easeOutQuart' }
      },
      elements: { arc: { borderAlign: "inner" } },
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: {
          backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : '#fff',
          titleColor: textColor,
          bodyColor:  textColor,
          borderColor: bordePastel,
          borderWidth: 1
        }
      }
    }
  });
}

function renderGraficoDiario(mesFiltrado) {
  const sec = document.getElementById("seccionGraficoDiario");
  if (sec && sec.classList.contains("oculto")) return;

  const [anio, mesNum] = (mesFiltrado || mesActual).split("-").map(Number);
  const diasMes = new Date(anio, mesNum, 0).getDate();
  const labels = Array.from({ length: diasMes }, (_, i) => i + 1);
  const datosGastos = Array(diasMes).fill(0);
  const datosBeneficios = Array(diasMes).fill(0);

  const gastosAMostrar = mesFiltrado === mesActual
    ? gastos
    : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];

  gastosAMostrar.forEach(g => {
    if (g.fecha && g.fecha.startsWith(mesFiltrado)) {
      const dia = parseInt(g.fecha.slice(-2), 10) - 1;
      if (dia >= 0 && dia < diasMes) {
        if (g.tipo === "gasto") datosGastos[dia] += g.importe;
        else datosBeneficios[dia] += g.importe;
      }
    }
  });

  const canvas = document.getElementById("graficoDiario");
  canvas.style.maxHeight = "400px";
  const ctx = canvas.getContext("2d");

  const noData = datosGastos.every(v => v === 0) && datosBeneficios.every(v => v === 0);
  if (noData) {
    if (chartDiario) chartDiario.destroy();
    drawNoDataMessage(canvas, "No hay datos para este mes");
    return;
  }

  if (chartDiario) chartDiario.destroy();

  const isDark = body.classList.contains('dark');
  const tickColor = isDark ? '#fff' : '#000';

  chartDiario = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Gastos", data: datosGastos, backgroundColor: "#e74c3c" },
        { label: "Beneficios", data: datosBeneficios, backgroundColor: "#2ecc71" }
      ]
    },
    options: {
      ...baseBarOpts,
      plugins: { legend: { position: "top", labels: { color: tickColor } } },
      scales: {
        x: { ticks: { color: tickColor } },
        y: { ticks: { color: tickColor } }
      }
    }
  });
}

// ---- Helper: color del balance para el histórico
function setBalanceColor(el, value){
  if (!el) return;
  el.classList.remove('balance-verde','balance-amarillo','balance-naranja','balance-rojo');
  if (value > 100) el.classList.add('balance-verde');
  else if (value >= 50) el.classList.add('balance-amarillo');
  else if (value > 0) el.classList.add('balance-naranja');
  else el.classList.add('balance-rojo');
}

function setTituloGraficoDiario(m = (filtrarMes.value || mesActual)) {
  if (!tituloGraficoDiario) return;
  const [y, mm] = (m || "").split("-").map(Number);
  const d = new Date(y, (mm || 1) - 1, 1);
  let etiqueta = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  etiqueta = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
  tituloGraficoDiario.textContent = `📊 Gastos vs Beneficios de ${etiqueta}`;
}

// ---- Histórico de meses
function getAvailableMonths(){
  const months = new Set();
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('gastos_')) months.add(k.slice(7));
  });
  if (Array.isArray(gastos) && gastos.length > 0) months.add(mesActual);
  return Array.from(months).sort();
}

function populateSelectHistorico(){
  if (!selectMesHistorico) return;
  const current = selectMesHistorico.value;
  const months = getAvailableMonths();
  selectMesHistorico.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = 'todos';
  optAll.textContent = 'Todos los meses';
  selectMesHistorico.appendChild(optAll);
  months.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    selectMesHistorico.appendChild(opt);
  });
  if ([...selectMesHistorico.options].some(o => o.value === current)) {
    selectMesHistorico.value = current;
  } else {
    selectMesHistorico.value = 'todos';
  }
}

function totalsForMonth(m){
  const arr = (m === mesActual) ? (gastos || []) : (JSON.parse(localStorage.getItem(`gastos_${m}`)) || []);
  let gastosTotal = 0, beneficiosTotal = 0;
  arr.forEach(g => {
    if (!g || typeof g.importe !== 'number') return;
    if (g.tipo === 'gasto') gastosTotal += g.importe; else beneficiosTotal += g.importe;
  });
  return { gastos: gastosTotal, beneficios: beneficiosTotal, balance: (beneficiosTotal - gastosTotal) };
}

function renderGraficoHistorico() {
  if (!graficoHistoricoCanvas || !selectMesHistorico) return;

  const sec = document.getElementById("seccionHistorico");
  if (sec && sec.classList.contains("oculto")) return;

  graficoHistoricoCanvas.style.maxHeight = "400px";
  const ctx = graficoHistoricoCanvas.getContext("2d");
  const sel = selectMesHistorico.value || "todos";

  if (chartHistorico) chartHistorico.destroy();

  const showNoData = () => {
    drawNoDataMessage(graficoHistoricoCanvas, "No existen datos todavía");
    if (balanceHistorico) {
      balanceHistorico.textContent = "";
      balanceHistorico.className = "";
      balanceHistorico.style.display = "none";
    }
  };

  const showBalance = (text, val) => {
    if (!balanceHistorico) return;
    balanceHistorico.style.display = "";
    balanceHistorico.textContent = text;
    setBalanceColor(balanceHistorico, val);
  };

  const isDark = body.classList.contains('dark');
  const tickColor = isDark ? '#fff' : '#000';

  if (sel === "todos") {
    const months = getAvailableMonths();
    if (months.length === 0) { showNoData(); return; }

    const gastosData = [], beneficiosData = [];
    months.forEach(m => {
      const t = totalsForMonth(m);
      gastosData.push(t.gastos);
      beneficiosData.push(t.beneficios);
    });

    chartHistorico = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          { label: "Gastos", data: gastosData, backgroundColor: "#e74c3c" },
          { label: "Beneficios", data: beneficiosData, backgroundColor: "#2ecc71" }
        ]
      },
      options: {
        ...baseBarOpts,
        plugins: { legend: { labels: { color: tickColor } } },
        scales: {
          x: { ticks: { color: tickColor } },
          y: { ticks: { color: tickColor } }
        }
      }
    });

    const totalBalance = months.reduce((acc, m) => acc + totalsForMonth(m).balance, 0);
    showBalance(`Balance acumulado: ${totalBalance.toFixed(2)} €`, totalBalance);
  } else {
    const t = totalsForMonth(sel);
    if ((t.gastos ?? 0) === 0 && (t.beneficios ?? 0) === 0) { showNoData(); return; }

    chartHistorico = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Gastos", "Beneficios"],
        datasets: [
          { label: sel, data: [t.gastos, t.beneficios], backgroundColor: ["#e74c3c", "#2ecc71"] }
        ]
      },
      options: {
        ...baseBarOpts,
        plugins: { legend: { labels: { color: tickColor } } },
        scales: {
          x: { ticks: { color: tickColor } },
          y: { ticks: { color: tickColor } }
        }
      }
    });

    showBalance(`Balance ${sel}: ${t.balance.toFixed(2)} €`, t.balance);
  }
}

// -------------------- Render Tabla --------------------
function renderTabla() {
  tabla.innerHTML = "";
  let total = 0;
  let gastosSum = 0;

  const filtroTerm = normalizeStr(buscarCategoria.value || "");
  const filtroMes  = filtrarMes.value || mesActual;

  // Asegura que el estado vacío empieza oculto en cada render
  if (estadoVacio) estadoVacio.hidden = true;

  const gastosAMostrar = (filtroMes === mesActual)
    ? gastos
    : (JSON.parse(localStorage.getItem(`gastos_${filtroMes}`)) || []);

  const gastosFiltrados = gastosAMostrar.filter(g => {
    const catNorm = normalizeStr(g?.categoria || "");
    return !filtroTerm || catNorm.includes(filtroTerm);
  });

  const gastosOrdenados = gastosFiltrados.slice().sort(getSorter());

  // ---- Estado vacío
  if (gastosFiltrados.length === 0) {
    tabla.innerHTML = "";

    if ((buscarCategoria.value || "").trim()) {
      emptyStateMsg.textContent = `No hay resultados para “${buscarCategoria.value}”.`;
    } else if ((gastosAMostrar || []).length === 0) {
      emptyStateMsg.textContent = "Todavía no hay movimientos este mes.";
    } else {
      emptyStateMsg.textContent = "No hay movimientos que coincidan.";
    }

    if (estadoVacio) estadoVacio.hidden = false;

    totalEl.textContent = `Balance: 0.00 €`;
    totalEl.style.color = "";
    alertaPresupuesto.textContent = "";
    alertaPresupuesto.classList.remove("show");

    renderGraficoPorcentaje(filtroMes);
    renderGraficoDiario(filtroMes);
    renderGraficoHistorico();
    renderCatBudgets();
    updateSortUI();
    return;
  } else {
    if (estadoVacio) estadoVacio.hidden = true;
  }

  // ---- Render filas
  let rowCount = 0;
  // DONDE AHORA PONE:
    gastosOrdenados.forEach((gasto) => {
    const fila = document.createElement("tr");
    fila.classList.add("fade-in");
    fila.dataset.id = gasto.id;

    if (estadoVacio) estadoVacio.hidden = true;

    if (gasto.tipo === "gasto") fila.classList.add("gasto");
    else fila.classList.add("beneficio");

    const tipoLabel = gasto.tipo === "gasto" ? "Gasto" : "Beneficio";
    const categoriaLabel = capitalizeFirst((gasto.categoria || "").trim());

    const keyCat = categoriaLabel || "Sin categoría";
    const colorCat = colorForCategory(keyCat);

    fila.innerHTML = `
      <td data-label="Tipo">${tipoLabel}</td>
      <td class="categoria" data-label="Categoría" style="border-color:${colorCat}">${esc(categoriaLabel)}</td>
      <td data-label="Importe (€)" style="color:${gasto.tipo === "gasto" ? '#e74c3c' : '#2ecc71'}">
        ${gasto.tipo === "gasto" ? "-" : ""}${gasto.importe.toFixed(2)} €
      </td>
      <td data-label="Fecha">${gasto.fecha}</td>
      <td class="acciones">
         <button class="editar"   data-id="${gasto.id}" data-month="${gasto.fecha.slice(0,7)}" aria-label="Editar" title="Editar">✏️</button>
         <button class="eliminar" data-id="${gasto.id}" data-month="${gasto.fecha.slice(0,7)}" aria-label="Eliminar" title="Eliminar">🗑️</button>
      </td>
    `;
    tabla.appendChild(fila);
    makeRowSwipeable(fila, gasto);
    rowCount++;

    if (gasto.tipo === "gasto") { total -= gasto.importe; gastosSum += gasto.importe; }
    else { total += gasto.importe; }
  });

  if (estadoVacio) estadoVacio.hidden = rowCount > 0;

  totalEl.textContent = `Balance: ${total.toFixed(2)} €`;
  if (total > 100) totalEl.style.color = "#2ecc71";
  else if (total >= 50) totalEl.style.color = "#f1c40f";
  else if (total > 0) totalEl.style.color = "#e67e22";
  else totalEl.style.color = "#e74c3c";

  if (presupuesto && filtroMes === mesActual && gastosSum > presupuesto) {
    alertaPresupuesto.textContent =
      `⚠️ Has superado tu presupuesto mensual (${gastosSum.toFixed(2)}€ / ${presupuesto.toFixed(2)}€)`;
    alertaPresupuesto.classList.add("show");
  } else {
    alertaPresupuesto.textContent = "";
    alertaPresupuesto.classList.remove("show");
  }

  if (filtroMes === mesActual) localStorage.setItem("gastos", JSON.stringify(gastos));

  renderGraficoPorcentaje(filtroMes);
  renderGraficoDiario(filtroMes);
  renderGraficoHistorico();
  renderCatBudgets();

  if (estadoVacio) {
    const hayFilas = tabla.querySelectorAll('tr').length > 0;
    estadoVacio.hidden = hayFilas;
    estadoVacio.style.display = hayFilas ? 'none' : '';
  }
   updateSortUI();
}

// --- Scroll helper: desplaza hasta la fila por ID y la resalta ---
function scrollToRowById(id){
  if (!id) return;
  const row = tabla.querySelector(`tr[data-id="${cssEscape(id)}"]`);
  if (!row) return;
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  row.classList.add('flash-row');
  setTimeout(() => row.classList.remove('flash-row'), 1600);
}

// --- Swipe en filas (izda=eliminar rápido c/ deshacer; dcha=editar) ---
const SWIPE_THRESHOLD = 90;     // px para confirmar
const SWIPE_MAX = 96;           // límite visual de arrastre
const SWIPE_ANGLE_MAX = 30;     // grados: si < 30°, tratamos como gesto horizontal

function makeRowSwipeable(row, gasto){
  // no activar swipe si se inicia en un botón
  const isButton = (el) => !!el.closest('button');

  let startX=0, startY=0, dx=0, dy=0, active=false, decided=false, pointerId=null;
  const monthKey = String(gasto.fecha || '').slice(0,7);

  const reset = () => {
    row.style.transition = 'transform .18s ease';
    row.style.transform = 'translateX(0)';
    row.classList.remove('swiping','show-left','show-right');
    setTimeout(() => { row.style.transition = ''; }, 180);
  };

  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isButton(e.target)) return;

    active = true; decided = false; dx = 0; dy = 0;
    startX = e.clientX; startY = e.clientY; pointerId = e.pointerId;
    row.classList.add('swipeable');
    row.setPointerCapture?.(pointerId);
  };

  const onMove = (e) => {
    if (!active) return;

    dx = e.clientX - startX;
    dy = e.clientY - startY;

    if (!decided){
      const absx = Math.abs(dx), absy = Math.abs(dy);
      if (absx < 8 && absy < 8) return; // ruido

      const angle = Math.atan2(absy, absx) * 180 / Math.PI;
      if (angle < SWIPE_ANGLE_MAX){
        decided = true;
        row.classList.add('swiping');
        e.preventDefault();             // bloquea scroll vertical durante el gesto horizontal
      } else {
        // Es más vertical: cancelar y dejar que el scroll haga lo suyo
        active = false;
        row.releasePointerCapture?.(pointerId);
        return;
      }
    }

    const t = Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, dx));
    row.style.transform = `translateX(${t}px)`;
    row.classList.toggle('show-left',  t < -16);
    row.classList.toggle('show-right', t >  16);
  };

  const onEnd = async (e) => {
  if (!active) return;
  active = false;
  row.releasePointerCapture?.(pointerId);

  const finalDx = dx;
  row.classList.remove('swiping');

  if (finalDx <= -SWIPE_THRESHOLD){
    // Izquierda => ELIMINAR con modal de confirmación
    reset(); // volvemos la fila a su sitio antes de abrir el modal
    await eliminarGastoPorId(gasto.id, monthKey);
  } else if (finalDx >= SWIPE_THRESHOLD){
    // Derecha => EDITAR (tu editar ya abre confirm)
    reset();
    await editarGastoPorId(gasto.id, monthKey);
  } else {
    reset();
  }
};

  row.addEventListener('pointerdown', onDown);
  row.addEventListener('pointermove', onMove);
  row.addEventListener('pointerup', onEnd);
  row.addEventListener('pointercancel', () => { active=false; reset(); });
}

// Eliminar SIN modal (usado por el swipe a la izquierda)
function eliminarGastoRapido(id, monthKey){
  const ref = getMonthArrayRef(monthKey);
  const idx = ref.arr.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const eliminado = ref.arr[idx];

  // borrado inmediato
  ref.arr.splice(idx, 1);
  ref.save();
  renderTabla();

  // mismo toast con deshacer que usas en el borrado normal
  showToast('Movimiento eliminado', {
    type: 'success',
    duration: 3500,
    actionText: 'Deshacer',
    onAction: () => {
      ref.arr.splice(Math.min(idx, ref.arr.length), 0, eliminado);
      ref.save();
      const catKey = capitalizeFirst((eliminado.categoria || "").trim());
      const mk = String(eliminado.fecha || "").slice(0,7) || monthKey;
      maybeToastBudgetBackUnder(catKey, mk, eliminado.importe, eliminado.tipo);
      renderTabla();
      scrollToRowById(eliminado.id);
      showToast('Eliminación deshecha', { type: 'info', duration: 1600 });
    }
  });
}

function getMonthArrayRef(monthKey){
  if (monthKey === mesActual){
    return {
      monthKey,
      isCurrent:true,
      arr: gastos,
      save(){ localStorage.setItem("gastos", JSON.stringify(gastos)); }
    };
  } else {
    const key = `gastos_${monthKey}`;
    let arr = JSON.parse(localStorage.getItem(key)) || [];
    return {
      monthKey,
      isCurrent:false,
      get arr(){ return arr; },
      set arr(v){ arr = v; },
      save(){ localStorage.setItem(key, JSON.stringify(arr)); }
    };
  }
}


// -------------------- CRUD (por id) --------------------
async function eliminarGastoPorId(id, monthKey) {
  const ref = getMonthArrayRef(monthKey);
  const idx = ref.arr.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const ok = await appConfirm({
    title: "Eliminar movimiento",
    message: "Esta acción no se puede deshacer. ¿Quieres eliminar este movimiento?",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    variant: "danger"
  });
  if (!ok) return;

  const eliminado = ref.arr[idx];

  const ejecutarBorrado = () => {
    ref.arr.splice(idx, 1);
    ref.save();
    renderTabla();

    showToast('Movimiento eliminado', {
      type: 'success',
      duration: 3500,
      actionText: 'Deshacer',
      onAction: () => {
        ref.arr.splice(Math.min(idx, ref.arr.length), 0, eliminado);
        ref.save();
        const catKey = capitalizeFirst((eliminado.categoria || "").trim());
        const mk = String(eliminado.fecha || "").slice(0,7) || monthKey;
        maybeToastBudgetBackUnder(catKey, mk, eliminado.importe, eliminado.tipo);
        renderTabla();
        scrollToRowById(eliminado.id);
        showToast('Eliminación deshecha', { type: 'info', duration: 1600 });
      }
    });
  };

  const row = tabla.querySelector(`button.eliminar[data-id="${cssEscape(id)}"][data-month="${cssEscape(monthKey)}"]`)?.closest('tr');
  // dentro de eliminarGastoPorId, reemplaza el bloque del if(row) por:
if (row) {
  let done = false;
  const finish = () => { if (done) return; done = true; ejecutarBorrado(); };

  row.classList.add('fade-out');

  const cs = getComputedStyle(row);
  const hasAnim = cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0;

  if (hasAnim) {
    row.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 600); // seguridad por si el evento no llega
  } else {
    finish();
  }
} else {
  ejecutarBorrado();
}
}

async function editarGastoPorId(id, monthKey) {
  const ref = getMonthArrayRef(monthKey);
  const idx = ref.arr.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const ok = await appConfirm({
    title: "Editar movimiento",
    message: "Se cargarán los datos en el formulario para que puedas modificarlos. ¿Continuar?",
    confirmText: "Editar",
    cancelText: "Cancelar",
    variant: "primary"
  });
  if (!ok) return;

  const g = ref.arr[idx];

  // Cargar en el formulario
  tipoInput.value = g.tipo;
  categoriaInput.value = g.categoria;
  importeInput.value = g.importe;
  fechaInput.value = g.fecha || new Date().toISOString().slice(0,10);

  // Quitar el original del mes al que pertenece
  ref.arr.splice(idx, 1);
  ref.save();

  // Aviso de presupuestos si con esta edición vuelves a estar dentro
  const catKey = capitalizeFirst((g.categoria || "").trim());
  const mk = String(g.fecha || "").slice(0,7) || monthKey;
  maybeToastBudgetBackUnder(catKey, mk, g.importe, g.tipo);

  renderTabla();
  (document.querySelector('main') || document.body).scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Datos cargados para editar', { type: 'info', duration: 2200 });
}


// Delegación de eventos para botones editar/eliminar
tabla.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  const month = btn.dataset.month || (filtrarMes.value || mesActual);
  if (btn.classList.contains('editar')) editarGastoPorId(id, month);
  else if (btn.classList.contains('eliminar')) eliminarGastoPorId(id, month);
});

// -------------------- Formulario --------------------
form.addEventListener("submit", async e => {
  e.preventDefault();

  const tipo = tipoInput.value;

  const categoriaRaw = (categoriaInput.value || "").replace(/\s+/g, " ").trim();
  const categoria = categoriaRaw.replace(/[&<>"']/g, "");
  const catKey = capitalizeFirst(categoria);

  const importe = parseFloat(importeInput.value);

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  let fecha = (fechaInput.value || "").trim();
  if (!fechaRegex.test(fecha)) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    fecha = `${y}-${m}-${day}`;
  }

  if (!categoria) { showToast("La categoría no puede estar vacía.", { type: "error" }); return; }
  if (isNaN(importe) || importe <= 0) { showToast("El importe debe ser un número mayor que 0.", { type: "error" }); return; }

  // ⚠️ AVISO si el gasto supera el presupuesto de su categoría en ese mes
  if (tipo === "gasto" && catBudgets && catBudgets[catKey]) {
    const monthKey = fecha.slice(0, 7);                            // p.ej. "2025-09"
    const spentMap = getSpentByCategory(monthKey);
    const used = Number(spentMap[catKey] || 0);
    const lim  = Number(catBudgets[catKey] || 0);
    const willBe = used + importe;

    if (willBe > lim) {
      const [yy, mm] = monthKey.split("-").map(Number);
      const etiquetaMes = new Date(yy, mm - 1, 1)
        .toLocaleDateString("es-ES", { month: "long", year: "numeric" });

      const ok = await appConfirm({
        title: "Presupuesto superado",
        message: `Al introducir este gasto, tu presupuesto mensual en ${catKey} se verá superado para ${etiquetaMes} (${willBe.toFixed(2)}€ / ${lim.toFixed(2)}€). ¿Estás seguro de que deseas añadirlo?`,
        confirmText: "Añadir de todas formas",
        cancelText: "Cancelar",
        variant: "danger"
      });
      if (!ok) return;
    }
  }

  // Crear item y guardar en el MES correcto
  const newId = generarId();
  const item = { id: newId, tipo, categoria, importe, fecha };
  upsertExpenseForMonth(item);

  // Si es recurrente, guarda la regla y marca el mes de inicio como aplicado
  if (recurrenteChk?.checked) {
    const rid = generarId();
    const rule = {
      rid,
      tipo,
      categoria,           // ya saneada
      importe,
      startDate: fecha,    // la fecha del movimiento que acabas de añadir
      freq: (recurrenteFreq?.value || "mensual")
    };
    recurrents.push(rule);
    saveRecurrents();

    // Marca como "aplicado" el mes donde nace la regla (no recordar para el mes de inicio)
    const mk = fecha.slice(0, 7);
    const firstDate = dueDateForMonthly(rule, mk); // ajusta a fin de mes si procede
    recurrentsApplied.add(`${rid}|${firstDate}`);
    saveRecurrentsApplied();
  }

  // Desmarcar y deshabilitar selector para la siguiente entrada
if (recurrenteChk){
  recurrenteChk.checked = false;
  if (recurrenteFreq) recurrenteFreq.disabled = true;
}

  // Ajustar filtros y UI
  filtrarMes.value = fecha.slice(0, 7);
  buscarCategoria.value = "";

  tipoInput.value = "gasto";
  categoriaInput.value = "";
  importeInput.value = "";
  fechaInput.value = fecha;

  renderTabla();
  scrollToRowById(newId);
  showToast("Movimiento añadido", { type: "success", duration: 2000 });
  refreshCategorySuggestions();
  checkRecurrentsReminder();

  // Onboarding: marcar "primer gasto"
  markOnboardStep('primerGasto');
});

// --- Helpers FAB / Quick Add ---
function isMobileLike(){
  return (window.matchMedia?.('(max-width: 768px)').matches) || ('ontouchstart' in window);
}

function injectFAB(){
  if (document.getElementById('fabAdd')) return;
  const btn = document.createElement('button');
  btn.id = 'fabAdd';
  btn.className = 'fab-add';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Añadir movimiento (N)');
  btn.title = 'Añadir movimiento (N)';
  btn.textContent = '+';
  document.body.appendChild(btn);

  document.documentElement.style.setProperty('--toastBottom', 'calc(16px + 56px + 12px)');

  btn.addEventListener('click', () => {
    if (isMobileLike()) openQuickAddSheet();
    else {
      // Desktop: ir al formulario original y enfocar
      document.querySelectorAll('main section').forEach(s => s.classList.add('oculto'));
      document.getElementById('seccionFormulario')?.classList.remove('oculto');
      (document.querySelector('main') || document.body).scrollIntoView({ behavior:'smooth', block:'start' });
      (categoriaInput || tipoInput || importeInput || fechaInput)?.focus?.();
    }
  });
}

function injectQuickAddSheet(){
  if (document.getElementById('qaSheet')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'qaBackdrop';
  backdrop.className = 'qa-backdrop';

  const sheet = document.createElement('div');
  sheet.id = 'qaSheet';
  sheet.className = 'qa-sheet';
  sheet.setAttribute('role','dialog');
  sheet.setAttribute('aria-modal','true');
  sheet.setAttribute('aria-labelledby','qaTitle');

  sheet.innerHTML = `
    <div class="qa-title" id="qaTitle">Añadir rápido</div>
    <form id="qaForm">
      <div class="qa-row">
        <input id="qaCategoria" list="categoriasSugeridas" type="text" placeholder="Categoría" autocomplete="off" required>
      </div>
      <div class="qa-row">
        <input id="qaImporte" type="number" inputmode="decimal" step="0.01" min="0.01" placeholder="Importe" required>
        <select id="qaTipo" style="flex:0 0 140px;">
          <option value="gasto">Gasto</option>
          <option value="beneficio">Ingreso</option>
        </select>
      </div>
      <div class="qa-actions">
        <button type="button" class="btn" id="qaCancel">Cancelar (Esc)</button>
        <button type="submit" class="btn btn-primary">Añadir</button>
      </div>
    </form>
  `;

  document.body.append(backdrop, sheet);

  const formQA = sheet.querySelector('#qaForm');
  const inpCat = sheet.querySelector('#qaCategoria');
  const inpImp = sheet.querySelector('#qaImporte');
  const inpTipo = sheet.querySelector('#qaTipo');

  function closeQA(){
    backdrop.classList.remove('show');
    sheet.classList.remove('show');
    document.body.style.overflow = '';
    // Devolver foco al FAB
    document.getElementById('fabAdd')?.focus?.();
  }

  function openQA(){
    // Prefija valores
    inpCat.value = '';
    inpImp.value = '';
    inpTipo.value = 'gasto';

    backdrop.classList.add('show');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => inpCat.focus(), 10);
  }

  // Escuchar UI
  backdrop.addEventListener('click', closeQA);
  sheet.querySelector('#qaCancel').addEventListener('click', closeQA);

  document.addEventListener('keydown', (e) => {
    if (!sheet.classList.contains('show')) return;
    if (e.key === 'Escape'){ e.preventDefault(); closeQA(); }
  });

  formQA.addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = String(inpCat.value || '').replace(/\s+/g,' ').trim();
    const imp = parseFloat(inpImp.value);
    const tipoSel = inpTipo.value === 'beneficio' ? 'beneficio' : 'gasto';

    if (!cat){ showToast('La categoría no puede estar vacía.', { type:'error' }); return; }
    if (!isFinite(imp) || imp <= 0){ showToast('Importe inválido.', { type:'error' }); return; }

    // Focus trap: recorrer solo por los controles del sheet con Tab/Shift+Tab
(() => {
  const focusablesSel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const trap = (e) => {
    if (!sheet.classList.contains('show')) return;
    if (e.key !== 'Tab') return;

    const nodes = [...sheet.querySelectorAll(focusablesSel)]
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!nodes.length) return;

    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  sheet.addEventListener('keydown', trap);
})();

    // Volcamos al formulario "grande" y reutilizamos tu flujo
    tipoInput.value = tipoSel;
    categoriaInput.value = cat;
    importeInput.value = imp.toString();

    // fecha: hoy (usa helpers existentes)
    const d = new Date();
    fechaInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    // Reset recurrente para este "quick"
    if (recurrenteChk){ recurrenteChk.checked = false; if (recurrenteFreq) recurrenteFreq.disabled = true; }

    closeQA();
    form.requestSubmit(); // dispara tu submit con validaciones, toasts, presupuestos, etc.
  });

  // Exponer funciones
  window.openQuickAddSheet = openQA;
  window.closeQuickAddSheet = closeQA;
}

function openQuickAddSheet(){
  injectQuickAddSheet();
  window.openQuickAddSheet?.();
}

// Atajo de teclado: N = nuevo (si no estás escribiendo en un input)
document.addEventListener('keydown', (e) => {
  const tag = (e.target?.tagName || '').toLowerCase();
  const isTyping = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;
  if (isTyping) return;

  if (e.key.toLowerCase() === 'n'){
    e.preventDefault();
    const fab = document.getElementById('fabAdd');
    if (isMobileLike()) openQuickAddSheet();
    else fab?.click();
  }
});

// Montaje inicial
injectFAB();

// Generador de IDs únicos
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,9);
}

// -------------------- Presupuesto --------------------
presupuestoInput.addEventListener("change", () => {
  presupuesto = parseFloat(presupuestoInput.value) || 0;
  localStorage.setItem("presupuesto", presupuesto);
  renderTabla();
  // Onboarding: marcar "presupuesto"
  if (presupuesto > 0) markOnboardStep('presupuesto');
});

// -------------------- Filtros --------------------
buscarCategoria.addEventListener("input", renderTabla);
filtrarMes.addEventListener("input", () => {
  _lastCatPct.clear();
  _lastCatStatus.clear();
  renderTabla();
  setTituloGraficoDiario();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  checkRecurrentsReminder();
});

// Abre el selector nativo de fecha/mes al primer toque (móvil)
function enableOneTapPicker(input) {
  if (!input) return;
  const open = () => {
    if (typeof input.showPicker === "function") {
      try { input.showPicker(); } catch {}
    }
  };
  input.addEventListener("pointerdown", open);
  input.addEventListener("focus", open, { once: true });
}
enableOneTapPicker(fechaInput);
enableOneTapPicker(filtrarMes);

// -------------------- Export/Import --------------------
function combinarGastos() {
  let todosGastos = [...gastos];
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("gastos_")) {
      todosGastos = todosGastos.concat(JSON.parse(localStorage.getItem(key)) || []);
    }
  });
  return todosGastos;
}

exportCSVBtn.addEventListener("click", () => {
  let csv = "Tipo,Categoría,Importe,Fecha\n";
  combinarGastos().forEach(g => { csv += `${g.tipo},${g.categoria},${g.importe},${g.fecha}\n`; });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gastos.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast("CSV exportado", { type: "info", duration: 1600 });
});

exportJSONBtn.addEventListener("click", () => {
  const payload = {
    version: 2,
    movimientos: combinarGastos(),
    recurrents,
    recurrentsApplied: [...recurrentsApplied],
    catBudgets
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "datos_finanzas.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast("JSON exportado (completo)", { type: "info", duration: 1600 });
});

importJSONInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const datos = JSON.parse(reader.result);

      // --- Import movimientos (formato antiguo: array)
      const importMovs = Array.isArray(datos) ? datos : (Array.isArray(datos.movimientos) ? datos.movimientos : []);
      const existentes = combinarGastos();
      const idsExistentes = new Set(existentes.map(g => g.id).filter(Boolean));
      const firmasExistentes = new Set(
        existentes.map(g => {
          const tipo = g?.tipo === "beneficio" ? "beneficio" : "gasto";
          const categoria = String(g?.categoria || "").replace(/\s+/g, " ").trim().toLowerCase();
          const importe = Number(g?.importe) || 0;
          const fecha = String(g?.fecha || "").slice(0,10);
          return `${tipo}|${categoria}|${importe}|${fecha}`;
        })
      );

      let insertados = 0;
      for (const raw of importMovs) {
        if (!raw || typeof raw !== "object") continue;

        const tipo = raw.tipo === "beneficio" ? "beneficio" : "gasto";
        const categoria = String((raw.categoria || "").replace(/\s+/g, " ").trim())
                          .replace(/[&<>"']/g, "");
        const importe = Number(raw.importe);
        const fecha = String(raw.fecha || "").slice(0,10);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) continue;
        if (!isFinite(importe) || importe <= 0) continue;
        if (!categoria) continue;

        let id = (typeof raw.id === "string" && raw.id.trim()) ? raw.id : null;
        const firma = `${tipo}|${categoria.toLowerCase()}|${importe}|${fecha}`;

        if (id && idsExistentes.has(id)) continue;
        if (!id && firmasExistentes.has(firma)) continue;

        if (!id) id = generarId();

        const item = { id, tipo, categoria, importe, fecha };
        const m = fecha.slice(0,7);

        if (m === mesActual) {
          gastos.push(item);
        } else {
          const key = `gastos_${m}`;
          const arr = JSON.parse(localStorage.getItem(key)) || [];
          arr.push(item);
          localStorage.setItem(key, JSON.stringify(arr));
        }

        idsExistentes.add(id);
        firmasExistentes.add(firma);
        insertados++;
      }

      // --- Import extras del formato nuevo (objeto)
      if (!Array.isArray(datos)){
        // recurrents
        if (Array.isArray(datos.recurrents)){
          const byRid = new Map(recurrents.map(r => [r.rid, r]));
          datos.recurrents.forEach(r => {
            if (!r || !r.rid) return;
            byRid.set(r.rid, {
              rid: r.rid,
              tipo: (r.tipo === 'beneficio' ? 'beneficio' : 'gasto'),
              categoria: String(r.categoria || "").replace(/[&<>"']/g,"").trim(),
              importe: Number(r.importe) || 0,
              startDate: String(r.startDate || "").slice(0,10),
              freq: (['semanal','mensual','anual'].includes(r.freq) ? r.freq : 'mensual')
            });
          });
          recurrents = [...byRid.values()];
          saveRecurrents();
        }
        // recurrentsApplied
        if (Array.isArray(datos.recurrentsApplied)){
          datos.recurrentsApplied.forEach(k => { if (k && typeof k === 'string') recurrentsApplied.add(k); });
          saveRecurrentsApplied();
        }
        // catBudgets
        if (datos.catBudgets && typeof datos.catBudgets === 'object'){
          catBudgets = {};
          Object.entries(datos.catBudgets).forEach(([k,v]) => {
            const key = capitalizeFirst(String(k || "").trim());
            const val = Number(v) || 0;
            if (key && val > 0) catBudgets[key] = val;
          });
          saveCatBudgets();
        }
      }

      localStorage.setItem("gastos", JSON.stringify(gastos));
      renderTabla();
      refreshCategorySuggestions();
      renderCatBudgets();
      checkRecurrentsReminder();

      const extras = Array.isArray(datos) ? '' : ' + reglas + presupuestos';
      showToast(`Importación OK (${insertados} movimientos${extras})`, { type: "success" });
    } catch {
      showToast("Archivo inválido", { type: "error" });
    }
  };
  reader.readAsText(file);
});

// -------------------- Dark Mode --------------------
toggleDarkBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("darkMode", body.classList.contains("dark"));
  darkIcon.textContent = body.classList.contains("dark") ? "☀️" : "🌙";

  // Pie
  if (chartPorcentaje) {
    const isDark = body.classList.contains('dark');
    const borde  = isDark ? '#fff' : '#000';
    const text   = isDark ? '#fff' : '#000';

    chartPorcentaje.options.plugins.legend.labels.color = text;
    chartPorcentaje.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(0,0,0,0.85)' : '#fff';
    chartPorcentaje.options.plugins.tooltip.titleColor = text;
    chartPorcentaje.options.plugins.tooltip.bodyColor  = text;
    chartPorcentaje.data.datasets[0].borderColor = borde;
    chartPorcentaje.data.datasets[0].hoverBorderColor = borde;

    chartPorcentaje.update();
  }

  // Barras diario
  if (chartDiario) {
    const color = body.classList.contains('dark') ? '#fff' : '#000';
    chartDiario.options.plugins.legend.labels.color = color;
    if (chartDiario.options.scales?.x?.ticks) chartDiario.options.scales.x.ticks.color = color;
    if (chartDiario.options.scales?.y?.ticks) chartDiario.options.scales.y.ticks.color = color;
    chartDiario.update();
  }

  // Histórico
  if (chartHistorico) {
    const color = body.classList.contains('dark') ? '#fff' : '#000';
    chartHistorico.options.plugins.legend.labels.color = color;
    if (chartHistorico.options.scales?.x?.ticks) chartHistorico.options.scales.x.ticks.color = color;
    if (chartHistorico.options.scales?.y?.ticks) chartHistorico.options.scales.y.ticks.color = color;
    chartHistorico.update();
  }
});

// -------------------- Menú hamburguesa (sin salto al cerrar) --------------------
let isMenuOpen = false;

function positionMenuPanel() {
  if (!isMenuOpen) return;
  const rect = menuToggle.getBoundingClientRect();
  const margin = 10; // separación visual bajo el botón
  document.documentElement.style.setProperty(
    '--menuTop',
    `${Math.round(window.scrollY + rect.bottom + margin)}px`
  );
}

function openMenu() {
  isMenuOpen = true;
  menu.classList.add("menu-abierto");
  menuToggle.classList.add("abierto");
  menuToggle.setAttribute("aria-expanded","true");
  document.body.classList.add('menu-open');
  menuOverlay.classList.add('show');
  positionMenuPanel();
  // Fijar arriba (usa el valor por defecto de CSS: 60px)
  document.documentElement.style.removeProperty('--menuTop');

  requestAnimationFrame(() => {
    const firstItem = menu.querySelector("li");
    if (firstItem) firstItem.focus();
  });
}

function closeMenu() {
  if (!isMenuOpen) return;
  isMenuOpen = false;

  const clearTopVar = () => document.documentElement.style.removeProperty('--menuTop');
  const onEnd = (e) => {
    if (e.propertyName !== 'right') return;
    menu.removeEventListener('transitionend', onEnd);
    if (!isMenuOpen) clearTopVar();
  };
  menu.addEventListener('transitionend', onEnd);
  setTimeout(() => {
    menu.removeEventListener('transitionend', onEnd);
    if (!isMenuOpen) clearTopVar();
  }, 450);

  menu.classList.remove("menu-abierto");
  menuToggle.classList.remove("abierto");
  menuToggle.setAttribute("aria-expanded","false");
  document.body.classList.remove('menu-open');
  menuOverlay.classList.remove('show');
}

menuToggle.addEventListener("click", () => {
  isMenuOpen ? closeMenu() : openMenu();
});

// Accesibilidad: cerrar con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) closeMenu();
});

// Cerrar tocando fuera
menuOverlay.addEventListener('click', closeMenu);

// Items del menú
menu.querySelectorAll("li").forEach(item => {
  item.setAttribute('tabindex','0');
  item.setAttribute('role','button');

  item.addEventListener("click", () => {
    const seccionId = item.dataset.section;

    document.querySelectorAll("main section").forEach(s => s.classList.add("oculto"));
    document.getElementById(seccionId).classList.remove("oculto");

    closeMenu();

    (document.querySelector('main') || document.body)
      .scrollIntoView({ behavior: 'smooth', block: 'start' });

    const mesSel = filtrarMes.value || mesActual;

    if (seccionId === "seccionGraficoPorcentaje") {
      if (chartPorcentaje) chartPorcentaje.destroy();
      requestAnimationFrame(() => { renderGraficoPorcentaje(mesSel); });
      markOnboardStep('graficos');
    }
    if (seccionId === "seccionGraficoDiario") {
      if (chartDiario) chartDiario.destroy();
      requestAnimationFrame(() => {
        setTituloGraficoDiario(mesSel);
        renderGraficoDiario(mesSel);
      });
      markOnboardStep('graficos');
    }
    if (seccionId === "seccionHistorico") {
      if (chartHistorico) chartHistorico.destroy();
      requestAnimationFrame(() => { renderGraficoHistorico(); });
    }
  });

  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
  });
});

// -------------------- Onboarding (guía rápida) --------------------
const ONBOARD_KEY = 'onboard_v1';
const ONBOARD_SESSION_KEY = 'onboard_dismissed_session_v1'; // 👈 NUEVO
const onboardingCard = document.getElementById('onboardingCard');
const onboardSkipBtn = document.getElementById('onboardSkip');
const onboardCloseBtn = document.getElementById('onboardClose');

function loadOnboard(){
  try {
    return JSON.parse(localStorage.getItem(ONBOARD_KEY)) || {
      skip:false,
      steps:{ presupuesto:false, primerGasto:false, graficos:false }
    };
  } catch { 
    return { skip:false, steps:{ presupuesto:false, primerGasto:false, graficos:false } };
  }
}
function saveOnboard(state){
  localStorage.setItem(ONBOARD_KEY, JSON.stringify(state));
}
function updateOnboardUI(){
  if (!onboardingCard) return;
  const state = loadOnboard();

  // Marcar checks visualmente
  onboardingCard.querySelectorAll('.onboard-item').forEach(li => {
    const key = li.getAttribute('data-key');
    const done = state.steps[key];
    li.classList.toggle('done', !!done);
    const check = li.querySelector('.check');
    if (check) check.textContent = done ? '✓' : '○';
  });

  const sessionDismissed = sessionStorage.getItem(ONBOARD_SESSION_KEY) === '1';
  const allDone = Object.values(state.steps).every(Boolean);
  const shouldHide = state.skip || sessionDismissed || allDone;

  onboardingCard.hidden = shouldHide;
  onboardingCard.classList.toggle('show', !shouldHide);
}

function markOnboardStep(key){
  const state = loadOnboard();
  if (!state.steps[key]) {
    state.steps[key] = true;
    saveOnboard(state);
    updateOnboardUI();
  }
}
function initOnboarding(){
  if (!onboardingCard) return;
  updateOnboardUI();

  // SALTAR: no volver a mostrar jamás (persiste)
  if (onboardSkipBtn) onboardSkipBtn.addEventListener('click', () => {
    const s = loadOnboard();
    s.skip = true;
    saveOnboard(s);
    sessionStorage.removeItem(ONBOARD_SESSION_KEY);
    updateOnboardUI();
  });

  // ENTENDIDO: ocultar solo en esta sesión (volverá a salir si no completas pasos)
  if (onboardCloseBtn) onboardCloseBtn.addEventListener('click', () => {
    sessionStorage.setItem(ONBOARD_SESSION_KEY, '1');
    updateOnboardUI();
  });
}
initOnboarding();

// -------------------- Inicial --------------------
populateSelectHistorico();
if (selectMesHistorico){
  selectMesHistorico.addEventListener('change', renderGraficoHistorico);
}

setTituloGraficoDiario();
renderTabla();
setupSortingUI();
updateSortUI();
refreshCategorySuggestions();
renderCatBudgets();
checkRecurrentsReminder();