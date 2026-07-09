const ADMIN_STORAGE_KEY = "marketzio-admin-data-v5";
const LEGACY_ADMIN_STORAGE_KEY = "marketzio-admin-data-v4";
const ADMIN_SESSION_KEY = "marketzio-admin-auth";
const ADMIN_USER = "admin";
const ADMIN_PASS = "marketzio123";

const money = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

let data = loadAdminData();
let editingProductId = null;
let editingCategoryId = null;

const qs = (id) => document.getElementById(id);

const el = {
  loginCard: qs("loginCard"),
  adminApp: qs("adminApp"),
  loginUser: qs("loginUser"),
  loginPass: qs("loginPass"),
  loginBtn: qs("loginBtn"),
  logoutBtn: qs("logoutBtn"),
  statProducts: qs("statProducts"),
  statCategories: qs("statCategories"),
  statPromo: qs("statPromo"),
  adminMenuBtns: document.querySelectorAll("[data-admin-tab]"),
  adminViews: document.querySelectorAll("[data-admin-view]"),

  storeNameInput: qs("storeNameInput"),
  storeTaglineInput: qs("storeTaglineInput"),
  storeLogoInput: qs("storeLogoInput"),
  storeLogoTextInput: qs("storeLogoTextInput"),
  storeLogoFile: qs("storeLogoFile"),
  storeLogoPreview: qs("storeLogoPreview"),
  storeWaInput: qs("storeWaInput"),
  storeMinOrderInput: qs("storeMinOrderInput"),
  heroEyebrowInput: qs("heroEyebrowInput"),
  heroShowEyebrowIcon: qs("heroShowEyebrowIcon"),
  heroTitleInput: qs("heroTitleInput"),
  heroSubtitleInput: qs("heroSubtitleInput"),
  heroOuterImageInput: qs("heroOuterImageInput"),
  heroInnerImageInput: qs("heroInnerImageInput"),
  heroBadgeInput: qs("heroBadgeInput"),
  heroShowOuterImage: qs("heroShowOuterImage"),
  heroShowInnerImage: qs("heroShowInnerImage"),
  heroOuterOpacity: qs("heroOuterOpacity"),
  heroOuterBrightness: qs("heroOuterBrightness"),
  heroInnerOpacity: qs("heroInnerOpacity"),
  heroInnerBrightness: qs("heroInnerBrightness"),
  heroTitleFontSize: qs("heroTitleFontSize"),
  heroTitleColor: qs("heroTitleColor"),
  heroSubtitleFontSize: qs("heroSubtitleFontSize"),
  heroSubtitleColor: qs("heroSubtitleColor"),
  heroEyebrowFontSize: qs("heroEyebrowFontSize"),
  heroEyebrowColor: qs("heroEyebrowColor"),
  heroBadgeBgColor: qs("heroBadgeBgColor"),
  heroBadgeTextColor: qs("heroBadgeTextColor"),
  heroOuterImageFile: qs("heroOuterImageFile"),
  heroInnerImageFile: qs("heroInnerImageFile"),
  heroOuterPreview: qs("heroOuterPreview"),
  heroInnerPreview: qs("heroInnerPreview"),
  promo1Title: qs("promo1Title"),
  promo1Text: qs("promo1Text"),
  promo2Title: qs("promo2Title"),
  promo2Text: qs("promo2Text"),
  promo3Title: qs("promo3Title"),
  promo3Text: qs("promo3Text"),
  saveStoreBtn: qs("saveStoreBtn"),
  saveBannerBtn: qs("saveBannerBtn"),

  categoryFormTitle: qs("categoryFormTitle"),
  categoryEditingId: qs("categoryEditingId"),
  newCategoryBtn: qs("newCategoryBtn"),
  categoryName: qs("categoryName"),
  categoryIcon: qs("categoryIcon"),
  categoryIconFile: qs("categoryIconFile"),
  categoryIconPreview: qs("categoryIconPreview"),
  addCategoryBtn: qs("addCategoryBtn"),
  categoryList: qs("categoryList"),

  formTitle: qs("formTitle"),
  newProductBtn: qs("newProductBtn"),
  productId: qs("productId"),
  productName: qs("productName"),
  productCategory: qs("productCategory"),
  productPrice: qs("productPrice"),
  productOldPrice: qs("productOldPrice"),
  productShowDiscount: qs("productShowDiscount"),
  productDiscountLabel: qs("productDiscountLabel"),
  productUnit: qs("productUnit"),
  productStock: qs("productStock"),
  productBadge: qs("productBadge"),
  productDescription: qs("productDescription"),
  productImage: qs("productImage"),
  productImageFile: qs("productImageFile"),
  imagePreview: qs("imagePreview"),
  saveProductBtn: qs("saveProductBtn"),
  clearFormBtn: qs("clearFormBtn"),
  adminSearch: qs("adminSearch"),
  productTable: qs("productTable"),
  exportProductsBtn: qs("exportProductsBtn"),
  exportJsonBtn: qs("exportJsonBtn"),
  resetDataBtn: qs("resetDataBtn")
};

