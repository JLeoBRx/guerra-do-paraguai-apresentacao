# Guerra do Paraguai (1864–1870) — apresentação digital

Apresentação interativa, em formato de exposição de museu e documentário, sobre a Guerra do Paraguai. Trabalho de História da turma **Mecatrônica 2**.

**Integrantes:** Pedro Henrique · Clara Maria · Anthony Marcos · Gabriel Willian · Leandro Farias · Lohan David

Site publicado: https://guerra-do-paraguai-museu-digital.onrender.com

Ao abrir o endereço, a apresentação começa direto na abertura. Não há página de artigo nem botão para revelar os slides.

### Outras apresentações neste repositório

Cada uma fica numa pasta própria, com o mesmo motor de slides e seu próprio README:

| Pasta | Apresentação | Endereço |
|---|---|---|
| `segundo-reinado/` | A Crise do Segundo Reinado (18 slides, com PowerPoint e PDF) | https://guerra-do-paraguai-museu-digital.onrender.com/segundo-reinado/ |
| `o-segundo-reinado/` | O Segundo Reinado, 1840–1889 (18 slides, panorama do período) | https://guerra-do-paraguai-museu-digital.onrender.com/o-segundo-reinado/ |
| `crise-do-segundo-reinado/` | A Crise do Segundo Reinado em 12 slides (capa, 10 de conteúdo e referências), com arco narrativo | https://guerra-do-paraguai-museu-digital.onrender.com/crise-do-segundo-reinado/ |

## Visual: feito para projetor fraco

- **Fundo escuro com degradê forte** (azul-noite → roxo → vinho) e **texto branco grande**, com destaque dourado. Pensado para projetores opacos, em que fundos claros ficam lavados.
- **Textos em tópicos curtos e grandes**, que aparecem **um por clique** (seta **→**, clique ou toque). O tópico atual fica destacado em dourado; os anteriores continuam na tela, para o grupo se reencontrar se esquecer a fala.
- **Fontes:** Source Serif 4 nos títulos e IBM Plex Sans no texto (licença OFL, salvas em `assets/fonts`).
- **Mapas escuros** com rios em azul-claro, o Paraguai em vermelho e o lado aliado em azul; imagens com as cores originais.

## Roteiro (15 slides)

| # | Slide | Cena e transição |
|---|-------|------------------|
| 1 | Abertura | Título letra a letra, datas em contagem e a pintura de Victor Meirelles revelada como um obturador · *revelação suave* |
| 2 | Contexto histórico | 3 tópicos (rios, Paraguai sem mar, países jovens) e mapa que aproxima do continente até a Bacia do Prata, com a rota fluvial até o Atlântico · *aproximação sobre o mapa* |
| 3 | Pindorama e os povos indígenas | 3 tópicos (“terra das palmeiras”, o guarani, indígenas na guerra) e mapa em que as fronteiras atuais se apagam e surgem os povos, por família linguística · *luz que atravessa a copa das árvores* |
| 4 | Causas | 3 tópicos: tensões antigas, o estopim de 1864–1865 e o alerta contra explicações simplistas · *documentos colocados sobre a mesa* |
| 5 | Países envolvidos | Os quatro países aparecem um por clique, com retratos de época e cartões que viram · *meridiano que varre a cena* |
| 6 | Início do conflito | Cena em 5 etapas: protesto paraguaio, intervenção no Uruguai, *Marquês de Olinda*, Mato Grosso e Corrientes, com regiões e rotas no mapa · *dissolução* |
| 7 | Tríplice Aliança | Cena em 5 etapas: Paraguai isolado; Brasil, Argentina e Uruguai entram no mapa; tratado carimbado e triângulo entre as capitais · *íris* |
| 8 | Cronologia | Linha do tempo com 14 acontecimentos clicáveis e o ano de fundo avançando de 1864 a 1870 · *passagem do tempo* |
| 9 | Mapa das campanhas | 5 fases com zoom, regiões destacadas, rotas desenhadas, carimbo de datas, legenda progressiva e marcadores clicáveis · *mergulho no mapa* |
| 10 | Campanhas e batalhas | 5 batalhas com mini-mapa localizador, ano animado e sequência antes · combate · resultado · *corte dramático* |
| 11 | Consequências humanas | Fotografia de 1867 e 4 tópicos, mais a pergunta “quantos morreram?” · *desaceleração sóbria* |
| 12 | Consequências políticas e econômicas | Um país por clique (Paraguai, Brasil, Argentina, Uruguai), com fotografia e charge de Agostini · *folha de documento* |
| 13 | Interpretações históricas | Três correntes historiográficas, uma por clique, e o critério adotado · *dissolução* |
| 14 | Conclusão | Mapa da América do Sul com o Paraguai destacado; pergunta, resposta e lição, uma por clique · *encerramento* |
| 15 | Referências | 20 referências, método e créditos das imagens · *folha de documento* |

