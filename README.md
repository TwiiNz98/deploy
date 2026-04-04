# 🌿 Círculo de Sabores — SPA Ecommerce

> Mobile-first SPA de ecommerce para barras y snacks saludables artesanales.  
> Listo para producción. Sin dependencias. Deploy en 1 clic.

---

## 📁 Estructura

```
Deploy/
├── index.html       ← Shell SPA
├── styles.css       ← Design system completo
├── app.js           ← Motor SPA + lógica de negocio
├── images/
│   └── logo.png     ← Reemplazar con logo real
└── README.md
```

---

## ⚙️ Configuración antes del deploy

### 1. Logo
Reemplaza `images/logo.png` con el logo real de la marca.  
Dimensiones recomendadas: **200×200px**, PNG con fondo transparente.

### 2. WhatsApp
En `app.js`, línea ~12, cambia el número:
```js
const WHATSAPP_NUMBER = '56912345678'; // ← Número real sin + ni espacios
```

### 3. Productos y precios
En `app.js`, edita el arreglo `PRODUCTS` (líneas ~16–50) con los nombres, precios y emojis reales.

---

## 🚀 Subir a GitHub

### Opción A — GitHub Desktop (recomendado)
1. Descarga e instala [GitHub Desktop](https://desktop.github.com/)
2. Crea un repo nuevo llamado `Deploy`
3. Arrastra la carpeta `Deploy/` al área de trabajo
4. Haz commit: `"Initial deploy - Círculo de Sabores"`
5. Pulsa **Publish repository** → dejarlo en **Public**

### Opción B — Terminal
```bash
cd Deploy
git init
git add .
git commit -m "Initial deploy - Círculo de Sabores"
gh repo create Deploy --public --source=. --push
```
> Requiere [GitHub CLI](https://cli.github.com/)

---

## 🌐 Deploy en Netlify (1 clic)

### Método 1 — Drag & Drop (más rápido)
1. Ve a [netlify.com](https://app.netlify.com) → Log in
2. Dashboard → sección **"Sites"** → arrastra la carpeta `Deploy/` completa
3. ¡Listo! Netlify genera una URL automática en ~10 segundos

### Método 2 — Conectar con GitHub (para actualizaciones automáticas)
1. Netlify → **Add new site** → **Import an existing project**
2. Conecta tu cuenta de GitHub
3. Selecciona el repo `Deploy`
4. Configuración:
   - **Build command**: *(dejar vacío)*
   - **Publish directory**: `.` *(punto — raíz del repo)*
5. Click **Deploy site**
6. Cada `git push` actualizará el sitio automáticamente

### Dominio personalizado
En Netlify: **Site settings → Domain management → Add custom domain**

---

## ✅ Checklist pre-lanzamiento

- [ ] Logo real en `images/logo.png`
- [ ] Número de WhatsApp actualizado en `app.js`
- [ ] Precios y productos revisados en `PRODUCTS[]`
- [ ] Probado en Chrome Mobile + Safari iOS
- [ ] Deploy en Netlify funcionando
- [ ] Dominio personalizado configurado (opcional)

---

## 🧩 Funcionalidades incluidas

| Feature | Estado |
|---|---|
| SPA sin recarga | ✅ |
| Mobile-first no-scroll | ✅ |
| Catálogo con filtros y búsqueda | ✅ |
| Vista de producto con selector pack | ✅ |
| Quick Add Pack x4 desde catálogo | ✅ |
| Carrito persistente en sesión | ✅ |
| Indicador "faltan X para delivery" | ✅ |
| Regla delivery ≥ 4 unidades | ✅ |
| Bloqueo checkout si no cumple | ✅ |
| Formulario de encargos + WhatsApp | ✅ |
| Validación de formularios | ✅ |
| Toast notifications | ✅ |
| Pantalla de confirmación | ✅ |

---

## 📱 Compatibilidad

- Chrome (Android) ✅
- Safari (iOS) ✅  
- Samsung Internet ✅
- Chrome Desktop ✅

---

## 📝 Notas técnicas

- Sin frameworks. Vanilla JS + CSS.
- Sin dependencias npm. Sin build step.
- Hosting estático puro — compatible con Netlify, Vercel, GitHub Pages.
- Fuentes: Google Fonts (DM Serif Display + DM Sans)
- Iconos: Font Awesome 6 (CDN)

---

*Círculo de Sabores © 2025 — Construido con ❤️*