boot();

function boot() {
  bindAdminEvents();
  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
    showAdmin();
  }
}

function bindAdminEvents() {
  el.loginBtn.addEventListener("click", login);
  el.loginPass.addEventListener("keydown", (event) => {
    if (event.key === "Enter") login();
  });

  el.logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    el.adminApp.hidden = true;
    el.loginCard.hidden = false;
  });

  el.adminMenuBtns.forEach((button) => {
    button.addEventListener("click", () => switchAdminTab(button.dataset.adminTab));
  });

  el.saveStoreBtn.addEventListener("click", saveStoreSetting);
  el.saveBannerBtn.addEventListener("click", saveStoreSetting);
  el.storeLogoInput.addEventListener("input", updateLogoPreview);
  el.storeLogoTextInput.addEventListener("input", updateLogoPreview);
  el.storeLogoFile.addEventListener("change", (event) => handleImageUpload(event, el.storeLogoInput, updateLogoPreview, 420, 0.86));
  el.heroOuterImageInput.addEventListener("input", updateHeroOuterPreview);
  el.heroInnerImageInput.addEventListener("input", updateHeroInnerPreview);
  el.heroShowOuterImage.addEventListener("change", updateHeroOuterPreview);
  el.heroShowInnerImage.addEventListener("change", updateHeroInnerPreview);
  el.heroOuterImageFile.addEventListener("change", (event) => handleImageUpload(event, el.heroOuterImageInput, updateHeroOuterPreview, 1600, 0.82));
  el.heroInnerImageFile.addEventListener("change", (event) => handleImageUpload(event, el.heroInnerImageInput, updateHeroInnerPreview, 1000, 0.82));
  [el.heroOuterOpacity, el.heroOuterBrightness, el.heroInnerOpacity, el.heroInnerBrightness].forEach((range) => {
    range.addEventListener("input", () => {
      updateRangeOutputs();
      updateHeroOuterPreview();
      updateHeroInnerPreview();
    });
  });

  el.newCategoryBtn.addEventListener("click", clearCategoryForm);
  el.addCategoryBtn.addEventListener("click", saveCategory);
  el.categoryIcon.addEventListener("input", updateCategoryIconPreview);
  el.categoryIconFile.addEventListener("change", (event) => handleImageUpload(event, el.categoryIcon, updateCategoryIconPreview, 260, 0.82));

  el.newProductBtn.addEventListener("click", clearProductForm);
  el.clearFormBtn.addEventListener("click", clearProductForm);
  el.saveProductBtn.addEventListener("click", saveProduct);
  el.adminSearch.addEventListener("input", renderProductsTable);
  el.productImage.addEventListener("input", updateImagePreview);
  el.productImageFile.addEventListener("change", (event) => handleImageUpload(event, el.productImage, updateImagePreview, 900, 0.78));
  el.exportProductsBtn.addEventListener("click", exportProductsJs);
  el.exportJsonBtn.addEventListener("click", exportJsonBackup);
  el.resetDataBtn.addEventListener("click", resetData);
}