## Roteiro de falas e divisão do grupo

Cada slide tem a fala completa de quem apresenta: abertura, uma fala por tópico revelado, a conexão **com os olhos de hoje**, respostas para **se perguntarem** e a frase de transição, que já cita quem fala em seguida. As orientações entre colchetes (por exemplo **[APONTAR PARA O MAPA]** ou **[FAZER UMA PAUSA]**) não são faladas.

| Integrante | Slides |
|---|---|
| Pedro Henrique e Anthony Marcos (em dupla) | 1, 2, 13, 14 e 15 |
| Lohan David | 3 e 4 |
| Gabriel Willian | 5 e 6 |
| Leandro Farias | 7 e 8 |
| *Pendentes de distribuição* | 9 e 10 |
| Clara Maria | 11 e 12 |

- **Tempo total estimado:** cerca de 20 minutos (os tempos por pessoa e por slide estão em `ROTEIRO.md`).
- **Fonte única:** `js/notes.js`. Dele saem o modo apresentador, o `ROTEIRO.md` completo e os seis roteiros individuais `FALA_PEDRO_HENRIQUE.md`, `FALA_ANTHONY_MARCOS.md`, `FALA_LOHAN_DAVID.md`, `FALA_GABRIEL_WILLIAN.md`, `FALA_LEANDRO_FARIAS.md` e `FALA_CLARA_MARIA.md`. Depois de mudar uma fala, rode `node scripts/build-roteiro.mjs`; o validador acusa documentos desatualizados.
- **Slides 9 e 10:** ainda sem responsável. Para definir, preencha `responsaveis` desses slides em `js/notes.js`, apague `pendente: true`, ponha o nome de quem fala na transição do slide 8 e gere os documentos de novo.

## Modo apresentador

- **No computador (duas janelas):** botão de tela no canto superior direito ou tecla **P**. Abre `presenter.html` em outra janela, que vai para a tela do notebook enquanto a projeção fica no projetor. As duas janelas ficam sincronizadas: o apresentador acompanha o slide e o tópico projetados e controla a projeção. A projeção nunca mostra as notas.
- **No celular (modo consulta):** o mesmo botão abre o roteiro na própria aba, no slide e tópico em que a apresentação estava; **Voltar à apresentação** retorna ao mesmo ponto. Nesse modo o roteiro avança só no aparelho. Se o celular também estiver projetando, a turma vê a tela do roteiro: ele não é uma tela privada.
- **O que mostra:**
  - quem fala agora, em destaque e com uma cor por integrante, e quem fala depois;
  - o slide, o tópico atual, o próximo e o progresso geral;
  - o roteiro do slide em cartões: a fala atual destacada, as anteriores esmaecidas e a próxima marcada **A seguir**, com rolagem automática;
  - as orientações entre colchetes como etiquetas, e a transição (**Passar a palavra: …**) no fim de cada slide;
  - **Se perguntarem**, a prévia da projeção, os cronômetros e o ritmo em relação ao plano, e a lista de todos os slides com os responsáveis.
- **Botões grandes:** slide anterior, tópico anterior, **Avançar fala** (que mostra o próximo tópico na projeção quando chega a hora) e próximo slide. Cada cartão tem um botão para marcar a fala como apresentada.
- **Atalhos no computador:** **→**/Espaço avança a projeção, **←** volta, **↓**/Enter próxima fala, **↑** fala anterior, **M** marca a fala, **T** e **R** controlam o cronômetro.

## No celular

