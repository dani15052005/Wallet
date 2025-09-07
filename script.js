// -------------------- Configuración Inicial --------------------
const body = document.body;

// -------------------- Banner offline --------------------
const banner = document.createElement('div');
banner.id = 'network-banner';
banner.className = 'banner-actualizacion'; // reutiliza tu CSS
banner.style.background = '#ffcc00'; // color amarillo para offline
banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
document.body.appendChild(banner);

// Mostrar / ocultar según estado de red
function updateNetworkStatus() {
  if (navigator.onLine) {
    banner.classList.remove('show');
  } else {
    banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
    banner.style.background = '#ffcc00';
    banner.classList.add('show');
  }
}
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// SW actualización (protegido por disponibilidad)
if ('serviceWorker' in navigator) {
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

// Cerrar al pulsar fuera (en el overlay)
menuOverlay.addEventListener('click', () => {
  menu.classList.remove('menu-abierto');
  menuToggle.classList.remove('abierto');
  menuToggle.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
  menuOverlay.classList.remove('show');
});

// Crea las 3 barritas del icono hamburguesa si el botón no las tiene
if (menuToggle && menuToggle.children.length === 0) {
  menuToggle.innerHTML = '<div></div><div></div><div></div>';
  menuToggle.setAttribute('aria-label','Abrir menú');
  menuToggle.setAttribute('aria-controls','menu');
  menuToggle.setAttribute('aria-expanded','false');
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

// 3) Reparación defensiva
(() => {
  if (!Array.isArray(gastos) || gastos.length === 0) return;

  const actuales = [];
  const porMes = {};

  for (const g of gastos) {
    if (!g || !g.fecha || typeof g.fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(g.fecha)) {
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

  for (const [m, arr] of Object.entries(porMes)) {
    const ya = JSON.parse(localStorage.getItem(`gastos_${m}`)) || [];
    localStorage.setItem(`gastos_${m}`, JSON.stringify(ya.concat(arr)));
  }

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

function capitalizeFirst(str = "") {
  if (!str) return "";
  return str.charAt(0).toLocaleUpperCase('es-ES') + str.slice(1);
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

  // Etiquetas con mayúscula
  const tipoLabel = gasto.tipo === "gasto" ? "Gasto" : "Beneficio";
const categoriaLabel = capitalizeFirst((gasto.categoria || "").trim());

fila.innerHTML = `
  <td data-label="Tipo">${tipoLabel}</td>
  <td class="categoria" data-label="Categoría" style="border-color:${getColor(categoriaLabel)}">${categoriaLabel}</td>
  <td data-label="Importe (€)" style="color: ${gasto.tipo === "gasto" ? '#e74c3c' : '#2ecc71'}">
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
  renderGraficoHistorico();
}

// -------------------- CRUD (por id) --------------------
function eliminarGastoPorId(id) {
  if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;

  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  // Busca la fila en la tabla para animarla
  const row = tabla.querySelector(`button.eliminar[data-id="${id}"]`)?.closest('tr');

  if (row) {
    row.classList.add('fade-out'); // ya definida en tu CSS (translateX -20px + opacity)
    row.addEventListener('animationend', () => {
      gastos.splice(idx, 1);
      renderTabla();
    }, { once: true });
  } else {
    // fallback por si no encuentra la fila (por ejemplo, si ya se redibujó)
    gastos.splice(idx, 1);
    renderTabla();
  }
}

function editarGastoPorId(id) {
  // usar el mismo criterio que la tabla
  const filtroMesActual = filtrarMes.value || mesActual;
  if (filtroMesActual !== mesActual) return;

  const idx = gastos.findIndex(g => String(g.id) === String(id));
  if (idx === -1) return;

  // Confirmación antes de editar
  if (!confirm("¿Seguro que quieres editar los datos?")) return;

  const gasto = gastos[idx];
  tipoInput.value = gasto.tipo;
  categoriaInput.value = gasto.categoria;
  importeInput.value = gasto.importe;
  fechaInput.value = gasto.fecha || new Date().toISOString().slice(0,10);

  // Quitamos el registro para re-guardarlo al enviar el formulario
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

  // Re-render para que la leyenda tome el color del tema
  const m = filtrarMes.value || mesActual;
  renderGraficoPorcentaje(m);
  renderGraficoDiario(m);
  if (typeof renderGraficoHistorico === "function") renderGraficoHistorico();

  // 👇 actualizar el borde de la tarta al cambiar de tema
  if (chartPorcentaje) {
    const borde = body.classList.contains('dark') ? '#fff' : '#000';
    chartPorcentaje.data.datasets[0].borderColor = borde;
    chartPorcentaje.data.datasets[0].borderWidth = 1;
    chartPorcentaje.update();
  }
});

// -------------------- Gráficos --------------------
let chartPorcentaje, chartDiario, chartHistorico;

function renderGraficoPorcentaje(mesFiltrado) {
  // Renderiza solo si la sección está visible
  const seccion = document.getElementById("seccionGraficoPorcentaje");
  if (seccion && seccion.classList.contains("oculto")) return;

  const gastosAMostrar = mesFiltrado === mesActual
    ? gastos
    : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];

  // ✅ Agrupar categorías con primera letra en mayúscula
  const categorias = {};
  gastosAMostrar
    .filter(g => g.tipo === "gasto")
    .forEach(g => {
      const key = capitalizeFirst((g.categoria || "").trim());
      categorias[key] = (categorias[key] || 0) + g.importe;
    });

  const canvas = document.getElementById("graficoGastos");
  // Tamaño vía CSS (no usar canvas.height en responsive)
  canvas.style.height = '400px';
  canvas.style.maxHeight = '400px';
  const ctx = canvas.getContext("2d");

  // Si no hay datos, limpiar y mostrar mensaje
  if (Object.keys(categorias).length === 0) {
    if (chartPorcentaje) chartPorcentaje.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";
    ctx.fillStyle = body.classList.contains('dark') ? "#eee" : "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No hay gastos este mes", canvas.width / 2, canvas.height / 2);
    return;
  }

  if (chartPorcentaje) chartPorcentaje.destroy();

  // Colores dependientes de tema
  const bordePastel = body.classList.contains('dark') ? '#fff' : '#000';
  const legendTextColor = body.classList.contains('dark') ? '#fff' : '#222';

  const labels = Object.keys(categorias);
  const dataValues = Object.values(categorias);

  chartPorcentaje = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: dataValues,
        // ✅ Colores basados en la categoría ya capitalizada
        backgroundColor: labels.map(lbl => getColor(lbl)),
        hoverOffset: 8,
        borderColor: bordePastel,   // borde de los arcos del pastel
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      // Animación de “apertura” (sin escalar el radio)
      animations: {
        circumference: { from: 0, duration: 1200, easing: 'easeOutQuart' },
        rotation:      { from: -Math.PI, duration: 1200, easing: 'easeOutQuart' }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: legendTextColor, // texto blanco/negro según tema
            // Leyenda sin borde y con nombres correctos
            generateLabels: (chart) => {
              const labelsArr = chart.data.labels || [];
              const meta = chart.getDatasetMeta(0);
              return labelsArr.map((text, i) => {
                const style = meta.controller.getStyle(i);
                return {
                  text,
                  fillStyle: style.backgroundColor,
                  strokeStyle: 'transparent',
                  lineWidth: 0,
                  hidden: !chart.getDataVisibility(i),
                  index: i
                };
              });
            }
          },
          onClick: (e, legendItem, legend) => {
            const index = legendItem.index;
            legend.chart.toggleDataVisibility(index);
            legend.chart.update();
          }
        }
      }
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
    plugins: { legend: { position: 'top' } },

    // 👇 animación “desde abajo” (baseline = 0)
    animation: { duration: 1000, easing: 'easeOutCubic' },
    animations: {
      y: {
        type: 'number',
        from: ctx => ctx.chart.scales.y.getPixelForValue(0),
        duration: 1000,
        easing: 'easeOutCubic'
      }
      // (no tocamos height/base para evitar saltos)
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

function setTituloGraficoDiario(){
  if (!tituloGraficoDiario) return;
  const d = new Date(mesActual + "-01T00:00:00");
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

function renderGraficoHistorico(){
  if (!graficoHistoricoCanvas || !selectMesHistorico) return;
  graficoHistoricoCanvas.style.maxHeight = '400px';
  const ctx = graficoHistoricoCanvas.getContext('2d');
  const sel = selectMesHistorico.value || 'todos';

  if (chartHistorico) chartHistorico.destroy();

  const showNoData = () => {
    ctx.clearRect(0,0,graficoHistoricoCanvas.width,graficoHistoricoCanvas.height);
    ctx.save();
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No existen datos todavía', graficoHistoricoCanvas.width / 2, graficoHistoricoCanvas.height / 2);
    ctx.restore();
    if (balanceHistorico){
      balanceHistorico.textContent = 'No existen datos todavía';
      balanceHistorico.className = '';
    }
  };

  if (sel === 'todos'){
    const months = getAvailableMonths();
    if (months.length === 0){
      showNoData();
      return;
    }
    const gastosData = [], beneficiosData = [];
    months.forEach(m => { const t = totalsForMonth(m); gastosData.push(t.gastos); beneficiosData.push(t.beneficios); });

    chartHistorico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Gastos', data: gastosData, backgroundColor: '#e74c3c' },
          { label: 'Beneficios', data: beneficiosData, backgroundColor: '#2ecc71' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },

        // 🎬 Animación “desde abajo” (baseline 0)
        animation: { duration: 1000, easing: 'easeOutCubic' },
        animations: {
          y: {
            type: 'number',
            from: context => context.chart.scales.y.getPixelForValue(0),
            duration: 1000,
            easing: 'easeOutCubic'
          }
        }
      }
    });

    const totalBalance = months.reduce((acc,m) => acc + totalsForMonth(m).balance, 0);
    if (balanceHistorico){
      balanceHistorico.textContent = `Balance acumulado: ${totalBalance.toFixed(2)} €`;
      setBalanceColor(balanceHistorico, totalBalance);
    }
  } else {
    const t = totalsForMonth(sel);
    if ((t.gastos ?? 0) === 0 && (t.beneficios ?? 0) === 0){
      showNoData();
      return;
    }

    chartHistorico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Gastos','Beneficios'],
        datasets: [
          { label: sel, data: [t.gastos, t.beneficios], backgroundColor: ['#e74c3c','#2ecc71'] }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },

        // 🎬 Animación “desde abajo” (baseline 0)
        animation: { duration: 1000, easing: 'easeOutCubic' },
        animations: {
          y: {
            type: 'number',
            from: context => context.chart.scales.y.getPixelForValue(0),
            duration: 1000,
            easing: 'easeOutCubic'
          }
        }
      }
    });

    if (balanceHistorico){
      balanceHistorico.textContent = `Balance ${sel}: ${t.balance.toFixed(2)} €`;
      setBalanceColor(balanceHistorico, t.balance);
    }
  }
}

// -------------------- Menú hamburguesa --------------------
menuToggle.addEventListener("click", () => {
  const abierto = menu.classList.toggle("menu-abierto");
  menuToggle.classList.toggle("abierto", abierto);
  menuToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
  document.body.classList.toggle('menu-open', abierto);
  menuOverlay.classList.toggle('show', abierto);
});

menu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    const seccionId = item.dataset.section;

    // mostrar sección seleccionada
    secciones.forEach(s => s.classList.add("oculto"));
    document.getElementById(seccionId).classList.remove("oculto");

    // cerrar menú + overlay
    menu.classList.remove("menu-abierto");
    menuToggle.classList.remove("abierto");
    menuToggle.setAttribute("aria-expanded","false");
    document.body.classList.remove('menu-open');
    menuOverlay.classList.remove('show');

    // 🔁 Re-crear gráficos para que ANIMEN cada vez que entras
    const mesSel = filtrarMes.value || mesActual;

    // 1) Gráfica de Gastos (pastel)
    if (seccionId === "seccionGraficoPorcentaje") {
      if (chartPorcentaje) chartPorcentaje.destroy();
      requestAnimationFrame(() => {
        renderGraficoPorcentaje(mesSel);
      });
    }

    // 2) Gastos vs Beneficios (barras diarias)
    if (seccionId === "seccionGraficoDiario") {
      if (chartDiario) chartDiario.destroy();
      requestAnimationFrame(() => {
        renderGraficoDiario(mesSel);
      });
    }

    // 3) Histórico de Meses (barras)
    if (seccionId === "seccionHistorico") {
      if (chartHistorico) chartHistorico.destroy();
      requestAnimationFrame(() => {
        renderGraficoHistorico();
      });
    }
  });
});

// -------------------- Inicial --------------------
populateSelectHistorico();
if (selectMesHistorico){
  selectMesHistorico.addEventListener('change', renderGraficoHistorico);
}
setTituloGraficoDiario();
renderTabla();