const API = "http://localhost:5000/api";
// ===============================
// Check Login
// ===============================
const token = localStorage.getItem("token");
let allInvoices = [];

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
// -------------------------------
// FILTER STATE
// -------------------------------

let globalFilters = [];

let tableFilters = [];

let globalStartDate = "";

let globalEndDate = "";

function createChip(type, value) {

    const chip = document.createElement("div");

    chip.className = "filter-chip";

    chip.innerHTML = `

        ${value}

        <span>×</span>

    `;

    chip.querySelector("span").onclick = () => {

        if (type === "global") {

            globalFilters = globalFilters.filter(

                x => x !== value

            );

            renderGlobalChips();

            applyGlobalFilters();

        }

        else {

            tableFilters = tableFilters.filter(

                x => x !== value

            );

            renderTableChips();

            applyTableFilters();

        }

    };

    return chip;

}

function renderGlobalChips() {

    const container = document.getElementById(

        "globalChips"

    );

    container.innerHTML = "";

    globalFilters.forEach(filter => {

        container.appendChild(

            createChip("global", filter)

        );

    });

}

function renderTableChips() {

    const container = document.getElementById(

        "tableChips"

    );

    container.innerHTML = "";

    tableFilters.forEach(filter => {

        container.appendChild(

            createChip("table", filter)

        );

    });

}

document
.getElementById("globalInput")
.addEventListener("keydown", function(e){

    if(e.key==="Enter"){

        e.preventDefault();

        const value=this.value.trim();

        if(!value) return;

        globalFilters.push(value);

        this.value="";

        renderGlobalChips();

        applyGlobalFilters();

    }

}); 

// document
// .getElementById("tableInput")
// .addEventListener("keydown",function(e){

//     if(e.key==="Enter"){

//         e.preventDefault();

//         const value=this.value.trim();

//         if(!value) return;

//         tableFilters.push(value);

//         this.value="";

//         renderTableChips();

//         applyTableFilters();

//     }

// });

document
.getElementById("globalInput")
.addEventListener("keydown",function(e){

    if(

        e.key==="Backspace"

        &&

        this.value===""

        &&

        globalFilters.length

    ){

        globalFilters.pop();

        renderGlobalChips();

        applyGlobalFilters();

    }

}); 


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
        const params = new URLSearchParams();

        globalFilters.forEach(f=>{
            params.append("filter",f);
        });

        if(globalStartDate)
            params.append("start",globalStartDate);

        if(globalEndDate)
            params.append("end",globalEndDate);

        const response = await fetch(
            `${API}/dashboard?${params.toString()}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );
        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const data = result.data;

        const compare =
        !(
        globalStartDate ||
        globalEndDate ||
        globalFilters.length
        );

        if(compare){

            document.getElementById("previousRow").style.display="flex";

            document.getElementById("currentRow").style.display="flex";

            document.getElementById("prevOutstanding").innerHTML=
                "₹"+data.previousSummary.totalOutstanding.toLocaleString("en-IN");

            document.getElementById("prevInvoices").innerHTML=
                data.previousSummary.totalInvoices;

            document.getElementById("prevPending").innerHTML=
                data.previousSummary.pendingInvoices;

            document.getElementById("prevPaid").innerHTML=
                data.previousSummary.paidInvoices;

            document.getElementById("prevReceived").innerHTML=
                "₹"+data.previousSummary.paidInvoiceAmount.toLocaleString("en-IN");

            document.getElementById("prevCreditCount").innerHTML=
                data.previousSummary.creditNoteCount;

            document.getElementById("prevCreditValue").innerHTML=
                "₹"+data.previousSummary.creditNoteValue.toLocaleString("en-IN");


            document.getElementById("currOutstanding").innerHTML=
                "₹"+data.currentSummary.totalOutstanding.toLocaleString("en-IN");

            document.getElementById("currInvoices").innerHTML=
                data.currentSummary.totalInvoices;

            document.getElementById("currPending").innerHTML=
                data.currentSummary.pendingInvoices;

            document.getElementById("currPaid").innerHTML=
                data.currentSummary.paidInvoices;

            document.getElementById("currReceived").innerHTML=
                "₹"+data.currentSummary.paidInvoiceAmount.toLocaleString("en-IN");

            document.getElementById("currCreditCount").innerHTML=
                data.currentSummary.creditNoteCount;

            document.getElementById("currCreditValue").innerHTML=
                "₹"+data.currentSummary.creditNoteValue.toLocaleString("en-IN");

        }
        else{

            document.getElementById("previousRow").style.display="none";

            document.getElementById("currentRow").style.display="none";

        }

        drawCharts(data);

        renderDashboardSummary(
    data.dashboardRows
);

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

}

function renderDashboardSummary(rows){

    const tbody=document.getElementById(
        "dashboardSummaryBody"
    );

    tbody.innerHTML="";

    rows.forEach(row=>{

        tbody.innerHTML+=`

        <tr>

            <td>

                <b>${row.company}</b>

            </td>

            <td>

                ${
                    row["0-30"]>0
                    ? "₹"+row["0-30"].toLocaleString("en-IN")
                    : "-"
                }

            </td>

            <td>

                ${
                    row["31-60"]>0
                    ? "₹"+row["31-60"].toLocaleString("en-IN")
                    : "-"
                }

            </td>

            <td>

                ${
                    row["61-90"]>0
                    ? "₹"+row["61-90"].toLocaleString("en-IN")
                    : "-"
                }

            </td>

            <td>

                ${
                    row["90+"]>0
                    ? "₹"+row["90+"].toLocaleString("en-IN")
                    : "-"
                }

            </td>

            <td>

                <b>

                ₹${row.total.toLocaleString("en-IN")}

                </b>

            </td>

            <td>

                    <button class="btn btn-primary"
                        onclick="downloadCompany('${encodeURIComponent(row.company)}')">
                        📄 Download
                    </button>

                <button
                    class="btn btn-accent"
                    onclick="sendReminder('${row.company}', this)">
                    Send
                </button>

            </td>

        </tr>

        `;

    });

}
// ===============================
// Load Invoice Table
// ===============================
async function loadInvoices() {

    try {

        const params=new URLSearchParams();

        globalFilters.forEach(f=>{

            params.append(

                "filter",

                f

            );

        });

        if(globalStartDate){

            params.append(

                "start",

                globalStartDate

            );

        }

        if(globalEndDate){

            params.append(

                "end",

                globalEndDate

            );

        }

        // const response = await fetch(`${API}/outstanding`);
        const response = await fetch(
            `${API}/outstanding?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const result = await response.json();

        if (!result.success) return;

        allInvoices = result.data;

        // renderInvoices(allInvoices);
        // renderGroupedInvoices(allInvoices, "invoiceBody");
        renderGroupedInvoices(allInvoices, "invoiceSectionBody");

    } catch (err) {

        console.error("Invoice Error:", err);

    }

}

