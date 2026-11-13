# Guerra do Paraguai (1864–1870) — apresentação digital

Apresentação interativa, em formato de exposição de museu e documentário, sobre a Guerra do Paraguai. Trabalho de História da turma **Mecatrônica 2**.

**Integrantes:** Pedro Henrique · Clara Maria · Anthony Marcos · Gabriel Willian · Leandro Farias · Lohan David

Site publicado: https://guerra-do-paraguai-museu-digital.onrender.com

Ao abrir o endereço, a apresentação começa direto na abertura cinematográfica. Não há página de artigo nem botão para revelar os slides.

## Roteiro (14 slides)

| # | Slide | Cena e transição |
|---|-------|------------------|
| 1 | Abertura | Plano geral da América do Sul com o Paraguai destacado, aproximação até a Bacia do Prata, barras de cinema que se abrem, título letra a letra e pintura de Victor Meirelles · *revelação cinematográfica* |
| 2 | Contexto histórico | Mapa que aproxima do continente até a Bacia do Prata; rios desenhados e rota fluvial até o Atlântico · *aproximação sobre o mapa* |
| 3 | Causas | Fatores de longo prazo × gatilhos de 1864–1865, ligados por linhas · *documentos colocados sobre a mesa* |
| 4 | Países envolvidos | Retratos de época e cartões que viram · *meridiano que varre a cena* |
| 5 | Início do conflito | Cena em 5 etapas: protesto paraguaio, intervenção no Uruguai, *Marquês de Olinda*, Mato Grosso e Corrientes, com regiões e rotas no mapa · *dissolução* |
| 6 | Tríplice Aliança | Cena em 5 etapas: Paraguai isolado; Brasil, Argentina e Uruguai entram no mapa; tratado carimbado e triângulo entre as capitais · *íris* |
| 7 | Cronologia | Linha do tempo com 14 acontecimentos clicáveis e o ano de fundo avançando de 1864 a 1870 · *passagem do tempo* |
| 8 | Mapa das campanhas | 5 fases com zoom, regiões destacadas, rotas desenhadas, carimbo de datas, legenda progressiva e marcadores clicáveis · *mergulho no mapa* |
| 9 | Campanhas e batalhas | 5 batalhas com mini-mapa localizador, ano animado e sequência antes · combate · resultado · *corte dramático* |
| 10 | Consequências humanas | Ritmo mais lento, fotografia de 1867 e debate sobre os números · *desaceleração sóbria* |
| 11 | Consequências políticas e econômicas | Quadro por país, fotografia e charge de Agostini · *folha de documento* |
| 12 | Interpretações históricas | Correntes historiográficas e critério adotado · *dissolução* |
| 13 | Conclusão | Retorno ao mapa do início, com o Paraguai destacado, e a resposta ao problema de pesquisa · *encerramento* |
| 14 | Referências | 14 referências, método e créditos das imagens · *folha de documento* |

## Modo apresentador e roteiro de fala

- **Como abrir:** botão de tela no canto superior direito ou tecla **P**. Ele abre `presenter.html` em outra janela, que deve ser arrastada para a tela do notebook enquanto a projeção fica no projetor. A projeção nunca mostra as notas.
- **O que mostra:**
  - a fala do slide, a explicação complementar, o contexto e a transição para o próximo;
  - nas cenas, o texto da etapa atual;
  - a prévia do que está na projeção e do próximo slide ou etapa;
  - o tempo estimado, o cronômetro total e o do slide, e o ritmo em relação ao plano de 19 minutos;
  - botões e setas que controlam a projeção à distância.
- **Roteiro impresso:** `ROTEIRO.md` traz o mesmo texto, com sugestão de divisão entre os integrantes. Ele é gerado de `js/notes.js` com `node scripts/build-roteiro.mjs`.

## Áudio: narração e trilha

- **Comportamento:** nada toca sozinho. Ícone de som (ou tecla **A**) abre o painel com:
  - narração: iniciar e pausar, repetir, próximo slide e avançar sozinho ao terminar;
  - sincronização das etapas das cenas com a narração;
  - volume geral e volume da trilha;
  - silenciar tudo (tecla **M**).
- **Narração:** **ainda não foi gravada.** O player está pronto, mas nenhuma voz foi simulada. Para gravar e cadastrar as falas, siga `assets/audio/narracao/LEIA-ME.md`.
- **Trilha instrumental:** opcional e discreta, sintetizada no navegador com a Web Audio API. Não é uma gravação. Fica mais baixa automaticamente quando há narração.

## Linguagem de movimento

