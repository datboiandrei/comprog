const nameInput = document.getElementById("employee-name");
const startBtn = document.getElementById("start-btn");
const timeInBtn = document.getElementById("time-in-btn");
const timeOutBtn = document.getElementById("time-out-btn");
const tableBody = document.querySelector("#timecard-table tbody");
const downloadBtn = document.getElementById("download-btn");
const actions = document.querySelector(".actions");
const toast = document.getElementById("toast");

let employeeName = "";
const entries = [];

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    showToast("⚠️ Please enter your name.");
    return;
  }
  employeeName = name;
  nameInput.disabled = true;
  startBtn.disabled = true;
  actions.style.display = "flex";
  downloadBtn.style.display = "block";
  showToast(`👋 Welcome, ${employeeName}!`);
});

timeInBtn.addEventListener("click", () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];

  const existing = entries.find(e => e.date === date);
  if (existing) {
    showToast("✅ Time In already recorded today.");
    return;
  }

  entries.push({ date, timeIn: time, timeOut: "" });
  renderTable();
  showToast("🟢 Time In recorded!");
});

timeOutBtn.addEventListener("click", () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];

  const entry = entries.find(e => e.date === date);
  if (!entry) {
    showToast("⚠️ You must Time In first.");
    return;
  }
  if (entry.timeOut) {
    showToast("✅ Time Out already recorded.");
    return;
  }

  entry.timeOut = time;
  renderTable();
  showToast("🔴 Time Out recorded!");
});

function renderTable() {
  tableBody.innerHTML = "";
  entries.forEach(entry => {
    const row = document.createElement("tr");
    row.classList.add("fade-in");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.timeIn}</td>
      <td>${entry.timeOut || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

downloadBtn.addEventListener("click", async () => {
  if (!entries.length) {
    showToast("⚠️ No data to download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.text(`Timecard for: ${employeeName}`, 20, 20);

  doc.setFontSize(12);
  let y = 35;

  entries.forEach((entry, index) => {
    doc.text(`Date: ${entry.date}`, 20, y);
    doc.text(`Time In: ${entry.timeIn}`, 70, y);
    doc.text(`Time Out: ${entry.timeOut || "-"}`, 130, y);
    y += 10;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`${employeeName.replace(/\s+/g, "_")}_timecard.pdf`);
});

