// Estado global de la SPA.
const state = {
  currentView: 'intro',
  products: [
    { id: 1, name: 'Brownie Proteico', category: 'Saludables', unit: 1800, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Galleta Avena Cacao', category: 'Snacks', unit: 1500, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Trufa Sin Azúcar', category: 'Dulces', unit: 1300, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Barra Coco Almond', category: 'Saludables', unit: 1700, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=600&q=80' }
  ],
  filter: 'Todos',
  search: '',
  selectedProductId: null,
  selectedPack: 'pack4',
  selectedQty: 1,
  cart: []
};

const PACKS = {
  unidad: { units: 1, multiplier: 1, label: 'Unidad' },
  pack4: { units: 4, multiplier: 0.9, label: 'Pack 4 (ahorro)' },
  pack8: { units: 8, multiplier: 0.8, label: 'Pack 8 (mejor precio)' }
};

const views = [...document.querySelectorAll('.view')];
const tags = ['Todos', 'Saludables', 'Snacks', 'Dulces'];

function goToView(viewName) {
  state.currentView = viewName;
  views.forEach((view) => view.classList.toggle('active', view.dataset.view === viewName));
  if (viewName === 'carrito') renderCart();
  if (viewName === 'checkout') updateCheckoutRules();
}

function currency(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
}

function packPrice(product, packKey) {
  const pack = PACKS[packKey];
  return Math.round(product.unit * pack.units * pack.multiplier);
}

function renderFilters() {
  const container = document.getElementById('tagFilters');
  container.innerHTML = tags
    .map((tag) => `<button class="tag ${state.filter === tag ? 'active' : ''}" data-tag="${tag}">${tag}</button>`)
    .join('');
}

function filteredProducts() {
  return state.products.filter((p) => {
    const byTag = state.filter === 'Todos' || p.category === state.filter;
    const bySearch = p.name.toLowerCase().includes(state.search.toLowerCase());
    return byTag && bySearch;
  });
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = filteredProducts()
    .map((p) => `
      <article class="product-card">
        <img src="${p.image}" alt="${p.name}" />
        <strong>${p.name}</strong>
        <small>Unidad: ${currency(packPrice(p, 'unidad'))}</small>
        <small class="price-pack">Pack 4: ${currency(packPrice(p, 'pack4'))}</small>
        <small class="price-pack">Pack 8: ${currency(packPrice(p, 'pack8'))}</small>
        <div class="card-actions">
          <button class="btn" data-detail="${p.id}">Ver detalle</button>
          <button class="btn primary" data-quick="${p.id}">Quick Add Pack 4</button>
        </div>
      </article>`)
    .join('');
}

function addToCart(productId, packKey, quantity = 1) {
  const existing = state.cart.find((item) => item.productId === productId && item.packKey === packKey);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ productId, packKey, quantity });
  }
  updateFloatingCart();
  updateDeliveryProgress();
}

function cartMetrics() {
  const totals = state.cart.reduce(
    (acc, item) => {
      const product = state.products.find((p) => p.id === item.productId);
      const pack = PACKS[item.packKey];
      acc.units += pack.units * item.quantity;
      acc.amount += packPrice(product, item.packKey) * item.quantity;
      return acc;
    },
    { units: 0, amount: 0 }
  );
  totals.deliveryEnabled = totals.units >= 4;
  return totals;
}

function updateFloatingCart() {
  const totals = cartMetrics();
  document.getElementById('floatingQty').textContent = `${totals.units} u`;
  document.getElementById('floatingTotal').textContent = currency(totals.amount);
}

function updateDeliveryProgress() {
  const totals = cartMetrics();
  const remaining = Math.max(0, 4 - totals.units);
  const text = remaining > 0
    ? `Te falta ${remaining} producto${remaining > 1 ? 's' : ''} para activar delivery`
    : '¡Delivery activado!';
  document.getElementById('deliveryProgressText').textContent = text;
  document.getElementById('deliveryProgressFill').style.width = `${Math.min((totals.units / 4) * 100, 100)}%`;
}

function renderProductView(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  state.selectedProductId = productId;
  state.selectedPack = 'pack4';
  state.selectedQty = 1;

  const detail = document.getElementById('productDetail');
  detail.innerHTML = `
    <img src="${product.image}" alt="${product.name}" style="width:100%;height:160px;object-fit:cover;border-radius:16px;"/>
    <h2>${product.name}</h2>
    <p>Elige formato para maximizar ahorro:</p>
    <div class="stack">
      ${Object.entries(PACKS)
        .map(([key, pack]) => `
          <label class="cart-line">
            <input type="radio" name="pack" value="${key}" ${key === 'pack4' ? 'checked' : ''} />
            ${pack.label}: <strong class="${key === 'unidad' ? '' : 'price-pack'}">${currency(packPrice(product, key))}</strong>
          </label>`)
        .join('')}
    </div>
    <div class="qty-control">
      <button data-qty="minus">-</button>
      <strong id="detailQty">1</strong>
      <button data-qty="plus">+</button>
    </div>
    <button class="btn primary" data-action="add-detail">Agregar al carrito</button>
  `;

  goToView('producto');
}

