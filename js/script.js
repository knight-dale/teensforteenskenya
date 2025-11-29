document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('mobile-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.mobile-sidebar__link');
    const navbar = document.querySelector('nav');

    if (window.location.search.includes('name=') || window.location.search.includes('comment=')) {
        const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    hamburger?.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    });

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    };

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (window.innerWidth < 768) {
            if (scrollY > lastScrollY && scrollY > 100) {
                navbar.classList.add('hidden');
                navbar.classList.remove('visible');
            } else {
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }
        } else {
            navbar.classList.remove('hidden', 'visible');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    sidebarClose?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                closeSidebar();
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = navbar.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = targetPosition - headerHeight - 20;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 20;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    document.querySelectorAll('.footer__link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 20;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '10px',
        threshold: 0.05
    };

    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach((el, index) => {
        el.dataset.delay = (index % 10) * 100;
        fadeUpObserver.observe(el);
    });

    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (!entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target, target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    document.querySelectorAll('a[href="#donate"]').forEach(button => {
        button.addEventListener('click', (e) => {
            button.classList.add('loading');
            setTimeout(() => {
                button.classList.remove('loading');
            }, 2000);
        });
    });

    const scene = document.getElementById('scene');
    if (scene && typeof Parallax !== 'undefined') {
        const parallaxInstance = new Parallax(scene);
    }

    setTimeout(() => {
        const fadeUps = document.querySelectorAll('.fade-up:not(.visible)');
        if (fadeUps.length > 0) {
            fadeUps.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            });
        }
    }, 3000);

    const commentForm = document.getElementById('commentForm');
    const commentsDisplay = document.getElementById('commentsDisplay');
    const submitBtn = document.getElementById('submitBtn');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztjT_SXzgCT3M16f42pvMVXxfZY1a1fKrg90xw8n_Lr5ItZGm0Sptjk8_nq0X7jDVP/exec';

    if (commentForm && commentsDisplay) {
        loadComments();
        
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const comment = document.getElementById('comment').value.trim();
            
            const validation = validateCommentInput(name, email, comment);
            if (!validation.isValid) {
                showMessage(validation.errors.join('\n'), 'error');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
            
            try {
                await submitCommentToSheets(name, email, comment);
                commentForm.reset();
                await loadComments();
                showMessage('Thank you for your comment! It has been submitted successfully.', 'success');
            } catch (error) {
                showMessage(error.message || 'Sorry, there was an error submitting your comment. Please try again.', 'error');
                console.error('Error submitting comment:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Comment';
            }
        });
    }

    function validateCommentInput(name, email, comment) {
        const errors = [];
        const result = { isValid: true, errors: [] };
        
        if (!name) errors.push('Name is required');
        if (!comment) errors.push('Comment is required');
        if (name && name.length > 100) errors.push('Name must be less than 100 characters');
        if (comment && comment.length > 1000) errors.push('Comment must be less than 1000 characters');
        if (email && email.length > 100) errors.push('Email must be less than 100 characters');
        if (email && !isValidEmail(email)) errors.push('Please enter a valid email address');
        
        result.errors = errors;
        result.isValid = errors.length === 0;
        return result;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function submitCommentToSheets(name, email, comment) {
        const params = new URLSearchParams({
            name: name,
            email: email || '',
            comment: comment
        });
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            result = { success: true };
        }
        
        if (!result || !result.success) {
            throw new Error(result?.error || 'Comment submission failed');
        }
        
        return result;
    }

    async function loadComments() {
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getComments`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const responseText = await response.text();
            let comments;
            try {
                comments = JSON.parse(responseText);
            } catch (e) {
                comments = [];
            }
            
            displayComments(comments);
        } catch (error) {
            console.error('Error loading comments:', error);
            commentsDisplay.innerHTML = `
                <div class="text-center text-red-600 py-8">
                    <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
                    <p>Unable to load comments. Please try again later.</p>
                </div>
            `;
        }
    }

    function displayComments(comments) {
        if (!comments || !Array.isArray(comments) || comments.length === 0) {
            commentsDisplay.innerHTML = `
                <h3 class="text-xl font-bold text-primary-green mb-6">Recent Comments</h3>
                <div class="text-center text-dark-gray py-8">
                    <i class="fas fa-comments text-4xl text-gray-300 mb-4"></i>
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }
        
        let commentsHTML = '<h3 class="text-xl font-bold text-primary-green mb-6">Recent Comments</h3>';
        const recentComments = Array.isArray(comments) ? comments.slice(0, 20) : [];
        
        recentComments.forEach(comment => {
            let date;
            try {
                date = new Date(comment.timestamp || comment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                date = 'Recent';
            }
            
            commentsHTML += `
                <div class="comment-item fade-up">
                    <div class="flex items-start justify-between">
                        <div class="comment-author">${escapeHtml(comment.name || 'Anonymous')}</div>
                        <div class="comment-date text-sm text-gray-500">${date}</div>
                    </div>
                    <div class="comment-text mt-2">${escapeHtml(comment.comment || '')}</div>
                    ${comment.email ? `<div class="comment-email text-sm text-gray-600 mt-1">${escapeHtml(comment.email)}</div>` : ''}
                </div>
            `;
        });
        
        commentsDisplay.innerHTML = commentsHTML;
        
        commentsDisplay.querySelectorAll('.fade-up').forEach((el, index) => {
            el.dataset.delay = (index % 10) * 100;
            fadeUpObserver.observe(el);
        });
    }
    
    function showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.message-toast');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast fixed top-4 right-4 p-4 rounded-lg z-50 transform transition-all duration-300 ${
            type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
        }`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 5000);
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});