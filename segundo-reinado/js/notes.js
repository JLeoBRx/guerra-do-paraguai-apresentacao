/* Roteiro do apresentador — carregado SOMENTE pelo modo apresentador (presenter.html).
   Não aparece na projeção. Tempos em segundos.
   Estilo: uma "viagem ao passado" — cada slide começa num momento da história (ano),
   revela um tópico por clique ("etapas") e termina olhando o passado com os olhos de hoje.
   Campos: tempo, ano, topicos (lembretes do que está na tela, um por etapa), fala (abertura do slide),
   etapas (o que dizer a cada tópico), hoje (conexão com o presente), complemento (se perguntarem)
   e transicao (frase para passar ao próximo slide).
   O ROTEIRO.md é gerado a partir daqui: node scripts/roteiro.mjs */
window.GP_NOTES = {
  abertura: {
    tempo: 45,
    ano: "1840 → 1889",
    fala: "Boa tarde. Hoje vamos voltar ao Brasil do século XIX, quando o país era uma monarquia governada por um imperador: D. Pedro II, o homem da fotografia. Ele reinou de 1840 a 1889 — quase meio século. O Império parecia estável, mas em poucos anos perdeu os apoios que o sustentavam e caiu sem quase nenhuma resistência. É essa crise que vamos contar.",
    hoje: "Muita gente ainda conhece D. Pedro II pelas notas, selos e retratos. Em Petrópolis, o antigo palácio de verão da família imperial virou o Museu Imperial, onde está a coroa do imperador.",
    complemento: "A foto é de 1876, do estúdio do fotógrafo Mathew Brady, feita quando D. Pedro II visitou os Estados Unidos. Ela está na Biblioteca do Congresso norte-americano.",
    transicao: "Para entender a queda, primeiro precisamos conhecer o Império no auge. Vamos voltar a 1840."
  },
  imperio: {
    tempo: 80,
    ano: "1840",
    topicos: ["Golpe da Maioridade", "Poder centralizado", "Constituição de 1824", "Sociedade agrária e escravista"],
    fala: "Estamos em julho de 1840. O Brasil é independente há menos de vinte anos e vive um período agitado, com revoltas em várias províncias. Olhem o mapa: um território enorme, com a capital no Rio de Janeiro, chamada de Corte.",
    etapas: [
      "Para acalmar o país, os políticos anteciparam a maioridade do herdeiro: D. Pedro II assumiu o trono com apenas 14 anos. Foi o chamado Golpe da Maioridade, que encerrou o período regencial. Ele foi coroado no ano seguinte, em 1841.",
      "O governo passou a concentrar o poder no Rio de Janeiro. Os presidentes de cada província não eram eleitos: eram nomeados pelo governo central, e a polícia e a Justiça também ficaram sob controle da Corte.",
      "As regras vinham da Constituição de 1824, a primeira do país. Ela criou quatro poderes — Executivo, Legislativo, Judiciário e o Poder Moderador, só do imperador —, um Senado vitalício e o voto censitário, ou seja, só votava quem tinha certa renda.",
      "E a sociedade? Era agrária e escravista. O primeiro censo do país, de 1872, contou 9,9 milhões de habitantes. Desses, 1,5 milhão eram pessoas escravizadas, cerca de 15% da população."
    ],
    hoje: "Ainda temos Senado e Constituição, mas as regras mudaram: hoje os senadores têm mandato de oito anos, e não vitalício, e o voto não depende de renda.",
    complemento: "O período regencial (1831–1840) teve revoltas como a Cabanagem (Pará), a Sabinada (Bahia), a Balaiada (Maranhão) e a Farroupilha (Rio Grande do Sul). A centralização foi uma resposta a elas.",
    transicao: "Por fora, esse Império parecia firme. Mas o que havia por trás da fachada?"
  },
  estabilidade: {
    tempo: 90,
    ano: "1847–1886",
    topicos: ["Dois partidos no poder", "Parlamentarismo às avessas", "Poder Moderador", "O café sustentava tudo", "A escravidão continuava", "Quase ninguém votava"],
    fala: "Vamos olhar o Império de dois jeitos. À esquerda, a fachada: a política, como na pintura em que D. Pedro II abre a Assembleia Geral. À direita, os bastidores: a sociedade que sustentava tudo isso.",
    etapas: [
      "Na política, dois partidos se revezavam no governo: o Liberal e o Conservador. Os dois representavam basicamente os mesmos grupos: grandes proprietários, comerciantes e advogados.",
      "Em 1847 foi criado o cargo de presidente do Conselho de Ministros, uma espécie de primeiro-ministro. Mas era o imperador quem escolhia esse chefe do gabinete — e não a maioria da Câmara, como na Inglaterra. Por isso os historiadores falam em parlamentarismo às avessas.",
      "Tudo isso funcionava graças ao Poder Moderador, que a Constituição chamava de 'a chave de toda a organização política'. Com ele, o imperador podia dissolver a Câmara, convocar novas eleições e escolher os senadores.",
      "Agora os bastidores. Quem pagava a conta era o café: na década de 1880, ele respondia por 61,5% do valor das exportações do Brasil.",
      "E quem colhia o café? Em grande parte, pessoas escravizadas, como as da fotografia de Marc Ferrez, de 1883. A escravidão era a base do trabalho no campo e também nas cidades.",
      "Por fim, quase ninguém participava da política. Depois da Lei Saraiva, de 1881, que exigiu renda comprovada e saber ler, menos de 1% da população votou nas eleições de 1886."
    ],
    hoje: "Hoje o voto é obrigatório para quem sabe ler, dos 18 aos 70 anos, e as pessoas analfabetas podem votar desde 1985. É uma diferença enorme em relação ao Império.",
    complemento: "Os liberais eram chamados de 'luzias' e os conservadores de 'saquaremas'. Uma frase famosa, atribuída a um político da época, dizia que nada se parecia mais com um saquarema do que um luzia no poder. A autoria e a redação exatas da frase são incertas.",
    transicao: "Enquanto a política parecia parada, o país estava mudando depressa. Vamos ver como."
  },
  transformacoes: {
    tempo: 85,
    ano: "1850 → 1889",
    topicos: ["O café avança", "Ferrovias", "Portos e cidades crescem", "Novos grupos, novas pressões"],
    fala: "Agora estamos na segunda metade do século XIX. Olhem o mapa do Sudeste: ele vai mostrando, a cada clique, como o café, os trilhos e as cidades transformaram o Brasil.",
    etapas: [
      "Primeiro, o café se espalhou pelo Vale do Paraíba, ao longo do rio Paraíba do Sul, entre o Rio de Janeiro e São Paulo. Depois, com as terras do Vale cansadas, ele avançou para o Oeste Paulista — a região de Campinas e, mais tarde, de Ribeirão Preto. É a seta vermelha: a chamada marcha do café.",
      "Para levar o café até os portos, vieram as ferrovias. A primeira, inaugurada em 1854 perto do Rio, tinha só 14,5 quilômetros. Em 1889, o país já tinha cerca de 9.500 quilômetros de trilhos. Olhem as linhas douradas ligando as fazendas a Santos e ao Rio.",
      "Os portos de Santos e do Rio cresceram, e as cidades ganharam iluminação a gás, bondes e telégrafo. Em 1874, um cabo submarino passou a ligar o Brasil à Europa: as notícias chegavam em horas, e não em semanas.",
      "Com as cidades, cresceram grupos novos: imigrantes, jornalistas, professores, advogados, engenheiros e militares. Eles tinham pouca voz no sistema político e começaram a pedir mudanças: o fim da escravidão, mais autonomia para as províncias e eleições mais abertas."
    ],
    hoje: "O porto de Santos é hoje o maior da América Latina, e muitas cidades do interior paulista nasceram em volta das estações de trem do café.",
    complemento: "Os traçados das ferrovias no mapa são esquemáticos: ligam as cidades principais na ordem certa, mas não seguem cada curva dos trilhos. A Mogiana, por exemplo, chegou a Ribeirão Preto em 1883.",
    transicao: "Enquanto a economia mudava, o Brasil entrou na maior guerra da sua história. E ela mudou o Exército."
  },
  guerra: {
    tempo: 80,
    ano: "1864 → 1870",
    topicos: ["A Tríplice Aliança", "Um Exército muito maior", "Prestígio militar", "Tensão no pós-guerra"],
    fala: "Vamos a 1864. Na região do rio da Prata começa a Guerra do Paraguai, que vai durar até 1870. A pintura de Pedro Américo mostra a Batalha do Avaí, de 1868. Ela é importante para nós por um motivo: foi ali que o Exército brasileiro mudou.",
    etapas: [
      "Brasil, Argentina e Uruguai formaram a Tríplice Aliança contra o Paraguai, governado por Francisco Solano López. Foi o maior conflito externo da história do Brasil.",
      "O Exército, que era pequeno, precisou crescer muito depressa. Vieram os Voluntários da Pátria, como o soldado da foto, homens recrutados à força e também escravizados libertados para lutar. Estima-se que cerca de 139 mil brasileiros tenham sido mobilizados e cerca de 50 mil tenham morrido — os números variam conforme a fonte.",
      "Com a vitória, os militares voltaram como heróis. Ganharam prestígio e passaram a se ver como um grupo com identidade própria, que tinha defendido a nação.",
      "Mas, depois da guerra, os oficiais se sentiram esquecidos: soldos baixos, promoções lentas e pouco espaço na política. Muitos passaram a desprezar os políticos civis, que chamavam de 'casacas'. A charge de Angelo Agostini, de 1870, mostra outro efeito: um soldado negro volta da guerra e encontra a mãe castigada no tronco. A guerra deixou mais visível a contradição da escravidão."
    ],
    hoje: "Muitas cidades têm ruas e praças com nomes ligados à guerra, como Riachuelo, Tuiuti, Humaitá e Voluntários da Pátria.",
    complemento: "O general e historiador Augusto Tasso Fragoso calculou em cerca de 139 mil o número de mobilizados pelo Império. Grande parte das mortes foi causada por doenças, como o cólera, e não pelos combates.",
    transicao: "Esse Exército fortalecido e insatisfeito é uma das peças da crise. Mas não a única: vamos ver as três grandes questões."
  },
  questoes: {
    tempo: 55,
    ano: "1872 → 1888",
    topicos: ["Questão Religiosa", "Questão Militar", "Questão Abolicionista"],
    fala: "A partir dos anos 1870, três conflitos — que os livros chamam de questões — desgastaram a relação entre o governo e grupos que sempre tinham apoiado o trono. Vamos apresentá-las agora e detalhar cada uma nos próximos slides.",
    etapas: [
      "Primeira: a Questão Religiosa, entre 1872 e 1875. A Igreja Católica entrou em choque com o Estado, e dois bispos acabaram presos.",
      "Segunda: a Questão Militar, entre 1883 e 1887. Oficiais do Exército foram punidos por se manifestar na imprensa e enfrentaram o governo civil.",
      "Terceira: a Questão Abolicionista, que ganhou força nos anos 1880. A luta contra a escravidão dividiu o país e, no fim, afastou os senhores de escravizados da monarquia. Lembrem: nenhuma dessas questões, sozinha, derrubou o Império. O que pesou foi a soma."
    ],
    hoje: "Hoje o Brasil é um Estado laico, os militares da ativa não podem se filiar a partidos e reduzir alguém à condição análoga à de escravo é crime. As três questões ajudam a entender por que essas regras existem.",
    complemento: "O retrato da Questão Religiosa é de D. Antônio de Macedo Costa, bispo do Pará; o da Questão Militar, do tenente-coronel Sena Madureira; e a foto de Marc Ferrez mostra pessoas escravizadas numa fazenda de café, por volta de 1885.",
    transicao: "Vamos começar pela Igreja. Para entender o conflito, precisamos voltar à Constituição de 1824."
  },
  religiosa: {
    tempo: 75,
    ano: "1824 → 1872",
    topicos: ["Religião oficial", "Padroado", "Beneplácito", "Ultramontanismo"],
    fala: "Este livro de capa verde é a Constituição de 1824. Ela dizia como a Igreja e o Estado se relacionavam. No diagrama, vejam os bispos no meio: de um lado, o papa, em Roma; do outro, o imperador. Eles ficaram presos entre duas autoridades.",
    etapas: [
      "Pela Constituição, o catolicismo era a religião oficial do Império. As outras religiões eram toleradas, mas só em culto doméstico, sem templo com forma exterior de igreja.",
      "Pelo padroado, herdado de Portugal, o imperador indicava os bispos e o Estado pagava os padres. Na prática, a Igreja funcionava quase como um setor do governo.",
      "Pelo beneplácito, bulas e ordens do papa só valiam no Brasil se o imperador aprovasse. Ou seja: o papa falava, mas era o imperador quem decidia se valia aqui.",
      "Só que, nessa época, o papa Pio IX liderava um movimento chamado ultramontanismo, que reforçava a autoridade de Roma sobre as igrejas de cada país. Em 1864, o Syllabus condenou várias ideias modernas, entre elas a maçonaria. Bispos formados nessa linha passaram a obedecer ao papa mesmo sem a aprovação do imperador. O choque estava armado."
    ],
    hoje: "A Constituição de 1988 garante a liberdade de crença e proíbe o Estado de financiar cultos ou igrejas (art. 19). O padroado e o beneplácito deixaram de existir com a República.",
    complemento: "'Ultramontano' quer dizer 'além dos montes', ou seja, além dos Alpes, onde fica Roma. O Concílio Vaticano I (1869–1870) proclamou a infalibilidade do papa em matéria de fé.",
    transicao: "Na década de 1870, esse choque deixou de ser teórico. Vamos ver o que aconteceu com os bispos."
  },
  bispos: {
    tempo: 80,
    ano: "1872 → 1875",
    topicos: ["1872", "1872–73", "1873", "1874", "1875", "Consequência"],
    fala: "Conheçam os personagens: à esquerda, D. Vital, bispo de Olinda, e D. Antônio de Macedo Costa, bispo do Pará. À direita, o visconde do Rio Branco, chefe do governo e, ao mesmo tempo, grão-mestre da maçonaria. A linha do tempo mostra o conflito passo a passo.",
    etapas: [
      "Começa em 1872, no Rio de Janeiro. Um padre faz um discurso numa loja maçônica para homenagear o visconde do Rio Branco pela Lei do Ventre Livre, e o bispo do Rio o suspende.",
      "Logo depois, D. Vital e D. Macedo Costa mandam as irmandades religiosas expulsarem seus membros maçons. As que se recusam são interditadas — ficam proibidas de realizar suas atividades religiosas.",
      "Em 1873, as irmandades recorrem ao governo. Como as condenações do papa à maçonaria nunca tinham recebido o beneplácito, o governo manda suspender as punições. Os bispos se recusam a obedecer.",
      "Em 1874, os dois bispos são presos, julgados e condenados a quatro anos de prisão com trabalhos forçados. O imperador troca a pena por prisão simples, mas o estrago já estava feito.",
      "Em setembro de 1875, um novo gabinete, chefiado pelo duque de Caxias, dá anistia aos bispos. A caricatura de Angelo Agostini, de 1876, mostra que o assunto continuou rendendo: o bispo de Olinda suspende um padre que casou um maçom.",
      "A consequência: parte do clero e dos católicos mais fiéis se afastou do trono. A Igreja não virou republicana, mas deixou de defender a monarquia. Foi a primeira coluna a balançar."
    ],
    hoje: "A separação entre Igreja e Estado veio logo no começo da República, com um decreto de janeiro de 1890. Desde então o Brasil é oficialmente laico.",
    complemento: "Irmandades eram associações de fiéis leigos que cuidavam de igrejas, festas e enterros. Muitas tinham membros maçons, o que era comum na elite da época.",
    transicao: "A Igreja se afastou. Agora vamos ao segundo grupo: o Exército."
  },
  militar: {
    tempo: 80,
    ano: "1883 → 1887",
    topicos: ["1883–84", "1886", "1886–87", "1887"],
    fala: "Lembram do Exército que voltou fortalecido da Guerra do Paraguai? Nos anos 1880, ele entrou em choque direto com o governo. Na foto, o marechal Deodoro da Fonseca, que vai ser personagem central até o fim da nossa história.",
    etapas: [
      "Em 1883, o tenente-coronel Sena Madureira contesta uma reforma no fundo de pensões dos militares. Em 1884, recebe com honras o jangadeiro Francisco do Nascimento, herói da abolição no Ceará. É punido e transferido, e um aviso do governo restringe as manifestações de militares na imprensa.",
      "Em 1886, o coronel Cunha Matos responde, pela imprensa, às acusações de um deputado e fica preso por dois dias. No mesmo ano, Sena Madureira escreve no jornal republicano A Federação, de Porto Alegre, e é punido de novo.",
      "Deodoro, que comandava as armas no Rio Grande do Sul, fica do lado dos oficiais e é afastado. Mas a pressão cresce, e em 1887 o governo recua e cancela as punições.",
      "Em 1887, os oficiais fundam o Clube Militar, presidido por Deodoro. Em outubro, o Clube pede à princesa regente que o Exército não seja usado para capturar escravizados fugidos. Os militares já se viam como uma força política."
    ],
    hoje: "O Clube Militar existe até hoje, no Rio de Janeiro. E a Constituição atual proíbe militares da ativa de se filiarem a partidos políticos.",
    complemento: "Os militares falavam muito em 'honra': para eles, ser punido por responder a uma acusação na imprensa era uma humilhação para toda a corporação.",
    transicao: "Mas não foi só insatisfação: uma nova ideia circulava entre os jovens oficiais. Vamos conhecer o positivismo."
  },
  positivismo: {
    tempo: 75,
    ano: "1850 → 1889",
    topicos: ["Auguste Comte", "Escola Militar", "Benjamin Constant", "Ordem e Progresso", "O Exército não era homogêneo"],
    fala: "Este slide mostra o caminho de uma ideia: ela nasce na França, chega a uma escola militar no Rio e termina na nossa bandeira.",
    etapas: [
      "O filósofo francês Auguste Comte criou o positivismo. Para ele, a sociedade deveria ser organizada pela ciência, com ordem e progresso. A frase no alto é a fórmula dele: o amor por princípio, a ordem por base e o progresso por fim.",
      "No Brasil, essas ideias se espalharam entre engenheiros, médicos e, principalmente, alunos da Escola Militar da Praia Vermelha, no Rio de Janeiro, onde se estudava muita matemática e ciência.",
      "O professor Benjamin Constant Botelho de Magalhães virou referência para esses jovens oficiais. Ele ajudou a aproximá-los da ideia de república e participou da articulação do golpe de 1889.",
      "O resultado mais visível está na bandeira: o lema 'Ordem e Progresso', inspirado em Comte, foi colocado na bandeira republicana, adotada em 19 de novembro de 1889, quatro dias depois da Proclamação.",
      "Mas atenção: o Exército não pensava todo igual. Havia monarquistas e republicanos, os 'científicos', formados na escola, e os 'tarimbeiros', formados na tropa. O próprio Deodoro era monarquista e só aderiu à República nos últimos dias da crise."
    ],
    hoje: "O lema continua na bandeira. E no Rio de Janeiro ainda existe o Templo da Humanidade, da Igreja Positivista do Brasil, no bairro da Glória.",
    complemento: "Para muitos positivistas, a república ideal seria uma 'ditadura republicana': um governo forte e técnico, e não necessariamente uma democracia com muitos eleitores.",
    transicao: "Igreja afastada, Exército insatisfeito. Agora vamos à questão que mais mexeu com a sociedade: a escravidão."
  },
  abolicao: {
    tempo: 90,
    ano: "1850 → 1888",
    topicos: ["1850", "1871", "1885", "1888", "A abolição também foi conquistada"],
    fala: "O fim da escravidão no Brasil não aconteceu de uma vez. Foi um caminho de quase quarenta anos, com quatro leis principais. Reparem que cada uma traz também o seu limite.",
    etapas: [
      "1850: a Lei Eusébio de Queirós proíbe o tráfico de africanos escravizados para o Brasil, sob forte pressão da Inglaterra. Mas a escravidão continua, e cresce o tráfico interno, do Nordeste para as fazendas de café do Sudeste.",
      "1871: a Lei do Ventre Livre declara livres os filhos de mulheres escravizadas nascidos a partir dela. O limite: o senhor podia usar o trabalho dessas crianças até os 21 anos.",
      "1885: a Lei dos Sexagenários liberta quem tinha 60 anos ou mais. Mas eles ainda deviam trabalhar até mais três anos, como 'indenização' — e poucos chegavam a essa idade.",
      "1888: a Lei Áurea extingue a escravidão, sem indenização aos proprietários. O limite aqui é o maior de todos: nada foi previsto para integrar as pessoas libertadas.",
      "E um ponto essencial: a abolição não foi um presente. Foi conquistada. As pessoas escravizadas fugiram em massa, formaram quilombos como o do Jabaquara, em Santos, e lutaram na Justiça. Os jangadeiros do Ceará, liderados por Francisco do Nascimento, o Dragão do Mar, se recusaram a transportar escravizados em 1881, e o Ceará e o Amazonas aboliram a escravidão em 1884. Abolicionistas como Luiz Gama, José do Patrocínio, André Rebouças e Joaquim Nabuco levaram a campanha à imprensa, aos tribunais e ao Parlamento."
    ],
    hoje: "Muito do debate atual sobre a memória da escravidão passa pelo 20 de novembro, Dia Nacional de Zumbi e da Consciência Negra, que se tornou feriado nacional a partir de 2024.",
    complemento: "Luiz Gama nasceu livre, foi vendido como escravo pelo próprio pai e, depois de conquistar a liberdade, virou advogado e libertou centenas de pessoas nos tribunais. Ele morreu em 1882, antes da Lei Áurea.",
    transicao: "Vamos agora ao dia em que a última dessas leis foi assinada: 13 de maio de 1888."
  },
  "lei-aurea": {
    tempo: 70,
    ano: "13 de maio de 1888",
    topicos: ["O que a lei fez", "O que ficou de fora"],
    fala: "Esta fotografia de Marc Ferrez mostra a multidão no centro do Rio de Janeiro em 13 de maio de 1888, o dia em que a princesa Isabel assinou a Lei Áurea. A lei tem só dois artigos. O primeiro está aqui, na grafia da época: 'É declarada extincta desde a data desta lei a escravidão no Brazil.'",
    etapas: [
      "A lei libertou cerca de 700 mil pessoas que ainda eram escravizadas. Foi assinada pela princesa Isabel, que governava como regente porque D. Pedro II estava na Europa, tratando da saúde. E veio depois de anos de pressão: campanha abolicionista, fugas em massa e a recusa de parte do Exército em perseguir quem fugia.",
      "Mas o que ficou de fora é tão importante quanto o que a lei fez. Não houve terra, escola nem trabalho garantido para os libertos. Muitos fazendeiros e o próprio governo preferiram contratar imigrantes europeus. O fim da escravidão não significou o fim da desigualdade: o racismo e a exclusão continuaram e deixaram marcas que existem até hoje."
    ],
    hoje: "Desde 2012, a Lei de Cotas reserva vagas nas universidades federais para estudantes de escolas públicas, pretos, pardos e indígenas — uma das políticas criadas para enfrentar desigualdades que vêm desse passado.",
    complemento: "A lei foi aprovada muito rápido pela Câmara e pelo Senado, depois da proposta do gabinete conservador de João Alfredo. Nos dias seguintes houve festas no Rio, incluindo uma missa campal em 17 de maio.",
    transicao: "A abolição foi comemorada nas ruas. Mas um grupo poderoso ficou furioso: os grandes fazendeiros escravistas."
  },
  cafeicultores: {
    tempo: 70,
    ano: "1888 → 1889",
    topicos: ["Vale do Paraíba", "Oeste Paulista", "Republicanos de última hora"],
    fala: "Nem todos os fazendeiros de café eram iguais. Vamos comparar duas regiões que reagiram de jeitos muito diferentes à abolição.",
    etapas: [
      "No Vale do Paraíba ficavam as fazendas mais antigas, como a da fotografia. As terras estavam cansadas, os fazendeiros estavam endividados e dependiam do trabalho escravizado. Eles eram a base tradicional do trono — e queriam indenização pela abolição.",
      "No Oeste Paulista, o café estava em expansão. Os fazendeiros investiam em ferrovias e já usavam trabalhadores imigrantes. Queriam mais autonomia para a província e muitos já eram republicanos desde 1873.",
      "Quando a Lei Áurea saiu sem indenização, muitos ex-senhores do Vale se sentiram traídos pela Coroa e passaram a apoiar a República. Por isso ganharam o apelido de 'republicanos de última hora', ou 'republicanos do 14 de maio': aderiram mais por raiva da monarquia do que por convicção. A monarquia perdia, assim, a terceira coluna."
    ],
    hoje: "Várias fazendas do Vale do Paraíba hoje são patrimônio histórico e roteiro turístico. Algumas já contam também a história das pessoas escravizadas que trabalharam nelas.",
    complemento: "Uma frase atribuída ao barão de Cotegipe — 'a senhora acaba de redimir uma raça e perder o trono' — costuma ser citada, mas não há registro documental seguro de que ele a tenha dito. Os historiadores também lembram que a adesão desses fazendeiros engrossou a oposição, mas quem derrubou o governo, em 1889, foram militares.",
    transicao: "Com tanta gente insatisfeita, uma ideia que existia havia quase vinte anos ganhou força: a República."
  },
  republicanismo: {
    tempo: 75,
    ano: "1870 → 1889",
    topicos: ["1870", "1873", "Anos 1880", "O que defendiam e quem apoiava"],
    fala: "Este jornal se chama A República, e seu primeiro número, de 3 de dezembro de 1870, trouxe o Manifesto Republicano. A frase em destaque é do manifesto: 'Somos da América e queremos ser americanos.' A ideia era que o Brasil era a única monarquia num continente de repúblicas.",
    etapas: [
      "1870: o Manifesto Republicano é publicado no Rio de Janeiro. Ele defendia a federação e criticava a centralização e o Poder Moderador.",
      "1873: na Convenção de Itu, em São Paulo, nasce o Partido Republicano Paulista, apoiado por cafeicultores do Oeste Paulista.",
      "Nos anos 1880, clubes, jornais e comícios republicanos se espalham. A campanha abolicionista e a Questão Militar dão ainda mais força às críticas ao Império. Mesmo assim, os republicanos ainda eram minoria no Parlamento.",
      "O que eles defendiam? Federalismo, ou seja, autonomia para as províncias; o fim do Poder Moderador e do Senado vitalício; e um chefe de Estado eleito. Quem apoiava? Cafeicultores paulistas, jornalistas, advogados e professores das cidades, militares positivistas e, depois de 1888, ex-escravistas. Grupos diferentes, com motivos diferentes, mas com o mesmo alvo."
    ],
    hoje: "O federalismo defendido em 1870 está na Constituição de hoje: cada estado tem governador eleito, assembleia e leis próprias.",
    complemento: "A redação do Manifesto Republicano é atribuída principalmente ao jornalista Quintino Bocaiúva, que depois foi ministro do Governo Provisório.",
    transicao: "Agora podemos juntar todas as peças. Como ficou o Império em 1889?"
  },
  isolamento: {
    tempo: 70,
    ano: "1889",
    topicos: ["Três colunas", "Igreja", "Exército", "Elites agrárias", "E o futuro?"],
    fala: "Pensem no Império como um templo sustentado por colunas. Ao fundo, a pintura do último grande baile da monarquia, na Ilha Fiscal, em 9 de novembro de 1889 — seis dias antes do fim.",
    etapas: [
      "Três grupos sustentavam o trono: a Igreja, o Exército e as elites agrárias. A cada clique, vamos ver uma coluna romper.",
      "A Igreja se afastou com a Questão Religiosa e a prisão dos bispos, em 1874.",
      "O Exército, insatisfeito desde a guerra, enfrentou o governo na Questão Militar e se aproximou da República. O Clube Militar nasceu em 1887.",
      "As elites agrárias escravistas romperam com a Coroa depois da Lei Áurea, em 1888, porque não houve indenização.",
      "E havia ainda a dúvida sobre o futuro. D. Pedro II, com 63 anos, estava doente. A herdeira, a princesa Isabel, e o marido dela, o francês conde d'Eu, despertavam desconfiança. Muitos políticos não queriam um 'Terceiro Reinado'. Sem as colunas, o templo estava pronto para cair."
    ],
    hoje: "A Ilha Fiscal, onde foi o último baile, hoje pode ser visitada: faz parte do espaço cultural da Marinha no Rio de Janeiro.",
    complemento: "A pintura de Aurélio de Figueiredo é de 1905 e se chama 'A ilusão do Terceiro Reinado'. O título já é uma interpretação: a de uma monarquia que dançava sem perceber a própria crise.",
    transicao: "Seis dias depois do baile, a madrugada de 15 de novembro mudou o Brasil."
  },
  proclamacao: {
    tempo: 85,
    ano: "15 de novembro de 1889",
    topicos: ["Madrugada", "Manhã", "Tarde", "Noite"],
    fala: "Estamos no Rio de Janeiro, em 15 de novembro de 1889. Na véspera, oficiais republicanos espalharam o boato de que o governo ia prender Deodoro e Benjamin Constant, e isso acelerou tudo. A pintura de Benedito Calixto, feita em 1893, mostra as tropas no Campo de Santana. Vamos acompanhar o dia hora a hora.",
    etapas: [
      "De madrugada, tropas que estavam em São Cristóvão, articuladas por oficiais republicanos e por Benjamin Constant, marcham para o Campo de Santana, no centro do Rio.",
      "De manhã, Deodoro — que estava doente — assume o comando e entra no Quartel-General do Exército, onde estavam o visconde de Ouro Preto e seus ministros. O gabinete é deposto e Ouro Preto é preso. Até hoje os historiadores discutem se, naquela manhã, Deodoro queria derrubar só o gabinete ou a própria monarquia.",
      "À tarde, na Câmara Municipal do Rio, vereadores liderados por José do Patrocínio declaram a República.",
      "À noite, forma-se o Governo Provisório, chefiado por Deodoro, com nomes como Benjamin Constant, Rui Barbosa, Quintino Bocaiúva e Aristides Lobo. O Decreto nº 1 adota a República Federativa. E a população? Não foi chamada a participar das decisões."
    ],
    hoje: "O 15 de novembro é feriado nacional. E o Campo de Santana, onde tudo aconteceu, fica hoje na Praça da República, no centro do Rio de Janeiro.",
    complemento: "O Governo Provisório tinha Deodoro como chefe; Benjamin Constant na Guerra; Quintino Bocaiúva nas Relações Exteriores; Rui Barbosa na Fazenda; Aristides Lobo no Interior; Campos Sales na Justiça; Eduardo Wandenkolk na Marinha; e Demétrio Ribeiro na Agricultura.",
    transicao: "E o imperador? Vamos ver o que aconteceu com D. Pedro II e a família imperial."
  },
  exilio: {
    tempo: 80,
    ano: "1889 → 1891",
    topicos: ["16 nov. 1889", "17 nov. 1889", "7 dez. 1889", "5 dez. 1891", "Aristides Lobo"],
    fala: "Esta é uma das últimas fotos da família imperial no Brasil, de 1889. Ao centro, D. Pedro II. Com a República, terminavam 67 anos de Império e 49 anos de Segundo Reinado.",
    etapas: [
      "Em 16 de novembro, o Governo Provisório comunica ao imperador que a família deve deixar o país.",
      "Na madrugada de 17 de novembro, D. Pedro II e a família embarcam rumo à Europa, primeiro no cruzador Parnaíba e depois no navio Alagoas.",
      "Em 7 de dezembro, chegam a Lisboa. A imperatriz Teresa Cristina morre poucas semanas depois, no Porto, em 28 de dezembro de 1889.",
      "D. Pedro II morre em Paris, no exílio, em 5 de dezembro de 1891.",
      "E o povo? Aristides Lobo, republicano e ministro do Governo Provisório, escreveu que 'o povo assistiu àquilo bestializado, atônito, surpreso, sem conhecer o que significava'. A frase mostra que a mudança foi feita por militares e políticos. Mas o historiador José Murilo de Carvalho, no livro Os bestializados, lembra que a população do Rio não era apática: participava de festas, associações e revoltas. O problema é que estava fora da política oficial, reservada a poucos eleitores."
    ],
    hoje: "Os restos mortais de D. Pedro II e da imperatriz voltaram ao Brasil em 1921 e estão, desde 1939, na Catedral de Petrópolis.",
    complemento: "Lobo publicou o texto no Diário Popular, de São Paulo, em 18 de novembro de 1889. Ele também escreveu que muitos acreditaram estar vendo apenas uma parada militar.",
    transicao: "Agora podemos responder à pergunta do começo: por que a monarquia caiu?"
  },
  conclusao: {
    tempo: 75,
    ano: "1889 → hoje",
    topicos: ["Crise religiosa", "Questão Militar", "Abolição da escravidão", "Perda dos cafeicultores escravistas", "Avanço republicano", "Isolamento político", "Frase final"],
    fala: "Vamos voltar à pergunta da abertura. A resposta não está em uma causa só, mas na soma de seis fatores.",
    etapas: [
      "Primeiro, a crise religiosa, de 1872 a 1875, afastou parte da Igreja.",
      "Segundo, a Questão Militar, de 1883 a 1887, colocou o Exército contra o governo civil.",
      "Terceiro, a abolição da escravidão, em 1888, sem nenhuma indenização.",
      "Quarto, a perda dos cafeicultores escravistas, os 'republicanos de última hora'.",
      "Quinto, o avanço republicano, desde o manifesto de 1870 até os clubes e jornais dos anos 1880.",
      "Sexto, o isolamento político: em 1889, sem Igreja, sem Exército e sem parte das elites, a monarquia caiu por um golpe militar, quase sem resistência.",
      "Por isso, a nossa frase final: a monarquia não caiu por uma única crise. Caiu quando perdeu o apoio dos principais grupos que sustentavam seu poder. As referências e os créditos das imagens estão no botão abaixo. Obrigado!"
    ],
    hoje: "A frase de Aristides Lobo deixa uma pergunta para hoje: quem participa das grandes decisões do país? Em 1889, quase ninguém votava. Hoje, mais de 150 milhões de pessoas podem votar.",
    complemento: "Se perguntarem sobre o que veio depois: a República de 1889 começou com governos militares (Deodoro e Floriano) e manteve a participação popular limitada. Esse é o tema da Primeira República.",
    transicao: "Encerramento. Abrir para perguntas."
  }
};
