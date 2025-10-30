// === CONFIGURACIÓN DEL WEBHOOK DE MAKE ===
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/vxgap6t9t8592i2o5ofi8vr6zr9aamd1";

// === GUARDAR BOLETA ===
document.getElementById("boletaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    Grupo: form.grupo.value,
    Numero: form.numero.value,
    Comprador: form.comprador.value,
    Telefono: form.telefono.value,
    Vendedor: form.vendedor.value,
    Estado: form.estado.value,
    Tipo: form.tipo.value
  };

  try {
    const resp = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("Error al enviar los datos");

    alert("✅ Boleta enviada correctamente al sistema Make");
    form.reset();
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error al enviar los datos al webhook");
  }
});
