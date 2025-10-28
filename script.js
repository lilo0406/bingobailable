const valorBoleta = 50000;
let boletas = JSON.parse(localStorage.getItem("boletas")) || [];

document.getElementById("formBoleta").addEventListener("submit", (e) => {
  e.preventDefault();

  const numero = parseInt(document.getElementById("numero").value);
  const vendedor = document.getElementById("vendedor").value;
  const comprador = document.getElementById("comprador").value;
  const telefono = document.getElementById("telefono").value;

  if (numero < 1 || numero > 1000) {
    alert("Número de boleta fuera del rango (1-1000)");
    return;
  }

  const existente = boletas.find((b) => b.numero === numero);
  if (existente) {
    alert("Esa boleta ya fue registrada.");
    return;
  }

  const boleta = { numero, vendedor, comprador, telefono, vendida: "Sí" };
  boletas.push(boleta);
  localStorage.setItem("boletas", JSON.stringify(boletas));

  actualizarTabla();
  e.target.reset();
  alert("✅ Boleta registrada correctamente.");
});

function buscarBoleta() {
  const num = parseInt(document.getElementById("buscarNumero").value);
  const boleta = boletas.find((b) => b.numero === num);
  const res = document.getElementById("resultadoBuscar");
  if (!boleta) {
    res.textContent = "❌ No se encontró esa boleta.";
  } else {
    res.textContent = `🎟️ Boleta N° ${boleta.numero}
Vendedor: ${boleta.vendedor}
Comprador: ${boleta.comprador}
Teléfono: ${boleta.telefono}
Vendida: ${boleta.vendida}`;
  }
}

function mostrarResumen() {
  const total = 1000;
  const vendidas = boletas.length;
  const noVendidas = total - vendidas;
  const totalRecaudado = vendidas * valorBoleta;

  const resumen = `
Total boletas: ${total}
Vendidas: ${vendidas}
No vendidas: ${noVendidas}
💰 Total recaudado: $${totalRecaudado.toLocaleString()}
`;
  document.getElementById("resumen").textContent = resumen;
}

function actualizarTabla() {
  const tbody = document.querySelector("#tablaBoletas tbody");
  tbody.innerHTML = "";
  boletas.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.numero}</td>
      <td>${b.vendedor}</td>
      <td>${b.comprador}</td>
      <td>${b.telefono}</td>
      <td>${b.vendida}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = actualizarTabla;
