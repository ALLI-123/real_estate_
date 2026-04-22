document.addEventListener('DOMContentLoaded', () => {
  // 1. Robust Preloader Logic
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const lastVisit = localStorage.getItem('lux_last_visit');
    const now = Date.now();
    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes

    const shouldShow = !lastVisit || (now - parseInt(lastVisit)) > inactivityThreshold;

    if (shouldShow) {
      // Show immediately
      preloader.style.display = 'flex';
      preloader.style.opacity = '1';

      const hidePreloader = () => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none'; // Prevent click blocking during fade
        setTimeout(() => {
          preloader.style.display = 'none';
          localStorage.setItem('lux_last_visit', Date.now().toString());
        }, 500);
      };

      // If page already loaded, hide quickly
      if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 300);
      } else {
        // Fallback: wait for load event OR max 2 seconds
        const maxTimeout = setTimeout(hidePreloader, 2000);
        window.addEventListener('load', () => {
          clearTimeout(maxTimeout);
          hidePreloader();
        });
      }
    } else {
      preloader.style.display = 'none';
    }
  }

  // 2. Advanced Property Filtering Simulation
  const propertyGrid = document.getElementById('propertyGrid');
  if (propertyGrid) {
    const priceRange = document.getElementById('price');
    const priceVal = document.getElementById('priceVal');
    if (priceRange) {
      priceRange.addEventListener('input', e => {
        priceVal.textContent = `$${parseInt(e.target.value).toLocaleString()}`;
      });
    }

    window.applyFilters = () => {
      const status = document.getElementById('status')?.value || 'all';
      const type = document.getElementById('type')?.value || 'all';
      const beds = parseInt(document.getElementById('beds')?.value || 0);
      const maxPrice = parseInt(document.getElementById('price')?.value || 1000000);
      const location = (document.getElementById('location')?.value || '').toLowerCase();
      
      const cards = document.querySelectorAll('.property-card');

      cards.forEach(card => {
        const cStatus = card.dataset.status || '';
        const cType = card.dataset.type || '';
        const cBeds = parseInt(card.dataset.beds || 0);
        const cPrice = parseInt(card.dataset.price || 0);
        const cLoc = (card.dataset.location || '').toLowerCase();

        const matchStatus = status === 'all' || cStatus === status;
        const matchType = type === 'all' || cType === type;
        const matchBeds = beds === 0 || cBeds >= beds;
        const matchPrice = cPrice <= maxPrice;
        const matchLoc = location === '' || cLoc.includes(location);

        card.style.display = (matchStatus && matchType && matchBeds && matchPrice && matchLoc) ? 'block' : 'none';
      });
    };
  }

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
        const leadModal = bootstrap.Modal.getInstance(document.getElementById('leadModal'));
        if (leadModal) leadModal.hide();
      }, 800);
    });
  });
});
