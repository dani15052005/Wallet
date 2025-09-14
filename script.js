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
body.dark .btn-xs{ border-color:#333; background:#111; color:#eee; }
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
  background: #e8f5e9 url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='%232e7d32'%3E%3Cpath%20d='M3%2017.25V21h3.75L17.81%209.94l-3.75-3.75L3%2017.25zM20.71%207.04a1.003%201.003%200%200%200%200-1.42l-2.34-2.34a1.003%201.003%200%200%200-1.42%200l-1.83%201.83%203.75%203.75%201.84-1.82z'/%3E%3C/svg%3E") center/24px no-repeat;
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
@keyframes rowFadeOut { to { opacity:.0; transform: translateY(4px); } }
#tablaGastos tr.fade-out { animation: rowFadeOut .22s ease forwards; }
/* Header con blur y cobertura hasta la zona segura superior (iOS) */
header{
  position: sticky;
  top: 0;
  z-index: 10004;
  backdrop-filter: saturate(150%) blur(10px);
  -webkit-backdrop-filter: saturate(150%) blur(10px);
  background: rgba(255,255,255,.65);
  padding-top: calc(10px + env(safe-area-inset-top, 0px));
}
/* ... */
body.dark header{ background: rgba(17,17,17,.55); }

/* Extiende el fondo/blur por detrás del notch/status bar */
header::before{
  content:"";
  position:absolute;
  left:0; right:0;
  top: calc(-1 * env(safe-area-inset-top, 0px));
  height: env(safe-area-inset-top, 0px);
  backdrop-filter: inherit;
  -webkit-backdrop-filter: inherit;
  background: inherit;
  pointer-events:none;
}

/* Aparición suave de filas nuevas */
@keyframes rowFadeIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform:none; } }
tr.fade-in { animation: rowFadeIn .18s ease; }
@media (prefers-reduced-motion: reduce){
  tr.fade-in{ animation:none; }
  #tablaGastos tr.fade-out{ animation:none; }
}

/* Sombra discreta al hacer scroll */
header.is-scrolled { box-shadow: 0 2px 10px rgba(0,0,0,.08); }

.banner-actualizacion{
  position: fixed;
  left: 0; right: 0; top: 0;
  transform: translateY(-100%);
  transition: transform .2s ease;
  padding: .5rem .75rem;
  text-align: center;
  z-index: 10030;
  color: #111;
}
.banner-actualizacion.show{ transform: translateY(0); }
body.dark .banner-actualizacion{ color:#111; }

/* Mientras el menú esté abierto, no resaltes el .active si no está bajo el cursor */
body.menu-open #menu li.active{
  background: transparent !important;
  box-shadow: none !important;
}

/* Si el activo es además el hovered, sí se resalta como cualquier item */
body.menu-open #menu li.active:hover{
  background: rgba(255,255,255,.18) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.45) !important;
  border-radius: 12px;
}

/* Variante dark para el hovered del activo */
body.dark.menu-open #menu li.active:hover{
  background: rgba(255,255,255,.12) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.35) !important;
}
/* ===== Vacío centrado en Gestionar recurrentes ===== */
#recurManagerList .empty-box{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-height:240px; padding:16px; gap:10px;
  border-radius:12px; border:1px dashed var(--border-color,#e5e7eb);
  background:rgba(0,0,0,.02); text-align:center;
}
body.dark #recurManagerList .empty-box{
  border-color:#333; background:rgba(255,255,255,.03);
}
#recurManagerList .empty-msg{
  opacity:.85; font-weight:600;
}
#recurManagerList #recurEmptyCanvas{
  width:100%; max-width:520px; height:220px;
}
/* Vacío de "Gestionar recurrentes" con contraste suave (igual que otras secciones) */
#recurManagerList .empty-box{
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 12px 0 !important;   /* algo de aire vertical */
}

body.dark #recurManagerList .empty-box{
  border: 0 !important;
  background: transparent !important;
}

/* Mantén el texto igual */
#recurManagerList .empty-msg{ opacity: .85; font-weight: 600; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  
})();

