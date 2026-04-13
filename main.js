// ============================================
//  PIND BALLUCHI — MAIN JS
// ============================================

// Cart State
let cart = JSON.parse(localStorage.getItem('pb_cart') || '[]');

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount, .cart-count-display').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'flex';
  });
}

function addToCart(name, price, category) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { cart.push({ name, price, qty: 1, category: category || '' }); }
  localStorage.setItem('pb_cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`🛒 ${name} added to cart!`);
}

function showToast(msg) {
  let toast = document.getElementById('pb-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pb-toast';
    toast.style.cssText = `position:fixed;bottom:100px;right:28px;background:linear-gradient(135deg,#c0392b,#962d22);color:#fff;padding:12px 20px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(192,57,43,0.5);transform:translateY(20px);opacity:0;transition:all 0.3s ease;max-width:260px;`;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('done');
  }, 1900);
  updateCartCount();
});

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// Reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Star rating input
const starInputs = document.querySelectorAll('.star-inp');
let selectedRating = 0;
starInputs.forEach(star => {
  star.addEventListener('mouseover', () => {
    const val = +star.dataset.val;
    starInputs.forEach(s => s.classList.toggle('hover', +s.dataset.val <= val));
  });
  star.addEventListener('mouseout', () => {
    starInputs.forEach(s => s.classList.remove('hover'));
  });
  star.addEventListener('click', () => {
    selectedRating = +star.dataset.val;
    starInputs.forEach(s => s.classList.toggle('active', +s.dataset.val <= selectedRating));
  });
});

// Review form
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    if (!name || !comment || !selectedRating) { showToast('⚠️ Please fill all fields and select rating'); return; }
    reviewForm.style.display = 'none';
    const success = document.getElementById('reviewSuccess');
    if (success) success.classList.add('show');
  });
}

// Dish order buttons on homepage
document.querySelectorAll('.dish-order-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.dish-card');
    const name = card.querySelector('.dish-name')?.textContent || 'Dish';
    const priceText = card.querySelector('.dish-price')?.textContent || '₹0';
    const price = parseInt(priceText.replace(/[₹,]/g, '')) || 0;
    addToCart(name, price, 'Popular');
  });
});

// Smooth active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});
