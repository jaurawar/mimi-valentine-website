/* ============================================
   ROMANTIC VALENTINE PROPOSAL WEBSITE SCRIPT
   Created with love for Mimi Ji by Barfiee
   ============================================ */

// ========================================
// GLOBAL VARIABLES AND STATE MANAGEMENT
// ========================================

let currentSection = 'landing';
let quizAnswers = [];
let currentQuizQuestion = 0;
let idleTimer = null;
let progressValue = 0;
let isPopCatOpen = false;

// Easter egg secret messages
const secretMessages = [
    "Barfiee thinks you're absolutely stunning 🌟",
    "Did you know? Barfiee can't stop thinking about meeting you 😊",
    "Fun fact: Barfiee has probably forgotten what he had for breakfast, but never forgets your messages 💕",
    "Barfiee's favorite part of the day? When you text back 💌"
];


// ========================================
// INITIALIZATION ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('💕 Valentine website initialized for Mimi Ji');
    
    // Start floating hearts animation
    startFloatingHearts();
    
    // Initialize progress bar
    updateProgress();
    
    // Setup NO button escape behavior
    setupNoButton();
    
    // Start idle detection for Easter egg
    startIdleDetection();
    
    // Add typing animation completion listener
    setTimeout(() => {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            typingElement.classList.add('completed');
        }
    }, 3500);
    
    // Initialize starry night (will be hidden until proposal section)
    createStars();
});


// ========================================
// POP CAT INTERACTIVE FEATURE
// ========================================

/**
 * Toggle pop cat mouth open/closed with bounce animation
 */
function popCat() {
    // Get both pop cat images (landing and celebration)
    const landingCat = document.getElementById('popCatImage');
    const celebrationCat = document.getElementById('celebrationPopCat');
    
    // Determine which cat to animate based on current section
    const activeCat = currentSection === 'celebration' ? celebrationCat : landingCat;
    
    if (!activeCat) return;
    
    // Toggle cat state
    isPopCatOpen = !isPopCatOpen;
    
    // Change image
    if (isPopCatOpen) {
        activeCat.src = 'assets/images/cat-open.jpg';
        // Add bounce and scale animation
        activeCat.style.transform = 'scale(1.1)';
        playPopSound();
    } else {
        activeCat.src = 'assets/images/cat-closed.jpg';
        activeCat.style.transform = 'scale(1)';
    }
    
    // Reset scale after animation
    setTimeout(() => {
        activeCat.style.transform = 'scale(1)';
    }, 150);
}

/**
 * Play cute pop sound (using Web Audio API to generate sound)
 */
function playPopSound() {
    try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator (sound generator)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set sound properties for cute "pop" effect
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High pitch
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
        
    } catch (error) {
        // Silently fail if audio not supported
        console.log('Audio not supported or blocked');
    }
}


// ========================================
// SECTION NAVIGATION
// ========================================

/**
 * Navigate smoothly between sections
 * @param {string} sectionId - ID of the section to show
 */
function goToSection(sectionId) {
    // Hide current section
    const currentSectionElement = document.getElementById(currentSection);
    if (currentSectionElement) {
        currentSectionElement.classList.add('hidden');
    }
    
    // Show new section
    const newSectionElement = document.getElementById(sectionId);
    if (newSectionElement) {
        newSectionElement.classList.remove('hidden');
        
        // Scroll to top of new section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update current section
        currentSection = sectionId;
        
        // Update progress bar
        updateProgress();
        
        // Section-specific initializations
        if (sectionId === 'proposal') {
            animateStars();
        } else if (sectionId === 'celebration') {
            launchCelebration();
        }
    }
}


// ========================================
// PROGRESS BAR
// ========================================

/**
 * Update the romantic progress indicator based on current section
 */
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    
    const progressMap = {
        'landing': 0,
        'story': 20,
        'quiz': 40,
        'emotion': 60,
        'proposal': 80,
        'celebration': 100
    };
    
    progressValue = progressMap[currentSection] || 0;
    
    if (progressBar) {
        progressBar.style.width = progressValue + '%';
    }
}


// ========================================
// FLOATING HEARTS BACKGROUND
// ========================================

/**
 * Create and animate floating hearts in the background
 */
function startFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    
    // Create a new heart every 3 seconds
    setInterval(() => {
        createFloatingHeart(heartsContainer);
    }, 3000);
    
    // Create initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFloatingHeart(heartsContainer);
        }, i * 600);
    }
}

/**
 * Create a single floating heart element
 * @param {HTMLElement} container - Container for the heart
 */
function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💕', '💖', '💗', '💝', '❤️'][Math.floor(Math.random() * 5)];
    
    // Random horizontal position
    heart.style.left = Math.random() * 100 + '%';
    
    // Random animation duration (10-20 seconds)
    const duration = 10 + Math.random() * 10;
    heart.style.animationDuration = duration + 's';
    
    // Random delay
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, (duration + 2) * 1000);
}


// ========================================
// QUIZ FUNCTIONALITY
// ========================================

/**
 * Handle quiz answer selection
 * @param {number} questionNum - Question number
 * @param {string} answer - Selected answer
 */
function selectAnswer(questionNum, answer) {
    // Save answer
    quizAnswers.push({
        question: questionNum,
        answer: answer
    });
    
    console.log(`Quiz Answer ${questionNum}:`, answer);
    
    // Get all quiz questions
    const questions = document.querySelectorAll('.quiz-question');
    
    // Hide current question with fade out
    questions[currentQuizQuestion].style.opacity = '0';
    questions[currentQuizQuestion].style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        questions[currentQuizQuestion].style.display = 'none';
        
        // Move to next question
        currentQuizQuestion++;
        
        // Check if there are more questions
        if (currentQuizQuestion < questions.length) {
            // Show next question
            questions[currentQuizQuestion].style.display = 'block';
            setTimeout(() => {
                questions[currentQuizQuestion].style.opacity = '1';
                questions[currentQuizQuestion].style.transform = 'scale(1)';
            }, 50);
        } else {
            // All questions answered - show result
            showQuizResult();
        }
    }, 400);
}

/**
 * Display quiz result
 */
function showQuizResult() {
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    
    // Hide quiz container
    quizContainer.style.opacity = '0';
    
    setTimeout(() => {
        quizContainer.style.display = 'none';
        
        // Show result
        quizResult.classList.remove('hidden');
        setTimeout(() => {
            quizResult.style.opacity = '1';
            quizResult.style.transform = 'scale(1)';
        }, 50);
    }, 400);
}


// ========================================
// PROPOSAL SECTION - NO BUTTON ESCAPE
// ========================================

/**
 * Setup the playful "NO" button that runs away from cursor
 */
function setupNoButton() {
    const noBtn = document.getElementById('noBtn');
    let isEscaping = false;
    
    // Mouse hover event
    noBtn.addEventListener('mouseenter', function() {
        runAwayFromCursor(noBtn);
    });
    
    // Touch event for mobile
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        runAwayFromCursor(noBtn);
    });
    
    // Click event (in case someone manages to click it)
    noBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showPlayfulMessage();
    });
}

/**
 * Make NO button run away like a shy cat
 * @param {HTMLElement} btn - The NO button element
 */
function runAwayFromCursor(btn) {
    // Make button absolutely positioned
    btn.style.position = 'fixed';
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;
    
    // Calculate random position (with padding from edges)
    const padding = 50;
    const randomX = padding + Math.random() * (viewportWidth - btnWidth - padding * 2);
    const randomY = padding + Math.random() * (viewportHeight - btnHeight - padding * 2);
    
    // Apply new position with smooth transition
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    
    // Add a little rotation for fun
    const rotation = (Math.random() - 0.5) * 15;
    btn.style.transform = `rotate(${rotation}deg)`;
}

/**
 * Show playful message if user somehow clicks NO
 */
function showPlayfulMessage() {
    alert("Come on, you know you want to say yes 😉💕");
}


// ========================================
// CELEBRATION SECTION
// ========================================

/**
 * Launch celebration animations when YES is clicked
 */
function celebrate() {
    // Navigate to celebration section
    goToSection('celebration');
}

/**
 * Initialize celebration effects
 */
function launchCelebration() {
    // Launch confetti
    createConfetti();
    
    // Create more floating hearts
    const heartsContainer = document.getElementById('floatingHearts');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingHeart(heartsContainer);
        }, i * 200);
    }
}

