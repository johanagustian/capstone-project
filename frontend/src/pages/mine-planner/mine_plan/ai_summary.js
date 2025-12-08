// N8N Summary Script
const N8N_WEBHOOK = "https://pojer26018.app.n8n.cloud/webhook-test/summary";

// Fungsi memperbarui UI menjadi mode loading
function showLoading() {
    const container = document.querySelector('.summary-content');
    container.innerHTML = `
        <div class="loading-box">
            <div class="spinner"></div>
            <p>AI sedang memproses summary...</p>
        </div>
    `;
}

// Fungsi menampilkan hasil summary ke UI
function renderSummary(data) {
    const container = document.querySelector('.summary-content');

    container.innerHTML = `
        <div class="summary-box">
            <h2>🤖 AI Situation Analysis</h2>
            <p>${data.situation_summary}</p>

            <br>
            <strong>Baseline Target:</strong> ${data.suggested_baseline_target} tons <br>
            <strong>Current Stockpile:</strong> ${data.current_stockpile_tons} tons <br>
            <strong>Source:</strong> ${data.data_source}<br><br>

            <h3>⚠️ Alerts</h3>
            <ul>
                <li><strong>Weather:</strong> ${data.alerts.weather_alert}</li>
                <li><strong>Shipping:</strong> ${data.alerts.shipping_alert}</li>
                <li><strong>Fleet:</strong> ${data.alerts.fleet_alert}</li>
            </ul>
        </div>
    `;
}

// Fungsi utama untuk memanggil N8N
async function triggerSummary() {
    const container = document.querySelector('.summary-content');

    // Tampilkan loading dulu
    showLoading();

    try {
        const res = await fetch(N8N_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ update_summary: false })  // kirim trigger ke n8n
        });

        const data = await res.json();

        // Tampilkan hasil
        renderSummary(data);
    } catch (e) {
        container.innerHTML = `
            <div class="error-container">
                <h3>⚠️ Gagal memproses Summary</h3>
                <p>${e.message}</p>
            </div>
        `;
    }
}

// Event ketika tombol diklik
document.getElementById("load-summary-btn").addEventListener("click", triggerSummary);
