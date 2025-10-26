// MAIN.JS — interactions, image loader, nav, animations, form handling

document.addEventListener('DOMContentLoaded', init);

function init(){
  initHeader();
  initAOS();
  initProfileImage();
  initMenu();
  initSmoothScroll();
  initCursor();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
}

/* ---------------------------
   AOS (Animate on scroll)
   --------------------------- */
function initAOS(){
  if (typeof AOS !== 'undefined') {
    AOS.init({duration:700,once:true,offset:80});
  }
}

/* ---------------------------
   Header / menu
   --------------------------- */
function initHeader(){
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, {passive:true});
}

/* ---------------------------
   Profile image: attempts LinkedIn patterns, falls back to avatar
   --------------------------- */
function initProfileImage(){
  const img = document.getElementById('profile-image');
  const fallback = document.getElementById('profile-fallback');

  // If user supplies an explicit direct image URL via global variable (optional)
  // window.RACHIT_IMAGE_URL = "https://media.licdn.com/your-direct-image-url.jpg";
  const profileImagePaths = [];

  if (window.RACHIT_IMAGE_URL) {
    profileImagePaths.push(window.RACHIT_IMAGE_URL);
  }

  // Try: LinkedIn public profile page won't work as direct image but some patterns may exist.
  // We attempt a few sensible patterns (these may fail due to LinkedIn protections).
  // If they fail, fallback remains visible.
  const linkedInProfile = 'https://www.linkedin.com/in/rachitbhatnagar-pmi-acp';
  // Commonly-used CDN patterns sometimes used publicly (may not resolve due to LinkedIn protections)
  profileImagePaths.push(
    linkedInProfile + '/detail/photo/',
    'https://media.licdn.com/dms/image/C4D03AQ' // intentionally partial; left as attempt
  );

  // A safe fallback avatar data-URI (simple svg)
  const fallbackSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#0078d4'/>
      <text x='50%' y='54%' font-size='160' text-anchor='middle' fill='white' font-family='Segoe UI, Arial' font-weight='700'>RB</text>
    </svg>`
  );

  let loaded = false;
  let idx = 0;

  function tryNext(){
    if (idx >= profileImagePaths.length){
      // final fallback
      img.src = fallbackSvg;
      img.classList.add('loaded');
      fallback.style.display = 'none';
      return;
    }

    const test = profileImagePaths[idx++];
    const tImg = new Image();
    tImg.crossOrigin = 'anonymous';
    tImg.onload = function(){
      img.src = this.src;
      img.classList.add('loaded');
      fallback.style.display = 'none';
      loaded = true;
    };
    tImg.onerror = function(){
      setTimeout(tryNext, 150);
    };
    tImg.src = test;
  }

  // attempt to fetch sources
  tryNext();

  // If nothing loads after short timeout, load svg fallback
  setTimeout(() => {
    if (!loaded && !img.src) {
      img.src = fallbackSvg;
      img.classList.add('loaded');
      fallback.style.display = 'none';
    }
  }, 1200);
}

/* ---------------------------
   Menu (mobile)
   --------------------------- */
function initMenu(){
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav-links');

  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close when link clicked
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('active');
      btn.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ---------------------------
   Smooth scroll for hash links (account for fixed header)
   --------------------------- */
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.querySelector('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({top, behavior:'smooth'});
    });
  });
}

/* ---------------------------
   Custom cursor
   --------------------------- */
function initCursor(){
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let fx = mouseX, fy = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = (mouseX) + 'px';
    cursor.style.top = (mouseY) + 'px';
  });

  function animate() {
    fx += (mouseX - fx) * 0.12;
    fy += (mouseY - fy) * 0.12;
    follower.style.left = (fx) + 'px';
    follower.style.top = (fy) + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // hover interactions
  document.querySelectorAll('a, button, .cta, .project-card').forEach(el=>{
    el.addEventListener('mouseenter', ()=> {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', ()=> {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });
}

/* ---------------------------
   Contact form — Netlify friendly
   --------------------------- */
function initContactForm(){
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn') || form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    if (btn) { btn.disabled = true; btn.innerText = 'Sending...'; }

    // basic validation
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      alert('Please fill name, email and message.');
      if (btn) { btn.disabled = false; btn.innerText = 'Send message'; }
      return;
    }

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      alert('Thanks — message sent!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('There was a problem submitting the form. Email directly to hello@rachitbhatnagar.com');
    } finally {
      if (btn) { btn.disabled = false; btn.innerText = 'Send message'; }
    }
  });
}

/* ---------------------------
   Simple accessibility: focus outlines, Escape to close menu
   --------------------------- */
document.addEventListener('keydown', (e)=> {
  if (e.key === 'Escape') {
    document.querySelector('.nav-links')?.classList.remove('active');
    document.querySelector('.menu-btn')?.classList.remove('open');
  }
});
