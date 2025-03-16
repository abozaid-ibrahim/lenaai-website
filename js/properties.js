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

        $(".dropdown, .bb-dropdown").not(dropdown).slideUp();

        dropdown.stop(true, true).slideToggle();
    });

    $(".filters").on("click", ".filters-drop li", function (event) {
        event.stopPropagation();

        let selectedItem = $(this).clone();
        let filterButton = $(this).closest(".filters-drop").find(".value");
        $(".filters-drop li").removeClass("active");
        $(this).addClass("active");

        if (filterButton.length) {
            filterButton.html(selectedItem.html() + `<i class="fa-solid fa-chevron-down"></i>`);
        }

        $(this).closest(".dropdown").slideUp();
    });

    let selectedBedrooms = [];
    let selectedBathrooms = [];

    $(".filters").on("click", ".bb-drop", function (event) {
        event.stopPropagation();
        let dropdown = $(this).find(".bb-dropdown");
        $(".dropdown, .bb-dropdown").not(dropdown).slideUp();
        dropdown.stop(true, true).slideToggle();
    });

    $(".filters").on("click", ".bb-options li", function (event) {
        event.stopPropagation();

        let options = $(this).closest(".bb-options");
        let isBedroom = options.prev(".drop-title").text().includes("Bedroom");
        let value = $(this).text().trim();
        let isSelected = $(this).hasClass("active");

        $(this).toggleClass("active");

        if (isBedroom) {
            updateSelection(selectedBedrooms, value, isSelected);
        } else {
            updateSelection(selectedBathrooms, value, isSelected);
        }

        updateDisplay($(this).closest(".bb-drop"));
    });

    function updateSelection(array, value, isSelected) {
        if (isSelected) {
            array.splice(array.indexOf(value), 1);
        } else {
            array.push(value);
        }
        array.sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
    }

    function formatRange(array, singular, plural) {
        if (array.length === 0) return "";
    
        let hasStudio = array.includes("Studio");
        let hasSevenPlus = array.includes("7+");
        
        let numbers = array
            .filter(item => item !== "Studio" && item !== "7+")
            .map(Number)
            .sort((a, b) => a - b);
    
        if (hasSevenPlus) {
            if (numbers.length > 0) {
                numbers.push("7+");
            } else {
                numbers = ["7+"];
            }
        }
    
        let formattedNumbers = "";
        if (numbers.length === 1) {
            formattedNumbers = `${numbers[0]} ${numbers[0] === "1" ? singular : plural}`;
        } else if (numbers.length > 1) {
            formattedNumbers = `${numbers[0]}-${numbers[numbers.length - 1]} ${plural}`;
        }
    
        return hasStudio ? `Studio${formattedNumbers ? ", " + formattedNumbers : ""}` : formattedNumbers;
    }        

    function updateDisplay(dropdown) {
        let filterButton = dropdown.find(".value");
        let bedsText = formatRange(selectedBedrooms, "Bed", "Beds");
        let bathsText = formatRange(selectedBathrooms, "Bath", "Baths");

        let displayText = bedsText && bathsText ? `${bedsText} & ${bathsText}` : bedsText || bathsText;
        filterButton.html((displayText || "Beds & Baths") + ` <i class="fa-solid fa-chevron-down"></i>`);
    } 

    $(document).click(function () {
        $(".dropdown, .bb-dropdown").slideUp();
    });

    $(".filters").on("click", ".price-drop", function (event) {
        event.stopPropagation();

        let dropdown = $(this).find(".dropdown");

        $(".dropdown, .bb-dropdown").not(dropdown).slideUp();

        dropdown.stop(true, true).slideToggle();
    });

    $(".price-input").on("click", function (event) {
        event.stopPropagation();
    });

    $(".price-input").on("focus", function (event) {
        event.stopPropagation();
        let dropdownId = $(this).attr("id") === "min-price" ? "#min-price-dropdown" : "#max-price-dropdown";
        $(".price-dropdown").not(dropdownId).slideUp();
        $(dropdownId).stop(true, true).slideDown();
    });

    function updatePriceDisplay() {
        let minPrice = $("#min-price").val().trim();
        let maxPrice = $("#max-price").val().trim();
        let displayText = "Price";
    
        if (minPrice && maxPrice) {
            displayText = `${minPrice} - ${maxPrice}`;
        } else if (minPrice) {
            displayText = `From ${minPrice}`;
        } else if (maxPrice) {
            displayText = `Up to ${maxPrice}`;
        }
    
        $(".price-drop .value").html(displayText + ' <i class="fa-solid fa-chevron-down"></i>');
    }

    $(".price-dropdown li").on("click", function (event) {
        event.stopPropagation();
        let selectedValue = $(this).text();
        let $dropdown = $(this).closest(".price-dropdown");
        let $input = $dropdown.attr("id") === "min-price-dropdown" ? $("#min-price") : $("#max-price");
        $dropdown.find("li").removeClass("active");
        $(this).addClass("active");
        $input.val(selectedValue);
        $dropdown.slideUp();
        updatePriceDisplay();
    });

    $("#min-price, #max-price").on("input", updatePriceDisplay);

    $(".dropdown, .bb-dropdown").on("click", function (event) {
        if (!$(event.target).is("li")) { 
            event.stopPropagation();
            $(".price-dropdown").slideUp();
        }
    });

    $(document).on("click", function () {
        $(".dropdown, .price-dropdown").slideUp();
    });
})