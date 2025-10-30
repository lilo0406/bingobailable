// === CONFIGURACIÓN DE AIRTABLE ===
const AIRTABLE_BASE = "appIKMp7KAYZPfmgX"; // Tu Base ID
const AIRTABLE_TABLE = "Listado de boletas"; // Nombre exacto de tu tabla
const AIRTABLE_TOKEN = "patxKJLnk8XGcJ5HW.f6093a2b1ac7a85b7bac052ee19692ddc6992a07cd34134a4b873de8be32b6ea"; // Tu token personal

const form = document.getElementById("boletaForm");
const mensaje = document.getElementById("mensaje");
const tablaBody = document.querySelector("#tablaBoletas tbody");

// === REGISTRAR BOLETA (POST) ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  mensaje.textContent = "Guardando boleta...";

  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          Grupo: data.grupo,
          Número: Number(data.numero),
          Comprador: data.comprador,
          Teléfono: data.telefono,
          Vendedor: data.vendedor,
          Estado: data.estado,
          Tipo: data.tipo
        }
      })
    });

    if (!res.ok) throw new Error("Error al guardar los datos");
    mensaje.textContent = "✅ Boleta guardada correctamente";
    form.reset();
    cargarBoletas();

  } catch (err) {
    console.error("Error:", err);
    mensaje.textContent = "⚠️ Error al guardar los datos";
  }
});

// === CARGAR BOLETAS (GET) ===
async function cargarBoletas() {
  tablaBody.innerHTML = "<tr><td colspan='7'>Cargando...</td></tr>";

  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`
      }
    });

    if (!res.ok) throw new Error("Error al obtener datos");

    const data = await res.json();
    const records = data.records || [];

    tablaBody.innerHTML = "";

    if (records.length === 0) {
      tablaBody.innerHTML = "<tr><td colspan='7'>Sin registros</td></tr>";
      return;
    }

    records.forEach(r => {
      const f = r.fields;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.Grupo || ""}</td>
        <td>${f.Número || ""}</td>
        <td>${f.Comprador || ""}</td>
        <td>${f.Teléfono || ""}</td>
        <td>${f.Vendedor || ""}</td>
        <td>${f.Estado || ""}</td>
        <td>${f.Tipo || ""}</td>
      `;
      tablaBody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error al cargar:", err);
    mensaje.textContent = "⚠️ Error al cargar los datos";
  }
}

// === CARGAR AUTOMÁTICAMENTE AL INICIAR ===
document.addEventListener("DOMContentLoaded", cargarBoletas);
