<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=800&color=6366F1&center=true&vCenter=true&width=600&height=60&lines=Shopify+Frost" alt="Typing Animation" />
</div>

<p align="center">
  A headless <strong>Shopify Hydrogen</strong> storefront with glassmorphism design, dark/light theme, and modern e-commerce features.
</p>

<div align="center">

![Shopify](https://img.shields.io/badge/Shopify-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)
![Hydrogen](https://img.shields.io/badge/Hydrogen-000000?style=for-the-badge&logo=shopify&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🧊 **Glassmorphism Design** | Frosted glass UI with backdrop blur throughout |
| 🌓 **Dark / Light Theme** | Persistent theme toggle with localStorage & flash-free hydration |
| 🏠 **Rich Homepage** | Hero, collections, promo, testimonials, newsletter & more |
| 🛍️ **Product Detail** | Gallery with thumbnails, variant pills with swatches, trust badges |
| 🛒 **Minimal Cart Sidebar** | Slide-in cart with compact line items and smooth checkout |
| 📱 **Responsive** | Mobile-friendly layout with adaptive menu |
| ⚡ **Hydrogen + Storefront API** | Built on Shopify's headless stack with mock.shop data |

</div>

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start dev server (Node.js v22 required)
fnm use 22
shopify hydrogen dev
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Hydrogen (React Router v7) |
| **Styling** | Custom CSS (glassmorphism, CSS variables for theming) |
| **Data** | Shopify Storefront API (GraphQL) |
| **Build** | Vite + Shopify CLI |
| **Language** | TypeScript |

## 📂 Project Structure

```
app/
├── components/     # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Aside.tsx
│   ├── Cart*.tsx
│   └── Product*.tsx
├── routes/         # Page routes
│   ├── _index.tsx        # Homepage
│   ├── products.$handle  # Product detail
│   ├── collections*.tsx  # Collection pages
│   └── cart*.tsx         # Cart pages
└── styles/
    └── app.css     # All custom styles
```

## 🔑 Environment

```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-token
```

## 📄 License

MIT
