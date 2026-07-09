const DATA_STORAGE_KEY = "marketzio-admin-data-v5";
const LEGACY_DATA_STORAGE_KEY = "marketzio-admin-data-v4";
const CART_STORAGE_KEY = "marketzio-cart";
const PAGE_SIZE = 16;

const activeData = loadActiveData();
const ACTIVE_STORE_CONFIG = activeData.store;
const ACTIVE_CATEGORIES = activeData.categories;
const ACTIVE_PRODUCTS = activeData.products;

const state = {
  selectedCategory: "all",
  search: "",
  page: 1,
  cart: loadCart(),
  selectedProduct: null
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

const els = {
  heroSection: document.getElementById("heroSection"),
  brandLogo: document.getElementById("brandLogo"),
  heroOuterMedia: document.getElementById("heroOuterMedia"),
  heroCard: document.getElementById("heroCard"),
  storeName: document.getElementById("storeName"),
  storeTagline: document.getElementById("storeTagline"),
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  heroSubtitle: document.getElementById("heroSubtitle"),
  heroVisual: document.getElementById("heroVisual"),
  heroBadge: document.getElementById("heroBadge"),
  promoStrip: document.getElementById("promoStrip"),
  searchInput: document.getElementById("searchInput"),
  clearSearch: document.getElementById("clearSearch"),
  categoryGrid: document.getElementById("categoryGrid"),
  categoryLeft: document.getElementById("categoryLeft"),
  categoryRight: document.getElementById("categoryRight"),
  productGrid: document.getElementById("productGrid"),
  productTitle: document.getElementById("productTitle"),
  productInfo: document.getElementById("productInfo"),
  resetFilter: document.getElementById("resetFilter"),
  pagination: document.getElementById("pagination"),
  emptyState: document.getElementById("emptyState"),
  cartCount: document.getElementById("cartCount"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartOverlay: document.getElementById("cartOverlay"),
  openCart: document.getElementById("openCart"),
  closeCart: document.getElementById("closeCart"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartSummary: document.getElementById("cartSummary"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCart: document.getElementById("clearCart"),
  productModal: document.getElementById("productModal"),
  closeModal: document.getElementById("closeModal"),
  closeModalBackdrop: document.getElementById("closeModalBackdrop"),
  modalImage: document.getElementById("modalImage"),
  modalBadge: document.getElementById("modalBadge"),
  modalName: document.getElementById("modalName"),
  modalDesc: document.getElementById("modalDesc"),
  modalPrice: document.getElementById("modalPrice"),
  modalOldPrice: document.getElementById("modalOldPrice"),
  modalStock: document.getElementById("modalStock"),
  modalAddBtn: document.getElementById("modalAddBtn"),
  year: document.getElementById("year")
};

init();

function init() {
  applyStoreConfig();
  renderPromoCards();
  renderCategories();
  renderProducts();
  renderCart();
  bindEvents();
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    state.page = 1;
    renderProducts();
  });

  els.clearSearch.addEventListener("click", () => {
    els.searchInput.value = "";
    state.search = "";
    state.page = 1;
    renderProducts();
  });

  els.resetFilter.addEventListener("click", () => {
    state.selectedCategory = "all";
    state.search = "";
    state.page = 1;
    els.searchInput.value = "";
    renderCategories();
    renderProducts();
  });

  els.categoryLeft.addEventListener("click", () => scrollCategories(-1));
  els.categoryRight.addEventListener("click", () => scrollCategories(1));

  els.openCart.addEventListener("click", openCart);
  els.closeCart.addEventListener("click", closeCart);
  els.cartOverlay.addEventListener("click", closeCart);
  els.checkoutBtn.addEventListener("click", checkoutWhatsApp);
  els.clearCart.addEventListener("click", () => {
    if (!state.cart.length) return;
    if (confirm("Kosongkan semua isi keranjang?")) {
      state.cart = [];
      saveCart();
      renderCart();
    }
  });

  els.closeModal.addEventListener("click", closeModal);
  els.closeModalBackdrop.addEventListener("click", closeModal);
  els.modalAddBtn.addEventListener("click", () => {
    if (state.selectedProduct) {
      addToCart(state.selectedProduct.id);
      closeModal();
      openCart();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeModal();
    }
  });
}

function applyStoreConfig() {
  const store = ACTIVE_STORE_CONFIG;
  const hero = store.hero || {};
  els.storeName.textContent = store.name || "Marketzio";
  els.storeTagline.textContent = store.tagline || "Fresh Market Online";
  document.title = `${store.name || "Marketzio"} - Supermarket Online`;
  els.year.textContent = new Date().getFullYear();

  applyLogo(store);
  applyHeroStyle(hero);

  els.heroEyebrow.textContent = hero.eyebrow || "100% Fresh & Natural";
  els.heroEyebrow.classList.toggle("hide-icon", hero.showEyebrowIcon !== true);
  els.heroTitle.textContent = hero.title || "Belanja kebutuhan harian jadi lebih cepat.";
  els.heroSubtitle.textContent = hero.subtitle || "Pilih produk, masukkan ke keranjang, lalu checkout langsung ke WhatsApp admin.";
  els.heroBadge.innerHTML = escapeHtml(hero.badge || "SHOP\nNOW").replace(/\n/g, "<br>");

  const outerImage = String(hero.outerImage || "").trim();
  const showOuter = hero.showOuterImage !== false && isImageValue(outerImage);
  els.heroSection.classList.toggle("has-outer-image", showOuter);
  if (showOuter) {
    els.heroOuterMedia.innerHTML = `<img src="${escapeAttr(outerImage)}" alt="Background banner ${escapeAttr(store.name || "Marketzio")}" />`;
  } else {
    els.heroOuterMedia.innerHTML = "";
  }

  const innerValue = String(hero.innerImage || hero.visual || "🍓🥑🍊🍇🍎").trim();
  const showInner = hero.showInnerImage !== false && Boolean(innerValue);
  els.heroCard.classList.toggle("hide-inner", !showInner);
  els.heroVisual.hidden = !showInner;

  if (showInner && isImageValue(innerValue)) {
    els.heroVisual.innerHTML = `<img src="${escapeAttr(innerValue)}" alt="Banner ${escapeAttr(store.name || "Marketzio")}" />`;
    els.heroVisual.classList.add("has-image");
  } else if (showInner) {
    els.heroVisual.textContent = innerValue;
    els.heroVisual.classList.remove("has-image");
  } else {
    els.heroVisual.innerHTML = "";
    els.heroVisual.classList.remove("has-image");
  }
}


function applyLogo(store) {
  const logo = els.brandLogo;
  if (!logo) return;

  const logoValue = String(store.logo || "").trim();
  const logoText = String(store.logoText || store.name || "M").trim().slice(0, 2).toUpperCase();

  if (logoValue && isImageValue(logoValue)) {
    logo.innerHTML = `<img src="${escapeAttr(logoValue)}" alt="Logo ${escapeAttr(store.name || "Marketzio")}" />`;
    logo.classList.add("has-logo");
  } else {
    logo.textContent = logoValue || logoText || "M";
    logo.classList.remove("has-logo");
  }
}

function applyHeroStyle(hero) {
  const target = els.heroSection;
  if (!target) return;

  const pct = (value, fallback) => clampNumber(Number(value ?? fallback), 0, 100) / 100;
  const brightness = (value, fallback) => clampNumber(Number(value ?? fallback), 40, 180) / 100;
  const px = (value, fallback, min, max) => `${clampNumber(Number(value ?? fallback), min, max)}px`;
  const titleMax = clampNumber(Number(hero.titleFontSize ?? 62), 30, 86);

  target.style.setProperty("--hero-outer-opacity", pct(hero.outerOpacity, 45));
  target.style.setProperty("--hero-outer-brightness", brightness(hero.outerBrightness, 100));
  target.style.setProperty("--hero-inner-opacity", pct(hero.innerOpacity, 100));
  target.style.setProperty("--hero-inner-brightness", brightness(hero.innerBrightness, 100));
  target.style.setProperty("--hero-title-size", `clamp(30px, 5vw, ${titleMax}px)`);
  target.style.setProperty("--hero-title-color", hero.titleColor || "#17342a");
  target.style.setProperty("--hero-subtitle-size", px(hero.subtitleFontSize, 17, 12, 28));
  target.style.setProperty("--hero-subtitle-color", hero.subtitleColor || "#6c7a75");
  target.style.setProperty("--hero-eyebrow-size", px(hero.eyebrowFontSize, 13, 10, 20));
  target.style.setProperty("--hero-eyebrow-color", hero.eyebrowColor || "#078c55");
  target.style.setProperty("--hero-badge-bg", hero.badgeBgColor || "#ff8a34");
  target.style.setProperty("--hero-badge-color", hero.badgeTextColor || "#ffffff");
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function renderPromoCards() {
  const cards = Array.isArray(ACTIVE_STORE_CONFIG.promoCards) && ACTIVE_STORE_CONFIG.promoCards.length
    ? ACTIVE_STORE_CONFIG.promoCards
    : [
      { title: "Promo Hari Ini", text: "Diskon produk pilihan sampai 30%" },
      { title: "Fresh Stock", text: "Update produk bisa dari halaman admin" },
      { title: "Checkout WA", text: "Order otomatis dirapikan ke WhatsApp" }
    ];

  els.promoStrip.innerHTML = cards.slice(0, 3).map((card) => `
    <div>
      <strong>${escapeHtml(card.title || "Info")}</strong>
      <span>${escapeHtml(card.text || "")}</span>
    </div>
  `).join("");
}

function renderCategories() {
  els.categoryGrid.innerHTML = ACTIVE_CATEGORIES.map((cat) => {
    const count = cat.id === "all"
      ? ACTIVE_PRODUCTS.length
      : ACTIVE_PRODUCTS.filter((product) => product.category === cat.id).length;

    return `
      <button class="category-card ${state.selectedCategory === cat.id ? "active" : ""}" data-category="${escapeAttr(cat.id)}">
        <span class="category-icon">${iconMarkup(cat.icon, cat.name)}</span>
        <strong>${escapeHtml(cat.name)}</strong>
        <small>${count} produk</small>
      </button>
    `;
  }).join("");

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCategory = button.dataset.category;
      state.page = 1;
      renderCategories();
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderProducts() {
  const selected = ACTIVE_CATEGORIES.find((cat) => cat.id === state.selectedCategory);
  const filtered = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * PAGE_SIZE;
  const pagedProducts = filtered.slice(start, start + PAGE_SIZE);

  els.productTitle.textContent = selected?.id === "all" ? "Semua Produk" : `${selected?.name || "Produk"} Produk`;
  els.productInfo.textContent = filtered.length
    ? `${filtered.length} produk tampil. Halaman ${state.page} dari ${totalPages}, maksimal 16 produk per halaman.`
    : `0 produk tampil dari total ${ACTIVE_PRODUCTS.length} produk.`;
  els.emptyState.hidden = filtered.length > 0;

  els.productGrid.innerHTML = pagedProducts.map((product) => productCard(product)).join("");
  renderPagination(totalPages);

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => openProductModal(button.dataset.view));
  });
}

function getFilteredProducts() {
  return ACTIVE_PRODUCTS.filter((product) => {
    const matchCategory = state.selectedCategory === "all" || product.category === state.selectedCategory;
    const matchSearch = !state.search || [product.name, product.description, product.category, product.badge]
      .join(" ")
      .toLowerCase()
      .includes(state.search);

    return matchCategory && matchSearch;
  });
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    els.pagination.innerHTML = "";
    return;
  }

  const buttons = Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `
    <button class="page-btn ${page === state.page ? "active" : ""}" data-page="${page}">${page}</button>
  `).join("");

  els.pagination.innerHTML = `
    <button class="page-btn" data-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? "disabled" : ""}>‹</button>
    ${buttons}
    <button class="page-btn" data-page="${Math.min(totalPages, state.page + 1)}" ${state.page === totalPages ? "disabled" : ""}>›</button>
  `;

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = Number(button.dataset.page || 1);
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function productCard(product) {
  const discountLabel = getDiscountBadgeText(product);

  return `
    <article class="product-card">
      ${discountLabel ? `<span class="discount">${escapeHtml(discountLabel)}</span>` : ""}
      <div class="product-thumb">
        <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" loading="lazy" />
      </div>
      <div class="product-body">
        <span class="product-badge">${escapeHtml(product.badge || "Ready")}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="price-row">
          <strong>${rupiah.format(Number(product.price || 0))}</strong>
          <small>${product.oldPrice ? rupiah.format(Number(product.oldPrice)) : ""}</small>
          <span>${escapeHtml(product.unit || "")}</span>
        </div>
        <div class="product-actions">
          <button class="view-btn" data-view="${escapeAttr(product.id)}">Detail</button>
          <button class="add-btn" data-add="${escapeAttr(product.id)}" aria-label="Tambah ${escapeAttr(product.name)}">+</button>
        </div>
      </div>
    </article>
  `;
}

