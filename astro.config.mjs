// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ⚠️ AJUSTE ESTES DOIS VALORES ANTES DE PUBLICAR:
//
// Opção A) Site de usuário  -> repositório chamado "SEU-USUARIO.github.io"
//          site: 'https://SEU-USUARIO.github.io'   e   base: '/'
//
// Opção B) Site de projeto  -> repositório com qualquer nome (ex.: "blog")
//          site: 'https://SEU-USUARIO.github.io'   e   base: '/blog'
//
// Com domínio próprio (ex.: seunome.dev): site: 'https://seunome.dev' e base: '/'
const SITE = 'https://josecarlosmoura.github.io';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  integrations: [sitemap()],
  markdown: {
    // Mermaid é renderizado no navegador, então não passa pelo Shiki
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
