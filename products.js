// ===============================
// DATA PRODUK MARKETZIO
// Edit file ini kalau ingin menambah kategori / produk.
// Setelah edit, upload ulang ke GitHub lalu Cloudflare Pages akan update otomatis.
// ===============================

const STORE_CONFIG = {
  name: "Marketzio",
  tagline: "Fresh Market Online",
  // Logo bisa diganti dari admin. Bisa path/URL gambar atau kosong agar pakai huruf awal toko.
  logo: "",
  logoText: "M",
  whatsappNumber: "6281234567890", // GANTI nomor WA admin. Contoh: 62812xxxxxxx tanpa tanda +
  address: "Belanja harian jadi lebih mudah",
  minOrderText: "Gratis ongkir area tertentu",
  hero: {
    eyebrow: "100% Fresh & Natural",
    // Matikan/hidupkan icon daun kecil di label banner dari admin.
    showEyebrowIcon: false,
    title: "Belanja kebutuhan harian jadi lebih cepat.",
    subtitle: "Pilih produk, masukkan ke keranjang, lalu checkout langsung ke WhatsApp admin.",
    // Gambar luar = background besar banner. Ganti lewat admin atau isi path, contoh: assets/banner-luar.jpg
    outerImage: "assets/banner/banner-luar.svg",
    showOuterImage: true,
    // Gambar dalam = poster/icon di kanan. Bisa gambar, URL, path, atau emoji.
    innerImage: "assets/banner/banner-dalam.svg",
    visual: "🍓🥑🍊🍇🍎",
    showInnerImage: true,
    // Transparansi & terang/gelap gambar banner, diatur dari admin.
    outerOpacity: 45,
    outerBrightness: 100,
    innerOpacity: 100,
    innerBrightness: 100,
    // Font & warna banner, diatur dari admin.
    titleFontSize: 62,
    titleColor: "#17342a",
    subtitleFontSize: 17,
    subtitleColor: "#6c7a75",
    eyebrowFontSize: 13,
    eyebrowColor: "#078c55",
    badgeBgColor: "#ff8a34",
    badgeTextColor: "#ffffff",
    badge: "SHOP\nNOW"
  },
  promoCards: [
    { title: "Promo Hari Ini", text: "Diskon produk pilihan sampai 30%" },
    { title: "Fresh Stock", text: "Update produk bisa dari halaman admin" },
    { title: "Checkout WA", text: "Order otomatis dirapikan ke WhatsApp" }
  ]
};

const CATEGORIES = [
  { id: "all", name: "Semua", icon: "🛒" },
  { id: "buah", name: "Buah", icon: "🍎" },
  { id: "sayur", name: "Sayur", icon: "🥦" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "daging", name: "Daging", icon: "🥩" },
  { id: "minuman", name: "Minuman", icon: "🧃" },
  { id: "snack", name: "Snack", icon: "🍪" },
  { id: "sembako", name: "Sembako", icon: "🍚" },
  { id: "frozen", name: "Frozen", icon: "🧊" },
  { id: "kebutuhan-rumah", name: "Rumah", icon: "🧼" }
];

