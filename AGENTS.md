<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FoleyPlay Workspace Rules

## 1. Cloudflare Pages & Middleware
- ALWAYS use `middleware.ts` in the project root instead of Next.js 16's new `proxy.ts` convention.
- Reason: OpenNext's Cloudflare adapter does not yet support the Node.js runtime for proxy compilation, causing Pages deployment builds to fail with "ERROR Node.js middleware is not currently supported".

## 2. Local Database & Migrations (D1 + Drizzle)
- If the application redirects authenticated users to `/pending` because the `users` query fails, the local SQLite/D1 database might be empty or missing tables.
- Solution: Run migrations locally before launching the dev server:
  `npx wrangler d1 migrations apply foleyplay-db --local`

## 3. Next.js Compiler Cache Loop (OOM)
- If files related to middleware/routing are renamed or deleted, Next.js Turbopack may enter an infinite loop attempting to parse missing modules and eventually crash the process with "JavaScript heap out of memory".
- Solution: Clear the cache directory: `rm -rf .next` and restart the development server.

## 4. Port Conflicts
- Since the workspace hosts multiple storefront projects (e.g. ReClic), check for process collisions on port 3000 using `lsof -i :3000`. Kill or free port 3000 if FoleyPlay needs to run there.

## 5. Cloudflare Workers Deployment & GitHub Deployments Badge
- Deploy command: `npm run deploy` (which runs `npx @opennextjs/cloudflare build && npx wrangler deploy`).
- Live Production URL: `https://foleyplay.cristborrero.workers.dev`.
- GitHub Deployment Status: If GitHub Deployments displays a red ❌ due to stale external bots (e.g. legacy Vercel webhook), update or register the active deployment status directly via GitHub CLI:
  ```bash
  DEPLOY_ID=$(gh api --method POST repos/cristborrero/foleyplay/deployments -f ref=main -f environment=Production -f description="Cloudflare Workers OpenNext" -F auto_merge=false --jq '.id')
  gh api --method POST repos/cristborrero/foleyplay/deployments/$DEPLOY_ID/statuses -f state=success -f environment_url="https://foleyplay.cristborrero.workers.dev" -f description="FoleyPlay Cloudflare Active"
  ```
