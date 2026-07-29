const API = "http://localhost:5000/api";
// ===============================
// Check Login
// ===============================
const token = localStorage.getItem("token");

const user = JSON.parse(
    localStorage.getItem("user")
);

if (!localStorage.getItem("token")) {

    window.location.href = "login.html";

}

if (!token || !user) {

    window.location.href = "login.html";

}


let ageingChart = null;
let pieChart = null;

// ===============================
// Initial Load
// ===============================
window.onload = () => {
    loadDashboard();
    loadInvoices();

    // Auto Refresh every 60 seconds
    setInterval(() => {
        loadDashboard();
        loadInvoices();
    }, 60000);
};

// ===============================
// Load Dashboard
// ===============================
async function loadDashboard() {

    try {

        // const response = await fetch(`${API}/dashboard`);
        const response = await fetch(`${API}/dashboard`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const data = result.data;

        document.getElementById("totalOutstanding").innerHTML =
            "₹" + Number(data.totalOutstanding).toLocaleString("en-IN");

        document.getElementById("totalInvoices").innerHTML =
            data.totalInvoices;

        document.getElementById("pendingInvoices").innerHTML =
            data.pendingInvoices;

        document.getElementById("paidInvoices").innerHTML =
            data.paidInvoices;
            
        document.getElementById("paidInvoiceAmount").innerHTML =
    "₹" + Number(data.paidInvoiceAmount).toLocaleString("en-IN");

        drawCharts(data);

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

}

// ===============================
// Load Invoice Table
// ===============================
async function loadInvoices() {

    try {

        // const response = await fetch(`${API}/outstanding`);
        const response = await fetch(`${API}/outstanding`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
        const result = await response.json();

        if (!result.success) return;

        const tbody = document.getElementById("invoiceBody");

        tbody.innerHTML = "";

        result.data.forEach(invoice => {

            tbody.innerHTML += `
                <tr>

                <td>${invoice.invoiceNo}</td>

                <td>${invoice.customer}</td>
                <td>${invoice.dueDate}</td>

                <td>${invoice.days0to30 > 0 ? "₹" + invoice.days0to30.toLocaleString("en-IN") : "-"}</td>

                <td>${invoice.days31to60 > 0 ? "₹" + invoice.days31to60.toLocaleString("en-IN") : "-"}</td>

                <td>${invoice.days61to90 > 0 ? "₹" + invoice.days61to90.toLocaleString("en-IN") : "-"}</td>

                <td>${invoice.days90Plus > 0 ? "₹" + invoice.days90Plus.toLocaleString("en-IN") : "-"}</td>

                <td>${invoice.status}</td>

                <td>
                <button onclick="sendReminder('${invoice.customer}',this)">
                Send
                </button>
                </td>

                </tr>
                `;


        });

    } catch (err) {

        console.error("Invoice Error:", err);

    }

}

// ===============================
// Manual Reminder
// ===============================
async function sendReminder(customer, button) {

    try {

        button.disabled = true;
        button.innerHTML = "Sending...";

        const response = await fetch(`${API}/email/send`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
        customer
    })

});

        // const response = await fetch(`${API}/email/send`, {

        //     method: "POST",

        //     headers: {
        //         "Content-Type": "application/json"
        //     },

        //     body: JSON.stringify({
        //         customer
        //     })

        // });

        const result = await response.json();

        alert(result.message);

        loadDashboard();
        loadInvoices();

    } catch (err) {

        console.error(err);

        alert("Unable to send reminder.");

    } finally {

        button.disabled = false;
        button.innerHTML = "Send";

    }

}

// ===============================
// Search
// ===============================
document.getElementById("searchBox").addEventListener("keyup", function () {

    const search = this.value.toLowerCase();

    const rows = document.querySelectorAll("#invoiceBody tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(search)
                ? ""
                : "none";

    });

});

// ===============================
// Charts
// ===============================
function drawCharts(data) {

    // Destroy existing charts
    if (ageingChart) ageingChart.destroy();
    if (pieChart) pieChart.destroy();

    // Ageing Bar Chart
    ageingChart = new Chart(
        document.getElementById("ageingChart"),
        {
            type: "bar",
            data: {
                labels: ["0-30", "31-60", "61-90", "90+"],
                datasets: [{
                    label: "Invoices",
                    data: [
                        data.ageing["0-30"],
                        data.ageing["31-60"],
                        data.ageing["61-90"],
                        data.ageing["90+"]
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

    // Outstanding Pie Chart
    pieChart = new Chart(
        document.getElementById("pieChart"),
        {
            type: "pie",
            data: {
                labels: ["0-30", "31-60", "61-90", "90+"],
                datasets: [{
                    data: [
                        data.outstandingByBucket["0-30"],
                        data.outstandingByBucket["31-60"],
                        data.outstandingByBucket["61-90"],
                        data.outstandingByBucket["90+"]
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

}

// function exportExcel() {

//     window.open(
//         "http://localhost:5000/api/export/excel",
//         "_blank"
//     );

// }
    function exportExcel() {

        window.open(
            `http://localhost:5000/api/export/excel?token=${token}`,
            "_blank"
        );

    }
// ===============================
// Export PDF
// ===============================
// function exportPDF() {

//     window.open(
//         "http://localhost:5000/api/export/pdf",
//         "_blank"
//     );

// }
    function exportPDF() {

    window.open(
        `http://localhost:5000/api/export/pdf?token=${token}`,
        "_blank"
    );

}

function logout() {

    // Remove login session/token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear session storage also
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "login.html";

}


