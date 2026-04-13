// ============================================
//  PIND BALLUCHI — ORDER PAGE JS
// ============================================

const POPULAR_ITEMS = [
  { name: 'Butter Chicken', price: 475, cat: 'Main NonVeg' },
  { name: 'Chicken Biryani', price: 549, cat: 'Rice & Biryani' },
  { name: 'Malai Kofta', price: 399, cat: 'Main Veg' },
  { name: 'Chicken Tikka', price: 499, cat: 'Starters NonVeg' },
  { name: 'Paneer Tikka', price: 479, cat: 'Starters Veg' },
  { name: 'Dal Makhani Special', price: 359, cat: 'Main Veg' },
  { name: 'Butter Naan', price: 60, cat: 'Breads' },
  { name: 'Lassi', price: 149, cat: 'Drinks' },
  { name: 'Garlic Naan', price: 90, cat: 'Breads' },
  { name: 'Veg Biryani', price: 475, cat: 'Rice & Biryani' },
  { name: 'Kadhai Paneer', price: 379, cat: 'Main Veg' },
  { name: 'Mutton Biryani', price: 599, cat: 'Rice & Biryani' },
];

const DELIVERY_FEE = 40;

// Render quick add grid
function renderQuickAdd() {
  const grid = document.getElementById('quickAddGrid');
  if (!grid) return;
  grid.innerHTML = POPULAR_ITEMS.map((item, i) => `
    <div class="qa-item">
      <span class="qa-name">${item.name}</span>
      <span class="qa-price">₹${item.price}</span>
      <button class="qa-add-btn" data-idx="${i}" id="qaAdd${i}">+ Add</button>
    </div>
  `).join('');

  grid.querySelectorAll('.qa-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = POPULAR_ITEMS[+btn.dataset.idx];
      addToCart(item.name, item.price, item.cat);
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = '+ Add'; btn.classList.remove('added'); }, 1500);
      renderOrderCart();
    });
  });
}

// Render cart items
function renderOrderCart() {
  const cart = JSON.parse(localStorage.getItem('pb_cart') || '[]');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  const checkoutCard = document.getElementById('checkoutCard');
  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartSummary.style.display = 'none';
    if (checkoutCard) checkoutCard.style.display = 'none';
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(cartEmpty);
    return;
  }

  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';
  if (checkoutCard) checkoutCard.style.display = 'block';

  cartItemsEl.innerHTML = cart.map((item, i) => `
    <div class="ci-item" id="ciItem${i}">
      <span class="ci-name">${item.name}</span>
      <div class="ci-controls">
        <button class="ci-btn" data-action="dec" data-idx="${i}" id="ciBtnDec${i}">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" data-action="inc" data-idx="${i}" id="ciBtnInc${i}">+</button>
      </div>
      <span class="ci-price">₹${item.price * item.qty}</span>
      <button class="ci-remove" data-idx="${i}" id="ciRemove${i}">✕</button>
    </div>
  `).join('');

  // Recalculate totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const deliveryType = document.querySelector('.delivery-btn.active')?.dataset.type || 'delivery';
  const deliveryFee = deliveryType === 'pickup' ? 0 : DELIVERY_FEE;
  const total = subtotal + tax + deliveryFee;

  document.getElementById('subtotalAmt').textContent = `₹${subtotal}`;
  document.getElementById('deliveryFeeAmt').textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  document.getElementById('taxAmt').textContent = `₹${tax}`;
  document.getElementById('totalAmt').textContent = `₹${total}`;

  // Bind control buttons
  cartItemsEl.querySelectorAll('.ci-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart2 = JSON.parse(localStorage.getItem('pb_cart') || '[]');
      const idx = +btn.dataset.idx;
      if (btn.dataset.action === 'inc') { cart2[idx].qty++; }
      else { cart2[idx].qty--; if (cart2[idx].qty < 1) { cart2.splice(idx, 1); } }
      localStorage.setItem('pb_cart', JSON.stringify(cart2));
      updateCartCount();
      renderOrderCart();
    });
  });
  cartItemsEl.querySelectorAll('.ci-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart2 = JSON.parse(localStorage.getItem('pb_cart') || '[]');
      cart2.splice(+btn.dataset.idx, 1);
      localStorage.setItem('pb_cart', JSON.stringify(cart2));
      updateCartCount();
      renderOrderCart();
    });
  });
}

// Delivery toggle
document.querySelectorAll('.delivery-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const deliveryFields = document.getElementById('deliveryFields');
    if (deliveryFields) {
      deliveryFields.style.display = btn.dataset.type === 'pickup' ? 'none' : '';
    }
    renderOrderCart();
  });
});

// Payment toggle
document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('upiSection').style.display = radio.value === 'upi' && radio.checked ? 'block' : 'none';
    document.getElementById('cardSection').style.display = radio.value === 'card' && radio.checked ? 'block' : 'none';
  });
});

// Card live preview
const cardNum = document.getElementById('cardNum');
const cardName = document.getElementById('cardName');
const cardExp = document.getElementById('cardExp');
if (cardNum) {
  cardNum.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    const disp = v.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('cardNumDisplay').textContent = disp;
  });
  cardName.addEventListener('input', (e) => {
    document.getElementById('cardNameDisplay').textContent = e.target.value.toUpperCase() || 'CARDHOLDER';
  });
  cardExp.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
    e.target.value = v;
    document.getElementById('cardExpDisplay').textContent = v || 'MM/YY';
  });
}

// Checkout Form submit
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cart2 = JSON.parse(localStorage.getItem('pb_cart') || '[]');
    if (cart2.length === 0) { showToast('⚠️ Cart is empty!'); return; }
    const modal = document.getElementById('orderModal');
    if (modal) modal.style.display = 'flex';
    localStorage.removeItem('pb_cart');
    updateCartCount();
  });
}

// Back home
document.getElementById('backHomeBtn')?.addEventListener('click', () => {
  document.getElementById('orderModal').style.display = 'none';
  window.location.href = 'index.html';
});

// Init
renderQuickAdd();
renderOrderCart();
