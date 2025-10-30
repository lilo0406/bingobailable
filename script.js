// === CONFIGURACIÓN ===
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/vxgap6t9t8592i2o5ofi8vr6zr9aamd1";

// === GUARDAR BOLETA ===
document.getElementById("boletaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  // Recolectar datos del formulario
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
    const resp = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("Error al enviar los datos al webhook");

    alert("✅ Boleta registrada correctamente");
    form.reset();
    cargarBoletas(); // Recargar tabla después de guardar
  } catch (err) {
    console.error("❌ Error al guardar los datos:", err);
    alert("❌ Ocurrió un error al guardar los datos");
  }
});

// === CARGAR BOLETAS DESDE MAKE ===
async function cargarBoletas() {
  try {
    // Aquí llamas a otro webhook que Make debe crear para devolver la lista de boletas (GET)
    const resp = await fetch("https://hook.us2.make.com/vxgap6t9t8592i2o5ofi8vr6zr9aamd1"); 

    if (!resp.ok) throw new Error("Error al obtener los datos");

    const data = await resp.json();
    const tbody = document.querySelector("#tablaBoletas tbody");
    tbody.innerHTML = "";

    // Asumimos que Make devuelve un array de registros con los mismos campos
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
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("❌ Error al cargar los datos:", err);
  }
}

// === INICIAR ===
document.addEventListener("DOMContentLoaded", cargarBoletas);
