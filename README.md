# Blog em Astro + GitHub Pages (vários assuntos)

Blog estático, gratuito e rápido, pensado para **visibilidade**: SEO, sitemap, RSS, dados estruturados (JSON-LD),
imagens de compartilhamento (Open Graph) para LinkedIn/X/WhatsApp, botões de compartilhar, séries de posts, tags,
diagramas **Mermaid**, páginas HTML embutidas e blocos de código com tema claro/escuro.

## 1. Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321
```

## 2. Personalizar (5 minutos)

| O quê | Onde |
| --- | --- |
| Nome do blog, descrição, sua bio, links do LinkedIn/GitHub, **lista de assuntos** | `src/consts.ts` |
| URL do site (`site`) e pasta base (`base`) | `astro.config.mjs` |
| **Sua foto** | `npm run foto -- minha-foto.jpg` (veja a seção 4) |
| Imagem de compartilhamento padrão | `scripts/og-default.svg` (gere o PNG, seção 7) |
| Cores e tipografia | `src/styles/global.css` (variáveis no topo) |

## 3. Assuntos e artigos

O blog é organizado em **assuntos**. Cada assunto vira um item de menu, uma página própria
(`/blog/<assunto>/`) e uma pasta com seus artigos:

```
src/content/blog/
  ia-aplicada/
    rag-na-pratica.md          →  /blog/ia-aplicada/rag-na-pratica/
  engenharia-de-software/
    clean-architecture.md      →  /blog/engenharia-de-software/clean-architecture/
```

**Criar um assunto novo**

1. Em `src/consts.ts`, acrescente um item em `TOPICS` (o `slug` é o nome da pasta, em minúsculas e com hífens):
   ```ts
   { slug: 'dados', name: 'Dados', description: 'Engenharia de dados, SQL e analytics.' },
   ```
2. Crie a pasta `src/content/blog/dados/` e coloque o primeiro artigo lá dentro.

O assunto aparece no menu, na home e no rodapé assim que tiver o primeiro artigo publicado. Até 4 assuntos ficam
direto no menu; com 5 ou mais, o menu vira o item suspenso **Assuntos**.

**Escrever um artigo**: crie um `.md` dentro da pasta do assunto:

```markdown
---
title: "Título do artigo"
description: "Resumo de 1 a 2 frases. Aparece no Google e nos cartões do LinkedIn."
pubDate: 2026-10-20
tags: ["Deep Learning", "Transformers"]   # opcional, cruza assuntos
series: "Fundamentos de IA Aplicada"       # opcional
seriesOrder: 2                             # opcional
cover: /capas/transformers.png             # opcional (1200x630 em /public/capas)
embed: /visuais/meu-guia.html              # opcional (página HTML em /public/visuais)
draft: false                               # true = não publica
---

Seu conteúdo em Markdown...
```

Se a pasta não existir em `TOPICS`, o build avisa com uma mensagem clara.

## 4. Sua foto

A foto aparece na home, na página Sobre e no fim de cada artigo. Por enquanto há um avatar provisório com as iniciais.

```bash
npm run foto -- caminho/da/sua-foto.jpg
```

O comando recorta em quadrado, ajusta o tamanho e salva em `public/autor.jpg`. Se preferir, basta substituir
esse arquivo pela sua foto (quadrada, de preferência 800×800).

## 5. Páginas HTML embutidas

Para exibir uma página HTML pronta dentro de um artigo (por exemplo um guia visual animado), salve o arquivo em
`public/visuais/` e use `embed: /visuais/nome.html` no front matter. Ela roda isolada em um iframe com altura automática.

## 6. Publicar no GitHub Pages

1. Crie um repositório no GitHub.
   - **Recomendado:** nomeie como `SEU-USUARIO.github.io`. O blog fica em `https://SEU-USUARIO.github.io`.
   - Qualquer outro nome também funciona, mas o blog fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO`.
2. Em `astro.config.mjs`, ajuste:
   - Repositório `SEU-USUARIO.github.io`: `SITE = 'https://SEU-USUARIO.github.io'` e `BASE = '/'`
   - Outro nome de repositório: `SITE = 'https://SEU-USUARIO.github.io'` e `BASE = '/NOME-DO-REPO'`
3. Envie o código:
   ```bash
   git init -b main
   git add .
   git commit -m "Primeira versão do blog"
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
4. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Cada `git push` na branch `main` publica o site automaticamente (aba **Actions** mostra o progresso).

## 7. Imagem de compartilhamento (PNG)

LinkedIn e Facebook **não aceitam SVG** em Open Graph, então a imagem precisa ser PNG ou JPG (1200×630).
Edite `scripts/og-default.svg` e converta:

```bash
node -e "require('sharp')('scripts/og-default.svg').png().toFile('public/og-default.png')"
```

Para capas por artigo, salve PNGs em `public/capas/` e use o campo `cover` no front matter.

## 8. Checklist de visibilidade

- [ ] Cadastrar o site no **Google Search Console** e enviar `sitemap-index.xml`.
- [ ] Ao divulgar no LinkedIn, colar o link e conferir o cartão no [Post Inspector](https://www.linkedin.com/post-inspector/).
- [ ] Publicar em **série** e com regularidade (por exemplo, 1 artigo por semana).
- [ ] Divulgar também em Dev.to ou Hashnode com *canonical URL* apontando para o seu blog.
- [ ] Colocar o link do blog no perfil do LinkedIn (seção "Destaques") e do GitHub.
- [ ] Domínio próprio (opcional): em **Settings → Pages → Custom domain** e atualizar `SITE`/`BASE`.

## Estrutura

```
src/
  consts.ts            # configurações, autor e lista de assuntos
  lib/blog.ts          # leitura dos artigos e dos assuntos
  content/blog/<assunto>/   # seus artigos (.md), uma pasta por assunto
  components/          # cabeçalho, rodapé, SEO, cartão de post, caixa do autor, embed de HTML
  layouts/             # layout base
  pages/               # home, /blog, /blog/<assunto>, /sobre, /tags, rss.xml, robots.txt, 404
  styles/global.css    # estilos e tema claro/escuro
public/                # autor.jpg, favicon, imagem Open Graph, capas, visuais
scripts/               # foto.mjs (recorte da foto) e og-default.svg
.github/workflows/     # deploy automático no GitHub Pages
```