function login() {
  const user = el.loginUser.value.trim();
  const pass = el.loginPass.value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    showAdmin();
    return;
  }

  alert("Username atau password salah. Demo: admin / marketzio123");
}

function showAdmin() {
  el.loginCard.hidden = true;
  el.adminApp.hidden = false;
  fillStoreForm();
  clearCategoryForm(false);
  clearProductForm(false);
  renderAll();
}

function loadAdminData() {
  const fallback = getDefaultData();
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(LEGACY_ADMIN_STORAGE_KEY));
    if (!saved || !Array.isArray(saved.categories) || !Array.isArray(saved.products)) {
      return fallback;
    }

    return {
      store: mergeStore(fallback.store, saved.store || {}),
      categories: saved.categories.length ? saved.categories : fallback.categories,
      products: saved.products.length ? saved.products : fallback.products
    };
  } catch (error) {
    return fallback;
  }
}

function getDefaultData() {
  return {
    store: mergeStore({}, clone(STORE_CONFIG)),
    categories: clone(CATEGORIES),
    products: clone(PRODUCTS)
  };
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function persist() {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    alert("Data gagal disimpan. Biasanya karena ukuran foto terlalu besar. Coba pakai foto yang lebih kecil.");
    throw error;
  }
}

function renderAll() {
  renderStats();
  renderCategoryOptions();
  renderCategoryList();
  renderProductsTable();
  updateLogoPreview();
  updateRangeOutputs();
  updateHeroOuterPreview();
  updateHeroInnerPreview();
  updateCategoryIconPreview();
  updateImagePreview();
}

function fillStoreForm() {
  const hero = data.store.hero || {};
  const promos = Array.isArray(data.store.promoCards) ? data.store.promoCards : [];

  el.storeNameInput.value = data.store.name || "";
  el.storeTaglineInput.value = data.store.tagline || "";
  el.storeLogoInput.value = data.store.logo || "";
  el.storeLogoTextInput.value = data.store.logoText || (data.store.name || "M").trim().slice(0, 1).toUpperCase();
  el.storeWaInput.value = data.store.whatsappNumber || "";
  el.storeMinOrderInput.value = data.store.minOrderText || "";
  el.heroEyebrowInput.value = hero.eyebrow || "";
  el.heroShowEyebrowIcon.checked = hero.showEyebrowIcon === true;
  el.heroTitleInput.value = hero.title || "";
  el.heroSubtitleInput.value = hero.subtitle || "";
  el.heroOuterImageInput.value = hero.outerImage || "";
  el.heroInnerImageInput.value = hero.innerImage || hero.visual || "";
  el.heroShowOuterImage.checked = hero.showOuterImage !== false;
  el.heroShowInnerImage.checked = hero.showInnerImage !== false;
  el.heroOuterOpacity.value = hero.outerOpacity ?? 45;
  el.heroOuterBrightness.value = hero.outerBrightness ?? 100;
  el.heroInnerOpacity.value = hero.innerOpacity ?? 100;
  el.heroInnerBrightness.value = hero.innerBrightness ?? 100;
  el.heroTitleFontSize.value = hero.titleFontSize ?? 62;
  el.heroTitleColor.value = hero.titleColor || "#17342a";
  el.heroSubtitleFontSize.value = hero.subtitleFontSize ?? 17;
  el.heroSubtitleColor.value = hero.subtitleColor || "#6c7a75";
  el.heroEyebrowFontSize.value = hero.eyebrowFontSize ?? 13;
  el.heroEyebrowColor.value = hero.eyebrowColor || "#078c55";
  el.heroBadgeBgColor.value = hero.badgeBgColor || "#ff8a34";
  el.heroBadgeTextColor.value = hero.badgeTextColor || "#ffffff";
  el.heroBadgeInput.value = String(hero.badge || "").replace(/\n/g, " ");

  el.promo1Title.value = promos[0]?.title || "";
  el.promo1Text.value = promos[0]?.text || "";
  el.promo2Title.value = promos[1]?.title || "";
  el.promo2Text.value = promos[1]?.text || "";
  el.promo3Title.value = promos[2]?.title || "";
  el.promo3Text.value = promos[2]?.text || "";
}

