# Portfolio Ecosystem

A full-stack portfolio platform with a CMS backend, JWT authentication, BullMQ email queues, Redis caching, Cloudinary image uploads, and a dark minimal React frontend.

## Live

- Frontend: https://portfolio-ecosystem-qdec.vercel.app
- Backend: https://portfolio-ecosystem.onrender.com
- Health: https://portfolio-ecosystem.onrender.com/health

---

## Stack

### Backend
- Node.js + Express 5
- Prisma 6 + Neon PostgreSQL (serverless)
- BullMQ + Upstash Redis (job queues + caching)
- JWT + bcryptjs (authentication)
- Nodemailer (email notifications)

### Frontend
- React 18 + Vite 5
- React Router v6
- Tailwind CSS v3
- Cloudinary (image uploads)

### Hosting
- Backend: Render (free tier)
- Frontend: Vercel (hobby tier)
- Database: Neon (serverless PostgreSQL)
- Queue/Cache: Upstash (serverless Redis)
- Images: Cloudinary CDN

---

## Features

- JWT authentication with bcrypt password hashing
- Full CRUD for posts, authors, and tags
- Markdown editor with live preview in admin dashboard
- Cloudinary image upload for post cover images and author avatars
- BullMQ email queue for contact form and new post notifications
- Redis response caching with automatic invalidation on writes
- Search, filter by tag, and pagination on blog posts
- Author profile page with bio, avatar, and social links
- Mobile-responsive navigation with hamburger menu
- Scroll reveal animations using IntersectionObserver
- Admin dashboard with Posts, New Post, and Profile tabs

---

## Project Structure

```
portfolio-ecosystem/
├── backend/
│   ├── app.js
│   ├── db.js
│   ├── redis.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── queues/
│   │   └── index.js
│   ├── workers/
│   │   ├── emailWorker.js
│   │   └── backgroundWorker.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── cache.js
│   └── routes/
│       ├── auth.js
│       ├── posts.js
│       ├── authors.js
│       ├── tags.js
│       └── contact.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── lib/
        │   ├── api.js
        │   ├── auth.jsx
        │   └── cloudinary.js
        ├── hooks/
        │   └── useReveal.js
        ├── components/
        │   ├── layout/Nav.jsx
        │   └── ui/
        │       ├── ImageUpload.jsx
        │       └── MarkdownEditor.jsx
        └── pages/
            ├── Home.jsx
            ├── About.jsx
            ├── Projects.jsx
            ├── Blog.jsx
            ├── Post.jsx
            ├── Author.jsx
            ├── Login.jsx
            └── Admin.jsx
```

---

## Local Development

### Prerequisites

- Node.js v22+
- npm v10+
- A Neon PostgreSQL database
- An Upstash Redis database
- A Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
REDIS_URL="rediss://default:password@host.upstash.io:6379"
JWT_SECRET="your-32-byte-random-hex-string"
NOTIFY_EMAIL="your@email.com"
EMAIL_FROM="Portfolio CMS <noreply@yourdomain.com>"
NODE_ENV="development"
SITE_URL="http://localhost:3000"
```

Run migrations and seed:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.production` file in the `frontend` directory:

```
VITE_API_URL=https://your-backend.onrender.com
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies `/api` requests to the backend automatically via Vite.

---

## API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | No | Email + password, returns JWT |
| GET | /api/auth/me | Yes | Current author profile |
| PATCH | /api/auth/me | Yes | Update profile, avatar, password |
| POST | /api/auth/register | No | Create new author account |
| GET | /api/posts | No | List posts with ?tag= &search= &page= &limit= |
| GET | /api/posts/:slug | No | Single post by slug |
| POST | /api/posts | Yes | Create post |
| PATCH | /api/posts/:slug | Yes | Update post (author only) |
| DELETE | /api/posts/:slug | Yes | Delete post (author only) |
| GET | /api/authors | No | All authors |
| GET | /api/authors/:id | No | Author profile + posts |
| GET | /api/tags | No | All tags |
| GET | /api/tags/:slug | No | Tag + posts |
| POST | /api/contact | No | Contact form submission |

---

## Deployment

### Backend — Render

| Setting | Value |
|---------|-------|
| Root Directory | backend |
| Build Command | npm install && npx prisma generate |
| Start Command | node app.js |
| Instance Type | Free |

Add all environment variables from the `.env` template above in the Render dashboard under Environment.

### Frontend — Vercel

| Setting | Value |
|---------|-------|
| Root Directory | frontend |
| Framework | Vite |
| Output Directory | dist |

Add `VITE_API_URL` pointing to your Render backend URL in the Vercel project settings under Environment Variables.

After both are deployed, update the CORS origin array in `backend/app.js` to include your Vercel URL, then push to trigger a redeploy.

---

## Useful Commands

```bash
# Open Prisma Studio (database GUI)
cd backend && npx prisma studio

# Re-seed the database
cd backend && npx prisma db seed

# Create a new migration
cd backend && npx prisma migrate dev --name migration-name

# Regenerate Prisma Client after schema changes
cd backend && npx prisma generate

# Build frontend for production
cd frontend && npm run build
```

---

## Default Credentials (development only)

| Author | Email | Password |
|--------|-------|----------|
| Alice Nguyen | alice@example.com | password123 |
| Bob Okafor | bob@example.com | password123 |

Change these immediately in production by updating passwords through the admin Profile tab.

---

## License

MIT
