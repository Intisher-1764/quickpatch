"use strict";

/* ========= Mobile nav ========= */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/* ========= Theme toggle ========= */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const savedTheme = localStorage.getItem("qp_theme");
if (savedTheme) body.setAttribute("data-theme", savedTheme);
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    body.setAttribute("data-theme", next);
    localStorage.setItem("qp_theme", next);
  });
}

/* ========= Apply background images from data-bg ========= */
document.querySelectorAll("[data-bg]").forEach((el) => {
  const bg = el.getAttribute("data-bg");
  if (bg) el.style.backgroundImage = `url('${bg}')`;
});

/* ========= Footer year ========= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ========= LIGHTBOX (click-to-zoom image, no extra buttons in modal) ========= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbClose = document.getElementById("lbClose");
const lbZoomIn = document.getElementById("lbZoomIn");
const lbZoomOut = document.getElementById("lbZoomOut");
const lbReset = document.getElementById("lbReset");
const lightboxStage = document.getElementById("lightboxStage");

let scale = 1;
let pos = { x: 0, y: 0 };
let dragging = false;
let dragStart = { x: 0, y: 0 };

function renderTransform() {
  lightboxImg.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}
function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  scale = 1;
  pos = { x: 0, y: 0 };
  renderTransform();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
}
lbClose?.addEventListener("click", closeLightbox);
lbReset?.addEventListener("click", () => { scale = 1; pos = { x: 0, y: 0 }; renderTransform(); });
lbZoomIn?.addEventListener("click", () => { scale = Math.min(scale * 1.2, 8); renderTransform(); });
lbZoomOut?.addEventListener("click", () => { scale = Math.max(scale / 1.2, 0.25); renderTransform(); });
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox || e.target === lightboxStage) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox?.classList.contains("show")) closeLightbox(); });
lightboxImg?.addEventListener("mousedown", (e) => {
  dragging = true;
  lightboxImg.style.cursor = "grabbing";
  dragStart = { x: e.clientX - pos.x, y: e.clientY - pos.y };
});
document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  pos = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
  renderTransform();
});
document.addEventListener("mouseup", () => {
  dragging = false;
  lightboxImg.style.cursor = "grab";
});
lightboxStage?.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.1 : 1 / 1.1;
  const rect = lightboxImg.getBoundingClientRect();
  const cx = e.clientX - rect.left - rect.width / 2;
  const cy = e.clientY - rect.top - rect.height / 2;
  const newScale = Math.min(Math.max(scale * delta, 0.25), 8);
  const scaleFactor = newScale / scale;
  pos.x = pos.x - cx * (scaleFactor - 1);
  pos.y = pos.y - cy * (scaleFactor - 1);
  scale = newScale;
  renderTransform();
}, { passive: false });

/* ========= Helpers ========= */
function makeImg(srcPath, altText) {
  const img = document.createElement("img");
  img.src = encodeURI(srcPath); // supports spaces/parentheses
  img.alt = altText || "";
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("click", () => openLightbox(img.src, altText));
  return img;
}

