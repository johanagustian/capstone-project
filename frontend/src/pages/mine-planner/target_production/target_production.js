import "../../../style/mine-planner/production.css";
import { handleLogout } from "../../utils/logout.js";

// Endpoint API Blending Plan
const API_PLAN_BASE = "http://localhost:3000/blending-plans";

async function fetchPlanData() {
  try {
    const response = await fetch(API_PLAN_BASE);
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
    console.error("Fetch Blending Plan Error:", error);
    document.getElementById(
      "production-table-body"
    ).innerHTML = `<tr><td colspan="8" class="py-4 text-center text-red-600">GAGAL: ${error.message} (Pastikan Backend berjalan di port 3000 dan endpoint /blending-plans tersedia!)</td></tr>`;
    return [];
  }
}

async function deletePlanApi(id) {
  try {
    const response = await fetch(`${API_PLAN_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.message ||
          `Gagal menghapus Rencana ID ${id}. Status: ${response.status}`
      );
    }
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

async function renderProductionTable() {
  const tableBody = document.getElementById("production-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="8" class="py-4 text-center text-gray-500">Memuat data Rencana Produksi...</td></tr>';

  const plans = await fetchPlanData();

  tableBody.innerHTML = "";

  if (plans.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="8" class="py-4 text-center text-gray-500">Tidak ada data Rencana Produksi.</td></tr>';
    return;
  }

  plans.forEach((plan) => {
    const row = document.createElement("tr");

    const getApprovalBadge = (isApproved) => {
      const text = isApproved === 1 ? "SETUJU" : "PENDING";
      const color = isApproved === 1 ? "presence-Hadir" : "presence-Absen";
      return `<span class="presence-badge ${color}">${text}</span>`;
    };

    row.innerHTML = `
            <td class="py-2 px-4 border-b">${plan.plan_week}</td>
            <td class="py-2 px-4 border-b">${plan.plan_year}</td>
            <td class="py-2 px-4 border-b">${plan.target_tonnage_weekly.toLocaleString(
              "id-ID"
            )}</td>
            <td class="py-2 px-4 border-b">${plan.target_calori} kcal/kg</td>
            <td class="py-2 px-4 border-b">${plan.target_ash_max} %</td>
            <td class="py-2 px-4 border-b">${getApprovalBadge(
              plan.is_approved_mine
            )}</td>
            <td class="py-2 px-4 border-b">${getApprovalBadge(
              plan.is_approved_shipping
            )}</td>
            <td class="py-2 px-4 border-b text-right action-buttons">
                <button onclick="window.handleEdit(${
                  plan.id
                })" class="text-blue-600 hover:text-blue-800 text-sm btn-edit">Edit</button>
                <button onclick="window.handleDelete(${
                  plan.id
                })" class="text-red-600 hover:text-red-800 text-sm btn-hapus">Hapus</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Handler functions yang diakses dari tombol HTML
window.handleEdit = (id) => {
  alert(`Simulasi: Membuka formulir Edit untuk Rencana Produksi ID ${id}`);
};

window.handleDelete = async (id) => {
  if (confirm(`Apakah Anda yakin ingin menghapus Rencana Produksi ID ${id}?`)) {
    const success = await deletePlanApi(id);
    if (success) {
      alert(`Rencana Produksi ID ${id} berhasil dihapus.`);
      renderProductionTable();
    }
  }
};

window.handleAddNew = () => {
  document.getElementById("add-new-btn").addEventListener("click", () => {
    alert(
      "Simulasi: Membuka formulir tambah Rencana Produksi baru. (API POST)"
    );
  });
};

// Inisialisasi setelah DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderProductionTable();

  // Attach event handlers
  window.handleAddNew();

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
