function generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    const upper = document.getElementById("uppercase").checked;
    const lower = document.getElementById("lowercase").checked;
    const numbers = document.getElementById("numbers").checked;
    const symbols = document.getElementById("symbols").checked;

    if (!length || length < 8 || length > 32) {
        alert("Password length must be between 8 and 32.");
        return;
    }

    let chars = "";

    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?/";

    if (chars === "") {
        alert("Select at least one option!");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById("generatedPassword").value = password;

    updateStrength(length, upper, lower, numbers, symbols);
}

function updateStrength(length, upper, lower, numbers, symbols) {
    let score = 0;

    if (length >= 8) score++;
    if (length >= 12) score++;
    if (upper) score++;
    if (lower) score++;
    if (numbers) score++;
    if (symbols) score++;

    let strengthText = document.getElementById("strengthText");

    if (score <= 2) {
        strengthText.innerText = "Weak";
    } else if (score <= 4) {
        strengthText.innerText = "Medium";
    } else {
        strengthText.innerText = "Strong";
    }
}

function copyPassword() {
    let password = document.getElementById("generatedPassword").value;

    if (password === "") {
        alert("Generate password first!");
        return;
    }

    navigator.clipboard.writeText(password);
    alert("Copied!");
}

function togglePassword() {
    let input = document.getElementById("generatedPassword");

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function savePassword() {
    let password = document.getElementById("generatedPassword").value;
    let length = document.getElementById("length").value;

    let upper = document.getElementById("uppercase").checked ? 1 : 0;
    let lower = document.getElementById("lowercase").checked ? 1 : 0;
    let numbers = document.getElementById("numbers").checked ? 1 : 0;
    let symbols = document.getElementById("symbols").checked ? 1 : 0;

    if (password === "") {
        alert("Generate password first!");
        return;
    }

    fetch("save_password.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `password=${encodeURIComponent(password)}&length=${length}&upper=${upper}&lower=${lower}&numbers=${numbers}&symbols=${symbols}`
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);

        if (data.trim() === "Saved") {
            alert("Saved successfully");
            loadHistory();
        } else {
            alert("Save error");
        }
    });
}

function loadHistory() {
    fetch("get_history.php")
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("history");
        list.innerHTML = "";

        data.forEach(item => {
            let li = document.createElement("li");

            li.innerHTML = `
                <strong>${item.created_at}</strong>
                <br>
                ${item.password_text}
                <br>
                <button onclick="deletePassword(${item.id})">Delete</button>
            `;

            list.appendChild(li);
        });
    });
}

function deletePassword(id) {
    fetch("delete_password.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `id=${id}`
    })
    .then(() => loadHistory());
}

function clearHistory() {
    fetch("clear_history.php", {
        method: "POST"
    })
    .then(() => loadHistory());
}

function searchHistory() {
    let input = document.getElementById("search").value.toLowerCase();
    let items = document.querySelectorAll("#history li");

    items.forEach(item => {
        let text = item.innerText.toLowerCase();
        item.style.display = text.includes(input) ? "block" : "none";
    });
}

function exportHistory() {
    fetch("get_history.php")
    .then(res => res.json())
    .then(data => {
        let text = "";

        data.forEach((item, i) => {
            text += `${i+1}. ${item.password_text} (${item.created_at})\n`;
        });

        let blob = new Blob([text], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "history.txt";
        link.click();
    });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

window.onload = function () {
    loadHistory();
};