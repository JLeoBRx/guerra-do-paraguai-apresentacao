# Guerra do Paraguai — Dossiê de pesquisa histórica

Site acadêmico de leitura contínua sobre a Guerra do Paraguai (1864–1870), desenvolvido como trabalho de pesquisa escolar para a turma **Mecatrônica 2**.

## Identificação do grupo

- Pedro Henrique
- Clara Maria
- Anthony Claudio
- Gabriel Willian
- Leandro Farias
- Lohan David

## Nova proposta

O projeto deixou de ser uma apresentação de slides e foi reconstruído como um dossiê editorial de leitura contínua, inspirado na organização de um trabalho acadêmico. A pesquisa inclui resumo, palavras-chave, problema, objetivos, metodologia, capítulos temáticos, considerações finais e referências.

### Conteúdo

1. Resumo e delimitação do tema.
2. Introdução e problema de pesquisa.
3. Objetivos e metodologia.
4. Contexto geopolítico da Bacia do Prata.
5. Causas estruturais e escalada de 1864–1865.
6. Cronologia e campanhas militares.
7. Fontes visuais com legenda e referência de acervo.
8. Mobilização, desigualdade, condições de vida e custo humano.
9. Consequências políticas, econômicas e demográficas.
10. Debate historiográfico.
11. Considerações finais e bibliografia.

## Recursos do site

- **Modo de leitura:** navegação lateral por capítulos, resumo acadêmico completo, figuras, referências e links para os acervos.
- **Modo apresentação:** ao ativar a tela cheia do navegador com `F11`, o site detecta a tela cheia e muda para uma apresentação resumida de 10 slides. Ao sair da tela cheia do navegador, retorna ao site de leitura.
- Botão **Apresentar** como alternativa: abre a apresentação em tela cheia quando o navegador permite; o botão **Voltar ao site** retorna ao artigo.
- Navegação dos slides por setas esquerda/direita, Page Up/Page Down, Espaço e botões na tela.
- Escape fecha a apresentação e retorna ao site.
- Navegação lateral por capítulos com indicação da seção atual.
- Barra de progresso de leitura.
- Sumário adaptado para a navegação no celular.
- Visualizador de imagem ampliada.
- Botão de impressão e opção do navegador de salvar como PDF.
- Layout responsivo para computador, tablet e celular, nos dois modos.
- Estilos de impressão preparados para uma versão legível em papel A4.

## Imagens e mapas

O site utiliza fontes históricas identificadas por legenda, com ligações aos registros originais:

- **Mapa de campanha de 1871:** mapa da República do Paraguai com as marchas dos exércitos aliados entre 1866 e 1870, integrante de atlas histórico-militar associado a Emilio Carlos Jourdan e Eduardo Rensburg. Referência e dados de licença: Wikimedia Commons / David Rumsey Map Collection.
- **Estudo para a Batalha do Riachuelo:** Victor Meirelles, c. 1868–1873. A legenda destaca que pintura histórica é representação artística, não registro fotográfico direto.
- **Fortificações de Humaitá e Curupaiti:** gravura do acervo do Museu Histórico Nacional, associada à produção de Angelo Agostini.
- **Artilharia brasileira, 1866:** fotografia atribuída a Bate & Cia, reproduzida em Ricardo Salles (2003).
- **Exército brasileiro em revista, c. 1869:** fotografia de autoria desconhecida, identificada como revista do Conde d’Eu.

As imagens são carregadas de seus acervos de origem; por isso, dependem de conexão à internet. As legendas indicam registros em que autoria, data, licença e contexto podem ser conferidos. Antes de qualquer reutilização externa, confirmar as condições específicas do item original.

## Pesquisa e cuidado historiográfico

O texto combina bibliografia acadêmica, materiais de instituições públicas e acervos documentais. A pesquisa evita tratar a guerra como resultado de uma única causa, apresenta a crise do Prata como contexto central e sinaliza que as estimativas demográficas paraguaias são debatidas. As fontes não resolvem todas as divergências; os pontos em discussão são identificados como tais.

Referências principais: Atlas Histórico do Brasil/FGV; estudo de Raquel de Caria Patrício (2024); artigos de historiografia publicados pela UFRJ; documentação do Senado Federal; Marinha do Brasil; Museu Histórico Nacional; estudo demográfico de Whigham e Potthast; pesquisa de Maria Teresa Garritano Dourado; TCC de Andrew Cesar de Goes (UNILA).

## Como executar localmente

Não há dependências de build. Abra o arquivo principal no navegador ou use um servidor estático:

1. Clone ou baixe o repositório.
2. Abra o terminal na pasta do projeto.
3. Execute o comando abaixo:

    python -m http.server 8000

4. Acesse http://localhost:8000.

## Estrutura

- index.html — capa, conteúdo acadêmico, figuras, citações e referências.
- styles.css — sistema visual, responsividade e impressão.
- script.js — sumário, progresso, visualizador de imagens e controles.
- assets/favicon.svg — ícone do projeto.
- .github/workflows/deploy.yml — workflow de publicação no GitHub Pages.

## Exportação para PDF

Clique em **Exportar PDF** no cabeçalho e escolha “Salvar como PDF” na caixa de impressão do navegador. As configurações de impressão removem elementos de navegação e adaptam o artigo para papel A4. Recomenda-se revisar as quebras de página antes da entrega escolar.

## GitHub Pages

Para publicar no GitHub Pages, em **Settings → Pages**, defina a fonte de publicação como **GitHub Actions** e confirme que o workflow concluiu com sucesso. O endereço esperado para este repositório é https://jleobrx.github.io/guerra-do-paraguai-apresentacao/, mas só deve ser considerado ativo depois de uma implantação bem-sucedida.

## Nota sobre formalização acadêmica

Este é um dossiê escolar digital em formato de pesquisa. Como o nome oficial da instituição, município, professor/orientador e requisitos locais de formatação não foram informados, esses elementos não foram inventados. Antes de entregar como TCC formal, ajustar a capa e as referências às orientações da instituição e do professor.