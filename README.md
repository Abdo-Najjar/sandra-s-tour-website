# Syria Guide Tours

Website and dashboard for [yoursyrianguide.com](https://yoursyrianguide.com).

- **Website:** English at the plain URLs (`/tours`), Arabic under `/ar` (`/ar/tours`), right-to-left.
- **Dashboard:** `/admin`, English by default with an Arabic switch. Edits all website text, tours, articles, pages, bookings and messages.
- **Fixed interface text:** `src/messages/en.json` and `src/messages/ar.json`. The dashboard is written in English in the code (`t("Bookings")`); its Arabic is in `ar.json` under `dashboard`. Website labels are under `site` in both files.
- **Database:** SQLite (`local.db`) through Drizzle. Bilingual text is stored as JSON: `{"en": "...", "ar": "..."}`.

## Local setup

```bash
cp .env.example .env
npm install
npm run db:setup   # create tables + sample content
npm run dev        # http://localhost:3000
```

## Deploy (server)

```bash
git pull
npm install
npm run db:push            # updates the tables (and upgrades older databases first)
npm run db:refresh-content # optional: reset website text to the latest defaults (backup in backups/)
npm run build
pm2 reload sandra-website
```

Pages are pre-built from the database, so run the database steps before `npm run build`.

## Useful scripts

| Script | What it does |
| --- | --- |
| `npm run db:push` | Applies `src/db/schema.ts` to the database |
| `npm run db:seed` | Adds sample content and dashboard logins |
| `npm run db:refresh-content` | Resets website text to `src/lib/site/content.ts` / `content-ar.ts` |
| `npm run db:studio` | Opens Drizzle Studio to browse the database |
| `npm run i18n:check` | Lists dashboard text without Arabic and website labels missing from `ar.json` |