- **Em pé (retrato):** cada slide vira uma página vertical entre duas barras fixas, sem nada cobrindo o conteúdo. Os tópicos aparecem um por toque: os próximos ficam como espaços tracejados, e a tela rola sozinha até o tópico novo. A barra de baixo traz voltar, número do slide e do tópico, áudio, modo apresentador e avançar.
- **Deitado (paisagem):** o slide aparece no formato 16:9 do projetor, com os controles numa coluna à direita, ao alcance do polegar.
- **Toque:** tocar no slide avança; botões, links, referências e mapas não avançam por engano. Deslizar para os lados também navega.
- **Áreas seguras:** as barras respeitam o entalhe e a barra de gestos dos celulares. Uma dica discreta lembra que dá para girar o aparelho, sem bloquear nada.

## Áudio: narração e trilha

- **Comportamento:** nada toca sozinho. Ícone de som (ou tecla **A**) abre o painel com:
  - narração: iniciar e pausar, repetir, próximo slide e avançar sozinho ao terminar;
  - sincronização das etapas das cenas com a narração;
  - volume geral e volume da trilha;
  - silenciar tudo (tecla **M**).
- **Narração:** **ainda não foi gravada.** O player está pronto, mas nenhuma voz foi simulada. Para gravar e cadastrar as falas, siga `assets/audio/narracao/LEIA-ME.md`.
- **Trilha instrumental:** opcional e discreta, sintetizada no navegador com a Web Audio API. Não é uma gravação. Fica mais baixa automaticamente quando há narração.

## Linguagem de movimento

- **Transições entre slides:** cada slide tem a sua, ligada à narrativa — revelação suave (abertura), aproximação sobre o mapa (contexto), luz que atravessa a copa das árvores (Pindorama), documento colocado sobre a mesa (causas), meridiano que varre a cena (países), íris (aliança), passagem do tempo (cronologia), mergulho no mapa (campanhas), corte dramático com clarão contido (batalhas), desaceleração sóbria (consequências) e dissolução no mapa (conclusão). Cada uma tem duração própria e versão de volta.
- **Atlas persistente:** uma camada cartográfica discreta (rios, costas e meridianos) muda de enquadramento entre as cenas e aparece por inteiro na conclusão, com o Paraguai destacado.
- **Entradas internas:**
  - títulos palavra por palavra ou letra por letra;
  - imagens reveladas por máscara ou “reveladas” como fotografia;
  - linhas e rotas desenhadas;
  - datas em contagem;
  - documento que se desdobra e selo carimbado;
  - zoom lento (Ken Burns) e parallax pelo mouse.
- **`prefers-reduced-motion`:** quem desativa animações recebe trocas rápidas por esmaecimento, sem zoom nem deslocamentos.

## Precisão histórica e fontes

O conteúdo vem do trabalho original (resumo, capítulos, conclusão e referências) e foi conferido durante a reconstrução:

- **Datas checadas:** 12 nov. 1864, *Marquês de Olinda*; 1º maio 1865, Tratado; 11 jun. 1865, Riachuelo; 18 set. 1865, Uruguaiana; 24 maio 1866, Tuiuti; 22 set. 1866, Curupaiti; 19 fev. 1868, passagem de Humaitá; dez. 1868, Dezembrada; jan. 1869, Assunção; 12 e 16 ago. 1869, Piribebuy e Acosta Ñu; 1º mar. 1870, Cerro Corá.
- **Números de mortos:** os números demográficos do Paraguai seguem apresentados como debate, sem cifra isolada. O roteiro cita as posições de Whigham & Potthast (1999) e Reber (1988).
- **Regiões destacadas:** sul de Mato Grosso, Corrientes e Rio Grande do Sul usam os limites atuais (Natural Earth, nível 1), avisados como referência. O sul de Mato Grosso corresponde aproximadamente ao atual Mato Grosso do Sul.
- **Povos indígenas (slide 3):** as áreas são aproximadas (séculos XVI–XIX), sem limites fixos, e as famílias linguísticas seguem a classificação usual (tupi-guarani, guaicuru, aruak, jê, charrua). A participação de Guaicuru (Kadiwéu) e Terena na guerra e o uso do guarani nos jornais de trincheira vêm de artigos conferidos na Crossref (Silva 2018; Esselin & Vargas 2015; Dornelles 2021; Pic-Gillard 2008).
- **Rotas no mapa:** são esquemáticas, traçadas pela sequência de locais e datas, e as localizações são aproximadas. As fronteiras são atuais (Natural Earth), usadas só como referência.
- **Referências corrigidas com dados da Crossref:**
  - Whigham & Potthast: *Latin American Research Review*, v. 34, n. 1, 1999 (publicado on-line em 2022);
  - Patrício (2024): *JANUS.NET*, v. 14, dossiê temático 1.

