"use strict";

/* ========= Mobile nav (animated burger) ========= */
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

/* ========= Theme toggle (pill) ========= */
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

/* ========= PROBLEMS: ~50-word blurbs (kept) ========= */
const problemInfo = {
  damagedwall: {
    title: "Peeling / flaking wall",
    body:
      "We scrape and sand loose areas, prime to lock edges, then patch and seal to block moisture. The result resists shedding, looks smooth, and accepts paint or coating evenly. Ideal for garages and basements where humidity, salt, or temperature swings make surfaces fail and dust. Cleaner, stronger, longer-lasting.",
  },
  damagedroad: {
    title: "Cracked driveway / pad",
    body:
      "Cracks are opened, cleaned, and filled with a flexible repair that resists water and salt. We then resurface or coat for a uniform appearance and added protection. This approach limits future chipping, hides repairs, improves curb appeal, and makes cleaning easier through seasons of freeze–thaw, traction sand, and traffic.",
  },
  damagedwall2: {
    title: "Holes & broken areas",
    body:
      "We cut back to solid edges, clean thoroughly, and prime for high adhesion. A fast-curing patch rebuilds the profile so you can paint or coat soon after. The repair resists future impact and abrasion on corners, steps, and walls, preventing new crumbling under regular use, storage, and foot traffic.",
  },
  repairedfloor: {
    title: "Interior floor leveling",
    body:
      "Low spots and uneven waves are profiled and leveled to create a flat, strong base. That means coatings, tile, or epoxy bond better and finish smoother without telegraphing defects. Faster installs, cleaner transitions, and less downtime deliver a professional result for basements, shops, and utility rooms at home.",
  },
  repairedgarage: {
    title: "Garage refresh & coating",
    // body not used — replaced by full custom article below
    body: "",
  },
};

/* ========= PROBLEMS: exact image sets ========= */
const problemImages = {
  damagedwall: [
    "images/permaflexred 1 .jpg",
    "images/premaflexred.jpg",
    "images/permaflex3.jpg",
  ],
  damagedroad: [
    "images/tavgreen.jpg",
    "images/tavgreen2.jpg",
    "images/tavgreen 1 .jpg",
  ],
  damagedwall2: [
    "images/LRBblue1 .jpg",
    "images/LRBBLUE (2).jpg",
    "images/LRBblue.jpg",
  ],
  repairedfloor: [
    "images/quickpatch.jpg",
  ],
  // not used for garage, but keep a fallback
  repairedgarage: [
    "images/permaflexred 1 .jpg"
  ],
};

/* ========= Lightbox (zoom/pan) ========= */
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
  img.alt = altText;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("click", () => openLightbox(img.src, altText));
  return img;
}
function makeZoomButton(label, targetImg) {
  const btn = document.createElement("button");
  btn.className = "btn ghost";
  btn.type = "button";
  btn.textContent = label;
  btn.addEventListener("click", () => openLightbox(targetImg.src, targetImg.alt || "Image"));
  return btn;
}

/* ========= PROBLEMS MODAL ========= */
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

/* === Special long article for "Garage refresh & coating" === */

const pfImg = "images/permaflexred 1 .jpg";
const garageArticle = [
  {
    heading: "How To Waterproof a Basement",
    text: "Never worry about a flooded basement again. Follow these steps to ensure a waterproof basement using SANI-TRED®. This overview shows the complete system approach from surface prep to final topcoat. The sequence improves adhesion, controls moisture, and provides a seamless, flexible barrier on properly prepared concrete.",
  },
  {
    heading: "Products Needed",
    text: "PermaFlex® (PF), LRB (Liquid Rubber Base) and TAV (Thickening Activator). PermaFlex® acts as the primer and topcoat, while LRB/TAV forms a high-build, gap-filling mix for joints, holes, transitions and cove beads, creating a continuous, permanently adhered waterproofing system on concrete and masonry.",
  },
  {
    heading: "Step 1 — Prepare",
    text: "Prepare the substrate. Make sure it is clean, dry, and free of previous products, foreign matter, loose or crumbling material. Profile shiny areas and remove contaminants that may inhibit adhesion. Proper preparation is critical to long-term performance and prevents blistering, peeling, or moisture entrapment.",
  },
  {
    heading: "Step 2 — Prime",
    text: "Prime the surface with one coat of PermaFlex® (≈240 sq ft/gal). Concrete block typically requires two prime coats: the first penetrates deeply to lock and seal pores; the second begins filling pores, pock holes, and pinholes near the surface. PermaFlex® permanently adheres to concrete and masonry.",
  },
  {
    heading: "Step 3 — Patch",
    text: "Patch and profile any joints, seams, cracks, holes, and rough areas using LRB/TAV. Mix 2 parts LRB with 1 part TAV to a thick, caulk-like consistency. Apply a 1\" cove bead where wall meets floor; many cracks need ~¾\" bead. Tool smooth to blend and strengthen transitions.",
  },
  {
    heading: "Step 4 — Topcoat",
    text: "Apply one topcoat of PermaFlex® (≈240 sq ft/gal) to finish the system. This locks down repairs, creates a uniform membrane, and provides durable waterproofing that resists hydrostatic pressure. Allow proper cure times before returning the area to service, coating, or placing finishes over the membrane.",
  },
  {
    heading: "Try Our Sample Packs",
    text: "SANI-TRED® Product Sample Packs let you test PermaFlex®, LRB, and TAV at a low cost with free shipping and a double money-back guarantee. Evaluate adhesion, working time, and finish on your surface before larger purchases, and gain confidence in the system’s performance for your basement.",
  },
];

