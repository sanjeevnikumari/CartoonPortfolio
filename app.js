// Configuration
const totalFrames = 151;
const frameImages = [];
let loadedCount = 0;
let animationFrameId = null;

// Easing / LERP (Linear Interpolation) variables
let currentFrameIndex = 0; // The smoothed frame index currently drawn
let targetFrameIndex = 0;  // The target frame index based on actual scroll position
const lerpFactor = 0.08;    // Lower values = smoother/slower catch up

// Canvas setup
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const heroSection = document.getElementById('home');

// Helper to pad frame numbers (e.g., 1 -> "001", 12 -> "012")
function padZero(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

// Preload all frame images
function preloadImages() {
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNum = padZero(i, 3);
        img.src = `assets/ezgif-frame-${frameNum}.jpg`;

        img.onload = () => {
            loadedCount++;
            updateProgress(loadedCount);
            if (loadedCount === totalFrames) {
                onPreloadComplete();
            }
        };

        img.onerror = () => {
            console.error(`Failed to load frame image: ${img.src}`);
            // Count failed images anyway to avoid stalling the loading screen
            loadedCount++;
            updateProgress(loadedCount);
            if (loadedCount === totalFrames) {
                onPreloadComplete();
            }
        };

        frameImages.push(img);
    }
}

// Update the progress bar and percentage text
function updateProgress(count) {
    const percentage = Math.round((count / totalFrames) * 100);
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}%`;
}

// Triggered when preloading finishes
function onPreloadComplete() {
    // Fade out loader with delay to let progress bar visual settle
    setTimeout(() => {
        loader.classList.add('fade-out');

        // Setup initial canvas dimensions and draw first frame
        resizeCanvas();

        // Listeners
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initialize target frame based on current scroll position
        onScroll();
        currentFrameIndex = targetFrameIndex; // Start exactly at current scroll pos

        // Start rendering loop
        startLoop();
    }, 400);
}

// Canvas sizing and drawing logic
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scale backing store to device resolution for crisp rendering
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Immediately redraw the active frame
    const roundedIndex = Math.round(currentFrameIndex);
    const clampIndex = Math.min(totalFrames - 1, Math.max(0, roundedIndex));
    drawFrame(clampIndex);
}

// Draw a specific frame to the canvas
function drawFrame(index) {
    const img = frameImages[index];
    if (!img || !img.complete) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth, drawHeight, drawX, drawY;

    // Perform a smooth "cover" fit that goes end-to-end
    // and stays at a constant relative scale (no zoom-in or zoom-out)
    if (canvasRatio > imgRatio) {
        // Viewport is wider than the image
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
    } else {
        // Viewport is taller than the image
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// Scroll event listener — ONLY maps scroll within the hero section to frames
function onScroll() {
    const scrollTop = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const maxHeroScroll = heroHeight - window.innerHeight;

    // Clamp scroll progress to the hero section only (0.0 → 1.0)
    const scrollPercent = maxHeroScroll > 0
        ? Math.min(1, Math.max(0, scrollTop / maxHeroScroll))
        : 0;

    // Map to frame indices (0 to totalFrames - 1)
    targetFrameIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(scrollPercent * totalFrames)));

    // Hide canvas when scrolled past the hero section
    if (scrollTop > heroHeight) {
        canvas.classList.add('hidden');
    } else {
        canvas.classList.remove('hidden');
    }
}

// RequestAnimationFrame render loop
function startLoop() {
    let lastDrawnIndex = -1;

    function tick() {
        // Smoothly interpolate current frame index towards the target
        const diff = targetFrameIndex - currentFrameIndex;

        // If the difference is negligible, snap to the target
        if (Math.abs(diff) < 0.005) {
            currentFrameIndex = targetFrameIndex;
        } else {
            currentFrameIndex += diff * lerpFactor;
        }

        const roundedIndex = Math.round(currentFrameIndex);
        const clampIndex = Math.min(totalFrames - 1, Math.max(0, roundedIndex));

        // Only draw if the frame has actually changed
        if (clampIndex !== lastDrawnIndex) {
            drawFrame(clampIndex);
            lastDrawnIndex = clampIndex;
        }

        animationFrameId = requestAnimationFrame(tick);
    }

    tick();
}

// Begin the preload sequence on page load
preloadImages();



const title = document.getElementById("hero-title");
const subtitle = document.getElementById("hero-subtitle");
const desc = document.getElementById("hero-desc");

const texts = [
    {
        title: "Hello, I'm",
        subtitle: "Sanjeevni Kumari",
        desc: "Full Stack Developer"
    },
    {
        title: "I Build",
        subtitle: "Modern Websites",
        desc: "React • Node • MongoDB"
    },
    {
        title: "I Love",
        subtitle: "Artificial Intelligence",
        desc: "Machine Learning & Deep Learning"
    },
    {
        title: "Always",
        subtitle: "Learning New Things",
        desc: "Problem Solver"
    },
    {
        title: "Welcome",
        subtitle: "To My Portfolio",
        desc: "Scroll Down ↓"
    }
];

let current = -1;

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero-section");

    const progress = window.scrollY / hero.offsetHeight;

    let index = Math.floor(progress * texts.length);

    if (index >= texts.length)
        index = texts.length - 1;

    if (index != current) {

        current = index;

        title.classList.remove("show");
        subtitle.classList.remove("show");
        desc.classList.remove("show");

        title.classList.add("fade");
        subtitle.classList.add("fade");
        desc.classList.add("fade");

        setTimeout(() => {

            title.innerHTML = texts[index].title;
            subtitle.innerHTML = texts[index].subtitle;
            desc.innerHTML = texts[index].desc;

            title.classList.remove("fade");
            subtitle.classList.remove("fade");
            desc.classList.remove("fade");

            title.classList.add("show");
            subtitle.classList.add("show");
            desc.classList.add("show");

        }, 300);

    }

});


const heroContent = document.querySelector(".hero-content");
const scrollSpacer = document.getElementById("scroll-spacer");

window.addEventListener("scroll", () => {

    const heroEnd = scrollSpacer.offsetHeight - window.innerHeight;

    if (window.scrollY >= heroEnd) {
        heroContent.style.opacity = "0";
    } else {
        heroContent.style.opacity = "1";
    }

});
// const about = document.querySelector(".about-container");

// window.addEventListener("scroll",()=>{

//     if(window.scrollY > scrollSpacer.offsetHeight - 500){
//         about.classList.add("show");
//     }

// });
const about = document.querySelector(".about-section");

window.addEventListener("scroll", () => {

    const heroEnd = heroSection.offsetHeight - window.innerHeight;

    if (window.scrollY >= heroEnd - 100) {
        about.classList.add("show-bg");
    } else {
        about.classList.remove("show-bg");
    }

});

/* =====================================================
   EDUCATION HORIZONTAL TIMELINE SCROLL CONTROLLER
   ===================================================== */
const eduSection = document.getElementById("education");
const eduTrack = document.getElementById("edu-timeline-track");
const eduProgressFill = document.getElementById("edu-progress-fill");

function updateEducationTimeline() {
    if (!eduSection || !eduTrack || window.innerWidth <= 768) return;

    const rect = eduSection.getBoundingClientRect();
    const sectionHeight = eduSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate scroll distance within the education section
    const totalScrollable = sectionHeight - viewportHeight;
    const currentScroll = -rect.top;

    if (currentScroll >= 0 && currentScroll <= totalScrollable) {
        const progress = currentScroll / totalScrollable;

        // Calculate maximum horizontal scroll distance
        const maxTranslate = eduTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.2);
        const translateX = progress * maxTranslate;

        eduTrack.style.transform = `translateX(-${translateX}px)`;

        if (eduProgressFill) {
            eduProgressFill.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
        }
    } else if (currentScroll < 0) {
        eduTrack.style.transform = `translateX(0px)`;
        if (eduProgressFill) eduProgressFill.style.width = `0%`;
    } else {
        const maxTranslate = eduTrack.scrollWidth - window.innerWidth + (window.innerWidth * 0.2);
        eduTrack.style.transform = `translateX(-${maxTranslate}px)`;
        if (eduProgressFill) eduProgressFill.style.width = `100%`;
    }
}

window.addEventListener("scroll", updateEducationTimeline, { passive: true });
window.addEventListener("resize", updateEducationTimeline);

/* =====================================================
   3D STACKED SKILLS DECK CONTROLLER
   ===================================================== */
(function initSkillsDeck() {
    const deck = document.getElementById("skills-deck");
    const prevBtn = document.getElementById("deck-prev-btn");
    const nextBtn = document.getElementById("deck-next-btn");
    const dotsContainer = document.getElementById("deck-dots");

    if (!deck) return;

    const cards = Array.from(deck.querySelectorAll(".skill-stack-card"));
    let cardOrder = cards.map((_, i) => i); // [0, 1, 2, 3, 4]

    function applyPositions() {
        cards.forEach((card, originalIndex) => {
            const currentPos = cardOrder.indexOf(originalIndex);

            card.classList.remove("pos-0", "pos-1", "pos-2", "pos-3", "pos-4", "swiping-left", "swiping-right");
            card.classList.add(`pos-${currentPos}`);
        });

        // Update active pagination dot
        if (dotsContainer) {
            const activeCardIndex = cardOrder[0];
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, idx) => {
                if (idx === activeCardIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }
    }

    function rotateNext() {
        const topCardIndex = cardOrder[0];
        const topCard = cards[topCardIndex];

        topCard.classList.add("swiping-right");

        setTimeout(() => {
            const first = cardOrder.shift();
            cardOrder.push(first);
            applyPositions();
        }, 220);
    }

    function rotatePrev() {
        const last = cardOrder.pop();
        cardOrder.unshift(last);
        applyPositions();
    }

    // Button Listeners
    if (nextBtn) nextBtn.addEventListener("click", rotateNext);
    if (prevBtn) prevBtn.addEventListener("click", rotatePrev);

    // Dot click listeners
    if (dotsContainer) {
        dotsContainer.addEventListener("click", (e) => {
            const dot = e.target.closest(".dot");
            if (!dot) return;
            const targetIdx = parseInt(dot.getAttribute("data-dot"));
            const currentPos = cardOrder.indexOf(targetIdx);

            if (currentPos > 0) {
                for (let i = 0; i < currentPos; i++) {
                    const first = cardOrder.shift();
                    cardOrder.push(first);
                }
                applyPositions();
            }
        });
    }

    // Click on stacked card behind to bring to front
    cards.forEach((card, originalIdx) => {
        card.addEventListener("click", () => {
            const currentPos = cardOrder.indexOf(originalIdx);
            if (currentPos > 0) {
                for (let i = 0; i < currentPos; i++) {
                    const first = cardOrder.shift();
                    cardOrder.push(first);
                }
                applyPositions();
            }
        });
    });

    // Touch & Mouse Drag / Swipe Handling on Active Front Card
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    function handleStart(e) {
        if (!e.target.closest(".pos-0")) return;
        isDragging = true;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        currentX = startX;
    }

    function handleMove(e) {
        if (!isDragging) return;
        const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const deltaX = x - startX;
        currentX = x;

        const activeCard = cards[cardOrder[0]];
        if (activeCard && Math.abs(deltaX) > 10) {
            const rotate = deltaX * 0.05;
            activeCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg) scale(1)`;
        }
    }

    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = currentX - startX;
        const activeCard = cards[cardOrder[0]];

        if (activeCard) {
            activeCard.style.transform = "";
        }

        if (Math.abs(deltaX) > 50) {
            rotateNext();
        }
    }

    deck.addEventListener("mousedown", handleStart);
    deck.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    deck.addEventListener("touchstart", handleStart, { passive: true });
    deck.addEventListener("touchmove", handleMove, { passive: true });
    deck.addEventListener("touchend", handleEnd);

    // Initialize initial positions
    applyPositions();
})();

