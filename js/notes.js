/* Roteiro de falas — carregado SOMENTE pelo modo apresentador (presenter.html). Não aparece na projeção.
   É a fonte única do roteiro: ROTEIRO.md e os arquivos FALA_*.md são gerados daqui com
   node scripts/build-roteiro.mjs (não edite esses arquivos à mão).

   Estrutura de cada slide (na mesma ordem de index.html):
     titulo        igual ao data-title do slide
     tempo         estimativa em segundos (o validador compara com o tamanho das falas)
     ano           "onde estamos no tempo"
     responsaveis  quem apresenta o slide; [] e pendente: true quando ainda não há responsável
     topicos       lembretes do que aparece a cada clique (um por etapa do slide)
     intro         fala de abertura: [{ quem, texto }] (pode ter mais de uma pessoa)
     etapas        uma fala por tópico revelado: [{ quem, texto }]
     hoje          conexão "com os olhos de hoje": { quem, texto }
     perguntas     respostas curtas, caso a turma pergunte: ["Pergunta? Resposta."]
     encerramento  frase final e transição: { quem, texto }

   Orientações entre colchetes NÃO são faladas:
     [AGUARDAR A ANIMAÇÃO] [APONTAR PARA O MAPA] [APONTAR PARA A TELA] [DESTACAR A IMAGEM]
     [FAZER UMA PAUSA] [OLHAR PARA A TURMA] [CLICAR NA TELA: nome do acontecimento]
   [AVANÇAR O TÓPICO] e [PASSAR A PALAVRA] são acrescentados automaticamente no apresentador e nos documentos. */
window.GP_EQUIPE = ["Pedro Henrique", "Clara Maria", "Anthony Marcos", "Gabriel Willian", "Leandro Farias", "Lohan David"];

