let currentQuestion = 0;
let score = 0;
let questions = [];
let currentOptions = [];
let userName = "";
let currentPrize = 0;

// Store used UPI IDs to prevent reuse
let usedUpiIds = [];

// Store pending payments
let pendingPayments = [];

// Admin credentials (in a real app, this would be stored securely on a server)
const adminCredentials = {
    username: "admin",
    password: "quiz123"
};

// Define local questions
const localQuestions = [
    {
        question: "What is the capital of India?",
        options: ["Mumbai", "Delhi", "Bangalore", "Chennai"],
        correct: 1,
        category: "Geography"
    },
    {
        question: "Who was the first Prime Minister of India?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Subhas Chandra Bose"],
        correct: 1,
        category: "History"
    },
    {
        question: "Which is the largest state in India by area?",
        options: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Uttar Pradesh"],
        correct: 2,
        category: "Geography"
    },
    {
        question: "What is the national animal of India?",
        options: ["Lion", "Tiger", "Elephant", "Peacock"],
        correct: 1,
        category: "General Knowledge"
    },
    {
        question: "Which is the largest democracy in the world?",
        options: ["USA", "China", "India", "Russia"],
        correct: 2,
        category: "General Knowledge"
    },
    {
        question: "Who is known as the Father of the Indian Constitution?",
        options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
        correct: 1,
        category: "History"
    },
    {
        question: "Which is the national bird of India?",
        options: ["Eagle", "Peacock", "Parrot", "Sparrow"],
        correct: 1,
        category: "General Knowledge"
    },
    {
        question: "What is the national flower of India?",
        options: ["Rose", "Lotus", "Sunflower", "Marigold"],
        correct: 1,
        category: "General Knowledge"
    },
    {
        question: "Which is the largest river in India?",
        options: ["Yamuna", "Ganga", "Brahmaputra", "Godavari"],
        correct: 1,
        category: "Geography"
    },
    {
        question: "Who was the first President of India?",
        options: ["Rajendra Prasad", "S. Radhakrishnan", "Zakir Hussain", "V.V. Giri"],
        correct: 0,
        category: "History"
    }
];

// Add referral tracking variables
let referralCount = 0;
let referralLinks = new Set();

// Add user session management
let userSession = null;
let sessionTimeout = null;

// Function to generate a unique referral link
function generateReferralLink() {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return `${window.location.origin}?ref=${uniqueId}`;
}

// Function to check if a URL has a referral parameter
function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const refId = urlParams.get('ref');
    if (refId && !referralLinks.has(refId)) {
        referralLinks.add(refId);
        referralCount++;
        localStorage.setItem('referralCount', referralCount.toString());
        localStorage.setItem('referralLinks', JSON.stringify([...referralLinks]));
    }
}

// Function to check for existing session on page load
function checkSession() {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
        userSession = JSON.parse(sessionData);
        if (userSession.expiry > Date.now()) {
            // Session is still valid
            setSessionTimeout();
            showCategoryContainer();
        } else {
            // Session expired
            logoutUser();
        }
    }
}

// Set session timeout
function setSessionTimeout() {
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
    }
    // Set timeout for 30 minutes
    sessionTimeout = setTimeout(logoutUser, 30 * 60 * 1000);
}

// Login user
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    // Get registered users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => 
        u.username === username && 
        u.password === btoa(password)
    );
    
    if (user) {
        // Create session
        userSession = {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            expiry: Date.now() + (30 * 60 * 1000) // 30 minutes
        };
        localStorage.setItem('userSession', JSON.stringify(userSession));
        setSessionTimeout();
        showCategoryContainer();
    } else {
        alert('Invalid username or password');
    }
}

// Logout user
function logoutUser() {
    userSession = null;
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        sessionTimeout = null;
    }
    localStorage.removeItem('userSession');
    showLoginContainer();
}

// Show/hide containers
function showLoginContainer() {
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('.category-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'none';
}

function showCategoryContainer() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.category-container').style.display = 'block';
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'none';
}

function showQuizContainer() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.category-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    document.querySelector('.result-container').style.display = 'none';
}

function showResultContainer() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.category-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'block';
}

