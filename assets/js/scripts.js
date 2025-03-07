function requestAccess() {
    const code = document.getElementById("accessCode").value.trim();
    const validCodes = ["ABC123", "XYZ456", "LMN789"];

    if (!validCodes.includes(code)) {
        showPopup("Invalid Code", "Oops! This code is not recognized. Please double-check your email and try again.", "invalid");
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

function closePopup() {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => popup.remove());
}
