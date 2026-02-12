const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const adminPanel = document.getElementById('admin-panel');
const productGrid = document.getElementById('product-grid');
const accessOverlay = document.getElementById('access-overlay');

let products = JSON.parse(localStorage.getItem('sixss_products')) || [];

// 1. Check if already logged in on Load
window.onload = () => {
    if (localStorage.getItem('sixss_admin') === 'true') {
        showAdminUI();
    }
    renderProducts();
};

// 2. Login Logic
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('sixss_admin', 'true');
        loginModal.style.display = 'none';
        
        // Show Success Effect
        accessOverlay.style.display = 'flex';
        setTimeout(() => {
            accessOverlay.style.display = 'none';
            showAdminUI();
        }, 1500);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

function showAdminUI() {
    adminPanel.style.display = 'block';
    openLoginBtn.style.display = 'none';
    document.body.classList.add('admin-mode');
}

// 3. Add Product & Save to LocalStorage
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newProduct = { id: Date.now(), name, cat, img: e.target.result };
            products.push(newProduct);
            localStorage.setItem('sixss_products', JSON.stringify(products));
            renderProducts();
            
            // Clear inputs
            document.getElementById('new-name').value = '';
            document.getElementById('new-cat').value = '';
        };
        reader.readAsDataURL(file);
    }
};

// 4. Render Products
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="deleteProduct(${p.id})">X</button>
            <img src="${p.img}">
            <div class="card-content">
                <span class="category">${p.cat}</span>
                <h3>${p.name}</h3>
                <div style="color: #fbc02d;">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// 5. Delete Product
window.deleteProduct = (id) => {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('sixss_products', JSON.stringify(products));
    renderProducts();
};

// 6. Logout
document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('sixss_admin');
    location.reload();
};

openLoginBtn.onclick = () => loginModal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => loginModal.style.display = 'none';
