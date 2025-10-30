// === CONFIGURACIÓN ===
const MAKE_WEBHOOK_SAVE_URL = "https://hook.us2.make.com/xxxxx_guardar"; // Guarda boletas
const MAKE_WEBHOOK_LIST_URL = "https://hook.us2.make.com/yyyyy_listar";  // Lista boletas

// === GUARDAR BOLETA ===
document.getElementById("boletaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    Grupo: form.grupo.value.trim(),
    Numero: form.numero.value.trim(),
    Comprador: form.comprador.value.trim(),
    Telefono: form.telefono.value.trim(),
    Vendedor: form.vendedor.value.trim(),
    Estado: form.estado.value.trim(),
    Tipo: form.tipo.value.trim(),
  };

  try {
    const resp = await fetch(MAKE_WEBHOOK_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error("Error al enviar los datos al webhook");

    alert("✅ Boleta registrada correctamente");
    form.reset();
    await cargarBoletas(); // Recargar tabla
  } catch (err) {
    console.error("❌ Error al guardar los datos:", err);
    alert("❌ Ocurrió un error al guardar los datos");
  }
});

// === CARGAR BOLETAS DESDE MAKE ===
async function cargarBoletas() {
  try {
    const resp = await fetch(MAKE_WEBHOOK_LIST_URL);
    const text = await resp.text();

    console.log("🔄 Respuesta del webhook (Make):", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ La respuesta no era JSON, se mostrará vacía");
      data = [];
    }

    const tbody = document.querySelector("#tablaBoletas tbody");
    tbody.innerHTML = "";

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
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("❌ Error al cargar los datos:", err);
  }
}

// === INICIAR ===
document.addEventListener("DOMContentLoaded", cargarBoletas);
