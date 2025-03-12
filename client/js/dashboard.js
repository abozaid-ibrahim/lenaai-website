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
                            "Twin House",
                            "Town House",
                            "Roof",
                            "Penthouse",
                            "Studio",
                            "Duplex",
                            "Loft",
                            "Bungalow"
                        ];
                        const views = [
                            "Lagoon",
                            "Sea view",
                            "Garden",
                            "Street",
                            "Open",
                            "Park",
                            "Other"
                        ];

                        function renderUnits(allUnts) {
                            let compoundsNamesList = [];
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
                                                <p><strong>Unit ID</strong>: ${unit.unitId}</p>
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
                                        devs.forEach((d) => d.classList.remove("dev-active"));
                                        dev.classList.add("dev-active");
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
                                                        error: function(error) {
                                                            loadingIcon.attr("class", "fa fa-times-circle error");
                                                            loadingText.html("Failed. Please try again.");
                                                        },
                                                        complete: function() {
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
                            const addButton = document.querySelector(".add-btn");
                            addButton.addEventListener("click", function () {
                                const editOverlay = document.querySelector(".edit-overlay");
                                const editPopup = document.querySelector(".edit-popup");
                                const propertyDetails = document.createElement("div");
                                propertyDetails.innerHTML = `
                                    <p><strong>Unit ID</strong>:</p>
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

                                        if (key === "Unit ID") {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        } else if (key === "Data Source") {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        } else if (key === "Compound") {
                                            detail.classList.add("compound");
                                            detail.innerHTML = `
                                            ${key}
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
                                        } else if (key === "Payment Plans"){
                                            detail.innerHTML = `${key}<input type="text" id="formattedInput" placeholder="0: 5000000, 5: 10000000" autocomplete="off">`;
                                        } else {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        }

                                        editDetails.appendChild(detail);
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

                                    editDetails.addEventListener("input", function(event) {
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
                                
                                        // Close other dropdowns before opening this one
                                        $(".dropdown").not(dropdown).slideUp();
                                
                                        dropdown.stop(true, true).slideToggle();
                                        $(this).find("i").toggleClass("rotate-icon");
                                    });
                                
                                    $(".edit-content").on("click", ".edit-drop li", function (event) {
                                        event.stopPropagation();
                                
                                        let selectedText = $(this).text();
                                        let parentElement = $(this).closest(".building, .compound, .views");
                                        let valueElement = parentElement.find(".value");
                                
                                        valueElement.text(selectedText);
                                        $(this).closest(".dropdown").slideUp();
                                        parentElement.find("i").toggleClass("rotate-icon");
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

                                                if (value.includes("EGP")) {
                                                    value = parseInt(value.replace(/\s*EGP\s*/g, "").replace(/,/g, ""), 10);
                                                } else if (numberFields.includes(key)) {
                                                    return isNaN(value) || value === "N/A" ? 0 : Number(value);
                                                }
                                                return value;
                                            }

                                            function formatNumber(value) {
                                                if (/^\d{1,3}(,\d{3})*$/.test(value)) {
                                                    return value;
                                                }

                                                return Number(value).toLocaleString();
                                            }

                                            if (toCamelCase(key) === "unitId") {
                                                unitId = input;
                                                unitObject.unitId = input;
                                            } else if (li.classList.contains("compound")) {
                                                unitObject.compound = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("building")) {
                                                unitObject.buildingType = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("views")) {
                                                unitObject.view = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("delivery-date")) {
                                                unitObject.deliveryDate = li.querySelector(".value").textContent;
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
                                                        error: function(error) {
                                                            loadingIcon.attr("class", "fa fa-times-circle error");
                                                            loadingText.html("Failed. Please try again.");
                                                        },
                                                        complete: function() {
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

                                            if (key === "Unit ID") {
                                                originalUnitId = value;
                                                detail.innerHTML = `${key}<input type="text" value="${value}" disabled>`;
                                            } else if (key === "Data Source") {
                                                detail.innerHTML = `${key}<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                                            } else if (key === "Compound") {
                                                detail.classList.add("compound");
                                                detail.innerHTML = `
                                                ${key}
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
                                            } else if (key === "Payment Plans"){
                                                detail.innerHTML = `${key}<input type="text" value="${value}" id="formattedInput" autocomplete="off">`;
                                            } else {
                                                detail.innerHTML = `${key}<input type="text" value="${value}">`;
                                            }

                                            editDetails.appendChild(detail);
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

                                        editDetails.addEventListener("input", function(event) {
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
                                    
                                            // Close other dropdowns before opening this one
                                            $(".dropdown").not(dropdown).slideUp();
                                    
                                            dropdown.stop(true, true).slideToggle();
                                            $(this).find("i").toggleClass("rotate-icon");
                                        });
                                    
                                        $(".edit-content").on("click", ".edit-drop li", function (event) {
                                            event.stopPropagation();
                                    
                                            let selectedText = $(this).text();
                                            let parentElement = $(this).closest(".building, .compound, .views");
                                            let valueElement = parentElement.find(".value");
                                    
                                            valueElement.text(selectedText);
                                            $(this).closest(".dropdown").slideUp();
                                            parentElement.find("i").toggleClass("rotate-icon");
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

                                                if (value.includes("EGP")) {
                                                    value = parseInt(value.replace(/\s*EGP\s*/g, "").replace(/,/g, ""), 10);
                                                } else if (numberFields.includes(key)) {
                                                    return isNaN(value) || value === "N/A" ? 0 : Number(value);
                                                }
                                                return value;
                                            }

                                            function formatNumber(value) {
                                                if (/^\d{1,3}(,\d{3})*$/.test(value)) {
                                                    return value;
                                                }

                                                return Number(value).toLocaleString();
                                            }

                                            if (toCamelCase(key) === "unitId") {
                                                unitId = input;
                                                unitObject.unitId = input;
                                                unitObject.images = allUnitsImages[originalUnitId]
                                            } else if (toCamelCase(key).includes("dataSource")) {
                                                unitObject.dataSource = dataSrc;
                                            } else if (li.classList.contains("compound")) {
                                                unitObject.compound = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("building")) {
                                                unitObject.buildingType = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("views")) {
                                                unitObject.view = li.querySelector(".value").textContent;
                                            } else if (li.classList.contains("delivery-date")) {
                                                unitObject.deliveryDate = li.querySelector(".value").textContent;
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
                                                        error: function(error) {
                                                            loadingIcon.attr("class", "fa fa-times-circle error");
                                                            loadingText.html("Failed. Please try again.");
                                                        },
                                                        complete: function() {
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
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
                                    <div class="skeleton-box name"></div>
                                    <div class="skeleton-box date"></div>
                                    <div class="skeleton-box requirements"></div>
                                    <div class="skeleton-box messages"></div>
                                    <div class="skeleton-box action"></div>
                                </div>
                                <div class="skeleton client">
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
                                                <div class="user-image">
                                                    <img src="../assets/user-default.png">
                                                    <div class="probability">
                                                        <h3>Purchase Probability</h3>
                                                        <canvas id="probabilityChart"></canvas>
                                                    </div>
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
                                            
                                            const purchaseProbability = allLeadScores[userNumber] || 0; // Example: 75%
    
                                            // Get the canvas element
                                            const ctx = document.getElementById('probabilityChart').getContext('2d');
    
                                            // Create the Doughnut Chart
                                            new Chart(ctx, {
                                                type: 'doughnut',
                                                data: {
                                                    labels: ['Probability', 'Remaining'],
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
                                                        legend: {
                                                            display: false
                                                        },
                                                        tooltip: {
                                                            enabled: true
                                                        }
                                                    }
                                                }
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

    // Header section
    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });

    // Charts
    const ctxRequirements = document.getElementById('reqChart').getContext('2d');

    new Chart(ctxRequirements, {
        type: 'bar',
        data: {
            labels: ['Category 1', 'Category 2', 'Category 3'],
            datasets: [
                {
                    label: 'Group A',
                    data: [70, 50, 90],
                    backgroundColor: '#cbb26a'
                },
                {
                    label: 'Group B',
                    data: [50, 60, 80],
                    backgroundColor: '#1E3A8A'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    const ctxActions = document.getElementById('actChart').getContext('2d');

    new Chart(ctxActions, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Dataset 1',
                data: [70, 50, 90, 60, 80],
                borderColor: '#1E3A8A',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#1E3A8A'
            }]
        },
        options: {
            responsive: false,  // Disable auto-resizing
            maintainAspectRatio: false,  // Allow manual sizing
        }
    });

    const whatsMessageButton = document.querySelector(".whats-msg");
    whatsMessageButton.addEventListener("click", function () {
        const editOverlay = document.querySelector(".edit-overlay");
        const editPopup = document.querySelector(".edit-popup");

        editPopup.classList.add("delete-popup");
        editOverlay.style.display = "flex";
        editPopup.innerHTML = `
        <div class="history-header">
            <h1>Send Cold Whats messages Patch</h1>
            <i class="fa-solid close-btn fa-circle-xmark"></i>
        </div>
        <div class="edit-content">
            <ul class="edit-details">
                <li>
                    Spread Sheet
                    <input type="text" id="spread-sheet" placeholder="Spread Sheet Link">
                </li>
                <li>
                    Video Link
                    <input type="text" id="video-link" placeholder="Video Link">
                </il>
            </ul>
            <div class="details-btns">
                <div class="save">Send</div>
            </div>
        </div>`;

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
            const spreadSheetLink = document.querySelector(".edit-content #spread-sheet").value;
            const videoLink = document.querySelector(".edit-content #video-link").value;
            const requestData = {
                "spreadsheet_url": spreadSheetLink,
                "video_url": videoLink,
                "sheet_name": "Sheet1",
                "client_id": clientId
            }

            $.ajax({
                url: `https://api.lenaai.net/webhook/send-video-using-spreadsheet`,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function (response) {
                    console.log("Request success", response);
                    editOverlay.style.display = "none";
                    editPopup.innerHTML = '';
                },
                error: function (error) {
                    console.log("Request failed", error);
                }
            });
        });
    })

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
                error.innerHTML = `Invalid link! Please enter a valid Excel file (.xls, .xlsx, .csv) or a Google Sheets link.`;
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