/* =====================================================
   PROJECTS CATEGORY FILTER CONTROLLER
   ===================================================== */
(function initProjectsFilter() {
    const filterBar = document.getElementById("projects-filter-bar");
    const grid = document.getElementById("projects-grid");

    if (!filterBar || !grid) return;

    const filterBtns = filterBar.querySelectorAll(".filter-btn");
    const cards = grid.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            cards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";

                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("hide");
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });
})();

/* =====================================================
   CONTACT FORM & UTILITY CONTROLLER
   ===================================================== */
(function initContactController() {
    const contactForm = document.getElementById("contact-form");
    const toast = document.getElementById("toast-notification");
    const copyBtn = document.getElementById("copy-email-btn");
    const emailText = document.getElementById("email-text");

    // Copy Email to Clipboard
    if (copyBtn && emailText) {
        copyBtn.addEventListener("click", () => {
            const textToCopy = emailText.innerText.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = "✓ Copied!";
                copyBtn.style.borderColor = "#00ffcc";
                copyBtn.style.color = "#00ffcc";
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2500);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    }

    // Form Submit Handler
    if (contactForm && toast) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Show Toast
            toast.classList.add("show");

            // Reset Form
            contactForm.reset();

            // Hide Toast after 4 seconds
            setTimeout(() => {
                toast.classList.remove("show");
            }, 4000);
        });
    }
})();