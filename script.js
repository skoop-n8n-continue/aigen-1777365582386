document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    const updateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
    };

    setInterval(updateTime, 1000);
    updateTime();

    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const progressBar = document.getElementById('progress-bar');

    const slideDuration = 12000; // 12 seconds per slide
    let currentSlide = 0;
    let startTime = null;
    let animationFrameId = null;
    let isTransitioning = false;

    const showSlide = (index) => {
        if (isTransitioning) return;
        isTransitioning = true;

        // Store old slide index to properly clean it up
        const oldSlide = currentSlide;

        // Remove active class from current slide
        slides[oldSlide].classList.remove('slide-active');
        slides[oldSlide].classList.add('slide-exit');
        dots[oldSlide].classList.remove('active');

        // Update current slide
        currentSlide = index;

        // Wait for exit animation, then show new
        setTimeout(() => {
            slides[oldSlide].classList.remove('slide-exit');

            // Add active class to new slide
            slides[currentSlide].classList.add('slide-active');
            dots[currentSlide].classList.add('active');

            // Reset progress bar
            startTime = performance.now();
            isTransitioning = false;
        }, 800); // Wait for transition duration defined in CSS
    };

    const nextSlide = () => {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    };

    const updateProgress = (timestamp) => {
        if (!startTime) startTime = timestamp;

        // Don't update progress during transitions
        if (!isTransitioning) {
            const elapsed = timestamp - startTime;
            const progress = Math.min((elapsed / slideDuration) * 100, 100);

            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                nextSlide();
            }
        }

        animationFrameId = requestAnimationFrame(updateProgress);
    };

    // Start slideshow
    startTime = performance.now();
    animationFrameId = requestAnimationFrame(updateProgress);
});