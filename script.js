document.addEventListener('DOMContentLoaded', function() {
    
    initNavigation();
    
    initCarousel();
    
    initProductFiltering();
    
    initContactForm();
    
    initSmoothScrolling();
    
    initScrollAnimations();
    
    loadCartCount();
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        }
    });
}

function initCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    window.changeSlide = function(direction) {
        currentSlide += direction;
        
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        
        showSlide(currentSlide);
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    setInterval(function() {
        changeSlide(1);
    }, 5000);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
}

function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-category');
            
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            this.style.animation = 'bounce 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.style.transform = 'scale(0.95)';
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #a8d0d7, #d4a5a5)';
            
            setTimeout(() => {
                this.innerHTML = 'Add to Cart';
                this.style.transform = 'scale(1)';
                this.style.background = '';
            }, 2000);
            
            showNotification('Item added to cart!');
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        showNotification('Your message is being sent...');
        
        // Reset button after 3 seconds in case FormSubmit redirect takes time
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
        
        // The form will submit normally to FormSubmit.co
    });
    
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}

function initSmoothScrolling() {
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
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                if (entry.target.classList.contains('feature-card') ||
                    entry.target.classList.contains('product-card') ||
                    entry.target.classList.contains('value-card')) {
                    
                    const siblings = entry.target.parentElement.children;
                    Array.from(siblings).forEach((sibling, index) => {
                        if (sibling.classList.contains(entry.target.classList[0])) {
                            setTimeout(() => {
                                sibling.style.opacity = '1';
                                sibling.style.transform = 'translateY(0)';
                            }, index * 100);
                        }
                    });
                }
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
        '.feature-card, .product-card, .value-card, .contact-method, .quick-link-card, .faq-item, .stat'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d1ecf1, #f8d7da);
        color: #5a5a5a;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function createFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-bg-element';
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 60 + 20}px;
            height: ${Math.random() * 60 + 20}px;
            background: radial-gradient(circle, rgba(248, 215, 218, 0.3), rgba(226, 213, 247, 0.3));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
            z-index: 1;
        `;
        
        hero.appendChild(element);
    }
}

createFloatingElements();

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const speed = scrolled * 0.5;
        hero.style.transform = `translateY(${speed}px)`;
    }
});

const bounceKeyframes = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
`;

const style = document.createElement('style');
style.textContent = bounceKeyframes;
document.head.appendChild(style);

function addImageLoadingEffect() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productImage = card.querySelector('.product-image');
        
        if (productImage) {
            productImage.style.background = `
                linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%),
                ${productImage.style.background || 'linear-gradient(135deg, var(--primary-mint), var(--primary-peach))'}
            `;
            productImage.style.backgroundSize = '200% 100%, 100% 100%';
            productImage.style.animation = 'shimmer 2s infinite';
        }
    });
}

const shimmerKeyframes = `
    @keyframes shimmer {
        0% {
            background-position: -200% 0, 0 0;
        }
        100% {
            background-position: 200% 0, 0 0;
        }
    }
`;

const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = shimmerKeyframes;
document.head.appendChild(shimmerStyle);

addImageLoadingEffect();

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.product-card, .feature-card, .value-card, .quick-link-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        heroTitle.textContent += text.charAt(i);
        i++;
        
        if (i > text.length) {
            clearInterval(typeInterval);
        }
    }, 100);
}

setTimeout(addTypingEffect, 500);

let slideshowInstances = [];

function initProductSlideshow() {
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    
    slideshowContainers.forEach((container, index) => {
        const slides = container.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');
        
        if (slides.length > 0) {
            const instance = {
                container: container,
                slides: slides,
                dots: dots,
                currentIndex: 1,
                maxSlides: slides.length,
                interval: null
            };
            
            slideshowInstances[index] = instance;
            
            // Start auto slideshow
            instance.interval = setInterval(() => {
                instance.currentIndex++;
                if (instance.currentIndex > instance.maxSlides) {
                    instance.currentIndex = 1;
                }
                showSlide(instance.currentIndex, index);
            }, 2000);
        }
    });
}

function currentSlide(n, slideshowIndex = 0) {
    if (slideshowInstances[slideshowIndex]) {
        showSlide(slideshowInstances[slideshowIndex].currentIndex = n, slideshowIndex);
    }
}

function showSlide(n, slideshowIndex = 0) {
    const instance = slideshowInstances[slideshowIndex];
    if (!instance) return;
    
    const { slides, dots } = instance;
    
    if (n > slides.length) { instance.currentIndex = 1; }
    if (n < 1) { instance.currentIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[instance.currentIndex - 1]) {
        slides[instance.currentIndex - 1].classList.add('active');
    }
    if (dots[instance.currentIndex - 1]) {
        dots[instance.currentIndex - 1].classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.slideshow-container')) {
        initProductSlideshow();
    }
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('theAdorableCart')) || [];

function loadCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function addToCart(productName, price) {
    const item = {
        id: Date.now(),
        name: productName,
        price: price
    };
    cart.push(item);
    localStorage.setItem('theAdorableCart', JSON.stringify(cart));
    loadCartCount();
    showCartNotification();
}

function showCartNotification() {
    // Simple alert for now - can be enhanced with custom toast
    alert('Item added to cart!');
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal.style.display === 'none' || !cartModal.style.display) {
        displayCartItems();
        cartModal.style.display = 'block';
    } else {
        cartModal.style.display = 'none';
    }
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-medium); padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = 'Total: ₹0';
        buyNowBtn.disabled = true;
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
        
        // Calculate total (remove ₹ symbol and convert to number)
        const priceNumber = parseInt(item.price.replace('₹', ''));
        total += priceNumber;
    });
    
    cartTotal.textContent = `Total: ₹${total}`;
    buyNowBtn.disabled = false;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('theAdorableCart', JSON.stringify(cart));
    loadCartCount();
    displayCartItems();
}

function showContactOptions() {
    const contactModal = document.getElementById('contactModal');
    contactModal.style.display = 'block';
}

function closeContactModal() {
    const contactModal = document.getElementById('contactModal');
    contactModal.style.display = 'none';
}

function contactViaInstagram() {
    const message = generateOrderMessage();
    const instagramUrl = `https://www.instagram.com/_the_adorable_`;
    
    // Copy message to clipboard for Instagram
    navigator.clipboard.writeText(message).then(() => {
        alert('Order details copied to clipboard! Paste it in your Instagram message.');
        window.open(instagramUrl, '_blank');
    }).catch(() => {
        alert(`Please copy this message and send it via Instagram:\n\n${message}`);
        window.open(instagramUrl, '_blank');
    });
    
    closeContactModal();
    toggleCart();
}

function contactViaWhatsApp() {
    const message = generateOrderMessage();
    const whatsappUrl = `https://wa.me/918778451386?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    closeContactModal();
    toggleCart();
}

function generateOrderMessage() {
    let message = "Hello! I'm interested in ordering the following items from The Adorable:\n\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price}\n`;
        const priceNumber = parseInt(item.price.replace('₹', ''));
        total += priceNumber;
    });
    
    message += `\nTotal Amount: ₹${total}\n\nPlease let me know the availability and ordering process.\n\nThank you!`;
    return message;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const contactModal = document.getElementById('contactModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
    }
}