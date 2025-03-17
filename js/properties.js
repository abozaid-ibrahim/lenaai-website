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

    $(".filters").on("click", ".types li, .views li", function (event) {
        event.stopPropagation();

        let selectedItem = $(this).clone();
        let filterButton = $(this).closest(".types, .views").find(".value");
        $(this).closest(".types, .views").find("li").removeClass("active");
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

    function positionDropdown($input, $dropdown) {
        let inputOffset = $input.offset();
        $dropdown.css({
            top: inputOffset.top + $input.outerHeight(),
            left: inputOffset.left,
            width: $input.outerWidth(),
            position: "absolute",
            zIndex: 1000
        }).slideDown();
    }

    $(".price-input").on("click", function (event) {
        event.stopPropagation();
    });

    $(".price-input").on("focus", function (event) {
        event.stopPropagation();
        let dropdownId = $(this).attr("id") === "min-price" ? "#min-price-dropdown" : "#max-price-dropdown";
        let $dropdown = $(dropdownId);
        $(".price-dropdown").not(dropdownId).slideUp();
        $(dropdownId).stop(true, true).slideDown();
        positionDropdown($(this), $dropdown);
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

    document.querySelectorAll(".property").forEach(property => {
        const slides = property.querySelectorAll(".slide");
        const sliderWrapper = property.querySelector('.slider-wrapper');
        const prev = property.querySelector("#prev");
        const next = property.querySelector("#next");
    
        let slideIndex = 0;
    
        prev.style.display = "none";
        next.style.display = "none";
    
        function showSlides(num) {
            slideIndex = (num + slides.length) % slides.length;
    
            if (property.matches(":hover")) {
                prev.style.display = slideIndex === 0 ? "none" : "block";
                next.style.display = slideIndex === slides.length - 1 ? "none" : "block";
            } else {
                prev.style.display = "none";
                next.style.display = "none";
            }
    
            sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
    
        function plusSlides(num) {
            showSlides(slideIndex += num);
        }
    
        showSlides(slideIndex);
    
        if (prev) prev.addEventListener("click", () => plusSlides(-1));
        if (next) next.addEventListener("click", () => plusSlides(1));
    
        function checkScreenWidth() {
            if (window.innerWidth < 1100) {
                prev.style.display = "none";
                next.style.display = "none";
            } else {
                showSlides(slideIndex);
            }
        }
    
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);
    
        property.addEventListener("mouseenter", () => {
            if (window.innerWidth > 1100) {
                showSlides(slideIndex);
            }
        });
    
        property.addEventListener("mouseleave", () => {
            prev.style.display = "none";
            next.style.display = "none";
        });
    });

    const featuredProperties = document.querySelectorAll('.featured-item');
    
    featuredProperties.forEach(property => {
        property.addEventListener('click', function() {

            this.style.outline = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--secondary-color')}`;
            setTimeout(() => {
                this.style.outline = 'none';
            }, 500);
        });
    });
    
    const timeAgoTexts = ['Added 2 days ago', 'New today!', 'Added last week', 'Hot deal!'];
    
    featuredProperties.forEach(property => {
        const timeAgoElement = document.createElement('div');
        timeAgoElement.className = 'time-ago';
        timeAgoElement.textContent = timeAgoTexts[Math.floor(Math.random() * timeAgoTexts.length)];
        timeAgoElement.style.position = 'absolute';
        timeAgoElement.style.bottom = '40px';
        timeAgoElement.style.left = '10px';
        timeAgoElement.style.backgroundColor = 'rgba(0,0,0,0.6)';
        timeAgoElement.style.color = 'white';
        timeAgoElement.style.padding = '3px 8px';
        timeAgoElement.style.borderRadius = '4px';
        timeAgoElement.style.fontSize = '0.75rem';
        property.style.position = 'relative';
        property.appendChild(timeAgoElement);
    });
    
    featuredProperties.forEach(property => {
        const favButton = document.createElement('button');
        favButton.className = 'fav-button';
        favButton.innerHTML = '<i class="bi bi-heart"></i>';
        favButton.style.position = 'absolute';
        favButton.style.top = '10px';
        favButton.style.left = '10px';
        favButton.style.backgroundColor = 'white';
        favButton.style.border = 'none';
        favButton.style.borderRadius = '50%';
        favButton.style.width = '30px';
        favButton.style.height = '30px';
        favButton.style.display = 'flex';
        favButton.style.alignItems = 'center';
        favButton.style.justifyContent = 'center';
        favButton.style.cursor = 'pointer';
        favButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        favButton.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="bi bi-heart-fill" style="color: #D00000;"></i>';
            } else {
                this.innerHTML = '<i class="bi bi-heart"></i>';
            }
        });
        
        property.appendChild(favButton);
    });
    
    setTimeout(() => {
        featuredProperties.forEach((property, index) => {
            setTimeout(() => {
                property.style.opacity = '0';
                property.style.transform = 'translateY(20px)';
                property.style.transition = 'none';
                
                setTimeout(() => {
                    property.style.transition = 'all 0.5s ease';
                    property.style.opacity = '1';
                    property.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        });
    }, 500);
})