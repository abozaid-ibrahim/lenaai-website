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
    if (submitButton) {
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
    }

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

    const signupSubmit = document.querySelector("#signup-form #signup-submit");
    if (signupSubmit) {
        document.querySelector("#signup-form").addEventListener("submit", function (event) {
            event.preventDefault();
        
            const errorName = document.querySelector(".error-name");
            const errorPhone = document.querySelector(".error-phone");
            const errorEmail = document.querySelector(".error-email");
            const errorPassword = document.querySelector(".error-password");
        
            const firstName = document.querySelector("#first-name").value.trim();
            const lastName = document.querySelector("#last-name").value.trim();
            const phone = document.querySelector("#phone").value.trim();
            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password1").value.trim();
            const confirmedPassword = document.querySelector("#password2").value.trim();
        
            const fullName = `${firstName} ${lastName}`;
        
            errorName.innerHTML = "";
            errorPhone.innerHTML = "";
            errorEmail.innerHTML = "";
            errorPassword.innerHTML = "";
        
            const nameRegex = /^[A-Za-z\s]{2,}$/;
            let isValid = true;
        
            if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
                errorName.style.display = "block";
                errorName.innerHTML = `Provide a valid First and Last Name (Only letters, min 2 characters).`;
                isValid = false;
            }
        
            const phoneNumberRegex = /^[\d\s+\-()]{11,15}$/;
            if (!phoneNumberRegex.test(phone)) {
                errorPhone.style.display = "block";
                errorPhone.innerHTML = `Invalid Phone Number. Enter 11-15 digits (can include +, -).`;
                isValid = false;
            }
        
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errorEmail.style.display = "block";
                errorEmail.innerHTML = `Invalid Email Address. Please enter a valid email.`;
                isValid = false;
            }
    
            if (password !== confirmedPassword) {
                errorPassword.style.display = "block";
                errorPassword.innerHTML = `Passwords do not match.`;
                isValid = false;
            }
        
            document.querySelector("#first-name").style.border = !nameRegex.test(firstName) ? "2px solid red" : "";
            document.querySelector("#last-name").style.border = !nameRegex.test(lastName) ? "2px solid red" : "";
            document.querySelector("#phone").style.border = !phoneNumberRegex.test(phone) ? "2px solid red" : "";
            document.querySelector("#email").style.border = !emailRegex.test(email) ? "2px solid red" : "";

            if (password.length < 8) {
                errorPassword.innerHTML = "Password must be at least 8 characters long.";
                errorPassword.style.display = "block";
                document.querySelector("#password1").style.border = "2px solid red";
                document.querySelector("#password2").style.border = "2px solid red";
                isValid = false;
            } else if (password !== confirmedPassword) {
                errorPassword.innerHTML = "Passwords do not match.";
                errorPassword.style.display = "block";
                document.querySelector("#password1").style.border = "2px solid red";
                document.querySelector("#password2").style.border = "2px solid red";
                isValid = false;
            } else {
                errorPassword.innerHTML = "";
                errorPassword.style.display = "none";
                document.querySelector("#password1").style.border = "none";
                document.querySelector("#password2").style.border = "none";
            }
        
            if (!isValid) return;
        
            const clientData = {
                name: fullName,
                phone: phone,
                email: email,
                password: password
            };
    
            console.log(clientData);
        });
    }
})