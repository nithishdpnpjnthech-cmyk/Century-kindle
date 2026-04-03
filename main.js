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

    // 4. Lead Form Handling with Google Sheets Integration
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        const messageEl = document.getElementById('leadFormMessage');

        const setFormMessage = (message, type) => {
            if (!messageEl) return;
            messageEl.textContent = message;
            messageEl.classList.remove('success', 'error');
            if (type) {
                messageEl.classList.add(type);
            }
        };

        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerText;
            const endpoint = (leadForm.dataset.sheetEndpoint || '').trim();
            const formData = new FormData(leadForm);
            const isSpreadsheetUrl = /docs\.google\.com\/spreadsheets\//i.test(endpoint);
            const isAppsScriptUrl = /^https:\/\/script\.google\.com\/macros\/s\/.+\/(exec|dev)(\?.*)?$/i.test(endpoint);

            if (formData.get('website')) {
                return;
            }

            if (!endpoint) {
                setFormMessage('Form is not configured yet. Please add your Google Sheets endpoint.', 'error');
                return;
            }

            if (isSpreadsheetUrl || !isAppsScriptUrl) {
                setFormMessage('Invalid endpoint. Use Apps Script Web App URL ending with /exec (or /dev for testing), not the sheet URL.', 'error');
                return;
            }

            btn.innerText = 'PROCESSING...';
            btn.disabled = true;
            setFormMessage('Submitting your details...', '');

            const payload = {
                fullName: String(formData.get('fullName') || '').trim(),
                phone: String(formData.get('phone') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                source: 'Century Kindle Website',
                submittedAt: new Date().toISOString()
            };

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                });

                let result = {};
                const responseText = await response.text();
                if (responseText) {
                    try {
                        result = JSON.parse(responseText);
                    } catch (_) {
                        result = {};
                    }
                }

                if (!response.ok || (result.status && result.status !== 'success')) {
                    throw new Error(result.message || 'Unable to submit form.');
                }

                setFormMessage('Thank you! Your request has been received. Our team will contact you shortly.', 'success');
                leadForm.reset();
            } catch (error) {
                const errMsg = error && error.message ? error.message : '';
                if (/Failed to fetch/i.test(errMsg)) {
                    setFormMessage('Could not reach endpoint. Check Apps Script deployment access is set to Anyone.', 'error');
                } else {
                    setFormMessage(errMsg || 'Submission failed. Please try again.', 'error');
                }
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
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
