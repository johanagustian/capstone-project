import {
  getDailyAttendance,
  getDailyAttendanceSummary,
  batchUpdateDailyAttendance,
  updateAttendance,
  getAllActiveEmployees,
  getAllEmployees,
} from "../../utils/api.js";

const API_BASE_URL = "http://localhost:3000/api";
let attendanceData = {
  attendance: [],
  scheduled: [],
  otherEmployees: [],
};
let currentDate = null;

// Initialize date pickers
function initializeDatePickers() {
  const dateSelector = document.getElementById("date-selector");
  if (dateSelector) {

    const today = new Date().toISOString().split("T")[0];
    dateSelector.value = today;
    currentDate = today;
    
    dateSelector.addEventListener("change", function() {
      currentDate = this.value;
      loadDailyAttendance();
    });
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

// toast notification
function showToast(type, title, message) {
  const toastHtml = `
    <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" 
         role="alert" style="z-index: 1060">
      <div class="d-flex">
        <div class="toast-body">
          <strong>${title}</strong><br>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", toastHtml);
  const toast = new bootstrap.Toast(document.querySelector(".toast"));
  toast.show();
  
  // Remove toast after hidden
  toast._element.addEventListener("hidden.bs.toast", function() {
    this.remove();
  });
}

// Update current time
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const timeElement = document.getElementById("current-time");
  if (timeElement) {
    timeElement.textContent = timeString;
  }
}

// Get status badge class
function getStatusBadgeClass(status) {
  switch(status) {
    case 'present': return 'badge-present';
    case 'sick': return 'badge-sick';
    case 'permission': return 'badge-permission';
    case 'absent': return 'badge-absent';
    case 'leave': return 'badge-leave';
    default: return 'bg-secondary';
  }
}

// Get schedule status badge class
function getScheduleBadgeClass(status) {
  switch(status) {
    case 'Scheduled': return 'badge-scheduled';
    case 'Not Scheduled': return 'badge-not-scheduled';
    default: return 'bg-secondary';
  }
}

// Load daily attendance
async function loadDailyAttendance() {
  if (!currentDate) {
    const today = new Date().toISOString().split("T")[0];
    currentDate = today;
    document.getElementById("date-selector").value = today;
  }

  try {
    showLoading(true);

    const response = await getDailyAttendance(currentDate);
    
    if (!response.ok) {
      throw new Error(response.message || "Failed to load attendance data");
    }

    const data = response.data;
    attendanceData = data;

    updateAttendanceStats(data);

    renderAttendanceTables(data);
    
  } catch (error) {
    console.error("Error loading daily attendance:", error);
    showToast("danger", "Error", error.message || "Failed to load attendance data");
    
    showLoading(false, true);
  }
}

// Show loading state
function showLoading(isLoading, isError = false) {
  const tbody1 = document.getElementById("recorded-attendance-body");
  const tbody2 = document.getElementById("scheduled-attendance-body");
  const tbody3 = document.getElementById("other-attendance-body");
  
  const loadingHTML = `
    <tr>
      <td colspan="7" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading attendance data...</p>
      </td>
    </tr>
  `;
  
  const errorHTML = `
    <tr>
      <td colspan="7" class="text-center py-5">
        <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
        <p class="mt-2 text-danger">Failed to load data</p>
        <button class="btn btn-sm btn-primary mt-2" onclick="loadDailyAttendance()">
          <i class="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      </td>
    </tr>
  `;
  
  if (tbody1) tbody1.innerHTML = isError ? errorHTML : (isLoading ? loadingHTML : "");
  if (tbody2) tbody2.innerHTML = isError ? errorHTML : (isLoading ? loadingHTML : "");
  if (tbody3) tbody3.innerHTML = isError ? errorHTML : (isLoading ? loadingHTML : "");
}

// Update attendance statistics
function updateAttendanceStats(data) {
  const summary = data.summary || [];
  const totalScheduled = data.total_scheduled || 0;
  
  let presentCount = 0;
  let totalCount = 0;
  
  summary.forEach(item => {
    totalCount += item.count || 0;
    if (item.attendance_status === 'present') {
      presentCount = item.count || 0;
    }
  });
  
  document.getElementById("total-employees").textContent = totalScheduled;
  document.getElementById("present-count").textContent = presentCount;
  document.getElementById("scheduled-count").textContent = totalScheduled;
  
  // Calculate attendance rate
  const attendanceRate = totalScheduled > 0 ? Math.round((presentCount / totalScheduled) * 100) : 0;
  document.getElementById("attendance-rate").textContent = `${attendanceRate}%`;
  
  // Update summary counts
  summary.forEach(item => {
    const element = document.getElementById(`${item.attendance_status}-count`);
    if (element) {
      element.textContent = item.count;
    }
  });
}

// Render attendance tables
function renderAttendanceTables(data) {
  // Render recorded attendance
  renderRecordedAttendance(data.attendance || []);
  
  // Render scheduled only
  renderScheduledAttendance(data.scheduled || []);
  
  // Render other employees
  renderOtherAttendance(data.otherEmployees || []);
}

// Render recorded attendance table
function renderRecordedAttendance(attendanceList) {
  const tbody = document.getElementById("recorded-attendance-body");
  if (!tbody) return;

  if (attendanceList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <i class="bi bi-people text-muted fs-1"></i>
          <p class="mt-2 text-muted">No recorded attendance found</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = attendanceList.map((item, index) => {
    const statusClass = getStatusBadgeClass(item.attendance_status);
    const scheduleClass = getScheduleBadgeClass(item.schedule_status);
    
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-primary"></i>
            <div>
              <strong>${item.name || "-"}</strong>
              <div class="text-muted small">
                ${item.position || "-"}
                <span class="badge ${scheduleClass} ms-2">${item.schedule_status}</span>
              </div>
            </div>
          </div>
        </td>
        <td>${item.position || "-"}</td>
        <td>
          <span class="badge ${scheduleClass}">
            ${item.schedule_status}
          </span>
        </td>
        <td>
          <select class="form-select form-select-sm attendance-status" 
                  data-employee-id="${item.employee_id}"
                  data-type="attendance">
            <option value="present" ${item.attendance_status === 'present' ? 'selected' : ''}>Present</option>
            <option value="sick" ${item.attendance_status === 'sick' ? 'selected' : ''}>Sick</option>
            <option value="permission" ${item.attendance_status === 'permission' ? 'selected' : ''}>Permission</option>
            <option value="absent" ${item.attendance_status === 'absent' ? 'selected' : ''}>Absent</option>
            <option value="leave" ${item.attendance_status === 'leave' ? 'selected' : ''}>Leave</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm attendance-remarks" 
                 data-employee-id="${item.employee_id}"
                 placeholder="Remarks..."
                 value="${item.remarks || ''}">
        </td>
        <td>
          ${item.shift_name ? `
            <div class="small">
              <i class="bi bi-clock me-1"></i>${item.shift_name}
              ${item.location_name ? `<br><i class="bi bi-geo-alt me-1"></i>${item.location_name}` : ''}
            </div>
          ` : '<span class="text-muted">-</span>'}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="saveSingleAttendance(${item.employee_id})">
            <i class="bi bi-save"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render scheduled only table
function renderScheduledAttendance(scheduledList) {
  const tbody = document.getElementById("scheduled-attendance-body");
  if (!tbody) return;

  if (scheduledList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <i class="bi bi-calendar-check text-muted fs-1"></i>
          <p class="mt-2 text-muted">No scheduled employees without attendance</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = scheduledList.map((item, index) => {
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-primary"></i>
            <div>
              <strong>${item.name || "-"}</strong>
              <div class="text-muted small">${item.position || "-"}</div>
            </div>
          </div>
        </td>
        <td>${item.position || "-"}</td>
        <td>
          <span class="badge badge-scheduled">Scheduled</span>
        </td>
        <td>
          <select class="form-select form-select-sm attendance-status" 
                  data-employee-id="${item.employee_id}"
                  data-type="scheduled">
            <option value="">-- Select Status --</option>
            <option value="present">Present</option>
            <option value="sick">Sick</option>
            <option value="permission">Permission</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm attendance-remarks" 
                 data-employee-id="${item.employee_id}"
                 placeholder="Remarks...">
        </td>
        <td>
          ${item.shift_name ? `
            <div class="small">
              <i class="bi bi-clock me-1"></i>${item.shift_name}
              ${item.location_name ? `<br><i class="bi bi-geo-alt me-1"></i>${item.location_name}` : ''}
            </div>
          ` : '<span class="text-muted">-</span>'}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="saveSingleAttendance(${item.employee_id})">
            <i class="bi bi-save"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render other employees table
function renderOtherAttendance(otherList) {
  const tbody = document.getElementById("other-attendance-body");
  if (!tbody) return;

  if (otherList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <i class="bi bi-people text-muted fs-1"></i>
          <p class="mt-2 text-muted">No other employees found</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = otherList.map((item, index) => {
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-primary"></i>
            <div>
              <strong>${item.name || "-"}</strong>
              <div class="text-muted small">${item.position || "-"}</div>
            </div>
          </div>
        </td>
        <td>${item.position || "-"}</td>
        <td>
          <span class="badge badge-not-scheduled">Not Scheduled</span>
        </td>
        <td>
          <select class="form-select form-select-sm attendance-status" 
                  data-employee-id="${item.employee_id}"
                  data-type="other">
            <option value="">-- Select Status --</option>
            <option value="present">Present</option>
            <option value="sick">Sick</option>
            <option value="permission">Permission</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm attendance-remarks" 
                 data-employee-id="${item.employee_id}"
                 placeholder="Remarks...">
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="saveSingleAttendance(${item.employee_id})">
            <i class="bi bi-save"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Save single attendance
async function saveSingleAttendance(employeeId) {
  if (!currentDate) {
    showToast("warning", "Warning", "Please select a date first");
    return;
  }

  const statusSelect = document.querySelector(`.attendance-status[data-employee-id="${employeeId}"]`);
  const remarksInput = document.querySelector(`.attendance-remarks[data-employee-id="${employeeId}"]`);
  
  if (!statusSelect || !statusSelect.value) {
    showToast("warning", "Warning", "Please select an attendance status");
    return;
  }

  const attendanceData = {
    attendance_status: statusSelect.value,
    remarks: remarksInput ? remarksInput.value : '',
  };

  try {
    await updateAttendance(currentDate, employeeId, attendanceData);
    showToast("success", "Success", "Attendance saved successfully");
    
    setTimeout(() => {
      loadDailyAttendance();
    }, 500);
    
  } catch (error) {
    console.error("Error saving attendance:", error);
    showToast("danger", "Error", error.message || "Failed to save attendance");
  }
}

// Save all attendance
async function saveAllAttendance() {
  if (!currentDate) {
    showToast("warning", "Warning", "Please select a date first");
    return;
  }

  const attendanceList = [];
  
  // Collect from all tabs
  const statusSelects = document.querySelectorAll('.attendance-status');
  statusSelects.forEach(select => {
    if (select.value) { 
      const employeeId = select.getAttribute('data-employee-id');
      const remarksInput = document.querySelector(`.attendance-remarks[data-employee-id="${employeeId}"]`);
      
      attendanceList.push({
        employee_id: parseInt(employeeId),
        attendance_status: select.value,
        remarks: remarksInput ? remarksInput.value : ''
      });
    }
  });

  if (attendanceList.length === 0) {
    showToast("warning", "Warning", "No attendance data to save");
    return;
  }

  try {
    await batchUpdateDailyAttendance(currentDate, attendanceList);
    showToast("success", "Success", `Attendance saved for ${attendanceList.length} employees`);
    
    setTimeout(() => {
      loadDailyAttendance();
    }, 500);
    
  } catch (error) {
    console.error("Error saving batch attendance:", error);
    showToast("danger", "Error", error.message || "Failed to save attendance");
  }
}


async function quickEditAttendance(employeeId, currentStatus = '', currentRemarks = '') {
  const modal = new bootstrap.Modal(document.getElementById('quickEditModal'));
  const employee = await findEmployeeById(employeeId);
  
  if (employee) {
    document.getElementById('edit_employee_id').value = employeeId;
    document.getElementById('edit_employee_name').value = `${employee.name} - ${employee.position}`;
    document.getElementById('edit_attendance_status').value = currentStatus;
    document.getElementById('edit_remarks').value = currentRemarks || '';
    
    modal.show();
  } else {
    showToast("warning", "Warning", "Employee not found");
  }
}

// Find employee by ID
async function findEmployeeById(employeeId) {
  try {
    const response = await getAllActiveEmployees();
    if (response.ok && response.data) {
      return response.data.find(emp => emp.employee_id == employeeId);
    }
  } catch (error) {
    console.error("Error finding employee:", error);
  }
  return null;
}

// Save quick edit
async function saveQuickEdit() {
  const employeeId = document.getElementById('edit_employee_id').value;
  const status = document.getElementById('edit_attendance_status').value;
  const remarks = document.getElementById('edit_remarks').value;

  if (!employeeId || !status) {
    showToast("warning", "Warning", "Please fill all required fields");
    return;
  }

  const attendanceData = {
    attendance_status: status,
    remarks: remarks
  };

  try {
    await updateAttendance(currentDate, employeeId, attendanceData);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('quickEditModal'));
    modal.hide();
    
    showToast("success", "Success", "Attendance updated successfully");
   
    loadDailyAttendance();
    
  } catch (error) {
    console.error("Error saving quick edit:", error);
    showToast("danger", "Error", error.message || "Failed to update attendance");
  }
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("auth_token");
    sessionStorage.clear();
    window.location.href = "../auth/login.html";
  }
}

// Initialize the page
function initializePage() {

  initializeDatePickers();
  
  if (!currentDate) {
    const today = new Date().toISOString().split('T')[0];
    currentDate = today;
  }
  
  loadDailyAttendance();
  
  setInterval(updateTime, 1000);
  updateTime();
  
  document.getElementById('save-all-btn')?.addEventListener('click', saveAllAttendance);
  document.getElementById('refresh-btn')?.addEventListener('click', loadDailyAttendance);
  document.getElementById('btn-save-quick-edit')?.addEventListener('click', saveQuickEdit);
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  
  // Auto-refresh
  setInterval(() => {
    if (currentDate) loadDailyAttendance();
  }, 30000);
}

window.saveSingleAttendance = saveSingleAttendance;
window.quickEditAttendance = quickEditAttendance;
window.saveQuickEdit = saveQuickEdit;
window.logout = logout;


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}