// Function to start the quiz
function startQuiz() {
    // Get user's name
    userName = document.getElementById('user-name').value.trim();
    if (!userName) {
        alert('Please enter your name to start the quiz!');
        return;
    }
    
    // Get selected categories
    const categories = [];
    document.querySelectorAll('.category-option input[type="checkbox"]:checked').forEach(checkbox => {
        categories.push(checkbox.value);
    });
    
    // Make sure at least one category is selected
    if (categories.length === 0) {
        alert('Please select at least one category!');
        return;
    }
    
    // Get selected difficulty and question limit
    const difficulty = document.getElementById('difficulty').value;
    const limit = parseInt(document.getElementById('question-limit').value);
    
    // Check if the selected limit is at least 5
    if (limit < 5) {
        alert('You must select at least 5 questions to be eligible for a reward!');
        return;
    }
    
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    questions = [];
    
    // Show quiz container and hide others
    document.querySelector('.category-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    document.querySelector('.result-container').style.display = 'none';
    
    // Load questions with selected parameters
    loadQuestions(categories, difficulty, limit);
}

// Function to load questions
function loadQuestions(categories, difficulty, limit) {
    try {
        // Filter questions based on selected categories
        let filteredQuestions = localQuestions.filter(q => {
            const questionCategory = q.category.toLowerCase().replace(' ', '_');
            return categories.includes(questionCategory);
        });
        
        // If no questions found for selected categories, use all questions
        if (filteredQuestions.length === 0) {
            filteredQuestions = [...localQuestions];
        }
        
        // Shuffle the filtered questions
        filteredQuestions = shuffleArray([...filteredQuestions]);
        
        // Take exactly the requested number of questions
        questions = filteredQuestions.slice(0, limit);
        
        // Ensure we have the correct number of questions
        if (questions.length < limit) {
            const remainingQuestions = localQuestions.filter(q => !questions.includes(q));
            const additionalQuestions = shuffleArray([...remainingQuestions]).slice(0, limit - questions.length);
            questions = [...questions, ...additionalQuestions];
        }
        
        if (questions.length === 0) {
            alert('No questions found for these categories. Please try different options.');
            document.querySelector('.category-container').style.display = 'block';
            document.querySelector('.quiz-container').style.display = 'none';
            return;
        }
        
        // Show first question
        showQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please try again.');
        document.querySelector('.category-container').style.display = 'block';
        document.querySelector('.quiz-container').style.display = 'none';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to move to next question
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// Function to show question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    // Display category
    const headerTitle = document.querySelector('.quiz-header h1');
    headerTitle.textContent = `${question.category}`;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.className = 'option';
        option.disabled = false;
    });

    // Update progress bar
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;

    // Update score display
    document.getElementById('score').textContent = score;

    // Show/hide buttons
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('finish-btn').style.display = 
        currentQuestion === questions.length - 1 ? 'block' : 'none';
}

// Function to check answer
function checkAnswer(selectedIndex) {
    const options = document.querySelectorAll('.option');
    const question = questions[currentQuestion];
    
    // Disable all options
    options.forEach(option => option.disabled = true);
    
    // Show correct/incorrect
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });

    // Update score
    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('score').textContent = score;
    }

    // Show next button
    document.getElementById('next-btn').style.display = 'block';
}

// Function to finish quiz
function finishQuiz() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'block';
    document.getElementById('final-score').textContent = `${score}/${questions.length}`;
    
    // Only show reward if minimum questions requirement is met
    if (questions.length >= 5) {
        // Generate random reward (99% chance for 1-5, 1% chance for 6-10)
        const randomValue = Math.random();
        let selectedPrize;
        
        if (randomValue <= 0.99) {
            // 99% chance for 1-5
            selectedPrize = Math.floor(Math.random() * 5) + 1;
        } else {
            // 1% chance for 6-10
            selectedPrize = Math.floor(Math.random() * 5) + 6;
        }
        
        // Store the current prize value
        currentPrize = selectedPrize;
        
        // Show reward section with share buttons
        const rewardSection = document.querySelector('.reward-section');
        rewardSection.innerHTML = `
            <h3>🎉 Congratulations! You've Won!</h3>
            <p>Share with friends to unlock your reward!</p>
            <div class="share-buttons">
                <button onclick="shareOnWhatsApp()" class="share-btn">Share on WhatsApp</button>
                <button onclick="shareOnTelegram()" class="share-btn">Share on Telegram</button>
            </div>
            <div class="scratch-card-container" style="display: none;">
                <div class="scratch-card">
                    <div class="scratch-area">
                        <canvas class="scratch-overlay"></canvas>
                        <div class="reward-amount">₹${selectedPrize}</div>
                    </div>
                </div>
                <button onclick="showPaymentForm()" class="claim-btn" style="display: none;">Claim Reward</button>
            </div>
        `;
        
        // Reset share count and set global variable to track it
        window.shareCount = 0;
        
        // Debug - For testing, add a button to show the scratch card immediately
        const testBtn = document.createElement('button');
        testBtn.innerHTML = "Test: Show Scratch Card";
        testBtn.className = "test-btn";
        testBtn.onclick = function() {
            const scratchCard = document.querySelector('.scratch-card-container');
            if (scratchCard) {
                scratchCard.style.display = 'block';
                initializeScratchCard();
            }
        };
        rewardSection.appendChild(testBtn);
        
    } else {
        // Show message about minimum questions requirement
        const rewardSection = document.querySelector('.reward-section');
        rewardSection.innerHTML = '<h3>Minimum Questions Required</h3><p>Complete at least 5 questions to be eligible for a reward!</p>';
    }
}

