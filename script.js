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

// Add theme preference
let darkMode = localStorage.getItem('darkMode') === 'enabled';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBd9QB6ahMp5mUeP4jAskBOyKZt4YfP3xU",
    authDomain: "trivia-quiz-rewards.firebaseapp.com",
    databaseURL: "https://trivia-quiz-rewards-default-rtdb.firebaseio.com",
    projectId: "trivia-quiz-rewards",
    storageBucket: "trivia-quiz-rewards.appspot.com",
    messagingSenderId: "915483810483",
    appId: "1:915483810483:web:0a2ae597a71e6dd6a0b3ee"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    document.querySelectorAll('.category-btn.selected').forEach(button => {
        categories.push(button.getAttribute('data-value'));
    });
    
    // Make sure at least one category is selected
    if (categories.length === 0) {
        alert('Please select at least one category!');
        return;
    }
    
    // Get selected difficulty and question limit
    const difficulty = document.getElementById('difficulty').value;
    const limit = parseInt(document.getElementById('question-limit').value);
    
    // Check if the selected limit is at least 10
    if (limit < 10) {
        alert('You must select at least 10 questions to be eligible for a reward!');
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
        // Try to fetch questions from API first
        fetchQuestionsFromAPI(categories, difficulty, limit)
            .then(apiQuestions => {
                if (apiQuestions && apiQuestions.length > 0) {
                    questions = apiQuestions;
                    showQuestion();
                } else {
                    // Fallback to local questions if API fails
                    loadLocalQuestions(categories, difficulty, limit);
                }
            })
            .catch(error => {
                console.error('Error fetching questions from API:', error);
                // Fallback to local questions if API fails
                loadLocalQuestions(categories, difficulty, limit);
            });
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please try again.');
        document.querySelector('.category-container').style.display = 'block';
        document.querySelector('.quiz-container').style.display = 'none';
    }
}

// Function to fetch questions from Open Trivia DB API
async function fetchQuestionsFromAPI(categories, difficulty, limit) {
    try {
        // Map our categories to Open Trivia DB categories
        const categoryMapping = {
            'general_knowledge': 9,
            'history': 23,
            'geography': 22,
            'science': 17,
            'sports': 21,
            'entertainment': 11,
            'technology': 18,
            'mythology': 20,
            'animals': 27
        };
        
        // Get Open Trivia DB category IDs
        const apiCategories = categories.map(cat => categoryMapping[cat]).filter(id => id);
        
        // Convert our difficulty to API difficulty
        let apiDifficulty = 'medium'; // Default
        if (difficulty === 'easy') apiDifficulty = 'easy';
        if (difficulty === 'hard') apiDifficulty = 'hard';
        
        // If no valid categories found, fetch general knowledge
        if (apiCategories.length === 0) {
            apiCategories.push(9); // Default to general knowledge
        }
        
        // Make several API calls to get questions from different categories
        const promises = apiCategories.map(category => {
            const url = `https://opentdb.com/api.php?amount=${Math.ceil(limit / apiCategories.length)}&category=${category}&difficulty=${apiDifficulty}&type=multiple`;
            return fetch(url).then(response => response.json());
        });
        
        const results = await Promise.all(promises);
        
        // Process API response
        let apiQuestions = [];
        results.forEach(result => {
            if (result.response_code === 0) {
                const questionsFromThisCategory = result.results.map(q => {
                    // Create array with all options including correct answer
                    const options = [...q.incorrect_answers, q.correct_answer];
                    
                    // Shuffle options
                    const shuffledOptions = shuffleArray(options);
                    
                    // Find index of correct answer in shuffled array
                    const correctIndex = shuffledOptions.indexOf(q.correct_answer);
                    
                    return {
                        question: decodeHtml(q.question),
                        options: shuffledOptions.map(decodeHtml),
                        correct: correctIndex,
                        category: q.category
                    };
                });
                
                apiQuestions = [...apiQuestions, ...questionsFromThisCategory];
            }
        });
        
        // Shuffle and limit questions
        return shuffleArray(apiQuestions).slice(0, limit);
    } catch (error) {
        console.error('API fetch error:', error);
        return []; // Return empty array to trigger fallback
    }
}

