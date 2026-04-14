function generatePassword() {
    let length = parseInt(document.getElementById("length").value);
    let upper = document.getElementById("upper").checked;
    let lower = document.getElementById("lower").checked;
    let number = document.getElementById("number").checked;
    let symbol = document.getElementById("symbol").checked;

    if (isNaN(length) || length < 8 || length > 32) {
        alert("Password length must be between 8 and 32.");
        return;
    }

    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (number) chars += "0123456789";
    if (symbol) chars += "!@#$%^&*()_+[]{}<>?/";

    if (chars === "") {
        alert("Please select at least one character type.");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    document.getElementById("result").value = password;
    updateStrength(length, upper, lower, number, symbol);
}

function copyPassword() {
    let passwordField = document.getElementById("result");
    let password = passwordField.value;

    if (password === "") {
        alert("Generate a password first.");
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => alert("Password copied successfully."))
        .catch(() => alert("Copy failed."));
}

function savePassword() {
    let password = document.getElementById("result").value;

    if (password === "") {
        alert("Generate a password first.");
        return;
    }

    let history = JSON.parse(localStorage.getItem("passwords")) || [];
    history.push({
        value: password,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("passwords", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("passwords")) || [];
    let list = document.getElementById("history");
    list.innerHTML = "";

    history.forEach((item, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <div class="history-top">
                <strong>${item.time}</strong>
                <button class="delete-btn" onclick="deletePassword(${index})">Delete</button>
            </div>
            <div class="history-password">${item.value}</div>
        `;

        list.appendChild(li);
    });
}

function deletePassword(index) {
    let history = JSON.parse(localStorage.getItem("passwords")) || [];
    history.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(history));
    displayHistory();
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all saved passwords?")) {
        localStorage.removeItem("passwords");
        displayHistory();
    }
}

function togglePassword() {
    let resultField = document.getElementById("result");
    let toggleButton = document.querySelector(".small-btn");

    if (resultField.type === "password") {
        resultField.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        resultField.type = "password";
        toggleButton.textContent = "Show";
    }
}

function updateStrength(length, upper, lower, number, symbol) {
    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (upper) score++;
    if (lower) score++;
    if (number) score++;
    if (symbol) score++;

    let strengthText = document.getElementById("strengthText");

    if (score <= 2) {
        strengthText.textContent = "Weak";
    } else if (score <= 4) {
        strengthText.textContent = "Medium";
    } else {
        strengthText.textContent = "Strong";
    }
}

displayHistory();
    