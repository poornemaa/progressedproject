document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addRecipientForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('token');
      const user_id = localStorage.getItem('user_id');

      if (!token) {
        alert('Please login first.');
        window.location.href = '/';
        return;
      }

      const organization_name = document.getElementById('organization_name').value.trim();
      const contact_person = document.getElementById('contact_person').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();

      if (!organization_name || !contact_person || !email || !phone || !address) {
        document.getElementById('message').innerHTML =
          `<div class="alert alert-warning">Please fill in all fields.</div>`;
        return;
      }

      const recipientData = {
        user_id,
        organization_name,
        contact_person,
        email,
        phone,
        address
      };

      try {
        const response = await fetch('/api/recipients', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipientData)
        });

        const result = await response.json();

        if (response.ok) {
          document.getElementById('message').innerHTML =
            `<div class="alert alert-success">${result.message || 'Recipient added successfully!'}</div>`;
          form.reset();
        } else {
          document.getElementById('message').innerHTML =
            `<div class="alert alert-danger">${result.error || 'Failed to add recipient.'}</div>`;
        }

      } catch (err) {
        console.error('Error:', err);
        document.getElementById('message').innerHTML =
          `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
      }
    });
  }
});