function getDiscountBadgeText(product) {
  if (product.showDiscountBadge === false) return "";

  const custom = String(product.discountLabel || "").trim();
  if (custom) return custom;

  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  if (oldPrice > price && price > 0) {
    return `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
  }

  return "";
}

function openProductModal(productId) {
  const product = getProduct(productId);
  if (!product) return;

  state.selectedProduct = product;
  els.modalImage.src = product.image;
  els.modalImage.alt = product.name;
  els.modalBadge.textContent = product.badge || "Ready";
  els.modalName.textContent = product.name;
  els.modalDesc.textContent = product.description;
  els.modalPrice.textContent = `${rupiah.format(Number(product.price || 0))} ${product.unit || ""}`;
  els.modalOldPrice.textContent = product.oldPrice ? rupiah.format(Number(product.oldPrice)) : "";
  els.modalStock.textContent = `Stok: ${Number(product.stock || 0)} item tersedia`;
  els.productModal.hidden = false;
}

function closeModal() {
  els.productModal.hidden = true;
  state.selectedProduct = null;
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  renderCart();
}

function updateQty(productId, direction) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += direction;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  const detailedCart = state.cart
    .map((item) => ({ ...item, product: getProduct(item.id) }))
    .filter((item) => item.product);

  const itemCount = detailedCart.reduce((sum, item) => sum + item.qty, 0);
  const total = detailedCart.reduce((sum, item) => sum + Number(item.product.price || 0) * item.qty, 0);

  els.cartCount.textContent = itemCount;
  els.cartTotal.textContent = rupiah.format(total);
  els.cartSummary.textContent = itemCount ? `${itemCount} item di keranjang` : "Belum ada produk";

  if (!detailedCart.length) {
    els.cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Cart masih kosong</h3>
        <p>Tambahkan produk terlebih dahulu.</p>
      </div>
    `;
    return;
  }

  els.cartItems.innerHTML = detailedCart.map(({ product, qty }) => `
    <div class="cart-item">
      <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
      <div>
        <h4>${escapeHtml(product.name)}</h4>
        <p>${rupiah.format(Number(product.price || 0))} ${escapeHtml(product.unit || "")}</p>
        <div class="qty-control">
          <button data-qty="${escapeAttr(product.id)}" data-direction="-1">−</button>
          <strong>${qty}</strong>
          <button data-qty="${escapeAttr(product.id)}" data-direction="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${escapeAttr(product.id)}" aria-label="Hapus ${escapeAttr(product.name)}">×</button>
    </div>
  `).join("");

  document.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => updateQty(button.dataset.qty, Number(button.dataset.direction)));
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
}

