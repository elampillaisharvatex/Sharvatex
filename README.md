<p align="center">
  <img src="public/images/logo.jpeg" alt="Sharvatex Logo" width="180" style="border-radius: 50%;" />
</p>

<h1 align="center">Sharvatex — Premium Saree Wholesale</h1>

<p align="center">
  <strong>Elampillai · The Quality You Can Feel</strong><br/>
  Direct-from-mill premium sarees at wholesale prices
</p>

<p align="center">
  <a href="https://wa.me/919994466665">💬 WhatsApp</a>
</p>

---

## ✨ Features

- 🧵 **Product Catalog** — Browse sarees with images, pricing & fabric details
- 🔍 **Category Filtering** — Filter by silk type, cotton, and more
- 📱 **Fully Responsive** — Beautiful on mobile, tablet & desktop
- 💬 **WhatsApp Integration** — One-click enquiry on every product
- 🖼️ **Image Slider** — Auto-rotating showcase with smooth crossfade transitions
- 🔐 **Admin Panel** — Manage products, categories & settings (auth via Supabase)
- ⚡ **Fast & Modern** — Built with Vite + React for instant loading

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 19, TypeScript              |
| Styling     | Tailwind CSS 3                    |
| Routing     | Wouter                            |
| Backend     | Supabase (PostgreSQL + Auth + Storage) |
| Build       | Vite 5                            |
| Fonts       | Cormorant Garamond, Montserrat    |

## 📁 Project Structure

```
Sharvatex/
├── public/
│   ├── images/           # Logo, saree & weaver images
│   ├── favicon.svg
│   └── opengraph.jpg
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── CategoryFilter.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ui/           # Shadcn/Radix primitives
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Supabase client & utilities
│   ├── pages/            # Route pages
│   │   ├── Home.tsx      # Main storefront
│   │   ├── Admin.tsx     # Admin dashboard
│   │   ├── Login.tsx     # Admin login
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── Terms.tsx
│   ├── utils/            # Supabase queries & helpers
│   ├── App.tsx           # Router setup
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles & animations
├── .env.example          # Environment variable template
├── index.html            # HTML shell
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A **Supabase** project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/elampillaisharvatex/Sharvatex.git
cd Sharvatex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set up Supabase tables

Create the following tables in your Supabase dashboard:

- **`categories`** — `id` (uuid, PK), `name` (text)
- **`products`** — `id` (uuid, PK), `name` (text), `price` (text), `description` (text, nullable), `fabric` (text, nullable), `category_id` (uuid, FK → categories), `image_url` (text, nullable), `is_active` (boolean, default true), `badge` (text, nullable), `emoji` (text, nullable), `created_at` (timestamptz)
- **`product_images`** — `id` (uuid, PK), `product_id` (uuid, FK → products), `image_url` (text), `storage_path` (text)
- **`site_settings`** — `id` (uuid, PK), `whatsapp_number` (text), `created_at` (timestamptz)

### 5. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 6. Build for production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

## 📞 Contact

- **WhatsApp**: [+91 99944 66665](https://wa.me/919994466665)
- **Location**: Elampillai, Tamil Nadu, India

---

<p align="center">
  <sub>© 2026 Sharvatex. All rights reserved.</sub>
</p>
