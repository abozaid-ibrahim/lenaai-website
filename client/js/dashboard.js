document.addEventListener("DOMContentLoaded", function () {
    let clientId;
    let clientUserName;

    // Authorization
    const token = localStorage.getItem("lenaai_access_token");
    if (!token) {
        window.location.href = "./login.html";
    } else {
        $.ajax({
            url: `https://api.lenaai.net/me?access_token=${token}`,
            method: "POST",
            contentType: "application/json",
            success: function (response) {
                clientId = response.user_id;
                clientUserName = response.username;
                $("body").css("visibility", "visible");
                $("#sign-in")
                    .html('<i class="bi bi-box-arrow-right"></i> Logout')
                    .addClass("logout");

                $(".sign-in-sm button")
                    .html('<i class="bi bi-box-arrow-right"></i> Logout')
                    .addClass("logout");

                function logoutUser() {
                    localStorage.removeItem("lenaai_access_token");

                    window.location.href = "../index.html";
                }

                $("#sign-in, .sign-in-sm button").on("click", function (event) {
                    event.preventDefault();
                    logoutUser();
                });

                function showUnitsSkeleton() {
                    $(".data").append(`
                        <div class="skeleton-data">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-content">
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                            </div>
                        </div>
                        <div class="skeleton-data">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-content">
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                            </div>
                        </div>
                        <div class="skeleton-data">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-content">
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                                <div class="skeleton-unit"></div>
                            </div>
                        </div>
                    `);
                }

                function hideUnitsSkeleton() {
                    $(".skeleton-data").fadeOut(300, function () {
                        $(this).remove();
                    });
                }

                showUnitsSkeleton();
                $.ajax({
                    url: `https://api.lenaai.net/units/${clientId}`,
                    method: "GET",
                    headers: {
                        "clientId": clientId,
                    },
                    dataType: "json",
                    success: function (response) {
                        let allUnitsImages = {};
                        let unitImages;
                        const paymentPlansRegex = /^(\d+: \d+)(, \d+: \d+)*$/;
                        const buildingTypes = [
                            "Apartment",
                            "Villa",
                            "Chalet",
                            "Twinhouse",
                            "Townhouse",
                            "House",
                            "Roof",
                            "Penthouse",
                            "Studio",
                            "Duplex",
                            "Loft",
                            "Bungalow",
                            "Office",
                            "Shop"
                        ];
                        const views = [
                            "Lagoon",
                            "Sea",
                            "City",
                            "River",
                            "Pool",
                            "Golf",
                            "Mountain",
                            "Garden",
                            "Street",
                            "Open Area",
                            "Park",
                            "Other"
                        ];
                        const finishing = [
                            "Fully Finished",
                            "Semi Finished",
                            "Core & Shell",
                            "Furnished",
                            "Unfurnished"
                        ];
                        const countries = [
                            "Egypt",
                            "United Arab Emirates",
                            "Saudi Arabia",
                            "Qatar"
                        ];

                        function renderUnits(allUnts) {
                            let compoundsNamesList = [];
                            let developersNames = [];
                            document.querySelectorAll(".data-container").forEach(element => element.remove());
                            const groupedByCompound = allUnts.reduce((group, item) => {
                                const { compound } = item;
                                if (!group[compound]) {
                                    group[compound] = [];
                                }
                                if (!compoundsNamesList.includes(group[compound])) {
                                    group[compound].push(item);
                                }
                                return group;
                            }, {});

                            const dataSection = document.querySelector(".data");
                            hideUnitsSkeleton();
                            Object.keys(groupedByCompound).forEach((compoundName) => {
                                const dataContainer = document.createElement("div");
                                const dataTitle = document.createElement("div");
                                const dataContent = document.createElement("div");
                                const unitsList = document.createElement("ul");
                                compoundsNamesList.push(compoundName);

                                dataContainer.classList.add("data-container");
                                dataTitle.classList.add("data-title");
                                dataContent.classList.add("data-content");
                                unitsList.classList.add("units-list");
                                dataTitle.innerHTML = `${compoundName}<i class="fa-solid fa-chevron-up"></i>`;

                                dataContent.appendChild(unitsList);
                                dataContainer.appendChild(dataTitle);
                                dataContainer.appendChild(dataContent);
                                dataSection.appendChild(dataContainer);
                                groupedByCompound[compoundName].forEach((unit) => {
                                    const unitElement = document.createElement("li");
                                    unitElement.classList.add("unit")
                                    unitElement.setAttribute("data-dev", unit.developer);
                                    allUnitsImages[unit.unitId] = unit.images
                                    developersNames.push(unit.developer);
                                    unitImages = unit.images
                                    unitElement.innerHTML = `
                                    <div class="unit-header">
                                        <span class="unit-name" data-id="${unit.unitId}">Unit ${unit.unitId}</span>
                                        <div class="unit-btns">
                                            <div class="edit-btn"><i class="fa-solid fa-pen-to-square"></i>Edit</div>
                                            <div class="remove-btn"><i class="fa-solid fa-trash"></i>Delete</div>
                                        </div>
                                    </div>
                                    <div class="unit-details">
                                        <div class="slider">
                                            <div class="slider-wrapper">
                                            </div>
                            
                                            <div class="property-details">
                                                <p><strong>Title</strong>: ${unit.unitId}</p>
                                                <p><strong>Compound</strong>: ${unit.compound}</p>
                                                <p><strong>Building Type</strong>: ${unit.buildingType}</p>
                                                <p><strong>View</strong>: ${unit.view}</p>
                                                <p><strong>Country</strong>: ${unit.country}</p>
                                                <p><strong>City</strong>: ${unit.city}</p>
                                                <p><strong>Developer</strong>: <span class="dev">${unit.developer}</span></p>
                                                <p><strong>Down Payment</strong>: ${unit.downPayment.toLocaleString()} EGP</p>
                                                <p><strong>Payment Plans</strong>: ${unit.paymentPlans}</p>
                                                <p><strong>Total Price</strong>: ${unit.totalPrice.toLocaleString()} EGP</p>
                                                <p><strong>Garage Area</strong>: ${unit.garageArea}</p>
                                                <p><strong>Delivery Date</strong>: ${unit.deliveryDate}</p>
                                                <p><strong>Floor</strong>: ${unit.floor}</p>
                                                <p><strong>Rooms Count</strong>: ${unit.roomsCount}</p>
                                                <p><strong>Bathroom Count</strong>: ${unit.bathroomCount}</p>
                                                <p><strong>Land Area</strong>: ${unit.landArea}</p>
                                                <p><strong>Garden Size</strong>: ${unit.gardenSize}</p>
                                                <p><strong>Finishing</strong>: ${unit.finishing}</p>
                                                <p style="display: none;"><strong>Data Source</strong>: ${unit.dataSource}</p>
                                            </div>
                                        </div>
    
                                        <div id="prev"><i class="fa-solid iconCall fa-chevron-left"></i></div>
                                        <div id="next"><i class="fa-solid iconCall fa-chevron-right"></i></div>
                                    </div>`;

                                    unitsList.appendChild(unitElement);

                                    const sliderWrapper = unitElement.querySelector(".slider-wrapper");
                                    unitImages.forEach((image) => {
                                        const slide = document.createElement("div");
                                        slide.classList.add("slide");
                                        slide.innerHTML = `<img src="${image.url}" alt="Unit Image">`;
                                        sliderWrapper.appendChild(slide);
                                    });
                                })
                            })

                            const uniqueDevelopers = [...new Set(developersNames)]
                            const dataTitles = document.querySelector(".data-titles .dropdown");
                            dataTitles.innerHTML = `<li>All</li>`;
                            uniqueDevelopers.forEach((developer) => {
                                let developerElement = document.createElement("li");
                                developerElement.innerHTML = `${developer}`;
                                dataTitles.appendChild(developerElement)
                            })

                            // Data section
                            $(".data-title").click(function () {
                                $(this).next(".data-content").slideToggle();
                                $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
                            });

                            $(".units-list li .unit-header").click(function () {
                                $(this).next(".unit-details").slideToggle();

                                const unitDetails = $(this).next(".unit-details");
                                const sliderWrapper = unitDetails.find(".slider-wrapper");
                                const slides = sliderWrapper.find(".slide");
                                const prev = unitDetails.find("#prev");
                                const next = unitDetails.find("#next");
                                let slideIndex = 0;

                                showSlides(slideIndex);

                                function plusSlides(num) {
                                    showSlides(slideIndex += num);
                                }

                                function showSlides(num) {
                                    slideIndex = (num + slides.length) % slides.length;
                                    if (slideIndex === 0) {
                                        prev.css("display", "none");
                                    } else {
                                        prev.css("display", "block");
                                    }

                                    if (slideIndex === slides.length - 1) {
                                        next.css("display", "none");
                                    } else {
                                        next.css("display", "block");
                                    }

                                    sliderWrapper.css("transform", `translateX(-${slideIndex * 100}%)`);
                                }

                                prev.click(function () {
                                    plusSlides(-1);
                                });

                                next.click(function () {
                                    plusSlides(1);
                                });

                                function checkScreenWidth() {
                                    if (window.innerWidth < 1100) {
                                        prev.css("display", "none");
                                        next.css("display", "none");
                                    }
                                }

                                checkScreenWidth();

                                window.addEventListener("resize", checkScreenWidth);
                            });

                            const units = document.querySelectorAll(".unit");
                            const devs = document.querySelectorAll(".data-titles li");

                            function hideEmptyDataContainers() {
                                document.querySelectorAll(".data-container").forEach((container) => {
                                    const unitsList = container.querySelector(".units-list");
                                    const units = unitsList.querySelectorAll(".unit");

                                    const allHidden = [...units].every(unit => unit.style.display === "none");

                                    if (allHidden) {
                                        container.style.display = "none";
                                    } else {
                                        container.style.display = "block";
                                    }
                                });
                            }

                            if (devs.length > 0 && units.length > 0) {
                                devs.forEach((dev) => {
                                    dev.addEventListener("click", function () {
                                        if (dev.textContent.trim() === "All") {
                                            units.forEach((unit) => {
                                                unit.style.display = "block";
                                            });
                                        } else {
                                            units.forEach((unit) => {
                                                if (unit.getAttribute("data-dev").includes(dev.textContent.trim())) {
                                                    unit.style.display = "block";
                                                } else {
                                                    unit.style.display = "none";
                                                }
                                            });
                                        }

                                        hideEmptyDataContainers();
                                    });
                                });
                            }


                            // Unit Delete
                            const deleteButtons = document.querySelectorAll(".remove-btn");
                            deleteButtons.forEach((deleteButton) => {
                                deleteButton.addEventListener("click", function (event) {
                                    event.stopPropagation();

                                    const unit = this.closest(".unit");
                                    const unitId = unit.querySelector(".unit-header span").getAttribute("data-id");
                                    const unitName = unit.querySelector(".unit-header span").textContent;
                                    const editOverlay = document.querySelector(".edit-overlay");
                                    const editPopup = document.querySelector(".edit-popup");

                                    editPopup.classList.add("delete-popup");
                                    editOverlay.style.display = "flex";
                                    editPopup.innerHTML = `
                                    <div class="history-header">
                                        <h1>Delete ${unitName}</h1>
                                        <i class="fa-solid close-btn fa-circle-xmark"></i>
                                    </div>
                                    <div class="edit-content">
                                        <p class="before-del">Are you sure you want to delete this unit?</P>
                                        <div class="details-btns">
                                            <div class="cancel">Cancel</div>
                                            <div class="yes">Yes</div>
                                        </div>
                                    </div>`;

                                    document.querySelector(".close-btn").addEventListener("click", function () {
                                        editPopup.classList.remove("delete-popup");
                                        editOverlay.style.display = "none";
                                        editPopup.innerHTML = '';
                                    });

                                    document.querySelector(".cancel").addEventListener("click", function () {
                                        editPopup.classList.remove("delete-popup");
                                        editOverlay.style.display = "none";
                                        editPopup.innerHTML = '';
                                    });

                                    document.querySelector(".yes").addEventListener("click", function () {

                                        function startAjaxCall() {
                                            const editContent = $(".edit-content");

                                            $("#loadingOverlay").remove();

                                            editContent.append(`
                                                <div id="loadingOverlay" class="loading-overlay">
                                                    <div class="spinner-container">
                                                        <i id="loadingIcon" class="fa fa-spinner fa-spin"></i>
                                                        <p id="loadingText">Deleting Unit ...</p>
                                                    </div>
                                                </div>
                                            `);

                                            const overlay = $("#loadingOverlay");
                                            const loadingText = $("#loadingText");
                                            const loadingIcon = $("#loadingIcon");
                                            overlay.removeClass("hidden");

                                            $.ajax({
                                                url: `https://api.lenaai.net/delete-unit`,
                                                method: "DELETE",
                                                headers: {
                                                    "unitId": `${encodeURIComponent(unitId)}`
                                                },
                                                success: function (response) {
                                                    $.ajax({
                                                        url: `https://api.lenaai.net/units/${clientId}`,
                                                        method: "GET",
                                                        headers: {
                                                            "clientId": clientId,
                                                        },
                                                        dataType: "json",
                                                        success: function (response) {
                                                            renderUnits(response);
                                                            loadingIcon.attr("class", "fa fa-check-circle success");
                                                            loadingText.html("Success!");
                                                        },
                                                        error: function (error) {
                                                            loadingIcon.attr("class", "fa fa-times-circle error");
                                                            loadingText.html("Failed. Please try again.");
                                                        },
                                                        complete: function () {
                                                            setTimeout(() => overlay.addClass("hidden"), 1500);
                                                            setTimeout(() => {
                                                                editOverlay.style.display = "none";
                                                                editPopup.classList.remove("delete-popup");
                                                                editPopup.innerHTML = '';
                                                            }, 1500);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        startAjaxCall();
                                    })
                                })
                            })

                            // Add Unit
                            let newUnitImages = [];
                            let paymentPlansList = [];
                            const addButton = document.querySelector(".add-btn");
                            addButton.addEventListener("click", function () {
                                const editOverlay = document.querySelector(".edit-overlay");
                                const editPopup = document.querySelector(".edit-popup");
                                const propertyDetails = document.createElement("div");
                                propertyDetails.innerHTML = `
                                    <p><strong>Title</strong>:</p>
                                    <p><strong>Compound</strong>:</p>
                                    <p><strong>Building Type</strong>:</p>
                                    <p><strong>View</strong>:</p>
                                    <p><strong>Country</strong>:</p>
                                    <p><strong>City</strong>:</p>
                                    <p><strong>Developer</strong>: <span class="dev"></span></p>
                                    <p><strong>Down Payment</strong>:</p>
                                    <p><strong>Payment Plans</strong>:</p>
                                    <p><strong>Total Price</strong>:</p>
                                    <p><strong>Garage Area</strong>:</p>
                                    <p><strong>Delivery Date</strong>:</p>
                                    <p><strong>Floor</strong>:</p>
                                    <p><strong>Rooms Count</strong>:</p>
                                    <p><strong>Bathroom Count</strong>:</p>
                                    <p><strong>Land Area</strong>:</p>
                                    <p><strong>Garden Size</strong>:</p>
                                    <p><strong>Finishing</strong>:</p>
                                    <p style="display: none;"><strong>Data Source</strong>:</p>
                                `;

                                editOverlay.style.display = "flex";
                                editPopup.innerHTML = `
                                <div class="history-header">
                                    <h1>Add New unit</h1>
                                    <i class="fa-solid close-btn fa-circle-xmark"></i>
                                </div>
                                <div class="edit-content">
                                    <ul class="edit-details">
                                    </ul>
                                    <div class="details-btns">
                                        <div class="save">Save</div>
                                    </div>
                                </div>`;

                                const editDetails = document.querySelector(".edit-details");
                                if (propertyDetails) {
                                    propertyDetails.querySelectorAll("p").forEach((p) => {
                                        const key = p.querySelector("strong")?.textContent.trim().replace(":", "");
                                        const detail = document.createElement("li");

                                        if (key === "Title") {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        } else if (key === "Country") {
                                            detail.classList.add("country")
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="edit-drop">
                                                <div class="value">${countries[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            countries.forEach((type) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                            });
                                        } else if (key === "Data Source") {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        } else if (key === "Compound") {
                                            detail.classList.add("compound");
                                            detail.innerHTML = `
                                            ${key}
                                            <i class="fa-solid fa-plus" style="margin-left: auto; margin-right: 20px;"></i>
                                            <div class="edit-drop">
                                                <div class="value">New Compound</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            compoundsNamesList.forEach((name) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${name}</li>`
                                            });
                                        } else if (key === "Delivery Date") {
                                            detail.classList.add("delivery-date");
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="date-picker">
                                                <div class="value">Select A Date</div>
                                                <i class="fa-solid fa-calendar-days"></i>
                                                <input type="date" id="cal">
                                            </div>
                                            `;
                                        } else if (key === "Building Type") {
                                            detail.classList.add("building")
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="edit-drop">
                                                <div class="value">${buildingTypes[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            buildingTypes.forEach((type) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                            });
                                        } else if (key === "View") {
                                            detail.classList.add("views")
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="edit-drop">
                                                <div class="value">${views[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            views.forEach((type) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                            });
                                        } else if (key === "Payment Plans") {
                                            detail.classList.add("payment-plan")
                                            detail.innerHTML = `
                                            ${key}
                                            <i class="fa-solid fa-plus" style="margin-left: auto; margin-right: 20px;"></i>
                                            <div class="edit-tags" style="padding: 18px;"></div>`;
                                        } else if (key === "Finishing") {
                                            detail.classList.add("finishing")
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="edit-drop">
                                                <div class="value">${finishing[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            finishing.forEach((type) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                            });
                                        } else if (key === "Garage Area"){
                                            detail.innerHTML = `${key}<input type="text" value="0">`;
                                        } else if (key === "Bathroom Count"){
                                            detail.innerHTML = `${key}<input type="text" value="1">`;
                                        } else if (key === "Rooms Count"){
                                            detail.innerHTML = `${key}<input type="text" value="1">`;
                                        } else {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        }

                                        editDetails.appendChild(detail);
                                    });

                                    $(".edit-content").on("click", ".compound", function (event) {
                                        const compound = event.target.closest(".compound");

                                        if (!compound) return;

                                        const editDrop = compound.querySelector(".edit-drop");
                                        const icon = compound.querySelector("i");

                                        if (event.target.matches(".fa-plus")) {
                                            const tagsOverlay = document.querySelector(".tags-overlay");
                                            const tagsPopup = document.querySelector(".tags-popup");

                                            tagsOverlay.style.display = "flex";
                                            tagsPopup.innerHTML = `
                                            <div class="history-header">
                                                <h1>Add New Compound</h1>
                                                <i class="fa-solid close-btn fa-circle-xmark"></i>
                                            </div>
                                            <div class="edit-content">
                                                <div class="val-error" style="display: none;"></div>
                                                <ul class="edit-details">
                                                    <li>
                                                        Compound Name
                                                        <input type="text" id="compound-name">
                                                    </li>
                                                </ul>
                                                <div class="details-btns">
                                                    <div class="save">Add</div>
                                                </div>
                                            </div>`;

                                            tagsPopup.querySelector(".close-btn").addEventListener("click", function () {
                                                tagsOverlay.style.display = "none";
                                                tagsPopup.innerHTML = '';
                                            });

                                            tagsPopup.querySelector(".save").addEventListener("click", function () {
                                                const error = document.querySelector(".edit-content .val-error");
                                                const newCompoundName = document.querySelector(".edit-content #compound-name");

                                                error.style.display = "none";
                                                error.innerHTML = "";

                                                if (!newCompoundName.value.trim()) {
                                                    error.style.display = "block";
                                                    error.innerHTML = "Please enter a valid Compound Name.";
                                                    newCompoundName.style.borderColor = "red";
                                                    return;
                                                } else {
                                                    error.style.display = "none";
                                                    error.innerHTML = ``;
                                                    newCompoundName.style.borderColor = "#cbb26a";
                                                }

                                                const compoundListItem = document.createElement("li");
                                                const dropdown = editDrop.querySelector(".dropdown");
                                                
                                                editDrop.querySelector(".value").textContent = newCompoundName.value;
                                                compoundListItem.innerHTML = newCompoundName.value;
                                                dropdown.insertBefore(compoundListItem, dropdown.firstChild);

                                                tagsOverlay.style.display = "none";
                                                tagsPopup.innerHTML = "";
                                            });
                                        }
                                    });

                                    $(".edit-content").on("click", ".payment-plan", function (event) {
                                        const paymentPlan = event.target.closest(".payment-plan");

                                        if (!paymentPlan) return;

                                        if (event.target.matches(".fa-plus")) {
                                            const tagsOverlay = document.querySelector(".tags-overlay");
                                            const tagsPopup = document.querySelector(".tags-popup");

                                            tagsOverlay.style.display = "flex";
                                            tagsPopup.innerHTML = `
                                            <div class="history-header">
                                                <h1>Add Payment Plan</h1>
                                                <i class="fa-solid close-btn fa-circle-xmark"></i>
                                            </div>
                                            <div class="edit-content">
                                                <div class="val-error" style="display: none;"></div>
                                                <ul class="edit-details">
                                                    <li>
                                                        Years
                                                        <input type="text" id="years" placeholder="Years">
                                                    </li>
                                                    <li>
                                                        Total Price
                                                        <input type="text" id="price" placeholder="Total Price">
                                                    </li>
                                                </ul>
                                                <div class="details-btns">
                                                    <div class="save">Add</div>
                                                </div>
                                            </div>`;

                                            tagsPopup.querySelector(".close-btn").addEventListener("click", function () {
                                                tagsOverlay.style.display = "none";
                                                tagsPopup.innerHTML = '';
                                            });

                                            tagsPopup.querySelector(".save").addEventListener("click", function () {
                                                const years = document.querySelector(".edit-content #years");
                                                const price = document.querySelector(".edit-content #price");
                                                const editTags = paymentPlan.querySelector(".edit-tags");
                                                const error = document.querySelector(".edit-content .val-error");

                                                editTags.style.padding = "8px";
                                                error.style.display = "none";
                                                error.innerHTML = "";

                                                if (!years.value || isNaN(years.value) || !price.value || isNaN(price.value)) {
                                                    error.style.display = "block";
                                                    error.innerHTML = "Please enter valid numbers for both years and price.";

                                                    years.style.borderColor = !years.value || isNaN(years.value) ? "red" : "#cbb26a";
                                                    price.style.borderColor = !price.value || isNaN(price.value) ? "red" : "#cbb26a";

                                                    return;
                                                }

                                                const yearsValue = Number(years.value);
                                                const priceValue = Number(price.value).toLocaleString();
                                                let updated = false;

                                                const label = yearsValue === 0 ? "One-Time Payment" : `${yearsValue}-Years Plan`;

                                                editTags.querySelectorAll(".tag").forEach(tag => {
                                                    const tagText = tag.textContent.trim();
                                                    const tagYears = tagText.includes("One-Time Payment") ? 0 : parseInt(tagText.split("-")[0]);

                                                    if (tagYears === yearsValue) {
                                                        tag.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${label}: ${priceValue} EGP`;
                                                        updated = true;
                                                        paymentPlansList = paymentPlansList.filter((item) => !item.startsWith(`${yearsValue}:`));
                                                        paymentPlansList.push(`${yearsValue}: ${priceValue.replace(/[^\d.-]/g, "")}`);
                                                    }
                                                });

                                                if (!updated) {
                                                    const newTag = document.createElement("div");
                                                    newTag.classList.add("tag");
                                                    newTag.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${label}: ${priceValue} EGP`;
                                                    editTags.appendChild(newTag);
                                                    paymentPlansList.push(`${yearsValue}: ${priceValue.replace(/[^\d.-]/g, "")}`);
                                                }

                                                const tagsArray = Array.from(editTags.querySelectorAll(".tag"));
                                                tagsArray.sort((a, b) => {
                                                    const yearsA = a.textContent.includes("One-Time Payment") ? -1 : parseInt(a.textContent);
                                                    const yearsB = b.textContent.includes("One-Time Payment") ? -1 : parseInt(b.textContent);
                                                    return yearsA - yearsB;
                                                });

                                                editTags.innerHTML = "";
                                                tagsArray.forEach(tag => editTags.appendChild(tag));

                                                tagsOverlay.style.display = "none";
                                                tagsPopup.innerHTML = "";
                                                paymentPlansList.sort((a, b) => {
                                                    let yearsA = parseInt(a.split(":")[0]);
                                                    let yearsB = parseInt(b.split(":")[0]);
                                                    return yearsA - yearsB;
                                                });
                                                console.log(paymentPlansList);
                                            });

                                            function convertPaymentPlan(plan) {
                                                let years = plan.includes("One-Time Payment")
                                                    ? 0
                                                    : parseInt(plan.split("-")[0]);
                                                let price = parseInt((plan.split(":")[1]).replace(/[^\d]/g, ""));
                                                return `${years}: ${price}`;
                                            }

                                            document.querySelector(".edit-tags").addEventListener("click", function (event) {
                                                if (event.target.matches(".tag i")) {
                                                    let tag = event.target.closest(".tag");
                                                    let tagText = tag.textContent.trim();

                                                    let formattedPlan = convertPaymentPlan(tagText);

                                                    paymentPlansList = paymentPlansList.filter((item) => item !== formattedPlan);

                                                    tag.remove();

                                                    const tagsDiv = document.querySelector(".edit-tags");
                                                    tagsDiv.style.padding = tagsDiv.innerHTML.trim() === "" ? "18px" : "10px";
                                                }
                                            });
                                        }
                                    });

                                    const dateInput = document.querySelector(".delivery-date #cal");
                                    if (dateInput) {
                                        const today = new Date().toISOString().split("T")[0];
                                        dateInput.min = today;
                                    }

                                    let isDatePickerOpen = false;

                                    function toggleDatePicker(event) {
                                        const datePicker = event.target.closest(".date-picker");

                                        if (!datePicker) return;

                                        const input = datePicker.querySelector("input[type='date']");

                                        if (input) {
                                            if (isDatePickerOpen) {
                                                input.blur();
                                                isDatePickerOpen = false;
                                            } else {
                                                input.showPicker();
                                                isDatePickerOpen = true;
                                            }
                                        }
                                    }

                                    editDetails.addEventListener("input", function (event) {
                                        const target = event.target;
                                        if (target.id === "formattedInput") {
                                            if (paymentPlansRegex.test(target.value)) {
                                                target.style.border = "2px solid #00d000";
                                            } else {
                                                target.style.border = "2px solid red";
                                            }
                                        }
                                    });

                                    document.querySelector(".edit-details").addEventListener("change", function (event) {
                                        if (event.target.matches(".delivery-date #cal")) {
                                            const parent = event.target.closest(".delivery-date");
                                            if (parent) {
                                                parent.querySelector(".value").textContent = event.target.value;
                                            }
                                        }
                                    });

                                    document.querySelector(".edit-details").addEventListener("click", toggleDatePicker);

                                    $(".edit-content").on("click", ".edit-drop", function (event) {
                                        event.stopPropagation();

                                        let dropdown = $(this).find(".dropdown");

                                        $(".dropdown").not(dropdown).slideUp();

                                        dropdown.stop(true, true).slideToggle();
                                        $(this).find(".fa-chevron-down").toggleClass("rotate-icon");
                                    });

                                    $(".edit-content").on("click", ".edit-drop li", function (event) {
                                        event.stopPropagation();

                                        let selectedText = $(this).text();
                                        let parentElement = $(this).closest(".country, .building, .compound, .views, .finishing");
                                        let valueElement = parentElement.find(".value");

                                        valueElement.text(selectedText);
                                        $(this).closest(".dropdown").slideUp();
                                        parentElement.find(".fa-chevron-down").toggleClass("rotate-icon");
                                    });

                                    $(document).click(function () {
                                        $(".dropdown").slideUp();
                                    });

                                    document.querySelector(".edit-details").innerHTML += `
                                    <div class="current-images">
                                        <h2>Current Images</h2>
                                        <div class="images">
                                        </div>
                                    </div>
                                    <div class="photo-preview"></div>
                                    <div class="upload-images">
                                        <h4>Upload Images</h4>
                                        <p><i class="fa-solid fa-cloud-arrow-up"></i><strong>Click to upload</strong> or drag and drop</p>
                                        <div class="upload-btn"><i class="fa-solid fa-file-arrow-up"></i>Upload</div>
                                        <div id="customAlert" class="alert"></div>
                                        <input type="file">
                                        <i class="fa-solid fa-plus"></i>
                                    </div>`;

                                    const fileField = document.querySelector(`.upload-images input[type="file"]`);
                                    const dropZone = document.querySelector(".upload-images");
                                    const uploadButton = document.querySelector(".upload-btn");
                                    const attachButton = document.querySelector(".upload-images .fa-plus");
                                    const saveButton = document.querySelector(".save");
                                    let pendingRequests = 0;

                                    function updateUIState() {
                                        if (pendingRequests > 0) {
                                            saveButton.classList.add("disabled");
                                        } else {
                                            saveButton.classList.remove("disabled");
                                        }
                                    }

                                    document.querySelector(".images").addEventListener("click", function (event) {
                                        if (event.target.closest(".del")) {
                                            let theImage = event.target.closest(".chat-image");
                                            const imageUrl = theImage.querySelector("img").getAttribute("src");
                                            const imageFileId = theImage.querySelector("img").getAttribute("data-file-id");
                                            let overlay = document.createElement("div");
                                            overlay.classList.add("image-overlay");
                                            overlay.innerHTML = `<i class="fa-solid fa-spinner fa-spin loading-spinner"></i>`;
                                            theImage.appendChild(overlay);
                                            theImage.classList.add("deleting");

                                            pendingRequests++;
                                            updateUIState();
                                            $.ajax({
                                                url: `https://api.lenaai.net/images/${imageFileId}`,
                                                method: "DELETE",
                                                success: function (response) {
                                                    console.log("File deleted successfully:", response);
                                                    theImage.remove();
                                                    newUnitImages = newUnitImages.filter(item => item.url !== imageUrl);
                                                },
                                                error: function (xhr, status, error) {
                                                    console.error("Error:", xhr.responseText);
                                                    theImage.classList.remove("deleting");
                                                    overlay.remove();
                                                },
                                                complete: function () {
                                                    pendingRequests--;
                                                    updateUIState();
                                                }
                                            });
                                        }
                                    });

                                    attachButton.addEventListener("click", function () {
                                        fileField.click();
                                    });

                                    function showCustomAlert(message) {
                                        const alertBox = document.getElementById("customAlert");
                                        alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>${message}`;
                                        alertBox.style.display = "block";

                                        setTimeout(() => {
                                            alertBox.style.opacity = "0";
                                            setTimeout(() => {
                                                alertBox.style.display = "none";
                                                alertBox.style.opacity = "1";
                                            }, 500);
                                        }, 3000);
                                    }

                                    function handleFiles(files) {
                                        let file = files[0];
                                        if (file) {
                                            const allowedTypes = ["image/png", "image/jpeg"];
                                            if (!allowedTypes.includes(file.type)) {
                                                showCustomAlert("Invalid file type! Please upload a JPG or PNG image.");
                                                this.value = "";
                                            } else {
                                                document.querySelector(".photo-preview").style.display = "block";
                                                const reader = new FileReader();
                                                reader.onload = function (e) {
                                                    $('.photo-preview').html(`<img src="${e.target.result}" alt="Photo Preview">
                                                        <i class="fa-solid fa-circle-xmark"></i>`);

                                                    document.querySelector(".photo-preview i").addEventListener("click", function () {
                                                        fileField.value = "";
                                                        document.querySelector(".photo-preview").innerHTML = "";
                                                        document.querySelector(".photo-preview").style.display = "none";
                                                        uploadButton.style.display = "none";
                                                        attachButton.style.display = "block";
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                                attachButton.style.display = "none";
                                                uploadButton.style.display = "flex";
                                            }
                                        } else {
                                            $('.photo-preview').html('');
                                        }
                                    }

                                    // Drag events
                                    dropZone.addEventListener("dragover", (e) => {
                                        e.preventDefault();
                                        dropZone.classList.add("dragover");
                                    });

                                    dropZone.addEventListener("dragleave", () => {
                                        dropZone.classList.remove("dragover");
                                    });

                                    dropZone.addEventListener("drop", (e) => {
                                        e.preventDefault();
                                        dropZone.classList.remove("dragover");

                                        let files = e.dataTransfer.files;
                                        handleFiles(files);
                                    });

                                    fileField.addEventListener("change", function () {
                                        handleFiles(this.files)
                                    });

                                    uploadButton.addEventListener("click", function () {
                                        if (!fileField.files.length) {
                                            showCustomAlert("Please select a file first.");
                                            return;
                                        }
                                        const formData = new FormData();
                                        formData.append("file", fileField.files[0]);
                                        let tempURL = URL.createObjectURL(fileField.files[0]);
                                        let newImage = document.createElement("div");
                                        newImage.classList.add("chat-image", "uploading");
                                        newImage.innerHTML = `
                                            <img src="${tempURL}" alt="Uploading Image">
                                            <div class="image-overlay">
                                                <i class="fa-solid fa-spinner fa-spin loading-spinner"></i>
                                            </div>
                                        `;
                                        const imagesDiv = document.querySelector(".current-images .images");
                                        imagesDiv.appendChild(newImage);

                                        pendingRequests++;
                                        updateUIState();
                                        $.ajax({
                                            url: "https://api.lenaai.net/images/",
                                            method: "POST",
                                            data: formData,
                                            contentType: false,
                                            processData: false,
                                            success: function (response) {
                                                console.log("File uploaded successfully:", response);
                                                newUnitImages.push(response);

                                                const imagesDiv = document.querySelector(".current-images").querySelector(".images");
                                                newImage.remove();
                                                imagesDiv.innerHTML += `
                                                <div class="chat-image">
                                                    <img src="${response.url}" data-file-id="${response.fileId}" alt="Chat Image" draggable="false">
                                                    <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                                </div>`;
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error:", xhr.responseText);
                                                newImage.remove();
                                            },
                                            complete: function () {
                                                pendingRequests--;
                                                updateUIState();
                                            }
                                        });

                                        document.querySelector(".photo-preview").innerHTML = "";
                                        document.querySelector(".photo-preview").style.display = "none";
                                        uploadButton.style.display = "none";
                                        attachButton.style.display = "block";
                                        fileField.value = "";
                                    });

                                    function toCamelCase(str) {
                                        return str
                                            .toLowerCase()
                                            .replace(/\s(.)/g, (match, char) => char.toUpperCase())
                                            .replace(/\s/g, "")
                                            .replace(/^([A-Z])/, (match) => match.toLowerCase())
                                    }

                                    // chat images drag
                                    let wasDragging = false;

                                    document.addEventListener("mousedown", function (e) {
                                        const slider = e.target.closest(".images");
                                        if (!slider || !slider.contains(e.target)) return;

                                        let startX = e.clientX;
                                        let scrollLeft = slider.scrollLeft;

                                        slider.classList.add("image-active");

                                        function handleMouseMove(e) {
                                            wasDragging = true;
                                            const x = e.clientX;
                                            const walk = (x - startX) * 1;
                                            slider.scrollLeft = scrollLeft - walk;
                                        }

                                        function stopScrolling() {
                                            slider.classList.remove("image-active");
                                            document.removeEventListener("mousemove", handleMouseMove);
                                            document.removeEventListener("mouseup", stopScrolling);

                                            if (wasDragging) {
                                                document.addEventListener("click", preventClick, true);
                                                setTimeout(() => {
                                                    document.removeEventListener("click", preventClick, true);
                                                    wasDragging = false;
                                                }, 0);
                                            }
                                        }

                                        document.addEventListener("mousemove", handleMouseMove);
                                        document.addEventListener("mouseup", stopScrolling, { once: true });
                                    });

                                    function preventClick(e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }


                                    document.querySelector(".close-btn").addEventListener("click", function () {
                                        editOverlay.style.display = "none";
                                        editPopup.innerHTML = '';
                                    });

                                    // document.querySelector(".cancel").addEventListener("click", function () {
                                    //     editOverlay.style.display = "none";
                                    //     editPopup.innerHTML = '';
                                    // });

                                    document.querySelector(".save").addEventListener("click", function () {
                                        function getFormattedDateTime() {
                                            let now = new Date();
                                            let year = now.getFullYear();
                                            let month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                                            let day = String(now.getDate()).padStart(2, "0");
                                            let hours = String(now.getHours()).padStart(2, "0");
                                            let minutes = String(now.getMinutes()).padStart(2, "0");
                                            let seconds = String(now.getSeconds()).padStart(2, "0");

                                            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                                        }

                                        let unitObject = {
                                            "clientName": clientUserName,
                                            "clientId": clientId,
                                            "country": "",
                                            "city": "",
                                            "compound": "",
                                            "developer": "",
                                            "unitId": "",
                                            "view": "",
                                            "garageArea": "",
                                            "deliveryDate": "",
                                            "bathroomCount": 0,
                                            "buildingType": "",
                                            "floor": 0,
                                            "roomsCount": 0,
                                            "landArea": 0,
                                            "gardenSize": 0,
                                            "finishing": "",
                                            "dataSource": "",
                                            "downPayment": 0,
                                            "totalPrice": 0,
                                            "paymentPlans": "",
                                            "images": newUnitImages,
                                            "updatedAt": getFormattedDateTime()
                                        };
                                        let unitId;

                                        document.querySelectorAll(".edit-details li").forEach((li) => {
                                            const key = li.textContent.trim().split(":")[0].trim();
                                            const input = li.querySelector("input")?.value.trim();

                                            function enforceType(key, value) {
                                                const numberFields = [
                                                    "floor",
                                                    "roomsCount",
                                                    "bathroomCount",
                                                    "landArea",
                                                    "gardenSize",
                                                    "downPayment",
                                                    "totalPrice",
                                                    "garageArea"
                                                ];

                                                if (numberFields.includes(key)) {
                                                    if (typeof value === "string") {
                                                        value = value.replace(/[^\d.]/g, "");
                                                    }

                                                    return isNaN(value) || value === "" || value === "N/A" ? 0 : Number(value);
                                                }

                                                return value;
                                            }

                                            function formatNumber(value) {
                                                if (/^\d{1,3}(,\d{3})*$/.test(value)) {
                                                    return value;
                                                }

                                                return Number(value).toLocaleString();
                                            }

                                            if (toCamelCase(key) === "title") {
                                                unitId = input;
                                                unitObject.unitId = input;
                                            } else if (li.classList.contains("compound")) {
                                                const inputField = li.querySelector("input.value");
                                                const valueElement = li.querySelector(".value");

                                                if (inputField) {
                                                    unitObject.compound = inputField.value;
                                                } else if (valueElement) {
                                                    unitObject.compound = valueElement.textContent;
                                                }
                                            } else if (li.classList.contains("country")) {
                                                unitObject.country = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("building")) {
                                                unitObject.buildingType = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("views")) {
                                                unitObject.view = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("finishing")) {
                                                unitObject.finishing = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("delivery-date")) {
                                                unitObject.deliveryDate = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("payment-plan")) {
                                                unitObject.paymentPlans = paymentPlansList.join(", ");
                                            } else {
                                                const camelKey = toCamelCase(key);
                                                if (camelKey in unitObject) {
                                                    unitObject[camelKey] = enforceType(camelKey, input);
                                                }
                                            }
                                        });

                                        console.log("data collected from the edit window", unitObject)

                                        function startAjaxCall(unitObject) {
                                            const editContent = $(".edit-content");

                                            $("#loadingOverlay").remove();

                                            editContent.append(`
                                                <div id="loadingOverlay" class="loading-overlay">
                                                    <div class="spinner-container">
                                                        <i id="loadingIcon" class="fa fa-spinner fa-spin"></i>
                                                        <p id="loadingText">Adding Unit ...</p>
                                                    </div>
                                                </div>
                                            `);

                                            const overlay = $("#loadingOverlay");
                                            const loadingText = $("#loadingText");
                                            const loadingIcon = $("#loadingIcon");
                                            overlay.removeClass("hidden");

                                            $.ajax({
                                                url: `https://api.lenaai.net/add-unit/`,
                                                method: "POST",
                                                headers: {
                                                    "clientId": clientId,
                                                },
                                                contentType: "application/json",
                                                data: JSON.stringify(unitObject),
                                                success: function (response) {
                                                    console.log("API response", response);
                                                    $.ajax({
                                                        url: `https://api.lenaai.net/units/${clientId}`,
                                                        method: "GET",
                                                        headers: {
                                                            "clientId": clientId,
                                                        },
                                                        dataType: "json",
                                                        success: function (response) {
                                                            renderUnits(response);
                                                            loadingIcon.attr("class", "fa fa-check-circle success");
                                                            loadingText.html("Success!");
                                                        },
                                                        error: function (error) {
                                                            loadingIcon.attr("class", "fa fa-times-circle error");
                                                            loadingText.html("Failed. Please try again.");
                                                        },
                                                        complete: function () {
                                                            setTimeout(() => overlay.addClass("hidden"), 1500);
                                                            setTimeout(() => {
                                                                editOverlay.style.display = "none";
                                                                editPopup.innerHTML = '';
                                                            }, 1500);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        startAjaxCall(unitObject);
                                    });
                                }
                            })

                            // Unit Edit
                            let originalUnitId;
                            const editButtons = document.querySelectorAll(".edit-btn");
                            editButtons.forEach((editButton) => {
                                editButton.addEventListener("click", function (event) {
                                    event.stopPropagation();

                                    const editOverlay = document.querySelector(".edit-overlay");
                                    const editPopup = document.querySelector(".edit-popup");
                                    const unit = this.closest(".unit");
                                    const unitName = unit.querySelector(".unit-header span").textContent;
                                    const propertyDetails = unit.querySelector(".property-details");
                                    let originalPaymentPlans = [];

                                    editOverlay.style.display = "flex";
                                    editPopup.innerHTML = `
                                    <div class="history-header">
                                        <h1>Edit ${unitName}</h1>
                                        <i class="fa-solid close-btn fa-circle-xmark"></i>
                                    </div>
                                    <div class="edit-content">
                                        <ul class="edit-details">
                                        </ul>
                                        <div class="details-btns">
                                            <div class="save">Save</div>
                                        </div>
                                    </div>`;

                                    const editDetails = document.querySelector(".edit-details");
                                    if (propertyDetails) {
                                        propertyDetails.querySelectorAll("p").forEach((p) => {
                                            const key = p.querySelector("strong")?.textContent.trim().replace(":", "");
                                            const value = p.textContent.replace(key + ":", "").trim();
                                            const detail = document.createElement("li");

                                            if (key === "Title") {
                                                originalUnitId = value;
                                                detail.innerHTML = `${key}<input type="text" value="${value}" disabled>`;
                                            } else if (key === "Data Source") {
                                                detail.innerHTML = `${key}<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                                            } else if (key === "Compound") {
                                                detail.classList.add("compound");
                                                detail.innerHTML = `
                                                ${key}
                                                <i class="fa-solid fa-plus" style="margin-left: auto; margin-right: 20px;"></i>
                                                <div class="edit-drop">
                                                    <div class="value">${value}</div><i class="fa-solid fa-chevron-down"></i>
                                                    <ul class="dropdown">
                                                    </ul>
                                                </div>`;
                                                compoundsNamesList.forEach((name) => {
                                                    detail.querySelector(".dropdown").innerHTML += `<li>${name}</li>`
                                                });
                                            } else if (key === "Delivery Date") {
                                                detail.classList.add("delivery-date");
                                                detail.innerHTML = `
                                                ${key}
                                                <div class="date-picker">
                                                    <div class="value">${value}</div>
                                                    <i class="fa-solid fa-calendar-days"></i>
                                                    <input type="date" id="cal">
                                                </div>
                                                `;
                                            } else if (key === "Country") {
                                                detail.classList.add("country");
                                                detail.innerHTML = `
                                                ${key}
                                                <div class="edit-drop">
                                                    <div class="value">${value}</div><i class="fa-solid fa-chevron-down"></i>
                                                    <ul class="dropdown">
                                                    </ul>
                                                </div>`;
                                                countries.forEach((type) => {
                                                    detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                                });
                                            } else if (key === "Building Type") {
                                                detail.classList.add("building");
                                                detail.innerHTML = `
                                                ${key}
                                                <div class="edit-drop">
                                                    <div class="value">${value}</div><i class="fa-solid fa-chevron-down"></i>
                                                    <ul class="dropdown">
                                                    </ul>
                                                </div>`;
                                                buildingTypes.forEach((type) => {
                                                    detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                                });
                                            } else if (key === "View") {
                                                detail.classList.add("views")
                                                detail.innerHTML = `
                                                ${key}
                                                <div class="edit-drop">
                                                    <div class="value">${value}</div><i class="fa-solid fa-chevron-down"></i>
                                                    <ul class="dropdown">
                                                    </ul>
                                                </div>`;
                                                views.forEach((type) => {
                                                    detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                                });
                                            } else if (key === "Finishing") {
                                                detail.classList.add("finishing")
                                                detail.innerHTML = `
                                                ${key}
                                                <div class="edit-drop">
                                                    <div class="value">${value}</div><i class="fa-solid fa-chevron-down"></i>
                                                    <ul class="dropdown">
                                                    </ul>
                                                </div>`;
                                                finishing.forEach((type) => {
                                                    detail.querySelector(".dropdown").innerHTML += `<li>${type}</li>`
                                                });
                                            } else if (key === "Payment Plans") {
                                                const paymentPlansList = value.split(", ")
                                                detail.classList.add("payment-plan");
                                                detail.innerHTML = `
                                                    ${key}
                                                    <i class="fa-solid fa-plus" style="margin-left: auto; margin-right: 20px;"></i>
                                                    <div class="edit-tags" style="padding: ${paymentPlansList.length > 0 ? '8px' : '18px'};"></div>
                                                `;
                                                paymentPlansList.forEach((plan) => {
                                                    originalPaymentPlans.push(plan);
                                                    const newTag = document.createElement("div");
                                                    newTag.classList.add("tag");
                                                    const yearsValue = plan.split(":")[0];
                                                    const label = yearsValue === "0" ? "One-Time Payment" : `${yearsValue}-Years Plan`;
                                                    const priceValue = (Number(plan.split(":")[1])).toLocaleString();
                                                    newTag.innerHTML = `
                                                        <i class="fa-solid fa-circle-xmark"></i>
                                                        ${label}: ${priceValue} EGP
                                                    `;
                                                    detail.querySelector(".edit-tags").appendChild(newTag);
                                                })
                                            } else {
                                                detail.innerHTML = `${key}<input type="text" value="${value}">`;
                                            }

                                            editDetails.appendChild(detail);
                                        });

                                        $(".edit-content").on("click", ".compound", function (event) {
                                            const compound = event.target.closest(".compound");
    
                                            if (!compound) return;
    
                                            const editDrop = compound.querySelector(".edit-drop");
                                            const icon = compound.querySelector("i");
    
                                            if (event.target.matches(".fa-plus")) {
                                                const tagsOverlay = document.querySelector(".tags-overlay");
                                                const tagsPopup = document.querySelector(".tags-popup");
    
                                                tagsOverlay.style.display = "flex";
                                                tagsPopup.innerHTML = `
                                                <div class="history-header">
                                                    <h1>Add New Compound</h1>
                                                    <i class="fa-solid close-btn fa-circle-xmark"></i>
                                                </div>
                                                <div class="edit-content">
                                                    <div class="val-error" style="display: none;"></div>
                                                    <ul class="edit-details">
                                                        <li>
                                                            Compound Name
                                                            <input type="text" id="compound-name">
                                                        </li>
                                                    </ul>
                                                    <div class="details-btns">
                                                        <div class="save">Add</div>
                                                    </div>
                                                </div>`;
    
                                                tagsPopup.querySelector(".close-btn").addEventListener("click", function () {
                                                    tagsOverlay.style.display = "none";
                                                    tagsPopup.innerHTML = '';
                                                });
    
                                                tagsPopup.querySelector(".save").addEventListener("click", function () {
                                                    const error = document.querySelector(".edit-content .val-error");
                                                    const newCompoundName = document.querySelector(".edit-content #compound-name");
    
                                                    error.style.display = "none";
                                                    error.innerHTML = "";
    
                                                    if (!newCompoundName.value.trim()) {
                                                        error.style.display = "block";
                                                        error.innerHTML = "Please enter a valid Compound Name.";
                                                        newCompoundName.style.borderColor = "red";
                                                        return;
                                                    } else {
                                                        error.style.display = "none";
                                                        error.innerHTML = ``;
                                                        newCompoundName.style.borderColor = "#cbb26a";
                                                    }
    
                                                    const compoundListItem = document.createElement("li");
                                                    const dropdown = editDrop.querySelector(".dropdown");
                                                    
                                                    editDrop.querySelector(".value").textContent = newCompoundName.value;
                                                    compoundListItem.innerHTML = newCompoundName.value;
                                                    dropdown.insertBefore(compoundListItem, dropdown.firstChild);
    
                                                    tagsOverlay.style.display = "none";
                                                    tagsPopup.innerHTML = "";
                                                });
                                            }
                                        });

                                        $(".edit-content").on("click", ".payment-plan", function (event) {
                                            const paymentPlan = event.target.closest(".payment-plan");

                                            if (!paymentPlan) return;

                                            if (event.target.matches(".fa-plus")) {
                                                const tagsOverlay = document.querySelector(".tags-overlay");
                                                const tagsPopup = document.querySelector(".tags-popup");

                                                tagsOverlay.style.display = "flex";
                                                tagsPopup.innerHTML = `
                                                <div class="history-header">
                                                    <h1>Add Payment Plan</h1>
                                                    <i class="fa-solid close-btn fa-circle-xmark"></i>
                                                </div>
                                                <div class="edit-content">
                                                    <div class="val-error" style="display: none;"></div>
                                                    <ul class="edit-details">
                                                        <li>
                                                            Years
                                                            <input type="text" id="years" placeholder="Years">
                                                        </li>
                                                        <li>
                                                            Total Price
                                                            <input type="text" id="price" placeholder="Total Price">
                                                        </li>
                                                    </ul>
                                                    <div class="details-btns">
                                                        <div class="save">Add</div>
                                                    </div>
                                                </div>`;

                                                tagsPopup.querySelector(".close-btn").addEventListener("click", function () {
                                                    tagsOverlay.style.display = "none";
                                                    tagsPopup.innerHTML = '';
                                                });

                                                tagsPopup.querySelector(".save").addEventListener("click", function () {
                                                    const years = document.querySelector(".edit-content #years");
                                                    const price = document.querySelector(".edit-content #price");
                                                    const editTags = paymentPlan.querySelector(".edit-tags");
                                                    const error = document.querySelector(".edit-content .val-error");

                                                    editTags.style.padding = "5px";
                                                    error.style.display = "none";
                                                    error.innerHTML = "";

                                                    if (!years.value || isNaN(years.value) || !price.value || isNaN(price.value)) {
                                                        error.style.display = "block";
                                                        error.innerHTML = "Please enter valid numbers for both years and price.";

                                                        years.style.borderColor = !years.value || isNaN(years.value) ? "red" : "#cbb26a";
                                                        price.style.borderColor = !price.value || isNaN(price.value) ? "red" : "#cbb26a";

                                                        return;
                                                    }

                                                    const yearsValue = Number(years.value);
                                                    const priceValue = Number(price.value).toLocaleString();
                                                    let updated = false;

                                                    const label = yearsValue === 0 ? "One-Time Payment" : `${yearsValue}-Years Plan`;

                                                    editTags.querySelectorAll(".tag").forEach(tag => {
                                                        const tagText = tag.textContent.trim();
                                                        const tagYears = tagText.includes("One-Time Payment") ? 0 : parseInt(tagText.split("-")[0]);

                                                        if (tagYears === yearsValue) {
                                                            tag.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${label}: ${priceValue} EGP`;
                                                            updated = true;
                                                            originalPaymentPlans = originalPaymentPlans.filter((item) => !item.startsWith(`${yearsValue}:`));
                                                            originalPaymentPlans.push(`${yearsValue}: ${priceValue.replace(/[^\d.-]/g, "")}`);
                                                        }
                                                    });

                                                    if (!updated) {
                                                        const newTag = document.createElement("div");
                                                        newTag.classList.add("tag");
                                                        newTag.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${label}: ${priceValue} EGP`;
                                                        editTags.appendChild(newTag);
                                                        originalPaymentPlans.push(`${yearsValue}: ${priceValue.replace(/[^\d.-]/g, "")}`);
                                                    }

                                                    const tagsArray = Array.from(editTags.querySelectorAll(".tag"));
                                                    tagsArray.sort((a, b) => {
                                                        const yearsA = a.textContent.includes("One-Time Payment") ? -1 : parseInt(a.textContent);
                                                        const yearsB = b.textContent.includes("One-Time Payment") ? -1 : parseInt(b.textContent);
                                                        return yearsA - yearsB;
                                                    });

                                                    editTags.innerHTML = "";
                                                    tagsArray.forEach(tag => editTags.appendChild(tag));

                                                    tagsOverlay.style.display = "none";
                                                    tagsPopup.innerHTML = "";
                                                    originalPaymentPlans.sort((a, b) => {
                                                        let yearsA = parseInt(a.split(":")[0]);
                                                        let yearsB = parseInt(b.split(":")[0]);
                                                        return yearsA - yearsB;
                                                    });
                                                    console.log(originalPaymentPlans);
                                                });
                                            }
                                        });

                                        function convertPaymentPlan(plan) {
                                            let years = plan.includes("One-Time Payment")
                                                ? 0
                                                : parseInt(plan.split("-")[0]);
                                            let price = parseInt((plan.split(":")[1]).replace(/[^\d]/g, ""));
                                            return `${years}: ${price}`;
                                        }

                                        $(document).on("click", ".edit-tags .tag i", function () {
                                            const tag = $(this).closest(".tag");
                                            const editTags = tag.closest(".edit-tags");

                                            const tagText = tag.clone().children().remove().end().text().trim();

                                            let formattedPlan = convertPaymentPlan(tagText);
                                            console.log("Tag Text:", tagText);
                                            console.log("Formatted Plan:", formattedPlan);

                                            originalPaymentPlans = originalPaymentPlans.filter((item) => item !== formattedPlan);

                                            tag.remove();

                                            if (editTags.children().length === 0) {
                                                editTags.css("padding", "18px");
                                            } else {
                                                editTags.css("padding", "10px");
                                            }

                                            console.log("Updated Plans:", originalPaymentPlans);
                                        });

                                        const dateInput = document.querySelector(".delivery-date #cal");
                                        if (dateInput) {
                                            const today = new Date().toISOString().split("T")[0];
                                            dateInput.min = today;
                                        }

                                        let isDatePickerOpen = false;

                                        function toggleDatePicker(event) {
                                            const datePicker = event.target.closest(".date-picker");

                                            if (!datePicker) return;

                                            const input = datePicker.querySelector("input[type='date']");

                                            if (input) {
                                                if (isDatePickerOpen) {
                                                    input.blur();
                                                    isDatePickerOpen = false;
                                                } else {
                                                    input.showPicker();
                                                    isDatePickerOpen = true;
                                                }
                                            }
                                        }

                                        editDetails.addEventListener("input", function (event) {
                                            const target = event.target;
                                            if (target.id === "formattedInput") {
                                                if (paymentPlansRegex.test(target.value)) {
                                                    target.style.border = "2px solid #00d000";
                                                } else {
                                                    target.style.border = "2px solid red";
                                                }
                                            }
                                        });

                                        document.querySelector(".edit-details").addEventListener("change", function (event) {
                                            if (event.target.matches(".delivery-date #cal")) {
                                                const parent = event.target.closest(".delivery-date");
                                                if (parent) {
                                                    parent.querySelector(".value").textContent = event.target.value;
                                                }
                                            }
                                        });

                                        document.querySelector(".edit-details").addEventListener("click", toggleDatePicker);

                                        $(".edit-content").on("click", ".edit-drop", function (event) {
                                            event.stopPropagation();

                                            let dropdown = $(this).find(".dropdown");

                                            $(".dropdown").not(dropdown).slideUp();

                                            dropdown.stop(true, true).slideToggle();
                                            $(this).find(".fa-chevron-down").toggleClass("rotate-icon");
                                        });

                                        $(".edit-content").on("click", ".edit-drop li", function (event) {
                                            event.stopPropagation();

                                            let selectedText = $(this).text();
                                            let parentElement = $(this).closest(".country, .building, .compound, .views, .finishing");
                                            let valueElement = parentElement.find(".value");

                                            valueElement.text(selectedText);
                                            $(this).closest(".dropdown").slideUp();
                                            parentElement.find(".fa-chevron-down").toggleClass("rotate-icon");
                                        });

                                        $(document).click(function () {
                                            $(".dropdown").slideUp();
                                        });

                                    }

                                    document.querySelector(".edit-details").innerHTML += `
                                    <div class="current-images">
                                        <h2>Current Images</h2>
                                        <div class="images">
                                        </div>
                                    </div>
                                    <div class="photo-preview"></div>
                                    <div class="upload-images">
                                        <h4>Upload Images</h4>
                                        <p><i class="fa-solid fa-cloud-arrow-up"></i><strong>Click to upload</strong> or drag and drop</p>
                                        <div class="upload-btn"><i class="fa-solid fa-file-arrow-up"></i>Upload</div>
                                        <div id="customAlert" class="alert"></div>
                                        <input type="file">
                                        <i class="fa-solid fa-plus"></i>
                                    </div>`;

                                    const fileField = document.querySelector(`.upload-images input[type="file"]`);
                                    const dropZone = document.querySelector(".upload-images");
                                    const uploadButton = document.querySelector(".upload-btn");
                                    const attachButton = document.querySelector(".upload-images .fa-plus");
                                    const imagesDiv = document.querySelector(".images");
                                    const saveButton = document.querySelector(".save");
                                    let pendingRequests = 0;

                                    function updateUIState() {
                                        if (pendingRequests > 0) {
                                            saveButton.classList.add("disabled");
                                        } else {
                                            saveButton.classList.remove("disabled");
                                        }
                                    }

                                    allUnitsImages[originalUnitId].forEach((image) => {
                                        imagesDiv.innerHTML += `
                                            <div class="chat-image">
                                                <img src="${image.url}" data-file-id="${image.fileId}" alt="Chat Image" draggable="false">
                                                <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                            </div>`
                                            ;
                                    });

                                    document.querySelector(".images").addEventListener("click", function (event) {
                                        if (event.target.closest(".del")) {
                                            let theImage = event.target.closest(".chat-image");
                                            const imageUrl = theImage.querySelector("img").getAttribute("src");
                                            const imageFileId = theImage.querySelector("img").getAttribute("data-file-id");
                                            let overlay = document.createElement("div");
                                            overlay.classList.add("image-overlay");
                                            overlay.innerHTML = `<i class="fa-solid fa-spinner fa-spin loading-spinner"></i>`;
                                            theImage.appendChild(overlay);
                                            theImage.classList.add("deleting");

                                            pendingRequests++;
                                            updateUIState();
                                            $.ajax({
                                                url: `https://api.lenaai.net/images/${imageFileId}`,
                                                method: "DELETE",
                                                success: function (response) {
                                                    console.log("File deleted successfully:", response);
                                                    theImage.remove();
                                                    allUnitsImages[originalUnitId] = allUnitsImages[originalUnitId].filter(item => item.url !== imageUrl);
                                                },
                                                error: function (xhr, status, error) {
                                                    console.error("Error:", xhr.responseText);
                                                    theImage.classList.remove("deleting");
                                                    overlay.remove();
                                                },
                                                complete: function () {
                                                    pendingRequests--;
                                                    updateUIState();
                                                }
                                            });
                                        }
                                    });

                                    attachButton.addEventListener("click", function () {
                                        fileField.click();
                                    });

                                    function showCustomAlert(message) {
                                        const alertBox = document.getElementById("customAlert");
                                        alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>${message}`;
                                        alertBox.style.display = "block";

                                        setTimeout(() => {
                                            alertBox.style.opacity = "0";
                                            setTimeout(() => {
                                                alertBox.style.display = "none";
                                                alertBox.style.opacity = "1";
                                            }, 500);
                                        }, 3000);
                                    }

                                    function handleFiles(files) {
                                        let file = files[0];
                                        if (file) {
                                            const allowedTypes = ["image/png", "image/jpeg"];
                                            if (!allowedTypes.includes(file.type)) {
                                                showCustomAlert("Invalid file type! Please upload a GIF, JPEG or PNG image and should not exceed 10MB.");
                                                this.value = "";
                                            } else {
                                                document.querySelector(".photo-preview").style.display = "block";
                                                const reader = new FileReader();
                                                reader.onload = function (e) {
                                                    $('.photo-preview').html(`<img src="${e.target.result}" alt="Photo Preview">
                                                        <i class="fa-solid fa-circle-xmark"></i>`);

                                                    document.querySelector(".photo-preview i").addEventListener("click", function () {
                                                        fileField.value = "";
                                                        document.querySelector(".photo-preview").innerHTML = "";
                                                        document.querySelector(".photo-preview").style.display = "none";
                                                        uploadButton.style.display = "none";
                                                        attachButton.style.display = "block";
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                                attachButton.style.display = "none";
                                                uploadButton.style.display = "flex";
                                            }
                                        } else {
                                            $('.photo-preview').html('');
                                        }
                                    }

                                    // Drag events
                                    dropZone.addEventListener("dragover", (e) => {
                                        e.preventDefault();
                                        dropZone.classList.add("dragover");
                                    });

                                    dropZone.addEventListener("dragleave", () => {
                                        dropZone.classList.remove("dragover");
                                    });

                                    dropZone.addEventListener("drop", (e) => {
                                        e.preventDefault();
                                        dropZone.classList.remove("dragover");

                                        let files = e.dataTransfer.files;
                                        handleFiles(files);
                                    });

                                    fileField.addEventListener("change", function () {
                                        handleFiles(this.files)
                                    });

                                    uploadButton.addEventListener("click", function () {
                                        if (!fileField.files.length) {
                                            showCustomAlert("Please select a file first.");
                                            return;
                                        }
                                        const formData = new FormData();
                                        formData.append("file", fileField.files[0]);
                                        let tempURL = URL.createObjectURL(fileField.files[0]);
                                        let newImage = document.createElement("div");
                                        newImage.classList.add("chat-image", "uploading");
                                        newImage.innerHTML = `
                                            <img src="${tempURL}" alt="Uploading Image">
                                            <div class="image-overlay">
                                                <i class="fa-solid fa-spinner fa-spin loading-spinner"></i>
                                            </div>
                                        `;
                                        const imagesDiv = document.querySelector(".current-images .images");
                                        imagesDiv.appendChild(newImage);

                                        pendingRequests++;
                                        updateUIState();
                                        $.ajax({
                                            url: "https://api.lenaai.net/images/",
                                            method: "POST",
                                            data: formData,
                                            contentType: false,
                                            processData: false,
                                            success: function (response) {
                                                console.log("File uploaded successfully:", response);
                                                allUnitsImages[originalUnitId].push(response);

                                                const imagesDiv = document.querySelector(".current-images").querySelector(".images");
                                                newImage.remove();
                                                imagesDiv.innerHTML += `
                                                <div class="chat-image">
                                                    <img src="${response.url}" data-file-id="${response.fileId}" alt="Chat Image" draggable="false">
                                                    <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                                </div>`;
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error:", xhr.responseText);
                                                newImage.remove();
                                            },
                                            complete: function () {
                                                pendingRequests--;
                                                updateUIState();
                                            }
                                        });

                                        document.querySelector(".photo-preview").innerHTML = "";
                                        document.querySelector(".photo-preview").style.display = "none";
                                        uploadButton.style.display = "none";
                                        attachButton.style.display = "block";
                                        fileField.value = "";
                                    });

                                    function toCamelCase(str) {
                                        return str
                                            .toLowerCase()
                                            .replace(/\s(.)/g, (match, char) => char.toUpperCase())
                                            .replace(/\s/g, "")
                                            .replace(/^([A-Z])/, (match) => match.toLowerCase())
                                    }

                                    // chat images drag
                                    let wasDragging = false;

                                    document.addEventListener("mousedown", function (e) {
                                        const slider = e.target.closest(".images");
                                        if (!slider || !slider.contains(e.target)) return;

                                        let startX = e.clientX;
                                        let scrollLeft = slider.scrollLeft;

                                        slider.classList.add("image-active");

                                        function handleMouseMove(e) {
                                            wasDragging = true;
                                            const x = e.clientX;
                                            const walk = (x - startX) * 1;
                                            slider.scrollLeft = scrollLeft - walk;
                                        }

                                        function stopScrolling() {
                                            slider.classList.remove("image-active");
                                            document.removeEventListener("mousemove", handleMouseMove);
                                            document.removeEventListener("mouseup", stopScrolling);

                                            if (wasDragging) {
                                                document.addEventListener("click", preventClick, true);
                                                setTimeout(() => {
                                                    document.removeEventListener("click", preventClick, true);
                                                    wasDragging = false;
                                                }, 0);
                                            }
                                        }

                                        document.addEventListener("mousemove", handleMouseMove);
                                        document.addEventListener("mouseup", stopScrolling, { once: true });
                                    });

                                    function preventClick(e) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }


                                    document.querySelector(".close-btn").addEventListener("click", function () {
                                        originalPaymentPlans = [];
                                        editOverlay.style.display = "none";
                                        editPopup.innerHTML = '';
                                    });

                                    // document.querySelector(".cancel").addEventListener("click", function () {
                                    //     editOverlay.style.display = "none";
                                    //     editPopup.innerHTML = '';
                                    // });

                                    document.querySelector(".save").addEventListener("click", function () {
                                        function getFormattedDateTime() {
                                            let now = new Date();
                                            let year = now.getFullYear();
                                            let month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                                            let day = String(now.getDate()).padStart(2, "0");
                                            let hours = String(now.getHours()).padStart(2, "0");
                                            let minutes = String(now.getMinutes()).padStart(2, "0");
                                            let seconds = String(now.getSeconds()).padStart(2, "0");

                                            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                                        }

                                        let unitObject = {
                                            "clientName": clientUserName,
                                            "clientId": clientId,
                                            "country": "",
                                            "city": "",
                                            "compound": "",
                                            "developer": "",
                                            "unitId": "",
                                            "view": "",
                                            "garageArea": "",
                                            "deliveryDate": "",
                                            "bathroomCount": 0,
                                            "buildingType": "",
                                            "floor": 0,
                                            "roomsCount": 0,
                                            "landArea": 0,
                                            "gardenSize": 0,
                                            "finishing": "",
                                            "dataSource": "",
                                            "downPayment": 0,
                                            "totalPrice": 0,
                                            "paymentPlans": "",
                                            "images": [],
                                            "updatedAt": getFormattedDateTime()
                                        };
                                        let unitId;

                                        document.querySelectorAll(".edit-details li").forEach((li) => {
                                            const key = li.textContent.trim().split(":")[0].trim();
                                            const input = li.querySelector("input")?.value.trim();
                                            const dataSrc = li.querySelector("a")?.getAttribute("href");

                                            function enforceType(key, value) {
                                                const numberFields = [
                                                    "floor",
                                                    "roomsCount",
                                                    "bathroomCount",
                                                    "landArea",
                                                    "gardenSize",
                                                    "downPayment",
                                                    "totalPrice",
                                                    "garageArea"
                                                ];

                                                if (numberFields.includes(key)) {
                                                    if (typeof value === "string") {
                                                        value = value.replace(/[^\d.]/g, "");
                                                    }

                                                    return isNaN(value) || value === "" || value === "N/A" ? 0 : Number(value);
                                                }

                                                return value;
                                            }

                                            function formatNumber(value) {
                                                if (/^\d{1,3}(,\d{3})*$/.test(value)) {
                                                    return value;
                                                }

                                                return Number(value).toLocaleString();
                                            }

                                            if (toCamelCase(key) === "title") {
                                                unitId = input;
                                                unitObject.unitId = input;
                                                unitObject.images = allUnitsImages[originalUnitId]
                                            } else if (toCamelCase(key).includes("dataSource")) {
                                                unitObject.dataSource = dataSrc;
                                            } else if (li.classList.contains("compound")) {
                                                const inputField = li.querySelector("input.value");
                                                const valueElement = li.querySelector(".value");

                                                if (inputField) {
                                                    unitObject.compound = inputField.value;
                                                } else if (valueElement) {
                                                    unitObject.compound = valueElement.textContent;
                                                }
                                            } else if (li.classList.contains("country")) {
                                                unitObject.country = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("building")) {
                                                unitObject.buildingType = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("views")) {
                                                unitObject.view = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("finishing")) {
                                                unitObject.finishing = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("delivery-date")) {
                                                unitObject.deliveryDate = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("payment-plan")) {
                                                unitObject.paymentPlans = originalPaymentPlans.join(", ");
                                                originalPaymentPlans = [];
                                            } else {
                                                const camelKey = toCamelCase(key);
                                                if (camelKey in unitObject) {
                                                    unitObject[camelKey] = enforceType(camelKey, input);
                                                }
                                            }
                                        });

                                        console.log("data collected from the edit window", unitObject)

                                        function startAjaxCall(unitObject) {
                                            const editContent = $(".edit-content");

                                            $("#loadingOverlay").remove();

                                            if (!paymentPlansRegex.test(unitObject.paymentPlans)) {
                                                showCustomAlert("Invalid Payment Plans format. Use: 0: 5000000, 5: 10000000");
                                                return;
                                            }
                                            editContent.append(`
                                                <div id="loadingOverlay" class="loading-overlay">
                                                    <div class="spinner-container">
                                                        <i id="loadingIcon" class="fa fa-spinner fa-spin"></i>
                                                        <p id="loadingText">Updating Unit ...</p>
                                                    </div>
                                                </div>
                                            `);

                                            const overlay = $("#loadingOverlay");
                                            const loadingText = $("#loadingText");
                                            const loadingIcon = $("#loadingIcon");
                                            overlay.removeClass("hidden");

                                            $.ajax({
                                                url: `https://api.lenaai.net/update-unit/`,
                                                method: "POST",
                                                headers: {
                                                    "clientId": clientId,
                                                },
                                                contentType: "application/json",
                                                data: JSON.stringify(unitObject),
                                                success: function (response) {
                                                    console.log("API response", response);
                                                    loadingIcon.attr("class", "fa fa-check-circle success");
                                                    loadingText.html("Success!");
                                                    $.ajax({
                                                        url: `https://api.lenaai.net/units/${clientId}`,
                                                        method: "GET",
                                                        headers: {
                                                            "clientId": clientId,
                                                        },
                                                        dataType: "json",
                                                        success: function (response) {
                                                            renderUnits(response);
                                                        }
                                                    })
                                                },
                                                error: function (error) {
                                                    loadingIcon.attr("class", "fa fa-times-circle error");
                                                    loadingText.html("Failed. Please try again.");
                                                },
                                                complete: function () {
                                                    setTimeout(() => overlay.addClass("hidden"), 1500);
                                                    setTimeout(() => {
                                                        editOverlay.style.display = "none";
                                                        editPopup.innerHTML = '';
                                                    }, 1500);
                                                }
                                            })
                                        }
                                        startAjaxCall(unitObject);
                                    });
                                });
                            });
                        }

                        renderUnits(response);

                        // Populate chat list
                        let cursor = "";
                        let isLoading = false;
                        let hasMoreData = true;
                        let allPhoneNumbers = [];
                        let allLeadScores = {};
                        const clientsList = $(".clients-list");

                        function showClientsSkeleton() {
                            const skeletonHTML = `
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                            `;
                            clientsList.append(skeletonHTML);
                        }

                        function hideClientsSkeleton() {
                            $(".skeleton").fadeOut(300, function () {
                                $(this).remove();
                            });
                        }

                        function fetchData() {
                            if (isLoading || !hasMoreData) return;
                            isLoading = true;
                            const skeletonContainer = document.createElement("div");
                            skeletonContainer.classList.add("skeleton-container");
                            showClientsSkeleton();

                            $.ajax({
                                url: `https://api.lenaai.net/dashboard/${clientId}`,
                                method: "GET",
                                data: {
                                    "limit": 50,
                                    "cursor": cursor
                                },
                                success: function (response) {
                                    console.log(response)
                                    hideClientsSkeleton();
                                    if (!response.pagination.has_more || !response.pagination.next_cursor) {
                                        hasMoreData = false;
                                        $(".overview-container").off("scroll");
                                    } else {
                                        cursor = response.pagination.next_cursor;
                                    }

                                    isLoading = false;

                                    const container = $(".clients-list");
                                    const borderByAction = {
                                        "ScheduleCall": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-phone"></i>`
                                        },
                                        "Make a call": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-phone"></i>`
                                        },
                                        "Office visit": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-calendar-days"></i>`
                                        },
                                        "OfficeVisit": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-calendar-days"></i>`
                                        },
                                        "Property view": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-house"></i>`
                                        },
                                        "BookViewing": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-house"></i>`
                                        },
                                        "Qualified lead": {
                                            "color": "green",
                                            "icon": `<i class="fa-solid fa-chart-pie"></i>`
                                        },
                                        "Not interested": {
                                            "color": "grey",
                                            "icon": `<i class="fa-solid fa-circle-xmark"></i>`
                                        },
                                        "Not qualified": {
                                            "color": "black",
                                            "icon": `<i class="fa-solid fa-circle-down"></i>`
                                        },
                                        "Follow up later": {
                                            "color": "grey",
                                            "icon": `<i class="fa-solid fa-circle-right"></i>`
                                        },
                                        "Missing requirement": {
                                            "color": "#CC7722",
                                            "icon": `<i class="fa-solid fa-clipboard-question"></i>`
                                        }
                                    };

                                    response.users.forEach((user) => {
                                        const phoneNumber = user.phoneNumber;
                                        allPhoneNumbers.push(phoneNumber);

                                        const messages = user.conversation;

                                        const action = user.actions.action;
                                        const score = user.actions.score
                                        allLeadScores[phoneNumber] = score;
                                        const actionElement = document.createElement("li");
                                        actionElement.classList.add("call-now");
                                        if (action && Object.keys(borderByAction).includes(action)) {
                                            if (action === "Missing requirement") {
                                                actionElement.innerHTML = `${borderByAction[action].icon}Missing Info`;
                                            } else {
                                                actionElement.innerHTML = `${borderByAction[action].icon}${action}`;
                                            }
                                            actionElement.style.backgroundColor = borderByAction[action].color;
                                            actionElement.style.color = "#fff";
                                            actionElement.style.border = borderByAction[action].color;
                                        } else {
                                            actionElement.innerHTML = `<i class="fa-regular fa-circle-check"></i>No Action`;
                                        }

                                        let latestDate = "N/A";
                                        let latestDateOnly = "";
                                        if (messages.length > 0) {
                                            const latestTimestamp = messages
                                                .map(msg => new Date(msg.timestamp))
                                                .sort((a, b) => b - a)[0];

                                            latestDate = latestTimestamp.toISOString();
                                            latestDateOnly = latestTimestamp.toISOString().split("T")[0];
                                        }

                                        const client = $(`
                                            <ul class="client"
                                                data-date="${latestDate}"
                                                data-status="${borderByAction[action] ? "action-needed" : "no-action"}"
                                                data-messages='${JSON.stringify(messages).replace(/'/g, "&apos;")}'
                                                data-requirements='${JSON.stringify(user.requirements).replace(/'/g, "&apos;")}'
                                                data-profile="${user.profile.toggle_ai_auto_reply}"
                                            >
                                                <li class="client-name">${phoneNumber}</li>
                                                <li class="client-date">${latestDateOnly}</li>
                                                <li class="requirements">Requirements</li>
                                                <li class="need-action">
                                                    <div class="messages-no">${(messages.length * 2).toString().padStart(2, "0")}</div>
                                                </li>
                                            </ul>
                                        `);
                                        client.append(actionElement);
                                        container.append(client);
                                    });

                                    $(".overview-container").on("scroll", function () {
                                        if (!hasMoreData) return;

                                        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 100) {
                                            fetchData();
                                        }
                                    });

                                    const clients = Array.from(document.querySelectorAll(".client"));

                                    document.querySelectorAll(".client-name").forEach((number) => {
                                        number.addEventListener("click", function (event) {
                                            event.stopPropagation();
                                            const text = this.innerText.trim();
                                            navigator.clipboard.writeText(text).then(() => {
                                                let tooltip = document.getElementById("tooltip");
                                                tooltip.innerHTML = `${text} copied to clipboard.`;
                                                tooltip.classList.add("show-tooltip");
                                
                                                setTimeout(() => {
                                                    tooltip.classList.remove("show-tooltip");
                                                }, 1500);
                                            }).catch(err => console.error("Error copying text: ", err));
                                        });
                                    });

                                    // All Chats filer
                                    const allChatsButton = document.querySelector(".all-chats");
                                    allChatsButton.addEventListener("click", function () {
                                        clients.forEach(client => {
                                            client.style.display = "flex";
                                        });
                                    })

                                    // Recent first filter
                                    let descending = false;
                                    const recentButton = document.querySelector(".recent");
                                    recentButton.addEventListener("click", function () {

                                        clients.sort((a, b) => {
                                            const dateA = new Date(a.getAttribute("data-date"));
                                            const dateB = new Date(b.getAttribute("data-date"));
                                            return descending ? dateA - dateB : dateB - dateA;
                                        });

                                        container[0].innerHTML = "";
                                        clients.forEach((client, i) => {
                                            // if (i %2 === 0) {
                                            //     client.style.backgroundColor = "#F9FAFB";
                                            // } else {
                                            //     client.style.backgroundColor = "#F3F4F6";
                                            // }
                                            container[0].appendChild(client)
                                        });
                                    });

                                    // Action filter
                                    const actionButton = document.querySelector(".action");
                                    actionButton.addEventListener("click", function () {
                                        clients.forEach((client, i) => {
                                            if (client.getAttribute("data-status") !== "action-needed") {
                                                client.style.display = "none";
                                            } else {
                                                client.style.display = "flex";
                                            }

                                            // if (i %2 === 0) {
                                            //     client.style.backgroundColor = "#F9FAFB";
                                            // } else {
                                            //     client.style.backgroundColor = "#F3F4F6";
                                            // }
                                        });
                                    });

                                    // Switch button for active
                                    const noActionButton = document.querySelector(".no-action");
                                    noActionButton.addEventListener("click", function () {
                                        clients.forEach((client) => {
                                            if (client.getAttribute("data-status") === "action-needed") {
                                                client.style.display = "none";
                                            } else {
                                                client.style.display = "flex";
                                            }
                                        })
                                    });

                                    // Client Search bar
                                    const search = document.getElementById("client-search-bar");
                                    const notFound = document.querySelector(".not-found");
                                    const baseNotFoundText = notFound.textContent;
                                    search.addEventListener("keyup", function () {
                                        const input = search.value
                                        let filter = input.toUpperCase();
                                        let resultsCount = 0;

                                        clients.forEach((client) => {
                                            const clientName = client.querySelector(".client-name").textContent;
                                            if (clientName.toUpperCase().indexOf(filter) > -1) {
                                                client.style.display = "flex";
                                                resultsCount++;
                                            } else {
                                                client.style.display = "none";
                                            }
                                        })

                                        if (resultsCount === 0) {
                                            notFound.textContent = baseNotFoundText + `"${input}"`
                                            notFound.style.display = "block";
                                        } else {
                                            notFound.style.display = "none";
                                        }
                                    });

                                    // Requirements
                                    const requirements = document.querySelectorAll(".requirements");
                                    requirements.forEach((requirement) => {
                                        requirement.addEventListener("click", function (event) {
                                            event.stopPropagation();
                                            const userNumber = event.target.parentElement.querySelector(".client-name").textContent;
                                            const reqOverlay = document.querySelector(".req-overlay");
                                            const reqProfile = document.querySelector(".req-profile");

                                            reqOverlay.style.display = "flex";
                                            reqProfile.innerHTML = `
                                            <div class="history-header">
                                                <h1>${userNumber}'s requirements</h1>
                                                <i class="fa-solid close-btn fa-circle-xmark"></i>
                                            </div>
                                            <div class="user-profile">
                                                <div class="probability">
                                                    <h3>Purchase Probability</h3>
                                                    <canvas id="probabilityChart"></canvas>
                                                </div>
                                                <div class="user-info">
                                                    <ul class="req-list">
                                                    </ul>
                                                </div>
                                            </div>`;

                                            const requirementsList = document.querySelector(".req-list");
                                            const requirementsAttr = event.target.parentElement.getAttribute("data-requirements");
                                            const userRequirements = JSON.parse(requirementsAttr);
                                            Object.keys(userRequirements).forEach((requirement) => {
                                                if (requirement.includes("id")) {
                                                    return;
                                                }

                                                let listItem = document.createElement("li");
                                                let requirementTitle = requirement.charAt(0).toUpperCase() + requirement.slice(1).replaceAll("_", " ");
                                                let requirementValue = [];

                                                if (requirement === "must_have_features" || requirement === "Financial Plans") {
                                                    if (Array.isArray(userRequirements[requirement])) {
                                                        requirementValue = userRequirements[requirement].flatMap(obj =>
                                                            Object.entries(obj).map(([key, value]) => `${key}: ${value}`)
                                                        );
                                                    } else {
                                                        const featObject = userRequirements[requirement];
                                                        Object.keys(featObject).forEach((feature) => {
                                                            requirementValue.push(`${feature}: ${featObject[feature]}`);
                                                        });
                                                    }
                                                    requirementValue = requirementValue.join(",<br>");
                                                } else {
                                                    requirementValue = userRequirements[requirement];
                                                    if (Array.isArray(requirementValue)) {
                                                        requirementValue = requirementValue.join(",<br>");
                                                    }
                                                }

                                                listItem.innerHTML = `
                                                    <div class="req-title">${requirementTitle}</div>
                                                    <div class="req-value">${requirementValue}</div>
                                                `;

                                                requirementsList.appendChild(listItem);
                                            });

                                            const grid = document.querySelector(".req-list");

                                            new Masonry(grid, {
                                                itemSelector: "li",
                                                columnWidth: grid.querySelector("li"),
                                                gutter: 18,
                                                percentPosition: true,
                                            });

                                            const purchaseProbability = allLeadScores[userNumber] || 0;

                                            const ctx = document.getElementById('probabilityChart').getContext('2d');

                                            const probabilityChart = new Chart(ctx, {
                                                type: 'doughnut',
                                                data: {
                                                    labels: ['Probability', 'No Interest'],
                                                    datasets: [{
                                                        data: [purchaseProbability, 100 - purchaseProbability],
                                                        backgroundColor: ['#cbb26a', '#ddd'],
                                                        borderWidth: 0
                                                    }]
                                                },
                                                options: {
                                                    responsive: false,
                                                    cutout: '70%',
                                                    plugins: {
                                                        legend: { display: false },
                                                        tooltip: { enabled: true }
                                                    }
                                                },
                                                plugins: [{
                                                    beforeDraw: (chart) => {
                                                        const width = chart.width;
                                                        const height = chart.height;
                                                        const ctx = chart.ctx;

                                                        ctx.restore();

                                                        const fontSize = Math.round(height / 6);
                                                        ctx.font = `bold ${fontSize}px Poppins`;
                                                        ctx.fillStyle = "white";
                                                        ctx.textBaseline = 'middle';
                                                        ctx.textAlign = 'center';

                                                        const text = `${purchaseProbability}%`;
                                                        const textX = Math.round(width / 2);
                                                        const textY = Math.round(height / 2);

                                                        ctx.fillText(text, textX, textY);
                                                        ctx.save();
                                                    }
                                                }]
                                            });

                                            document.querySelector(".close-btn").addEventListener("click", function () {
                                                reqOverlay.style.display = "none";
                                                reqProfile.innerHTML = '';
                                            });
                                        })
                                    })

                                    // Messages History
                                    clients.forEach((client) => {
                                        client.addEventListener("click", function () {
                                            const chatOverlay = document.querySelector(".chat-overlay");
                                            const chatHistory = document.querySelector(".chat-history");
                                            const userNumber = client.querySelector(".client-name").textContent;
                                            const messages = client.getAttribute("data-messages");
                                            const parsedMessages = messages ? JSON.parse(messages) : [];
                                            parsedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                                            chatOverlay.style.display = "flex";
                                            chatHistory.innerHTML = `
                                            <div class="history-header">
                                                <h1>Messages History</h1>
                                                <div class="seg-ctrl">
                                                    <div class="seg-opt-right">Manual</div>
                                                    <div class="seg-opt-left">AI</div>
                                                </div>
                                                <i class="fa-solid close-btn fa-circle-xmark"></i>
                                            </div>
                                            <div class="chatbot">
                                                <div id="messages">
                                                </div>
                                                <div class="input-field">
                                                    <form id="input-form">
                                                        <input type="text" id="user-input" placeholder="Type Something Here" autocomplete="off">
                                                    </form>
                                                    <i class="fa-solid fa-paper-plane" id="submit-btn"></i>
                                                </div>
                                            </div>`;

                                            const userProfile = client.getAttribute("data-profile");
                                            const leftOption = chatHistory.querySelector(".seg-opt-left");
                                            const rightOption = chatHistory.querySelector(".seg-opt-right");

                                            if (userProfile === "true") {
                                                leftOption.classList.add("seg-active");
                                                rightOption.classList.remove("seg-active");
                                            } else {
                                                rightOption.classList.add("seg-active");
                                                leftOption.classList.remove("seg-active");
                                            }

                                            const chatSubmit = document.getElementById("submit-btn");
                                            const inputForm = document.getElementById("input-form");
                                            function takeUserInput() {
                                                let inputField = document.getElementById("user-input");
                                                let userInput = inputField.value.trim();
                                                const messagesDiv = document.getElementById("messages");
                                                let message = document.createElement("div");


                                                if (userInput === "") return;
                                                message.innerHTML = userInput;
                                                message.classList.add("message");
                                                messagesDiv.appendChild(message);

                                                inputField.value = "";
                                                messagesDiv.scrollTop = messagesDiv.scrollHeight;

                                                console.log(userInput)
                                                $.ajax({
                                                    url: `https://api.lenaai.net/webhook/message/text`,
                                                    method: "POST",
                                                    contentType: "application/json",
                                                    data: JSON.stringify({
                                                        "to_number": "201032788912",
                                                        "message": userInput,
                                                        "client_id": clientId
                                                    }),
                                                    success: function (response) {
                                                        console.log(response);
                                                    }
                                                })
                                            }

                                            chatSubmit.addEventListener("click", function () {
                                                takeUserInput();
                                            });

                                            inputForm.addEventListener("submit", function (event) {
                                                event.preventDefault();
                                                takeUserInput();
                                            });

                                            document.querySelector(".seg-ctrl").addEventListener("click", function (event) {
                                                const rightOption = document.querySelector(".seg-opt-right");
                                                const leftOption = document.querySelector(".seg-opt-left");
                                                let toggleAI = true;

                                                if (event.target.classList.contains("seg-opt-right")) {
                                                    rightOption.classList.add("seg-active");
                                                    leftOption.classList.remove("seg-active");
                                                    toggleAI = false;
                                                } else if (event.target.classList.contains("seg-opt-left")) {
                                                    leftOption.classList.add("seg-active");
                                                    rightOption.classList.remove("seg-active");
                                                    toggleAI = true;
                                                }

                                                $.ajax({
                                                    url: `https://api.lenaai.net/lenaai-auto-reply`,
                                                    method: "POST",
                                                    contentType: "application/json",
                                                    data: JSON.stringify({
                                                        "phone_number": userNumber,
                                                        "client_id": clientId,
                                                        "toggle_ai_auto_reply": toggleAI,
                                                        "username": clientUserName
                                                    }),
                                                    success: function (response) {
                                                        console.log("API Response:", response);
                                                        client.setAttribute("data-profile", toggleAI.toString());
                                                    },
                                                    error: function (error) {
                                                        console.error("API Error:", error);
                                                    }
                                                });
                                            });

                                            const messagesDiv = document.getElementById("messages");
                                            let latestTimestamp = "";
                                            parsedMessages.forEach((message) => {
                                                if (message.bot_response === "" && message.user_message === "") {
                                                    return;
                                                }

                                                function timeAgo(timestamp) {
                                                    let now = new Date();
                                                    let messageTime = new Date(timestamp);
                                                    let diff = Math.floor((now - messageTime) / 60000);

                                                    if (diff < 1) return "Just now";
                                                    if (diff < 60) return `${diff} min ago`;
                                                    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;

                                                    let options = { month: "short", day: "numeric" };

                                                    if (messageTime.getFullYear() !== now.getFullYear()) {
                                                        options.year = "numeric";
                                                    }

                                                    return messageTime.toLocaleDateString("en-US", options);
                                                }

                                                function formatTime(timestamp) {
                                                    let messageTime = new Date(timestamp);
                                                    return messageTime.toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true
                                                    });
                                                }

                                                let userMessage = document.createElement("div");
                                                let botResponse = document.createElement("div");

                                                let userMessageTime = document.createElement("div");
                                                let botMessageTime = document.createElement("div");

                                                let cleanMessage = message.bot_response.split('"message":')[0].trim();
                                                cleanMessage = cleanMessage.replace(/[,"]+$/, "").trim();

                                                userMessageTime.innerHTML = formatTime(message.timestamp);
                                                userMessageTime.classList.add("message-time");
                                                botMessageTime.innerHTML = formatTime(message.timestamp);
                                                botMessageTime.classList.add("message-time");

                                                userMessage.innerHTML = message.user_message;
                                                userMessage.appendChild(userMessageTime);

                                                botResponse.innerHTML = cleanMessage;
                                                botResponse.appendChild(botMessageTime);

                                                userMessage.classList.add("message", "sent");
                                                botResponse.classList.add("message");

                                                let conversationTime = timeAgo(message.timestamp);
                                                if (latestTimestamp === "" || latestTimestamp !== conversationTime) {
                                                    let timeDiv = document.createElement("div");
                                                    timeDiv.classList.add("timestamp");
                                                    timeDiv.textContent = conversationTime;
                                                    messagesDiv.appendChild(timeDiv);
                                                    latestTimestamp = conversationTime;
                                                }

                                                if (message.user_message !== "") {
                                                    messagesDiv.appendChild(userMessage);
                                                }
                                                if (message.bot_response !== "") {
                                                    messagesDiv.appendChild(botResponse);
                                                }

                                                if (message.properties && message.properties !== "") {
                                                    Object.values(message.properties).forEach((property) => {
                                                        let imagesDiv = document.createElement("div");
                                                        imagesDiv.classList.add("images");

                                                        let detailsDiv = document.createElement("div");
                                                        detailsDiv.classList.add("property-details");
                                                        detailsDiv.innerHTML = `
                                                            <h2>${property.metadata.compound || ""}</h2>
                                                            <p>Location<span>${property.metadata.city || ""}, ${property.metadata.country || ""}</span></p>
                                                            <p>Type<span>${property.metadata.buildingType || ""}</span></p>
                                                            <p>Rooms<span>${property.metadata.roomsCount || ""}</span></p>
                                                            <p>Bathrooms<span>${property.metadata.bathroomCount || ""}</span></p>
                                                            <p>Total Price<span>${property.metadata.totalPrice.toLocaleString() || ""} EGP</span></p>
                                                            <p>Payment Plans<span>${property.metadata.paymentPlans || ""}</span></p>
                                                            <p>Developer<span>${property.metadata.developer || ""}</span></p>
                                                            <p>Floor<span>${property.metadata.floor || ""}</span></p>
                                                            <p>View<span>${property.metadata.view || ""}</span></p>
                                                            <p>Down Payment<span>${property.metadata.downPayment.toLocaleString() || ""} EGP</span></p>
                                                            <p>Selling Area<span>${property.metadata.landArea || ""} m²</span></p>
                                                            <p>Garden Size<span>${property.metadata.gardenSize || ""} m²</span></p>
                                                            <p>Garage Area<span>${property.metadata.garageArea || ""} m²</span></p>
                                                            <p>Delivery Date<span>${property.metadata.deliveryDate || ""}</span></p>
                                                            <p>Finishing<span>${property.metadata.finishing || ""}</span></p>
                                                        `;

                                                        imagesDiv.appendChild(detailsDiv);

                                                        let propertyImages = property.metadata.images;
                                                        if (Array.isArray(propertyImages) && typeof propertyImages !== "string") {
                                                            propertyImages.forEach(propertyImage => {
                                                                let image = document.createElement("div");
                                                                image.classList.add("chat-image");
                                                                image.innerHTML = `<img src="${propertyImage.url}" alt="Property Image" draggable="false">`;
                                                                imagesDiv.appendChild(image);
                                                            });
                                                        }

                                                        messagesDiv.appendChild(imagesDiv);
                                                    })

                                                    // chat images drag
                                                    let wasDragging = false;

                                                    document.addEventListener("mousedown", function (e) {
                                                        const slider = e.target.closest(".images");
                                                        if (!slider || !slider.contains(e.target)) return;

                                                        let startX = e.clientX;
                                                        let scrollLeft = slider.scrollLeft;

                                                        slider.classList.add("image-active");

                                                        function handleMouseMove(e) {
                                                            wasDragging = true;
                                                            const x = e.clientX;
                                                            const walk = (x - startX) * 1;
                                                            slider.scrollLeft = scrollLeft - walk;
                                                        }

                                                        function stopScrolling() {
                                                            slider.classList.remove("image-active");
                                                            document.removeEventListener("mousemove", handleMouseMove);
                                                            document.removeEventListener("mouseup", stopScrolling);

                                                            if (wasDragging) {
                                                                document.addEventListener("click", preventClick, true);
                                                                setTimeout(() => {
                                                                    document.removeEventListener("click", preventClick, true);
                                                                    wasDragging = false;
                                                                }, 0);
                                                            }
                                                        }

                                                        document.addEventListener("mousemove", handleMouseMove);
                                                        document.addEventListener("mouseup", stopScrolling, { once: true });
                                                    });

                                                    function preventClick(e) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                    }
                                                }
                                            })

                                            document.querySelector(".close-btn").addEventListener("click", function () {
                                                chatOverlay.style.display = "none";
                                                chatHistory.innerHTML = '';
                                            });
                                        });
                                    });
                                },
                                error: function (error) {
                                    console.error("Error fetching chat history:", error);
                                    isLoading = false;
                                }
                            });
                        }
                        fetchData();
                    },
                    error: function (xhr) {
                        console.error(xhr.responseText);
                    }
                })
            },
            error: function (xhr) {
                console.error("Error verifying token:", xhr.responseText);
                window.location.href = "./login.html";
            }
        })
    }

    $(".tab-content").not(".active").hide();

    $(".tab-btn").click(function () {
        let tabId = $(this).data("tab");

        if ($(this).hasClass("active")) {
            return;
        }

        $(".tab-btn").removeClass("active");
        $(this).addClass("active");

        let $currentTab = $(".tab-content.active");
        let $newTab = $("#" + tabId);

        $currentTab.fadeOut(200, function () {
            $currentTab.removeClass("active");
            $newTab.addClass("active").fadeIn(300);
        });
    });

    $(".data").on("click", ".units-drop", function (event) {
        event.stopPropagation();

        let dropdown = $(this).find(".dropdown");

        $(".dropdown").not(dropdown).slideUp();

        dropdown.stop(true, true).slideToggle();
    });

    $(".data").on("click", ".units-drop li", function (event) {
        event.stopPropagation();

        let selectedItem = $(this).clone();
        let filterButton = $(this).closest(".units-drop").find(".value");

        if (filterButton.length) {
            filterButton.html(selectedItem.html() + `<i class="fa-solid fa-chevron-down"></i>`);
        }

        $(this).closest(".dropdown").slideUp();
    });

    $(document).click(function () {
        $(".dropdown").slideUp();
    });

    $(".filters").on("click", ".filters-drop, .leads-drop", function (event) {
        event.stopPropagation();

        let dropdown = $(this).find(".dropdown");

        $(".dropdown").not(dropdown).slideUp();

        dropdown.stop(true, true).slideToggle();
    });

    $(".filters").on("click", ".filters-drop li, .leads-drop li", function (event) {
        event.stopPropagation();

        let selectedItem = $(this).clone();
        let filterButton = $(this).closest(".filters-drop, .leads-drop").find(".value");

        if (filterButton.length) {
            filterButton.html(selectedItem.html() + `<i class="fa-solid fa-chevron-down"></i>`);
        }

        $(this).closest(".dropdown").slideUp();
    });

    $(document).click(function () {
        $(".dropdown").slideUp();
    });

    // Header section
    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });

    // Metrics
    const chartContainer = document.querySelector(".chart-container");
    if (!chartContainer) {
        console.error("Chart container not found. Please ensure an element with class 'chart-container' exists.");
        return;
    }

    chartContainer.innerHTML = '<div class="loading">Loading charts...</div>';

    function generateColorPalette(count) {
        const baseColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8BC34A", "#607D8B", "#E91E63", "#3F51B5"];
        const colors = [...baseColors];
        
        if (count > baseColors.length) {
            for (let i = baseColors.length; i < count; i++) {
                const hue = (i * 137.5) % 360;
                colors.push(`hsl(${hue}, 70%, 60%)`);
            }
        }
        
        return colors;
    }

    const percentageLabelsPlugin = {
        id: "percentageLabels",
        afterDraw(chart) {
            const ctx = chart.ctx;
            ctx.save();
            ctx.font = "500 14px Poppins";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            const data = chart.data.datasets[0].data;
            const total = data.reduce((sum, value) => sum + value, 0);
            const meta = chart.getDatasetMeta(0);
            
            if (!meta || !meta.data || meta.data.length === 0) {
                return;
            }
            
            meta.data.forEach((arc, index) => {
                const value = data[index];
                const percentage = (value / total) * 100;
                
                if (percentage < 3) return;
                
                try {
                    const startAngle = arc.startAngle;
                    const endAngle = arc.endAngle;
                    const midAngle = startAngle + (endAngle - startAngle) / 2;
                    
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                    
                    const radius = Math.min(chart.chartArea.right - chart.chartArea.left, 
                                           chart.chartArea.bottom - chart.chartArea.top) / 2;
                    
                    const distance = radius * 0.67;
                    const x = centerX + Math.cos(midAngle) * distance;
                    const y = centerY + Math.sin(midAngle) * distance;
                    
                    const percent = percentage.toFixed(1) + "%";
                    ctx.fillText(percent, x, y);
                } catch (error) {
                    console.error("Error drawing percentage:", error);
                }
            });
            ctx.restore();
        }
    };

    function createChartCard(key, title) {
        const chartCard = document.createElement("div");
        chartCard.className = `chart-card ${title}`;
        chartCard.style.padding = "15px";
        chartCard.style.borderRadius = "8px";
        chartCard.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        chartCard.style.borderRadius = "45px";
        chartCard.style.backgroundColor = "#f8f9fa";
        
        const titleElement = document.createElement("h3");
        titleElement.textContent = key;
        titleElement.style.textAlign = "center";
        titleElement.style.margin = "0 0 15px 0";
        chartCard.appendChild(titleElement);

        return chartCard;
    }

    function createFrequentPatternsCharts(frequentPatterns) {
        const patternKeys = Object.keys(frequentPatterns);
            
        if (patternKeys.length === 0) {
            chartContainer.innerHTML = '<div class="no-data">No pattern data available</div>';
            return;
        }

        // frequent patterns
        patternKeys.forEach((key) => {
            if (key === "financialPlans") return;
            try {
                const patternData = frequentPatterns[key];
                if (!patternData || typeof patternData !== 'object') {
                    console.error(`Invalid data for pattern: ${key}`);
                    return;
                }
                
                const labels = Object.keys(patternData);
                const percentageValues = Object.values(patternData)
                    .map(item => item.percentage)

                const patternValues = Object.values(patternData)
                    .map(item => item.count)
                
                if (labels.length === 0 || percentageValues.length === 0) {
                    console.warn(`No data for pattern: ${key}`);
                    return;
                }
                
                // Pie chart card
                const pieChartCard = createChartCard(key, "frequent-patterns-percentage");
                const pieCanvas = document.createElement("canvas");
                pieChartCard.appendChild(pieCanvas);
                chartContainer.appendChild(pieChartCard);

                // Bar Chart Card
                const barChartCard = createChartCard(key, "frequent-patterns-value");
                const barCanvas = document.createElement("canvas");
                barChartCard.appendChild(barCanvas);
                chartContainer.appendChild(barChartCard);
                
                const colors = generateColorPalette(labels.length);
                
                new Chart(pieCanvas, {
                    type: "pie",
                    data: {
                        labels: labels,
                        datasets: [{
                            data: percentageValues,
                            backgroundColor: colors
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { 
                                position: "bottom",
                                labels: {
                                    boxWidth: 12,
                                    padding: 10
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${label}: ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    },
                    plugins: [percentageLabelsPlugin]
                });

                new Chart(barCanvas, {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: [{
                            label: labels,
                            data: patternValues,
                            backgroundColor: colors
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        indexAxis: "y",
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.label}: ${context.raw}`;
                                    }
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(`Error creating chart for ${key}:`, error);
            }
        });
    }

    function createOutlierDetailCharts(outliers) {
        Object.keys(outliers).forEach(key => {
            const outlierData = outliers[key];
            const columnName = outlierData.column_name;
            const outlierValues = outlierData.outlier_values;
            
            if (!outlierValues || outlierValues.length === 0) {
                console.warn(`No outlier values for ${columnName}`);
                return;
            }
            
            const labels = Object.keys(outlierValues);
            const values = Object.values(outlierValues);

            const barChartCard = createChartCard("Outliers Values", "outliers");
            const statsElement = document.createElement("p");
            statsElement.textContent = `Total Outliers: ${outlierData.total_outliers} | Unique Values: ${labels.length}`;
            statsElement.style.textAlign = "center";
            statsElement.style.margin = "0 0 15px 0";
            barChartCard.appendChild(statsElement);
            
            const canvasWrapper = document.createElement("div");
            canvasWrapper.style.height = "300px";
            canvasWrapper.style.position = "relative";
            barChartCard.appendChild(canvasWrapper);
            
            const canvas = document.createElement("canvas");
            canvasWrapper.appendChild(canvas);
            chartContainer.appendChild(barChartCard);
            
            const colors = generateColorPalette(labels.length);
            
            new Chart(canvas, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Occurrences",
                        data: values,
                        backgroundColor: colors,
                        barPercentage: 0.6,
                        maxBarThickness: 80
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { 
                                display: true, 
                                text: "Occurrences",
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                callback: function(value) {
                                    if (Math.floor(value) === value) {
                                        return value;
                                    }
                                },
                                stepSize: 1,
                                font: {
                                    size: 14
                                }
                            }
                        },
                        x: {
                            title: { 
                                display: true, 
                                text: `${columnName}`,
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    return `Occurrences: ${value}`;
                                }
                            },
                            titleFont: {
                                size: 16
                            },
                            bodyFont: {
                                size: 14
                            }
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        });
    }

    function createMissingValuesCharts(missingValuesData, missingPercentageData) {
        // Ensure all keys are included
        const allKeys = new Set([
            ...Object.keys(missingValuesData),
            ...Object.keys(missingPercentageData)
        ]);
    
        // Convert to an array and sort (optional, for readability)
        const labels = Array.from(allKeys).sort();
    
        // Ensure values exist; use 0 if a key is missing
        const missingPercentageValues = labels.map(key => missingPercentageData[key] || 0);
        const missingValuesCounts = labels.map(key => missingValuesData[key] || 0);
    
        // Debugging logs
        console.log("Total Labels:", labels.length, labels);
        console.log("Total Missing Percentages:", missingPercentageValues.length);
        console.log("Total Missing Values:", missingValuesCounts.length);
    
        const chartContainer = document.querySelector(".chart-container");
        if (!chartContainer) {
            console.error("Chart container not found.");
            return;
        }
    
        // Create Percentage Chart
        const percentageChartCard = createChartCard("Missing Data Percentage (%)", "missing-data");
        percentageChartCard.classList.add("fill");
        chartContainer.appendChild(percentageChartCard);

        // Create Values Chart
        const valuesChartCard = createChartCard("Missing Data Values (Count)", "missing-data");
        valuesChartCard.classList.add("fill");
        chartContainer.appendChild(valuesChartCard);

        const percentageCanvasWrapper = document.createElement("div");
        const ValueCanvasWrapper = document.createElement("div");

        const chartHeight = labels.length > 15 ? labels.length * 25 + "px" : "500px";
        percentageCanvasWrapper.style.height = chartHeight;
        percentageCanvasWrapper.style.position = "relative";
        ValueCanvasWrapper.style.height = chartHeight;
        ValueCanvasWrapper.style.position = "relative";
        percentageChartCard.appendChild(percentageCanvasWrapper);
        valuesChartCard.appendChild(ValueCanvasWrapper);


        const percentageCanvas = document.createElement("canvas");
        percentageCanvas.classList.add("wide-chart");
        percentageCanvasWrapper.appendChild(percentageCanvas);

        const valuesCanvas = document.createElement("canvas");
        valuesCanvas.classList.add("wide-chart");
        ValueCanvasWrapper.appendChild(valuesCanvas);
    
        new Chart(percentageCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Missing Data Percentage (%)",
                        data: missingPercentageValues,
                        backgroundColor: "#36A2EB",
                        yAxisID: "y",
                        categoryPercentage: 0.7,
                        barPercentage: 0.8,
                        maxBarThickness: 50
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Percentage (%)",
                            font: { size: 14 }
                        },
                        position: "left",
                        ticks: { font: { size: 12 } }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Attributes",
                            font: { size: 14 }
                        },
                        ticks: {
                            font: { size: 12 },
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    },
                    legend: {
                        position: "top",
                        labels: { font: { size: 14 } }
                    }
                }
            }
        });

        new Chart(valuesCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Missing Data Values (Count)",
                        data: missingValuesCounts,
                        backgroundColor: "#FF6384",
                        yAxisID: "y",
                        categoryPercentage: 0.7,
                        barPercentage: 0.8,
                        maxBarThickness: 50
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Values (Count)",
                            font: { size: 14 }
                        },
                        position: "left",
                        ticks: { font: { size: 12 } }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Attributes",
                            font: { size: 14 }
                        },
                        ticks: {
                            font: { size: 12 },
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    },
                    legend: {
                        position: "top",
                        labels: { font: { size: 14 } }
                    }
                }
            }
        });
    }

    let chartsDescriptions = {};

    $.ajax({
        url: "https://api.lenaai.net/analyze_user_requests",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "client_id": "ALL" }),
        timeout: 10000,
        success: function(response) {
            chartContainer.innerHTML = '';
            
            if (!response || !response.frequent_patterns || !response.frequent_patterns.value) {
                chartContainer.innerHTML = '<div class="error">Invalid data received</div>';
                return;
            }
            
            // Frequent patterns percentage
            const frequentPatterns = response.frequent_patterns.value;
            chartsDescriptions["frequent-patterns-percentage"] = response.frequent_patterns.description;
            const frequentPatternsPercentageTabButton = document.getElementById("frequent-patterns-percentage");
            frequentPatternsPercentageTabButton.innerHTML += `<p style="font-size: 1.2rem;">(${response.frequent_patterns.title})</p>`;
            createFrequentPatternsCharts(frequentPatterns);

            // Frequent patterns values
            chartsDescriptions["frequent-patterns-value"] = response.frequent_patterns.description;
            const frequentPatternsValueTabButton = document.getElementById("frequent-patterns-value");
            frequentPatternsValueTabButton.innerHTML += `<p style="font-size: 1.2rem;">(${response.frequent_patterns.title})</p>`;
            createFrequentPatternsCharts(frequentPatterns);

            // Outliers
            const outliers = response.outliers_statistics.value;
            chartsDescriptions["outliers"] = response.outliers_statistics.description;
            const outliersTabButton = document.getElementById("outliers");
            outliersTabButton.innerHTML += `<p style="font-size: 1.2rem;">(${response.outliers_statistics.title})</p>`;
            createOutlierDetailCharts(outliers);

            // Missing values with percentage
            const missingValues = response.missing_values.value;
            const missingPercentages = response.missing_percentage.value;
            chartsDescriptions["missing-data"] = response.missing_values.description;
            const missingDataTabButton = document.getElementById("missing-data");
            missingDataTabButton.innerHTML += `<p style="font-size: 1.2rem;">(${response.missing_values.title})</p>`;
            createMissingValuesCharts(missingValues, missingPercentages);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            chartContainer.innerHTML = `<div class="error">Error loading data: ${textStatus}</div>`;
            console.error("API request failed:", errorThrown);
        }
    });

    const chartSelection = document.querySelector(".chart-selection");
    const chartNav = document.querySelector(".chart-nav");
    const allCharts = document.querySelectorAll(".chart-card");
    const chartButtons = document.querySelectorAll(".chart-tab-btn");
    const loadingSpinner = document.querySelector(".loading-spinner");
    const chartCollectionDescription = document.querySelector(".description");

    chartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedChartClass = this.getAttribute("data-chart");
            let tempButton = this.cloneNode(true);
            tempButton.querySelector("p")?.remove();
            const selectedText = tempButton.textContent.trim();

            chartNav.disabled = true;
            chartSelection.style.display = "none";
            loadingSpinner.style.display = "flex";
            chartContainer.style.display = "none";
            chartCollectionDescription.style.display = "none";

            chartNav.innerHTML = `<i class="fa-solid fa-arrow-left"></i><span>${selectedText}</span>`;

            setTimeout(() => {
                chartNav.innerHTML = `<i class="fa-solid fa-arrow-left"></i> <span>${selectedText}</span>`;

                allCharts.forEach(chart => chart.style.display = "none");
                document.querySelectorAll(`.${selectedChartClass}`).forEach(chart => {
                    chart.style.display = "block";
                });

                loadingSpinner.style.display = "none";

                chartCollectionDescription.style.display = "block";
                chartCollectionDescription.innerHTML = `${chartsDescriptions[selectedChartClass]}`;

                chartContainer.style.display = "grid";
                chartNav.disabled = false;
            }, 1000);
        });
    });

    chartNav.addEventListener("click", function () {
        chartNav.innerHTML = `<i class="fa-solid fa-house"></i> <span>Home</span>`;
        chartContainer.style.display = "none";
        chartCollectionDescription.style.display = "none";
        chartNav.disabled = true;
        
        const allCharts = document.querySelectorAll(".chart-card");
        allCharts.forEach(chart => chart.style.display = "none");

        chartSelection.style.display = "grid";
    });

    const whatsMessageButton = document.querySelector(".whats-msg");
    whatsMessageButton.addEventListener("click", function () {
        const editOverlay = document.querySelector(".chat-overlay");
        const editPopup = document.querySelector(".chat-history");

        editPopup.classList.add("delete-popup");
        editOverlay.style.display = "flex";
        editPopup.innerHTML = `
        <div class="history-header">
            <h1>Send Cold Whats Messages Patch</h1>
            <i class="fa-solid close-btn fa-circle-xmark"></i>
        </div>
        <div class="edit-content">
            <div class="sheet-error" style="display: none;"></div>
            <ul class="edit-details">
                <li>
                    Link or File
                    <div class="sheet-link">
                        <input type="text" id="spread-sheet" placeholder="Link or upload file">
                        <input type="file" id="spread-url" placeholder="Spread Sheet Link" style="display: none;">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                    </div> 
                </li>
                <div class="vod-error" style="display: none;"></div>
                <li>
                    Video Link
                    <input type="text" id="video-link" style="border-radius: 10px;" placeholder="Video Link">
                </li>
            </ul>
            <div class="details-btns">
                <div class="save">Send</div>
            </div>
        </div>`;

        const leadsFileButton = document.querySelector(".fa-arrow-up-from-bracket");
        const leadsFileField = document.querySelector("#spread-url");
        let inputFile = false;
        leadsFileButton.addEventListener("click", function (event) {
            event.stopPropagation();
            inputFile = false;
            leadsFileField.value = "";
            leadsFileField.click();
        });

        leadsFileField.addEventListener("change", function () {
            const filePath = leadsFileField.value;
            const spreadSheetInput = document.querySelector("#spread-sheet");

            spreadSheetInput.value = filePath;
            inputFile = true;
        });

        document.querySelector(".close-btn").addEventListener("click", function () {
            editPopup.classList.remove("delete-popup");
            editOverlay.style.display = "none";
            editPopup.innerHTML = '';
        });

        // document.querySelector(".cancel").addEventListener("click", function () {
        //     editPopup.classList.remove("delete-popup");
        //     editOverlay.style.display = "none";
        //     editPopup.innerHTML = '';
        // });

        document.querySelector(".save").addEventListener("click", function () {
            const spreadSheetInput = document.querySelector(".sheet-link");
            const spreadSheetLink = document.querySelector("#spread-sheet").value.trim();
            const videoInput = document.querySelector("#video-link");
            const videoLink = videoInput.value.trim();
            const sheetError = document.querySelector(".sheet-error");
            const vodError = document.querySelector(".vod-error");

            const spreadsheetRegex = /^(https?:\/\/)?(www\.)?docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+(\/(edit|view|copy)?(\?.*)?)?$|[^\s]+\.xls[x]?|[^\s]+\.csv$/;

            let isValid = true;
            sheetError.style.display = "none";
            sheetError.innerHTML = "";

            vodError.style.display = "none";
            vodError.innerHTML = "";

            if (inputFile === true && spreadSheetLink !== "" & spreadSheetLink === leadsFileField.value) {
                spreadSheetInput.style.border = "2px solid #cbb26a";
            } else if (!spreadsheetRegex.test(spreadSheetLink) || spreadSheetLink === "") {
                sheetError.style.display = "block";
                sheetError.innerHTML = `Invalid link! Please enter a valid Excel file (.xls, .xlsx, .csv) or a Google Sheets.`;
                spreadSheetInput.style.border = "2px solid red";
                isValid = false;
                inputFile = false;
            } else {
                spreadSheetInput.style.border = "2px solid #cbb26a";
            }

            if (!videoLink) {
                vodError.style.display = "block";
                vodError.innerHTML = `Invalid link! Please enter a valid link to a downloadable video.`;
                videoInput.style.border = "2px solid red";
                isValid = false;
            } else {
                videoInput.style.border = "2px solid #cbb26a";
            }

            if (!isValid) return;

            const editContent = $(".edit-content");

            $("#loadingOverlay").remove();

            editContent.append(`
                <div id="loadingOverlay" class="loading-overlay">
                    <div class="spinner-container">
                        <i id="loadingIcon" class="fa fa-spinner fa-spin"></i>
                        <p id="loadingText">Processing Data ...</p>
                    </div>
                </div>
            `);

            const overlay = $("#loadingOverlay");
            const loadingText = $("#loadingText");
            const loadingIcon = $("#loadingIcon");
            overlay.removeClass("hidden");

            if (inputFile === true && leadsFileField.files.length > 0) {
                const formData = new FormData();
                formData.append("excel_file", leadsFileField.files[0]);
                formData.append("client_id", clientId);
                formData.append("media_url", videoLink);
                formData.append("sheet_name", "Sheet1");
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                $.ajax({
                    url: `https://api.lenaai.net/webhook/send-video-using-spreadsheet-file`,
                    method: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        console.log(response)
                        loadingIcon.attr("class", "fa fa-check-circle success");
                        loadingText.html("Success!");
                    },
                    error: function (error) {
                        loadingIcon.attr("class", "fa fa-times-circle error");
                        loadingText.html("Failed. Please try again.");
                    },
                    complete: function () {
                        setTimeout(() => overlay.addClass("hidden"), 1500);
                        setTimeout(() => {
                            editPopup.classList.remove("delete-popup");
                            editOverlay.style.display = "none";
                            editPopup.innerHTML = '';
                        }, 1500);
                    }
                })
            } else {
                const requestLinkData = {
                    spreadsheet_url: spreadSheetLink,
                    media_url: videoLink,
                    sheet_name: "Sheet1",
                    client_id: clientId
                };
    
                console.log("Sending request", requestLinkData);
    
                $.ajax({
                    url: "https://api.lenaai.net/webhook/send-video-using-spreadsheet",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(requestLinkData),
                    success: function (response) {
                        console.log(response)
                        loadingIcon.attr("class", "fa fa-check-circle success");
                        loadingText.html("Success!");
                    },
                    error: function (err) {
                        loadingIcon.attr("class", "fa fa-times-circle error");
                        loadingText.html("Failed. Please try again.");
                    },
                    complete: function () {
                        setTimeout(() => overlay.addClass("hidden"), 1500);
                        setTimeout(() => {
                            editOverlay.style.display = "none";
                            editPopup.innerHTML = '';
                        }, 1500);
                    }
                });
            }
        });
    });

    const importButton = document.querySelector(".import-btn");
    importButton.addEventListener("click", function () {
        const editOverlay = document.querySelector(".edit-overlay");
        const editPopup = document.querySelector(".edit-popup");

        editPopup.classList.add("delete-popup");
        editOverlay.style.display = "flex";
        editPopup.innerHTML = `
        <div class="history-header">
            <h1>Import Units From File</h1>
            <i class="fa-solid close-btn fa-circle-xmark"></i>
        </div>
        <div class="edit-content">
            <div class="val-error" style="display: none;"></div>
            <ul class="edit-details">
                <li>
                    File Link
                    <input type="text" id="file-link" placeholder="File Link">
                </li>
            </ul>
            <div class="details-btns">
                <div class="save">Import</div>
            </div>
        </div>`;

        document.querySelector(".close-btn").addEventListener("click", function () {
            editPopup.classList.remove("delete-popup");
            editOverlay.style.display = "none";
            editPopup.innerHTML = '';
        });

        document.querySelector(".save").addEventListener("click", function () {
            const spreadSheetInput = document.querySelector(".edit-content #file-link");
            const spreadSheetLink = document.querySelector(".edit-content #file-link").value;
            const error = document.querySelector(".edit-content .val-error");
            const spreadsheetRegex = /^(https?:\/\/)?(www\.)?docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+(\/(edit|view|copy)?(\?.*)?)?$|[^\s]+\.xls[x]?|[^\s]+\.csv$/;

            error.style.display = "none";
            error.innerHTML = ``;
            if (spreadSheetLink === "" || !spreadsheetRegex.test(spreadSheetLink)) {
                error.style.display = "block";
                error.innerHTML = `Invalid link! Please enter a valid Excel file (.xls, .xlsx, .csv) or a Google Sheets.`;
                spreadSheetInput.style.border = "2px solid red";
                return;
            } else {
                error.style.display = "none";
                error.innerHTML = ``;
                spreadSheetInput.style.border = "2px solid #cbb26a";

                const requestData = {
                    "client_id": clientId,
                    "spreadsheet_url": spreadSheetLink,
                    "sheet_range": "Sheet1"
                }

                console.log(requestData);

                $.ajax({
                    url: "https://api.lenaai.net/import-from-spreadsheet",
                    method: "POST",
                    contentType: "applicaiton/json",
                    data: JSON.stringify(requestData),
                    success: function (response) {
                        console.log("request success", response);
                        editPopup.classList.remove("delete-popup");
                        editOverlay.style.display = "none";
                        editPopup.innerHTML = '';
                    },
                    error: function (error) {
                        console.log("request failed", error);
                        error.style.display = "none";
                        error.innerHTML = ``;
                    }
                })
            }
        });
    });

    const themeToggle = document.getElementById("theme-toggle");
    const themeStylesheet = document.getElementById("theme-stylesheet");
    const themeIcon = themeToggle.querySelector("i");

    const lightThemePath = "css/dashboard-light.css";
    const darkThemePath = "css/dashboard-dark.css";

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
        const isDark = themeStylesheet.href.includes("dashboard-light.css");
        themeStylesheet.href = isDark ? darkThemePath : lightThemePath;
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateButton(isDark ? "dark" : "light");
    });
});