'use strict';

/* ============================================================
   CÍRCULO DE SABORES — Data Layer v4.0
   Unified localStorage API with sanitization, backup, migration
   ============================================================ */

const DataLayer = {
  _VERSION: '4.0',
  _KEYS: {
    products: 'cds_products_v4',
    orders: 'cds_orders_v4',
    favorites: 'cds_favorites_v4',
    coupons: 'cds_coupons_v4',
    config: 'cds_config_v4',
    cart: 'cds_cart_v4',
    visits: 'cds_visits_v4',
    onboarding: 'cds_onboarded_v1',
    testimonials: 'cds_testimonials_v1',
  },

  /* ── UTILITIES ─────────────────────────────────────────── */
  _get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch(e) {
      if (e.name === 'QuotaExceededError') {
        DataLayer._cleanup();
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch(e2) { console.error('Storage full:', e2); return false; }
      }
      return false;
    }
  },

  _generateId() {
    return 'ord-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  },

  _sanitize(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  _cleanup() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('cds_'));
    if (keys.length > 10) {
      const oldest = keys.sort()[0];
      localStorage.removeItem(oldest);
    }
  },

  /* ── PRODUCTS ──────────────────────────────────────────── */
  products: {
    getAll() {
      const data = DataLayer._get(DataLayer._KEYS.products);
      if (!data) { DataLayer.products.seed(); return BASE_PRODUCTS; }
      return data;
    },

    getById(id) {
      return DataLayer.products.getAll().find(p => p.id === id) || null;
    },

    update(id, data) {
      const products = DataLayer.products.getAll();
      const idx = products.findIndex(p => p.id === id);
      if (idx < 0) return false;
      products[idx] = { ...products[idx], ...data, updatedAt: Date.now() };
      return DataLayer._set(DataLayer._KEYS.products, products);
    },

    create(data) {
      const products = DataLayer.products.getAll();
      const newProduct = {
        ...data,
        id: 'prod-' + Date.now(),
        active: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      products.push(newProduct);
      DataLayer._set(DataLayer._KEYS.products, products);
      return newProduct.id;
    },

    delete(id) {
      const products = DataLayer.products.getAll().filter(p => p.id !== id);
      DataLayer._set(DataLayer._KEYS.products, products);
    },

    getActive() {
      return DataLayer.products.getAll().filter(p => p.active !== false);
    },

    seed() {
      if (DataLayer._get(DataLayer._KEYS.products)) return;
      const seeded = BASE_PRODUCTS.map(p => ({
        ...p,
        active: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
      DataLayer._set(DataLayer._KEYS.products, seeded);
      console.log('✅ DataLayer: ' + seeded.length + ' productos seedeados');
    }
  },

  /* ── ORDERS ────────────────────────────────────────────── */
  orders: {
    create(orderData) {
      const orders = DataLayer.orders.getAll();
      const order = {
        id: DataLayer._generateId(),
        ...orderData,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      orders.unshift(order);
      DataLayer._set(DataLayer._KEYS.orders, orders);
      DataLayer.stats._trackOrder(order);
      return order;
    },

    getAll() {
      return DataLayer._get(DataLayer._KEYS.orders) || [];
    },

    getById(id) {
      return DataLayer.orders.getAll().find(o => o.id === id) || null;
    },

    getByStatus(status) {
      return DataLayer.orders.getAll().filter(o => o.status === status);
    },

    updateStatus(id, status) {
      const orders = DataLayer.orders.getAll();
      const order = orders.find(o => o.id === id);
      if (!order) return false;
      order.status = status;
      order.updatedAt = Date.now();
      DataLayer._set(DataLayer._KEYS.orders, orders);
      return true;
    },

    delete(id) {
      const orders = DataLayer.orders.getAll().filter(o => o.id !== id);
      DataLayer._set(DataLayer._KEYS.orders, orders);
    },

    exportCSV() {
      const orders = DataLayer.orders.getAll();
      if (orders.length === 0) return;

      const headers = ['ID', 'Fecha', 'Cliente', 'Teléfono', 'Entrega', 'Dirección', 'Items', 'Total', 'Estado', 'Notas'];
      const rows = orders.map(o => [
        o.id,
        new Date(o.createdAt).toLocaleString('es-CL'),
        o.customerName || '',
        o.customerPhone || '',
        o.deliveryMethod || '',
        o.address || '',
        (o.items || []).map(i => `${i.name} x${i.qty}`).join(' | '),
        o.total || 0,
        o.status || '',
        o.notes || ''
      ]);

      const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedidos-cds-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },

  /* ── FAVORITES ─────────────────────────────────────────── */
  favorites: {
    getAll() {
      return DataLayer._get(DataLayer._KEYS.favorites) || [];
    },

    toggle(productId) {
      const favs = DataLayer.favorites.getAll();
      const idx = favs.indexOf(productId);
      if (idx >= 0) favs.splice(idx, 1);
      else favs.push(productId);
      DataLayer._set(DataLayer._KEYS.favorites, favs);
      return favs;
    },

    has(productId) {
      return DataLayer.favorites.getAll().includes(productId);
    },

    clear() {
      DataLayer._set(DataLayer._KEYS.favorites, []);
    }
  },

  /* ── COUPONS ───────────────────────────────────────────── */
  coupons: {
    _defaults: {
      'BIENVENIDO10': { discount: 10, type: 'percent', minPurchase: 5000, maxUses: 999, usedCount: 0, active: true, label: '10% de descuento' },
      'PACK2000': { discount: 2000, type: 'fixed', minPurchase: 15000, maxUses: 50, usedCount: 0, active: true, label: '$2.000 de descuento' },
      'ENVIOGRATIS': { discount: 0, type: 'free_delivery', minPurchase: 10000, maxUses: 30, usedCount: 0, active: true, label: 'Delivery gratis' },
      'IG15': { discount: 15, type: 'percent', minPurchase: 0, maxUses: 999, usedCount: 0, active: true, label: '15% OFF primer pedido (Instagram)' },
    },

    getAll() {
      const stored = DataLayer._get(DataLayer._KEYS.coupons);
      return stored ? { ...DataLayer.coupons._defaults, ...stored } : DataLayer.coupons._defaults;
    },

    validate(code) {
      if (!code) return null;
      const coupons = DataLayer.coupons.getAll();
      const coupon = coupons[code.toUpperCase()];
      if (!coupon) return null;
      if (!coupon.active) return { error: 'Cupón no activo' };
      if (coupon.usedCount >= coupon.maxUses) return { error: 'Cupón agotado' };
      return coupon;
    },

    use(code) {
      const coupons = DataLayer.coupons.getAll();
      const key = code.toUpperCase();
      if (coupons[key]) {
        coupons[key].usedCount = (coupons[key].usedCount || 0) + 1;
        DataLayer._set(DataLayer._KEYS.coupons, coupons);
      }
    },

    create(code, data) {
      const coupons = DataLayer.coupons.getAll();
      coupons[code.toUpperCase()] = {
        discount: data.discount || 0,
        type: data.type || 'percent',
        minPurchase: data.minPurchase || 0,
        maxUses: data.maxUses || 999,
        usedCount: 0,
        active: true,
        label: data.label || code,
        createdAt: Date.now()
      };
      DataLayer._set(DataLayer._KEYS.coupons, coupons);
    },

    delete(code) {
      const coupons = DataLayer.coupons.getAll();
      delete coupons[code.toUpperCase()];
      DataLayer._set(DataLayer._KEYS.coupons, coupons);
    },

    toggle(code) {
      const coupons = DataLayer.coupons.getAll();
      const key = code.toUpperCase();
      if (coupons[key]) {
        coupons[key].active = !coupons[key].active;
        DataLayer._set(DataLayer._KEYS.coupons, coupons);
      }
    }
  },

  /* ── CONFIG ────────────────────────────────────────────── */
  config: {
    get() {
      return DataLayer._get(DataLayer._KEYS.config) || {
        deliveryMethods: { retiro: false, delivery: true },
        paymentMethods: { transferencia: true, efectivo: false, tarjeta: false },
        content: {
          heroTitle: 'Snacks que\nte hacen bien',
          heroSub: '',
          heroTag: '100% Artesanal · Sin conservantes',
        },
        deliveryThreshold: 20000,
        darkMode: false,
        deliveryZones: [
          { name: 'Providencia', price: 2000, active: true },
          { name: 'Las Condes', price: 3000, active: true },
          { name: 'Ñuñoa', price: 2500, active: true },
          { name: 'Santiago Centro', price: 2000, active: true },
          { name: 'La Reina', price: 3000, active: true },
          { name: 'Vitacura', price: 3500, active: true },
          { name: 'Macul', price: 2500, active: true },
          { name: 'Peñalolén', price: 3000, active: true },
        ],
        faq: [
          { q: '¿Cuánto tarda el delivery?', a: 'Entre 24 y 48 horas después de confirmar tu pedido por WhatsApp.' },
          { q: '¿Qué ingredientes usan?', a: 'Solo ingredientes naturales: avena, frutos secos, miel, cacao, frutas deshidratadas. Sin conservantes ni aditivos.' },
          { q: '¿Tienen opciones sin gluten?', a: 'Sí, muchos de nuestros productos son naturalmente sin gluten. Consultanos por WhatsApp para detalles específicos.' },
          { q: '¿Cómo puedo pagar?', a: 'Aceptamos transferencia bancaria, efectivo y tarjeta. Los datos de pago se envían por WhatsApp al confirmar.' },
          { q: '¿Puedo hacer un pedido personalizado?', a: '¡Sí! Usa la sección "Personaliza" para crear tu pedido a medida con los ingredientes que quieras.' },
          { q: '¿Cuánto dura un producto?', a: 'Nuestros productos duran entre 2 y 4 semanas en un lugar fresco y seco. Siempre indicamos la fecha de vencimiento en el envase.' },
        ],
      };
    },

    update(data) {
      const current = DataLayer.config.get();
      const updated = { ...current, ...data };
      DataLayer._set(DataLayer._KEYS.config, updated);
      return updated;
    }
  },

  /* ── STATS ─────────────────────────────────────────────── */
  stats: {
    getTotalRevenue() {
      return DataLayer.orders.getAll()
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);
    },

    getMonthRevenue() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return DataLayer.orders.getAll()
        .filter(o => o.status === 'delivered' && o.createdAt >= monthStart)
        .reduce((sum, o) => sum + (o.total || 0), 0);
    },

    getOrderCount() {
      return DataLayer.orders.getAll().length;
    },

    getMonthOrderCount() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return DataLayer.orders.getAll().filter(o => o.createdAt >= monthStart).length;
    },

    getTopProducts(n = 5) {
      const count = {};
      DataLayer.orders.getAll().forEach(o => {
        (o.items || []).forEach(item => {
          if (!count[item.name]) count[item.name] = { name: item.name, emoji: item.emoji || '📦', count: 0, revenue: 0 };
          count[item.name].count += item.qty;
          count[item.name].revenue += item.priceTotal || 0;
        });
      });
      return Object.values(count).sort((a, b) => b.count - a.count).slice(0, n);
    },

    getAvgTicket() {
      const delivered = DataLayer.orders.getAll().filter(o => o.status === 'delivered');
      if (delivered.length === 0) return 0;
      return Math.round(delivered.reduce((s, o) => s + o.total, 0) / delivered.length);
    },

    _trackOrder(order) {
      const visits = DataLayer._get(DataLayer._KEYS.visits) || { total: 0, orders: 0 };
      visits.orders++;
      DataLayer._set(DataLayer._KEYS.visits, visits);
    },

    trackVisit() {
      const v = DataLayer._get(DataLayer._KEYS.visits) || { total: 0, orders: 0 };
      v.total++;
      DataLayer._set(DataLayer._KEYS.visits, v);
    },

    getConversionRate() {
      const v = DataLayer._get(DataLayer._KEYS.visits) || { total: 0, orders: 0 };
      if (v.total === 0) return 0;
      return Math.round((v.orders / v.total) * 1000) / 10;
    }
  },

  /* ── CART (wrapper) ────────────────────────────────────── */
  cart: {
    save(cart) {
      DataLayer._set(DataLayer._KEYS.cart, cart);
    },

    load() {
      return DataLayer._get(DataLayer._KEYS.cart) || [];
    },

    clear() {
      DataLayer._set(DataLayer._KEYS.cart, []);
    }
  },

  /* ── ONBOARDING ────────────────────────────────────────── */
  onboarding: {
    isDone() { return !!DataLayer._get(DataLayer._KEYS.onboarding); },
    markDone() { DataLayer._set(DataLayer._KEYS.onboarding, true); },
  },

  /* ── TESTIMONIALS ──────────────────────────────────────── */
  testimonials: {
    _defaults: [
      { name: 'María G.', location: 'Providencia', text: 'Las mejores barras que probé. Mi hija las ama.', stars: 5 },
      { name: 'Carlos R.', location: 'Las Condes', text: 'El pack keto es increíble. Ya van 3 pedidos.', stars: 5 },
      { name: 'Ana P.', location: 'Ñuñoa', text: 'Delivery rápido y todo fresquísimo. 100% recomendado.', stars: 5 },
      { name: 'Diego M.', location: 'Santiago Centro', text: 'Excelente calidad y atención. Los snacks son adictivos.', stars: 4 },
      { name: 'Valentina S.', location: 'La Reina', text: 'Pedí personalizado y quedó perfecto. Volveré siempre.', stars: 5 },
    ],
    getAll() {
      return DataLayer._get(DataLayer._KEYS.testimonials) || DataLayer.testimonials._defaults;
    },
  },

  /* ── INIT ──────────────────────────────────────────────── */
  init() {
    DataLayer.products.seed();
    DataLayer.stats.trackVisit();
    console.log('✅ DataLayer v' + DataLayer._VERSION + ' initialized');
  }
};
