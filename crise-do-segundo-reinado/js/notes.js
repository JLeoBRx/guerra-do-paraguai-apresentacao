/* Roteiro do apresentador — carregado SOMENTE pelo modo apresentador (presenter.html).
   Não aparece na projeção. Tempos em segundos.
   Estilo: uma "viagem ao passado" — cada slide começa num momento da história (ano),
   revela um tópico por clique ("etapas") e termina olhando o passado com os olhos de hoje.
   Campos: tempo, ano, topicos (lembretes do que está na tela, um por etapa), fala (abertura do slide),
   etapas (o que dizer a cada tópico), hoje (conexão com o presente), complemento (se perguntarem)
   e transicao (frase para passar ao próximo slide).
   O ROTEIRO.md é gerado a partir daqui: node scripts/roteiro.mjs */
window.GP_NOTES = {
  capa: {
    tempo: 40,
    ano: "1840 → 1889",
    fala: "Boa tarde. Vamos voltar ao Brasil do século XIX, quando o país era uma monarquia governada por D. Pedro II, o homem desta fotografia. Ele reinou de 1840 a 1889. Durante décadas o Império pareceu estável, mas no fim caiu quase sem resistência. Vamos contar essa história em seis passos: estabilidade, tensões, crises, rupturas, isolamento e, por fim, a República.",
    hoje: "Esse caminho aparece no alto da tela durante toda a apresentação, para ninguém se perder.",
    complemento: "A foto é de 1876, do estúdio de Mathew Brady, feita quando D. Pedro II visitou os Estados Unidos. Está na Biblioteca do Congresso norte-americano.",
    transicao: "Primeiro, o Império no auge: estável por fora, mas frágil por dentro."
  },
  estabilidade: {
    tempo: 100,
    ano: "1840–1886",
    topicos: ["Poder Moderador", "Dois partidos se revezavam", "Território unido", "O café sustentava tudo", "A escravidão continuava", "Quase ninguém votava"],
    fala: "Estamos nos anos 1850 e 1860, o auge do Segundo Reinado. Vamos olhar o Império de dois jeitos: por fora, a política; por dentro, a sociedade que sustentava tudo.",
    etapas: [
      "A Constituição de 1824 dava ao imperador o Poder Moderador. Com ele, D. Pedro II nomeava ministros e senadores e podia dissolver a Câmara dos Deputados.",
      "Dois partidos, o Liberal e o Conservador, se revezavam no governo. Mas era o imperador quem escolhia o chefe do gabinete. Por isso os historiadores falam em parlamentarismo às avessas.",
      "As revoltas das províncias, como a Farroupilha e a Praieira, terminaram por volta de 1850. O país continuou unido: essa era a imagem de estabilidade.",
      "Agora, por dentro. A riqueza vinha do café. Na década de 1880, o café era 61,5% de tudo o que o Brasil exportava.",
      "E o café dependia da escravidão. O Censo de 1872 contou 1,5 milhão de pessoas escravizadas, cerca de 15% da população. A foto de Marc Ferrez mostra a colheita de café em 1883.",
      "Por fim, quase ninguém participava da política. O voto dependia da renda e, depois da Lei Saraiva, de 1881, também de saber ler. Em 1886, menos de 1% da população votou. Essa estabilidade tinha pouca base no povo."
    ],
    hoje: "Hoje o voto é universal e a Constituição tem três poderes. Comparar com o Império mostra como a cidadania foi conquistada aos poucos.",
    complemento: "Ao fundo está o mapa do Império, com as fronteiras atuais só como referência, feito com a base cartográfica Natural Earth.",
    transicao: "A primeira tensão veio de quem parecia o aliado mais seguro do trono: a Igreja."
  },
  religiosa: {
    tempo: 110,
    ano: "1872–1875",
    topicos: ["Padroado, beneplácito, ultramontanismo", "1872: o padre suspenso", "1872–73: os bispos desobedecem", "1874: prisão dos bispos", "1875: anistia", "Consequência"],
    fala: "Estamos em 1872, no Rio de Janeiro. No Império, o catolicismo era a religião oficial, e a Igreja estava ligada ao Estado. Essa ligação vai virar um conflito.",
    etapas: [
      "Três regras explicam o problema. Pelo padroado, o imperador indicava os bispos e o Estado pagava os padres. Pelo beneplácito, uma ordem do papa só valia no Brasil se o imperador aprovasse. E o papa Pio IX defendia o ultramontanismo, ou seja, a obediência a Roma acima dos governos. Em 1864, no Syllabus, ele condenou ideias liberais, e documentos papais condenavam a maçonaria. Mas essas condenações nunca receberam o beneplácito de D. Pedro II, então não valiam oficialmente no Brasil.",
      "Em 1872, no Rio, o bispo suspendeu um padre que tinha discursado numa loja maçônica. Detalhe importante: o chefe do governo, o visconde do Rio Branco, era grão-mestre da maçonaria.",
      "Dois bispos foram além: D. Vital, de Olinda, e D. Macedo Costa, do Pará, puniram irmandades religiosas que tinham maçons. O governo mandou suspender as punições, e os bispos se recusaram a obedecer. A caricatura de Angelo Agostini, de 1876, mostra o bispo de Olinda suspendendo um padre.",
      "Em 1874, os dois bispos foram presos e condenados a quatro anos de prisão com trabalhos forçados. Bispos presos num país católico: isso chocou muita gente.",
      "Em 1875, o novo gabinete, chefiado pelo duque de Caxias, deu anistia aos bispos.",
      "A consequência: a Igreja não se tornou republicana, mas deixou de defender a monarquia. O trono perdeu um apoio importante."
    ],
    hoje: "Hoje o Brasil é um Estado laico, sem religião oficial. A separação entre Igreja e Estado veio justamente com a República, em 1890.",
    complemento: "O texto original falava em uma bula ultramontana Syllabus. O Syllabus, de 1864, é uma lista anexa à encíclica Quanta Cura, e não uma bula.",
    transicao: "Enquanto a Igreja se afastava, outro grupo ganhava força: o Exército."
  },
  militar: {
    tempo: 100,
    ano: "1883–1887",
    topicos: ["1883–84: Sena Madureira", "1886: Cunha Matos e Deodoro", "1887: Clube Militar", "Positivismo e Benjamin Constant"],
    fala: "Estamos nos anos 1880. O Exército voltou da Guerra do Paraguai, que durou de 1864 a 1870, maior, com prestígio e com orgulho. Mas os militares reclamavam: soldos baixos, promoções lentas e a proibição de opinar na imprensa. Este é o marechal Deodoro da Fonseca.",
    etapas: [
      "Em 1883 e 1884, o tenente-coronel Sena Madureira criticou uma reforma do governo e homenageou o jangadeiro abolicionista Francisco do Nascimento, o Dragão do Mar. Foi punido.",
      "Em 1886, o coronel Cunha Matos foi preso por responder a um deputado pela imprensa. Deodoro defendeu os oficiais punidos e foi afastado do comando no Rio Grande do Sul. O governo acabou recuando.",
      "Em 1887, os oficiais criaram o Clube Militar, presidido por Deodoro. O Clube pediu que o Exército não fosse usado para capturar escravizados fugidos.",
      "Ao mesmo tempo, na Escola Militar da Praia Vermelha, o professor Benjamin Constant ensinava o positivismo, a filosofia de Auguste Comte, que defendia ordem e progresso guiados pela ciência. Muitos jovens oficiais se aproximaram da República. O lema foi depois para a bandeira. Mas atenção: o Exército não era homogêneo, e Deodoro era monarquista."
    ],
    hoje: "O lema Ordem e Progresso, que está na bandeira do Brasil desde 19 de novembro de 1889, vem do positivismo.",
    complemento: "Os oficiais formados na Escola Militar eram chamados de científicos; os que subiam na carreira pela experiência de tropa, de tarimbeiros.",
    transicao: "Os militares não queriam mais caçar escravizados fugidos. E a escravidão estava chegando ao fim."
  },
  abolicao: {
    tempo: 105,
    ano: "1850–1888",
    topicos: ["1850: Lei Eusébio de Queirós", "1871: Lei do Ventre Livre", "1885: Lei dos Sexagenários", "1888: Lei Áurea", "A abolição também foi conquistada"],
    fala: "O Brasil foi o último país das Américas a abolir a escravidão. Vejam como esse caminho foi lento, lei por lei, e quais eram os limites de cada uma.",
    etapas: [
      "Em 1850, sob pressão da Inglaterra, a Lei Eusébio de Queirós proibiu o tráfico de africanos escravizados. Mas a escravidão continuou, e cresceu o tráfico interno, do Nordeste para o café do Sudeste.",
      "Em 1871, a Lei do Ventre Livre declarou livres os filhos de mulheres escravizadas nascidos a partir dali. O limite: essas crianças podiam trabalhar para o senhor até os 21 anos.",
      "Em 1885, a Lei dos Sexagenários libertou os escravizados com 60 anos ou mais, mas com mais três anos de trabalho. Poucos chegavam a essa idade.",
      "Em 13 de maio de 1888, a Lei Áurea extinguiu a escravidão, sem indenização aos proprietários. O limite: nada foi feito para integrar os libertos.",
      "E a abolição não foi um presente. Foi conquistada: com fugas em massa, quilombos como o Jabaquara, em Santos, ações na Justiça e a recusa dos jangadeiros do Ceará, em 1881, de levar escravizados aos navios. Ceará e Amazonas aboliram em 1884. Vejam alguns abolicionistas: Luiz Gama, José do Patrocínio, André Rebouças, Joaquim Nabuco e o Dragão do Mar."
    ],
    hoje: "O 20 de novembro, Dia da Consciência Negra, hoje é feriado nacional. As desigualdades raciais atuais têm raízes nessa abolição sem apoio aos libertos.",
    complemento: "A historiadora Angela Alonso mostra que o abolicionismo foi um dos primeiros grandes movimentos sociais do Brasil.",
    transicao: "A Lei Áurea foi uma vitória. Mas, para a monarquia, também teve um preço."
  },
  "lei-aurea": {
    tempo: 90,
    ano: "13 de maio de 1888",
    topicos: ["O que a lei fez", "A ruptura com os cafeicultores"],
    fala: "Estamos no Rio de Janeiro, em 13 de maio de 1888. A foto de Marc Ferrez mostra a multidão nas ruas nesse dia. O primeiro artigo da lei, na grafia da época, diz: é declarada extinta desde a data desta lei a escravidão no Brasil.",
    etapas: [
      "A lei libertou cerca de 700 mil pessoas. Foi assinada pela princesa Isabel, que governava como regente porque D. Pedro II estava na Europa. Mas não houve indenização aos senhores e nada foi oferecido aos libertos: nem terra, nem escola, nem trabalho.",
      "Para a monarquia, veio uma ruptura. Os fazendeiros do Vale do Paraíba, endividados e dependentes da escravidão, sentiram-se traídos. Os do Oeste Paulista já usavam imigrantes e muitos já eram republicanos. E muitos ex-senhores, por raiva da Coroa, passaram a apoiar a República: os chamados republicanos de última hora, ou republicanos de 13 de maio."
    ],
    hoje: "Muitos historiadores lembram que a abolição sem integração deixou os libertos à margem. Essa é uma das origens da desigualdade racial no Brasil.",
    complemento: "Sobre o peso dos republicanos de última hora há debate: é uma interpretação, discutida por Emília Viotti da Costa, entre outros.",
    transicao: "E quem eram os republicanos de verdade, os que já existiam antes de 1888?"
  },
  republicanismo: {
    tempo: 85,
    ano: "1870–1889",
    topicos: ["1870: Manifesto Republicano", "1873: Partido Republicano Paulista", "Anos 1880: clubes e jornais", "O que defendiam e quem apoiava"],
    fala: "Este é o jornal A República, de 3 de dezembro de 1870. Nele foi publicado o Manifesto Republicano, com a frase: somos da América e queremos ser americanos. Ou seja: todos os vizinhos eram repúblicas, só o Brasil era monarquia.",
    etapas: [
      "Em 1870, um grupo de liberais radicais, jornalistas e advogados lançou o Manifesto Republicano no Rio de Janeiro.",
      "Em 1873, na Convenção de Itu, surgiu o Partido Republicano Paulista, com muitos cafeicultores do Oeste Paulista.",
      "Nos anos 1880, clubes, jornais e comícios republicanos se multiplicaram, sobretudo em São Paulo, no Rio de Janeiro, em Minas Gerais e no Rio Grande do Sul.",
      "O que defendiam? Federalismo, ou seja, autonomia para as províncias; o fim do Poder Moderador e do Senado vitalício; e um chefe de Estado eleito. Quem apoiava? Cafeicultores do Oeste Paulista, profissionais liberais, militares positivistas e, depois de 1888, ex-escravistas."
    ],
    hoje: "O federalismo virou regra com a República: hoje os estados têm governadores eleitos e suas próprias constituições.",
    complemento: "O Partido Republicano nunca teve muitos deputados no Império. Sua força estava mais na imprensa e na aliança com os militares.",
    transicao: "Juntando tudo: o que restava para sustentar o trono?"
  },
  isolamento: {
    tempo: 85,
    ano: "1889",
    topicos: ["Três colunas", "Igreja: ruptura em 1874", "Exército: ruptura em 1887", "Elites agrárias: ruptura em 1888", "E o futuro?"],
    fala: "Vamos imaginar a monarquia como um templo. Ao fundo, a família imperial fotografada em 1889, o último ano do Império.",
    etapas: [
      "Três grupos sustentavam o trono: a Igreja, o Exército e as elites agrárias. A cada clique, uma coluna se rompe.",
      "A Igreja: com a prisão dos bispos, em 1874, ela se afastou da monarquia.",
      "O Exército: com a Questão Militar e a criação do Clube Militar, em 1887, ficou insatisfeito e atraído pela República.",
      "As elites agrárias: com a abolição sem indenização, em 1888, os fazendeiros escravistas romperam com a Coroa.",
      "E o futuro? D. Pedro II, com 63 anos, estava doente e cansado. A herdeira, a princesa Isabel, e o marido dela, o francês conde d’Eu, despertavam desconfiança. Muitos duvidavam de que haveria um Terceiro Reinado."
    ],
    hoje: "Um governo depende de apoio: quando perde os grupos que o sustentam, pode cair mesmo sem uma grande revolta popular.",
    complemento: "O historiador José Murilo de Carvalho, na biografia de D. Pedro II, mostra o imperador cada vez mais distante da política nos últimos anos.",
    transicao: "Com o trono isolado, bastava um empurrão. Vamos aos últimos dias do Império."
  },
  articulacao: {
    tempo: 95,
    ano: "junho a novembro de 1889",
    topicos: ["7 jun.: Gabinete Ouro Preto", "9 nov.: baile e Clube Militar", "10–11 nov.: civis e militares juntos", "14 nov.: o boato", "Deodoro era monarquista"],
    fala: "Estamos em 1889. Ao fundo, o último baile da Ilha Fiscal, pintado anos depois por Aurélio de Figueiredo. Vamos contar os últimos dias do Império.",
    etapas: [
      "Em 7 de junho de 1889 assumiu o gabinete liberal do visconde de Ouro Preto, o último governo do Império. Ele prometeu reformas, como descentralização e Senado temporário, para tirar força dos republicanos. Mas era tarde, e os militares desconfiavam dele.",
      "Em 9 de novembro, a Corte fez um grande baile na Ilha Fiscal, no Rio. Na mesma noite, oficiais se reuniram no Clube Militar, sob a presidência de Benjamin Constant, para discutir a crise com o governo.",
      "Nos dias 10 e 11 de novembro, Benjamin Constant e republicanos civis, como Rui Barbosa, Quintino Bocaiúva e Aristides Lobo, procuraram Deodoro para que ele liderasse o movimento. As fontes divergem sobre a data exata dessas reuniões.",
      "Em 14 de novembro, espalhou-se um boato, atribuído ao major Sólon Ribeiro, de que o governo mandaria prender Deodoro e Benjamin Constant. A notícia era falsa, mas precipitou o levante.",
      "Um detalhe importante: Deodoro era monarquista e amigo do imperador. Os republicanos civis não tinham força para derrubar o governo sozinhos; precisavam do Exército. O marechal só aderiu na última hora."
    ],
    hoje: "Notícias falsas que se espalham rápido não são novidade: o boato de 14 de novembro mostra como um rumor pode mudar a história.",
    complemento: "O baile da Ilha Fiscal foi em homenagem a oficiais de um navio chileno. A pintura é de 1905; é uma representação artística, não um registro do momento.",
    transicao: "Na madrugada seguinte, as tropas saíram às ruas."
  },
  proclamacao: {
    tempo: 100,
    ano: "15 de novembro de 1889",
    topicos: ["Madrugada", "Manhã", "Tarde", "Noite", "O exílio e o povo"],
    fala: "Estamos no Rio de Janeiro, em 15 de novembro de 1889. A pintura é de Benedito Calixto, de 1893: uma representação feita depois, não uma fotografia do dia. Foi um movimento militar, apoiado por republicanos civis.",
    etapas: [
      "De madrugada, tropas de São Cristóvão, articuladas por oficiais republicanos e por Benjamin Constant, marcharam até o Campo de Santana.",
      "De manhã, Deodoro assumiu o comando e entrou no Quartel-General. O gabinete do visconde de Ouro Preto foi deposto.",
      "À tarde, na Câmara Municipal do Rio, José do Patrocínio e outros vereadores declararam a República.",
      "À noite, formou-se o Governo Provisório, chefiado por Deodoro. O Decreto número 1 adotou a República Federativa.",
      "Em 17 de novembro, de madrugada, a família imperial partiu para o exílio na Europa. D. Pedro II morreu em Paris, em 1891. E o povo? O republicano Aristides Lobo escreveu, três dias depois, que o povo assistiu àquilo bestializado, atônito, surpreso, sem conhecer o que significava. O historiador José Murilo de Carvalho discute essa imagem: ela mostra como a mudança foi decidida por poucos."
    ],
    hoje: "O 15 de novembro é feriado nacional. E a imagem do povo bestializado ainda é usada para discutir a participação popular na política brasileira.",
    complemento: "Deodoro, no começo do dia, falava em derrubar o gabinete; a decisão de proclamar a República se firmou ao longo do dia 15. Os historiadores ainda discutem suas intenções.",
    transicao: "Então, afinal: por que a monarquia caiu?"
  },
  conclusao: {
    tempo: 90,
    ano: "1889 → hoje",
    topicos: ["A Igreja se afasta", "O Exército desafia o governo", "A escravidão acaba", "Os cafeicultores rompem", "Os republicanos crescem", "O trono fica isolado", "A frase final"],
    fala: "Vamos juntar as peças. Não houve uma única causa.",
    etapas: [
      "Primeiro, a Igreja se afastou com a Questão Religiosa, entre 1872 e 1875.",
      "Depois, o Exército desafiou o governo na Questão Militar, entre 1883 e 1887.",
      "Em 1888, a escravidão acabou com a Lei Áurea.",
      "Com isso, os cafeicultores escravistas romperam com a Coroa.",
      "Enquanto isso, os republicanos cresciam, desde o Manifesto de 1870.",
      "E, em 1889, o trono ficou isolado, sem os grupos que o sustentavam.",
      "Por isso, nossa conclusão é esta: a monarquia brasileira não caiu por uma única crise, mas pela perda progressiva do apoio dos grupos que sustentavam seu poder. Vejam o mapa ao fundo: o território continuou unido, mas o regime mudou. Obrigado!"
    ],
    hoje: "Muitas questões de hoje, como a desigualdade racial, a concentração de terras e a participação política, têm raízes nesse período.",
    complemento: "Essa é a síntese do grupo, baseada nos historiadores das referências, como Emília Viotti da Costa e José Murilo de Carvalho.",
    transicao: "No próximo slide estão as nossas referências. Agora podemos responder às perguntas."
  },
  referencias: {
    tempo: 20,
    ano: "Fontes",
    fala: "Estas são as nossas referências: livros de historiadores, as leis e os documentos da época. Os créditos de cada imagem estão no botão no pé da página, e cada imagem ampliada mostra seu autor e acervo.",
    hoje: "Conferir as fontes é a melhor defesa contra informações falsas, como o boato de 14 de novembro.",
    complemento: "Todas as imagens são de acervos em domínio público, reunidas pelo Wikimedia Commons.",
    transicao: "Fim. Abrir para perguntas."
  }
};
