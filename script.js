/******************************************************
 * SISTEMA DE BOLETAS CON AIRTABLE - GITHUB HOSTING
 * ----------------------------------------------------
 * Conecta tu formulario HTML con Airtable sin servidor.
 * Creado para el proyecto "BingoBoletas"
 ******************************************************/

// 🔧 CONFIGURACIÓN: Pega tus propios datos
const AIRTABLE_TOKEN = "patxXCUwpAQQsjcPtXXXXXXXX"; // 👈 Tu token aquí (manténlo privado)
const BASE_ID = "appIKMp7KAYZPfmgX";                // 👈 Tu ID de base
const TABLE_NAME = "Listado de boletas";            // 👈 Nombre exacto de tu tabla en Airtable

// 🚀 URL base de la API
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

// ======= ELEMENTOS DEL DOM =======
const form = document.getElementById("boletaForm");
const mensaje = document.getElementById("mensaje");
const tablaBody = document.querySelector("#tablaBoletas tbody");
const btnRecargar = document.getElementById("recargar");
const filtroGrupo = document.getElementById("filtroGrupo");
const filtroTipo = document.getElementById("filtroTipo");
const filtroEstado = document.getElementById("filtroEstado");

let todasLasBoletas = [];

// ======= FUNCIÓN: Registrar nueva boleta =======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.grupo || !data.numero) {
    mensaje.textContent = "⚠️ Debes llenar Grupo y Número.";
    return;
  }

  mensaje.textContent = "Guardando en Airtable...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Grupo": data.grupo,
          "Número": Number(data.numero),
          "Comprador": data.comprador,
          "Teléfono": data.telefono,
          "Vendedor": data.vendedor,
          "Estado": data.estado,
          "Tipo": data.tipo,
          "Fecha": new Date().toISOString()
        }
      })
    });

    const result = await res.json();
    if (result.error) throw new Error(result.error.message);

    mensaje.textContent = "✅ Boleta guardada correctamente";
    form.reset();
    cargarBoletas();

  } catch (err) {
    console.error("Error:", err);
    mensaje.textContent = "❌ Error al guardar en Airtable";
  }
});

// ======= FUNCIÓN: Cargar boletas existentes =======
async function cargarBoletas() {
  tablaBody.innerHTML = "<tr><td colspan='9'>Cargando...</td></tr>";

  try {
    const res = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await res.json();

    todasLasBoletas = data.records.map(r => ({
      id: r.id,
      grupo: r.fields.Grupo || "",
      numero: r.fields.Número || "",
      comprador: r.fields.Comprador || "",
      telefono: r.fields.Teléfono || "",
      vendedor: r.fields.Vendedor || "",
      estado: r.fields.Estado || "",
      tipo: r.fields.Tipo || "",
      fecha: r.fields.Fecha ? new Date(r.fields.Fecha).toLocaleString() : ""
    }));

    mostrarBoletas(todasLasBoletas);
    mensaje.textContent = "✅ Datos cargados correctamente";
  } catch (err) {
    console.error("Error al cargar:", err);
    tablaBody.innerHTML = "<tr><td colspan='9'>⚠️ Error al cargar datos</td></tr>";
    mensaje.textContent = "❌ No se pudieron obtener los datos";
  }
}

// ======= FUNCIÓN: Mostrar boletas en tabla =======
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
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.grupo}</td>
      <td>${r.numero}</td>
      <td>${r.comprador}</td>
      <td>${r.telefono}</td>
      <td>${r.vendedor}</td>
      <td>${r.estado}</td>
      <td>${r.tipo}</td>
      <td>${r.fecha}</td>
    `;
    tablaBody.appendChild(tr);
  });
}

// ======= EVENTOS =======
[filtroGrupo, filtroTipo, filtroEstado].forEach(el =>
  el.addEventListener("input", () => mostrarBoletas(todasLasBoletas))
);

btnRecargar.addEventListener("click", cargarBoletas);
window.addEventListener("load", cargarBoletas);
