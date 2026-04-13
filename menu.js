// ============================================
//  PIND BALLUCHI — MENU JS
// ============================================

// Filter menu
const filterBtns = document.querySelectorAll('.filter-btn');
const menuSections = document.querySelectorAll('.menu-section');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    menuSections.forEach(sec => {
      if (cat === 'all' || sec.dataset.cat === cat) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });
  });
});

// Add to cart buttons on menu
document.querySelectorAll('.mi-add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price) || 0;
    const cat = btn.dataset.cat || '';
    addToCart(name, price, cat);
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '+ Add';
      btn.classList.remove('added');
    }, 1500);
  });
});
