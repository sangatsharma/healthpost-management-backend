# HealthPost Management System — Backend API

REST API for the **HealthPost Management System**, a bilingual (English / नेपाली) platform for Nepal's community health posts. It handles authentication, health posts and staff, patient records, OPD visits with vitals and prescriptions, referrals, shared assets, and notices.

Built as a final-year **B.E. Software Engineering** project at Pokhara University.

**Frontend:** [healthpost-management-frontend](https://github.com/sangatsharma/healthpost-management-frontend) · **Live app:** <https://healthpost.vercel.app>

---

## Features

- **Cookie-based JWT auth**: short-lived access token and refresh token in httpOnly cookies, a refresh endpoint, and a one-time-password (OTP) step at login.
- **Three account types** (`ADMIN`, `HP`, `PATIENT`) and roles that mirror real health-post positions: Admin, Health Assistant, ANM, Lab Technician, FCHV, Inventory Keeper and Office Helper. Route guards check role, and staff carry resource-level `READ` / `WRITE` permissions (patient records, lab results, vaccinations, inventory, reports and more).
- **Health posts**: create and manage health posts, assign admins, list staff and patients, and toggle a health post open or closed.
- **Patients**: detailed registration (identity, address, family, blood group, disability, caste and nationality data) linked to a health post.
- **OPD**: visits with vitals and prescriptions, history per patient and per health post.
- **Referrals**: refer a patient from an OPD visit and accept or act on incoming referrals.
- **Assets**: track shared resources per health post (ambulances, oxygen cylinders, beds, …), engage them for a patient and release them later.
- **Notices**: broadcast notices to health posts, patients or everyone, with attachments.
- **Location data**: Nepal's provinces and districts for address forms.
- **Bilingual responses**: API messages are returned in English or Nepali based on the `NEXT_LOCALE` cookie.
- **Validation and errors**: Zod schemas on request bodies, typed custom errors and a central error handler.
- **File uploads**: profile images, signatures and attachments go to Cloudinary via Multer.

## Tech stack

| Area | Tools |
| --- | --- |
| Runtime | Node.js, Express 5, TypeScript |
| Database | PostgreSQL, Prisma ORM (multi-file schema, migrations) |
| Auth | jsonwebtoken, bcrypt, cookie-parser |
| Validation | Zod |
| Files and email | Multer, Cloudinary, Nodemailer |
| Tooling | pnpm, nodemon + ts-node, ESLint, Docker Compose (local Postgres) |

## Getting started

**Prerequisites:** Node.js 18+, pnpm, and Docker (or any PostgreSQL instance).

```bash
git clone https://github.com/sangatsharma/healthpost-management-backend.git
cd healthpost-management-backend
pnpm install
```

### 1. Start PostgreSQL

```bash
docker compose up -d     # Postgres on localhost:5454, database "health"
```

### 2. Configure environment

Copy `.env.sample` to `.env` and fill it in:

```env
ENV=DEV                     # PROD enables production token lifetimes
PORT=8000

DATABASE_URL=postgresql://postgres:<password>@localhost:5454/health

ACCESS_SECRET=<random string>
ACCESS_EXPIRE=15m
REFRESH_SECRET=<different random string>
REFRESH_EXPIRE=7d

MAIL=<app password for the mail account>

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Run migrations and start

```bash
pnpm db:migrate          # generate the Prisma client and apply migrations
pnpm start:dev           # http://localhost:8000
```

The frontend expects `NEXT_PUBLIC_API_URL=http://localhost:8000/api`. Allowed CORS origins are set in `app.ts`.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm start:dev` | Dev server with reload (nodemon + ts-node) |
| `pnpm build` | Generate Prisma client and compile TypeScript to `dist/` |
| `pnpm build:prod` | As above, plus `prisma migrate deploy` |
| `pnpm start:prod` | Run the compiled server |
| `pnpm db:migrate` | Create and apply a development migration |
| `pnpm studio` | Open Prisma Studio |

## API overview

All routes are prefixed with `/api`.

| Base path | Endpoints |
| --- | --- |
| `/auth` | `POST /register`, `POST /login`, `POST /validate-otp`, `POST /superadmin`, `GET /logout`, `GET /refresh-token` |
| `/user` | `GET /` (current user), `GET /all`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| `/healthpost` | CRUD on `/` and `/:id`, `PATCH /:id/assign`, `GET /:id/staff`, patients under `/:id/patient`, `PATCH /:id/config/isopen` |
| `/patient` | `GET /`, `GET /:id` |
| `/opd` | `POST /`, `GET /`, `GET /:id`, `GET /patient/:id`, `GET /healthpost/:id` |
| `/opd-referral` | `POST /`, `GET /opd/:opdId`, `GET /healthpost/:healthPostId`, `PUT /action` |
| `/hp-assets` | `POST /types`, `POST /`, `POST /engage`, `PUT /release/:engagementId`, `GET /available/:healthPostId` |
| `/notice` | `POST /`, `GET /`, `GET /:id`, `GET /healthpost/:healthPostId`, `GET /patient/:patientId` |
| `/location` | `GET /all`, `GET /province`, `GET /district` |
| `/common` | shared upload and delete helpers |

## Data model

Prisma schema files live in `prisma/schema/`:

- **User**, **HpUserProfile**: accounts, roles, permissions and staff profiles
- **HealthPost**, **HealthPostConfig**: health posts and their settings
- **Patient**: patient registration data
- **OpdVisit**, **Vitals**, **Prescription**, **Medicine**: outpatient visits
- **OpdReferral**: referrals between health posts and facilities
- **HealthPostAssetType**, **HealthPostAsset**, **AssetEngagement**: shared resources and their usage
- **Notice**: announcements to health posts and patients

## Project structure

```
app.ts                  Express app: middleware, routers, error handling
constants/              roles, enums, status codes, bilingual response messages
prisma/schema/          Prisma schema files and migrations
src/
  routes/               one router per resource
  controllers/          request handlers
  repository/           database access layer
  validations/          Zod request schemas
  helpers/              auth guards, tokens, OTP, mail, Cloudinary upload, language middleware
types/                  shared TypeScript types
utils/                  config, Prisma client, errors, response helpers, schema validator
docker-compose.yml      local PostgreSQL
```


## Team

| Member | Role |
| --- | --- |
| [Saurav Dhakal](https://github.com/sauravdhakal12) | Backend development |
| [Sangat Sharma](https://github.com/sangatsharma) | Frontend lead and API integration |
