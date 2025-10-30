// === CONFIGURACIÓN ===
const AIRTABLE_TOKEN = "patxKJLnk8XGcJ5HW.f6093a2b1ac7a85b7bac052ee19692ddc6992a07cd34134a4b873de8be32b6ea";
const BASE_ID = "appIKMp7KAYZPfmgX"; // ID de tu base
const TABLE_NAME = "Listado de boletas"; // Nombre exacto de tu tabla

// === GUARDAR FORMULARIO ===
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    fields: {
      grupo: document.getElementById("grupo").value,
      numero: document.getElementById("numero").value,
      comprador: document.getElementById("comprador").value,
      telefono: document.getElementById("telefono").value,
      vendedor: document.getElementById("vendedor").value,
      estado: document.getElementById("estado").value,
      tipo: document.getElementById("tipo").value,
      fecha: new Date().toISOString()
    }
  };

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error("Error al guardar en Airtable");
    alert("✅ Boleta guardada correctamente");
    e.target.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Hubo un problema al guardar la boleta");
  }
});

// === CARGAR BOLETAS ===
async function cargarBoletas() {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await response.json();

    if (!data.records) throw new Error("No hay registros");

    const contenedor = document.getElementById("boletas");
    contenedor.innerHTML = data.records.map(record => `
      <tr>
        <td>${record.fields.grupo || ""}</td>
        <td>${record.fields.numero || ""}</td>
        <td>${record.fields.comprador || ""}</td>
        <td>${record.fields.telefono || ""}</td>
        <td>${record.fields.vendedor || ""}</td>
        <td>${record.fields.estado || ""}</td>
        <td>${record.fields.tipo || ""}</td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("Error al cargar:", error);
  }
}

// Si tienes un botón o evento para cargar:
document.getElementById("btnCargar").addEventListener("click", cargarBoletas);