window.GP_NOTES = {
  abertura: {
    titulo: "Abertura",
    tempo: 65,
    ano: "1864 → 1870",
    responsaveis: ["Pedro Henrique", "Anthony Marcos"],
    topicos: [],
    intro: [
      { quem: "Pedro Henrique", texto: "[AGUARDAR A ANIMAÇÃO] Boa tarde, pessoal. Somos da turma Mecatrônica 2, e o nosso tema é a Guerra do Paraguai. [FAZER UMA PAUSA] A proposta é uma viagem ao passado, olhando tudo com os olhos de hoje." },
      { quem: "Anthony Marcos", texto: "Entre 1864 e 1870, o Paraguai enfrentou o Brasil, a Argentina e o Uruguai: foi o maior conflito internacional da América do Sul no século XIX. [DESTACAR A IMAGEM] Esta pintura do Riachuelo foi feita anos depois: é a visão de um artista, não uma foto." }
    ],
    etapas: [],
    hoje: { quem: "Pedro Henrique", texto: "Até o nome muda conforme o país: aqui, Guerra do Paraguai; no Paraguai, Guerra Grande; na Argentina e no Uruguai, é comum ouvir Guerra da Tríplice Aliança. Cada nome mostra um ponto de vista." },
    perguntas: [
      "De quem é a pintura? De Victor Meirelles: Estudo para a Batalha do Riachuelo, feito entre 1868 e 1873, hoje no Museu Nacional de Belas Artes, no Rio de Janeiro.",
      "Por que “maior conflito internacional”? Pela duração, mais de cinco anos, e principalmente pelo número de mortos: nenhuma outra guerra entre países sul-americanos no século XIX foi tão mortal."
    ],
    encerramento: { quem: "Anthony Marcos", texto: "Para entender como tudo começou, vamos à região onde a guerra nasceu: a Bacia do Prata." }
  },

  contexto: {
    titulo: "Contexto histórico",
    tempo: 85,
    ano: "1864",
    responsaveis: ["Pedro Henrique", "Anthony Marcos"],
    topicos: ["Rios eram as estradas", "Paraguai sem saída para o mar", "Países jovens"],
    intro: [
      { quem: "Anthony Marcos", texto: "[AGUARDAR A ANIMAÇÃO] Estamos em 1864. Não há rodovias e quase não há ferrovias: para cruzar a região, o caminho é o barco." }
    ],
    etapas: [
      { quem: "Anthony Marcos", texto: "[APONTAR PARA O MAPA] Os rios Paraná, Paraguai e Uruguai descem até o Rio da Prata. Por eles passam pessoas, mercadorias e, na guerra, tropas. Quem controla a navegação controla o comércio." },
      { quem: "Pedro Henrique", texto: "O Paraguai não tem litoral: tudo o que vende ou compra desce os rios, por território vizinho, até o oceano. [APONTAR PARA O MAPA] É esta linha dourada. O país depende de quem controla o caminho." },
      { quem: "Pedro Henrique", texto: "E eram países jovens: o Paraguai ficou independente em 1811, a Argentina em 1816, o Brasil em 1822, e o Uruguai só surgiu em 1828. Ainda disputavam fronteiras e influência, principalmente no Uruguai." }
    ],
    hoje: { quem: "Anthony Marcos", texto: "Com os olhos de hoje, os rios seguem decisivos: o Paraguai exporta por barcaças na hidrovia Paraguai–Paraná, e Brasil e Paraguai dividem a usina de Itaipu. O rio que separava agora gera energia para os dois." },
    perguntas: [
      "Por que as fronteiras são as atuais? O mapa usa os limites de hoje só como referência; em 1864, vários deles ainda estavam em disputa.",
      "A disputa pelo Prata era antiga? Sim. Portugal e Espanha já brigavam pela região: a Colônia do Sacramento, fundada pelos portugueses em 1680, mudou de mãos várias vezes."
    ],
    encerramento: { quem: "Pedro Henrique", texto: "Mas quem vivia nessa terra antes desses países? Lohan David leva a gente ainda mais para trás no tempo." }
  },

  pindorama: {
    titulo: "Pindorama e os povos indígenas",
    tempo: 85,
    ano: "1500 → 1864",
    responsaveis: ["Lohan David"],
    topicos: ["“Terra das palmeiras”", "Guarani, a língua do Paraguai", "Indígenas também lutaram"],
    intro: [
      { quem: "Lohan David", texto: "[AGUARDAR A ANIMAÇÃO] Um salto maior: abril de 1500. Navios portugueses chegam ao litoral; para quem vivia aqui, começa uma invasão. Os europeus batizaram a terra, mas ela já tinha nomes." }
    ],
    etapas: [
      { quem: "Lohan David", texto: "Um deles é Pindorama, palavra de origem tupi traduzida como “terra das palmeiras”. [APONTAR PARA O MAPA] Vejam: as fronteiras atuais se apagam, e ficam os rios e os povos. Eram muitos povos e muitas línguas." },
      { quem: "Lohan David", texto: "Já na guerra, no Paraguai, a maioria falava guarani, e a língua virou símbolo da nação. [DESTACAR A IMAGEM] O Cabichuí, jornal de trincheira de 1867, publicava sátiras em guarani e em espanhol." },
      { quem: "Lohan David", texto: "E indígenas também lutaram. No sul de Mato Grosso, Guaicuru e Terena combateram as tropas paraguaias ao lado do Império. [DESTACAR A IMAGEM] Os Guaicuru eram chamados de “índios cavaleiros”, como nesta gravura de Debret." }
    ],
    hoje: { quem: "Lohan David", texto: "Hoje, o guarani é língua oficial do Paraguai, ao lado do espanhol. E Kadiwéu e Terena vivem em Mato Grosso do Sul, onde a memória dessa guerra continua viva." },
    perguntas: [
      "O que significam as cores do mapa? Famílias de línguas: tupi-guarani (Guarani, Tupinambá), guaicuru (Guaicuru, Qom), aruak (Terena), jê (Kaingang) e charrua. As áreas são aproximadas.",
      "Onde aparece Pindorama na cultura? No Manifesto Antropófago, de Oswald de Andrade (1928), que fala no “matriarcado de Pindorama”.",
      "Há estudos sobre os indígenas na guerra? Sim: Giovani José da Silva estudou as memórias Kadiwéu, e Soraia Dornelles mostrou a participação voluntária dos Terena, com o capitão José Pedro de Souza."
    ],
    encerramento: { quem: "Lohan David", texto: "Com esse cenário montado, voltamos a 1864 para entender por que a guerra começou." }
  },

  causas: {
    titulo: "Causas",
    tempo: 80,
    ano: "1864",
    responsaveis: ["Lohan David"],
    topicos: ["Tensões antigas", "O estopim", "Não foi só um plano inglês"],
    intro: [
      { quem: "Lohan David", texto: "[AGUARDAR A ANIMAÇÃO] Uma guerra raramente começa num dia só: as tensões se acumulam até que alguma coisa acende o pavio." }
    ],
    etapas: [
      { quem: "Lohan David", texto: "[APONTAR PARA A TELA] Algumas vinham de longe: fronteiras sem acordo, a disputa pela navegação dos rios, Brasil e Argentina brigando por influência no Uruguai e governos ainda frágeis, com conflitos internos." },
      { quem: "Lohan David", texto: "O estopim veio em 1864, quando o Brasil interveio na guerra civil do Uruguai. [DESTACAR A IMAGEM] Esta gravura mostra o ataque a Paysandu. Solano López viu ali uma ameaça e reagiu com uma série de ataques." },
      { quem: "Lohan David", texto: "[FAZER UMA PAUSA] Um cuidado: muito se disse que a guerra foi um plano da Inglaterra, ou culpa só de Solano López. As pesquisas atuais mostram causas regionais: disputas entre os países do Prata e escolhas dos seus governos." }
    ],
    hoje: { quem: "Lohan David", texto: "Vale também para as notícias de hoje: guerras quase nunca têm uma causa só. Mais do que procurar um culpado, vale perguntar que tensões se acumularam e quem decidiu atacar." },
    perguntas: [
      "Quem disputava o Uruguai? Os blancos, que governavam em 1864, e os colorados de Venancio Flores. Pecuaristas gaúchos com terras no Uruguai pressionavam o Império a intervir, e o governo blanco buscou apoio no Paraguai.",
      "Por que dizem que foi um plano inglês? Essa tese, dos anos 1960 e 1970, não se sustentou: não há documentos que a comprovem, e Brasil e Inglaterra estavam até com relações rompidas entre 1863 e 1865, na Questão Christie."
    ],
    encerramento: { quem: "Lohan David", texto: "Para entender essas escolhas, precisamos conhecer cada lado. Gabriel Willian apresenta os quatro países." }
  },

  paises: {
    titulo: "Países envolvidos",
    tempo: 85,
    ano: "1864",
    responsaveis: ["Gabriel Willian"],
    topicos: ["Império do Brasil", "Argentina", "Uruguai", "Paraguai"],
    intro: [
      { quem: "Gabriel Willian", texto: "[AGUARDAR A ANIMAÇÃO] Quatro países, quatro governos, quatro interesses. Vamos conhecer cada um pelo rosto de quem governava." }
    ],
    etapas: [
      { quem: "Gabriel Willian", texto: "[DESTACAR A IMAGEM] O Império do Brasil, de D. Pedro II, queria rios livres: navegar pelo Prata era o caminho mais fácil até Mato Grosso. E queria influência no Uruguai, onde muitos fazendeiros gaúchos tinham terras." },
      { quem: "Gabriel Willian", texto: "A Argentina, de Bartolomé Mitre, mal tinha se unificado, depois de décadas de conflito entre Buenos Aires e as províncias." },
      { quem: "Gabriel Willian", texto: "O Uruguai, dividido entre blancos e colorados, era o centro da crise; com apoio do Brasil, o colorado Venancio Flores chegou ao poder em 1865. [APONTAR PARA A TELA] Juntos, os três formariam a Tríplice Aliança." },
      { quem: "Gabriel Willian", texto: "Do outro lado, o Paraguai de Francisco Solano López: governo centralizado e um dos maiores exércitos da região, mas dependente dos rios para chegar ao mar." }
    ],
    hoje: { quem: "Gabriel Willian", texto: "Com os olhos de hoje: em 1991, esses mesmos quatro países criaram o Mercosul, num tratado assinado justamente em Assunção. Os inimigos de 1865 viraram parceiros." },
    perguntas: [
      "As fotos são da época? Sim: Pedro II em 1865, Mitre em 1862, Flores por volta de 1865 e Solano López por volta de 1862.",
      "O que aparece no verso dos cartões? Tocando num cartão, ele vira e mostra o papel do país durante a guerra."
    ],
    encerramento: { quem: "Gabriel Willian", texto: "Conhecidos os personagens, vamos ver, mês a mês, como a crise virou guerra." }
  },

  inicio: {
    titulo: "Início do conflito",
    tempo: 90,
    ano: "1864 → 1865",
    responsaveis: ["Gabriel Willian"],
    topicos: ["Protesto paraguaio", "Intervenção no Uruguai", "Marquês de Olinda", "Invasão de Mato Grosso", "Ataque a Corrientes"],
    intro: [
      { quem: "Gabriel Willian", texto: "[AGUARDAR A ANIMAÇÃO] Vamos acompanhar a crise como manchetes de jornal. A cada clique, o mapa acende um lugar." }
    ],
    etapas: [
      { quem: "Gabriel Willian", texto: "Agosto de 1864: o Brasil dá um ultimato ao governo blanco do Uruguai. [APONTAR PARA O MAPA] No dia 30, o Paraguai protesta: ocupar o Uruguai romperia o equilíbrio do Prata." },
      { quem: "Gabriel Willian", texto: "Outubro: tropas brasileiras entram no Uruguai para apoiar os colorados de Flores. [APONTAR PARA O MAPA] Paysandu é cercada e cai em janeiro de 1865." },
      { quem: "Gabriel Willian", texto: "12 de novembro: o Paraguai captura, no rio Paraguai, o vapor brasileiro Marquês de Olinda, que levava o novo presidente da província de Mato Grosso. Muitos historiadores marcam aqui o início da guerra." },
      { quem: "Gabriel Willian", texto: "Dezembro: tropas paraguaias atacam o Forte de Coimbra e ocupam o sul de Mato Grosso. [APONTAR PARA O MAPA] A seta vermelha mostra a ofensiva subindo o rio." },
      { quem: "Gabriel Willian", texto: "Abril de 1865: a Argentina nega passagem às tropas paraguaias, e o Paraguai ataca Corrientes. Com isso, a Argentina também entra na guerra." }
    ],
    hoje: { quem: "Gabriel Willian", texto: "Com os olhos de hoje: o Forte de Coimbra continua de pé, em Corumbá, Mato Grosso do Sul, à beira do rio Paraguai." },
    perguntas: [
      "Quem estava no Marquês de Olinda? Frederico Carneiro de Campos, nomeado presidente da província de Mato Grosso. Ele ficou preso no Paraguai.",
      "Por que o Paraguai queria passar pela Argentina? Para chegar ao Uruguai e ao Rio Grande do Sul por terra. Com a recusa do governo de Mitre, o Paraguai declarou guerra à Argentina e atacou Corrientes."
    ],
    encerramento: { quem: "Gabriel Willian", texto: "Atacados, Brasil e Argentina se uniram, e o Uruguai foi junto. Leandro Farias mostra como nasceu essa aliança." }
  },

  alianca: {
    titulo: "Tríplice Aliança",
    tempo: 90,
    ano: "1º de maio de 1865",
    responsaveis: ["Leandro Farias"],
    topicos: ["Paraguai isolado", "Império do Brasil", "Argentina", "Uruguai", "O tratado secreto"],
    intro: [
      { quem: "Leandro Farias", texto: "[AGUARDAR A ANIMAÇÃO] 1º de maio de 1865, Buenos Aires. Três governos assinam um acordo que muda o rumo da guerra." }
    ],
    etapas: [
      { quem: "Leandro Farias", texto: "[APONTAR PARA O MAPA] Primeiro, o Paraguai, em vermelho: sozinho, no centro do continente, sem saída para o mar." },
      { quem: "Leandro Farias", texto: "O Brasil entra com a maior parte das tropas e com a esquadra dos rios; entre os comandantes, Osório e, depois, Caxias." },
      { quem: "Leandro Farias", texto: "A Argentina, invadida em Corrientes, entra na aliança, e pelo tratado Bartolomé Mitre assume o comando geral no começo da guerra." },
      { quem: "Leandro Farias", texto: "O Uruguai, agora governado por Flores, completa a aliança. [APONTAR PARA O MAPA] Em azul, os três aliados em volta do Paraguai." },
      { quem: "Leandro Farias", texto: "[AGUARDAR A ANIMAÇÃO] O tratado era secreto: ninguém faria a paz sozinho, e a guerra só acabaria com a queda de Solano López. O texto dizia que a luta era contra o governo, e não contra o povo paraguaio; mas foi o povo quem mais sofreu." }
    ],
    hoje: { quem: "Leandro Farias", texto: "Com os olhos de hoje: no Brasil, tratados internacionais precisam passar pelo Congresso Nacional. Um acordo secreto assim seria muito mais difícil." },
    perguntas: [
      "Quem assinou? Francisco Octaviano de Almeida Rosa, pelo Brasil; Rufino de Elizalde, pela Argentina; e Carlos de Castro, pelo Uruguai.",
      "O segredo durou? Não: o texto foi divulgado em 1866, ainda durante a guerra, e gerou críticas.",
      "E na época, podia? A Constituição do Império, de 1824, permitia ao governo fazer alianças e só comunicá-las à Assembleia Geral quando o interesse e a segurança do Estado permitissem."
    ],
    encerramento: { quem: "Leandro Farias", texto: "A guerra ainda vai durar quase cinco anos. Vamos vê-la inteira numa linha do tempo." }
  },

  cronologia: {
    titulo: "Cronologia",
    tempo: 65,
    ano: "1864 → 1870",
    responsaveis: ["Leandro Farias"],
    topicos: [],
    intro: [
      { quem: "Leandro Farias", texto: "[AGUARDAR A ANIMAÇÃO] Seis anos numa linha só. O primeiro marco já aparece destacado: a captura do Marquês de Olinda, em novembro de 1864." },
      { quem: "Leandro Farias", texto: "Entre 1864 e 1865, quem ataca é o Paraguai. [CLICAR NA TELA: Riachuelo] Em junho de 1865, a vitória brasileira em Riachuelo muda o jogo nos rios." },
      { quem: "Leandro Farias", texto: "[CLICAR NA TELA: Tuiuti] Em 1866, os aliados invadem o Paraguai, e vem Tuiuti. Depois, o longo cerco a Humaitá, até 1868." },
      { quem: "Leandro Farias", texto: "[CLICAR NA TELA: Ocupação de Assunção] Em janeiro de 1869, Assunção é ocupada. [CLICAR NA TELA: Cerro Corá] Mas a guerra só termina em 1º de março de 1870, em Cerro Corá, com a morte de Solano López." }
    ],
    etapas: [],
    hoje: { quem: "Leandro Farias", texto: "Com os olhos de hoje: muitas cidades brasileiras têm ruas chamadas Riachuelo, Humaitá, Tuiuti e Voluntários da Pátria. São nomes desta guerra que a gente vê todo dia sem perceber." },
    perguntas: [
      "Quando começou a guerra? Muitos historiadores usam 12 de novembro de 1864, a captura do Marquês de Olinda; outros, a invasão de Mato Grosso, em dezembro.",
      "Por que a guerra continuou depois de Assunção? Solano López recuou para o interior e reorganizou tropas nas cordilheiras, até 1870."
    ],
    encerramento: { quem: "Leandro Farias", texto: "Agora, vamos ver essas fases no mapa, vistas de cima." }
  },

  mapa: {
    titulo: "Mapa das campanhas",
    tempo: 110,
    ano: "1864 → 1870",
    responsaveis: [],
    pendente: true,
    topicos: ["Ofensiva paraguaia", "A guerra nos rios", "Invasão e Humaitá", "Dezembrada e Assunção", "Cordilheiras e Cerro Corá"],
    intro: [
      { texto: "[AGUARDAR A ANIMAÇÃO] A guerra vista de cima: cada clique acende uma fase, e o carimbo no canto do mapa mostra os anos." }
    ],
    etapas: [
      { texto: "Fase 1, a ofensiva paraguaia. [APONTAR PARA O MAPA] As setas vermelhas mostram três frentes: subindo o rio Paraguai até Mato Grosso, descendo sobre Corrientes e, pelo rio Uruguai, entrando no Rio Grande do Sul." },
      { texto: "Fase 2, a guerra nos rios: em junho de 1865, a vitória brasileira em Riachuelo garante o controle da navegação; em setembro, a coluna paraguaia se rende em Uruguaiana. Daí em diante, o Paraguai se defende." },
      { texto: "Fase 3: em 1866, os aliados cruzam o rio Paraná e invadem o Paraguai. [APONTAR PARA O MAPA] Em azul, o avanço aliado. Ali ficam Tuiuti, Curupaiti e Humaitá, a fortaleza que segurou os aliados por mais de dois anos." },
      { texto: "Fase 4: em dezembro de 1868, a Dezembrada, com Itororó, Avaí e Lomas Valentinas. Em janeiro de 1869, os aliados entram em Assunção." },
      { texto: "Fase 5: mesmo sem a capital, Solano López continua lutando nas cordilheiras, em Piribebuy e Acosta Ñu. A perseguição termina em Cerro Corá, em 1º de março de 1870, com a morte de López." }
    ],
    hoje: { texto: "Hoje, Cerro Corá é parque nacional, e o Paraguai lembra o 1º de março como Dia dos Heróis. No Brasil, o 11 de junho, data de Riachuelo, é a data magna da Marinha." },
    perguntas: [
      "As rotas são exatas? Não: os trajetos são esquemáticos e as localizações, aproximadas. Os pontos do mapa podem ser clicados para ver detalhes.",
      "Existe um mapa da época? Sim: o botão “Mapa histórico de 1871” abre uma planta feita logo depois da guerra, com as marchas dos exércitos aliados.",
      "Quem estava em Uruguaiana? O próprio D. Pedro II acompanhou a rendição da coluna paraguaia, em 18 de setembro de 1865, ao lado de Mitre e Flores."
    ],
    encerramento: { texto: "Vamos aproximar a câmera de cinco desses combates." }
  },

  batalhas: {
    titulo: "Campanhas e batalhas",
    tempo: 105,
    ano: "1865 → 1868",
    responsaveis: [],
    pendente: true,
    topicos: ["Riachuelo · 1865", "Tuiuti · 1866", "Curupaiti · 1866", "Humaitá · 1868", "Avaí · 1868"],
    intro: [
      { texto: "[AGUARDAR A ANIMAÇÃO] Cinco batalhas, uma por vez: o antes, o combate e o resultado. O pequeno mapa mostra onde foi." }
    ],
    etapas: [
      { texto: "Riachuelo, 11 de junho de 1865, no rio Paraná. A esquadra brasileira estava ancorada quando a paraguaia atacou. Barroso, na fragata Amazonas, avançou contra os navios inimigos. Resultado: o Brasil passa a dominar os rios." },
      { texto: "Tuiuti, 24 de maio de 1866: os aliados, acampados num terreno de banhados, são atacados de surpresa. É uma das maiores batalhas da América do Sul. Vitória aliada, com perdas enormes, sobretudo paraguaias." },
      { texto: "Curupaiti, 22 de setembro de 1866. Os aliados atacaram de frente as trincheiras e sofreram uma derrota pesada. [DESTACAR A IMAGEM] O argentino Cándido López lutou ali, perdeu o braço direito e depois pintou a guerra com a mão esquerda." },
      { texto: "Humaitá era uma fortaleza numa curva do rio Paraguai, com canhões e correntes. Em fevereiro de 1868, encouraçados brasileiros forçaram a passagem; em julho, a posição foi ocupada." },
      { texto: "Avaí, dezembro de 1868: para contornar as defesas, os aliados abriram uma estrada pelo Chaco. Itororó, Avaí e Lomas Valentinas abriram o caminho para Assunção." }
    ],
    hoje: { texto: "Com os olhos de hoje, reparem: há fotografias de 1866 e pinturas feitas depois da guerra. Essas pinturas ajudaram a criar a memória heroica que ainda aparece em ruas e datas." },
    perguntas: [
      "As pinturas mostram o que aconteceu? Não exatamente: as telas de Victor Meirelles e Pedro Américo foram pintadas depois da guerra, sob encomenda. Ajudaram a construir memória, não são registros diretos.",
      "Por que fotografias são importantes? A Guerra do Paraguai foi uma das primeiras guerras fotografadas na América do Sul; a foto da trincheira de Tuiuti é de 1866."
    ],
    encerramento: { texto: "Por trás de cada batalha havia pessoas. Clara Maria mostra o custo humano dessa guerra." }
  },

  humanas: {
    titulo: "Consequências humanas",
    tempo: 95,
    ano: "1864 → 1870",
    responsaveis: ["Clara Maria"],
    topicos: ["Doenças e fome", "Recrutamento desigual", "Civis atingidos", "Paraguai devastado", "Quantos morreram?"],
    intro: [
      { quem: "Clara Maria", texto: "[DESTACAR A IMAGEM] [FAZER UMA PAUSA] Esta fotografia é de 1867: mulheres e crianças paraguaias desabrigadas. A guerra não aconteceu só nos campos de batalha." }
    ],
    etapas: [
      { quem: "Clara Maria", texto: "Primeiro, doenças e fome: o cólera de 1867 atingiu os dois lados, e muitos soldados morreram de doença, não em combate. [DESTACAR A IMAGEM] Nesta charge da época, o cólera zomba dos comandantes." },
      { quem: "Clara Maria", texto: "Segundo, o recrutamento desigual: havia voluntários, mas também recrutamento forçado. No Brasil, pessoas escravizadas foram mandadas à guerra, muitas vezes no lugar dos senhores, com promessa de liberdade." },
      { quem: "Clara Maria", texto: "Terceiro, os civis: ocupações, fugas, colheitas perdidas e cidades destruídas atingiram famílias inteiras, sobretudo no Paraguai, mas também no Brasil e na Argentina." },
      { quem: "Clara Maria", texto: "Quarto: o Paraguai foi o mais devastado. Perdeu grande parte da população, sobretudo homens, e levou gerações para se recuperar." },
      { quem: "Clara Maria", texto: "[FAZER UMA PAUSA] E quantas pessoas morreram? A resposta honesta: não há um número exato. Os censos eram falhos, registros se perderam, e os historiadores chegam a resultados diferentes." }
    ],
    hoje: { quem: "Clara Maria", texto: "No Paraguai, o Dia da Criança é 16 de agosto, em memória de Acosta Ñu, batalha de 1869 em que lutaram muitos meninos." },
    perguntas: [
      "Quais são as estimativas? Elas variam muito: Thomas Whigham e Barbara Potthast (1999) defendem perdas muito altas para o Paraguai; Vera Blinn Reber (1988) calculou perdas bem menores. Por isso o trabalho não adota uma cifra única.",
      "Quem eram os Voluntários da Pátria? Corpos criados pelo governo imperial em janeiro de 1865. No começo, muitos se alistaram; depois, o recrutamento passou a ser forçado."
    ],
    encerramento: { quem: "Clara Maria", texto: "Além das vidas, a guerra mudou governos, economias e fronteiras." }
  },

  politicas: {
    titulo: "Consequências políticas e econômicas",
    tempo: 85,
    ano: "1870 em diante",
    responsaveis: ["Clara Maria"],
    topicos: ["Paraguai", "Brasil", "Argentina", "Uruguai"],
    intro: [
      { quem: "Clara Maria", texto: "[AGUARDAR A ANIMAÇÃO] A guerra terminou em 1870, mas os efeitos, não. Vamos país por país." }
    ],
    etapas: [
      { quem: "Clara Maria", texto: "O Paraguai ficou ocupado até 1876, perdeu territórios e teve de reconstruir o Estado quase do zero. [DESTACAR A IMAGEM] Este é o Palácio dos López, em Assunção, depois do bombardeio." },
      { quem: "Clara Maria", texto: "No Brasil, o Exército ganhou força e peso político; muitos historiadores ligam isso à Proclamação da República, em 1889. [DESTACAR A IMAGEM] Na charge de Agostini, de 1870, um soldado negro volta e encontra a mãe castigada: a guerra reforçou o debate sobre a escravidão." },
      { quem: "Clara Maria", texto: "A Argentina consolidou o Estado nacional e ficou com parte das terras em disputa. Outra área, no Chaco, foi decidida em 1878 pelo presidente dos Estados Unidos, Rutherford Hayes, a favor do Paraguai." },
      { quem: "Clara Maria", texto: "E o Uruguai teve o menor papel militar, mas foi lá que a crise começou." }
    ],
    hoje: { quem: "Clara Maria", texto: "Com os olhos de hoje: aquele palácio bombardeado é a sede do governo paraguaio. E o Paraguai tem um departamento chamado Presidente Hayes, em homenagem ao árbitro de 1878." },
    perguntas: [
      "Quando os limites do Paraguai foram definidos? Em tratados com o Brasil, em 1872, e com a Argentina, em 1876.",
      "A guerra custou caro ao Brasil? Sim: o Império se endividou para financiar o esforço de guerra."
    ],
    encerramento: { quem: "Clara Maria", texto: "E como os historiadores explicaram tudo isso? Pedro Henrique e Anthony Marcos mostram que nem sempre do mesmo jeito." }
  },

  interpretacoes: {
    titulo: "Interpretações históricas",
    tempo: 95,
    ano: "1870 → hoje",
    responsaveis: ["Pedro Henrique", "Anthony Marcos"],
    topicos: ["Tradicional", "Revisionista", "Pesquisas recentes", "Nosso critério"],
    intro: [
      { quem: "Pedro Henrique", texto: "[AGUARDAR A ANIMAÇÃO] A história também tem história: a mesma guerra foi contada de jeitos diferentes, dependendo de quem contava e de quando." }
    ],
    etapas: [
      { quem: "Pedro Henrique", texto: "A visão tradicional, dos livros mais antigos, contava a guerra pelos heróis, generais e batalhas. Organizou datas e documentos, mas deixou de fora o povo comum, os escravizados e os indígenas." },
      { quem: "Anthony Marcos", texto: "Nos anos 1960 e 1970, a visão revisionista criticou essa versão patriótica e culpou a Inglaterra, como no livro Genocídio americano, de 1979. Pesquisas posteriores mostraram que esse papel foi exagerado." },
      { quem: "Pedro Henrique", texto: "As pesquisas recentes, como as de Francisco Doratioto, comparam documentos dos vários países e olham para os Estados, a diplomacia e a sociedade: soldados, mulheres, escravizados e indígenas." },
      { quem: "Anthony Marcos", texto: "[FAZER UMA PAUSA] E o nosso critério: confiar mais na explicação que mostra provas, compara os lados e admite o que não sabe. [DESTACAR A IMAGEM] Esta pintura, La paraguaya, lembra que a arte também criou memórias." }
    ],
    hoje: { quem: "Anthony Marcos", texto: "Com os olhos de hoje, fica a pergunta: quem conta a história, e quem fica de fora? Até os livros didáticos já contaram essa guerra de jeitos diferentes." },
    perguntas: [
      "Quais livros representam cada visão? Revisionista: León Pomer (1968) e Júlio José Chiavenatto, Genocídio americano (1979). Recente: Francisco Doratioto, Maldita guerra (2002).",
      "Quem pintou La paraguaya? O uruguaio Juan Manuel Blanes, por volta de 1879: uma mulher sozinha num campo devastado, alegoria do Paraguai depois da guerra."
    ],
    encerramento: { quem: "Anthony Marcos", texto: "Para fechar, vamos responder à pergunta que guiou o nosso trabalho." }
  },

  conclusao: {
    titulo: "Conclusão",
    tempo: 75,
    ano: "1864 → hoje",
    responsaveis: ["Pedro Henrique", "Anthony Marcos"],
    topicos: ["Nossa pergunta", "Nossa resposta", "O passado com os olhos de hoje"],
    intro: [
      { quem: "Anthony Marcos", texto: "[AGUARDAR A ANIMAÇÃO] Chegamos ao fim da viagem: saímos de 1864, passamos pelos rios, pelas batalhas e pelas pessoas, e voltamos ao presente." }
    ],
    etapas: [
      { quem: "Anthony Marcos", texto: "Nossa pergunta foi: como as disputas no Prata levaram à guerra, e o que ela mudou na vida e na política dos países?" },
      { quem: "Pedro Henrique", texto: "Nossa resposta: foi uma crise regional, em que interesses dos Estados, a navegação dos rios, a intervenção no Uruguai e escolhas militares se somaram. Os efeitos foram desiguais e duradouros, sobretudo para o Paraguai." },
      { quem: "Anthony Marcos", texto: "[OLHAR PARA A TURMA] E olhar o passado com os olhos de hoje é isto: comparar documentos, desconfiar de versões fáceis e lembrar o custo humano das decisões tomadas em nome do poder." }
    ],
    hoje: { quem: "Pedro Henrique", texto: "Os quatro países que se enfrentaram em 1864 hoje são parceiros e dividem rios, pontes e usinas. Entender a guerra ajuda a entender a paz." },
    perguntas: [
      "Qual foi a pergunta do trabalho? Como as disputas políticas e estratégicas no Prata contribuíram para a guerra, e de que maneira o conflito transformou a vida social e a organização política dos países envolvidos."
    ],
    encerramento: { quem: "Pedro Henrique", texto: "Agradecemos a atenção de vocês. As nossas fontes estão no próximo slide." }
  },

  referencias: {
    titulo: "Referências",
    tempo: 25,
    ano: "Fontes",
    responsaveis: ["Pedro Henrique", "Anthony Marcos"],
    topicos: [],
    intro: [
      { quem: "Pedro Henrique", texto: "[APONTAR PARA A TELA] Estas são as nossas fontes: artigos acadêmicos, teses, documentos oficiais, acervos de museus e mapas. As imagens são de domínio público, com autoria e data." }
    ],
    etapas: [],
    hoje: { quem: "Anthony Marcos", texto: "Todas as referências têm link, para quem quiser conferir e continuar a pesquisa." },
    perguntas: [
      "Onde estão os créditos das imagens? Ao lado da lista, com o link para a ficha de cada imagem."
    ],
    encerramento: { quem: "Anthony Marcos", texto: "Ficamos à disposição para perguntas." }
  }
};
