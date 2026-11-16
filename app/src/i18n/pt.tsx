/**
 * Everything the web app says, in Portuguese: en.tsx, translated. Written to
 * be read in Brazil and in Portugal alike; voters are addressed as «você»,
 * and a poll is a «votação», a ballot a «voto».
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('pt', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('pt', count, one, other)}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return unit === 'minute' ? counted(count, 'minuto', 'minutos') : counted(count, 'hora', 'horas');
}

export const pt: Messages = {
  number,
  percent: (share: number) => formatPercent('pt', share),
  decimal: (value: number, digits: number) => formatDecimal('pt', value, digits),
  date: (isoDate: string) => formatDate('pt', isoDate),
  moment: (isoDate: string) => formatMoment('pt', isoDate),
  day: (day: string) => formatUtcDay('pt', day),
  timeAgo: (isoDate: string) => timeAgo('pt', isoDate) ?? 'agora mesmo',
  waitUntil: inWords,

  loading: 'Carregando…',
  backHome: 'Voltar ao início',
  tryAgain: 'Tentar de novo',
  close: 'Fechar',
  dismiss: 'Dispensar',

  errors: {
    unexpected: 'Algo deu errado. Tente de novo.',
    unreachable: 'Não foi possível acessar o servidor. Verifique sua conexão e tente de novo.',
    failed: (status: number) => `Algo deu errado (erro ${status}). Tente de novo.`,
  },

  problems: {
    'unknown-voter': 'Este navegador não é um que o super-vote conheça. Recarregue a página para começar do zero.',
    'not-poll-creator': 'Só quem criou a votação pode fazer isso.',
    'not-invited': 'Só pessoas convidadas podem votar nesta votação. Se você foi convidado, abra o link do seu convite.',
    'not-admin-link': 'Este link de administração não é o desta votação. Verifique se foi copiado por inteiro.',
    'handover-unavailable': 'Este link não pode transferir a votação: já foi usado.',
    'cross-site': 'Este pedido veio de outro site e foi recusado. Abra o próprio super-vote.',
    'poll-not-found': 'Nenhuma votação tem este link ou este código. Pode estar digitado errado, ou a votação foi excluída.',
    'poll-closed': 'Esta votação está encerrada: não aceita mais votos.',
    'invitation-used': 'Alguém já votou com este convite, em outro navegador ou em outro dispositivo.',
    'collision': 'Essa alteração colidiu com outra feita no mesmo instante. Tente de novo.',
    'too-many-polls': (wait: string) => 'Esta conexão já criou as votações de hoje. Para ser justo com todos, '
      + `cada uma pode criar algumas por dia: você poderá criar mais em ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Códigos errados demais vindos desta conexão: para proteger as votações '
      + `contra tentativas de adivinhação, os códigos dela serão recusados pelos próximos ${wait}. Os links continuam funcionando.`,
    'server-error': 'Algo deu errado do nosso lado. Tente de novo daqui a pouco.',
  },

  mentions: {
    Excellent: 'Excelente',
    VeryGood: 'Muito bom',
    Good: 'Bom',
    Fair: 'Razoável',
    Passable: 'Passável',
    Inadequate: 'Insuficiente',
    Bad: 'Ruim',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Julgamento majoritário',
    APPROVAL: 'Voto por aprovação',
  },

  visibilities: {
    PUBLIC: 'Pública',
    UNLISTED: 'Privada',
  },

  app: {
    home: 'Início',
    settings: 'Configurações',
    footer: <><AppName /> é gratuito e de código aberto.</>,
    footerLinks: 'Sobre o super-vote',
    about: 'Sobre e a ciência por trás',
    privacy: 'Privacidade e limites',
    legal: 'Aviso legal',
    statistics: 'Estatísticas',
    sourceCode: 'Código-fonte',
    notFound: 'Página não encontrada',
    nothingHere: 'Não há nada neste endereço.',
  },

  settings: {
    language: 'Idioma',
    appearance: 'Aparência',
    light: 'Claro',
    automatic: 'Automático',
    dark: 'Escuro',
    mentionColours: 'Cores das menções',
    greenToRed: 'Do verde ao vermelho',
    shadesOfGrey: 'Tons de cinza',
    shadesOfGreyHint: 'Os tons de cinza se leem do mesmo jeito, sejam quais forem as cores que você enxerga: quanto mais claro, melhor.',
    majorityJudgmentBallot: 'Voto por julgamento majoritário',
    colourScale: 'Escala de cores',
    dropdowns: 'Listas suspensas',
    castingYourBallot: 'Registrar seu voto',
    live: 'Na hora',
    envelope: 'Envelope',
    liveHint: 'Cada alteração conta no instante em que você a faz.',
    envelopeHint: 'Preencha seu voto e envie tudo de uma vez.',
  },

  home: {
    title: 'super-vote · decidir juntos',
    lead: 'A matemática diz que é mais justo.',
    createQuestion: 'Precisa organizar uma votação?',
    createPoll: 'Vamos decidir juntos!',
    yourPolls: 'Decidir juntos…',
    publicPolls: 'Votações públicas',
    noPublicPolls: 'Ainda não há votações públicas.',
    public: 'Pública',
    closed: 'Encerrada',

    howItWorks: 'Como funciona',
    steps: [
      { title: 'Pergunte', text: 'Uma pergunta e suas opções.' },
      { title: 'Compartilhe', text: 'Um link, um QR code ou um código.' },
      { title: 'Decida', text: 'Todos dão notas e os resultados chegam ao vivo.' },
    ],

    agent: {
      title: 'Pronto para a IA',
      text: 'Cole isto num assistente que consiga navegar na web, com a sua própria pergunta.',
      prompt: (site: string, guide: string) => `Use ${site} para criar uma votação para a minha equipe (instruções para `
        + `agentes: ${guide}). A pergunta: “Onde vamos fazer o encontro da equipe?” As opções: Lisboa, Berlim, `
        + 'Barcelona. Use o julgamento majoritário e mantenha os resultados ocultos até eu encerrar a votação. '
        + 'Transfira a votação para mim e depois me dê o link para compartilhar com a equipe.',
      copy: 'Copiar o texto',
      copied: 'Texto copiado',
      caption: 'Ele responde com dois links: abra o primeiro para tornar a votação sua e envie o segundo ao grupo.',
    },

    systems: {
      title: 'Duas formas de decidir',
      majorityJudgment: {
        title: 'Julgamento majoritário',
        text: 'Dê uma nota a cada opção, de Excelente a Ruim. Vence a melhor menção majoritária.',
      },
      approval: {
        title: 'Aprovação',
        text: 'Marque todas as opções que você aceitaria. Vence a mais marcada.',
      },
    },

    compare: {
      title: 'Mais justo que a maioria das eleições oficiais',
      text: 'A maioria das eleições pede um único nome. Candidatos parecidos dividem seus eleitores, e um que a maioria '
        + 'rejeita ainda pode vencer. O julgamento majoritário, fruto da pesquisa de Michel Balinski e Rida Laraki, '
        + 'mede em vez disso o que todos pensam de cada opção.',
      science: 'A ciência por trás',
      single: 'Uma só escolha',
      singleNote: 'a maioria das eleições',
      approval: 'Aprovação',
      majorityJudgment: 'Julgamento majoritário',
      criteria: {
        nuance: 'Diga o que pensa de cada opção',
        splitting: 'Opções parecidas não dividem o voto',
        lesserEvil: 'Sem votar no mal menor',
        tactics: 'Difícil de manipular',
        quick: 'Rápido de preencher',
        familiar: 'Familiar',
      },
      marks: { yes: 'Sim', partly: 'Em parte', no: 'Não' },
      caption: <><AppName /> oferece aprovação e julgamento majoritário. Nenhuma regra de votação é perfeita, mas
        algumas são muito mais justas que outras.</>,
    },

    supportTitle: 'Gratuito, de código aberto e sem anúncios',
    supportText: 'Você não é o produto: o objetivo é promover sistemas de votação melhores. Feito por uma só pessoa, '
      + 'no tempo livre. Se ajudou o seu grupo a decidir, você pode ajudá-lo.',

    limitsTitle: 'Bom saber',
    limits: {
      everyday: <><strong>Para decisões do dia a dia,</strong> não eleições oficiais: sem contas, alguém pode votar
        de novo em outro navegador. Os convites contam cada pessoa uma só vez.</>,
      private: <><strong>Privado, mas não oculto do servidor.</strong> Ninguém mais vê o seu voto, e os votos guardados
        não dizem quem os deu.</>,
      browser: (days: number) => <><strong>Preso a este navegador,</strong> por um único cookie, guardado por {days} dias
        após o seu último voto ou votação. Sem anúncios, sem rastreamento.</>,
      deleted: (days: number) => <><strong>Excluído após {days} dias,</strong> tanto as votações quanto os votos.</>,
      disclaimer: <><strong>Sem garantia.</strong> <AppName /> promove formas melhores de votar. É feito por uma só
        pessoa, com o maior cuidado com segurança, privacidade, desempenho, arquitetura e qualidade do código, mas não
        é credenciado, auditado nem revisado de forma independente: não se garante que seus resultados sejam exatos nem
        uma representação fiel da vontade de um grupo. Isso exigiria credenciamento, revisão técnica por especialistas
        e suporte contínuo, o que uma só pessoa não pode oferecer sem patrocinadores e especialistas.</>,
    },
    limitsLink: 'Tudo sobre privacidade e limites',
  },
  join: {
    label: 'Tem um código?',
    typeTheCode: 'Digite o código que você recebeu.',
    notACode: 'Um código tem seis letras e dígitos, como K7M-4QX.',
    joining: 'Entrando…',
    join: 'Votar!',
  },

  newPoll: {
    title: 'Decidir juntos · super-vote',
    heading: 'Decidir juntos',
    question: 'Pergunta',
    questionPlaceholder: 'Onde vamos jantar na sexta?',
    options: 'Opções',
    option: (row: number) => `Opção ${row}`,
    remove: (option: string) => `Remover ${option}`,
    optionsHint: (max: number) => `Até ${max} opções. Uma nova linha aparece conforme você digita.`,

    votingSystem: 'Sistema de votação',
    systems: {
      MAJORITY_JUDGMENT: 'Julgamento majoritário',
      APPROVAL: 'Aprovação',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Cada pessoa dá nota a todas as opções, de Excelente a Ruim. Vence a opção que uma maioria '
        + 'avalia melhor: com nuances e difícil de manipular.',
      APPROVAL: 'Cada pessoa marca todas as opções que aceitaria. Vence a opção mais aprovada: rápido e simples.',
    },

    whoCanFindIt: 'Quem pode encontrá-la',
    visibilityHints: {
      PUBLIC: 'Listada na página inicial, para qualquer pessoa encontrar.',
      UNLISTED: 'Não listada em lugar nenhum: só encontram quem recebe o link ou o código de você.',
    },

    whoCanVote: 'Quem pode votar',
    anyone: 'Qualquer pessoa',
    invitedOnly: 'Só com convite',
    anyoneHint: <>
      Qualquer pessoa com o link ou o código. Quem insistir pode votar de novo em outro navegador: para contar cada
      pessoa uma só vez, convide-a.
    </>,
    invitedHint: 'Cada pessoa recebe um link só seu, válido para um voto. Você vê quais links foram usados, nunca o que '
      + 'cada um escolheu.',

    whoVoted: 'Quem votou',
    anonymous: 'Anônimo',
    showNames: 'Mostrar nomes',
    anonymousHint: 'Ninguém vê quem votou, só quantas pessoas votaram.',
    showNamesHint: 'Quem vota pode informar um nome, exibido sob os resultados. Ninguém vê quem escolheu o quê.',

    results: 'Resultados',
    resultsChoices: {
      LIVE: 'Ao vivo',
      AFTER_BALLOTS: 'Adiados',
      AFTER_CLOSING: 'No encerramento',
    },
    resultsHints: {
      LIVE: 'Cuidado: todos veem cada voto mexer nos resultados. Num grupo pequeno, isso mostra quem escolheu o quê.',
      AFTER_BALLOTS: 'Ocultos até chegar essa quantidade de votos, para proteger as primeiras pessoas a votar. Depois '
        + 'disso, cada voto os move, o que ainda pode denunciar quem votar mais tarde.',
      AFTER_CLOSING: 'Exibidos quando você encerra a votação. Até lá, todos veem apenas quantas pessoas votaram.',
    },
    ballotsBeforeResults: 'Votos necessários para exibir os resultados',

    optionOrder: 'Ordem das opções',
    orders: {
      ALPHABETICAL: 'De A a Z',
      SHUFFLED: 'Aleatória',
      AS_WRITTEN: 'Como escrita',
    },
    orderHints: {
      ALPHABETICAL: 'De A a Z, com números por valor: 2 antes de 10. Escreva as datas começando pelo ano, como 2026-10-24.',
      SHUFFLED: 'Uma nova ordem para cada pessoa a cada visita, para que nenhuma opção ganhe vantagem pela posição.',
      AS_WRITTEN: 'Sua ordem. As primeiras posições atraem mais apoio, então pode parecer uma tentativa de influenciar o resultado.',
    },

    deletedAfter: (days: number) => `As votações são excluídas ${days} dias após serem criadas, com seus votos.`,
    notForElections: <>
      <AppName /> é para decisões do dia a dia, não para votações oficiais ou vinculantes.{' '}
      <Link to="/privacy">Privacidade e limites</Link>
    </>,
    noNewPolls: 'Este servidor não aceita novas votações no momento.',
    creating: 'Criando…',
    create: 'Fazer a pergunta',

    problems: {
      titleMissing: 'Dê um título à sua votação.',
      titleTooLong: (max: number) => `Um título pode ter no máximo ${max} caracteres.`,
      titleInvisible: 'Um título só pode conter caracteres visíveis.',
      tooFewOptions: 'Adicione pelo menos duas opções.',
      tooManyOptions: (max: number) => `Uma votação pode ter no máximo ${max} opções.`,
      optionTooLong: (max: number) => `Uma opção pode ter no máximo ${max} caracteres.`,
      optionInvisible: 'Uma opção só pode conter caracteres visíveis.',
      optionTwice: (option: string) => `“${option}” aparece duas vezes. Cada opção deve ser diferente.`,
      resultsAfterBallots: (min: number) => `Escolha um número inteiro de votos, de pelo menos ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Assumindo esta votação…',
    deleted: 'Esta votação foi excluída',
    deletedText: 'Ela foi excluída, e seus resultados com ela.',
    notFound: 'Votação não encontrada',
    notFoundText: 'O link pode estar incompleto, ou a votação foi excluída.',
    notLoaded: 'Não foi possível carregar a votação',
    loadingPoll: 'Carregando a votação…',
    byInvitation: 'Com convite',
    optionOrder: { SHUFFLED: 'Opções aleatórias', ALPHABETICAL: 'Opções em ordem alfabética', AS_WRITTEN: 'Opções na ordem escrita' },
    closed: 'Encerrada',
    keepTitle: 'Guarde seu link de administração',
    keepText: 'Abra-o em outro navegador ou dispositivo para gerenciar esta votação de lá, em vez de daqui: encerrá-la, '
      + 'excluí-la, convidar pessoas. Guarde-o só para você: quem o tiver pode fazer o mesmo.',
    readyToInvite: <><strong>Sua votação está pronta.</strong> Convide as pessoas abaixo: cada uma recebe um link só seu.</>,
    readyToShare: <><strong>Sua votação está pronta.</strong> Compartilhe o link para receber votos.</>,
    closedAgo: (ago: string) => `A votação foi encerrada ${ago}. Estes são os resultados finais.`,
    deletedOn: (date: string) => `Esta votação e seus votos serão excluídos em ${date}.`,
    lastPoll: (wait: string) => `Essa foi a sua última votação por ora: você poderá criar mais em ${wait}.`,
    pollsLeft: (count: number, wait: string) => `Você pode criar ${counted(count, 'votação a mais', 'votações a mais')} nos próximos ${wait}.`,
    fairShare: (perDay: number) => `Para ser justo com todos, cada conexão pode criar ${perDay} votações por dia.`,
  },

  ballot: {
    yourBallot: 'Seu voto',
    withdraw: 'Retirar',
    submit: 'Enviar meu voto',
    rateEveryOption: 'Dê nota a todas as opções para enviar',
    submitting: 'Enviando…',
    majorityJudgmentLive: 'Dê uma menção a cada opção. As opções sem nota contam como Ruim.',
    majorityJudgmentEnvelope: 'Dê uma menção a cada opção e depois envie seu voto.',
    approval: 'Marque todas as opções com as quais você ficaria satisfeito.',
    invited: 'Seu convite vale um voto, que só este navegador pode alterar. Quem convidou você vê que ele foi usado, '
      + 'nunca o que você escolheu.',
    counted: 'Seu voto foi contado. Você pode alterá-lo deste navegador até a votação ser encerrada.',
    notVoted: 'Você ainda não votou.',
    hide: 'Ocultar meu voto',
    hidden: 'Seu voto foi contado e está oculto aqui: ninguém que olhe esta tela vê suas escolhas.',
    change: 'Alterar meu voto',
    invitationUsed: 'Este convite já foi usado, em outro navegador ou em outro dispositivo. Seu voto só pode ser '
      + 'alterado lá.',
    invitationNotValid: 'Este link de convite não é válido. Peça um novo a quem convidou você.',
    notInvited: 'Só pessoas convidadas podem votar nesta votação. Se você foi convidado, abra o link do seu convite.',
    yourName: 'Seu nome',
    namePlaceholder: 'Anônimo',
    namesGiven: 'Opcional. Todos veem os nomes informados, mas não as escolhas.',
    namesLive: 'Os resultados ao vivo podem dar pistas de quem escolheu o quê.',
    notRatedYet: 'Ainda sem nota',
    chooseAMention: 'Escolha uma menção…',
    optionsYouApprove: 'Opções que você aprova',
  },

  results: {
    heading: 'Resultados',
    ballots: (count: number) => counted(count, 'voto', 'votos'),
    noBallotsYet: 'Ainda não há votos. Os resultados vão se completando conforme chegam.',
    keptUntilBallots: (count: number) => `Os resultados aparecem quando houver ${count} votos, para que as escolhas `
      + 'das primeiras pessoas continuem sendo delas.',
    keptUntilYouClose: 'Os resultados aparecem quando você encerrar a votação.',
    keptUntilClosed: 'Os resultados aparecem quando a votação for encerrada.',
    download: 'Baixar os resultados',
    final: 'Finais',
    connecting: 'Conectando…',
    live: 'Ao vivo',
    reconnecting: 'Reconectando…',
    whoVoted: 'Quem votou',
    anonymousVoters: (count: number) => counted(count, 'pessoa anônima', 'pessoas anônimas'),
    andAnonymousVoters: (count: number) => `e ${counted(count, 'pessoa anônima', 'pessoas anônimas')}`,
    moreVoters: (count: number) => `e ${counted(count, 'pessoa a mais', 'pessoas a mais')}`,
    rank: (rank: number) => `Posição ${rank}`,
    approvals: (count: number) => counted(count, 'aprovação', 'aprovações'),
    noBallotsFor: (option: string) => `${option}: ainda sem votos`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Menção majoritária:',
    gmjScore: 'Pontuação GMJ:',
    gmjScoreTitle: (score: string) => `Pontuação do julgamento habitual do GMJ: ${score}. Ela desempata as opções com a `
      + 'mesma menção majoritária.',
    orBetter: (share: string, mention: string) => `${share} dizem ${mention} ou melhor`,
  },

  owner: {
    manage: 'Gerencie sua votação',
    adminLink: 'Link de administração da votação',
    adminLinkHint: 'Seu link de administração: abra-o em outro navegador ou dispositivo para gerenciar a votação de lá, '
      + 'em vez de daqui. Guarde-o só para você.',
    showAdminLink: 'Mostrar o link de administração',
    onlyThisBrowser: 'Só este navegador pode encerrar ou excluir esta votação antes da hora.',
    close: 'Encerrar a votação',
    delete: 'Excluir a votação',
    closeQuestion: 'Encerrar a votação de vez? Ninguém mais poderá votar nem alterar seu voto, e todos verão os '
      + 'resultados finais.',
    keepOpen: 'Mantê-la aberta',
    closeForGood: 'Encerrar de vez',
    deleteQuestion: 'Excluir esta votação e seus votos de vez? Quem a estiver acompanhando a verá desaparecer.',
    keep: 'Mantê-la',
    deleteForGood: 'Excluir de vez',
    deletedToast: 'A votação foi excluída.',
  },

  invitations: {
    heading: 'Convites',
    count: (count: number) => counted(count, 'convite', 'convites'),
    used: (used: number, count: number) => `${number(used)} de ${number(count)} usados`,
    hint: 'Só quem você convidar pode votar, cada pessoa com um link só seu, válido para um voto. Você vê quais links '
      + 'foram usados, nunca o que cada um escolheu. Você pode votar sem um.',
    invite: 'Convidar',
    inviting: 'Convidando…',
    inviteSomeone: 'Convidar alguém',
    namePlaceholder: 'Nome ou apelido (opcional)',
    loading: 'Carregando os convites…',
    showMore: 'Mostrar mais',
    newestShown: (count: number) => `Os ${number(count)} mais recentes são exibidos.`,
    invitationFor: (label: string) => `Convite para ${label}`,
    invitationNumber: (number: number) => `Convite ${number}`,
    shareHint: 'Só para esta pessoa. Vale um voto, que só o navegador de onde ela votar poderá alterar.',
    linkLabel: 'Link do convite',
    message: (title: string) => `Você foi convidado para votar em “${title}”. Este link é só seu.`,
    isUsed: 'Usado',
    notUsedYet: 'Ainda não usado',
    share: (name: string) => `Compartilhar o link de ${name}`,
    takeBack: (name: string) => `Retirar o link de ${name}`,
    takeBackQuestion: 'Retirar este convite? O link dele deixará de funcionar.',
    keep: 'Mantê-lo',
    takeItBack: 'Retirá-lo',
  },

  share: {
    share: 'Compartilhar',
    title: 'Compartilhar esta votação',
    anyone: 'Qualquer pessoa com o código ou o link pode votar.',
    unlisted: 'A votação não está listada em nenhum outro lugar.',
    linkLabel: 'Link da votação',
    joinCode: 'Código de acesso',
    toEnterAt: (host: string) => `para entrar em ${host}`,
    copy: 'Copiar',
    copied: 'Copiado',
    copyCode: 'Copiar o código de acesso',
    qrCode: (url: string) => `QR code de ${url}`,
    throughAnApp: 'Compartilhar por um aplicativo',
    byEmail: 'Enviar por e-mail',
    message: (title: string) => `Vote em “${title}”`,
    orCode: (code: string, host: string) => `Ou digite o código ${code} em ${host}.`,
  },

  statistics: {
    title: 'Estatísticas · super-vote',
    heading: <><AppName /> pelo mundo</>,
    lead: 'Quantas votações, votos e visitantes, quando e de onde.',
    show: 'Exibir',
    measures: {
      voters: {
        label: 'Visitantes', plural: 'visitantes',
        noun: (count: number) => plural('pt', count, 'visitante', 'visitantes'),
        count: (count: number) => counted(count, 'visitante', 'visitantes'),
      },
      polls: {
        label: 'Votações', plural: 'votações',
        noun: (count: number) => plural('pt', count, 'votação', 'votações'),
        count: (count: number) => counted(count, 'votação', 'votações'),
      },
      ballots: {
        label: 'Votos', plural: 'votos',
        noun: (count: number) => plural('pt', count, 'voto', 'votos'),
        count: (count: number) => counted(count, 'voto', 'votos'),
      },
    },
    totals: {
      polls: 'Votações criadas',
      openPolls: 'Abertas agora',
      ballots: 'Votos registrados',
      voters: 'Visitantes',
    },
    lastDays: 'Nos últimos 90 dias',
    where: 'Onde',
    byRegion: 'Por região',
    noRegion: 'Ainda não há nenhuma região.',
    tapADot: 'Toque num ponto para ver seus números.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Não exibidos em nenhuma região, por falta de fuso '
      + `horário ou de gente suficiente para exibir: ${visitors}, ${polls} e ${ballots}.`,
    howCounted: 'Como são contados',
    howCountedText: <>
      Um visitante é um navegador ou aplicativo que acessou o <AppName />: uma pessoa com dois dispositivos conta duas
      vezes. Um voto conta uma só vez, por mais que quem o deu o altere.
    </>,
    places: (updated: string) => 'Os lugares vêm do fuso horário configurado no seu dispositivo, nunca do seu endereço, e '
      + 'só totais são guardados. Um lugar aparece quando três visitantes vêm dele. Os números são atualizados a cada '
      + 'hora, para que não possam ser associados aos votos de uma votação conforme chegam. '
      + `Última atualização: ${updated}.`,
    sources: <>
      Cada ponto é a cidade que dá nome a um fuso horário e representa todas as pessoas desse fuso. Os dias são em UTC.
      Terras do <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>, fusos
      horários do <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">banco de dados da IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} em {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} nos últimos ${days} dias`,
    busiest: (day: string, count: string) => `, o maior número em ${day}: ${count}.`,
    topLine: (count: string) => `Maior número: ${count}`,
    regionAndCity: 'Região e cidade',
    map: (what: string) => `Mapa-múndi de ${what} por fuso horário. A tabela abaixo lista os mesmos números.`,
    zoomIn: 'Aumentar o zoom',
    zoomOut: 'Diminuir o zoom',
    nothingYet: 'Ainda não há nenhum lugar para exibir.',
    fewer: 'menos',
    upTo: (count: string) => `até ${count}`,
    pollPlaces: 'De onde vêm os votos',
    pollPlacesNone: 'Uma região aparece quando três votos vêm dela.',
    pollPlacesHint: 'Segundo o fuso horário de cada pessoa que vota, nunca o endereço. Um lugar aparece quando três '
      + 'votos vêm dele, e os números são atualizados a cada hora.',
    regions: {
      Africa: 'África',
      America: 'As Américas',
      Antarctica: 'Antártida',
      Arctic: 'Ártico',
      Asia: 'Ásia',
      Atlantic: 'Ilhas do Atlântico',
      Australia: 'Austrália',
      Europe: 'Europa',
      Indian: 'Oceano Índico',
      Pacific: 'Pacífico',
    } as Record<string, string>,
  },

  about: {
    title: 'Sobre · super-vote',
    heading: <>Sobre o <AppName /></>,
    lead: (days: number) => <>
      Um jeito gratuito e de código aberto de um grupo decidir junto: onde comer, aonde ir, o que escolher. Sem conta,
      sem anúncios, sem rastreamento. As votações são excluídas {days} dias após serem criadas.
    </>,
    howDecided: 'Como os resultados são decididos',
    howDecidedText: <>
      Uma escolha única joga fora a maior parte do que as pessoas pensam: opções parecidas dividem seus apoiadores, e
      uma que quase todos acham boa pode perder para outra de que metade do grupo não gosta. O <AppName /> pede mais, de
      duas maneiras.
    </>,
    majorityJudgment: 'Julgamento majoritário',
    majorityJudgmentText: <>
      Cada pessoa dá nota a cada opção, de <em>Excelente</em> a <em>Ruim</em>. A <strong>menção majoritária</strong> de
      uma opção é a melhor nota que mais da metade dos votantes lhe dá, ou uma superior: a sua mediana. Vence a opção
      com a melhor menção majoritária. Quando várias a compartilham, a <strong>pontuação GMJ</strong> decide entre
      elas: ela mede quanto as notas pendem acima ou abaixo dessa menção. As opções ainda empatadas aparecem{' '}
      <em>ex aequo</em>, e nenhuma regra oculta escolhe uma.
    </>,
    approval: 'Voto por aprovação',
    approvalText: 'Cada pessoa marca todas as opções com as quais ficaria satisfeita. Vence a opção aprovada por mais '
      + 'votantes. É rápido, e nunca penaliza você por apoiar mais de uma opção.',
    science: 'A ciência por trás',
    scienceText: 'Nenhuma regra de votação é perfeita: Condorcet viu em 1785 que um grupo pode preferir A a B, B a C e C '
      + 'a A, e toda regra razoável pode ser manipulada. Dar notas em vez de ordenar contorna boa parte do problema, '
      + 'como sabem os jurados de vinhos e de patinação artística.',
    notes: {
      pnas2007: 'Apresenta o julgamento majoritário: dar notas e ordenar pela mediana.',
      book2011: 'O livro: a teoria, suas propriedades, e eleições e júris reais.',
      judge2014: 'Por que dar notas evita os paradoxos de ordenar, e resiste à manipulação.',
      fabre2021: <>A pontuação do “julgamento habitual” que o <AppName /> usa para desempatar menções majoritárias iguais.</>,
      brams1978: 'Em defesa de aprovar todas as opções aceitáveis.',
      laslier2009: 'Como as pessoas votam estrategicamente no voto por aprovação, e no que dá.',
      gibbard1973: 'Com Satterthwaite: toda regra de votação razoável pode ser manipulada. A questão é quanto.',
      satterthwaite1975: 'O mesmo resultado, encontrado de forma independente.',
    },
    whoMakesIt: 'Quem faz',
    whoMakesItText: <>
      O <AppName /> é feito por uma só pessoa em Quebec, no tempo livre, e é gratuito para todos. Seu código é aberto:
      qualquer um pode ler como os votos são contados, rodar a própria cópia ou sugerir uma mudança.
    </>,
    seeTheCode: 'Ver o código-fonte no GitHub',
  },

  privacy: {
    title: 'Privacidade e limites · super-vote',
    heading: 'Privacidade e limites',
    lead: <>
      O <AppName /> foi feito para que ninguém possa saber o que você escolheu. Aqui está o que ele guarda, quem vê o
      quê e o que ele ainda não consegue fazer.
    </>,

    forWhat: 'Para que serve',
    forWhatText: 'Decidir junto entre pessoas que confiam umas nas outras: amigos, família, uma equipe, uma turma, uma '
      + 'associação. Não é adequado para eleições, nem para qualquer votação com consequências legais, financeiras ou '
      + 'oficiais: essas exigem que cada votante seja identificado e contado uma só vez, e resultados que qualquer '
      + 'pessoa possa verificar, o que o super-vote ainda não pode prometer.',

    kept: 'O que é guardado, e por quanto tempo',
    keptItems: (days: number) => [
      `Uma votação: sua pergunta, suas opções e suas configurações, até ser excluída, no máximo ${days} dias após ser `
        + 'criada. Quem a criou pode excluí-la antes.',
      'Seu voto numa votação, guardado sob uma chave que não diz quem você é, e excluído com a votação. Você pode '
        + 'retirá-lo até a votação ser encerrada.',
      'O nome que você informa, nas votações que mostram nomes, guardado à parte do seu voto para que nada ligue os dois.',
      'Cópias das votações, votos e nomes acima, feitas toda noite para recuperação em caso de acidente e guardadas '
        + 'por 7 dias: o que é excluído some delas em até uma semana.',
      `Um identificador aleatório num cookie, para que este navegador possa alterar seus votos e gerenciar suas votações, `
        + `por ${days} dias após seu último voto ou votação, enquanto uma votação durar. É o único cookie: sem `
        + 'publicidade, sem análise de uso, sem rastreamento.',
      'O fuso horário do seu dispositivo (Europe/Paris, por exemplo), somado às estatísticas apenas como totais. Nunca o seu endereço.',
      'O endereço da sua rede, mantido na memória por no máximo um dia, para limitar quantas votações cada rede cria. '
        + 'Nunca é gravado.',
      'Suas configurações e o último nome que você informou, apenas neste navegador.',
      'Tudo o que o servidor guarda fica numa única máquina em Montreal, no Canadá, país que a União Europeia '
        + 'reconhece como protetor adequado de dados pessoais.',
    ],

    whoSees: 'Quem vê o quê',
    whoSeesItems: [
      'Todas as pessoas de uma votação veem os resultados em totais, quando quem a criou escolheu exibi-los, e os '
        + 'nomes que os votantes quiseram informar.',
      'Quem criou uma votação vê o mesmo, e quais convites foram usados: nunca o que cada um escolheu.',
      'Ninguém vê o seu voto. Nem na sua própria tela: depois de contado, ele começa oculto.',
      'Quem administra o servidor vê os pedidos à medida que acontecem. O que fica guardado não diz quem escolheu o quê, '
        + 'mas o super-vote não esconde os votos do servidor em funcionamento: confia-se que quem o administra não olhe.',
    ],

    limits: 'Limites que vale conhecer',
    limitsItems: [
      'Sem convites, uma pessoa pode votar várias vezes de navegadores ou dispositivos diferentes. O super-vote conta '
        + 'com a boa-fé, e o número de votos revela o abuso. Para contar cada pessoa uma só vez, convide-a.',
      'Seus votos e suas votações pertencem a este navegador. De outro dispositivo, ou depois de apagar os dados dele, você '
        + 'não poderá mais alterá-los nem gerenciá-los, e não há conta para recuperá-los.',
      'Os resultados ao vivo se movem a cada voto que chega: num grupo pequeno, quem acompanha pode deduzir quem '
        + 'escolheu o quê. Quem cria uma votação escolhe quando os resultados aparecem, e é avisado.',
      'A contagem não pode ser verificada de forma independente: você confia no servidor, cujo código é aberto para '
        + 'qualquer um ler.',
      'O super-vote é gratuito e roda num servidor pequeno: pode ficar indisponível às vezes. Não dependa dele para '
        + 'nada urgente.',
    ],

    rights: 'Seus dados, suas escolhas',
    rightsText: 'Seus votos não estão ligados a você, então o super-vote não consegue encontrá-los por você: retire um '
      + 'voto, ou exclua uma votação que você criou, a partir deste navegador. Apagar os dados deste navegador para o '
      + 'super-vote remove seu cookie e suas configurações.',
    contact: <>
      Dúvidas, um pedido sobre seus dados ou uma votação a denunciar:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">escreva para nós no
      GitHub</a>. Para uma falha de segurança, veja a{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">política de
      segurança</a>.
    </>,
    openSource: <>
      Nada disso precisa ser aceito na confiança: o código do <AppName />, inclusive a contagem e a proteção dos votos,
      é <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">aberto para qualquer
      pessoa ler</a>.
    </>,
  },

  legal: {
    title: 'Aviso legal · super-vote',
    heading: 'Aviso legal',
    publisher: 'Editor',
    publisherText: <>
      O <AppName /> é publicado por uma pessoa física em Quebec, Canadá, sem fins comerciais. Seu nome e endereço não
      constam aqui: a hospedagem os tem.
    </>,
    law: 'Lei aplicável',
    lawText: <>
      O <AppName /> é publicado a partir de Quebec, sob as leis de Quebec e do Canadá. Está aberto a pessoas de todo o
      mundo, e quem cria uma votação ou vota numa também responde às leis do lugar onde está. O que o <AppName /> guarda
      sobre você, e por quê, é igual para todos, onde quer que estejam:{' '}
      <Link to="/privacy">Privacidade e limites</Link>.
    </>,
    host: 'Hospedagem',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Canadá',
    ],
    hostPhone: (phone: ReactNode) => <>Telefone: {phone}</>,
    report: 'Denunciar uma votação',
    reportText: <>
      As votações são escritas por quem as cria. Para denunciar uma que infrinja a lei, pelo título, pelas opções ou
      pelo nome de um votante:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">escreva para nós no
      GitHub</a>. Toda denúncia é examinada com rapidez, e o que for ilegal é removido.
    </>,
  },
};