function renderCart() {
  const list = document.getElementById('cartList');
  if (state.cart.length === 0) {
    list.innerHTML = '<p>Tu carrito está vacío.</p>';
  } else {
    list.innerHTML = state.cart
      .map((item, idx) => {
        const product = state.products.find((p) => p.id === item.productId);
        const price = packPrice(product, item.packKey) * item.quantity;
        return `
          <div class="cart-line">
            <strong>${product.name}</strong>
            <p>${PACKS[item.packKey].label}</p>
            <div class="qty-control">
              <button data-cart-idx="${idx}" data-cart-op="minus">-</button>
              <span>${item.quantity}</span>
              <button data-cart-idx="${idx}" data-cart-op="plus">+</button>
            </div>
            <strong>${currency(price)}</strong>
          </div>`;
      })
      .join('');
  }

  const totals = cartMetrics();
  document.getElementById('cartUnits').textContent = totals.units;
  document.getElementById('cartTotal').textContent = currency(totals.amount);
  document.getElementById('deliveryStatus').textContent = totals.deliveryEnabled
    ? 'Delivery habilitado ✅'
    : 'Delivery bloqueado: agrega mínimo 4 unidades.';
}

function updateCheckoutRules() {
  const totals = cartMetrics();
  const deliveryWrap = document.getElementById('deliveryRadioWrap');
  const deliveryInput = deliveryWrap.querySelector('input');
  deliveryInput.disabled = !totals.deliveryEnabled;

  if (!totals.deliveryEnabled) {
    deliveryInput.checked = false;
    document.querySelector('input[value="retiro"]').checked = true;
  }

  document.getElementById('checkoutRule').textContent = totals.deliveryEnabled
    ? 'Puedes elegir retiro o delivery.'
    : 'Delivery se habilita desde 4 unidades (1 pack mínimo).';
}

function setupEvents() {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => goToView(btn.dataset.nav));
  });

  document.getElementById('floatingCart').addEventListener('click', () => goToView('carrito'));

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderCatalog();
  });

  document.addEventListener('click', (e) => {
    const tag = e.target.dataset.tag;
    if (tag) {
      state.filter = tag;
      renderFilters();
      renderCatalog();
    }

    if (e.target.dataset.detail) renderProductView(Number(e.target.dataset.detail));

    if (e.target.dataset.quick) {
      addToCart(Number(e.target.dataset.quick), 'pack4', 1);
    }

    if (e.target.dataset.action === 'go-checkout') goToView('checkout');
    if (e.target.dataset.action === 'go-home') goToView('home');
    if (e.target.dataset.action === 'jump-catalog') document.getElementById('searchInput').focus();

    if (e.target.dataset.qty === 'plus') state.selectedQty += 1;
    if (e.target.dataset.qty === 'minus') state.selectedQty = Math.max(1, state.selectedQty - 1);
    const qtyLabel = document.getElementById('detailQty');
    if (qtyLabel) qtyLabel.textContent = state.selectedQty;

    if (e.target.name === 'pack') state.selectedPack = e.target.value;

    if (e.target.dataset.action === 'add-detail' && state.selectedProductId) {
      const checkedPack = document.querySelector('input[name="pack"]:checked');
      addToCart(state.selectedProductId, checkedPack ? checkedPack.value : state.selectedPack, state.selectedQty);
      goToView('carrito');
    }

    if (e.target.dataset.cartOp) {
      const idx = Number(e.target.dataset.cartIdx);
      if (e.target.dataset.cartOp === 'plus') state.cart[idx].quantity += 1;
      if (e.target.dataset.cartOp === 'minus') state.cart[idx].quantity -= 1;
      state.cart = state.cart.filter((line) => line.quantity > 0);
      renderCart();
      updateFloatingCart();
      updateDeliveryProgress();
    }
  });

  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const totals = cartMetrics();
    const method = new FormData(e.target).get('method');
    if (method === 'delivery' && !totals.deliveryEnabled) {
      alert('Delivery solo disponible desde 4 unidades.');
      return;
    }
    goToView('confirmacion');
  });

  document.getElementById('customOrderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const text = `Hola Círculo de Sabores, quiero encargar:%0AProducto: ${data.get('type')}%0ACantidad: ${data.get('qty')}%0AFecha: ${data.get('date')}%0ANotas: ${data.get('notes') || '-'} `;
    window.open(`https://wa.me/56900000000?text=${text}`, '_blank');
  });
}

function init() {
  renderFilters();
  renderCatalog();
  updateFloatingCart();
  updateDeliveryProgress();
  setupEvents();

  setTimeout(() => {
    const intro = document.querySelector('[data-view="intro"]');
    intro.classList.add('fade-out');
    setTimeout(() => goToView('home'), 550);
  }, 2000);
}

init();
