const grid = document.getElementById('product-grid');
const adminDock = document.getElementById('admin-panel');

// 1. Instant Session Recovery
if (localStorage.getItem('snb_active') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
        adminDock.style.display = 'block';
        document.getElementById('open-login-btn').style.display = 'none';
        document.body.classList.add('admin-mode');
    });
}

// 2. Load Data
let posts = JSON.parse(localStorage.getItem('snb_storage')) || [];

function draw() {
    grid.innerHTML = '';
    posts.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // This adds a slight delay to each card so they cascade
        card.style.animationDelay = `${index * 0.1}s`; 
        card.innerHTML = `
            <button class="del-btn" onclick="remove(${p.id})">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span style="color:var(--accent); font-size:0.7rem; font-weight:700;">${p.cat}</span>
                <h3 style="margin:10px 0;">${p.name}</h3>
                <div style="color:var(--accent);">⭐⭐⭐⭐⭐</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. Auth
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;

    if (user === "Zymart" || user === "Brigette" || user === "Lance" || user === "Taduran") {
        if (pass === "sixssiliciousteam") {
            localStorage.setItem('snb_active', 'true');
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('access-overlay').style.display = 'flex';
            setTimeout(() => { location.reload(); }, 1200);
            return;
        }
    }
    document.getElementById('error-msg').style.display = 'block';
};

// 4. Publishing
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newItem = { id: Date.now(), name, cat, img: e.target.result };
            posts.push(newItem);
            localStorage.setItem('snb_storage', JSON.stringify(posts));
            draw();
            document.getElementById('new-name').value = '';
        };
        reader.readAsDataURL(file);
    }
};

window.remove = (id) => {
    if(confirm("Delete post?")) {
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('snb_storage', JSON.stringify(posts));
        draw();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.clear();
    location.reload();
};

document.getElementById('open-login-btn').onclick = () => {
    document.getElementById('error-msg').style.display='none';
    document.getElementById('login-modal').style.display='flex';
};
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';

// Load
draw();
