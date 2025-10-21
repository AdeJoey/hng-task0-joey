// contact.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm"); // matches your HTML's id
  if (!form) {
    console.error("contact.js: form with id 'contactForm' not found.");
    return;
  }

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const successMsg = document.getElementById("successMessage");

  // Basic email regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // helper: show inline error message (accessible)
  function showInlineError(field, msg) {
    // find or create an <p class="field-error" aria-live> after the field
    let err = field.nextElementSibling;
    if (!err || !err.classList.contains("field-error")) {
      err = document.createElement("p");
      err.className = "field-error";
      err.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", err);
    }
    err.textContent = msg;
    field.setAttribute("aria-invalid", "true");
    field.style.borderBottom = "2px solid #ef4444"; // red
  }

  function clearInlineError(field) {
    let err = field.nextElementSibling;
    if (err && err.classList.contains("field-error")) {
      err.textContent = "";
    }
    field.removeAttribute("aria-invalid");
    field.style.borderBottom = "2px solid var(--accent)";
  }

  // validate single field, returns boolean
  function validateField(field) {
    const id = field.id;
    const val = (field.value || "").trim();

    if (id === "fullName") {
      if (!val) {
        showInlineError(field, "Full name is required.");
        return false;
      }
      clearInlineError(field);
      return true;
    }

    if (id === "email") {
      if (!val || !emailPattern.test(val)) {
        showInlineError(field, "Please enter a valid email (name@example.com).");
        return false;
      }
      clearInlineError(field);
      return true;
    }

    if (id === "subject") {
      if (!val) {
        showInlineError(field, "Subject is required.");
        return false;
      }
      clearInlineError(field);
      return true;
    }

    if (id === "message") {
      if (!val || val.length < 10) {
        showInlineError(field, "Message must be at least 10 characters.");
        return false;
      }
      clearInlineError(field);
      return true;
    }

    // default
    return true;
  }

  // attach blur listeners (validate when user leaves an input)
  [fullName, email, subject, message].forEach((f) => {
    if (!f) return;
    f.addEventListener("blur", () => validateField(f));
    // clear error on input so it's reactive
    f.addEventListener("input", () => {
      // only clear inline error if field now valid
      if (f.id === "email") {
        if (emailPattern.test(f.value.trim())) clearInlineError(f);
      } else if (f.value.trim()) {
        clearInlineError(f);
      }
    });
  });

  // final submission handling
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields using logical AND (&&), NOT bitwise &
    const ok =
      validateField(fullName) &&
      validateField(email) &&
      validateField(subject) &&
      validateField(message);

    if (!ok) {
      // show a compact SweetAlert error, but user sees inline errors too
      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "Please fix the errors",
          text: "Some fields require your attention. Errors are shown inline.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      } else {
        alert("Please fix the errors. (SweetAlert2 not loaded)");
      }
      return;
    }

    // success — show an attractive SweetAlert2 modal
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Message Sent! 🎉",
        html:
          `<p>Thanks, <strong>${escapeHtml(fullName.value.trim())}</strong> — your message has been submitted.</p>` +
          `<p class="swal-sub">I'll review and get back to you shortly.</p>`,
        icon: "success",
        confirmButtonColor: "#2563eb",
        background: "#0b0b12",
        color: "#f1f5f9",
        showCloseButton: true,
      }).then(() => {
        form.reset();
        [fullName, email, subject, message].forEach(clearInlineError);
      });
    } else {
      alert("Message sent (SweetAlert2 not loaded).");
      form.reset();
    }
  });

  // small helper: escape HTML for insertion into Swal
  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
