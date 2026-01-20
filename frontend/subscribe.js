const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();

  // ✅ EMAIL FORMAT VALIDATION (your code)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showNotification("Invalid email format!", "error");
  }

  try {
    const res = await fetch("/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    showNotification(data.message, data.type);
    form.reset();

  } catch {
    showNotification("Server error", "error");
  }
});

/* notif handling */
function showNotification(msg, type) {
  const n = document.getElementById("notif");

  n.textContent = msg;
  n.className = `show ${type}`;

  clearTimeout(n._timeout);

  n._timeout = setTimeout(() => {
    n.className = "";
  }, 2500);
}
