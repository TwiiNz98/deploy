const state = {
  currentView: 'intro',
  filter: 'Todos',
  search: '',
  selectedProductId: null,
  selectedPack: 'pack4',
  selectedQty: 1,
  catalogPage: 1,
  productsPerPage: 4,
  cart: [],
  products: [
    {
      id: 1,
      name: 'Brownie Proteico',
      category: 'Saludables',
      unit: 1800,
      image:
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Galleta Avena Cacao',
      category: 'Snacks',
      unit: 1500,
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Trufa Sin Azúcar',
      category: 'Dulces',
      unit: 1300,
      image:
        'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Barra Coco Almond',
      category: 'Saludables',
      unit: 1700,
      image:
        'https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      name: 'Mini Muffin Fit',
      category: 'Dulces',
      unit: 1600,
      image:
        'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 6,
      name: 'Snack Nuez Dátil',
      category: 'Snacks',
      unit: 1900,
      image:
        'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&w=600&q=80'
    }
  ]
};

const PACKS = {
  unidad: { units: 1, multiplier: 1, label: 'Unidad' },
  pack4: { units: 4, multiplier: 0.9, label: 'Pack 4 (ahorro)' },
  pack8: { units: 8, multiplier: 0.8, label: 'Pack 8 (mejor precio)' }
};

const TAGS = ['Todos', 'Saludables', 'Snacks', 'Dulces'];
const WHATSAPP_NUMBER = '56900000000';

const dom = {
  views: [...document.querySelectorAll('.view')],
  tagFilters: document.getElementById('tagFilters'),
  catalogGrid: document.getElementById('catalogGrid'),
  searchInput: document.getElementById('searchInput'),
  deliveryProgressText: document.getElementById('deliveryProgressText'),
  deliveryProgressFill: document.getElementById('deliveryProgressFill'),
  floatingCart: document.getElementById('floatingCart'),
  floatingQty: document.getElementById('floatingQty'),
  floatingTotal: document.getElementById('floatingTotal'),
  productDetail: document.getElementById('productDetail'),
  cartList: document.getElementById('cartList'),
  cartUnits: document.getElementById('cartUnits'),
  cartTotal: document.getElementById('cartTotal'),
  deliveryStatus: document.getElementById('deliveryStatus'),
  checkoutForm: document.getElementById('checkoutForm'),
  customOrderForm: document.getElementById('customOrderForm'),
  checkoutRule: document.getElementById('checkoutRule'),
  deliveryRadioWrap: document.getElementById('deliveryRadioWrap'),
  prevPageBtn: document.getElementById('prevPageBtn'),
  nextPageBtn: document.getElementById('nextPageBtn'),
  catalogPageText: document.getElementById('catalogPageText'),
  confirmOrderBtn: document.getElementById('confirmOrderBtn')
};

function currency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getProductById(id) {
  return state.products.find((product) => product.id === id) || null;
}

function packPrice(product, packKey) {
  const pack = PACKS[packKey];
  return Math.round(product.unit * pack.units * pack.multiplier);
}

function filteredProducts() {
  return state.products.filter((product) => {
    const matchesTag = state.filter === 'Todos' || product.category === state.filter;
    const matchesSearch = product.name.toLowerCase().includes(state.search.trim().toLowerCase());
    return matchesTag && matchesSearch;
  });
}

function getPaginatedProducts() {
  const items = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(items.length / state.productsPerPage));
  state.catalogPage = Math.min(state.catalogPage, totalPages);
  const start = (state.catalogPage - 1) * state.productsPerPage;
  return {
    pageItems: items.slice(start, start + state.productsPerPage),
    totalPages,
    totalItems: items.length
  };
}

function cartMetrics() {
  const totals = state.cart.reduce(
    (acc, line) => {
      const product = getProductById(line.productId);
      const pack = PACKS[line.packKey];
      if (!product || !pack) return acc;
      acc.units += pack.units * line.quantity;
      acc.amount += packPrice(product, line.packKey) * line.quantity;
      return acc;
    },
    { units: 0, amount: 0 }
  );

  totals.deliveryEnabled = totals.units >= 4;
  return totals;
}

function setActiveView(viewName) {
  state.currentView = viewName;
  dom.views.forEach((view) => view.classList.toggle('active', view.dataset.view === viewName));

  if (viewName === 'carrito') renderCart();
  if (viewName === 'checkout') updateCheckoutRules();
}

function renderFilters() {
  dom.tagFilters.innerHTML = TAGS.map(
    (tag) =>
      `<button class="tag ${state.filter === tag ? 'active' : ''}" data-tag="${tag}" type="button">${tag}</button>`
  ).join('');
}