// 1) Punto verde en el botón del menú
(() => {
  const css = `
    #menuToggle{ position:relative; }
    #menuToggle.has-notifs::after{
      content:"";
      position:absolute; top:6px; right:6px; width:8px; height:8px;
      border-radius:50%; background:#4caf50;
      box-shadow:0 0 0 2px var(--notifBorder,#fff);
    }
    body.dark #menuToggle.has-notifs::after{ --notifBorder:#111; }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// 2) Inputs/Selects de recurrentes + fijar botón menú arriba derecha
(() => {
  const css = `
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

    /* 👇 El hamburguesa solo existe/está fijo en ESCRITORIO */
    @media (min-width:1025px){
      #menuToggle{
        position:fixed !important;
        right:12px !important;
        left:auto !important;
        top:12px !important;
        z-index:10060;
      }
      body.menu-open #menuToggle{ right:12px !important; }
    }
    @media (max-width:1024px){
      #menuToggle{ display:none !important; } /* 👈 oculto en móvil/tablet */
    }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();


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
    z-index:10060;
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

  // ---- Estilos (CSS-in-JS) ----
  const css = `
  :root{
    --upd-z: 20050;
    --upd-card-bg: rgba(255,255,255,.12);
    --upd-card-bd: rgba(255,255,255,.25);
    --upd-fg: #111;
    --upd-fg-soft: rgba(0,0,0,.75);
    --upd-btn-bg: rgba(255,255,255,.18);
    --upd-btn-bd: rgba(255,255,255,.4);
    --upd-btn-fg: #111;
    --upd-primary: #4caf50;
    --upd-shadow: 0 20px 60px rgba(0,0,0,.35);
  }
  body.dark :root{
    --upd-card-bg: rgba(17,17,17,.45);
    --upd-card-bd: rgba(255,255,255,.15);
    --upd-fg: #eee;
    --upd-fg-soft: rgba(255,255,255,.85);
    --upd-btn-bg: rgba(255,255,255,.1);
    --upd-btn-bd: rgba(255,255,255,.2);
    --upd-btn-fg: #f3f3f3;
    --upd-shadow: 0 24px 70px rgba(0,0,0,.6);
  }

  #updOverlay{
    position: fixed; inset: 0;
    z-index: var(--upd-z);
    display: grid; place-items: center;
    background: radial-gradient(1200px 600px at 10% 110%, rgba(76,175,80,.10), transparent 60%),
                radial-gradient(800px 500px at 120% -10%, rgba(33,150,243,.10), transparent 60%),
                linear-gradient(180deg, rgba(0,0,0,.12), transparent 35%, rgba(0,0,0,.15));
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    opacity: 0; pointer-events: none;
    transition: opacity .35s ease, transform .35s ease;
  }
  #updOverlay.show{ opacity: 1; pointer-events: auto; transform: none; }

  /* Aurora blobs */
  #updAurora{
    position:absolute; inset:0; overflow:hidden; pointer-events:none; filter: blur(50px);
  }
  .upd-blob{
    position:absolute; width:420px; height:420px; border-radius:50%;
    opacity:.55; mix-blend-mode:screen;
    background: radial-gradient(circle at 30% 30%, rgba(76,175,80,.9), rgba(76,175,80,0) 60%),
                radial-gradient(circle at 70% 70%, rgba(33,150,243,.8), rgba(33,150,243,0) 60%);
    animation: updFloat 14s ease-in-out infinite alternate;
  }
  .upd-blob.b2{
    width:520px; height:520px; left:60%; top:10%;
    background: radial-gradient(circle at 40% 50%, rgba(236,72,153,.85), rgba(236,72,153,0) 60%),
                radial-gradient(circle at 70% 40%, rgba(250,204,21,.85), rgba(250,204,21,0) 60%);
    animation-duration: 18s;
  }
  .upd-blob.b3{
    width:480px; height:480px; left:-8%; top:50%;
    background: radial-gradient(circle at 60% 40%, rgba(56,189,248,.85), rgba(56,189,248,0) 60%),
                radial-gradient(circle at 30% 70%, rgba(34,197,94,.85), rgba(34,197,94,0) 60%);
    animation-duration: 22s;
  }
  @keyframes updFloat{
    0%   { transform: translate3d(-10px, 0px, 0) rotate(0deg); }
    100% { transform: translate3d(10px, -20px, 0) rotate(8deg); }
  }

  /* Partículas canvas */
  #updFx{
    position:absolute; inset:0; pointer-events:none;
  }

  /* Tarjeta */
  #updCard{
    position:relative; width:min(92vw, 760px);
    border-radius: 20px; padding: 28px 28px;
    background: var(--upd-card-bg);
    border: 1px solid var(--upd-card-bd);
    box-shadow: var(--upd-shadow);
    color: var(--upd-fg); text-align:center;
    transform: translateY(8px);
    opacity: 0;
    transition: opacity .45s ease .05s, transform .45s ease .05s;
  }
  #updOverlay.show #updCard{ opacity:1; transform:none; }

  .upd-badge{
    display:inline-flex; gap:.5rem; align-items:center;
    padding:.4rem .7rem; border-radius:999px;
    background: rgba(76,175,80,.15);
    border: 1px solid rgba(76,175,80,.35);
    font-weight:700; letter-spacing:.2px;
    margin-bottom:.75rem;
  }
  .upd-title{
    font-size: clamp(1.3rem, 1.2rem + 1.4vw, 2.2rem);
    line-height:1.15; margin: .25rem 0 .35rem; font-weight: 900;
  }
  .upd-sub{
    font-size: clamp(.98rem, .9rem + .35vw, 1.1rem);
    opacity:.92; margin:.25rem auto 1.2rem; color: var(--upd-fg-soft);
    max-width: 56ch;
  }

  .upd-actions{
    display:flex; flex-wrap:wrap; gap:.6rem; justify-content:center; margin-top:.4rem;
  }
  .upd-btn{
    appearance:none; border:1px solid var(--upd-btn-bd); background: var(--upd-btn-bg);
    color: var(--upd-btn-fg); font-weight:800; letter-spacing:.2px;
    padding:.75rem 1rem; border-radius:14px; cursor:pointer;
    transition: transform .12s ease, box-shadow .12s ease, background .2s ease, opacity .2s ease;
    will-change: transform, box-shadow;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  .upd-btn:hover{ transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,0,0,.15); }
  .upd-btn:active{ transform: translateY(0); box-shadow: 0 6px 18px rgba(0,0,0,.18); }

  .upd-btn.primary{
    background: linear-gradient(180deg, rgba(76,175,80,.95), rgba(76,175,80,.85));
    border-color: rgba(76,175,80,.9);
    color:#fff; padding:.9rem 1.15rem;
  }
  .upd-kb{
    display:block; margin-top:.6rem; font-size:.88rem; opacity:.85;
  }

  /* Footer decorativo */
  .upd-foot{
    margin-top:1.1rem; font-size:.88rem; opacity:.75;
  }

  /* Accesibilidad */
  #updOverlay[aria-hidden="true"]{ visibility:hidden; }
  @media (prefers-reduced-motion: reduce){
    #updOverlay, #updCard{ transition:none !important; }
    .upd-blob{ animation:none !important; }
  }

  /* ====== Anti-blur para el overlay de actualización ====== */

/* 1) Aísla la capa del overlay para que el blur del fondo no afecte al texto */
#updOverlay{
  isolation:isolate;
  transform:none;                 /* evita el scale(1.02) inicial */
}

/* 2) Orden de capas explícito: blobs y partículas detrás, card delante */
#updAurora{ z-index:0; }          /* tiene su propio filter: blur(50px) pero no afecta al resto */
#updFx{ z-index:1; }
#updCard{ 
  z-index:2;
  /* 👇 quita el scale que empana la fuente; deja solo un translate entero si quieres animar */
  transform: translateY(8px);     
}

/* 3) Estado final nítido: sin transform ni filters */
#updOverlay.show #updCard{
  transform:none;                 /* estado final exacto */
}
#updCard, #updCard *{
  filter:none !important;
  -webkit-filter:none !important;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

/* 4) Los botones tenían backdrop-filter directamente, lo movemos a un pseudo-elemento
      para que el texto del botón NO pase por la capa filtrada */
.upd-btn{
  position:relative;
  overflow:hidden;
  /* Quita el blur directo del botón */
  backdrop-filter:none !important;
  -webkit-backdrop-filter:none !important;
  font-weight:700;                /* 700 suele renderizar más nítido que 800 en Windows */
  letter-spacing:.01em;
}
.upd-btn::before{
  content:"";
  position:absolute; inset:0;
  z-index:-1;                     /* detrás del contenido del botón */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: var(--upd-btn-bg, rgba(255,255,255,.18));
  border-radius: inherit;
}

/* 5) Animación de entrada sin escalados fraccionales (evita texto borroso en tránsito) */
@keyframes updSlideIn {
  from { opacity:0; transform: translateY(8px); }
  to   { opacity:1; transform: none; }
}
#updOverlay.show #updCard{
  animation: updSlideIn .35s cubic-bezier(.2,.7,.2,1);
}
@media (prefers-reduced-motion: reduce){
  #updOverlay.show #updCard{ animation:none !important; }
}
/* Tipografía más nítida en el overlay de actualización */
#updCard, #updCard *{
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, system-ui, -apple-system, "Apple Color Emoji","Segoe UI Emoji";
  font-synthesis-weight: none;     /* evita negrita sintética */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.upd-title{ font-weight: 700; }    /* título marcado pero no exagerado */
.upd-sub{   font-weight: 400; }    /* cuerpo normal */
.upd-btn{   font-weight: 600; }    /* botón legible sin verse “gordo” */
.upd-btn.primary{ font-weight: 700; }

/* Asegura nitidez extra en botones (por si algún UA suaviza de más) */
.upd-btn, .upd-btn *{
  filter: none !important;
  -webkit-filter: none !important;
  text-shadow: none !important;
  letter-spacing: .01em;
}
  /* ===== Hover/focus mejorado para botones del overlay ===== */
#updCard .upd-actions .upd-btn{
  position: relative;
  overflow: hidden;                 /* para el brillo */
  transition: transform .18s ease, box-shadow .18s ease, background .22s ease;
}

/* Brillo radial que sigue el cursor */
#updCard .upd-actions .upd-btn::after{
  content:"";
  position:absolute; inset:-2px;
  background: radial-gradient(140px 80px at var(--mx,50%) var(--my,50%),
                              rgba(255,255,255,.35), transparent 60%);
  opacity:0; transform: scale(.96);
  transition: opacity .25s ease, transform .25s ease;
  pointer-events:none;
}

#updCard .upd-actions .upd-btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(0,0,0,.18);
  background: rgba(255,255,255,.24);
}
body.dark #updCard .upd-actions .upd-btn:hover{
  background: rgba(255,255,255,.14);
}
#updCard .upd-actions .upd-btn:hover::after{
  opacity:.65; transform: scale(1);
}

/* Variante primaria (Actualizar ahora) con gradiente más vivo al hover */
#updCard .upd-actions .upd-btn.primary:hover{
  background: linear-gradient(180deg, rgba(76,175,80,1), rgba(56,142,60,.96));
  box-shadow: 0 16px 42px rgba(76,175,80,.35);
}

/* Estado de foco accesible (teclado) */
#updCard .upd-actions .upd-btn:focus-visible{
  outline: none;
  box-shadow: 0 0 0 3px rgba(76,175,80,.35), 0 12px 32px rgba(0,0,0,.18);
}

/* Respeto a reduce motion */
@media (prefers-reduced-motion: reduce){
  #updCard .upd-actions .upd-btn,
  #updCard .upd-actions .upd-btn::after{
    transition: none !important;
  }
  #updCard .upd-actions .upd-btn:hover{
    transform:none;
  }
}

/* Hover del primario → verde más oscuro (no gris) */
#updCard .upd-actions .upd-btn.primary:hover{
  background: linear-gradient(180deg, #43a047, #2e7d32);
  box-shadow: 0 16px 42px rgba(76,175,80,.35);
}

/* Glow del primario en verde */
#updCard .upd-actions .upd-btn.primary:hover::after{
  background: radial-gradient(140px 80px at var(--mx,50%) var(--my,50%),
                              rgba(76,175,80,.45), transparent 60%);
  opacity:.7;
}

/* Active del primario (un poco más oscuro aún) */
#updCard .upd-actions .upd-btn.primary:active{
  background: linear-gradient(180deg, #2e7d32, #256e2a);
  box-shadow: 0 8px 22px rgba(76,175,80,.28);
}

/* Hover “glass” SOLO en los secundarios, nunca en el primario */
#updCard .upd-actions .upd-btn:not(.primary):hover{
  background: rgba(255,255,255,.24);
}
body.dark #updCard .upd-actions .upd-btn:not(.primary):hover{
  background: rgba(255,255,255,.14);
}

/* Base del primario en verde */
#updCard .upd-actions .upd-btn.primary{
  background-image: linear-gradient(180deg, #4caf50, #45a049) !important;
  background-color: #4caf50 !important;
  border-color: #3e9a44 !important;
  color:#fff !important;
  -webkit-text-fill-color:#fff;
}

/* Hover del primario → verde más oscuro (no gris) */
#updCard .upd-actions .upd-btn.primary:hover,
#updCard .upd-actions .upd-btn.primary:focus{
  background-image: linear-gradient(180deg, #2e7d32, #256e2a) !important;
  background-color:#2e7d32 !important;
  box-shadow: 0 16px 42px rgba(76,175,80,.35);
}

/* Active aún un punto más oscuro */
#updCard .upd-actions .upd-btn.primary:active{
  background-image: linear-gradient(180deg, #256e2a, #1f5d25) !important;
  background-color:#256e2a !important;
  box-shadow: 0 8px 22px rgba(76,175,80,.28);
}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

// Asegura que el body tiene .has-bottomnav cuando exista la barra.
(function ensureBottomNavFlag(){
  const apply = () => {
    const has = !!document.getElementById('bottomNav');
    document.body.classList.toggle('has-bottomnav', has);
    document.querySelector('main')?.classList.toggle('has-bottomnav', has); // 👈 también en <main>
  };
  apply();
  window.addEventListener('load', apply, {once:true});
  window.addEventListener('hashchange', apply);
  window.addEventListener('popstate', apply);
})();

  // ---- DOM ----
  let overlay, card, fxCanvas, ctx, rafId, focusables, lastFocus;

  function buildDOM(){
    if (document.getElementById('updOverlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'updOverlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-hidden','true');

    const aurora = document.createElement('div');
    aurora.id = 'updAurora';
    const b1 = document.createElement('div'); b1.className = 'upd-blob b1';
    const b2 = document.createElement('div'); b2.className = 'upd-blob b2';
    const b3 = document.createElement('div'); b3.className = 'upd-blob b3';
    aurora.append(b1,b2,b3);

    fxCanvas = document.createElement('canvas'); fxCanvas.id = 'updFx';

    card = document.createElement('div'); card.id = 'updCard';
    card.innerHTML = `
      <div class="upd-badge">Actualización disponible</div>
      <h2 class="upd-title">Nueva versión lista para ti</h2>
      <p class="upd-sub">Hemos mejorado rendimiento, pulido detalles y añadido pequeños extras. Recarga para aplicar los cambios.</p>
      <div class="upd-actions">
        <button class="upd-btn primary" id="updPrimary">Actualizar ahora</button>
        <button class="upd-btn" id="updSecondary">Más tarde</button>
      </div>
      <span class="upd-kb">Pulsa <strong>Enter</strong> para actualizar o <strong>Esc</strong> para continuar más tarde.</span>
      <div class="upd-foot">Gracias por usar la app 💚</div>
    `;

    overlay.append(aurora, fxCanvas, card);
    document.body.appendChild(overlay);

    // Close on background click (but keep card clicks)
    // No cerrar al hacer click en el fondo; obliga a usar uno de los botones
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    card.querySelector('#updPrimary')?.focus(); // opcional: devolver foco al CTA
  }
});
  }
 // ---- Partículas (sparkles suaves) ----
  const particles = [];
  function resizeCanvas(){
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    fxCanvas.width  = Math.floor(fxCanvas.clientWidth  * dpr);
    fxCanvas.height = Math.floor(fxCanvas.clientHeight * dpr);
    ctx = fxCanvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }
  function seedParticles(){
    particles.length = 0;
    const count = Math.floor((fxCanvas.clientWidth * fxCanvas.clientHeight) / 22000) + 30; // responsivo
    for (let i=0;i<count;i++){
      particles.push({
        x: Math.random()*fxCanvas.clientWidth,
        y: Math.random()*fxCanvas.clientHeight,
        r: Math.random()*2 + .6,
        a: Math.random()*Math.PI*2,
        s: Math.random()*0.7 + 0.2,
        hue: 100 + Math.random()*160
      });
    }
  }
  function draw(){
    if (!ctx) return;
    const w = fxCanvas.clientWidth, h = fxCanvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    for (const p of particles){
      p.a += 0.004 + p.s*0.004;
      p.x += Math.cos(p.a)*p.s;
      p.y += Math.sin(p.a)*p.s*0.6;
      if (p.x < -10) p.x = w+10; if (p.x > w+10) p.x = -10;
      if (p.y < -10) p.y = h+10; if (p.y > h+10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, .7)`;
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }

  (() => {
  const css = `
    /* Estado vacío centrado en "Gestionar recurrentes" */
.recur-empty{
  min-height: 220px;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:.6rem; text-align:center;
}
.recur-empty p{ margin:0; opacity:.85; }
.recur-empty canvas{
  width:200px; height:auto;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.25));
}
body.dark .recur-empty canvas{
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.5));
}

/* Altura uniforme de cada vista */
.page{
  min-height: calc(100vh - 64px - var(--bottomBarH, 0px) - env(safe-area-inset-bottom, 0px));
  display:flex; flex-direction:column;
}
  /* Las 3 vistas de gráficos ocupan exactamente el alto útil de la ventana */
#seccionGraficoPorcentaje.page,
#seccionGraficoDiario.page,
#seccionHistorico.page{
  height: calc(100vh - 64px - var(--bottomBarH, 0px) - env(safe-area-inset-bottom, 0px));
}

/* Contenedor con bordes redondos; SIN fondo propio */
.panel{
  border:1px solid var(--border-color,#e5e7eb);
  border-radius:12px;
  background: transparent !important;
  padding:12px;

  /* El panel ocupa el alto restante de la página */
  display:flex;
  flex-direction:column;
  flex:1 1 auto;
  min-height:0;
  position:relative;
}
body.dark .panel{ border-color:#333; background: transparent !important; }

/* Los paneles de las vistas de gráficos se estiran dentro de la página */
#seccionGraficoPorcentaje .panel,
#seccionGraficoDiario .panel,
#seccionHistorico .panel{ flex:1 1 auto; }
}

/* Los canvas rellenan el panel al 100% */
/* Deja que Chart.js controle la altura del canvas */
/* Contenedor que sí se estira */
.chartbox{
  position: relative;
  flex: 1 1 auto;
  min-height: 260px;        /* lo que quieras de alto mínimo */
}

/* El canvas ocupa el contenedor al 100% */
.chartbox > canvas{
  position: absolute; inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* IMPORTANTE: el canvas en sí NO es un flex item */
#graficoGastos,
#graficoDiario,
#graficoHistorico{
  flex: 0 0 auto;           /* ← quita el estiramiento */
  width: 100% !important;
  display: block;
}

/* Cajas de “vacío” dentro del panel con altura cómoda */
.panel .empty-box{ min-height: 220px; }

/* FONDO LIMPIO (la página manda su color) */
.page{ background: transparent !important; }

/* Estas secciones sin fondo ni sombra */
#seccionHistorico,
#seccionGraficoPorcentaje,
#seccionGraficoDiario,
#seccionRecurrentes{
  background: transparent !important;
  box-shadow: none !important;
}

/* Asegura el “recuadro” alrededor de las gráficas */
#seccionGraficoPorcentaje .panel,
#seccionGraficoDiario .panel,
#seccionHistorico .panel{
  border:1px solid var(--border-color,#e5e7eb) !important;
}
body.dark #seccionGraficoPorcentaje .panel,
body.dark #seccionGraficoDiario .panel,
body.dark #seccionHistorico .panel{
  border-color:#333 !important;
}

/* El canvas nunca debe oscurecer */
#graficoHistorico, #graficoGastos, #graficoDiario{
  background: transparent !important;
}
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

(() => {
  const css = `
/* ===== Compacta páginas de gráficos y recurrentes ===== */
#seccionGraficoPorcentaje h2,
#seccionGraficoDiario h2,
#seccionHistorico h2,
#seccionRecurrentes h2{ margin:.15rem 0 .5rem; }

#seccionGraficoPorcentaje .panel,
#seccionGraficoDiario .panel,
#seccionHistorico .panel,
#seccionRecurrentes .panel{ padding:8px; }

/* Vacíos más bajitos */
.panel .empty-box{ min-height:160px; }

/* Recurrentes: lista más contenida y con scroll si hace falta */
#seccionRecurrentes .panel{ max-height:min(62vh,520px); overflow:auto; }
#recurManagerList{ gap:.4rem !important; }
.recur-item{ gap:.35rem; }
.recur-card{ padding:.5rem; }

/* Botones XS un pelín más pequeños */
.btn-xs{ padding:.28rem .5rem; }
.btn-primary-xs{ padding:.28rem .6rem; }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* === 1) Compactar las vistas de gráficos (no ocupar 100vh) === */
(() => {
  const css = `
/* no fuerces altura de página ni de las vistas de gráficos */
.page{ min-height: 0 !important; }
#seccionGraficoPorcentaje.page,
#seccionGraficoDiario.page,
#seccionHistorico.page{ height:auto !important; }

/* los paneles y el contenedor de la gráfica no se estiran */
#seccionGraficoPorcentaje .panel,
#seccionGraficoDiario .panel,
#seccionHistorico .panel{ 
  flex: 0 0 auto !important; 
  min-height: 0 !important;
}

/* el wrapper de la gráfica tampoco se estira */
.chartbox{ 
  flex: 0 0 auto !important; 
  min-height: 0 !important; 
}

/* dale una altura razonable al canvas y evita el fill al 100% */
.chartbox > canvas{
  position: relative !important;
  width: 100% !important;
  height: 320px !important;
}
@media (min-width: 768px){
  .chartbox > canvas{ height: 420px !important; }
}
`;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* === 2) Pastel: elimina la “raya” cuando hay una única categoría === */
(function patchPieBorder(){
  const old = window.renderGraficoPorcentaje;
  if (typeof old !== 'function') return;
  window.renderGraficoPorcentaje = function(mk){
    old.call(this, mk);
    // si ya existe el chart, ajusta el borde según nº de sectores
    if (window.chartPorcentaje){
      const ds = chartPorcentaje.data?.datasets?.[0];
      const vals = Array.isArray(ds?.data) ? ds.data : [];
      const nonZero = vals.filter(v => Number(v) > 0).length;
      // con 1 solo sector: sin borde (adiós línea blanca)
      ds.borderWidth = nonZero <= 1 ? 0 : 2;
      chartPorcentaje.update();
    }
  };
})();

// 🔧 FIX overlay: centrado móvil + botones cómodos
(() => {
  const css = `
    /* Centrado/encajado en móviles y tablets (respeta notch) */
    #updOverlay{
      padding-top:16px;
      padding-bottom:16px;
      padding-left:  calc(16px + env(safe-area-inset-left, 0px));
      padding-right: calc(16px + env(safe-area-inset-right, 0px));
    }
    #updCard{
      width: 100% !important;      /* anula width:min(92vw,...) */
      max-width: 760px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    /* Botonera cómoda en pantallas pequeñas */
    @media (max-width: 768px){
      #updCard .upd-actions{ flex-direction: column; }
      #updCard .upd-actions .upd-btn{
        width: 100%;
        padding: 1rem 1.1rem;      /* un pelín más alto */
      }
    }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

  // ---- Focus trap + accesibilidad ----
  function trapFocus(e){
    if (e.key !== 'Tab') return;
    const nodes = focusables.filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---- API pública ----
  function openUpdateOverlay(opts = {}){
    buildDOM();

    // Contenido dinámico
    const title = (opts.title || (opts.type==='partial' ? 'Recursos actualizados' : 'Nueva versión disponible'));
    const sub   = (opts.message || (opts.type==='partial'
                   ? 'Se han actualizado algunos recursos. Recarga para ver los cambios.'
                   : 'Hemos mejorado la app. Recarga para aplicar las novedades.'));
    card.querySelector('.upd-title').textContent = title;
    card.querySelector('.upd-sub').textContent = sub;
    card.querySelector('#updPrimary').textContent   = opts.primaryText   || (opts.type==='partial' ? 'Actualizar recursos' : 'Actualizar ahora');
    card.querySelector('#updSecondary').textContent = opts.secondaryText || 'Más tarde';

        // Mensaje adaptado: teclas (desktop) vs botones (móvil/tablet)
    const kbEl = card.querySelector('.upd-kb');
    const mq = window.matchMedia('(max-width: 1024px)');
    const setKb = () => {
      if (!kbEl) return;
      if (mq.matches) {
        kbEl.innerHTML = 'Pulsa <strong>Actualizar ahora</strong> para actualizar o <strong>Más tarde</strong> para continuar en otro momento.';
      } else {
        kbEl.innerHTML = 'Pulsa <strong>Enter</strong> para actualizar o <strong>Esc</strong> para continuar más tarde.';
      }
    };
    setKb();
    if (mq.addEventListener) mq.addEventListener('change', setKb);
    else if (mq.addListener) mq.addListener(setKb); // Safari viejo

    overlay.setAttribute('aria-hidden','false');
    overlay.classList.add('show');

    // Callbacks
    const primary = card.querySelector('#updPrimary');
    const secondary = card.querySelector('#updSecondary');

    // Limpia handlers previos
    primary.onclick = null; secondary.onclick = null;

    primary.onclick = () => { try { opts.onPrimary?.(); } finally { closeUpdateOverlay(); } };
    secondary.onclick = () => { try { opts.onSecondary?.(); } finally { closeUpdateOverlay(); } };

    // Teclado
    lastFocus = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape'){ e.preventDefault(); secondary.click(); }
      if (e.key === 'Enter'){ e.preventDefault(); primary.click(); }
      trapFocus(e);
    };
    overlay.addEventListener('keydown', onKey);
    overlay._onKey = onKey; // guarda para quitar luego

    // Focus inicial
    focusables = [primary, secondary];
    setTimeout(() => primary.focus(), 10);

    // Canvas
    const doMotion = !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    if (doMotion){
      resizeCanvas(); seedParticles(); cancelAnimationFrame(rafId); draw();
      window.addEventListener('resize', onResize, { passive:true });
    }

    return () => closeUpdateOverlay();
  }

  function onResize(){
    resizeCanvas(); seedParticles();
  }

  function closeUpdateOverlay(){
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
    // Stop fx
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    // Unbind key
    if (overlay._onKey) overlay.removeEventListener('keydown', overlay._onKey);
    // Devuelve foco
    lastFocus?.focus?.();
  }

  // Expone funciones
  window.openUpdateOverlay = openUpdateOverlay;
  window.closeUpdateOverlay = closeUpdateOverlay;

(() => {
  const css = `
/* 1) Quita el blur del overlay y pásalo detrás en ::after (no ablanda el texto) */
#updOverlay{
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  isolation: isolate;         /* aísla capas */
}
#updOverlay::after{
  content:"";
  position: fixed; inset: 0;
  pointer-events: none;
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
  z-index: 0;                  /* detrás de la card */
}

/* 2) Nitidez de la tarjeta y su contenido */
#updCard, #updCard *{
  filter: none !important;
  -webkit-filter: none !important;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* 3) El “glass” base se aplica a secundarios, pero NO al primario */
#updCard .upd-actions .upd-btn{
  position: relative;
  overflow: hidden;
}
#updCard .upd-actions .upd-btn::before{
  content:"";
  position:absolute; inset:0; z-index:-1;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: var(--upd-btn-bg, rgba(255,255,255,.18));
  border-radius: inherit;
}
/* quita glass del primario para que no lave el verde */
#updCard .upd-actions .upd-btn.primary{ --upd-btn-bg: transparent; }
#updCard .upd-actions .upd-btn.primary::before{ background: transparent !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; }

