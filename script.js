document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. ENVELOPE ANIMATION & AUDIO INITIATION
       ========================================================================= */
    const envelopeScene = document.getElementById('envelope-scene');
    const envelopeStage = document.getElementById('envelope-stage');
    const envelopeFlap = document.getElementById('envelope-flap');
    const innerLetter = document.getElementById('inner-letter');
    const envelopeSeal = document.getElementById('envelope-seal');
    const mainContent = document.getElementById('main-content');
    const innerMonogram = document.getElementById('inner-monogram');
    const body = document.body;
    const bgAudio = document.getElementById('bg-audio');
    const audioControl = document.getElementById('audio-control');
    let isEnvelopeOpen = false;

    const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg>`;
    const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
    </svg>`;

    bgAudio.volume = 0.4;

    envelopeScene.addEventListener('click', () => {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;
        
        // Remove pulse
        envelopeSeal.classList.remove('seal-pulse');
        
        // Open flap
        envelopeFlap.classList.add('open');

        // Step 1: Slide up slightly
        setTimeout(() => {
            innerLetter.classList.add('slide-up');
        }, 300);

        // Step 2: Extract inner letter to fixed position and expand
        setTimeout(() => {
            // Hide monogram inside letter so it doesn't scale weirdly
            if(innerMonogram) innerMonogram.style.opacity = '0';
            
            // Drop envelope wrapper away
            envelopeScene.classList.add('envelope-slide-down');
            
            // Get current dimensions to start smooth transition
            const rect = innerLetter.getBoundingClientRect();
            innerLetter.style.position = 'fixed';
            innerLetter.style.top = rect.top + 'px';
            innerLetter.style.left = rect.left + 'px';
            innerLetter.style.width = rect.width + 'px';
            innerLetter.style.height = rect.height + 'px';
            innerLetter.style.zIndex = '60';
            innerLetter.style.margin = '0';
            innerLetter.classList.remove('slide-up');
            innerLetter.style.transform = 'none';
            
            // Force reflow
            void innerLetter.offsetWidth;
            
            // Animate to full screen
            innerLetter.style.transition = 'all 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            innerLetter.style.top = '0px';
            innerLetter.style.left = '0px';
            innerLetter.style.width = '100%';
            innerLetter.style.height = '100vh';
            innerLetter.style.borderRadius = '0px';
            innerLetter.style.boxShadow = 'none';
            innerLetter.style.border = 'none';
            
        }, 1200);

        // Step 3: Reveal main content seamlessly
        setTimeout(() => {
            envelopeStage.style.opacity = '0';
            envelopeStage.style.pointerEvents = 'none';
            
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.style.opacity = '1';
                body.classList.remove('no-scroll');
            }, 50);

            bgAudio.play().then(() => {
                audioControl.innerHTML = pauseIcon;
                audioControl.classList.add('visible');
            }).catch(e => {
                audioControl.innerHTML = playIcon;
                audioControl.classList.add('visible', 'muted');
            });
            
        }, 2200);
        
        setTimeout(() => {
            envelopeStage.style.display = 'none';
            innerLetter.style.display = 'none'; // Background is now body
        }, 3500);
    });

    audioControl.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play();
            audioControl.innerHTML = pauseIcon;
            audioControl.classList.remove('muted');
        } else {
            bgAudio.pause();
            audioControl.innerHTML = playIcon;
            audioControl.classList.add('muted');
        }
    });

    /* =========================================================================
       2. REVEAL ON SCROLL (LATER TRIGGER FOR SMOOTHNESS)
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -15% 0px" // Trigger when element is well inside viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* =========================================================================
       3. COUNTDOWN TIMER
       ========================================================================= */
    const countDownDate = new Date("Nov 14, 2026 16:00:00").getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("mins");
    const secsEl = document.getElementById("secs");

    const updateCountdown = () => {
        if (!daysEl) return;
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minsEl.innerText = "00";
            secsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days.toString().padStart(2, '0');
        hoursEl.innerText = hours.toString().padStart(2, '0');
        minsEl.innerText = minutes.toString().padStart(2, '0');
        secsEl.innerText = seconds.toString().padStart(2, '0');
    };

    updateCountdown(); 
    setInterval(updateCountdown, 1000);

    /* =========================================================================
       4. ACCORDION (GIFTS SECTION)
       ========================================================================= */
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            accordionBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    /* =========================================================================
       5. CONTINUOUS FALLING PETALS (IMAGE BASED)
       ========================================================================= */
    const petalsContainer = document.getElementById('petals-container');
    const numberOfPetals = 6;

    for (let i = 0; i < numberOfPetals; i++) {
        createPetal(i);
    }

    function createPetal(index) {
        const petal = document.createElement('img');
        petal.src = './assets/petalo.png';
        petal.classList.add('petal');
        
        const left = Math.random() * 100;
        const size = Math.random() * 15 + 15; // Width 15px to 30px
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10; // Slow fall: 10s to 20s

        petal.style.width = `${size}px`;
        petal.style.height = `auto`;
        petal.style.opacity = '0'; 

        petal.style.left = `${left}vw`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;

        petalsContainer.appendChild(petal);
    }
});