function saveStoreSetting() {
  data.store = {
    ...data.store,
    name: el.storeNameInput.value.trim() || "Marketzio",
    tagline: el.storeTaglineInput.value.trim() || "Fresh Market Online",
    logo: el.storeLogoInput.value.trim(),
    logoText: el.storeLogoTextInput.value.trim() || (el.storeNameInput.value.trim() || "M").slice(0, 1).toUpperCase(),
    whatsappNumber: normalizeWa(el.storeWaInput.value),
    minOrderText: el.storeMinOrderInput.value.trim(),
    hero: {
      ...(data.store.hero || {}),
      eyebrow: el.heroEyebrowInput.value.trim() || "100% Fresh & Natural",
      showEyebrowIcon: el.heroShowEyebrowIcon.checked,
      title: el.heroTitleInput.value.trim() || "Belanja kebutuhan harian jadi lebih cepat.",
      subtitle: el.heroSubtitleInput.value.trim() || "Pilih produk, masukkan ke keranjang, lalu checkout langsung ke WhatsApp admin.",
      outerImage: el.heroOuterImageInput.value.trim(),
      innerImage: el.heroInnerImageInput.value.trim() || "🍓🥑🍊🍇🍎",
      visual: el.heroInnerImageInput.value.trim() || "🍓🥑🍊🍇🍎",
      showOuterImage: el.heroShowOuterImage.checked,
      showInnerImage: el.heroShowInnerImage.checked,
      outerOpacity: Number(el.heroOuterOpacity.value || 45),
      outerBrightness: Number(el.heroOuterBrightness.value || 100),
      innerOpacity: Number(el.heroInnerOpacity.value || 100),
      innerBrightness: Number(el.heroInnerBrightness.value || 100),
      titleFontSize: Number(el.heroTitleFontSize.value || 62),
      titleColor: el.heroTitleColor.value || "#17342a",
      subtitleFontSize: Number(el.heroSubtitleFontSize.value || 17),
      subtitleColor: el.heroSubtitleColor.value || "#6c7a75",
      eyebrowFontSize: Number(el.heroEyebrowFontSize.value || 13),
      eyebrowColor: el.heroEyebrowColor.value || "#078c55",
      badgeBgColor: el.heroBadgeBgColor.value || "#ff8a34",
      badgeTextColor: el.heroBadgeTextColor.value || "#ffffff",
      badge: el.heroBadgeInput.value.trim() || "SHOP NOW"
    },
    promoCards: [
      { title: el.promo1Title.value.trim() || "Promo Hari Ini", text: el.promo1Text.value.trim() || "Diskon produk pilihan sampai 30%" },
      { title: el.promo2Title.value.trim() || "Fresh Stock", text: el.promo2Text.value.trim() || "Update produk bisa dari halaman admin" },
      { title: el.promo3Title.value.trim() || "Checkout WA", text: el.promo3Text.value.trim() || "Order otomatis dirapikan ke WhatsApp" }
    ]
  };
  persist();
  alert("Setting toko dan banner berhasil disimpan.");
}

function normalizeWa(value) {
  return String(value || "").replace(/[^0-9]/g, "") || "6281234567890";
}


