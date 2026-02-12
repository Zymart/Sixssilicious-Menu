const grid = document.getElementById('product-grid');
const adminDock = document.getElementById('admin-panel');
const loginBtn = document.getElementById('open-login-btn');

// --- 1. INSTANT ADMIN CHECK ---
if (localStorage.getItem('snb_admin_status') === 'active') {
    document.addEventListener('DOMContentLoaded', () => {
        enableAdminMode();
    });
}

// --- 2. DATA MANAGEMENT ---
let posts = JSON.parse(localStorage.getItem('snb_posts')) || [];

window.onload = () => {
    render();
};

// --- 3. LOGIN LOGIC ---
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('snb_admin_status', 'active');
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('access-overlay').style.display = 'flex';
        
        setTimeout(() => {
            location.reload(); // Reloads once to lock in the admin state
        }, 1200);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

function enableAdminMode() {
    adminDock.style.display = 'block';
    loginBtn.style.display = 'none';
    document.body.classList.add('admin-mode');
}

// --- 4. POSTING LOGIC ---
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const fileInput = document.getElementById('new-image-file');
    const file = fileInput.files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newItem = { id: Date.now(), name, cat, img: e.target.result };
            posts.push(newItem);
            localStorage.setItem('snb_posts', JSON.stringify(posts));
            render();
            
            // Clear inputs
            document.getElementById('new-name').value = '';
            document.getElementById('new-cat').value = '';
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please fill in everything and upload a photo!");
    }
};

function render() {
    grid.innerHTML = '';
    posts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <button class="del-btn" onclick="remove(${p.id})">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span class="category">${p.cat}</span>
                <h3>${p.name}</h3>
                <div style="color:var(--accent); margin-top:10px;">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        grid.appendChild(div);
    });
}

window.remove = (id) => {
    if(confirm("Delete this post?")) {
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('snb_posts', JSON.stringify(posts));
        render();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('snb_admin_status');
    location.reload();
};

loginBtn.onclick = () => {
    document.getElementById('error-msg').style.display = 'none';
    document.getElementById('login-modal').style.display = 'flex';
};
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display = 'none';