function renderInvoices(invoices) {

    const tbody = document.getElementById("invoiceSectionBody");

    tbody.innerHTML = "";

    invoices.forEach(invoice => {

        let ageingBadge = "";

        switch (invoice.ageingBucket) {

            case "0-30":
                ageingBadge = `<span class="badge d30">0-30 Days</span>`;
                break;

            case "31-60":
                ageingBadge = `<span class="badge d60">31-60 Days</span>`;
                break;

            case "61-90":
                ageingBadge = `<span class="badge d90">61-90 Days</span>`;
                break;

            default:
                ageingBadge = `<span class="badge d90plus">90+ Days</span>`;
        }

        let statusClass = "status-unpaid";

        if (invoice.status === "Paid") {

            statusClass = "status-paid";

        }
        else if (invoice.status === "Part Paid") {

            statusClass = "status-part";

        }

        tbody.innerHTML += `

        <tr>

            <td>${invoice.invoiceNo}</td>

            <td>${invoice.customer}</td>

            <td>${invoice.company}</td>

            <td>₹${invoice.invoiceAmount.toLocaleString("en-IN")}</td>

            <td>₹${invoice.received.toLocaleString("en-IN")}</td>

            <td>₹${invoice.creditNote.toLocaleString("en-IN")}</td>

            <td><b>₹${invoice.outstanding.toLocaleString("en-IN")}</b></td>

            <td>${formatDate(invoice.dueDate)}</td>

            <td>${ageingBadge}</td>

            <td>
                <span class="${statusClass}">
                    ${invoice.status}
                </span>
            </td>

            <td>
                <button onclick="openEditModal(${invoice.id})">
                    ✏ Edit
                </button>
            </td>

        </tr>

        `;

    });

}

