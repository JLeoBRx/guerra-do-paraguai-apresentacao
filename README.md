# Guerra do Paraguai (1864–1870) — apresentação digital

Apresentação interativa, em formato de exposição de museu e documentário, sobre a Guerra do Paraguai. Trabalho de História da turma **Mecatrônica 2**.

**Integrantes:** Pedro Henrique · Clara Maria · Anthony Marcos · Gabriel Willian · Leandro Farias · Lohan David

Site publicado: https://guerra-do-paraguai-museu-digital.onrender.com

Ao abrir o endereço, a apresentação começa direto na abertura cinematográfica. Não há página de artigo nem botão para revelar os slides.

## Roteiro (13 slides)

| # | Slide | Destaques |
|---|-------|-----------|
| 1 | Abertura | Mapa de 1871 surgindo, rios desenhados, bússola, poeira e fumaça, título letra a letra com brilho, pintura de Victor Meirelles revelada |
| 2 | Contexto histórico | Mapa da Bacia do Prata com os rios desenhados em sequência e a rota fluvial de Assunção ao Atlântico |
| 3 | Causas | Fatores de longo prazo × gatilhos de 1864–1865, ligados por linhas animadas |
| 4 | Países envolvidos | Retratos de época de D. Pedro II, Mitre, Flores e Solano López; cartões que viram e mostram o papel de cada país |
| 5 | Aliança e início | Escalada de 1864–1865 e o Tratado da Tríplice Aliança como documento com selo |
| 6 | Cronologia | Linha do tempo desenhada com 14 acontecimentos clicáveis, fases e destaque para início e fim |
| 7 | Mapa das campanhas | Mapa interativo em 5 fases, com zoom, rotas desenhadas, marcadores clicáveis e o mapa histórico de 1871 |
| 8 | Campanhas e batalhas | Galeria com Riachuelo, Tuiuti, Curupaiti, Humaitá e Avaí (pinturas e fotografias identificadas) |
| 9 | Consequências humanas | Fotografia de famílias desabrigadas (1867), doenças, recrutamento, civis e o debate sobre os números |
| 10 | Consequências políticas e econômicas | Quadro por país, fotografia do Palácio dos López e charge de Angelo Agostini |
| 11 | Interpretações históricas | Correntes historiográficas e o critério adotado no trabalho |
| 12 | Conclusão | Pergunta do trabalho e resposta, com a faixa panorâmica de Cándido López |
| 13 | Referências | 14 referências, método e créditos de todas as imagens |

## Como navegar

- **→**, **Espaço** ou **PgDn**: avançar. No mapa e na galeria de batalhas, as setas passam primeiro pelas etapas.
- **←** ou **PgUp**: voltar.
- **Home** e **End**: primeiro e último slide.
- **F**: tela cheia.
- **I**: índice com miniaturas.
- **?**: atalhos.
- **Esc**: fechar janelas.
- **Celular e tablet**: deslize para os lados. Em telas estreitas ou em retrato, cada slide vira uma página com rolagem própria.
- Cada slide tem endereço próprio, por exemplo `#mapa` ou `#cronologia`.

## Linguagem de movimento

- **Transições entre slides:** dissolução cinematográfica, folha de documento colocada sobre a mesa, máscara em íris, mergulho (zoom) no mapa e deslizamento com profundidade. Uma faixa de luz atravessa o palco a cada troca.
- **Atlas persistente:** uma camada cartográfica (rios, costas e meridianos) muda de enquadramento entre as cenas e liga a abertura à conclusão.
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
- **Números de mortos:** os números demográficos do Paraguai seguem apresentados como debate, sem cifra isolada.
- **Rotas no mapa:** são esquemáticas, traçadas pela sequência de locais e datas, e as localizações são aproximadas. As fronteiras são atuais (Natural Earth), usadas só como referência.
- **Referências corrigidas com dados da Crossref:**
  - Whigham & Potthast: *Latin American Research Review*, v. 34, n. 1, 1999 (publicado on-line em 2022);
  - Patrício (2024): *JANUS.NET*, v. 14, dossiê temático 1.

Todas as imagens estão salvas no próprio projeto (`assets/img`), em domínio público ou CC0, com autoria, data e ficha de origem no visualizador e no slide de referências. Pinturas posteriores são identificadas como representações artísticas.

## Estrutura

```
index.html              apresentação (13 slides)
css/base.css            fontes, paleta e texturas
css/deck.css            palco 16:9, camadas, controles, índice, ajuda, visualizador
css/motion.css          transições e animações (+ movimento reduzido)
css/slides.css          layout de cada slide
css/responsive.css      celular, tablet e paisagem baixa
js/map-data.js          contornos e rios (gerado do Natural Earth)
js/fx.js                tipografia cinética, contadores, poeira, parallax, atlas
js/map.js               mapas da Bacia do Prata e das campanhas
js/timeline.js          linha do tempo
js/app.js               navegação, etapas, controles e créditos das imagens
assets/img/             imagens históricas otimizadas
assets/fonts/           Cormorant Garamond e IBM Plex (licença OFL)
scripts/validate-site.mjs  validação estática
scripts/build-map.mjs      gera js/map-data.js
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
- controles;
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

## Publicação

O Render publica o site estático automaticamente a partir da branch `main`. O endereço é https://guerra-do-paraguai-museu-digital.onrender.com.

## Observação

Este é um trabalho escolar em formato digital. Para uma entrega formal, completem a identificação institucional, o local, o ano e o nome do professor ou da professora, conforme as normas da escola.
