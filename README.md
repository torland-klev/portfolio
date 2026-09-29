# Portfolio

Personal website of Henrik Klev. Built with React, TypeScript, Vite and Sass.

## Develop

```sh
npm install
npm start          # dev server on http://localhost:3000
npm test           # smoke tests (Vitest)
npm run build      # type check and build to ./build
npm run preview    # serve ./build
npm run worker     # run the Worker (the /api routes) on http://localhost:8787
```

The dev server sends `/api` to the Worker on port 8787, so run `npm run worker` next to `npm start` to use app posts. `npm run worker` serves `./build` too, so run `npm run build` first.

## Configuration

The contact form sends email through [EmailJS](https://www.emailjs.com/). The service ID, template ID and public key are in `src/components/pages/ContactPage.tsx`. None of them are secret.

## Content

- Projects, timeline, skills and blog posts: `src/components/pages/items.ts`
- Social links and email: `src/components/socialLinks.ts`

Each blog post has its own page at `/blog/<id>`, where `<id>` is the post's `id` in `items.ts`. If a post's body already shows its cover image, the post page does not repeat it at the top.

A post with an `app` is an app post. Its page shows the body, then the app component. The blog list labels it "Interactive". App components are in `src/components/apps/`.

### Cells

The "Cells" post is a grid of 100 × 100 cells that all visitors share. One Durable Object (`Grid` in `worker/index.ts`) holds the grid in its storage and sends each change to every open WebSocket. `src/components/apps/cellsProtocol.ts` describes the messages. The blog card image is `/api/cells.svg`. The Worker draws it from the middle third of the grid (`worker/snapshot.ts`), and it can be up to 10 seconds old.

### Ski jumper

The "Ski jumper" post is a hill that you draw, with jumpers that look like the old plastic toy. It runs only in the browser and starts new on each load. The physics (`src/components/apps/skiJumper/physics.ts`) uses SI units: gravity, snow friction, and air drag and lift with values from ski-jumping research. The comments in that file list the sources.

## Theme

Colors are CSS custom properties in `src/index.css`. The site follows the OS light or dark setting. The toggle in the header overrides it and saves the choice in `localStorage`.

## Deploy (Cloudflare Workers)

The site deploys as static assets on a Cloudflare Worker. `wrangler.jsonc` points Wrangler at `./build` and serves `index.html` for unknown paths, so client-side routes such as `/blog/<id>` work on reload. The Worker script in `worker/` handles only `/api/*`.

1. In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, and pick this repository.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. Under **Settings → Domains & Routes**, add your custom domain.

Every push to `main` deploys.
