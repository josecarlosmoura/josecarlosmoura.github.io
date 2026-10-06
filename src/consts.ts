// Configurações do blog: edite aqui para personalizar tudo de uma vez.
export const SITE_TITLE = 'José Carlos de Moura e Silva';
export const SITE_SUBTITLE = 'Desenvolvimento de Software e IA Aplicada';
export const SITE_TAGLINE =
  'Desenvolvimento de Software, IA Aplicada e carreira, explicadas com esquemas e exemplos práticos.';
export const SITE_DESCRIPTION =
  'Blog de José Carlos de Moura e Silva sobre Desenvolvimento de Software, IA Aplicada e carreira em tecnologia: conceitos explicados com esquemas, resumos e mini-projetos.';

export const AUTHOR = {
  name: 'José Carlos de Moura e Silva',
  role: 'Desenvolvedor Sênior · Bacharel em Sistemas de Informação · Pós-graduando em IA Aplicada',
  bio: 'Programo há muitos anos e hoje estudo IA Aplicada na pós-graduação. Neste blog eu registro o que aprendo sobre Desenvolvimento de Software, IA e carreira, em esquemas, resumos e mini-projetos, para fixar o conteúdo e ajudar quem está no mesmo caminho.',
  // Sua foto: substitua o arquivo public/Jose.jpeg (veja o README, comando "npm run foto")
  photo: '/Jose.jpeg',
};

// Preencha com seus links (deixe vazio '' para ocultar o botão)
export const SOCIAL = {
  github: 'https://github.com/josecarlosmoura',
  linkedin: 'https://www.linkedin.com/in/josecarlosmouraesilva/',
  email: 'josecarlos.moura23@outlook.com',
};

// ASSUNTOS do blog. Cada assunto vira um item de menu e uma página própria.
// O "slug" é o nome da pasta dentro de src/content/blog/ onde ficam os artigos do assunto.
// O assunto só aparece no menu depois que tiver o primeiro artigo publicado.
export const TOPICS = [
  {
    slug: 'ia-aplicada',
    name: 'IA Aplicada',
    description: 'LLMs, RAG, agentes, machine learning e exemplos práticos.',
  },
  {
    slug: 'engenharia-de-software',
    name: 'Engenharia de Software',
    description: 'Arquitetura, boas práticas, qualidade de código, testes e entrega de software.',
  },
  {
    slug: 'carreira',
    name: 'Carreira e Estudos',
    description: 'Aprendizados da pós-graduação e dicas para evoluir na carreira de tecnologia.',
  },
];

// Transforma "IA Generativa" em "ia-generativa" para usar em URLs
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
