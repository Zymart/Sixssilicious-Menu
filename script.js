const BIN_ID = '698dbb6d43b1c97be9795688';
const API_KEY = '$2a$10$McXg3fOwbLYW3Sskgfroj.nzMjtwwubDEz08zXpBN32KQ.8MvCJgK';
const productGrid = document.getElementById('product-grid');

// Check Login State
function checkAuth() {
    return localStorage.getItem('snb_auth') === 'true';
}

async function loadFromCloud() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?meta=false`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await res.json();
        return data.recipes || [];
    } catch (err) { return []; }
}

async function saveToCloud(dataArray) {
    if (!checkAuth()) {
        alert("Session Expired. Please log in again.");
        location.reload();
        return false;
    }
    try {
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
            body: JSON.stringify({ "recipes": dataArray })
        });
        return true;
    } catch (err) { return false; }
}

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

async function draw() {
    const posts = await loadFromCloud();
    productGrid.innerHTML = '';

    posts.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="removePost('${p.id}')">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span class="cat-label">${p.cat}</span>
                <h3 style="margin:5px 0;">${p.name}</h3>
                <span class="price-display">₱${p.price || '0'}</span>
            </div>
        `;
        productGrid.appendChild(card);
        scrollObserver.observe(card);
    });
}

// LOGIN LOGIC
if (checkAuth()) {
    document.getElementById('admin-panel').style.display = 'block';
    document.body.classList.add('admin-mode');
    document.getElementById('open-login-btn').style.display = 'none';
}

document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const authorized = ["Zymart", "Brigette", "Lance", "Taduran"];
    
    if (authorized.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('snb_auth', 'true');
        location.reload();
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

// PUBLISH LOGIC
document.getElementById('add-btn').onclick = async () => {
    if (!checkAuth()) {
        alert("You must be logged in to publish.");
        return;
    }

    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && price && cat && file) {
        document.getElementById('add-btn').innerText = "SYNCING...";
        const reader = new FileReader();
        reader.onload = async (e) => {
            let current = await loadFromCloud();
            current.push({ id: Date.now().toString(), name, price, cat, img: e.target.result });
            if (await saveToCloud(current)) {
                location.reload();
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert("Missing information!");
    }
};

window.removePost = async (id) => {
    if (!checkAuth()) return;
    if(confirm("Delete item?")) {
        let current = await loadFromCloud();
        current = current.filter(item => item.id !== id);
        await saveToCloud(current);
        draw();
    }
};

document.getElementById('open-login-btn').onclick = () => document.getElementById('login-modal').style.display='flex';
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';
document.getElementById('logout-btn').onclick = () => { localStorage.clear(); location.reload(); };

// KEEP ALIVE: Refresh every 2 minutes
setInterval(draw, 120000);
draw();
