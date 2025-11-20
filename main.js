// ============================================
// AI PORTFOLIO - COMPLETE WITH MAGNETIC 3D EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ============ Global Variables ============
    const loader = document.getElementById('loader');
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progress-bar');
    const backToTop = document.getElementById('back-to-top');
    const themeToggle = document.getElementById('theme-toggle');
    const motionToggle = document.getElementById('motion-toggle');
    const seeMoreSkills = document.getElementById('see-more-skills');
    const minimizeSkills = document.getElementById('minimize-skills');
    const seeMoreProjects = document.getElementById('see-more-projects');
    const minimizeProjects = document.getElementById('minimize-projects');
    const seeMoreCerts = document.getElementById('see-more-certs');
    const minimizeCerts = document.getElementById('minimize-certs');
    const contactForm = document.getElementById('contact-form');

    // Motion preference
    let motionEnabled = localStorage.getItem('motionEnabled') !== 'false';

    // ============ Initialize AOS ============
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            offset: 50,
            easing: 'ease-in-out',
            disable: !motionEnabled
        });
    }

    // ============ Loading Screen ============
    let loaderHidden = false;

    function hideLoader() {
        if (loaderHidden) return;
        loaderHidden = true;

        if (loader) {
            loader.classList.add('hide');
        }
        document.body.style.overflow = 'visible';

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        if (typeof gsap !== 'undefined' && motionEnabled) {
            initGSAPAnimations();
        }
    }

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 1000);
    });

    setTimeout(hideLoader, 3000);

    // ============ 3D Particle System ============
    const canvas = document.getElementById('particle-canvas');
    if (canvas && motionEnabled) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 2;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 2 - 1) * 0.5;
                this.speedY = (Math.random() * 2 - 1) * 0.5;
                this.speedZ = (Math.random() * 0.02 - 0.01);
                this.color = `rgba(${Math.random() > 0.5 ? '30, 144, 255' : '255, 165, 0'}, ${(Math.random() * 0.5 + 0.3).toFixed(2)})`;
            }

            update() {
                this.x += this.speedX * (this.z + 1);
                this.y += this.speedY * (this.z + 1);
                this.z += this.speedZ;

                if (this.z > 2) this.z = 2;
                if (this.z < 0) this.z = 0;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150 * (this.z + 1);

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const forceX = (dx / distance) * force * 2;
                    const forceY = (dy / distance) * force * 2;
                    this.speedX -= forceX * 0.5;
                    this.speedY -= forceY * 0.5;
                }

                this.speedX *= 0.99;
                this.speedY *= 0.99;
                const maxSpeed = 1.5;
                const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
                if (speed > maxSpeed) {
                    this.speedX = (this.speedX / speed) * maxSpeed;
                    this.speedY = (this.speedY / speed) * maxSpeed;
                }
            }

            draw() {
                const opacity = (this.z + 1) / 3;
                const size = this.size * (this.z + 1);
                ctx.fillStyle = this.color.replace(/[\d.]+\)/, `${opacity})`);
                ctx.beginPath();
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(150, (canvas.width * canvas.height) / 8000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.3;
                        ctx.strokeStyle = `rgba(30, 144, 255, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // ============ Cursor Trail ============
    const cursorTrail = document.getElementById('cursor-trail');
    if (cursorTrail && window.matchMedia("(hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursorTrail.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        });
    }

    // ============ Progress Bar ============
    function updateProgressBar() {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    window.addEventListener('scroll', updateProgressBar);

    // ============ Navbar Scroll Effect ============
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============ Mobile Navigation ============
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ============ Active Nav Link ============
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ============ Typing Effect ============
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = [
            'Space & BioAI Research Engineer',
            'Computational Biology Researcher',
            'Space Systems Data Scientist',
            'Neurotech & Bioelectronics Research Engineer',
            'Life Sciences & Materials Researcher'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    // ============ Theme Toggle ============
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // ============ Motion Toggle ============
    if (motionToggle) {
        motionToggle.addEventListener('click', () => {
            motionEnabled = !motionEnabled;
            localStorage.setItem('motionEnabled', motionEnabled);
            
            if (typeof AOS !== 'undefined') {
                if (motionEnabled) {
                    AOS.init();
                } else {
                    document.querySelectorAll('[data-aos]').forEach(el => {
                        el.classList.remove('aos-animate');
                    });
                }
            }
            
            const icon = motionToggle.querySelector('i');
            icon.className = motionEnabled ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // ============ Skills Toggle ============
    if (seeMoreSkills) {
        seeMoreSkills.addEventListener('click', () => {
            document.querySelectorAll('.skill-category.hidden-skill').forEach(skill => {
                skill.style.display = 'block';
                skill.classList.remove('hidden-skill');
            });
            seeMoreSkills.classList.add('hidden');
            minimizeSkills.classList.remove('hidden');
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    }

    if (minimizeSkills) {
        minimizeSkills.addEventListener('click', () => {
            const hiddenSkills = document.querySelectorAll('.skill-category:not(.hidden-skill)');
            hiddenSkills.forEach((skill, index) => {
                if (index > 0) {
                    skill.style.display = 'none';
                    skill.classList.add('hidden-skill');
                }
            });
            minimizeSkills.classList.add('hidden');
            seeMoreSkills.classList.remove('hidden');
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ============ Projects Toggle ============
    if (seeMoreProjects) {
        seeMoreProjects.addEventListener('click', () => {
            document.querySelectorAll('.project-card.secondary-project').forEach(project => {
                project.classList.remove('secondary-project');
            });
            seeMoreProjects.classList.add('hidden');
            minimizeProjects.classList.remove('hidden');
            if (typeof AOS !== 'undefined') AOS.refresh();
            
            // Re-initialize 3D effects for newly visible cards
            setTimeout(init3DEffects, 100);
        });
    }

    if (minimizeProjects) {
        minimizeProjects.addEventListener('click', () => {
            const allProjects = document.querySelectorAll('.project-card');
            allProjects.forEach((project, index) => {
                if (index >= 3) {
                    project.classList.add('secondary-project');
                }
            });
            minimizeProjects.classList.add('hidden');
            seeMoreProjects.classList.remove('hidden');
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ============ Certifications Toggle ============
    if (seeMoreCerts) {
        seeMoreCerts.addEventListener('click', () => {
            document.querySelectorAll('.certification-card.hidden-cert').forEach(cert => {
                cert.style.display = 'block';
                cert.classList.remove('hidden-cert');
            });
            seeMoreCerts.classList.add('hidden');
            minimizeCerts.classList.remove('hidden');
            if (typeof AOS !== 'undefined') AOS.refresh();
            
            // Re-initialize 3D effects for newly visible cards
            setTimeout(init3DEffects, 100);
        });
    }

    if (minimizeCerts) {
        minimizeCerts.addEventListener('click', () => {
            const allCerts = document.querySelectorAll('.certification-card');
            allCerts.forEach((cert, index) => {
                if (index >= 3) {
                    cert.style.display = 'none';
                    cert.classList.add('hidden-cert');
                }
            });
            minimizeCerts.classList.add('hidden');
            seeMoreCerts.classList.remove('hidden');
            document.getElementById('certifications').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ============ Contact Form ============
    if (contactForm) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzMgAePb3b356XxG91zyNuVrGwzybWb_1_e0pt5yvTpxvADkznhn005EPiFC0nFRKvO/exec';
        const msg = document.getElementById('msg');
        
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            
            fetch(scriptURL, { method: 'POST', body: new FormData(contactForm)})
                .then(response => {
                    if (msg) {
                        msg.innerHTML = "Message sent successfully! I'll get back to you soon.";
                        msg.classList.add('success');
                        setTimeout(() => {
                            msg.innerHTML = "";
                            msg.classList.remove('success');
                        }, 5000);
                    }
                    contactForm.reset();
                })
                .catch(error => {
                    if (msg) {
                        msg.innerHTML = "Error sending message. Please try again.";
                        msg.classList.add('error');
                        setTimeout(() => {
                            msg.innerHTML = "";
                            msg.classList.remove('error');
                        }, 5000);
                    }
                    console.error('Error!', error.message);
                });
        });
    }

    // ============ Back to Top Button ============
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============ GSAP Animations ============
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Skill cards animation
        gsap.utils.toArray('.skill-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8
            });
        });

        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1
            });
        });
    }

    // ============ MAGNETIC 3D EFFECTS ============
    function init3DEffects() {
        // Skip on touch devices
        if ('ontouchstart' in window) return;
        
        // ===== ALL CARDS GET 3D TILT EFFECTS =====
        const cardSelectors = [
            '.project-card', '.skill-card', '.certification-card',
            '.card', '.grid-item'
        ];
        
        const cards = document.querySelectorAll(cardSelectors.join(', '));
        
        cards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            
            card.addEventListener('mousemove', (e) => {
                if (!motionEnabled) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / rect.height) * -6;
                const rotateY = ((x - rect.width / 2) / rect.width) * 6;
                card.style.transition = 'none';
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        });
        
        // ===== HERO BUTTONS - MAGNETIC EFFECT =====
        const heroButtons = document.querySelectorAll('.hero-cta .btn');
        heroButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                if (!motionEnabled) return;
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
                btn.style.transition = 'none';
                btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                btn.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
        
        // ===== ALL OTHER BUTTONS =====
        const buttonSelectors = [
            '.btn-primary', '.btn-secondary', '.btn-outline',
            '.project-links a', '.cert-link'
        ];
        
        const buttons = document.querySelectorAll(buttonSelectors.join(', '));
        buttons.forEach(btn => {
            if (btn.closest('.hero-cta')) return;
            
            btn.addEventListener('mousemove', (e) => {
                if (!motionEnabled) return;
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
                btn.style.transition = 'none';
                btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
                btn.style.transform = '';
            });
        });
        
        // ===== ICONS =====
        const iconSelectors = [
            '.social-link', '.skill-icon', '.project-icon'
        ];
        
        const icons = document.querySelectorAll(iconSelectors.join(', '));
        icons.forEach(icon => {
            icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            icon.addEventListener('mouseenter', () => {
                if (motionEnabled) {
                    icon.style.transform = 'rotateY(360deg) scale(1.15)';
                }
            });
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });
    }
    
    // Initialize 3D effects after delay
    setTimeout(init3DEffects, 2000);

    // ============ Smooth Scroll ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============ Initialize ============
    setActiveNavLink();
    updateProgressBar();
    console.log('🚀 AI Portfolio initialized successfully!');

    // ============ Tech Stack Progress Bar Animation ============
    const animateTechProgress = () => {
        const techCards = document.querySelectorAll('.tech-card');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.tech-progress-fill');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress');
                        // Small delay for smoother animation
                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 200);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        techCards.forEach(card => observer.observe(card));
    };
    
    // Initialize tech stack animations
    if (document.querySelector('.tech-stack-section')) {
        animateTechProgress();
    }


  /* === AOS/ScrollTrigger refresh after Show More/Less (append-only fix) === */
  (function () {
    function refreshAll() {
      try {
        if (window.AOS && typeof AOS.refreshHard === "function") {
          AOS.refreshHard();                // for DOM changes
        } else if (window.AOS && typeof AOS.refresh === "function") {
          AOS.refresh();
        }
        if (window.ScrollTrigger && typeof ScrollTrigger.refresh === "function") {
          ScrollTrigger.refresh(true);
        }
        requestAnimationFrame(function () {
          window.dispatchEvent(new Event("resize"));
          window.dispatchEvent(new Event("scroll"));
        });
      } catch (e) {}
    }

    // Add lightweight listeners alongside your existing ones
    try { seeMoreSkills?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
    try { minimizeSkills?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
    try { seeMoreProjects?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
    try { minimizeProjects?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
    try { seeMoreCerts?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
    try { minimizeCerts?.addEventListener('click', () => setTimeout(refreshAll, 60)); } catch (e) {}
  })();


}); // End of DOMContentLoaded
