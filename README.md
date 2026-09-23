# Portfolio

Personal website of Henrik Klev. Built with React, TypeScript, Vite and Sass.

## Develop

```sh
npm install
npm start          # dev server on http://localhost:3000
npm test           # smoke tests (Vitest)
npm run build      # type check and build to ./build
npm run preview    # serve ./build
```

## Configuration

The contact form sends email through [EmailJS](https://www.emailjs.com/). Set these variables in `.env.local` or in the hosting environment:

```
REACT_APP_EMAILJS_TEMPLATE_ID=...
REACT_APP_EMAILJS_PUBLIC_KEY=...
```

## Content

- Projects, timeline, skills and blog posts: `src/components/pages/items.ts`
- Social links and email: `src/components/socialLinks.ts`

Each blog post has its own page at `/blog/<id>`, where `<id>` is the post's `id` in `items.ts`. If a post's body already shows its cover image, the post page does not repeat it at the top.

## Theme

Colors are CSS custom properties in `src/index.css`. The site follows the OS light or dark setting. The toggle in the header overrides it and saves the choice in `localStorage`.

## Deploy (Cloudflare Workers)

The site deploys as static assets on a Cloudflare Worker. `wrangler.jsonc` points Wrangler at `./build` and serves `index.html` for unknown paths, so client-side routes such as `/blog/<id>` work on reload.

1. In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, and pick this repository.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Under **Settings → Build → Variables and secrets**, add `REACT_APP_EMAILJS_TEMPLATE_ID` and `REACT_APP_EMAILJS_PUBLIC_KEY`. They are build variables, because Vite puts them into the bundle at build time.
4. Under **Settings → Domains & Routes**, add your custom domain.

Every push to `main` deploys.
