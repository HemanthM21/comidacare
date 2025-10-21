let currentUser = null;
let donations = [];
let donationHistory = [];
let registeredUsers = [];
let orders = [];
let isSignUpMode = true;

function showRoleSelection() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('roleSelection').style.display = 'flex';
}

function showSignIn() {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('landing').style.display = 'none';
    document.getElementById('authPage').style.display = 'flex';
    
    isSignUpMode = false;
    document.getElementById('authTitle').textContent = 'Welcome Back';
    document.getElementById('authSubtitle').textContent = 'Sign in to continue making a difference';
    document.getElementById('authSubmitBtn').textContent = 'Sign In';
    document.getElementById('authToggleText').textContent = "Don't have an account?";
    document.getElementById('authToggleLink').textContent = 'Sign Up';
    
    document.getElementById('nameGroup').style.display = 'none';
    document.getElementById('phoneGroup').style.display = 'none';
    document.getElementById('addressGroup').style.display = 'none';
    document.getElementById('categoryGroup').style.display = 'none';
    document.getElementById('name').required = false;
    document.getElementById('phone').required = false;
    document.getElementById('address').required = false;
}

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    
    if (isSignUpMode) {
        document.getElementById('authTitle').textContent = 'Create Account';
        document.getElementById('authSubtitle').textContent = 'Join ComidaCare and make a difference today';
        document.getElementById('authSubmitBtn').textContent = 'Create Account';
        document.getElementById('authToggleText').textContent = 'Already have an account?';
        document.getElementById('authToggleLink').textContent = 'Sign In';
        
        document.getElementById('nameGroup').style.display = 'block';
        document.getElementById('phoneGroup').style.display = 'block';
        document.getElementById('addressGroup').style.display = 'block';
        if (currentUser && currentUser.role === 'donor') {
            document.getElementById('categoryGroup').style.display = 'block';
        }
    } else {
        document.getElementById('authTitle').textContent = 'Welcome Back';
        document.getElementById('authSubtitle').textContent = 'Sign in to continue making a difference';
        document.getElementById('authSubmitBtn').textContent = 'Sign In';
        document.getElementById('authToggleText').textContent = "Don't have an account?";
        document.getElementById('authToggleLink').textContent = 'Sign Up';
        
        document.getElementById('nameGroup').style.display = 'none';
        document.getElementById('phoneGroup').style.display = 'none';
        document.getElementById('addressGroup').style.display = 'none';
        document.getElementById('categoryGroup').style.display = 'none';
    }
    
    document.getElementById('authForm').reset();
}

function selectRole(role) {
    currentUser = { role: role };
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('authPage').style.display = 'flex';
    
    isSignUpMode = true;
    
    if (role === 'donor') {
        document.getElementById('categoryGroup').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Donor Registration';
    } else {
        document.getElementById('categoryGroup').style.display = 'none';
        document.getElementById('authTitle').textContent = 'Recipient Registration';
    }
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isSignUpMode) {
        if (!currentUser || !currentUser.role) {
            showNotification('Please select your role (Donor or Recipient) first!');
            setTimeout(() => {
                document.getElementById('authPage').style.display = 'none';
                document.getElementById('roleSelection').style.display = 'flex';
            }, 2000);
            return;
        }
        
        const existingUser = registeredUsers.find(u => u.email === email);
        if (existingUser) {
            showNotification('Email already registered! Please sign in.');
            return;
        }
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        if (!name || !phone || !address) {
            showNotification('Please fill in all required fields!');
            return;
        }
        
        currentUser.name = name;
        currentUser.email = email;
        currentUser.password = password;
        currentUser.phone = phone;
        currentUser.address = address;
        
        if (currentUser.role === 'donor') {
            currentUser.category = document.getElementById('category').value;
        }
        
        registeredUsers.push({...currentUser});
        showNotification('Account created successfully! Welcome to ComidaCare!');
        proceedToDashboard();
        
    } else {
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = {...user};
            showNotification('Welcome back, ' + user.name + '!');
            proceedToDashboard();
        } else {
            showNotification('Invalid email or password! Please try again.');
        }
    }
});

