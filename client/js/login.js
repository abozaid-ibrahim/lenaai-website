document.addEventListener("DOMContentLoaded", function () {
    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });

    function storeToken(token) {
        localStorage.setItem("lenaai_access_token", token);
    }

    const submitButton = document.getElementById("submit-btn");
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        $(".error").html("");

        $.ajax({
            url: "https://api.lenaai.net/login",
            type: "POST",
            data: {
                "username": username,
                "password": password
            },
            success: function(response) {
                console.log("Login successful:", response);
                storeToken(response.access_token);
                window.location.href = "./dashboard.html"
            },
            error: function(xhr) {
                $(".error").html("Invalid Username Or Password");
            }
        });
    });

    const themeToggle = document.getElementById("theme-toggle");
    const themeStylesheet = document.getElementById("theme-stylesheet");
    const themeIcon = themeToggle.querySelector("i");

    const lightThemePath = "css/login-light.css";
    const darkThemePath = "css/login-dark.css";

    const savedTheme = localStorage.getItem("theme") || "light";
    themeStylesheet.href = savedTheme === "dark" ? darkThemePath : lightThemePath;

    function updateButton(theme) {
        if (theme === "dark") {
            themeToggle.innerHTML = `<i class="bi bi-sun"></i>`;
        } else {
            themeToggle.innerHTML = `<i class="bi bi-moon"></i>`;
        }
    }

    updateButton(savedTheme);

    themeToggle.addEventListener("click", function () {
        const isDark = themeStylesheet.href.includes("login-light.css");
        themeStylesheet.href = isDark ? darkThemePath : lightThemePath;
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateButton(isDark ? "dark" : "light");
    });
})