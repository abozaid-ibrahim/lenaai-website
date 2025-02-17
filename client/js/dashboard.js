document.addEventListener("DOMContentLoaded", function () {
    // Authorization
    const token = localStorage.getItem("lenaai_access_token");
    if (!token) {
        window.location.href = "./login.html";
    } else {
        $.ajax({
            url: "https://api.lenaai.net/users/me",
            method: "GET",
            headers: {"Authorization": "Bearer " + token},
            success: function (response) {
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

    // Data section
    $(".data-title").click(function () {
        $(this).next(".data-content").slideToggle();
        $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
    });

    $(".units-list li .unit-header").click(function () {
        $(this).next(".unit-details").slideToggle();
        $(this).find("i").toggleClass("fa-chevron-right fa-chevron-down");
    });

    const units = document.querySelectorAll(".unit");
    const devs = document.querySelectorAll(".data-titles li");

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
                        if (unit.getAttribute("data-dev") === dev.textContent.trim()) {
                            unit.style.display = "block";
                        } else {
                            unit.style.display = "none";
                        }
                    });
                }
            });
        });
    }
});