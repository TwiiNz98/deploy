/* ============================================================
   CÍRCULO DE SABORES — SPA Engine v2.0
   Mobile-first | Conversion-optimized | Admin Panel
   ============================================================ */
'use strict';

/* ── BASE PRODUCTS ──────────────────────────────────────── */
const BASE_PRODUCTS = [
  {
    id: 'bar-energia',
    name: 'Energía del Día',
    category: 'barras',
    emoji: '🌾',
    desc: 'Avena, miel, semillas de chía y frutos secos. Energía real sin azúcar refinada.',
    priceUnit: 1500,
    pricePack4: 5400,
    pricePack8: 10000,
    badge: 'Más vendida',
    badgeStyle: '',
  },
  {
    id: 'bar-cacao',
    name: 'Cacao Profundo',
    category: 'barras',
    emoji: '🍫',
    desc: 'Cacao 70%, avellanas y dátiles. Antioxidantes naturales en cada mordida.',
    priceUnit: 1600,
    pricePack4: 5760,
    pricePack8: 10560,
    badge: null,
    badgeStyle: '',
  },
  {
    id: 'bar-frutos',
    name: 'Frutos del Bosque',
    category: 'barras',
    emoji: '🫐',
    desc: 'Arándanos, frambuesas y semillas de linaza. Fresco y nutritivo.',
    priceUnit: 1600,
    pricePack4: 5760,
    pricePack8: 10560,
    badge: null,
    badgeStyle: '',
  },
  {
    id: 'bar-tropical',
    name: 'Tropical Mix',
    category: 'barras',
    emoji: '🥭',
    desc: 'Mango, coco rallado y maracuyá deshidratado. Vitamina C en forma de snack.',
    priceUnit: 1500,
    pricePack4: 5400,
    pricePack8: 10000,
    badge: '¡Nuevo!',
    badgeStyle: 'badge-gold',
  },
  {
    id: 'snack-nuts',
    name: 'Nuez Andina',
    category: 'snacks',
    emoji: '🥜',
    desc: 'Mix de nueces, pecanas y almendras tostadas al horno. Sin aceites añadidos.',
    priceUnit: 1800,
    pricePack4: 6480,
    pricePack8: 11880,
    badge: null,
    badgeStyle: '',
  },
  {
    id: 'snack-granola',
    name: 'Granola Artesanal',
    category: 'snacks',
    emoji: '🌿',
    desc: 'Avena horneada con miel de ulmo, quinoa y semillas de maravilla.',
    priceUnit: 2000,
    pricePack4: 7200,
    pricePack8: 13200,
    badge: null,
    badgeStyle: '',
  },
];

const CATEGORIES = ['todos', 'barras', 'snacks'];
const DELIVERY_MIN = 4;
const WHATSAPP_NUMBER = '56950147783';

/* ── ADMIN STATE ────────────────────────────────────────── */
const AdminState = {
  _d: {
    products: null,           // null = use BASE_PRODUCTS
    heroImages: [],           // base64 strings
    productImages: {},        // { productId: [base64, ...] }
    deliveryMethods: { retiro: false, delivery: true },
    paymentMethods: { transferencia: true, efectivo: false, tarjeta: false },
    content: {
      heroTitle: 'Snacks que te\nhacen bien',
      heroSub: 'Compra por unidad o en packs.\nDelivery disponible desde 4 unidades.',
      heroTag: '100% Artesanal · Sin conservantes',
    },
  },

  load() {
    try {
      const s = localStorage.getItem('cds_admin_v2');
      if (s) {
        const p = JSON.parse(s);
        // Deep merge
        if (p.products)       this._d.products = p.products;
        if (p.heroImages)     this._d.heroImages = p.heroImages;
        if (p.productImages)  this._d.productImages = p.productImages;
        if (p.deliveryMethods) Object.assign(this._d.deliveryMethods, p.deliveryMethods);
        if (p.paymentMethods) Object.assign(this._d.paymentMethods, p.paymentMethods);
        if (p.content)        Object.assign(this._d.content, p.content);
      }
    } catch(e) {}
  },

  save() {
    try {
      localStorage.setItem('cds_admin_v2', JSON.stringify(this._d));
    } catch(e) { showToast('⚠️ No se pudo guardar (espacio lleno)', '⚠️'); }
  },

  get(k)     { return this._d[k]; },
  set(k, v)  { this._d[k] = v; this.save(); },
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
  checkoutMethod: 'delivery',
};

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = (n) => `$${n.toLocaleString('es-CL')}`;

