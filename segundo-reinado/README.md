# A Crise do Segundo Reinado (1840–1889)

Apresentação de História sobre os conflitos e as rupturas que levaram ao fim da monarquia brasileira. São 18 slides em dois formatos: um **site de apresentação** no mesmo formato do site da Guerra do Paraguai (pasta raiz do repositório) e um **PowerPoint editável com PDF**. Os dois seguem a mesma narrativa e as mesmas fontes.

**História · Professora Rita** · Davi Matheus, Juan Bento, Lucas Godoy, Kaique e Pedro Lucas

## O site

Depois de publicado: https://guerra-do-paraguai-museu-digital.onrender.com/segundo-reinado/

Para abrir no computador, sirva a **raiz do repositório** (o site usa caminhos relativos e precisa de um servidor, não abre direto com dois cliques):

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000/segundo-reinado/.

### Como apresentar

| Tecla | Ação |
|---|---|
| `→`, `Espaço`, `PgDn` | Avançar, um tópico por vez |
| `←`, `PgUp` | Voltar |
| `Home` / `End` | Primeiro e último slide |
| `F` | Tela cheia |
| `I` | Índice com miniaturas |
| `R` | Referências e créditos das imagens |
| `P` | Modo apresentador (abre em outra janela) |
| `A` / `N` / `M` | Painel de áudio · narração · silenciar |
| `Esc` | Fechar janelas |

No celular, deslize para os lados. Clique em qualquer imagem para ampliá-la com legenda, autor, acervo e licença. Os números entre colchetes, como **[6]**, abrem a referência correspondente.

**Modo apresentador** (`P` ou o primeiro botão da barra): mostra o slide atual e o próximo, o cronômetro, o tempo previsto de cada slide e o roteiro em formato “viagem no tempo”. Para cada slide há o ano em que a cena se passa, os lembretes de cada tópico, a fala, o texto de cada clique, o que aquilo tem a ver com hoje, um complemento e a frase de transição. As duas janelas ficam sincronizadas: avançar em qualquer uma avança a outra. O mesmo roteiro está em `ROTEIRO.md`, dividido entre os cinco integrantes, com tempo total estimado de 22:40.

**O que tem em cada slide:** tópicos revelados por clique, uma transição escolhida para o momento da narrativa (11 tipos, como mergulho no mapa, passagem do tempo, virada de página e o fechamento), mapa do Império no contexto e na conclusão, mapa do café no slide 04 (Vale do Paraíba → Oeste Paulista, ferrovias e portos, uma camada por clique), linhas do tempo, retratos, documentos e pinturas de época. Com “reduzir movimento” ativado no sistema, as animações são desligadas. Em telas estreitas, cada slide vira uma página rolável.

**Áudio:** nada toca sozinho. O painel tem trilha ambiente sintetizada no navegador e aceita narrações gravadas pelo grupo (veja `assets/audio/narracao/LEIA-ME.md`).

### Estrutura do site

| Caminho | O que é |
|---|---|
| `index.html` | Os 18 slides, o painel de referências e os créditos |
| `presenter.html` | Janela do modo apresentador |
| `css/` | Base, motor de slides, animações, composição de cada slide (`reinado.css`), celular e cenas |
| `js/app.js` | Navegação, etapas, transições, lightbox, índice, referências |
| `js/notes.js` | Roteiro do apresentador (fonte do `ROTEIRO.md`) |
| `js/fx.js`, `js/map-data.js`, `js/mapa.js` | Mapa do Império e mapa do café (base cartográfica Natural Earth) |
| `js/images.js` | Legenda, ficha no Wikimedia Commons, crédito e licença de cada imagem (gerado) |
| `assets/img/` | 37 imagens históricas, redimensionadas para a web |
| `scripts/imagens.py` | Prepara as imagens e gera `js/images.js` |
| `scripts/roteiro.mjs` | Gera o `ROTEIRO.md` a partir de `js/notes.js` |
| `scripts/validate.mjs` | Validação automática (também roda no GitHub Actions) |

