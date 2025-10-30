// === CONFIGURACIÓN DE AIRTABLE ===
const AIRTABLE_BASE_ID = "appIKMp7KAYZPfmgX";
const AIRTABLE_TABLE = "listado de boletas"; // 👈 nombre exacto, todo en minúsculas
const AIRTABLE_TOKEN = "patxKJLnk8XGcJ5HW.f6093a2b1ac7a85b7bac052ee19692ddc6992a07cd34134a4b873de8be32b6ea";

// === GUARDAR BOLETA ===
document.getElementById("boletaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    fields: {
      Grupo: form.grupo.value,
      Numero: form.numero.value,
      Comprador: form.comprador.value,
      Telefono: form.telefono.value,
      Vendedor: form.vendedor.value,
      Estado: form.estado.value,
      Tipo: form.tipo.value
    }
  };

  try {
    const resp = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("Error al guardar los datos");
    alert("✅ Boleta registrada correctamente");
    form.reset();
    cargarBoletas();
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error al guardar los datos");
  }
});

// === CARGAR BOLETAS ===
async function cargarBoletas() {
  try {
    const resp = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_TOKEN}` }
    });

    if (!resp.ok) throw new Error("Error al obtener datos");

    const data = await resp.json();
    const tbody = document.querySelector("#tablaBoletas tbody");
    tbody.innerHTML = "";

    data.records.forEach(record => {
      const f = record.fields;
      const row = `
        <tr>
