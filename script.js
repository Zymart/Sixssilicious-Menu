const BIN_ID = '698dbb6d43b1c97be9795688';
const API_KEY = '$2a$10$McXg3fOwbLYW3Sskgfroj.nzMjtwwubDEz08zXpBN32KQ.8MvCJgK';
const foodGrid = document.getElementById('food-grid');
const drinksGrid = document.getElementById('drinks-grid');
const syncIndicator = document.getElementById('sync-indicator');

// --- LOAD DATA ---
async function loadFromCloud() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?meta=false`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await res.json();
        syncIndicator.classList.add('online');
        return data.recipes || [];
    } catch (err) {
        syncIndicator.classList.remove('online');
        console.error("Cloud Error:", err);
        return [];
    }
}

// --- SAVE DATA ---
async function saveToCloud(dataArray) {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
            body: JSON.stringify({ "recipes": dataArray })
        });
        return res.ok;
    } catch (err) { return false; }
}

// --- ANIMATION ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
        else entry.target.classList.remove('is-visible');
    });
}, { threshold: 0.1 });

// --- RENDER (FIXED CATEGORY CHECK) ---
async function draw() {
    const posts = await loadFromCloud();
    
    // Clear grids
    foodGrid.innerHTML = '';
    drinksGrid.innerHTML = '';

    posts.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="removePost('${p.id}')">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span style="color:var(--accent); font-weight:700; font-size:0.7rem; text-transform:uppercase;">${p.cat}</span>
                <h3 style="margin:5px 0;">${p.name}</h3>
                <span class="price-display">₱${p.price || '0'}</span>
            </div>
        `;

        // CATEGORY CHECK (Lowercase for safety)
        const category = p.cat ? p.cat.toLowerCase() : 'food';
        
        if (category === "drinks") {
            drinksGrid.appendChild(card);
        } else {
            foodGrid.appendChild(card);
        }
        
        scrollObserver.observe(card);
    });
}

// --- ADMIN & LOGIN ---
if (localStorage.getItem('snb_auth') === 'true') {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('open-login-btn').style.display = 'none';
    document.body.classList.add('admin-mode');
}

document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    if (["Zymart", "Brigette", "Lance", "Taduran"].includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('snb_auth', 'true');
        location.reload();
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

// --- PUBLISH PRODUCT ---
document.getElementById('add-btn').onclick = async () => {
    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const cat = document.getElementById('new-cat').value; // Gets "Food" or "Drinks"
    const file = document.getElementById('new-image-file').files[0];

    if (name && price && cat && file) {
        const btn = document.getElementById('add-btn');
        btn.innerText = "UPLOADING..."; btn.disabled = true;

        const reader = new FileReader();
        reader.onload = async (e) => {
            let currentPosts = await loadFromCloud();
            currentPosts.push({ 
                id: Date.now().toString(), 
                name, 
                price, 
                cat, 
                img: e.target.result 
            });
            
            if (await saveToCloud(currentPosts)) {
                await draw();
                document.getElementById('new-name').value = '';
                document.getElementById('new-price').value = '';
            }
            btn.innerText = "PUBLISH"; btn.disabled = false;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Fill everything!");
    }
};

window.removePost = async (id) => {
    if(confirm("Delete item?")) {
        let currentPosts = await loadFromCloud();
        currentPosts = currentPosts.filter(p => p.id !== id);
        await saveToCloud(currentPosts);
        draw();
    }
};

document.getElementById('logout-btn').onclick = () => { localStorage.clear(); location.reload(); };
document.getElementById('open-login-btn').onclick = () => document.getElementById('login-modal').style.display='flex';
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';

// Refresh every 30 seconds for other devices
setInterval(draw, 30000);
draw();
