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

        // $.ajax({
        //     url: "https://lenaai.net/search",
        //     method: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify({"query": userInput}),
        //     success: function (response) {
        //         console.log(response);
        //     },
        //     error: function(xhr, status, error) {
        //         console.error("Error:", error);
        //     }
        // })

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
                reader.onload = function(e) {
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
})