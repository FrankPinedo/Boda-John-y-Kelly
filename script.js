document.addEventListener('DOMContentLoaded', () => {
    
    // 1. APERTURA DE LA INVITACIÓN Y MÚSICA
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelope = document.getElementById('envelope');
    const flapTop = document.getElementById('flap-top');
    const waxSeal = document.getElementById('wax-seal');
    const letter = document.getElementById('letter');
    const openText = document.getElementById('open-text');
    const mainContent = document.getElementById('main-content');
    
    // Audio Player
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    
    let isPlaying = false;
    
    const initExperience = () => {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicIcon.classList.add('music-spinning'); // Efecto de disco girando
        }).catch(e => {
            console.log("Autoplay de audio evitado por el navegador.", e);
            isPlaying = false;
        });

        musicToggle.classList.remove('opacity-0', 'pointer-events-none');
        createLeaves();
    };

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicIcon.classList.remove('music-spinning');
        } else {
            bgMusic.play();
            isPlaying = true;
            musicIcon.classList.add('music-spinning');
        }
    });

    document.body.style.overflow = 'hidden';
    let isOpened = false;

    envelope.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        initExperience();

        openText.style.opacity = '0';
        waxSeal.style.opacity = '0';
        envelope.classList.remove('group'); 
        
        flapTop.classList.add('flap-open');
        
        setTimeout(() => {
            flapTop.style.zIndex = '15'; 
            
            letter.style.transform = 'translateY(-140px) scale(1.05)';
            letter.style.zIndex = '40';
            
            setTimeout(() => {
                envelopeOverlay.classList.add('opacity-0');
                
                setTimeout(() => {
                    envelopeOverlay.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    document.body.classList.remove('overflow-hidden');
                    document.body.style.overflow = '';
                    
                    requestAnimationFrame(() => {
                        mainContent.classList.remove('opacity-0');
                    });
                    
                }, 1000);
            }, 1000);
        }, 500);
    });

    // 2. EFECTO HOJAS CAYENDO SVG
    const createLeaves = () => {
        const container = document.getElementById('leaves-container');
        if (!container) return;
        
        const isMobile = window.innerWidth < 768;
        const numLeaves = isMobile ? 5 : 12; 
        
        const leafSVG1 = `<svg viewBox="0 0 25 25" width="25" height="25"><use href="#falling-leaf"></use></svg>`;
        const leafSVG2 = `<svg viewBox="0 0 25 25" width="25" height="25"><use href="#falling-leaf-alt"></use></svg>`;
        
        for (let i = 0; i < numLeaves; i++) {
            let leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.innerHTML = Math.random() > 0.5 ? leafSVG1 : leafSVG2;
            
            leaf.style.left = Math.random() * 100 + 'vw';
            leaf.style.animationDuration = (Math.random() * 20 + 20) + 's'; // Aún más lento (20 a 40s)
            leaf.style.animationDelay = (Math.random() * 15) + 's';
            
            // Rotación inicial base diferente
            const randomRotation = Math.random() * 360;
            leaf.querySelector('svg').style.transform = `rotate(${randomRotation}deg)`;
            
            container.appendChild(leaf);
        }
    };

    // 3. INTERSECTION OBSERVER
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 4. CONTADOR
    const targetDate = new Date(2026, 10, 14, 16, 0, 0).getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            if (daysEl) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (daysEl) {
            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minutesEl.innerText = minutes.toString().padStart(2, '0');
            secondsEl.innerText = seconds.toString().padStart(2, '0');
        }
    };
    
    updateCountdown(); 
    const countdownInterval = setInterval(updateCountdown, 1000);

    // 5. ACORDEONES
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.classList.add('open');
            } else {
                content.classList.remove('open');
            }
        });
    });

    // 6. COPIAR
    const copyBtns = document.querySelectorAll('.copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-copy');
            const textToCopy = document.getElementById(targetId).innerText.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyFeedback.classList.remove('opacity-0');
                setTimeout(() => {
                    copyFeedback.classList.add('opacity-0');
                }, 2000);
            });
        });
    });
});
