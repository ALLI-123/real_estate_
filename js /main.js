document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Logic (First visit or 30min inactivity)
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const lastVisit = localStorage.getItem('lux_last_visit');
    const now = Date.now();
    const inactivityThreshold = 30 * 60 * 1000; // 30 mins

    if (!lastVisit || (now - parseInt(lastVisit)) > inactivityThreshold) {
      preloader.style.opacity = '1';
      preloader.style.display = 'flex';
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          setTimeout(() => preloader.style.display = 'none', 500);
          localStorage.setItem('lux_last_visit', now.toString());
        }, 800); // Simulate load time
      });
    } else {
      preloader.style.display = 'none';
    }
  }

  // 2. Advanced Property Filtering Simulation
  if (document.getElementById('propertyGrid')) {
    const priceRange = document.getElementById('price');
    const priceVal = document.getElementById('priceVal');
    priceRange?.addEventListener('input', e => priceVal.textContent = `$${parseInt(e.target.value).toLocaleString()}`);
  }

  window.applyFilters = () => {
    const status = document.getElementById('status').value;
    const type = document.getElementById('type').value;
    const beds = parseInt(document.getElementById('beds').value);
    const maxPrice = parseInt(document.getElementById('price').value);
    const location = document.getElementById('location').value.toLowerCase();
    const cards = document.querySelectorAll('.property-card');

    cards.forEach(card => {
      const cStatus = card.dataset.status;
      const cType = card.dataset.type;
      const cBeds = parseInt(card.dataset.beds);
      const cPrice = parseInt(card.dataset.price);
      const cLoc = card.dataset.location.toLowerCase();

      const matchStatus = status === 'all' || cStatus === status;
      const matchType = type === 'all' || cType === type;
      const matchBeds = beds === 0 || cBeds >= beds;
      const matchPrice = cPrice <= maxPrice;
      const matchLoc = location === '' || cLoc.includes(location);

      card.style.display = (matchStatus && matchType && matchBeds && matchPrice && matchLoc) ? 'block' : 'none';
    });
  };

  // 3. Lead Capture Form Mock Submission
  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        alert('✅ Lead captured successfully! (Connect to Formspree/Netlify for live submission)');
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById('leadModal'))?.hide();
      }, 1000);
    });
  });
});
