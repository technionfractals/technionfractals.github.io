# Technion Fractals Seminar

A minimal, static seminar website built with Astro and managed through Pages CMS.

## Cost

The complete setup can be operated at no monetary cost:

- GitHub Pages hosts the public website from this public repository.
- GitHub Actions builds the static Astro site.
- Pages CMS edits the Markdown and JSON files through its hosted editor.
- KaTeX renders mathematical notation at build time.
- A Google Form can be linked from the Submit page.

No backend, database, paid font, or paid hosting service is required.

## Local development

Requirements: Node.js 22.12 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Run the full type check and production build with:

```sh
pnpm build
```

## Content management

1. Install the Pages CMS GitHub App for this repository.
2. Open [app.pagescms.org](https://app.pagescms.org/) and select `technionfractals/technionfractals.github.io`.
3. Use **Talks** to create or edit talks. Set a talk to `published` when it should appear publicly.
4. Use **Seminar settings** to set the description, organizers, participants, contact email, and Google Forms URL.
5. Save the change. Pages CMS commits it to GitHub; the Pages workflow rebuilds the site automatically.

The CMS configuration is in `.pages.yml`. Talk abstracts are Markdown files in `src/content/talks`; they support LaTeX-style `$inline$` and `$$display$$` notation.

## First deployment

1. Push this project to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Run the **Deploy to GitHub Pages** workflow, or push another change.

The site will be available at `https://technionfractals.github.io/`.

## Submission form

Create a Google Form with the desired talk fields, then paste its public URL into `submissionFormUrl` under **Seminar settings** in Pages CMS. Until that is set, the Submit page clearly displays a not-connected state.
