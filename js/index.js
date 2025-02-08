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

    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
        this.style.height = 0;
        this.style.height = (this.scrollHeight) + "px";
    });

    const inputField = document.getElementById("user-input");
    const originalHeight = inputField.style.height || inputField.offsetHeight + "px";
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            takeUserInput();
            this.value = "";
            this.style.height = originalHeight;
            this.setAttribute("placeholder", "Type Something Here");
        }
    });

    let responseProperties;

    // Handle user input for Chat-Bot
    const chatSubmit = document.getElementById("submit-btn");
    const inputForm = document.getElementById("input-form");
    let fileAttached = false;


    function takeUserInput() {
        let inputField = document.getElementById("user-input");
        let userInput = inputField.value.trim();
        const messagesDiv = document.getElementById("messages");
        let message = document.createElement("div");
        let typingIndicatorDiv = document.createElement("div");


        if (userInput === "") return;
        if (fileAttached) {
            const fileContent = document.querySelector(".chat-preview");
            const fileContentSource = fileContent.querySelector("img").getAttribute("src");
            const chatPreview = document.querySelector(".chat-preview");


            userInput = `<i class="fa-solid fa-file"></i> ${userInput}
            <div class="img-message-sent">
                <img src="${fileContentSource}">
            </div>`;
            chatPreview.innerHTML = "";
            messagesDiv.style.height = "700px";
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

        $.ajax({
            url: "http://35.225.79.225/chat/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "query": userInput,
                "phone_number": "01212121212"
            }),
            success: function (response) {
                let chatResponse = document.createElement("div");
                chatResponse.innerHTML = response.message;
                chatResponse.classList.add("message");

                let imagesDiv;

                if (response.properties && response.properties.length > 0) {
                    responseProperties = response.properties[0];
                    imagesDiv = document.createElement("div");
                    imagesDiv.classList.add("images");

                    responseImages = response.properties[0].images;
                    responseImages.forEach(imageUrl => {
                        let image = document.createElement("div");
                        image.classList.add("chat-image");
                        image.innerHTML = `<img src="${imageUrl}" alt="Property Image">`;
                        imagesDiv.appendChild(image);
                    });
                }
                messagesDiv.removeChild(typingIndicatorDiv);
                messagesDiv.appendChild(chatResponse);
                messagesDiv.appendChild(imagesDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        })

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
            file = fileField.files[0];
            if (file) {
                const reader = new FileReader();
                const messagesDiv = document.getElementById("messages");

                messagesDiv.style.height = "450px";
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

    // Call Section
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

    // Facebook page posting
    const facebookButton = document.getElementById("facebook-btn");
    const uploadOverlay = document.querySelector(".upload-overlay");
    const uploadDetails = document.querySelector(".fb-upload");

    facebookButton.addEventListener("click", function () {
        uploadOverlay.style.display = "flex";
        uploadDetails.innerHTML = `
            <div class="upload-header">
                <h1>Post on Facebook</h1>
                <i class="fa-solid close-btn fa-circle-xmark"></i>
            </div>
            <div class="upload-data">
            <div class="photo-preview"></div>
                <form id="upload-form">
                    <div class="content-container">
                        <textarea placeholder="Post Content ..." id="post-content"></textarea>
                        <i class="fa-solid fa-paperclip" id="bin-btn"></i>
                    </div>
                    <input type="file" id="post-photo">
                    <input type="submit" value="Post" id="post-btn">
                </form>
            </div>`;

        document.querySelector(".close-btn").addEventListener("click", function () {
            uploadOverlay.style.display = "none";
            uploadDetails.innerHTML = '';
        });

        $("textarea").each(function () {
            this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
        }).on("input", function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        });

        const attachButton = document.getElementById("bin-btn");
        const fileField = document.getElementById("post-photo");
        const postButton = document.getElementById("post-btn");
        let file;

        attachButton.addEventListener("click", function () {
            fileField.click();
        });

        fileField.addEventListener("change", function () {
            file = fileField.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $('.photo-preview').html(`<img src="${e.target.result}" alt="Photo Preview">`);
                };
                reader.readAsDataURL(file);
            } else {
                $('.photo-preview').html('');
            }
        });

        async function uploadPhoto(file) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://localhost:8000/upload_photo", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            return data.photo_url; // Return the uploaded photo URL
        }

        postButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const postContent = document.getElementById("post-content").value;
            let photoUrl = null;

            if (file) {
                photoUrl = await uploadPhoto(file); // Upload and get URL
            }

            $.ajax({
                url: "http://localhost:8000/fb_post",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    content: postContent,
                    photo_url: photoUrl
                }),
                success: function (response) {
                    console.log(response);
                }
            });

            uploadOverlay.style.display = "none";
        });
    });

    // Chat engine list
    const currentChatEngine = document.querySelector(".current-engine");
    const dropdown = document.getElementById('dropdown-menu');
    const chatEngines = Array.from(document.getElementsByClassName("engine-item"));

    function toggleDropdown() {
        const isVisible = dropdown.style.display === "block";
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        currentChatEngine.classList.toggle("engine-list-active", !isVisible);
    }

    currentChatEngine.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener("click", function (event) {
        if (!currentChatEngine.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
            currentChatEngine.classList.remove("engine-list-active");
        }
    });

    chatEngines.forEach((engine) => {
        engine.addEventListener("click", function () {
            const messagesDiv = document.getElementById("messages");
            let selectedEngineName = engine.textContent;
            const currentEngineName = document.querySelector(".engine-name");

            if (currentEngineName.textContent !== selectedEngineName) {
                currentEngineName.textContent = selectedEngineName;
                messagesDiv.innerHTML = `
                <div class="message">
                    Welcome to Lena Ai How can I help you today?
                </div>`;
            }
        });
    });

    // Chat images select
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

                // setTimeout(() => document.querySelector(".close-btn").click(), 1000);

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

        // // const imageSource = image.getAttribute("src");
        // imagesDiv.innerHTML = `<div class="img-message">
        //     <img src="${imageSource}" alt="Chat Image">
        // </div>`;
    });
})