function switchAdminTab(tabName) {
  const target = tabName || "dashboard";
  el.adminMenuBtns.forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === target);
  });
  el.adminViews.forEach((view) => {
    const active = view.dataset.adminView === target;
    view.hidden = !active;
    view.classList.toggle("active", active);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateLogoPreview() {
  const value = el.storeLogoInput.value.trim();
  const text = (el.storeLogoTextInput.value.trim() || el.storeNameInput.value.trim() || "M").slice(0, 2).toUpperCase();

  if (value && isImageValue(value)) {
    el.storeLogoPreview.innerHTML = `<img src="${escapeAttr(value)}" alt="Preview logo market" />`;
    return;
  }

  el.storeLogoPreview.textContent = value || text || "M";
}

function updateRangeOutputs() {
  document.querySelectorAll("output[data-output-for]").forEach((output) => {
    const input = qs(output.dataset.outputFor);
    if (input) output.textContent = `${input.value}%`;
  });
}

function updateHeroOuterPreview() {
  const value = el.heroOuterImageInput.value.trim();
  if (!el.heroShowOuterImage.checked) {
    el.heroOuterPreview.innerHTML = "Gambar luar dimatikan";
    el.heroOuterPreview.classList.remove("muted-preview");
    return;
  }

  if (!value) {
    el.heroOuterPreview.innerHTML = "Background Banner";
    return;
  }

  if (isImageValue(value)) {
    el.heroOuterPreview.innerHTML = `<img src="${escapeAttr(value)}" alt="Preview gambar luar banner" style="opacity:${Number(el.heroOuterOpacity.value || 45) / 100};filter:brightness(${Number(el.heroOuterBrightness.value || 100) / 100});" />`;
  } else {
    el.heroOuterPreview.innerHTML = `<div class="hero-preview-emoji">${escapeHtml(value)}</div>`;
  }
}

function updateHeroInnerPreview() {
  const value = el.heroInnerImageInput.value.trim();
  if (!el.heroShowInnerImage.checked) {
    el.heroInnerPreview.innerHTML = "Gambar dalam dimatikan";
    return;
  }

  if (!value) {
    el.heroInnerPreview.innerHTML = "Poster / Icon Banner";
    return;
  }

  if (isImageValue(value)) {
    el.heroInnerPreview.innerHTML = `<img src="${escapeAttr(value)}" alt="Preview gambar dalam banner" style="opacity:${Number(el.heroInnerOpacity.value || 100) / 100};filter:brightness(${Number(el.heroInnerBrightness.value || 100) / 100});" />`;
  } else {
    el.heroInnerPreview.innerHTML = `<div class="hero-preview-emoji">${escapeHtml(value)}</div>`;
  }
}

function saveCategory() {
  const name = el.categoryName.value.trim();
  const icon = el.categoryIcon.value.trim() || "🛍️";

  if (!name) {
    alert("Nama kategori wajib diisi.");
    return;
  }

  if (editingCategoryId) {
    data.categories = data.categories.map((cat) => {
      if (cat.id !== editingCategoryId) return cat;
      return { ...cat, name, icon };
    });
  } else {
    const id = uniqueId(slugify(name), data.categories.map((item) => item.id));
    data.categories.push({ id, name, icon });
  }

  persist();
  clearCategoryForm();
  renderAll();
}

function editCategory(id) {
  const category = data.categories.find((item) => item.id === id);
  if (!category) return;

  editingCategoryId = category.id;
  el.categoryFormTitle.textContent = "Edit Kategori";
  el.categoryEditingId.value = category.id;
  el.categoryName.value = category.name || "";
  el.categoryIcon.value = category.icon || "";
  updateCategoryIconPreview();
}

function clearCategoryForm(render = true) {
  editingCategoryId = null;
  el.categoryFormTitle.textContent = "Tambah Kategori";
  el.categoryEditingId.value = "";
  el.categoryName.value = "";
  el.categoryIcon.value = "";
  el.categoryIconFile.value = "";
  updateCategoryIconPreview();
  if (render) renderAll();
}

function deleteCategory(id) {
  if (id === "all") {
    alert("Kategori Semua tidak bisa dihapus.");
    return;
  }

  const used = data.products.some((product) => product.category === id);
  if (used) {
    alert("Kategori ini masih dipakai produk. Ubah/hapus produknya dulu sebelum hapus kategori.");
    return;
  }

  if (!confirm("Hapus kategori ini?")) return;
  data.categories = data.categories.filter((category) => category.id !== id);
  persist();
  if (editingCategoryId === id) clearCategoryForm(false);
  renderAll();
}

function moveCategory(id, direction) {
  const currentIndex = data.categories.findIndex((cat) => cat.id === id);
  if (currentIndex < 0) return;

  const nextIndex = Math.max(0, Math.min(data.categories.length - 1, currentIndex + Number(direction || 0)));
  if (currentIndex === nextIndex) return;

  const [moved] = data.categories.splice(currentIndex, 1);
  data.categories.splice(nextIndex, 0, moved);
  persist();
  renderAll();
}

function setupCategoryDragEvents() {
  const rows = document.querySelectorAll("[data-category-row]");
  let draggedId = null;

  rows.forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      draggedId = row.dataset.categoryRow;
      row.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedId);
    });

    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      draggedId = null;
      document.querySelectorAll(".sortable-row.drop-target").forEach((item) => item.classList.remove("drop-target"));
    });

    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drop-target");
      event.dataTransfer.dropEffect = "move";
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("drop-target");
    });

    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drop-target");

      const sourceId = draggedId || event.dataTransfer.getData("text/plain");
      const targetId = row.dataset.categoryRow;
      if (!sourceId || !targetId || sourceId === targetId) return;

      reorderCategoryByDrop(sourceId, targetId, event);
    });
  });
}

