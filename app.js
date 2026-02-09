const API_URL = "https://698a177dc04d974bc6a153aa.mockapi.io/api/v1/dispositivos_IoT";

const tableBody = document.getElementById("devicesTable");
const form = document.getElementById("deviceForm");
const modal = new bootstrap.Modal(document.getElementById("deviceModal"));

const direccionSelect = document.getElementById("direccionCode");
const direccionTexto = document.getElementById("direccionTexto");

const DIRECCIONES = {
  1: "Adelante",
  2: "Detener",
  3: "Atrás",
  4: "Vuelta derecha adelante",
  5: "Vuelta izquierda adelante",
  6: "Vuelta derecha atrás",
  7: "Vuelta izquierda atrás",
  8: "Giro 90° derecha",
  9: "Giro 90° izquierda"
};

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", () => {
  cargarDirecciones();
  obtenerDispositivos();
});

// ---------------- DIRECCIONES ----------------
function cargarDirecciones() {
  direccionSelect.innerHTML = `<option value="">Seleccione...</option>`;
  Object.entries(DIRECCIONES).forEach(([key, value]) => {
    direccionSelect.innerHTML += `<option value="${key}">${value}</option>`;
  });
}

direccionSelect.addEventListener("change", () => {
  direccionTexto.value = DIRECCIONES[direccionSelect.value] || "";
});

// ---------------- CRUD ----------------
async function obtenerDispositivos() {
  const res = await fetch(API_URL);
  const data = await res.json();

  tableBody.innerHTML = "";
  data.forEach(d => {
    tableBody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.deviceName}</td>
        <td>${d.direccionTexto}</td>
        <td>${d.ipClient}</td>
        <td>${new Date(d.dateTime).toLocaleString()}</td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm me-2" onclick='editar(${JSON.stringify(d)})'>✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar('${d.id}')">🗑️</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("deviceId").value;
  const payload = {
    deviceName: document.getElementById("deviceName").value,
    direccionCode: Number(direccionSelect.value),
    direccionTexto: direccionTexto.value,
    dateTime: new Date().toISOString()
  };

  const options = {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };

  const url = id ? `${API_URL}/${id}` : API_URL;
  await fetch(url, options);

  modal.hide();
  form.reset();
  obtenerDispositivos();
});

function editar(d) {
  document.getElementById("deviceId").value = d.id;
  document.getElementById("deviceName").value = d.deviceName;
  direccionSelect.value = d.direccionCode;
  direccionTexto.value = d.direccionTexto;

  modal.show();
}

async function eliminar(id) {
  if (!confirm("¿Eliminar dispositivo?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  obtenerDispositivos();
}
