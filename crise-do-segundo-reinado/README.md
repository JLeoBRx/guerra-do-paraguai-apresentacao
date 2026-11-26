# A Crise do Segundo Reinado (1840–1889) — Museu Digital em 12 slides

Site que é a própria apresentação: 1 capa, 10 slides de conteúdo e 1 slide de referências, no mesmo formato do site da Guerra do Paraguai (raiz do repositório), com identidade visual própria.

**História · Professora Rita** · Davi Matheus, Juan Bento, Lucas Godoy, Kaique e Pedro Lucas

Depois de publicado: https://guerra-do-paraguai-museu-digital.onrender.com/crise-do-segundo-reinado/

## A narrativa

A barra no alto da tela acompanha o arco da história, do primeiro ao último slide de conteúdo:

**Estabilidade → Tensões → Crises → Rupturas → Isolamento → República**

| # | Slide | Etapa | O que aparece |
|---|---|---|---|
| — | Capa | — | D. Pedro II em 1876, moldura imperial e o arco da narrativa |
| 01 | O Segundo Reinado: estabilidade e contradições | Estabilidade | “Por fora” (Poder Moderador, partidos, território) × “por dentro” (café, escravidão, voto), com o mapa do Império ao fundo |
| 02 | A Questão Religiosa | Tensões | Padroado, beneplácito, ultramontanismo; os bispos × Rio Branco; linha do tempo 1872–1875 e caricatura de Agostini |
| 03 | A Questão Militar | Tensões | Deodoro, insatisfações do Exército, linha do tempo 1883–1887 e o positivismo de Benjamin Constant |
| 04 | O processo abolicionista | Crises | As quatro leis (1850–1888) com seus limites, e os abolicionistas |
| 05 | A Lei Áurea e a ruptura com os cafeicultores | Rupturas | Foto de 13 de maio de 1888, o art. 1º da lei em papel antigo, Vale do Paraíba × Oeste Paulista |
| 06 | O crescimento do republicanismo | Rupturas | O jornal *A República* (1870), o Manifesto, a Convenção de Itu e quem apoiava |
| 07 | O isolamento político da monarquia | Isolamento | O templo com três colunas que se rompem (Igreja, Exército, elites agrárias) |
| 08 | A articulação militar e a crise final | Isolamento | Contagem regressiva: 7 jun., 9 nov., 10–11 nov. e 14 nov. de 1889, sobre o baile da Ilha Fiscal |
| 09 | A Proclamação da República | República | O dia 15 de novembro hora a hora, o exílio e a frase de Aristides Lobo |
| 10 | Conclusão: por que a monarquia caiu? | República | Os seis fatores e a frase final, com o mapa do Brasil ao fundo |
| — | Referências | — | As 17 fontes em papel antigo e o acesso aos créditos de cada imagem |

Frase final: *“A monarquia brasileira não caiu por uma única crise, mas pela perda progressiva do apoio dos grupos que sustentavam seu poder.”*

## Como apresentar

| Tecla | Ação |
|---|---|
| `→`, `Espaço`, `PgDn` | Avançar, um tópico por vez |
| `←`, `PgUp` | Voltar |
| `Home` / `End` | Capa e referências |
| `F` ou `F11` | Tela cheia |
| `I` | Índice com miniaturas |
| `R` | Ir para as referências |
| `P` | Modo apresentador (abre em outra janela) |
| `A` / `N` / `M` | Painel de áudio · narração · silenciar |
| `Esc` | Fechar janelas e balões |

- **Navegação:** há botões anterior e próximo, barra de progresso e indicador do slide. A página nunca recarrega.
- **Celular:** deslize para os lados.
- **Imagens:** clique em qualquer uma para ampliá-la com legenda, autor, acervo e licença.
- **Citações:** os números entre colchetes, como **[9]**, abrem um balão com a referência completa, sem sair do slide.

**Modo apresentador** (`P`): mostra o slide atual e o próximo, o cronômetro e o roteiro “viagem no tempo”, sincronizados com a projeção. O mesmo roteiro está em `ROTEIRO.md`, dividido entre os cinco integrantes (tempo total estimado: 17:00).

## Como abrir no computador

Na **raiz do repositório**:

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000/crise-do-segundo-reinado/.

## Revisão histórica

- O conteúdo segue o PDF original do grupo e a versão de 18 slides (`../segundo-reinado/`), com as mesmas fontes.
- O slide 08 é novo. Usa só fatos confirmados:
  - o gabinete Ouro Preto assumiu em 7 de junho de 1889;
  - a assembleia do Clube Militar de 9 de novembro foi presidida por Benjamin Constant;
  - os republicanos civis procuraram Deodoro em 10 ou 11 de novembro (as fontes divergem, por isso aparecem as duas datas);
  - o boato de 14 de novembro foi atribuído ao major Sólon Ribeiro.
- Não há citações inventadas. As três citações foram conferidas: o art. 1º da Lei Áurea, a frase do Manifesto Republicano e a de Aristides Lobo.
- O *Syllabus* (1864) aparece como documento papal contra ideias liberais, e não como “bula”. As condenações à maçonaria nunca receberam o beneplácito imperial.
- Pinturas posteriores aos fatos (Calixto, 1893; *O último baile da Ilha Fiscal*, 1905) aparecem como representações artísticas.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Os 12 slides, o painel de créditos e a ajuda |
| `presenter.html` | Janela do modo apresentador |
| `css/crise.css` | Identidade desta versão: arco narrativo, moldura imperial, papel antigo, slides 02, 05, 08, 09, 10 e referências, celular |
| `css/` (demais) | Motor comum de slides, animações e transições |
| `js/app.js` | Navegação, etapas, transições, arco narrativo, balões de citação, tela cheia (F/F11) |
| `js/notes.js` | Roteiro do apresentador (fonte do `ROTEIRO.md`) |
| `js/images.js` | Ficha de cada imagem (gerada por `scripts/imagens.mjs`) |
| `assets/img/` | 23 imagens históricas em domínio público e a textura de papel |
| `scripts/papel.py` | Gera a textura de papel antigo |
| `scripts/validate.mjs` | Validação automática (também roda no GitHub Actions) |

Para conferir depois de editar:

```bash
node crise-do-segundo-reinado/scripts/validate.mjs
```

Antes de publicar uma versão nova, rode `node scripts/stamp-version.mjs` na raiz para atualizar o `?v=` dos arquivos.