- **Transições entre slides:** cada slide tem a sua, ligada à narrativa — revelação a partir do escuro (abertura), aproximação sobre o mapa (contexto), documento colocado sobre a mesa (causas), meridiano que varre a cena (países), íris (aliança), passagem do tempo (cronologia), mergulho no mapa (campanhas), corte dramático com clarão contido (batalhas), desaceleração sóbria (consequências) e dissolução no mapa (conclusão). Cada uma tem duração própria e versão de volta.
- **Atlas persistente:** uma camada cartográfica (rios, costas e meridianos) muda de enquadramento entre as cenas. Ela abre com o plano geral do continente e o Paraguai destacado, e volta a esse plano na conclusão.
- **Entradas internas:**
  - títulos palavra por palavra ou letra por letra;
  - imagens reveladas por máscara ou “reveladas” como fotografia;
  - linhas e rotas desenhadas;
  - datas em contagem;
  - documento que se desdobra e selo carimbado;
  - zoom lento (Ken Burns) e parallax pelo mouse.
- **Efeitos contínuos:** poeira em canvas (pausada quando não usada), fumaça, grão de filme e bússola girando.
- **`prefers-reduced-motion`:** quem desativa animações recebe trocas rápidas por esmaecimento, sem partículas, zoom ou deslocamentos.

## Precisão histórica e fontes

O conteúdo vem do trabalho original (resumo, capítulos, conclusão e referências) e foi conferido durante a reconstrução:

- **Datas checadas:** 12 nov. 1864, *Marquês de Olinda*; 1º maio 1865, Tratado; 11 jun. 1865, Riachuelo; 18 set. 1865, Uruguaiana; 24 maio 1866, Tuiuti; 22 set. 1866, Curupaiti; 19 fev. 1868, passagem de Humaitá; dez. 1868, Dezembrada; jan. 1869, Assunção; 12 e 16 ago. 1869, Piribebuy e Acosta Ñu; 1º mar. 1870, Cerro Corá.
- **Números de mortos:** os números demográficos do Paraguai seguem apresentados como debate, sem cifra isolada. O roteiro cita as posições de Whigham & Potthast (1999) e Reber (1988).
- **Regiões destacadas:** sul de Mato Grosso, Corrientes e Rio Grande do Sul usam os limites atuais (Natural Earth, nível 1), avisados como referência. O sul de Mato Grosso corresponde aproximadamente ao atual Mato Grosso do Sul.
- **Rotas no mapa:** são esquemáticas, traçadas pela sequência de locais e datas, e as localizações são aproximadas. As fronteiras são atuais (Natural Earth), usadas só como referência.
- **Referências corrigidas com dados da Crossref:**
  - Whigham & Potthast: *Latin American Research Review*, v. 34, n. 1, 1999 (publicado on-line em 2022);
  - Patrício (2024): *JANUS.NET*, v. 14, dossiê temático 1.

Todas as imagens estão salvas no próprio projeto (`assets/img`), em domínio público ou CC0, com autoria, data e ficha de origem no visualizador e no slide de referências. Pinturas posteriores são identificadas como representações artísticas.

## Estrutura

```
index.html              apresentação (14 slides)
presenter.html          modo apresentador (notas, prévias, cronômetro)
ROTEIRO.md              roteiro de fala completo (gerado de js/notes.js)
css/base.css            fontes, paleta e texturas
css/deck.css            palco 16:9, camadas, controles, índice, ajuda, visualizador
css/motion.css          transições e animações (+ movimento reduzido)
css/slides.css          layout de cada slide
css/responsive.css      celular, tablet e paisagem baixa
css/scenes.css          cenas, regiões, áudio, transições personalizadas, prévia
css/presenter.css       janela do apresentador
js/map-data.js          contornos e rios (gerado do Natural Earth)
js/fx.js                tipografia cinética, contadores, poeira, parallax, atlas
js/map.js               mapas, cenas em etapas, campanhas e localizador
js/timeline.js          linha do tempo
js/app.js               navegação, etapas, transições, sincronização com o apresentador
js/notes.js             roteiro do apresentador (só carregado em presenter.html)
js/presenter.js         modo apresentador
js/audio.js             narração por slide e painel de áudio
js/score.js             trilha instrumental sintetizada (Web Audio)
assets/audio/narracao/  manifesto e instruções para as gravações
assets/img/             imagens históricas otimizadas
assets/fonts/           Cormorant Garamond e IBM Plex (licença OFL)
scripts/validate-site.mjs  validação estática
scripts/build-map.mjs      gera js/map-data.js
scripts/build-roteiro.mjs  gera ROTEIRO.md
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

O Render publica o site estático automaticamente a partir da branch `main`. O endereço é https://guerra-do-paraguai-museu-digital.onrender.com.

## Observação

Este é um trabalho escolar em formato digital. Para uma entrega formal, completem a identificação institucional, o local, o ano e o nome do professor ou da professora, conforme as normas da escola.
