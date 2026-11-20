# O Segundo Reinado (1840–1889)

Apresentação de História sobre o período inteiro do reinado de D. Pedro II: da maioridade, em 1840, à Proclamação da República, em 1889. São 18 slides no mesmo formato do site da Guerra do Paraguai (raiz do repositório) e do site **A Crise do Segundo Reinado** (`../segundo-reinado/`), que aprofunda os últimos anos do Império.

**História · Professora Rita** · Davi Matheus, Juan Bento, Lucas Godoy e Kaique

Depois de publicado: https://guerra-do-paraguai-museu-digital.onrender.com/o-segundo-reinado/

## Como abrir no computador

O site usa caminhos relativos e precisa de um servidor; não abre com dois cliques no arquivo. Na **raiz do repositório**:

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000/o-segundo-reinado/.

## Como apresentar

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

No celular, deslize para os lados; cada slide vira uma página que rola. Clique em qualquer imagem para ampliá-la com legenda, autor, acervo e licença. Os números entre colchetes, como **[9]**, abrem a referência correspondente.

**Modo apresentador** (`P`): mostra o slide atual e o próximo, o cronômetro e o roteiro no formato “viagem no tempo”. Para cada slide há o ano em que a cena se passa, os lembretes de cada tópico, a fala, o texto de cada clique, a ligação com os dias de hoje, um complemento e a frase de transição. O mesmo roteiro está em `ROTEIRO.md`, dividido entre os quatro integrantes (tempo total estimado: 22:35).

**Áudio:** nada toca sozinho. O painel tem uma trilha opcional sintetizada no navegador e aceita narrações gravadas pelo grupo (veja `assets/audio/narracao/LEIA-ME.md`).

## Os 18 slides

| # | Slide | O que tem |
|---|---|---|
| 01 | Abertura | Coroação de D. Pedro II (Porto-Alegre, c. 1840–1841) |
| 02 | Um Império à beira da divisão | Regências e revoltas, com mapa: Cabanagem, Farroupilha, Sabinada, Balaiada |
| 03 | Um imperador de 14 anos | Golpe da Maioridade e coroação; retrato de Barandier (1840) |
| 04 | Quem foi D. Pedro II | Formação, família, ciência, viagens e a imagem do monarca |
| 05 | Quatro poderes | Diagrama do Poder Moderador, Executivo, Legislativo, Judiciário e Conselho de Estado |
| 06 | Luzias contra saquaremas | Liberais × conservadores e a Conciliação |
| 07 | Quem podia votar? | Voto censitário, eleições do cacete, Lei Saraiva; barras com a parcela da população que votava |
| 08 | A pacificação das províncias | Revoltas de 1842, fim da Farroupilha, Praieira e Caxias, com mapa |
| 09 | O café, motor do Império | Mapa do Vale do Paraíba ao Oeste Paulista, ferrovias e portos |
| 10 | O fim do tráfico africano | Lei de 1831, Bill Aberdeen, Lei Eusébio de Queirós, tráfico interno |
| 11 | Terra e trabalho | Lei de Terras, parceria, revolta de Ibicaba e imigração |
| 12 | A era Mauá | Tarifa Alves Branco, Mauá, telégrafo e ferrovias |
| 13 | Uma cultura para a nação | Indianismo, Victor Meirelles, Carlos Gomes, Machado de Assis |
| 14 | O Império no Rio da Prata | Oribe e Rosas, Questão Christie, Uruguai, com mapa da bacia do Prata |
| 15 | A Guerra do Paraguai | Resumo da guerra, com link para a apresentação completa |
| 16 | O longo caminho da abolição | Linha do tempo das leis (1850–1888) e abolicionistas |
| 17 | O Império perde seus apoios | Republicanos, Igreja, Exército e fazendeiros; link para *A Crise do Segundo Reinado* |
| 18 | Conclusão | Os três tempos do reinado, o que ficou e a síntese do grupo |

## Revisão histórica

- Datas, leis e números foram conferidos com as referências do painel (tecla `R`). Números aparecem como estimativas quando é o caso: Censo de 1872, participação do café nas exportações, extensão das ferrovias, votantes de 1872 e eleitores de 1886, mobilizados e mortos na Guerra do Paraguai.
- Não há citações inventadas. O ditado sobre luzias e saquaremas aparece como frase **atribuída** a Holanda Cavalcanti, sem aspas, porque a redação varia nas fontes.
- Interpretações estão marcadas como tais: a imagem construída de D. Pedro II e o uso político da cultura (Lilia Schwarcz), o “tempo saquarema” (Ilmar de Mattos) e a síntese final do grupo.
- Pinturas feitas depois dos fatos (Litran, 1893; Calixto, 1893; *Primeira Missa*, 1860) aparecem como representações artísticas.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Os 18 slides, o painel de referências e os créditos |
| `presenter.html` | Janela do modo apresentador |
| `css/panorama.css` | Composições próprias desta apresentação; os demais estilos são o motor comum |
| `js/mapa.js` | Mapas das regências, da pacificação, do café e do Rio da Prata (base Natural Earth) |
| `js/notes.js` | Roteiro do apresentador (fonte do `ROTEIRO.md`) |
| `js/images.js` | Legenda, ficha no Wikimedia Commons, crédito e licença de cada imagem (gerado) |
| `assets/img/` | 35 imagens históricas em domínio público, redimensionadas para a web |
| `scripts/imagens.py` | Prepara as imagens e gera `js/images.js` |
| `scripts/roteiro.mjs` | Gera o `ROTEIRO.md` a partir de `js/notes.js` |
| `scripts/validate.mjs` | Validação automática (também roda no GitHub Actions) |

Para conferir depois de editar:

```bash
node o-segundo-reinado/scripts/validate.mjs
```

Antes de publicar uma versão nova, rode `node scripts/stamp-version.mjs` na raiz para atualizar o `?v=` dos arquivos.
