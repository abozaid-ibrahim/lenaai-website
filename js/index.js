document.addEventListener("DOMContentLoaded", function () {
    // countdown section
    function updateCountdown() {
        const now = new Date().getTime();
        const endDate = new Date("2025-03-01T00:00:00"); // Set countdown to February 1, 2025
        const distance = endDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);

    // Handle user input for Chat-Bot
    const chatSubmit = document.getElementById("submit-btn");
    const inputForm = document.getElementById("input-form");
    let fileAttached = false;


    function takeUserInput() {
        let inputField = document.getElementById("user-input");
        let userInput = inputField.value.trim();
        const messagesDiv = document.getElementById("messages");
        let message = document.createElement("div");


        if (userInput === "") return;
        if (fileAttached) {
            userInput = `<i class="fa-solid fa-file"></i> ${userInput}`;
            fileAttached = false;
        }
        message.innerHTML = userInput;
        message.classList.add("message", "sent");
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

    // upload a file
    const attachButton = document.getElementById("attach-btn");
    const fileField = document.getElementById("file-field");

    attachButton.addEventListener("click", function () {
        fileField.click();
    });

    fileField.addEventListener("change", function () {
        let fileName = fileField.files[0]?.name;

        if (fileName) {
            let inputField = document.getElementById("user-input");
            inputField.value = fileName;
            fileAttached = true;
            fileField.value = "";
        }

    });

    const callBtn = document.getElementById("call-btn");
    const phoneField = document.querySelector(".phone-field");

    callBtn.addEventListener("click", function () {
        phoneField.classList.toggle("active");
        callBtn.classList.toggle("call-active");
    });

    const closeBtn = document.querySelector(".fa-circle-xmark");

    closeBtn.addEventListener("click", function () {
        phoneField.classList.remove("active");
        callBtn.classList.remove("call-active");
    });

})