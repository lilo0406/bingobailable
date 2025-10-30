// ==============================
// ⚙️ CONFIGURACIÓN PRINCIPAL
// ==============================
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/vxgap6t9t8592i2o5ofi8vr6zr9aamd1";

// ==============================
// 📝 GUARDAR NUEVA BOLETA
// ==============================
document.getElementById("boletaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  // Recolectar datos
  const data = {
    Grupo: form.grupo.value.trim(),
    Numero: form.numero.value.trim(),
    Comprador: form.comprador.value.trim(),
    Telefono: form.telefono.value.trim(),
    Vendedor: form.vendedor.value.trim(),
    Estado: form.estado.value.trim(),
    Tipo: form.tipo.value.trim(),
  };

  // Validación mínima
  if (!data.Numero || !data.Grupo) {
    alert("⚠️ Debes ingresar al menos el grupo y el número de la boleta.");
    return;
  }

  try {
    const resp = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await resp.text();
    console.log("🔄 Respuesta del webhook (Make):", text);

    if (!resp.ok) throw new Error("Error al enviar los datos al webhook");

    alert("✅ Boleta registrada correctamente");
    form.reset();
    cargarBoletas(); // Recargar la tabla
  } catch (err) {
    console.error("❌ Error al guardar los datos:", err);
    alert("❌ Ocurrió un error al guardar la boleta");
  }
});

// ==============================
// 📦 CARGAR BOLETAS DESDE MAKE
// ==============================
async function cargarBoletas() {
  const tablaBody = document.querySelector("#tablaBoletas tbody");
  tablaBody.innerHTML = `<tr><td colspan="7">Cargando datos...</td></tr>`;

  try {
    // Debes crear un webhook GET en Make que devuelva las boletas en formato JSON
    const resp = await fetch("https://hook.us2.make.com/vxgap6t9t8592i2o5ofi8vr6zr9aamd1");

    if (!resp.ok) throw new Error("Error al obtener los datos");

    const text = await resp.text();
    console.log("📥 Respuesta Make:", text);

    let data = [];
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ La respuesta no era JSON, se mostrará vacía");
    }

    // Limpiar tabla
    tablaBody.innerHTML = "";

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((f) => {
        const row = `
          <tr>
            <td>${f.Grupo || ""}</td>
            <td>${f.Numero || ""}</td>
            <td>${f.Comprador || ""}</td>
            <td>${f.Telefono || ""}</td>
            <td>${f.Vendedor || ""}</td>
            <td>${f.Estado || ""}</td>
            <td>${f.Tipo || ""}</td>
          </tr>
        `;
        tablaBody.innerHTML += row;
      });
    } else {
      tablaBody.innerHTML = `<tr><td colspan="7">No hay boletas registradas.</td></tr>`;
    }
  } catch (err) {
    console.error("❌ Error al cargar los datos:", err);
    tablaBody.innerHTML = `<tr><td colspan="7">Error al cargar los datos</td></tr>`;
  }
}

// ==============================
// 🚀 INICIALIZAR AL CARGAR PÁGINA
// ==============================
document.addEventListener("DOMContentLoaded", cargarBoletas);
