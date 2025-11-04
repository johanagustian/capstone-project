import "../style/style.css";

const API_BASE = "http://localhost:3000/api/auth";

const roleParam = new URLSearchParams(window.location.search).get("role");
const roleMap = {
  shipper_planner: 1,
  mining_planner: 2,
};
const roleId = roleMap[roleParam] ?? null;

const pageTitle = document.getElementById("page-title");
if (pageTitle) {
  const roleTitle =
    roleParam === "shipper_planner"
      ? "Shipper Planner"
      : roleParam === "mining_planner"
      ? "Mining Planner"
      : "Planner";
  const roleIcon =
    roleParam === "shipper_planner"
      ? "/assets/Port.png"
      : roleParam === "mining_planner"
      ? "/assets/Oil Pump.png"
      : "";
  pageTitle.innerHTML = `${roleIcon ? `<img class="title-icon" src="${roleIcon}" alt="${roleTitle} icon" />` : ""}<span>Register ${roleTitle}</span>`;
}

function setMessage(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
}

async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return payload;
}

const registerForm = document.getElementById("register-form");
const registerMsg = document.getElementById("register-message");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!roleId) {
      setMessage(
        registerMsg,
        "Role tidak valid. Kembali dan pilih role.",
        "error"
      );
      return;
    }
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    try {
      setMessage(registerMsg, "Memproses pendaftaran...", "info");
      await postJSON(`${API_BASE}/register`, {
        username,
        email,
        password,
        role_id: roleId,
      });
      setMessage(
        registerMsg,
        "Pendaftaran berhasil! Silakan login.",
        "success"
      );
    } catch (err) {
      setMessage(registerMsg, err.message, "error");
    }
  });
}

const loginLink = document.getElementById("login-link");
if (loginLink) {
  const roleQuery = roleParam ? `?role=${encodeURIComponent(roleParam)}` : "";
  loginLink.setAttribute("href", `/login.html${roleQuery}`);
}
