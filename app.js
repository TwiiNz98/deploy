/* ============================================================
   CÍRCULO DE SABORES — SPA Engine v3.0
   Mobile-first | Conversion-optimized | Admin Panel
   ============================================================ */
'use strict';

/* ── DELIVERY THRESHOLD ─────────────────────────────────── */
const DELIVERY_FREE_THRESHOLD = 20000; // Delivery gratis sobre $20.000

/* ── TAG DEFINITIONS ────────────────────────────────────── */
const TAGS = {
  keto:          { label: 'Keto',          icon: '🥑', color: '#5b4fcf' },
  sin_azucar:    { label: 'Sin Azúcar',    icon: '🍃', color: '#059669' },
  alto_proteina: { label: 'Alto Proteína', icon: '💪', color: '#c2410c' },
  alta_fibra:    { label: 'Alta Fibra',    icon: '🌾', color: '#0369a1' },
  energizante:   { label: 'Energizante',   icon: '⚡', color: '#b45309' },
  vegano:        { label: 'Vegano',        icon: '🌱', color: '#16a34a' },
};

/* ── CATEGORY DEFINITIONS ───────────────────────────────── */
const CATEGORY_META = {
  todos:        { label: 'Todos',                    emoji: '🌿' },
  barras:       { label: 'Barras Saludables',        emoji: '🌾' },
  dulces:       { label: 'Dulces Saludables',        emoji: '🍫' },
  frutos:       { label: 'Frutos Secos',             emoji: '🥜' },
  snacks:       { label: 'Snacks Crujientes',        emoji: '🥥' },
  reposteria:   { label: 'Repostería Artesanal',     emoji: '🧁' },
  keto:         { label: 'Keto',                     emoji: '🥑' },
  funcional:    { label: 'Funcional / Fit',          emoji: '💪' },
  mantequillas: { label: 'Mantequillas Naturales',   emoji: '🫙' },
  granolas:     { label: 'Granolas y Desayunos',     emoji: '🥣' },
  superfoods:   { label: 'Superfoods',               emoji: '✨' },
  packs:        { label: 'Packs y Combos',           emoji: '📦' },
};
const CATEGORIES = Object.keys(CATEGORY_META);

/* ── BASE PRODUCTS ──────────────────────────────────────── */
const BASE_PRODUCTS = [
  /* ─ BARRAS ─ */
  {
    id: 'bar-energia', name: 'Energía del Día', category: 'barras', emoji: '🌾',
    desc: 'Avena, miel de ulmo, semillas de chía y frutos secos. Energía real sin azúcar refinada.',
    priceUnit: 1500, pricePack4: 5400, pricePack8: 10000,
    badge: 'Más vendida', badgeStyle: '',
    tags: ['energizante', 'alta_fibra'],
    attrs: ['Sin conservantes', 'Artesanal'],
  },
  {
    id: 'bar-cacao', name: 'Cacao Profundo', category: 'barras', emoji: '🍫',
    desc: 'Cacao 70%, avellanas y dátiles. Antioxidantes naturales en cada mordida.',
    priceUnit: 1600, pricePack4: 5760, pricePack8: 10560,
    badge: null, badgeStyle: '',
    tags: ['sin_azucar', 'vegano'],
    attrs: ['Cacao ≥70%', 'Sin azúcar añadida'],
  },
  {
    id: 'bar-frutos', name: 'Frutos del Bosque', category: 'barras', emoji: '🫐',
    desc: 'Arándanos, frambuesas liofilizadas y semillas de linaza. Fresco y nutritivo.',
    priceUnit: 1600, pricePack4: 5760, pricePack8: 10560,
    badge: null, badgeStyle: '',
    tags: ['sin_azucar', 'vegano', 'alta_fibra'],
    attrs: ['Sin azúcar añadida', 'Antioxidante'],
  },
  {
    id: 'bar-tropical', name: 'Tropical Mix', category: 'barras', emoji: '🥭',
    desc: 'Mango, coco rallado y maracuyá deshidratado. Vitamina C en forma de snack.',
    priceUnit: 1500, pricePack4: 5400, pricePack8: 10000,
    badge: '¡Nuevo!', badgeStyle: 'badge-gold',
    tags: ['energizante', 'vegano'],
    attrs: ['Sin fritura', 'Deshidratado natural'],
  },
  {
    id: 'bar-proteica', name: 'Barra Proteica Vainilla', category: 'barras', emoji: '💛',
    desc: 'Proteína vegetal, avena y vainilla natural. 12g de proteína por barra.',
    priceUnit: 1800, pricePack4: 6480, pricePack8: 11880,
    badge: 'Top Fit', badgeStyle: '',
    tags: ['alto_proteina', 'sin_azucar'],
    attrs: ['12g proteína', 'Sin azúcar añadida'],
  },

  /* ─ DULCES SALUDABLES ─ */
  {
    id: 'dulce-brownie', name: 'Brownie Sin Azúcar', category: 'dulces', emoji: '🟫',
    desc: 'Cacao puro, eritritol y nueces. Todo el placer del brownie sin el azúcar.',
    priceUnit: 1700, pricePack4: 6120, pricePack8: 11220,
    badge: 'Sin culpa', badgeStyle: '',
    tags: ['sin_azucar', 'keto'],
    attrs: ['Sin azúcar', 'Apto keto'],
  },
  {
    id: 'dulce-trufas', name: 'Trufas de Coco', category: 'dulces', emoji: '🤍',
    desc: 'Dátiles Medjool, coco rallado y cacao puro. Dulces sin procesar.',
    priceUnit: 1600, pricePack4: 5760, pricePack8: 10560,
    badge: null, badgeStyle: '',
    tags: ['vegano', 'sin_azucar'],
    attrs: ['100% Natural', 'Vegano'],
  },
  {
    id: 'dulce-bolitas', name: 'Bolitas Energéticas', category: 'dulces', emoji: '⚡',
    desc: 'Avena, mantequilla de maní, miel y chips de cacao. El snack perfecto pre-entreno.',
    priceUnit: 1500, pricePack4: 5400, pricePack8: 10000,
    badge: null, badgeStyle: '',
    tags: ['alto_proteina', 'energizante'],
    attrs: ['Pre-entreno', 'Sin aditivos'],
  },

  /* ─ FRUTOS SECOS ─ */
  {
    id: 'frutos-nuez', name: 'Mix Nuez Andina', category: 'frutos', emoji: '🥜',
    desc: 'Nueces, pecanas y almendras tostadas al horno sin aceites añadidos.',
    priceUnit: 1800, pricePack4: 6480, pricePack8: 11880,
    badge: null, badgeStyle: '',
    tags: ['keto', 'vegano', 'alto_proteina'],
    attrs: ['Sin aceites', 'Horneado'],
  },
  {
    id: 'frutos-antioxidante', name: 'Mix Antioxidante', category: 'frutos', emoji: '🍇',
    desc: 'Arándanos deshidratados, almendras, nueces y semillas de calabaza.',
    priceUnit: 1900, pricePack4: 6840, pricePack8: 12540,
    badge: '⭐ Favorito', badgeStyle: 'badge-gold',
    tags: ['sin_azucar', 'vegano'],
    attrs: ['Antioxidante', 'Sin azúcar añadida'],
  },
  {
    id: 'frutos-caju', name: 'Cajú Premium Tostado', category: 'frutos', emoji: '🌰',
    desc: 'Cajú entero tostado sin sal ni aceites. Textura crujiente y sabor suave.',
    priceUnit: 2000, pricePack4: 7200, pricePack8: 13200,
    badge: null, badgeStyle: '',
    tags: ['keto', 'vegano'],
    attrs: ['Sin sal', 'Sin aceites'],
  },

  /* ─ SNACKS CRUJIENTES ─ */
  {
    id: 'snack-chips-coco', name: 'Chips de Coco', category: 'snacks', emoji: '🥥',
    desc: 'Láminas de coco deshidratado con un toque de sal de mar. Crujiente e irresistible.',
    priceUnit: 1600, pricePack4: 5760, pricePack8: 10560,
    badge: null, badgeStyle: '',
    tags: ['keto', 'sin_azucar', 'vegano'],
    attrs: ['Sin fritura', 'Keto'],
  },
  {
    id: 'snack-platano', name: 'Plátano Deshidratado', category: 'snacks', emoji: '🍌',
    desc: 'Rodajas de plátano natural deshidratado. Sin azúcar añadida, sin sulfitos.',
    priceUnit: 1400, pricePack4: 5040, pricePack8: 9240,
    badge: null, badgeStyle: '',
    tags: ['energizante', 'vegano'],
    attrs: ['Sin sulfitos', 'Natural'],
  },
  {
    id: 'snack-mix-horneado', name: 'Mix Snack Horneado', category: 'snacks', emoji: '🫘',
    desc: 'Garbanzos, semillas y hierbas. Crujiente, saciante y sin fritura.',
    priceUnit: 1600, pricePack4: 5760, pricePack8: 10560,
    badge: '¡Nuevo!', badgeStyle: 'badge-gold',
    tags: ['sin_azucar', 'alta_fibra', 'vegano'],
    attrs: ['Sin fritura', 'Alta fibra'],
  },

  /* ─ REPOSTERÍA ARTESANAL ─ */
  {
    id: 'rep-muffin', name: 'Muffin Zanahoria Sin Azúcar', category: 'reposteria', emoji: '🧁',
    desc: 'Zanahoria rallada, canela, nueces y miel de abeja. Sin azúcar refinada.',
    priceUnit: 1800, pricePack4: 6480, pricePack8: 11880,
    badge: null, badgeStyle: '',
    tags: ['sin_azucar', 'alta_fibra'],
    attrs: ['Sin azúcar refinada', 'Artesanal'],
  },
  {
    id: 'rep-galleta', name: 'Galleta Avena Artesanal', category: 'reposteria', emoji: '🍪',
    desc: 'Avena, mantequilla de cacao, chips de cacao y dátiles. Crujiente y nutritiva.',
    priceUnit: 1400, pricePack4: 5040, pricePack8: 9240,
    badge: 'Clásico', badgeStyle: '',
    tags: ['sin_azucar', 'alta_fibra'],
    attrs: ['Sin azúcar añadida', 'Alta fibra'],
  },
  {
    id: 'rep-queque', name: 'Queque de Limón Saludable', category: 'reposteria', emoji: '🍋',
    desc: 'Harina de avena, limón de Pica y eritritol. Húmedo y esponjoso sin culpa.',
    priceUnit: 2000, pricePack4: 7200, pricePack8: 13200,
    badge: null, badgeStyle: '',
    tags: ['sin_azucar'],
    attrs: ['Sin azúcar añadida', 'Artesanal'],
  },

  /* ─ KETO ─ */
  {
    id: 'keto-barra', name: 'Barra Keto Almendra', category: 'keto', emoji: '🥑',
    desc: 'Almendras, aceite de coco, eritritol y cacao. Alta en grasas buenas y low-carb.',
    priceUnit: 2000, pricePack4: 7200, pricePack8: 13200,
    badge: 'Keto ✓', badgeStyle: 'badge-keto',
    tags: ['keto', 'sin_azucar', 'alto_proteina'],
    attrs: ['Low-carb', 'Alto en grasas buenas'],
  },
  {
    id: 'keto-brownie', name: 'Brownie Keto', category: 'keto', emoji: '🟤',
    desc: 'Cacao 85%, harina de almendra y eritritol. El postre keto que realmente satisface.',
    priceUnit: 1900, pricePack4: 6840, pricePack8: 12540,
    badge: 'Keto ✓', badgeStyle: 'badge-keto',
    tags: ['keto', 'sin_azucar'],
    attrs: ['Low-carb', 'Sin gluten'],
  },
  {
    id: 'keto-galleta', name: 'Galleta Keto Chocochip', category: 'keto', emoji: '🍪',
    desc: 'Harina de almendra, mantequilla, eritritol y chips de cacao sin azúcar.',
    priceUnit: 1700, pricePack4: 6120, pricePack8: 11220,
    badge: 'Keto ✓', badgeStyle: 'badge-keto',
    tags: ['keto', 'sin_azucar'],
    attrs: ['Sin gluten', 'Low-carb'],
  },

  /* ─ FUNCIONAL / FIT ─ */
  {
    id: 'fit-barra-cacao', name: 'Barra Fit Cacao & Proteína', category: 'funcional', emoji: '💪',
    desc: 'Proteína vegetal de guisante, cacao 70% y avena. 15g de proteína por barra.',
    priceUnit: 2000, pricePack4: 7200, pricePack8: 13200,
    badge: '15g Proteína', badgeStyle: '',
    tags: ['alto_proteina', 'energizante', 'sin_azucar'],
    attrs: ['15g proteína', 'Pre/post entreno'],
  },
  {
    id: 'fit-mix-fibra', name: 'Mix Saciante Alta Fibra', category: 'funcional', emoji: '🌾',
    desc: 'Psyllium, semillas de chía, linaza y frutos secos. Máxima saciedad natural.',
    priceUnit: 1800, pricePack4: 6480, pricePack8: 11880,
    badge: null, badgeStyle: '',
    tags: ['alta_fibra', 'vegano', 'keto'],
    attrs: ['Alta fibra', 'Saciante'],
  },

  /* ─ MANTEQUILLAS NATURALES ─ */
  {
    id: 'mant-mani', name: 'Mantequilla de Maní Natural', category: 'mantequillas', emoji: '🫙',
    desc: 'Maní tostado 100% sin azúcar, sal ni aceite añadido. Solo maní, todo el sabor.',
    priceUnit: 3500, pricePack4: 12600, pricePack8: 23100,
    badge: 'Sin aditivos', badgeStyle: '',
    tags: ['alto_proteina', 'sin_azucar', 'vegano'],
    attrs: ['100% maní', 'Sin azúcar añadida'],
  },
  {
    id: 'mant-almendra', name: 'Mantequilla de Almendra', category: 'mantequillas', emoji: '🤎',
    desc: 'Almendras tostadas al horno, sin aditivos. Rica en vitamina E y magnesio.',
    priceUnit: 4500, pricePack4: 16200, pricePack8: 29700,
    badge: 'Premium', badgeStyle: 'badge-gold',
    tags: ['keto', 'sin_azucar', 'alto_proteina'],
    attrs: ['Keto', 'Sin azúcar añadida'],
  },
  {
    id: 'mant-caju', name: 'Mantequilla de Cajú', category: 'mantequillas', emoji: '🌰',
    desc: 'Cajú premium tostado, textura cremosa natural. La más suave de todas.',
    priceUnit: 5000, pricePack4: 18000, pricePack8: 33000,
    badge: null, badgeStyle: '',
    tags: ['keto', 'sin_azucar', 'vegano'],
    attrs: ['Cremosa', 'Sin azúcar añadida'],
  },

  /* ─ GRANOLAS Y DESAYUNOS ─ */
  {
    id: 'gran-artesanal', name: 'Granola Artesanal Sin Azúcar', category: 'granolas', emoji: '🌿',
    desc: 'Avena horneada con miel de ulmo, quinoa y semillas de maravilla. Crujiente natural.',
    priceUnit: 2000, pricePack4: 7200, pricePack8: 13200,
    badge: null, badgeStyle: '',
    tags: ['sin_azucar', 'alta_fibra'],
    attrs: ['Sin azúcar añadida', 'Horneada'],
  },
  {
    id: 'gran-keto', name: 'Granola Keto', category: 'granolas', emoji: '🥥',
    desc: 'Coco rallado, nueces, almendras y semillas. Sin granos, sin azúcar, 100% keto.',
    priceUnit: 2200, pricePack4: 7920, pricePack8: 14520,
    badge: 'Keto ✓', badgeStyle: 'badge-keto',
    tags: ['keto', 'sin_azucar', 'vegano'],
    attrs: ['Sin granos', 'Low-carb'],
  },
  {
    id: 'gran-avena-semillas', name: 'Avena con Semillas', category: 'granolas', emoji: '🫘',
    desc: 'Avena laminada, chía, linaza y semillas de girasol. El desayuno más completo.',
    priceUnit: 1800, pricePack4: 6480, pricePack8: 11880,
    badge: null, badgeStyle: '',
    tags: ['alta_fibra', 'vegano'],
    attrs: ['Alta fibra', 'Omega 3'],
  },

  /* ─ SUPERFOODS ─ */
  {
    id: 'super-cacao', name: 'Cacao Puro en Polvo', category: 'superfoods', emoji: '🍫',
    desc: 'Cacao 100% puro, sin azúcar ni lecitina. Máxima concentración de antioxidantes.',
    priceUnit: 3000, pricePack4: 10800, pricePack8: 19800,
    badge: '100% Puro', badgeStyle: '',
    tags: ['sin_azucar', 'vegano', 'keto'],
    attrs: ['Sin azúcar', 'Antioxidante'],
  },
  {
    id: 'super-chia-linaza', name: 'Mix Chía y Linaza', category: 'superfoods', emoji: '✨',
    desc: 'Chía y linaza dorada en partes iguales. Omega 3, fibra soluble e insoluble.',
    priceUnit: 2500, pricePack4: 9000, pricePack8: 16500,
    badge: null, badgeStyle: '',
    tags: ['alta_fibra', 'vegano', 'keto'],
    attrs: ['Omega 3', 'Alta fibra'],
  },
  {
    id: 'super-proteina', name: 'Proteína Vegetal Natural', category: 'superfoods', emoji: '💚',
    desc: 'Mezcla de proteína de guisante y arroz integral. Perfil aminoácido completo.',
    priceUnit: 4000, pricePack4: 14400, pricePack8: 26400,
    badge: 'Vegana', badgeStyle: '',
    tags: ['alto_proteina', 'vegano', 'sin_azucar'],
    attrs: ['Proteína completa', 'Vegano'],
  },

  /* ─ PACKS Y COMBOS ─ */
  {
    id: 'pack-degustacion', name: 'Pack Degustación (6 barras)', category: 'packs', emoji: '📦',
    desc: '6 barras surtidas a elección: energía, cacao, frutos del bosque y más. Ideal para probar.',
    priceUnit: 8500, pricePack4: 30600, pricePack8: 56100,
    badge: 'Elige tú', badgeStyle: 'badge-gold',
    tags: ['energizante'],
    attrs: ['6 sabores', 'Personalizable'],
  },
  {
    id: 'pack-keto-semanal', name: 'Pack Keto Semanal', category: 'packs', emoji: '🥑',
    desc: 'Surtido semanal keto: barras, galletas, chips y snack. Todo lo que necesitas.',
    priceUnit: 12000, pricePack4: 43200, pricePack8: 79200,
    badge: 'Keto ✓', badgeStyle: 'badge-keto',
    tags: ['keto', 'sin_azucar'],
    attrs: ['7 productos', 'Keto garantizado'],
  },
  {
    id: 'pack-proteico', name: 'Pack Proteico Fit', category: 'packs', emoji: '💪',
    desc: 'Barras proteicas, mantequilla de maní y mix funcional. Semana de entrenamiento cubierta.',
    priceUnit: 11000, pricePack4: 39600, pricePack8: 72600,
    badge: 'Top Ventas', badgeStyle: '',
    tags: ['alto_proteina', 'sin_azucar', 'energizante'],
    attrs: ['Alto en proteína', 'Pre/post entreno'],
  },
];

