// -------------------- Configuración Inicial --------------------
const body = document.body;

// -------------------- Banner offline --------------------
const banner = document.createElement('div');
banner.id = 'network-banner';
banner.className = 'banner-actualizacion'; // reutiliza tu CSS
banner.style.background = '#ffcc00'; // color amarillo para offline
banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
document.body.appendChild(banner);

// Mostrar u ocultar con la clase 'show'
function updateNetworkStatus() {
  if (navigator.onLine) {
    banner.classList.remove('show');
  } else {
    banner.classList.add('show');
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();


function updateNetworkStatus() {
  if (navigator.onLine) {
    banner.style.display = 'none';
  } else {
    banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
    banner.style.background = '#ffcc00';
    banner.style.display = 'block';
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// SW actualización
navigator.serviceWorker.addEventListener('message', (event) => {
  if (!event.data) return;

  function showBanner(message, btnText, onClick) {
  if (document.getElementById('reloadApp')) return;
  const refreshBanner = document.createElement('div');
  refreshBanner.className = 'banner-actualizacion';
  refreshBanner.innerHTML = `${message} <button id="reloadApp">${btnText}</button>`;
  document.body.appendChild(refreshBanner);

  // Activar animación deslizante
  setTimeout(() => refreshBanner.classList.add('show'), 50);

  document.getElementById('reloadApp').addEventListener('click', onClick);
}

  if (event.data.type === 'SW_UPDATED') {
    showBanner(
      'Nueva versión disponible.',
      'Recargar',
      () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      }
    );
  }

  if (event.data.type === 'SW_UPDATED_PARTIAL') {
    showBanner(
      'Algunos recursos se han actualizado.',
      'Actualizar recursos',
      async () => {
        try {
          await fetch(event.data.url, { cache: "reload" });
        } catch {}
        window.location.reload();
      }
    );
  }
});

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

// -------------------- Gestión Mensual --------------------
const hoy = new Date();
const mesActual = hoy.toISOString().slice(0, 7); // "YYYY-MM"

let mesGuardado = localStorage.getItem("mesActual");

// 1) Inicializar mesActual si no existe (primer uso)
if (!mesGuardado) {
  localStorage.setItem("mesActual", mesActual);
  mesGuardado = mesActual;
}

// 2) Si cambió el mes, archivar el mes anterior y arrancar limpio
if (mesActual !== mesGuardado) {
  // Guardar gastos del mes anterior solo si hay datos
  const prev = JSON.parse(localStorage.getItem("gastos")) || [];
  if (prev.length > 0) {
    localStorage.setItem(`gastos_${mesGuardado}`, JSON.stringify(prev));
  }

  // Limpiar gastos para el mes actual
  gastos = [];
  localStorage.setItem("gastos", JSON.stringify(gastos));
  localStorage.setItem("mesActual", mesActual);
  mesGuardado = mesActual;
}

// 3) Reparación defensiva: si por un fallo previo hay gastos de otros meses mezclados,
//    los mandamos a su mes correspondiente y dejamos en "gastos" solo el mes actual.
(() => {
  if (!Array.isArray(gastos) || gastos.length === 0) return;

  const actuales = [];
  const porMes = {};

  for (const g of gastos) {
    if (!g || !g.fecha || typeof g.fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(g.fecha)) {
      // Si no hay fecha válida, lo dejamos como actual para no perder datos
      actuales.push(g);
      continue;
    }
    const m = g.fecha.slice(0, 7);
    if (m === mesActual) {
      actuales.push(g);
    } else {
      (porMes[m] ||= []).push(g);
    }
  }

  // Volcar cada grupo a su clave "gastos_YYYY-MM"
  for (const [m, arr] of Object.entries(porMes)) {
    const ya = JSON.parse(localStorage.getItem(`gastos_${m}`)) || [];
    localStorage.setItem(`gastos_${m}`, JSON.stringify(ya.concat(arr)));
  }

  // Si hubo movimientos reubicados, persistimos la corrección
  if (actuales.length !== gastos.length) {
    gastos = actuales;
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }
})();

// -------------------- Colores --------------------
const coloresCategorias = {
  "Transporte": "#3498db",
  "Comida": "#e67e22",
  "Ocio": "#9b59b6",
  "Casa": "#2ecc71",
  "Otros": "#95a5a6",
  "Beneficio": "#2ecc71"
};

const paletaColores = [
  "#1abc9c", "#f39c12", "#8e44ad", "#2c3e50", "#d35400",
  "#27ae60", "#c0392b", "#7f8c8d", "#16a085", "#2980b9"
];

function getColor(categoria) {
  if (coloresCategorias[categoria]) return coloresCategorias[categoria];
  const index = Math.abs(hashCode(categoria)) % paletaColores.length;
  return paletaColores[index];
}

function hashCode(str) {
  return str.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
}

// Generador de IDs únicos (string)
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,9);
}

// -------------------- Render Tabla --------------------
function renderTabla() {
  tabla.innerHTML = "";
  let total = 0;

  const filtroCat = buscarCategoria.value.trim().toLowerCase();
  const filtroMes = filtrarMes.value || mesActual;

  let gastosAMostrar = filtroMes === mesActual ? gastos : JSON.parse(localStorage.getItem(`gastos_${filtroMes}`)) || [];
  const gastosFiltrados = gastosAMostrar.filter(g => !filtroCat || g.categoria.toLowerCase().includes(filtroCat));

  gastosFiltrados.forEach((gasto) => {
    const fila = document.createElement("tr");
fila.classList.add("fade-in");

// Asignar clase según tipo
if (gasto.tipo === "gasto") fila.classList.add("gasto");
else fila.classList.add("beneficio");

fila.innerHTML = `
  <td>${gasto.tipo}</td>
  <td class="categoria" style="border-color:${getColor(gasto.categoria)}">${gasto.categoria}</td>
  <td style="color: ${gasto.tipo === "gasto" ? '#e74c3c' : '#2ecc71'}">
    ${gasto.tipo === "gasto" ? "-" : ""}${gasto.importe.toFixed(2)} €
  </td>
  <td>${gasto.fecha}</td>
  <td>
    ${filtroMes === mesActual ? `<button class="editar" data-id="${gasto.id}">✏️</button>
    <button class="eliminar" data-id="${gasto.id}">🗑️</button>` : ""}
  </td>
`;
tabla.appendChild(fila);
    total += gasto.tipo === "gasto" ? -gasto.importe : gasto.importe;
  });

  totalEl.textContent = `Balance: ${total.toFixed(2)} €`;
  if (total > 100) totalEl.style.color = "#2ecc71";
  else if (total >= 50) totalEl.style.color = "#f1c40f";
  else if (total > 0) totalEl.style.color = "#e67e22";
  else totalEl.style.color = "#e74c3c";

  if (presupuesto && total < -presupuesto && filtroMes === mesActual) {
  alertaPresupuesto.textContent = "⚠️ Has superado tu presupuesto mensual";
  alertaPresupuesto.classList.add("show");
} else {
  alertaPresupuesto.textContent = "";
  alertaPresupuesto.classList.remove("show");
}

  if (filtroMes === mesActual) localStorage.setItem("gastos", JSON.stringify(gastos));

  renderGraficoPorcentaje(filtroMes);
  renderGraficoDiario(filtroMes);
}

// -------------------- CRUD (por id) --------------------
function eliminarGastoPorId(id) {
  if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;
  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;
  gastos.splice(idx, 1);
  renderTabla();
}

function editarGastoPorId(id) {
  if (filtrarMes.value !== mesActual) return;
  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  const gasto = gastos[idx];
  tipoInput.value = gasto.tipo;
  categoriaInput.value = gasto.categoria;
  importeInput.value = gasto.importe;
  fechaInput.value = gasto.fecha || new Date().toISOString().slice(0,10);

  gastos.splice(idx, 1);
  renderTabla();
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
  const categoria = categoriaInput.value.trim();
  const importe = parseFloat(importeInput.value);
  const fecha = fechaInput.value;

  // Validaciones detalladas
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!categoria) {
    alert("La categoría no puede estar vacía.");
    return;
  }
  if (isNaN(importe) || importe <= 0) {
    alert("El importe debe ser un número mayor que 0.");
    return;
  }
  if (!fechaRegex.test(fecha)) {
    alert("La fecha debe tener el formato válido (YYYY-MM-DD).");
    return;
  }

  // Guardar gasto
  gastos.push({ id: generarId(), tipo, categoria, importe, fecha });

  // Resetear formulario
  tipoInput.value = "gasto";
  categoriaInput.value = "";
  importeInput.value = "";
  fechaInput.value = "";

  renderTabla();
});

