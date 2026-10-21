/**
 * Everything the web app says, in French: en.tsx, translated. French
 * typography throughout, which fr.test.ts checks: a no-break space before
 * a colon and inside « », a narrow one before ; ! and ?, and the apostrophe ’.
 * Voters are spoken to as « vous », in words that fit everyone.
 */
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('fr', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('fr', count, one, other)}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  if (unit === 'minute') {
    return counted(count, 'minute', 'minutes');
  }
  return counted(count, 'heure', 'heures');
}

export const fr: Messages = {
  name: 'Français',

  number,
  percent: (share: number) => formatPercent('fr', share),
  decimal: (value: number, digits: number) => formatDecimal('fr', value, digits),
  date: (isoDate: string) => formatDate('fr', isoDate),
  moment: (isoDate: string) => formatMoment('fr', isoDate),
  day: (day: string) => formatUtcDay('fr', day),
  timeAgo: (isoDate: string) => timeAgo('fr', isoDate) ?? 'à l’instant',
  waitUntil: inWords,

  loading: 'Chargement…',
  backHome: 'Retour à l’accueil',
  tryAgain: 'Réessayer',
  close: 'Fermer',
  dismiss: 'Masquer',

  errors: {
    unexpected: 'Un problème est survenu. Veuillez réessayer.',
    unreachable: 'Le serveur est injoignable. Vérifiez votre connexion, puis réessayez.',
    failed: (status: number) => `Un problème est survenu (erreur ${status}). Veuillez réessayer.`,
  },

  problems: {
    'unknown-voter': 'super-vote ne reconnaît pas ce navigateur. Rechargez la page pour repartir de zéro.',
    'not-poll-creator': 'Seule la personne qui a créé ce sondage peut faire cela.',
    'not-invited': 'Seules les personnes invitées peuvent voter à ce sondage. Si vous avez reçu une invitation, ouvrez le lien qu’elle contient.',
    'handover-unavailable': 'Ce lien ne peut pas vous transmettre le sondage : il a déjà servi.',
    'cross-site': 'Cette demande venait d’un autre site, et a été refusée. Ouvrez super-vote directement.',
    'poll-not-found': 'Aucun sondage n’a ce lien ou ce code. Il est peut-être mal recopié, ou le sondage a été supprimé.',
    'poll-closed': 'Ce sondage est fermé : il n’accepte plus de bulletins.',
    'invitation-used': 'Quelqu’un a déjà voté avec cette invitation, dans un autre navigateur ou sur un autre appareil.',
    'collision': 'Cette modification est arrivée au même moment qu’une autre. Veuillez réessayer.',
    'too-many-polls': (wait: string) => 'Cette connexion a créé ses sondages pour aujourd’hui. Pour être juste '
      + `envers tout le monde, chacune en a quelques-uns par jour : vous pourrez en créer d’autres dans ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Trop de codes erronés depuis cette connexion : pour protéger les '
      + `sondages des essais au hasard, ses codes sont refusés pendant ${wait}. Les liens fonctionnent toujours.`,
    'server-error': 'Un problème est survenu de notre côté. Veuillez réessayer dans un instant.',
  },

  mentions: {
    Excellent: 'Excellent',
    VeryGood: 'Très bien',
    Good: 'Bien',
    Fair: 'Assez bien',
    Passable: 'Passable',
    Inadequate: 'Insuffisant',
    Bad: 'À rejeter',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Jugement majoritaire',
    APPROVAL: 'Vote par approbation',
  },

  visibilities: {
    PUBLIC: 'Public',
    UNLISTED: 'Privé',
  },

  app: {
    home: 'Accueil',
    settings: 'Réglages',
    footer: <><AppName /> est libre et gratuit.</>,
    footerLinks: 'À propos de super-vote',
    about: 'À propos, et la science derrière',
    privacy: 'Confidentialité et limites',
    legal: 'Mentions légales',
    statistics: 'Statistiques',
    sourceCode: 'Code source',
    notFound: 'Page introuvable',
    nothingHere: 'Il n’y a rien à cette adresse.',
  },

  settings: {
    language: 'Langue',
    appearance: 'Apparence',
    light: 'Clair',
    automatic: 'Automatique',
    dark: 'Sombre',
    mentionColours: 'Couleurs des mentions',
    greenToRed: 'Du vert au rouge',
    shadesOfGrey: 'Nuances de gris',
    shadesOfGreyHint: 'Les nuances de gris se lisent de la même façon quelles que soient les couleurs que vous '
      + 'distinguez : plus c’est clair, mieux c’est.',
    majorityJudgmentBallot: 'Bulletin au jugement majoritaire',
    colourScale: 'Échelle de couleurs',
    dropdowns: 'Listes déroulantes',
    castingYourBallot: 'Envoi de votre bulletin',
    live: 'En direct',
    envelope: 'Sous enveloppe',
    liveHint: 'Chaque changement compte dès que vous le faites.',
    envelopeHint: 'Remplissez votre bulletin, puis envoyez-le d’un coup.',
  },

  home: {
    title: 'super-vote · décider ensemble',
    lead: 'Les maths disent que c’est plus juste.',
    createQuestion: 'Besoin de créer un vote ?',
    createPoll: 'Décider ensemble !',
    yourPolls: 'Décider ensemble…',
    publicPolls: 'Sondages publics',
    noPublicPolls: 'Pas encore de sondage public.',
    public: 'Public',
    closed: 'Fermé',

    howItWorks: 'Comment ça marche',
    steps: [
      { title: 'Demandez', text: 'Une question et ses options.' },
      { title: 'Partagez', text: 'Un lien, un code QR ou un code.' },
      { title: 'Décidez', text: 'Tout le monde évalue, les résultats arrivent en direct.' },
    ],

    agent: {
      title: 'Prêt pour l’IA',
      text: 'Collez ceci dans un assistant qui a accès au Web, avec votre propre question.',
      prompt: (site: string, guide: string) => `Utilisez ${site} pour créer un sondage pour mon équipe (instructions `
        + `pour les agents : ${guide}). La question : « Où organiser notre séminaire ? » Les options : `
        + 'Lisbonne, Berlin, Barcelone. Utilisez le jugement majoritaire, et cachez les résultats jusqu’à ce que je '
        + 'ferme le sondage. Transmettez-moi le sondage, puis donnez-moi le lien à partager avec l’équipe.',
      copy: 'Copier la demande',
      copied: 'Demande copiée',
      caption: 'Il répond avec deux liens : ouvrez le premier pour que le sondage soit le vôtre, envoyez le second '
        + 'au groupe.',
    },

    systems: {
      title: 'Deux façons de décider',
      majorityJudgment: {
        title: 'Jugement majoritaire',
        text: 'Donnez une mention à chaque option, d’Excellent à « À rejeter ». La meilleure mention majoritaire l’emporte.',
      },
      approval: {
        title: 'Approbation',
        text: 'Cochez chaque option acceptable. La plus cochée l’emporte.',
      },
    },

    compare: {
      title: 'Plus juste que la plupart des élections officielles',
      text: 'La plupart des élections demandent un seul nom. Les candidatures proches se partagent les voix, et '
        + 'l’une que la majorité rejette peut tout de même gagner. Le jugement majoritaire, issu des travaux de '
        + 'Michel Balinski et Rida Laraki, mesure plutôt ce que chaque personne pense de chaque option.',
      science: 'La science derrière',
      single: 'Choix unique',
      singleNote: 'la plupart des élections',
      approval: 'Approbation',
      majorityJudgment: 'Jugement majoritaire',
      criteria: {
        nuance: 'Dire ce que vous pensez de chaque option',
        splitting: 'Les options proches ne divisent pas les voix',
        lesserEvil: 'Pas de vote pour le moindre mal',
        tactics: 'Difficile à manipuler',
        quick: 'Rapide à remplir',
        familiar: 'Familier',
      },
      marks: { yes: 'Oui', partly: 'En partie', no: 'Non' },
      caption: <><AppName /> propose l’approbation et le jugement majoritaire. Aucun mode de scrutin n’est
        parfait, mais certains sont bien plus justes que d’autres.</>,
    },

    supportTitle: 'Gratuit, libre, sans publicité',
    supportText: 'Fait par une personne, sur son temps libre. S’il a aidé votre groupe à décider, vous pouvez '
      + 'l’aider.',

    limitsTitle: 'Bon à savoir',
    limits: {
      everyday: <><strong>Pour les décisions du quotidien,</strong> pas les élections officielles : sans compte, une
        personne peut revoter depuis un autre navigateur. Les invitations comptent chaque personne une seule
        fois.</>,
      private: <><strong>Confidentiel, mais pas caché au serveur.</strong> Personne d’autre ne voit votre bulletin, et les bulletins conservés
        ne disent pas qui les a déposés.</>,
      browser: (days: number) => <><strong>Lié à ce navigateur,</strong> par un seul cookie, gardé {days} jours
        après votre dernier bulletin ou sondage. Ni publicité, ni pistage.</>,
      deleted: (days: number) => <><strong>Supprimés après {days} jours,</strong> sondages et bulletins.</>,
      disclaimer: <><strong>Sans garantie.</strong> <AppName /> vise à faire connaître de meilleures façons de voter.
        Il est fait par une seule personne, avec le plus grand soin pour la sécurité, la confidentialité, la
        performance, l’architecture et la qualité du code, mais il n’est ni accrédité, ni audité, ni revu de façon
        indépendante : l’exactitude de ses résultats, et leur fidélité à la volonté d’un groupe, ne sont pas
        garanties. Il faudrait pour cela une accréditation, une revue technique par des spécialistes et un soutien
        durable, ce qu’une seule personne ne peut offrir sans parrainages ni spécialistes.</>,
    },
    limitsLink: 'Tout sur la confidentialité et les limites',
  },
  join: {
    label: 'Vous avez un code ?',
    typeTheCode: 'Tapez le code qu’on vous a donné.',
    joining: 'Ouverture…',
    join: 'Vote !',
  },

  newPoll: {
    title: 'Décider ensemble · super-vote',
    heading: 'Décider ensemble',
    question: 'Question',
    questionPlaceholder: 'On mange où vendredi ?',
    options: 'Options',
    option: (row: number) => `Option ${row}`,
    remove: (option: string) => `Retirer ${option}`,
    optionsHint: (max: number) => `Jusqu’à ${max} options. Une nouvelle ligne apparaît à mesure que vous écrivez.`,

    votingSystem: 'Mode de scrutin',
    systems: {
      MAJORITY_JUDGMENT: 'Jugement majoritaire',
      APPROVAL: 'Approbation',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Les votants évaluent chaque option, de « Excellent » à « À rejeter ». L’option la mieux '
        + 'évaluée par une majorité l’emporte : nuancé, et difficile à manipuler.',
      APPROVAL: 'Les votants cochent chaque option qu’ils accepteraient. L’option la plus approuvée l’emporte : '
        + 'rapide et simple.',
    },

    whoCanFindIt: 'Qui peut le trouver',
    visibilityHints: {
      PUBLIC: 'Listé sur la page d’accueil, pour que tout le monde le trouve.',
      UNLISTED: 'Listé nulle part : seules les personnes avec qui vous partagez le lien ou le code peuvent le trouver.',
    },

    whoCanVote: 'Qui peut voter',
    anyone: 'Tout le monde',
    invitedOnly: 'Sur invitation',
    anyoneHint: <>
      Toute personne qui a le lien ou le code. Une personne déterminée peut revoter depuis un autre navigateur : pour
      compter chaque personne une seule fois, invitez-les.
    </>,
    invitedHint: 'Chaque personne reçoit un lien bien à elle, qui vaut un bulletin. Vous voyez quels liens ont servi, '
      + 'jamais ce que chaque personne a choisi.',

    whoVoted: 'Qui a voté',
    anonymous: 'Anonyme',
    showNames: 'Afficher les noms',
    anonymousHint: 'Personne ne voit qui a voté, seulement combien.',
    showNamesHint: 'Les votants peuvent donner un nom, affiché sous les résultats. Personne ne voit qui a choisi quoi.',

    results: 'Résultats',
    resultsChoices: {
      LIVE: 'En direct',
      AFTER_BALLOTS: 'Différés',
      AFTER_CLOSING: 'À la clôture',
    },
    resultsHints: {
      LIVE: 'Attention : tout le monde voit chaque bulletin faire bouger les résultats. Dans un petit groupe, cela '
        + 'montre qui a choisi quoi.',
      AFTER_BALLOTS: 'Cachés jusqu’à ce nombre de bulletins, pour protéger les premiers votes. Ensuite, chaque bulletin '
        + 'les fait bouger, ce qui peut encore trahir un vote ultérieur.',
      AFTER_CLOSING: 'Affichés quand vous fermez le sondage. D’ici là, tout le monde voit seulement combien ont voté.',
    },
    ballotsBeforeResults: 'Bulletins avant d’afficher les résultats',

    optionOrder: 'Ordre des options',
    orders: {
      ALPHABETICAL: 'De A à Z',
      SHUFFLED: 'Mélangé',
      AS_WRITTEN: 'Tel quel',
    },
    orderHints: {
      ALPHABETICAL: 'De A à Z, les nombres selon leur valeur : 2 avant 10. Écrivez les dates en commençant par l’année, '
        + 'comme 2026-10-24.',
      SHUFFLED: 'Un nouvel ordre pour chaque personne à chaque visite, pour qu’aucune option ne profite de sa place.',
      AS_WRITTEN: 'Votre ordre. Les premières places attirent plus de soutien : cela peut passer pour une tentative '
        + 'd’influencer le résultat.',
    },

    deletedAfter: (days: number) => `Les sondages sont supprimés ${days} jours après leur création, avec leurs bulletins.`,
    notForElections: <>
      <AppName /> sert aux décisions du quotidien, pas aux votes officiels ou engageants.{' '}
      <Link to="/privacy">Confidentialité et limites</Link>
    </>,
    noNewPolls: 'Ce serveur ne prend pas de nouveaux sondages pour le moment.',
    creating: 'Création…',
    create: 'Poser la question',

    problems: {
      titleMissing: 'Donnez une question à votre sondage.',
      titleTooLong: (max: number) => `Une question compte au plus ${max} caractères.`,
      titleInvisible: 'Une question ne peut contenir que des caractères visibles.',
      tooFewOptions: 'Ajoutez au moins deux options.',
      tooManyOptions: (max: number) => `Un sondage compte au plus ${max} options.`,
      optionTooLong: (max: number) => `Une option compte au plus ${max} caractères.`,
      optionInvisible: 'Une option ne peut contenir que des caractères visibles.',
      optionTwice: (option: string) => `« ${option} » figure deux fois. Chaque option doit être différente.`,
      resultsAfterBallots: (min: number) => `Choisissez un nombre entier de bulletins, au moins ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Prise en main du sondage…',
    deleted: 'Ce sondage a été supprimé',
    deletedText: 'Il a été supprimé, et ses résultats avec lui.',
    notFound: 'Sondage introuvable',
    notFoundText: 'Le lien est peut-être incomplet, ou le sondage a été supprimé.',
    notLoaded: 'Le sondage n’a pas pu être chargé',
    loadingPoll: 'Chargement du sondage…',
    byInvitation: 'Sur invitation',
    created: (ago: string) => `Créé ${ago}`,
    closed: 'Fermé',
    readyToInvite: <><strong>Votre sondage est prêt.</strong> Invitez des personnes ci-dessous : chacune reçoit un lien
      bien à elle.</>,
    readyToShare: <><strong>Votre sondage est prêt.</strong> Partagez son lien pour recueillir des bulletins.</>,
    closedAgo: (ago: string) => `Vote clos ${ago}. Voici les résultats définitifs.`,
    deletedOn: (date: string) => `Ce sondage et ses bulletins seront supprimés le ${date}.`,
    lastPoll: (wait: string) => `C’était votre dernier sondage pour l’instant : vous pourrez en créer d’autres dans ${wait}.`,
    pollsLeft: (count: number, wait: string) => `Vous pouvez encore créer ${counted(count, 'sondage', 'sondages')} dans les ${wait} qui viennent.`,
    fairShare: (perDay: number) => `Pour être juste envers tout le monde, chaque connexion peut créer ${perDay} sondages par jour.`,
  },

  ballot: {
    yourBallot: 'Votre bulletin',
    withdraw: 'Retirer',
    submit: 'Envoyer mon bulletin',
    rateEveryOption: 'Évaluez chaque option pour envoyer',
    submitting: 'Envoi…',
    majorityJudgmentLive: 'Donnez une mention à chaque option. Les options que vous n’avez pas évaluées comptent comme « À rejeter ».',
    majorityJudgmentEnvelope: 'Donnez une mention à chaque option, puis envoyez votre bulletin.',
    approval: 'Cochez chaque option qui vous conviendrait.',
    shuffled: 'Les options sont mélangées pour chaque votant, pour qu’aucune ne profite de sa place.',
    alphabetical: 'Les options sont rangées de A à Z.',
    invited: 'Votre invitation vaut un bulletin, que seul ce navigateur peut modifier. La personne qui vous l’a '
      + 'envoyée voit qu’elle a servi, jamais ce que vous avez choisi.',
    counted: 'Votre bulletin est compté. Vous pouvez le modifier depuis ce navigateur jusqu’à la clôture du sondage.',
    notVoted: 'Vous n’avez pas encore voté.',
    hide: 'Masquer mon bulletin',
    hidden: 'Votre bulletin est compté, et caché ici : personne ne voit vos choix en regardant cet écran.',
    change: 'Modifier mon bulletin',
    invitationUsed: 'Cette invitation a déjà servi, dans un autre navigateur ou sur un autre appareil. Son bulletin ne '
      + 'peut être modifié que là-bas.',
    invitationNotValid: 'Ce lien d’invitation n’est pas valide. Demandez-en un nouveau à la personne qui vous l’a envoyé.',
    notInvited: 'Seules les personnes invitées peuvent voter à ce sondage. Si vous avez reçu une invitation, ouvrez '
      + 'le lien qu’elle contient.',
    yourName: 'Votre nom',
    namePlaceholder: 'Laissez vide pour rester anonyme',
    namesAtClose: 'Tout le monde sur ce sondage voit les noms donnés, jamais qui a choisi quoi.',
    namesLive: 'Tout le monde ici voit les noms donnés. Les résultats bougent en direct : qui regarde peut deviner qui '
      + 'a choisi quoi.',
    notRatedYet: 'Pas encore évaluée',
    chooseAMention: 'Choisissez une mention…',
    optionsYouApprove: 'Les options que vous approuvez',
  },

  results: {
    heading: 'Résultats',
    ballots: (count: number) => counted(count, 'bulletin', 'bulletins'),
    noBallotsYet: 'Pas encore de bulletin. Les résultats se remplissent à mesure qu’ils arrivent.',
    keptUntilBallots: (count: number) => `Les résultats s’affichent à partir de ${count} bulletins, pour que les `
      + 'choix des premiers votants restent les leurs.',
    keptUntilYouClose: 'Les résultats s’affichent quand vous fermez le sondage.',
    keptUntilClosed: 'Les résultats s’affichent à la clôture du sondage.',
    download: 'Télécharger les résultats',
    final: 'Définitifs',
    connecting: 'Connexion…',
    live: 'En direct',
    reconnecting: 'Reconnexion…',
    whoVoted: 'Qui a voté',
    anonymousVoters: (count: number) => counted(count, 'votant anonyme', 'votants anonymes'),
    andAnonymousVoters: (count: number) => `et ${counted(count, 'votant anonyme', 'votants anonymes')}`,
    moreVoters: (count: number) => `et ${counted(count, 'autre votant', 'autres votants')}`,
    rank: (rank: number) => `Rang ${rank}`,
    approvals: (count: number) => counted(count, 'approbation', 'approbations'),
    noBallotsFor: (option: string) => `${option} : pas encore de bulletin`,
    profile: (option: string, mentions: string) => `${option} : ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention} : ${share}`,
    // Without the space French puts before %: on a narrow card, the labels would run into each other.
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Mention majoritaire :',
    gmjScore: 'Score GMJ :',
    gmjScoreTitle: (score: string) => `Le score GMJ du jugement usuel : ${score}. Il départage les options qui ont la `
      + 'même mention majoritaire.',
    orBetter: (share: string, mention: string) => `${share} disent ${mention} ou mieux`,
  },

  owner: {
    manage: 'Gérer votre sondage',
    onlyThisBrowser: 'Seul ce navigateur peut fermer ou supprimer ce sondage avant l’heure.',
    close: 'Clore le vote',
    delete: 'Supprimer le sondage',
    closeQuestion: 'Clore le vote pour de bon ? Personne ne pourra plus voter ni modifier son bulletin, et tout le monde '
      + 'verra les résultats définitifs.',
    keepOpen: 'Le garder ouvert',
    closeForGood: 'Clore pour de bon',
    deleteQuestion: 'Supprimer pour de bon ce sondage et ses bulletins ? Les personnes qui le regardent le verront '
      + 'disparaître.',
    keep: 'Le garder',
    deleteForGood: 'Supprimer pour de bon',
    deletedToast: 'Le sondage a été supprimé.',
  },

  invitations: {
    heading: 'Invitations',
    count: (count: number) => counted(count, 'invitation', 'invitations'),
    used: (used: number, count: number) => `${number(used)} sur ${number(count)} utilisées`,
    hint: 'Seules les personnes que vous invitez peuvent voter, chacune avec un lien bien à elle, qui vaut un '
      + 'bulletin. Vous voyez quels liens ont servi, jamais ce que chaque personne a choisi. Vous pouvez voter sans lien.',
    invite: 'Inviter',
    inviting: 'Invitation…',
    inviteSomeone: 'Inviter quelqu’un',
    namePlaceholder: 'Nom ou surnom (facultatif)',
    loading: 'Chargement des invitations…',
    showMore: 'Afficher plus',
    newestShown: (count: number) => `Les ${number(count)} plus récentes sont affichées.`,
    invitationFor: (label: string) => `Invitation pour ${label}`,
    invitationNumber: (number: number) => `Invitation ${number}`,
    shareHint: 'Pour cette personne seulement. Il vaut un bulletin, que seul le navigateur d’où elle vote peut modifier.',
    linkLabel: 'Lien de l’invitation',
    message: (title: string) => `Voici votre invitation à voter au sondage « ${title} ». Ce lien n’est que pour vous.`,
    isUsed: 'Utilisée',
    notUsedYet: 'Pas encore utilisée',
    share: (name: string) => `Partager le lien de ${name}`,
    takeBack: (name: string) => `Reprendre le lien de ${name}`,
    takeBackQuestion: 'Reprendre cette invitation ? Son lien cessera de fonctionner.',
    keep: 'La garder',
    takeItBack: 'La reprendre',
  },

  share: {
    share: 'Partager',
    title: 'Partager ce sondage',
    invitedOnly: 'Toute personne qui a le code ou le lien peut voir le sondage. Seules les personnes que vous invitez '
      + 'peuvent voter.',
    anyone: 'Toute personne qui a le code ou le lien peut voter.',
    unlisted: 'Le sondage n’est listé nulle part ailleurs.',
    linkLabel: 'Lien du sondage',
    joinCode: 'Code',
    toEnterAt: (host: string) => `à taper sur ${host}`,
    copy: 'Copier',
    copied: 'Copié',
    qrCode: (url: string) => `Code QR de ${url}`,
    throughAnApp: 'Partager avec une app',
    byEmail: 'Envoyer par courriel',
  },

  statistics: {
    title: 'Statistiques · super-vote',
    heading: <><AppName /> dans le monde</>,
    lead: 'Combien de sondages, de bulletins et de visiteurs, quand, et d’où.',
    show: 'Afficher',
    measures: {
      voters: {
        label: 'Visiteurs', plural: 'visiteurs',
        noun: (count: number) => plural('fr', count, 'visiteur', 'visiteurs'),
        count: (count: number) => counted(count, 'visiteur', 'visiteurs'),
      },
      polls: {
        label: 'Sondages', plural: 'sondages',
        noun: (count: number) => plural('fr', count, 'sondage', 'sondages'),
        count: (count: number) => counted(count, 'sondage', 'sondages'),
      },
      ballots: {
        label: 'Bulletins', plural: 'bulletins',
        noun: (count: number) => plural('fr', count, 'bulletin', 'bulletins'),
        count: (count: number) => counted(count, 'bulletin', 'bulletins'),
      },
    },
    totals: {
      polls: 'Sondages créés',
      openPolls: 'Ouverts en ce moment',
      ballots: 'Bulletins déposés',
      voters: 'Visiteurs',
    },
    lastDays: 'Sur les 90 derniers jours',
    where: 'Où',
    byRegion: 'Par région',
    noRegion: 'Pas encore de région.',
    tapADot: 'Touchez un point pour voir ses chiffres.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Comptés dans aucune région, faute de fuseau '
      + `horaire ou d’assez de monde pour s’afficher : ${visitors}, ${polls} et ${ballots}.`,
    howCounted: 'Comment c’est compté',
    howCountedText: <>
      Un visiteur est un navigateur ou une app qui a ouvert <AppName /> : une personne sur deux appareils compte
      deux fois. Un bulletin compte une fois, quel que soit le nombre de fois où son votant le modifie.
    </>,
    places: (updated: string) => 'Les lieux viennent du fuseau horaire de votre appareil, jamais de votre adresse, et '
      + 'seuls des totaux sont conservés. Un lieu s’affiche quand trois visiteurs en viennent. Les chiffres sont mis à '
      + 'jour chaque heure, pour qu’on ne puisse pas les rapprocher des bulletins d’un sondage à mesure qu’ils '
      + `arrivent. Dernière mise à jour : ${updated}.`,
    sources: <>
      Chaque point est la ville dont un fuseau horaire porte le nom, et représente tout ce fuseau. Les jours sont en
      UTC. Terres de <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>,
      fuseaux horaires de la <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">base de
      l’IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} le {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} sur les ${days} derniers jours`,
    busiest: (day: string, count: string) => `, le plus le ${day} : ${count}.`,
    topLine: (count: string) => `Ligne du haut : ${count}`,
    regionAndCity: 'Région et ville',
    map: (what: string) => `Carte du monde des ${what} par fuseau horaire. Le tableau ci-dessous donne les mêmes chiffres.`,
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    nothingYet: 'Pas encore de lieu à afficher.',
    fewer: 'moins',
    upTo: (count: string) => `jusqu’à ${count}`,
    pollPlaces: 'D’où viennent les bulletins',
    pollPlacesNone: 'Une région s’affiche quand trois bulletins en viennent.',
    pollPlacesHint: 'D’après le fuseau horaire de chaque votant, jamais son adresse. Un lieu s’affiche quand trois '
      + 'bulletins en viennent, et les chiffres sont mis à jour chaque heure.',
    regions: {
      Africa: 'Afrique',
      America: 'Amériques',
      Antarctica: 'Antarctique',
      Arctic: 'Arctique',
      Asia: 'Asie',
      Atlantic: 'Îles de l’Atlantique',
      Australia: 'Australie',
      Europe: 'Europe',
      Indian: 'Océan Indien',
      Pacific: 'Pacifique',
    },
  },

  about: {
    title: 'À propos · super-vote',
    heading: <>À propos de <AppName /></>,
    lead: (days: number) => <>
      Une façon libre et gratuite de décider ensemble : où manger, où aller, quoi choisir. Sans compte, sans
      publicité, sans pistage. Les sondages sont supprimés {days} jours après leur création.
    </>,
    howDecided: 'Comment les résultats sont décidés',
    howDecidedText: <>
      Un seul choix jette l’essentiel de ce que pensent les gens : les options proches se partagent leurs soutiens,
      et une option que la plupart trouvent bien peut perdre face à une autre que la moitié du groupe n’aime pas.
      <AppName /> demande plus, de l’une de ces deux façons.
    </>,
    majorityJudgment: 'Le jugement majoritaire',
    majorityJudgmentText: <>
      Chaque votant évalue chaque option, d’<em>Excellent</em> à <em>À rejeter</em>. La{' '}
      <strong>mention majoritaire</strong> d’une option est la meilleure mention que plus de la moitié des votants
      lui donnent, ou mieux : sa médiane. L’option qui a la meilleure mention majoritaire l’emporte. Quand plusieurs
      la partagent, le <strong>score GMJ</strong> les départage : il mesure à quel point les mentions penchent
      au-dessus ou au-dessous de cette mention. Les options encore à égalité sont affichées <em>ex aequo</em>, et
      aucune règle cachée n’en choisit une.
    </>,
    approval: 'Le vote par approbation',
    approvalText: 'Chaque votant coche chaque option qui lui conviendrait. L’option approuvée par le plus de votants '
      + 'l’emporte. C’est rapide, et cela ne pénalise jamais le fait de soutenir plusieurs options.',
    science: 'La science derrière',
    scienceText: 'Aucune règle de vote n’est parfaite : Condorcet a vu en 1785 qu’un groupe peut préférer A à B, B à C '
      + 'et C à A, et toute règle raisonnable peut être manipulée. Évaluer plutôt que classer évite une bonne part '
      + 'de ces écueils, comme le savent les jurys de vins et de patinage.',
    notes: {
      pnas2007: 'Présente le jugement majoritaire : évaluer, puis classer selon la mention médiane.',
      book2011: 'Le livre : la théorie, ses propriétés, et de vraies élections et de vrais jurys.',
      judge2014: 'Pourquoi évaluer évite les paradoxes du classement, et résiste à la manipulation.',
      fabre2021: <>Le score du « jugement usuel » dont <AppName /> se sert pour départager des mentions majoritaires
        égales.</>,
      brams1978: 'Plaidoyer pour l’approbation de toutes les options acceptables.',
      laslier2009: 'Comment les gens votent stratégiquement par approbation, et ce qui en résulte.',
      gibbard1973: 'Avec Satterthwaite : toute règle de vote raisonnable peut être manipulée. Reste à savoir à quel point.',
      satterthwaite1975: 'Le même résultat, trouvé indépendamment.',
    },
    whoMakesIt: 'Qui le fait',
    whoMakesItText: <>
      <AppName /> est fait par une personne au Québec, sur son temps libre, et il est gratuit pour tout le monde. Son
      code est ouvert : tout le monde peut lire comment les bulletins sont comptés, faire tourner sa propre copie,
      ou proposer une modification.
    </>,
    seeTheCode: 'Voir le code source sur GitHub',
  },

  privacy: {
    title: 'Confidentialité et limites · super-vote',
    heading: 'Confidentialité et limites',
    lead: <>
      <AppName /> est conçu pour que personne ne puisse savoir ce que vous avez choisi. Voici ce qu’il conserve, qui
      voit quoi, et ce qu’il ne sait pas encore faire.
    </>,

    forWhat: 'À quoi il sert',
    forWhatText: 'À décider ensemble entre personnes qui se font confiance : amis, famille, équipe, classe, '
      + 'association. Il ne convient ni aux élections, ni à aucun vote aux conséquences juridiques, financières ou '
      + 'officielles : ceux-là demandent que chaque votant soit identifié et compté une seule fois, et des résultats '
      + 'que tout le monde peut vérifier, ce que super-vote ne peut pas encore promettre.',

    kept: 'Ce qui est conservé, et combien de temps',
    keptItems: (days: number) => [
      `Un sondage : sa question, ses options et ses réglages, jusqu’à sa suppression, au plus tard ${days} jours après `
        + 'sa création. La personne qui l’a créé peut le supprimer plus tôt.',
      'Votre bulletin à un sondage, rangé sous une clé qui ne dit pas qui vous êtes, et supprimé avec le sondage. Vous '
        + 'pouvez le retirer jusqu’à la clôture.',
      'Le nom que vous donnez, sur les sondages qui affichent les noms, rangé à part de votre bulletin pour que rien '
        + 'ne relie les deux.',
      'Des copies des sondages, bulletins et noms ci-dessus, faites chaque nuit pour réparer un accident, et gardées '
        + '7 jours : ce qui est supprimé en disparaît en une semaine.',
      `Un identifiant aléatoire dans un cookie, pour que ce navigateur puisse modifier ses bulletins et gérer ses `
        + `sondages, ${days} jours après son dernier bulletin ou sondage, autant que dure un sondage. C’est le seul `
        + 'cookie : ni publicité, ni mesure d’audience, ni pistage.',
      'Le fuseau horaire de votre appareil (Europe/Paris, par exemple), ajouté aux statistiques sous forme de totaux '
        + 'seulement. Jamais votre adresse.',
      'L’adresse de votre réseau, gardée en mémoire un jour au plus, pour limiter le nombre de sondages que chaque '
        + 'réseau crée. Elle n’est jamais écrite nulle part.',
      'Vos réglages et le dernier nom que vous avez donné, dans ce navigateur seulement.',
      'Tout ce que garde le serveur, sur une seule machine à Montréal, au Canada, un pays dont l’Union européenne '
        + 'reconnaît qu’il protège les données personnelles de façon adéquate.',
    ],

    whoSees: 'Qui voit quoi',
    whoSeesItems: [
      'Tout le monde sur un sondage voit les résultats sous forme de totaux, quand la personne qui l’a créé a choisi '
        + 'de les montrer, et les noms que les votants ont choisi de donner.',
      'La personne qui a créé un sondage voit la même chose, et quelles invitations ont servi : jamais ce que '
        + 'chaque personne a choisi.',
      'Personne ne voit votre bulletin. Même sur votre écran, il commence caché une fois compté.',
      'Qui fait tourner le serveur voit les requêtes au moment où elles arrivent. Ce qui est conservé ne dit pas qui '
        + 'a choisi quoi, mais super-vote ne cache pas les bulletins au serveur en marche : on fait confiance aux '
        + 'personnes qui le gèrent pour ne pas regarder.',
    ],

    limits: 'Les limites à connaître',
    limitsItems: [
      'Sans invitations, une personne peut voter plusieurs fois depuis différents navigateurs ou appareils. super-vote '
        + 'compte sur la bonne foi, et le nombre de bulletins montre les abus. Pour compter chaque personne une seule '
        + 'fois, invitez-les.',
      'Vos bulletins et vos sondages appartiennent à ce navigateur. Depuis un autre appareil, ou une fois ses données '
        + 'effacées, vous ne pouvez plus les modifier ni les gérer, et aucun compte ne permet de les récupérer.',
      'Les résultats en direct bougent à chaque bulletin : dans un petit groupe, celles et ceux qui regardent peuvent '
        + 'deviner qui a choisi quoi. La personne qui crée un sondage choisit quand les résultats s’affichent, et en '
        + 'est avertie.',
      'Le décompte ne peut pas être vérifié de façon indépendante : vous faites confiance au serveur, dont le code est '
        + 'ouvert à la lecture de tous.',
      'super-vote est gratuit et tourne sur un seul petit serveur : il peut être indisponible par moments. Ne comptez '
        + 'pas dessus pour une urgence.',
    ],

    rights: 'Vos données, vos choix',
    rightsText: 'Vos bulletins ne sont pas liés à vous : super-vote ne peut donc pas les retrouver pour vous. Retirez '
      + 'un bulletin, ou supprimez un sondage que vous avez créé, depuis ce navigateur. Effacer les données de ce '
      + 'navigateur pour super-vote supprime son cookie et ses réglages.',
    contact: <>
      Une question, une demande sur vos données, ou un sondage à signaler :{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">écrivez-nous sur
      GitHub</a>. Une faille de sécurité : voyez la{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">politique
      de sécurité</a>.
    </>,
    openSource: <>
      Rien ici n’est à croire sur parole : le code de <AppName />, comptage et protection des bulletins compris, est{' '}
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">ouvert à la lecture de
      tous</a>.
    </>,
  },

  legal: {
    title: 'Mentions légales · super-vote',
    heading: 'Mentions légales',
    publisher: 'Édition',
    publisherText: 'super-vote est édité par une personne physique, à titre non professionnel. Comme la loi le permet '
      + 'dans ce cas, son nom et son adresse ne figurent pas ici : l’hébergeur les détient.',
    host: 'Hébergement',
    hostText: 'OVH Hosting Inc., 800-1801 avenue McGill College, Montréal (Québec) H3A 2N4, Canada. '
      + 'Téléphone : +1 855 684 5463.',
    report: 'Signaler un sondage',
    reportText: <>
      Les sondages sont écrits par les personnes qui les créent. Pour en signaler un qui enfreint la loi, par son
      titre, ses options ou le nom d’une personne qui a voté :{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">écrivez-nous sur
      GitHub</a>. Chaque signalement est examiné promptement, et ce qui est illicite est retiré.
    </>,
  },
};
