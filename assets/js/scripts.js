// ✅ Function: Admin Login Validation
function validateAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    // 🚨 TEMPORARY PASSWORD (Not Secure, Move to a Server Later)
    const storedUsername = "admindianne";
    const storedPassword = "Chat@2025!";

    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem("isAdmin", "true"); // Store session
        window.location.href = 'admin-dashboard.html'; // Redirect to Admin Panel
    } else {
        errorMessage.innerText = "❌ Invalid credentials! Please try again.";
    }
}

// ✅ Function: Logout Admin
function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    window.location.href = 'index.html'; // Redirect to Homepage
}

// ✅ Function: Protect Admin Dashboard (Redirect if Not Logged In)
if (window.location.pathname.includes("admin-dashboard.html") && !localStorage.getItem("isAdmin")) {
    window.location.href = "index.html";
}

// ✅ Function: Toggle Password Visibility
document.getElementById("togglePassword").addEventListener("change", function() {
    const passwordField = document.getElementById("adminPassword");
    passwordField.type = this.checked ? "text" : "password";
});

// ✅ Function: Show Admin Login Pop-up
function showAdminLogin() {
    const modal = document.getElementById("adminModal");
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
    }, 10);
}

// ✅ Function: Close Admin Login Pop-up
function closeAdminLogin() {
    const modal = document.getElementById("adminModal");
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    setTimeout(() => { modal.style.display = 'none'; }, 400);
}

// ✅ Function: Validate Customer Access Code
function requestAccess() {
    const code = document.getElementById("accessCode").value.trim();
    const validCodes = ["ABC123", "XYZ456", "LMN789"]; // Add more valid codes

    if (!validCodes.includes(code)) {
        showPopup("Invalid Code", "Oops! This code is not recognized. Please check your email and try again.", "invalid");
        return;
    }

    // 🎉 Show "Waiting in Queue" Pop-up
    showPopup("You're in Queue!", `
        🎉 Thank you for entering your code! <br><br>
        Your chat request is now in queue and awaiting Dianne's approval. <br><br>
        🔔 **Please double-check your scheduled booking time** as you will only be accommodated **during your scheduled slot**.
    `, "queue");

    // Start Checking for Admin Approval
    checkAdminApproval(code);
}

// ✅ Function: Check Admin Approval for Customers (Redirect to `chatroom.html` When Approved)
function checkAdminApproval(code) {
    const checkInterval = setInterval(() => {
        fetch(`check-approval.json?code=${code}`)
            .then(response => response.json())
            .then(data => {
                if (data.approved) {
                    clearInterval(checkInterval);
                    closePopup();
                    alert("✅ Dianne has approved your request! Redirecting you to the chatroom...");
                    window.location.href = `chatroom.html?code=${encodeURIComponent(code)}`;
                }
            });
    }, 3000); // Check every 3 seconds
}

// ✅ Function: Show Pop-up Notifications (For Errors & Queue Messages)
function showPopup(title, message, type) {
    const popup = document.createElement("div");
    popup.classList.add("popup", type);
    popup.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="close-btn" onclick="closePopup()">OK</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = "block";
}

// ✅ Function: Close Pop-ups
function closePopup() {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.remove());
}
// ✅ Function: Show Booking Pop-up (Chat with Dianne on Facebook)
function showBookingPopup() {
    showPopup("Book a Chat", `
        💖 To book a chat with me, please send a message on my **Facebook Page**: <br><br>
        <a href="https://www.facebook.com/chatwithdianne" target="_blank" class="popup-link">Chat with Dianne</a> <br><br>
        📩 I'll respond to confirm your booking!
    `, "booking");
}

// ✅ Function: Show Pop-ups for Various Actions
function showPopup(title, message, type) {
    const popup = document.createElement("div");
    popup.classList.add("popup", type);
    popup.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="close-btn" onclick="closePopup()">OK</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = "block";
}

// ✅ Function: Close Pop-ups
function closePopup() {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.remove());
}
// ✅ Function: Protect Admin Dashboard (Redirect to `index.html` if Not Logged In)
if (window.location.pathname.includes("admin-dashboard.html") && !localStorage.getItem("isAdmin")) {
    window.location.href = "index.html";
}

// ✅ Function: Logout Admin
function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    window.location.href = 'index.html';
}

// ✅ Load Queue Requests
function loadQueue() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = ""; // Clear existing list

    // Simulated queue data
    const queueRequests = JSON.parse(localStorage.getItem("chatQueue")) || [];

    if (queueRequests.length === 0) {
        queueList.innerHTML = "<li>No pending chat requests.</li>";
        return;
    }

    queueRequests.forEach((request, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${request.name}</strong> - Code: ${request.code}
            <button onclick="approveChat('${request.code}', ${index})">✅ Approve</button>
        `;
        queueList.appendChild(listItem);
    });
}

// ✅ Approve Chat Request (Redirect Customer & Admin to `chatroom.html`)
function approveChat(code, index) {
    alert(`✅ Customer with code ${code} has been approved! Redirecting to the chatroom.`);
    
    // Remove approved request from queue
    let queueRequests = JSON.parse(localStorage.getItem("chatQueue")) || [];
    queueRequests.splice(index, 1);
    localStorage.setItem("chatQueue", JSON.stringify(queueRequests));

    loadQueue(); // Refresh queue list

    // Redirect to chatroom
    window.location.href = `chatroom.html?code=${encodeURIComponent(code)}`;
}

// ✅ Load Valid Access Codes
function loadCodes() {
    const codeList = document.getElementById("codeList");
    codeList.innerHTML = ""; // Clear existing list

    const validCodes = JSON.parse(localStorage.getItem("validCodes")) || [];

    if (validCodes.length === 0) {
        codeList.innerHTML = "<li>No access codes added yet.</li>";
        return;
    }

    validCodes.forEach((code, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${code}</strong>
            <button onclick="removeCode(${index})">❌ Remove</button>
        `;
        codeList.appendChild(listItem);
    });
}

