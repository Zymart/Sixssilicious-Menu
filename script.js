const BIN_ID = '698dbb6d43b1c97be9795688';
const API_KEY = '$2a$10$McXg3fOwbLYW3Sskgfroj.nzMjtwwubDEz08zXpBN32KQ.8MvCJgK';
const productGrid = document.getElementById('product-grid');

// 1. RE-USABLE ANIMATION OBSERVER
const createObserver = () => {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });
};

let scrollObserver = createObserver();

// 2. CLOUD FUNCTIONS
async function loadFromCloud() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest?meta=false`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await res.json();
        return data.recipes || [];
    } catch (err) {
        console.error("Load failed", err);
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
            body: JSON.stringify({ "recipes": dataArray })
        });
        return res.ok;
    } catch (err) {
        console.error("Save failed", err);
        return false;
    }
}

// 3. DRAW FUNCTION (RESETS ANIMATIONS)
async function draw() {
    const posts = await loadFromCloud();
    productGrid.innerHTML = '';
    
    // Refresh Observer
    scrollObserver.disconnect();
    scrollObserver = createObserver();

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

// 4. ADMIN & LOGIN
if (localStorage.getItem('snb_auth') === 'true') {
    document.getElementById('admin-panel').style.display = 'block';
    document.body.classList.add('admin-mode');
    document.getElementById('open-login-btn').style.display = 'none';
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

// 5. ADD PRODUCT (FIXED MULTIPLE ADDS)
document.getElementById('add-btn').onclick = async () => {
    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const cat = document.getElementById('new-cat').value;
    const fileInput = document.getElementById('new-image-file');
    const file = fileInput.files[0];

    if (name && price && cat && file) {
        const btn = document.getElementById('add-btn');
        btn.innerText = "PUBLISHING...";
        btn.disabled = true;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const current = await loadFromCloud();
            const newItem = { id: Date.now().toString(), name, price, cat, img: e.target.result };
            current.push(newItem);
            
            const success = await saveToCloud(current);
            if (success) {
                // Clear inputs
                document.getElementById('new-name').value = '';
                document.getElementById('new-price').value = '';
                document.getElementById('new-cat').value = '';
                fileInput.value = '';
                await draw(); // Refresh the list without reloading the whole page
            } else {
                alert("Upload failed. Try a smaller photo.");
            }
            btn.innerText = "PUBLISH";
            btn.disabled = false;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Fill all fields!");
    }
};

window.removePost = async (id) => {
    if(confirm("Delete item?")) {
        let current = await loadFromCloud();
        current = current.filter(item => item.id !== id);
        const success = await saveToCloud(current);
        if (success) draw();
    }
};

document.getElementById('open-login-btn').onclick = () => document.getElementById('login-modal').style.display='flex';
document.getElementById('close-modal').onclick = () => document.getElementById('login-modal').style.display='none';
document.getElementById('logout-btn').onclick = () => { localStorage.clear(); location.reload(); };

// Initial Load
draw();
