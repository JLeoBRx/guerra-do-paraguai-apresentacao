/* Roteiro do apresentador — carregado SOMENTE pelo modo apresentador (presenter.html).
   Não aparece na projeção. Tempos em segundos.
   Estilo: uma "viagem ao passado" — cada slide começa num momento da história (ano),
   revela um tópico por clique ("etapas") e termina olhando o passado com os olhos de hoje.
   Campos: tempo, ano, topicos (lembretes curtos do que está na tela), fala (abertura do slide),
   etapas (o que dizer a cada tópico), hoje (conexão com o presente), complemento (se perguntarem)
   e transicao (frase para passar ao próximo slide).
   O arquivo ROTEIRO.md é gerado a partir daqui: node scripts/build-roteiro.mjs */
window.GP_NOTES = {
  abertura: {
    tempo: 45,
    ano: "1864 → 1870",
    fala: "Boa tarde. Imaginem a América do Sul sem as estradas e os aviões de hoje: quem queria atravessar a região viajava de barco, pelos rios. É nesse mundo que vamos entrar agora. Entre 1864 e 1870, o Paraguai enfrentou o Brasil, a Argentina e o Uruguai no maior conflito internacional da América do Sul no século XIX.",
    hoje: "Cada país dá um nome a essa guerra: no Brasil, Guerra do Paraguai; no Paraguai, Guerra Grande; na Argentina e no Uruguai, Guerra da Tríplice Aliança. O nome que cada um usa já mostra de que lado ele conta a história.",
    complemento: "A pintura é um estudo de Victor Meirelles para a Batalha Naval do Riachuelo (1865), feito entre 1868 e 1873. É uma representação artística, não uma fotografia do combate.",
    transicao: "Para entender como tudo começou, vamos primeiro à região onde a guerra nasceu: a Bacia do Prata."
  },
  contexto: {
    tempo: 85,
    ano: "1864",
    topicos: ["Rios eram as estradas", "Paraguai sem saída para o mar", "Países jovens"],
    fala: "Vamos voltar a 1864. Não há rodovias nem ferrovias ligando esses países: quem quer cruzar a região viaja de barco. Olhem o mapa: tudo gira em torno de três grandes rios.",
    etapas: [
      "Primeiro tópico: os rios eram as estradas. O Paraná, o Paraguai e o Uruguai levavam pessoas, mercadorias e tropas até o Rio da Prata, entre Buenos Aires e Montevidéu. Quem controlava os rios controlava o comércio — e, na guerra, a passagem dos exércitos.",
      "Segundo: o Paraguai não tem mar. Tudo o que o país comprava ou vendia precisava descer os rios, passando por territórios vizinhos — é a rota tracejada em vermelho no mapa. Com os olhos de hoje: o Paraguai continua sem litoral e ainda depende da hidrovia Paraguai–Paraná para exportar; tem uma das maiores frotas de barcaças do mundo.",
      "Terceiro: países jovens. O Paraguai se declarou independente em 1811, a Argentina em 1816, o Brasil em 1822, e o Uruguai só existia como país desde 1828. Em 1864, eram Estados com uns quarenta, cinquenta anos de vida, ainda brigando por fronteiras e por influência."
    ],
    hoje: "Hoje, Brasil e Paraguai dividem a usina de Itaipu, no rio Paraná: os mesmos rios que separavam os países no século XIX hoje geram energia para os dois.",
    complemento: "A disputa pelo Prata é antiga: desde o período colonial, Portugal e Espanha brigavam pela região — a Colônia do Sacramento, fundada pelos portugueses em 1680, mudou de mãos várias vezes. O mapa usa as fronteiras atuais só como referência. A geografia ajuda a entender a guerra, mas não a explica sozinha.",
    transicao: "Mas, antes desses países existirem, quem vivia nessa terra? Vamos voltar ainda mais no tempo."
  },
  pindorama: {
    tempo: 80,
    ano: "1500 → 1864",
    topicos: ["“Terra das palmeiras”", "Guarani, a língua do Paraguai", "Indígenas também lutaram"],
    fala: "Agora, uma viagem maior: abril de 1500. Navios portugueses chegam ao litoral — para quem já vivia aqui, o começo de uma invasão. Os europeus chamaram a terra de Vera Cruz, depois Santa Cruz e, por fim, Brasil. Mas ela já tinha povos, línguas e nomes. Um deles ficou famoso: Pindorama.",
    etapas: [
      "Pindorama vem do tupi e costuma ser traduzida como “terra das palmeiras” — pindó é palmeira. Com o tempo, virou símbolo do Brasil de antes de 1500: o Manifesto Antropófago, de 1928, fala no “matriarcado de Pindorama”. Reparem no mapa: as fronteiras de hoje se apagam e ficam os rios e os povos — Guarani, Tupinambá, Guaicuru, Terena, Qom, Kaingang, Charrua. Não havia um só território, e sim muitos povos.",
      "Agora, um salto até a guerra. No Paraguai, a maioria da população falava guarani. Durante o conflito, a língua virou símbolo da nação: jornais de trincheira, como o Cabichuí, de 1867, publicavam textos em guarani. Com os olhos de hoje: o guarani é língua oficial do Paraguai, ao lado do espanhol, e continua sendo falado pela maior parte da população.",
      "E os indígenas também lutaram. No sul de Mato Grosso — o atual Mato Grosso do Sul —, Guaicuru e Terena combateram as tropas paraguaias ao lado do Império. Os Guaicuru eram conhecidos como “índios cavaleiros”, como mostra a pintura de Debret. Para os Kadiwéu, descendentes dos Guaicuru, essa guerra “jamais foi encerrada”: continua viva em narrativas e rituais."
    ],
    hoje: "Kadiwéu e Terena vivem até hoje em Mato Grosso do Sul, e os Terena estão entre os maiores povos indígenas do estado. A história da guerra também é a história deles.",
    complemento: "Em 1865, o capitão terena José Pedro de Souza publicou no Diário de São Paulo uma petição ao governo imperial; para a historiadora Soraia Dornelles, ela mostra a participação voluntária indígena e as expectativas dos Terena. As cores do mapa indicam famílias de línguas: tupi-guarani (Guarani, Tupinambá), guaicuru (Guaicuru, Qom), aruak (Terena), jê (Kaingang) e charrua. As áreas são aproximadas.",
    transicao: "Com esse cenário — rios, países jovens e povos que já viviam ali —, podemos voltar a 1864 e entender por que a guerra começou."
  },
  causas: {
    tempo: 85,
    ano: "1864",
    topicos: ["Tensões antigas", "O estopim", "Não foi só um plano inglês"],
    fala: "De volta a 1864. Uma guerra não começa num único dia: ela vai se acumulando. Vamos separar o que vinha de longe do que acendeu o pavio.",
    etapas: [
      "Primeiro, as tensões antigas: fronteiras sem acordo, a disputa pela navegação dos rios, a briga entre Brasil e Argentina por influência no Uruguai e governos ainda frágeis, com conflitos internos. A região era um barril de pólvora.",
      "Agora, o estopim. Em 1864, o Brasil intervém na guerra civil do Uruguai — a gravura mostra o ataque a Paysandu. Solano López vê nisso uma ameaça. Em novembro, o Paraguai captura o navio brasileiro Marquês de Olinda; em dezembro, invade Mato Grosso; e em abril de 1865 ataca Corrientes, na Argentina. O barril explode.",
      "Um cuidado: por muito tempo se disse que a guerra foi um plano da Inglaterra, ou culpa apenas de Solano López. A pesquisa atual mostra que as causas estão principalmente nas relações entre os próprios países do Prata e nas escolhas de seus governos."
    ],
    hoje: "Hoje, disputas de fronteira e de influência entre vizinhos ainda existem no mundo. A diferença é que existem tratados, tribunais e organismos regionais para resolvê-las antes que virem guerra — algo que faltava no Prata de 1864.",
    complemento: "No Uruguai disputavam o poder os blancos, que governavam em 1864, e os colorados de Venancio Flores. Pecuaristas do Rio Grande do Sul com terras no Uruguai pressionavam o Império a intervir, e o governo blanco buscava apoio no Paraguai.",
    transicao: "Mas quem eram esses países e o que cada um queria? Vamos conhecê-los."
  },
  paises: {
    tempo: 70,
    ano: "1864",
    topicos: ["Império do Brasil", "Argentina", "Uruguai", "Paraguai"],
    fala: "Quatro países, quatro governos, quatro interesses. Vamos conhecer cada um pelo rosto de quem o governava.",
    etapas: [
      "O Império do Brasil, de D. Pedro II, queria garantir a navegação dos rios — era o caminho mais prático para chegar a Mato Grosso — e manter influência no Uruguai.",
      "A Argentina, de Bartolomé Mitre, ainda terminava de se unificar e tinha muitas divisões internas.",
      "O Uruguai, dividido entre blancos e colorados, era o centro da crise. Com apoio brasileiro, Venancio Flores chegou ao poder em 1865.",
      "E o Paraguai, de Francisco Solano López: um Estado centralizado, com exército forte, mas totalmente dependente dos rios para chegar ao mar. Brasil, Argentina e Uruguai formariam a Tríplice Aliança contra ele."
    ],
    hoje: "Com os olhos de hoje: em 1991, esses mesmos quatro países — Brasil, Argentina, Uruguai e Paraguai — criaram juntos o Mercosul, num tratado assinado em Assunção. Os inimigos de 1865 viraram parceiros.",
    complemento: "As fotografias são de época: Pedro II em 1865, Mitre em 1862, Flores por volta de 1865 e Solano López por volta de 1862. Clicando num cartão, aparece o papel do país durante a guerra.",
    transicao: "Conhecidos os personagens, vamos ver, mês a mês, como a crise virou guerra."
  },
  inicio: {
    tempo: 90,
    ano: "1864 → 1865",
    topicos: ["Protesto paraguaio", "Intervenção no Uruguai", "Marquês de Olinda", "Invasão de Mato Grosso", "Ataque a Corrientes"],
    fala: "Vamos acompanhar os acontecimentos como se fossem manchetes de jornal, mês a mês, entre 1864 e 1865.",
    etapas: [
      "30 de agosto de 1864: o Brasil dá um ultimato ao governo blanco do Uruguai. O Paraguai protesta: ocupar o Uruguai romperia o equilíbrio da região.",
      "Outubro: tropas do Império entram no Uruguai para apoiar os colorados de Flores. A cidade de Paysandu é cercada e cai em janeiro de 1865.",
      "12 de novembro: no rio Paraguai, forças paraguaias capturam o vapor brasileiro Marquês de Olinda, que levava o novo presidente da província de Mato Grosso. Muitos historiadores tomam essa data como o início da guerra.",
      "Dezembro: tropas paraguaias atacam o Forte de Coimbra e avançam pelo sul de Mato Grosso — a região que hoje é o Mato Grosso do Sul.",
      "Abril de 1865: a Argentina nega passagem às tropas paraguaias, e o Paraguai ataca Corrientes. Com isso, a Argentina também entra na guerra."
    ],
    hoje: "O Forte de Coimbra ainda existe: fica em Corumbá, Mato Grosso do Sul, às margens do rio Paraguai, perto da fronteira com a Bolívia.",
    complemento: "O Marquês de Olinda levava Frederico Carneiro de Campos, nomeado presidente da província de Mato Grosso. O mapa usa os limites atuais só como referência.",
    transicao: "Atacados, Brasil e Argentina se uniram — e o Uruguai foi junto. É o próximo passo."
  },
  alianca: {
    tempo: 75,
    ano: "1º de maio de 1865",
    topicos: ["Paraguai isolado", "Império do Brasil", "Argentina", "Uruguai", "O tratado secreto"],
    fala: "Primeiro de maio de 1865, Buenos Aires. Três governos se reúnem e assinam um acordo que muda o rumo da guerra.",
    etapas: [
      "No mapa, o Paraguai aparece sozinho, no centro do continente, sem saída para o mar.",
      "O Brasil entra com a maior parte das tropas e com a esquadra que vai dominar os rios. Entre seus comandantes estão Osório e, a partir do fim de 1866, Caxias.",
      "A Argentina, invadida em Corrientes, entra na aliança; pelo tratado, Bartolomé Mitre assume o comando inicial das forças em terra.",
      "O Uruguai, agora governado por Flores, completa o trio. O triângulo no mapa liga Rio de Janeiro, Buenos Aires e Montevidéu.",
      "O tratado era secreto: nenhum aliado faria a paz sozinho, e as armas só seriam baixadas com a queda de Solano López. O texto dizia que a guerra não era contra o povo paraguaio — mas foi o povo que mais sofreu."
    ],
    hoje: "Com os olhos de hoje: no Brasil, a Constituição exige que tratados internacionais passem pelo Congresso. Um acordo secreto como o de 1865 hoje seria muito mais difícil.",
    complemento: "Assinaram Francisco Octaviano de Almeida Rosa (Brasil), Rufino de Elizalde (Argentina) e Carlos de Castro (Uruguai). O conteúdo secreto acabou vindo a público ainda durante a guerra e gerou críticas.",
    transicao: "Com a aliança formada, a guerra vai durar quase cinco anos. Vamos ver tudo numa linha do tempo."
  },
  cronologia: {
    tempo: 75,
    ano: "1864 → 1870",
    topicos: ["1864–1865: ofensiva paraguaia", "1866–1868: invasão e Humaitá", "1868–1870: avanço final"],
    fala: "Seis anos numa linha. Imaginem que cada ponto é uma manchete de jornal da época. Vou clicar nos principais acontecimentos.",
    hoje: "Muitas cidades brasileiras têm ruas chamadas Riachuelo, Humaitá, Tuiuti e Voluntários da Pátria: nomes que vêm desta guerra e que a gente vê todo dia sem perceber.",
    complemento: "Sugestão de cliques: Marquês de Olinda (o início), Riachuelo, Tuiuti, Passagem de Humaitá, Ocupação de Assunção e Cerro Corá (o fim). O ano grande ao fundo avança de 1864 a 1870.",
    transicao: "Agora vamos ver essas fases no mapa, vistas de cima."
  },
  mapa: {
    tempo: 135,
    ano: "1864 → 1870",
    topicos: ["Ofensiva paraguaia", "A guerra nos rios", "Invasão e Humaitá", "Dezembrada e Assunção", "Cordilheiras e Cerro Corá"],
    fala: "Agora, a guerra vista de cima, como uma imagem de satélite — só que de mais de 150 anos atrás. Cada clique acende uma fase.",
    etapas: [
      "Fase 1, de dezembro de 1864 a setembro de 1865: a ofensiva paraguaia. As setas vermelhas mostram os ataques: ao norte, pelo rio Paraguai, até Mato Grosso; ao sul, sobre Corrientes; e, pelo rio Uruguai, até o Rio Grande do Sul.",
      "Fase 2, 1865: a guerra nos rios. Em junho, a esquadra brasileira vence em Riachuelo e passa a controlar a navegação. Em setembro, a coluna paraguaia se rende em Uruguaiana, com D. Pedro II presente.",
      "Fase 3, de 1866 a 1868: os aliados cruzam o rio Paraná e invadem o Paraguai. Vêm Tuiuti, uma das maiores batalhas da América do Sul, a derrota aliada em Curupaiti e o longo cerco à fortaleza de Humaitá.",
      "Fase 4, dezembro de 1868: a Dezembrada — Itororó, Avaí e Lomas Valentinas. Em janeiro de 1869, os aliados ocupam Assunção.",
      "Fase 5, 1869 e 1870: a campanha das Cordilheiras, com Piribebuy e Acosta Ñu. A perseguição termina em Cerro Corá, em 1º de março de 1870, com a morte de Solano López."
    ],
    hoje: "Em Cerro Corá existe hoje um parque nacional, e o Paraguai lembra o 1º de março como Dia dos Heróis. No Brasil, o 11 de junho — data de Riachuelo — é a data magna da Marinha.",
    complemento: "As rotas do mapa são esquemáticas e as localizações, aproximadas. Os pontos podem ser clicados. O botão do mapa histórico abre uma planta de 1871 feita logo após a guerra.",
    transicao: "Vamos aproximar a câmera de cinco desses combates."
  },
  batalhas: {
    tempo: 130,
    ano: "1865 → 1868",
    topicos: ["Riachuelo · 1865", "Tuiuti · 1866", "Curupaiti · 1866", "Humaitá · 1868", "Avaí · 1868"],
    fala: "Agora vamos entrar em cinco batalhas, uma por vez. Para cada uma: o que havia antes, o combate e o resultado.",
    etapas: [
      "Riachuelo, 11 de junho de 1865, no rio Paraná. A esquadra brasileira está ancorada quando a paraguaia ataca. O almirante Barroso, na fragata Amazonas, avança contra os navios inimigos. Resultado: o Brasil passa a controlar os rios.",
      "Tuiuti, 24 de maio de 1866. Depois de cruzar o Paraná, os aliados acampam em território paraguaio e são atacados. É uma das maiores batalhas da história da América do Sul. Vitória aliada, com perdas enormes.",
      "Curupaiti, 22 de setembro de 1866. Os aliados atacam de frente as trincheiras paraguaias e são derrotados. O pintor argentino Cándido López lutou ali, perdeu o braço direito e depois pintou a guerra com a mão esquerda.",
      "Humaitá, 19 de fevereiro de 1868. Uma fortaleza com correntes e canhões bloqueava o rio Paraguai. Encouraçados brasileiros forçam a passagem; em julho, a posição é ocupada.",
      "Avaí, 11 de dezembro de 1868. Os aliados abrem uma estrada pelo Chaco para contornar as defesas. Itororó, Avaí e Lomas Valentinas abrem o caminho para Assunção."
    ],
    hoje: "Repare nas imagens: algumas são fotografias de 1866; outras, pinturas feitas anos depois. A Guerra do Paraguai foi uma das primeiras guerras fotografadas na América do Sul — e as pinturas ajudaram a criar a memória heroica que ainda vemos em nomes de ruas e datas comemorativas.",
    complemento: "As telas de Victor Meirelles e Pedro Américo foram pintadas depois da guerra, sob encomenda: também construíram memória, não são registros diretos.",
    transicao: "Por trás das batalhas havia pessoas. O custo humano é o próximo tema."
  },
  humanas: {
    tempo: 85,
    ano: "1864 → 1870",
    topicos: ["Doenças e fome", "Recrutamento desigual", "Civis atingidos", "Paraguai devastado", "Quantos morreram?"],
    fala: "Olhem esta fotografia de 1867: mulheres e crianças paraguaias desabrigadas. Ela lembra que a guerra não aconteceu só nos campos de batalha.",
    etapas: [
      "Primeiro: doenças e fome. O cólera, em 1867, e a falta de comida mataram muitos soldados — muitos morreram de doença, e não em combate.",
      "Segundo: o recrutamento foi desigual. Havia voluntários, mas também recrutamento forçado; no Brasil, pessoas escravizadas foram enviadas à guerra, algumas com a promessa de liberdade.",
      "Terceiro: os civis. Ocupações, fugas, perda de colheitas e cidades destruídas atingiram famílias inteiras.",
      "Quarto: o Paraguai foi o mais devastado. Perdeu grande parte da população, com efeitos que duraram gerações.",
      "E quantas pessoas morreram? A resposta honesta é: não existe um número exato. Os censos eram incompletos, muitos registros se perderam, e os historiadores chegam a resultados diferentes."
    ],
    hoje: "No Paraguai, o Dia da Criança é comemorado em 16 de agosto, em memória da batalha de Acosta Ñu, em 1869, onde lutaram muitos meninos.",
    complemento: "Thomas Whigham e Barbara Potthast (1999) defenderam perdas muito altas para o Paraguai; outros pesquisadores, como Vera Blinn Reber (1988), calcularam perdas menores. Por isso o trabalho não adota uma cifra única.",
    transicao: "Além das vidas, a guerra mudou governos, economias e fronteiras."
  },
  politicas: {
    tempo: 75,
    ano: "1870 em diante",
    topicos: ["Paraguai", "Brasil", "Argentina", "Uruguai"],
    fala: "A guerra terminou em 1870, mas os efeitos não. Vamos ver o que mudou em cada país.",
    etapas: [
      "Paraguai: ficou ocupado por tropas aliadas até 1876, perdeu territórios e precisou reconstruir o Estado quase do zero.",
      "Brasil: o Exército saiu fortalecido e ganhou peso político. A charge de Angelo Agostini, de 1870, mostra um soldado negro que volta da guerra e encontra a mãe sendo castigada: a guerra aumentou o debate sobre a escravidão. Com os olhos de hoje: muitos historiadores ligam esse novo peso do Exército à Proclamação da República, em 1889.",
      "Argentina: consolidou o Estado nacional. Na disputa pelo Chaco, a arbitragem do presidente dos Estados Unidos, Rutherford Hayes, em 1878, deu ao Paraguai a área em questão.",
      "Uruguai: teve o menor papel militar, mas foi lá que a crise começou."
    ],
    hoje: "No Paraguai existe até hoje um departamento chamado Presidente Hayes, em homenagem ao presidente americano da arbitragem de 1878.",
    complemento: "Os limites do Paraguai foram fixados em tratados com o Brasil (1872) e com a Argentina (1876). O Brasil se endividou com o esforço de guerra. A fotografia mostra o Palácio dos López, em Assunção, depois de bombardeado.",
    transicao: "E como os historiadores explicaram tudo isso? Nem sempre do mesmo jeito."
  },
  interpretacoes: {
    tempo: 80,
    ano: "1870 → hoje",
    topicos: ["Tradicional", "Revisionista", "Pesquisas recentes", "Nosso critério"],
    fala: "A história também tem história. A mesma guerra foi contada de jeitos diferentes, dependendo de quem contava e de quando contava.",
    etapas: [
      "A visão tradicional, a dos livros mais antigos, contava a guerra pelos heróis, generais e batalhas. Organizou datas e documentos militares, mas deixou de fora o povo comum, os escravizados e os indígenas.",
      "Nos anos 1960 e 1970, a visão revisionista criticou essa versão patriótica e destacou a economia e o imperialismo. Livros como Genocídio americano, de Júlio José Chiavenatto (1979), culpavam a Inglaterra. A pesquisa posterior mostrou que esse papel foi exagerado.",
      "As pesquisas recentes, como as de Francisco Doratioto, comparam documentos dos vários países e olham para os Estados, a diplomacia e a sociedade.",
      "Nosso critério: confiamos mais na explicação que mostra provas, compara os lados e admite o que não sabe. A pintura La paraguaya, de Juan Manuel Blanes (c. 1879), lembra que a arte também construiu memórias da guerra."
    ],
    hoje: "Com os olhos de hoje, a pergunta muda: quem conta a história — e quem ficou de fora dela?",
    complemento: "Obras citadas: León Pomer (1968), Júlio José Chiavenatto (1979) e Francisco Doratioto (Maldita guerra, 2002).",
    transicao: "Para fechar, vamos responder à pergunta que guiou o nosso trabalho."
  },
  conclusao: {
    tempo: 60,
    ano: "1864 → hoje",
    topicos: ["Nossa pergunta", "Nossa resposta", "O passado com os olhos de hoje"],
    fala: "Chegamos ao fim da viagem. Saímos de 1864, passamos pelos rios, pelas batalhas e pelas pessoas — e voltamos ao presente.",
    etapas: [
      "A pergunta do trabalho foi: como as disputas políticas e estratégicas no Prata contribuíram para a guerra, e de que maneira o conflito transformou a vida social e a organização política dos países envolvidos?",
      "Nossa resposta: a guerra nasceu de uma crise regional em que interesses dos Estados, a navegação dos rios, a intervenção política e escolhas militares se combinaram. Seus efeitos foram desiguais e duradouros — sobretudo para o Paraguai.",
      "E a lição: olhar o passado com os olhos de hoje é confrontar documentos, comparar versões e lembrar o custo humano das decisões tomadas em nome do poder. Obrigado."
    ],
    hoje: "Os mesmos quatro países que lutaram entre 1864 e 1870 hoje são parceiros no Mercosul e dividem rios, pontes e usinas. Entender a guerra ajuda a entender como a paz é construída.",
    transicao: "Se houver perguntas, as fontes estão no próximo slide."
  },
  referencias: {
    tempo: 30,
    ano: "Fontes",
    fala: "As fontes do trabalho estão aqui: artigos acadêmicos, documentos, acervos de museus e mapas. As imagens são de domínio público, com autoria e data.",
    hoje: "Todas as referências foram consultadas on-line; os links estão no slide e no site.",
    transicao: "Obrigado! Ficamos à disposição para perguntas."
  }
};