// -------------------- Presupuesto --------------------
presupuestoInput.addEventListener("change", () => {
  presupuesto = parseFloat(presupuestoInput.value) || 0;
  localStorage.setItem("presupuesto", presupuesto);
  renderTabla();
});

// -------------------- Filtros --------------------
buscarCategoria.addEventListener("input", renderTabla);
filtrarMes.addEventListener("input", renderTabla);

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
});

exportJSONBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(combinarGastos(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gastos.json";
  a.click();
});

importJSONInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const datos = JSON.parse(reader.result);
      if (Array.isArray(datos)) {
        // Combinar con los gastos existentes
        const idsExistentes = new Set(gastos.map(g => g.id));
        const nuevos = datos.map(item => ({
          ...item,
          id: item.id || generarId()
        })).filter(item => !idsExistentes.has(item.id));

        gastos = gastos.concat(nuevos);
        localStorage.setItem("gastos", JSON.stringify(gastos));
        renderTabla();
        alert(`✅ Se importaron ${nuevos.length} registros nuevos.`);
      }
    } catch {
      alert("Archivo inválido");
    }
  };
  reader.readAsText(file);
});

// -------------------- Dark Mode --------------------
toggleDarkBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("darkMode", body.classList.contains("dark"));
  darkIcon.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
});