function reorderCategoryByDrop(sourceId, targetId, event) {
  const sourceIndex = data.categories.findIndex((cat) => cat.id === sourceId);
  let targetIndex = data.categories.findIndex((cat) => cat.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;
  const [moved] = data.categories.splice(sourceIndex, 1);

  if (sourceIndex < targetIndex) targetIndex -= 1;
  if (insertAfter) targetIndex += 1;

  targetIndex = Math.max(0, Math.min(data.categories.length, targetIndex));
  data.categories.splice(targetIndex, 0, moved);
  persist();
  renderAll();
}

function updateCategoryIconPreview() {
  const value = el.categoryIcon.value.trim();
  if (!value) {
    el.categoryIconPreview.innerHTML = "🛍️";
    return;
  }

  if (isImageValue(value)) {
    el.categoryIconPreview.innerHTML = `<img src="${escapeAttr(value)}" alt="Preview icon kategori" />`;
  } else {
    el.categoryIconPreview.textContent = value;
  }
}

function renderStats() {
  el.statProducts.textContent = data.products.length;
  el.statCategories.textContent = data.categories.filter((cat) => cat.id !== "all").length;
  el.statPromo.textContent = data.products.filter((item) => getDiscountBadgeText(item)).length;
}

function renderCategoryOptions() {
  const categories = data.categories.filter((cat) => cat.id !== "all");
  el.productCategory.innerHTML = categories.map((cat) => `
    <option value="${escapeAttr(cat.id)}">${stripImageIcon(cat.icon)} ${escapeHtml(cat.name)}</option>
  `).join("");
}

function renderCategoryList() {
  el.categoryList.innerHTML = data.categories.map((cat, index) => `
    <div class="list-row sortable-row" draggable="true" data-category-row="${escapeAttr(cat.id)}">
      <button class="drag-handle" type="button" title="Geser urutan kategori" aria-label="Geser urutan ${escapeAttr(cat.name)}">☰</button>
      <span class="emoji">${iconMarkup(cat.icon, cat.name)}</span>
      <div>
        <strong>${escapeHtml(cat.name)}</strong>
        <p>${escapeHtml(cat.id)}</p>
      </div>
      <div class="row-actions">
        <button class="mini-btn order" data-move-category="${escapeAttr(cat.id)}" data-direction="-1" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="mini-btn order" data-move-category="${escapeAttr(cat.id)}" data-direction="1" ${index === data.categories.length - 1 ? "disabled" : ""}>↓</button>
        <button class="mini-btn" data-edit-category="${escapeAttr(cat.id)}">Edit</button>
        ${cat.id === "all" ? "" : `<button class="mini-btn delete" data-delete-category="${escapeAttr(cat.id)}">Hapus</button>`}
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-category]").forEach((button) => {
    button.addEventListener("click", () => editCategory(button.dataset.editCategory));
  });

  document.querySelectorAll("[data-delete-category]").forEach((button) => {
    button.addEventListener("click", () => deleteCategory(button.dataset.deleteCategory));
  });

  document.querySelectorAll("[data-move-category]").forEach((button) => {
    button.addEventListener("click", () => moveCategory(button.dataset.moveCategory, Number(button.dataset.direction || 0)));
  });

  setupCategoryDragEvents();
}

function saveProduct() {
  const name = el.productName.value.trim();
  const category = el.productCategory.value;
  const price = Number(el.productPrice.value || 0);

  if (!name) {
    alert("Nama produk wajib diisi.");
    return;
  }

  if (!category) {
    alert("Kategori produk wajib dipilih.");
    return;
  }

  if (!price || price < 1) {
    alert("Harga jual wajib diisi.");
    return;
  }

  const existingIds = data.products
    .map((item) => item.id)
    .filter((id) => id !== editingProductId);

  const product = {
    id: editingProductId || uniqueId(slugify(name), existingIds),
    name,
    category,
    price,
    oldPrice: Number(el.productOldPrice.value || 0) || null,
    showDiscountBadge: el.productShowDiscount.checked,
    discountLabel: el.productDiscountLabel.value.trim(),
    unit: el.productUnit.value.trim(),
    stock: Number(el.productStock.value || 0),
    image: el.productImage.value.trim() || "assets/products/apel-fuji.svg",
    badge: el.productBadge.value.trim() || "Ready",
    description: el.productDescription.value.trim() || "Produk supermarket siap dipesan."
  };

  if (editingProductId) {
    data.products = data.products.map((item) => item.id === editingProductId ? product : item);
  } else {
    data.products.unshift(product);
  }

  persist();
  clearProductForm(false);
  renderAll();
  alert("Produk berhasil disimpan.");
}

function editProduct(id) {
  const product = data.products.find((item) => item.id === id);
  if (!product) return;

  editingProductId = product.id;
  el.formTitle.textContent = "Edit Produk";
  el.productId.value = product.id;
  el.productName.value = product.name || "";
  el.productCategory.value = product.category || "";
  el.productPrice.value = product.price || "";
  el.productOldPrice.value = product.oldPrice || "";
  el.productShowDiscount.checked = product.showDiscountBadge !== false;
  el.productDiscountLabel.value = product.discountLabel || "";
  el.productUnit.value = product.unit || "";
  el.productStock.value = product.stock || 0;
  el.productBadge.value = product.badge || "";
  el.productDescription.value = product.description || "";
  el.productImage.value = product.image || "";
  updateImagePreview();
  switchAdminTab("product");
}

function deleteProduct(id) {
  const product = data.products.find((item) => item.id === id);
  if (!product) return;

  if (!confirm(`Hapus produk ${product.name}?`)) return;
  data.products = data.products.filter((item) => item.id !== id);
  persist();
  if (editingProductId === id) clearProductForm(false);
  renderAll();
}

function clearProductForm(render = true) {
  editingProductId = null;
  el.formTitle.textContent = "Tambah Produk";
  el.productId.value = "";
  el.productName.value = "";
  el.productCategory.value = data.categories.find((cat) => cat.id !== "all")?.id || "";
  el.productPrice.value = "";
  el.productOldPrice.value = "";
  el.productShowDiscount.checked = true;
  el.productDiscountLabel.value = "";
  el.productUnit.value = "";
  el.productStock.value = "";
  el.productBadge.value = "";
  el.productDescription.value = "";
  el.productImage.value = "";
  el.productImageFile.value = "";
  updateImagePreview();
  if (render) renderAll();
}

function renderProductsTable() {
  const query = el.adminSearch.value.trim().toLowerCase();
  const products = data.products.filter((product) => {
    return !query || [product.name, product.description, product.category, product.badge]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (!products.length) {
    el.productTable.innerHTML = `
      <div class="empty-state">
        <h3>Belum ada produk</h3>
        <p>Tambahkan produk dari form di atas.</p>
      </div>
    `;
    return;
  }

  el.productTable.innerHTML = products.map((product) => `
    <div class="table-row">
      <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(getCategoryName(product.category))} • ${escapeHtml(product.badge || "Ready")}</p>
      </div>
      <strong>${money.format(Number(product.price || 0))}</strong>
      <span>Stok: ${Number(product.stock || 0)}<br>${getDiscountBadgeText(product) ? `Diskon: ${escapeHtml(getDiscountBadgeText(product))}` : "Diskon: mati"}</span>
      <div class="table-actions">
        <button class="mini-btn" data-edit-product="${escapeAttr(product.id)}">Edit</button>
        <button class="mini-btn delete" data-delete-product="${escapeAttr(product.id)}">Hapus</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => editProduct(button.dataset.editProduct));
  });

  document.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.deleteProduct));
  });
}

