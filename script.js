// Select Elements
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const closeLoginBtn = document.getElementById('close-modal');
const submitLoginBtn = document.getElementById('submit-login');
const adminPanel = document.getElementById('admin-panel');
const addProductBtn = document.getElementById('add-btn');
const productGrid = document.getElementById('product-grid');
const logoutBtn = document.getElementById('logout-btn');

// Show Modal
openLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Close Modal
closeLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Login Logic
submitLoginBtn.addEventListener('click', () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        loginModal.style.display = 'none';
        adminPanel.style.display = 'block'; // Show Admin Tools
        openLoginBtn.style.display = 'none'; // Hide Login Button
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
});

// Add Product Logic
addProductBtn.addEventListener('click', () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const img = document.getElementById('new-img').value || 'https://via.placeholder.com/500';

    if (name && cat) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${img}" alt="${name}">
            <div class="card-content">
                <span class="category">${cat}</span>
                <h3>${name}</h3>
                <div style="color: #fbc02d;">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        productGrid.appendChild(card);
        
        // Clear inputs after posting
        document.getElementById('new-name').value = '';
        document.getElementById('new-cat').value = '';
        document.getElementById('new-img').value = '';
    } else {
        alert("Please enter at least a Name and Category!");
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    location.reload();
});
