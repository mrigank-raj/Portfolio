# Mrigank Raj Chouhan — Product Portfolio

Live: https://mrigankraj.vercel.app/

A portfolio of AI products and product case studies. Every project shows the obvious version I didn't build, what I built instead, and the metric that says whether it's working.

## What's inside

- **Projects:** HDFC Fund Facts, BeyondLabel, App Review Pulse, A/B Decision Engine, Plutus, Kudos
- **Case studies:** Google Photos, Myntra, AI-first cashless claims, ChatGPT Voice in India, MyJio, Zomato
- **Off the clock:** writing on Medium

## Structure

```
index.html            homepage
work/*.html           one page per project and case study
assets/css/main.css   site styles
assets/css/case.css   case study page styles
assets/js/site.js     shared motion: nav progress ring, count-up metrics, heading underlines, footer reveal
vercel.json           clean URLs (/work/kudos instead of /work/kudos.html)
sitemap.xml, robots.txt
```

Plain HTML, CSS and JavaScript. No build step: open `index.html` through any static server, or push to deploy on Vercel.

## Updating

- **Publish a Medium article:** in `index.html`, find `const ARTICLES` and fill in the `url`, `date` and `read` for that article. Rows without a `url` show "Coming soon".
- **Medium profile link:** set `const MEDIUM_URL` and the `href` on `#wr-medium` in `index.html`.
- **After changing CSS or JS:** bump the `?v=` number on its `<link>` / `<script>` tags so browsers fetch the new file.

## Contact

- LinkedIn: https://www.linkedin.com/in/mrigankraj
- Email: mrigankrajchouhan@gmail.com

Independent portfolio. Teardowns are based on publicly observable behaviour and my own research, and are not affiliated with the companies discussed.
