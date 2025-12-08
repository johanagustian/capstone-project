const N8N_TRIGGER = "https://pojer26018.app.n8n.cloud/webhook-test/recommendation";

// 🔄 SHOW MODAL
function showModal() {
    const modal = new bootstrap.Modal(document.getElementById("loadingModal"));
    modal.show();
}

function hideModal() {
    const modalEl = document.getElementById("loadingModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

// 🔄 Refresh page
function refreshPage() {
    location.reload();
}

async function triggerRecommendation() {
    showModal();

    document.getElementById("modal-title").innerText = "Processing...";
    document.getElementById("modal-body").innerHTML = `
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">AI Agent sedang memproses data...</p>
    `;
    document.getElementById("modal-ok-btn").classList.add("d-none");

    try {
        const res = await fetch(N8N_TRIGGER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan_id: "", rejection_note: "" })
        });

        await res.json();

        document.getElementById("modal-title").innerText = "Success!";
        document.getElementById("modal-body").innerHTML = `
            <p>AI Agent berhasil memproses data dan menyimpan ke database.</p>
            <p>Klik OK untuk melanjutkan.</p>
        `;
        document.getElementById("modal-ok-btn").classList.remove("d-none");
    } catch (err) {
        document.getElementById("modal-title").innerText = "Error!";
        document.getElementById("modal-body").innerHTML = `
            <p class="text-danger">Gagal memicu AI Agent!</p>
            <p>Periksa koneksi atau server N8N.</p>
        `;
        document.getElementById("modal-ok-btn").classList.remove("d-none");
    }
}

// =======================
// LOAD RECOMMENDATIONS
// =======================
const API_RECOMMENDATION = "http://localhost:3000/ai_recommendation/ai_recommendation";