function cartTotal()    { return State.cart.reduce((s, i) => s + i.priceTotal, 0); }
function cartUnits()    { return State.cart.reduce((s, i) => s + i.units, 0); }
function deliveryUnlocked() { return cartUnits() >= DELIVERY_MIN; }
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
  const imgs = AdminState.get('productImages')[productId];
  return imgs && imgs.length > 0 ? imgs[0] : null;
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
    Cart.refreshBadge();
  },

  remove(id, type) {
    State.cart = State.cart.filter(i => !(i.id === id && i.type === type));
    Cart.refreshBadge();
  },

  changeQty(id, type, delta) {
    const item = findCartItem(id, type);
    if (!item) return;
    const info = getPackInfo(getProducts().find(p => p.id === id), type);
    item.qty = Math.max(1, item.qty + delta);
    item.units = item.qty * info.units;
    item.priceTotal = item.qty * item.priceUnit;
    Cart.refreshBadge();
  },

  clear() {
    State.cart = [];
    Cart.refreshBadge();
  },

  refreshBadge() {
    const count = State.cart.reduce((s, i) => s + i.qty, 0);
    const badge = $('#cart-badge-nav');
    const footCount = $('#foot-cart-count');
    if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); }
    if (footCount) { footCount.textContent = count; footCount.classList.toggle('hidden', count === 0); }
  },
};

