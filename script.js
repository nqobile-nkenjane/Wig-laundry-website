const WHATSAPP_NUMBER = '27607524659';

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }));
}

// Keep the booking date from allowing past dates.
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Pre-select a service/package when a visitor clicks BOOK NOW.
const serviceSelect = document.getElementById('service');
function selectService(serviceName) {
  if (!serviceSelect) return;
  const option = [...serviceSelect.options].find(option => option.textContent.startsWith(serviceName));
  if (option) serviceSelect.value = option.value;
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => document.getElementById('name')?.focus(), 450);
}
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => selectService(button.dataset.service));
});

// Product enquiry buttons now carry the selected product and price into WhatsApp.
document.querySelectorAll('.product-button').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    const price = button.dataset.price;
    const message = `Hi Wig Laundry, I would like to enquire about the ${product} (${price}). Please share more details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
});

// Booking form -> WhatsApp message.
const bookingForm = document.getElementById('booking-form');
const formStatus = document.getElementById('form-status');
if (bookingForm) {
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    const data = new FormData(bookingForm);
    const name = data.get('name').trim();
    const phone = data.get('phone').trim();
    const service = data.get('service');
    const date = data.get('date') || 'Not specified';
    const message = data.get('message').trim() || 'No additional message.';
    const text = [
      'Hi Wig Laundry & Hair Maintenance! 👋',
      '',
      'I would like to make a booking/enquiry.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Preferred date: ${date}`,
      `Message: ${message}`
    ].join('\n');
    formStatus.textContent = 'Opening WhatsApp with your booking details…';
    formStatus.className = 'form-status success';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}

// Gallery lightbox.
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove('no-scroll');
  if (lightboxImage) lightboxImage.src = '';
};
document.querySelectorAll('[data-lightbox]').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.dataset.caption || 'Gallery image';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

// Reveal elements as they enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}