function renderCatalog() {
  const { pageItems, totalPages, totalItems } = getPaginatedProducts();

  if (!totalItems) {
    dom.catalogGrid.innerHTML = '<p class="cart-line">No encontramos productos con ese filtro.</p>';
  } else {
    dom.catalogGrid.innerHTML = pageItems
      .map((product) => {
        const safeName = escapeHtml(product.name);
        return `
        <article class="product-card">
          <img src="${product.image}" alt="${safeName}" loading="lazy" />
          <strong>${safeName}</strong>
          <small>Unidad: ${currency(packPrice(product, 'unidad'))}</small>
          <small class="price-pack">Pack 4: ${currency(packPrice(product, 'pack4'))}</small>
          <small class="price-pack">Pack 8: ${currency(packPrice(product, 'pack8'))}</small>
          <div class="card-actions">
            <button class="btn" data-detail="${product.id}" type="button">Ver detalle</button>
            <button class="btn primary" data-quick="${product.id}" type="button">Quick Add Pack 4</button>
          </div>
        </article>`;
      })
      .join('');
  }

  dom.catalogPageText.textContent = `Página ${state.catalogPage} de ${totalPages}`;
  dom.prevPageBtn.disabled = state.catalogPage <= 1;
  dom.nextPageBtn.disabled = state.catalogPage >= totalPages;
}

function renderDeliveryProgress() {
  const totals = cartMetrics();
  const remaining = Math.max(0, 4 - totals.units);
  dom.deliveryProgressText.textContent =
    remaining > 0
      ? `Te falta ${remaining} producto${remaining > 1 ? 's' : ''} para activar delivery`
      : '¡Delivery activado!';
  dom.deliveryProgressFill.style.width = `${Math.min((totals.units / 4) * 100, 100)}%`;
}

function renderFloatingCart() {
  const totals = cartMetrics();
  dom.floatingQty.textContent = `${totals.units} u`;
  dom.floatingTotal.textContent = currency(totals.amount);
}

function renderProductView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  state.selectedProductId = product.id;
  state.selectedPack = 'pack4';
  state.selectedQty = 1;

  dom.productDetail.innerHTML = `
    <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width:100%;height:160px;object-fit:cover;border-radius:16px;" />
    <h2>${escapeHtml(product.name)}</h2>
    <p>Elige formato para maximizar ahorro:</p>
    <div class="stack">
      ${Object.entries(PACKS)
        .map(
          ([key, pack]) => `
          <label class="cart-line">
            <input type="radio" name="pack" value="${key}" ${key === 'pack4' ? 'checked' : ''} />
            ${pack.label}: <strong class="${key !== 'unidad' ? 'price-pack' : ''}">${currency(
            packPrice(product, key)
          )}</strong>
          </label>`
        )
        .join('')}
    </div>
    <div class="qty-control">
      <button data-qty="minus" type="button">-</button>
      <strong id="detailQty">1</strong>
      <button data-qty="plus" type="button">+</button>
    </div>
    <button class="btn primary" data-action="add-detail" type="button">Agregar al carrito</button>
  `;

  setActiveView('producto');
}

function addToCart(productId, packKey, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1 || !PACKS[packKey] || !getProductById(productId)) return;

  const current = state.cart.find((line) => line.productId === productId && line.packKey === packKey);
  if (current) current.quantity += quantity;
  else state.cart.push({ productId, packKey, quantity });

  renderFloatingCart();
  renderDeliveryProgress();
}

function renderCart() {
  if (!state.cart.length) {
    dom.cartList.innerHTML = '<p class="cart-line">Tu carrito está vacío.</p>';
  } else {
    dom.cartList.innerHTML = state.cart
      .map((line, idx) => {
        const product = getProductById(line.productId);
        if (!product) return '';
        const subtotal = packPrice(product, line.packKey) * line.quantity;
        return `
          <div class="cart-line">
            <strong>${escapeHtml(product.name)}</strong>
            <p>${PACKS[line.packKey].label}</p>
            <div class="qty-control">
              <button data-cart-op="minus" data-cart-idx="${idx}" type="button">-</button>
              <span>${line.quantity}</span>
              <button data-cart-op="plus" data-cart-idx="${idx}" type="button">+</button>
            </div>
            <strong>${currency(subtotal)}</strong>
          </div>`;
      })
      .join('');
  }

  const totals = cartMetrics();
  dom.cartUnits.textContent = String(totals.units);
  dom.cartTotal.textContent = currency(totals.amount);
  dom.deliveryStatus.textContent = totals.deliveryEnabled
    ? 'Delivery habilitado ✅'
    : 'Delivery bloqueado: agrega mínimo 4 unidades.';
}

function updateCheckoutRules() {
  const totals = cartMetrics();
  const deliveryInput = dom.deliveryRadioWrap.querySelector('input');
  deliveryInput.disabled = !totals.deliveryEnabled;
  dom.confirmOrderBtn.disabled = totals.units === 0;

  if (!totals.deliveryEnabled) {
    deliveryInput.checked = false;
    dom.checkoutForm.querySelector('input[value="retiro"]').checked = true;
  }

  dom.checkoutRule.textContent = totals.units === 0
    ? 'Agrega productos antes de confirmar tu pedido.'
    : totals.deliveryEnabled
      ? 'Puedes elegir retiro o delivery.'
      : 'Delivery se habilita desde 4 unidades (1 pack mínimo).';
}

