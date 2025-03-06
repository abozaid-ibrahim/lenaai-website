document.addEventListener("DOMContentLoaded", function () {
    let requestUrl = "langgraph_chat";
    const phoneNumberRegex = /^\d{10,15}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // check authentication status
    function checkLoginStatus() {
        const token = localStorage.getItem("lenaai_access_token");
        if (token) {
            $.ajax({
                url: `https://api.lenaai.net/me?access_token=${token}`,
                type: "POST",
                success: function(response) {
                    $("#sign-in")
                        .html('<i class="bi bi-box-arrow-right"></i> Logout')
                        .addClass("logout");

                    $(".sign-in-sm button")
                        .html('<i class="bi bi-box-arrow-right"></i> Logout')
                        .addClass("logout");

                    function logoutUser() {
                        localStorage.removeItem("lenaai_access_token");

                        window.location.href = "./index.html";
                    }

                    $("#sign-in, .sign-in-sm button").on("click", function (event) {
                        event.preventDefault();
                        logoutUser();
                    });
                },
                error: function(xhr) {
                    console.log("Token expired or invalid, user must log in again");
                    localStorage.removeItem("lenaai_access_token");
                }
            });
        }
    }

    checkLoginStatus();

    const themeToggle = document.getElementById("theme-toggle");
    const themeStylesheet = document.getElementById("theme-stylesheet");
    const themeStylesheetResponsive = document.getElementById("theme-stylesheet-resp");
    const themeIcon = themeToggle.querySelector("i");

    const lightThemePath = "css/efficiency_hub_light.css";
    const darkThemePath = "css/efficiency_hub_dark.css";
    const lightThemePathResponsive = "css/responsive_light.css";
    const darkThemePathResponsive = "css/responsive_dark.css";

    const savedTheme = localStorage.getItem("theme") || "light";
    themeStylesheet.href = savedTheme === "dark" ? darkThemePath: lightThemePath;
    themeStylesheetResponsive.href = savedTheme === "dark" ? darkThemePathResponsive: lightThemePathResponsive;

    function updateButton(theme) {
        if (theme === "dark") {
            themeToggle.innerHTML = `<i class="bi bi-sun"></i>`;
        } else {
            themeToggle.innerHTML = `<i class="bi bi-moon"></i>`;
        }
    }

    updateButton(savedTheme);

    themeToggle.addEventListener("click", function () {
        const isDark = themeStylesheet.href.includes("efficiency_hub_light.css");
        themeStylesheet.href = isDark ? darkThemePath : lightThemePath;
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateButton(isDark ? "dark" : "light");
    });

    // // countdown section
    // function updateCountdown() {
    //     const now = new Date().getTime();
    //     const endDate = new Date("2025-03-01T00:00:00"); // Set countdown to February 1, 2025
    //     const distance = endDate - now;
    //     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //     document.getElementById("countdown").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    // }

    // setInterval(updateCountdown, 1000);

    let responseProperties;

    // Handle user input for Chat-Bot
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

        console.log(requestUrl, userInput);
        $.ajax({
            url: `https://api.lenaai.net/${requestUrl}`,
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
                    response.properties.forEach((property) => {
                        imagesDiv = document.createElement("div");
                        imagesDiv.classList.add("images");

                        let propertyImages = property.images;
                        propertyImages.forEach(imageUrl => {
                            let image = document.createElement("div");
                            image.classList.add("chat-image");
                            image.innerHTML = `<img src="${imageUrl}" alt="Property Image" draggable="false">`;
                            imagesDiv.appendChild(image);
                        });

                        let detailsDiv = document.createElement("div");
                        detailsDiv.classList.add("property-details");
                        detailsDiv.innerHTML = `
                            <h2>${property.compound}</h2>
                            <p><strong>Location:</strong> <span>${property.city}, ${property.country}</span></p>
                            <p><strong>Type:</strong> <span>${property.typeName} - ${property.buildingType}</span></p>
                            <p><strong>Zone:</strong> <span>${property.zone}</span></p>
                            <p><strong>Rooms:</strong> <span>${property.roomsCount}</span></p>
                            <p><strong>Finishing:</strong> <span>${property.finishing}, ${property.status}</span></p>
                            <div class="hidden-details">
                                <p><strong>Phase:</strong> <span>${property.phase}</span></p>
                                <p><strong>Land Area:</strong> <span>${property.landAreaSqMeters} m²</span></p>
                                <p><strong>Selling Area:</strong> <span>${property.sellingAreaSqMeters} m²</span></p>
                                <p><strong>Garden Size:</strong> <span>${property.gardenSize} m²</span></p>
                                <p><strong>Delivery Date:</strong> <span>${property.deliveryDate}</span></p>
                                <p><strong>Price Plan (8 Years):</strong> <span>${property.plan8Years} EGP</span></p>
                                <p><strong>Price Plan (9 Years):</strong> <span>${property.plan9Years} EGP</span></p>
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
        let fileName = fileField.files[0]?.name;

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

    // // Call Section
    // const callBtn = document.getElementById("call-btn");
    // const phoneField = document.querySelector(".phone-field");

    // callBtn.addEventListener("click", function () {
    //     phoneField.classList.toggle("active");
    //     callBtn.classList.toggle("call-active");
    // });

    // const closeBtn = document.querySelector(".fa-circle-xmark");

    // closeBtn.addEventListener("click", function () {
    //     phoneField.classList.remove("active");
    //     callBtn.classList.remove("call-active");
    // });

    // // Facebook page posting
    // const facebookButton = document.getElementById("facebook-btn");
    // const uploadOverlay = document.querySelector(".upload-overlay");
    // const uploadDetails = document.querySelector(".fb-upload");

    // facebookButton.addEventListener("click", function () {
    //     uploadOverlay.style.display = "flex";
    //     uploadDetails.innerHTML = `
    //         <div class="upload-header">
    //             <h1>Post on Facebook</h1>
    //             <i class="fa-solid close-btn fa-circle-xmark"></i>
    //         </div>
    //         <div class="upload-data">
    //         <div class="photo-preview"></div>
    //             <form id="upload-form">
    //                 <div class="content-container">
    //                     <textarea placeholder="Post Content ..." id="post-content"></textarea>
    //                     <i class="fa-solid fa-paperclip" id="bin-btn"></i>
    //                 </div>
    //                 <input type="file" id="post-photo">
    //                 <input type="submit" value="Post" id="post-btn">
    //             </form>
    //         </div>`;

    //     document.querySelector(".close-btn").addEventListener("click", function () {
    //         uploadOverlay.style.display = "none";
    //         uploadDetails.innerHTML = '';
    //     });

    //     $("textarea").each(function () {
    //         this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    //     }).on("input", function () {
    //         this.style.height = 0;
    //         this.style.height = (this.scrollHeight) + "px";
    //     });

    //     const attachButton = document.getElementById("bin-btn");
    //     const fileField = document.getElementById("post-photo");
    //     const postButton = document.getElementById("post-btn");
    //     let file;

    //     attachButton.addEventListener("click", function () {
    //         fileField.click();
    //     });

    //     fileField.addEventListener("change", function () {
    //         file = fileField.files[0];
    //         if (file) {
    //             const reader = new FileReader();
    //             reader.onload = function (e) {
    //                 $('.photo-preview').html(`<img src="${e.target.result}" alt="Photo Preview">`);
    //             };
    //             reader.readAsDataURL(file);
    //         } else {
    //             $('.photo-preview').html('');
    //         }
    //     });

    //     async function uploadPhoto(file) {
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         const response = await fetch("http://localhost:8000/upload_photo", {
    //             method: "POST",
    //             body: formData
    //         });

    //         const data = await response.json();
    //         return data.photo_url; // Return the uploaded photo URL
    //     }

    //     postButton.addEventListener("click", async function (event) {
    //         event.preventDefault();

    //         const postContent = document.getElementById("post-content").value;
    //         let photoUrl = null;

    //         if (file) {
    //             photoUrl = await uploadPhoto(file); // Upload and get URL
    //         }

    //         $.ajax({
    //             url: "http://localhost:8000/fb_post",
    //             method: "POST",
    //             contentType: "application/json",
    //             data: JSON.stringify({
    //                 content: postContent,
    //                 photo_url: photoUrl
    //             }),
    //             success: function (response) {
    //                 console.log(response);
    //             }
    //         });

    //         uploadOverlay.style.display = "none";
    //     });
    // });

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
                if (selectedEngineName === "Langgraph Chat-bot") {
                    requestUrl = "langgraph_chat";
                } else if (selectedEngineName === "Lena Chat-bot") {
                    requestUrl = "chat"
                }

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

    const video = document.getElementById("ai-video");
    const playButton = document.getElementById("play-button");

    playButton.addEventListener("click", function () {
        if (video.paused) {
            video.controls = true;
            video.play();
            playButton.classList.add("hide");
        }
    });

    video.addEventListener("ended", function () {
        playButton.classList.remove("hide");
        video.controls = false;
    });

    $(document).ready(function () {
        $("#menu-toggle").click(function () {
            $("#nav-list").slideToggle(300);
        });
    });

    // Chatbot popup
    const popUp = document.getElementById("popup");
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

    const slides = document.getElementsByClassName("slide");
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    const dots = Array.from(document.getElementsByClassName("slider-dot"));
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

        dots.forEach(dot => dot.classList.remove("slider-dot-active"));
        dots[slideIndex].classList.add("slider-dot-active");
        sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    prev.addEventListener("click", function () {
        plusSlides(-1);
    });

    next.addEventListener("click", function () {
        plusSlides(1);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", function () {
            showSlides(i);
        });
    });

    function checkScreenWidth() {
        if (window.innerWidth < 1100) {
            prev.style.display = "none";
            next.style.display = "none";
        } else {
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
        }
    }

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    const demoButton = document.querySelector(".trial .demo");
    const demoOverlay = document.querySelector(".demo-overlay");
    const demoPopUp = document.querySelector(".demo-popup");
    demoButton.addEventListener("click", function () {
        demoOverlay.style.display = "flex";
        demoPopUp.innerHTML = `
            <div class="demo-header">
                <h1>Request Demo</h1>
                <i class="fa-solid close-btn fa-circle-xmark"></i>
            </div>
            <div class="demo-content">
                <p>Streamline your brokerage operations,
                manage clients efficiently,
                and close deals faster with our powerful platform.
                Request a personalized demo today.</p>
                <form id="demo-form">
                    <div class="error-name"></div>
                    <div class="form-half">
                        <input type="text" id="first-name" placeholder="First Name" required>
                        <input type="text" id="last-name" placeholder="Last Name" required>
                    </div>
                    <div class="error-phone"></div>
                    <input type="text" id="phone" placeholder="Phone Number" required>
                    <div class="error-email"></div>
                    <input type="email" id="email" placeholder="Email Address" required>
                    <input type="submit" id="demo-submit" value="Request Demo">
                </form>
            </div>
        `;

        document.querySelector(".close-btn").addEventListener("click", function () {
            demoOverlay.style.display = "none";
            demoPopUp.innerHTML = '';
        });

        document.querySelector("#demo-submit").addEventListener("click", function (event) {
            event.preventDefault();
        
            const errorName = document.querySelector(".error-name");
            const errorPhone = document.querySelector(".error-phone");
            const errorEmail = document.querySelector(".error-email");
        
            const firstName = document.querySelector("#first-name").value.trim();
            const lastName = document.querySelector("#last-name").value.trim();
            const phone = document.querySelector("#phone").value.trim();
            const email = document.querySelector("#email").value.trim();
        
            const fullName = `${firstName} ${lastName}`;
        
            errorName.innerHTML = "";
            errorPhone.innerHTML = "";
            errorEmail.innerHTML = "";
        
            const nameRegex = /^[A-Za-z\s]{2,}$/;
            let isValid = true;
        
            if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
                errorName.style.display = "block";
                errorName.innerHTML = `Provide a valid First and Last Name (Only letters, min 2 characters).`;
                isValid = false;
            }
        
            const phoneNumberRegex = /^[\d\s+\-()]{11,15}$/;
            if (!phoneNumberRegex.test(phone)) {
                errorPhone.style.display = "block";
                errorPhone.innerHTML = `Invalid Phone Number. Enter 11-15 digits (can include +, -).`;
                isValid = false;
            }
        
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errorEmail.style.display = "block";
                errorEmail.innerHTML = `Invalid Email Address. Please enter a valid email.`;
                isValid = false;
            }
        
            document.querySelector("#first-name").style.border = !nameRegex.test(firstName) ? "2px solid red" : "";
            document.querySelector("#last-name").style.border = !nameRegex.test(lastName) ? "2px solid red" : "";
            document.querySelector("#phone").style.border = !phoneNumberRegex.test(phone) ? "2px solid red" : "";
            document.querySelector("#email").style.border = !emailRegex.test(email) ? "2px solid red" : "";
        
            if (!isValid) return;
        
            const clientData = {
                name: fullName,
                phone: phone,
                email: email
            };

            $.ajax({
                url: "https://api.lenaai.net/requesting-demo/",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(clientData),
                success: function (response) {
                    if (response.status === "Record created successfully") {
                        console.log("Form submitted successfully:", clientData, response);
                        demoOverlay.style.display = "none";
                        demoPopUp.innerHTML = '';
                    } else {
                        errorPhone.style.display = "block";
                        errorPhone.innerHTML = `A Demo Request Already Exists For This Phone Number/Email Address`;
                    }
                },
                error: function (error) {
                    console.log("Form request failed:", error)
                }
            })
        });                
    })

    const trialButton = document.querySelector(".trial .chat");
    trialButton.addEventListener("click", function () {
        chatBot.classList.toggle("chat-active");
        if (popUp.classList.contains("fa-message")) {
            popUp.classList.remove("fa-message");
            popUp.classList.add("fa-square-xmark");
        } else {
            popUp.classList.remove("fa-square-xmark");
            popUp.classList.add("fa-message");
        }
    })
})