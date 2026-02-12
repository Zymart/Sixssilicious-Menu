const loginModal = document.getElementById('login-modal');
const openBtn = document.getElementById('open-login-btn');
const productGrid = document.getElementById('product-grid');

openBtn.onclick = () => loginModal.style.display = 'flex';

document.getElementById('submit-login').onclick = () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;
    const team = ["Zymart", "Brigette", "Lance", "Taduran"];

    if (team.includes(user) && pass === "sixssiliciousteam") {
        loginModal.style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
};

document.getElementById('add-btn').onclick = () => {
    const name = document.getElementById('new-name').value;
    const cat = document.getElementById('new-cat').value;
    const img = document.getElementById('new-img').value || 'https://via.placeholder.com/500';

    if (name && cat) {
        const newCard = document.createElement('div');
        newCard.className = 'product-card';
        newCard.innerHTML = `
            <img src="${img}" alt="${name}">
            <div class="card-content">
                <span class="category">${cat}</span>
                <h3>${name}</h3>
                <div class="rating">⭐⭐⭐⭐ 5.0</div>
            </div>
        `;
        productGrid.appendChild(newCard);
    }
};
