{/* 
The client needs to include this script at the bottom of body element
<script>
    window.ChatBotConfig = {
        themePrimaryColor: "#3498db", // provide color schemes
        themeSecondaryColor: "#2ecc71", // provide color scheme
        endpoint: "https://api.lenaai.net/chat" // data fetching endpoint
    };

    var script = document.createElement("script");
    script.src = "chatbot.js"; // Path to your chatbot script should be hosted : https://client-api.com/chatbot-endpoint
    script.async = true;
    document.head.appendChild(script);
</script>
*/}


function loadFontAwesome() {
    if (!document.querySelector("link[href*='font-awesome']")) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
        document.head.appendChild(link);
        console.log("Font Awesome Loaded");
    }
}

function loadJQuery(callback) {
    if (window.jQuery) {
        callback();
    } else {
        let script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.onload = function () {
            console.log("jQuery Loaded");
            callback();
        };
        document.head.appendChild(script);
    }
}

loadJQuery(function () {
    loadFontAwesome();
    if (window.ChatBotLoaded) return;
    window.ChatBotLoaded = true;

    if (!window.ChatBotConfig) {
        console.error("ChatBotConfig is missing. Please add it before loading chatbot.js");
    }
    const config = window.ChatBotConfig || {};
    const themePrimaryColor = config.themePrimaryColor || "#007bff";
    const themeSecondaryColor = config.themeSecondaryColor || "#ffffff";
    const endpoint = config.endpoint || "https://api.lenaai.net/chat";
    const phoneNumberRegex = /^\d{11,15}$/;

    const chatbotContainer = document.createElement("div");
    chatbotContainer.classList.add("chatbot");
    chatbotContainer.innerHTML = `
        <div id="messages">
            <div class="message">Welcome to Lena Ai! How can I help you today?</div>
        </div>
        <div class="chat-preview"></div>
        <div class="input-field">
            <form id="input-form">
                <textarea id="user-input" placeholder="Type Something Here" autocomplete="off"></textarea>
                <input type="file" id="file-field">
            </form>
            <i class="fa-solid fa-plus" id="attach-btn"></i>
            <i class="fa-solid fa-paper-plane" id="submit-btn"></i>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    const chatbotPopup = document.createElement("i");
    chatbotPopup.id = "chatbot-popup";
    chatbotPopup.classList.add("fa-solid", "fa-message");
    document.body.appendChild(chatbotPopup);

    const style = document.createElement("style");
    style.innerHTML = `
        .chatbot {
            width: 400px;
            background-color: ${themePrimaryColor};
            border: 3px solid ${themeSecondaryColor};
            border-radius: 16px;
            margin: 15px;
            margin-left: 0;
            padding: 10px;
            position: fixed;
            top: 19%;
            right: 0%;
            height: fit-content;
            max-height: 73vh;
            overflow-y: auto;
            visibility: hidden;
            z-index: 2;
        }

        textarea {
            resize: none;
        }

        #messages {
            border: 1px solid #616060;
            border-radius: 16px;
            height: 55vh;
            padding: 20px;
            overflow-y: auto;
            scrollbar-width: none;
        }

        .input-field {
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid ${themeSecondaryColor};
            padding: 5px;
            border-radius: 16px;
            margin-top: 10px;
            color: ${themeSecondaryColor};
        }

        #input-form {
            flex: 1;
            margin-right: 15px;
        }

        #user-input {
            border: none;
            outline: none;
            padding: 0;
            padding-left: 10px;
            padding-top: 7px;
            padding-bottom: 4px;
            height: 0;
            background-color: transparent;
            color: ${themeSecondaryColor};
            font-size: 1rem;
            width: 100%;
            font-family: "Poppins", sans-serif;
        }

        #submit-btn {
            padding: 10px;
            background-color: transparent;
            color: ${themePrimaryColor};
            background-color: ${themeSecondaryColor};
            border-radius: 50%;
        }

        #submit-btn:hover {
            cursor: pointer;
            background-color: #c9b884;
        }

        .message {
            color: #000;
            background-color: ${themeSecondaryColor};
            padding: 15px;
            width: fit-content;
            max-width: 75%;
            font-size: .9rem;
            display: block;
            border-radius: 16px;
            margin-bottom: 15px;
            word-break: break-word;
        }

        .sent {
            margin-left: auto;
            background-color: #D9D9D9;
        }

        #attach-btn {
            margin-right: 5px;
            background-color: transparent;
            color: ${themeSecondaryColor};
            padding: 10px;
            border-radius: 50%;
            border: 1px solid ${themeSecondaryColor};
        }

        #attach-btn:hover {
            cursor: pointer;
            background-color: ${themeSecondaryColor};
            color: ${themePrimaryColor};
        }

        #file-field {
            display: none;
        }

        #chatbot-popup {
            position: fixed;
            bottom: 1%;
            right: -1.3%;
            transform: translateX(-50%);
            font-size: 2rem;
            color: ${themePrimaryColor};
            padding: 1rem;
            border-radius: 50%;
            background-color: ${themeSecondaryColor};
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            z-index: 10;
            transition: all 0.3s ease-in-out;
        }

        #chatbot-popup:hover {
            cursor: pointer;
            background-color: ${themePrimaryColor};
            color: ${themeSecondaryColor};
        }

        .chat-active {
            visibility: visible;
        }

        .images {
            display: flex;
            overflow: hidden;
            align-items: center;
            overflow-x: auto;
            scrollbar-width: none;
            cursor: grab;
            user-select: none;
            gap: 5px;
            margin-bottom: 15px;
            border-radius: 10px;
        }

        .chat-image {
            flex-shrink: 0;
            width: 90%;
            padding: 3px;
            border-radius: 10px;
            cursor: grab;
        }

        .chat-image:hover {
            cursor: pointer;
            background-color: ${themeSecondaryColor};
            border-radius: 10px;
            opacity: .8;
        }

        .chat-image img,
        .img-message img {
            object-fit: fill;
            display: block;
            height: 180px;
            width: 100%;
            border-radius: 10px;
        }

        .image-active {
            cursor: grabbing;
        }

        .images .property-details {
            padding: .5rem 2rem;
            background-color: ${themePrimaryColor};
            color: ${themeSecondaryColor};
            border-radius: 10px;
            border: 1px solid ${themeSecondaryColor};
            display: flex;
            flex-wrap: wrap;
            flex-shrink: 0;
            width: 100%;
        }

        .images .property-details h2 {
            color: gold;
            text-align: center;
            margin: 5px 0;
            width: 100%;
            font-size: 1.2em;
        }

        .images .property-details p {
            font-size: 14px;
            margin: 5px 0;
            width: 100%;
        }

        .images .property-details span {
            color: #fff;
        }

        .images .hidden-details {
            display: none;
        }

        .img-message {
            max-width: 100%;
            background-color: ${themeSecondaryColor};
            border-radius: 10px;
            padding: 5px;
        }

        .img-message img {
            margin-bottom: 0;
            height: auto;
        }

        .img-message-sent img {
            object-fit: contain;
            display: block;
            height: auto;
            width: 100%;
            border-radius: 10px;
            margin-bottom: 3px;
            margin-top: 5px;
        }

        .gallery-content {
            width: 85%;
        }

        .slider {
            margin: auto;
            position: relative;
            z-index: 0;
            overflow: hidden;
        }

        .slider-wrapper {
            display: flex;
            transition: transform 0.5s ease-in-out;
            width: 100%;
        }

        .slide {
            flex: 0 0 100%;
            display: block;
            position: relative;
        }

        .slide img {
            display: block;
            max-height: 80vh;
            width: 100%;
            height: 100%;
            margin: auto;
            object-fit: fill;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
        }

        .slider .property-details {
            position: absolute;
            top: 50%;
            right: -320px;
            width: 300px;
            padding: 20px;
            transform: translateY(-50%);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-size: clamp(.7rem, 2vw, 1rem);
            transition: right 0.5s ease-in-out;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        #prev,
        #next {
            position: absolute;
            font-size: clamp(26px, 5vw, 50px);
            top: 50%;
            color: #f0f0f0;
            padding: 20px;
            transform: translateY(-50%);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }

        #next,
        .bi-hand-thumbs-down,
        .bi-hand-thumbs-down-fill {
            right: 0;
        }

        #prev:hover,
        #next:hover {
            color: #fff;
            cursor: pointer;
            font-size: clamp(30px, 5vw, 54px);
        }

        .slider .like,
        .slider .dislike,
        .details-btn {
            position: absolute;
            font-size: clamp(26px, 5vw, 35px);
            top: 10%;
            color: ${themeSecondaryColor};
            padding: 20px;
            transform: translateY(-50%);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }

        .slider .like:hover,
        .slider .dislike:hover {
            cursor: pointer;
            font-size: clamp(30px, 5vw, 40px);
        }

        .details-btn {
            padding: 1rem 1.8rem;
            font-size: 1.1em;
            background-color: #000000b4;
            top: 20%;
            right: 0;
            border-radius: 10px;
            display: flex;
            align-items: center;
            transition: right 0.5s ease-in-out;
        }

        .details-btn .bi {
            margin-right: 5px;
            font-size: 1.2rem;
        }

        .details-btn:hover,
        .arrange-btn:hover {
            background-color: #000;
            cursor: pointer;
        }

        .arrange-btn {
            width: fit-content;
            margin: 10px auto;
            font-size: 1em;
            font-weight: bold;
            padding: 1.2rem 3rem;
            background-color: #000000b4;
            border-radius: 10px;
            color: ${themeSecondaryColor};
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            transition: background-color 0.3s ease-in-out;
        }

        .slider .content {
            position: absolute;
            top: 80%;
            font-size: clamp(8px, 3vw, 35px);
            color: #fff;
            padding: clamp(2px, 2vw, 15px);
            transform: translateY(-50%);
            background-color: #00000091;
            width: 100%;
        }

        .slider .content p {
            text-align: left;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: none;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            margin-left: 30px;
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .dot {
            width: 8px;
            height: 8px;
            background-color: #555;
            border-radius: 50%;
            opacity: 0.3;
            animation: blink 1.5s infinite;
        }

        .dot:nth-child(1) {
            animation-delay: 0s;
        }

        .dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes blink {
            0% {
                opacity: 0.3;
                transform: scale(1);
            }

            50% {
                opacity: 1;
                transform: scale(1.2);
            }

            100% {
                opacity: 0.3;
                transform: scale(1);
            }
        }

        .chat-preview img {
            border-radius: 16px;
            object-fit: contain;
            height: auto;
            width: 100%;
            display: block;
        }

        .chat-preview img {
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    const chatSubmit = document.getElementById("submit-btn");
    const inputForm = document.getElementById("input-form");
    let fileAttached = false;
    let userPhoneNumber = "";


    function takeUserInput() {
        let inputField = document.getElementById("user-input");
        let userInput = inputField.value.trim();
        const messagesDiv = document.getElementById("messages");

        if (!userPhoneNumber) {
            if (phoneNumberRegex.test(userInput)) {
                userPhoneNumber = userInput;
            } else {
                let message = document.createElement("div");
                message.innerHTML = userInput;
                message.classList.add("message", "sent");
                messagesDiv.appendChild(message);
                let requestPhoneNumber = document.createElement("div");
                requestPhoneNumber.classList.add("message");
                requestPhoneNumber.textContent = "Please provide a valid phone number.";
                messagesDiv.appendChild(requestPhoneNumber);
                return;
            }
        }

        let message = document.createElement("div");
        let typingIndicatorDiv = document.createElement("div");


        if (!userInput || userInput.trim() === "") {
            return;
        }
        if (fileAttached) {
            const fileContent = document.querySelector(".chat-preview");
            const fileContentSource = fileContent.querySelector("img").getAttribute("src");
            const chatPreview = document.querySelector(".chat-preview");


            userInput = `<i class="fa-solid fa-file"></i> ${userInput}
            <div class="img-message-sent">
                <img src="${fileContentSource}">
            </div>`;
            chatPreview.innerHTML = "";
            messagesDiv.style.height = "55vh";
            fileAttached = false;
        }
        message.innerHTML = userInput;
        message.classList.add("message", "sent");
        typingIndicatorDiv.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>`;
        typingIndicatorDiv.classList.add("typing-indicator", "message");
        messagesDiv.appendChild(message);
        messagesDiv.appendChild(typingIndicatorDiv);

        if (userInput === userPhoneNumber) {
            userInput = "Hello";
        }

        $.ajax({
            url: `${endpoint}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "query": userInput,
                "phone_number": userPhoneNumber,
                "client_id": "ALL"
            }),
            success: function (response) {
                console.log(response);
                let chatResponse = document.createElement("div");
                chatResponse.innerHTML = response.message;
                chatResponse.classList.add("message");

                messagesDiv.removeChild(typingIndicatorDiv);
                messagesDiv.appendChild(chatResponse);

                let imagesDiv;

                if (response.properties && response.properties.length > 0) {
                    Object.values(response.properties).forEach((property) => {
                        imagesDiv = document.createElement("div");
                        imagesDiv.classList.add("images");

                        let propertyImages = property.metadata.images;
                        if (Array.isArray(propertyImages) && typeof propertyImages !== "string") {
                            propertyImages.forEach(propertyImage => {
                                let image = document.createElement("div");
                                image.classList.add("chat-image");
                                image.innerHTML = `<img src="${propertyImage.url}" alt="Property Image" draggable="false">`;
                                imagesDiv.appendChild(image);
                            });
                        }

                        let detailsDiv = document.createElement("div");
                        detailsDiv.classList.add("property-details");
                        detailsDiv.innerHTML = `
                            <h2>${property.metadata.compound}</h2>
                            <p><strong>Location:</strong> <span>${property.metadata.city}, ${property.metadata.country}</span></p>
                            <p><strong>Type:</strong> <span>${property.metadata.buildingType}</span></p>
                            <p><strong>Rooms:</strong> <span>${property.metadata.roomsCount}</span></p>
                            <p><strong>Bathrooms:</strong> <span>${property.metadata.bathroomCount}</span></p>
                            <p><strong>View:</strong> <span>${property.metadata.view}</span></p>
                            <p><strong>Total Price:</strong> <span>${property.metadata.totalPrice} EGP</span></p>
                            <div class="hidden-details">
                                <p><strong>Payment Plans:</strong> <span>${property.metadata.paymentPlans}</span></p>
                                <p><strong>Developer:</strong> <span>${property.metadata.developer}</span></p>
                                <p><strong>Floor:</strong> <span>${property.metadata.floor}</span></p>
                                <p><strong>Down Payment:</strong> <span>${property.metadata.downPayment} EGP</span></p>
                                <p><strong>Selling Area:</strong> <span>${property.metadata.landArea} m²</span></p>
                                <p><strong>Garden Size:</strong> <span>${property.metadata.gardenSize} m²</span></p>
                                <p><strong>Garage Area:</strong> <span>${property.metadata.garageArea} m²</span></p>
                                <p><strong>Delivery Date:</strong> <span>${property.metadata.deliveryDate}</span></p>
                                <p><strong>Finishing:</strong> <span>${property.metadata.finishing}</span></p>
                            </div>
                        `;

                        imagesDiv.appendChild(detailsDiv);
                        messagesDiv.appendChild(imagesDiv);
                    });
                }
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        })

        inputField.value = "";
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    });

    const inputField = document.getElementById("user-input");
    const originalHeight = inputField.style.height || inputField.offsetHeight + "px";
    function handleSubmit() {
        if (inputField.value.trim() !== "") {
            takeUserInput();
            inputField.value = "";
            inputField.style.height = originalHeight;
            inputField.setAttribute("placeholder", "Type Something Here");
        }
    }

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    });

    chatSubmit.addEventListener("click", function () {
        handleSubmit();
    });

    inputForm.addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmit();
    });

    // upload a file
    const attachButton = document.getElementById("attach-btn");
    const fileField = document.getElementById("file-field");

    attachButton.addEventListener("click", function () {
        fileField.click();
    });

    fileField.addEventListener("change", function () {
        let fileName = fileField.files[0].name;

        if (fileName) {
            let inputField = document.getElementById("user-input");
            inputField.value = fileName;
            fileAttached = true;
            file = fileField.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    $('.chat-preview').html(`<img src="${e.target.result}" alt="Chat Preview">`);
                };
                reader.readAsDataURL(file);
            } else {
                $('.chat-preview').html('');
            }
            fileField.value = "";
        }

    });

    const galleryOverlay = document.querySelector(".gallery-overlay");
    const gallerycontent = document.querySelector(".gallery-content");


    document.getElementById("messages").addEventListener("click", function (event) {
        const clickedImage = event.target.closest(".images");

        if (!clickedImage) return;

        galleryOverlay.style.display = "flex";
        const allImages = Array.from(document.querySelectorAll(".chat-image img")).map(img => img.src);
        const imageSlides = allImages.map(src => `
            <div class="slide">
                <img src="${src}" alt="Chat Image">
            </div>
        `).join("");
        let imageTitle;

        if (responseProperties) {
            const compound = responseProperties.compound;
            const zone = responseProperties.zone;
            const phase = responseProperties.phase;
            imageTitle = `${compound}: ${zone}: ${phase}`;
        } else {
            imageTitle = "Image Viewer"
        }

        const propertyDetails = document.querySelector(".property-details");
        gallerycontent.innerHTML = `
            <div class="upload-header">
                <h1>${imageTitle}</h1>
                <i class="fa-solid close-btn fa-circle-xmark"></i>
            </div>
            <div class="slider">
                <div class="slider-wrapper">
                    ${imageSlides}
                </div>

                <div id="prev"><i class="fa-solid iconCall fa-chevron-left"></i></div>
                <div id="next"><i class="fa-solid iconCall fa-chevron-right"></i></div>

                <i class="bi bi-hand-thumbs-up like"></i>
                <i class="bi bi-hand-thumbs-down dislike"></i>

                <div class="details-btn"><i class="bi bi-arrow-left-square"></i> More Details</div>
                <div class="property-details">
                    ${propertyDetails.innerHTML}
                    <div class="arrange-btn">Arrange A View</div>
                </div>
            </div>
        `;

        document.querySelector(".close-btn").addEventListener("click", function () {
            galleryOverlay.style.display = "none";
            gallerycontent.innerHTML = '';
        });

        const slides = document.getElementsByClassName("slide");
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const prev = document.getElementById("prev");
        const next = document.getElementById("next");
        let slideIndex = 0;

        showSlides(slideIndex);

        function plusSlides(num) {
            showSlides(slideIndex += num);
        }

        function showSlides(num) {
            slideIndex = (num + slides.length) % slides.length;
            if (slideIndex === 0) {
                prev.style.display = "none";
            } else {
                prev.style.display = "block";
            }

            if (slideIndex === slides.length - 1) {
                next.style.display = "none";
            } else {
                next.style.display = "block";
            }

            sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        }

        prev.addEventListener("click", function () {
            plusSlides(-1);
        });

        next.addEventListener("click", function () {
            plusSlides(1);
        });

        // like & dislike buttons
        const likeButtons = Array.from(document.getElementsByClassName("like"));
        const dislikeButtons = Array.from(document.getElementsByClassName("dislike"));

        likeButtons.forEach((like) => {
            like.addEventListener("click", function () {
                let liked = document.createElement("i");
                liked.classList.add("bi", "bi-hand-thumbs-up-fill", "liked");

                liked.addEventListener("click", function () {
                    liked.replaceWith(like);
                });

                like.replaceWith(liked);
            });
        });

        dislikeButtons.forEach((dislike) => {
            dislike.addEventListener("click", function () {
                let disliked = document.createElement("i");
                disliked.classList.add("bi", "bi-hand-thumbs-down-fill", "disliked");

                disliked.addEventListener("click", function () {
                    disliked.replaceWith(dislike);
                });

                dislike.replaceWith(disliked);
            });
        });

        $(document).ready(function () {
            let isOpen = false;
            const detailsBtn = document.querySelector(".details-btn");
            const arrowIcon = detailsBtn.querySelector("i");

            $(".details-btn").click(function () {
                if (isOpen) {
                    $(".slider .property-details").animate({ right: "-320px" }, 100);
                    $(".details-btn").animate({ right: "0px" }, 100);
                    arrowIcon.classList.remove("bi-arrow-right-square");
                    arrowIcon.classList.add("bi-arrow-left-square");
                } else {
                    $(".slider .property-details").animate({ right: "0px" }, 100);

                    if (window.innerHeight < 500) {
                        $(".details-btn").animate({ right: "300px" }, 100)
                    } else if (window.innerWidth > 1100) {
                        $(".details-btn").animate({ right: "300px" }, 100);
                    } else {
                        $(".details-btn").animate({ right: "150px" }, 100);
                    }

                    arrowIcon.classList.remove("bi-arrow-left-square");
                    arrowIcon.classList.add("bi-arrow-right-square");
                }

                isOpen = !isOpen;
            });
        });

        const arrangeBtn = document.querySelector(".arrange-btn");
        const closeBtn = document.querySelector(".close-btn");
        arrangeBtn.addEventListener("click", function () {
            closeBtn.click();
        })

        function checkScreenWidth() {
            if (window.innerWidth < 1100) {
                prev.style.display = "none";
                next.style.display = "none"
            }
        }

        checkScreenWidth();

        window.addEventListener("resize", checkScreenWidth);
    });

    // Chatbot popup
    const popUp = document.getElementById("chatbot-popup");
    const chatBot = document.querySelector(".chatbot");

    popUp.addEventListener("click", function () {
        chatBot.classList.toggle("chat-active");

        if (popUp.classList.contains("fa-message")) {
            popUp.classList.remove("fa-message");
            popUp.classList.add("fa-square-xmark");
        } else {
            popUp.classList.remove("fa-square-xmark");
            popUp.classList.add("fa-message");
        }
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
});