/* Build standard (short) content OR the special garage long-form article */
function buildProblemContent(key) {
  const info = problemInfo[key];

  // SPECIAL: Garage long article with an image on every paragraph
  if (key === "repairedgarage") {
    const h2 = document.createElement("h2");
    h2.id = "modalHeading";
    h2.textContent = "Garage refresh & coating — Basement Waterproofing Guide";
    modalContent.appendChild(h2);

    // Tag modal for garage-specific styling
    const mb = problemModal?.querySelector('.modal-body');
    if (mb) mb.classList.add('garage');


    garageArticle.forEach((sec, i) => {
      const wrap = document.createElement("div");
      wrap.className = "article-section";

      const img = makeImg(pfImg, `PermaFlex illustration ${i + 1}`);
      wrap.appendChild(img);

      const right = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.textContent = sec.heading;
      const p = document.createElement("p");
      p.textContent = sec.text;

      const bar = document.createElement("div");
      bar.className = "modal-zoombar";
      bar.appendChild(makeZoomButton("Zoom Image", img));

      right.appendChild(h3);
      right.appendChild(p);
      right.appendChild(bar);
      wrap.appendChild(right);

      modalContent.appendChild(wrap);
    });

    return; // done
  }

  // DEFAULT: existing grid of images + ~50-word paragraph
  const imgs = problemImages[key] || [];
  const grid = document.createElement("div");
  grid.className = "modal-images";
  if (imgs.length === 1) grid.classList.add("single");

  const createdImgs = [];
  imgs.forEach((p, i) => {
    const el = makeImg(p, `${info.title} example ${i + 1}`);
    createdImgs.push(el);
    grid.appendChild(el);
  });

  const h2 = document.createElement("h2");
  h2.id = "modalHeading";
  h2.textContent = info.title;

  const zoombar = document.createElement("div");
  zoombar.className = "modal-zoombar";
  createdImgs.forEach((el, i) => {
    zoombar.appendChild(makeZoomButton(`Zoom image ${i + 1}`, el));
  });

  const p = document.createElement("p");
  p.textContent = info.body;

  modalContent.appendChild(h2);
  modalContent.appendChild(grid);
  modalContent.appendChild(zoombar);
  modalContent.appendChild(p);
}

/* Hook up problem cards */
document.querySelectorAll(".problem-card").forEach((card) => {
  function triggerOpen() {
    const key = card.getAttribute("data-problem");
    if (!key) return;

    modalContent.innerHTML = "";
    buildProblemContent(key);
    openModal();
  }

  card.addEventListener("click", triggerOpen);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerOpen();
    }
  });
});
modalClose?.addEventListener("click", closeModal);
problemModal?.addEventListener("click", (e) => { if (e.target === problemModal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && problemModal?.classList.contains("show")) closeModal(); });

/* ========= ARTICLE POPUP (QuickPatch DIY) — unchanged from your last version ========= */
const articleModal = document.getElementById("articleModal");
const articleContent = document.getElementById("articleContent");
const articleClose = document.getElementById("articleClose");

function openArticle() {
  if (!articleModal) return;
  articleModal.classList.add("show");
  articleModal.setAttribute("aria-hidden", "false");
  articleClose?.focus();
}
function closeArticle() {
  if (!articleModal) return;
  articleModal.classList.remove("show");
  articleModal.setAttribute("aria-hidden", "true");
}

const quickpatchArticle = {
  heading: "QuickPatch DIY: Repair & Level Like a Pro",
  image: "images/quickpatch.jpg",
  text:
    "QuickPatch makes durable concrete fixes accessible at home. Clean, prime, and trowel to rebuild pits or level low spots with strong adhesion. After curing, coat or seal for a clean finish that resists wear, moisture, and salt. It’s a fast, tidy workflow that upgrades durability and appearance together.",
  youtubeId: "-vqvlqWSvcc",
};

document.getElementById("openQuickpatchArticle")?.addEventListener("click", () => {
  articleContent.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.id = "articleHeading";
  h2.textContent = quickpatchArticle.heading;

  const fig = document.createElement("div");
  fig.className = "article-figure";

  const img = makeImg(quickpatchArticle.image, "QuickPatch DIY image");
  fig.appendChild(img);

  const zoomBtn = makeZoomButton("Zoom Image", img);
  fig.appendChild(zoomBtn);

  const p = document.createElement("p");
  p.textContent = quickpatchArticle.text;

  const videoWrap = document.createElement("div");
  videoWrap.className = "video-embed";
  videoWrap.innerHTML = `
    <iframe
      class="video-player"
      src="https://www.youtube.com/embed/${quickpatchArticle.youtubeId}?modestbranding=1&rel=0"
      title="QuickPatch DIY Video"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>`;

  articleContent.appendChild(h2);
  articleContent.appendChild(fig);
  articleContent.appendChild(p);
  articleContent.appendChild(videoWrap);

  openArticle();
});


articleClose?.addEventListener("click", closeArticle);
articleModal?.addEventListener("click", (e) => { if (e.target === articleModal) closeArticle(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && articleModal?.classList.contains("show")) closeArticle(); });

/* ========= Form UX feedback ========= */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (form) {
  form.addEventListener("submit", () => {
    if (formStatus) formStatus.textContent = "Sending...";
  });
}

/* ========= Scroll to top ========= */
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

/* ========= Scroll reveal ========= */
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
