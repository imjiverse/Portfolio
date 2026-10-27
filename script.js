
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a");
    const typedElement = document.querySelector(".multiple-text");

    // Respect the user's motion preferences.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // MOBILE NAVIGATION
    function closeMenu() {
        if (!menuIcon || !navbar) return;

        navbar.classList.remove("active");
        menuIcon.classList.remove("bx-x");
        menuIcon.classList.add("bx-menu");

        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuIcon && navbar) {
        // Improve keyboard accessibility for the existing <i> element.
        menuIcon.setAttribute("role", "button");
        menuIcon.setAttribute("tabindex", "0");
        menuIcon.setAttribute("aria-controls", "main-navigation");
        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.setAttribute("aria-label", "Open navigation menu");

        navbar.id = "main-navigation";

        function toggleMenu() {
            const isOpen = navbar.classList.toggle("active");

            menuIcon.classList.toggle("bx-x", isOpen);
            menuIcon.classList.toggle("bx-menu", !isOpen);

            menuIcon.setAttribute("aria-expanded", String(isOpen));
            menuIcon.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        }

        menuIcon.addEventListener("click", toggleMenu);

        menuIcon.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMenu();
            }
        });

        // Close the menu after selecting a section.
        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close when clicking outside the navigation.
        document.addEventListener("click", (event) => {
            if (
                navbar.classList.contains("active") &&
                !navbar.contains(event.target) &&
                !menuIcon.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close the menu with Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    // HEADER SCROLL EFFECT
    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 20);
    }

    // ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll(
        "section[id], footer[id]"
    );

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 150;
        let currentSection = "home";

        sections.forEach((section) => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${currentSection}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(
        ".home-content, .home-img, .about-content, " +
        ".about-img, .services-box, .contact form"
    );

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    // TYPING ANIMATION
    const roles = [
        "App Developer",
        "Android Developer",
        "UI/UX Designer",
        "Web Developer"
    ];

    if (typedElement) {
        if (prefersReducedMotion || typeof Typed === "undefined") {
            typedElement.textContent = roles[0];
        } else {
            new Typed(typedElement, {
                strings: roles,
                typeSpeed: 65,
                backSpeed: 35,
                backDelay: 1500,
                startDelay: 300,
                loop: true,
                showCursor: true,
                cursorChar: "|",
                smartBackspace: true
            });
        }
    }

    // OPTIMIZED SCROLL HANDLING
    let scrollScheduled = false;

    function handleScroll() {
        if (scrollScheduled) return;

        scrollScheduled = true;

        window.requestAnimationFrame(() => {
            updateHeader();
            updateActiveLink();
            scrollScheduled = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    // Reset the mobile menu when returning to desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // INITIAL STATE
    updateHeader();
    updateActiveLink();
});
