// Custom Cursor
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  follower.style.left = e.clientX + "px";
  follower.style.top = e.clientY + "px";
});

// Nav toggle (mobile)
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Active link highlight
const navItems = document.querySelectorAll(".nav-link");
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navItems.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Counter Animation
const counters = document.querySelectorAll(".metric-number");
const speed = 200;

counters.forEach((counter) => {
  const updateCount = () => {
    const target = +counter.innerText.replace(/\D/g, "");
    const count = +counter.getAttribute("data-count") || 0;
    const inc = target / speed;
    if (count < target) {
      counter.setAttribute("data-count", count + inc);
      counter.innerText = Math.ceil(count + inc) + "+";
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target + "+";
    }
  };
  updateCount();
});

// AOS Scroll Animations
AOS.init({
  duration: 1000,
  once: true,
});

// Floating Elements Random Movement
const floatingEls = document.querySelectorAll(".floating-element");
floatingEls.forEach((el) => {
  el.style.top = Math.random() * 100 + "vh";
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = 10 + Math.random() * 10 + "s";
});

// Lazy load profile image (optional)
window.addEventListener("load", () => {
  const img = document.querySelector(".profile-image");
  if (img && img.src) img.style.display = "block";
});
