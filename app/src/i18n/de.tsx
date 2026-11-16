/**
 * Everything the web app says, in German: en.tsx, translated. Voters are
 * addressed as «du», which needs no gendered word; a poll is an «Abstimmung»,
 * a ballot a «Stimme».
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('de', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('de', count, one, other)}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return unit === 'minute' ? counted(count, 'Minute', 'Minuten') : counted(count, 'Stunde', 'Stunden');
}

export const de: Messages = {
  number,
  percent: (share: number) => formatPercent('de', share),
  decimal: (value: number, digits: number) => formatDecimal('de', value, digits),
  date: (isoDate: string) => formatDate('de', isoDate),
  moment: (isoDate: string) => formatMoment('de', isoDate),
  day: (day: string) => formatUtcDay('de', day),
  timeAgo: (isoDate: string) => timeAgo('de', isoDate) ?? 'gerade eben',
  waitUntil: inWords,

  loading: 'Wird geladen…',
  backHome: 'Zurück zur Startseite',
  tryAgain: 'Erneut versuchen',
  close: 'Schließen',
  dismiss: 'Ausblenden',

  errors: {
    unexpected: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    unreachable: 'Der Server ist nicht erreichbar. Prüfe deine Verbindung und versuche es erneut.',
    failed: (status: number) => `Etwas ist schiefgelaufen (Fehler ${status}). Bitte versuche es erneut.`,
  },

  problems: {
    'unknown-voter': 'Diesen Browser kennt super-vote nicht. Lade die Seite neu, um von vorn zu beginnen.',
    'not-poll-creator': 'Das kann nur die Person, die die Abstimmung erstellt hat.',
    'not-invited': 'Nur eingeladene Personen können bei dieser Abstimmung abstimmen. Wenn du eingeladen wurdest, öffne den Link aus deiner Einladung.',
    'not-admin-link': 'Dieser Admin-Link gehört nicht zu dieser Abstimmung. Prüfe, ob er vollständig kopiert wurde.',
    'handover-unavailable': 'Mit diesem Link lässt sich die Abstimmung nicht übergeben: Er wurde schon benutzt.',
    'cross-site': 'Diese Anfrage kam von einer anderen Website und wurde abgelehnt. Öffne super-vote direkt.',
    'poll-not-found': 'Keine Abstimmung hat diesen Link oder diesen Code. Er ist vielleicht falsch geschrieben, oder die Abstimmung wurde gelöscht.',
    'poll-closed': 'Diese Abstimmung ist beendet: Sie nimmt keine Stimmen mehr an.',
    'invitation-used': 'Jemand hat mit dieser Einladung schon abgestimmt, in einem anderen Browser oder auf einem anderen Gerät.',
    'collision': 'Diese Änderung ist mit einer anderen zusammengestoßen, die im selben Moment gemacht wurde. Bitte versuche es erneut.',
    'too-many-polls': (wait: string) => 'Von dieser Verbindung wurden die Abstimmungen für heute schon erstellt. Damit es für '
      + `alle fair bleibt, darf jede nur einige pro Tag erstellen: In ${wait} kannst du weitere erstellen.`,
    'too-many-wrong-codes': (wait: string) => 'Zu viele falsche Codes von dieser Verbindung: Damit Abstimmungen vor dem '
      + `Erraten geschützt bleiben, werden ihre Codes für die nächsten ${wait} abgelehnt. Links funktionieren weiterhin.`,
    'server-error': 'Auf unserer Seite ist etwas schiefgelaufen. Bitte versuche es gleich noch einmal.',
  },

  mentions: {
    Excellent: 'Ausgezeichnet',
    VeryGood: 'Sehr gut',
    Good: 'Gut',
    Fair: 'Befriedigend',
    Passable: 'Ausreichend',
    Inadequate: 'Mangelhaft',
    Bad: 'Ungenügend',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Mehrheitsurteil',
    APPROVAL: 'Zustimmungswahl',
  },

  visibilities: {
    PUBLIC: 'Öffentlich',
    UNLISTED: 'Privat',
  },

  app: {
    home: 'Startseite',
    settings: 'Einstellungen',
    footer: <><AppName /> ist kostenlos und Open Source.</>,
    footerLinks: 'Über super-vote',
    about: 'Über uns und die Wissenschaft dahinter',
    privacy: 'Datenschutz und Grenzen',
    legal: 'Impressum',
    statistics: 'Statistiken',
    sourceCode: 'Quellcode',
    notFound: 'Seite nicht gefunden',
    nothingHere: 'Unter dieser Adresse gibt es nichts.',
  },

  settings: {
    language: 'Sprache',
    appearance: 'Darstellung',
    light: 'Hell',
    automatic: 'Automatisch',
    dark: 'Dunkel',
    mentionColours: 'Farben der Bewertungen',
    greenToRed: 'Von Grün zu Rot',
    shadesOfGrey: 'Graustufen',
    shadesOfGreyHint: 'Graustufen lesen sich gleich, welche Farben du auch siehst: je heller, desto besser.',
    majorityJudgmentBallot: 'Stimmzettel beim Mehrheitsurteil',
    colourScale: 'Farbskala',
    dropdowns: 'Auswahllisten',
    castingYourBallot: 'Deine Stimme abgeben',
    live: 'Sofort',
    envelope: 'Umschlag',
    liveHint: 'Jede Änderung zählt in dem Moment, in dem du sie machst.',
    envelopeHint: 'Fülle deinen Stimmzettel aus und sende ihn dann auf einmal ab.',
  },

  home: {
    title: 'super-vote · gemeinsam entscheiden',
    lead: 'Die Mathematik sagt: Es ist fairer.',
    createQuestion: 'Eine Abstimmung nötig?',
    createPoll: 'Gemeinsam entscheiden!',
    yourPolls: 'Gemeinsam entscheiden…',
    publicPolls: 'Öffentliche Abstimmungen',
    noPublicPolls: 'Noch keine öffentlichen Abstimmungen.',
    public: 'Öffentlich',
    closed: 'Beendet',

    howItWorks: 'So funktioniert es',
    steps: [
      { title: 'Fragen', text: 'Eine Frage und ihre Optionen.' },
      { title: 'Teilen', text: 'Ein Link, ein QR-Code oder ein Code.' },
      { title: 'Entscheiden', text: 'Alle bewerten, die Ergebnisse kommen live herein.' },
    ],

    agent: {
      title: 'Bereit für KI',
      text: 'Füge das in einen Assistenten ein, der im Web surfen kann, mit deiner eigenen Frage.',
      prompt: (site: string, guide: string) => `Nutze ${site}, um eine Abstimmung für mein Team zu erstellen (Anleitung `
        + `für Agenten: ${guide}). Die Frage: „Wo veranstalten wir unseren Teamausflug?“ Die Optionen: Lissabon, Berlin, `
        + 'Barcelona. Verwende das Mehrheitsurteil und halte die Ergebnisse verborgen, bis ich die Abstimmung beende. '
        + 'Übergib mir die Abstimmung und gib mir dann den Link, den ich mit dem Team teilen kann.',
      copy: 'Text kopieren',
      copied: 'Text kopiert',
      caption: 'Er antwortet mit zwei Links: Öffne den ersten, um die Abstimmung zu deiner zu machen, und schicke den zweiten an die Gruppe.',
    },

    systems: {
      title: 'Zwei Arten zu entscheiden',
      majorityJudgment: {
        title: 'Mehrheitsurteil',
        text: 'Bewerte jede Option von Ausgezeichnet bis Ungenügend. Die beste Mehrheitsnote gewinnt.',
      },
      approval: {
        title: 'Zustimmung',
        text: 'Hake jede Option an, die du akzeptieren würdest. Die meistangehakte gewinnt.',
      },
    },

    compare: {
      title: 'Fairer als die meisten offiziellen Wahlen',
      text: 'Die meisten Wahlen verlangen einen einzigen Namen. Ähnliche Kandidierende spalten ihre Wählerschaft, und '
        + 'wer von den meisten abgelehnt wird, kann trotzdem gewinnen. Das Mehrheitsurteil, aus der Forschung von '
        + 'Michel Balinski und Rida Laraki, misst stattdessen, was alle von jeder Option halten.',
      science: 'Die Wissenschaft dahinter',
      single: 'Eine Wahl',
      singleNote: 'die meisten Wahlen',
      approval: 'Zustimmung',
      majorityJudgment: 'Mehrheitsurteil',
      criteria: {
        nuance: 'Sage, was du von jeder Option hältst',
        splitting: 'Ähnliche Optionen spalten die Stimmen nicht',
        lesserEvil: 'Kein Wählen des kleineren Übels',
        tactics: 'Schwer zu manipulieren',
        quick: 'Schnell auszufüllen',
        familiar: 'Vertraut',
      },
      marks: { yes: 'Ja', partly: 'Teilweise', no: 'Nein' },
      caption: <><AppName /> bietet Zustimmungswahl und Mehrheitsurteil. Keine Abstimmungsregel ist perfekt, aber manche
        sind viel fairer als andere.</>,
    },

    supportTitle: 'Kostenlos, Open Source, keine Werbung',
    supportText: 'Du bist nicht das Produkt: Ziel ist es, bessere Abstimmungsverfahren bekannt zu machen. Von einer '
      + 'einzigen Person in der Freizeit gemacht. Wenn es deiner Gruppe beim Entscheiden geholfen hat, kannst du ihm helfen.',

    limitsTitle: 'Gut zu wissen',
    limits: {
      everyday: <><strong>Für Entscheidungen im Alltag,</strong> nicht für offizielle Wahlen: Ohne Konten kann jemand
        von einem anderen Browser aus erneut abstimmen. Einladungen zählen jede Person nur einmal.</>,
      private: <><strong>Privat, aber nicht vor dem Server verborgen.</strong> Niemand sonst sieht deine Stimme, und
        die gespeicherten Stimmen verraten nicht, von wem sie stammen.</>,
      browser: (days: number) => <><strong>An diesen Browser gebunden,</strong> durch ein einziges Cookie, das {days} Tage
        nach deiner letzten Stimme oder Abstimmung aufbewahrt wird. Keine Werbung, kein Tracking.</>,
      deleted: (days: number) => <><strong>Nach {days} Tagen gelöscht,</strong> Abstimmungen wie Stimmen.</>,
      disclaimer: <><strong>Keine Gewähr.</strong> <AppName /> macht sich für bessere Abstimmungsverfahren stark. Es wird
        von einer einzigen Person mit größter Sorgfalt bei Sicherheit, Datenschutz, Leistung, Architektur und
        Codequalität gebaut, ist aber nicht akkreditiert, geprüft oder unabhängig begutachtet: Seine Ergebnisse sind
        nicht garantiert korrekt oder eine getreue Abbildung des Willens einer Gruppe. Dafür wären Akkreditierung,
        fachliche Prüfung der Technik und laufende Betreuung nötig, die eine einzelne Person ohne Sponsoren und
        Fachleute nicht leisten kann.</>,
    },
    limitsLink: 'Alles zu Datenschutz und Grenzen',
  },
  join: {
    label: 'Du hast einen Code?',
    typeTheCode: 'Gib den Code ein, den du bekommen hast.',
    notACode: 'Ein Code besteht aus sechs Buchstaben und Ziffern, zum Beispiel K7M-4QX.',
    joining: 'Beitritt läuft…',
    join: 'Abstimmen!',
  },

  newPoll: {
    title: 'Gemeinsam entscheiden · super-vote',
    heading: 'Gemeinsam entscheiden',
    question: 'Frage',
    questionPlaceholder: 'Wo essen wir am Freitag?',
    options: 'Optionen',
    option: (row: number) => `Option ${row}`,
    remove: (option: string) => `${option} entfernen`,
    optionsHint: (max: number) => `Bis zu ${max} Optionen. Beim Tippen erscheint eine neue Zeile.`,

    votingSystem: 'Abstimmungsverfahren',
    systems: {
      MAJORITY_JUDGMENT: 'Mehrheitsurteil',
      APPROVAL: 'Zustimmung',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Alle bewerten jede Option von Ausgezeichnet bis Ungenügend. Die Option, die eine Mehrheit am '
        + 'besten bewertet, gewinnt: differenziert und schwer zu manipulieren.',
      APPROVAL: 'Alle haken jede Option an, die sie akzeptieren würden. Die Option mit der meisten Zustimmung gewinnt: schnell und einfach.',
    },

    whoCanFindIt: 'Wer sie finden kann',
    visibilityHints: {
      PUBLIC: 'Auf der Startseite aufgelistet, damit alle sie finden.',
      UNLISTED: 'Nirgends aufgelistet: Nur Personen, denen du den Link oder den Code gibst, finden sie.',
    },

    whoCanVote: 'Wer abstimmen darf',
    anyone: 'Alle',
    invitedOnly: 'Nur Eingeladene',
    anyoneHint: <>
      Alle mit dem Link oder dem Code. Wer es darauf anlegt, kann von einem anderen Browser aus erneut abstimmen: Um
      jede Person nur einmal zu zählen, lade sie ein.
    </>,
    invitedHint: 'Jede Person bekommt einen eigenen Link, gültig für eine Stimme. Du siehst, welche Links benutzt wurden, '
      + 'nie, was jemand gewählt hat.',

    whoVoted: 'Wer abgestimmt hat',
    anonymous: 'Anonym',
    showNames: 'Namen zeigen',
    anonymousHint: 'Niemand sieht, wer abgestimmt hat, nur wie viele.',
    showNamesHint: 'Wer abstimmt, kann einen Namen angeben, der unter den Ergebnissen erscheint. Niemand sieht, wer was gewählt hat.',

    results: 'Ergebnisse',
    resultsChoices: {
      LIVE: 'Live',
      AFTER_BALLOTS: 'Verzögert',
      AFTER_CLOSING: 'Am Ende',
    },
    resultsHints: {
      LIVE: 'Achtung: Alle sehen, wie jede Stimme die Ergebnisse bewegt. In einer kleinen Gruppe zeigt das, wer was gewählt hat.',
      AFTER_BALLOTS: 'Verborgen, bis so viele Stimmen eingegangen sind, um die ersten Abstimmenden zu schützen. '
        + 'Danach bewegt jede Stimme die Ergebnisse, was spätere Abstimmende immer noch verraten kann.',
      AFTER_CLOSING: 'Sichtbar, sobald du die Abstimmung beendest. Bis dahin sehen alle nur, wie viele abgestimmt haben.',
    },
    ballotsBeforeResults: 'Stimmen, bevor die Ergebnisse erscheinen',

    optionOrder: 'Reihenfolge der Optionen',
    orders: {
      ALPHABETICAL: 'A bis Z',
      SHUFFLED: 'Gemischt',
      AS_WRITTEN: 'Wie geschrieben',
    },
    orderHints: {
      ALPHABETICAL: 'Von A bis Z, Zahlen nach Wert: 2 vor 10. Schreibe Daten mit dem Jahr zuerst, etwa 2026-10-24.',
      SHUFFLED: 'Für jede Person bei jedem Besuch eine neue Reihenfolge, damit keine Option von ihrem Platz profitiert.',
      AS_WRITTEN: 'Deine Reihenfolge. Die ersten Plätze ziehen mehr Zustimmung an, das kann wie ein Versuch wirken, das Ergebnis zu beeinflussen.',
    },

    deletedAfter: (days: number) => `Abstimmungen werden ${days} Tage nach ihrer Erstellung samt ihren Stimmen gelöscht.`,
    notForElections: <>
      <AppName /> ist für Entscheidungen im Alltag gedacht, nicht für offizielle oder bindende Abstimmungen.{' '}
      <Link to="/privacy">Datenschutz und Grenzen</Link>
    </>,
    noNewPolls: 'Dieser Server nimmt im Moment keine neuen Abstimmungen an.',
    creating: 'Wird erstellt…',
    create: 'Frage stellen',

    problems: {
      titleMissing: 'Gib deiner Abstimmung einen Titel.',
      titleTooLong: (max: number) => `Ein Titel darf höchstens ${max} Zeichen lang sein.`,
      titleInvisible: 'Ein Titel darf nur sichtbare Zeichen enthalten.',
      tooFewOptions: 'Füge mindestens zwei Optionen hinzu.',
      tooManyOptions: (max: number) => `Eine Abstimmung darf höchstens ${max} Optionen haben.`,
      optionTooLong: (max: number) => `Eine Option darf höchstens ${max} Zeichen lang sein.`,
      optionInvisible: 'Eine Option darf nur sichtbare Zeichen enthalten.',
      optionTwice: (option: string) => `„${option}“ steht zweimal in der Liste. Jede Option muss anders sein.`,
      resultsAfterBallots: (min: number) => `Wähle eine ganze Zahl von Stimmen, mindestens ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Abstimmung wird übernommen…',
    deleted: 'Diese Abstimmung wurde gelöscht',
    deletedText: 'Sie wurde gelöscht, und ihre Ergebnisse mit ihr.',
    notFound: 'Abstimmung nicht gefunden',
    notFoundText: 'Der Link ist vielleicht unvollständig, oder die Abstimmung wurde gelöscht.',
    notLoaded: 'Die Abstimmung konnte nicht geladen werden',
    loadingPoll: 'Abstimmung wird geladen…',
    byInvitation: 'Auf Einladung',
    optionOrder: { SHUFFLED: 'Optionen gemischt', ALPHABETICAL: 'Optionen sortiert', AS_WRITTEN: 'Optionen in eigener Reihenfolge' },
    closed: 'Beendet',
    keepTitle: 'Bewahre deinen Admin-Link auf',
    keepText: 'Öffne ihn in einem anderen Browser oder auf einem anderen Gerät, um diese Abstimmung von dort aus zu '
      + 'verwalten statt von hier: beenden, löschen, Leute einladen. Behalte ihn für dich: Wer ihn hat, kann dasselbe tun.',
    readyToInvite: <><strong>Deine Abstimmung ist bereit.</strong> Lade unten Leute ein: Jede Person bekommt einen eigenen Link.</>,
    readyToShare: <><strong>Deine Abstimmung ist bereit.</strong> Teile ihren Link, um Stimmen zu sammeln.</>,
    closedAgo: (ago: string) => `Die Abstimmung wurde ${ago} beendet. Dies sind die endgültigen Ergebnisse.`,
    deletedOn: (date: string) => `Diese Abstimmung und ihre Stimmen werden am ${date} gelöscht.`,
    lastPoll: (wait: string) => `Das war vorerst deine letzte Abstimmung: In ${wait} kannst du weitere erstellen.`,
    pollsLeft: (count: number, wait: string) => `In den nächsten ${wait} kannst du noch ${counted(count, 'Abstimmung', 'Abstimmungen')} erstellen.`,
    fairShare: (perDay: number) => `Damit es für alle fair bleibt, kann jede Verbindung ${perDay} Abstimmungen pro Tag erstellen.`,
  },

  ballot: {
    yourBallot: 'Deine Stimme',
    withdraw: 'Zurückziehen',
    submit: 'Meine Stimme abgeben',
    rateEveryOption: 'Bewerte jede Option, um abzusenden',
    submitting: 'Wird gesendet…',
    majorityJudgmentLive: 'Gib jeder Option eine Bewertung. Nicht bewertete Optionen zählen als Ungenügend.',
    majorityJudgmentEnvelope: 'Gib jeder Option eine Bewertung und sende dann deine Stimme ab.',
    approval: 'Hake jede Option an, mit der du zufrieden wärst.',
    invited: 'Deine Einladung gilt für eine Stimme, die nur dieser Browser ändern kann. Wer dich eingeladen hat, sieht, '
      + 'dass sie benutzt wurde, nie, was du gewählt hast.',
    counted: 'Deine Stimme ist gezählt. Du kannst sie von diesem Browser aus ändern, bis die Abstimmung endet.',
    notVoted: 'Du hast noch nicht abgestimmt.',
    hide: 'Meine Stimme verbergen',
    hidden: 'Deine Stimme ist gezählt und hier verborgen: Niemand, der auf diesen Bildschirm schaut, sieht deine Wahl.',
    change: 'Meine Stimme ändern',
    invitationUsed: 'Diese Einladung wurde schon benutzt, in einem anderen Browser oder auf einem anderen Gerät. Ihre '
      + 'Stimme lässt sich nur dort ändern.',
    invitationNotValid: 'Dieser Einladungslink ist ungültig. Bitte die Person, die dich eingeladen hat, um einen neuen.',
    notInvited: 'Nur eingeladene Personen können bei dieser Abstimmung abstimmen. Wenn du eingeladen wurdest, öffne den Link aus deiner Einladung.',
    yourName: 'Dein Name',
    namePlaceholder: 'Anonym',
    namesGiven: 'Optional. Alle sehen die angegebenen Namen, aber nicht die Wahl.',
    namesLive: 'Live-Ergebnisse können verraten, wer was gewählt hat.',
    notRatedYet: 'Noch nicht bewertet',
    chooseAMention: 'Wähle eine Bewertung…',
    optionsYouApprove: 'Optionen, denen du zustimmst',
  },

  results: {
    heading: 'Ergebnisse',
    ballots: (count: number) => counted(count, 'Stimme', 'Stimmen'),
    noBallotsYet: 'Noch keine Stimmen. Die Ergebnisse füllen sich, sobald sie eintreffen.',
    keptUntilBallots: (count: number) => `Die Ergebnisse erscheinen, sobald ${count} Stimmen eingegangen sind, damit die `
      + 'Wahl der ersten Abstimmenden ihre eigene bleibt.',
    keptUntilYouClose: 'Die Ergebnisse erscheinen, sobald du die Abstimmung beendest.',
    keptUntilClosed: 'Die Ergebnisse erscheinen, sobald die Abstimmung endet.',
    download: 'Ergebnisse herunterladen',
    final: 'Endgültig',
    connecting: 'Verbindung wird hergestellt…',
    live: 'Live',
    reconnecting: 'Verbindung wird wiederhergestellt…',
    whoVoted: 'Wer abgestimmt hat',
    anonymousVoters: (count: number) => counted(count, 'anonyme Person', 'anonyme Personen'),
    andAnonymousVoters: (count: number) => `und ${counted(count, 'anonyme Person', 'anonyme Personen')}`,
    moreVoters: (count: number) => `und ${counted(count, 'weitere Person', 'weitere Personen')}`,
    rank: (rank: number) => `Platz ${rank}`,
    approvals: (count: number) => counted(count, 'Zustimmung', 'Zustimmungen'),
    noBallotsFor: (option: string) => `${option}: noch keine Stimmen`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent} %`,
    exAequo: 'ex aequo',
    majorityMention: 'Mehrheitsnote:',
    gmjScore: 'GMJ-Wert:',
    gmjScoreTitle: (score: string) => `Der übliche Urteilswert des GMJ: ${score}. Er entscheidet zwischen Optionen mit der `
      + 'gleichen Mehrheitsnote.',
    orBetter: (share: string, mention: string) => `${share} sagen ${mention} oder besser`,
  },

  owner: {
    manage: 'Deine Abstimmung verwalten',
    adminLink: 'Admin-Link der Abstimmung',
    adminLinkHint: 'Dein Admin-Link: Öffne ihn in einem anderen Browser oder auf einem anderen Gerät, um die Abstimmung '
      + 'von dort aus zu verwalten statt von hier. Behalte ihn für dich.',
    showAdminLink: 'Admin-Link anzeigen',
    onlyThisBrowser: 'Nur dieser Browser kann diese Abstimmung vorzeitig beenden oder löschen.',
    close: 'Abstimmung beenden',
    delete: 'Abstimmung löschen',
    closeQuestion: 'Die Abstimmung endgültig beenden? Niemand kann mehr abstimmen oder seine Stimme ändern, und alle sehen '
      + 'die endgültigen Ergebnisse.',
    keepOpen: 'Offen lassen',
    closeForGood: 'Endgültig beenden',
    deleteQuestion: 'Diese Abstimmung und ihre Stimmen endgültig löschen? Alle, die sie gerade ansehen, sehen sie verschwinden.',
    keep: 'Behalten',
    deleteForGood: 'Endgültig löschen',
    deletedToast: 'Die Abstimmung wurde gelöscht.',
  },

  invitations: {
    heading: 'Einladungen',
    count: (count: number) => counted(count, 'Einladung', 'Einladungen'),
    used: (used: number, count: number) => `${number(used)} von ${number(count)} benutzt`,
    hint: 'Nur die Personen, die du einlädst, können abstimmen, jede mit einem eigenen Link, gültig für eine Stimme. '
      + 'Du siehst, welche Links benutzt wurden, nie, was jemand gewählt hat. Du selbst kannst ohne Link abstimmen.',
    invite: 'Einladen',
    inviting: 'Wird eingeladen…',
    inviteSomeone: 'Jemanden einladen',
    namePlaceholder: 'Name oder Spitzname (optional)',
    loading: 'Einladungen werden geladen…',
    showMore: 'Mehr anzeigen',
    newestShown: (count: number) => `Die neuesten ${number(count)} werden angezeigt.`,
    invitationFor: (label: string) => `Einladung für ${label}`,
    invitationNumber: (number: number) => `Einladung ${number}`,
    shareHint: 'Nur für diese Person. Sie gilt für eine Stimme, die nur der Browser ändern kann, mit dem sie abstimmt.',
    linkLabel: 'Link der Einladung',
    message: (title: string) => `Du bist eingeladen, bei „${title}“ abzustimmen. Dieser Link gilt nur für dich.`,
    isUsed: 'Benutzt',
    notUsedYet: 'Noch nicht benutzt',
    share: (name: string) => `Link für ${name} teilen`,
    takeBack: (name: string) => `Link für ${name} zurückziehen`,
    takeBackQuestion: 'Diese Einladung zurückziehen? Ihr Link funktioniert dann nicht mehr.',
    keep: 'Behalten',
    takeItBack: 'Zurückziehen',
  },

  share: {
    share: 'Teilen',
    title: 'Diese Abstimmung teilen',
    anyone: 'Alle mit dem Code oder dem Link können abstimmen.',
    unlisted: 'Die Abstimmung ist sonst nirgends aufgelistet.',
    linkLabel: 'Link zur Abstimmung',
    joinCode: 'Beitrittscode',
    toEnterAt: (host: string) => `zum Eingeben auf ${host}`,
    copy: 'Kopieren',
    copied: 'Kopiert',
    copyCode: 'Beitrittscode kopieren',
    qrCode: (url: string) => `QR-Code für ${url}`,
    throughAnApp: 'Über eine App teilen',
    byEmail: 'Per E-Mail senden',
    message: (title: string) => `Stimme bei „${title}“ ab`,
    orCode: (code: string, host: string) => `Oder gib den Code ${code} auf ${host} ein.`,
  },

  statistics: {
    title: 'Statistiken · super-vote',
    heading: <><AppName /> in aller Welt</>,
    lead: 'Wie viele Abstimmungen, Stimmen und Besuchende, wann und von wo.',
    show: 'Anzeigen',
    measures: {
      voters: {
        label: 'Besuchende', plural: 'Besuchende',
        noun: () => 'Besuchende',
        count: (count: number) => `${number(count)} Besuchende`,
      },
      polls: {
        label: 'Abstimmungen', plural: 'Abstimmungen',
        noun: (count: number) => plural('de', count, 'Abstimmung', 'Abstimmungen'),
        count: (count: number) => counted(count, 'Abstimmung', 'Abstimmungen'),
      },
      ballots: {
        label: 'Stimmen', plural: 'Stimmen',
        noun: (count: number) => plural('de', count, 'Stimme', 'Stimmen'),
        count: (count: number) => counted(count, 'Stimme', 'Stimmen'),
      },
    },
    totals: {
      polls: 'Erstellte Abstimmungen',
      openPolls: 'Gerade offen',
      ballots: 'Abgegebene Stimmen',
      voters: 'Besuchende',
    },
    lastDays: 'In den letzten 90 Tagen',
    where: 'Wo',
    byRegion: 'Nach Region',
    noRegion: 'Noch keine Region.',
    tapADot: 'Tippe auf einen Punkt, um seine Zahlen zu sehen.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'In keiner Region angezeigt, weil eine Zeitzone '
      + `oder genug Personen zum Anzeigen fehlen: ${visitors}, ${polls} und ${ballots}.`,
    howCounted: 'Wie gezählt wird',
    howCountedText: <>
      Ein Besuch ist ein Browser oder eine App, die zu <AppName /> gekommen ist: Eine Person mit zwei Geräten zählt
      doppelt. Eine Stimme zählt einmal, egal wie oft sie geändert wird.
    </>,
    places: (updated: string) => 'Orte stammen aus der Zeitzone, die dein Gerät eingestellt hat, nie aus deiner Adresse, und '
      + 'es werden nur Summen gespeichert. Ein Ort erscheint, sobald drei Besuchende von dort kommen. Die Zahlen werden '
      + 'stündlich aktualisiert, damit sie sich nicht den Stimmen einer einzelnen Abstimmung zuordnen lassen, während '
      + `diese eintreffen. Zuletzt aktualisiert: ${updated}.`,
    sources: <>
      Jeder Punkt ist die Stadt, nach der eine Zeitzone benannt ist, und steht für alle in dieser Zone. Tage sind in UTC.
      Landflächen von <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>,
      Zeitzonen aus der <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA-Datenbank</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} am {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} in den letzten ${days} Tagen`,
    busiest: (day: string, count: string) => `, die meisten am ${day}: ${count}.`,
    topLine: (count: string) => `Spitzenwert: ${count}`,
    regionAndCity: 'Region und Stadt',
    map: (what: string) => `Weltkarte: ${what} nach Zeitzone. Die Tabelle darunter listet dieselben Zahlen.`,
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    nothingYet: 'Noch kein Ort zum Anzeigen.',
    fewer: 'weniger',
    upTo: (count: string) => `bis zu ${count}`,
    pollPlaces: 'Woher die Stimmen kommen',
    pollPlacesNone: 'Eine Region erscheint, sobald drei Stimmen aus ihr kommen.',
    pollPlacesHint: 'Nach der Zeitzone jeder abstimmenden Person, nie nach ihrer Adresse. Ein Ort erscheint, sobald drei '
      + 'Stimmen von dort kommen, und die Zahlen werden stündlich aktualisiert.',
    regions: {
      Africa: 'Afrika',
      America: 'Amerika',
      Antarctica: 'Antarktis',
      Arctic: 'Arktis',
      Asia: 'Asien',
      Atlantic: 'Atlantische Inseln',
      Australia: 'Australien',
      Europe: 'Europa',
      Indian: 'Indischer Ozean',
      Pacific: 'Pazifik',
    } as Record<string, string>,
  },

  about: {
    title: 'Über uns · super-vote',
    heading: <>Über <AppName /></>,
    lead: (days: number) => <>
      Eine kostenlose Open-Source-Möglichkeit für eine Gruppe, gemeinsam zu entscheiden: wo man isst, wohin man geht,
      was man wählt. Kein Konto, keine Werbung, kein Tracking. Abstimmungen werden {days} Tage nach ihrer Erstellung gelöscht.
    </>,
    howDecided: 'Wie die Ergebnisse zustande kommen',
    howDecidedText: <>
      Eine einzelne Wahl wirft das meiste weg, was Menschen denken: Ähnliche Optionen spalten ihre Anhängerschaft, und
      eine, die fast alle in Ordnung finden, kann gegen eine verlieren, die die Hälfte der Gruppe ablehnt.{' '}
      <AppName /> fragt mehr, auf zwei Arten.
    </>,
    majorityJudgment: 'Mehrheitsurteil',
    majorityJudgmentText: <>
      Alle bewerten jede Option, von <em>Ausgezeichnet</em> bis <em>Ungenügend</em>. Die <strong>Mehrheitsnote</strong>{' '}
      einer Option ist die beste Note, die mehr als die Hälfte der Abstimmenden ihr gibt oder übertrifft: ihr Median.
      Die Option mit der besten Mehrheitsnote gewinnt. Teilen sich mehrere diese Note, entscheidet der{' '}
      <strong>GMJ-Wert</strong> zwischen ihnen: Er misst, wie weit die Noten über oder unter dieser Note liegen.
      Optionen, die danach noch gleichauf sind, werden <em>ex aequo</em> gezeigt, und keine verborgene Regel wählt eine aus.
    </>,
    approval: 'Zustimmungswahl',
    approvalText: 'Alle haken jede Option an, mit der sie zufrieden wären. Die Option, die von den meisten Abstimmenden '
      + 'gebilligt wird, gewinnt. Das geht schnell und bestraft dich nie dafür, mehr als eine Option zu unterstützen.',
    science: 'Die Wissenschaft dahinter',
    scienceText: 'Keine Abstimmungsregel ist perfekt: Condorcet erkannte 1785, dass eine Gruppe A gegenüber B, B gegenüber C '
      + 'und C gegenüber A bevorzugen kann, und jede vernünftige Regel lässt sich manipulieren. Bewerten statt Rangordnen '
      + 'umgeht vieles davon, wie Weinrichter und Eiskunstlauf-Preisrichter wissen.',
    notes: {
      pnas2007: 'Stellt das Mehrheitsurteil vor: bewerten, dann nach dem Median der Noten ordnen.',
      book2011: 'Das Buch: die Theorie, ihre Eigenschaften, und echte Wahlen und Jurys.',
      judge2014: 'Warum Bewerten die Paradoxien des Rangordnens vermeidet und Manipulation widersteht.',
      fabre2021: <>Der Wert des „üblichen Urteils“, mit dem <AppName /> Gleichstände zwischen gleichen Mehrheitsnoten entscheidet.</>,
      brams1978: 'Das Plädoyer dafür, jede akzeptable Option zu billigen.',
      laslier2009: 'Wie Menschen bei der Zustimmungswahl strategisch abstimmen, und was daraus folgt.',
      gibbard1973: 'Mit Satterthwaite: Jede vernünftige Abstimmungsregel lässt sich manipulieren. Die Frage ist, wie stark.',
      satterthwaite1975: 'Dasselbe Ergebnis, unabhängig gefunden.',
    },
    whoMakesIt: 'Wer dahintersteht',
    whoMakesItText: <>
      <AppName /> wird von einer einzelnen Person in Québec in ihrer Freizeit gemacht und ist für alle kostenlos. Der
      Code ist offen: Jeder kann lesen, wie Stimmen gezählt werden, eine eigene Kopie betreiben oder eine Änderung vorschlagen.
    </>,
    seeTheCode: 'Quellcode auf GitHub ansehen',
  },

  privacy: {
    title: 'Datenschutz und Grenzen · super-vote',
    heading: 'Datenschutz und Grenzen',
    lead: <>
      <AppName /> ist so gebaut, dass niemand erkennen kann, was du gewählt hast. Hier steht, was gespeichert wird, wer
      was sieht und was es noch nicht kann.
    </>,

    forWhat: 'Wofür es gedacht ist',
    forWhatText: 'Gemeinsam entscheiden unter Menschen, die einander vertrauen: Freunde, Familie, ein Team, eine Klasse, ein '
      + 'Verein. Es ist nicht für Wahlen geeignet und auch nicht für Abstimmungen mit rechtlichen, finanziellen oder '
      + 'amtlichen Folgen: Dafür müsste jede abstimmende Person identifiziert und nur einmal gezählt werden, und die '
      + 'Ergebnisse müssten für alle überprüfbar sein, was super-vote noch nicht versprechen kann.',

    kept: 'Was gespeichert wird und wie lange',
    keptItems: (days: number) => [
      `Eine Abstimmung: ihre Frage, ihre Optionen und ihre Einstellungen, bis sie gelöscht wird, spätestens ${days} Tage `
        + 'nach ihrer Erstellung. Wer sie erstellt hat, kann sie früher löschen.',
      'Deine Stimme bei einer Abstimmung, unter einem Schlüssel gespeichert, der nicht sagt, wer du bist, und mit der '
        + 'Abstimmung gelöscht. Du kannst sie zurückziehen, bis die Abstimmung endet.',
      'Der Name, den du angibst, bei Abstimmungen, die Namen zeigen, getrennt von deiner Stimme gespeichert, damit nichts beides verbindet.',
      'Kopien der oben genannten Abstimmungen, Stimmen und Namen, jede Nacht zur Wiederherstellung nach einem Unfall '
        + 'angelegt und 7 Tage aufbewahrt: Was gelöscht wird, ist binnen einer Woche auch dort weg.',
      `Eine zufällige Kennung in einem Cookie, damit dieser Browser seine Stimmen ändern und seine Abstimmungen verwalten `
        + `kann, ${days} Tage nach seiner letzten Stimme oder Abstimmung, solange eine Abstimmung läuft. Es ist das `
        + 'einzige Cookie: keine Werbung, keine Analyse, kein Tracking.',
      'Die Zeitzone deines Geräts (zum Beispiel Europe/Paris), nur als Summen zu den Statistiken addiert. Nie deine Adresse.',
      'Die Adresse deines Netzwerks, höchstens einen Tag im Arbeitsspeicher gehalten, um zu begrenzen, wie viele '
        + 'Abstimmungen jedes Netzwerk erstellt. Sie wird nie aufgeschrieben.',
      'Deine Einstellungen und der zuletzt angegebene Name, nur in diesem Browser.',
      'Alles, was der Server speichert, liegt auf einer einzigen Maschine in Montréal, Kanada, einem Land, das die '
        + 'Europäische Union als Land mit angemessenem Schutz personenbezogener Daten anerkennt.',
    ],

    whoSees: 'Wer was sieht',
    whoSeesItems: [
      'Alle bei einer Abstimmung sehen die Ergebnisse als Summen, wenn die erstellende Person sich dafür entschieden hat, '
        + 'sowie die Namen, die Abstimmende angeben wollten.',
      'Wer eine Abstimmung erstellt hat, sieht dasselbe und welche Einladungen benutzt wurden: nie, was jemand gewählt hat.',
      'Niemand sieht deine Stimme. Selbst auf deinem eigenen Bildschirm ist sie nach dem Zählen zunächst verborgen.',
      'Wer den Server betreibt, sieht Anfragen, während sie geschehen. Was gespeichert wird, sagt nicht, wer was gewählt hat, '
        + 'aber super-vote verbirgt Stimmen nicht vor dem laufenden Server: Es wird darauf vertraut, dass die Betreibenden nicht hinsehen.',
    ],

    limits: 'Grenzen, die du kennen solltest',
    limitsItems: [
      'Ohne Einladungen kann eine Person von verschiedenen Browsern oder Geräten aus mehrmals abstimmen. super-vote '
        + 'setzt auf Treu und Glauben, und die Zahl der Stimmen zeigt, wenn missbraucht wird. Um jede Person nur einmal zu zählen, lade sie ein.',
      'Deine Stimmen und Abstimmungen gehören zu diesem Browser. Von einem anderen Gerät aus oder nach dem Löschen seiner Daten '
        + 'kannst du sie nicht mehr ändern oder verwalten, und es gibt kein Konto, um sie zurückzubekommen.',
      'Live-Ergebnisse bewegen sich mit jeder eintreffenden Stimme: In einer kleinen Gruppe können Zuschauende erkennen, wer '
        + 'was gewählt hat. Wer eine Abstimmung erstellt, wählt, wann die Ergebnisse erscheinen, und wird gewarnt.',
      'Die Zählung lässt sich nicht unabhängig prüfen: Du vertraust dem Server, dessen Code für alle offen zu lesen ist.',
      'super-vote ist kostenlos und läuft auf einem kleinen Server: Es kann zeitweise nicht verfügbar sein. Verlasse dich '
        + 'nicht darauf, wenn es dringend ist.',
    ],

    rights: 'Deine Daten, deine Entscheidungen',
    rightsText: 'Deine Stimmen sind nicht mit dir verknüpft, daher kann super-vote sie nicht für dich finden: Ziehe eine '
      + 'Stimme zurück oder lösche eine von dir erstellte Abstimmung von diesem Browser aus. Wenn du die Daten dieses '
      + 'Browsers für super-vote löschst, werden sein Cookie und seine Einstellungen entfernt.',
    contact: <>
      Fragen, eine Anfrage zu deinen Daten oder eine Abstimmung, die du melden möchtest:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">schreibe uns auf
      GitHub</a>. Eine Sicherheitslücke: siehe die{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">Sicherheitsrichtlinie</a>.
    </>,
    openSource: <>
      Nichts davon muss man auf Treu und Glauben hinnehmen: Der Code von <AppName />, einschließlich der Zählung und des
      Schutzes der Stimmen, ist <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">für
      alle offen lesbar</a>.
    </>,
  },

  legal: {
    title: 'Impressum · super-vote',
    heading: 'Impressum',
    publisher: 'Herausgeber',
    publisherText: <>
      <AppName /> wird von einer Privatperson in Québec, Kanada, ohne kommerzielle Absicht veröffentlicht. Name und
      Adresse werden hier nicht genannt: Der Hoster hat sie.
    </>,
    law: 'Anwendbares Recht',
    lawText: <>
      <AppName /> wird aus Québec veröffentlicht, nach den Gesetzen von Québec und Kanada. Es steht Menschen überall offen,
      und wer eine Abstimmung erstellt oder bei einer abstimmt, unterliegt auch den Gesetzen des Ortes, an dem er oder sie
      sich befindet. Was <AppName /> über dich speichert und warum, ist für alle gleich, wo auch immer sie sind:{' '}
      <Link to="/privacy">Datenschutz und Grenzen</Link>.
    </>,
    host: 'Hoster',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Kanada',
    ],
    hostPhone: (phone: ReactNode) => <>Telefon: {phone}</>,
    report: 'Eine Abstimmung melden',
    reportText: <>
      Abstimmungen werden von den Personen geschrieben, die sie erstellen. Um eine zu melden, die gegen das Gesetz
      verstößt, wegen ihres Titels, ihrer Optionen oder des Namens einer abstimmenden Person:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">schreibe uns auf
      GitHub</a>. Jede Meldung wird zeitnah geprüft, und was rechtswidrig ist, wird entfernt.
    </>,
  },
};
