// Admin credentials
const adminCredentials = {
    username: "Debjit@admin",
    password: "NoobDev"
};

// Check if user is already logged in
window.onload = function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
};

// Login function
function loginAdmin() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorMessage = document.getElementById('login-error');

    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Store login state
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        errorMessage.style.display = 'block';
    }
}

// Logout function
function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
}

// Show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    updateDashboardStats();
    renderPaymentList();
}

// Update dashboard statistics
function updateDashboardStats() {
    // Get payments data from localStorage
    const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
    const usedUpiIds = JSON.parse(localStorage.getItem('usedUpiIds') || '[]');

    // Update stats
    document.getElementById('total-users').textContent = usedUpiIds.length;
    document.getElementById('pending-payments').textContent = pendingPayments.filter(p => p.status === 'pending').length;
    
    // Calculate total pending amount
    const totalAmount = pendingPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('total-amount').textContent = `₹${totalAmount}`;
}

// Render payment list
function renderPaymentList() {
    const paymentList = document.getElementById('payment-list');
    paymentList.innerHTML = '';
    
    // Add header
    const headerItem = document.createElement('div');
    headerItem.className = 'payment-item header';
    headerItem.innerHTML = `
        <div data-label="User">User</div>
        <div data-label="UPI ID">UPI ID</div>
        <div data-label="Amount">Amount</div>
        <div data-label="Action">Action</div>
    `;
    paymentList.appendChild(headerItem);
    
    // Get pending payments
    const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
    
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
            paymentItem.dataset.id = payment.id;
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

// Mark payment as paid
function markAsPaid(paymentId) {
    const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
    const paymentIndex = pendingPayments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex !== -1) {
        pendingPayments[paymentIndex].status = 'paid';
        localStorage.setItem('pendingPayments', JSON.stringify(pendingPayments));
        updateDashboardStats();
        renderPaymentList();
    }
} 