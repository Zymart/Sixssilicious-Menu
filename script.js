const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const adminPanel = document.getElementById('admin-panel');
const productGrid = document.getElementById('product-grid');
const accessOverlay = document.getElementById('access-overlay');

// 1. RECOVERY SYSTEM (Fixes the refresh-logout bug)
function checkSession() {
    if (localStorage.getItem('SNB_LOGGED_IN') === 'true') {
        showAdminUI();
    }
}

// 2. DATA STORAGE
let products = JSON.parse(localStorage.getItem('SNB_STORAGE')) || [];

window.onload = () => {
    checkSession();
    renderProducts();
};

// 3. LOGIN LOGIC
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value.trim();
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('SNB_LOGGED_IN', 'true');
        loginModal.style.display = 'none';
        
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

// 4. POSTING LOGIC
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPost = { id: Date.now(), name, cat, img: e.target.result };
            products.push(newPost);
            
            // SAVE PERMANENTLY
            localStorage.setItem('SNB_STORAGE', JSON.stringify(products));
            renderProducts();
            
            // Reset
            document.getElementById('new-name').value = '';
            document.getElementById('new-cat').value = '';
        };
        reader.readAsDataURL(file);
    } else {
        alert("Fill in at least the Title and Photo!");
    }
};

// 5. RENDER
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="deletePost(${p.id})">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span class="category">${p.cat || 'Nutritious Bite'}</span>
                <h3>${p.name}</h3>
                <div style="color: #f1c40f;">⭐⭐⭐⭐⭐</div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// 6. DELETE & LOGOUT
window.deletePost = (id) => {
    if(confirm("Remove this post?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('SNB_STORAGE', JSON.stringify(products));
        renderProducts();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('SNB_LOGGED_IN');
    location.reload();
};

openLoginBtn.onclick = () => loginModal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => loginModal.style.display = 'none';