const WHATSAPP_NUMBER = '56950147783';

/* ── HERO IMAGES (filesystem-based) ─────────────────────── */
const HERO_IMAGES = [
  'images/hero/1.jpg',
  'images/hero/2.jpg',
  'images/hero/3.jpg',
];

/* ── ADMIN STATE (DataLayer) ────────────────────────────── */
const AdminState = {
  _d: {
    products: null,
    deliveryMethods: { retiro: false, delivery: true },
    paymentMethods: { transferencia: true, efectivo: false, tarjeta: false },
    content: {
      heroTitle: 'Snacks que\nte hacen bien',
      heroSub: '',
      heroTag: '100% Artesanal · Sin conservantes',
    },
  },

  load() {
    const config = DataLayer.config.get();
    if (config.deliveryMethods) Object.assign(this._d.deliveryMethods, config.deliveryMethods);
    if (config.content) Object.assign(this._d.content, config.content);
    this._d.products = DataLayer.products.getActive();
  },

  save() {
    DataLayer.config.update({
      deliveryMethods: this._d.deliveryMethods,
      content: this._d.content,
    });
  },

  get(k)    { return this._d[k]; },
  set(k, v) { this._d[k] = v; this.save(); },
};

function getProducts() {
  return AdminState.get('products') || BASE_PRODUCTS;
}

/* ── STATE ──────────────────────────────────────────────── */
const State = {
  currentView: 'intro',
  cart: [],
  selectedProduct: null,
  selectedType: 'unit',
  selectedQty: 1,
  searchQuery: '',
  activeCategory: 'todos',
  activeTag: null,          // single active filter tag
  checkoutMethod: 'delivery',
};

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = (n) => `$${n.toLocaleString('es-CL')}`;

function cartTotal()    { return State.cart.reduce((s, i) => s + i.priceTotal, 0); }
function cartUnits()    { return State.cart.reduce((s, i) => s + i.units, 0); }
function deliveryFree() { return cartTotal() >= DELIVERY_FREE_THRESHOLD; }
function findCartItem(id, type) { return State.cart.find(i => i.id === id && i.type === type); }

function getPackInfo(product, type) {
  const map = {
    unit:  { units: 1, price: product.priceUnit,  label: '1 unidad' },
    pack4: { units: 4, price: product.pricePack4, label: 'Pack x4' },
    pack8: { units: 8, price: product.pricePack8, label: 'Pack x8' },
  };
  return map[type] || map.unit;
}

function saveDiscount(type, product) {
  if (type === 'pack4') return Math.round((1 - product.pricePack4 / (product.priceUnit * 4)) * 100);
  if (type === 'pack8') return Math.round((1 - product.pricePack8 / (product.priceUnit * 8)) * 100);
  return 0;
}

function getProductFirstImage(productId) {
  return `images/productos/${productId}/1.jpg`;
}

