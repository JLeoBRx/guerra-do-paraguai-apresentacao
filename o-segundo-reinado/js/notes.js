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
    fala: "Boa tarde. Hoje vamos fazer uma viagem ao Brasil do século XIX, quando o país era uma monarquia. De 1840 a 1889, quase meio século, quem governou foi D. Pedro II. Nesse tempo o Brasil se manteve unido, enriqueceu com o café, ganhou ferrovias, lutou a maior guerra da América do Sul e, só no fim, aboliu a escravidão. É esse período inteiro, o Segundo Reinado, que vamos contar.",
    hoje: "Muitas das nossas ruas, praças e cidades têm nomes desse tempo: Pedro II, Teresina (homenagem à imperatriz Teresa Cristina), Caxias, Mauá, Rio Branco.",
    complemento: "A pintura é um estudo de Manuel de Araújo Porto-Alegre para a coroação de D. Pedro II, em 18 de julho de 1841. É uma representação artística da cerimônia, não uma fotografia: a fotografia mal tinha chegado ao Brasil.",
    transicao: "Mas, antes de o Segundo Reinado começar, o país quase se dividiu. Vamos voltar a 1831."
  },
  regencias: {
    tempo: 80,
    ano: "1831–1840",
    topicos: ["Regências (1831)", "Cabanagem", "Farroupilha", "Sabinada", "Balaiada"],
    fala: "Estamos em 7 de abril de 1831. D. Pedro I abdica do trono e volta para Portugal. O herdeiro, Pedro, tem só 5 anos. Pela Constituição, ele não pode governar até ficar adulto. Olhem o mapa: um território enorme, com a capital no Rio de Janeiro.",
    etapas: [
      "Começa então o período regencial: o país é governado por regentes, em nome do menino imperador. Um deles foi o padre Diogo Antônio Feijó, regente de 1835 a 1837. Sem um imperador adulto, as disputas entre as elites e entre as províncias aumentaram.",
      "No Pará explode a Cabanagem, de 1835 a 1840. Participaram indígenas, negros e mestiços pobres, os cabanos, e também parte da elite local. Os rebeldes chegaram a tomar Belém. Foi uma das revoltas mais sangrentas da nossa história.",
      "No Rio Grande do Sul começa a Farroupilha, em 1835. Os estancieiros gaúchos reclamavam dos impostos sobre o charque e da falta de autonomia, e chegaram a proclamar uma república separada. Foi a revolta mais longa: durou dez anos, até 1845.",
      "Na Bahia, a Sabinada, de 1837 a 1838, tomou Salvador e declarou a província separada até a maioridade do imperador. Foi derrotada em poucos meses.",
      "No Maranhão, a Balaiada, de 1838 a 1841, reuniu vaqueiros, camponeses pobres e escravizados fugidos. Com tantas revoltas ao mesmo tempo, muita gente na Corte passou a temer que o Brasil se dividisse em vários países, como tinha acontecido com a América espanhola."
    ],
    hoje: "A Revolução Farroupilha ainda é lembrada todo 20 de setembro no Rio Grande do Sul, e a bandeira do estado vem da república farroupilha.",
    complemento: "Em 1835, também em Salvador, houve a Revolta dos Malês, de africanos escravizados e libertos, muitos deles muçulmanos. Ela foi reprimida em poucas horas, mas assustou muito as elites escravistas.",
    transicao: "Para acabar com essa instabilidade, os políticos tiveram uma ideia: colocar logo o menino no trono."
  },
  maioridade: {
    tempo: 70,
    ano: "1840–1841",
    topicos: ["Medo da desordem", "Clube da Maioridade", "23 de julho de 1840", "Coroação, julho de 1841"],
    fala: "Estamos em julho de 1840. Este é o retrato de D. Pedro II pintado naquele ano, por Claude Joseph Barandier. Ele tem 14 anos.",
    etapas: [
      "As elites estavam assustadas. Revoltas em várias províncias, regentes sem autoridade, disputas no Parlamento. Muitos achavam que só um imperador no trono traria ordem e manteria o país unido.",
      "A Constituição dizia que o imperador era menor até os 18 anos. Mas os liberais criaram o Clube da Maioridade e fizeram campanha para antecipar a maioridade. Era também uma jogada política: com o imperador no trono, eles esperavam voltar ao governo.",
      "No dia 23 de julho de 1840, o Parlamento declarou D. Pedro II maior de idade, aos 14 anos. Por isso o episódio ficou conhecido como Golpe da Maioridade: a regra da Constituição foi passada por cima com o apoio de quase todos.",
      "A coroação aconteceu um ano depois, em 18 de julho de 1841, com uma cerimônia grandiosa no Rio de Janeiro. Começava de fato o Segundo Reinado, que ia durar 49 anos."
    ],
    hoje: "A ideia de que a regra pode ser contornada quando há acordo entre os poderosos aparece em vários momentos da nossa história. Vale perguntar: quem decidiu, e quem ficou de fora da decisão?",
    complemento: "Nos primeiros anos, o jovem imperador tinha pouca experiência, e o governo ficou nas mãos de políticos próximos da Corte. Ele foi ganhando autoridade aos poucos, ao longo da década de 1840.",
    transicao: "Mas quem era esse menino que virou imperador?"
  },
  imperador: {
    tempo: 80,
    ano: "1825–1891",
    topicos: ["Criado para reinar", "Família", "Ciência e fotografia", "Viagens", "Uma imagem construída"],
    fala: "Esta foto é de 1876. D. Pedro II tem 50 anos e está nos Estados Unidos. Vamos conhecer o homem que governou o Brasil por quase meio século.",
    etapas: [
      "Pedro nasceu em 2 de dezembro de 1825, no Rio de Janeiro. Perdeu a mãe, a imperatriz Leopoldina, com 1 ano, e o pai abdicou quando ele tinha 5. Foi criado por tutores, com uma rotina rígida de estudos, para ser imperador.",
      "Em 1843 casou-se com Teresa Cristina, princesa de Nápoles. Tiveram quatro filhos, mas os dois meninos morreram pequenos. A herdeira passou a ser a princesa Isabel, que mais tarde assinaria leis importantes como regente.",
      "Ele gostava de estudar línguas, astronomia e ciências. Em 1840, com 14 anos, comprou um daguerreótipo, uma das primeiras máquinas fotográficas, e se tornou um grande colecionador de fotografias. Também frequentava e apoiava o Instituto Histórico e Geográfico Brasileiro, o IHGB.",
      "Viajou muito: Europa e Egito em 1871, Estados Unidos em 1876, onde visitou a Exposição do Centenário, na Filadélfia. Enquanto viajava, quem governava como regente era a princesa Isabel.",
      "Aqui vai uma interpretação dos historiadores, como Lilia Schwarcz: a imagem de rei sábio, simples e amigo da ciência foi também construída de propósito. Retratos, fotos e viagens ajudavam a mostrar a monarquia como moderna e civilizada, num país que ainda mantinha a escravidão."
    ],
    hoje: "Políticos de hoje também constroem uma imagem pública, com fotos e redes sociais. Pensar em como a imagem de D. Pedro II foi construída ajuda a ler essas imagens com mais atenção.",
    complemento: "A coleção de fotografias de D. Pedro II, com milhares de imagens, foi doada por ele à Biblioteca Nacional e hoje é uma das fontes mais importantes para estudar o Brasil do século XIX.",
    transicao: "Esse imperador tinha um poder especial, previsto na Constituição. Vamos ver como funcionava o governo."
  },
  governo: {
    tempo: 80,
    ano: "1824–1889",
    topicos: ["Poder Moderador: o imperador", "Executivo", "Legislativo", "Judiciário", "Conselho de Estado e presidente do Conselho"],
    fala: "A Constituição de 1824, a primeira do Brasil, valeu durante todo o Império. Ela dividia o poder de um jeito diferente: em vez de três poderes, eram quatro. Vamos montar esse esquema.",
    etapas: [
      "No topo, o Poder Moderador, exercido só pelo imperador. Com ele, D. Pedro II podia nomear e demitir ministros, escolher senadores, dissolver a Câmara dos Deputados e convocar novas eleições. Era o poder que ficava acima dos outros.",
      "O Poder Executivo também tinha o imperador como chefe, junto com os ministros. Eram eles que governavam o país no dia a dia.",
      "O Legislativo era a Assembleia Geral: a Câmara, com deputados eleitos, e o Senado, com senadores vitalícios, escolhidos pelo imperador a partir de uma lista de três nomes mais votados.",
      "O Judiciário tinha juízes e tribunais. Os juízes eram nomeados pelo imperador, que pelo Poder Moderador podia até suspendê-los.",
      "Em 1841, foi recriado o Conselho de Estado, que aconselhava o imperador. Em 1847, surgiu o cargo de presidente do Conselho de Ministros, uma espécie de primeiro-ministro. Mas quem escolhia o presidente do Conselho era o imperador. Por isso os historiadores falam em parlamentarismo às avessas: na Inglaterra, quem formava o governo era a maioria do Parlamento; aqui, o imperador escolhia o governo e, se preciso, dissolvia a Câmara para conseguir uma maioria."
    ],
    hoje: "Hoje temos três poderes e um presidente eleito pelo voto direto. O Poder Moderador acabou com a República, em 1889.",
    complemento: "A pintura é de Pedro Américo, de 1872: mostra a Fala do Trono, cerimônia em que o imperador abria os trabalhos do Parlamento lendo um discurso.",
    transicao: "Se o imperador escolhia quem governava, quem disputava o governo? Os partidos."
  },
  partidos: {
    tempo: 75,
    ano: "1840–1889",
    topicos: ["Os luzias (liberais)", "Os saquaremas (conservadores)", "Na prática, parecidos", "Conciliação (1853–1856)"],
    fala: "Durante todo o Segundo Reinado, dois partidos se revezaram no governo. Ao fundo, uma composição de 1866 com os deputados ao redor do imperador.",
    etapas: [
      "De um lado, o Partido Liberal. Seus membros ganharam o apelido de luzias por causa de Santa Luzia, em Minas Gerais, onde os liberais revoltados foram derrotados em 1842. Em geral, defendiam mais autonomia para as províncias.",
      "Do outro, o Partido Conservador, os saquaremas. O apelido vem de Saquarema, no Rio de Janeiro, onde um dos líderes do partido tinha fazenda. Defendiam o poder concentrado no Rio de Janeiro e a ordem. O historiador Ilmar de Mattos chama esse período de tempo saquarema, porque as ideias conservadoras deram o tom do Império.",
      "Mas, na prática, os dois partidos eram parecidos: reuniam grandes proprietários, comerciantes e bacharéis, e nenhum queria acabar com a escravidão naquela época. Havia um ditado, atribuído ao político pernambucano Holanda Cavalcanti, segundo o qual nada se parecia mais com um saquarema do que um luzia no poder. As palavras exatas mudam conforme a fonte, mas a ideia é essa.",
      "Entre 1853 e 1856, o marquês de Paraná chefiou o Gabinete da Conciliação, com nomes dos dois partidos. Foi um período de calma política, que mostra como as diferenças entre eles eram menores do que parecia."
    ],
    hoje: "Ainda hoje se discute se os partidos têm ideias realmente diferentes ou se mudam de posição quando chegam ao poder. A crítica dos luzias e saquaremas tem quase duzentos anos.",
    complemento: "Nos anos 1860, liberais e conservadores moderados formaram a Liga Progressista. Em 1870, um grupo de liberais radicais rompeu com a monarquia e lançou o Manifesto Republicano.",
    transicao: "E quem escolhia os deputados desses partidos? Vamos ver quem podia votar."
  },
  eleicoes: {
    tempo: 75,
    ano: "1840–1886",
    topicos: ["Voto pela renda", "Eleição em dois graus", "Eleições do cacete", "Lei Saraiva (1881)"],
    fala: "No Império havia eleições para a Câmara. Mas quem podia votar?",
    etapas: [
      "O voto era censitário: só votava quem tinha uma renda mínima. E só homens livres. Mulheres e escravizados nunca votaram no Império. Mesmo assim, como a renda exigida era baixa, muita gente pobre conseguia votar: segundo José Murilo de Carvalho, em 1872 havia mais de 1 milhão de votantes, cerca de um em cada dez brasileiros. Olhem a barra: ela representa toda a população.",
      "A eleição era em dois graus: os votantes escolhiam os eleitores, que tinham renda mais alta, e só esses eleitores escolhiam os deputados.",
      "As eleições eram marcadas por fraude, pressão dos fazendeiros e violência. As de 1840, logo depois da maioridade, ficaram conhecidas como eleições do cacete, pela pancadaria usada para garantir a vitória do governo.",
      "Em 1881, a Lei Saraiva criou o voto direto e tentou acabar com as fraudes. Mas passou a exigir comprovação de renda mais rígida e que os novos eleitores soubessem ler e escrever, num país em que a grande maioria era analfabeta. Resultado: o número de votantes despencou. Em 1886, só 0,8% da população votou para a Câmara. Vejam como a segunda barra é minúscula."
    ],
    hoje: "Hoje o voto é universal: analfabetos podem votar desde 1985, e mulheres desde 1932. Comparar com o Império mostra como a cidadania foi conquistada aos poucos.",
    complemento: "A Lei Saraiva também criou o título de eleitor. Os números de 1872 e de 1886 estão em José Murilo de Carvalho, Cidadania no Brasil.",
    transicao: "Enquanto isso, nas províncias, ainda havia revoltas. O governo precisava pacificá-las."
  },
  pacificacao: {
    tempo: 70,
    ano: "1842–1850",
    topicos: ["Revoltas liberais (1842)", "Fim da Farroupilha (1845)", "Praieira (1848–1850)", "Caxias, o pacificador"],
    fala: "A maioridade não acabou de uma vez com as revoltas. Nos anos 1840, o governo imperial teve que enfrentar mais algumas. Vejam no mapa.",
    etapas: [
      "Em 1842, os liberais de São Paulo e de Minas Gerais se revoltaram contra os conservadores, que tinham voltado ao poder e aprovado leis centralizadoras. Começou em Sorocaba e em Barbacena e terminou com a derrota liberal em Santa Luzia, em agosto. Daí o apelido luzias.",
      "No Sul, a Farroupilha finalmente terminou em 1845, com o acordo de Ponche Verde. Os rebeldes foram anistiados e muitos oficiais farroupilhas entraram para o Exército imperial. O governo preferiu negociar para não perder a província, vizinha do Uruguai e da Argentina.",
      "Em Pernambuco, entre 1848 e 1850, aconteceu a Revolução Praieira, liderada por liberais ligados ao jornal Diário Novo, cuja sede ficava na Rua da Praia, no Recife. Foi a última grande revolta provincial do Império.",
      "Por trás de quase todas essas vitórias do governo estava um militar: Luís Alves de Lima e Silva. Ele reprimiu a Balaiada, entre 1840 e 1841, as revoltas de 1842 e negociou o fim da Farroupilha. Ganhou os títulos de barão, conde, marquês e, em 1869, duque de Caxias, o único duque do Império."
    ],
    hoje: "Caxias é o patrono do Exército brasileiro, e o Dia do Soldado, 25 de agosto, é a data do seu nascimento. Os historiadores lembram que a pacificação também foi feita com repressão violenta.",
    complemento: "A partir de 1850, o Império viveu um período de estabilidade política que durou cerca de vinte anos. Esse é o apogeu do Segundo Reinado.",
    transicao: "Com o país em paz, a economia podia crescer. E ela cresceu com um produto: o café."
  },
  cafe: {
    tempo: 75,
    ano: "1830–1889",
    topicos: ["Vale do Paraíba", "Rumo ao Oeste Paulista", "Ferrovias e portos", "Peso nas exportações"],
    fala: "Este mapa mostra o Sudeste, entre o Rio de Janeiro e São Paulo. Foi aqui que nasceu a riqueza do Império.",
    etapas: [
      "O café se espalhou primeiro pelo Vale do Paraíba, ao longo do rio Paraíba do Sul, entre 1830 e 1870. Eram grandes fazendas, os barões do café, com trabalho de pessoas escravizadas, como mostra esta foto de Marc Ferrez.",
      "Com o tempo, as terras do Vale se esgotaram. O café avançou para o Oeste Paulista, região de terra roxa, muito fértil, perto de Campinas e Ribeirão Preto. Lá, nas últimas décadas do Império, os fazendeiros passaram a usar cada vez mais imigrantes.",
      "Para levar o café até os navios, foram construídas ferrovias. O café descia de trem até os portos de Santos e do Rio de Janeiro e seguia para a Europa e os Estados Unidos.",
      "O café virou o motor da economia. Segundo os dados reunidos por Boris Fausto, ele representava 41% das exportações na década de 1840 e chegou a 61,5% na década de 1880."
    ],
    hoje: "O Brasil continua sendo o maior produtor de café do mundo. E muitas cidades do interior paulista nasceram em volta de estações de trem do café.",
    complemento: "As fazendas do Vale do Paraíba ainda existem como casarões e museus, em cidades como Vassouras e Bananal, e mostram a riqueza dos barões do café.",
    transicao: "Mas quem trabalhava nesses cafezais? Precisamos falar da escravidão e do tráfico."
  },
  trafico: {
    tempo: 85,
    ano: "1831–1872",
    topicos: ["Proibido só no papel", "Bill Aberdeen (1845)", "Lei Eusébio de Queirós (1850)", "Tráfico interno", "1,5 milhão em 1872"],
    fala: "Esta gravura de Rugendas, de cerca de 1830, mostra o porão de um navio negreiro, visto por um viajante europeu. Durante séculos, milhões de africanos foram trazidos à força para o Brasil.",
    etapas: [
      "Em 1831, uma lei proibiu o tráfico de africanos para o Brasil. Mas ela não foi cumprida: os navios continuaram chegando escondidos, e centenas de milhares de pessoas foram trazidas ilegalmente. Segundo a explicação mais conhecida, daí vem a expressão popular para inglês ver.",
      "A Inglaterra, que já tinha abolido o tráfico, pressionava o Brasil. Em 1845, o Parlamento britânico aprovou o Bill Aberdeen, que autorizava a Marinha inglesa a apreender navios negreiros, até em águas brasileiras.",
      "Sob essa pressão, e com medo de um conflito com a Inglaterra, o governo aprovou em 4 de setembro de 1850 a Lei Eusébio de Queirós, que acabou de vez com o tráfico africano. Desta vez a lei foi aplicada.",
      "Mas a escravidão continuou. Como não chegavam mais africanos, os fazendeiros do café passaram a comprar escravizados de outras províncias, sobretudo do Norte e do Nordeste. É o tráfico interprovincial.",
      "Em 1872, o censo ainda contava 1,5 milhão de pessoas escravizadas. Elas trabalhavam no campo e nas cidades, como os escravos de ganho, que faziam serviços na rua e entregavam parte do pagamento ao senhor, como o homem desta foto de Christiano Júnior, de 1865. E resistiam: com fugas, quilombos e compra da liberdade."
    ],
    hoje: "O Cais do Valongo, no Rio de Janeiro, onde desembarcaram centenas de milhares de africanos escravizados, é hoje Patrimônio Mundial da Unesco, como lugar de memória.",
    complemento: "O fim do tráfico liberou muito dinheiro que antes era usado para comprar pessoas. Parte dele foi para outros negócios, como veremos no slide da era Mauá.",
    transicao: "No mesmo mês da Lei Eusébio de Queirós, outra lei mudou o Brasil: a Lei de Terras."
  },
  terras: {
    tempo: 80,
    ano: "1847–1888",
    topicos: ["Lei de Terras (1850)", "Quem ficou de fora", "Parceria (1847)", "Revolta de Ibicaba (1856–1857)", "Imigração paga (anos 1880)"],
    fala: "Reparem nas datas no quadro: 4 de setembro de 1850, fim do tráfico; 18 de setembro de 1850, Lei de Terras. Duas semanas de diferença.",
    etapas: [
      "A Lei de Terras determinou que as terras públicas só poderiam ser obtidas por compra, e não mais por simples ocupação. A terra ficou cara.",
      "Quem perdeu com isso? Os posseiros pobres, os libertos e, no futuro, os imigrantes: sem dinheiro, eles não conseguiam comprar terra e tinham que trabalhar nas fazendas dos outros. Muitos historiadores leem as duas leis de 1850 juntas: acabava o tráfico, mas a terra continuava nas mãos dos grandes proprietários.",
      "Os fazendeiros começaram a testar o trabalho livre. Em 1847, o senador Vergueiro trouxe colonos alemães e suíços para a fazenda Ibicaba, em Limeira, no sistema de parceria: o colono cuidava dos pés de café e dividia o lucro com o fazendeiro.",
      "Mas os colonos chegavam já endividados com a viagem, e as dívidas só cresciam. Em 1856 e 1857, eles se revoltaram em Ibicaba, liderados pelo professor suíço Thomas Davatz, que depois escreveu um livro denunciando o sistema.",
      "Nos anos 1880, com a abolição se aproximando, o governo de São Paulo passou a pagar a viagem dos imigrantes, principalmente italianos. Eles eram recebidos na Hospedaria dos Imigrantes, no Brás. Esta é uma página do livro de matrícula da Hospedaria, de abril de 1888."
    ],
    hoje: "A concentração de terras no Brasil, que vem desse período, ainda é um tema atual nos debates sobre reforma agrária. E milhões de brasileiros hoje descendem dos imigrantes que chegaram nessa época.",
    complemento: "O prédio da Hospedaria dos Imigrantes, em São Paulo, hoje é o Museu da Imigração, que guarda esses livros de registro.",
    transicao: "Enquanto isso, nas cidades, o Brasil começava a se modernizar."
  },
  maua: {
    tempo: 75,
    ano: "1844–1889",
    topicos: ["Tarifa Alves Branco (1844)", "Dinheiro livre após 1850", "Barão de Mauá", "Telégrafo e cabo submarino", "Ferrovias: 9.583 km"],
    fala: "Esta foto de Marc Ferrez, de 1870, mostra a ferrovia Santos–São Paulo subindo a serra. Vamos ver como o Império se modernizou.",
    etapas: [
      "Em 1844, a Tarifa Alves Branco aumentou os impostos sobre os produtos importados. O objetivo principal era arrecadar mais, mas ela também deixou os importados mais caros e estimulou algumas fábricas no Brasil.",
      "Depois de 1850, com o fim do tráfico, o dinheiro que antes era usado para comprar pessoas escravizadas passou a procurar outros negócios: bancos, comércio, transportes.",
      "O maior símbolo dessa época foi Irineu Evangelista de Sousa, o barão e depois visconde de Mauá. Ele criou um estaleiro em Niterói, bancos, a iluminação a gás do Rio de Janeiro e, em 1854, a primeira ferrovia do Brasil, com 14,5 km. Mas ele dependia do governo e acabou falindo em 1875.",
      "As comunicações também mudaram. O telégrafo chegou na década de 1850, e em 1874 um cabo submarino ligou o Brasil à Europa: uma notícia que levava semanas de navio passou a chegar em horas.",
      "E as ferrovias se espalharam: de 14,5 km em 1854 para 9.583 km em 1889, quase todas ligadas ao café."
    ],
    hoje: "A Praça Mauá, no Rio de Janeiro, e várias cidades e ruas com o nome de Mauá lembram o empresário. Muitas das antigas linhas de trem do Império hoje estão abandonadas ou viraram linhas de carga.",
    complemento: "A primeira locomotiva do Brasil se chamava Baroneza, em homenagem à esposa de Mauá. Ela está preservada no Rio de Janeiro.",
    transicao: "O Império não queria só ferrovias. Queria também uma cultura que mostrasse o Brasil como nação."
  },
  cultura: {
    tempo: 80,
    ano: "1843–1881",
    topicos: ["Indianismo", "Victor Meirelles", "Carlos Gomes", "Machado de Assis", "O imperador mecenas"],
    fala: "Ao fundo, a pintura Iracema, de José Maria de Medeiros, inspirada no romance de José de Alencar. No Segundo Reinado, artistas e escritores tentaram responder a uma pergunta: o que é ser brasileiro?",
    etapas: [
      "Na literatura, o Romantismo escolheu o indígena como herói nacional. É o indianismo: Gonçalves Dias escreveu a Canção do exílio em 1843, e José de Alencar publicou O Guarani, em 1857, e Iracema, em 1865. Era um indígena idealizado, bem diferente dos povos indígenas reais, que perdiam suas terras.",
      "Na pintura, a Academia Imperial de Belas Artes formou pintores de temas históricos. Victor Meirelles pintou a Primeira Missa no Brasil, em 1860: uma cena de 1500 imaginada no século XIX.",
      "Na música, Carlos Gomes estudou na Itália com apoio do imperador e estreou a ópera Il Guarany, baseada no livro de Alencar, no Teatro alla Scala, em Milão, em 1870.",
      "E no fim do período aparece Machado de Assis, que publicou Memórias póstumas de Brás Cubas em 1881. Com ironia, ele criticou a elite do Império. A foto mostra Machado aos 25 anos, em 1864.",
      "D. Pedro II apoiava tudo isso: dava bolsas, prêmios e frequentava o Instituto Histórico. Segundo Lilia Schwarcz, arte e história ajudavam a construir uma imagem do Brasil como nação civilizada. É uma interpretação: a cultura também servia à política."
    ],
    hoje: "Machado de Assis é considerado por muitos o maior escritor brasileiro, e Iracema e O Guarani ainda são leituras escolares. A Primeira Missa no Brasil aparece em quase todos os livros didáticos.",
    complemento: "Machado de Assis foi um dos fundadores da Academia Brasileira de Letras, em 1897, já na República, e foi seu primeiro presidente.",
    transicao: "Fora do país, o Império também queria mostrar força. Vamos para o Rio da Prata."
  },
  prata: {
    tempo: 75,
    ano: "1851–1865",
    topicos: ["Rios e fronteiras", "Contra Oribe e Rosas", "Questão Christie", "Intervenção no Uruguai"],
    fala: "Este mapa mostra a bacia do Rio da Prata, com os rios Paraná, Paraguai e Uruguai. Era a região mais importante da política externa do Império.",
    etapas: [
      "O Brasil tinha dois grandes interesses aqui: navegar livremente pelos rios, que eram o caminho mais fácil até Mato Grosso, e ter influência no Uruguai, onde muitos estancieiros gaúchos tinham terras e gado.",
      "Em 1851 e 1852, o Brasil se aliou a grupos uruguaios e argentinos contra Manuel Oribe, no Uruguai, e Juan Manuel de Rosas, que governava Buenos Aires. Em 3 de fevereiro de 1852, na batalha de Monte Caseros, Rosas foi derrotado.",
      "Entre 1862 e 1865, houve a Questão Christie, uma crise com a Inglaterra. Depois de incidentes com um navio naufragado no Rio Grande do Sul e com marinheiros ingleses presos no Rio, o diplomata William Christie mandou apreender navios brasileiros. O Brasil rompeu relações com a Inglaterra em 1863. O rei da Bélgica foi chamado como árbitro e deu razão ao Brasil em parte da disputa. As relações só voltaram em 1865.",
      "Em 1864, o Brasil interveio de novo no Uruguai, contra o governo de Atanasio Aguirre, e cercou a cidade de Paysandú. O Paraguai de Solano López, aliado de Aguirre, viu isso como ameaça e reagiu: apreendeu um navio brasileiro e invadiu Mato Grosso. Começava a guerra."
    ],
    hoje: "Hoje Brasil, Argentina, Uruguai e Paraguai fazem parte do Mercosul. A região que foi cenário de guerras virou um bloco de comércio.",
    complemento: "As interpretações sobre as causas da Guerra do Paraguai mudaram muito. O historiador Francisco Doratioto mostra que os interesses dos próprios países da região, e não só da Inglaterra, explicam o conflito.",
    transicao: "E essa guerra foi a maior da história da América do Sul."
  },
  guerra: {
    tempo: 75,
    ano: "1864–1870",
    topicos: ["Tríplice Aliança (1865)", "Riachuelo (1865)", "Até Cerro Corá (1870)", "O preço da vitória"],
    fala: "Ao fundo, a Batalha do Avaí, pintada por Pedro Américo. A guerra durou de 1864 a 1870, mais de cinco anos.",
    etapas: [
      "Em 1º de maio de 1865, Brasil, Argentina e Uruguai assinaram o Tratado da Tríplice Aliança contra o Paraguai.",
      "Em 11 de junho de 1865, na batalha naval do Riachuelo, a Marinha brasileira destruiu boa parte da frota paraguaia. A partir daí, os aliados controlaram os rios, e o Paraguai ficou isolado.",
      "Mas a guerra foi longa: a batalha de Tuiuti, em 1866, a mais sangrenta; a fortaleza de Humaitá, tomada em 1868; a ocupação de Assunção, em 1869; e, em 1º de março de 1870, a morte de Solano López em Cerro Corá, que encerrou a guerra.",
      "O Brasil venceu, mas pagou caro: cerca de 139 mil brasileiros mobilizados e perto de 50 mil mortos, segundo as estimativas mais citadas. O país se endividou com empréstimos ingleses, e o Exército saiu da guerra maior, mais orgulhoso e disposto a participar da política. Entre os soldados havia muitos escravizados libertados para lutar."
    ],
    hoje: "Para o Paraguai, a guerra foi uma tragédia: o país perdeu grande parte da população. É lembrada até hoje como a Guerra Grande. Quem quiser saber mais pode ver a nossa apresentação completa sobre a guerra.",
    complemento: "Os números de mobilizados e mortos são estimativas; variam conforme a fonte. Doratioto, em Maldita guerra, discute esses números.",
    transicao: "A guerra também ajudou a colocar em debate o tema que dominaria os anos seguintes: a abolição."
  },
  abolicao: {
    tempo: 85,
    ano: "1850–1888",
    topicos: ["1850 · Fim do tráfico", "1871 · Ventre Livre", "1884 · Ceará e Amazonas", "1885 · Sexagenários", "1888 · Lei Áurea"],
    fala: "O Brasil foi o último país das Américas a abolir a escravidão. Vejam como foi lento esse caminho, lei por lei.",
    etapas: [
      "Já vimos o primeiro passo: em 1850, o fim do tráfico de africanos.",
      "Em 1871, a Lei do Ventre Livre, também chamada Lei Rio Branco, declarou livres os filhos de mulheres escravizadas nascidos a partir dali. Mas essas crianças ficavam com o senhor e podiam trabalhar para ele até os 21 anos. Quem assinou a lei foi a princesa Isabel, como regente, enquanto D. Pedro II viajava.",
      "Nos anos 1880 o movimento abolicionista cresceu muito, com jornais, comícios, advogados que defendiam escravizados na Justiça e fugas em massa. Vejam alguns abolicionistas: Luiz Gama, José do Patrocínio, André Rebouças e Joaquim Nabuco. Em 1884, Ceará e Amazonas aboliram a escravidão antes do resto do país. No Ceará, os jangadeiros se recusaram a levar escravizados para os navios.",
      "Em 1885, a Lei dos Sexagenários libertou os escravizados com 60 anos ou mais, mas ainda os obrigava a trabalhar mais alguns anos como indenização ao senhor. Poucos chegavam a essa idade.",
      "Finalmente, em 13 de maio de 1888, a princesa Isabel assinou a Lei Áurea: a escravidão estava extinta. A foto de Marc Ferrez mostra a multidão no Rio nesse dia. Mas a lei não indenizou os senhores nem deu terra, educação ou trabalho aos libertos."
    ],
    hoje: "O 13 de maio é lembrado, mas o movimento negro escolheu o 20 de novembro, dia da morte de Zumbi dos Palmares, como Dia da Consciência Negra, que hoje é feriado nacional. As desigualdades raciais atuais têm raízes nessa abolição sem apoio aos libertos.",
    complemento: "A historiadora Angela Alonso mostra que o abolicionismo foi um dos primeiros grandes movimentos sociais do Brasil, com campanhas, festas e arrecadação de dinheiro para comprar alforrias.",
    transicao: "A abolição ajudou a derrubar o último apoio que a monarquia tinha. Vamos ver como o Império caiu."
  },
  queda: {
    tempo: 80,
    ano: "1870–1889",
    topicos: ["Republicanos (1870)", "Igreja (1872–1875)", "Exército (1883–1887)", "Fazendeiros (1888)", "15 de novembro de 1889"],
    fala: "Ao fundo, a Proclamação da República, pintada por Benedito Calixto em 1893. Nos últimos vinte anos, o Império foi perdendo, um por um, os grupos que o sustentavam.",
    etapas: [
      "Em 1870 foi publicado o Manifesto Republicano, no jornal A República. Em 1873, na Convenção de Itu, surgiu o Partido Republicano Paulista, com muitos fazendeiros do café do Oeste Paulista.",
      "Entre 1872 e 1875 veio a Questão Religiosa: dois bispos obedeceram ao papa e puniram irmandades ligadas à maçonaria, contra a vontade do governo. Foram presos e condenados, e depois anistiados. A Igreja se afastou da monarquia.",
      "Entre 1883 e 1887, a Questão Militar: oficiais foram punidos por dar opiniões políticas na imprensa. O Exército, fortalecido desde a Guerra do Paraguai, se sentiu desrespeitado e criou o Clube Militar em 1887.",
      "Em 1888, a abolição sem indenização irritou parte dos fazendeiros, principalmente os do Vale do Paraíba, que perderam o último motivo para defender a monarquia.",
      "Em 15 de novembro de 1889, tropas lideradas pelo marechal Deodoro da Fonseca derrubaram o gabinete e foi proclamada a República. Dois dias depois, a família imperial partiu para o exílio na Europa. Houve pouca resistência."
    ],
    hoje: "O 15 de novembro é feriado nacional. Nossa outra apresentação, A Crise do Segundo Reinado, conta esse fim em detalhe.",
    complemento: "Os historiadores debatem quanto cada fator pesou. Emília Viotti da Costa mostra como mudanças econômicas e sociais, e não só as três questões, enfraqueceram o Império.",
    transicao: "Para fechar, o que esse meio século deixou para o Brasil?"
  },
  conclusao: {
    tempo: 70,
    ano: "1889 → hoje",
    topicos: ["Consolidação (1840–1850)", "Apogeu (1850–1870)", "Crise (1870–1889)", "O que ficou", "Síntese do grupo"],
    fala: "Vamos resumir os 49 anos do Segundo Reinado em três tempos.",
    etapas: [
      "Primeiro, a consolidação, de 1840 a 1850: a maioridade, a centralização do poder e o fim das revoltas provinciais.",
      "Depois, o apogeu, de 1850 a 1870: o café, o fim do tráfico, as ferrovias, Mauá, a cultura nacional e as vitórias no Prata e no Paraguai.",
      "Por fim, a crise, de 1870 a 1889: a abolição, os republicanos, a Igreja e o Exército contra o trono, até a Proclamação da República.",
      "O que ficou? O território unido, porque o país não se dividiu. Uma economia baseada na exportação de café, com as primeiras ferrovias. Mas também uma cidadania restrita, com pouquíssima gente votando, e uma abolição tardia, sem terra nem apoio aos libertos.",
      "Nossa síntese, que é uma interpretação do grupo: o Segundo Reinado construiu um Império estável e unido, mas sobre a escravidão e para poucos. D. Pedro II morreu no exílio, em Paris, em 1891, dois anos depois da queda. Obrigado! Agora podemos responder às perguntas."
    ],
    hoje: "Muitas questões que discutimos hoje, como a desigualdade, a concentração de terras e o racismo, têm raízes nesse período. Estudar o Império ajuda a entender o Brasil atual.",
    complemento: "Todas as referências e os créditos das imagens estão no botão Referências e créditos, ou na tecla R.",
    transicao: "Fim da apresentação. Abrir para perguntas."
  }
};
