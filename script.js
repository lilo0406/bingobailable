const scriptURL = "https://script.google.com/macros/s/AKfycbx9b0IWIYrU-luq3wjPKij6Q_ldUB8st0iW6CX37to1R1TPNzhoJHxeMwiT7KwE5dh0KA/exec";
const sheetURL  = "https://docs.google.com/spreadsheets/d/1kXXXXXXXXXXXXXX/edit#gid=0"; // <- pega aquí el enlace de tu hoja

const form = document.getElementById("boletaForm");
const mensaje = document.getElementById("mensaje");
const tablaBody = document.querySelector("#tablaBoletas tbody");
const btnExportar = document.getElementById("exportar");
const btnRecargar = document.getElementById("recargar");

const filtroGrupo = document.getElementById("filtroGrupo");
const filtroTipo = document.getElementById("filtroTipo");
const filtroEstado = document.getElementById("filtroEstado");

let todasLasBoletas = [];

// Registrar boleta
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  mensaje.textContent = "Registrando...";
  try {
    const res = await fetch(scriptURL, { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();
    mensaje.textContent = result.message || "✅ Boleta registrada.";
    form.reset();
    cargarBoletas();
  } catch {
    mensaje.textContent = "⚠️ Error al registrar.";
  }
});

// Cargar boletas
async function cargarBoletas() {
  tablaBody.innerHTML = "<tr><td colspan='9'>Cargando...</td></tr>";
  try {
    const res = await fetch(scriptURL);
    todasLasBoletas = await res.json();
    mostrarBoletas(todasLasBoletas);
  } catch {
    tablaBody.innerHTML = "<tr><td colspan='9'>⚠️ Error al cargar datos</td></tr>";
  }
}

function mostrarBoletas(data) {
  tablaBody.innerHTML = "";
  const g = filtroGrupo.value.toLowerCase();
  const t = filtroTipo.value;
  const e = filtroEstado.value;

  const filtradas = data.filter(r =>
    r.grupo.toLowerCase().includes(g) &&
    (t ? r.tipo === t : true) &&
    (e ? r.estado === e : true)
  );

  if (!filtradas.length) {
    tablaBody.innerHTML = "<tr><td colspan='9'>No hay resultados</td></tr>";
    return;
  }

  filtradas.forEach(r => {
    const tr = document.createElement("tr");
    Object.values(r).forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    tablaBody.appendChild(tr);
  });
}

// Filtros
[filtroGrupo, filtroTipo, filtroEstado].forEach(el =>
  el.addEventListener("input", () => mostrarBoletas(todasLasBoletas))
);

// Exportar a Excel (abre el Sheet directamente)
btnExportar.addEventListener("click", () => {
  window.open(sheetURL, "_blank");
});

// Recargar
btnRecargar.addEventListener("click", cargarBoletas);
window.addEventListener("load", cargarBoletas);
