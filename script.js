// =======================
// NUTRITION
// =======================
function calculateNutrition() {
    let milk = document.getElementById("milk").value;
    let budget = document.getElementById("budget").value;
    let result = document.getElementById("result");

    if (milk === "") {
        result.innerHTML = "Please enter milk production.";
        return;
    }

    milk = parseFloat(milk);

    let feedPlan = "";
    let estimatedCost = 0;

    if (budget === "low") {
        feedPlan = "70% Roughage + 30% Concentrate + Salt Block";
        estimatedCost = milk * 20;
    } else if (budget === "medium") {
        feedPlan = "60% Roughage + 40% Concentrate + Mineral Mix";
        estimatedCost = milk * 30;
    } else {
        feedPlan = "Balanced TMR + Protein Supplement + Regular Vet Care";
        estimatedCost = milk * 45;
    }

    result.innerHTML =
        "Recommended Feed Plan: " + feedPlan +
        "<br>Estimated Daily Cost: ₹" + estimatedCost;
}

// =======================
// HEALTH CHECK
// =======================
function checkHealth() {
    let vaccinated = document.getElementById("vaccinated").checked;
    let dewormed = document.getElementById("dewormed").checked;
    let result = document.getElementById("healthResult");

    if (vaccinated && dewormed) {
        result.innerHTML = "Cattle Health Status: Healthy ✅";
    } else if (vaccinated || dewormed) {
        result.innerHTML = "Cattle Health Status: Needs Attention ⚠";
    } else {
        result.innerHTML = "Cattle Health Status: High Risk ❌";
    }
}

// =======================
// REPORT SYSTEM
// =======================
function submitReport() {
    let location = document.getElementById("location").value;
    let condition = document.getElementById("condition").value;

    if (location === "") {
        alert("Please enter location.");
        return;
    }

    let report = { location, condition };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    displayReports();
    document.getElementById("location").value = "";
}

function displayReports() {
    let reportList = document.getElementById("reportList");
    if (!reportList) return;

    reportList.innerHTML = "";
    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    reports.forEach(report => {
        let li = document.createElement("li");
        li.innerHTML = "Location: " + report.location +
                       " | Condition: " + report.condition;
        reportList.appendChild(li);
    });
}

// =======================
// DIGITAL ID + RISK SYSTEM
// =======================
function generateID() {
    let owner = document.getElementById("ownerName").value;
    let breed = document.getElementById("breedSelect").value;

    if (owner === "") {
        alert("Please enter owner name.");
        return;
    }

    let uniqueID = "COW-" + Math.floor(Math.random() * 100000);

    let cattle = {
        owner,
        breed,
        id: uniqueID,
        status: "safe",
        vaccinated: false,
        dewormed: false
    };

    let cattleList = JSON.parse(localStorage.getItem("cattleList")) || [];
    cattleList.push(cattle);
    localStorage.setItem("cattleList", JSON.stringify(cattleList));

    displayAllCattle();
}

function markMissing(index) {
    let cattleList = JSON.parse(localStorage.getItem("cattleList"));
    cattleList[index].status = "missing";
    localStorage.setItem("cattleList", JSON.stringify(cattleList));
    displayAllCattle();
}

function toggleVaccination(index) {
    let cattleList = JSON.parse(localStorage.getItem("cattleList"));
    cattleList[index].vaccinated = !cattleList[index].vaccinated;
    localStorage.setItem("cattleList", JSON.stringify(cattleList));
    displayAllCattle();
}

function toggleDewormed(index) {
    let cattleList = JSON.parse(localStorage.getItem("cattleList"));
    cattleList[index].dewormed = !cattleList[index].dewormed;
    localStorage.setItem("cattleList", JSON.stringify(cattleList));
    displayAllCattle();
}

function calculateRisk(cattle) {
    let score = 100;

    if (!cattle.vaccinated) score -= 20;
    if (!cattle.dewormed) score -= 15;
    if (cattle.status === "missing") score -= 30;

    if (score >= 80) return { score, level: "Low Risk 🟢" };
    if (score >= 50) return { score, level: "Medium Risk 🟡" };
    return { score, level: "High Risk 🔴" };
}

function displayAllCattle() {
    let idCard = document.getElementById("idCard");
    if (!idCard) return;

    let cattleList = JSON.parse(localStorage.getItem("cattleList")) || [];
    idCard.innerHTML = "";

    cattleList.forEach((cattle, index) => {
        let risk = calculateRisk(cattle);

        let riskColor = "#2e7d32";
        if (risk.score < 50) riskColor = "red";
        else if (risk.score < 80) riskColor = "orange";

        idCard.innerHTML += `
        <div style="border:3px solid ${riskColor};
                    padding:15px;margin:15px auto;width:300px;
                    border-radius:10px;background:#fff;">

            <h3>Digital Cattle ID</h3>

            <p><strong>Owner:</strong> ${cattle.owner}</p>
            <p><strong>Breed:</strong> ${cattle.breed}</p>
            <p><strong>ID:</strong> ${cattle.id}</p>

            <p><strong>Vaccinated:</strong> ${cattle.vaccinated ? "Yes" : "No"}</p>
            <p><strong>Dewormed:</strong> ${cattle.dewormed ? "Yes" : "No"}</p>

            <p><strong>Health Score:</strong> ${risk.score}/100</p>

            <div style="background:#ddd;height:12px;border-radius:6px;margin:8px 0;">
                <div style="
                    height:12px;
                    width:${risk.score}%;
                    background:${riskColor};
                    border-radius:6px;
                    transition: width 0.5s ease;">
                </div>
            </div>

            <p><strong>Risk Level:</strong> ${risk.level}</p>

            ${risk.score < 50 ? 
              "<p style='color:red;font-weight:bold;'>⚠ HIGH RISK ALERT!</p>" 
              : ""}

            <button onclick="markMissing(${index})">Mark Missing</button>
            <button onclick="toggleVaccination(${index})">Toggle Vaccinated</button>
            <button onclick="toggleDewormed(${index})">Toggle Dewormed</button>
        </div>`;
    });
}

// =======================
// AI COMPANION
// =======================
function askAI() {
    let inputField = document.getElementById("aiInput");
    let input = inputField.value.trim();
    let chatContainer = document.getElementById("chatContainer");

    if (input === "") return;

    let userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message";
    userMessage.innerText = input;
    chatContainer.appendChild(userMessage);

    inputField.value = "";

    let aiMessage = document.createElement("div");
    aiMessage.className = "chat-message ai-message";
    aiMessage.innerText = generateAIResponse(input);
    chatContainer.appendChild(aiMessage);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateAIResponse(input) {
    input = input.toLowerCase();

    if (input.includes("health report")) {
        let cattleList = JSON.parse(localStorage.getItem("cattleList")) || [];
        if (cattleList.length === 0) return "No cattle registered.";

        let response = "";
        cattleList.forEach(cattle => {
            let risk = calculateRisk(cattle);

            response += `
Owner: ${cattle.owner}
Score: ${risk.score}/100
Level: ${risk.level}
${risk.score < 50 ? "🚨 Immediate veterinary care required." :
  risk.score < 80 ? "⚠ Improve vaccination and nutrition." :
  "✅ Health stable."}

`;
        });
        return response;
    }

    if (input.includes("milk")) {
        return "Ensure balanced nutrition and mineral supplements.";
    }

    return "Please provide more details about the cattle issue.";
}

// =======================
// PAGE LOAD
// =======================
window.onload = function () {
    displayReports();
    displayAllCattle();
};