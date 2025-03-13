document.addEventListener("DOMContentLoaded", function () {
    // check authentication status
    function checkLoginStatus() {
        const token = localStorage.getItem("lenaai_access_token");
        if (token) {
            $.ajax({
                url: `https://api.lenaai.net/me?access_token=${token}`,
                type: "POST",
                success: function(response) {
                    $("#signup, .sign-up-sm").css("display", "none");
                    $("#sign-in")
                        .html('<i class="bi bi-box-arrow-right"></i> Logout')
                        .addClass("logout");

                    $(".sign-in-sm button")
                        .html('<i class="bi bi-box-arrow-right"></i> Logout')
                        .addClass("logout");

                    function logoutUser() {
                        localStorage.removeItem("lenaai_access_token");

                        window.location.href = "./index.html";
                    }

                    $("#sign-in, .sign-in-sm button").on("click", function (event) {
                        event.preventDefault();
                        logoutUser();
                    });
                },
                error: function(xhr) {
                    console.log("Token expired or invalid, user must log in again");
                    localStorage.removeItem("lenaai_access_token");
                }
            });
        }
    }

    checkLoginStatus();

    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });

    $(".filters").on("click", ".filters-drop", function (event) {
        event.stopPropagation();

        let dropdown = $(this).find(".dropdown");

        $(".dropdown").not(dropdown).slideUp();

        dropdown.stop(true, true).slideToggle();
    });

    $(".filters").on("click", ".filters-drop li", function (event) {
        event.stopPropagation();

        let selectedItem = $(this).clone();
        let filterButton = $(this).closest(".filters-drop").find(".value");

        if (filterButton.length) {
            filterButton.html(selectedItem.html() + `<i class="fa-solid fa-chevron-down"></i>`);
        }

        $(this).closest(".dropdown").slideUp();
    });

    $(document).click(function () {
        $(".dropdown").slideUp();
    });
})