// Function to initialize scratch card
function initializeScratchCard() {
    console.log("Initializing scratch card");
    const scratchOverlay = document.querySelector('.scratch-overlay');
    
    if (!scratchOverlay) {
        console.error("No scratch overlay found!");
        return;
    }
    
    let isDrawing = false;
    let ctx = scratchOverlay.getContext('2d');
    
    // Set up canvas
    scratchOverlay.width = scratchOverlay.offsetWidth || 300;
    scratchOverlay.height = scratchOverlay.offsetHeight || 150;
    
    console.log("Canvas dimensions:", scratchOverlay.width, scratchOverlay.height);
    
    // Fill with gray color
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, scratchOverlay.width, scratchOverlay.height);
    
    // Add scratch effect
    scratchOverlay.addEventListener('mousedown', startScratching);
    scratchOverlay.addEventListener('mousemove', scratch);
    scratchOverlay.addEventListener('mouseup', stopScratching);
    scratchOverlay.addEventListener('mouseleave', stopScratching);
    
    // Touch events for mobile
    scratchOverlay.addEventListener('touchstart', startScratching);
    scratchOverlay.addEventListener('touchmove', scratch);
    scratchOverlay.addEventListener('touchend', stopScratching);
    
    function startScratching(e) {
        isDrawing = true;
        scratch(e);
    }
    
    function scratch(e) {
        if (!isDrawing) return;
        
        e.preventDefault();
        const rect = scratchOverlay.getBoundingClientRect();
        
        let x, y;
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Check if enough area is scratched
        checkScratchProgress();
    }
    
    function stopScratching() {
        isDrawing = false;
    }
    
    function checkScratchProgress() {
        const imageData = ctx.getImageData(0, 0, scratchOverlay.width, scratchOverlay.height);
        const pixels = imageData.data;
        let scratched = 0;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) scratched++;
        }
        
        const progress = scratched / (pixels.length / 4);
        console.log("Scratch progress:", progress);
        
        if (progress > 0.5) { // If 50% scratched
            const claimBtn = document.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.style.display = 'block';
            }
        }
    }
}

function returnToCategories() {
    document.querySelector('.result-container').style.display = 'none';
    document.querySelector('.category-container').style.display = 'block';
}

// Function to share quiz results on WhatsApp
function shareOnWhatsApp() {
    const shareText = `🎯 I just scored ${score}/${questions.length} in the Trivia Quiz Challenge! Join me and win rewards!`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappURL, '_blank');
    trackShare();
}

// Function to copy referral link
function copyReferralLink() {
    const referralLink = document.getElementById('referral-link');
    referralLink.select();
    document.execCommand('copy');
    
    // Show copy confirmation
    const button = referralLink.nextElementSibling;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Function to share on Telegram
function shareOnTelegram() {
    const shareText = `🎯 I just scored ${score}/${questions.length} in the Trivia Quiz Challenge! Join me and win rewards!`;
    const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramURL, '_blank');
    trackShare();
}

// Function to track shares
function trackShare() {
    console.log("Share tracked!");
    
    if (typeof window.shareCount === 'undefined') {
        window.shareCount = 0;
    }
    
    window.shareCount++;
    console.log("Share count: " + window.shareCount);
    
    // Show a small popup to confirm share was counted
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.backgroundColor = '#4CAF50';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '9999';
    popup.textContent = `Share ${window.shareCount}/5 completed!`;
    document.body.appendChild(popup);
    
    // Remove popup after 2 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);
    
    if (window.shareCount >= 5) {
        const scratchCardContainer = document.querySelector('.scratch-card-container');
        console.log("Should show scratch card now!", scratchCardContainer);
        
        if (scratchCardContainer) {
            scratchCardContainer.style.display = 'block';
            initializeScratchCard();
        }
    }
}

// Function to show payment form
function showPaymentForm() {
    // Check if payment form already exists
    if (document.querySelector('.payment-form')) {
        return; // Don't create another form if one exists
    }
    
    // Disable the claim button to prevent multiple clicks
    const claimBtn = document.querySelector('.claim-btn');
    if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.style.opacity = '0.5';
        claimBtn.style.cursor = 'not-allowed';
    }
    
    const rewardSection = document.querySelector('.reward-section');
    const existingContent = rewardSection.innerHTML;
    rewardSection.innerHTML = existingContent + `
        <div class="payment-form">
            <h3>🎉 Congratulations! You've unlocked your reward!</h3>
            <p>Please enter your details to receive ₹${currentPrize}</p>
            <div class="amount">₹${currentPrize}</div>
            <input type="text" id="upi-id" placeholder="Enter your UPI ID" required>
            <input type="tel" id="phone-number" placeholder="Enter your phone number" required>
            <button id="submit-payment" onclick="submitPayment()">Submit</button>
            <div class="payment-message" style="display: none;"></div>
        </div>
    `;
}