// ✅ Add New Valid Access Code
function addCode() {
    const newCode = document.getElementById("newCode").value.trim();
    if (!newCode) {
        alert("Please enter a valid access code.");
        return;
    }

    let validCodes = JSON.parse(localStorage.getItem("validCodes")) || [];
    if (validCodes.includes(newCode)) {
        alert("This code already exists.");
        return;
    }

    validCodes.push(newCode);
    localStorage.setItem("validCodes", JSON.stringify(validCodes));
    document.getElementById("newCode").value = "";
    loadCodes();
}

// ✅ Remove Access Code
function removeCode(index) {
    let validCodes = JSON.parse(localStorage.getItem("validCodes")) || [];
    validCodes.splice(index, 1);
    localStorage.setItem("validCodes", JSON.stringify(validCodes));
    loadCodes();
}

// 🔄 Load Queue & Valid Codes When Admin Dashboard Opens
if (window.location.pathname.includes("admin-dashboard.html")) {
    loadQueue();
    loadCodes();
}

// ✅ Validate Customer Code (Used in `index.html`)
function requestAccess() {
    const code = document.getElementById("accessCode").value.trim();
    const validCodes = JSON.parse(localStorage.getItem("validCodes")) || [];

    if (!validCodes.includes(code)) {
        showPopup("Invalid Code", "Oops! This code is not recognized. Please check your email and try again.", "invalid");
        return;
    }

    // 🎉 Show "Waiting in Queue" Pop-up
    showPopup("You're in Queue!", `
        🎉 Thank you for entering your code! <br><br>
        Your chat request is now in queue and awaiting Dianne's approval. <br><br>
        🔔 **Please double-check your scheduled booking time** as you will only be accommodated **during your scheduled slot**.
    `, "queue");

    // Store in queue
    let queueRequests = JSON.parse(localStorage.getItem("chatQueue")) || [];
    queueRequests.push({ name: "Customer", code });
    localStorage.setItem("chatQueue", JSON.stringify(queueRequests));

    // Start Checking for Admin Approval
    checkAdminApproval(code);
}

// ✅ Load Records from `localStorage`
function loadRecords() {
    const recordsTable = document.getElementById("recordsTable");
    recordsTable.innerHTML = ""; // Clear existing records

    const records = JSON.parse(localStorage.getItem("chatRecords")) || [];

    if (records.length === 0) {
        recordsTable.innerHTML = "<tr><td colspan='6'>No records found.</td></tr>";
        return;
    }

    records.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.accessCode}</td>
            <td>${record.customerName}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.duration}</td>
            <td>
                <select onchange="updateStatus(${index}, this.value)">
                    <option value="Pending" ${record.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Completed" ${record.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option value="No Show" ${record.status === "No Show" ? "selected" : ""}>No Show</option>
                </select>
            </td>
        `;
        recordsTable.appendChild(row);
    });
}

// ✅ Update Record Status
function updateStatus(index, newStatus) {
    let records = JSON.parse(localStorage.getItem("chatRecords")) || [];
    records[index].status = newStatus;
    localStorage.setItem("chatRecords", JSON.stringify(records));
}

// ✅ Add New Record
function addRecord() {
    const accessCode = document.getElementById("recordAccessCode").value.trim();
    const customerName = document.getElementById("recordCustomerName").value.trim();
    const date = document.getElementById("recordDate").value;
    const time = document.getElementById("recordTime").value;
    const duration = document.getElementById("recordDuration").value.trim();
    const status = document.getElementById("recordStatus").value;

    if (!accessCode || !customerName || !date || !time || !duration) {
        alert("Please fill in all fields.");
        return;
    }

    let records = JSON.parse(localStorage.getItem("chatRecords")) || [];
    records.push({ accessCode, customerName, date, time, duration, status });
    localStorage.setItem("chatRecords", JSON.stringify(records));

    closePopup();
    loadRecords();
}

// ✅ Search Records
function searchRecords() {
    const searchTerm = document.getElementById("searchRecords").value.toLowerCase();
    const records = JSON.parse(localStorage.getItem("chatRecords")) || [];
    const recordsTable = document.getElementById("recordsTable");
    recordsTable.innerHTML = "";

    const filteredRecords = records.filter(record =>
        record.accessCode.toLowerCase().includes(searchTerm) ||
        record.customerName.toLowerCase().includes(searchTerm)
    );

    if (filteredRecords.length === 0) {
        recordsTable.innerHTML = "<tr><td colspan='6'>No matching records found.</td></tr>";
        return;
    }

    filteredRecords.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.accessCode}</td>
            <td>${record.customerName}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.duration}</td>
            <td>
                <select onchange="updateStatus(${index}, this.value)">
                    <option value="Pending" ${record.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Completed" ${record.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option value="No Show" ${record.status === "No Show" ? "selected" : ""}>No Show</option>
                </select>
            </td>
        `;
        recordsTable.appendChild(row);
    });
}

// ✅ Show & Close Pop-up
function showAddRecordPopup() {
    document.getElementById("addRecordPopup").style.display = "flex";
}
function closePopup() {
    document.getElementById("addRecordPopup").style.display = "none";
}

// 🔄 Load Records on Page Load
if (window.location.pathname.includes("records.html")) {
    loadRecords();
}
