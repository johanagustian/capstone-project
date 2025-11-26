import "../../../style/mine-planner/pit.css";
import { handleLogout } from "../../utils/logout.js";

// Endpoint API Pit
const API_PIT_BASE = "http://localhost:3000/pits";

async function fetchPitData() {
  try {
    const response = await fetch(API_PIT_BASE);
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
    console.error("Fetch Pit Error:", error);
    document.getElementById(
      "pit-table-body"
    ).innerHTML = `<tr><td colspan="6" class="py-4 text-center text-red-600">GAGAL: ${error.message} (Pastikan Backend berjalan di port 3000 dan endpoint /pits tersedia!)</td></tr>`;
    return [];
  }
}

async function deletePitApi(id) {
  try {
    const response = await fetch(`${API_PIT_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.message ||
          `Gagal menghapus Pit ID ${id}. Status: ${response.status}`
      );
    }
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function renderPitTable() {
  const tableBody = document.getElementById("pit-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="6" class="py-4 text-center text-gray-500">Memuat data Pit...</td></tr>';

  const pits = await fetchPitData();

  tableBody.innerHTML = "";

  if (pits.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="py-4 text-center text-gray-500">Tidak ada data Pit.</td></tr>';
    return;
  }

  pits.forEach((pit) => {
    const row = document.createElement("tr");

    let geotechColor = "presence-Sakit";
    if (
      pit.geotech_status &&
      pit.geotech_status.toLowerCase().includes("stabil")
    ) {
      geotechColor = "presence-Hadir";
    } else if (
      pit.geotech_status &&
      pit.geotech_status.toLowerCase().includes("waspada")
    ) {
      geotechColor = "presence-Cuti";
    }

    let benchReadyColor = "presence-Absen";
    if (
      pit.bench_readiness &&
      pit.bench_readiness.toLowerCase().includes("siap")
    ) {
      benchReadyColor = "presence-Hadir";
    }

    row.innerHTML = `
            <td class="py-2 px-4 border-b">${pit.pit_name}</td>
            <td class="py-2 px-4 border-b">
                <span class="presence-badge ${geotechColor}">${pit.geotech_status}</span>
            </td>
            <td class="py-2 px-4 border-b">${pit.current_elevasi} m</td>
            <td class="py-2 px-4 border-b">
                <span class="presence-badge ${benchReadyColor}">${pit.bench_readiness}</span>
            </td>
            <td class="py-2 px-4 border-b text-sm">${pit.hauling_route}</td>
            <td class="py-2 px-4 border-b text-right action-buttons">
                <button onclick="window.handleEdit(${pit.id})" class="text-blue-600 hover:text-blue-800 text-sm btn-edit">Edit</button>
                <button onclick="window.handleDelete(${pit.id})" class="text-red-600 hover:text-red-800 text-sm btn-hapus">Hapus</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

window.handleEdit = (id) => {
  alert(`Simulasi: Membuka formulir Edit untuk Pit ID ${id}`);
};

window.handleDelete = async (id) => {
  if (confirm(`Apakah Anda yakin ingin menghapus Pit ID ${id}?`)) {
    const success = await deletePitApi(id);
    if (success) {
      alert(`Pit ID ${id} berhasil dihapus.`);
      renderPitTable();
    }
  }
};

window.handleAddNew = () => {
  document.getElementById("add-new-btn").addEventListener("click", () => {
    alert("Simulasi: Membuka formulir tambah Pit baru. (API POST)");
  });
};

// Inisialisasi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderPitTable();

  // Attach event handlers
  window.handleAddNew();

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