// Function to submit payment
function submitPayment() {
    const upiId = document.getElementById('upi-id').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const submitButton = document.getElementById('submit-payment');
    const messageDiv = document.querySelector('.payment-message');
    
    // Validate inputs
    if (!upiId || !phoneNumber) {
        messageDiv.textContent = 'Please fill in all fields';
        messageDiv.className = 'payment-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Validate UPI ID format (basic check)
    if (!upiId.includes('@')) {
        messageDiv.textContent = 'Please enter a valid UPI ID';
        messageDiv.className = 'payment-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Validate phone number (basic check)
    if (!/^\d{10}$/.test(phoneNumber)) {
        messageDiv.textContent = 'Please enter a valid 10-digit phone number';
        messageDiv.className = 'payment-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Check if UPI ID has been used before
    if (usedUpiIds.includes(upiId)) {
        messageDiv.textContent = 'This UPI ID has already been used';
        messageDiv.className = 'payment-message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    // Remove submit button
    submitButton.style.display = 'none';
    
    // Create payment object
    const payment = {
        id: Date.now().toString(),
        name: userName,
        upiId: upiId,
        phoneNumber: phoneNumber,
        amount: currentPrize,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Add to pending payments
    pendingPayments.push(payment);
    usedUpiIds.push(upiId);
    
    // Store updated data
    storePaymentsData();
    
    // Show success message
    messageDiv.textContent = 'Payment request submitted successfully! We will process it shortly.';
    messageDiv.className = 'payment-message success';
    messageDiv.style.display = 'block';
    
    // Reset form
    document.getElementById('upi-id').value = '';
    document.getElementById('phone-number').value = '';
}

// Admin panel functions
function showAdminLoginModal() {
    document.getElementById('admin-login-modal').style.display = 'flex';
}

function loginAdmin() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        document.getElementById('admin-login-modal').style.display = 'none';
        showAdminPanel();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
    renderPaymentList();
}

function renderPaymentList() {
    const paymentList = document.getElementById('payment-list');
    paymentList.innerHTML = '';
    
    // Add header
    const headerItem = document.createElement('div');
    headerItem.className = 'payment-item header';
    headerItem.innerHTML = `
        <div>User</div>
        <div>UPI ID</div>
        <div>Amount</div>
        <div>Action</div>
    `;
    paymentList.appendChild(headerItem);
    
    // Add payment items
    pendingPayments.forEach(payment => {
        if (payment.status === 'pending') {
            const paymentItem = document.createElement('div');
            paymentItem.className = 'payment-item';
            paymentItem.innerHTML = `
                <div data-label="User">${payment.name} (${payment.phoneNumber})</div>
                <div data-label="UPI ID">${payment.upiId}</div>
                <div data-label="Amount">₹${payment.amount}</div>
                <div data-label="Action">
                    <button onclick="markAsPaid('${payment.id}')">Mark as Paid</button>
                </div>
            `;
            paymentList.appendChild(paymentItem);
        }
    });
    
    // Show message if no pending payments
    if (pendingPayments.filter(p => p.status === 'pending').length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No pending payments.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        paymentList.appendChild(emptyMessage);
    }
}

function markAsPaid(paymentId) {
    // Find the payment and update its status
    const paymentIndex = pendingPayments.findIndex(p => p.id === paymentId);
    if (paymentIndex !== -1) {
        pendingPayments[paymentIndex].status = 'paid';
        storePaymentsData();
        renderPaymentList();
    }
}

function logoutAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

// Store payments data in localStorage
function storePaymentsData() {
    localStorage.setItem('pendingPayments', JSON.stringify(pendingPayments));
    localStorage.setItem('usedUpiIds', JSON.stringify(usedUpiIds));
}

// Load payments data from localStorage
function loadPaymentsData() {
    const storedPayments = localStorage.getItem('pendingPayments');
    const storedUpiIds = localStorage.getItem('usedUpiIds');
    
    if (storedPayments) {
        pendingPayments = JSON.parse(storedPayments);
    }
    
    if (storedUpiIds) {
        usedUpiIds = JSON.parse(storedUpiIds);
    }
}

// Initialize the page
window.onload = function() {
    // Load payments data from localStorage
    loadPaymentsData();
    
    // Load referral data
    const storedReferralCount = localStorage.getItem('referralCount');
    const storedReferralLinks = localStorage.getItem('referralLinks');
    
    if (storedReferralCount) {
        referralCount = parseInt(storedReferralCount);
    }
    
    if (storedReferralLinks) {
        referralLinks = new Set(JSON.parse(storedReferralLinks));
    }
    
    // Check for referral in URL
    checkReferral();
}; 