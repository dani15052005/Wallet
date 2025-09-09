// -------------------- Configuración Inicial --------------------
const body = document.body;

// ------------ Estilos extra (toasts + highlight de fila) ------------
(function injectEnhancementStyles() {
  const css = `
  .toast-container{position:fixed;bottom:1rem;right:1rem;display:flex;flex-direction:column;gap:.5rem;z-index:10000}
  .toast{min-width:240px;max-width:340px;padding:.75rem 1rem;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;align-items:center;gap:.75rem;opacity:0;transform:translateY(8px);transition:opacity .25s ease,transform .25s ease}
  .toast.show{opacity:1;transform:translateY(0)}
  .toast-info{background:#4caf50;color:#fff}
  .toast-success{background:#2ecc71;color:#fff}
  .toast-error{background:#e74c3c;color:#fff}
  .toast__action{margin-left:auto;background:rgba(255,255,255,.2);border:none;border-radius:8px;padding:.35rem .6rem;color:inherit;cursor:pointer}
  .toast__action:hover{background:rgba(255,255,255,.3)}
  .flash-row{animation:flashRow 1.6s ease}
  @keyframes flashRow{0%{box-shadow:inset 0 0 0 3px rgba(76,175,80,.9)}60%{box-shadow:inset 0 0 0 3px rgba(76,175,80,0)}100%{box-shadow:none}}
  `;
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
    document.body.appendChild(__toastContainer);
  }
}
function showToast(message, { type='info', duration=3000, actionText, onAction } = {}){
  ensureToastContainer();
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
    setTimeout(() => toast.remove(), 250);
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
  if (navigator.onLine) {
    banner.classList.remove('show');
  } else {
    banner.textContent = 'Sin conexión: algunos recursos se han actualizado';
    banner.style.background = '#ffcc00';
    banner.classList.add('show');
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// SW actualización
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
const exportCSVBtn = document.getElementById("exportCSV");
const exportJSONBtn = document.getElementById("exportJSON");
const importJSONInput = document.getElementById("importJSON");
const toggleDarkBtn = document.getElementById("toggleDark");
const darkIcon = document.getElementById("darkIcon");

// Menú
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const secciones = document.querySelectorAll("main section");

const selectMesHistorico = document.getElementById("selectMesHistorico");
const balanceHistorico = document.getElementById("balanceHistorico");
const graficoHistoricoCanvas = document.getElementById("graficoHistorico");
const tituloGraficoDiario = document.getElementById("tituloGraficoDiario");

// Overlay para desenfoque al abrir el menú
const menuOverlay = document.createElement('div');
menuOverlay.id = 'menuOverlay';
document.body.appendChild(menuOverlay);

// -------------------- (Revertido) Nada de forzar estilo del filtro por JS --------------------
// (Se eliminó el bloque HOTFIX para dejar el estilo del input de categoría como estaba en el CSS)

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

// Cerrar al pulsar fuera (en el overlay)
menuOverlay.addEventListener('click', () => {
  closeMenu();
});

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

  chartDiario = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Gastos", data: datosGastos, backgroundColor: "#e74c3c" },
        { label: "Beneficios", data: datosBeneficios, backgroundColor: "#2ecc71" }
      ]
    },
    options: { ...baseBarOpts, plugins: { legend: { position: "top" } } }
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
      options: baseBarOpts
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
      options: baseBarOpts
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
  const filtroMes = filtrarMes.value || mesActual;

  const gastosAMostrar = filtroMes === mesActual
    ? gastos
    : (JSON.parse(localStorage.getItem(`gastos_${filtroMes}`)) || []);

  const gastosFiltrados = gastosAMostrar.filter(g => {
    const catNorm = normalizeStr(g?.categoria || "");
    return !filtroTerm || catNorm.includes(filtroTerm);
  });

  gastosFiltrados.forEach((gasto) => {
    const fila = document.createElement("tr");
    fila.classList.add("fade-in");
    fila.dataset.id = gasto.id;

    if (gasto.tipo === "gasto") fila.classList.add("gasto");
    else fila.classList.add("beneficio");

    const tipoLabel = gasto.tipo === "gasto" ? "Gasto" : "Beneficio";
    // MOSTRAR categoría como estaba (respeta tu lógica previa con capitalización)
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
        ${filtroMes === mesActual ? `
          <button class="editar" data-id="${gasto.id}" aria-label="Editar" title="Editar">✏️</button>
          <button class="eliminar" data-id="${gasto.id}" aria-label="Eliminar" title="Eliminar">🗑️</button>
        ` : ""}
      </td>
    `;
    tabla.appendChild(fila);

    if (gasto.tipo === "gasto") { total -= gasto.importe; gastosSum += gasto.importe; }
    else { total += gasto.importe; }
  });

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
}

// --- Scroll helper: desplaza hasta la fila por ID y la resalta ---
function scrollToRowById(id){
  if (!id) return;
  const row = tabla.querySelector(`tr[data-id="${CSS.escape(id)}"]`);
  if (!row) return;
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  row.classList.add('flash-row');
  setTimeout(() => row.classList.remove('flash-row'), 1600);
}

// -------------------- CRUD (por id) --------------------
async function eliminarGastoPorId(id) {
  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const ok = await appConfirm({
    title: "Eliminar movimiento",
    message: "Esta acción no se puede deshacer. ¿Quieres eliminar este movimiento?",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    variant: "danger"
  });
  if (!ok) return;

  const row = tabla.querySelector(`button.eliminar[data-id="${id}"]`)?.closest('tr');
  if (row) {
    row.classList.add('fade-out');
    row.addEventListener('animationend', () => {
      gastos.splice(idx, 1);
      renderTabla();
      showToast('Movimiento eliminado', { type: 'success', duration: 2200 });
    }, { once: true });
  } else {
    gastos.splice(idx, 1);
    renderTabla();
    showToast('Movimiento eliminado', { type: 'success', duration: 2200 });
  }
}

async function editarGastoPorId(id) {
  const filtroMesActual = filtrarMes.value || mesActual;
  if (filtroMesActual !== mesActual) return;

  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const ok = await appConfirm({
    title: "Editar movimiento",
    message: "Se cargarán los datos en el formulario para que puedas modificarlos. ¿Continuar?",
    confirmText: "Editar",
    cancelText: "Cancelar",
    variant: "primary"
  });
  if (!ok) return;

  const gasto = gastos[idx];
  tipoInput.value = gasto.tipo;
  categoriaInput.value = gasto.categoria;
  importeInput.value = gasto.importe;
  fechaInput.value = gasto.fecha || new Date().toISOString().slice(0,10);

  gastos.splice(idx, 1);
  renderTabla();

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Datos cargados para editar', { type: 'info', duration: 2200 });
}

// Delegación de eventos para botones editar/eliminar
tabla.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('editar')) editarGastoPorId(id);
  else if (btn.classList.contains('eliminar')) eliminarGastoPorId(id);
});

// -------------------- Formulario --------------------
form.addEventListener("submit", e => {
  e.preventDefault();

  const tipo = tipoInput.value;

  const categoriaRaw = (categoriaInput.value || "").replace(/\s+/g, " ").trim();
  const categoria = categoriaRaw.replace(/[&<>"']/g, "");

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

  const newId = generarId();
  gastos.push({ id: newId, tipo, categoria, importe, fecha });

  filtrarMes.value = fecha.slice(0, 7);
  buscarCategoria.value = "";

  tipoInput.value = "gasto";
  categoriaInput.value = "";
  importeInput.value = "";
  fechaInput.value = fecha;

  renderTabla();

  scrollToRowById(newId);
  showToast("Movimiento añadido", { type: "success", duration: 2000 });
});

// Generador de IDs únicos
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,9);
}

// -------------------- Presupuesto --------------------
presupuestoInput.addEventListener("change", () => {
  presupuesto = parseFloat(presupuestoInput.value) || 0;
  localStorage.setItem("presupuesto", presupuesto);
  renderTabla();
});

// -------------------- Filtros --------------------
buscarCategoria.addEventListener("input", renderTabla);
filtrarMes.addEventListener("input", () => {
  renderTabla();
  setTituloGraficoDiario();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const blob = new Blob([JSON.stringify(combinarGastos(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gastos.json";
  a.click();
  showToast("JSON exportado", { type: "info", duration: 1600 });
});

importJSONInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const datos = JSON.parse(reader.result);
      if (!Array.isArray(datos)) throw new Error("Formato no válido");

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

      for (const raw of datos) {
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

      localStorage.setItem("gastos", JSON.stringify(gastos));
      renderTabla();
      showToast(`Se importaron ${insertados} registros nuevos.`, { type: "success" });
    } catch (err) {
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
});

// -------------------- Menú hamburguesa (sin salto al cerrar) --------------------
let isMenuOpen = false;

function positionMenuPanel() {
  if (!isMenuOpen) return;
  const rect = menuToggle.getBoundingClientRect();
  const margin = 10; // separación visual bajo el botón
  // Fijamos un top global que usan ambos estados del menú
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

  requestAnimationFrame(() => {
    const firstItem = menu.querySelector("li");
    if (firstItem) firstItem.focus();
  });
}

function closeMenu() {
  if (!isMenuOpen) return;
  isMenuOpen = false;

  // Limpia la variable de top SOLO cuando termine la transición de 'right'
  const clearTopVar = () => document.documentElement.style.removeProperty('--menuTop');
  const onEnd = (e) => {
    if (e.propertyName !== 'right') return;
    menu.removeEventListener('transitionend', onEnd);
    if (!isMenuOpen) clearTopVar();
  };
  menu.addEventListener('transitionend', onEnd);
  // Fallback por si el navegador no dispara transitionend
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

window.addEventListener('resize', positionMenuPanel);
window.addEventListener('scroll', positionMenuPanel);

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

    secciones.forEach(s => s.classList.add("oculto"));
    document.getElementById(seccionId).classList.remove("oculto");

    closeMenu();

    document.querySelector('main').scrollIntoView({ behavior: 'smooth', block: 'start' });

    const mesSel = filtrarMes.value || mesActual;

    if (seccionId === "seccionGraficoPorcentaje") {
      if (chartPorcentaje) chartPorcentaje.destroy();
      requestAnimationFrame(() => { renderGraficoPorcentaje(mesSel); });
    }
    if (seccionId === "seccionGraficoDiario") {
      if (chartDiario) chartDiario.destroy();
      requestAnimationFrame(() => {
        setTituloGraficoDiario(mesSel);
        renderGraficoDiario(mesSel);
      });
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

// -------------------- Inicial --------------------
populateSelectHistorico();
if (selectMesHistorico){
  selectMesHistorico.addEventListener('change', renderGraficoHistorico);
}
setTituloGraficoDiario();
renderTabla();