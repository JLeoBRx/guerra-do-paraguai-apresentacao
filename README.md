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
- **Modo apresentação:** apresentação resumida de 10 slides, com direção de arte editorial/cinematográfica, imagens históricas em destaque, composição widescreen, cronologia, mapa e controles de navegação. A tela cheia do navegador via `F11` ativa esse modo por detecção da área visível; ao sair da tela cheia, o site retorna ao modo de leitura. Como F11 é um atalho reservado ao navegador, o evento é detectado pela mudança de viewport, sem bloquear o atalho nativo.
- Botão **Apresentar** como alternativa: solicita a tela cheia pelo navegador quando permitido; o botão **Voltar ao site** retorna ao artigo.
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

- **Pintura da capa — *Combate naval do Riachuelo*:** Edoardo De Martino, acervo do Museu Histórico Nacional, registro 6216. A reprodução é carregada da plataforma Brasiliana Museus: https://brasiliana3.museus.gov.br/brasiliana/combate-naval-do-riachuelo/. A ficha informa assinatura/datação “E. De Martino/Fecit, 1870” e registra na moldura a inscrição “II de Junho de 1865”; a Marinha do Brasil identifica a batalha como ocorrida em 11 de junho. A discrepância está explicitada no modo de apresentação para não transformar uma inscrição da obra em cronologia conclusiva.
- **Mapa de campanha de 1871:** mapa da República do Paraguai com as marchas dos exércitos aliados entre 1866 e 1870, integrante de atlas histórico-militar associado a Emilio Carlos Jourdan e Eduardo Rensburg. Referência e dados de licença: Wikimedia Commons / David Rumsey Map Collection; edição digitalizada colorizada disponível na Diretoria do Patrimônio Histórico e Documentação da Marinha: https://www.marinha.mil.br/dhn/sites/www.marinha.mil.br.dhn/files/2025-05/Atlas%20historico%20da%20Guerra%20do%20Paraguay%20-%201871%20-%20Colorizado.pdf.
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
- styles.css — identidade visual do site acadêmico, responsividade e impressão.
- presentation.css — identidade visual, layouts responsivos e controles visuais do modo de apresentação.
- script.js — sumário, progresso, visualizador de imagens e controles.
- scripts/validate-site.mjs — validação estática automatizada de seções, slides, links internos, referências, imagens, nomes do grupo e sintaxe JavaScript.
- assets/favicon.svg — ícone do projeto.
- .github/workflows/deploy.yml — workflow de publicação no GitHub Pages.

## Exportação para PDF

Clique em **Exportar PDF** no cabeçalho e escolha “Salvar como PDF” na caixa de impressão do navegador. As configurações de impressão removem elementos de navegação e adaptam o artigo para papel A4. Recomenda-se revisar as quebras de página antes da entrega escolar.

## Validação automática

A cada push, o workflow executa `node scripts/validate-site.mjs` antes de tentar publicar. O script confere as seções acadêmicas, integrantes, IDs duplicados, links internos, citações e referências, textos alternativos de imagens, dez slides na ordem prevista, controles de apresentação e sintaxe JavaScript. Essa validação é estática: não substitui um teste visual em navegador real.

## GitHub Pages

Para publicar no GitHub Pages, em **Settings → Pages**, defina a fonte de publicação como **GitHub Actions** e confirme que o workflow concluiu com sucesso. O endereço esperado para este repositório é https://jleobrx.github.io/guerra-do-paraguai-apresentacao/, mas só deve ser considerado ativo depois de uma implantação bem-sucedida.

## Nota sobre formalização acadêmica

Este é um dossiê escolar digital em formato de pesquisa. Como o nome oficial da instituição, município, professor/orientador e requisitos locais de formatação não foram informados, esses elementos não foram inventados. Antes de entregar como TCC formal, ajustar a capa e as referências às orientações da instituição e do professor.

## Direção visual nova — Museu Digital

A versão atual usa uma identidade editorial diferente para o site e a apresentação: ameixa profundo, violeta, rosa elétrico e verde-limão. A folha `experience.css` faz a camada de arte sobre o dossiê e os dez slides sem substituir o conteúdo histórico nem as referências.

O modo de leitura inclui animações de entrada ao rolar a página, e a apresentação possui transições direcionais, cartões animados e layouts específicos para contexto regional, causas, cronologia, campanhas, custo humano, consequências e historiografia. As animações respeitam a configuração `prefers-reduced-motion`; o layout segue responsivo em telas menores.

A validação executada em cada push verifica também a existência da nova folha visual e da lógica de animação. A hospedagem continua independente da validação do código: o workflow de GitHub Actions não deve relatar uma publicação como concluída quando o serviço GitHub Pages ainda não está habilitado.