function updateImagePreview() {
  const value = el.productImage.value.trim();
  if (!value) {
    el.imagePreview.innerHTML = "Foto Produk";
    return;
  }

  el.imagePreview.innerHTML = `<img src="${escapeAttr(value)}" alt="Preview foto produk" />`;
}

async function handleImageUpload(event, targetInput, previewFn, maxWidth = 900, quality = 0.78) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await resizeImage(file, maxWidth, quality);
    targetInput.value = dataUrl;
    previewFn();
  } catch (error) {
    alert("Foto gagal dibaca. Coba pilih foto lain.");
  }
}

function resizeImage(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getCategoryName(id) {
  const category = data.categories.find((cat) => cat.id === id);
  return category ? `${stripImageIcon(category.icon)} ${category.name}` : id;
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

function resetData() {
  if (!confirm("Reset semua data admin ke produk contoh awal?")) return;
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  data = getDefaultData();
  fillStoreForm();
  clearCategoryForm(false);
  clearProductForm(false);
  renderAll();
}

function exportJsonBackup() {
  downloadFile(
    "marketzio-backup.json",
    JSON.stringify(data, null, 2),
    "application/json"
  );
}

function exportProductsJs() {
  const content = `// ===============================\n// DATA PRODUK MARKETZIO\n// File ini hasil export dari admin.html\n// Upload/replace file ini ke GitHub agar tampil untuk semua pengunjung.\n// ===============================\n\nconst STORE_CONFIG = ${JSON.stringify(data.store, null, 2)};\n\nconst CATEGORIES = ${JSON.stringify(data.categories, null, 2)};\n\nconst PRODUCTS = ${JSON.stringify(data.products, null, 2)};\n`;

  downloadFile("products.js", content, "text/javascript");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function slugify(value) {
  return String(value || "produk")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "produk";
}

function uniqueId(base, existingIds) {
  let id = base;
  let count = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${count}`;
    count += 1;
  }
  return id;
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

function stripImageIcon(value) {
  return isImageValue(value) ? "🖼️" : (value || "🛍️");
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
