// --- CONFIGURATION ---
const BIN_ID = '698dbb6d43b1c97be9795688';
const API_KEY = '$2a$10$McXg3fOwbLYW3Sskgfroj.nzMjtwwubDEz08zXpBN32KQ.8MvCJgK';
const grid = document.getElementById('product-grid');
const adminDock = document.getElementById('admin-panel');

// --- 1. CLOUD SYNC LOGIC (TARGETING "recipes" KEY) ---
async function loadFromCloud() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await res.json();
        // Extracting specifically from the "recipes" key shown in your screenshot
        return data.record.recipes || [];
    } catch (err) {
        console.error("Cloud Load Error:", err);
        return [];
    }
}

async function saveToCloud(dataArray) {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'X-Master-Key': API_KEY 
            },
            // Wrapping the list back into the "recipes" object structure
            body: JSON.stringify({ "recipes": dataArray })
        });
        const result = await res.json();
        console.log("Cloud Updated:", result);
    } catch (err) {
        console.error("Cloud Save Error:", err);
    }
}

// --- 2. REPEAT ANIMATION ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible'); 
        }
    });
}, { threshold: 0.1 });

// --- 3. RENDERING ---
async function draw() {
    grid.innerHTML = '<p style="color:var(--accent); text-align:center; width:100%;">Syncing Cloud Data...</p>';
    const posts = await loadFromCloud();
    grid.innerHTML = '';

    posts.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="del-btn" onclick="removePost('${p.id}')">×</button>
            <img src="${p.img}">
            <div class="card-content">
                <span style="color:var(--accent); font-weight:700; font-size:0.7rem;">${p.cat}</span>
                <h3 style="margin:10px 0;">${p.name}</h3>
                <div style="color:var(--accent);">⭐⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        grid.appendChild(card);
        scrollObserver.observe(card);
    });
}

// --- 4. ADMIN & AUTH ---
if (localStorage.getItem('snb_auth') === 'true') {
    adminDock.style.display = 'block';
    document.getElementById('open-login-btn').style.display = 'none';
    document.body.classList.add('admin-mode');
}

document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        localStorage.setItem('snb_auth', 'true');
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('access-overlay').style.display = 'flex';
        setTimeout(() => { location.reload(); }, 1200);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

// --- 5. ADD POST (LAPTOP TO PHONE SYNC) ---
document.getElementById('add-btn').onclick = async () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = document.getElementById('new-image-file').files[0];

    if (name && cat && file) {
        const btn = document.getElementById('add-btn');
        btn.innerText = "CLOUD SYNCING...";
        btn.disabled = true;

        const reader = new FileReader();
        reader.onload = async (e) => {
            let currentPosts = await loadFromCloud();
            const newItem = { id: Date.now().toString(), name, cat, img: e.target.result };
            currentPosts.push(newItem);
            
            await saveToCloud(currentPosts);
            await draw();
            
            btn.innerText = "PUBLISH";
            btn.disabled = false;
            document.getElementById('new-name').value = '';
        };
        reader.readAsDataURL(file);
    }
};

window.removePost = async (id) => {
    if(confirm("Delete this everywhere?")) {
        let currentPosts = await loadFromCloud();
        currentPosts = currentPosts.filter(p => p.id !== id);
        await saveToCloud(currentPosts);
        draw();
    }
};

document.getElementById('logout-btn').onclick = () => {
    localStorage.clear();
    location.reload();
};

document.getElementById('open-login-btn').onclick = () => document.getElementById('login-modal').style.display='flex';
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';

// Initial Load
draw();