// -------------------- Gráficos --------------------
let chartPorcentaje, chartDiario;

function renderGraficoPorcentaje(mesFiltrado) {
  const gastosAMostrar = mesFiltrado === mesActual ? gastos : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];
  const categorias = {};
  gastosAMostrar.filter(g => g.tipo === "gasto").forEach(g => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.importe;
  });

  const canvas = document.getElementById("graficoGastos");
  canvas.style.maxHeight = "400px"; 
  const ctx = canvas.getContext("2d");

  // Si no hay datos, limpiar gráfico y mostrar mensaje
  if (Object.keys(categorias).length === 0) {
    if (chartPorcentaje) chartPorcentaje.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText("No hay gastos este mes", canvas.width / 2, canvas.height / 2);
    return;
  }

  if (chartPorcentaje) chartPorcentaje.destroy();
  chartPorcentaje = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: Object.keys(categorias).map(getColor)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function renderGraficoDiario(mesFiltrado) {
  const [anio, mesNum] = (mesFiltrado || mesActual).split("-").map(Number);
  const diasMes = new Date(anio, mesNum, 0).getDate();
  const labels = Array.from({length: diasMes}, (_, i) => i + 1);
  const datosGastos = Array(diasMes).fill(0);
  const datosBeneficios = Array(diasMes).fill(0);

  const gastosAMostrar = mesFiltrado === mesActual ? gastos : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];
  gastosAMostrar.forEach(g => {
    if (g.fecha.startsWith(mesFiltrado)) {
      const dia = parseInt(g.fecha.slice(-2), 10) - 1;
      if (g.tipo === "gasto") datosGastos[dia] += g.importe;
      else datosBeneficios[dia] += g.importe;
    }
  });

  const canvas = document.getElementById("graficoDiario");
  canvas.style.maxHeight = "400px";
  const ctx = canvas.getContext("2d");

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
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'top' } }
    }
  });
}

// -------------------- Menú hamburguesa --------------------
menuToggle.addEventListener("click", () => menu.classList.toggle("menu-abierto"));
menu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    const seccionId = item.dataset.section;
    secciones.forEach(s => s.classList.add("oculto"));
    document.getElementById(seccionId).classList.remove("oculto");
    menu.classList.remove("menu-abierto");
  });
});

// -------------------- Inicial --------------------
renderTabla();