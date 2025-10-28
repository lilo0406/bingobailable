// === CONFIGURACIÓN ===
const scriptURL = "https://script.google.com/macros/s/AKfycbx9b0IWIYrU-luq3wjPKij6Q_ldUB8st0iW6CX37to1R1TPNzhoJHxeMwiT7KwE5dh0KA/exec";
const sheetURL  = "https://docs.google.com/spreadsheets/d/1mGoGQXWjT3_fb2d271m8kXG8PfsLG3iD_ZLelYXWjf0/edit?gid=0#gid=0";

// Proxy para evitar CORS (funciona con GitHub Pages)
function usarProxy(url) {
  return `https://corsproxy.io/?${encodeURIComponent(url)}`;
}

// === ELEMENTOS DEL DOM ===
const form = document.getElementById("boletaForm");
const mensaje = document.getElementById("mensaje");
const tablaBody = document.querySelector("#tablaBoletas tbody");
const btnExportar = document.getElementById("exportar");
const btnRecargar = document.getElementById("recargar");

const filtroGrupo = document.getElementById("filtroGrupo");
const filtroTipo = document.getElementById("filtroTipo");
const filtroEstado = document.getElementById("filtroEstado");

let todasLasBoletas = [];

// =======================
// Registrar boleta (POST)
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.grupo || !data.numero) {
    mensaje.textContent = "⚠️ Debes llenar Grupo y Número.";
    return;
  }
  data.numero = Number(data.numero) || 0;
  mensaje.textContent = "Registrando...";

  try {
    const res = await fetch(usarProxy(scriptURL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    const result = JSON.parse(text || "{}");

    if (result.error) {
      mensaje.textContent = "⚠️ " + result.error;
    } else {
      mensaje.textContent = result.message || "✅ Boleta registrada.";
      form.reset();
      cargarBoletas();
    }
  } catch (err) {
    console.error("Error al registrar:", err);
    mensaje.textContent = "⚠️ Error al registrar. Revisa la consola.";
  }
});

// =======================
// Cargar boletas (GET)
// =======================
async function cargarBoletas() {
  tablaBody.innerHTML = "<tr><td colspan='9'>Cargando...</td></tr>";
  try {
    const res = await fetch(usarProxy(scriptURL));
    const text = await res.text();
    todasLasBoletas = JSON.parse(text);
    mostrarBoletas(todasLasBoletas);
  } catch (err) {
    console.error("Error al cargar datos:", err);
    tablaBody.innerHTML = "<tr><td colspan='9'>⚠️ Error al cargar datos</td></tr>";
    mensaje.textContent = "⚠️ Error al cargar datos. Revisa la consola.";
  }
}

// =======================
// Mostrar boletas en tabla
// =======================
function mostrarBoletas(data) {
  tablaBody.innerHTML = "";
  const g = filtroGrupo.value.toLowerCase();
  const t = filtroTipo.value;
  const e = filtroEstado.value;

  const filtradas = data.filter(r =>
    r.grupo?.toLowerCase().includes(g) &&
    (t ? r.tipo === t : true) &&
    (e ? r.estado === e : true)
  );

  if (!filtradas.length) {
    tablaBody.innerHTML = "<tr><td colspan='9'>No hay resultados</td></tr>";
    return;
  }

  filtradas.forEach(r => {
    const tr = document.createElement("tr");
    const valores = [
      r.id ?? "",
      r.grupo ?? "",
      r.numero ?? "",
      r.comprador ?? "",
      r.telefono ?? "",
      r.vendedor ?? "",
      r.estado ?? "",
      r.tipo ?? "",
      r.fecha ?? ""
    ];
    valores.forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    tablaBody.appendChild(tr);
  });
}

// =======================
// Filtros en tiempo real
// =======================
[filtroGrupo, filtroTipo, filtroEstado].forEach(el =>
  el.addEventListener("input", () => mostrarBoletas(todasLasBoletas))
);

// =======================
// Botones de acción
// =======================
btnExportar.addEventListener("click", () => {
  window.open(sheetURL, "_blank");
});

btnRecargar.addEventListener("click", cargarBoletas);

// =======================
// Cargar tabla al iniciar
// =======================
window.addEventListener("load", cargarBoletas);
