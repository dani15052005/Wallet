// -------------------- Configuración Inicial --------------------
const body = document.body;

// Banner offline
const banner = document.createElement('div');
banner.id = 'network-banner';
banner.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:0.4rem;text-align:center;font-weight:bold;display:none;z-index:9999;';
body.appendChild(banner);

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
window.addEventListener('sw-updated', () => {
  const refreshBanner = document.createElement('div');
  refreshBanner.style.cssText = 'position:fixed;bottom:1rem;left:1rem;right:1rem;padding:0.6rem;background:#4caf50;color:white;text-align:center;border-radius:8px;z-index:9999;';
  refreshBanner.innerHTML = 'Nueva versión disponible. <button id="reloadApp" style="margin-left:0.6rem;padding:0.3rem 0.6rem;border-radius:6px;">Recargar</button>';
  body.appendChild(refreshBanner);
  document.getElementById('reloadApp').addEventListener('click', () => location.reload());
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
}

// -------------------- Gestión Mensual --------------------
const hoy = new Date();
const mesActual = hoy.toISOString().slice(0,7); // "YYYY-MM"
const mesGuardado = localStorage.getItem("mesActual") || mesActual;

if (mesActual !== mesGuardado) {
  // Guardamos los gastos del mes anterior
  localStorage.setItem(`gastos_${mesGuardado}`, JSON.stringify(gastos));
  
  // Reiniciamos los gastos para el mes nuevo
  gastos = [];
  localStorage.setItem("gastos", JSON.stringify(gastos));
  
  // Actualizamos el mes actual
  localStorage.setItem("mesActual", mesActual);
}

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

// -------------------- Render Tabla --------------------
function renderTabla() {
  tabla.innerHTML = "";
  let total = 0;

  const filtroCat = buscarCategoria.value.trim().toLowerCase();
  const filtroMes = filtrarMes.value || mesActual;

  // Cargamos gastos del mes seleccionado
  let gastosAMostrar;
  if (filtroMes === mesActual) gastosAMostrar = gastos;
  else gastosAMostrar = JSON.parse(localStorage.getItem(`gastos_${filtroMes}`)) || [];

  const gastosFiltrados = gastosAMostrar.filter(g => {
    const coincideCat = !filtroCat || g.categoria.toLowerCase().includes(filtroCat);
    return coincideCat;
  });

  gastosFiltrados.forEach((gasto, index) => {
    const fila = document.createElement("tr");
    fila.classList.add("fade-in");
    fila.innerHTML = `
      <td>${gasto.tipo}</td>
      <td class="categoria" style="border-color:${getColor(gasto.categoria)}">${gasto.categoria}</td>
      <td>${gasto.tipo === "gasto" ? "-" : ""}${gasto.importe.toFixed(2)} €</td>
      <td>${gasto.fecha}</td>
      <td>
        ${filtroMes === mesActual ? `<button onclick="editarGasto(${index})">✏️</button>
        <button onclick="eliminarGasto(${index})">🗑️</button>` : ""}
      </td>
    `;
    tabla.appendChild(fila);

    total += gasto.tipo === "gasto" ? -gasto.importe : gasto.importe;
  });

  totalEl.textContent = `Balance: ${total.toFixed(2)} €`;

  // Colores según rango
  if (total > 100) totalEl.style.color = "green";
  else if (total <= 100 && total >= 50) totalEl.style.color = "yellow";
  else if (total < 50 && total > 0) totalEl.style.color = "orange";
  else totalEl.style.color = "red";

  // Alerta presupuesto
  if (presupuesto && total < -presupuesto && filtroMes === mesActual) {
    alertaPresupuesto.textContent = "⚠️ Has superado tu presupuesto mensual";
  } else {
    alertaPresupuesto.textContent = "";
  }

  if (filtroMes === mesActual) localStorage.setItem("gastos", JSON.stringify(gastos));

  renderGraficoPorcentaje(filtroMes);
  renderGraficoDiario(total, filtroMes);
}

// -------------------- CRUD --------------------
function eliminarGasto(index) {
  gastos.splice(index, 1);
  renderTabla();
}

function editarGasto(index) {
  const gasto = gastos[index];
  tipoInput.value = gasto.tipo;
  categoriaInput.value = gasto.categoria;
  importeInput.value = gasto.importe;
  fechaInput.value = gasto.fecha;
  gastos.splice(index, 1);
  renderTabla();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const tipo = tipoInput.value;
  const categoria = categoriaInput.value.trim();
  const importe = parseFloat(importeInput.value);
  const fecha = fechaInput.value || new Date().toISOString().slice(0,10);

  if (!categoria || isNaN(importe) || importe <= 0) {
    alert("Introduce categoría, importe y fecha válidos.");
    return;
  }

  gastos.push({ tipo, categoria, importe, fecha });
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
exportCSVBtn.addEventListener("click", () => {
  let csv = "Tipo,Categoría,Importe,Fecha\n";
  gastos.forEach(g => { csv += `${g.tipo},${g.categoria},${g.importe},${g.fecha}\n`; });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gastos.csv";
  a.click();
});

exportJSONBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(gastos, null, 2)], { type: "application/json" });
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
        gastos = datos;
        localStorage.setItem("gastos", JSON.stringify(gastos));
        renderTabla();
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
  let gastosAMostrar = mesFiltrado === mesActual ? gastos : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];
  const categorias = {};
  gastosAMostrar.filter(g => g.tipo === "gasto").forEach(g => {
    categorias[g.categoria] = (categorias[g.categoria] || 0) + g.importe;
  });

  const ctx = document.getElementById("graficoGastos").getContext("2d");
  if (chartPorcentaje) chartPorcentaje.destroy();
  chartPorcentaje = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: Object.keys(categorias).map(getColor)
      }]
    }
  });
}

function renderGraficoDiario(totalBalance, mesFiltrado) {
  const hoy = new Date();
  const mes = mesFiltrado || mesActual;
  const [anio, mesNum] = mes.split("-").map(Number);
  const diasMes = new Date(anio, mesNum, 0).getDate();

  const labels = Array.from({length: diasMes}, (_, i) => i+1);
  const datosGastos = Array(diasMes).fill(0);
  const datosBeneficios = Array(diasMes).fill(0);

  let gastosAMostrar = mesFiltrado === mesActual ? gastos : JSON.parse(localStorage.getItem(`gastos_${mesFiltrado}`)) || [];
  gastosAMostrar.forEach(g => {
    if (g.fecha.startsWith(mes)) {
      const dia = parseInt(g.fecha.slice(-2), 10) - 1;
      if (g.tipo === "gasto") datosGastos[dia] += g.importe;
      else datosBeneficios[dia] += g.importe;
    }
  });

  // Elegir color de barra de Beneficios según balance total
  let barraColor;
  if (totalBalance > 100) barraColor = "#2ecc71";
  else if (totalBalance > 49.99) barraColor = "#f1c40f";
  else if (totalBalance > 0) barraColor = "#e67e22";
  else barraColor = "#e74c3c";

  const ctx = document.getElementById("graficoDiario").getContext("2d");
  if (chartDiario) chartDiario.destroy();
  chartDiario = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Gastos", data: datosGastos, backgroundColor: "#e74c3c" },
        { label: "Beneficios", data: datosBeneficios, backgroundColor: barraColor }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// -------------------- Menú hamburguesa --------------------
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("menu-abierto");
});

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
