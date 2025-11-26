import "../../../style/mine-planner/equipment.css";
import { handleLogout } from "../../utils/logout.js";

const API_EQUIPMENT_BASE = "http://localhost:3000/equipments";

async function fetchEquipmentData() {
  try {
    const response = await fetch(API_EQUIPMENT_BASE);
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: "Kesalahan API tak terduga" }));
      throw new Error(
        errorBody.message || `Failed with status: ${response.status}`
      );
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Fetch Equipment Error:", error);
    document.getElementById(
      "equipment-table-body"
    ).innerHTML = `<tr><td colspan="7" class="py-4 text-center text-red-600">GAGAL: ${error.message} (Pastikan Backend berjalan di port 3000 dan endpoint /equipments tersedia!)</td></tr>`;
    return [];
  }
}

async function deleteEquipmentApi(id) {
  try {
    const response = await fetch(`${API_EQUIPMENT_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.message ||
          `Gagal menghapus ID ${id}. Status: ${response.status}`
      );
    }
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function renderEquipmentTable() {
  const tableBody = document.getElementById("equipment-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="7" class="py-4 text-center text-gray-500">Memuat data alat berat...</td></tr>';

  const equipments = await fetchEquipmentData();

  tableBody.innerHTML = "";

  if (equipments.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="py-4 text-center text-gray-500">Tidak ada data alat berat.</td></tr>';
    return;
  }

  equipments.forEach((equipment) => {
    const row = document.createElement("tr");

    const isAvailableText =
      equipment.is_available === 1 ? "Tersedia" : "Tidak Tersedia";
    const isAvailableColor =
      equipment.is_available === 1 ? "presence-Hadir" : "presence-Absen";

    row.innerHTML = `
            <td class="py-2 px-4 border-b">${equipment.unit_id}</td>
            <td class="py-2 px-4 border-b text-sm">${equipment.type}</td>
            <td class="py-2 px-4 border-b">${equipment.location}</td>
            <td class="py-2 px-4 border-b">${equipment.status}</td>
            <td class="py-2 px-4 border-b">
                <span class="presence-badge ${isAvailableColor}">${isAvailableText}</span>
            </td>
            <td class="py-2 px-4 border-b">${equipment.productivity_rate}</td>
            <td class="py-2 px-4 border-b text-right action-buttons">
                <button onclick="window.handleEdit(${equipment.id})" class="text-blue-600 hover:text-blue-800 text-sm btn-edit">Edit</button>
                <button onclick="window.handleDelete(${equipment.id})" class="text-red-600 hover:text-red-800 text-sm btn-hapus">Hapus</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Handler functions yang diakses dari tombol HTML
window.handleEdit = (id) => {
  alert(`Simulasi: Membuka formulir Edit untuk Alat ID ${id}`);
};

window.handleDelete = async (id) => {
  if (
    confirm(`Apakah Anda yakin ingin menghapus Alat Berat dengan ID ${id}?`)
  ) {
    const success = await deleteEquipmentApi(id);
    if (success) {
      alert(`Alat Berat ID ${id} berhasil dihapus.`);
      renderEquipmentTable();
    }
  }
};

window.handleAddNew = () => {
  document.getElementById("add-new-btn").addEventListener("click", () => {
    alert("Simulasi: Membuka formulir tambah Alat Berat baru. (API POST)");
  });
};

// Inisialisasi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderEquipmentTable();

  // Attach event handlers
  window.handleAddNew();

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
