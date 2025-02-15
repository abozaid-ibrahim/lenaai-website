document.addEventListener("DOMContentLoaded", function () {
    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });
})