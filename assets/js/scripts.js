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
