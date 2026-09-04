# Inter SG — Material de Patrocínio

Site estático com o deck de patrocínio (23 slides) e o tour da marca.

## Como publicar no GitHub Pages

### 1. Baixe a pasta
Baixe o arquivo `site.zip` e descompacte. Dentro tem `index.html`, `deck.html`, `tour.html`, os `.css`, os `.js` e a pasta `assets/`.

### 2. Crie o repositório
- Entre em github.com e clique em **New repository** (botão verde).
- Nome sugerido: `inter-sg`
- Marque **Public** (o GitHub Pages gratuito exige repositório público).
- **Não** marque "Add a README file".
- Clique em **Create repository**.

### 3. Suba os arquivos
- Na página do repositório vazio, clique em **uploading an existing file**.
- Arraste **o conteúdo de dentro** da pasta descompactada — não a pasta em si. Precisa ter o `index.html` na raiz.
- Arraste também a pasta `assets/` inteira.
- Escreva "primeira versão" no campo de descrição e clique em **Commit changes**.

### 4. Ligue o GitHub Pages
- No repositório, vá em **Settings** (engrenagem no topo).
- No menu da esquerda, clique em **Pages**.
- Em "Source", escolha **Deploy from a branch**.
- Em "Branch", escolha **main** e a pasta **/ (root)**. Clique em **Save**.

### 5. Aguarde e acesse
Em 1 a 2 minutos o endereço aparece no topo da mesma página:

```
https://SEU-USUARIO.github.io/inter-sg/
```

Esse é o link que você manda para o patrocinador.

## Atualizar depois

Para trocar uma foto ou um texto: no GitHub, clique no arquivo, no ícone de lápis, edite e dê **Commit changes**. O site atualiza sozinho em cerca de 1 minuto.

Para substituir arquivos em lote, use **Add file → Upload files** na raiz do repositório — arquivos com o mesmo nome são sobrescritos.

## Estrutura

```
index.html        capa com os dois links
deck.html         deck de patrocínio (23 slides)
tour.html         tour animado da marca
slides.css        layout dos slides
styles.css        base tipográfica e cores
deck-stage.js     navegação, miniaturas e impressão do deck
image-slot.js     espaços de foto arrastáveis
interactions.js   interações do deck
brazil-map.js     mapa de audiência por estado
animations.jsx    motor de animação do tour
tour-scenes.jsx   roteiro do tour
tour-visuals.jsx  visuais do tour
assets/           fotos, logos e renders do projeto do CT
```

## Navegação do deck

Setas ← → ou clique nas laterais. Tecla `G` abre as miniaturas. `Ctrl/Cmd + P` gera PDF (uma página por slide).
