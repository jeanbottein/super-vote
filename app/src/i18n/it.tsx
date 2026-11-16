/**
 * Everything the web app says, in Italian: en.tsx, translated. Voters are
 * addressed as «tu»; a poll is a «votazione», a ballot a «voto».
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('it', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('it', count, one, other)}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return unit === 'minute' ? counted(count, 'minuto', 'minuti') : counted(count, 'ora', 'ore');
}

export const it: Messages = {
  number,
  percent: (share: number) => formatPercent('it', share),
  decimal: (value: number, digits: number) => formatDecimal('it', value, digits),
  date: (isoDate: string) => formatDate('it', isoDate),
  moment: (isoDate: string) => formatMoment('it', isoDate),
  day: (day: string) => formatUtcDay('it', day),
  timeAgo: (isoDate: string) => timeAgo('it', isoDate) ?? 'proprio ora',
  waitUntil: inWords,

  loading: 'Caricamento…',
  backHome: 'Torna alla home',
  tryAgain: 'Riprova',
  close: 'Chiudi',
  dismiss: 'Ignora',

  errors: {
    unexpected: 'Qualcosa è andato storto. Riprova.',
    unreachable: 'Il server non è raggiungibile. Controlla la connessione e riprova.',
    failed: (status: number) => `Qualcosa è andato storto (errore ${status}). Riprova.`,
  },

  problems: {
    'unknown-voter': 'Questo browser non è uno che super-vote conosca. Ricarica la pagina per ricominciare da capo.',
    'not-poll-creator': 'Solo la persona che ha creato la votazione può farlo.',
    'not-invited': 'Solo le persone invitate possono votare in questa votazione. Se sei stato o stata invitata, apri il link del tuo invito.',
    'not-admin-link': 'Questo link di amministrazione non è quello di questa votazione. Controlla che sia stato copiato per intero.',
    'handover-unavailable': 'Questo link non può passare la votazione a qualcun altro: è già stato usato.',
    'cross-site': 'Questa richiesta proveniva da un altro sito web ed è stata rifiutata. Apri direttamente super-vote.',
    'poll-not-found': 'Nessuna votazione ha questo link o questo codice. Potrebbe essere scritto male, oppure la votazione è stata eliminata.',
    'poll-closed': 'Questa votazione è chiusa: non accetta più voti.',
    'invitation-used': 'Qualcuno ha già votato con questo invito, in un altro browser o su un altro dispositivo.',
    'collision': 'Questa modifica è entrata in conflitto con un’altra fatta nello stesso momento. Riprova.',
    'too-many-polls': (wait: string) => 'Questa connessione ha già creato le sue votazioni di oggi. Per essere equi con tutti, '
      + `ciascuna può crearne alcune al giorno: potrai crearne altre tra ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Troppi codici sbagliati da questa connessione: per proteggere le votazioni '
      + `dai tentativi di indovinarle, i suoi codici saranno rifiutati per i prossimi ${wait}. I link continuano a funzionare.`,
    'server-error': 'Qualcosa è andato storto da parte nostra. Riprova tra un attimo.',
  },

  mentions: {
    Excellent: 'Eccellente',
    VeryGood: 'Molto buono',
    Good: 'Buono',
    Fair: 'Discreto',
    Passable: 'Sufficiente',
    Inadequate: 'Insufficiente',
    Bad: 'Pessimo',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Giudizio di maggioranza',
    APPROVAL: 'Voto di approvazione',
  },

  visibilities: {
    PUBLIC: 'Pubblica',
    UNLISTED: 'Privata',
  },

  app: {
    home: 'Home',
    settings: 'Impostazioni',
    footer: <><AppName /> è gratuito e open source.</>,
    footerLinks: 'Informazioni su super-vote',
    about: 'Informazioni e la scienza che c’è dietro',
    privacy: 'Privacy e limiti',
    legal: 'Note legali',
    statistics: 'Statistiche',
    sourceCode: 'Codice sorgente',
    notFound: 'Pagina non trovata',
    nothingHere: 'A questo indirizzo non c’è nulla.',
  },

  settings: {
    language: 'Lingua',
    appearance: 'Aspetto',
    light: 'Chiaro',
    automatic: 'Automatico',
    dark: 'Scuro',
    mentionColours: 'Colori dei giudizi',
    greenToRed: 'Dal verde al rosso',
    shadesOfGrey: 'Sfumature di grigio',
    shadesOfGreyHint: 'Le sfumature di grigio si leggono allo stesso modo, qualunque colore tu veda: più chiaro è, meglio è.',
    majorityJudgmentBallot: 'Scheda del giudizio di maggioranza',
    colourScale: 'Scala di colori',
    dropdowns: 'Menu a tendina',
    castingYourBallot: 'Esprimere il tuo voto',
    live: 'Immediato',
    envelope: 'Busta',
    liveHint: 'Ogni modifica conta nel momento in cui la fai.',
    envelopeHint: 'Compila la scheda, poi inviala in un colpo solo.',
  },

  home: {
    title: 'super-vote · decidere insieme',
    lead: 'La matematica dice che è più giusto.',
    createQuestion: 'Devi organizzare una votazione?',
    createPoll: 'Decidiamo insieme!',
    yourPolls: 'Decidere insieme…',
    publicPolls: 'Votazioni pubbliche',
    noPublicPolls: 'Ancora nessuna votazione pubblica.',
    public: 'Pubblica',
    closed: 'Chiusa',

    howItWorks: 'Come funziona',
    steps: [
      { title: 'Chiedi', text: 'Una domanda e le sue opzioni.' },
      { title: 'Condividi', text: 'Un link, un codice QR o un codice.' },
      { title: 'Decidi', text: 'Tutti danno un giudizio, i risultati arrivano in diretta.' },
    ],

    agent: {
      title: 'Pronto per l’IA',
      text: 'Incolla questo in un assistente che sappia navigare sul web, con la tua domanda.',
      prompt: (site: string, guide: string) => `Usa ${site} per creare una votazione per il mio team (istruzioni per `
        + `gli agenti: ${guide}). La domanda: “Dove facciamo il ritiro aziendale?” Le opzioni: Lisbona, Berlino, `
        + 'Barcellona. Usa il giudizio di maggioranza e tieni nascosti i risultati finché non chiudo la votazione. '
        + 'Passa la votazione a me, poi dammi il link da condividere con il team.',
      copy: 'Copia il testo',
      copied: 'Testo copiato',
      caption: 'Risponde con due link: apri il primo per rendere tua la votazione, invia il secondo al gruppo.',
    },

    systems: {
      title: 'Due modi di decidere',
      majorityJudgment: {
        title: 'Giudizio di maggioranza',
        text: 'Dai un giudizio a ogni opzione, da Eccellente a Pessimo. Vince il miglior giudizio di maggioranza.',
      },
      approval: {
        title: 'Approvazione',
        text: 'Spunta ogni opzione che accetteresti. Vince la più spuntata.',
      },
    },

    compare: {
      title: 'Più giusto della maggior parte delle elezioni ufficiali',
      text: 'La maggior parte delle elezioni chiede un solo nome. Candidati simili si dividono gli elettori, e uno '
        + 'rifiutato dai più può comunque vincere. Il giudizio di maggioranza, frutto della ricerca di Michel Balinski e '
        + 'Rida Laraki, misura invece ciò che tutti pensano di ogni opzione.',
      science: 'La scienza che c’è dietro',
      single: 'Una sola scelta',
      singleNote: 'la maggior parte delle elezioni',
      approval: 'Approvazione',
      majorityJudgment: 'Giudizio di maggioranza',
      criteria: {
        nuance: 'Di’ cosa pensi di ogni opzione',
        splitting: 'Le opzioni simili non dividono i voti',
        lesserEvil: 'Niente voto al male minore',
        tactics: 'Difficile da manipolare',
        quick: 'Veloce da compilare',
        familiar: 'Familiare',
      },
      marks: { yes: 'Sì', partly: 'In parte', no: 'No' },
      caption: <><AppName /> offre approvazione e giudizio di maggioranza. Nessuna regola di voto è perfetta, ma
        alcune sono molto più giuste di altre.</>,
    },

    supportTitle: 'Gratuito, open source, senza pubblicità',
    supportText: 'Non sei tu il prodotto: lo scopo è promuovere sistemi di voto migliori. Fatto da una sola persona, '
      + 'nel tempo libero. Se ha aiutato il tuo gruppo a decidere, puoi aiutarlo a tua volta.',

    limitsTitle: 'Bene a sapersi',
    limits: {
      everyday: <><strong>Per le decisioni di tutti i giorni,</strong> non per le elezioni ufficiali: senza account,
        qualcuno può votare di nuovo da un altro browser. Gli inviti contano ogni persona una sola volta.</>,
      private: <><strong>Privato, ma non nascosto al server.</strong> Nessun altro vede il tuo voto, e i voti
        conservati non dicono chi li ha espressi.</>,
      browser: (days: number) => <><strong>Legato a questo browser,</strong> da un solo cookie, conservato per {days} giorni
        dopo il tuo ultimo voto o la tua ultima votazione. Niente pubblicità, niente tracciamento.</>,
      deleted: (days: number) => <><strong>Eliminati dopo {days} giorni,</strong> votazioni e voti insieme.</>,
      disclaimer: <><strong>Nessuna garanzia.</strong> <AppName /> promuove modi migliori di votare. È fatto da una sola
        persona, con la massima cura per sicurezza, privacy, prestazioni, architettura e qualità del codice, ma non è
        accreditato, sottoposto ad audit né rivisto in modo indipendente: non si garantisce che i suoi risultati siano
        esatti o rappresentino fedelmente la volontà di un gruppo. Servirebbero accreditamento, revisione tecnica da
        parte di esperti e assistenza continua, cose che una sola persona non può offrire senza sponsor ed esperti.</>,
    },
    limitsLink: 'Tutto su privacy e limiti',
  },
  join: {
    label: 'Hai un codice?',
    typeTheCode: 'Scrivi il codice che ti hanno dato.',
    notACode: 'Un codice è fatto di sei lettere e cifre, come K7M-4QX.',
    joining: 'Accesso in corso…',
    join: 'Vota!',
  },

  newPoll: {
    title: 'Decidere insieme · super-vote',
    heading: 'Decidere insieme',
    question: 'Domanda',
    questionPlaceholder: 'Dove mangiamo venerdì?',
    options: 'Opzioni',
    option: (row: number) => `Opzione ${row}`,
    remove: (option: string) => `Rimuovi ${option}`,
    optionsHint: (max: number) => `Fino a ${max} opzioni. Una nuova riga compare mentre scrivi.`,

    votingSystem: 'Sistema di voto',
    systems: {
      MAJORITY_JUDGMENT: 'Giudizio di maggioranza',
      APPROVAL: 'Approvazione',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Ognuno dà un giudizio a ogni opzione, da Eccellente a Pessimo. Vince l’opzione che una '
        + 'maggioranza giudica meglio: sfumato e difficile da manipolare.',
      APPROVAL: 'Ognuno spunta ogni opzione che accetterebbe. Vince l’opzione più approvata: veloce e semplice.',
    },

    whoCanFindIt: 'Chi può trovarla',
    visibilityHints: {
      PUBLIC: 'Elencata nella home, perché chiunque possa trovarla.',
      UNLISTED: 'Non elencata da nessuna parte: la trovano solo le persone a cui dai il link o il codice.',
    },

    whoCanVote: 'Chi può votare',
    anyone: 'Chiunque',
    invitedOnly: 'Solo su invito',
    anyoneHint: <>
      Chiunque abbia il link o il codice. Chi ci tiene può votare di nuovo da un altro browser: per contare ogni
      persona una sola volta, invitala.
    </>,
    invitedHint: 'Ogni persona riceve un link tutto suo, valido per un voto. Vedi quali link sono stati usati, mai cosa '
      + 'ha scelto qualcuno.',

    whoVoted: 'Chi ha votato',
    anonymous: 'Anonimo',
    showNames: 'Mostra i nomi',
    anonymousHint: 'Nessuno vede chi ha votato, solo quanti.',
    showNamesHint: 'Chi vota può indicare un nome, mostrato sotto i risultati. Nessuno vede chi ha scelto cosa.',

    results: 'Risultati',
    resultsChoices: {
      LIVE: 'In diretta',
      AFTER_BALLOTS: 'Differiti',
      AFTER_CLOSING: 'Alla chiusura',
    },
    resultsHints: {
      LIVE: 'Attenzione: tutti vedono ogni voto muovere i risultati. In un gruppo piccolo, questo rivela chi ha scelto cosa.',
      AFTER_BALLOTS: 'Nascosti finché non sono arrivati tanti voti, per proteggere le prime persone che votano. Dopo '
        + 'di che ogni voto li muove, cosa che può ancora tradire chi vota più tardi.',
      AFTER_CLOSING: 'Mostrati quando chiudi la votazione. Fino ad allora, tutti vedono solo quante persone hanno votato.',
    },
    ballotsBeforeResults: 'Voti prima che i risultati compaiano',

    optionOrder: 'Ordine delle opzioni',
    orders: {
      ALPHABETICAL: 'Dalla A alla Z',
      SHUFFLED: 'Casuale',
      AS_WRITTEN: 'Come scritte',
    },
    orderHints: {
      ALPHABETICAL: 'Dalla A alla Z, con i numeri per valore: 2 prima di 10. Scrivi le date partendo dall’anno, come 2026-10-24.',
      SHUFFLED: 'Un nuovo ordine per ogni persona a ogni visita, così nessuna opzione trae vantaggio dalla sua posizione.',
      AS_WRITTEN: 'Il tuo ordine. I primi posti attirano più consensi, quindi può sembrare un tentativo di influenzare il risultato.',
    },

    deletedAfter: (days: number) => `Le votazioni vengono eliminate ${days} giorni dopo la creazione, insieme ai loro voti.`,
    notForElections: <>
      <AppName /> è pensato per le decisioni di tutti i giorni, non per votazioni ufficiali o vincolanti.{' '}
      <Link to="/privacy">Privacy e limiti</Link>
    </>,
    noNewPolls: 'Questo server al momento non accetta nuove votazioni.',
    creating: 'Creazione in corso…',
    create: 'Fai la domanda',

    problems: {
      titleMissing: 'Dai un titolo alla tua votazione.',
      titleTooLong: (max: number) => `Un titolo può essere lungo al massimo ${max} caratteri.`,
      titleInvisible: 'Un titolo può contenere solo caratteri visibili.',
      tooFewOptions: 'Aggiungi almeno due opzioni.',
      tooManyOptions: (max: number) => `Una votazione può avere al massimo ${max} opzioni.`,
      optionTooLong: (max: number) => `Un’opzione può essere lunga al massimo ${max} caratteri.`,
      optionInvisible: 'Un’opzione può contenere solo caratteri visibili.',
      optionTwice: (option: string) => `“${option}” compare due volte. Ogni opzione deve essere diversa.`,
      resultsAfterBallots: (min: number) => `Scegli un numero intero di voti, di almeno ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Presa in carico della votazione…',
    deleted: 'Questa votazione è stata eliminata',
    deletedText: 'È stata eliminata, e con lei i suoi risultati.',
    notFound: 'Votazione non trovata',
    notFoundText: 'Il link potrebbe essere incompleto, oppure la votazione è stata eliminata.',
    notLoaded: 'Impossibile caricare la votazione',
    loadingPoll: 'Caricamento della votazione…',
    byInvitation: 'Su invito',
    optionOrder: { SHUFFLED: 'Opzioni casuali', ALPHABETICAL: 'Opzioni in ordine alfabetico', AS_WRITTEN: 'Opzioni nell’ordine scritto' },
    closed: 'Chiusa',
    keepTitle: 'Conserva il tuo link di amministrazione',
    keepText: 'Aprilo in un altro browser o dispositivo per gestire questa votazione da lì invece che da qui: chiuderla, '
      + 'eliminarla, invitare persone. Tienilo per te: chi lo ha può fare lo stesso.',
    readyToInvite: <><strong>La tua votazione è pronta.</strong> Invita le persone qui sotto: ognuna riceve un link tutto suo.</>,
    readyToShare: <><strong>La tua votazione è pronta.</strong> Condividi il link per raccogliere voti.</>,
    closedAgo: (ago: string) => `Il voto si è chiuso ${ago}. Questi sono i risultati finali.`,
    deletedOn: (date: string) => `Questa votazione e i suoi voti saranno eliminati il ${date}.`,
    lastPoll: (wait: string) => `Era la tua ultima votazione per ora: potrai crearne altre tra ${wait}.`,
    pollsLeft: (count: number, wait: string) => `Puoi creare ancora ${counted(count, 'votazione', 'votazioni')} nei prossimi ${wait}.`,
    fairShare: (perDay: number) => `Per essere equi con tutti, ogni connessione può creare ${perDay} votazioni al giorno.`,
  },

  ballot: {
    yourBallot: 'Il tuo voto',
    withdraw: 'Ritira',
    submit: 'Invia il mio voto',
    rateEveryOption: 'Dai un giudizio a ogni opzione per inviare',
    submitting: 'Invio in corso…',
    majorityJudgmentLive: 'Dai un giudizio a ogni opzione. Le opzioni senza giudizio contano come Pessimo.',
    majorityJudgmentEnvelope: 'Dai un giudizio a ogni opzione, poi invia il tuo voto.',
    approval: 'Spunta ogni opzione con cui saresti soddisfatto.',
    invited: 'Il tuo invito vale un voto, che solo questo browser può modificare. Chi ti ha invitato vede che è stato '
      + 'usato, mai cosa hai scelto.',
    counted: 'Il tuo voto è stato conteggiato. Puoi modificarlo da questo browser finché la votazione non si chiude.',
    notVoted: 'Non hai ancora votato.',
    hide: 'Nascondi il mio voto',
    hidden: 'Il tuo voto è conteggiato e nascosto qui: nessuno che guardi questo schermo vede le tue scelte.',
    change: 'Modifica il mio voto',
    invitationUsed: 'Questo invito è già stato usato, in un altro browser o su un altro dispositivo. Il suo voto può '
      + 'essere modificato solo lì.',
    invitationNotValid: 'Questo link di invito non è valido. Chiedine uno nuovo a chi ti ha invitato.',
    notInvited: 'Solo le persone invitate possono votare in questa votazione. Se sei stato o stata invitata, apri il link del tuo invito.',
    yourName: 'Il tuo nome',
    namePlaceholder: 'Anonimo',
    namesGiven: 'Facoltativo. Tutti vedono i nomi indicati, ma non le loro scelte.',
    namesLive: 'I risultati in diretta possono lasciar intuire chi ha scelto cosa.',
    notRatedYet: 'Non ancora valutata',
    chooseAMention: 'Scegli un giudizio…',
    optionsYouApprove: 'Opzioni che approvi',
  },

  results: {
    heading: 'Risultati',
    ballots: (count: number) => counted(count, 'voto', 'voti'),
    noBallotsYet: 'Ancora nessun voto. I risultati si completano man mano che arrivano.',
    keptUntilBallots: (count: number) => `I risultati compaiono quando sono arrivati ${count} voti, perché le scelte `
      + 'delle prime persone restino loro.',
    keptUntilYouClose: 'I risultati compaiono quando chiudi la votazione.',
    keptUntilClosed: 'I risultati compaiono quando la votazione si chiude.',
    download: 'Scarica i risultati',
    final: 'Finali',
    connecting: 'Connessione in corso…',
    live: 'In diretta',
    reconnecting: 'Riconnessione in corso…',
    whoVoted: 'Chi ha votato',
    anonymousVoters: (count: number) => counted(count, 'persona anonima', 'persone anonime'),
    andAnonymousVoters: (count: number) => `e ${counted(count, 'persona anonima', 'persone anonime')}`,
    moreVoters: (count: number) => `e ${counted(count, 'altra persona', 'altre persone')}`,
    rank: (rank: number) => `Posizione ${rank}`,
    approvals: (count: number) => counted(count, 'approvazione', 'approvazioni'),
    noBallotsFor: (option: string) => `${option}: ancora nessun voto`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Giudizio di maggioranza:',
    gmjScore: 'Punteggio GMJ:',
    gmjScoreTitle: (score: string) => `Punteggio del giudizio abituale del GMJ: ${score}. Decide fra le opzioni con lo `
      + 'stesso giudizio di maggioranza.',
    orBetter: (share: string, mention: string) => `${share} dicono ${mention} o meglio`,
  },

  owner: {
    manage: 'Gestisci la tua votazione',
    adminLink: 'Link di amministrazione della votazione',
    adminLinkHint: 'Il tuo link di amministrazione: aprilo in un altro browser o dispositivo per gestire la votazione '
      + 'da lì invece che da qui. Tienilo per te.',
    showAdminLink: 'Mostra il link di amministrazione',
    onlyThisBrowser: 'Solo questo browser può chiudere o eliminare questa votazione in anticipo.',
    close: 'Chiudi la votazione',
    delete: 'Elimina la votazione',
    closeQuestion: 'Chiudere la votazione per sempre? Nessuno potrà più votare né modificare il proprio voto, e tutti '
      + 'vedranno i risultati finali.',
    keepOpen: 'Lasciala aperta',
    closeForGood: 'Chiudi per sempre',
    deleteQuestion: 'Eliminare per sempre questa votazione e i suoi voti? Chi la sta guardando la vedrà sparire.',
    keep: 'Conservala',
    deleteForGood: 'Elimina per sempre',
    deletedToast: 'La votazione è stata eliminata.',
  },

  invitations: {
    heading: 'Inviti',
    count: (count: number) => counted(count, 'invito', 'inviti'),
    used: (used: number, count: number) => `${number(used)} su ${number(count)} usati`,
    hint: 'Solo le persone che inviti possono votare, ciascuna con un link tutto suo, valido per un voto. Vedi quali '
      + 'link sono stati usati, mai cosa ha scelto qualcuno. Tu puoi votare senza.',
    invite: 'Invita',
    inviting: 'Invito in corso…',
    inviteSomeone: 'Invita qualcuno',
    namePlaceholder: 'Nome o soprannome (facoltativo)',
    loading: 'Caricamento degli inviti…',
    showMore: 'Mostra altri',
    newestShown: (count: number) => `Vengono mostrati i ${number(count)} più recenti.`,
    invitationFor: (label: string) => `Invito per ${label}`,
    invitationNumber: (number: number) => `Invito ${number}`,
    shareHint: 'Solo per questa persona. Vale un voto, che solo il browser da cui vota potrà modificare.',
    linkLabel: 'Link dell’invito',
    message: (title: string) => `Sei invitato o invitata a votare su “${title}”. Questo link è solo per te.`,
    isUsed: 'Usato',
    notUsedYet: 'Non ancora usato',
    share: (name: string) => `Condividi il link per ${name}`,
    takeBack: (name: string) => `Ritira il link per ${name}`,
    takeBackQuestion: 'Ritirare questo invito? Il suo link smetterà di funzionare.',
    keep: 'Conservalo',
    takeItBack: 'Ritiralo',
  },

  share: {
    share: 'Condividi',
    title: 'Condividi questa votazione',
    anyone: 'Chiunque abbia il codice o il link può votare.',
    unlisted: 'La votazione non è elencata da nessun’altra parte.',
    linkLabel: 'Link della votazione',
    joinCode: 'Codice di accesso',
    toEnterAt: (host: string) => `da inserire su ${host}`,
    copy: 'Copia',
    copied: 'Copiato',
    copyCode: 'Copia il codice di accesso',
    qrCode: (url: string) => `Codice QR per ${url}`,
    throughAnApp: 'Condividi tramite un’app',
    byEmail: 'Invia per e-mail',
    message: (title: string) => `Vota su “${title}”`,
    orCode: (code: string, host: string) => `Oppure inserisci il codice ${code} su ${host}.`,
  },

  statistics: {
    title: 'Statistiche · super-vote',
    heading: <><AppName /> nel mondo</>,
    lead: 'Quante votazioni, voti e visitatori, quando e da dove.',
    show: 'Mostra',
    measures: {
      voters: {
        label: 'Visitatori', plural: 'visitatori',
        noun: (count: number) => plural('it', count, 'visitatore', 'visitatori'),
        count: (count: number) => counted(count, 'visitatore', 'visitatori'),
      },
      polls: {
        label: 'Votazioni', plural: 'votazioni',
        noun: (count: number) => plural('it', count, 'votazione', 'votazioni'),
        count: (count: number) => counted(count, 'votazione', 'votazioni'),
      },
      ballots: {
        label: 'Voti', plural: 'voti',
        noun: (count: number) => plural('it', count, 'voto', 'voti'),
        count: (count: number) => counted(count, 'voto', 'voti'),
      },
    },
    totals: {
      polls: 'Votazioni create',
      openPolls: 'Aperte ora',
      ballots: 'Voti espressi',
      voters: 'Visitatori',
    },
    lastDays: 'Negli ultimi 90 giorni',
    where: 'Dove',
    byRegion: 'Per regione',
    noRegion: 'Ancora nessuna regione.',
    tapADot: 'Tocca un punto per vedere i suoi numeri.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Non mostrati in nessuna regione, per mancanza di un fuso '
      + `orario o di persone a sufficienza per mostrarli: ${visitors}, ${polls} e ${ballots}.`,
    howCounted: 'Come vengono contati',
    howCountedText: <>
      Un visitatore è un browser o un’app che è venuta su <AppName />: una persona con due dispositivi conta due volte.
      Un voto conta una sola volta, per quante volte chi l’ha espresso lo modifichi.
    </>,
    places: (updated: string) => 'I luoghi derivano dal fuso orario impostato sul tuo dispositivo, mai dal tuo indirizzo, e '
      + 'si conservano solo i totali. Un luogo compare quando tre visitatori arrivano da lì. I numeri sono aggiornati '
      + 'ogni ora, così non possono essere abbinati ai voti di una singola votazione man mano che arrivano. '
      + `Ultimo aggiornamento: ${updated}.`,
    sources: <>
      Ogni punto è la città da cui prende il nome un fuso orario, e rappresenta tutte le persone di quel fuso. I giorni
      sono in UTC. Terre emerse da <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>,
      fusi orari dal <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">database IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} il {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} negli ultimi ${days} giorni`,
    busiest: (day: string, count: string) => `, il massimo il ${day}: ${count}.`,
    topLine: (count: string) => `Valore massimo: ${count}`,
    regionAndCity: 'Regione e città',
    map: (what: string) => `Mappa del mondo di ${what} per fuso orario. La tabella qui sotto elenca gli stessi numeri.`,
    zoomIn: 'Ingrandisci',
    zoomOut: 'Riduci',
    nothingYet: 'Ancora nessun luogo da mostrare.',
    fewer: 'meno',
    upTo: (count: string) => `fino a ${count}`,
    pollPlaces: 'Da dove arrivano i voti',
    pollPlacesNone: 'Una regione compare quando tre voti arrivano da lì.',
    pollPlacesHint: 'Dal fuso orario di ciascun votante, mai dal suo indirizzo. Un luogo compare quando tre voti '
      + 'arrivano da lì, e i numeri sono aggiornati ogni ora.',
    regions: {
      Africa: 'Africa',
      America: 'Le Americhe',
      Antarctica: 'Antartide',
      Arctic: 'Artico',
      Asia: 'Asia',
      Atlantic: 'Isole dell’Atlantico',
      Australia: 'Australia',
      Europe: 'Europa',
      Indian: 'Oceano Indiano',
      Pacific: 'Pacifico',
    } as Record<string, string>,
  },

  about: {
    title: 'Informazioni · super-vote',
    heading: <>Informazioni su <AppName /></>,
    lead: (days: number) => <>
      Un modo gratuito e open source perché un gruppo decida insieme: dove mangiare, dove andare, cosa scegliere.
      Nessun account, nessuna pubblicità, nessun tracciamento. Le votazioni vengono eliminate {days} giorni dopo la creazione.
    </>,
    howDecided: 'Come si decidono i risultati',
    howDecidedText: <>
      Una scelta singola butta via la maggior parte di ciò che pensano le persone: le opzioni simili si dividono i
      propri sostenitori, e una che quasi tutti trovano accettabile può perdere contro una che metà del gruppo non
      sopporta. <AppName /> chiede di più, in due modi.
    </>,
    majorityJudgment: 'Giudizio di maggioranza',
    majorityJudgmentText: <>
      Ogni persona dà un giudizio a ogni opzione, da <em>Eccellente</em> a <em>Pessimo</em>. Il{' '}
      <strong>giudizio di maggioranza</strong> di un’opzione è il miglior giudizio che più della metà dei votanti le dà,
      o uno superiore: la sua mediana. Vince l’opzione con il miglior giudizio di maggioranza. Quando più opzioni lo
      condividono, decide tra loro il <strong>punteggio GMJ</strong>: misura quanto i giudizi pendono sopra o sotto
      quel giudizio. Le opzioni ancora pari sono mostrate <em>ex aequo</em>, e nessuna regola nascosta ne sceglie una.
    </>,
    approval: 'Voto di approvazione',
    approvalText: 'Ogni persona spunta ogni opzione con cui sarebbe soddisfatta. Vince l’opzione approvata dal maggior '
      + 'numero di votanti. È veloce, e non ti penalizza mai per aver sostenuto più di un’opzione.',
    science: 'La scienza che c’è dietro',
    scienceText: 'Nessuna regola di voto è perfetta: Condorcet vide nel 1785 che un gruppo può preferire A a B, B a C e C '
      + 'ad A, e ogni regola ragionevole può essere manipolata. Dare giudizi invece di ordinare aggira gran parte del '
      + 'problema, come sanno i giudici di vini e di pattinaggio artistico.',
    notes: {
      pnas2007: 'Introduce il giudizio di maggioranza: dare giudizi, poi ordinare per mediana.',
      book2011: 'Il libro: la teoria, le sue proprietà, elezioni e giurie reali.',
      judge2014: 'Perché dare giudizi evita i paradossi dell’ordinamento e resiste alla manipolazione.',
      fabre2021: <>Il punteggio del “giudizio abituale” che <AppName /> usa per decidere fra giudizi di maggioranza uguali.</>,
      brams1978: 'Le ragioni per approvare ogni opzione accettabile.',
      laslier2009: 'Come le persone votano in modo strategico con il voto di approvazione, e con quali esiti.',
      gibbard1973: 'Con Satterthwaite: ogni regola di voto ragionevole può essere manipolata. La domanda è quanto.',
      satterthwaite1975: 'Lo stesso risultato, trovato in modo indipendente.',
    },
    whoMakesIt: 'Chi lo fa',
    whoMakesItText: <>
      <AppName /> è fatto da una sola persona in Québec, nel tempo libero, ed è gratuito per tutti. Il suo codice è
      aperto: chiunque può leggere come vengono contati i voti, far girare la propria copia o proporre una modifica.
    </>,
    seeTheCode: 'Vedi il codice sorgente su GitHub',
  },

  privacy: {
    title: 'Privacy e limiti · super-vote',
    heading: 'Privacy e limiti',
    lead: <>
      <AppName /> è costruito perché nessuno possa sapere cosa hai scelto. Ecco cosa conserva, chi vede cosa e cosa
      non sa ancora fare.
    </>,

    forWhat: 'A cosa serve',
    forWhatText: 'Decidere insieme tra persone che si fidano l’una dell’altra: amici, famiglia, una squadra, una classe, '
      + 'un’associazione. Non è adatto alle elezioni, né a nessuna votazione con conseguenze legali, finanziarie o '
      + 'ufficiali: servirebbero votanti tutti identificati e contati una sola volta, e risultati che chiunque possa '
      + 'verificare, cosa che super-vote non può ancora promettere.',

    kept: 'Cosa viene conservato, e per quanto tempo',
    keptItems: (days: number) => [
      `Una votazione: la sua domanda, le sue opzioni e le sue impostazioni, finché non viene eliminata, al più tardi ${days} `
        + 'giorni dopo la creazione. Chi l’ha creata può eliminarla prima.',
      'Il tuo voto in una votazione, conservato sotto una chiave che non dice chi sei, ed eliminato con la votazione. '
        + 'Puoi ritirarlo finché la votazione non si chiude.',
      'Il nome che indichi, nelle votazioni che mostrano i nomi, conservato separatamente dal tuo voto in modo che nulla colleghi i due.',
      'Copie delle votazioni, dei voti e dei nomi di cui sopra, fatte ogni notte per recuperare dopo un incidente e '
        + 'conservate 7 giorni: ciò che viene eliminato scompare anche da lì entro una settimana.',
      `Un identificatore casuale in un cookie, perché questo browser possa modificare i propri voti e gestire le proprie `
        + `votazioni, per ${days} giorni dopo il suo ultimo voto o la sua ultima votazione, finché una votazione dura. È l’unico `
        + 'cookie: niente pubblicità, niente analisi, niente tracciamento.',
      'Il fuso orario del tuo dispositivo (Europe/Paris, ad esempio), aggiunto alle statistiche solo come totali. Mai il tuo indirizzo.',
      'L’indirizzo della tua rete, tenuto in memoria al massimo un giorno, per limitare quante votazioni crea ogni rete. '
        + 'Non viene mai scritto.',
      'Le tue impostazioni e l’ultimo nome che hai indicato, solo in questo browser.',
      'Tutto ciò che il server conserva si trova su una sola macchina a Montréal, in Canada, un paese che l’Unione '
        + 'europea riconosce come adeguato alla protezione dei dati personali.',
    ],

    whoSees: 'Chi vede cosa',
    whoSeesItems: [
      'Tutti in una votazione vedono i risultati come totali, quando chi l’ha creata ha scelto di mostrarli, e i nomi '
        + 'che i votanti hanno scelto di indicare.',
      'Chi ha creato una votazione vede lo stesso, e quali inviti sono stati usati: mai cosa ha scelto qualcuno.',
      'Nessuno vede il tuo voto. Nemmeno sul tuo schermo: una volta conteggiato, parte nascosto.',
      'Chi gestisce il server vede le richieste mentre avvengono. Ciò che viene conservato non dice chi ha scelto cosa, '
        + 'ma super-vote non nasconde i voti al server in funzione: si confida che chi lo gestisce non guardi.',
    ],

    limits: 'Limiti da conoscere',
    limitsItems: [
      'Senza inviti, una persona può votare più volte da browser o dispositivi diversi. super-vote conta sulla buona '
        + 'fede, e il numero di voti rivela l’abuso. Per contare ogni persona una sola volta, invitala.',
      'I tuoi voti e le tue votazioni appartengono a questo browser. Da un altro dispositivo, o una volta cancellati i suoi dati, '
        + 'non potrai più modificarli né gestirli, e non c’è alcun account per recuperarli.',
      'I risultati in diretta si muovono a ogni voto che arriva: in un gruppo piccolo, chi guarda può capire chi ha '
        + 'scelto cosa. Chi crea una votazione sceglie quando i risultati compaiono, e viene avvisato.',
      'Il conteggio non può essere verificato in modo indipendente: ti fidi del server, il cui codice è aperto a chiunque voglia leggerlo.',
      'super-vote è gratuito e gira su un piccolo server: a volte può non essere disponibile. Non farci affidamento per '
        + 'nulla di urgente.',
    ],

    rights: 'I tuoi dati, le tue scelte',
    rightsText: 'I tuoi voti non sono collegati a te, quindi super-vote non può trovarli per te: ritira un voto, o '
      + 'elimina una votazione che hai creato, da questo browser. Cancellare i dati di questo browser per super-vote '
      + 'rimuove il suo cookie e le sue impostazioni.',
    contact: <>
      Domande, una richiesta sui tuoi dati o una votazione da segnalare:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">scrivici su
      GitHub</a>. Una falla di sicurezza: vedi la{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">politica
      di sicurezza</a>.
    </>,
    openSource: <>
      Niente di tutto questo va accettato sulla fiducia: il codice di <AppName />, compresi il conteggio e la
      protezione dei voti, è <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">aperto
      a chiunque voglia leggerlo</a>.
    </>,
  },

  legal: {
    title: 'Note legali · super-vote',
    heading: 'Note legali',
    publisher: 'Editore',
    publisherText: <>
      <AppName /> è pubblicato da una persona fisica in Québec, Canada, senza scopo commerciale. Il suo nome e il suo
      indirizzo non sono riportati qui: li ha il fornitore di hosting.
    </>,
    law: 'Legge applicabile',
    lawText: <>
      <AppName /> è pubblicato dal Québec, secondo le leggi del Québec e del Canada. È aperto a persone di tutto il
      mondo, e chi crea una votazione o vota in una risponde anche alle leggi del luogo in cui si trova.
      Ciò che <AppName /> conserva su di te, e perché, è uguale per tutti, ovunque si trovino:{' '}
      <Link to="/privacy">Privacy e limiti</Link>.
    </>,
    host: 'Hosting',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Canada',
    ],
    hostPhone: (phone: ReactNode) => <>Telefono: {phone}</>,
    report: 'Segnalare una votazione',
    reportText: <>
      Le votazioni sono scritte da chi le crea. Per segnalarne una che viola la legge, per il suo titolo, le sue
      opzioni o il nome di un votante:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">scrivici su
      GitHub</a>. Ogni segnalazione viene esaminata con tempestività, e ciò che è illecito viene rimosso.
    </>,
  },
};