/* 4) Fuerza el verde del primario y su hover con máxima especificidad */
#updCard .upd-actions .upd-btn.primary{
  background: linear-gradient(180deg, #4caf50, #2e7d32) !important;
  border-color: #2e7d32 !important;
  color: #fff !important;
}
#updCard .upd-actions .upd-btn.primary:hover,
#updCard .upd-actions .upd-btn.primary:focus{
  background: linear-gradient(180deg, #2e7d32, #256e2a) !important;
}
#updCard .upd-actions .upd-btn.primary:active{
  background: linear-gradient(180deg, #256e2a, #1f5d25) !important;
}

/* 5) Mientras aparece, evita transform raros que suavicen fuentes */
#updOverlay.show #updCard{
  transform: none !important;
  animation: updSlideIn .35s cubic-bezier(.2,.7,.2,1);
}
@keyframes updSlideIn { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;} }
@media (prefers-reduced-motion: reduce){
  #updOverlay.show #updCard{ animation:none !important; }
}
`;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// ===== FIX: BottomNav altura consistente (64px) en todas las páginas =====
// ===== FIX: BottomNav pegado al borde inferior (con safe-area) =====
(() => {
  const css = `
  @media (max-width:1024px){
    :root{ --bottomBarH:64px; --safeB: env(safe-area-inset-bottom,0px); }

    /* Reserva de espacio para el contenido */
    body.has-bottomnav,
    main.has-bottomnav{
      padding-bottom: calc(var(--bottomBarH) + var(--safeB)) !important;
    }

    /* Barra inferior: caja incluye la safe-area y además la rellena con fondo */
    nav#bottomNav{
      position: fixed !important;
      left:0 !important; right:0 !important; bottom:0 !important;
      box-sizing: border-box !important;
      height: calc(var(--bottomBarH) + var(--safeB)) !important; /* 👈 ocupa también la zona segura */
      padding: 0 0 var(--safeB) 0 !important;                     /* 👈 separa los iconos del gesto Home */
      margin: 0 !important;
      display: grid !important;
      grid-template-columns: repeat(5, minmax(0,1fr)) !important;
      align-items: center !important;
      z-index: 10050 !important;
    }

    /* Por si algún estilo recorta el background, pintamos la safe-area explícitamente */
    nav#bottomNav::after{
      content:"";
      position:absolute; left:0; right:0; bottom:0;
      height: var(--safeB);
      background: inherit;           /* mismo color que la barra */
      pointer-events:none;
    }

    /* Botones: mismo alto que la parte útil (sin safe-area) */
    nav#bottomNav > button{
      height: var(--bottomBarH) !important;
      padding: 0 !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:center !important;
      justify-content:center !important;
      gap:.25rem !important;
      min-width:0 !important;
    }

    /* FAB/Toasts referenciando la misma altura total */
    .fab-add{
      bottom: calc(16px + var(--bottomBarH) + var(--safeB)) !important;
    }
    body.has-bottomnav.toast-visible .toast-container{
      bottom: calc(1rem + var(--bottomBarH) + 56px + 12px + var(--safeB)) !important;
    }
  }`;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
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

// Cerrar todos los toasts con Escape
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!__toastContainer) return;
  const toasts = __toastContainer.querySelectorAll('.toast');
  if (!toasts.length) return;

  toasts.forEach(t => t.remove());
  document.body.classList.remove('toast-visible');
});

// -------------------- Banner offline --------------------
const banner = document.createElement('div');
banner.id = 'network-banner';
banner.className = 'banner-actualizacion';
banner.style.background = '#ffcc00';
banner.textContent = 'Sin conexión: algunos recursos pueden no estar disponibles';
banner.setAttribute('role','status');
banner.setAttribute('aria-live','polite');
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

// ===== Actualizaciones del Service Worker – overlay sólido =====
(function setupSWUpdates(){
  if (!('serviceWorker' in navigator)) return;
  let regRef, reloaded = false;

  const show = (kind='major') => openUpdateOverlay({
    type: kind,
    title: kind==='partial' ? 'Recursos actualizados' : 'Nueva versión disponible',
    message: kind==='partial'
      ? 'Se han actualizado algunos recursos. Recarga para ver los cambios.'
      : 'Hemos mejorado la app. Recarga para aplicar las novedades.',
    primaryText: kind==='partial' ? 'Actualizar recursos' : 'Actualizar ahora',
    secondaryText: 'Más tarde',
    onPrimary: () => {
      if (regRef?.waiting) regRef.waiting.postMessage({type:'SKIP_WAITING'});
      else navigator.serviceWorker.controller?.postMessage({type:'SKIP_WAITING'});
      setTimeout(() => location.reload(), 150);
    }
  });

  const wire = (reg) => {
    if (!reg) return;
    regRef = reg;

    // 1) Si ya hay uno esperando (pasa si abriste la pestaña tras publicar)
    if (reg.waiting && navigator.serviceWorker.controller) show('major');

    // 2) Nueva versión encontrada → esperar a "installed"
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) show('major');
      });
    });

    // 3) Fallback por si algún evento se pierde (Safari, pestaña dormida…)
    setTimeout(() => { if (reg.waiting && navigator.serviceWorker.controller) show('major'); }, 2000);
  };

  navigator.serviceWorker.addEventListener('message', (evt) => {
    if (evt.data?.type === 'SW_UPDATED') show('major');
    if (evt.data?.type === 'SW_UPDATED_PARTIAL') show('partial');
  });

  navigator.serviceWorker.getRegistration().then((reg) => {
    wire(reg);
    reg?.update();                       // chequeo inmediato al cargar
  });

  // Re-chequear al volver al foco y cada 15 min
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') regRef?.update();
  });
  setInterval(() => regRef?.update(), 15 * 60 * 1000);

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloaded){ reloaded = true; location.reload(); }
  });
})();

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
const UI_COMPACT = true; // reduce alturas, paddings y tipografías en gráficos y recurrentes

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

// Menú inerte cuando está cerrado + hover solo abierto
(() => {
  const css = `
    /* Nada de eventos sobre el menú si no está abierto */
    body:not(.menu-open) #menu,
    body:not(.menu-open) #menu *{
      pointer-events: none !important;
    }

    /* Por si queda alguna regla previa de :hover */
    body:not(.menu-open) #menu li:hover{
      background: transparent !important;
      box-shadow: none !important;
    }

    /* Hover SOLO cuando el menú está abierto */
    body.menu-open #menu li:hover{
      background: rgba(255,255,255,.18) !important;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.45) !important;
      border-radius: 12px;
    }

    /* Cuando hay hover sobre cualquier <li>, oculta el estilo del activo
   para que no se vean dos elementos resaltados a la vez */
