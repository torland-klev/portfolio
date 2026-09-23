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

## Deploy (Cloudflare Pages)

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and pick this repository.
2. Build settings: framework preset **None**, build command `npm run build`, output directory `build`.
3. Under **Settings → Environment variables**, add `REACT_APP_EMAILJS_TEMPLATE_ID` and `REACT_APP_EMAILJS_PUBLIC_KEY`.
4. Under **Custom domains**, add your domain and follow the DNS steps.

Every push to `main` deploys. `public/_redirects` sends every path to `index.html`, so client-side routes such as `/blog/<id>` work on reload.
