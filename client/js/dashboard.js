document.addEventListener("DOMContentLoaded", function () {
    let clientId;

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
            
                $("#sign-in, .sign-in-sm button").on("click", function(event) {
                    event.preventDefault();
                    logoutUser();
                });

                $.ajax({
                    url: `https://api.lenaai.net/units/Dream_House`,
                    method: "GET",
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
                        Object.keys(groupedByCompound).forEach((compoundName) => {
                            const dataContainer = document.createElement("div");
                            const dataTitle = document.createElement("div");
                            const dataContent = document.createElement("div");
                            const unitsList = document.createElement("ul");

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
                                unitElement.innerHTML = `
                                <div class="unit-header">
                                    <span class="unit-name">Unit ${unit.unitId}</span>
                                    <div class="unit-btns">
                                        <div class="edit-btn"><i class="fa-solid fa-pen-to-square"></i>Edit</div>
                                        <div class="remove-btn"><i class="fa-solid fa-trash"></i>Delete</div>
                                    </div>
                                </div>
                                <div class="unit-details">
                                    <div class="slider">
                                        <div class="slider-wrapper">
                                            <div class="slide">
                                                <img src="../assets/Image 85.png" alt="Chat Image">
                                            </div>
                                            <div class="slide">
                                                <img src="../assets/Image 85.png" alt="Chat Image">
                                            </div>
                                        </div>
                        
                                        <div class="property-details">
                                            <p><strong>Unit ID</strong>: ${unit.unitId || "N/A"}</p>
                                            <p><strong>Compound</strong>: ${unit.compound || "N/A"}</p>
                                            <p><strong>Building Type</strong>: ${unit.buildingType || "N/A"}</p>
                                            <p><strong>Type</strong>: ${unit.typeName || "N/A"}</p>
                                            <p><strong>City</strong>: ${unit.city || "N/A"}</p>
                                            <p><strong>Developer</strong>: <span class="dev">${unit.developer || "N/A"}</span></p>
                                            <p><strong>Paid</strong>: ${unit.paid || "N/A"}</p>
                                            <p><strong>Offer</strong>: ${unit.offer || "N/A"} EGP</p>
                                            <p><strong>Status</strong>: ${unit.status || "N/A"}</p>
                                            <p><strong>Zone</strong>: ${unit.zone || "N/A"}</p>
                                            <p><strong>Phase</strong>: ${unit.phase || "N/A"}</p>
                                            <p><strong>Delivery Date</strong>: ${unit.deliveryDate || "N/A"}</p>
                                            <p><strong>Floor</strong>: ${unit.floor || "N/A"}</p>
                                            <p><strong>Rooms</strong>: ${unit.roomsCount || "N/A"}</p>
                                            <p><strong>Land Area</strong>: ${unit.landAreaSqMeters || "N/A"}m²</p>
                                            <p><strong>Selling Area</strong>: ${unit.sellingAreaSqMeters || "N/A"}m²</p>
                                            <p><strong>Garden Size</strong>: ${unit.gardenSize || "N/A"}m²</p>
                                            <p><strong>Finishing</strong>: ${unit.finishing || "N/A"}</p>
                                            <p><strong>Payment Plan</strong>: ${unit.paymentPlan.price || "N/A"} in 
                                                ${unit.paymentPlan.years || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div id="prev"><i class="fa-solid iconCall fa-chevron-left"></i></div>
                                    <div id="next"><i class="fa-solid iconCall fa-chevron-right"></i></div>
                                </div>`;

                                unitsList.appendChild(unitElement);
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
                                    prev.css("display", "none")
                                } else {
                                    prev.css("display", "block")
                                }

                                if (slideIndex === slides.length - 1) {
                                    next.css("display", "none")
                                } else {
                                    next.css("display", "block")
                                }

                                sliderWrapper.css("transform",`translateX(-${slideIndex * 100}%)`);
                            }

                            prev.click(function () {
                                plusSlides(-1);
                            });

                            next.click(function () {
                                plusSlides(1);
                            });
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

                        // Unit Edit
                        const editButtons = document.querySelectorAll(".edit-btn");
                        editButtons.forEach((editButton) => {
                            editButton.addEventListener("click", function (event) {
                                event.stopPropagation();

                                const editOverlay = document.querySelector(".edit-overlay");
                                const editPopup = document.querySelector(".edit-popup");
                                const unit = this.closest(".unit");
                                const unitName = unit.querySelector(".unit-header span").textContent;

                                editOverlay.style.display = "flex";
                                editPopup.innerHTML = `
                                <div class="history-header">
                                    <h1>Edit ${unitName}</h1>
                                    <i class="fa-solid close-btn fa-circle-xmark"></i>
                                </div>
                                <div class="edit-content">
                                    <ul class="edit-details">
                                        <li>Type :<input type="text" placeholder="Apartment"></li>
                                        <li>Compound :<input type="text" placeholder="Apartment"></li>
                                        <li>City :<input type="text" placeholder="Apartment"></li>
                                        <li>Developer :<input type="text" placeholder="Apartment"></li>
                                        <li>Floor :<input type="number" placeholder="Apartment"></li>
                                        <li>Rooms :<input type="number" placeholder="Apartment"></li>
                                    </ul>
                                    <div class="details-btns">
                                        <div class="cancel">Cancel</div>
                                        <div class="save">Save</div>
                                    </div>
                                </div>`;

                                document.querySelector(".close-btn").addEventListener("click", function () {
                                    editOverlay.style.display = "none";
                                    editPopup.innerHTML = '';
                                });

                                document.querySelector(".cancel").addEventListener("click", function () {
                                    editOverlay.style.display = "none";
                                    editPopup.innerHTML = '';
                                });
                            });
                        });
                    },
                    error: function(xhr) {
                        console.error(xhr.responseText);
                    }
                })
            },
            error: function(xhr) {
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

    // Populate chat list
    $.ajax({
        url: "https://api.lenaai.net/chat-history/dreamhomes",
        method: "GET",
        dataType: "json",
        success: function (response) {
            const container = $(".clients-list");
    
            response.conversations.forEach((conversation) => {
                const phoneNumber = Object.keys(conversation)[0];
                const messages = conversation[phoneNumber];

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
                            Action Needed
                            <i class="bi bi-chevron-down"></i>
                            <ul class="dropdown">
                                <li>Call</li>
                                <li>Arrange view</li>
                            </ul>
                        </li>
                        <li class="call-now">Call Now</li>
                    </ul>
                `);
            });
            
            const clients = Array.from(document.querySelectorAll(".client"));

            // Recent first filter
            let descending = false;
            const recentButton = document.querySelector(".recent");
            recentButton.addEventListener("click", function() {
            
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

            // Search bar
            const search = document.getElementById("search-bar");
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
                    const clientName = event.target.parentElement.querySelector(".client-name").textContent;
                    const reqOverlay = document.querySelector(".req-overlay");
                    const reqProfile = document.querySelector(".req-profile");

                    reqOverlay.style.display = "flex";
                    reqProfile.innerHTML = `
                    <div class="history-header">
                        <h1>${clientName}'s requirements</h1>
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
                                <li>
                                    <div class="req-title">Location</div>
                                    <div class="req-value">Cairo</div>
                                </li>
                                <li>
                                    <div class="req-title">Rooms</div>
                                    <div class="req-value">2</div>
                                </li>
                                <li>
                                    <div class="req-title">Floors</div>
                                    <div class="req-value">0</div>
                                </li>
                                <li>
                                    <div class="req-title">Type</div>
                                    <div class="req-value">Villa</div>
                                </li>
                                <li>
                                    <div class="req-title">Budget</div>
                                    <div class="req-value">15 Million EGP</div>
                                </li>
                                <li>
                                    <div class="req-title">Finished</div>
                                    <div class="req-value">2029</div>
                                </li>
                            </ul>
                        </div>
                    </div>`;

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

            // Dropdowns
            $(document).ready(function() {
                $(".need-action").click(function(event) {
                    event.stopPropagation();
            
                    let dropdown = $(this).find(".dropdown");
            
                    $(".dropdown").not(dropdown).slideUp();
            
                    dropdown.stop(true, true).slideToggle();
                });
            
                $(document).click(function() {
                    $(".dropdown").slideUp();
                });
            });

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
                    </div>`;

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
});