function proceedToDashboard() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}!`;
    
    document.getElementById('donorDashboard').style.display = 'none';
    document.getElementById('recipientDashboard').style.display = 'none';
    
    if (currentUser.role === 'donor') {
        document.getElementById('donorDashboard').style.display = 'block';
        renderDonorView();
    } else {
        document.getElementById('recipientDashboard').style.display = 'block';
        renderRecipientView();
    }
}

// DONOR TAB SWITCHING
function switchTab(tab) {
    document.querySelectorAll('#donorDashboard .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#donorDashboard .section').forEach(s => s.classList.remove('active'));
    
    event.target.classList.add('active');
    
    if (tab === 'post') {
        document.getElementById('postSection').classList.add('active');
        renderDonorView();
    } else if (tab === 'restaurants') {
        document.getElementById('restaurantsSection').classList.add('active');
        renderCategoryView('restaurant', 'restaurantGrid');
    } else if (tab === 'bakeries') {
        document.getElementById('bakeriesSection').classList.add('active');
        renderCategoryView('bakery', 'bakeryGrid');
    } else if (tab === 'outlets') {
        document.getElementById('outletsSection').classList.add('active');
        renderCategoryView('food-outlet', 'outletGrid');
    } else if (tab === 'orders') {
        document.getElementById('ordersSection').classList.add('active');
        renderOrders();
    } else if (tab === 'history') {
        document.getElementById('historySection').classList.add('active');
        renderHistory();
    }
}

// RECIPIENT TAB SWITCHING - THIS WAS MISSING!
function switchRecipientTab(tab) {
    document.querySelectorAll('#recipientDashboard .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#recipientDashboard .section').forEach(s => s.classList.remove('active'));
    
    event.target.classList.add('active');
    
    if (tab === 'available') {
        document.getElementById('recipientAvailableSection').classList.add('active');
        renderRecipientView();
    } else if (tab === 'orders') {
        document.getElementById('recipientOrdersSection').classList.add('active');
        renderRecipientOrders();
    }
}

function openAddFoodModal() {
    document.getElementById('addFoodModal').classList.add('active');
}

function closeAddFoodModal() {
    document.getElementById('addFoodModal').classList.remove('active');
    document.getElementById('addFoodForm').reset();
}

document.getElementById('addFoodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const donation = {
        id: Date.now(),
        foodName: document.getElementById('foodName').value,
        category: document.getElementById('foodCategory').value,
        foodType: document.getElementById('foodType').value,
        quantity: document.getElementById('foodQuantity').value,
        quality: document.getElementById('foodQuality').value,
        pickupTime: document.getElementById('pickupTime').value,
        businessName: document.getElementById('businessName').value,
        notes: document.getElementById('notes').value,
        donor: currentUser.name,
        donorEmail: currentUser.email,
        donorPhone: currentUser.phone,
        donorAddress: currentUser.address,
        timestamp: new Date().toLocaleString(),
        status: 'available'
    };
    
    donations.push(donation);
    closeAddFoodModal();
    renderDonorView();
    showNotification('Food donation posted successfully!');
});

function renderDonorView() {
    const grid = document.getElementById('donorFoodGrid');
    grid.innerHTML = '';
    
    const myDonations = donations.filter(d => d.donorEmail === currentUser.email && d.status === 'available');
    
    if (myDonations.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No active donations. Click "Add Food Donation" to post.</p></div>';
        return;
    }
    
    myDonations.forEach(donation => {
        grid.innerHTML += createFoodCard(donation, 'donor');
    });
}

function renderCategoryView(category, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    
    const filtered = donations.filter(d => d.category === category && d.donorEmail === currentUser.email);
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No donations in this category yet.</p></div>';
        return;
    }
    
    filtered.forEach(donation => {
        grid.innerHTML += createFoodCard(donation, 'donor');
    });
}

function renderOrders() {
    const grid = document.getElementById('ordersGrid');
    grid.innerHTML = '';
    
    const myOrders = orders.filter(o => o.donorEmail === currentUser.email);
    
    if (myOrders.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No orders received yet.</p></div>';
        return;
    }
    
    myOrders.forEach(order => {
        grid.innerHTML += `
            <div class="food-card">
                <div class="food-content">
                    <div class="food-header">
                        <div class="food-name">${order.foodName}</div>
                        <div class="food-category">${order.category}</div>
                    </div>
                    <div class="food-info"><strong>🏢 Business:</strong> ${order.businessName}</div>
                    <div class="food-info"><strong>📦 Quantity:</strong> ${order.quantity}</div>
                    <div class="food-info"><strong>⏰ Pickup:</strong> ${order.pickupTime}</div>
                    <div class="order-badge">Ordered by: ${order.recipientName}</div>
                    <div class="food-info" style="margin-top: 1rem;"><strong>📱 Contact:</strong> ${order.recipientPhone}</div>
                    <div class="food-info"><strong>📍 Address:</strong> ${order.recipientAddress}</div>
                    <div class="food-info" style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">Ordered: ${order.orderTime}</div>
                </div>
            </div>
        `;
    });
}

function renderHistory() {
    const grid = document.getElementById('historyGrid');
    grid.innerHTML = '';
    
    const history = donationHistory.filter(d => d.donorEmail === currentUser.email);
    
    if (history.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div><p>No donation history yet.</p></div>';
        return;
    }
    
    history.forEach(donation => {
        grid.innerHTML += createFoodCard(donation, 'history');
    });
}

function renderRecipientView() {
    const grid = document.getElementById('recipientFoodGrid');
    grid.innerHTML = '';
    
    const available = donations.filter(d => d.status === 'available');
    
    if (available.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No food donations available at the moment. Check back soon!</p></div>';
        return;
    }
    
    available.forEach(donation => {
        grid.innerHTML += createFoodCard(donation, 'recipient');
    });
}

// THIS FUNCTION WAS MISSING - Recipients can now see their orders!
function renderRecipientOrders() {
    const grid = document.getElementById('recipientOrdersGrid');
    grid.innerHTML = '';
    
    const myOrders = orders.filter(o => o.recipientEmail === currentUser.email);
    
    if (myOrders.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>You have not booked any food yet.</p></div>';
        return;
    }
    
    myOrders.forEach(order => {
        grid.innerHTML += `
            <div class="food-card">
                <div class="food-content">
                    <div class="food-header">
                        <div class="food-name">${order.foodName}</div>
                        <div class="food-category">${order.category}</div>
                    </div>
                    <div class="food-info"><strong>🏢 Business:</strong> ${order.businessName}</div>
                    <div class="food-info"><strong>🥗 Type:</strong> ${order.foodType}</div>
                    <div class="food-info"><strong>📦 Quantity:</strong> ${order.quantity}</div>
                    <div class="food-info"><strong>⏰ Pickup Time:</strong> ${order.pickupTime}</div>
                    <div class="food-info"><strong>📍 Pickup Location:</strong> ${order.donorAddress}</div>
                    <div class="food-info"><strong>📱 Donor Contact:</strong> ${order.donorPhone}</div>
                    ${order.notes ? `<div class="food-info"><strong>📝 Notes:</strong> ${order.notes}</div>` : ''}
                    <div class="order-badge">Booked ✓</div>
                    <div class="food-info" style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">Booked on: ${order.orderTime}</div>
                </div>
            </div>
        `;
    });
}

function createFoodCard(donation, type) {
    const statusBadge = donation.status === 'requested' ? 
        '<span class="order-badge">Requested</span>' : '';
    
    const actionButton = type === 'recipient' ? 
        `<button class="request-btn" onclick="requestFood(${donation.id})">🛒 Book This Food</button>` : '';
    
    return `
        <div class="food-card">
            <div class="food-content">
                <div class="food-header">
                    <div class="food-name">${donation.foodName}</div>
                    <div class="food-category">${donation.category}</div>
                </div>
                <div class="food-info"><strong>🏢 Business:</strong> ${donation.businessName}</div>
                <div class="food-info"><strong>🥗 Type:</strong> ${donation.foodType}</div>
                <div class="food-info"><strong>📦 Quantity:</strong> ${donation.quantity}</div>
                <div class="food-info"><strong>⭐ Quality:</strong> ${donation.quality}</div>
                <div class="food-info"><strong>⏰ Pickup Time:</strong> ${donation.pickupTime}</div>
                ${type === 'recipient' ? `<div class="food-info"><strong>📍 Location:</strong> ${donation.donorAddress}</div>` : ''}
                ${type === 'recipient' ? `<div class="food-info"><strong>📱 Contact:</strong> ${donation.donorPhone}</div>` : ''}
                ${donation.notes ? `<div class="food-info"><strong>📝 Notes:</strong> ${donation.notes}</div>` : ''}
                <div class="food-info" style="color: var(--text-gray); font-size: 0.9rem; margin-top: 0.5rem;">Posted: ${donation.timestamp}</div>
                ${statusBadge}
                ${actionButton}
            </div>
        </div>
    `;
}

function requestFood(donationId) {
    const donation = donations.find(d => d.id === donationId);
    if (donation && donation.status === 'available') {
        const order = {
            ...donation,
            recipientName: currentUser.name,
            recipientEmail: currentUser.email,
            recipientPhone: currentUser.phone,
            recipientAddress: currentUser.address,
            orderTime: new Date().toLocaleString()
        };
        
        orders.push(order);
        donation.status = 'requested';
        donationHistory.push({...donation});
        
        renderRecipientView();
        showNotification(`Food booked successfully! ${donation.businessName} will contact you soon.`);
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function logout() {
    currentUser = null;
    
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('donorDashboard').style.display = 'none';
    document.getElementById('recipientDashboard').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
    
    document.getElementById('authForm').reset();
    isSignUpMode = true;
}

function showAbout() {
    document.getElementById('landing').innerHTML = `
        <section class="about">
            <h2>About ComidaCare</h2>
            <p>
                ComidaCare is more than just an app — it's a movement to end food waste and hunger.  
                Every day, countless meals go unused while many go to bed hungry.  
                Through ComidaCare, restaurants, bakeries, and food outlets can share their surplus food with shelters and NGOs in real time.  
                Together, we can turn excess into hope, waste into nourishment, and kindness into action.  
                Join us in making sure that no good food ever goes to waste, and no one sleeps hungry. 🌱
            </p>
            <button onclick="location.reload()">Back</button>
        </section>
    `;
}

function showContact() {
    document.getElementById('landing').innerHTML = `
        <section class="contact">
            <h2>Contact Us</h2>
            <p>Email: support@comidacare.org</p>
            <p>Phone: +91 98765 43210</p>
            <button onclick="location.reload()">Back</button>
        </section>
    `;
}