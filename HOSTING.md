# Putting the site online for free

## Current setup (live)

The site is live on GitHub Pages: **https://harshit7922.github.io/spine-pain-guide/**

- Pages serves the **`gh-pages`** branch (root folder). `main` holds the same code.
- To publish a change: commit on `main`, then run `python3 tools/bundle.py` (refreshes the offline file list in `sw.js`), commit that too, and push both branches:
  `git push origin main && git push origin main:gh-pages`
- Installed apps pick up the new version the next time they open online (the offline cache name changes with every build).
- To serve from `main` instead: repository **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**; then only `main` needs pushing.
- A custom domain can be added later in **Settings → Pages → Custom domain** (plus a `CNAME` file and DNS records at the registrar).

## Other free options

Do this only after a doctor has reviewed the rules (see the review pack). The site is fully static: it collects no data, needs no server, and works offline once loaded.

The ready-to-host copy is `dist/web/index.html` (the whole site in one file). Rebuild it any time with `python3 tools/bundle.py`.

### Option 1 – Netlify Drop (fastest, about 2 minutes)

1. Open https://app.netlify.com/drop in Chrome or Edge.
2. Drag the `dist/web` folder onto the page (a zip of it also works).
3. A link ending in `netlify.app` appears. Without an account the link has a temporary password; sign up or log in and **claim** the project to make it a normal public link.
4. To update later: open the project in Netlify and drag the new `dist/web` folder into **Production deploys**.

Netlify notes deploys under 50 MB work best and single files over 10 MB may stall; this site is about 3 MB.

### Option 2 – GitHub Pages (manual) (free, with version history)

1. Create a new **public** repository on GitHub (free accounts need a public repository for Pages).
2. Upload `dist/web/index.html` to the repository root and commit it to the `main` branch.
3. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
4. After a minute the site is at `https://<your-username>.github.io/<repository-name>/`.
5. To update: upload the new `index.html` over the old one and commit.

Pages sites are public even if the repository is private, so keep personal medical files (MRI reports, case summary) out of that repository.

## Before going public – checklist

- [ ] Doctor review done and changes made
- [ ] Hindi text checked by a fluent reader
- [ ] Tested on at least one Android phone and one iPhone
- [ ] Emergency numbers (108, 112) correct for your audience

---

## हिंदी में (संक्षेप)

1. पहले डॉक्टर से रिव्यू करवाएं।
2. **Netlify Drop:** https://app.netlify.com/drop खोलें → `dist/web` फ़ोल्डर खींचकर डालें → `netlify.app` वाला लिंक मिलेगा। अकाउंट बनाकर प्रोजेक्ट "claim" करें ताकि लिंक पर पासवर्ड न रहे।
3. **GitHub Pages:** नया public repository → `index.html` अपलोड → Settings → Pages → Deploy from a branch → `main` / root → Save।
4. अपनी MRI रिपोर्ट या निजी फ़ाइलें ऑनलाइन वाले फ़ोल्डर में न डालें।