@supports selector(:has(*)) {
  body.menu-open #menu:has(li:hover) li.active{
    background: transparent !important;
    box-shadow: none !important;
  }
}
    body.dark.menu-open #menu li:hover{
      background: rgba(255,255,255,.12) !important;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.35) !important;
    }

    /* Activo */
    #menu li.active{
      background: transparent !important;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.28) !important;
      border-radius: 12px;
    }

    /* En táctiles sin hover, no pintes nada */
    @media (hover: none) {
      #menu li:hover{
        background: transparent !important;
        box-shadow: none !important;
      }
    }
  `;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
})();

// --- Sección y menú: Gestionar recurrentes ---
(function injectRecurrentManager(){
  const main = document.querySelector('main') || document.body;

  // Sección nueva (queda oculta por defecto)
  const section = document.createElement('section');
  section.id = 'seccionRecurrentes';
  section.className = 'oculto page';
  section.innerHTML = `
   <h2 style="margin:.25rem 0 1rem">⚙️ Gestionar recurrentes</h2>
   <div class="panel">
     <div id="recurManagerList" class="recur-list" style="gap:.6rem"></div>
  </div>
`;
  main.appendChild(section);
    // (tras: main.appendChild(section);)
  if (!menu) {
    console.warn('[recurrentes] #menu no existe; creo la sección pero omito el item de menú');
    return;
  }

  // Item del menú
  const li = document.createElement('li');
  li.dataset.section = 'seccionRecurrentes';
  li.textContent = 'Gestionar recurrentes';
  li.setAttribute('tabindex','0');
  li.setAttribute('role','button');
  menu.appendChild(li);

  // Navegación del item
  const go = () => {
  selectSection('seccionRecurrentes');
  syncMenuActiveToVisible();
  closeMenu();
  scrollTopIfDesktop();
  renderRecurrentManager();
  const h2 = section.querySelector('h2');
  if (h2){ h2.setAttribute('tabindex','-1'); setTimeout(()=>h2.focus(), 0); }
};
  li.addEventListener('click', go);
  li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
})();

// Gráficos/histórico
const selectMesHistorico = document.getElementById("selectMesHistorico");
const balanceHistorico = document.getElementById("balanceHistorico");
const graficoHistoricoCanvas = document.getElementById("graficoHistorico");
const tituloGraficoDiario = document.getElementById("tituloGraficoDiario");

// Overlay del menú
const menuOverlay = document.createElement('div');
menuOverlay.id = 'menuOverlay';
document.body.appendChild(menuOverlay);

// -------- Bottom Nav (móvil/tablet): crea/actualiza/borra --------
function selectSection(seccionId){
  const main = document.querySelector('main') || document.body;
  const next = document.getElementById(seccionId);
  if (!next) return;

  // 1) Lock de altura para que el documento no “colapse”
  const y = window.scrollY;
  const lockH = Math.max(main.offsetHeight, window.innerHeight);
  main.style.minHeight = lockH + 'px';

  // 2) Muestra primero la sección destino (así nunca hay frame con altura 0)
  next.classList.remove('oculto');
  // Fuerza un reflow para que el navegador “vea” el nuevo alto antes de ocultar las demás
  next.getBoundingClientRect();

  // 3) Oculta el resto (después)
  document.querySelectorAll('main section').forEach(s => {
    if (s !== next) s.classList.add('oculto');
  });

  // 4) Marca activos en bottom nav y menú
  document.querySelectorAll('#bottomNav button[data-target]').forEach(b => {
    if (b.dataset.target === seccionId) b.setAttribute('aria-current','page');
    else b.removeAttribute('aria-current');
  });
  syncMenuActiveToVisible();

  // 5) Refresca gráficos SOLO cuando ya está visible
  const mk = (filtrarMes?.value) || mesActual;
  if (seccionId === "seccionGraficoPorcentaje"){ if (chartPorcentaje) chartPorcentaje.destroy(); renderGraficoPorcentaje(mk); }
  if (seccionId === "seccionGraficoDiario"){ if (chartDiario) chartDiario.destroy(); setTituloGraficoDiario(mk); renderGraficoDiario(mk); }
  if (seccionId === "seccionHistorico"){ if (chartHistorico) chartHistorico.destroy(); renderGraficoHistorico(); }
  if (seccionId === "seccionRecurrentes"){ renderRecurrentManager(); }

  // 6) Restaura scroll y desbloquea el lock de altura
  requestAnimationFrame(() => {
    // Si estabas muy abajo y la nueva sección es más corta, clamp al máximo válido
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, Math.min(y, maxY));
    main.style.minHeight = ''; // quita el lock
  });
}


function buildBottomNav(){
  if (document.getElementById('bottomNav')) return;

  const nav = document.createElement('nav');
  nav.id = 'bottomNav';
  nav.innerHTML = `
    <button data-target="seccionFormulario" aria-current="page">
      <span class="icon">🏠</span><span class="label">Inicio</span>
    </button>
    <button data-target="seccionGraficoPorcentaje">
      <span class="icon">🥧</span><span class="label">% por cat.</span>
    </button>
    <button data-target="seccionGraficoDiario">
      <span class="icon">📅</span><span class="label">Diario</span>
    </button>
    <button data-target="seccionHistorico">
      <span class="icon">📈</span><span class="label">Histórico</span>
    </button>
    <button data-target="seccionRecurrentes">
      <span class="icon">🔁</span><span class="label">Recurrentes</span>
    </button>
  `;
  document.body.appendChild(nav);

  // delegación de clicks
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-target]');
    if (!btn) return;
    selectSection(btn.dataset.target);
  });
}

function destroyBottomNav(){
  document.getElementById('bottomNav')?.remove();
}

const _mqBottomNav = window.matchMedia('(max-width: 1024px)');
function applyBottomNavMode(){
  const mainEl = document.querySelector('main');
  if (_mqBottomNav.matches){
    document.body.classList.add('has-bottomnav');
    mainEl?.classList.add('has-bottomnav');        // 👈 añade aquí
    buildBottomNav();
  } else {
    document.body.classList.remove('has-bottomnav');
    mainEl?.classList.remove('has-bottomnav');     // 👈 y aquí
    destroyBottomNav();
  }
  reflowChartsVisible();
}

// 👇 Pégalo una vez (por ejemplo, junto a applyBottomNavMode)
function scrollTopIfDesktop(){
  if (!document.body.classList.contains('has-bottomnav')) {
    (document.querySelector('main') || document.body)
      .scrollIntoView({ behavior:'smooth', block:'start' });
  }
}

if (_mqBottomNav.addEventListener) {
  _mqBottomNav.addEventListener('change', applyBottomNavMode);
} else if (_mqBottomNav.addListener) {
  // Safari/WebKit antiguos
  _mqBottomNav.addListener(applyBottomNavMode);
}

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
    const mk = (filtrarMes?.value) || mesActual;
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

    // 🔒 Fallback seguro si no existe el modal en el HTML
    if (!root) {
      const ok = window.confirm(`${title}\n\n${message}`);
      resolve(!!ok);
      return;
    }

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
  if (darkIcon) darkIcon.textContent = "☀️";
} else {
  if (darkIcon) darkIcon.textContent = "🌙";
}

document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'enter'){
    if (form) { e.preventDefault(); (form.requestSubmit ? form.requestSubmit() : form.submit()); }
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
window.addEventListener('scroll', headerScrollCheck, { passive:true });
headerScrollCheck();

if (addFirstBtn) {
  addFirstBtn.addEventListener("click", () => {
    document.querySelectorAll("main section").forEach(s => s.classList.add("oculto"));
    document.getElementById("seccionFormulario")?.classList.remove("oculto");
    if (estadoVacio) estadoVacio.hidden = true;
    (categoriaInput || tipoInput || importeInput || fechaInput)?.focus?.();
    markOnboardStep('primerGasto');
    scrollTopIfDesktop();
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

    // --- Estado previo memorizado ---
const prevPct    = _lastCatPct.has(cat) ? _lastCatPct.get(cat) : 0;
const prevStatus = _lastCatStatus.get(cat) || "ok";

/* 1) Pinta el “antes” sin transición */
bar.style.transition = "none";
bar.classList.remove("ok","warn","over");
bar.classList.add(prevStatus);
bar.style.width = `${prevPct}%`;

/* 2) Fuerza reflow para que el “antes” se quede aplicado */
void bar.offsetWidth;

/* 3) Activa transición y pinta el “después” (una sola animación) */
const wantsMotion = !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
bar.style.transition = wantsMotion ? "width .45s ease, background-color .45s ease" : "none";
bar.classList.remove("ok","warn","over");
bar.classList.add(status);
bar.style.width = `${pct}%`;

/* 4) Memoriza YA el nuevo estado (evita re-animaciones por renders seguidos) */
_lastCatPct.set(cat, pct);
_lastCatStatus.set(cat, status);
  });
}

function refreshDashboards(monthKey){
  renderGraficoPorcentaje(monthKey);
  renderGraficoDiario(monthKey);
  renderGraficoHistorico();
  renderCatBudgets();
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
// --- Utilidades CSV ---
function csvEscape(value){
  // Convierte null/undefined a "", escapa comillas dobles y envuelve en comillas
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function round2(n){ return Math.round((Number(n) || 0) * 100) / 100; }

function findBudgetKey(cat){
  const target = normalizeStr(capitalizeFirst(cat || ''));
  for (const k of Object.keys(catBudgets || {})){
    if (normalizeStr(k) === target) return k;
  }
  return null;
}

function syncMenuActiveToVisible(){
  if (!menu) return;
  const visible = document.querySelector('main section:not(.oculto)');
  const id = visible?.id || null;
  menu.querySelectorAll('li').forEach(li => {
    li.classList.toggle('active', id && li.dataset.section === id);
  });
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

  // ❶ Si había una animación anterior en este contenedor, la detenemos
  const oldCanvas = document.getElementById('recurEmptyCanvas');
  if (oldCanvas) stopEmptyAnim(oldCanvas);

  list.innerHTML = '';

  // ❷ VACÍO: caja centrada + animación en canvas
  if (!recurrents.length){
    const box = document.createElement('div');
    box.className = 'empty-box';
    box.innerHTML = `
  <canvas id="recurEmptyCanvas" role="img"
          aria-label="No hay reglas recurrentes guardadas."></canvas>
