import "../../../style/mine-planner/crew.css";
import { handleLogout } from "../../utils/logout.js";
import { getCrewData, deleteCrew } from "../../utils/api.js";


async function fetchCrewData() {
  try {
    const result = await getCrewData();
    if (!result.ok) {
      throw new Error(result.message || "Failed to fetch crews");
    }
    return result.data || [];
  } catch (error) {
    console.error("Fetch Crew Error:", error);
    document.getElementById(
      "crew-table-body"
    ).innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-600">GAGAL: ${error.message}</td></tr>`;
    return [];
  }
}

async function deleteCrewApi(id) {
  try {
    const result = await deleteCrew(id);
    if (!result.ok) {
      throw new Error(result.message || `Failed to delete crew ${id}`);
    }
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function renderCrewTable() {
  const tableBody = document.getElementById("crew-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="6" class="text-center py-4 text-gray-500">Memuat data karyawan...</td></tr>';

  const crews = await fetchCrewData();

  tableBody.innerHTML = "";

  if (crews.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data karyawan.</td></tr>';
    return;
  }

  crews.forEach((crew) => {
    const row = document.createElement("tr");

    // Menentukan warna badge kehadiran
    const getPresenceBadge = (presence) => {
      const colorMap = {
        Hadir: "presence-Hadir",
        Absen: "presence-Absen",
        Cuti: "presence-Cuti",
        Sakit: "presence-Sakit",
      };
      const colorClass = colorMap[presence] || "presence-Absen";
      return `<span class="presence-badge ${colorClass}">${presence}</span>`;
    };

    row.innerHTML = `
      <td class="py-2 px-4 border-b">${crew.nama || "-"}</td>
      <td class="py-2 px-4 border-b text-sm">${crew.competency || "-"}</td>
      <td class="py-2 px-4 border-b">${crew.current_shift || "-"}</td>
      <td class="py-2 px-4 border-b">${crew.current_unit_id || "-"}</td>
      <td class="py-2 px-4 border-b">
        ${getPresenceBadge(crew.presence)}
      </td>
      <td class="py-2 px-4 border-b text-right">
        <button onclick="handleEdit(${
          crew.id
        })" class="text-blue-600 hover:text-blue-800 text-sm mr-2">Edit</button>
        <button onclick="handleDelete(${
          crew.id
        })" class="text-red-600 hover:text-red-800 text-sm">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Handler functions
const handleEdit = (id) => {
  alert(`Simulasi: Membuka formulir Edit untuk ID ${id}`);
};

const handleDelete = async (id) => {
  if (confirm(`Apakah Anda yakin ingin menghapus kru dengan ID ${id}?`)) {
    const success = await deleteCrewApi(id);
    if (success) {
      alert(`Kru ID ${id} berhasil dihapus.`);
      renderCrewTable();
    }
  }
};

const handleAddNew = () => {
  document.getElementById("add-new-btn").addEventListener("click", () => {
    alert("Simulasi: Membuka formulir tambah karyawan baru.");
  });
};

// Export functions to global scope
window.handleEdit = handleEdit;
window.handleDelete = handleDelete;

// Inisialisasi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderCrewTable();
  handleAddNew();

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