function getRelatedProducts(product, limit = 4) {
  const all = getProducts();
  return all
    .filter(p => p.id !== product.id && (
      p.category === product.category ||
      (p.tags && product.tags && p.tags.some(t => product.tags.includes(t)))
    ))
    .slice(0, limit);
}

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg, icon = '✓') {
  $$('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

/* ── CART ENGINE ─────────────────────────────────────────── */
const Cart = {
  add(product, type, qty = 1) {
    const info = getPackInfo(product, type);
    const existing = findCartItem(product.id, type);
    if (existing) {
      existing.qty += qty;
      existing.units = existing.qty * info.units;
      existing.priceTotal = existing.qty * info.price;
    } else {
      State.cart.push({
        id: product.id,
        name: product.name,
        emoji: product.emoji,
        type,
        typeLabel: info.label,
        qty,
        units: qty * info.units,
        priceUnit: info.price,
        priceTotal: qty * info.price,
      });
    }
    Cart._persist();
    Cart.refreshBadge();
  },

  remove(id, type) {
    State.cart = State.cart.filter(i => !(i.id === id && i.type === type));
    Cart._persist();
    Cart.refreshBadge();
  },

  changeQty(id, type, delta) {
    const item = findCartItem(id, type);
    if (!item) return;
    const info = getPackInfo(getProducts().find(p => p.id === id), type);
    item.qty = Math.max(1, item.qty + delta);
    item.units = item.qty * info.units;
    item.priceTotal = item.qty * item.priceUnit;
    Cart._persist();
    Cart.refreshBadge();
  },

  clear() {
    State.cart = [];
    Cart._persist();
    Cart.refreshBadge();
  },

  _persist() {
    DataLayer.cart.save(State.cart);
  },

  refreshBadge() {
    const count = State.cart.reduce((s, i) => s + i.qty, 0);
    const badge = $('#cart-badge-nav');
    const footCount = $('#foot-cart-count');
    if (badge)     { badge.textContent = count; badge.classList.toggle('hidden', count === 0); }
    if (footCount) { footCount.textContent = count; footCount.classList.toggle('hidden', count === 0); }
  },
};

/* ── GLITTER PARTICLES ───────────────────────────────────── */
function spawnGlitter(targetEl) {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const spark = document.createElement('div');
      spark.className = 'glitter-spark';
      const size = 4 + Math.random() * 6;
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height * 0.6;
      const dur = 900 + Math.random() * 800;
      spark.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;animation-duration:${dur}ms;opacity:1;`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), dur + 100);
    }, i * 60);
  }
}

function startGlitterRain(targetEl) {
  if (!targetEl) return;
  let running = true;
  const loop = () => {
    if (!running || !document.body.contains(targetEl)) return;
    spawnGlitter(targetEl);
    setTimeout(loop, 1600);
  };
  loop();
  document.addEventListener('navigated', () => { running = false; }, { once: true });
}

function buildGlitterOverlay() {
  const positions = [
    { top:'8%',left:'12%',cls:'md' },{ top:'18%',left:'72%',cls:'sm' },
    { top:'30%',left:'35%',cls:'lg' },{ top:'45%',left:'88%',cls:'sm' },
    { top:'55%',left:'22%',cls:'sm' },{ top:'65%',left:'60%',cls:'md' },
    { top:'75%',left:'45%',cls:'sm' },{ top:'85%',left:'80%',cls:'lg' },
    { top:'12%',left:'55%',cls:'sm' },{ top:'40%',left:'8%',cls:'md' },
    { top:'92%',left:'30%',cls:'sm' },{ top:'70%',left:'15%',cls:'sm' },
  ];
  return `<div class="glitter-overlay">${
    positions.map(p => `<div class="gl-dot ${p.cls}" style="top:${p.top};left:${p.left}"></div>`).join('')
  }</div>`;
}

/* ── VIEWS ───────────────────────────────────────────────── */
const Views = {

  /* ── INTRO ─────────────────────────────── */
  intro() {
    return `
    <div class="view intro-view active" id="view-intro">
      <video class="intro-video" autoplay muted loop playsinline>
        <source src="videos/intro.mp4" type="video/mp4">
      </video>
      <div class="intro-logo-wrap">
        <img src="images/logo.png" alt="Logo"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <span style="display:none;font-size:2.8rem;justify-content:center;align-items:center">🌿</span>
      </div>
      <div class="intro-tag-anim">
        <span id="intro-tag-word">✨ Snacks Saludables</span>
      </div>
      <h1 class="intro-title" id="intro-title">Círculo<br>de Sabores</h1>
      <p class="intro-subtitle typewriter-cursor" id="intro-subtitle"></p>
      <div class="intro-pills">
        <span class="intro-pill">
          <i class="fa-solid fa-star pill-icon" style="color:var(--gold)"></i>
          <strong>Alto en proteína</strong>
        </span>
        <span class="intro-pill">
          <i class="fa-solid fa-truck pill-icon" style="color:var(--accent)"></i>
          <strong>Delivery gratis +$20.000</strong>
        </span>
        <span class="intro-pill">
          <i class="fa-solid fa-tag pill-icon" style="color:var(--success)"></i>
          <strong>Descuento en packs</strong>
        </span>
        <span class="intro-pill">
          <i class="fa-solid fa-wand-magic-sparkles pill-icon" style="color:var(--primary)"></i>
          <strong>Pedidos personalizados</strong>
        </span>
      </div>
      <button class="btn-ver-productos" id="btn-ver-productos" onclick="App.animateIntroBtn()">
        <i class="fa-solid fa-store" id="btn-store-icon"></i>
        <span id="btn-ver-text">Ver productos</span>
      </button>
    </div>`;
  },

  /* ── HOME ──────────────────────────────── */
  home() {
    const total = cartTotal();
    const isFree = deliveryFree();
    const remaining = Math.max(0, DELIVERY_FREE_THRESHOLD - total);
    const progress = Math.min(100, (total / DELIVERY_FREE_THRESHOLD) * 100);
    const products = getProducts();
    const content = AdminState.get('content');

    const filtered = products.filter(p => {
      const matchCat = State.activeCategory === 'todos' || p.category === State.activeCategory;
      const matchTag = !State.activeTag || (p.tags && p.tags.includes(State.activeTag));
      const matchSearch = !State.searchQuery ||
        p.name.toLowerCase().includes(State.searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(State.searchQuery.toLowerCase());
      return matchCat && matchTag && matchSearch;
    });

    /* Category filter pills — horizontal scroll */
    const catCols = CATEGORIES.slice(1); // all except 'todos'
    const categoryBtns = `
      <button class="filter-btn ${State.activeCategory === 'todos' ? 'active' : ''}"
              onclick="App.setCategory('todos')">Todos</button>
      ${catCols.map(c => {
        const meta = CATEGORY_META[c];
        return `<button class="filter-btn ${State.activeCategory === c ? 'active' : ''}"
                        onclick="App.setCategory('${c}')">
          <span class="filter-emoji">${meta.emoji}</span> ${meta.label}
        </button>`;
      }).join('')}`;

    /* Tag filter pills */
    const tagBtns = Object.entries(TAGS).map(([key, tag]) =>
      `<button class="tag-filter-btn ${State.activeTag === key ? 'active' : ''}"
               data-tag="${key}"
               onclick="App.toggleTag('${key}')"
               style="--tag-color:${tag.color}">
        ${tag.icon} ${tag.label}
       </button>`
    ).join('');

    const cards = filtered.length > 0
      ? filtered.map(p => Views._productCard(p)).join('')
      : `<div class="no-results">
           <i class="fa-solid fa-magnifying-glass"></i>
           <p>Sin resultados${State.searchQuery ? ` para "<strong>${State.searchQuery}</strong>"` : ' para este filtro'}</p>
           <button class="btn-ghost" onclick="App.clearFilters()">Limpiar filtros</button>
         </div>`;

    const heroTitleHtml = 'Personaliza tus<br>snacks favoritos';
    const config = DataLayer.config.get();

    return `
    <div class="view home-view active" id="view-home">

      <!-- HERO con VIDEO -->
      <div class="hero has-video" id="hero-section">
        <video class="hero-bg-video" autoplay muted playsinline preload="none" id="hero-video">
          <source src="videos/productospersonalizados.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-tag">
            <i class="fa-solid fa-leaf" style="color:#fff"></i>
            <span>${content.heroTag || '100% Artesanal · Sin conservantes'}</span>
          </div>
          <h1 class="hero-title">${heroTitleHtml}</h1>
          <div class="hero-cta">
            <button class="btn-glass" onclick="App.navigate('encargos')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Personaliza
            </button>
          </div>
        </div>
      </div>

      <!-- VALOR STRIP (marquee) -->
      <div class="valor-strip-outer">
        <div class="valor-strip-inner" id="valor-strip-inner">
          <div class="valor-item"><i class="fa-solid fa-seedling"></i> Ingredientes naturales</div>
          <div class="valor-item"><i class="fa-solid fa-box-open"></i> Packs con descuento</div>
          <div class="valor-item"><i class="fa-solid fa-heart"></i> Hecho con amor</div>
          <div class="valor-item"><i class="fa-solid fa-ban"></i> Sin conservantes</div>
          <div class="valor-item"><i class="fa-solid fa-rotate"></i> Pedidos personalizados</div>
          <div class="valor-item"><i class="fa-solid fa-seedling"></i> Ingredientes naturales</div>
          <div class="valor-item"><i class="fa-solid fa-box-open"></i> Packs con descuento</div>
          <div class="valor-item"><i class="fa-solid fa-heart"></i> Hecho con amor</div>
          <div class="valor-item"><i class="fa-solid fa-ban"></i> Sin conservantes</div>
          <div class="valor-item"><i class="fa-solid fa-rotate"></i> Pedidos personalizados</div>
        </div>
      </div>

      <!-- DELIVERY PROGRESS BANNER -->
      <div class="delivery-banner ${isFree ? 'unlocked' : ''}">
        <div class="db-icon-wrap">
          <i class="fa-solid fa-${isFree ? 'circle-check' : 'truck'}"></i>
        </div>
        <div class="db-right">
          <div class="db-text">
            ${isFree
              ? `<strong>¡Delivery gratis activado! 🎉</strong> Tu pedido supera los <strong class="delivery-highlight">$${(DELIVERY_FREE_THRESHOLD/1000).toFixed(0)}.000</strong>`
              : `Agrega <strong>$${remaining.toLocaleString('es-CL')} más</strong> y activa el delivery gratis`
            }
          </div>
          <div class="db-progress-track">
            <div class="db-progress-fill" style="width:${progress}%"></div>
          </div>
          <div class="db-progress-label">$${total.toLocaleString('es-CL')} / <strong class="delivery-highlight">$${(DELIVERY_FREE_THRESHOLD/1000).toFixed(0)}.000</strong></div>
          <div class="delivery-zones-inline">
            <button class="dz-toggle-inline" onclick="this.parentElement.querySelector('.dz-list-inline').classList.toggle('open')">
              <i class="fa-solid fa-location-dot"></i> Ver zonas
              <i class="fa-solid fa-chevron-down dz-arrow"></i>
            </button>
            <div class="dz-list-inline">
              ${(config.deliveryZones || []).filter(z => z.active).map(z => `
                <div class="dz-item"><span>${z.name}</span><span>${z.price === 0 ? 'Gratis' : fmt(z.price)}</span></div>
              `).join('')}
              <div class="dz-item dz-retiro"><span>🏪 Retiro en tienda</span><span>Gratis</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- BÚSQUEDA + CATEGORÍAS -->
      <div class="search-wrap">
        <div class="search-inner">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="search-input" placeholder="Buscar producto..."
                 id="search-input" value="${State.searchQuery}"
                 oninput="App.onSearch(this.value)" />
          <button class="search-clear" id="search-clear" onclick="App.clearSearch()"
                  style="display:${State.searchQuery ? 'flex' : 'none'}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- CATEGORÍAS -->
      <div class="filters-wrap cat-filters" id="cat-filters">${categoryBtns}</div>

      <!-- TAGS RÁPIDOS -->
      <div class="tag-filters-wrap" id="tag-filters-wrap">${tagBtns}</div>

      <!-- SECCIÓN LABEL -->
      <div class="section-label-row" id="section-label-row">
        <span class="section-label">
          ${State.activeCategory !== 'todos' ? CATEGORY_META[State.activeCategory]?.label || 'Catálogo' : 'Catálogo'}
        </span>
        <span class="section-count" id="section-count">${filtered.length} producto${filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <!-- GRID -->
      <div class="products-grid" id="products-grid">${cards}</div>

      <!-- SECCIÓN PRODUCTOS PERSONALIZADOS -->
      <div id="custom-section-wrap">${State.activeCategory === 'todos' ? Views._customSection() : ''}</div>

      <!-- PACKS DESTACADOS -->
      <div id="packs-section-wrap">${State.activeCategory === 'todos' ? Views._packSection() : ''}</div>

      <!-- TESTIMONIOS -->
      <div id="testimonials-wrap">${State.activeCategory === 'todos' ? Views._testimonialsSection() : ''}</div>

      <!-- FAQ -->
      <div id="faq-wrap">${State.activeCategory === 'todos' ? Views._faqSection() : ''}</div>

    </div>`;
  },

  _testimonialsSection() {
    const testimonials = DataLayer.testimonials.getAll();
    return `
    <div class="testimonials-section">
      <h3 class="test-title">Lo que dicen nuestros clientes</h3>
      <div class="test-scroll">
        ${testimonials.map(t => `
          <div class="test-card">
            <div class="test-stars">${Array.from({length: 5}, (_, i) => `<span class="star${i < t.stars ? '' : ' empty'}">★</span>`).join('')}</div>
            <div class="test-text">"${t.text}"</div>
            <div class="test-author">${t.name}, ${t.location}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  },

  _faqSection() {
    const cfg = DataLayer.config.get();
    return `
    <div class="faq-section">
      <h3 class="faq-title">Preguntas Frecuentes</h3>
      ${(cfg.faq || []).map((item, i) => `
        <div class="faq-item" onclick="this.classList.toggle('open')">
          <div class="faq-q">${item.q} <i class="fa-solid fa-chevron-down"></i></div>
          <div class="faq-a">${item.a}</div>
        </div>
      `).join('')}
    </div>`;
  },

  _productCard(p) {
    const disc4 = saveDiscount('pack4', p);
    const imgPath = getProductFirstImage(p.id);
    const isFav = DataLayer.favorites.has(p.id);
    const imgContent = `<img src="${imgPath}" alt="${p.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
      <div class="card-img-fallback" style="display:none">
        <img src="images/logo.png" class="fallback-logo" alt="" />
        <div class="fallback-beige-overlay"></div>
        <span class="fallback-nophoto">Cargando</span>
      </div>`;

    const tagPills = (p.tags || []).slice(0, 2).map(t => {
      const tag = TAGS[t];
      if (!tag) return '';
      return `<span class="card-tag-pill" style="--tag-color:${tag.color}">${tag.icon} ${tag.label}</span>`;
    }).join('');

    return `
    <div class="product-card" onclick="App.openProduct('${p.id}')">
      ${p.badge ? `<span class="card-badge ${p.badgeStyle || ''}">${p.badge}</span>` : ''}
      <div class="card-img-placeholder">
        ${imgContent}
        <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); App.toggleFav('${p.id}', this)" aria-label="Favorito">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <button class="card-share-btn" onclick="event.stopPropagation(); App.shareProduct('${p.id}', this)" aria-label="Compartir">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        ${tagPills ? `<div class="card-tags">${tagPills}</div>` : ''}
        <div class="card-desc">${p.desc.substring(0, 52)}…</div>
        <div class="card-pricing">
          <div class="card-price-unit">Unidad <span>${fmt(p.priceUnit)}</span></div>
          ${disc4 > 0 ? `<div class="card-price-pack"><i class="fa-solid fa-tag"></i> Pack x4 (−${disc4}%)</div>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-card-detail" onclick="event.stopPropagation(); App.openProduct('${p.id}')">
            Ver más
          </button>
          <button class="btn-card-add" onclick="event.stopPropagation(); App.quickAdd('${p.id}')">
            <i class="fa-solid fa-plus"></i> Pack 4
          </button>
        </div>
      </div>
    </div>`;
  },

  _customSection() {
    return `
    <div class="custom-section">
      <video class="custom-video" autoplay muted loop playsinline preload="none">
        <source src="videos/productospersonalizados.mp4" type="video/mp4">
      </video>
      <div class="custom-overlay"></div>
      <div class="custom-content">
        <span class="custom-eyebrow">¿Algo especial?</span>
        <h3 class="custom-title">Productos<br>Personalizados</h3>
        <p class="custom-sub">Dinos tu idea y lo hacemos realidad. Cantidades a tu medida, sabores exclusivos.</p>
        <button class="custom-cta-btn" onclick="App.navigate('encargos')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Hacer un encargo
        </button>
      </div>
    </div>`;
  },

  _packSection() {
    const products = getProducts();
    const p1 = products[0];
    if (!p1) return '';
    return `
    <div class="packs-section">
      <p class="packs-title">Packs más populares</p>
      <div class="packs-grid">
        <button class="pack-card" onclick="App.openProduct('${p1.id}', 'pack4')">
          ${buildGlitterOverlay()}
          <div class="pack-qty">Pack x4</div>
          <div class="pack-name">${p1.name}</div>
          <div class="pack-price">${fmt(p1.pricePack4)}</div>
          <div class="pack-save">Ahorra ${fmt(p1.priceUnit * 4 - p1.pricePack4)}</div>
          <div class="pack-cta"><i class="fa-solid fa-cart-plus"></i> Agregar</div>
        </button>
        <button class="pack-card pack-8" onclick="App.openProduct('${p1.id}', 'pack8')">
          ${buildGlitterOverlay()}
          <div class="pack-qty">Pack x8 🚚 Delivery</div>
          <div class="pack-name">${p1.name}</div>
          <div class="pack-price">${fmt(p1.pricePack8)}</div>
          <div class="pack-save">Ahorra ${fmt(p1.priceUnit * 8 - p1.pricePack8)}</div>
          <div class="pack-cta"><i class="fa-solid fa-bolt"></i> Mejor precio</div>
        </button>
      </div>
    </div>`;
  },

  /* ── PRODUCTO ──────────────────────────── */
  producto() {
    const p = State.selectedProduct;
    if (!p) return Views.home();

    const type  = State.selectedType;
    const qty   = State.selectedQty;
    const info  = getPackInfo(p, type);
    const total = info.price * qty;
    const disc4 = saveDiscount('pack4', p);
    const disc8 = saveDiscount('pack8', p);

    const imgPath = getProductFirstImage(p.id);
    const heroContent = `<img src="${imgPath}" alt="${p.name}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
      <div class="card-img-fallback" style="display:none;width:100%;height:100%">
        <img src="images/logo.png" class="fallback-logo fallback-logo-lg" alt="" />
        <div class="fallback-beige-overlay"></div>
        <span class="fallback-nophoto">Cargando</span>
      </div>`;

    const typeBtn = (t, label, qtyLabel, price, save) =>
      `<div class="type-btn ${type === t ? 'selected' : ''}" onclick="App.selectType('${t}')">
        <div class="tb-label">${label}</div>
        <div class="tb-qty">${qtyLabel}</div>
        <div class="tb-price">${fmt(price)}</div>
        ${save ? `<div class="tb-save">−${save}%</div>` : ''}
       </div>`;

    /* Attributes */
    const attrPills = (p.attrs || []).map(a =>
      `<span class="product-attr-pill">${a}</span>`
    ).join('');

    /* Tags */
    const tagChips = (p.tags || []).map(t => {
      const tag = TAGS[t];
      if (!tag) return '';
      return `<span class="product-tag-chip" style="--tag-color:${tag.color}">${tag.icon} ${tag.label}</span>`;
    }).join('');

    /* Cross-sell */
    const related = getRelatedProducts(p, 4);
    const crossSell = related.length > 0 ? `
      <div class="cross-sell-section">
        <div class="cross-sell-title">También te puede gustar</div>
        <div class="cross-sell-grid">
          ${related.map(r => {
            const rImg = getProductFirstImage(r.id);
            return `<button class="cross-sell-card" onclick="App.openProduct('${r.id}')">
              <div class="cs-card-img">
                <img src="${rImg}" alt="${r.name}"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                <span style="display:none;font-size:1.4rem">${r.emoji}</span>
              </div>
              <div class="cs-card-name">${r.name}</div>
              <div class="cs-card-price">${fmt(r.priceUnit)}</div>
            </button>`;
          }).join('')}
        </div>
      </div>` : '';

    return `
    <div class="view producto-view active" id="view-producto">
      <div class="product-detail-header">
        <button class="btn-back" onclick="App.navigate('home')">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h2>${p.name}</h2>
      </div>
      <div class="product-hero-img">${heroContent}</div>
      <div class="product-info">
        <div class="product-meta-row">
          <span class="product-category-tag">${CATEGORY_META[p.category]?.emoji || ''} ${CATEGORY_META[p.category]?.label || p.category}</span>
          ${tagChips}
        </div>
        <h1 class="product-name">${p.name}</h1>
        ${attrPills ? `<div class="product-attrs">${attrPills}</div>` : ''}
        <p class="product-desc">${p.desc}</p>
        <div class="type-selector">
          ${typeBtn('unit',  'Unidad', '1 ud.',  p.priceUnit,  0)}
          ${typeBtn('pack4', 'Pack',   '4 uds.', p.pricePack4, disc4)}
          ${typeBtn('pack8', 'Pack',   '8 uds.', p.pricePack8, disc8)}
        </div>

        <!-- DELIVERY HINT -->
        ${(() => {
          const t = cartTotal();
          const remaining = Math.max(0, DELIVERY_FREE_THRESHOLD - t);
          if (deliveryFree()) {
            return `<div class="product-delivery-hint unlocked">
              <i class="fa-solid fa-circle-check"></i> ¡Delivery gratis activado! Tu pedido supera los $${(DELIVERY_FREE_THRESHOLD/1000).toFixed(0)}.000.
            </div>`;
          } else {
            return `<div class="product-delivery-hint">
              <i class="fa-solid fa-truck"></i> Agrega $${remaining.toLocaleString('es-CL')} más para activar el delivery gratis.
            </div>`;
          }
        })()}

        <div class="counter-row">
          <span class="counter-label">Cantidad</span>
          <div class="counter">
            <button class="counter-btn" onclick="App.changeQty(-1)">−</button>
            <span class="counter-val" id="qty-val">${qty}</span>
            <button class="counter-btn" onclick="App.changeQty(1)">+</button>
          </div>
        </div>
        <button class="btn-add-full" onclick="App.addToCart()">
          <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito — ${fmt(total)}
        </button>
      </div>

      ${crossSell}
    </div>`;
  },

  /* ── CARRITO ───────────────────────────── */
  carrito() {
    if (State.cart.length === 0) {
      return `
      <div class="view carrito-view active" id="view-carrito">
        <div class="view-header"><h2>Mi Carrito</h2></div>
        <div class="cart-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Tu carrito está vacío.<br>¡Agrega algo rico!</p>
          <button class="btn-primary" onclick="App.navigate('home')">
            <i class="fa-solid fa-store"></i> Ver productos
          </button>
        </div>
      </div>`;
    }

    const units    = cartUnits();
    const isFree   = deliveryFree();
    const total    = cartTotal();
    const remaining = Math.max(0, DELIVERY_FREE_THRESHOLD - total);
    const progress = Math.min(100, (total / DELIVERY_FREE_THRESHOLD) * 100);
    const subtotal = total;

    const items = State.cart.map(item => {
      const imgPath = getProductFirstImage(item.id);
      return `
      <div class="cart-item">
        <div class="cart-item-emoji">
          <img src="${imgPath}" alt="${item.name}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <span style="display:none">${item.emoji}</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-type">${item.typeLabel}</div>
          <div class="cart-item-controls">
            <div class="cart-counter">
              <button class="cc-btn" onclick="App.cartChangeQty('${item.id}','${item.type}',-1)">−</button>
              <span class="cc-val">${item.qty}</span>
              <button class="cc-btn" onclick="App.cartChangeQty('${item.id}','${item.type}',1)">+</button>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <button class="btn-remove" onclick="App.cartRemove('${item.id}','${item.type}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <span class="cart-item-price">${fmt(item.priceTotal)}</span>
        </div>
      </div>`;
    }).join('');

    /* Progress bar delivery indicator */
    const deliverySection = isFree
      ? `<div class="cart-delivery-unlocked">
           <i class="fa-solid fa-circle-check"></i>
           <span>¡Delivery gratis activado! Tu pedido supera los $${(DELIVERY_FREE_THRESHOLD/1000).toFixed(0)}.000.</span>
         </div>`
      : `<div class="cart-delivery-progress">
           <div class="cdp-header">
             <span class="cdp-text">Agrega <strong>$${remaining.toLocaleString('es-CL')}</strong> más para delivery gratis</span>
             <span class="cdp-fraction">$${total.toLocaleString('es-CL')}/$${(DELIVERY_FREE_THRESHOLD/1000).toFixed(0)}k</span>
           </div>
           <div class="cart-progress-bar">
             <div class="cart-progress-fill" style="width:${progress}%"></div>
           </div>
         </div>`;

    return `
    <div class="view carrito-view active" id="view-carrito">
      <div class="view-header"><h2>Mi Carrito</h2></div>
      ${deliverySection}
      <div class="cart-items">${items}</div>
      <div class="cart-summary">
        <div class="summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${isFree ? '🚚 Gratis' : 'A coordinar'}</span></div>
        <div class="summary-row total"><span>Total</span><span>${fmt(subtotal)}</span></div>
      </div>
      <button class="cart-checkout-btn mt-16" onclick="App.navigate('checkout')">
        <i class="fa-solid fa-credit-card"></i> Proceder al pago
      </button>
      <div class="cart-policies">
        🔒 Pago seguro. Aceptamos transferencia bancaria. El pedido se confirma por WhatsApp.
        Delivery gratis en compras sobre $20.000. Precios en CLP.
      </div>
    </div>`;
  },

  /* ── CHECKOUT ──────────────────────────── */
  checkout() {
    if (State.cart.length === 0) { App.navigate('carrito'); return ''; }
    const isFree   = deliveryFree();
    const subtotal = cartTotal();
    const dm = AdminState.get('deliveryMethods');
    const coupon = State.appliedCoupon || null;
    const discount = coupon ? App._calcDiscount(subtotal, coupon) : 0;
    const finalTotal = subtotal - discount;

    const csItems = State.cart.map(i =>
      `<div class="cs-item">
        <span class="cs-item-name">${i.emoji} ${i.name} (${i.typeLabel} ×${i.qty})</span>
        <span class="cs-item-price">${fmt(i.priceTotal)}</span>
       </div>`
    ).join('');

    const retiroUnavailable   = !dm.retiro;
    const deliveryUnavailable = !dm.delivery;

    return `
    <div class="view checkout-view active" id="view-checkout">
      <div class="view-header" style="justify-content:flex-start">
        <button class="btn-back" onclick="App.navigate('carrito')">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h2 style="margin-left:8px">Checkout</h2>
      </div>

      <div class="checkout-form pb-safe">
        <div class="field-group">
          <label class="field-label">
            <i class="fa-solid fa-user"></i> Nombre completo <span class="field-required">*</span>
          </label>
          <input type="text" id="ch-nombre" class="field-input"
                 placeholder="Ej: María González" autocomplete="name" />
          <span class="error-msg" id="err-nombre">Ingresa tu nombre</span>
        </div>

        <div class="field-group">
          <label class="field-label">
            <i class="fa-solid fa-location-dot"></i> Método de entrega <span class="field-required">*</span>
          </label>
          <div class="method-selector">
            <div class="method-opt ${State.checkoutMethod === 'retiro' ? 'selected' : ''} ${retiroUnavailable ? 'unavailable' : ''}"
                 onclick="${retiroUnavailable ? '' : "App.selectMethod('retiro')"}">
              <i class="fa-solid fa-store"></i>
              <div class="mo-label">Retiro</div>
              <div class="mo-sub">${retiroUnavailable ? 'No disponible' : 'En tienda'}</div>
            </div>
            <div class="method-opt ${State.checkoutMethod === 'delivery' ? 'selected' : ''} ${deliveryUnavailable ? 'unavailable' : ''}"
                 onclick="${deliveryUnavailable ? '' : "App.selectMethod('delivery')"}">
              <i class="fa-solid fa-truck"></i>
              <div class="mo-label">Delivery</div>
              <div class="mo-sub">${deliveryUnavailable ? 'No disponible' : (isFree ? '🚚 Gratis' : 'A coordinar')}</div>
            </div>
          </div>
        </div>

        <div class="field-group address-field ${State.checkoutMethod !== 'delivery' ? 'hidden-field' : ''}" id="address-field">
          <label class="field-label">
            <i class="fa-solid fa-map-pin"></i> Dirección de entrega <span class="field-required">*</span>
          </label>
          <input type="text" id="ch-direccion" class="field-input"
                 placeholder="Calle, número, comuna" autocomplete="street-address" />
          <span class="error-msg" id="err-direccion">Ingresa tu dirección</span>
        </div>

        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-comment"></i> Notas adicionales</label>
          <textarea id="ch-notas" class="field-input" rows="2"
                    placeholder="Instrucciones especiales, sabores preferidos…"
                    style="resize:none"></textarea>
        </div>

        <div class="coupon-section">
          <div class="coupon-input-row">
            <input type="text" id="coupon-input" class="coupon-input" placeholder="Código de cupón"
                   value="${coupon ? coupon.code : ''}" />
            <button class="coupon-apply-btn" onclick="App.applyCoupon()">
              ${coupon ? '✓' : 'Aplicar'}
            </button>
          </div>
          ${coupon ? `<div class="coupon-applied"><i class="fa-solid fa-check-circle"></i> ${coupon.label} <button class="coupon-remove" onclick="App.removeCoupon()">✕</button></div>` : ''}
          <div id="coupon-msg" class="coupon-msg"></div>
        </div>

        <div class="checkout-summary">
          <div class="cs-header">Resumen del pedido</div>
          <div class="cs-items">${csItems}</div>
          <div class="cs-row-delivery"><span>Delivery</span><span>${isFree ? '🚚 Gratis' : 'A coordinar'}</span></div>
          ${discount > 0 ? `<div class="cs-row-discount"><span>Descuento cupón</span><span>-${fmt(discount)}</span></div>` : ''}
          <div class="cs-total"><span>Total</span><span>${fmt(finalTotal)}</span></div>
        </div>

        <button class="btn-confirm" onclick="App.confirmOrder()">
          <i class="fa-solid fa-check-circle"></i> Confirmar pedido · ${fmt(finalTotal)}
        </button>
      </div>
    </div>`;
  },

  /* ── ENCARGOS ──────────────────────────── */
  encargos() {
    return `
    <div class="view encargos-view active" id="view-encargos">
      <div class="encargos-hero">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <h2>Pedido Personalizado</h2>
        <p>¿Quieres algo especial? Cuéntanos tu idea y lo hacemos realidad.</p>
      </div>
      <div class="encargos-form pb-safe">
        <div class="encargos-note">
          <i class="fa-solid fa-circle-info"></i>
          <span>Los encargos se coordinan directamente por WhatsApp. Los pedidos personalizados deben ser evaluados previamente para confirmar su elaboración, ya que al no solicitar depósitos anticipados, debemos asegurarnos de que el costo de producción sea viable para ambas partes. 🤝</span>
        </div>
        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-user"></i> Tu nombre <span class="field-required">*</span></label>
          <input type="text" id="enc-nombre" class="field-input" placeholder="Ej: Carlos Muñoz" autocomplete="name" />
          <span class="error-msg" id="err-enc-nombre">Ingresa tu nombre</span>
        </div>
        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-clipboard-list"></i> Descripción del encargo <span class="field-required">*</span></label>
          <textarea id="enc-desc" class="field-input" rows="3"
                    placeholder="Ej: 20 barras de cacao sin maní para evento el 15/06…"
                    style="resize:none"></textarea>
          <span class="error-msg" id="err-enc-desc">Describe tu encargo</span>
        </div>
        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-calendar"></i> Fecha que necesitas</label>
          <input type="date" id="enc-fecha" class="field-input" />
        </div>
        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-hashtag"></i> Cantidad aproximada</label>
          <input type="number" id="enc-cantidad" class="field-input" placeholder="Ej: 20" min="1" />
        </div>
        <button class="btn-whatsapp" onclick="App.sendEncargo()">
          <i class="fa-brands fa-whatsapp"></i> Enviar por WhatsApp
        </button>
      </div>
    </div>`;
  },

  /* ── ONBOARDING ─────────────────────────── */
  onboarding() {
    return `
    <div class="onboarding-overlay" id="onboarding-overlay">
      <div class="onboarding-card">
        <button class="onboarding-close" onclick="App.skipOnboarding()">✕</button>
        <div class="onboarding-logo">🌿</div>
        <h2 class="onboarding-title">Bienvenido/a a<br>Círculo de Sabores</h2>
        <p class="onboarding-sub">Barras y snacks artesanales hechos con ingredientes reales.</p>
        <div class="onboarding-steps">
          <div class="onboarding-step"><span class="step-num">1</span> Elige tus productos</div>
          <div class="onboarding-step"><span class="step-num">2</span> Confirma por WhatsApp</div>
          <div class="onboarding-step"><span class="step-num">3</span> Recibe en tu puerta 🚚</div>
        </div>
        <div class="onboarding-coupon">
          <span class="coupon-badge">🎁</span>
          <span class="coupon-text">Usa el código <strong>BIENVENIDO10</strong> y obtén <strong>10% OFF</strong></span>
        </div>
        <button class="onboarding-cta" onclick="App.startOnboarding()">
          <i class="fa-solid fa-bag-shopping"></i> ¡Empezar a comprar!
        </button>
        <button class="onboarding-secondary" onclick="App.skipOnboarding()">
          Ver productos primero
        </button>
      </div>
    </div>`;
  },

  /* ── MIS PEDIDOS ─────────────────────────── */
  pedidos() {
    const orders = DataLayer.orders.getAll();
    if (orders.length === 0) {
      return `
      <div class="view pedidos-view active" id="view-pedidos">
        <div class="view-header"><h2>Mis Pedidos</h2></div>
        <div class="orders-empty">
          <i class="fa-solid fa-clipboard-list"></i>
          <p>Aún no tienes pedidos.<br>¡Haz tu primera compra!</p>
          <button class="btn-primary" onclick="App.navigate('home')">
            <i class="fa-solid fa-store"></i> Ver productos
          </button>
        </div>
      </div>`;
    }

    const items = orders.map(o => {
      const statusIcons = {
        pending: { icon: 'fa-clock', label: 'Pendiente', cls: 'pending' },
        preparing: { icon: 'fa-fire', label: 'En preparación', cls: 'preparing' },
        ready: { icon: 'fa-check-circle', label: 'Listo para retirar', cls: 'ready' },
        delivered: { icon: 'fa-box-open', label: 'Entregado', cls: 'delivered' },
        cancelled: { icon: 'fa-times-circle', label: 'Cancelado', cls: 'cancelled' },
      };
      const st = statusIcons[o.status] || statusIcons.pending;
      const date = new Date(o.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

      return `
      <div class="order-card">
        <div class="order-card-header">
          <span class="order-card-id">#${o.id.slice(-6).toUpperCase()}</span>
          <span class="order-card-date">${date}</span>
        </div>
        <div class="order-card-items">
          ${(o.items || []).map(i => `${i.emoji} ${i.name} ×${i.qty}`).join('<br>')}
        </div>
        <div class="order-card-footer">
          <span class="order-card-total">$${(o.total || 0).toLocaleString('es-CL')}</span>
          <span class="order-card-status status-${st.cls}">
            <i class="fa-solid ${st.icon}"></i> ${st.label}
          </span>
        </div>
        ${o.status === 'delivered' ? `<button class="btn-reorder" onclick="App.reorder('${o.id}')"><i class="fa-solid fa-rotate"></i> Repetir pedido</button>` : ''}
      </div>`;
    }).join('');

    return `
    <div class="view pedidos-view active" id="view-pedidos">
      <div class="view-header"><h2>Mis Pedidos</h2></div>
      <div class="orders-list">${items}</div>
    </div>`;
  },

  /* ── CONFIRMACIÓN ──────────────────────── */
  confirmacion() {
    return `
    <div class="view confirmacion-view active" id="view-confirmacion">
      <div class="confirm-icon-wrap">
        <div class="confirm-icon-ring">
          <div class="confirm-icon-inner">✅</div>
        </div>
      </div>
      <h2 class="confirm-title">¡Pedido listo!</h2>
      <p class="confirm-sub">Tu pedido fue enviado por WhatsApp. Nos pondremos en contacto para coordinar la entrega.</p>
      <div class="confirm-actions">
        <button class="btn-primary" onclick="App.navigate('pedidos')">
          <i class="fa-solid fa-clipboard-list"></i> Ver mis pedidos
        </button>
        <button class="btn-secondary" onclick="App.navigate('home')">
          <i class="fa-solid fa-store"></i> Seguir comprando
        </button>
      </div>
      <div class="confirm-share">
        <p>Comparte tu experiencia con nosotros</p>
        <button class="btn-share-ig" onclick="App.shareToInstagram()">
          <i class="fa-brands fa-instagram"></i> Síguenos en Instagram
        </button>
      </div>
    </div>`;
  },
};

/* ── ADMIN PANEL ─────────────────────────────────────────── */
const Admin = {
  _editingProductId: null,

  open() {
    const panel = $('#admin-panel');
    if (panel) { panel.style.display = 'flex'; }
    Admin.showTab('productos', $$('.admin-tab')[0]);
  },

  close() {
    const panel = $('#admin-panel');
    if (panel) { panel.style.display = 'none'; }
  },

  showTab(tab, btn) {
    $$('.admin-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    Admin._editingProductId = null;
    const body = $('#admin-body');
    if (!body) return;
    const renderers = {
      productos: Admin.renderProductos,
      pedidos:   Admin.renderPedidos,
      cupones:   Admin.renderCupones,
      entrega:   Admin.renderEntrega,
      contenido: Admin.renderContenido,
    };
    if (renderers[tab]) body.innerHTML = renderers[tab]();
  },

  renderProductos() {
    const prods = getProducts();
    const list = prods.map(p => `
      <div class="admin-product-item">
        <div class="admin-p-emoji">${p.emoji}</div>
        <div class="admin-p-info">
          <div class="admin-p-name">${p.name}</div>
          <div class="admin-p-price">${CATEGORY_META[p.category]?.label || p.category} · ${fmt(p.priceUnit)}</div>
        </div>
        <button class="admin-edit-btn" onclick="Admin.editProduct('${p.id}')">Editar</button>
      </div>`).join('');
    return `
      <div class="admin-section-title">Productos (${prods.length})</div>
      ${list}
      <button class="admin-save-btn" onclick="Admin.addProduct()" style="background:var(--primary);margin-top:4px">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </button>`;
  },

  renderPedidos() {
    const orders = DataLayer.orders.getAll();
    const pending = DataLayer.orders.getByStatus('pending').length;
    const preparing = DataLayer.orders.getByStatus('preparing').length;
    const ready = DataLayer.orders.getByStatus('ready').length;
    const delivered = DataLayer.orders.getByStatus('delivered').length;
    const revenue = DataLayer.stats.getTotalRevenue();
    const avgTicket = DataLayer.stats.getAvgTicket();

    const statsCards = `
      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-value">${orders.length}</div>
          <div class="admin-stat-label">Total Pedidos</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">${fmt(revenue)}</div>
          <div class="admin-stat-label">Ingresos</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">${pending}</div>
          <div class="admin-stat-label">Pendientes</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">${fmt(avgTicket)}</div>
          <div class="admin-stat-label">Ticket Promedio</div>
        </div>
      </div>`;

    if (orders.length === 0) {
      return `
        <div class="admin-section-title">Pedidos</div>
        ${statsCards}
        <p class="admin-empty">No hay pedidos aún</p>`;
    }

    const orderCards = orders.map(o => {
      const statusIcons = {
        pending: { icon: 'fa-clock', label: 'Pendiente', cls: 'pending' },
        preparing: { icon: 'fa-fire', label: 'En preparación', cls: 'preparing' },
        ready: { icon: 'fa-check-circle', label: 'Listo', cls: 'ready' },
        delivered: { icon: 'fa-box-open', label: 'Entregado', cls: 'delivered' },
        cancelled: { icon: 'fa-times-circle', label: 'Cancelado', cls: 'cancelled' },
      };
      const st = statusIcons[o.status] || statusIcons.pending;
      const date = new Date(o.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

      const flow = {
        pending: ['preparing', 'cancelled'],
        preparing: ['ready'],
        ready: ['delivered'],
        delivered: [],
        cancelled: []
      };
      const actions = (flow[o.status] || []).map(s =>
        `<button onclick="Admin.updateOrderStatus('${o.id}','${s}')">${Admin._statusLabel(s)}</button>`
      ).join('');

      return `
      <div class="admin-order-card status-${o.status}">
        <div class="order-header">
          <span class="order-id">#${(o.id || '').slice(-6).toUpperCase()}</span>
          <span class="order-status">${st.label}</span>
          <span class="order-date">${date}</span>
        </div>
        <div class="order-customer">${o.customerName || ''} · ${o.customerPhone || ''}</div>
        <div class="order-items">
          ${(o.items || []).map(i => `${i.emoji || ''} ${i.name} ×${i.qty}`).join('<br>')}
        </div>
        <div class="order-total">Total: $${(o.total || 0).toLocaleString('es-CL')}</div>
        <div class="order-method">${o.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Retiro'}</div>
        ${o.deliveryMethod === 'delivery' && o.address ? `<div class="order-address">📍 ${o.address}</div>` : ''}
        ${o.notes ? `<div class="order-notes">📝 ${o.notes}</div>` : ''}
        <div class="order-actions">${actions}</div>
      </div>`;
    }).join('');

    return `
      <div class="admin-section-title">Pedidos (${orders.length})</div>
      ${statsCards}
      ${orderCards}
      <button class="admin-export-btn" onclick="DataLayer.orders.exportCSV()">
        <i class="fa-solid fa-download"></i> Exportar pedidos a CSV
      </button>`;
  },

  updateOrderStatus(orderId, status) {
    DataLayer.orders.updateStatus(orderId, status);
    Admin.showTab('pedidos', $$('.admin-tab')[1]);
    showToast(`Pedido actualizado: ${Admin._statusLabel(status)}`, '✅');
  },

  _statusLabel(status) {
    const labels = {
      pending: '⏳ Pendiente',
      preparing: '🔥 En preparación',
      ready: '✅ Listo',
      delivered: '📦 Entregado',
      cancelled: '❌ Cancelado'
    };
    return labels[status] || status;
  },

  renderCupones() {
    const coupons = DataLayer.coupons.getAll();
    const rows = Object.entries(coupons).map(([code, c]) => `
      <div class="admin-coupon-row ${c.active ? '' : 'inactive'}">
        <div class="admin-coupon-code">${code}</div>
        <div class="admin-coupon-label">${c.label || ''}</div>
        <div class="admin-coupon-detail">
          ${c.type === 'percent' ? c.discount + '%' : c.type === 'fixed' ? fmt(c.discount) : '🚚 Envío gratis'}
          ${c.minPurchase ? ' · Mín. ' + fmt(c.minPurchase) : ''}
        </div>
        <div class="admin-coupon-uses">${c.usedCount || 0}/${c.maxUses || '∞'}</div>
        <div class="admin-coupon-actions">
          <button onclick="DataLayer.coupons.toggle('${code}'); Admin.showTab('cupones', $$('.admin-tab')[2])">
            ${c.active ? '🔴 Desactivar' : '🟢 Activar'}
          </button>
          <button onclick="DataLayer.coupons.delete('${code}'); Admin.showTab('cupones', $$('.admin-tab')[2])">
            🗑️
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="admin-section-title">Cupones</div>
      <div class="admin-coupon-form">
        <input class="admin-input" id="new-coupon-code" placeholder="Código (ej: VERANO20)" style="text-transform:uppercase" />
        <input class="admin-input" id="new-coupon-label" placeholder="Descripción" />
        <div class="admin-row-2">
          <select class="admin-input" id="new-coupon-type" onchange="Admin._couponTypeChange()">
            <option value="percent">% Descuento</option>
            <option value="fixed">$ Descuento fijo</option>
            <option value="free_delivery">🚚 Envío gratis</option>
          </select>
          <input class="admin-input" id="new-coupon-value" type="number" placeholder="Valor" />
        </div>
        <div class="admin-row-2">
          <input class="admin-input" id="new-coupon-min" type="number" placeholder="Compra mín. (0 = sin mín)" />
          <input class="admin-input" id="new-coupon-max" type="number" placeholder="Usos máx. (0 = ∞)" />
        </div>
        <button class="admin-save-btn" onclick="Admin.createCoupon()" style="background:var(--primary);margin-top:8px">
          <i class="fa-solid fa-plus"></i> Crear cupón
        </button>
      </div>
      <div class="admin-coupons-list">${rows}</div>`;
  },

  _couponTypeChange() {
    const type = $('#new-coupon-type')?.value;
    const valInput = $('#new-coupon-value');
    if (valInput) {
      valInput.placeholder = type === 'percent' ? 'Ej: 20' : type === 'fixed' ? 'Ej: 2000' : '—';
      if (type === 'free_delivery') valInput.value = '0';
    }
  },

  createCoupon() {
    const code = $('#new-coupon-code')?.value?.trim();
    const label = $('#new-coupon-label')?.value?.trim();
    const type = $('#new-coupon-type')?.value;
    const discount = parseInt($('#new-coupon-value')?.value) || 0;
    const minPurchase = parseInt($('#new-coupon-min')?.value) || 0;
    const maxUses = parseInt($('#new-coupon-max')?.value) || 999;

    if (!code) { showToast('Ingresa un código', '⚠️'); return; }

    DataLayer.coupons.create(code, { discount, type, minPurchase, maxUses, label });
    showToast('Cupón creado ✓', '✅');
    Admin.showTab('cupones', $$('.admin-tab')[2]);
  },

  editProduct(id) {
    Admin._editingProductId = id;
    const prods = getProducts();
    const p = prods.find(x => x.id === id);
    if (!p) return;
    const body = $('#admin-body');
    if (!body) return;
    const catOptions = CATEGORIES.filter(c => c !== 'todos').map(c =>
      `<option value="${c}" ${p.category === c ? 'selected' : ''}>${CATEGORY_META[c]?.label || c}</option>`
    ).join('');
    body.innerHTML = `
      <button class="admin-back-link" onclick="Admin.showTab('productos', $$('.admin-tab')[0])">← Volver a productos</button>
      <div class="admin-section-title">Editar: ${p.name}</div>
      <div class="admin-field"><label class="admin-label">Emoji</label>
        <input class="admin-input" id="ep-emoji" value="${p.emoji}" /></div>
      <div class="admin-field"><label class="admin-label">Nombre</label>
        <input class="admin-input" id="ep-name" value="${p.name}" /></div>
      <div class="admin-field"><label class="admin-label">Descripción</label>
        <textarea class="admin-input" id="ep-desc" rows="3" style="resize:none">${p.desc}</textarea></div>
      <div class="admin-row-2">
        <div class="admin-field"><label class="admin-label">Precio unidad</label>
          <input class="admin-input" id="ep-priceUnit" type="number" value="${p.priceUnit}" /></div>
        <div class="admin-field"><label class="admin-label">Pack x4</label>
          <input class="admin-input" id="ep-pricePack4" type="number" value="${p.pricePack4}" /></div>
      </div>
      <div class="admin-row-2">
        <div class="admin-field"><label class="admin-label">Pack x8</label>
          <input class="admin-input" id="ep-pricePack8" type="number" value="${p.pricePack8}" /></div>
        <div class="admin-field"><label class="admin-label">Categoría</label>
          <select class="admin-input" id="ep-category">${catOptions}</select></div>
      </div>
      <div class="admin-field"><label class="admin-label">Badge (ej: Más vendida)</label>
        <input class="admin-input" id="ep-badge" value="${p.badge || ''}" /></div>
      <div style="display:flex;gap:10px">
        <button class="admin-save-btn" onclick="Admin.saveProduct('${id}')">
          <i class="fa-solid fa-check"></i> Guardar cambios
        </button>
        <button style="background:var(--error);color:#fff;border-radius:var(--r-xl);padding:14px;font-size:.85rem;font-weight:600;flex:0.5" onclick="Admin.deleteProduct('${id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
  },

  async saveProduct(id) {
    const prods = JSON.parse(JSON.stringify(getProducts()));
    const idx = prods.findIndex(p => p.id === id);
    if (idx < 0) return;
    prods[idx] = {
      ...prods[idx],
      emoji: DataLayer._sanitize($('#ep-emoji')?.value) || prods[idx].emoji,
      name: DataLayer._sanitize($('#ep-name')?.value) || prods[idx].name,
      desc: DataLayer._sanitize($('#ep-desc')?.value) || prods[idx].desc,
      priceUnit: parseInt($('#ep-priceUnit')?.value) || prods[idx].priceUnit,
      pricePack4: parseInt($('#ep-pricePack4')?.value) || prods[idx].pricePack4,
      pricePack8: parseInt($('#ep-pricePack8')?.value) || prods[idx].pricePack8,
      category: $('#ep-category')?.value || prods[idx].category,
      badge: DataLayer._sanitize($('#ep-badge')?.value) || null,
    };

    DataLayer.products.update(id, prods[idx]);
    AdminState._d.products = prods;
    showToast('Producto guardado ✓', '✅');
    Admin.showTab('productos', $$('.admin-tab')[0]);
  },

  deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    DataLayer.products.delete(id);
    AdminState._d.products = AdminState._d.products.filter(p => p.id !== id);
    showToast('Producto eliminado', '🗑️');
    Admin.showTab('productos', $$('.admin-tab')[0]);
  },

  addProduct() {
    const newId = 'prod-' + Date.now();
    DataLayer.products.create({
      id: newId, name: 'Nuevo Producto', category: 'barras',
      emoji: '🌿', desc: 'Descripción del producto.',
      priceUnit: 1500, pricePack4: 5400, pricePack8: 10000,
      badge: null, badgeStyle: '', tags: [], attrs: [],
    });
    AdminState._d.products = DataLayer.products.getActive();
    Admin.editProduct(newId);
  },

  renderEntrega() {
    const dm = AdminState.get('deliveryMethods');
    const toggle = (key, obj, label, sub, handler) => {
      const checked = obj[key] ? 'checked' : '';
      return `
      <div class="admin-toggle-row">
        <div class="admin-toggle-info">
          <div class="atg-title">${label}</div>
          <div class="atg-sub">${sub}</div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${checked} onchange="${handler}('${key}', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>`;
    };
    return `
      <div class="admin-section-title">Métodos de Entrega</div>
      <div class="admin-info-pill"><i class="fa-solid fa-circle-info"></i> Delivery gratis para pedidos sobre $20.000</div>
      ${toggle('delivery', dm, '🚚 Delivery', 'Envío a domicilio. Gratis sobre $20.000', 'Admin.toggleDelivery')}
      ${toggle('retiro', dm, '🏪 Retiro en tienda', 'El cliente retira en la dirección acordada', 'Admin.toggleDelivery')}`;
  },

  toggleDelivery(key, val) {
    const dm = { ...AdminState.get('deliveryMethods'), [key]: val };
    AdminState.set('deliveryMethods', dm);
    if (key === 'retiro' && !val && State.checkoutMethod === 'retiro') {
      State.checkoutMethod = 'delivery';
    }
    showToast('Guardado', '✅');
  },

  togglePayment(key, val) {
    const pm = { ...AdminState.get('paymentMethods'), [key]: val };
    AdminState.set('paymentMethods', pm);
    showToast('Guardado', '✅');
  },

  renderContenido() {
    const c = AdminState.get('content');
    return `
      <div class="admin-section-title">Textos de la Web</div>
      <div class="admin-field">
        <label class="admin-label">Título Hero (usa \\n para salto de línea)</label>
        <input class="admin-input" id="ct-heroTitle" value="${c.heroTitle}" />
      </div>
      <div class="admin-field">
        <label class="admin-label">Tag pequeño del Hero</label>
        <input class="admin-input" id="ct-heroTag" value="${c.heroTag}" />
      </div>
      <button class="admin-save-btn" onclick="Admin.saveContent()">
        <i class="fa-solid fa-check"></i> Guardar contenido
      </button>`;
  },

  saveContent() {
    const c = {
      heroTitle: $('#ct-heroTitle')?.value || AdminState.get('content').heroTitle,
      heroSub:   AdminState.get('content').heroSub,
      heroTag:   $('#ct-heroTag')?.value   || AdminState.get('content').heroTag,
    };
    AdminState.set('content', c);
    showToast('Contenido guardado ✓', '✅');
  },
};

/* ── ROUTER ──────────────────────────────────────────────── */
const App = {
  _logoClickCount: 0,
  _logoClickTimer: null,

  navigate(view, param) {
    State.currentView = view;
    document.dispatchEvent(new Event('navigated'));

    const navbar = $('#navbar');
    const footer = $('#footer-nav');
    if (view === 'intro') {
      if (navbar) navbar.style.display = 'none';
      if (footer) footer.style.display = 'none';
    } else {
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'flex';
    }

    $$('.foot-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    const app = $('#app');
    const viewMap = {
      intro:        Views.intro,
      home:         Views.home,
      producto:     Views.producto,
      carrito:      Views.carrito,
      checkout:     Views.checkout,
      encargos:     Views.encargos,
      pedidos:      Views.pedidos,
      confirmacion: Views.confirmacion,
    };

    if (viewMap[view]) app.innerHTML = viewMap[view]();

    const viewEl = app.querySelector('.view');
    if (viewEl) viewEl.scrollTop = 0;

    if (param && view === 'producto') State.selectedType = param;

    Cart.refreshBadge();

    if (view === 'intro') App._initIntro();
    if (view === 'home')  App._initHome();
  },

  /* ── INTRO ANIMATIONS ──────────────────── */
  _introWordsTimer: null,
  _initIntro() {
    const subtitle = $('#intro-subtitle');
    const fullText = 'Barras y snacks artesanales hechos con amor.';
    if (subtitle) {
      let i = 0;
      subtitle.classList.add('typewriter-cursor');
      const type = () => {
        if (i <= fullText.length) {
          subtitle.textContent = fullText.slice(0, i);
          i++;
          setTimeout(type, i === fullText.length ? 0 : 32);
        } else { subtitle.classList.remove('typewriter-cursor'); }
      };
      setTimeout(type, 700);
    }

    const words = ['✨ Snacks Saludables', '🌾 Barras Proteicas', '🍫 Dulces Sin Azúcar', '🥑 Opciones Keto', '🥜 Frutos Secos', '🌿 Granola Artesanal', '🫙 Mantequillas Naturales', '❤️ Hecho con Amor'];
    let wi = 0;
    const tagEl = $('#intro-tag-word');
    if (tagEl) {
      clearInterval(App._introWordsTimer);
      App._introWordsTimer = setInterval(() => {
        if (!document.body.contains(tagEl)) { clearInterval(App._introWordsTimer); return; }
        wi = (wi + 1) % words.length;
        tagEl.style.opacity = '0';
        setTimeout(() => { tagEl.textContent = words[wi]; tagEl.style.opacity = '1'; }, 300);
      }, 2000);
    }

    setTimeout(() => {
      const title = $('#intro-title');
      if (title) startGlitterRain(title);
    }, 800);
  },

  /* ── HOME INIT ───────────────────────── */
  _heroSlideshowTimer: null,
  _initHome() {
    const video = $('#hero-video');
    if (video) {
      video.playbackRate = 0.5;
      video.addEventListener('ended', () => video.pause(), { once: true });
    }
  },

  /* ── INTRO BUTTON ──────────────────────── */
  animateIntroBtn() {
    const btn  = $('#btn-ver-productos');
    const text = $('#btn-ver-text');
    if (!btn) { App.navigate('home'); return; }
    if (text) {
      text.style.transition = 'opacity .3s ease, max-width .4s ease';
      text.style.opacity = '0';
      text.style.maxWidth = '0';
      text.style.overflow = 'hidden';
    }
    btn.style.transition = 'all .55s cubic-bezier(.4,0,.2,1)';
    btn.style.minWidth = '0';
    btn.style.width = '56px';
    btn.style.height = '56px';
    btn.style.padding = '0';
    btn.style.borderRadius = '50%';
    btn.style.justifyContent = 'center';
    btn.style.gap = '0';
    setTimeout(() => App.navigate('home'), 650);
  },

  /* ── HAMBURGER MENU ─────────────────────── */
  toggleMenu() {
    const menu = $('#ham-menu');
    menu && menu.classList.contains('open') ? App.closeMenu() : App.openMenu();
  },
  openMenu() {
    $('#ham-menu')?.classList.add('open');
    $('#ham-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  closeMenu() {
    $('#ham-menu')?.classList.remove('open');
    $('#ham-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  skipOnboarding() {
    DataLayer.onboarding.markDone();
    const overlay = $('#onboarding-overlay');
    if (overlay) { overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 300); }
  },

  startOnboarding() {
    DataLayer.onboarding.markDone();
    State.appliedCoupon = DataLayer.coupons.validate('BIENVENIDO10');
    const overlay = $('#onboarding-overlay');
    if (overlay) { overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 300); }
    showToast('Cupón IG15 aplicado: 15% OFF', '🎉');
  },

  shareProduct(id, btn) {
    const p = DataLayer.products.getById(id);
    if (!p) return;
    const text = `Mirá ${p.name} de @circulodesabores_cl 🌿`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: p.name, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => showToast('Link copiado ✓', '📋'));
    }
    if (navigator.vibrate) navigator.vibrate(15);
  },

  shareToInstagram() {
    const text = 'Acabo de pedir en @circulodesabores_cl 🌿 ¡Barras y snacks artesanales increíbles!';
    if (navigator.share) {
      navigator.share({ text, url: 'https://instagram.com/circulodesabores_cl' }).catch(() => {});
    } else {
      window.open('https://instagram.com/circulodesabores_cl', '_blank');
    }
  },

  /* ── LOGO SECRET ADMIN ──────────────────── */
  _logoClick() {
    App._logoClickCount++;
    clearTimeout(App._logoClickTimer);
    App._logoClickTimer = setTimeout(() => { App._logoClickCount = 0; }, 3500);
    if (App._logoClickCount >= 10) {
      App._logoClickCount = 0;
      clearTimeout(App._logoClickTimer);
      Admin.open();
    }
  },

  /* ── PRODUCT ACTIONS ─────────────────────── */
  toggleFav(id, btn) {
    const favs = DataLayer.favorites.toggle(id);
    const isActive = favs.includes(id);
    if (btn) {
      btn.classList.toggle('active', isActive);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    }
    if (navigator.vibrate) navigator.vibrate(15);
  },

  openProduct(id, preType) {
    State.selectedProduct = getProducts().find(p => p.id === id);
    State.selectedType = preType || 'unit';
    State.selectedQty = 1;
    App.navigate('producto');
  },

  selectType(type) {
    State.selectedType = type;
    State.selectedQty = 1;
    App.navigate('producto');
  },

  changeQty(delta) {
    State.selectedQty = Math.max(1, State.selectedQty + delta);
    const p    = State.selectedProduct;
    const info = getPackInfo(p, State.selectedType);
    const total = info.price * State.selectedQty;
    const qtyEl   = $('#qty-val');
    if (qtyEl)   qtyEl.textContent = State.selectedQty;
    const addBtn = $('.btn-add-full');
    if (addBtn)  addBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Agregar al carrito — ${fmt(total)}`;
  },

  addToCart() {
    const p = State.selectedProduct;
    if (!p) return;
    Cart.add(p, State.selectedType, State.selectedQty);
    showToast(`${p.name} agregado`, '🛍️');
    App.navigate('home');
  },

  quickAdd(productId) {
    const p = getProducts().find(x => x.id === productId);
    if (!p) return;
    Cart.add(p, 'pack4', 1);
    showToast(`Pack x4 de ${p.name} agregado`, '✓');
    App.navigate('home');
  },

  applyCoupon() {
    const input = $('#coupon-input');
    const msg = $('#coupon-msg');
    if (!input || !msg) return;
    const code = input.value.trim();
    if (!code) { msg.innerHTML = '<span class="coupon-error">Ingresa un código</span>'; return; }

    const coupon = DataLayer.coupons.validate(code);
    if (!coupon) {
      msg.innerHTML = '<span class="coupon-error">Cupón no encontrado</span>';
      return;
    }
    if (coupon.error) {
      msg.innerHTML = `<span class="coupon-error">${coupon.error}</span>`;
      return;
    }

    const subtotal = cartTotal();
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      msg.innerHTML = `<span class="coupon-error">Mínimo ${fmt(coupon.minPurchase)} para este cupón</span>`;
      return;
    }

    State.appliedCoupon = { code: code.toUpperCase(), ...coupon };
    App.navigate('checkout');
    showToast(`Cupón aplicado: ${coupon.label}`, '🎉');
  },

  removeCoupon() {
    State.appliedCoupon = null;
    App.navigate('checkout');
  },

  _calcDiscount(subtotal, coupon) {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return Math.round(subtotal * (coupon.discount / 100));
    if (coupon.type === 'fixed') return Math.min(coupon.discount, subtotal);
    return 0;
  },

  /* ── SEARCH & FILTER ─────────────────────── */
  onSearch(val) {
    State.searchQuery = val;
    const clearBtn = $('#search-clear');
    if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
    this._renderProductsGrid();
    this._renderSectionLabel();
    this._renderOptionalSections();
  },

  clearSearch() {
    State.searchQuery = '';
    const inp = $('#search-input');
    if (inp) inp.value = '';
    const clearBtn = $('#search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    this._renderProductsGrid();
    this._renderSectionLabel();
    this._renderOptionalSections();
  },

  setCategory(cat) {
    State.activeCategory = cat;
    this._renderCatFilters();
    this._renderProductsGrid();
    this._renderSectionLabel();
    this._renderOptionalSections();
  },

  toggleTag(tag) {
    State.activeTag = State.activeTag === tag ? null : tag;
    this._renderTagFilters();
    this._renderProductsGrid();
    this._renderSectionLabel();
    this._renderOptionalSections();
  },

  clearFilters() {
    State.searchQuery = '';
    State.activeCategory = 'todos';
    State.activeTag = null;
    this._renderCatFilters();
    this._renderTagFilters();
    this._renderProductsGrid();
    this._renderSectionLabel();
    this._renderOptionalSections();
    const inp = $('#search-input');
    if (inp) inp.value = '';
    const clearBtn = $('#search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
  },

  _getFilteredProducts() {
    const products = getProducts();
    return products.filter(p => {
      const matchCat = State.activeCategory === 'todos' || p.category === State.activeCategory;
      const matchTag = !State.activeTag || (p.tags && p.tags.includes(State.activeTag));
      const matchSearch = !State.searchQuery ||
        p.name.toLowerCase().includes(State.searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(State.searchQuery.toLowerCase());
      return matchCat && matchTag && matchSearch;
    });
  },

  _renderCatFilters() {
    const el = $('#cat-filters');
    if (!el) return;
    const catCols = CATEGORIES.slice(1);
    el.innerHTML = `
      <button class="filter-btn ${State.activeCategory === 'todos' ? 'active' : ''}"
              onclick="App.setCategory('todos')">Todos</button>
      ${catCols.map(c => {
        const meta = CATEGORY_META[c];
        return `<button class="filter-btn ${State.activeCategory === c ? 'active' : ''}"
                        onclick="App.setCategory('${c}')">
          <span class="filter-emoji">${meta.emoji}</span> ${meta.label}
        </button>`;
      }).join('')}`;
  },

  _renderTagFilters() {
    const el = $('#tag-filters-wrap');
    if (!el) return;
    el.innerHTML = Object.entries(TAGS).map(([key, tag]) =>
      `<button class="tag-filter-btn ${State.activeTag === key ? 'active' : ''}"
               data-tag="${key}"
               onclick="App.toggleTag('${key}')"
               style="--tag-color:${tag.color}">
        ${tag.icon} ${tag.label}
       </button>`
    ).join('');
  },

  _renderProductsGrid() {
    const el = $('#products-grid');
    if (!el) return;
    const filtered = this._getFilteredProducts();
    const cards = filtered.length > 0
      ? filtered.map(p => Views._productCard(p)).join('')
      : `<div class="no-results">
           <i class="fa-solid fa-magnifying-glass"></i>
           <p>Sin resultados${State.searchQuery ? ` para "<strong>${State.searchQuery}</strong>"` : ' para este filtro'}</p>
           <button class="btn-ghost" onclick="App.clearFilters()">Limpiar filtros</button>
         </div>`;
    el.innerHTML = cards;
  },

  _renderSectionLabel() {
    const el = $('#section-label-row');
    if (!el) return;
    const filtered = this._getFilteredProducts();
    const label = State.activeCategory !== 'todos'
      ? CATEGORY_META[State.activeCategory]?.label || 'Catálogo'
      : 'Catálogo';
    el.querySelector('.section-label').textContent = label;
    const countEl = el.querySelector('.section-count');
    if (countEl) countEl.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
  },

  _renderOptionalSections() {
    const show = State.activeCategory === 'todos';
    const customWrap = $('#custom-section-wrap');
    const packsWrap = $('#packs-section-wrap');
    const testWrap = $('#testimonials-wrap');
    const faqWrap = $('#faq-wrap');
    if (customWrap) customWrap.innerHTML = show ? Views._customSection() : '';
    if (packsWrap) packsWrap.innerHTML = show ? Views._packSection() : '';
    if (testWrap) testWrap.innerHTML = show ? Views._testimonialsSection() : '';
    if (faqWrap) faqWrap.innerHTML = show ? Views._faqSection() : '';
  },

  _refreshHome() {
    const inp = $('#search-input');
    if (inp) { inp.value = State.searchQuery; }
  },

  /* ── CART ACTIONS ────────────────────────── */
  cartChangeQty(id, type, delta) {
    Cart.changeQty(id, type, delta);
    App.navigate('carrito');
  },

  cartRemove(id, type) {
    Cart.remove(id, type);
    App.navigate('carrito');
  },

  /* ── CHECKOUT ────────────────────────────── */
  selectMethod(method) {
    State.checkoutMethod = method;
    $$('.method-opt').forEach(el => el.classList.remove('selected'));
    const dm = AdminState.get('deliveryMethods');
    const opts = $$('.method-opt');
    if (method === 'retiro'   && dm.retiro   && opts[0]) opts[0].classList.add('selected');
    if (method === 'delivery' && dm.delivery && opts[1]) opts[1].classList.add('selected');
    const addrField = $('#address-field');
    if (addrField) addrField.classList.toggle('hidden-field', method !== 'delivery');
  },

  confirmOrder() {
    const nombre    = $('#ch-nombre');
    const direccion = $('#ch-direccion');
    let valid = true;

    if (!nombre || !nombre.value.trim()) {
      if (nombre) nombre.classList.add('error');
      $('#err-nombre')?.classList.add('show');
      valid = false;
    } else {
      nombre.classList.remove('error');
      $('#err-nombre')?.classList.remove('show');
    }

    if (State.checkoutMethod === 'delivery') {
      if (direccion && !direccion.value.trim()) {
        direccion.classList.add('error');
        $('#err-direccion')?.classList.add('show');
        valid = false;
      } else if (direccion) {
        direccion.classList.remove('error');
        $('#err-direccion')?.classList.remove('show');
      }
    }

    if (!valid) return;

    const nombreVal = nombre.value.trim();
    const metodo    = State.checkoutMethod;
    const dirVal    = metodo === 'delivery' ? (direccion?.value.trim() || 'Por coordinar') : 'Retiro en tienda';
    const notasVal  = $('#ch-notas')?.value.trim() || '';
    const now       = new Date();
    const fecha     = now.toLocaleDateString('es-CL');
    const hora      = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const subtotal  = cartTotal();
    const coupon    = State.appliedCoupon || null;
    const discount  = coupon ? this._calcDiscount(subtotal, coupon) : 0;
    const finalTotal = subtotal - discount;

    const itemLines = State.cart.map(i =>
      `  ${i.emoji} *${i.name}* — ${i.typeLabel} ×${i.qty}: ${fmt(i.priceTotal)}`
    ).join('\n');

    const msg = encodeURIComponent(
      `🌿 *PEDIDO — Círculo de Sabores*\n` +
      `📅 ${fecha} · ${hora}\n` +
      `─────────────────────\n` +
      `👤 *Cliente:* ${nombreVal}\n` +
      `📦 *Entrega:* ${metodo === 'delivery' ? `Delivery → ${dirVal}` : '🏪 Retiro en tienda'}\n` +
      `─────────────────────\n` +
      `🛒 *Detalle:*\n${itemLines}\n` +
      (discount > 0 ? `─────────────────────\n💸 *Descuento:* -${fmt(discount)} (${coupon.code})\n` : '') +
      `─────────────────────\n` +
      `💰 *Total: ${fmt(finalTotal)}*\n` +
      (notasVal ? `\n📝 *Notas:* ${notasVal}\n` : '') +
      `\n_Enviado desde la tienda web_`
    );

    // Save order via DataLayer
    DataLayer.orders.create({
      customerName: DataLayer._sanitize(nombreVal),
      customerPhone: WHATSAPP_NUMBER,
      items: State.cart.map(i => ({
        id: i.id, name: i.name, emoji: i.emoji,
        type: i.type, typeLabel: i.typeLabel,
        qty: i.qty, priceTotal: i.priceTotal
      })),
      total: finalTotal,
      subtotal: subtotal,
      couponCode: coupon ? coupon.code : null,
      couponDiscount: discount,
      deliveryMethod: metodo,
      address: metodo === 'delivery' ? DataLayer._sanitize(dirVal) : null,
      notes: notasVal ? DataLayer._sanitize(notasVal) : null,
      paymentMethod: 'transferencia'
    });

    // Mark coupon as used
    if (coupon) DataLayer.coupons.use(coupon.code);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    Cart.clear();
    State.appliedCoupon = null;
    App.navigate('confirmacion');
  },

  reorder(orderId) {
    const order = DataLayer.orders.getById(orderId);
    if (!order) return;
    State.cart = [];
    (order.items || []).forEach(item => {
      const product = DataLayer.products.getById(item.id);
      if (product) Cart.add(product, item.type, item.qty);
    });
    showToast('Pedido repetido ✓', '🔄');
    App.navigate('carrito');
  },

  /* ── ENCARGOS ────────────────────────────── */
  sendEncargo() {
    const nombre = $('#enc-nombre');
    const desc   = $('#enc-desc');
    let valid = true;

    if (!nombre || !nombre.value.trim()) {
      if (nombre) nombre.classList.add('error');
      $('#err-enc-nombre')?.classList.add('show');
      valid = false;
    } else { nombre.classList.remove('error'); $('#err-enc-nombre')?.classList.remove('show'); }

    if (!desc || !desc.value.trim()) {
      if (desc) desc.classList.add('error');
      $('#err-enc-desc')?.classList.add('show');
      valid = false;
    } else { desc.classList.remove('error'); $('#err-enc-desc')?.classList.remove('show'); }

    if (!valid) return;

    const nombreVal   = nombre.value.trim();
    const descVal     = desc.value.trim();
    const fechaVal    = $('#enc-fecha')?.value     ? `\n📅 Fecha necesaria: ${$('#enc-fecha').value}` : '';
    const cantidadVal = $('#enc-cantidad')?.value  ? `\n🔢 Cantidad aprox: ${$('#enc-cantidad').value}` : '';

    const msg = encodeURIComponent(
      `🌿 *Encargo — Círculo de Sabores*\n\n` +
      `👤 Nombre: ${nombreVal}\n` +
      `📝 Descripción: ${descVal}` +
      fechaVal + cantidadVal +
      `\n\n_Enviado desde la tienda web_`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  },

  /* ── PWA INSTALL ─────────────────────────── */
  _pwaPrompt: null,
  installPWA() {
    if (!App._pwaPrompt) return;
    App._pwaPrompt.prompt();
    App._pwaPrompt.userChoice.then(result => {
      if (result.outcome === 'accepted') showToast('App instalada ✓', '📲');
      App._pwaPrompt = null;
      const wrap = $('#ham-pwa-wrap');
      if (wrap) wrap.style.display = 'none';
    });
  },

  /* ── INIT ────────────────────────────────── */
  init() {
    DataLayer.init();
    AdminState.load();
    const dm = AdminState.get('deliveryMethods');
    if (!dm.delivery && dm.retiro) State.checkoutMethod = 'retiro';
    else if (dm.delivery) State.checkoutMethod = 'delivery';

    // Load cart from DataLayer
    const savedCart = DataLayer.cart.load();
    if (savedCart.length > 0) State.cart = savedCart;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      App._pwaPrompt = e;
      const wrap = $('#ham-pwa-wrap');
      if (wrap) wrap.style.display = 'flex';
    });
    App.navigate('intro');
    Cart.refreshBadge();

    // Show onboarding after intro animation completes
    setTimeout(() => {
      if (!DataLayer.onboarding.isDone()) {
        const app = $('#app');
        if (app) app.insertAdjacentHTML('beforeend', Views.onboarding());
      }
    }, 500);
  },
};

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', App.init);