function renderGroupedInvoices(invoices, bodyId = "invoiceSectionBody") {

    const tbody = document.getElementById(bodyId);
    tbody.innerHTML = "";

    // Today's reference
    const today = new Date();
    today.setHours(0,0,0,0);

    // If user selected a start date, use that as "today"
    const currentStart = globalStartDate
        ? new Date(globalStartDate)
        : new Date(today);

    currentStart.setHours(0,0,0,0);

    // Yesterday = one day before currentStart
    const yesterday = new Date(currentStart);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayList = [];
    const todayList = [];

    invoices.forEach(inv => {

        const due = new Date(inv.dueDate);
        due.setHours(0,0,0,0);

        if (
            due.getTime() === yesterday.getTime()
        ) {

            yesterdayList.push(inv);

        }
        else {

            todayList.push(inv);

        }

    });

    // ---------- Yesterday Heading ----------

    tbody.innerHTML += `
        <tr class="group-header">
            <td colspan="11">
                <b>Yesterday's Outstanding (${yesterday.toLocaleDateString("en-GB")})</b>
            </td>
        </tr>
    `;

    yesterdayList.forEach(inv => addInvoiceRow(inv, bodyId));

    // ---------- Today's Heading ----------

    let heading = "Today's Outstanding";

    if(globalStartDate){

        heading =
            `Selected Range (${globalStartDate}` +
            (globalEndDate ? ` to ${globalEndDate}` : "") +
            `)`;

    }

    tbody.innerHTML += `
        <tr class="group-header">
            <td colspan="11">
                <b>${heading}</b>
            </td>
        </tr>
    `;

    todayList.forEach(inv => addInvoiceRow(inv, bodyId));

}

function addInvoiceRow(invoice, bodyId){

    const tbody = document.getElementById(bodyId);

    let ageingBadge="";

    switch(invoice.ageingBucket){

        case "0-30":
            ageingBadge='<span class="badge d30">0-30 Days</span>';
            break;

        case "31-60":
            ageingBadge='<span class="badge d60">31-60 Days</span>';
            break;

        case "61-90":
            ageingBadge='<span class="badge d90">61-90 Days</span>';
            break;

        default:
            ageingBadge='<span class="badge d90plus">90+ Days</span>';
    }

    let statusClass="status-unpaid";

    if(invoice.status==="Paid")
        statusClass="status-paid";

    else if(invoice.status==="Part Paid")
        statusClass="status-part";

    tbody.innerHTML += `
        <tr>
            <td>${invoice.invoiceNo}</td>
            <td>${invoice.customer}</td>
            <td>${invoice.company}</td>
            <td>₹${invoice.invoiceAmount.toLocaleString("en-IN")}</td>
            <td>₹${invoice.received.toLocaleString("en-IN")}</td>
            <td>₹${invoice.creditNote.toLocaleString("en-IN")}</td>
            <td><b>₹${invoice.outstanding.toLocaleString("en-IN")}</b></td>
            <td>${formatDate(invoice.dueDate)}</td>
            <td>${ageingBadge}</td>
            <td>
                <span class="${statusClass}">
                    ${invoice.status}
                </span>
            </td>
            <td>
                <button onclick="openEditModal(${invoice.id})">
                    ✏ Edit
                </button>
            </td>
        </tr>
    `;
}

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-GB"
    );

}

function openEditModal(id){

    const invoice = allInvoices.find(

        x => x.id === id

    );

    if(!invoice) return;

    document.getElementById("editInvoiceId").value = invoice.id;

    document.getElementById("editStatus").value = invoice.paymentStatus;

    document.getElementById("editReceivedAmount").value = invoice.receivedAmount;

    document.getElementById("editCreditAmount").value = invoice.creditNoteAmount;

    document.getElementById("editReceivedDate").value =
        invoice.receivedDate
        ? invoice.receivedDate.substring(0,10)
        : "";

    document.getElementById("editRemarks").value =
        invoice.remarks || "";

    document.getElementById("editModal").style.display="flex";

}

function closeModal(){

    document.getElementById("editModal").style.display="none";

}

