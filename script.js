// ELEMENTS
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const adminPanel = document.getElementById('admin-panel');
const productGrid = document.getElementById('product-grid');
const accessOverlay = document.getElementById('access-overlay');

// 1. IRONCLAD SESSION RESTORE
if (localStorage.getItem('SNB_ADMIN_SESSION') === 'active') {
    // Force UI into admin mode immediately
    document.documentElement.classList.add('admin-is-here'); 
    window.addEventListener('DOMContentLoaded', () => {
        showAdminUI();
    });
}

// 2. LOAD DATA
let products = JSON.parse(localStorage.getItem('SNB_POSTS')) || [];

window.addEventListener('load', () => {
    renderProducts();
});

// 3. LOGIN FUNCTION
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('SNB_ADMIN_SESSION', 'active');
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

// 4. POSTING & SAVING
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPost = { id: Date.now(), name, cat, img: e.target.result };
            products.push(newPost);
            
            // SAVE TO STORAGE
            localStorage.setItem('SNB_POSTS', JSON.stringify(products));
            renderProducts();
            
            document.getElementById('new-name').value = '';
            document.getElementById('new-cat').value = '';
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please provide a Title, Category, and Photo!");
    }
};

// 5. RENDER POSTS
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="deletePost(${p.id})">×</button>
            <img src="${p.img}" alt="${p.name}">
            <div class="card-content">
                <span class="category">${p.cat}</span>
                <h3>${p.name}</h3>
                <div style="color: #fbc02d; margin-top:10px;">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// 6. DELETE & LOGOUT
window.deletePost = (id) => {
    if(confirm("Permanently delete this post?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('SNB_POSTS', JSON.stringify(products));
        renderProducts();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('SNB_ADMIN_SESSION');
    location.reload();
};

openLoginBtn.onclick = () => loginModal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => loginModal.style.display = 'none';
