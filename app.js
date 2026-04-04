(() => {
  'use strict';

  const STORAGE_KEY = 'circulo_sabores_cart_v1';
  const WHATSAPP_NUMBER = '56900000000';
  const TAGS = ['Todos', 'Saludables', 'Snacks', 'Dulces'];

  const PACKS = {
    unidad: { units: 1, multiplier: 1, label: 'Unidad' },
    pack4: { units: 4, multiplier: 0.9, label: 'Pack 4 (ahorro)' },
    pack8: { units: 8, multiplier: 0.8, label: 'Pack 8 (mejor precio)' }
  };

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
      { id: 1, name: 'Brownie Proteico', category: 'Saludables', unit: 1800, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
      { id: 2, name: 'Galleta Avena Cacao', category: 'Snacks', unit: 1500, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80' },
      { id: 3, name: 'Trufa Sin Azúcar', category: 'Dulces', unit: 1300, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80' },
      { id: 4, name: 'Barra Coco Almond', category: 'Saludables', unit: 1700, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=600&q=80' },
      { id: 5, name: 'Mini Muffin Fit', category: 'Dulces', unit: 1600, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80' },
      { id: 6, name: 'Snack Nuez Dátil', category: 'Snacks', unit: 1900, image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&w=600&q=80' }
    ]
  };

  const dom = {
    views: document.querySelectorAll('.view'),
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

  if (!dom.catalogGrid || !dom.searchInput) return;

  function debounce(fn, delay = 150) {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  }

  function currency(value) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function packPrice(product, packKey) {
    const pack = PACKS[packKey];
    return Math.round(product.unit * pack.units * pack.multiplier);
  }

  function getProductById(id) {
    return state.products.find((product) => product.id === id) || null;
  }

  function persistCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
  }

  function restoreCart() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(stored)) return;
      state.cart = stored.filter((line) => {
        return Number.isInteger(line.productId) && PACKS[line.packKey] && Number.isInteger(line.quantity) && line.quantity > 0;
      });
    } catch {
      state.cart = [];
    }
  }

  function filteredProducts() {
    const searchLower = state.search.trim().toLowerCase();
    return state.products.filter((product) => {
      const byTag = state.filter === 'Todos' || product.category === state.filter;
      const bySearch = product.name.toLowerCase().includes(searchLower);
      return byTag && bySearch;
    });
  }

  function paginatedProducts() {
    const items = filteredProducts();
    const totalPages = Math.max(1, Math.ceil(items.length / state.productsPerPage));
    state.catalogPage = Math.min(state.catalogPage, totalPages);
    const start = (state.catalogPage - 1) * state.productsPerPage;
    return { items: items.slice(start, start + state.productsPerPage), totalPages, totalItems: items.length };
  }

  function cartMetrics() {
    const totals = state.cart.reduce(
      (acc, line) => {
        const product = getProductById(line.productId);
        if (!product) return acc;
        acc.units += PACKS[line.packKey].units * line.quantity;
        acc.amount += packPrice(product, line.packKey) * line.quantity;
        return acc;
      },
      { units: 0, amount: 0 }
    );
    totals.deliveryEnabled = totals.units >= 4;
    return totals;
  }

  function renderFilters() {
    dom.tagFilters.innerHTML = TAGS.map((tag) => `<button class="tag ${tag === state.filter ? 'active' : ''}" type="button" data-tag="${tag}">${tag}</button>`).join('');
  }

  function renderCatalog() {
    const { items, totalPages, totalItems } = paginatedProducts();
    if (!totalItems) {
      dom.catalogGrid.innerHTML = '<p class="cart-line">No encontramos productos con ese filtro.</p>';
    } else {
      dom.catalogGrid.innerHTML = items
        .map((product) => `
          <article class="product-card">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
            <strong>${escapeHtml(product.name)}</strong>
            <small>Unidad: ${currency(packPrice(product, 'unidad'))}</small>
            <small class="price-pack">Pack 4: ${currency(packPrice(product, 'pack4'))}</small>
            <small class="price-pack">Pack 8: ${currency(packPrice(product, 'pack8'))}</small>
            <div class="card-actions">
              <button class="btn" type="button" data-detail="${product.id}">Ver detalle</button>
              <button class="btn primary" type="button" data-quick="${product.id}">Quick Add Pack 4</button>
            </div>
          </article>
        `)
        .join('');
    }
    dom.catalogPageText.textContent = `Página ${state.catalogPage} de ${totalPages}`;
    dom.prevPageBtn.disabled = state.catalogPage <= 1;
    dom.nextPageBtn.disabled = state.catalogPage >= totalPages;
  }

  function renderDeliveryProgress() {
    const totals = cartMetrics();
    const missing = Math.max(0, 4 - totals.units);
    dom.deliveryProgressText.textContent = missing ? `Te falta ${missing} producto${missing > 1 ? 's' : ''} para activar delivery` : '¡Delivery activado!';
    dom.deliveryProgressFill.style.width = `${Math.min(100, (totals.units / 4) * 100)}%`;
  }

  function renderFloatingCart() {
    const totals = cartMetrics();
    dom.floatingQty.textContent = `${totals.units} u`;
    dom.floatingTotal.textContent = currency(totals.amount);
  }

  function renderCart() {
    if (!state.cart.length) {
      dom.cartList.innerHTML = '<p class="cart-line">Tu carrito está vacío.</p>';
    } else {
      dom.cartList.innerHTML = state.cart
        .map((line, idx) => {
          const product = getProductById(line.productId);
          if (!product) return '';
          return `
            <div class="cart-line">
              <strong>${escapeHtml(product.name)}</strong>
              <p>${PACKS[line.packKey].label}</p>
              <div class="qty-control">
                <button data-cart-op="minus" data-cart-idx="${idx}" type="button">-</button>
                <span>${line.quantity}</span>
                <button data-cart-op="plus" data-cart-idx="${idx}" type="button">+</button>
              </div>
              <strong>${currency(packPrice(product, line.packKey) * line.quantity)}</strong>
            </div>
          `;
        })
        .join('');
    }

    const totals = cartMetrics();
    dom.cartUnits.textContent = String(totals.units);
    dom.cartTotal.textContent = currency(totals.amount);
    dom.deliveryStatus.textContent = totals.deliveryEnabled ? 'Delivery habilitado ✅' : 'Delivery bloqueado: agrega mínimo 4 unidades.';
  }

  function renderProductView(productId) {
    const product = getProductById(productId);
    if (!product) return;

    state.selectedProductId = product.id;
    state.selectedPack = 'pack4';
    state.selectedQty = 1;

    dom.productDetail.innerHTML = `
      <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-hero" />
      <h2>${escapeHtml(product.name)}</h2>
      <p>Elige formato para maximizar ahorro:</p>
      <div class="stack">
        ${Object.entries(PACKS)
          .map(([key, pack]) => `
            <label class="cart-line">
              <input type="radio" name="pack" value="${key}" ${key === 'pack4' ? 'checked' : ''} />
              ${pack.label}: <strong class="${key !== 'unidad' ? 'price-pack' : ''}">${currency(packPrice(product, key))}</strong>
            </label>`)
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

  function updateCheckoutRules() {
    const totals = cartMetrics();
    const deliveryInput = dom.deliveryRadioWrap.querySelector('input');
    deliveryInput.disabled = !totals.deliveryEnabled;
    dom.confirmOrderBtn.disabled = totals.units === 0;

    if (!totals.deliveryEnabled) {
      deliveryInput.checked = false;
      dom.checkoutForm.querySelector('input[value="retiro"]').checked = true;
    }

    dom.checkoutRule.textContent = !totals.units
      ? 'Agrega productos antes de confirmar tu pedido.'
      : totals.deliveryEnabled
        ? 'Puedes elegir retiro o delivery.'
        : 'Delivery se habilita desde 4 unidades (1 pack mínimo).';
  }

  function updateCartDependentUi() {
    persistCart();
    renderFloatingCart();
    renderDeliveryProgress();
    if (state.currentView === 'carrito') renderCart();
    if (state.currentView === 'checkout') updateCheckoutRules();
  }

  function addToCart(productId, packKey, quantity = 1) {
    if (!PACKS[packKey] || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
    if (!getProductById(productId)) return;

    const line = state.cart.find((item) => item.productId === productId && item.packKey === packKey);
    if (line) line.quantity = Math.min(99, line.quantity + quantity);
    else state.cart.push({ productId, packKey, quantity: Math.min(99, quantity) });

    updateCartDependentUi();
  }

  function adjustCartLine(index, operation) {
    const line = state.cart[index];
    if (!line) return;

    if (operation === 'plus') line.quantity = Math.min(99, line.quantity + 1);
    if (operation === 'minus') line.quantity -= 1;
    state.cart = state.cart.filter((item) => item.quantity > 0);

    updateCartDependentUi();
  }

  function setActiveView(viewName) {
    state.currentView = viewName;
    dom.views.forEach((view) => view.classList.toggle('active', view.dataset.view === viewName));
    if (viewName === 'carrito') renderCart();
    if (viewName === 'checkout') updateCheckoutRules();
  }

  function validateText(value, max) {
    const cleaned = String(value || '').trim();
    return cleaned.length > 0 && cleaned.length <= max;
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const totals = cartMetrics();
    if (!totals.units) return alert('Tu carrito está vacío.');

    const formData = new FormData(dom.checkoutForm);
    const name = formData.get('name');
    const address = formData.get('address');
    const method = formData.get('method');

    if (!validateText(name, 60) || !validateText(address, 120)) return alert('Completa nombre y dirección correctamente.');
    if (method === 'delivery' && !totals.deliveryEnabled) return alert('Delivery solo disponible desde 4 unidades.');

    setActiveView('confirmacion');
  }

  function handleCustomOrderSubmit(event) {
    event.preventDefault();

    const formData = new FormData(dom.customOrderForm);
    const type = String(formData.get('type') || '').trim();
    const qty = Number(formData.get('qty'));
    const date = String(formData.get('date') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    if (!validateText(type, 80) || !Number.isFinite(qty) || qty < 1 || qty > 999 || !date) {
      return alert('Completa los datos del encargo correctamente.');
    }

    const message = ['Hola Círculo de Sabores, quiero encargar:', `Producto: ${type}`, `Cantidad: ${qty}`, `Fecha: ${date}`, `Notas: ${notes || '-'}`].join('\n');
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  function onClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const tagButton = target.closest('[data-tag]');
    const detailButton = target.closest('[data-detail]');
    const quickButton = target.closest('[data-quick]');
    const navButton = target.closest('[data-nav]');
    const actionButton = target.closest('[data-action]');
    const qtyButton = target.closest('[data-qty]');
    const cartButton = target.closest('[data-cart-op]');

    if (navButton) setActiveView(navButton.dataset.nav);

    if (actionButton?.dataset.action === 'go-home') setActiveView('home');
    if (actionButton?.dataset.action === 'go-checkout') setActiveView('checkout');
    if (actionButton?.dataset.action === 'focus-search') {
      setActiveView('home');
      dom.searchInput.focus();
    }

    if (tagButton) {
      state.filter = tagButton.dataset.tag;
      state.catalogPage = 1;
      renderFilters();
      renderCatalog();
    }

    if (detailButton) renderProductView(Number(detailButton.dataset.detail));
    if (quickButton) addToCart(Number(quickButton.dataset.quick), 'pack4', 1);

    if (qtyButton) {
      state.selectedQty = qtyButton.dataset.qty === 'plus' ? Math.min(99, state.selectedQty + 1) : Math.max(1, state.selectedQty - 1);
      const qtyElement = document.getElementById('detailQty');
      if (qtyElement) qtyElement.textContent = String(state.selectedQty);
    }

    if (actionButton?.dataset.action === 'add-detail' && state.selectedProductId) {
      addToCart(state.selectedProductId, state.selectedPack, state.selectedQty);
      setActiveView('carrito');
    }

    if (cartButton) {
      adjustCartLine(Number(cartButton.dataset.cartIdx), cartButton.dataset.cartOp);
    }
  }

  function onChange(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === 'pack' && PACKS[target.value]) {
      state.selectedPack = target.value;
    }
  }

  function init() {
    restoreCart();
    renderFilters();
    renderCatalog();
    renderFloatingCart();
    renderDeliveryProgress();
    updateCheckoutRules();

    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);

    dom.searchInput.addEventListener(
      'input',
      debounce((event) => {
        state.search = event.target.value;
        state.catalogPage = 1;
        renderCatalog();
      })
    );

    dom.prevPageBtn.addEventListener('click', () => {
      state.catalogPage = Math.max(1, state.catalogPage - 1);
      renderCatalog();
    });

    dom.nextPageBtn.addEventListener('click', () => {
      const pages = Math.max(1, Math.ceil(filteredProducts().length / state.productsPerPage));
      state.catalogPage = Math.min(pages, state.catalogPage + 1);
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

    setTimeout(() => {
      const introView = document.querySelector('[data-view="intro"]');
      if (introView) introView.classList.add('fade-out');
      setTimeout(() => setActiveView('home'), 550);
    }, 2000);
  }

  init();
})();