`;

    list.appendChild(box);

    const c = box.querySelector('#recurEmptyCanvas');
 requestAnimationFrame(() => {
   startEmptyAnim(c, "No hay reglas recurrentes guardadas.");
 });
    // Quita cualquier mensaje estático duplicado bajo la sección
const sec = document.getElementById('seccionRecurrentes');
sec?.querySelectorAll(':scope > p, :scope > .empty, :scope > .mensaje, :scope > .note')
  .forEach(n => {
    const txt = (n.textContent || '').trim().toLowerCase();
    if (txt.includes('no hay reglas recurrentes')) n.remove();
  });
    return; // <- importante: no sigas montando filas
  }

  // ❸ LISTADO NORMAL (tu código de siempre)
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

  // foco al abrir (como ya tenías)
  const parentSection = document.getElementById('seccionRecurrentes');
  const h2 = parentSection?.querySelector('h2');
  if (h2){ h2.setAttribute('tabindex','-1'); setTimeout(()=>h2.focus(), 0); }

  // manejador de clicks (igual que el tuyo)
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
      renderRecurrentManager();
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
  const mk = (filtrarMes?.value) || mesActual;
  const due = getDueRecurrents(mk);
  if (due.length) showRecurCard(due); else hideRecurCard();
  // 👇 Puntito en el icono del menú
  if (menuToggle) menuToggle.classList.toggle('has-notifs', due.length > 0);
}

// Mensaje “sin datos” en canvas
function drawNoDataMessage(canvas, text) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  // Que el canvas ocupe el contenedor y tenga un alto mínimo
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  if (!canvas.style.minHeight) canvas.style.minHeight = '240px';

  // Mide tras aplicar estilos
  const wCss = Math.max(1, canvas.clientWidth || canvas.getBoundingClientRect().width || 300);
  const hCss = Math.max(120, canvas.clientHeight || canvas.getBoundingClientRect().height || 240);

  // Resolución física acorde al DPR
  canvas.width  = Math.floor(wCss * dpr);
  canvas.height = Math.floor(hCss * dpr);

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, wCss, hCss);
  ctx.font = "16px Arial";
  ctx.fillStyle = body.classList.contains('dark') ? "#eee" : "#333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, wCss / 2, hCss / 2);
  ctx.restore();
}

// ===== Animación de "estado vacío" en canvas =====
const __emptyAnims = new WeakMap(); // canvas -> estado animación

function startEmptyAnim(canvas, text = "Sin datos", opts = {}) {
  stopEmptyAnim(canvas);
  const state = {
    raf: 0,
    particles: [],
    text,
    opts,
    dpr: Math.max(1, window.devicePixelRatio || 1),
    resizeHandler: null,
    t0: performance.now()
  };
  __emptyAnims.set(canvas, state);

  canvas.style.display = 'block';
  canvas.style.width = '100%';
  if (!canvas.style.minHeight) canvas.style.minHeight = '240px';

  function size() {
    const wCss = Math.max(1, canvas.clientWidth || canvas.getBoundingClientRect().width || 300);
    const hCss = Math.max(200, canvas.clientHeight || canvas.getBoundingClientRect().height || 240);
    canvas.width  = Math.floor(wCss * state.dpr);
    canvas.height = Math.floor(hCss * state.dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    return { ctx, wCss, hCss };
  }

  let { ctx, wCss, hCss } = size();
  const isDark = () => document.body.classList.contains('dark');

  // Semilla de partículas
  const count = Math.max(18, Math.round((wCss * hCss) / 40000));
  state.particles = Array.from({ length: count }).map(() => ({
    x: wCss/2 + (Math.random()*60 - 30),
    y: hCss/2 - 10 + (Math.random()*30 - 15),
    vx: (Math.random()*0.6 - 0.3),
    vy: -(Math.random()*0.6 + 0.2),
    r: Math.random()*1.8 + 0.6,
    a: Math.random()*0.8 + 0.4,
    hue: 110 + Math.random()*140
  }));

  function roundRect(ctx, x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y, x+w,y+h, r);
    ctx.arcTo(x+w,y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function drawBox(t){
    const cx = wCss/2, cy = hCss/2;
    const bob = Math.sin(t*0.002) * 6;
    const y = cy + bob;

    // Sombra
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.ellipse(cx, y+36, 46, 12, 0, 0, Math.PI*2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    // Caja
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const base = isDark() ? '#a88962' : '#c99c6a';
    const side = isDark() ? '#8b6f4e' : '#b4895c';
    const lid  = isDark() ? '#d1b089' : '#e5c79f';

    // cuerpo
    ctx.fillStyle = base;
    roundRect(ctx, cx-34, y-28, 68, 44, 8);
    ctx.fill();

    // franja superior (sombra lateral)
    ctx.fillStyle = side;
    roundRect(ctx, cx-34, y-28, 68, 16, 8);
    ctx.fill();

    // tapa abierta
    ctx.save();
    ctx.translate(cx, y-34);
    ctx.rotate(-0.08 + Math.sin(t*0.003)*0.02);
    ctx.fillStyle = lid;
    roundRect(ctx, -40, -10, 80, 18, 6);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function step(now){
    const t = now - state.t0;
    ({ ctx, wCss, hCss } = size());

    // Fondo totalmente transparente (se ve el de la página)
    ctx.clearRect(0,0,wCss,hCss);

    // Caja
    drawBox(t);

    // Partículas
    for (const p of state.particles){
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.005;
      if (p.a <= 0 || p.y < hCss/2 - 60){
        p.x = wCss/2 + (Math.random()*50 - 25);
        p.y = hCss/2 - 6;
        p.vx = (Math.random()*0.6 - 0.3);
        p.vy = -(Math.random()*0.6 + 0.2);
        p.r  = Math.random()*1.8 + 0.6;
        p.a  = Math.random()*0.8 + 0.4;
        p.hue= 110 + Math.random()*140;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, ${isDark()?70:45}%, ${p.a})`;
      ctx.fill();
    }

    // Texto
    ctx.font = "16px Arial";
    ctx.fillStyle = isDark()? "#eaeaea" : "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(state.text, wCss/2, hCss/2 + 54);

    state.raf = requestAnimationFrame(step);
  }

  state.resizeHandler = () => {
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(step);
  };
  window.addEventListener('resize', state.resizeHandler, { passive:true });

  state.raf = requestAnimationFrame(step);
  return state;
}

