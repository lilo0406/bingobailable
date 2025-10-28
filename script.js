// =======================
// CONFIGURACIÓN
// =======================
const scriptURL = "https://script.google.com/macros/s/AKfycbx9b0IWIYrU-luq3wjPKij6Q_ldUB8st0iW6CX37to1R1TPNzhoJHxeMwiT7KwE5dh0KA/exec";
const sheetURL  = "https://docs.google.com/spreadsheets/d/1mGoGQXWjT3_fb2d271m8kXG8PfsLG3iD_ZLelYXWjf0/edit?gid=0#gid=0";

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
// HELPER: usar proxy AllOrigins
// =======================
function fetchConProxy(url, options = {}) {
  const proxyURL = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  return fetch(proxyURL, options);
}

// =======================
// REGISTRAR BOLETA (POST)
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  // Validación simple
  if (!data.grupo || !data.numero) {
    mensaje.textContent = "⚠️ Debes llenar Grupo y Número.";
    return;
  }
  data.numero = Number(data.numero) || 0;

  mensaje.textContent = "Registrando...";

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (result.error) {
      mensaje.textContent = "⚠️ " + result.error;
    } else {
      mensaje.textContent = result.message || "✅ Boleta registrada.";
      form.reset();
      cargarBoletas();
    }
  } catch (err) {
    console.error(err);
    mensaje.textContent = "⚠️ Error al registrar. Revisa la consola.";
  }
});

// =======================
// CARGAR BOLETAS (GET)
// =======================
async function cargarBoletas() {
  tablaBody.innerHTML = "<tr><td colspan='9'>Cargando...</td></tr>";
  try {
    // Usar proxy para evitar CORS
    const res = await fetchConProxy(scriptURL);
    if (!res.ok) throw new Error("No se pudo obtener la información.");
    todasLasBoletas = await res.json();
    mostrarBoletas(todasLasBoletas);
  } catch (err) {
    console.error("Error al cargar datos:", err);
    tablaBody.innerHTML = "<tr><td colspan='9'>⚠️ Error al cargar datos</td></tr>";
    mensaje.textContent = "⚠️ Error al cargar datos. Revisa la consola.";
  }
}

// =======================
// MOSTRAR BOLETAS EN TABLA
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
// FILTROS EN TIEMPO REAL
// =======================
[filtroGrupo, filtroTipo, filtroEstado].forEach(el =>
  el.addEventListener("input", () => mostrarBoletas(todasLasBoletas))
);

// =======================
// BOTONES DE ACCIÓN
// =======================
btnExportar.addEventListener("click", () => {
  window.open(sheetURL, "_blank");
});

btnRecargar.addEventListener("click", cargarBoletas);

// =======================
// CARGAR TABLA AL INICIAR
// =======================
window.addEventListener("load", cargarBoletas);