/* ========= PROBLEMS MODAL (auto gallery by first 3 letters of label) ========= */
const problemModal = document.getElementById("problemModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
let lastFocused = null;

function openModal() {
  if (!problemModal) return;
  lastFocused = document.activeElement;
  problemModal.classList.add("show");
  problemModal.setAttribute("aria-hidden", "false");
  modalClose?.focus();
}
function closeModal() {
  if (!problemModal) return;
  problemModal.classList.remove("show");
  problemModal.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}
modalClose?.addEventListener("click", closeModal);
problemModal?.addEventListener("click", (e) => { if (e.target === problemModal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && problemModal?.classList.contains("show")) closeModal(); });

/* Images available (from your message list). We match by first 3 letters. */
const ALL_FILES = [
  "prema.jpg",
  "LRB.jpg",
  "tav.jpg",
  "garageJPG",
  "tree.jpeg",
  "driveway.jpeg",
  "permaflexred.jpg",
  "permaflexredl.jpg",
  "premaflexred.jpg",
  "quickpatch.jpg",
  "tavgreen.jpg",
  "permaflex3.jpg",
  "tavgreen2.jpg",
  "LRBblue1 .jpg",
  "LRBBLUE (2).jpg",
  "LRBblue.jpg",
  "v reenl .jpg",
  "ta g",
  "repairedwa112.jpg",
  "damaged wall.jpg",
  "damagedroad.jpg",
  "damagedwa112.jpg",
  "repairedwall.jpg",
  "repaireddriveway.jpg",
  "repairedgarage.jpg",
  "image001 .jpg",
  "logo.jpg",
];

/* Normalizers */
function cleanName(s){
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
function getProblemLabel(key){
  const card = document.querySelector(`.problem-card[data-problem="${key}"]`);
  const label = card?.querySelector(".label")?.textContent || "";
  return label.trim();
}
function getGalleryForKey(key){
  const label = getProblemLabel(key);
  const prefix = cleanName(label).slice(0,3); // first 3 letters

  const matches = ALL_FILES.filter(fname => cleanName(fname).startsWith(prefix));
  return matches.map(m => `images/${m}`);
}

function buildProblemContent(key) {
  modalContent.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.id = "modalHeading";
  h2.textContent = getProblemLabel(key) || "Gallery";
  modalContent.appendChild(h2);

  const gallery = getGalleryForKey(key);

  if (gallery.length === 0) {
    const fallbackImg = document
      .querySelector(`.problem-card[data-problem="${key}"] img`)
      ?.getAttribute("src");
    if (fallbackImg) gallery.push(fallbackImg);
  }

  const grid = document.createElement("div");
  grid.className = "modal-images";
  if (gallery.length === 1) grid.classList.add("single");

  gallery.forEach((src, i) => {
    const el = makeImg(src, `${h2.textContent} example ${i+1}`);
    grid.appendChild(el);
  });

  modalContent.appendChild(grid);

  const p = document.createElement("p");
  p.textContent = "Tap an image to view larger. Close with ×.";
  modalContent.appendChild(p);
}

/* Hook up problem cards */
document.querySelectorAll(".problem-card").forEach((card) => {
  function triggerOpen() {
    const key = card.getAttribute("data-problem");
    if (!key) return;
    buildProblemContent(key);
    openModal();
  }
  card.addEventListener("click", triggerOpen);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerOpen(); }
  });
});

/* ========= QuickPatch article image toggle (under article) ========= */
document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("openQuickpatchArticle");
  const imageContainer = document.getElementById("productImageContainer");
  if (!button || !imageContainer) return;

  button.addEventListener("click", function() {
    const isVisible = imageContainer.classList.toggle("show");
    button.textContent = isVisible ? "Hide product image" : "View product image";
  });
});

/* ========= Form UX feedback ========= */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (form) {
  form.addEventListener("submit", () => {
    if (formStatus) formStatus.textContent = "Sending...";
  });
}

/* ========= Scroll to top & reveal ========= */
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 250) scrollTopBtn.classList.add("show");
    else scrollTopBtn.classList.remove("show");
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
const reveals = document.querySelectorAll(".reveal");
const handleReveal = () => {
  const trigger = window.innerHeight * 0.85;
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add("show");
  });
};
window.addEventListener("scroll", handleReveal);
window.addEventListener("load", handleReveal);
/* ========= Helpers (no zoom buttons) ========= */
function makeImg(srcPath, altText) {
  const img = document.createElement("img");
  img.src = encodeURI(srcPath);
  img.alt = altText;
  img.loading = "lazy";
  img.decoding = "async";
  return img;
}

/* ========= PROBLEMS MODAL (safe no-zoom) ========= */
function buildProblemContent(key) {
  const info = problemInfo[key];
  const imgs = problemImages[key] || [];

  const h2 = document.createElement("h2");
  h2.id = "modalHeading";
  h2.textContent = info?.title || "Gallery";
  modalContent.appendChild(h2);

  if (imgs.length) {
    const grid = document.createElement("div");
    grid.className = "modal-images";
    if (imgs.length === 1) grid.classList.add("single");
    imgs.forEach((p, i) => grid.appendChild(makeImg(p, `${info?.title || "Image"} ${i + 1}`)));
    modalContent.appendChild(grid);
  }

  if (info?.body) {
    const p = document.createElement("p");
    p.textContent = info.body;
    modalContent.appendChild(p);
  }
}

/* ========= ARTICLE POPUP (remove zoom button) ========= */
document.getElementById("openQuickpatchArticle")?.addEventListener("click", () => {
  const imgContainer = document.getElementById("productImageContainer");
  if (!imgContainer) return;
  const shown = imgContainer.classList.toggle("show");
  const btn = document.getElementById("openQuickpatchArticle");
  if (btn) btn.textContent = shown ? "Hide product image" : "View product image";
});
