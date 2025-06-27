document.addEventListener('DOMContentLoaded', () => {
  fetchInstruments();

  const form = document.getElementById('instrumentForm');
  form.addEventListener('submit', handleFormSubmit);

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearchInput);

  // Load cart from localStorage
  loadCartFromStorage();
  updateCart();
});

let allInstruments = [];
let cart = [];

const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');

// Fetch instruments from server
function fetchInstruments() {
  fetch('http://localhost:3000/instruments')
    .then(res => res.json())
    .then(data => {
      allInstruments = data;
      displayInstruments(data);
    })
    .catch(err => console.error('Error fetching instruments:', err));
}

// Display all or filtered instruments
function displayInstruments(instruments) {
  const list = document.getElementById('instrument-list');
  list.innerHTML = '';

  instruments.forEach(inst => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${inst.image}" alt="${inst.name}">
      <h3>${inst.name}</h3>
      <p>${inst.description}</p>
      <strong>$${inst.price}</strong><br />
      <button class="add-to-cart" data-id="${inst.id}">Add to Cart</button>
    `;

    list.appendChild(card);
  });
}

// Add new instrument to server and display
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value.trim();

  if (!name || !description || isNaN(price) || !image) {
    alert('Please fill all fields correctly.');
    return;
  }

  const newInstrument = { name, description, price, image };

  fetch('http://localhost:3000/instruments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newInstrument)
  })
    .then(res => res.json())
    .then(addedInstrument => {
      allInstruments.push(addedInstrument);
      displayInstruments(allInstruments);
      document.getElementById('instrumentForm').reset();
    })
    .catch(err => console.error('Error adding instrument:', err));
}

// Filter instruments based on search input
function handleSearchInput(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = allInstruments.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm)
  );
  displayInstruments(filtered);
}

// Listen for cart button clicks globally
document.addEventListener('click', e => {
  if (e.target.classList.contains('add-to-cart')) {
    const id = e.target.dataset.id;
    const instrument = allInstruments.find(inst => inst.id == id);
    if (instrument) {
      cart.push(instrument);
      saveCartToStorage();
      updateCart();
    }
  }

  if (e.target.classList.contains('remove-from-cart')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    saveCartToStorage();
    updateCart();
  }
});

// Render cart items and update total
function updateCart() {
  if (!cartList || !cartTotal) return;

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - $${item.price}
      <button class="remove-from-cart" data-index="${index}">Remove</button>
    `;
    cartList.appendChild(li);
    total += Number(item.price);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
      cart = [];
    }
  }
}
