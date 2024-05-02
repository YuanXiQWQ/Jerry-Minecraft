/**
 * Handles the login form
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const loginNow = document.getElementById("text-LoginNow");

    const showLoginForm = () => {
        document.getElementById("loginOrRegister").classList.add("hidden");
        document.getElementById("registerForm").classList.add("hidden");
        document.getElementById("loginForm").classList.remove("hidden");
    };

    loginBtn.addEventListener("click", showLoginForm);
    loginNow.addEventListener("click", showLoginForm);

    const registerBtn = document.getElementById("registerBtn");
    const registerNow = document.getElementById("text-RegisterNow");

    const showRegisterForm = () => {
        document.getElementById("loginOrRegister").classList.add("hidden");
        document.getElementById("loginForm").classList.add("hidden");
        document.getElementById("registerForm").classList.remove("hidden");
    };

    registerBtn.addEventListener("click", showRegisterForm);
    registerNow.addEventListener("click", showRegisterForm);

});
