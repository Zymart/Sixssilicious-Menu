const loginModal = document.getElementById('login-modal');
const openLoginBtn = document.getElementById('open-login-btn');
const closeLoginBtn = document.getElementById('close-modal');
const submitLoginBtn = document.getElementById('submit-login');
const adminPanel = document.getElementById('admin-panel');
const addProductBtn = document.getElementById('add-btn');
const productGrid = document.getElementById('product-grid');
const imageInput = document.getElementById('new-image-file');

// Show/Hide Modal
openLoginBtn.onclick = () => loginModal.style.display = 'flex';
closeLoginBtn.onclick = () => loginModal.style.display = 'none';

// Login
submitLoginBtn.onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        loginModal.style.display = 'none';
        adminPanel.style.display = 'block';
        openLoginBtn.style.display = 'none';
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

// Add Product with File Upload
addProductBtn.onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const file = imageInput.files[0];

    if (name && cat && file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${e.target.result}" alt="${name}">
                <div class="card-content">
                    <span class="category">${cat}</span>
                    <h3>${name}</h3>
                    <div style="color: #fbc02d;">⭐⭐⭐⭐⭐ 5.0</div>
                </div>
            `;
            productGrid.appendChild(card);
        }
        
        reader.readAsDataURL(file); // Convert image to data for display

        // Reset form
        document.getElementById('new-name').value = '';
        document.getElementById('new-cat').value = '';
        imageInput.value = '';
    } else {
        alert("Fill in Name, Category, and Upload an Image!");
    }
};

document.getElementById('logout-btn').onclick = () => location.reload();
