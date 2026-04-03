// Century Kindle - Premium Interactivity

document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }

    // 2. Navbar Scroll Effect
    const nav = document.querySelector('.micro-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scroll for Navigation and Buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Lead Form Handling with Modern UI Feedback
    const leadForm = document.querySelector('.lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'PROCESSING...';
            btn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                alert('Success! Our luxury consultant will reach out to you shortly.');
                btn.innerText = originalText;
                btn.disabled = false;
                leadForm.reset();
            }, 1500);
        });
    }

    // 5. Scroll Reveal for Elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .section-title, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });
});

// 6. Floor Plan Switching Logic
function showFloorPlan(type) {
    const img = document.getElementById('floorPlanImg');
    const buttons = document.querySelectorAll('.tab-btn');
    
    // Update active button state
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(type)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Smooth image transition
    if (img) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.98)';
        setTimeout(() => {
            const imageMap = {
                '2bhk': 'assets/media/2BHK-Homes.jpg',
                '3bhk': 'assets/media/3BHK-Homes.jpg',
                '4bhk': 'assets/media/4BHK-Homes.jpg'
            };
            img.src = imageMap[type] || 'assets/media/2BHK-Homes.jpg';
            img.alt = `${type.toUpperCase()} Floor Plan`;
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 300);
    }
}
