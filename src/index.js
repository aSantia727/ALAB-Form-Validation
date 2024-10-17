const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");
const errorDisplay = document.getElementById("errorDisplay");

function showError(message, element) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
  if (element) {
    element.focus();
  }
}

function hideError() {
  errorDisplay.style.display = "none";
}

function validateRegistrationForm(event) {
  event.preventDefault();

  hideError();

  const username = registrationForm.username.value.trim();
  const email = registrationForm.email.value.trim().toLowerCase();
  const password = registrationForm.password.value;
  const passwordCheck = registrationForm.passwordCheck.value;
  const terms = registrationForm.terms.checked;

  if (username === "") {
    return showError("Username cannot be blank.", registrationForm.username);
  }
  if (username.length < 4) {
    return showError(
      "Username must be at least 4 characters long.",
      registrationForm.username
    );
  }
  if (new Set(username).size < 2) {
    return showError(
      "Username must contain at least 2 unique characters.",
      registrationForm.username
    );
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return showError(
      "Username cannot contain any special characters or whitespace.",
      registrationForm.username
    );
  }

  if (email === "") {
    return showError("Email cannot be blank.", registrationForm.email);
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return showError(
      "Please enter a valid email address.",
      registrationForm.email
    );
  }
  if (email.endsWith("@example.com")) {
    return showError(
      'Email cannot be from the domain "example.com".',
      registrationForm.email
    );
  }

  if (password === "") {
    return showError("Password cannot be blank.", registrationForm.password);
  }
  if (password.length < 12) {
    return showError(
      "Password must be at least 12 characters long.",
      registrationForm.password
    );
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return showError(
      "Password must have at least one uppercase and one lowercase letter.",
      registrationForm.password
    );
  }
  if (!/\d/.test(password)) {
    return showError(
      "Password must contain at least one number.",
      registrationForm.password
    );
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return showError(
      "Password must contain at least one special character.",
      registrationForm.password
    );
  }
  if (password.toLowerCase().includes("password")) {
    return showError(
      'Password cannot contain the word "password".',
      registrationForm.password
    );
  }
  if (password !== passwordCheck) {
    return showError("Passwords do not match.", registrationForm.passwordCheck);
  }

  if (!terms) {
    return showError(
      "You must agree to the Terms of Use.",
      registrationForm.terms
    );
  }

  let users = loadUsers();
  if (users.some((user) => user.username === username.toLowerCase())) {
    return showError(
      "That username is already taken.",
      registrationForm.username
    );
  }

  users.push({ username: username.toLowerCase(), email, password });
  saveUsers(users);

  registrationForm.reset();
  alert("Registration successful!");
}

function validateLoginForm(event) {
  event.preventDefault();

  hideError();

  const username = loginForm.username.value.trim().toLowerCase();
  const password = loginForm.password.value;
  const persist = loginForm.persist.checked;

  if (username === "") {
    return showError("Username cannot be blank.", loginForm.username);
  }

  const users = loadUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return showError("Invalid username or password.", loginForm.username);
  }

  if (password === "") {
    return showError("Password cannot be blank.", loginForm.password);
  }
  if (user.password !== password) {
    return showError("Invalid username or password.", loginForm.password);
  }

  loginForm.reset();
  let successMessage = "Login successful!";
  if (persist) {
    successMessage += " You will remain logged in.";
  }
  alert(successMessage);
}

function loadUsers() {
  const usersData = localStorage.getItem("users");
  return usersData ? JSON.parse(usersData) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

registrationForm.addEventListener("submit", validateRegistrationForm);
loginForm.addEventListener("submit", validateLoginForm);