/* ── GLITTER PARTICLES ───────────────────────────────────── */
function spawnGlitter(targetEl) {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const container = document.body;
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const spark = document.createElement('div');
      spark.className = 'glitter-spark';
      const size = 4 + Math.random() * 6;
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height * 0.6;
      const dur = 900 + Math.random() * 800;
      spark.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        animation-duration:${dur}ms;
        opacity:1;
      `;
      container.appendChild(spark);
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
  // Stop after leaving intro view
  const stopOnNavigate = () => { running = false; };
  document.addEventListener('navigated', stopOnNavigate, { once: true });
}

/* ── GLITTER DOTS for pack cards ─────────────────────────── */
function buildGlitterOverlay() {
  const positions = [
    { top: '8%',  left: '12%', cls: 'md' },
    { top: '18%', left: '72%', cls: 'sm' },
    { top: '30%', left: '35%', cls: 'lg' },
    { top: '45%', left: '88%', cls: 'sm' },
    { top: '55%', left: '22%', cls: 'sm' },
    { top: '65%', left: '60%', cls: 'md' },
    { top: '75%', left: '45%', cls: 'sm' },
    { top: '85%', left: '80%', cls: 'lg' },
    { top: '12%', left: '55%', cls: 'sm' },
    { top: '40%', left: '8%',  cls: 'md' },
    { top: '92%', left: '30%', cls: 'sm' },
    { top: '70%', left: '15%', cls: 'sm' },
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
          <strong>Sin mínimo en tienda</strong>
        </span>
        <span class="intro-pill">
          <i class="fa-solid fa-truck pill-icon" style="color:var(--accent)"></i>
          <strong>Delivery desde 4 u.</strong>
        </span>
        <span class="intro-pill">
          <i class="fa-solid fa-box-open pill-icon" style="color:var(--success)"></i>
          <strong>Packs con descuento</strong>
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
    const units = cartUnits();
    const unlocked = deliveryUnlocked();
    const missing = Math.max(0, DELIVERY_MIN - units);
    const progress = Math.min(100, (units / DELIVERY_MIN) * 100);
    const products = getProducts();
    const content = AdminState.get('content');
    const heroImages = AdminState.get('heroImages') || [];

    const filtered = products.filter(p => {
      const matchCat = State.activeCategory === 'todos' || p.category === State.activeCategory;
      const matchSearch = !State.searchQuery ||
        p.name.toLowerCase().includes(State.searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(State.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    const categoryBtns = CATEGORIES.map(c =>
      `<button class="filter-btn ${State.activeCategory === c ? 'active' : ''}"
               onclick="App.setCategory('${c}')">
        ${c === 'todos' ? 'Todos' : c.charAt(0).toUpperCase() + c.slice(1)}
       </button>`
    ).join('');

    const cards = filtered.length > 0
      ? filtered.map(p => Views._productCard(p)).join('')
      : `<div class="no-results">
           <i class="fa-solid fa-magnifying-glass"></i>
           <p>Sin resultados para "<strong>${State.searchQuery}</strong>"</p>
           <button class="btn-ghost" onclick="App.clearSearch()">Limpiar búsqueda</button>
         </div>`;

    const packSection = State.activeCategory !== 'todos' ? '' : Views._packSection();

    // Build hero title lines
    const heroTitleHtml = (content.heroTitle || 'Snacks que te\nhacen bien')
      .split('\n').join('<br>');

    return `
    <div class="view home-view active" id="view-home">

      <!-- HERO with slideshow -->
      <div class="hero${heroImages.length > 0 ? ' has-images' : ''}" id="hero-section">
        <div class="hero-slideshow-bg" id="hero-slideshow-bg"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-tag">
            <i class="fa-solid fa-leaf" style="color:var(--success)"></i>
            <span>${content.heroTag || '100% Artesanal · Sin conservantes'}</span>
          </div>
          <h1 class="hero-title">${heroTitleHtml}</h1>
          <p class="hero-sub">${(content.heroSub || 'Compra por unidad o en packs.').replace('\n', '<br>')}</p>
          <div class="hero-cta">
            <button class="btn-glass" onclick="App.navigate('encargos')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Encargar
            </button>
          </div>
        </div>
      </div>

      <!-- VALOR STRIP — infinite marquee -->
      <div class="valor-strip-outer">
        <div class="valor-strip-inner" id="valor-strip-inner">
          <div class="valor-item"><i class="fa-solid fa-store"></i> Sin mínimo en tienda</div>
          <div class="valor-item"><i class="fa-solid fa-truck"></i> Delivery desde 4 unid.</div>
          <div class="valor-item"><i class="fa-solid fa-tag"></i> Descuento en packs</div>
          <div class="valor-item"><i class="fa-solid fa-pen-to-square"></i> Pedidos personalizados</div>
          <div class="valor-item"><i class="fa-solid fa-store"></i> Sin mínimo en tienda</div>
          <div class="valor-item"><i class="fa-solid fa-truck"></i> Delivery desde 4 unid.</div>
          <div class="valor-item"><i class="fa-solid fa-tag"></i> Descuento en packs</div>
          <div class="valor-item"><i class="fa-solid fa-pen-to-square"></i> Pedidos personalizados</div>
        </div>
      </div>

      <!-- BÚSQUEDA -->
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

      <!-- FILTROS -->
      <div class="filters-wrap">${categoryBtns}</div>

      <!-- DELIVERY INDICATOR -->
      <div class="delivery-banner ${unlocked ? 'unlocked' : ''}">
        <i class="fa-solid fa-${unlocked ? 'circle-check' : 'truck'}"></i>
        <div class="db-text">
          ${unlocked
            ? `<strong>¡Delivery activado! 🎉</strong> Tienes ${units} unidades en tu carrito.`
            : missing > 0
              ? `Te <strong>faltan ${missing} producto${missing > 1 ? 's' : ''}</strong> para activar el delivery`
              : `Agrega productos para activar el delivery (desde 4 unidades)`
          }
        </div>
      </div>

      <!-- GRID -->
      <div class="section-label">Catálogo</div>
      <div class="products-grid">${cards}</div>

      <!-- PACKS DESTACADOS -->
      ${packSection}
    </div>`;
  },

  _productCard(p) {
    const disc4 = saveDiscount('pack4', p);
    const firstImg = getProductFirstImage(p.id);
    const imgContent = firstImg
      ? `<img src="${firstImg}" alt="${p.name}" loading="lazy" />`
      : p.emoji;
    return `
    <div class="product-card" onclick="App.openProduct('${p.id}')">
      ${p.badge ? `<span class="card-badge ${p.badgeStyle}">${p.badge}</span>` : ''}
      <div class="card-img-placeholder">${imgContent}</div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc.substring(0, 55)}…</div>
        <div class="card-pricing">
          <div class="card-price-unit">Unidad <span>${fmt(p.priceUnit)}</span></div>
          <div class="card-price-pack"><i class="fa-solid fa-tag"></i> Pack x4 ${fmt(p.pricePack4)} (−${disc4}%)</div>
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
          <div class="pack-qty">Pack x8</div>
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

    const type = State.selectedType;
    const qty = State.selectedQty;
    const info = getPackInfo(p, type);
    const total = info.price * qty;
    const disc4 = saveDiscount('pack4', p);
    const disc8 = saveDiscount('pack8', p);

    const imgs = AdminState.get('productImages')[p.id] || [];
    const heroContent = imgs.length > 0
      ? `<img src="${imgs[0]}" alt="${p.name}" />`
      : p.emoji;

    const typeBtn = (t, label, qtyLabel, price, save) =>
      `<div class="type-btn ${type === t ? 'selected' : ''}" onclick="App.selectType('${t}')">
        <div class="tb-label">${label}</div>
        <div class="tb-qty">${qtyLabel}</div>
        <div class="tb-price">${fmt(price)}</div>
        ${save ? `<div class="tb-save">−${save}%</div>` : ''}
       </div>`;

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
        <span class="product-category-tag">${p.category}</span>
        <h1 class="product-name">${p.name}</h1>
        <p class="product-desc">${p.desc}</p>
        <div class="type-selector">
          ${typeBtn('unit',  'Unidad', '1 ud.',  p.priceUnit,  0)}
          ${typeBtn('pack4', 'Pack',   '4 uds.', p.pricePack4, disc4)}
          ${typeBtn('pack8', 'Pack',   '8 uds.', p.pricePack8, disc8)}
        </div>
        <div class="counter-row">
          <span class="counter-label">Cantidad</span>
          <div class="counter">
            <button class="counter-btn" onclick="App.changeQty(-1)">−</button>
            <span class="counter-val" id="qty-val">${qty}</span>
            <button class="counter-btn" onclick="App.changeQty(1)">+</button>
          </div>
        </div>
        <div class="total-row">
          <span class="tr-label">Total</span>
          <span class="tr-amount" id="detail-total">${fmt(total)}</span>
        </div>
        <button class="btn-add-full" onclick="App.addToCart()">
          <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito · ${fmt(total)}
        </button>
      </div>
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

    const units = cartUnits();
    const unlocked = deliveryUnlocked();
    const missing = Math.max(0, DELIVERY_MIN - units);
    const progress = Math.min(100, (units / DELIVERY_MIN) * 100);
    const subtotal = cartTotal();

    const items = State.cart.map(item => {
      const firstImg = getProductFirstImage(item.id);
      const emojiContent = firstImg
        ? `<img src="${firstImg}" alt="${item.name}" />`
        : item.emoji;
      return `
      <div class="cart-item">
        <div class="cart-item-emoji">${emojiContent}</div>
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

    const deliveryText = unlocked
      ? `<div class="cart-delivery-text"><i class="fa-solid fa-circle-check"></i> Delivery activado</div>`
      : `<div class="cart-delivery-progress">
           <div class="cdp-text">Te faltan <strong>${missing} producto${missing > 1 ? 's' : ''}</strong> para activar el delivery (${units}/${DELIVERY_MIN})</div>
           <div class="cart-progress-bar"><div class="cart-progress-fill" style="width:${progress}%"></div></div>
         </div>`;

    return `
    <div class="view carrito-view active" id="view-carrito">
      <div class="view-header"><h2>Mi Carrito</h2></div>
      <div class="cart-items">${items}</div>
      <div class="cart-summary">
        <div class="summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${unlocked ? 'A coordinar' : 'No disponible'}</span></div>
        <div class="summary-row total"><span>Total</span><span>${fmt(subtotal)}</span></div>
      </div>
      <button class="cart-checkout-btn mt-16" onclick="App.navigate('checkout')">
        <i class="fa-solid fa-credit-card"></i> Proceder al pago
      </button>
      ${deliveryText}
      <div class="cart-policies">
        🔒 Pago seguro. Aceptamos transferencia bancaria. El pedido se confirma una vez coordinado por WhatsApp.
        Sin cobro anticipado en encargos personalizados. Precios en CLP. Delivery coordinado por zona.
      </div>
    </div>`;
  },

  /* ── CHECKOUT ──────────────────────────── */
  checkout() {
    if (State.cart.length === 0) { App.navigate('carrito'); return ''; }
    const unlocked = deliveryUnlocked();
    const units = cartUnits();
    const missing = Math.max(0, DELIVERY_MIN - units);
    const subtotal = cartTotal();
    const dm = AdminState.get('deliveryMethods');

    const csItems = State.cart.map(i =>
      `<div class="cs-item">
        <span class="cs-item-name">${i.emoji} ${i.name} (${i.typeLabel} ×${i.qty})</span>
        <span class="cs-item-price">${fmt(i.priceTotal)}</span>
       </div>`
    ).join('');

    const retiroUnavailable = !dm.retiro;
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
        <!-- NOMBRE -->
        <div class="field-group">
          <label class="field-label">
            <i class="fa-solid fa-user"></i> Nombre completo <span class="field-required">*</span>
          </label>
          <input type="text" id="ch-nombre" class="field-input"
                 placeholder="Ej: María González" autocomplete="name" />
          <span class="error-msg" id="err-nombre">Ingresa tu nombre</span>
        </div>

        <!-- MÉTODO DE ENTREGA -->
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
              <div class="mo-sub">${deliveryUnavailable ? 'No disponible' : 'Desde 4 u.'}</div>
            </div>
          </div>
          <div class="delivery-blocked-msg ${(State.checkoutMethod === 'delivery' && !unlocked) ? '' : 'hidden'}" id="delivery-blocked-msg">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Delivery disponible solo con 4+ unidades. Te faltan ${missing} producto${missing > 1 ? 's' : ''}.</span>
          </div>
        </div>

        <!-- DIRECCIÓN (solo delivery) -->
        <div class="field-group address-field ${State.checkoutMethod !== 'delivery' ? 'hidden-field' : ''}" id="address-field">
          <label class="field-label">
            <i class="fa-solid fa-map-pin"></i> Dirección de entrega <span class="field-required">*</span>
          </label>
          <input type="text" id="ch-direccion" class="field-input"
                 placeholder="Calle, número, comuna" autocomplete="street-address" />
          <span class="error-msg" id="err-direccion">Ingresa tu dirección</span>
        </div>

        <!-- NOTAS -->
        <div class="field-group">
          <label class="field-label"><i class="fa-solid fa-comment"></i> Notas adicionales</label>
          <textarea id="ch-notas" class="field-input" rows="2"
                    placeholder="Instrucciones especiales, sabores preferidos…"
                    style="resize:none"></textarea>
        </div>

        <!-- RESUMEN -->
        <div class="checkout-summary">
          <div class="cs-header">Resumen del pedido</div>
          <div class="cs-items">${csItems}</div>
          <div class="cs-total"><span>Total</span><span>${fmt(subtotal)}</span></div>
        </div>

        <!-- CONFIRMAR -->
        <button class="btn-confirm" onclick="App.confirmOrder()">
          <i class="fa-solid fa-check-circle"></i> Confirmar pedido · ${fmt(subtotal)}
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
          <span>Los encargos se coordinan directamente por WhatsApp. Cuéntanos qué quieres y te respondemos con disponibilidad y precio. Los pedidos personalizados deben ser evaluados previamente para confirmar su elaboración, ya que al no solicitar depósitos anticipados, debemos asegurarnos de que el costo de producción sea viable para ambas partes. 🤝</span>
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
        <button class="btn-primary" onclick="App.navigate('home')">
          <i class="fa-solid fa-store"></i> Seguir comprando
        </button>
        <button class="btn-secondary" onclick="App.navigate('encargos')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Hacer un encargo
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
      imagenes:  Admin.renderImagenes,
      metodos:   Admin.renderMetodos,
      contenido: Admin.renderContenido,
    };
    if (renderers[tab]) body.innerHTML = renderers[tab]();
  },

  /* -- Tab: PRODUCTOS -- */
  renderProductos() {
    const prods = getProducts();
    const list = prods.map(p => `
      <div class="admin-product-item">
        <div class="admin-p-emoji">${p.emoji}</div>
        <div class="admin-p-info">
          <div class="admin-p-name">${p.name}</div>
          <div class="admin-p-price">Unidad: ${fmt(p.priceUnit)} · Pack4: ${fmt(p.pricePack4)}</div>
        </div>
        <button class="admin-edit-btn" onclick="Admin.editProduct('${p.id}')">
          Editar
        </button>
      </div>`).join('');
    return `
      <div class="admin-section-title">Productos</div>
      ${list}
      <button class="admin-save-btn" onclick="Admin.addProduct()" style="background:var(--primary);margin-top:4px">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </button>`;
  },

  editProduct(id) {
    Admin._editingProductId = id;
    const prods = getProducts();
    const p = prods.find(x => x.id === id);
    if (!p) return;
    const imgs = AdminState.get('productImages')[id] || [];
    const imgThumb = (src, idx) => `
      <div class="admin-img-thumb">
        <img src="${src}" />
        <button class="admin-img-remove" onclick="Admin.removeProductImg('${id}', ${idx})">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`;
    const body = $('#admin-body');
    if (!body) return;
    body.innerHTML = `
      <button class="admin-back-link" onclick="Admin.showTab('productos', $$('.admin-tab')[0])">
        ← Volver a productos
      </button>
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
          <input class="admin-input" id="ep-category" value="${p.category}" /></div>
      </div>
      <div class="admin-field"><label class="admin-label">Badge (ej: Más vendida)</label>
        <input class="admin-input" id="ep-badge" value="${p.badge || ''}" /></div>

      <div class="admin-field">
        <label class="admin-label">Fotos del producto (máx. 10)</label>
        <div class="admin-img-grid" id="product-img-grid">
          ${imgs.map((src, i) => imgThumb(src, i)).join('')}
          ${imgs.length < 10 ? `<div class="admin-add-img-btn" onclick="Admin.triggerProductImgUpload('${id}')">
            <i class="fa-solid fa-plus"></i><span>Agregar</span></div>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="admin-save-btn" onclick="Admin.saveProduct('${id}')">
          <i class="fa-solid fa-check"></i> Guardar cambios
        </button>
        <button style="background:var(--error);color:#fff;border-radius:var(--r-xl);padding:14px;font-size:.85rem;font-weight:600;flex:0.5" onclick="Admin.deleteProduct('${id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
  },

  saveProduct(id) {
    const prods = JSON.parse(JSON.stringify(getProducts()));
    const idx = prods.findIndex(p => p.id === id);
    if (idx < 0) return;
    prods[idx] = {
      ...prods[idx],
      emoji: $('#ep-emoji')?.value || prods[idx].emoji,
      name: $('#ep-name')?.value || prods[idx].name,
      desc: $('#ep-desc')?.value || prods[idx].desc,
      priceUnit: parseInt($('#ep-priceUnit')?.value) || prods[idx].priceUnit,
      pricePack4: parseInt($('#ep-pricePack4')?.value) || prods[idx].pricePack4,
      pricePack8: parseInt($('#ep-pricePack8')?.value) || prods[idx].pricePack8,
      category: $('#ep-category')?.value || prods[idx].category,
      badge: $('#ep-badge')?.value || null,
    };
    AdminState.set('products', prods);
    showToast('Producto guardado ✓', '✅');
    Admin.showTab('productos', $$('.admin-tab')[0]);
  },

  deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    const prods = getProducts().filter(p => p.id !== id);
    AdminState.set('products', prods);
    showToast('Producto eliminado', '🗑️');
    Admin.showTab('productos', $$('.admin-tab')[0]);
  },

  addProduct() {
    const newId = 'prod-' + Date.now();
    const prods = JSON.parse(JSON.stringify(getProducts()));
    prods.push({
      id: newId, name: 'Nuevo Producto', category: 'barras',
      emoji: '🌿', desc: 'Descripción del producto.',
      priceUnit: 1500, pricePack4: 5400, pricePack8: 10000,
      badge: null, badgeStyle: '',
    });
    AdminState.set('products', prods);
    Admin.editProduct(newId);
  },

  triggerProductImgUpload(id) {
    Admin._pendingProductId = id;
    const inp = $('#file-upload-product');
    if (inp) inp.click();
  },

  removeProductImg(id, idx) {
    const imgs = [...(AdminState.get('productImages')[id] || [])];
    imgs.splice(idx, 1);
    const all = { ...AdminState.get('productImages'), [id]: imgs };
    AdminState.set('productImages', all);
    Admin.editProduct(id);
  },

  onProductImagesSelected(input) {
    const id = Admin._pendingProductId;
    if (!id) return;
    const files = Array.from(input.files);
    const existing = [...(AdminState.get('productImages')[id] || [])];
    let remaining = 10 - existing.length;
    const toRead = files.slice(0, remaining);
    let done = 0;
    toRead.forEach(f => {
      const r = new FileReader();
      r.onload = e => {
        existing.push(e.target.result);
        done++;
        if (done === toRead.length) {
          const all = { ...AdminState.get('productImages'), [id]: existing };
          AdminState.set('productImages', all);
          Admin.editProduct(id);
          showToast(`${done} foto${done > 1 ? 's' : ''} guardada${done > 1 ? 's' : ''}`, '📷');
        }
      };
      r.readAsDataURL(f);
    });
    input.value = '';
  },

  /* -- Tab: IMÁGENES -- */
  renderImagenes() {
    const imgs = AdminState.get('heroImages') || [];
    const thumbs = imgs.map((src, i) => `
      <div class="admin-img-thumb">
        <img src="${src}" />
        <button class="admin-img-remove" onclick="Admin.removeHeroImg(${i})">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`).join('');
    return `
      <div class="admin-section-title">Diapositivas del Hero</div>
      <p style="font-size:.82rem;color:var(--text-3);margin-bottom:12px">
        Estas imágenes se muestran como fondo en la pantalla principal. Se cambian automáticamente.
      </p>
      <div class="admin-img-grid" id="hero-img-grid">
        ${thumbs}
        <div class="admin-add-img-btn" onclick="document.getElementById('file-upload-hero').click()">
          <i class="fa-solid fa-plus"></i><span>Agregar</span>
        </div>
      </div>
      <p style="font-size:.75rem;color:var(--text-3);margin-top:8px">
        Máx. 10 imágenes. Se recomiendan fotos horizontales.
      </p>`;
  },

  removeHeroImg(idx) {
    const imgs = [...(AdminState.get('heroImages') || [])];
    imgs.splice(idx, 1);
    AdminState.set('heroImages', imgs);
    Admin.showTab('imagenes', null);
    $$('.admin-tab').forEach(t => { if (t.textContent.includes('Imág')) t.classList.add('active'); });
  },

  onHeroImagesSelected(input) {
    const files = Array.from(input.files);
    const existing = [...(AdminState.get('heroImages') || [])];
    const remaining = 10 - existing.length;
    const toRead = files.slice(0, Math.max(0, remaining));
    if (toRead.length === 0) { showToast('Máximo 10 imágenes', '⚠️'); return; }
    let done = 0;
    toRead.forEach(f => {
      const r = new FileReader();
      r.onload = e => {
        existing.push(e.target.result);
        done++;
        if (done === toRead.length) {
          AdminState.set('heroImages', existing);
          // Re-render tab
          const body = $('#admin-body');
          if (body) body.innerHTML = Admin.renderImagenes();
          showToast(`${done} foto${done > 1 ? 's' : ''} guardada${done > 1 ? 's' : ''}`, '🖼️');
        }
      };
      r.readAsDataURL(f);
    });
    input.value = '';
  },

  /* -- Tab: MÉTODOS -- */
  renderMetodos() {
    const dm = AdminState.get('deliveryMethods');
    const pm = AdminState.get('paymentMethods');
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
      ${toggle('delivery', dm, '🚚 Delivery', 'Envío a domicilio desde 4 unidades', 'Admin.toggleDelivery')}
      ${toggle('retiro', dm, '🏪 Retiro en tienda', 'El cliente retira en la dirección acordada', 'Admin.toggleDelivery')}
      <div class="admin-section-title" style="margin-top:16px">Métodos de Pago</div>
      <p style="font-size:.78rem;color:var(--text-3);margin-bottom:8px">Los métodos desactivados aparecen tachados en el checkout.</p>
      ${toggle('transferencia', pm, '🏦 Transferencia bancaria', 'Pago previo a la entrega', 'Admin.togglePayment')}
      ${toggle('efectivo', pm, '💵 Efectivo', 'Solo para retiro en tienda', 'Admin.togglePayment')}
      ${toggle('tarjeta', pm, '💳 Tarjeta (Redcompra/crédito)', 'Disponible con POS móvil', 'Admin.togglePayment')}`;
  },

  toggleDelivery(key, val) {
    const dm = { ...AdminState.get('deliveryMethods'), [key]: val };
    AdminState.set('deliveryMethods', dm);
    // Auto-select delivery if retiro is disabled and current method is retiro
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

  /* -- Tab: CONTENIDO -- */
  renderContenido() {
    const c = AdminState.get('content');
    return `
      <div class="admin-section-title">Textos de la Web</div>
      <div class="admin-field">
        <label class="admin-label">Título Hero (usa \\n para salto)</label>
        <input class="admin-input" id="ct-heroTitle" value="${c.heroTitle}" />
      </div>
      <div class="admin-field">
        <label class="admin-label">Subtítulo Hero</label>
        <textarea class="admin-input" id="ct-heroSub" rows="2" style="resize:none">${c.heroSub}</textarea>
      </div>
      <div class="admin-field">
        <label class="admin-label">Tag del Hero (pequeño)</label>
        <input class="admin-input" id="ct-heroTag" value="${c.heroTag}" />
      </div>
      <button class="admin-save-btn" onclick="Admin.saveContent()">
        <i class="fa-solid fa-check"></i> Guardar contenido
      </button>`;
  },

  saveContent() {
    const c = {
      heroTitle: $('#ct-heroTitle')?.value || AdminState.get('content').heroTitle,
      heroSub:   $('#ct-heroSub')?.value   || AdminState.get('content').heroSub,
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
      confirmacion: Views.confirmacion,
    };

    if (viewMap[view]) {
      app.innerHTML = viewMap[view]();
    }

    const viewEl = app.querySelector('.view');
    if (viewEl) viewEl.scrollTop = 0;

    if (param && view === 'producto') {
      State.selectedType = param;
    }

    Cart.refreshBadge();

    // Post-render hooks
    if (view === 'intro')  App._initIntro();
    if (view === 'home')   App._initHome();
  },

  /* ── INTRO ANIMATIONS ──────────────────── */
  _introWordsTimer: null,
  _initIntro() {
    // Typewriter
    const subtitle = $('#intro-subtitle');
    const fullText = 'Barras y snacks artesanales hechos con amor.'<br>'Sin conservantes.';
    if (subtitle) {
      let i = 0;
      subtitle.classList.add('typewriter-cursor');
      const type = () => {
        if (i <= fullText.length) {
          subtitle.textContent = fullText.slice(0, i);
          i++;
          setTimeout(type, i === fullText.length ? 0 : 32);
        } else {
          subtitle.classList.remove('typewriter-cursor');
        }
      };
      setTimeout(type, 700);
    }

    // Cycling words
    const words = ['✨ Snacks Saludables', '🌾 Barras de Energía', '🍫 Cacao Profundo', '🥭 Tropical Mix', '🥜 Nuez Andina', '🌿 Granola Artesanal', '🫐 Frutos del Bosque', '❤️ Hecho con Amor'];
    let wi = 0;
    const tagEl = $('#intro-tag-word');
    if (tagEl) {
      clearInterval(App._introWordsTimer);
      App._introWordsTimer = setInterval(() => {
        if (!document.body.contains(tagEl)) { clearInterval(App._introWordsTimer); return; }
        wi = (wi + 1) % words.length;
        tagEl.style.opacity = '0';
        setTimeout(() => {
          tagEl.textContent = words[wi];
          tagEl.style.opacity = '1';
        }, 300);
      }, 2000);
    }

    // Glitter rain on title
    setTimeout(() => {
      const title = $('#intro-title');
      if (title) startGlitterRain(title);
    }, 800);
  },

  /* ── HOME ANIMATIONS ────────────────────── */
  _heroSlideshowTimer: null,
  _initHome() {
    const heroImages = AdminState.get('heroImages') || [];
    if (heroImages.length > 0) {
      const ss = $('#hero-slideshow-bg');
      const hero = $('#hero-section');
      if (ss) {
        ss.innerHTML = heroImages.map((src, i) =>
          `<div class="hs-slide${i === 0 ? ' active' : ''}" style="background-image:url('${src}')"></div>`
        ).join('');
        if (heroImages.length > 1) {
          let cur = 0;
          clearInterval(App._heroSlideshowTimer);
          App._heroSlideshowTimer = setInterval(() => {
            const slides = ss.querySelectorAll('.hs-slide');
            if (!slides.length) { clearInterval(App._heroSlideshowTimer); return; }
            slides[cur].classList.remove('active');
            cur = (cur + 1) % slides.length;
            slides[cur].classList.add('active');
          }, 4500);
        }
      }
    }
  },

  /* ── INTRO BUTTON ANIMATION ─────────────── */
  animateIntroBtn() {
    const btn = $('#btn-ver-productos');
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
    const overlay = $('#ham-overlay');
    const isOpen = menu && menu.classList.contains('open');
    if (isOpen) { App.closeMenu(); } else { App.openMenu(); }
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
    const p = State.selectedProduct;
    const info = getPackInfo(p, State.selectedType);
    const total = info.price * State.selectedQty;
    const qtyEl = $('#qty-val');
    const totalEl = $('#detail-total');
    if (qtyEl)   qtyEl.textContent = State.selectedQty;
    if (totalEl) totalEl.textContent = fmt(total);
    const addBtn = $('.btn-add-full');
    if (addBtn)  addBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Agregar al carrito · ${fmt(total)}`;
  },

  addToCart() {
    const p = State.selectedProduct;
    if (!p) return;
    Cart.add(p, State.selectedType, State.selectedQty);
    showToast(`${p.name} agregado al carrito`, '🛍️');
    App.navigate('home');
  },

  quickAdd(productId) {
    const p = getProducts().find(x => x.id === productId);
    if (!p) return;
    Cart.add(p, 'pack4', 1);
    showToast(`Pack x4 de ${p.name} agregado`, '✓');
    App.navigate('home');
  },

  /* ── SEARCH & FILTER ─────────────────────── */
  onSearch(val) {
    State.searchQuery = val;
    const clearBtn = $('#search-clear');
    if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
    App._refreshHome();
  },

  clearSearch() {
    State.searchQuery = '';
    App.navigate('home');
  },

  setCategory(cat) {
    State.activeCategory = cat;
    App.navigate('home');
  },

  _refreshHome() {
    App.navigate('home');
    const inp = $('#search-input');
    if (inp) { inp.value = State.searchQuery; inp.focus(); inp.setSelectionRange(9999, 9999); }
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
    if (method === 'retiro' && dm.retiro) {
      const opts = $$('.method-opt');
      if (opts[0]) opts[0].classList.add('selected');
    }
    if (method === 'delivery' && dm.delivery) {
      const opts = $$('.method-opt');
      if (opts[1]) opts[1].classList.add('selected');
    }
    const addrField = $('#address-field');
    const blockedMsg = $('#delivery-blocked-msg');
    const unlocked = deliveryUnlocked();
    if (addrField)   addrField.classList.toggle('hidden-field', method !== 'delivery');
    if (blockedMsg)  blockedMsg.classList.toggle('hidden', !(method === 'delivery' && !unlocked));
  },

  confirmOrder() {
    const nombre = $('#ch-nombre');
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
      if (!deliveryUnlocked()) {
        showToast('Delivery requiere 4+ unidades', '🚫');
        valid = false;
      } else if (direccion && !direccion.value.trim()) {
        direccion.classList.add('error');
        $('#err-direccion')?.classList.add('show');
        valid = false;
      } else if (direccion) {
        direccion.classList.remove('error');
        $('#err-direccion')?.classList.remove('show');
      }
    }

    if (!valid) return;

    // Build WhatsApp message as receipt
    const nombreVal  = nombre.value.trim();
    const metodo     = State.checkoutMethod;
    const dirVal     = metodo === 'delivery' ? (direccion?.value.trim() || 'Por coordinar') : 'Retiro en tienda';
    const notasVal   = $('#ch-notas')?.value.trim() || '';
    const now        = new Date();
    const fecha      = now.toLocaleDateString('es-CL');
    const hora       = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const itemLines = State.cart.map(i =>
      `  ${i.emoji} *${i.name}* — ${i.typeLabel} ×${i.qty}: ${fmt(i.priceTotal)}`
    ).join('\n');

    const total = fmt(cartTotal());

    const msg = encodeURIComponent(
      `🌿 *PEDIDO — Círculo de Sabores*\n` +
      `📅 ${fecha} · ${hora}\n` +
      `─────────────────────\n` +
      `👤 *Cliente:* ${nombreVal}\n` +
      `📦 *Entrega:* ${metodo === 'delivery' ? `Delivery → ${dirVal}` : '🏪 Retiro en tienda'}\n` +
      `─────────────────────\n` +
      `🛒 *Detalle:*\n${itemLines}\n` +
      `─────────────────────\n` +
      `💰 *Total: ${total}*\n` +
      (notasVal ? `\n📝 *Notas:* ${notasVal}\n` : '') +
      `\n_Enviado desde la tienda web_`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    Cart.clear();
    App.navigate('confirmacion');
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
    } else {
      nombre.classList.remove('error');
      $('#err-enc-nombre')?.classList.remove('show');
    }

    if (!desc || !desc.value.trim()) {
      if (desc) desc.classList.add('error');
      $('#err-enc-desc')?.classList.add('show');
      valid = false;
    } else {
      desc.classList.remove('error');
      $('#err-enc-desc')?.classList.remove('show');
    }

    if (!valid) return;

    const nombreVal   = nombre.value.trim();
    const descVal     = desc.value.trim();
    const fechaVal    = $('#enc-fecha')?.value  ? `\n📅 Fecha necesaria: ${$('#enc-fecha').value}` : '';
    const cantidadVal = $('#enc-cantidad')?.value ? `\n🔢 Cantidad aprox: ${$('#enc-cantidad').value}` : '';

    const msg = encodeURIComponent(
      `🌿 *Encargo — Círculo de Sabores*\n\n` +
      `👤 Nombre: ${nombreVal}\n` +
      `📝 Descripción: ${descVal}` +
      fechaVal + cantidadVal +
      `\n\n_Enviado desde la tienda web_`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  },

  /* ── INIT ────────────────────────────────── */
  init() {
    AdminState.load();
    // Ensure default checkout method respects admin settings
    const dm = AdminState.get('deliveryMethods');
    if (!dm.delivery && dm.retiro) State.checkoutMethod = 'retiro';
    else if (dm.delivery) State.checkoutMethod = 'delivery';
    App.navigate('intro');
    Cart.refreshBadge();
  },
};

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', App.init);