/**
 * Create confetti animation
 */
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#d946ef', '#fbbf24', '#f87171'];
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random color
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Random starting position
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            
            // Random size
            const size = 5 + Math.random() * 10;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            // Random animation duration
            const duration = 2 + Math.random() * 3;
            confetti.style.animationDuration = duration + 's';
            
            // Random delay
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, (duration + 0.5) * 1000);
        }, i * 30);
    }
}


// ========================================
// STARRY NIGHT BACKGROUND
// ========================================

/**
 * Create twinkling stars for proposal section
 */
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    
    // Create 100 stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation delay for twinkling effect
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // Random size (some stars bigger)
        if (Math.random() > 0.9) {
            star.style.width = '3px';
            star.style.height = '3px';
        }
        
        starsContainer.appendChild(star);
    }
}

/**
 * Animate stars when proposal section is shown
 */
function animateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.style.animation = 'twinkle 3s ease-in-out infinite';
    });
}


// ========================================
// EASTER EGGS
// ========================================

/**
 * Show hidden cat message Easter egg
 * @param {number} messageIndex - Index of the secret message
 */
function showCatMessage(messageIndex) {
    const catMessagesDiv = document.getElementById('catMessages');
    const secretMessageP = document.getElementById('secretMessage');
    
    // Set random message if index out of bounds
    const messageToShow = secretMessages[messageIndex] || 
                          secretMessages[Math.floor(Math.random() * secretMessages.length)];
    
    secretMessageP.textContent = messageToShow;
    catMessagesDiv.classList.remove('hidden');
    
    // Add entrance animation
    catMessagesDiv.style.animation = 'celebration-bounce 0.6s ease-out forwards';
}

/**
 * Close cat message Easter egg
 */
function closeCatMessage() {
    const catMessagesDiv = document.getElementById('catMessages');
    catMessagesDiv.classList.add('hidden');
}


// ========================================
// IDLE DETECTION EASTER EGG
// ========================================

/**
 * Start idle detection to show cute cat popup
 */
function startIdleDetection() {
    // Reset timer on any user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });
    
    resetIdleTimer();
}

/**
 * Reset idle timer
 */
function resetIdleTimer() {
    clearTimeout(idleTimer);
    
    // Hide popup if visible
    const popup = document.getElementById('idleCatPopup');
    if (popup && !popup.classList.contains('hidden')) {
        popup.classList.add('hidden');
    }
    
    // Set new timer for 30 seconds
    idleTimer = setTimeout(showIdlePopup, 30000);
}

/**
 * Show idle cat popup
 */
function showIdlePopup() {
    // Only show if not on celebration section
    if (currentSection !== 'celebration') {
        const popup = document.getElementById('idleCatPopup');
        popup.classList.remove('hidden');
    }
}

/**
 * Close idle cat popup
 */
function closeIdlePopup() {
    const popup = document.getElementById('idleCatPopup');
    popup.classList.add('hidden');
    resetIdleTimer();
}


// ========================================
// ACCESSIBILITY HELPERS
// ========================================

/**
 * Handle keyboard navigation
 */
document.addEventListener('keydown', function(e) {
    // Allow ESC to close modals
    if (e.key === 'Escape') {
        closeCatMessage();
        closeIdlePopup();
    }
    
    // Spacebar can also trigger pop cat
    if (e.key === ' ' && (e.target === document.body)) {
        e.preventDefault();
        popCat();
    }
});


// ========================================
// MOBILE OPTIMIZATIONS
// ========================================

/**
 * Detect if user is on mobile device
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Handle touch-specific interactions
 */
if (isMobileDevice()) {
    // Enhance touch feedback
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}


// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

/**
 * Use requestAnimationFrame for smooth animations
 */
let ticking = false;

function optimizedScroll() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // Scroll-based animations here if needed
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', optimizedScroll);


// ========================================
// DEBUG HELPERS (Remove in production)
// ========================================

// Log current section changes
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c💕 Valentine Website Debug Mode 💕', 'color: #ec4899; font-size: 16px; font-weight: bold;');
    console.log('Current section:', currentSection);
}