async function loadRecommendation() {
    const container = document.getElementById("recommendation-container");
    container.innerHTML = `<div class="text-center text-muted">Loading...</div>`;

    try {
        const res = await fetch(API_RECOMMENDATION);
        const json = await res.json();

        const scenarios = json.scenarios || [];
        const finalReasoning = json.final_reasoning || null;

        if (scenarios.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">Tidak ada data skenario dari AI.</div>
            `;
            return;
        }

        const scenarioCards = scenarios.map(
            scn => `
                <div class="col-md-4">
                    <div class="card mb-3 shadow-sm h-100 scenario-card" data-scenario-id="${scn.id}">
                        <div class="card-body">
                            <h4>
                                Scenario ${scn.id}: ${scn.name}
                                ${scn.ai_recommended ? '<span class="badge bg-warning text-dark ms-2">AI Recommended</span>' : ""}
                            </h4>
                            <p><strong>Focus:</strong> ${scn.focus}</p>
                            <p><strong>Feasibility:</strong> ${scn.feasibility_score}</p>
                            <p><strong>Strategy Summary:</strong> ${scn.strategy_summary}</p>

                            <h5>Kelebihan:</h5>
                            <ul>${scn.key_pros.map(p => `<li>${p}</li>`).join("")}</ul>

                            <h5>Kekurangan:</h5>
                            <ul>${scn.key_cons.map(c => `<li>${c}</li>`).join("")}</ul>

                            <p><strong>Estimated Production:</strong> ${scn.estimated_production_tons} tons</p>
                        </div>
                    </div>
                </div>
            `
        ).join("");

        let finalReasonCard = finalReasoning ? `
            <div class="col-12 mt-4">
                <div class="card border-primary shadow-sm">
                    <div class="card-body">
                        <h3 class="text-primary">🔍 Final AI Recommendation Summary</h3>
                        <p><strong>Explanation:</strong></p>
                        <p>${finalReasoning.explanation}</p>
                        <p><strong>Trigger Factor:</strong> ${finalReasoning.trigger_factor}</p>
                        <p><strong>Selected Scenario:</strong> ${finalReasoning.selected_scenario}</p>

                        <h5>Immediate Action Items:</h5>
                        <ul>${finalReasoning.immediate_action_items.map(i => `<li>${i}</li>`).join("")}</ul>
                    </div>
                </div>
            </div>
        ` : "";

        container.innerHTML = `
            <h2>📊 AI Optimization Scenarios</h2>
            <div class="row">${scenarioCards}</div>
            ${finalReasonCard}
        `;

        enableScenarioSelection();

    } catch (err) {
        container.innerHTML = `
            <div class="alert alert-danger">
                Gagal mengambil data recommendation dari database.
            </div>
        `;
    }
}
loadRecommendation();

// =======================
// Scenario selection
// =======================
let selectedScenarioId = null;

function enableScenarioSelection() {
    const cards = document.querySelectorAll(".scenario-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => {
                c.classList.remove("selected-card");

                const oldBadge = c.querySelector(".selected-badge");
                if (oldBadge) oldBadge.remove();
            });

            card.classList.add("selected-card");

            const badge = document.createElement("span");
            badge.classList.add("badge", "bg-success", "selected-badge");
            badge.style.position = "absolute";
            badge.style.top = "10px";
            badge.style.right = "10px";
            badge.innerText = "Selected ✓";

            card.appendChild(badge);

            selectedScenarioId = parseInt(card.dataset.scenarioId);
            document.getElementById("submit-selected-btn").classList.remove("d-none");
            document.getElementById("reject-btn").classList.remove("d-none");
        });
    });
}

// =======================
// SEND SELECTED SCENARIO
// =======================
async function submitSelectedScenario() {
    if (!selectedScenarioId) return alert("Pilih salah satu scenario dulu!");

    showModal();
    document.getElementById("modal-title").innerText = "Processing...";
    document.getElementById("modal-body").innerHTML = `
        <div class="spinner-border text-primary"></div>
        <p class="mt-3">Mengirim scenario terpilih ke AI Agent...</p>
    `;
    document.getElementById("modal-ok-btn").classList.add("d-none");

    try {
        const res = await fetch(N8N_TRIGGER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plan_id: "",
                selected_scenario_id: selectedScenarioId
            })
        });

        await res.json();

        document.getElementById("modal-title").innerText = "Success!";
        document.getElementById("modal-body").innerHTML = `
            <p>Scenario <strong>${selectedScenarioId}</strong> berhasil dikirim ke AI Agent.</p>
        `;
        document.getElementById("modal-ok-btn").classList.remove("d-none");

    } catch (err) {
        document.getElementById("modal-title").innerText = "Error!";
        document.getElementById("modal-body").innerHTML = `
            <p class="text-danger">Gagal mengirim scenario ke AI Agent.</p>
        `;
        document.getElementById("modal-ok-btn").classList.remove("d-none");
    }
}

document.getElementById("submit-selected-btn").addEventListener("click", submitSelectedScenario);

// =======================
// REJECTION LOGIC
// =======================
document.getElementById("reject-btn").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("rejectionModal"));
    modal.show();
});

async function submitRejection() {
    const note = document.getElementById("rejection-note").value.trim();

    if (!note) return alert("Tulis alasan penolakan terlebih dahulu!");

    showModal();

    document.getElementById("modal-title").innerText = "Processing Rejection...";
    document.getElementById("modal-body").innerHTML = `
        <div class="spinner-border text-danger"></div>
        <p class="mt-3">Mengirim alasan penolakan ke AI Agent...</p>
    `;
    document.getElementById("modal-ok-btn").classList.add("d-none");

    try {
        const res = await fetch(N8N_TRIGGER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plan_id: "",
                rejection_note: note
            })
        });

        const json = await res.json();
        console.log("Webhook Response:", json);

        // Cek apakah webhook membalas success:true
        let isSuccess = false;

        if (Array.isArray(json)) {
            isSuccess = json[0]?.success === true;
        } else if (typeof json === "object" && json !== null) {
            isSuccess = json.success === true;
        }

        if (isSuccess) {
            // Jika sukses → baru boleh menekan tombol OK
            document.getElementById("modal-title").innerText = "Rejected!";
            document.getElementById("modal-body").innerHTML = `
                <p>Rejection note berhasil dikirim ke AI Agent.</p>
                <p>Anda dapat melanjutkan.</p>
            `;
            document.getElementById("modal-ok-btn").classList.remove("d-none");
        } else {
            // Jika belum success → tahan loading & jangan tampilkan OK
            document.getElementById("modal-title").innerText = "Waiting for Webhook...";
            document.getElementById("modal-body").innerHTML = `
                <div class="spinner-border text-warning"></div>
                <p class="mt-3">Menunggu webhook mengirim respon sukses...</p>
            `;
            // OK tetap hidden
        }

    } catch (err) {
        console.error(err);

        document.getElementById("modal-title").innerText = "Error!";
        document.getElementById("modal-body").innerHTML = `
            <p class="text-danger">Gagal mengirim rejection note!</p>
        `;
        document.getElementById("modal-ok-btn").classList.remove("d-none");
    }
}

document.getElementById("submit-rejection-btn").addEventListener("click", submitRejection);