Para conferir o site depois de editar:

```bash
node segundo-reinado/scripts/validate.mjs
```

Ele confere os 18 slides e a ordem deles, as transições, o alinhamento entre cliques e roteiro, as citações e referências, os créditos das imagens, os arquivos locais, os textos alternativos, a ausência de autoplay e a sintaxe do JavaScript. Antes de publicar uma versão nova, rode `node scripts/stamp-version.mjs` na raiz para atualizar o `?v=` dos arquivos.

Ícones das três colunas do slide 15 (Igreja, Exército e café): [Game Icons](https://game-icons.net) (CC BY 3.0). Os créditos completos das imagens ficam no próprio site (tecla `R`).

## O PowerPoint e o PDF

### Arquivos

| Arquivo | O que é |
|---|---|
| `A-Crise-do-Segundo-Reinado.pptx` | Apresentação editável (PowerPoint), com roteiro nas notas de cada slide |
| `A-Crise-do-Segundo-Reinado.pdf` | Versão final em PDF (18 páginas) |
| `ROTEIRO.md` | Roteiro completo do site, para imprimir ou dividir as falas (as notas do PPTX são uma versão resumida) |
| `fonte/` | Scripts que geram a apresentação (imagens, texturas e slides) |

## Estrutura (18 slides)

| # | Slide | Composição |
|---|---|---|
| 01 | Capa: A Crise do Segundo Reinado | Retrato de D. Pedro II (1876) em tela ampla, título em serifa |
| 02 | O Brasil Imperial | Retrato oval de D. Pedro II aos 14 anos, números do Censo de 1872 |
| 03 | Estabilidade e contradições | Comparação “a fachada” (política) × “os bastidores” (sociedade) |
| 04 | As transformações do Brasil | Mosaico de fotografias de Marc Ferrez e seis mudanças |
| 05 | A Guerra do Paraguai | Pintura de Pedro Américo em tela cheia, foto de um Voluntário da Pátria |
| 06 | As três grandes questões | Tríptico de transição: Igreja, Exército e abolição |
| 07 | A Questão Religiosa | Capa da Constituição de 1824 e diagrama Papa × bispos × imperador |
| 08 | O conflito com os bispos | Retratos, caricatura de Angelo Agostini (1876) e linha do tempo 1872–1875 |
| 09 | A Questão Militar | Retrato de Deodoro e linha do tempo 1883–1887 |
| 10 | O positivismo e os militares | Encadeamento Comte → Escola Militar → Benjamin Constant → bandeira |
| 11 | O processo abolicionista | Linha do tempo das quatro leis e faixa sobre resistência e abolicionistas |
| 12 | A Lei Áurea | Foto da multidão em 13 de maio de 1888; o que a lei fez × o que ficou de fora |
| 13 | A ruptura com os cafeicultores | Vale do Paraíba × Oeste Paulista e os “republicanos de última hora” |
| 14 | O crescimento do republicanismo | Jornal *A República* (1870), linha do tempo, ideias e apoiadores |
| 15 | O Império ficou isolado | Diagrama do templo com três colunas rompidas (Igreja, Exército, elites agrárias) |
| 16 | 15 de novembro de 1889 | Pintura de Benedito Calixto em tela cheia e o dia em quatro etapas |
| 17 | O fim da monarquia | Foto da família imperial (1889), exílio e a frase de Aristides Lobo |
| 18 | Conclusão | Síntese dos seis fatores, frase final e referências |

## Identidade visual

- **Cores:** verde imperial `#123024`, dourado envelhecido `#D4B26A` / `#7D5C22`, papel antigo `#F6F0E2` / `#E4D6B8`, marrom profundo `#3B2416`, vermelho escuro `#8E2A22` e tinta `#1E1610`. Ficam gravadas no tema do PowerPoint (Design > Variantes > Cores).
- **Fontes:** Georgia nos títulos, datas e citações; Calibri no texto; rótulos e legendas em caixa alta espaçada. As duas fontes vêm com o Windows, o macOS e o Office. O PDF foi gerado com Gelasio e Carlito, que têm as mesmas medidas de Georgia e Calibri.
- **Recursos visuais que se repetem:** molduras ovais douradas nos retratos, fio dourado dentro das fotografias, documentos em passe-partout com sombra, selos verdes com ícones e rótulo superior “Parte I–VI”, que divide a narrativa em atos.
- **Imagens:** só fotografias, pinturas, gravuras e documentos do século XIX (e pinturas posteriores identificadas como representação artística). Fotografias em preto e branco receberam tom sépia; pinturas mantêm as cores originais.

## Revisão histórica

Cada slide foi conferido quanto a datas, nomes e relações de causa e consequência. Interpretações aparecem como interpretações (por exemplo, o debate sobre o peso dos “republicanos de última hora”, as intenções de Deodoro na manhã de 15 de novembro e a leitura de José Murilo de Carvalho sobre os “bestializados”).

Ajustes em relação ao PDF original:

- **Syllabus:** o original falava em “bula ultramontana Syllabus”. O *Syllabus* (1864) é uma lista anexa à encíclica *Quanta Cura*, e não uma bula. Os bispos agiram com base nas condenações papais à maçonaria, que nunca tinham recebido o beneplácito imperial. O texto foi corrigido.
- **Questão Militar:** o original atribuía uma “fonte” vaga (“estudos historiográficos… UFRJ”). Ela foi substituída por episódios datados (Sena Madureira, Cunha Matos, Clube Militar) e referências verificáveis.
- **Imagens:** as gravuras do original eram ilustrações geradas sem procedência. Todas foram substituídas por imagens históricas com autor, data e acervo.
- **Números:** foram mantidos apenas dados com fonte, sempre como estimativa quando é o caso: Censo de 1872, participação do café nas exportações, extensão das ferrovias, eleitorado de 1886 e mobilizados e mortos na Guerra do Paraguai.
- **Citações:** foram usadas só três, todas conferidas: o art. 1º da Lei Áurea, “Somos da América e queremos ser americanos” (Manifesto Republicano, 1870) e Aristides Lobo (*Diário Popular*, 18 nov. 1889). A frase atribuída ao barão de Cotegipe aparece só nas notas, avisando que não há registro documental seguro dela.

## Referências

- ALONSO, Angela. *Flores, votos e balas*: o movimento abolicionista brasileiro (1868-88). São Paulo: Companhia das Letras, 2015.
- BRASIL. *Constituição Política do Império do Brasil*, de 25 de março de 1824.
- BRASIL. Lei nº 3.353, de 13 de maio de 1888 (Lei Áurea).
- CARVALHO, José Murilo de. *Os bestializados*: o Rio de Janeiro e a República que não foi. São Paulo: Companhia das Letras, 1987.
- CARVALHO, José Murilo de. *A formação das almas*: o imaginário da República no Brasil. São Paulo: Companhia das Letras, 1990.
- CARVALHO, José Murilo de. *Cidadania no Brasil*: o longo caminho. Rio de Janeiro: Civilização Brasileira, 2001.
- CARVALHO, José Murilo de. *D. Pedro II*: ser ou não ser. São Paulo: Companhia das Letras, 2007.
- CASTRO, Celso. *Os militares e a República*: um estudo sobre cultura e ação política. Rio de Janeiro: Jorge Zahar, 1995.
- COSTA, Emília Viotti da. *Da Monarquia à República*: momentos decisivos. 7. ed. São Paulo: Editora Unesp, 1999.
- DORATIOTO, Francisco. *Maldita guerra*: nova história da Guerra do Paraguai. São Paulo: Companhia das Letras, 2002.
- FAUSTO, Boris. *História do Brasil*. São Paulo: Edusp, 1994.
- IBGE. *Recenseamento Geral do Império de 1872*.
- SCHWARCZ, Lilia M. *As barbas do imperador*: D. Pedro II, um monarca nos trópicos. São Paulo: Companhia das Letras, 1998.
- SCHWARCZ, Lilia M.; STARLING, Heloisa M. *Brasil*: uma biografia. São Paulo: Companhia das Letras, 2015.

## Créditos das imagens

Todas vêm do Wikimedia Commons, em domínio público, salvo indicação.

| Slide | Imagem |
|---|---|
| 01, 07 | D. Pedro II, 1876 — estúdio de Mathew Brady / Levin Handy, Library of Congress |
| 02 | Claude Joseph Barandier, retrato de D. Pedro II, 1840 (óleo sobre tela) |
| 03 | Pedro Américo, *D. Pedro II na abertura da Assembleia Geral* (Fala do Trono), 1872, Museu Imperial · Marc Ferrez, colheita de café no Vale do Paraíba, 1883 |
| 04 | Marc Ferrez: Estrada de Ferro Santos–São Paulo, 1870 (Biblioteca Mário de Andrade); café no porto de Santos, c. 1880; Rua do Ouvidor, s. d. (Instituto Moreira Salles) |
| 05 | Pedro Américo, *Batalha do Avaí*, 1872–1877, Museu Nacional de Belas Artes · furriel Luiz Antonio de Vargas, Voluntários da Pátria, 1865 |
| 06 | Retrato de D. Macedo Costa, déc. 1870 (Catedral de Belém) · Ten.-cel. Sena Madureira, déc. 1880 · Marc Ferrez, escravizados em fazenda de café, c. 1885 |
| 07 | Capa da Constituição de 1824 (Arquivo Nacional) · Pio IX, por Adolphe Braun, 1875 |
| 08 | Frei Vital, por Militão Augusto de Azevedo, 1879 (Museu Paulista da USP) · D. Macedo Costa (Arquivo Nacional) · Visconde do Rio Branco, por Alberto Henschel, 1879 · Angelo Agostini, *Revista Illustrada*, 1º dez. 1876 |
| 09 | Marechal Deodoro da Fonseca, retrato oficial, 1889 |
| 10 | Auguste Comte, daguerreótipo, 1849 · Escola Militar da Praia Vermelha (Instituto Moreira Salles) · Benjamin Constant, 1889 (Arquivo Nacional) · bandeira republicana de 1889 |
| 11 | Luiz Gama (Arquivo Nacional) · José do Patrocínio, por Alberto Henschel · André Rebouças, 1871 · Joaquim Nabuco, por Alfredo Ducasble, c. 1886 · Dragão do Mar, por Angelo Agostini, 1884 |
| 12 | Marc Ferrez, multidão no Rio de Janeiro em 13 de maio de 1888 (Gilberto Ferrez Collection, Getty Research Institute) |
| 13 | Marc Ferrez, escravizados em terreiro de café no Vale do Paraíba, c. 1882 |
| 14 | *A República*, n. 1, Rio de Janeiro, 3 dez. 1870 |
| 15 | Aurélio de Figueiredo, *A ilusão do Terceiro Reinado* (O último baile da Ilha Fiscal), 1905, Museu Histórico Nacional — foto da obra de Jonas de Carvalho (CC BY-SA 2.0) |
| 16 | Benedito Calixto, *Proclamação da República*, 1893, Pinacoteca do Estado de São Paulo |
| 17 | Otto Hees, D. Pedro II e a família imperial, 1889 · Aristides Lobo, gravura de *A Pátria Brazileira* |

Ícones: [Game Icons](https://game-icons.net) (CC BY 3.0), via `react-icons`.

## Como gerar o PowerPoint de novo

Requer Python 3 com Pillow e NumPy, Node.js e acesso a `upload.wikimedia.org`.

```bash
cd segundo-reinado/fonte
npm install
python3 baixar_imagens.py imagens.tsv ../originais
python3 prep_images.py images.json ../originais ../preparadas
python3 make_textures.py ../texturas
npm run build
```

Para o PDF, abra o `.pptx` no PowerPoint e use **Arquivo > Exportar > PDF**, ou converta com o LibreOffice.