function stopEmptyAnim(canvas){
  const st = __emptyAnims.get(canvas);
  if (!st) return;
  cancelAnimationFrame(st.raf);
  window.removeEventListener('resize', st.resizeHandler);
  __emptyAnims.delete(canvas);
  /* 👇 limpia límites que pone el estado vacío */
  canvas.style.minHeight = '0';
  canvas.style.removeProperty('height');
  canvas.removeAttribute('height');
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height;
  ctx.clearRect(0,0,w,h);
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
  // Detén animaciones de “vacío”
  ['graficoGastos','graficoDiario','graficoHistorico'].forEach(id => {
    const c = document.getElementById(id);
    if (c) stopEmptyAnim(c);
  });

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
  if (typeof Chart === 'undefined') { startEmptyAnim(canvas, "Cargando gráficos…"); return; }

  if (Object.keys(categorias).length === 0) {
    if (chartPorcentaje) chartPorcentaje.destroy();
    startEmptyAnim(canvas, "No hay gastos este mes");
    return;
  }

  stopEmptyAnim(canvas);

  const ctx = canvas.getContext("2d");
  if (chartPorcentaje) chartPorcentaje.destroy();

  const labels     = Object.keys(categorias);
  const dataValues = Object.values(categorias);
  const isDark     = body.classList.contains('dark');
  const bordePastel = isDark ? '#fff' : '#000';
  const textColor   = isDark ? '#fff' : '#000';
  const bgColors    = labels.map(lbl => colorForCategory(lbl));

  const rect = canvas.getBoundingClientRect();
  const hover = Math.min(10, Math.max(6, Math.round((rect.width || 320) * 0.018)));
  const pad   = hover + 6;

  chartPorcentaje = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: dataValues,
        backgroundColor: bgColors,
        radius: "86%",
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
      animation: { duration: 900, easing: 'easeOutQuart' },
      animations: {
        circumference: { from: 0, duration: 900, easing: 'easeOutQuart' },
        rotation:      { from: -Math.PI, duration: 900, easing: 'easeOutQuart' }
      },
      elements: { arc: { borderAlign: "inner" } },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, boxWidth: 10, boxHeight: 10, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : '#fff',
          titleColor: textColor,
          bodyColor:  textColor,
          borderColor: bordePastel,
          borderWidth: 1,
          titleFont: { size: 12 }, bodyFont: { size: 12 }
        }
      }
    }
  });
}

function renderGraficoDiario(mesFiltrado) {
  // Detén animaciones de “vacío”
  ['graficoGastos','graficoDiario','graficoHistorico'].forEach(id => {
    const c = document.getElementById(id);
    if (c) stopEmptyAnim(c);
  });

  const sec = document.getElementById("seccionGraficoDiario");
  if (sec && sec.classList.contains("oculto")) return;

  const month = mesFiltrado || mesActual;
  const [anio, mesNum] = month.split("-").map(Number);
  const diasMes = new Date(anio, mesNum, 0).getDate();
  const labels = Array.from({ length: diasMes }, (_, i) => i + 1);
  const datosGastos = Array(diasMes).fill(0);
  const datosBeneficios = Array(diasMes).fill(0);

  const gastosAMostrar = month === mesActual
    ? gastos
    : JSON.parse(localStorage.getItem(`gastos_${month}`)) || [];

  gastosAMostrar.forEach(g => {
    if (g.fecha && g.fecha.startsWith(month)) {
      const dia = parseInt(g.fecha.slice(-2), 10) - 1;
      if (dia >= 0 && dia < diasMes) {
        if (g.tipo === "gasto") datosGastos[dia] += g.importe;
        else datosBeneficios[dia] += g.importe;
      }
    }
  });

  const canvas = document.getElementById("graficoDiario");
  if (typeof Chart === 'undefined') { startEmptyAnim(canvas, "Cargando gráficos…"); return; }

  const noData = datosGastos.every(v => v === 0) && datosBeneficios.every(v => v === 0);
  if (noData) {
    if (chartDiario) chartDiario.destroy();
    startEmptyAnim(canvas, "No hay datos para este mes");
    return;
  }

  stopEmptyAnim(canvas);

  const ctx = canvas.getContext("2d");
  if (chartDiario) chartDiario.destroy();

  const isDark = body.classList.contains('dark');
  const tickColor = isDark ? '#fff' : '#000';

  chartDiario = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Gastos", data: datosGastos, backgroundColor: "#e74c3c", maxBarThickness: 14 },
        { label: "Beneficios", data: datosBeneficios, backgroundColor: "#2ecc71", maxBarThickness: 14 }
      ]
    },
    options: {
      ...baseBarOpts,
      plugins: { legend: { position: "top", labels: { color: tickColor, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: tickColor, font: { size: 10 } } },
        y: { ticks: { color: tickColor, font: { size: 10 } } }
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
  const months = getAvailableMonths(); // ordenados asc
  selectMesHistorico.innerHTML = '';

  months.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    selectMesHistorico.appendChild(opt);
  });

  // Por defecto: el mes actual si existe; si no, el más reciente disponible
  if ([...selectMesHistorico.options].some(o => o.value === mesActual)) {
    selectMesHistorico.value = mesActual;
  } else if (months.length) {
    selectMesHistorico.value = months[months.length - 1];
  } else {
    selectMesHistorico.value = '';
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

  // Detén animaciones de “vacío”
  ['graficoGastos','graficoDiario','graficoHistorico'].forEach(id => {
    const c = document.getElementById(id);
    if (c) stopEmptyAnim(c);
  });

  const sec = document.getElementById("seccionHistorico");
  if (sec && sec.classList.contains("oculto")) return;

  const ctx = graficoHistoricoCanvas.getContext("2d");
  if (typeof Chart === 'undefined') { startEmptyAnim(graficoHistoricoCanvas, "Cargando gráficos…"); return; }

  if (chartHistorico) chartHistorico.destroy();

  const showNoData = () => {
    startEmptyAnim(graficoHistoricoCanvas, "No existen datos todavía");
    if (balanceHistorico) {
      balanceHistorico.textContent = "";
      balanceHistorico.style.display = "none";
      balanceHistorico.className = ''; // limpia clases de color
    }
  };

  const sel = selectMesHistorico.value || mesActual;
  const t = totalsForMonth(sel);
  if ((t.gastos ?? 0) === 0 && (t.beneficios ?? 0) === 0) { showNoData(); return; }

  stopEmptyAnim(graficoHistoricoCanvas);

  const isDark = body.classList.contains('dark');
  const tickColor = isDark ? '#fff' : '#000';

  chartHistorico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Gastos", "Beneficios"],
      datasets: [
        { label: sel, data: [t.gastos, t.beneficios], backgroundColor: ["#e74c3c", "#2ecc71"], maxBarThickness: 42 }
      ]
    },
    options: {
      ...baseBarOpts,
      plugins: { legend: { labels: { color: tickColor, font: { size: 11 } } } },
      scales: {
        x: { ticks: { color: tickColor, font: { size: 10 } } },
        y: { ticks: { color: tickColor, font: { size: 10 } } }
      }
    }
  });

  if (balanceHistorico) {
    balanceHistorico.style.display = "";
    balanceHistorico.textContent = `Balance ${sel}: ${t.balance.toFixed(2)} €`;
    setBalanceColor(balanceHistorico, t.balance);
  }
}

