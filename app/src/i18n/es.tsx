/**
 * Everything the web app says, in Spanish: en.tsx, translated. Neutral
 * Spanish, understood from Spain to Latin America; voters are addressed as
 * «tú», and a poll is a «votación», a ballot a «voto».
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('es', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('es', count, one, other)}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return unit === 'minute' ? counted(count, 'minuto', 'minutos') : counted(count, 'hora', 'horas');
}

export const es: Messages = {
  number,
  percent: (share: number) => formatPercent('es', share),
  decimal: (value: number, digits: number) => formatDecimal('es', value, digits),
  date: (isoDate: string) => formatDate('es', isoDate),
  moment: (isoDate: string) => formatMoment('es', isoDate),
  day: (day: string) => formatUtcDay('es', day),
  timeAgo: (isoDate: string) => timeAgo('es', isoDate) ?? 'ahora mismo',
  waitUntil: inWords,

  loading: 'Cargando…',
  backHome: 'Volver al inicio',
  tryAgain: 'Reintentar',
  close: 'Cerrar',
  dismiss: 'Descartar',

  errors: {
    unexpected: 'Algo salió mal. Inténtalo de nuevo.',
    unreachable: 'No se puede acceder al servidor. Comprueba tu conexión e inténtalo de nuevo.',
    failed: (status: number) => `Algo salió mal (error ${status}). Inténtalo de nuevo.`,
  },

  problems: {
    'unknown-voter': 'Este navegador no es uno que super-vote conozca. Recarga la página para empezar de cero.',
    'not-poll-creator': 'Solo quien creó la votación puede hacer eso.',
    'not-invited': 'Solo las personas invitadas pueden votar en esta votación. Si te invitaron, abre el enlace de tu invitación.',
    'not-admin-link': 'Este enlace de administración no es el de esta votación. Comprueba que se copió completo.',
    'handover-unavailable': 'Este enlace no puede transferir la votación: ya se usó.',
    'cross-site': 'Esta solicitud venía de otro sitio web y fue rechazada. Abre super-vote directamente.',
    'poll-not-found': 'Ninguna votación tiene este enlace o este código. Puede que esté mal escrito, o que la votación se haya eliminado.',
    'poll-closed': 'Esta votación está cerrada: ya no acepta más votos.',
    'invitation-used': 'Alguien ya votó con esta invitación, en otro navegador o en otro dispositivo.',
    'collision': 'Ese cambio chocó con otro hecho en el mismo momento. Inténtalo de nuevo.',
    'too-many-polls': (wait: string) => 'Esta conexión ya ha creado sus votaciones de hoy. Para ser justos con todo el mundo, '
      + `cada una puede crear unas pocas al día: podrás crear más dentro de ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Demasiados códigos erróneos desde esta conexión: para proteger las votaciones '
      + `de quienes intentan adivinarlas, sus códigos se rechazarán durante ${wait}. Los enlaces siguen funcionando.`,
    'server-error': 'Algo salió mal de nuestro lado. Inténtalo de nuevo en un momento.',
  },

  mentions: {
    Excellent: 'Excelente',
    VeryGood: 'Muy bueno',
    Good: 'Bueno',
    Fair: 'Aceptable',
    Passable: 'Pasable',
    Inadequate: 'Insuficiente',
    Bad: 'Malo',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Juicio mayoritario',
    APPROVAL: 'Voto por aprobación',
  },

  visibilities: {
    PUBLIC: 'Pública',
    UNLISTED: 'Privada',
  },

  app: {
    home: 'Inicio',
    settings: 'Ajustes',
    footer: <><AppName /> es gratuito y de código abierto.</>,
    footerLinks: 'Acerca de super-vote',
    about: 'Acerca de y la ciencia detrás',
    privacy: 'Privacidad y límites',
    legal: 'Aviso legal',
    statistics: 'Estadísticas',
    sourceCode: 'Código fuente',
    notFound: 'Página no encontrada',
    nothingHere: 'No hay nada en esta dirección.',
  },

  settings: {
    language: 'Idioma',
    appearance: 'Apariencia',
    light: 'Claro',
    automatic: 'Automático',
    dark: 'Oscuro',
    mentionColours: 'Colores de las menciones',
    greenToRed: 'De verde a rojo',
    shadesOfGrey: 'Tonos de gris',
    shadesOfGreyHint: 'Los tonos de gris se leen igual veas los colores que veas: cuanto más claro, mejor.',
    majorityJudgmentBallot: 'Voto por juicio mayoritario',
    colourScale: 'Escala de colores',
    dropdowns: 'Listas desplegables',
    castingYourBallot: 'Emitir tu voto',
    live: 'Al instante',
    envelope: 'Sobre',
    liveHint: 'Cada cambio cuenta en el momento en que lo haces.',
    envelopeHint: 'Rellena tu voto y envíalo de una vez.',
  },

  home: {
    title: 'super-vote · decidir juntos',
    lead: 'Las matemáticas dicen que es más justo.',
    createQuestion: '¿Necesitas organizar una votación?',
    createPoll: '¡Decidamos juntos!',
    yourPolls: 'Decidir juntos…',
    publicPolls: 'Votaciones públicas',
    noPublicPolls: 'Aún no hay votaciones públicas.',
    public: 'Pública',
    closed: 'Cerrada',

    howItWorks: 'Cómo funciona',
    steps: [
      { title: 'Pregunta', text: 'Una pregunta y sus opciones.' },
      { title: 'Comparte', text: 'Un enlace, un código QR o un código.' },
      { title: 'Decide', text: 'Todos puntúan y los resultados llegan en directo.' },
    ],

    agent: {
      title: 'Listo para la IA',
      text: 'Pega esto en un asistente que pueda navegar por la web, con tu propia pregunta.',
      prompt: (site: string, guide: string) => `Usa ${site} para crear una votación para mi equipo (instrucciones para `
        + `agentes: ${guide}). La pregunta: “¿Dónde hacemos el retiro del equipo?” Las opciones: Lisboa, Berlín, `
        + 'Barcelona. Usa el juicio mayoritario y mantén los resultados ocultos hasta que yo cierre la votación. '
        + 'Transfiéreme la votación y luego dame el enlace para compartir con el equipo.',
      copy: 'Copiar el texto',
      copied: 'Texto copiado',
      caption: 'Responde con dos enlaces: abre el primero para hacer tuya la votación y envía el segundo al grupo.',
    },

    systems: {
      title: 'Dos formas de decidir',
      majorityJudgment: {
        title: 'Juicio mayoritario',
        text: 'Puntúa cada opción de Excelente a Malo. Gana la mejor mención mayoritaria.',
      },
      approval: {
        title: 'Aprobación',
        text: 'Marca todas las opciones que aceptarías. Gana la más marcada.',
      },
    },

    compare: {
      title: 'Más justo que la mayoría de las elecciones oficiales',
      text: 'La mayoría de las elecciones piden un solo nombre. Los candidatos parecidos se reparten a sus votantes, '
        + 'y uno que la mayoría rechaza aún puede ganar. El juicio mayoritario, fruto de la investigación de Michel '
        + 'Balinski y Rida Laraki, mide en cambio lo que todos piensan de cada opción.',
      science: 'La ciencia detrás',
      single: 'Una sola opción',
      singleNote: 'la mayoría de las elecciones',
      approval: 'Aprobación',
      majorityJudgment: 'Juicio mayoritario',
      criteria: {
        nuance: 'Di lo que piensas de cada opción',
        splitting: 'Las opciones parecidas no dividen el voto',
        lesserEvil: 'Sin votar al mal menor',
        tactics: 'Difícil de manipular',
        quick: 'Rápido de rellenar',
        familiar: 'Conocido',
      },
      marks: { yes: 'Sí', partly: 'En parte', no: 'No' },
      caption: <><AppName /> ofrece aprobación y juicio mayoritario. Ninguna regla de votación es perfecta, pero algunas
        son mucho más justas que otras.</>,
    },

    supportTitle: 'Gratis, de código abierto y sin anuncios',
    supportText: 'Tú no eres el producto: el objetivo es promover mejores sistemas de votación. Hecho por una sola '
      + 'persona, en su tiempo libre. Si ayudó a tu grupo a decidir, tú puedes ayudarlo a él.',

    limitsTitle: 'Conviene saber',
    limits: {
      everyday: <><strong>Para decisiones cotidianas,</strong> no elecciones oficiales: sin cuentas, alguien puede
        votar de nuevo desde otro navegador. Las invitaciones cuentan a cada persona una sola vez.</>,
      private: <><strong>Privado, pero no oculto para el servidor.</strong> Nadie más ve tu voto, y los votos
        conservados no dicen quién los emitió.</>,
      browser: (days: number) => <><strong>Ligado a este navegador,</strong> mediante una sola cookie, conservada {days} días
        después de tu último voto o votación. Sin anuncios, sin seguimiento.</>,
      deleted: (days: number) => <><strong>Se elimina a los {days} días,</strong> tanto las votaciones como los votos.</>,
      disclaimer: <><strong>Sin garantía.</strong> <AppName /> promueve mejores formas de votar. Lo hace una sola persona,
        con el mayor cuidado en seguridad, privacidad, rendimiento, arquitectura y calidad del código, pero no está
        acreditado, auditado ni revisado de forma independiente: no se garantiza que sus resultados sean exactos ni
        una representación fiel de la voluntad de un grupo. Eso exigiría acreditación, revisión técnica por expertos y
        un soporte continuo que una sola persona no puede ofrecer sin patrocinadores ni expertos.</>,
    },
    limitsLink: 'Todo sobre privacidad y límites',
  },
  join: {
    label: '¿Tienes un código?',
    typeTheCode: 'Escribe el código que te dieron.',
    notACode: 'Un código tiene seis letras y cifras, como K7M-4QX.',
    joining: 'Entrando…',
    join: '¡Votar!',
  },

  newPoll: {
    title: 'Decidir juntos · super-vote',
    heading: 'Decidir juntos',
    question: 'Pregunta',
    questionPlaceholder: '¿Dónde cenamos el viernes?',
    options: 'Opciones',
    option: (row: number) => `Opción ${row}`,
    remove: (option: string) => `Quitar ${option}`,
    optionsHint: (max: number) => `Hasta ${max} opciones. Aparece una fila nueva a medida que escribes.`,

    votingSystem: 'Sistema de votación',
    systems: {
      MAJORITY_JUDGMENT: 'Juicio mayoritario',
      APPROVAL: 'Aprobación',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Cada persona puntúa todas las opciones de Excelente a Malo. Gana la opción que una mayoría '
        + 'puntúa mejor: matizado y difícil de manipular.',
      APPROVAL: 'Cada persona marca todas las opciones que aceptaría. Gana la opción más aprobada: rápido y sencillo.',
    },

    whoCanFindIt: 'Quién puede encontrarla',
    visibilityHints: {
      PUBLIC: 'Aparece en la página de inicio, para que cualquiera la encuentre.',
      UNLISTED: 'No aparece en ningún sitio: solo la encuentran las personas con quienes compartas el enlace o el código.',
    },

    whoCanVote: 'Quién puede votar',
    anyone: 'Cualquiera',
    invitedOnly: 'Solo con invitación',
    anyoneHint: <>
      Cualquiera con el enlace o el código. Quien se empeñe puede votar de nuevo desde otro navegador: para contar a
      cada persona una sola vez, invítala.
    </>,
    invitedHint: 'Cada persona recibe un enlace propio, válido para un voto. Ves qué enlaces se usaron, nunca lo que '
      + 'eligió cada quien.',

    whoVoted: 'Quién votó',
    anonymous: 'Anónimo',
    showNames: 'Mostrar nombres',
    anonymousHint: 'Nadie ve quién votó, solo cuántas personas lo hicieron.',
    showNamesHint: 'Quienes voten pueden dar un nombre, que se muestra bajo los resultados. Nadie ve quién eligió qué.',

    results: 'Resultados',
    resultsChoices: {
      LIVE: 'En directo',
      AFTER_BALLOTS: 'Diferidos',
      AFTER_CLOSING: 'Al cierre',
    },
    resultsHints: {
      LIVE: 'Cuidado: todo el mundo ve cómo cada voto mueve los resultados. En un grupo pequeño, eso deja ver quién eligió qué.',
      AFTER_BALLOTS: 'Ocultos hasta que lleguen tantos votos, para proteger a las primeras personas que votan. Después, '
        + 'cada voto los mueve, lo que aún puede delatar a quien vote más tarde.',
      AFTER_CLOSING: 'Se muestran cuando cierras la votación. Hasta entonces, todos ven solo cuántas personas votaron.',
    },
    ballotsBeforeResults: 'Votos necesarios para mostrar los resultados',

    optionOrder: 'Orden de las opciones',
    orders: {
      ALPHABETICAL: 'De la A a la Z',
      SHUFFLED: 'Aleatorio',
      AS_WRITTEN: 'Como se escribió',
    },
    orderHints: {
      ALPHABETICAL: 'De la A a la Z, con los números por valor: 2 antes que 10. Escribe las fechas empezando por el año, como 2026-10-24.',
      SHUFFLED: 'Un orden nuevo para cada persona en cada visita, para que ninguna opción gane por su posición.',
      AS_WRITTEN: 'Tu orden. Los primeros puestos atraen más apoyo, así que puede parecer un intento de influir en el resultado.',
    },

    deletedAfter: (days: number) => `Las votaciones se eliminan ${days} días después de crearse, con sus votos.`,
    notForElections: <>
      <AppName /> es para decisiones cotidianas, no para votaciones oficiales ni vinculantes.{' '}
      <Link to="/privacy">Privacidad y límites</Link>
    </>,
    noNewPolls: 'Este servidor no acepta votaciones nuevas por el momento.',
    creating: 'Creando…',
    create: 'Plantear la pregunta',

    problems: {
      titleMissing: 'Ponle un título a tu votación.',
      titleTooLong: (max: number) => `Un título puede tener como máximo ${max} caracteres.`,
      titleInvisible: 'Un título solo puede contener caracteres visibles.',
      tooFewOptions: 'Añade al menos dos opciones.',
      tooManyOptions: (max: number) => `Una votación puede tener como máximo ${max} opciones.`,
      optionTooLong: (max: number) => `Una opción puede tener como máximo ${max} caracteres.`,
      optionInvisible: 'Una opción solo puede contener caracteres visibles.',
      optionTwice: (option: string) => `“${option}” aparece dos veces. Cada opción debe ser distinta.`,
      resultsAfterBallots: (min: number) => `Elige un número entero de votos, de al menos ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Asumiendo esta votación…',
    deleted: 'Esta votación se eliminó',
    deletedText: 'Se eliminó, y sus resultados con ella.',
    notFound: 'Votación no encontrada',
    notFoundText: 'Puede que el enlace esté incompleto, o que la votación se haya eliminado.',
    notLoaded: 'No se pudo cargar la votación',
    loadingPoll: 'Cargando la votación…',
    byInvitation: 'Con invitación',
    optionOrder: { SHUFFLED: 'Opciones aleatorias', ALPHABETICAL: 'Opciones ordenadas', AS_WRITTEN: 'Opciones en el orden escrito' },
    closed: 'Cerrada',
    keepTitle: 'Guarda tu enlace de administración',
    keepText: 'Ábrelo en otro navegador o dispositivo para gestionar esta votación desde allí en lugar de desde aquí: '
      + 'cerrarla, eliminarla, invitar a gente. Guárdalo para ti: quien lo tenga puede hacer lo mismo.',
    readyToInvite: <><strong>Tu votación está lista.</strong> Invita a la gente más abajo: cada persona recibe un enlace propio.</>,
    readyToShare: <><strong>Tu votación está lista.</strong> Comparte su enlace para recoger votos.</>,
    closedAgo: (ago: string) => `La votación se cerró ${ago}. Estos son los resultados finales.`,
    deletedOn: (date: string) => `Esta votación y sus votos se eliminarán el ${date}.`,
    lastPoll: (wait: string) => `Esa fue tu última votación por ahora: podrás crear más dentro de ${wait}.`,
    pollsLeft: (count: number, wait: string) => `Puedes crear ${counted(count, 'votación más', 'votaciones más')} en los próximos ${wait}.`,
    fairShare: (perDay: number) => `Para ser justos con todo el mundo, cada conexión puede crear ${perDay} votaciones al día.`,
  },

  ballot: {
    yourBallot: 'Tu voto',
    withdraw: 'Retirar',
    submit: 'Enviar mi voto',
    rateEveryOption: 'Puntúa todas las opciones para enviar',
    submitting: 'Enviando…',
    majorityJudgmentLive: 'Da una mención a cada opción. Las opciones que no hayas puntuado cuentan como Malo.',
    majorityJudgmentEnvelope: 'Da una mención a cada opción y luego envía tu voto.',
    approval: 'Marca todas las opciones con las que estarías contento.',
    invited: 'Tu invitación vale para un voto, que solo este navegador puede cambiar. Quien te invitó ve que se usó, '
      + 'nunca lo que elegiste.',
    counted: 'Tu voto está contado. Puedes cambiarlo desde este navegador hasta que se cierre la votación.',
    notVoted: 'Aún no has votado.',
    hide: 'Ocultar mi voto',
    hidden: 'Tu voto está contado y oculto aquí: nadie que mire esta pantalla ve tus elecciones.',
    change: 'Cambiar mi voto',
    invitationUsed: 'Esta invitación ya se usó, en otro navegador o en otro dispositivo. Su voto solo se puede cambiar '
      + 'allí.',
    invitationNotValid: 'Este enlace de invitación no es válido. Pide uno nuevo a quien te invitó.',
    notInvited: 'Solo las personas invitadas pueden votar en esta votación. Si te invitaron, abre el enlace de tu invitación.',
    yourName: 'Tu nombre',
    namePlaceholder: 'Anónimo',
    namesGiven: 'Opcional. Todos ven los nombres dados, pero no sus elecciones.',
    namesLive: 'Los resultados en directo pueden dar pistas sobre quién eligió qué.',
    notRatedYet: 'Sin puntuar aún',
    chooseAMention: 'Elige una mención…',
    optionsYouApprove: 'Opciones que apruebas',
  },

  results: {
    heading: 'Resultados',
    ballots: (count: number) => counted(count, 'voto', 'votos'),
    noBallotsYet: 'Aún no hay votos. Los resultados se completan a medida que llegan.',
    keptUntilBallots: (count: number) => `Los resultados se muestran cuando lleguen ${count} votos, para que las `
      + 'elecciones de las primeras personas sigan siendo suyas.',
    keptUntilYouClose: 'Los resultados se muestran cuando cierres la votación.',
    keptUntilClosed: 'Los resultados se muestran cuando se cierre la votación.',
    download: 'Descargar los resultados',
    final: 'Finales',
    connecting: 'Conectando…',
    live: 'En directo',
    reconnecting: 'Reconectando…',
    whoVoted: 'Quién votó',
    anonymousVoters: (count: number) => counted(count, 'persona anónima', 'personas anónimas'),
    andAnonymousVoters: (count: number) => `y ${counted(count, 'persona anónima', 'personas anónimas')}`,
    moreVoters: (count: number) => `y ${counted(count, 'persona más', 'personas más')}`,
    rank: (rank: number) => `Puesto ${rank}`,
    approvals: (count: number) => counted(count, 'aprobación', 'aprobaciones'),
    noBallotsFor: (option: string) => `${option}: aún sin votos`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Mención mayoritaria:',
    gmjScore: 'Puntuación GMJ:',
    gmjScoreTitle: (score: string) => `Puntuación del juicio habitual de GMJ: ${score}. Desempata las opciones con la `
      + 'misma mención mayoritaria.',
    orBetter: (share: string, mention: string) => `${share} dicen ${mention} o mejor`,
  },

  owner: {
    manage: 'Gestiona tu votación',
    adminLink: 'Enlace de administración de la votación',
    adminLinkHint: 'Tu enlace de administración: ábrelo en otro navegador o dispositivo para gestionar la votación desde '
      + 'allí en lugar de desde aquí. Guárdalo para ti.',
    showAdminLink: 'Mostrar el enlace de administración',
    onlyThisBrowser: 'Solo este navegador puede cerrar o eliminar esta votación antes de tiempo.',
    close: 'Cerrar la votación',
    delete: 'Eliminar la votación',
    closeQuestion: '¿Cerrar la votación para siempre? Nadie podrá votar ni cambiar su voto, y todos verán los '
      + 'resultados finales.',
    keepOpen: 'Mantenerla abierta',
    closeForGood: 'Cerrar para siempre',
    deleteQuestion: '¿Eliminar esta votación y sus votos para siempre? Quienes la estén viendo la verán desaparecer.',
    keep: 'Conservarla',
    deleteForGood: 'Eliminar para siempre',
    deletedToast: 'Se eliminó la votación.',
  },

  invitations: {
    heading: 'Invitaciones',
    count: (count: number) => counted(count, 'invitación', 'invitaciones'),
    used: (used: number, count: number) => `${number(used)} de ${number(count)} usadas`,
    hint: 'Solo pueden votar las personas que invites, cada una con un enlace propio, válido para un voto. Ves qué '
      + 'enlaces se usaron, nunca lo que eligió cada quien. Tú puedes votar sin uno.',
    invite: 'Invitar',
    inviting: 'Invitando…',
    inviteSomeone: 'Invitar a alguien',
    namePlaceholder: 'Nombre o apodo (opcional)',
    loading: 'Cargando las invitaciones…',
    showMore: 'Mostrar más',
    newestShown: (count: number) => `Se muestran las ${number(count)} más recientes.`,
    invitationFor: (label: string) => `Invitación para ${label}`,
    invitationNumber: (number: number) => `Invitación ${number}`,
    shareHint: 'Solo para esta persona. Vale para un voto, que solo el navegador desde el que vote podrá cambiar.',
    linkLabel: 'Enlace de la invitación',
    isUsed: 'Usada',
    notUsedYet: 'Aún sin usar',
    message: (title: string) => `Estás invitado o invitada a votar en “${title}”. Este enlace es solo para ti.`,
    share: (name: string) => `Compartir el enlace de ${name}`,
    takeBack: (name: string) => `Retirar el enlace de ${name}`,
    takeBackQuestion: '¿Retirar esta invitación? Su enlace dejará de funcionar.',
    keep: 'Conservarla',
    takeItBack: 'Retirarla',
  },

  share: {
    share: 'Compartir',
    title: 'Compartir esta votación',
    anyone: 'Cualquiera con el código o el enlace puede votar.',
    unlisted: 'La votación no aparece en ningún otro sitio.',
    linkLabel: 'Enlace de la votación',
    joinCode: 'Código para entrar',
    toEnterAt: (host: string) => `para entrar en ${host}`,
    copy: 'Copiar',
    copied: 'Copiado',
    copyCode: 'Copiar el código para entrar',
    qrCode: (url: string) => `Código QR de ${url}`,
    throughAnApp: 'Compartir con una aplicación',
    byEmail: 'Enviar por correo electrónico',
    message: (title: string) => `Vota en “${title}”`,
    orCode: (code: string, host: string) => `O introduce el código ${code} en ${host}.`,
  },

  statistics: {
    title: 'Estadísticas · super-vote',
    heading: <><AppName /> en el mundo</>,
    lead: 'Cuántas votaciones, votos y visitantes, cuándo y desde dónde.',
    show: 'Mostrar',
    measures: {
      voters: {
        label: 'Visitantes', plural: 'visitantes',
        noun: (count: number) => plural('es', count, 'visitante', 'visitantes'),
        count: (count: number) => counted(count, 'visitante', 'visitantes'),
      },
      polls: {
        label: 'Votaciones', plural: 'votaciones',
        noun: (count: number) => plural('es', count, 'votación', 'votaciones'),
        count: (count: number) => counted(count, 'votación', 'votaciones'),
      },
      ballots: {
        label: 'Votos', plural: 'votos',
        noun: (count: number) => plural('es', count, 'voto', 'votos'),
        count: (count: number) => counted(count, 'voto', 'votos'),
      },
    },
    totals: {
      polls: 'Votaciones creadas',
      openPolls: 'Abiertas ahora',
      ballots: 'Votos emitidos',
      voters: 'Visitantes',
    },
    lastDays: 'En los últimos 90 días',
    where: 'Dónde',
    byRegion: 'Por región',
    noRegion: 'Aún no hay ninguna región.',
    tapADot: 'Toca un punto para ver sus cifras.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'No se muestran en ninguna región, por falta de zona '
      + `horaria o de gente suficiente para mostrarlas: ${visitors}, ${polls} y ${ballots}.`,
    howCounted: 'Cómo se cuentan',
    howCountedText: <>
      Un visitante es un navegador o una aplicación que entró en <AppName />: una persona con dos dispositivos cuenta
      dos veces. Un voto cuenta una sola vez, por muchas veces que quien lo emite lo cambie.
    </>,
    places: (updated: string) => 'Los lugares salen de la zona horaria de tu dispositivo, nunca de tu dirección, y solo '
      + 'se guardan totales. Un lugar aparece cuando tres visitantes vienen de él. Las cifras se actualizan cada hora, '
      + 'para que no se puedan relacionar con los votos de una votación a medida que llegan. '
      + `Última actualización: ${updated}.`,
    sources: <>
      Cada punto es la ciudad que da nombre a una zona horaria y representa a todas las personas de esa zona. Los días
      son en UTC. Tierra de <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>,
      zonas horarias de la <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">base de datos de la IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} el {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} en los últimos ${days} días`,
    busiest: (day: string, count: string) => `, la mayor cifra el ${day}: ${count}.`,
    topLine: (count: string) => `Cifra máxima: ${count}`,
    regionAndCity: 'Región y ciudad',
    map: (what: string) => `Mapa del mundo de ${what} por zona horaria. La tabla de abajo recoge las mismas cifras.`,
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    nothingYet: 'Aún no hay ningún lugar que mostrar.',
    fewer: 'menos',
    upTo: (count: string) => `hasta ${count}`,
    pollPlaces: 'De dónde vienen los votos',
    pollPlacesNone: 'Una región aparece cuando tres votos vienen de ella.',
    pollPlacesHint: 'Según la zona horaria de cada votante, nunca su dirección. Un lugar aparece cuando tres votos '
      + 'vienen de él, y las cifras se actualizan cada hora.',
    regions: {
      Africa: 'África',
      America: 'Las Américas',
      Antarctica: 'Antártida',
      Arctic: 'Ártico',
      Asia: 'Asia',
      Atlantic: 'Islas del Atlántico',
      Australia: 'Australia',
      Europe: 'Europa',
      Indian: 'Océano Índico',
      Pacific: 'Pacífico',
    } as Record<string, string>,
  },

  about: {
    title: 'Acerca de · super-vote',
    heading: <>Acerca de <AppName /></>,
    lead: (days: number) => <>
      Una forma gratuita y de código abierto para que un grupo decida junto: dónde comer, adónde ir, qué elegir. Sin
      cuenta, sin anuncios, sin seguimiento. Las votaciones se eliminan {days} días después de crearse.
    </>,
    howDecided: 'Cómo se deciden los resultados',
    howDecidedText: <>
      Una sola opción desperdicia la mayor parte de lo que piensa la gente: las opciones parecidas se reparten a sus
      partidarios, y una que a casi todos les parece bien puede perder frente a otra que no soporta la mitad del grupo.
      <AppName /> pide más, de dos maneras.
    </>,
    majorityJudgment: 'Juicio mayoritario',
    majorityJudgmentText: <>
      Cada persona puntúa cada opción, de <em>Excelente</em> a <em>Malo</em>. La <strong>mención mayoritaria</strong>{' '}
      de una opción es la mejor mención que más de la mitad de los votantes le dan, o una superior: su mediana. Gana
      la opción con la mejor mención mayoritaria. Cuando varias la comparten, decide entre ellas la{' '}
      <strong>puntuación GMJ</strong>: mide cuánto se inclinan las menciones por encima o por debajo de esa mención.
      Las opciones que siguen igualadas se muestran <em>ex aequo</em>, y ninguna regla oculta elige una.
    </>,
    approval: 'Voto por aprobación',
    approvalText: 'Cada persona marca todas las opciones con las que estaría contenta. Gana la opción aprobada por más '
      + 'votantes. Es rápido, y nunca te penaliza por apoyar más de una opción.',
    science: 'La ciencia detrás',
    scienceText: 'Ninguna regla de votación es perfecta: Condorcet vio en 1785 que un grupo puede preferir A a B, B a C '
      + 'y C a A, y toda regla razonable se puede manipular. Puntuar en lugar de ordenar evita buena parte del problema, '
      + 'como saben los jueces de vinos y de patinaje artístico.',
    notes: {
      pnas2007: 'Presenta el juicio mayoritario: puntuar y ordenar según la mediana.',
      book2011: 'El libro: la teoría, sus propiedades, y elecciones y jurados reales.',
      judge2014: 'Por qué puntuar evita las paradojas de ordenar, y resiste a la manipulación.',
      fabre2021: <>La puntuación del «juicio habitual» que <AppName /> usa para desempatar menciones mayoritarias iguales.</>,
      brams1978: 'La defensa de aprobar todas las opciones aceptables.',
      laslier2009: 'Cómo vota la gente de forma estratégica con el voto por aprobación, y qué resulta de ello.',
      gibbard1973: 'Junto con Satterthwaite: toda regla de votación razonable se puede manipular. La cuestión es cuánto.',
      satterthwaite1975: 'El mismo resultado, hallado de forma independiente.',
    },
    whoMakesIt: 'Quién lo hace',
    whoMakesItText: <>
      <AppName /> lo hace una sola persona en Quebec, en su tiempo libre, y es gratuito para todo el mundo. Su código
      es abierto: cualquiera puede leer cómo se cuentan los votos, ejecutar su propia copia o proponer un cambio.
    </>,
    seeTheCode: 'Ver el código fuente en GitHub',
  },

  privacy: {
    title: 'Privacidad y límites · super-vote',
    heading: 'Privacidad y límites',
    lead: <>
      <AppName /> está pensado para que nadie pueda saber lo que elegiste. Aquí se explica qué conserva, quién ve qué y
      qué todavía no puede hacer.
    </>,

    forWhat: 'Para qué sirve',
    forWhatText: 'Para decidir juntos entre personas que confían unas en otras: amistades, familia, un equipo, una clase, '
      + 'una asociación. No es adecuado para elecciones, ni para ninguna votación con consecuencias legales, '
      + 'económicas u oficiales: esas exigen que cada votante esté identificado y contado una sola vez, y resultados '
      + 'que cualquiera pueda verificar, algo que super-vote aún no puede prometer.',

    kept: 'Qué se conserva, y durante cuánto tiempo',
    keptItems: (days: number) => [
      `Una votación: su pregunta, sus opciones y sus ajustes, hasta que se elimina, como máximo ${days} días después `
        + 'de crearse. Quien la creó puede eliminarla antes.',
      'Tu voto en una votación, guardado bajo una clave que no dice quién eres, y eliminado con la votación. Puedes '
        + 'retirarlo hasta que la votación se cierre.',
      'El nombre que das, en las votaciones que muestran nombres, guardado aparte de tu voto para que nada una ambos.',
      'Copias de las votaciones, los votos y los nombres anteriores, hechas cada noche para recuperarse de un accidente '
        + 'y conservadas 7 días: lo que se elimina desaparece también de ellas en una semana.',
      `Un identificador aleatorio en una cookie, para que este navegador pueda cambiar sus votos y gestionar sus `
        + `votaciones, durante ${days} días después de su último voto o votación, mientras dure una votación. Es la `
        + 'única cookie: sin publicidad, sin analítica, sin seguimiento.',
      'La zona horaria de tu dispositivo (Europe/Paris, por ejemplo), añadida a las estadísticas solo como totales. Nunca tu dirección.',
      'La dirección de tu red, guardada en memoria un día como máximo, para limitar cuántas votaciones crea cada red. '
        + 'Nunca se escribe.',
      'Tus ajustes y el último nombre que diste, solo en este navegador.',
      'Todo lo que conserva el servidor está en una sola máquina en Montreal, Canadá, un país que la Unión Europea '
        + 'reconoce como protector adecuado de los datos personales.',
    ],

    whoSees: 'Quién ve qué',
    whoSeesItems: [
      'Todas las personas de una votación ven los resultados como totales, cuando quien la creó decidió mostrarlos, y los '
        + 'nombres que los votantes quisieron dar.',
      'Quien creó una votación ve lo mismo, y qué invitaciones se usaron: nunca lo que eligió cada quien.',
      'Nadie ve tu voto. Ni siquiera en tu propia pantalla: una vez contado, empieza oculto.',
      'Quien administra el servidor ve las solicitudes a medida que ocurren. Lo que se guarda no dice quién eligió qué, '
        + 'pero super-vote no oculta los votos al servidor en funcionamiento: se confía en que quienes lo administran no miren.',
    ],

    limits: 'Límites que conviene conocer',
    limitsItems: [
      'Sin invitaciones, una persona puede votar varias veces desde distintos navegadores o dispositivos. super-vote '
        + 'confía en la buena fe, y el número de votos delata el abuso. Para contar a cada persona una sola vez, invítala.',
      'Tus votos y tus votaciones pertenecen a este navegador. Desde otro dispositivo, o una vez borrados sus datos, ya no '
        + 'podrás cambiarlos ni gestionarlos, y no hay ninguna cuenta para recuperarlos.',
      'Los resultados en directo se mueven con cada voto que llega: en un grupo pequeño, quien los mire puede deducir quién '
        + 'eligió qué. Quien crea una votación elige cuándo se muestran los resultados, y recibe una advertencia.',
      'El recuento no se puede verificar de forma independiente: confías en el servidor, cuyo código es abierto y '
        + 'cualquiera puede leer.',
      'super-vote es gratuito y funciona en un servidor pequeño: puede no estar disponible a veces. No dependas de él '
        + 'para nada urgente.',
    ],

    rights: 'Tus datos, tus decisiones',
    rightsText: 'Tus votos no están vinculados a ti, así que super-vote no puede encontrarlos por ti: retira un voto, o '
      + 'elimina una votación que creaste, desde este navegador. Borrar los datos de este navegador para super-vote '
      + 'elimina su cookie y sus ajustes.',
    contact: <>
      Preguntas, una solicitud sobre tus datos o una votación que denunciar:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">escríbenos en
      GitHub</a>. Para una vulnerabilidad de seguridad, consulta la{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">política
      de seguridad</a>.
    </>,
    openSource: <>
      Nada de esto hay que darlo por bueno sin más: el código de <AppName />, incluidos el recuento y la protección de
      los votos, está <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">abierto
      para que cualquiera lo lea</a>.
    </>,
  },

  legal: {
    title: 'Aviso legal · super-vote',
    heading: 'Aviso legal',
    publisher: 'Editor',
    publisherText: <>
      <AppName /> lo publica una persona física en Quebec, Canadá, sin fines comerciales. Su nombre y su dirección no
      figuran aquí: los tiene el alojador.
    </>,
    law: 'Ley aplicable',
    lawText: <>
      <AppName /> se publica desde Quebec, bajo las leyes de Quebec y de Canadá. Está abierto a personas de todo el mundo,
      y quien crea una votación o vota en una también responde ante las leyes del lugar donde se encuentra.
      Lo que <AppName /> conserva sobre ti, y por qué, es lo mismo para todos, estén donde estén:{' '}
      <Link to="/privacy">Privacidad y límites</Link>.
    </>,
    host: 'Alojador',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Canadá',
    ],
    hostPhone: (phone: ReactNode) => <>Teléfono: {phone}</>,
    report: 'Denunciar una votación',
    reportText: <>
      Las votaciones las escriben las personas que las crean. Para denunciar una que infrinja la ley, por su título, sus
      opciones o el nombre de un votante:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">escríbenos en
      GitHub</a>. Cada denuncia se examina con prontitud, y lo que es ilegal se retira.
    </>,
  },
};
