/* ============================================================
   VELORA FASHION: site settings
   Change your WhatsApp number here (country code + number,
   no "+", no spaces). Example for India: 919876543210
   ============================================================ */
const WHATSAPP_NUMBER = '919876543210';

(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const params = new URLSearchParams(location.search);

  // Footer year
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  // Floating WhatsApp button
  const wa = $('#waFloat');
  if (wa) wa.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
    encodeURIComponent('Hi Velora Fashion, I would like to know more about your collection.');

  // Header shadow
  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), { passive: true });

  // Mobile menu
  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  // Scroll reveal
  const items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('show'));

  // SHOP page: filters (also reads ?cat=dresses from the home page tiles)
  const filters = $$('.filter');
  if (filters.length) {
    const products = $$('.product');
    const apply = f => {
      filters.forEach(b => b.classList.toggle('active', b.dataset.f === f));
      products.forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.c !== f));
    };
    filters.forEach(b => b.addEventListener('click', () => apply(b.dataset.f)));
    const cat = params.get('cat');
    if (cat && filters.some(b => b.dataset.f === cat)) apply(cat);
  }

  // CONTACT page: enquiry form
  const form = $('#orderForm');
  if (!form) return;
  const f = form.elements;

  // Prefill from "Enquire" links (contact.html?product=...&category=...)
  if (params.get('product')) f.product.value = params.get('product');
  const wantCat = params.get('category');
  if (wantCat) Array.from(f.category.options).forEach(o => { if (o.text === wantCat) f.category.value = o.text; });

  const statusBox = $('#status');
  const show = (msg, type) => { statusBox.textContent = msg; statusBox.className = type; };
  const mark = (el, bad) => el.classList.toggle('invalid', bad);

  form.addEventListener('submit', e => {
    e.preventDefault();
    statusBox.className = '';
    const name = f.name.value.trim(), phone = f.phone.value.trim();
    const email = f.email.value.trim(), message = f.message.value.trim();

    mark(f.name, !name); mark(f.phone, !phone);
    mark(f.category, !f.category.value); mark(f.message, !message);

    if (!name || !phone || !f.category.value || !message) return show('Please fill in all required fields.', 'err');
    if (!/^[0-9+\s-]{7,15}$/.test(phone)) { mark(f.phone, true); return show('Please enter a valid phone number.', 'err'); }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mark(f.email, true); return show('Please enter a valid email address.', 'err'); }

    const lines = ['*New enquiry: Velora Fashion*', '', 'Name: ' + name, 'Phone: ' + phone];
    if (email) lines.push('Email: ' + email);
    lines.push('Category: ' + f.category.value);
    if (f.size.value) lines.push('Size: ' + f.size.value);
    if (f.product.value.trim()) lines.push('Product: ' + f.product.value.trim());
    if (f.address.value.trim()) lines.push('City/Address: ' + f.address.value.trim());
    lines.push('', 'Message: ' + message);

    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    show('Thank you! WhatsApp is opening with your enquiry. Just press send.', 'ok');
    form.reset();
  });

  $$('input, select, textarea', form).forEach(el => el.addEventListener('input', () => el.classList.remove('invalid')));
})();
