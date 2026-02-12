// ELEMENTS
const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const adminPanel = document.getElementById('admin-panel');
const productGrid = document.getElementById('product-grid');
const accessOverlay = document.getElementById('access-overlay');

// 1. IMMEDIATE SESSION CHECK (The Fix)
if (localStorage.getItem('sixss_admin_active') === 'true') {
    // We do this outside window.onload so it happens instantly
    document.addEventListener("DOMContentLoaded", () => {
        showAdminUI();
    });
}

// Load products from storage
let products = JSON.parse(localStorage.getItem('sixss_products')) || [];

window.onload = () => {
    renderProducts();
};

// 2. LOGIN LOGIC
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        // SAVE STATUS PERMANENTLY
        localStorage.setItem('sixss_admin_active', 'true');
        
        loginModal.style.display = 'none';
        
        // Success Effect
        accessOverlay.style.display = 'flex';
        setTimeout(() => {
            accessOverlay.style.display = 'none';
            showAdminUI();
        }, 1200);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

function showAdminUI() {
    adminPanel.style.display = 'block';
    openLoginBtn.style.display = 'none';
    document.body.classList.add('admin-mode');
}

// 3. POSTING LOGIC
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const fileInput = document.getElementById('new-image-file');
    const file = fileInput.files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newProduct = { 
                id: Date.now(), 
                name: name, 
                cat: cat, 
                img: e.target.result 
            };
            products.push(newProduct);
            localStorage.setItem('sixss_products', JSON.stringify(products));
            renderProducts();
            
            // Clear inputs
            document.getElementById('new-name').value = '';
            document.getElementById('new-cat').value = '';
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please fill all fields and upload an image!");
    }
};

// 4. RENDER WITH DELETE BUTTON
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="deleteProduct(${p.id})">×</button>
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

// 5. DELETE FUNCTION
window.deleteProduct = (id) => {
    if(confirm("Delete this post?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('sixss_products', JSON.stringify(products));
        renderProducts();
    }
};

// 6. LOGOUT (Clears session)
document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('sixss_admin_active');
    location.reload();
};

openLoginBtn.onclick = () => loginModal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => loginModal.style.display = 'none';
