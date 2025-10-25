# Amor – Site fofo (HTML/CSS/JS)

Um site simples e 100% estático para perguntar: “do you love me?” com dois botões (Sim/Não). O botão “Não” foge do cursor, então só dá para clicar em “Sim”. Ao clicar em “Sim”, a imagem muda, começa a cair confete pela página, e toca o áudio/frase “Yhupiiiii! me too :3” via síntese de voz do navegador.

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
- Áudio: por padrão usa `speechSynthesis` (voz do navegador). Para usar um arquivo de áudio seu, troque o bloco do `SpeechSynthesisUtterance` por:
  ```js
  const audio = new Audio('audio/yhupiii-me-too.mp3');
  audio.play();
  ```

## Acessibilidade e mobile

- O botão “Não” também se move em `touchstart` e ao receber foco, para evitar que seja pressionado por teclado ou toque.
- Respeita `prefers-reduced-motion`: desativa animações caso o usuário prefira menos movimento.

## Estrutura

- `index.html` – marcação principal
- `styles.css` – estilos e tema fofinho
- `script.js` – lógica do botão que foge, confete e áudio

Aproveite e surpreenda quem você ama 💖
