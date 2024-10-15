document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registration");
  const errorDisplay = document.getElementById("errorDisplay");

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = registrationForm.username.value.trim().toLowerCase();
    const email = registrationForm.email.value.trim().toLowerCase();
    const password = registrationForm.password.value;
    const passwordCheck = registrationForm.passwordCheck.value;
    const terms = registrationForm.terms.checked;

    const errors = [];

    // --- Username Validation ---
    if (username === "") {
      errors.push("Username cannot be blank.");
    }
    if (username.length < 4) {
      errors.push("Username must be at least 4 characters long.");
    }
    if (new Set(username).size < 2) {
      errors.push("Username must contain at least 2 unique characters.");
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.push("Username cannot contain special characters or whitespace.");
    }

    // --- Unique Username Validation ---
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    if (storedUsers[username]) {
      errors.push("That username is already taken.");
    }

    // --- Email Validation ---
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    if (email.endsWith("@example.com")) {
      errors.push('Email cannot be from the domain "example.com".');
    }

    // --- Password Validation ---
    if (password.length < 12) {
      errors.push("Password must be at least 12 characters long.");
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      errors.push(
        "Password must have at least one uppercase and one lowercase letter."
      );
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    if (password.toLowerCase().includes("password")) {
      errors.push('Password cannot contain the word "password".');
    }
    if (password.includes(username)) {
      errors.push("Password cannot contain the username.");
    }
    if (password !== passwordCheck) {
      errors.push("Passwords do not match.");
    }

    // --- Terms and Conditions ---
    if (!terms) {
      errors.push("You must agree to the Terms of Use.");
    }

    // --- Error Handling and Storage ---
    if (errors.length > 0) {
      displayErrors(errors);
    } else {
      // Store user data in localStorage
      storedUsers[username] = { email, password };
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Clear form fields
      registrationForm.reset();

      // Show success message
      displayErrors(["Registration successful!"]);
    }
  });

  // --- Helper Function to Display Errors ---
  function displayErrors(errors) {
    errorDisplay.innerHTML = errors.map((error) => `<p>${error}</p>`).join("");
  }
});
