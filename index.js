document.addEventListener('DOMContentLoaded', () => {
  fetchInstruments();

  const form = document.getElementById('instrumentForm');
  form.addEventListener('submit', handleFormSubmit);

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearchInput);
});

let allInstruments = [];

function fetchInstruments() {
  fetch('http://localhost:3000/instruments')
    .then(res => res.json())
    .then(data => {
      allInstruments = data;
      displayInstruments(data);
    })
    .catch(err => console.error('Error fetching instruments:', err));
}


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
      <strong>$${inst.price}</strong>
    `;

    card.addEventListener('click', () => {
      alert(`You clicked on: ${inst.name}`);
    });

    list.appendChild(card);
  });
}

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

function handleSearchInput(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = allInstruments.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm)
  );
  displayInstruments(filtered);
}
