document.addEventListener('DOMContentLoaded', () => {
    // 0a. Urgency Banner Logic
    const banner = document.getElementById('urgency-banner');
    const closeBannerBtn = document.getElementById('close-banner');
    if (banner && closeBannerBtn) {
        // Check if previously dismissed
        if (!sessionStorage.getItem('urgencyBannerDismissed')) {
            banner.classList.add('show');
            // Adjust header top to match banner height
            const header = document.getElementById('header');
            if(header) {
                const bannerHeight = banner.offsetHeight;
                header.style.top = bannerHeight + 'px';
            }
        }

        closeBannerBtn.addEventListener('click', () => {
            banner.classList.remove('show');
            sessionStorage.setItem('urgencyBannerDismissed', 'true');
            // Reset header top
            const header = document.getElementById('header');
            if(header) header.style.top = '0';
        });
    }

    // 0b. Stats Counter Logic
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    if (statsSection && statNumbers.length > 0) {
        const countUp = () => {
            statNumbers.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCounter();
            });
        };

        const checkStatsScroll = () => {
            if (hasCounted) return;
            const windowHeight = window.innerHeight;
            const elementTop = statsSection.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                hasCounted = true;
                countUp();
            }
        };

        window.addEventListener('scroll', checkStatsScroll);
        checkStatsScroll(); // Check on load
    }

    // 0. Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // 1. Loading Screen
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.style.overflow = 'auto'; // allow scrolling after load
    }, 2500); // 2.5 seconds loading

    // Initial state
    document.body.style.overflow = 'hidden';

    // 2. Sticky Navigation & Active Link Highlighting
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 4. Parallax Effect on Hero
    const heroBg = document.getElementById('hero-bg');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            // Move background slightly slower than scroll
            // Since top is 0, translateY creates parallax
            if(heroBg) heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });


    // 6. Gallery Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    // Delay slightly to allow transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 400);
                }
            });
            // trigger scroll reveal again to ensure positioning
            setTimeout(revealOnScroll, 450);
        });
    });

    // 7. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const internalImg = item.querySelector('img.gallery-img');
            
            if (lightboxImg && internalImg) {
                lightboxImg.src = internalImg.src;
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 8. Testimonials Infinite Scroll Duplicate
    const testimonialTrack = document.querySelector('.testimonial-track');
    if (testimonialTrack) {
        // Clone all inner cards
        const cards = Array.from(testimonialTrack.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            testimonialTrack.appendChild(clone);
        });
    }

    // 9. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');

            // Close all other
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isOpen) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 10. Back to top logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. WhatsApp Booking Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check validation
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            // Collect form data
            const name = document.getElementById('booking-name').value;
            const phone = document.getElementById('booking-phone').value;
            const email = document.getElementById('booking-email').value;
            const type = document.getElementById('booking-type').value;
            const date = document.getElementById('booking-date').value;
            const venue = document.getElementById('booking-venue').value;
            const guests = document.getElementById('booking-guests').value || 'Not specified';
            const requests = document.getElementById('booking-requests').value || 'None';

            // Construct WhatsApp Message
            let message = `*New Booking Inquiry - Shubhamasthu Events*\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Phone:* ${phone}\n`;
            message += `*Email:* ${email}\n`;
            message += `*Event Type:* ${type}\n`;
            message += `*Event Date:* ${date}\n`;
            message += `*Venue:* ${venue}\n`;
            message += `*Guests:* ${guests}\n`;
            message += `*Vision/Requests:* ${requests}\n`;

            // WhatsApp Number
            const whatsappNumber = "917483773137"; 
            
            // Encode and Redirect to WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset form and notify user
            showToast('Success! Redirecting to WhatsApp...');
            bookingForm.reset();
        });
    }

    // 11b. Star Rating Logic
    const stars = document.querySelectorAll('.star-rating-input .star');
    const ratingInput = document.getElementById('review-rating');

    if (stars.length > 0 && ratingInput) {
        // Init default 5 stars
        stars.forEach(star => star.classList.add('active'));

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = parseInt(star.getAttribute('data-value'));
                ratingInput.value = value;
                
                // Update active state
                stars.forEach(s => {
                    const sValue = parseInt(s.getAttribute('data-value'));
                    if (sValue <= value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    // 11c. Review Form Submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Check validation
            if (!reviewForm.checkValidity()) {
                reviewForm.reportValidity();
                return;
            }

            // Collect form data
            const name = document.getElementById('review-name').value;
            const eventType = document.getElementById('review-event').value;
            const rating = document.getElementById('review-rating').value;
            const feedback = document.getElementById('review-text').value;

            // Construct WhatsApp Message
            let message = `*New Customer Review - Shubhamasthu Events*\n\n`;
            message += `*Name:* ${name}\n`;
            message += `*Event:* ${eventType}\n`;
            message += `*Rating:* ${rating}/5 Stars\n`;
            message += `*Feedback:* ${feedback}\n`;

            // WhatsApp Number
            const whatsappNumber = "917483773137"; 
            
            // Encode and Redirect to WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset form and notify user
            showToast('Thank you! Redirecting to WhatsApp...');
            reviewForm.reset();
            
            // Reset stars to default (5)
            if(stars.length > 0) stars.forEach(s => s.classList.add('active'));
            if(ratingInput) ratingInput.value = 5;
        });
    }

    // 12. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follow
        function render() {
            posX += (mouseX - posX) * 0.15;
            posY += (mouseY - posY) * 0.15;
            
            follower.style.left = posX + 'px';
            follower.style.top = posY + 'px';
            
            requestAnimationFrame(render);
        }
        render();

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .gallery-item, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 13. Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        if (currentYear > 2025) {
            yearSpan.textContent = `2025–${currentYear}`;
        }
    }

    // 14. Service Link Pre-fill Logic
    const serviceLinks = document.querySelectorAll('.service-link');
    const bookingTypeSelect = document.getElementById('booking-type');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', () => {
            const eventType = link.getAttribute('data-event');
            if (eventType && bookingTypeSelect) {
                bookingTypeSelect.value = eventType;
            }
        });
    });

    // 15. Toast Notification Logic
    function showToast(message) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});
