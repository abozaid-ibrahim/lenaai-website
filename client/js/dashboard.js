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

                $.ajax({
                    url: `https://api.lenaai.net/units/${clientId}`,
                    method: "GET",
                    headers: {
                        "clientId": clientId,
                    },
                    dataType: "json",
                    success: function (response) {
                        const groupedByCompound = response.reduce((group, item) => {
                            const { compound } = item;
                            if (!group[compound]) {
                                group[compound] = [];
                            }
                            group[compound].push(item);
                            return group;
                        }, {});

                        const dataSection = document.querySelector(".data");
                        let allUnitsImages = {};
                        let unitImages;
                        let compoundsNamesList = [];
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
                            dataTitle.innerHTML = `${compoundName || "N/A"}<i class="fa-solid fa-chevron-up"></i>`;

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
                                            <p><strong>Unit ID</strong>: ${unit.unitId || "N/A"}</p>
                                            <p><strong>Compound</strong>: ${unit.compound || "N/A"}</p>
                                            <p><strong>Building Type</strong>: ${unit.buildingType || "N/A"}</p>
                                            <p><strong>Country</strong>: ${unit.country || "N/A"}</p>
                                            <p><strong>City</strong>: ${unit.city || "N/A"}</p>
                                            <p><strong>Developer</strong>: <span class="dev">${unit.developer || "N/A"}</span></p>
                                            <p><strong>Paid</strong>: ${unit.paid || "N/A"}</p>
                                            <p><strong>Offer</strong>: ${unit.offer.toLocaleString() || "N/A"} EGP</p>
                                            <p><strong>Status</strong>: ${unit.status || "N/A"}</p>
                                            <p><strong>Zone</strong>: ${unit.zone || "N/A"}</p>
                                            <p><strong>Phase</strong>: ${unit.phase || "N/A"}</p>
                                            <p><strong>Delivery Date</strong>: ${unit.deliveryDate || "N/A"}</p>
                                            <p><strong>Floor</strong>: ${unit.floor || "N/A"}</p>
                                            <p><strong>Rooms Count</strong>: ${unit.roomsCount || "N/A"}</p>
                                            <p><strong>Bathroom Count</strong>: ${unit.bathroomCount || "N/A"}</p>
                                            <p><strong>Land Area</strong>: ${unit.landArea || "N/A"}</p>
                                            <p><strong>Selling Area</strong>: ${unit.sellingArea || "N/A"}</p>
                                            <p><strong>Garden Size</strong>: ${unit.gardenSize || "N/A"}</p>
                                            <p><strong>Finishing</strong>: ${unit.finishing || "N/A"}</p>
                                            <p><strong>Payment Plan Price</strong>: ${unit.paymentPlan.price || "N/A"}</p>
                                            <p><strong>Payment Plan Years</strong>: ${unit.paymentPlan.years || "N/A"}</p>
                                            <p><strong>Payment Plan Maintanance</strong>: ${unit.paymentPlan.maintanance || "N/A"}</p>
                                            <p style="display: none;"><strong>Data Source</strong>: ${unit.dataSource || "N/A"}</p>
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
                            $(this).find("i").toggleClass("fa-chevron-right fa-chevron-down");

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
                                        <div class="save">Yes</div>
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

                                document.querySelector(".save").addEventListener("click", function () {
                                    editPopup.classList.remove("delete-popup");
                                    $.ajax({
                                        url: "https://api.lenaai.net/delete-unit",
                                        method: "DELETE",
                                        headers: {
                                            "unitId": `${unitId}`
                                        },
                                        success: function (response) {
                                            window.location.reload();
                                        },
                                        error: function (error) {
                                            console.error(`Error in deleting the unit with id: ${unitId}`, error);
                                        }
                                    })
                                })
                            })
                        })

                            // Add Unit
                            const addButton = document.querySelector(".add-btn");
                            addButton.addEventListener("click", function () {
                                const editOverlay = document.querySelector(".edit-overlay");
                                const editPopup = document.querySelector(".edit-popup");
                                const unit = document.querySelectorAll(".unit")[0];
                                const propertyDetails = unit.querySelector(".property-details");

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
                                        <div class="cancel">Cancel</div>
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
                                                <div class="value">${compoundsNamesList[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            compoundsNamesList.forEach((name) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${name || "N/A"}</li>`
                                            });
                                        } else if (key === "Building Type") {
                                            detail.classList.add("building")
                                            detail.innerHTML = `
                                            ${key}
                                            <div class="edit-drop">
                                                <div class="value">${buildingTypes[0]}</div><i class="fa-solid fa-chevron-down"></i>
                                                <ul class="dropdown">
                                                </ul>
                                            </div>`;
                                            editDetails.appendChild(detail);
                                            buildingTypes.forEach((type) => {
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type || "N/A"}</li>`
                                            });
                                        } else {
                                            detail.innerHTML = `${key}<input type="text">`;
                                        }

                                        editDetails.appendChild(detail);
                                    });

                                    $(document).ready(function() {
                                        $(".edit-drop").click(function(event) {
                                            event.stopPropagation();
                                    
                                            let dropdown = $(this).find(".dropdown");
                                    
                                            $(".dropdown").not(dropdown).slideUp();
                                    
                                            dropdown.stop(true, true).slideToggle();
                                            $(this).find("i").toggleClass("rotate-icon");
                                        });
                                    
                                        $(document).click(function() {
                                            $(".dropdown").slideUp();
                                        });
                                    });

                                    $(document).ready(function() {
                                        $(".edit-drop li").click(function(event) {
                                            event.stopPropagation();
                                    
                                            let selectedText = $(this).text();
                                            let parentElement = $(this).closest(".building, .compound");
                                            let valueElement = parentElement.find(".value");
                                            valueElement.text(selectedText);
                                            $(this).closest(".dropdown").slideUp();
                                            parentElement.find("i").toggleClass("rotate-icon");
                                        });
                                    });

                                    $(document).click(function() {
                                        $(".dropdown").slideUp();
                                    });

                                    document.querySelector(".edit-details").innerHTML += `
                                    <div class="current-images">
                                        <h2>Current Images</h2>
                                        <div class="images">
                                            <div class="chat-image">
                                                <img src="../assets/Image 85.png" alt="Chat Image" draggable="false">
                                                <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                            </div>
                                            <div class="chat-image">
                                                <img src="../assets/Image_135.png" alt="Chat Image" draggable="false">
                                                <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                            </div>
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
                                    const deleteButtons = document.querySelectorAll(".del");

                                    deleteButtons.forEach((button) => {
                                        button.addEventListener("click", function () {
                                            this.closest(".chat-image").remove();
                                        });
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
                                        fileField.value = "";
                                        document.querySelector(".photo-preview").innerHTML = "";
                                        document.querySelector(".photo-preview").style.display = "none";
                                        uploadButton.style.display = "none";
                                        attachButton.style.display = "block";
                                    })

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

                                    document.querySelector(".cancel").addEventListener("click", function () {
                                        editOverlay.style.display = "none";
                                        editPopup.innerHTML = '';
                                    });

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
                                        "paid": "",
                                        "offer": 0,
                                        "unitId": "",
                                        "status": "",
                                        "zone": "",
                                        "phase": "",
                                        "deliveryDate": "",
                                        "bathroomCount": 0,
                                        "buildingType": "",
                                        "floor": 0,
                                        "roomsCount": 0,
                                        "landArea": 0,
                                        "sellingArea": 0,
                                        "gardenSize": 0,
                                        "finishing": "",
                                        "dataSource": "",
                                        "paymentPlan": {
                                            "years": 0,
                                            "price": 0,
                                            "maintanance": 0
                                        },
                                        "images": [
                                            {
                                                "fileType": "image",
                                                "height": 2200,
                                                "thumbnailUrl": "https://ik.imagekit.io/lenaai/tr:n-ik_ml_thumbnail/35b219a5-32b7-451a-a019-bbe3bed4bb5c_WfuFCcKP_",
                                                "size": 217466,
                                                "fileId": "67b74eca432c47641657deb7",
                                                "url": "https://ik.imagekit.io/lenaai/35b219a5-32b7-451a-a019-bbe3bed4bb5c_WfuFCcKP_",
                                                "width": 1700,
                                                "versionInfo": {
                                                    "id": "67b74eca432c47641657deb7",
                                                    "name": "Version 1"
                                                },
                                                "AITags": null,
                                                "filePath": "/35b219a5-32b7-451a-a019-bbe3bed4bb5c_WfuFCcKP_",
                                                "name": "35b219a5-32b7-451a-a019-bbe3bed4bb5c_WfuFCcKP_"
                                            },
                                            {
                                                "fileType": "image",
                                                "height": 2200,
                                                "thumbnailUrl": "https://ik.imagekit.io/lenaai/tr:n-ik_ml_thumbnail/8cb327b4-546b-4381-8ac4-c3f459d31197_T6vsOZ-ES",
                                                "size": 2295603,
                                                "fileId": "67b74ecc432c47641657e4de",
                                                "url": "https://ik.imagekit.io/lenaai/8cb327b4-546b-4381-8ac4-c3f459d31197_T6vsOZ-ES",
                                                "width": 1700,
                                                "versionInfo": {
                                                    "id": "67b74ecc432c47641657e4de",
                                                    "name": "Version 1"
                                                },
                                                "AITags": null,
                                                "filePath": "/8cb327b4-546b-4381-8ac4-c3f459d31197_T6vsOZ-ES",
                                                "name": "8cb327b4-546b-4381-8ac4-c3f459d31197_T6vsOZ-ES"
                                            },
                                            {
                                                "fileType": "image",
                                                "height": 2200,
                                                "thumbnailUrl": "https://ik.imagekit.io/lenaai/tr:n-ik_ml_thumbnail/8523b5bc-b114-4a7e-a6a7-d580987b6885_y-37Sa4E-",
                                                "size": 1971166,
                                                "fileId": "67b74ecf432c47641657f70b",
                                                "url": "https://ik.imagekit.io/lenaai/8523b5bc-b114-4a7e-a6a7-d580987b6885_y-37Sa4E-",
                                                "width": 1700,
                                                "versionInfo": {
                                                    "id": "67b74ecf432c47641657f70b",
                                                    "name": "Version 1"
                                                },
                                                "AITags": null,
                                                "filePath": "/8523b5bc-b114-4a7e-a6a7-d580987b6885_y-37Sa4E-",
                                                "name": "8523b5bc-b114-4a7e-a6a7-d580987b6885_y-37Sa4E-"
                                            },
                                            {
                                                "fileType": "image",
                                                "height": 2200,
                                                "thumbnailUrl": "https://ik.imagekit.io/lenaai/tr:n-ik_ml_thumbnail/7919df6b-8714-4e5d-ba05-fef3a5ece5b9_XDgSS08fO",
                                                "size": 516563,
                                                "fileId": "67b74ed1432c47641657fc6b",
                                                "url": "https://ik.imagekit.io/lenaai/7919df6b-8714-4e5d-ba05-fef3a5ece5b9_XDgSS08fO",
                                                "width": 1700,
                                                "versionInfo": {
                                                    "id": "67b74ed1432c47641657fc6b",
                                                    "name": "Version 1"
                                                },
                                                "AITags": null,
                                                "filePath": "/7919df6b-8714-4e5d-ba05-fef3a5ece5b9_XDgSS08fO",
                                                "name": "7919df6b-8714-4e5d-ba05-fef3a5ece5b9_XDgSS08fO"
                                            },
                                            {
                                                "fileType": "image",
                                                "height": 2200,
                                                "thumbnailUrl": "https://ik.imagekit.io/lenaai/tr:n-ik_ml_thumbnail/257cc40b-0e98-4252-8fe7-f79778a7208d_w3jGN1FGT",
                                                "size": 1311313,
                                                "fileId": "67b74ed3432c47641658019f",
                                                "url": "https://ik.imagekit.io/lenaai/257cc40b-0e98-4252-8fe7-f79778a7208d_w3jGN1FGT",
                                                "width": 1700,
                                                "versionInfo": {
                                                    "id": "67b74ed3432c47641658019f",
                                                    "name": "Version 1"
                                                },
                                                "AITags": null,
                                                "filePath": "/257cc40b-0e98-4252-8fe7-f79778a7208d_w3jGN1FGT",
                                                "name": "257cc40b-0e98-4252-8fe7-f79778a7208d_w3jGN1FGT"
                                            }
                                        ],
                                        "updatedAt": getFormattedDateTime()
                                    };
                                    let paymentPlan = {};
                                    let unitId;

                                    document.querySelectorAll(".edit-details li").forEach((li) => {
                                        const key = li.textContent.trim().split(":")[0].trim();
                                        const input = li.querySelector("input")?.value.trim() || "N/A";

                                        function enforceType(key, value) {
                                            const numberFields = [
                                                "offer",
                                                "floor",
                                                "roomsCount",
                                                "bathroomCount",
                                                "landArea",
                                                "sellingArea",
                                                "gardenSize",
                                                "price", "years", "maintenance"
                                            ];

                                            if (value.includes("EGP")) {
                                                value = parseInt(value.replace(/\s*EGP\s*/g, "").replace(/,/g, ""), 10);
                                            } else if (numberFields.includes(key)) {
                                                return isNaN(value) || value === "N/A" ? 0 : Number(value);
                                            }
                                            return value;
                                        }

                                        if (toCamelCase(key) === "unitId") {
                                            unitId = input;
                                            unitObject.unitId = input;
                                        } else if (li.classList.contains("compound")) {
                                            unitObject.compound = li.querySelector(".value").textContent;
                                        } else if (li.classList.contains("building")) {
                                            unitObject.buildingType = li.querySelector(".value").textContent;
                                        } else if (key.includes("Payment Plan")) {
                                            const formattedKey = toCamelCase(key.replace("Payment Plan", ""));
                                            paymentPlan[formattedKey] = enforceType(formattedKey, input);
                                        } else {
                                            const camelKey = toCamelCase(key);
                                            if (camelKey in unitObject) {
                                                unitObject[camelKey] = enforceType(camelKey, input);
                                            }
                                        }
                                    });

                                    unitObject["paymentPlan"] = paymentPlan;

                                    editOverlay.style.display = "none";
                                    editPopup.innerHTML = '';

                                    console.log("data collected from the edit window", unitObject)

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
                                            window.location.reload();
                                        }
                                    })
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
                                        <div class="cancel">Cancel</div>
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
                                                detail.querySelector(".dropdown").innerHTML += `<li>${name || "N/A"}</li>`
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
                                                detail.querySelector(".dropdown").innerHTML += `<li>${type || "N/A"}</li>`
                                            });
                                        } else {
                                            detail.innerHTML = `${key}<input type="text" value="${value}">`;
                                        }

                                        editDetails.appendChild(detail);
                                    });

                                    $(document).ready(function() {
                                        $(".edit-drop").click(function(event) {
                                            event.stopPropagation();
                                    
                                            let dropdown = $(this).find(".dropdown");
                                    
                                            $(".dropdown").not(dropdown).slideUp();
                                    
                                            dropdown.stop(true, true).slideToggle();
                                            $(this).find("i").toggleClass("rotate-icon");
                                        });
                                    
                                        $(document).click(function() {
                                            $(".dropdown").slideUp();
                                        });
                                    });
    
                                    $(document).ready(function() {
                                        $(".edit-drop li").click(function(event) {
                                            event.stopPropagation();
                                    
                                            let selectedText = $(this).text();
                                            let parentElement = $(this).closest(".building, .compound");
                                            let valueElement = parentElement.find(".value");
                                            valueElement.text(selectedText);
                                            $(this).closest(".dropdown").slideUp();
                                            parentElement.find("i").toggleClass("rotate-icon");
                                        });
                                    });

                                    $(document).click(function() {
                                        $(".dropdown").slideUp();
                                    });
                                }

                                document.querySelector(".edit-details").innerHTML += `
                                <div class="current-images">
                                    <h2>Current Images</h2>
                                    <div class="images">
                                        <div class="chat-image">
                                            <img src="../assets/Image 85.png" alt="Chat Image" draggable="false">
                                            <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                        </div>
                                        <div class="chat-image">
                                            <img src="../assets/Image_135.png" alt="Chat Image" draggable="false">
                                            <div class="del"><i class="fa-solid fa-trash"></i><span class="del-text">Delete<span></div>
                                        </div>
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
                                const deleteButtons = document.querySelectorAll(".del");

                                deleteButtons.forEach((button) => {
                                    button.addEventListener("click", function () {
                                        this.closest(".chat-image").remove();
                                    });
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
                                    fileField.value = "";
                                    document.querySelector(".photo-preview").innerHTML = "";
                                    document.querySelector(".photo-preview").style.display = "none";
                                    uploadButton.style.display = "none";
                                    attachButton.style.display = "block";
                                })

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

                                document.querySelector(".cancel").addEventListener("click", function () {
                                    editOverlay.style.display = "none";
                                    editPopup.innerHTML = '';
                                });

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
                                        "paid": "",
                                        "offer": 0,
                                        "unitId": "",
                                        "status": "",
                                        "zone": "",
                                        "phase": "",
                                        "deliveryDate": "",
                                        "bathroomCount": 0,
                                        "buildingType": "",
                                        "floor": 0,
                                        "roomsCount": 0,
                                        "landArea": 0,
                                        "sellingArea": 0,
                                        "gardenSize": 0,
                                        "finishing": "",
                                        "dataSource": "",
                                        "paymentPlan": {
                                            "years": 0,
                                            "price": 0,
                                            "maintanance": 0
                                        },
                                        "images": [],
                                        "updatedAt": getFormattedDateTime()
                                    };
                                    let paymentPlan = {};
                                    let unitId;

                                    document.querySelectorAll(".edit-details li").forEach((li) => {
                                        const key = li.textContent.trim().split(":")[0].trim();
                                        const input = li.querySelector("input")?.value.trim() || "N/A";
                                        const dataSrc = li.querySelector("a")?.getAttribute("href") || "N/A";

                                        function enforceType(key, value) {
                                            const numberFields = [
                                                "offer",
                                                "floor",
                                                "roomsCount",
                                                "bathroomCount",
                                                "landArea",
                                                "sellingArea",
                                                "gardenSize",
                                                "price", "years", "maintenance"
                                            ];

                                            if (value.includes("EGP")) {
                                                value = parseInt(value.replace(/\s*EGP\s*/g, "").replace(/,/g, ""), 10);
                                            } else if (numberFields.includes(key)) {
                                                return isNaN(value) || value === "N/A" ? 0 : Number(value);
                                            }
                                            return value;
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
                                        } else if (key.includes("Payment Plan")) {
                                            const formattedKey = toCamelCase(key.replace("Payment Plan", ""));
                                            paymentPlan[formattedKey] = enforceType(formattedKey, input);
                                        } else {
                                            const camelKey = toCamelCase(key);
                                            if (camelKey in unitObject) {
                                                unitObject[camelKey] = enforceType(camelKey, input);
                                            }
                                        }
                                    });

                                    unitObject["paymentPlan"] = paymentPlan;

                                    editOverlay.style.display = "none";
                                    editPopup.innerHTML = '';

                                    console.log("data collected from the edit window", unitObject)

                                    $.ajax({
                                        url: `https://api.lenaai.net/update-unit/${unitId}`,
                                        method: "POST",
                                        headers: {
                                            "clientId": clientId,
                                        },
                                        contentType: "application/json",
                                        data: JSON.stringify(unitObject),
                                        success: function (response) {
                                            console.log("API response", response);
                                            window.location.reload();
                                        }
                                    })
                                });
                            });
                        });

                        // Populate chat list
                        $.ajax({
                            url: `https://api.lenaai.net/conversations/${clientId}`,
                            method: "GET",
                            dataType: "json",
                            success: function (response) {
                                const container = $(".clients-list");
                                let allPhoneNumbers = [];
                                console.log(response)

                                response.forEach((conversation) => {
                                    const phoneNumber = conversation.phone_number;
                                    const messages = conversation.messages;

                                    allPhoneNumbers.push(phoneNumber);
                                    let latestDate = "N/A";
                                    if (messages.length > 0) {
                                        latestDate = messages
                                            .map(msg => new Date(msg.timestamp))
                                            .sort((a, b) => b - a)[0]
                                            .toISOString().split("T")[0];
                                    }

                                    container.append(`
                                        <ul class="client"
                                            data-date="${latestDate}"
                                            data-status="no-action"
                                            data-messages='${JSON.stringify(messages).replace(/'/g, "&apos;")}'
                                        >
                                            <li><i class="bi bi-check-circle"></i></li>
                                            <li class="client-name">${phoneNumber}</li>
                                            <li>${latestDate}</li>
                                            <li class="requirements">
                                                Requirements
                                                <ul class="dropdown">
                                                    <li>2 bedrooms</li>
                                                    <li>villa</li>
                                                    <li>Cairo</li>
                                                </ul>
                                            </li>
                                            <li class="need-action">
                                                <div class="messages-no">${(messages.length * 2).toString().padStart(2, "0")}</div>
                                            </li>
                                            <li class="call-now">Call Now</li>
                                        </ul>
                                    `);
                                });

                                allPhoneNumbers.forEach((userNumber) => {
                                    $.ajax({
                                        url: `https://api.lenaai.net/user-actions/${userNumber}/${clientId}`,
                                        method: "GET",
                                        contentType: "json",
                                        success: function(response) {
                                            console.log(`action call success for user ${userNumber}`);
                                            const callNow = document.querySelector(".call-now");
                                            const client = callNow.parentElement;
                                            client.setAttribute("data-status", "action-needed");
                                            const actionMark = client.querySelector(".bi");
                                            actionMark.classList.remove("bi-check-circle");
                                            actionMark.classList.add("bi-exclamation-diamond");
                                            if (response.action) {
                                                callNow.textContent = response.action;
                                            } else {
                                                callNow.style.visibility = "hidden";
                                            }
                                        },
                                        error: function(error) {
                                            console.log(`Failed to call user actions for user ${userNumber}`, error);
                                        }
                                    });
                                });

                                const clients = Array.from(document.querySelectorAll(".client"));

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
                                    clients.forEach(client => container[0].appendChild(client));

                                    descending = !descending;
                                    if (descending === true) {
                                        recentButton.classList.add("filter-active");
                                    } else {
                                        recentButton.classList.remove("filter-active");
                                    }
                                });

                                // Action filter
                                let actionFilterActive = false;
                                const actionButton = document.querySelector(".action");
                                actionButton.addEventListener("click", function () {
                                    if (!actionFilterActive) {
                                        clients.forEach((client) => {
                                            if (client.getAttribute("data-status") !== "action-needed") {
                                                client.style.display = "none";
                                            }
                                        });

                                        actionFilterActive = !actionFilterActive;
                                    } else {
                                        clients.forEach((client) => {
                                            client.style.display = "flex";
                                        });

                                        actionFilterActive = !actionFilterActive;
                                    }

                                    if (actionFilterActive === true) {
                                        actionButton.classList.add("filter-active");
                                    } else {
                                        actionButton.classList.remove("filter-active");
                                    }
                                });

                                // Switch button for active
                                const switchButton = document.getElementById("switch-status");
                                switchButton.addEventListener("change", function () {
                                    if (switchButton.checked) {
                                        clients.forEach((client) => {
                                            if (client.getAttribute("data-status") === "action-needed") {
                                                client.style.display = "none";
                                            }
                                        })
                                    } else {
                                        clients.forEach(client => {
                                            client.style.display = "flex";
                                        });
                                    }
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
                                            </div>
                                            <div class="user-info">
                                                <div class="probability">
                                                    <h3>Purchase Probability</h3>
                                                    <canvas id="probabilityChart"></canvas>
                                                </div>
                                                <ul class="req-list">
                                                </ul>
                                            </div>
                                        </div>`;

                                        $.ajax({
                                            url: `https://api.lenaai.net/user-filters/${userNumber}/${clientId}`,
                                            method: "GET",
                                            contentType: "json",
                                            success: function (response) {
                                                console.log(`filter call success for user ${userNumber}`)
                                                const requirementsList = document.querySelector(".req-list");
                                                Object.keys(response).forEach((requirement) => {
                                                    let listItem = document.createElement("li");
                                                    listItem.innerHTML = `
                                                    <div class="req-title">${requirement.replace("_", " ")}</div>
                                                    <div class="req-value">${response[requirement]}</div>`;
                                                    requirementsList.appendChild(listItem);
                                                })
                                            },
                                            error: function(error) {
                                                console.log(`Failed to call user filter for user ${userNumber}`, error);
                                            }
                                        })
                                        const purchaseProbability = 65; // Example: 75%

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
                                        const messages = client.getAttribute("data-messages");
                                        const parsedMessages = messages ? JSON.parse(messages) : [];
                                        parsedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                                        chatOverlay.style.display = "flex";
                                        chatHistory.innerHTML = `
                                        <div class="history-header">
                                            <h1>Messages History</h1>
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
                                        }
                                    
                                        chatSubmit.addEventListener("click", function () {
                                            takeUserInput();
                                        });
                                    
                                        inputForm.addEventListener("submit", function (event) {
                                            event.preventDefault();
                                            takeUserInput();
                                        });

                                        const messagesDiv = document.getElementById("messages");
                                        parsedMessages.forEach((message) => {
                                            let userMessage = document.createElement("div");
                                            let botResponse = document.createElement("div");

                                            userMessage.innerHTML = message.user_message
                                            botResponse.innerHTML = message.bot_response

                                            userMessage.classList.add("message", "sent");
                                            botResponse.classList.add("message");

                                            messagesDiv.appendChild(userMessage);
                                            messagesDiv.appendChild(botResponse);
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
                            }
                        });
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
                    backgroundColor: '#8b6f2c'
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
                borderColor: '#cbb26a',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#cbb26a'
            }]
        },
        options: {
            responsive: false,  // Disable auto-resizing
            maintainAspectRatio: false,  // Allow manual sizing
        }
    });
});