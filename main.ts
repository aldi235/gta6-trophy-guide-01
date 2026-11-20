// Leonida Trophy Guide — the program that hands the entry in (Node 22, standard
// library only). The guide itself is the static files under app/ beside this
// file: plain HTML, CSS and ES modules, no build step, nothing fetched over the
// network, with the trophy data in app/data/trophies.json. This program copies
// app/ and screenshots/ into the output directory and writes dossier.json
// there with the vendored make.fun library — the summary the judge reads
// (screenshots, first-load files and bytes, and the source).
//
// vendor/makefun-frontend.ts is the kit's copy, left alone: the scorer rebuilds
// the dossier with its own copy and the two must match byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, MAKEFUN_OUTPUT_DIR is unset and the output goes to /output.
// Serve the app itself with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own (reference/gate.json): the text cap shapes
// the dossier's bytes; the rest refuse an entry the scorer would refuse —
// more than 4 screenshots, one over 256 KiB, or app/ past 993 files and
// directories or 48 MiB (app/ shares /output's own 1,000-entry cap with
// screenshots/ and dossier.json).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
