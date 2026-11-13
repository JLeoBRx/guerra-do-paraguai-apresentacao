/* Roteiro do apresentador — carregado SOMENTE pelo modo apresentador (presenter.html).
   Não aparece na projeção. Tempos em segundos. "etapas" acompanham as cenas com etapas.
   O arquivo ROTEIRO.md é gerado a partir daqui: node scripts/build-roteiro.mjs */
window.GP_NOTES = {
  abertura: {
    tempo: 45,
    fala: "Boa tarde. Nosso trabalho é sobre a Guerra do Paraguai, que aconteceu entre 1864 e 1870. Foi o maior conflito armado internacional da América do Sul no século XIX: de um lado, o Paraguai; do outro, a Tríplice Aliança, formada pelo Império do Brasil, pela Argentina e pelo Uruguai. No mapa da abertura, o Paraguai aparece destacado no centro do continente, sem saída para o mar e ligado ao oceano apenas pelos rios. Esses rios vão aparecer o tempo todo. Nos próximos minutos, vamos explicar o contexto da região, as causas, os países envolvidos, as campanhas e batalhas, as consequências e as diferentes interpretações dos historiadores.",
    complemento: "A pintura é um estudo de Victor Meirelles para a Batalha Naval do Riachuelo (1865), feito entre 1868 e 1873. É uma representação artística, não uma fotografia do combate. O nome também varia: no Brasil se diz Guerra do Paraguai; em outros países é comum Guerra da Tríplice Aliança; na memória paraguaia, Guerra Grande.",
    contexto: "O recorte 1864–1870 tem dois marcos: a apreensão do navio brasileiro Marquês de Olinda, em novembro de 1864, e a morte de Francisco Solano López em Cerro Corá, em 1º de março de 1870.",
    transicao: "Para entender por que essa guerra aconteceu, primeiro olhamos para a região onde ela começou: a Bacia do Prata."
  },
  contexto: {
    tempo: 75,
    fala: "Na metade do século XIX, Brasil, Argentina, Uruguai e Paraguai ainda consolidavam seus Estados. As fronteiras não eram bem definidas e havia disputas internas em quase todos esses países. O ponto central é a geografia: os rios Paraguai, Paraná e Uruguai formam a Bacia do Prata e desembocam no estuário do Rio da Prata, entre Buenos Aires e Montevidéu. Esses rios funcionavam como estradas: por eles passavam mercadorias, pessoas e, na guerra, tropas e navios. Para o Paraguai, que não tem litoral, a navegação era vital. Tudo o que o país comprava ou vendia no exterior descia os rios até o Atlântico, passando por territórios vizinhos — é a rota tracejada em vermelho no mapa.",
    complemento: "Carlos Antonio López governou o Paraguai até morrer, em 1862; seu filho, Francisco Solano López, assumiu em seguida. O Estado paraguaio era centralizado e investiu em ferrovia, telégrafo, arsenal e estaleiro, com técnicos estrangeiros. O Brasil também dependia dos rios: subir o rio Paraguai era o caminho mais prático para chegar à província de Mato Grosso.",
    contexto: "O mapa usa fronteiras atuais só como referência. Em 1864, vários limites estavam em disputa, entre o Paraguai e o Brasil e entre o Paraguai e a Argentina.",
    transicao: "Com esse cenário, fica mais fácil entender as causas do conflito — e por que elas não se resumem a um único motivo."
  },
  causas: {
    tempo: 90,
    fala: "Os historiadores costumam separar dois tipos de causa. À esquerda estão as de longo prazo: fronteiras indefinidas, a disputa pela navegação dos rios, a concorrência entre Brasil e Argentina por influência na região — especialmente no Uruguai — e Estados ainda em formação, com muitos conflitos internos. À direita estão os gatilhos, os fatos de 1864 e 1865 que transformaram essas tensões em guerra: a guerra civil no Uruguai e a intervenção do Império do Brasil; a reação do governo de Solano López, que via nisso uma ameaça; a apreensão do Marquês de Olinda e a invasão de Mato Grosso; e o ataque paraguaio a Corrientes, na Argentina. As linhas mostram como os fatores antigos alimentaram os acontecimentos imediatos.",
    complemento: "No Uruguai disputavam o poder os blancos, que governavam em 1864, e os colorados, liderados por Venancio Flores, que se rebelou em 1863. Pecuaristas do Rio Grande do Sul com terras no Uruguai pressionavam o governo imperial a intervir, e o governo blanco buscava apoio no Paraguai. A miniatura ao lado de 'Crise no Uruguai' é uma gravura do ataque a Paysandu, em 1864.",
    contexto: "O quadro vermelho é importante: não há base histórica para explicar a guerra só como plano da Inglaterra, nem só pela personalidade de Solano López. Essas explicações simplificadas são comuns, mas a pesquisa atual destaca as relações entre os próprios países do Prata.",
    transicao: "Mas quem eram esses países e o que cada um queria? É o que mostramos a seguir."
  },
  paises: {
    tempo: 75,
    fala: "Quatro países participaram diretamente da guerra. O Império do Brasil, governado por D. Pedro II, queria garantir a navegação dos rios e manter influência no Uruguai. A Argentina, presidida por Bartolomé Mitre, terminava de se unificar politicamente e tinha divisões internas fortes. O Uruguai, dividido entre blancos e colorados, foi o estopim imediato da crise. E o Paraguai, governado por Francisco Solano López desde 1862, tinha um Estado centralizado e forças militares significativas, mas dependia dos rios. Os três primeiros formariam a Tríplice Aliança, como mostra a chave no alto. Se quiserem, podemos clicar nos cartões para ver o papel de cada país durante a guerra.",
    complemento: "As fotografias são de época: Pedro II em 1865, Mitre em 1862, Flores por volta de 1865 e Solano López por volta de 1862. Os interesses mudaram durante a guerra: Mitre, por exemplo, precisou deixar a frente para enfrentar revoltas internas na Argentina.",
    contexto: "Os contornos no verso dos cartões são as fronteiras atuais, usadas só para localizar cada país.",
    transicao: "Agora vamos ver, passo a passo, como essas relações se transformaram em guerra entre 1864 e 1865."
  },
  inicio: {
    tempo: 90,
    fala: "Esta cena mostra a escalada da crise. Vou avançar um acontecimento de cada vez; o mapa acompanha cada etapa.",
    etapas: [
      "Agosto de 1864: o Império do Brasil dá um ultimato ao governo blanco do Uruguai. No dia 30, o Paraguai protesta: uma ocupação do Uruguai seria um atentado ao equilíbrio da região. No mapa, Uruguai e Paraguai aparecem destacados.",
      "Outubro de 1864: tropas do Império entram no Uruguai, em apoio aos colorados de Venancio Flores. Paysandu é cercada e cai em janeiro de 1865. Ao lado aparece uma gravura da época sobre esse ataque.",
      "12 de novembro de 1864: no rio Paraguai, forças paraguaias apreendem o vapor brasileiro Marquês de Olinda, que levava o novo presidente da província de Mato Grosso. Esse episódio é tomado como o início da guerra.",
      "Dezembro de 1864: o Paraguai invade o sul de Mato Grosso, subindo o rio Paraguai. O Forte de Coimbra é atacado.",
      "Abril de 1865: a Argentina não autoriza a passagem de tropas paraguaias por seu território, e o Paraguai ataca a província de Corrientes. Com isso, a Argentina entra na guerra."
    ],
    complemento: "A apreensão do Marquês de Olinda foi uma resposta à intervenção brasileira no Uruguai. Em fevereiro de 1865, Flores assumiu o governo uruguaio com apoio brasileiro, e o Uruguai passou para o lado do Brasil.",
    contexto: "As áreas destacadas usam limites atuais só como referência: o sul de Mato Grosso corresponde aproximadamente ao atual Mato Grosso do Sul. As localizações são aproximadas.",
    transicao: "O ataque a Corrientes uniu Brasil, Argentina e Uruguai. Vamos ver como se formou essa aliança."
  },
  alianca: {
    tempo: 75,
    fala: "Nesta cena, os países aparecem no mapa conforme entram na aliança.",
    etapas: [
      "Em 1865, o Paraguai fica isolado: cercado pelos três vizinhos e dependente de rios que passavam por territórios alheios.",
      "O Império do Brasil foi o principal aliado: forneceu a maior parte das tropas e a esquadra que atuou nos rios. Entre os comandantes brasileiros estiveram Osório e, a partir do fim de 1866, Caxias.",
      "A Argentina de Bartolomé Mitre entrou na guerra. Pelo tratado, Mitre assumiu o comando inicial das forças aliadas em terra, mas a guerra enfrentava oposição em províncias do interior.",
      "O Uruguai, agora governado pelo colorado Venancio Flores, completou a aliança. Flores comandou a vanguarda aliada em 1865; o contingente uruguaio foi o menor.",
      "Em 1º de maio de 1865, em Buenos Aires, os três países assinaram o Tratado da Tríplice Aliança. Assinado em segredo, previa que nenhum aliado faria a paz em separado e que só deporiam as armas após a queda do governo de Solano López — e declarava que a guerra não era contra o povo paraguaio. O triângulo liga as três capitais aliadas."
    ],
    complemento: "Os signatários foram Francisco Octaviano de Almeida Rosa (Brasil), Rufino de Elizalde (Argentina) e Carlos de Castro (Uruguai). O tratado também tratava da navegação dos rios e de limites territoriais depois da guerra — ponto que mais tarde gerou críticas, por revelar interesses territoriais dos aliados.",
    contexto: "O comando mudou ao longo da guerra: Mitre deixou a frente no início de 1868, e Caxias passou a comandar as forças aliadas.",
    transicao: "Com a aliança formada, a guerra se estendeu por mais de cinco anos. A linha do tempo resume os principais marcos."
  },
  cronologia: {
    tempo: 90,
    fala: "Aqui está a guerra inteira em uma linha do tempo, de outubro de 1864 a março de 1870. As faixas mostram três fases: a ofensiva paraguaia, em 1864 e 1865; a invasão do Paraguai e o longo cerco a Humaitá, de 1866 a 1868; e o avanço final até a morte de Solano López. Em destaque estão o início, com o Marquês de Olinda, e o fim, em Cerro Corá. Podemos clicar em qualquer acontecimento para ver detalhes e uma imagem da época. Reparem que 1865 concentra muitos fatos — invasões, o tratado, Riachuelo e Uruguaiana —, enquanto 1867 quase não tem marcos: foi um ano de guerra de posições, com epidemias e tentativas de cercar as fortificações paraguaias.",
    complemento: "A guerra durou muito mais do que os aliados esperavam. O sistema de fortificações de Humaitá, as doenças, a logística difícil em áreas alagadas e a resistência paraguaia prolongaram o conflito.",
    contexto: "O espaçamento entre os acontecimentos foi ajustado para que todos fiquem legíveis, então a linha não é exatamente proporcional ao tempo; os anos marcados no eixo estão corretos.",
    transicao: "Para entender onde esses fatos aconteceram, vamos ao mapa das campanhas."
  },
  mapa: {
    tempo: 135,
    fala: "Este é o mapa das campanhas, dividido em cinco fases. Vou avançar uma por uma; os pontos podem ser clicados para mais informações.",
    etapas: [
      "Fase 1, de dezembro de 1864 a setembro de 1865: a ofensiva paraguaia. As setas vermelhas mostram três movimentos: ao norte, pelo rio Paraguai, até Mato Grosso; ao sul, para Corrientes; e pelo rio Uruguai, até o Rio Grande do Sul, passando por São Borja.",
      "Fase 2, a guerra nos rios: em 11 de junho de 1865, a esquadra brasileira vence em Riachuelo e passa a controlar o rio Paraná. Em agosto, uma coluna paraguaia é derrotada em Yataí; em setembro, a coluna cercada em Uruguaiana se rende. No fim de 1865, os paraguaios deixam Corrientes.",
      "Fase 3: em abril de 1866, os aliados atravessam o rio Paraná em Passo da Pátria e entram no Paraguai. Seguem Tuiuti, em maio, e a derrota aliada em Curupaiti, em setembro. O sistema fortificado de Humaitá resiste até 1868.",
      "Fase 4: em dezembro de 1868, os aliados contornam as defesas paraguaias e vencem a sequência chamada Dezembrada — Itororó, Avaí e Lomas Valentinas. Em janeiro de 1869, ocupam Assunção.",
      "Fase 5: a guerra continua no interior. Em agosto de 1869, Piribebuy e Acosta Ñu marcam a Campanha das Cordilheiras. A perseguição termina em Cerro Corá, no norte do país, onde Solano López morre em 1º de março de 1870."
    ],
    complemento: "Os trajetos são esquemáticos: mostram a sequência dos lugares, não cada caminho exato das tropas. Para comparar, o botão 'Ver o mapa histórico de 1871' abre um mapa feito logo depois da guerra, com as marchas dos exércitos aliados.",
    contexto: "A guerra se concentrou na confluência dos rios Paraguai e Paraná porque quem controlasse os rios controlava o abastecimento e o acesso a Assunção. Por isso a fortaleza de Humaitá, numa curva do rio Paraguai, foi tão importante.",
    transicao: "Agora vamos olhar mais de perto algumas dessas batalhas."
  },
  batalhas: {
    tempo: 120,
    fala: "Nesta galeria, vemos cinco momentos marcantes. Para cada um aparecem a localização no mini-mapa, a data e uma sequência: antes, combate e resultado.",
    etapas: [
      "Riachuelo, 11 de junho de 1865: a principal batalha naval da guerra. A esquadra brasileira, comandada por Francisco Manuel Barroso, venceu a flotilha paraguaia no rio Paraná, perto de Corrientes. Depois disso, o Paraguai não conseguiu mais disputar o controle dos rios.",
      "Tuiuti, 24 de maio de 1866: logo depois da invasão aliada, o exército paraguaio atacou o acampamento aliado. Ela é frequentemente apontada como a maior batalha campal da história da América do Sul. Os aliados venceram, e as perdas paraguaias foram muito altas. A imagem é uma fotografia de 1866 de uma trincheira em Tuiuti.",
      "Curupaiti, 22 de setembro de 1866: o ataque aliado contra as trincheiras paraguaias fracassou, com muitas baixas — a maior derrota aliada da guerra, que paralisou a ofensiva por meses. A pintura é de Cándido López, soldado argentino que lutou ali e perdeu o braço direito; depois, aprendeu a pintar com a mão esquerda.",
      "Humaitá: a fortaleza bloqueava o rio Paraguai com baterias e correntes. Em 19 de fevereiro de 1868, encouraçados brasileiros forçaram a passagem. A posição foi abandonada pelos paraguaios e ocupada pelos aliados em julho de 1868.",
      "Avaí, 11 de dezembro de 1868, parte da Dezembrada. Antes, as tropas aliadas sob o comando de Caxias abriram uma estrada pelo Chaco, na outra margem do rio, para contornar as defesas paraguaias. A pintura de Pedro Américo foi encomendada depois da guerra e mostra como a arte ajudou a construir uma memória heroica do conflito."
    ],
    complemento: "Vale observar o tipo de cada imagem, indicado na etiqueta: a fotografia registra uma cena real em um momento; a pintura histórica, muitas vezes feita anos depois, organiza a memória do acontecimento e pode dramatizar ou idealizar.",
    contexto: "Riachuelo é a data magna da Marinha do Brasil, lembrada em 11 de junho. Tuiuti, Curupaiti e Humaitá ficam numa área pequena do sul do Paraguai, cheia de lagoas, banhados e trincheiras.",
    transicao: "Mas o custo da guerra foi muito além das batalhas. A partir de agora, a apresentação fica mais lenta e sóbria, porque vamos falar das perdas humanas."
  },
  humanas: {
    tempo: 90,
    fala: "Grande parte das mortes não aconteceu em combate. Doenças como o cólera, que atingiu os exércitos em 1867, a fome e a falta de abastecimento fizeram muitas vítimas. O recrutamento também foi desigual: além de voluntários, havia recrutamento forçado e, no Brasil, pessoas escravizadas foram enviadas à guerra, em alguns casos com a promessa de liberdade. A população civil sofreu com ocupações, deslocamentos e destruição. E o Paraguai foi devastado, com perdas populacionais enormes. A fotografia de 1867 mostra famílias paraguaias desabrigadas.",
    complemento: "Sobre os números, há um grande debate. Thomas Whigham e Barbara Potthast (1999) defenderam perdas muito altas, superiores à metade da população paraguaia; outros pesquisadores, como Vera Blinn Reber (1988), calcularam perdas bem menores. As diferenças vêm de censos incompletos, registros destruídos e métodos distintos — por isso o trabalho não adota uma cifra única.",
    contexto: "Em Acosta Ñu, em agosto de 1869, muitos combatentes paraguaios eram crianças e adolescentes. No Paraguai, o 16 de agosto é o Dia da Criança, em memória dessa batalha.",
    transicao: "Além do custo humano, a guerra deixou consequências políticas e econômicas duradouras para os quatro países."
  },
  politicas: {
    tempo: 75,
    fala: "Os efeitos foram desiguais. O Paraguai foi ocupado por tropas aliadas — as brasileiras ficaram até 1876 —, perdeu população e capacidade produtiva e teve suas fronteiras fixadas em tratados com o Brasil, em 1872, e com a Argentina, em 1876. O Brasil venceu, mas saiu endividado, e o Exército ganhou prestígio e peso político. A Argentina consolidou o Estado nacional, apesar das disputas internas; uma parte do Chaco foi decidida pela arbitragem do presidente dos Estados Unidos, Rutherford Hayes, em 1878, a favor do Paraguai. E o Uruguai, com participação militar menor, mostra como uma crise interna pode arrastar toda uma região.",
    complemento: "No Brasil, a guerra estimulou o debate sobre a escravidão: soldados negros que lutaram pelo país voltavam a uma sociedade escravista, como critica a charge de Angelo Agostini (1870). A Lei do Ventre Livre veio em 1871. O fortalecimento do Exército também é lembrado por historiadores ao explicar a crise da monarquia, que terminou com a Proclamação da República, em 1889.",
    contexto: "No Paraguai, o pós-guerra incluiu um governo provisório sob ocupação aliada e uma nova Constituição, em 1870. A recuperação econômica e demográfica levou décadas.",
    transicao: "Diante de consequências tão grandes, os historiadores discutem há mais de um século como explicar essa guerra."
  },
  interpretacoes: {
    tempo: 90,
    fala: "A forma de explicar a guerra mudou com o tempo. A perspectiva tradicional destacava líderes, batalhas e patriotismo; organizou a cronologia, mas costumava mostrar heróis e vilões e deixava de lado soldados comuns, escravizados e civis. Nas décadas de 1960 e 1970, interpretações revisionistas criticaram essa visão e deram peso à economia e ao imperialismo, chegando a atribuir à Inglaterra um papel decisivo — algo que a pesquisa documental posterior não confirmou como causa principal. As abordagens recentes estudam a formação dos Estados do Prata, a diplomacia e a história social, com documentos de vários países. O critério que adotamos está no quadro de baixo: uma explicação é mais convincente quando apresenta evidências, compara fontes e reconhece o que não se sabe.",
    complemento: "Exemplos frequentemente associados às correntes: entre os revisionistas, León Pomer, na Argentina (1968), e Júlio José Chiavenatto, no Brasil, com 'Genocídio americano' (1979); entre as abordagens recentes, Francisco Doratioto, com 'Maldita guerra' (2002). Os livros didáticos mudaram junto com essas interpretações, como analisa o trabalho de Andrew Cesar de Goes.",
    contexto: "A pintura La paraguaya, do uruguaio Juan Manuel Blanes (c. 1879), transforma a devastação em alegoria: uma mulher sozinha num campo de batalha. A arte também é memória — e interpretação.",
    transicao: "Depois de tudo isso, voltamos à pergunta que guiou o trabalho."
  },
  conclusao: {
    tempo: 60,
    fala: "Nossa pergunta era: como as disputas políticas e estratégicas no Prata contribuíram para a guerra, e como o conflito transformou os países envolvidos? A resposta: a guerra resultou de uma crise regional em que se combinaram interesses dos Estados, a navegação dos rios, a intervenção no Uruguai e as escolhas militares dos governos. Seus efeitos foram profundos e desiguais, sobretudo para o Paraguai. Voltamos ao mapa do início para lembrar que tudo partiu desta região e destes rios. Compreender a guerra exige confrontar documentos, interpretações e memórias, reconhecendo os custos humanos de decisões tomadas em nome da soberania e do poder.",
    complemento: "Se houver tempo, vale reforçar que o trabalho evitou explicações de causa única e tratou as imagens como fontes históricas, com autoria e data.",
    contexto: "A faixa no rodapé é de Cándido López, 'Después de la batalla de Curupaytí' (1893).",
    transicao: "Para encerrar, mostramos as fontes que utilizamos."
  },
  referencias: {
    tempo: 30,
    fala: "Estas são as referências: artigos acadêmicos, teses, documentos do Senado, da Marinha e do Museu Histórico Nacional, além dos acervos de imagens. Todas as imagens têm crédito e estão em domínio público. Obrigado — ficamos à disposição para perguntas.",
    complemento: "Se perguntarem sobre os mapas: são ilustrativos, feitos com dados do Natural Earth, com fronteiras atuais apenas como referência; as rotas são esquemáticas.",
    contexto: "Integrantes: Pedro Henrique, Clara Maria, Anthony Marcos, Gabriel Willian, Leandro Farias e Lohan David.",
    transicao: "Fim da apresentação."
  }
};
