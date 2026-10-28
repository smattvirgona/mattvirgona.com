# mattvirgona.com

Static portfolio site — plain HTML/CSS/JS, no build step.

## Editing

| What | Where |
|---|---|
| Name and game link | `content.js` |
| Colors and fonts | top of `style.css` (`:root`) |
| Layout / sections | `index.html` |
| Glitch timing & effects | `script.js` and the `glitch` rules in `style.css` |


To preview locally:

```bash
python3 -m http.server 8000
```

then open http://localhost:8000.

## Hosting (GitHub Pages)

1. Push this folder to a GitHub repo.
2. Repo **Settings → Pages** → deploy from branch `main`, folder `/ (root)`.
3. At your domain registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `<your-github-username>.github.io`
4. Back in Pages settings, confirm the custom domain `mattvirgona.com` and tick **Enforce HTTPS** once it's available.

The `CNAME` file in this repo already tells GitHub Pages the domain.
