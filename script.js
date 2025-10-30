// === CONFIGURACIÓN ===
const API_URL = "https://api.airtable.com/v0/appIKMp7KAYZPfmgX/Listado%20de%20boletas";
const API_KEY = "patxKJLnk8XGcJ5HW.f6093a2b1ac7a85b7bac052ee19692ddc6992a07cd34134a4b873de8be32b6ea";

// === REFERENCIAS A ELEMENTOS ===
const form = document.getElementById("boletaForm");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tablaBoletas").querySelector("tbody");

// === ENVIAR FORMULARIO ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    fields: {
      grupo: form.grupo.value.trim(),
      numero: form.numero.value.trim(),
      comprador: form.comprador.value.trim(),
      telefono: form.telefono.value.trim(),
      vendedor: form.vendedor.value.trim(),
      estado: form.estado.value,
      tipo: form.tipo.value
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Error al guardar los datos");
    const result = await response.json();

    mensaje.textContent = "✅ Boleta registrada correctamente";
    mensaje.style.color = "green";
    form.reset();
    cargarBoletas(); // Actualizar lista
  } catch (error) {
    console.error("Error:", error);
    mensaje.textContent = "❌ Error al registrar la boleta";
    mensaje.style.color = "red";
  }
});

// === CARGAR BOLETAS ===
async function cargarBoletas() {
  try {
    const response = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });

    if (!response.ok) throw new Error("Error al obtener datos");

    const data = await response.json();
    tabla.innerHTML = data.records.map(r => `
      <tr>
        <td>${r.fields.grupo || ""}</td>
        <td>${r.fields.numero || ""}</td>
        <td>${r.fields.comprador || ""}</td>
        <td>${r.fields.telefono || ""}</td>
        <td>${r.fields.vendedor || ""}</td>
        <td>${r.fields.estado || ""}</td>
        <td>${r.fields.tipo || ""}</td>
        <td><button onclick="eliminarBoleta('${r.id}')">🗑️ Eliminar</button></td>
      </tr>
    `).join("");

  } catch (error) {
    console.error("Error al cargar:", error);
    mensaje.textContent = "⚠️ Error al cargar las boletas.";
    mensaje.style.color = "orange";
  }
}

// === ELIMINAR BOLETA ===
async function eliminarBoleta(id) {
  if (!confirm("¿Seguro que deseas eliminar esta boleta? ❌")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });

    if (response.ok) {
      alert("Boleta eliminada correctamente 🗑️");
      cargarBoletas();
    } else {
      const err = await response.json();
      console.error("Error al eliminar:", err);
      alert("⚠️ No se pudo eliminar la boleta.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error al conectar con Airtable.");
  }
}

// === CARGAR AUTOMÁTICAMENTE LAS BOLETAS AL INICIO ===
document.addEventListener("DOMContentLoaded", cargarBoletas);