Todas as imagens estão salvas no próprio projeto (`assets/img`), em domínio público ou CC0, com autoria, data e ficha de origem no visualizador e no slide de referências. Pinturas posteriores são identificadas como representações artísticas.

## Estrutura

```
index.html              apresentação (15 slides)
presenter.html          modo apresentador (roteiro por integrante, prévias, cronômetro)
ROTEIRO.md              roteiro de falas completo (gerado de js/notes.js)
FALA_*.md               roteiro individual de cada integrante (gerado de js/notes.js)
css/base.css            fontes e paleta escura de alto contraste
css/deck.css            palco 16:9, camadas, controles, índice, ajuda, visualizador
css/motion.css          transições e animações (+ movimento reduzido)
css/slides.css          layout de cada slide
css/responsive.css      celular em pé (páginas verticais) e deitado (16:9 com coluna de controles)
css/scenes.css          cenas, regiões, áudio, transições personalizadas, prévia
css/presenter.css       modo apresentador (celular, paisagem e computador)
js/map-data.js          contornos e rios (gerado do Natural Earth)
js/fx.js                tipografia cinética, contadores, parallax, atlas
js/map.js               mapas, cenas em etapas, campanhas e localizador
js/timeline.js          linha do tempo
js/app.js               navegação, etapas, transições, sincronização com o apresentador
js/notes.js             roteiro de falas por integrante, fonte única (só carregado em presenter.html)
js/presenter.js         modo apresentador
js/audio.js             narração por slide e painel de áudio
js/score.js             trilha instrumental sintetizada (Web Audio)
assets/audio/narracao/  manifesto e instruções para as gravações
assets/img/             imagens históricas otimizadas
assets/fonts/           Source Serif 4 e IBM Plex (licença OFL)
scripts/validate-site.mjs  validação estática
scripts/build-map.mjs      gera js/map-data.js
scripts/build-roteiro.mjs  gera ROTEIRO.md e FALA_*.md
scripts/roteiro-lib.mjs    funções do roteiro (trechos de fala e estimativa de tempo)
scripts/stamp-version.mjs  versiona as referências de CSS/JS antes de publicar
```

Não há etapa de build. Para rodar localmente:

```
python -m http.server 8000
```

Depois, abra http://localhost:8000.

## Validação

`node scripts/validate-site.mjs` confere:

- slides e ordem;
- integrantes;
- IDs, âncoras, citações e referências;
- existência dos arquivos locais;
- textos alternativos;
- controles e transições;
- notas do roteiro para todos os slides, sem que elas apareçam na projeção;
- roteiro por integrante: nomes iguais aos da abertura, responsáveis e falas coerentes, slides pendentes sem nome, transições que citam quem fala depois, orientações conhecidas, tempo de cada slide coerente com o tamanho das falas e total perto de 20 minutos;
- `ROTEIRO.md` e `FALA_*.md` em dia com `js/notes.js`;
- coerência do manifesto de narração e ausência de reprodução automática;
- suporte a movimento reduzido;
- sintaxe do JavaScript.

O workflow `.github/workflows/deploy.yml` executa essa validação a cada push na `main`. A validação estática não substitui a conferência visual no navegador.

## Mapas

`js/map-data.js` é gerado a partir do [Natural Earth](https://www.naturalearthdata.com/) (domínio público):

```
node scripts/build-map.mjs <pasta-com-os-geojson>
```

Arquivos necessários na pasta:

- `ne_50m_admin_0_countries.geojson`
- `ne_10m_admin_0_countries.geojson`
- `ne_10m_rivers_lake_centerlines.geojson`
- `ne_10m_admin_1_states_provinces.geojson`

## Publicação

Antes de cada publicação, rode `node scripts/stamp-version.mjs`. Ele atualiza o `?v=` das referências de CSS e JS, para que o navegador e a CDN não misturem arquivos novos e antigos logo depois do deploy.

O Render publica o site estático automaticamente a partir da branch `main`. O endereço é https://guerra-do-paraguai-museu-digital.onrender.com.

## Observação

Este é um trabalho escolar em formato digital. Para uma entrega formal, completem a identificação institucional, o local, o ano e o nome do professor ou da professora, conforme as normas da escola.
