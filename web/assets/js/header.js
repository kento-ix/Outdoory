document.addEventListener("DOMContentLoaded", () => {
    const menuOpenBtn = document.getElementById("menu-open");
    
    // const loginBtn = document.querySelector("#login-button");
    // const signinBtn = document.querySelector("#signin-button");
    const loginBtnSlide = document.querySelector("#login-button-slide")
    const signinBtnSlide = document.querySelector("#signin-button-slide")

    const modalOverlay = document.getElementById("modal-overlay");
    const loginModal = document.getElementById("login-modal");
    const signinModal = document.getElementById("signin-modal");

    const sideBar = document.getElementById("right-slide")
    const slideClose = document.querySelector("#slidebar-close");

    const closeLoginBtn = document.getElementById("close-login");
    const closeSigninBtn = document.getElementById("close-signin");


    const changeModalLinks = document.querySelectorAll(".change-modal");

    

    // Effect Open: modal with animation activate
    function openModal(mode = "login") {
        modalOverlay.classList.remove("hidden");
        const intervalId = setInterval(() => {
            modalOverlay.classList.add("active");
    
            if (mode === "login") {
                loginModal.style.display = "grid";
                signinModal.style.display = "none";
            } else {
                loginModal.style.display = "none";
                signinModal.style.display = "grid";
            }
    
            clearInterval(intervalId);
        }, 20);
    };    

    // Effect Close: modal with animation activate
    const closeModal = () => {
        modalOverlay.classList.remove("active");
        setTimeout(() => {
            modalOverlay.classList.add("hidden");
            loginModal.style.display = "none";
            signinModal.style.display = "none";
        }, 300);
    };

    // Close: modal with close button
    closeLoginBtn.addEventListener("click", closeModal);
    closeSigninBtn.addEventListener("click", closeModal);

    // Close: modal when click outside
    modalOverlay.addEventListener("click", (e) => {
        const modalContent = modalOverlay.querySelector(".modal-content");
        if(!modalContent.contains(e.target)) {
            closeModal();
        }
    })

    // Open: sidebar with toggle icon
    menuOpenBtn.addEventListener("click", () => {
        sideBar.classList.add("active");
    });


    // Close: slidebar with icon
    slideClose.addEventListener("click", () => {
        sideBar.classList.remove("active");
    });

    // Close: side bar when click outside
    document.addEventListener("click", (e) => {
        if (!sideBar.contains(e.target) && !menuOpenBtn.contains(e.target)) {
            sideBar.classList.remove("active");
        }
    });

    // Open: modal in the sidebar
    loginBtnSlide.addEventListener("click", () => {
        openModal("login");
        sideBar.classList.remove("active");
    });

    signinBtnSlide.addEventListener("click", () => {
        openModal("signin");
        sideBar.classList.remove("active");
    });

    
    // change modal
    changeModalLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const isLoginVisible = loginModal.style.display === "grid";
            openModal(isLoginVisible ? "signin" : "login");
        });
    });
})