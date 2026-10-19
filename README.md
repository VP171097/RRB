# Mission RRB

A study tool for RRB exams, with one website and a dropdown to switch between **NTPC Graduate** (default), **NTPC Undergraduate** and **Group D**. Each exam has its own plan, syllabus, notes, quiz bank, links, PDFs and saved progress.

    app/                the website (React + Vite)
    RRB_Graduate/       NTPC Graduate content and PDFs
    RRB_UnderGraduate/  NTPC Undergraduate content and PDFs
    RRB_GroupD/         Group D content and PDFs

## Run locally

Needs Node 20 or newer.

    cd app
    npm install
    npm run dev          # landing at http://localhost:5173/ , study app at http://localhost:5173/app/

## Publish on GitHub Pages

1. Merge into `main`.
2. Repository **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/pages.yml` builds and publishes on every push that touches `app/` or `RRB_*/`.

## What the site has

| Section | Pages |
|---|---|
| Home | Today, Mission (the 13-station game) |
| Plan | Days (one week per page), Topics, Syllabus |
| Learn | Tricks, Notes, Papers, Library, Links, Pattern |
| Practice | Quiz, Speed Maths, Cards, Focus |
| Track | Mocks, Errors, Rewards, Group, Settings |

Progress is stored in the browser, separately for each exam. Look-and-feel settings are shared. Use **Settings → Export backup** to move progress between devices.

## Sign-in, cloud saving and study groups

Optional. Follow `supabase/SETUP.md` (about ten minutes, free) to turn on accounts, saving across devices, and group leaderboards. Without it the site saves in the browser only.

## PDFs

Drop PDFs into `RRB_<exam>/pdfs/<folder>/` and commit them, or from `app/`:

    npm run fetch-pdf -- "<direct-pdf-url>" graduate/pyq/ntpc-2025-shift1.pdf

`graduate`, `undergraduate` or `groupd`, then `syllabus`, `pyq`, `notes`, `books` or `other`. The Library page reads them after the next build.

## Hindi
The site has an English / Hindi switch (when creating an account and under Track → Settings; saved on the account when signed in). Text goes through `t('English text')` (`app/src/i18n.jsx`) with dictionaries in `app/src/i18n/hi/` and `RRB_*/hi/dict.js`. Hindi lessons, drills, tricks, quiz and notes live in `RRB_*/hi/`; anything without a Hindi entry falls back to English. Please have a Hindi speaker proofread before relying on it.

## Sign-in is required, and the app can be installed
When Supabase is set up (`app/src/cloud-config.js`), the app asks people to sign in or create an account before it opens, and keeps them signed in on that device until they tap Sign out. It is a Progressive Web App (`app/public/manifest.webmanifest`, `app/public/sw.js`): browsers offer **Install app**, and there is an Install button on the sign-in screen, the landing page and in Settings. The service worker is network first, so updates arrive straight away and the last copy opens offline.
