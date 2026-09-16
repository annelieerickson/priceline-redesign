import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project at https://<user>.github.io/<repo>/
const GITHUB_PAGES_BASE = '/priceline-redesign/'

// GitHub Pages has no server-side routing, so a deep link such as
// /priceline-redesign/departure would 404. Pages serves 404.html for unknown
// paths, so shipping the app as 404.html too lets React Router handle them.
function spaFallback() {
  let outDir
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
// Keyed off mode, not command, so `vite preview` serves the built site from the
// same subpath GitHub Pages uses, while `vite dev` stays at the root.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GITHUB_PAGES_BASE : '/',
  plugins: [react(), spaFallback()],
}))