async function saveInvoice(){

    const id =
        document.getElementById("editInvoiceId").value;

    const body={

        paymentStatus:
            document.getElementById("editStatus").value,

        receivedAmount:
            document.getElementById("editReceivedAmount").value,

        creditNoteAmount:
            document.getElementById("editCreditAmount").value,

        receivedDate:
            document.getElementById("editReceivedDate").value,

        remarks:
            document.getElementById("editRemarks").value

    };

    const response = await fetch(

        `${API}/invoice/${id}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(body)

        }

    );

    const result = await response.json();

    alert(result.message);

    if(result.success){

        closeModal();

        loadDashboard();

        loadInvoices();

    }

}

// ===============================
// Manual Reminder
// ===============================
async function sendReminder(customer, button) {
    console.log(token , customer , button);

    try {

        button.disabled = true;
        button.innerHTML = "Sending...";

        console.log("Before fetch");

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
console.log("After fetch");

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

        console.log(response.status);
console.log(result);

        alert(result.message);

        loadDashboard();
        loadInvoices();

    } catch (err) {

        console.error("Fetch Error:", err);

        console.error(err.message);

        alert(err.message);

    } finally {

        button.disabled = false;
        button.innerHTML = "Send";

    }

}

// ===============================
// Search
// ===============================
// document.getElementById("searchBox")
//     .addEventListener("input", filterInvoices);

document
.getElementById("startDate")
.onchange=()=>{

    globalStartDate=

        document.getElementById("startDate").value;

    applyGlobalFilters();

};

document
.getElementById("endDate")
.onchange=()=>{

    globalEndDate=

        document.getElementById("endDate").value;

    applyGlobalFilters();

};

function applyGlobalFilters(){

    loadDashboard();

    loadInvoices();

}

function applyTableFilters(){

    if(tableFilters.length===0){

        // renderInvoices(allInvoices);
        renderGroupedInvoices(allInvoices);

        return;

    }

    const filtered=allInvoices.filter(invoice=>{

        return tableFilters.every(filter=>{

            filter=filter.toLowerCase();

            return Object.values(invoice)

            .join(" ")

            .toLowerCase()

            .includes(filter);

        });

    });

    // renderInvoices(filtered);
    renderGroupedInvoices(filtered);

}

// function filterInvoices() {

//     const search = document
//         .getElementById("searchBox")
//         .value
//         .toLowerCase();

//     const startDate = document
//         .getElementById("startDate")
//         .value;

//     const endDate = document
//         .getElementById("endDate")
//         .value;

//     const filtered = allInvoices.filter(invoice => {

//         const matchesSearch =
//             invoice.invoiceNo.toLowerCase().includes(search) ||
//             invoice.customer.toLowerCase().includes(search);

//         let matchesDate = true;

//         if (startDate) {

//             matchesDate =
//                 matchesDate &&
//                 new Date(invoice.dueDate) >= new Date(startDate);

//         }

//         if (endDate) {

//             matchesDate =
//                 matchesDate &&
//                 new Date(invoice.dueDate) <= new Date(endDate);

//         }

//         return matchesSearch && matchesDate;

//     });

//     renderInvoices(filtered);

// }

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

                ],

                backgroundColor: [

                    "#22C55E",
                    "#3B82F6",
                    "#F59E0B",
                    "#EF4444"

                ],

                borderRadius: 8

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

                backgroundColor: [

                    "#22C55E",   // 0-30 Green

                    "#3B82F6",   // 31-60 Blue

                    "#F59E0B",   // 61-90 Orange

                    "#EF4444"    // 90+ Red

                ],

                borderColor: "#ffffff",

                borderWidth: 2,

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

        const params = new URLSearchParams();

        globalFilters.forEach(f => {
            params.append("filter", f);
        });

        if (globalStartDate)
            params.append("start", globalStartDate);

        if (globalEndDate)
            params.append("end", globalEndDate);

        params.append("token", token);

        window.open(
            `${API}/export/excel?${params.toString()}`,
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

        const params = new URLSearchParams();

        globalFilters.forEach(f => {
            params.append("filter", f);
        });

        if (globalStartDate)
            params.append("start", globalStartDate);

        if (globalEndDate)
            params.append("end", globalEndDate);

        params.append("token", token);

        window.open(
            `${API}/export/pdf?${params.toString()}`,
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

function showImport(){

    document
        .getElementById("excelFile")
        .click();

}

async function uploadExcel(){

    const file =
        document.getElementById("excelFile").files[0];

    if(!file) return;

    const formData = new FormData();

    formData.append("file",file);

    const response = await fetch(
        `${API}/import`,
        {
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
            body:formData
        }
    );

    const result = await response.json();

    alert(result.message);

    if(result.success){

        loadDashboard();

        loadInvoices();

    }

}

function showDashboard() {

    document.getElementById("dashboardSection").style.display = "block";

    document.getElementById("invoiceSection").style.display = "none";

    document.getElementById("pageTitle").innerText = "Dashboard";

    document.getElementById("dashboardMenu").classList.add("active");

    document.getElementById("invoiceMenu").classList.remove("active");
}

function showInvoices() {

    document.getElementById("dashboardSection").style.display = "none";

    document.getElementById("invoiceSection").style.display = "block";

    document.getElementById("pageTitle").innerText = "Invoices";

    document.getElementById("invoiceMenu").classList.add("active");

    document.getElementById("dashboardMenu").classList.remove("active");
}

function downloadCompany(company) {

    const params = new URLSearchParams();

    globalFilters.forEach(f => params.append("filter", f));

    if (globalStartDate)
        params.append("start", globalStartDate);

    if (globalEndDate)
        params.append("end", globalEndDate);

    params.append("company", decodeURIComponent(company));
    params.append("token", token);

    window.open(
        `${API}/export/pdf/company?${params.toString()}`,
        "_blank"
    );
}