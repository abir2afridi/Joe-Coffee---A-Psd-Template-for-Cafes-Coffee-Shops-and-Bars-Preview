// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeProductCards();
    initializeTestimonials();
    initializeSmoothScrolling();
    initializeParallaxEffects();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('menu-item')) {
                    animateMenuItems(entry.target);
                } else if (entry.target.classList.contains('product-card')) {
                    animateProductCard(entry.target);
                } else if (entry.target.classList.contains('testimonial')) {
                    animateTestimonial(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.menu-item, .product-card, .testimonial, .blog-post, .footer-section');
    animatedElements.forEach(el => observer.observe(el));
}

// Animate menu items with stagger effect
function animateMenuItems(menuItem) {
    const items = document.querySelectorAll('.menu-item');
    const index = Array.from(items).indexOf(menuItem);
    
    setTimeout(() => {
        menuItem.style.transform = 'translateY(0)';
        menuItem.style.opacity = '1';
    }, index * 100);
}

// Animate product cards
function animateProductCard(card) {
    setTimeout(() => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.opacity = '1';
    }, 200);
}

// Animate testimonials
function animateTestimonial(testimonial) {
    const stars = testimonial.querySelector('.stars');
    const text = testimonial.querySelector('p');
    const author = testimonial.querySelector('.author');
    
    setTimeout(() => {
        stars.style.opacity = '1';
        stars.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        text.style.opacity = '1';
        text.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        author.style.opacity = '1';
        author.style.transform = 'translateY(0)';
    }, 500);
}

// Form handling
function initializeFormHandling() {
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission(this);
        });
        
        // Form validation
        const inputs = bookingForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove existing error styling
    input.classList.remove('error');
    
    // Validation rules
    if (input.hasAttribute('required') && !value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        showInputError(input, 'Please enter a valid email address');
        return false;
    }
    
    if (input.type === 'tel' && value && !isValidPhone(value)) {
        showInputError(input, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showInputError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    input.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function handleBookingSubmission(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Show success message
        showBookingSuccess();
        form.reset();
    } else {
        // Show error message
        showBookingError('Please correct the errors above');
    }
}

function showBookingSuccess() {
    const message = createMessageElement('Thank you! Your table reservation has been submitted successfully. We will contact you shortly to confirm your booking.', 'success');
    showMessage(message);
}

function showBookingError(text) {
    const message = createMessageElement(text, 'error');
    showMessage(message);
}

function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `booking-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${text}</span>
            <button class="close-message">&times;</button>
        </div>
    `;
    
    // Styling
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1001;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    return messageDiv;
}

function showMessage(messageElement) {
    document.body.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    const closeBtn = messageElement.querySelector('.close-message');
    closeBtn.addEventListener('click', () => {
        removeMessage(messageElement);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeMessage(messageElement);
    }, 5000);
}

function removeMessage(messageElement) {
    messageElement.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 300);
}

// Product cards interactivity
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const button = card.querySelector('button');
        
        if (button) {
            button.addEventListener('click', function() {
                handleProductAction(this, card);
            });
        }
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('featured')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

function handleProductAction(button, card) {
    const productName = card.querySelector('h3').textContent;
    const isOrderNow = button.textContent.includes('ORDER NOW');
    
    // Add ripple effect
    addRippleEffect(button);
    
    if (isOrderNow) {
        showProductOrder(productName);
    } else {
        showAddToCart(productName);
    }
}

function addRippleEffect(button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showProductOrder(productName) {
    const message = createMessageElement(`Great choice! ${productName} order process initiated. Redirecting to checkout...`, 'success');
    showMessage(message);
}

function showAddToCart(productName) {
    const message = createMessageElement(`${productName} has been added to your cart!`, 'success');
    showMessage(message);
}

// Testimonials functionality
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    testimonials.forEach((testimonial, index) => {
        // Add stagger animation delay
        testimonial.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effects
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(139, 69, 19, 0.2)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(139, 69, 19, 0.1)';
        });
    });
}

// Parallax effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.discover-flavours');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.backgroundPosition = `center ${rate}px`;
        });
        
        // Coffee beans animation based on scroll
        animateCoffeeBeansOnScroll(scrolled);
    });
}

function animateCoffeeBeansOnScroll(scrolled) {
    const beans = document.querySelectorAll('.bean');
    
    beans.forEach((bean, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        const rotation = scrolled * 0.1 + (index * 60);
        
        bean.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat .number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Initialize counter animation when stats section is visible
function initializeCounters() {
    const statsSection = document.querySelector('.hero-stats');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Menu item hover effects
function initializeMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.item-icon img');
            const price = this.querySelector('.item-price');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            if (price) {
                price.style.color = '#8B4513';
                price.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.item-icon img');
            const price = this.querySelector('.item-price');
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            if (price) {
                price.style.color = '#D2B48C';
                price.style.transform = 'scale(1)';
            }
        });
    });
}

// Blog post interactions
function initializeBlogInteractions() {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        post.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showBlogPreview(title);
        });
    });
}

function showBlogPreview(title) {
    const message = createMessageElement(`Opening blog post: "${title}". This would normally navigate to the full article.`, 'success');
    showMessage(message);
}

// Initialize all interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeMenuInteractions();
    initializeBlogInteractions();
    initializeLazyLoading();
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        background: rgba(139, 69, 19, 0.98);
        box-shadow: 0 2px 20px rgba(139, 69, 19, 0.3);
    }
    
    .nav-menu a.active {
        color: #D2B48C !important;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .menu-item .item-icon img,
    .menu-item .item-price {
        transition: all 0.3s ease;
    }
    
    .blog-post {
        cursor: pointer;
    }
`;
document.head.appendChild(style);