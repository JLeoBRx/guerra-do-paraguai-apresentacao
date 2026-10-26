# A Guerra do Paraguai — Arquivo Histórico

Apresentação web interativa para seminário de História sobre a Guerra do Paraguai (1864–1870). O site foi pensado como uma sequência de slides para projetor, mas também se adapta a computadores e celulares.

## Identidade visual

- **Títulos:** Cormorant Garamond — composição editorial e histórica.
- **Interface e textos:** Manrope — legibilidade em tela.
- **Datas e metadados:** IBM Plex Mono — linguagem visual de arquivo/documentação.
- **Paleta:** azul-noite, papel marfim, vermelho-terra e dourado envelhecido.
- **Recursos:** 12 slides, navegação por teclado e botões, barra de progresso, tela cheia, notas do apresentador, campos editáveis para integrantes/turma/escola, impressão em PDF e layouts responsivos.

## Rodar localmente

1. Clone ou baixe o repositório.
2. Abra `index.html` no Chrome, Edge ou Firefox. Para uma prévia local simples também pode usar um servidor estático, por exemplo `python -m http.server 8000`, e abrir `http://localhost:8000`.
3. Clique em **Apresentar** para ativar o modo de tela cheia.

### Controles

- **Setas esquerda/direita**, **Page Up/Page Down**: navegar pelos slides.
- **Espaço**: próximo slide.
- **N**: abrir/fechar notas do apresentador.
- **F**: ativar/sair do modo de apresentação.
- **Home / End**: ir ao primeiro/último slide.
- No celular, toque nos controles ou deslize horizontalmente.

Os campos da capa podem ser editados no navegador e são guardados localmente no mesmo dispositivo. Não são enviados para um servidor.

## Arquivos

- `index.html`: conteúdo e estrutura semântica dos 12 slides.
- `styles.css`: identidade visual, animações, responsividade e impressão.
- `script.js`: navegação, notas, tela cheia, atalhos e campos editáveis.
- `assets/favicon.svg`: ícone do site.
- `.github/workflows/deploy.yml`: publicação automática via GitHub Pages.

## Publicar no GitHub Pages

O workflow executa automaticamente ao fazer push na branch `main`.

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**, se ainda não estiver selecionado.
3. Abra a aba **Actions** e acompanhe a execução de **Publicar site-apresentação**.
4. Após a conclusão bem-sucedida, acesse **Settings → Pages** para consultar o endereço publicado.

Se o workflow falhar, consulte o log da execução na aba **Actions**. O site não utiliza etapa de build ou dependências de Node; é um site estático.

## Fontes históricas para aprofundamento

- **Atlas Histórico do Brasil — FGV, grandes batalhas:** https://atlas.fgv.br/marcos/guerra-do-paraguai/mapas/guerra-do-paraguai-grandes-batalhas
- **Atlas Histórico do Brasil — FGV, países em conflito:** https://atlas.fgv.br/marcos/guerra-do-paraguai/mapas/triplice-alianca-x-paraguai-os-paises-em-conflito
- **Museu Histórico Nacional — coleção Guerra do Paraguai:** https://atom-museuhistorico.museus.gov.br/index.php/guerra-do-paraguai
- **PPGHIS/UFRJ — Guerra do Paraguai: identidades, lealdades e conflitos:** https://ppghis.historia.ufrj.br/disciplina/guerra-do-paraguai-identidades-lealdades-e-conflitos/
- **Biblioteca Nacional Digital — planta histórica de Tuiuti:** https://objdigital.bn.br/objdigital2/acervo_digital/div_cartografia/cart168928/cart168928.jpg

As consequências demográficas, as causas e as responsabilidades do conflito são temas de debate historiográfico. Consulte as fontes originais e estudos acadêmicos antes de utilizar números específicos ou afirmações controversas.

## Imagens

Algumas imagens históricas são carregadas de Wikimedia Commons e de acervos digitais institucionais. Os créditos aparecem junto das imagens e as fontes são vinculadas no site. Antes de reutilizar qualquer arquivo em outro contexto, confira a autoria, a identificação histórica e as condições de uso no acervo original.

As fontes tipográficas e as imagens externas requerem conexão com a internet; há alternativas de tipografia de sistema e tratamentos de fallback para imagens indisponíveis.