// Helper function to decode HTML entities
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Function to load local questions (as fallback)
function loadLocalQuestions(categories, difficulty, limit) {
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
    // Check if answer was already selected for this question
    if (document.getElementById('next-btn').style.display === 'block') {
        return; // Answer already selected, ignore additional clicks
    }
    
    const options = document.querySelectorAll('.option');
    const question = questions[currentQuestion];
    
    // Show correct/incorrect
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
        
        // Remove click handler by cloning and replacing the element
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
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
    if (questions.length >= 10) {
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
        rewardSection.innerHTML = '<h3>Minimum Questions Required</h3><p>Complete at least 10 questions to be eligible for a reward!</p>';
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
    
    // Display the message div
    messageDiv.style.display = 'block';
    
    // Validate inputs
    if (!upiId || !phoneNumber) {
        messageDiv.textContent = 'Please fill in all fields';
        messageDiv.className = 'payment-message error';
        return;
    }
    
    // Validate UPI ID format (basic check)
    if (!upiId.includes('@')) {
        messageDiv.textContent = 'Please enter a valid UPI ID';
        messageDiv.className = 'payment-message error';
        return;
    }
    
    // Validate phone number (basic check)
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        messageDiv.textContent = 'Please enter a valid 10-digit phone number';
        messageDiv.className = 'payment-message error';
        return;
    }
    
    // Disable submit button to prevent double submission
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Create payment object
    const payment = {
        id: Date.now().toString(),
        name: userName,
        upiId: upiId,
        phoneNumber: phoneNumber,
        amount: currentPrize,
        status: 'pending',
        timestamp: new Date().toISOString(),
        deviceId: getDeviceId()
    };
    
    // Save to Firebase
    database.ref('pendingPayments/' + payment.id).set(payment)
        .then(() => {
            // Add to usedUpiIds list
            return database.ref('usedUpiIds').once('value')
                .then(snapshot => {
                    let usedUpiIds = snapshot.val() || [];
                    usedUpiIds.push(payment.upiId);
                    return database.ref('usedUpiIds').set(usedUpiIds);
                });
        })
        .then(() => {
            // Hide the submit button
            submitButton.style.display = 'none';
            
            // Show success message
            messageDiv.textContent = 'Payment request submitted successfully! We will process it shortly.';
            messageDiv.className = 'payment-message success';
            
            // Reset form
            document.getElementById('upi-id').value = '';
            document.getElementById('phone-number').value = '';
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(error => {
            console.error('Error saving payment:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.className = 'payment-message error';
            // Re-enable submit button on error
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        });
}

// Generate or retrieve a unique device ID
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
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
    loadPaymentsFromFirebase();
}

function loadPaymentsFromFirebase() {
    // Listen for changes to pendingPayments
    database.ref('pendingPayments').on('value', snapshot => {
        pendingPayments = [];
        const data = snapshot.val();
        
        if (data) {
            // Convert object to array
            Object.keys(data).forEach(key => {
                pendingPayments.push({
                    ...data[key],
                    id: key
                });
            });
        }
        
        // Sort by timestamp (newest first)
        pendingPayments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        renderPaymentList();
    }, error => {
        console.error('Error loading payments:', error);
        alert('Error loading payments. Please try again.');
    });
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
        <div>Status</div>
        <div>Action</div>
    `;
    paymentList.appendChild(headerItem);
    
    // Add payment items
    pendingPayments.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        paymentItem.innerHTML = `
            <div data-label="User">${payment.name} (${payment.phoneNumber})</div>
            <div data-label="UPI ID">${payment.upiId}</div>
            <div data-label="Amount">₹${payment.amount}</div>
            <div data-label="Status">${payment.status}</div>
            <div data-label="Action">
                ${payment.status === 'pending' ? 
                    `<button onclick="markAsPaid('${payment.id}')">Mark as Paid</button>` : 
                    '<span class="paid-badge">Paid</span>'}
            </div>
        `;
        paymentList.appendChild(paymentItem);
    });
    
    // Show message if no payments
    if (pendingPayments.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No payments found.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        paymentList.appendChild(emptyMessage);
    }
}

function markAsPaid(paymentId) {
    // Update status in Firebase
    database.ref('pendingPayments/' + paymentId).update({
        status: 'paid'
    }).then(() => {
        // Success message
        alert('Payment marked as paid!');
    }).catch(error => {
        console.error('Error updating payment:', error);
        alert('Error updating payment. Please try again.');
    });
}

function logoutAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
    // Stop listening for changes
    database.ref('pendingPayments').off();
}

// Function to toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Initialize the page
window.onload = function() {
    // Apply dark mode if needed
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
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

    // Add event listeners for category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Admin button is removed for user webpage
}; 