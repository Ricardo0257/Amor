# Amor – Site fofo (HTML/CSS/JS)

Um site simples e 100% estático para perguntar: “do you love me?” com dois botões (Sim/Não). O botão “Não” foge do cursor, então só dá para clicar em “Sim”. Ao clicar em “Sim”, a imagem muda, começa a cair confete pela página, e toca o som "yippee" (arquivo local) – podendo clicar várias vezes para repetir som e confete.

## Como usar

- Basta abrir o arquivo `index.html` no navegador (duplo clique). Não precisa de servidor.
- Funciona offline e sem bibliotecas externas.

## Personalizar

- Texto da pergunta: edite o conteúdo do elemento com id `question` no `index.html` ou ajuste via JS.
- Imagens: estão embutidas como SVG (data URI) em `script.js` nas variáveis `initialImage` e `happyImage`. Você pode substituir por arquivos seus, por exemplo:
  ```js
  document.getElementById('mainImage').src = 'imagens/inicial.jpg'
  // e no clique do "Sim":
  document.getElementById('mainImage').src = 'imagens/feliz.jpg'
  ```
- Áudio: coloque seu arquivo de som na raiz como `yippee-meme-sound-effect.mp3` (já referenciado no código). Cada clique em “Sim” toca o som e dispara novos confetes. Se quiser outro nome, ajuste `SOUND_SRC` no `script.js`.

## Acessibilidade e mobile

- O botão “Não” também se move em `touchstart` e ao receber foco, para evitar que seja pressionado por teclado ou toque.
- Respeita `prefers-reduced-motion`: desativa animações caso o usuário prefira menos movimento.

## Estrutura

- `index.html` – marcação principal
- `styles.css` – estilos e tema fofinho
- `script.js` – lógica do botão que foge, confete e áudio

Aproveite e surpreenda quem você ama 💖