function checkoutWhatsApp() {
  const detailedCart = state.cart
    .map((item) => ({ ...item, product: getProduct(item.id) }))
    .filter((item) => item.product);

  if (!detailedCart.length) {
    alert("Keranjang masih kosong.");
    return;
  }

  const total = detailedCart.reduce((sum, item) => {
    return sum + Number(item.product.price || 0) * item.qty;
  }, 0);

  const messageLines = [
    `Halo admin ${ACTIVE_STORE_CONFIG.name}, saya mau order:`,
    ""
  ];

  detailedCart.forEach(({ product, qty }, index) => {
    messageLines.push(
      `${index + 1}. ${product.name}`,
      `   Total : ${qty}`,
      `   Harga : ${rupiah.format(Number(product.price || 0))}`,
      ""
    );
  });

  messageLines.push(
    `Total: ${rupiah.format(total)}`,
    "",
    "Nama :",
    "Alamat :",
    "Catatan :"
  );

  const message = messageLines.join("\n");

  const url = `https://wa.me/${ACTIVE_STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openCart() {
  els.cartDrawer.classList.add("show");
  els.cartOverlay.classList.add("show");
}

function closeCart() {
  els.cartDrawer.classList.remove("show");
  els.cartOverlay.classList.remove("show");
}

function scrollCategories(direction) {
  els.categoryGrid.scrollBy({ left: direction * 420, behavior: "smooth" });
}

function loadActiveData() {
  const fallback = {
    store: STORE_CONFIG,
    categories: CATEGORIES,
    products: PRODUCTS
  };

  try {
    const raw = localStorage.getItem(DATA_STORAGE_KEY) || localStorage.getItem(LEGACY_DATA_STORAGE_KEY);
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.categories) || !Array.isArray(saved.products)) {
      return fallback;
    }

    return {
      store: mergeStore(STORE_CONFIG, saved.store || {}),
      categories: saved.categories.length ? saved.categories : CATEGORIES,
      products: saved.products.length ? saved.products : PRODUCTS
    };
  } catch (error) {
    return fallback;
  }
}

function mergeStore(base, extra) {
  const defaultPromo = [
    { title: "Promo Hari Ini", text: "Diskon produk pilihan sampai 30%" },
    { title: "Fresh Stock", text: "Update produk bisa dari halaman admin" },
    { title: "Checkout WA", text: "Order otomatis dirapikan ke WhatsApp" }
  ];

  return {
    ...base,
    ...extra,
    hero: {
      ...(base.hero || {}),
      ...(extra.hero || {})
    },
    promoCards: Array.isArray(extra.promoCards) && extra.promoCards.length
      ? extra.promoCards
      : (Array.isArray(base.promoCards) && base.promoCards.length ? base.promoCards : defaultPromo)
  };
}

function getProduct(productId) {
  return ACTIVE_PRODUCTS.find((product) => product.id === productId);
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function isImageValue(value) {
  const text = String(value || "").trim();
  return /^(data:image\/|https?:\/\/|\.\/|\/|assets\/|images\/)/i.test(text) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(text);
}

function iconMarkup(value, name = "Kategori") {
  if (isImageValue(value)) {
    return `<img src="${escapeAttr(value)}" alt="${escapeAttr(name)}" />`;
  }
  return escapeHtml(value || "🛍️");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