const PRODUCTS = [
  {
    id: "apel-fuji",
    name: "Apel Fuji Premium",
    category: "buah",
    price: 25000,
    oldPrice: 32000,
    unit: "/ kg",
    stock: 35,
    image: "assets/products/apel-fuji.svg",
    badge: "Promo",
    description: "Apel Fuji segar, manis, dan cocok untuk konsumsi harian."
  },
  {
    id: "jeruk-sunkist",
    name: "Jeruk Sunkist",
    category: "buah",
    price: 28000,
    oldPrice: 35000,
    unit: "/ kg",
    stock: 28,
    image: "assets/products/jeruk-sunkist.svg",
    badge: "Fresh",
    description: "Jeruk pilihan dengan rasa segar dan kandungan vitamin C."
  },
  {
    id: "pisang-cavendish",
    name: "Pisang Cavendish",
    category: "buah",
    price: 19000,
    oldPrice: 23000,
    unit: "/ sisir",
    stock: 44,
    image: "assets/products/pisang.svg",
    badge: "Best",
    description: "Pisang Cavendish lembut dan manis untuk sarapan sehat."
  },
  {
    id: "brokoli-organik",
    name: "Brokoli Organik",
    category: "sayur",
    price: 18000,
    oldPrice: 24000,
    unit: "/ pack",
    stock: 18,
    image: "assets/products/brokoli.svg",
    badge: "Organik",
    description: "Brokoli hijau segar, cocok untuk tumis, sup, dan meal prep."
  },
  {
    id: "wortel-lokal",
    name: "Wortel Lokal",
    category: "sayur",
    price: 12000,
    oldPrice: 16000,
    unit: "/ kg",
    stock: 50,
    image: "assets/products/wortel.svg",
    badge: "Hemat",
    description: "Wortel segar ukuran pilihan untuk kebutuhan masakan rumah."
  },
  {
    id: "susu-uht",
    name: "Susu UHT Full Cream",
    category: "dairy",
    price: 17500,
    oldPrice: 21000,
    unit: "/ pcs",
    stock: 70,
    image: "assets/products/susu.svg",
    badge: "Ready",
    description: "Susu UHT full cream, praktis untuk keluarga dan anak sekolah."
  },
  {
    id: "keju-slice",
    name: "Keju Slice",
    category: "dairy",
    price: 24000,
    oldPrice: 29000,
    unit: "/ pack",
    stock: 22,
    image: "assets/products/keju.svg",
    badge: "Favorit",
    description: "Keju slice lembut untuk roti, burger, dan bekal."
  },
  {
    id: "ayam-fillet",
    name: "Ayam Fillet Fresh",
    category: "daging",
    price: 42000,
    oldPrice: 48000,
    unit: "/ kg",
    stock: 15,
    image: "assets/products/ayam.svg",
    badge: "Fresh Cut",
    description: "Ayam fillet segar siap masak, bersih dan higienis."
  },
  {
    id: "ikan-fillet",
    name: "Ikan Fillet Segar",
    category: "daging",
    price: 39000,
    oldPrice: 46000,
    unit: "/ pack",
    stock: 19,
    image: "assets/products/ikan.svg",
    badge: "Seafood",
    description: "Ikan fillet segar untuk digoreng, kukus, atau sup."
  },
  {
    id: "air-mineral",
    name: "Air Mineral 600ml",
    category: "minuman",
    price: 4500,
    oldPrice: 6000,
    unit: "/ botol",
    stock: 120,
    image: "assets/products/air-mineral.svg",
    badge: "Murah",
    description: "Air mineral botol 600ml untuk kebutuhan harian."
  },
  {
    id: "teh-botol",
    name: "Teh Botol Dingin",
    category: "minuman",
    price: 7000,
    oldPrice: 9000,
    unit: "/ botol",
    stock: 85,
    image: "assets/products/teh.svg",
    badge: "Dingin",
    description: "Minuman teh siap minum, cocok untuk makan siang."
  },
  {
    id: "kopi-sachet",
    name: "Kopi Sachet 10pcs",
    category: "minuman",
    price: 18500,
    oldPrice: 22000,
    unit: "/ pack",
    stock: 62,
    image: "assets/products/kopi.svg",
    badge: "Hemat",
    description: "Kopi sachet praktis untuk stok rumah dan kantor."
  },
  {
    id: "keripik-kentang",
    name: "Keripik Kentang",
    category: "snack",
    price: 15500,
    oldPrice: 19000,
    unit: "/ pcs",
    stock: 38,
    image: "assets/products/keripik.svg",
    badge: "Snack",
    description: "Keripik kentang renyah untuk cemilan santai."
  },
  {
    id: "biskuit-coklat",
    name: "Biskuit Coklat",
    category: "snack",
    price: 12500,
    oldPrice: 16000,
    unit: "/ pack",
    stock: 41,
    image: "assets/products/biskuit.svg",
    badge: "Manis",
    description: "Biskuit coklat lezat untuk teman minum teh atau kopi."
  },
  {
    id: "roti-tawar",
    name: "Roti Tawar Gandum",
    category: "snack",
    price: 18000,
    oldPrice: 22000,
    unit: "/ pcs",
    stock: 34,
    image: "assets/products/roti.svg",
    badge: "Fresh",
    description: "Roti tawar gandum lembut untuk sarapan dan bekal."
  },
  {
    id: "beras-premium-5kg",
    name: "Beras Premium 5kg",
    category: "sembako",
    price: 72000,
    oldPrice: 80000,
    unit: "/ karung",
    stock: 26,
    image: "assets/products/beras-premium.svg",
    badge: "Sembako",
    description: "Beras premium pulen untuk kebutuhan makan keluarga."
  },
  {
    id: "telur-ayam-1kg",
    name: "Telur Ayam 1kg",
    category: "sembako",
    price: 31000,
    oldPrice: 36000,
    unit: "/ kg",
    stock: 40,
    image: "assets/products/telur.svg",
    badge: "Ready",
    description: "Telur ayam pilihan untuk stok harian di rumah."
  },
  {
    id: "minyak-goreng-2l",
    name: "Minyak Goreng 2L",
    category: "sembako",
    price: 36500,
    oldPrice: 42000,
    unit: "/ pouch",
    stock: 31,
    image: "assets/products/minyak.svg",
    badge: "Promo",
    description: "Minyak goreng 2 liter untuk kebutuhan dapur harian."
  },
  {
    id: "gula-pasir-1kg",
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 17000,
    oldPrice: 20000,
    unit: "/ kg",
    stock: 55,
    image: "assets/products/gula.svg",
    badge: "Hemat",
    description: "Gula pasir bersih untuk minuman dan masakan."
  },
  {
    id: "mie-instan-karton",
    name: "Mie Instan 1 Karton",
    category: "sembako",
    price: 118000,
    oldPrice: 132000,
    unit: "/ karton",
    stock: 12,
    image: "assets/products/mie.svg",
    badge: "Stok Banyak",
    description: "Mie instan satu karton, cocok untuk stok bulanan."
  },
  {
    id: "nugget-ayam-frozen",
    name: "Nugget Ayam Frozen",
    category: "frozen",
    price: 35000,
    oldPrice: 42000,
    unit: "/ pack",
    stock: 20,
    image: "assets/products/nugget.svg",
    badge: "Frozen",
    description: "Nugget ayam frozen praktis untuk lauk cepat saji."
  },
  {
    id: "sabun-mandi",
    name: "Sabun Mandi 3pcs",
    category: "kebutuhan-rumah",
    price: 21000,
    oldPrice: 26000,
    unit: "/ pack",
    stock: 45,
    image: "assets/products/sabun.svg",
    badge: "Rumah",
    description: "Sabun mandi paket hemat untuk kebutuhan keluarga."
  }
];