const reflowChartsVisible = () => {
  const mk = (filtrarMes?.value) || mesActual;

  const secPie = document.getElementById('seccionGraficoPorcentaje');
  if (secPie && !secPie.classList.contains('oculto')) {
    if (chartPorcentaje) chartPorcentaje.resize();
    else renderGraficoPorcentaje(mk);
  }

  const secDiario = document.getElementById('seccionGraficoDiario');
  if (secDiario && !secDiario.classList.contains('oculto')) {
    if (chartDiario) chartDiario.resize();
    else { setTituloGraficoDiario(mk); renderGraficoDiario(mk); }
  }

  const secHist = document.getElementById('seccionHistorico');
  if (secHist && !secHist.classList.contains('oculto')) {
    if (chartHistorico) chartHistorico.resize();
    else renderGraficoHistorico();
  }
};

window.addEventListener('resize', (() => {
  let t; 
  return () => { clearTimeout(t); t = setTimeout(reflowChartsVisible, 150); };
})(), { passive:true });

// -------------------- Render Tabla --------------------
function renderTabla() {
  tabla.innerHTML = "";
  let total = 0, gastosSum = 0;

  const filtroTerm = normalizeStr(buscarCategoria.value || "");
  const filtroMes  = (filtrarMes?.value) || mesActual;
  if (estadoVacio) estadoVacio.hidden = true;

  const gastosAMostrar = (filtroMes === mesActual) ? gastos
    : (JSON.parse(localStorage.getItem(`gastos_${filtroMes}`)) || []);

  const gastosFiltrados = gastosAMostrar.filter(g => {
    const catNorm = normalizeStr(g?.categoria || "");
    return !filtroTerm || catNorm.includes(filtroTerm);
  });

  const gastosOrdenados = gastosFiltrados.slice().sort(getSorter());

  // ---- Estado vacío
  if (gastosFiltrados.length === 0) {
    // 👇 ya está vacío arriba; no hace falta volver a vaciar
    emptyStateMsg.textContent =
      (buscarCategoria.value || "").trim()
        ? `No hay resultados para “${buscarCategoria.value}”.`
        : ((gastosAMostrar || []).length === 0
            ? "Todavía no hay movimientos este mes."
            : "No hay movimientos que coincidan.");
    if (estadoVacio) estadoVacio.hidden = false;

    totalEl.textContent = `Balance: 0.00 €`;
    totalEl.style.color = "";
    alertaPresupuesto.textContent = "";
    alertaPresupuesto.classList.remove("show");

    requestAnimationFrame(() => refreshDashboards(filtroMes));
    populateSelectHistorico();
    updateSortUI();
    return;
  }

  // ---- Render filas (con fragment)
  const frag = document.createDocumentFragment();
  let rowCount = 0;

  gastosOrdenados.forEach((gasto) => {
    const fila = document.createElement("tr");
    fila.classList.add("fade-in");
    fila.dataset.id = gasto.id;
    fila.classList.add(gasto.tipo === "gasto" ? "gasto" : "beneficio");

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
    `;
    const tdAcc = document.createElement('td');
    tdAcc.className = 'acciones';

    const bEdit = document.createElement('button');
    bEdit.className = 'editar';
    bEdit.type = 'button';
    bEdit.title = 'Editar'; 
    bEdit.setAttribute('aria-label','Editar');
    bEdit.dataset.id = String(gasto.id);
    bEdit.dataset.month = gasto.fecha.slice(0,7);
    bEdit.textContent = '✏️';

    const bDel = document.createElement('button');
    bDel.className = 'eliminar';
    bDel.type = 'button';
    bDel.title = 'Eliminar';  
    bDel.setAttribute('aria-label','Eliminar');
    bDel.dataset.id = String(gasto.id);
    bDel.dataset.month = gasto.fecha.slice(0,7);
    bDel.textContent = '🗑️';

    tdAcc.append(bEdit, bDel);
    fila.appendChild(tdAcc);

    // 👉 Swipe solo en móvil/tablet (ahorras oyentes en desktop)
    if (isSwipeEnabled()) makeRowSwipeable(fila, gasto);

    frag.appendChild(fila);
    rowCount++;

    if (gasto.tipo === "gasto") { total -= gasto.importe; gastosSum += gasto.importe; }
    else { total += gasto.importe; }
  });

  tabla.appendChild(frag);
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
  requestAnimationFrame(() => refreshDashboards(filtroMes));
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
  if (!row) return;
  const monthKey = String(gasto.fecha || '').slice(0,7);

  let startX=0, startY=0, dx=0, dy=0, active=false, decided=false, moved=false;

  function reset(animated = true){
    row.style.transition = animated ? 'transform .18s ease' : '';
    row.style.transform = 'translateX(0)';
    row.classList.remove('swiping','show-left','show-right','swipeable');
    if (animated) setTimeout(() => { row.style.transition = ''; }, 180);
  }

  function onStart(x, y){
    startX = x; startY = y;
    dx = 0; dy = 0;
    moved = false;
    decided = false;
    active = true;
    row.classList.add('swiping','swipeable');
    row.style.transition = ''; // sin transición durante el arrastre
  }

  function onMove(x, y, preventDefault){
    if (!active) return;
    dx = x - startX;
    dy = y - startY;

    if (!decided){
      const absx = Math.abs(dx), absy = Math.abs(dy);
      // no activar swipe hasta que se mueva algo en X y no sea gesto vertical
      if (!moved && (absx < 6 || absx < absy)) return;
      moved = true;

      const angle = Math.atan2(absy, absx) * 180 / Math.PI;
      if (angle < SWIPE_ANGLE_MAX){
        decided = true;
        preventDefault?.(); // bloquea scroll vertical
      } else {
        active = false;     // gesto vertical → cancela
        reset(false);
        return;
      }
    }

    const t = Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, dx));
    row.style.transform = `translateX(${t}px)`;
    row.classList.toggle('show-left',  t < -16); // pista eliminar
    row.classList.toggle('show-right', t >  16); // pista editar
  }

  async function onEnd(){
    if (!active) return;
    active = false;
    row.classList.remove('swiping');

    if (dx <= -SWIPE_THRESHOLD){
  reset(true);
  eliminarGastoPorId(gasto.id, monthKey); // confirma internamente
  return;
}

    if (dx >= SWIPE_THRESHOLD){
      // → editar
      reset(true);
      await editarGastoPorId(gasto.id, monthKey);
      return;
    }

    // click sin swipe → sin animación (evita “salto”)
    reset(false);
  }

  const supportsPointer = 'onpointerdown' in window;

  if (supportsPointer){
    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button')) return; // no activar swipe si clicas un botón
      onStart(e.clientX, e.clientY);
      row.setPointerCapture?.(e.pointerId);
    });
    row.addEventListener('pointermove', (e) => {
      onMove(e.clientX, e.clientY, () => e.preventDefault());
    }, { passive:false });
    row.addEventListener('pointerup', onEnd);
    row.addEventListener('pointercancel', () => { active=false; reset(false); });
  } else {
    // Fallback táctil (iOS viejos)
    row.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      const t = e.changedTouches[0];
      onStart(t.clientX, t.clientY);
    }, { passive:true });
    row.addEventListener('touchmove', (e) => {
      const t = e.changedTouches[0];
      onMove(t.clientX, t.clientY, () => e.preventDefault());
    }, { passive:false });
    row.addEventListener('touchend', onEnd, { passive:true });
    row.addEventListener('touchcancel', () => { active=false; reset(false); }, { passive:true });
  }
}

// Brillo que sigue el ratón en los botones del overlay
document.addEventListener('pointermove', (e) => {
  const btn = e.target.closest('#updCard .upd-actions .upd-btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
  btn.style.setProperty('--my', `${e.clientY - r.top}px`);
});

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
  const ok = await appConfirm({
    title: "Eliminar movimiento",
    message: "Se eliminará el movimiento. Podrás deshacerlo desde el aviso.",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    variant: "danger"
  });
  if (!ok) return;

  // ▶️ Rebusca SIEMPRE el gasto “fresco”
  const ref0 = getMonthArrayRef(monthKey);
  let idx0 = ref0.arr.findIndex(g => String(g.id) === String(id));
  if (idx0 === -1) { renderTabla(); return; }
  const snapshot = ref0.arr[idx0]; // copia para el toast (por si cambia idx)

  const ejecutarBorrado = () => {
    // Recalcula ref/idx justo al ejecutar el borrado (estado actual)
    const ref = getMonthArrayRef(monthKey);
    const idx = ref.arr.findIndex(g => String(g.id) === String(id));
    if (idx === -1) { renderTabla(); return; }

    const eliminado = ref.arr[idx];
    ref.arr.splice(idx, 1);
    ref.save();
    renderTabla();

    showToast('Movimiento eliminado', {
      type: 'success',
      duration: 3500,
      actionText: 'Deshacer',
      onAction: () => {
        const mk = monthKeyOf(eliminado.fecha) || monthKey;
        const refBack = getMonthArrayRef(mk);
        const reIdx = Math.min(idx, refBack.arr.length);
        refBack.arr.splice(reIdx, 0, eliminado);
        refBack.save();

        const catKey = capitalizeFirst((eliminado.categoria || "").trim());
        maybeToastBudgetBackUnder(catKey, mk, eliminado.importe, eliminado.tipo);

        renderTabla();
        scrollToRowById(eliminado.id);
        showToast('Eliminación deshecha', { type: 'info', duration: 1600 });
      }
    });
  };

  // 🔄 Animación opcional de salida si existe la fila
  const row = tabla.querySelector(`tr[data-id="${cssEscape(id)}"]`);
  if (row) {
  row.classList.add('fade-out');
  const cs = getComputedStyle(row);
  const hasAnim = cs.animationName !== 'none' && parseFloat(cs.animationDuration) > 0;

  let _fired = false;
  const finish = () => { if (_fired) return; _fired = true; ejecutarBorrado(); };

  if (hasAnim) {
    const fallback = setTimeout(finish, 600);
    row.addEventListener('animationend', () => { clearTimeout(fallback); finish(); }, { once: true });
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
  scrollTopIfDesktop();
  showToast('Datos cargados para editar', { type: 'info', duration: 2200 });
}


// Delegación de eventos para botones editar/eliminar
if (tabla) {
  tabla.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const month = btn.dataset.month || (filtrarMes.value || mesActual);
    if (btn.classList.contains('editar')) editarGastoPorId(id, month);
    else if (btn.classList.contains('eliminar')) eliminarGastoPorId(id, month);
  });
}

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

  // ⚠️ Confirmación por presupuesto MENSUAL (global) antes de guardar
// ⚠️ Confirmación por presupuesto MENSUAL (global) antes de guardar
if (tipo === 'gasto') {
  const presuMensual = parseFloat(presupuestoInput?.value || localStorage.getItem("presupuesto") || "0") || 0;
  if (presuMensual > 0) {
    const monthKey = fecha.slice(0, 7);
    const t = totalsForMonth(monthKey);
    const willGastos = (Number(t.gastos) || 0) + (Number(importe) || 0);
    if (willGastos > presuMensual) {
      const [yy, mm] = monthKey.split("-").map(Number);
      const etiquetaMes = new Date(yy, mm - 1, 1)
        .toLocaleDateString("es-ES", { month: "long", year: "numeric" });
      const okMes = await appConfirm({
        title: "Presupuesto mensual superado",
        message: `Con este gasto superarías tu presupuesto mensual global en ${etiquetaMes} (${willGastos.toFixed(2)}€ / ${presuMensual.toFixed(2)}€). ¿Añadir igualmente?`,
        confirmText: "Añadir",
        cancelText: "Cancelar",
        variant: "danger"
      });
      if (!okMes) return;
    }
  }
}

  // ⚠️ AVISO si el gasto supera el presupuesto de su categoría en ese mes
  const budgetKey = (tipo === 'gasto') ? findBudgetKey(categoria) : null;

if (budgetKey) {
  const monthKey = fecha.slice(0, 7);
  const spentMap = getSpentByCategory(monthKey);
  const used = Number(
    spentMap[budgetKey] ??
    spentMap[capitalizeFirst(budgetKey)] ?? 0
  );
  const lim = Number(catBudgets[budgetKey] || 0);
  const willBe = used + (Number(importe) || 0);

  if (willBe > lim) {
    const [yy, mm] = monthKey.split("-").map(Number);
    const etiquetaMes = new Date(yy, mm - 1, 1)
      .toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    const ok = await appConfirm({
      title: "Presupuesto superado",
      message: `Al introducir este gasto, tu presupuesto mensual en ${capitalizeFirst(budgetKey)} se verá superado para ${etiquetaMes} (${willBe.toFixed(2)}€ / ${lim.toFixed(2)}€). ¿Añadir igualmente?`,
      confirmText: "Añadir",
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
    // tras crear `rule` (rid, tipo, categoria, importe, startDate = fecha, freq)
const mk = fecha.slice(0, 7);
let firstDate = null;

if (rule.freq === "semanal") {
  // El startDate es el propio primer vencimiento
  firstDate = fecha;
} else if (rule.freq === "anual") {
  firstDate = dueDateForYearly(rule, mk);     // mismo mes que startDate
} else { // mensual (por defecto)
  firstDate = dueDateForMonthly(rule, mk);
}

if (firstDate) {
  recurrentsApplied.add(`${rid}|${firstDate}`);
  saveRecurrentsApplied();
}
  }

  // Desmarcar y deshabilitar selector para la siguiente entrada
if (recurrenteChk){
  recurrenteChk.checked = false;
  if (recurrenteFreq) recurrenteFreq.disabled = true;
}

  // Ajustar filtros y UI
  if (filtrarMes) filtrarMes.value = fecha.slice(0, 7);
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


function isSwipeEnabled(){
  return (navigator.maxTouchPoints || 0) > 0; // solo táctiles reales
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

  btn.addEventListener('click', () => {
    if (isMobileLike()) openQuickAddSheet();
    else {
      // Desktop: ir al formulario original y enfocar
      document.querySelectorAll('main section').forEach(s => s.classList.add('oculto'));
      document.getElementById('seccionFormulario')?.classList.remove('oculto');
      scrollTopIfDesktop();
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

  // Focus trap: Tab y Shift+Tab dentro del sheet
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

  formQA.addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = String(inpCat.value || '').replace(/\s+/g,' ').trim();
    const imp = parseFloat(inpImp.value);
    const tipoSel = inpTipo.value === 'beneficio' ? 'beneficio' : 'gasto';

    if (!cat){ showToast('La categoría no puede estar vacía.', { type:'error' }); return; }
    if (!isFinite(imp) || imp <= 0){ showToast('Importe inválido.', { type:'error' }); return; }

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
    (form.requestSubmit ? form.requestSubmit() : form.submit());
  });

  // Exponer funciones
  window.openQuickAddSheet = openQA;
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
applyBottomNavMode();

// Generador de IDs únicos
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,9);
}

// -------------------- Presupuesto --------------------
  presupuestoInput?.addEventListener("change", () => {
  presupuesto = parseFloat(presupuestoInput.value) || 0;
  localStorage.setItem("presupuesto", presupuesto);
  renderTabla();
  // Onboarding: marcar "presupuesto"
  if (presupuesto > 0) markOnboardStep('presupuesto');
});

// -------------------- Filtros --------------------
buscarCategoria?.addEventListener("input", renderTabla);
filtrarMes?.addEventListener("input", () => {
  _lastCatPct.clear();
  _lastCatStatus.clear();
  renderTabla();
  setTituloGraficoDiario();
  scrollTopIfDesktop();
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

exportCSVBtn?.addEventListener("click", () => {
  const SEP = (1.1).toLocaleString().includes(",") ? ";" : ",";
  const lines = [ ["Tipo","Categoría","Importe","Fecha"].join(SEP) ];

  combinarGastos().forEach(g => {
    lines.push([ g.tipo, g.categoria, g.importe, g.fecha ].map(csvEscape).join(SEP));
  });

  const csv = lines.join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gastos.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast("CSV exportado", { type:"info", duration:1600 });
});

exportJSONBtn?.addEventListener("click", () => {
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

importJSONInput?.addEventListener("change", e => {
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
    const importe = round2(g?.importe);
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
        const firma = `${tipo}|${categoria.toLowerCase()}|${round2(importe)}|${fecha}`;

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
      populateSelectHistorico();

      const extras = Array.isArray(datos) ? '' : ' + reglas + presupuestos';
      showToast(`Importación OK (${insertados} movimientos${extras})`, { type: "success" });
    } catch {
      showToast("Archivo inválido", { type: "error" });
    }
  };
  reader.readAsText(file);
  importJSONInput.value = "";
});

// -------------------- Dark Mode --------------------
toggleDarkBtn?.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("darkMode", body.classList.contains("dark"));
  if (darkIcon) darkIcon.textContent = body.classList.contains("dark") ? "☀️" : "🌙";

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

    const cRecur = document.getElementById('recurEmptyCanvas');
if (cRecur){
  stopEmptyAnim(cRecur);
  startEmptyAnim(cRecur, 'No hay reglas recurrentes guardadas.');
}
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
  if (!menu || !menuToggle) return;
  isMenuOpen = true;
  syncMenuActiveToVisible();
  menu.classList.add("menu-abierto");
  menuToggle.classList.add("abierto");
  menuToggle.setAttribute("aria-expanded","true");
  document.body.classList.add('menu-open');
  menuOverlay.classList.add('show');
  positionMenuPanel();
  requestAnimationFrame(() => {
  const first = menu.querySelector('li[tabindex], li[role="button"]') || menu;
  first.setAttribute?.('tabindex','0');
  first.focus?.();
});
}

window.addEventListener('scroll', positionMenuPanel, { passive:true });
window.addEventListener('resize', positionMenuPanel);

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

menuToggle?.addEventListener("click", () => {
  isMenuOpen ? closeMenu() : openMenu();
});

// Accesibilidad: cerrar con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) closeMenu();
});

// Cerrar tocando fuera
menuOverlay.addEventListener('click', closeMenu);

// Items del menú
// -------------------- Menú hamburguesa: listeners de items --------------------
if (menu) {
  menu.querySelectorAll("li").forEach(item => {
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');

    item.addEventListener("click", () => {
  const seccionId = item.dataset.section;
  if (!seccionId) return;

  // Activo visual
  document.querySelectorAll('#menu li').forEach(li => li.classList.remove('active'));
  item.classList.add('active');

  // Cerrar menú y cambiar de sección usando la función única (sin reflows dobles)
  closeMenu?.();
  selectSection(seccionId);

  // Onboarding / títulos
  const mesSel = filtrarMes.value || mesActual;
  if (seccionId === "seccionGraficoPorcentaje" || seccionId === "seccionGraficoDiario") {
    markOnboardStep('graficos');
  }
});

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });
}

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

function ensureChartWrappers(){
  ['graficoGastos','graficoDiario','graficoHistorico'].forEach(id=>{
    const c = document.getElementById(id);
    if (!c || c.parentElement?.classList.contains('chartbox')) return;
    const box = document.createElement('div');
    box.className = 'chartbox';
    c.parentNode.insertBefore(box, c);
    box.appendChild(c);
  });
}

// -------------------- Inicial --------------------
populateSelectHistorico();
if (selectMesHistorico){
  selectMesHistorico.addEventListener('change', renderGraficoHistorico);
}

ensureChartWrappers();
setTituloGraficoDiario();
renderTabla();
setupSortingUI();
refreshCategorySuggestions();
renderCatBudgets();
checkRecurrentsReminder();