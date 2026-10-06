// Prepara a sua foto para o blog: recorta em quadrado, redimensiona e salva em public/autor.jpg
// Uso:  npm run foto -- caminho/da/sua-foto.jpg
import sharp from 'sharp';

const input = process.argv[2];
if (!input) {
  console.error('Uso: npm run foto -- caminho/da/sua-foto.jpg');
  process.exit(1);
}

await sharp(input)
  .rotate() // respeita a orientação do celular
  .resize(800, 800, { fit: 'cover', position: 'attention' }) // recorte quadrado focando na região de interesse
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('public/autor.jpg');

console.log('Pronto! Foto salva em public/autor.jpg');
