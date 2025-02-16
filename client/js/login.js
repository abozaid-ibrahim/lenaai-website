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
            url: "http://127.0.0.1:8000/login",
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
})