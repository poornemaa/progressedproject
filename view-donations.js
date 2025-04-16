document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Please log in to view donations.');
      window.location.href = '/index.html';
      return;
    }
  
    const tableBody = document.getElementById('donationsTable');
    const messageBox = document.getElementById('message');
  
    // Fetch donations
    fetch('/api/donations/available')
      .then(res => res.json())
      .then(donations => {
        donations.forEach(d => {
          const row = document.createElement('tr');
          row.innerHTML = `
  <td>${d.food_name}</td>
  <td>${d.food_description}</td>
  <td>${d.quantity}</td>
  <td><img src="${d.food_image}" alt="Food" width="60"/></td>
  <td>${d.donor_name}</td>
  <td>${d.donor_address}</td>
  <td>
    <button class="btn btn-sm btn-primary order-btn" data-id="${d.donation_id}">Order</button>
  </td>
`;

          tableBody.appendChild(row);
        });
      })
      .catch(err => {
        messageBox.innerHTML = `<div class="alert alert-danger">Failed to load donations.</div>`;
      });
  
    // Handle order button
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('order-btn')) {
        const donation_id = e.target.dataset.id;
  
        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ donation_id })
          });
  
          const result = await res.json();
          messageBox.innerHTML = `<div class="alert alert-${res.ok ? 'success' : 'danger'}">${result.message}</div>`;
        } catch (err) {
          messageBox.innerHTML = `<div class="alert alert-danger">Error placing order.</div>`;
        }
      }
    });
  });
  