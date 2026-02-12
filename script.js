const grid = document.getElementById('product-grid');
const adminDock = document.getElementById('admin-panel');
const loginBtn = document.getElementById('open-login-btn');

// --- 1. INSTANT ADMIN AUTH CHECK ---
if (localStorage.getItem('snb_session') === 'active') {
    document.addEventListener('DOMContentLoaded', () => {
        setupAdmin();
    });
}

// --- 2. DATA PERSISTENCE ---
let recipes = JSON.parse(localStorage.getItem('snb_vault')) || [];

window.onload = () => {
    draw();
};

// --- 3. LOGIN & EFFECTS ---
document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('snb_session', 'active');
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('access-overlay').style.display = 'flex';
        
        setTimeout(() => {
            location.reload(); 
        }, 1500);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

function setupAdmin() {
    adminDock.style.display = 'block';
    loginBtn.style.display = 'none';
    document.body.classList.add('admin-mode');
}

// --- 4. RENDER WITH SCROLL ANIMATIONS ---
function draw() {
    grid.innerHTML = '';
    recipes.forEach(r => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="kill(${r.id})">×</button>
            <img src="${r.img}">
            <div class="card-content">
                <span style="color:var(--accent); font-weight:700; font-size:0.7rem;">${r.cat}</span>
                <h3 style="margin:10px 0;">${r.name}</h3>
                <div style="color:var(--accent);">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Intersection Observer for the "Cool" fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(c => observer.observe(c));
}

// --- 5. POSTING & DELETING ---
document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newItem = { id: Date.now(), name, cat, img: e.target.result };
            recipes.push(newItem);
            localStorage.setItem('snb_vault', JSON.stringify(recipes));
            draw();
            document.getElementById('new-name').value = '';
        };
        reader.readAsDataURL(file);
    }
};

window.kill = (id) => {
    if(confirm("Permanently delete this creation?")) {
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('snb_vault', JSON.stringify(recipes));
        draw();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('snb_session');
    location.reload();
};

loginBtn.onclick = () => {
    document.getElementById('error-msg').style.display = 'none';
    document.getElementById('login-modal').style.display = 'flex';
};
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';
