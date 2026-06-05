# Journal Paper Instance Files

Place downloadable benchmark instance files for the `/instances` page in this directory.

Recommended pattern:

- `paper-slug-instances.zip`
- `paper-slug-best-solutions.zip`
- `paper-slug-readme.pdf`

After adding files, register each public download in `src/data/paperInstances.ts` with an href like:

```ts
href: '/assets/files/instances/paper-slug-instances.zip'
```

Files under `public` are served directly by the exported Next.js site on GitHub Pages.