function updateDetailQuantityLabel() {
  const qty = document.getElementById('detailQty');
  if (qty) qty.textContent = String(state.selectedQty);
}

function adjustCartLine(index, operation) {
  const line = state.cart[index];
  if (!line) return;
  if (operation === 'plus') line.quantity += 1;
  if (operation === 'minus') line.quantity -= 1;
  state.cart = state.cart.filter((cartLine) => cartLine.quantity > 0);
  renderCart();
  renderFloatingCart();
  renderDeliveryProgress();
}

function handleMainClick(event) {
  const target = event.target;

  if (target.dataset.nav) setActiveView(target.dataset.nav);

  if (target.dataset.action === 'go-home') setActiveView('home');
  if (target.dataset.action === 'go-checkout') setActiveView('checkout');
  if (target.dataset.action === 'focus-search') {
    setActiveView('home');
    dom.searchInput.focus();
  }

  if (target.dataset.tag) {
    state.filter = target.dataset.tag;
    state.catalogPage = 1;
    renderFilters();
    renderCatalog();
  }

  if (target.dataset.detail) renderProductView(Number(target.dataset.detail));
  if (target.dataset.quick) addToCart(Number(target.dataset.quick), 'pack4', 1);

  if (target.dataset.qty === 'plus') {
    state.selectedQty += 1;
    updateDetailQuantityLabel();
  }

  if (target.dataset.qty === 'minus') {
    state.selectedQty = Math.max(1, state.selectedQty - 1);
    updateDetailQuantityLabel();
  }

  if (target.dataset.action === 'add-detail' && state.selectedProductId) {
    addToCart(state.selectedProductId, state.selectedPack, state.selectedQty);
    setActiveView('carrito');
  }

  if (target.dataset.cartOp) {
    adjustCartLine(Number(target.dataset.cartIdx), target.dataset.cartOp);
  }
}

function handleMainChange(event) {
  const target = event.target;
  if (target.name === 'pack' && PACKS[target.value]) {
    state.selectedPack = target.value;
  }
}

function validateRequiredText(value, maxLen) {
  const clean = String(value || '').trim();
  return clean.length > 0 && clean.length <= maxLen;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const totals = cartMetrics();

  if (!totals.units) {
    alert('Tu carrito está vacío.');
    return;
  }

  const data = new FormData(dom.checkoutForm);
  const name = data.get('name');
  const address = data.get('address');
  const method = data.get('method');

  if (!validateRequiredText(name, 60) || !validateRequiredText(address, 120)) {
    alert('Completa nombre y dirección correctamente.');
    return;
  }

  if (method === 'delivery' && !totals.deliveryEnabled) {
    alert('Delivery solo disponible desde 4 unidades.');
    return;
  }

  setActiveView('confirmacion');
}

function handleCustomOrderSubmit(event) {
  event.preventDefault();
  const data = new FormData(dom.customOrderForm);

  const type = String(data.get('type') || '').trim();
  const qty = Number(data.get('qty'));
  const date = String(data.get('date') || '').trim();
  const notes = String(data.get('notes') || '').trim();

  if (!validateRequiredText(type, 80) || !Number.isFinite(qty) || qty < 1 || qty > 999 || !date) {
    alert('Completa los datos del encargo correctamente.');
    return;
  }

  const message = [
    'Hola Círculo de Sabores, quiero encargar:',
    `Producto: ${type}`,
    `Cantidad: ${qty}`,
    `Fecha: ${date}`,
    `Notas: ${notes || '-'}`
  ].join('\n');

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(link, '_blank', 'noopener,noreferrer');
}

function setupEvents() {
  document.addEventListener('click', handleMainClick);
  document.addEventListener('change', handleMainChange);

  dom.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    state.catalogPage = 1;
    renderCatalog();
  });

  dom.prevPageBtn.addEventListener('click', () => {
    state.catalogPage = Math.max(1, state.catalogPage - 1);
    renderCatalog();
  });

  dom.nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts().length / state.productsPerPage));
    state.catalogPage = Math.min(totalPages, state.catalogPage + 1);
    renderCatalog();
  });

  dom.floatingCart.addEventListener('click', () => setActiveView('carrito'));
  dom.floatingCart.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveView('carrito');
    }
  });

  dom.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  dom.customOrderForm.addEventListener('submit', handleCustomOrderSubmit);
}

function init() {
  renderFilters();
  renderCatalog();
  renderFloatingCart();
  renderDeliveryProgress();
  updateCheckoutRules();
  setupEvents();

  setTimeout(() => {
    document.querySelector('[data-view="intro"]').classList.add('fade-out');
    setTimeout(() => setActiveView('home'), 550);
  }, 2000);
}

init();
