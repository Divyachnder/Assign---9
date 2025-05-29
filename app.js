const API_URL = 'https://jsonplaceholder.typicode.com/users'; // json api

async function fetchContacts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch contacts');
    const data = await res.json();
    displayContacts(data);
  } catch (err) {
    alert(err.message);
  }
}

function displayContacts(contacts) {
  const list = document.getElementById('contacts-list');
  list.innerHTML = '';
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${contact.name}</strong> - ${contact.phone}
      <button onclick="editContact(${contact.id})">Edit</button>
      <button onclick="deleteContact(${contact.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

async function addContact() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name || !phone) {
    alert('Both fields are required');
    return;
  }

  const newContact = { name, phone };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    });
    if (!res.ok) throw new Error('Failed to add contact');
    fetchContacts(); // refresh list
  } catch (err) {
    alert(err.message);
  }
}

async function deleteContact(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact');
    fetchContacts();
  } catch (err) {
    alert(err.message);
  }
}

async function editContact(id) {
  const newName = prompt('Enter new name:');
  const newPhone = prompt('Enter new phone:');

  if (!newName || !newPhone) {
    alert('Both fields are required');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, phone: newPhone })
    });
    if (!res.ok) throw new Error('Failed to update contact');
    fetchContacts();
  } catch (err) {
    alert(err.message);
  }
}

function searchContacts() {
  const query = document.getElementById('search').value.toLowerCase();
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.includes(query)
      );
      displayContacts(filtered);
    })
    .catch(err => alert('Error searching contacts: ' + err.message));
}

// Load contacts on page load
window.onload = fetchContacts;
