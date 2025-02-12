document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".clients-list");
    const clients = Array.from(container.children);

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

    // Recent first filter
    let descending = false;
    const recentButton = document.querySelector(".recent");
    recentButton.addEventListener("click", function() {
    
        clients.sort((a, b) => {
            const dateA = new Date(a.getAttribute("data-date"));
            const dateB = new Date(b.getAttribute("data-date"));
            return descending ? dateA - dateB : dateB - dateA;
        });
    
        container.innerHTML = "";
        clients.forEach(client => container.appendChild(client));

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

    // Dropdowns
    $(document).ready(function() {
        $(".requirements").click(function(event) {
            event.stopPropagation();
    
            let dropdown = $(this).find(".dropdown");
    
            $(".dropdown").not(dropdown).slideUp();
    
            dropdown.stop(true, true).slideToggle();
        });
    
        $(document).click(function() {
            $(".dropdown").slideUp();
        });
    });

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
});