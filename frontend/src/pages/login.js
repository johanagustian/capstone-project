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
  pageTitle.innerHTML = `${
    roleIcon
      ? `<img class="title-icon" src="${roleIcon}" alt="${roleTitle} icon" />`
      : ""
  }<span>Login ${roleTitle}</span>`;
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

const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-message");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!roleId) {
      setMessage(
        loginMsg,
        "Role tidak valid. Kembali dan pilih role.",
        "error"
      );
      return;
    }
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      setMessage(loginMsg, "Memproses login...", "info");
      const data = await postJSON(`${API_BASE}/login`, {
        email,
        password,
        role_id: roleId,
      });
      const token = data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(data?.user || {}));
        if(roleId == 1) {
          window.location.href = "/dashboardMining.html";
        } else if (roleId == 2){
          window.location.href = "/dashboardShipping.html"
        }
        else {
        } setMessage(loginMsg, "Role tidak terpilih")
      } else {
        setMessage(loginMsg, "Token tidak diterima dari server.", "error");
      }
    } catch (err) {
      setMessage(loginMsg, err.message, "error");
    }
  });
}

const registerLink = document.getElementById("register-link");
if (registerLink) {
  const roleQuery = roleParam ? `?role=${encodeURIComponent(roleParam)}` : "";
  registerLink.setAttribute("href", `/register.html${roleQuery}`);
}
