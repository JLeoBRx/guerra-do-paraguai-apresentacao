# A Guerra do Paraguai — Arquivo Histórico

Site-apresentação interativo para o seminário de História da turma **Mecatrônica 2**, com os integrantes **Pedro Henrique, Clara Maria, Anthony Claudio, Gabriel Willian, Leandro Farias e Lohan David**.

O projeto apresenta a Guerra do Paraguai (1864–1870) como uma sequência de slides para projetor, com navegação por teclado, notas de apresentação e versões adaptadas para computador e celular.

## Identidade visual

- **Títulos:** Cormorant Garamond — linguagem editorial/histórica.
- **Textos e interface:** Manrope — legibilidade e consistência.
- **Datas e metadados:** IBM Plex Mono — referências de arquivo.
- **Paleta:** azul-noite, papel marfim, vermelho-terra e dourado envelhecido.
- **Composição:** slides com layouts diferentes, mapa geopolítico, cronologia, documento diplomático estilizado, comparação de batalhas e painel de bibliografia.
- **Pesquisa:** referências institucionais e acadêmicas junto dos assuntos, além da bibliografia final.

## Conteúdo

1. Capa com turma e integrantes editáveis.
2. Contexto geopolítico da região do Prata e rotas fluviais.
3. Paraguai antes da guerra.
4. Causas estruturais, crise regional e escalada militar.
5. Cronologia de 1864 a 1870.
6. Tratado da Tríplice Aliança e leitura de documentos diplomáticos.
7. Riachuelo, Tuiuti e Curupaiti.
8. Dezembrada, campanha final e Cerro Corá.
9. Condições de vida, logística, fome, doenças e impactos sobre civis.
10. Consequências para os quatro países e debate demográfico.
11. Memória histórica, historiografia e fontes primárias.
12. Síntese final e bibliografia.

O conteúdo evita tratar as causas como explicação única, distingue documentos de interpretações e ressalta que as estimativas de perdas demográficas paraguaias são debatidas na literatura acadêmica.

## Executar localmente

1. Abra o repositório e baixe os arquivos, ou clone com:
   ```bash
   git clone https://github.com/JLeoBRx/guerra-do-paraguai-apresentacao.git
   cd guerra-do-paraguai-apresentacao
   ```
2. Abra `index.html` no navegador. Para usar um servidor estático local, execute `python -m http.server 8000` e acesse `http://localhost:8000`.

Não é necessário instalar dependências de Node, React ou outras ferramentas de build.

## Controles

- **Setas esquerda/direita**, **Page Up/Page Down**: slide anterior/próximo.
- **Espaço**: próximo slide.
- **N**: abrir/fechar notas do apresentador.
- **F**: entrar/sair do modo de apresentação.
- **Home / End**: primeiro/último slide.
- **Toque ou deslize** no celular para navegar.
- **Imprimir / salvar em PDF**: botão no slide final.

Os nomes e a turma na capa são editáveis no navegador. As alterações são guardadas localmente no dispositivo, não enviadas para um servidor. O botão “Limpar dados da capa” restaura os nomes e a turma padrão.

Fontes tipográficas e imagens externas requerem internet. Se uma imagem falhar, o layout mantém um espaço de fallback.

## Estrutura de arquivos

- `index.html` — conteúdo e estrutura dos slides.
- `styles.css` — identidade visual, responsividade, animações e impressão.
- `script.js` — navegação, notas, tela cheia, atalhos e campos editáveis.
- `assets/favicon.svg` — ícone do site.
- `.github/workflows/deploy.yml` — tentativa de publicação automática via GitHub Pages.

## Fontes e pesquisa histórica

### Acervos, fontes primárias e história militar

- **Atlas Histórico do Brasil — Fundação Getulio Vargas**, mapas e grandes batalhas: https://atlas.fgv.br/marcos/guerra-do-paraguai/mapas/guerra-do-paraguai-grandes-batalhas
- **Marinha do Brasil — Batalha Naval do Riachuelo**, sobre o confronto de 11 de junho de 1865 e seus efeitos na navegação e logística: https://www.agencia.marinha.mil.br/educacao-e-cultura/batalha-naval-do-riachuelo-data-magna-da-marinha
- **Biblioteca Nacional Digital — Planta do acampamento e da Batalha de Tuyuty (24 de maio de 1866)**, atribuída a André Rebouças e Bernardino de Sena Madureiro: https://bdlb.bn.gov.br/acervo/handle/20.500.12156.3/44811?locale-attribute=en
- **Senado Federal — Atas do Conselho de Estado Pleno, 1867–1868**, fonte primária para acompanhar discussões políticas e diplomáticas sobre o tratado e seus desdobramentos: https://www.senado.leg.br/publicacoes/anais/pdf/ACE/ATAS7-Terceiro_Conselho_de_Estado_1867-1868.pdf
- **Museu Histórico Nacional — acervo sobre a Guerra do Paraguai**: https://atom-museuhistorico.museus.gov.br/index.php/guerra-do-paraguai

### Historiografia, demografia e história social

- **PPGHIS/UFRJ — Guerra do Paraguai: identidades, lealdades e conflitos**, contextualização da formação dos Estados nacionais na região do Prata: https://ppghis.historia.ufrj.br/disciplina/guerra-do-paraguai-identidades-lealdades-e-conflitos/
- **Pereira, Bruno César — “As ‘Guerras do Paraguai’: uma breve revisão das análises da Grande Guerra...”**, Ars Historica/UFRJ, revisão de correntes historiográficas: https://revistas.ufrj.br/index.php/ars/article/view/46625
- **Whigham, Thomas L.; Potthast, Barbara — “The Paraguayan Rosetta Stone: New Insights into the Demographics of the Paraguayan War, 1864–1870”**, Latin American Research Review, publicado online em 2022. Reavalia materiais censitários, incluindo um censo de 1870: https://www.cambridge.org/core/journals/latin-american-research-review/article/paraguayan-rosetta-stone-new-insights-into-the-demographics-of-the-paraguayan-war-18641870/96CAE01376E54D5376172E9398F4951B
- **Dourado, Maria Teresa Garritano — “A história esquecida da Guerra do Paraguai: fome, doenças e penalidades”**, pesquisa universitária baseada em documentos sobre condições de vida, doença e disciplina militar: https://teses.usp.br/teses/disponiveis/8/8138/tde-08122010-135132/pt-br.php
- **Dourado, Maria Teresa Garritano — “Cotidiano e sobrevivência: soldados e marinheiros na Guerra do Paraguai”**, Historiæ/FURG: https://periodicos.furg.br/hist/article/view/4809

## GitHub Pages

O workflow `.github/workflows/deploy.yml` tenta publicar automaticamente a cada push na branch `main`. É necessário habilitar o Pages nas configurações do repositório:

1. Acesse **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Abra **Actions** para acompanhar a execução do workflow.

Se o GitHub Pages não estiver habilitado, a ação poderá falhar até que essa configuração seja feita. O endereço só deve ser considerado publicado após uma execução bem-sucedida.

## Créditos e cuidado com fontes

As imagens são representações históricas e devem ser consultadas junto dos metadados dos acervos. Uma gravura de época pode conter legendas ou datas divergentes de referências institucionais; o site procura explicitar essa diferença quando relevante. Confirme sempre autoria, título, data, contexto e condições de uso antes de reutilizar imagens.
