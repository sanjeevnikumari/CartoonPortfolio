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