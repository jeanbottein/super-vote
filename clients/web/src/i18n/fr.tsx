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
    'too-many-polls': (wait: string) => 'Cette connexion a créé ses sondages pour la journée. Les ressources de '
      + 'super-vote étant limitées, chaque connexion peut créer un nombre limité de sondages par jour, pour être juste '
      + `envers tout le monde : vous pourrez en créer d’autres dans ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Trop de codes erronés ont été essayés depuis cette connexion. Pour '
      + `protéger les sondages des essais au hasard, ses codes sont refusés pendant ${wait}, mais les liens vers les `
      + 'sondages fonctionnent toujours.',
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
    headline: 'Décider ensemble, équitablement.',
    lead: 'Posez une question à votre groupe, partagez son lien ou son code, et regardez les résultats '
      + 'arriver en direct. Personne n’a besoin de compte.',
    createPoll: 'Décider ensemble !',
    yourPolls: 'Décider ensemble…',
    publicPolls: 'Sondages publics',
    noPublicPolls: 'Pas encore de sondage public.',
    public: 'Public',
    closed: 'Fermé',

    howItWorks: 'Comment ça marche',
    steps: [
      { title: 'Posez la question', text: 'Écrivez-la, listez les options, et choisissez quand les résultats s’affichent. Sans compte, rien à installer.' },
      { title: 'Partagez-la', text: 'Envoyez le lien dans la conversation du groupe, affichez son code QR sur un écran, ou lisez son code à voix haute.' },
      { title: 'Décidez', text: 'Chaque personne évalue chaque option. Les résultats bougent en direct, et l’option la mieux évaluée par le groupe l’emporte.' },
    ],

    agent: {
      title: 'Ou demandez à un agent d’IA',
      text: 'Un assistant d’IA qui a accès au Web peut s’en charger pour vous : super-vote explique aux agents '
        + 'comment faire. Donnez au vôtre une demande comme celle-ci, avec votre propre question.',
      prompt: (site: string, guide: string) => `Utilisez ${site} pour créer un sondage pour mon équipe (instructions `
        + `pour les agents : ${guide}). La question : « Où organiser notre séminaire ? » Les options : `
        + 'Lisbonne, Berlin, Barcelone. Utilisez le jugement majoritaire, et cachez les résultats jusqu’à ce que je '
        + 'ferme le sondage. Transmettez-moi le sondage, puis donnez-moi le lien à partager avec l’équipe.',
      copy: 'Copier la demande',
      copied: 'Demande copiée',
      caption: 'L’agent répond avec deux liens. Ouvrez le premier vous-même : il vous transmet le sondage, dans le '
        + 'navigateur qui l’ouvre. Envoyez le second au groupe.',
    },

    gradeTitle: 'Évaluer chaque option, pas seulement une',
    gradeText: 'La plupart des votes demandent un seul choix, ce qui cache l’essentiel de ce que pensent les gens. '
      + 'Au jugement majoritaire, chaque votant donne une mention à chaque option, de « Excellent » à « À rejeter », '
      + 'et l’option la mieux évaluée par une majorité l’emporte.',
    example: {
      options: ['Pizza', 'Sushis', 'Burgers'],
      question: 'On mange où ce soir ?',
      caption: 'Les sushis ont le plus d’adeptes, mais la majorité du groupe juge la pizza Bien ou mieux : la pizza '
        + 'l’emporte. Pointez une mention, ou touchez-la, pour voir combien l’ont donnée.',
    },

    whyTitle: 'Pourquoi c’est important',
    whyText: 'La façon dont un groupe décide façonne ce qu’il décide. Un choix unique divise les options proches, et '
      + 'peut faire gagner une option que beaucoup rejettent, portée par une minorité bruyante. Évaluer, c’est ainsi '
      + 'que des jurys notent les vins et les patineurs, et que le jugement majoritaire de Michel Balinski et Rida '
      + 'Laraki élit.',
    reasons: [
      { title: 'Le consensus gagne', text: 'L’option gagnante est celle que le plus de gens jugent bonne, pas celle qui a les adeptes les plus fervents.' },
      { title: 'Aucune voix perdue', text: 'Soutenir une option ne nuit jamais à une autre que vous aimez : chacune est jugée pour elle-même, et personne ne vote pour le moindre mal.' },
      { title: 'Chaque avis compte', text: 'Chaque votant évalue chaque option : les résultats montrent combien chacune plaît, et combien elle est rejetée.' },
    ],
    vision: <>
      <AppName /> est gratuit, libre et confidentiel par conception : sans compte, sans publicité, sans pistage. Son
      but : rendre de meilleures façons de décider aussi simples qu’une conversation de groupe, pour les amis et les
      équipes aujourd’hui, pour les associations et les collectivités demain.
    </>,

    limitsTitle: 'Bon à savoir',
    limits: {
      everyday: <><strong>Pour les décisions du quotidien.</strong> Pas pour les votes officiels ou engageants, comme
        les élections : sans compte, une personne déterminée peut revoter depuis un autre navigateur. Les invitations
        comptent chaque personne une seule fois.</>,
      private: <><strong>Confidentiel, mais pas caché au serveur.</strong> Personne d’autre ne voit votre bulletin, et
        les bulletins conservés ne disent pas qui les a déposés ; le serveur, géré par le projet, traite votre
        bulletin au moment où vous votez.</>,
      browser: (days: number) => <><strong>Lié à ce navigateur.</strong> Vos bulletins et vos sondages ne peuvent être
        modifiés ou gérés que depuis le navigateur où vous les avez faits. Un seul cookie s’en souvient, {days} jours
        après votre dernier bulletin ou sondage, et rien d’autre : ni publicité, ni pistage.</>,
      deleted: (days: number) => <><strong>Supprimés après {days} jours.</strong> Les sondages partent avec leurs
        bulletins : ils servent à décider, pas à archiver.</>,
    },
    limitsLink: 'Tout sur la confidentialité et les limites',
  },

  join: {
    label: 'Vous avez un code ?',
    typeTheCode: 'Tapez le code qu’on vous a donné.',
    joining: 'Ouverture…',
    join: 'Rejoindre',
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
      Toute personne qui a le lien ou le code peut voter. Une personne déterminée peut revoter depuis un autre
      navigateur ou appareil : <AppName /> compte sur la bonne foi, et le nombre de bulletins montre si quelqu’un
      l’a fait. Pour compter chaque personne une seule fois, invitez-les.
    </>,
    invitedHint: 'Vous envoyez à chaque personne un lien bien à elle, qui vaut un bulletin. Vous verrez quels liens '
      + 'ont servi, jamais ce que chaque personne a choisi.',

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
      LIVE: 'Attention : tout le monde voit les résultats bouger à chaque bulletin. Dans un petit groupe, cela montre '
        + 'qui a choisi quoi.',
      AFTER_BALLOTS: 'Les résultats restent cachés jusqu’à ce nombre de bulletins, pour ne pas exposer les premiers '
        + 'votants. Ensuite, ils bougent à chaque nouveau bulletin, ce qui peut encore montrer le choix d’un votant.',
      AFTER_CLOSING: 'Les résultats s’affichent quand vous fermez le sondage. D’ici là, tout le monde voit combien ont '
        + 'voté.',
    },
    ballotsBeforeResults: 'Bulletins avant d’afficher les résultats',

    optionOrder: 'Ordre des options',
    orders: {
      ALPHABETICAL: 'De A à Z',
      SHUFFLED: 'Mélangé',
      AS_WRITTEN: 'Tel quel',
    },
    orderHints: {
      ALPHABETICAL: 'Les votants les voient de A à Z, les nombres selon leur valeur : 2 avant 10. Les dates se '
        + 'trient bien écrites année d’abord, comme 2026-10-24.',
      SHUFFLED: 'Chaque votant les voit dans un ordre bien à lui, tiré à nouveau à chaque ouverture du sondage, pour '
        + 'qu’aucune option ne profite de sa place.',
      AS_WRITTEN: 'Les votants voient les options dans votre ordre. Les premières places attirent plus de soutien '
        + 'que les autres : un ordre choisi par vous peut passer pour une manipulation du résultat.',
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
    fairShare: (perDay: number) => <>
      Les ressources de <AppName /> étant limitées, chaque connexion peut créer {perDay} sondages par jour, pour être
      juste envers tout le monde.
    </>,
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
    invited: 'Votre invitation vaut un bulletin, que seul ce navigateur peut modifier une fois déposé. La personne '
      + 'qui vous l’a envoyée voit qu’elle a servi, jamais ce que vous avez choisi.',
    counted: 'Votre bulletin est compté. Vous pouvez le modifier depuis ce navigateur jusqu’à la clôture du sondage.',
    notVoted: 'Vous n’avez pas encore voté.',
    hide: 'Masquer mon bulletin',
    hidden: 'Votre bulletin est compté. Il reste caché ici, pour que personne ne voie vos choix en regardant cet écran.',
    change: 'Modifier mon bulletin',
    invitationUsed: 'Cette invitation a déjà servi, dans un autre navigateur ou sur un autre appareil. Son bulletin ne '
      + 'peut être modifié que là-bas.',
    invitationNotValid: 'Ce lien d’invitation n’est pas valide. Demandez-en un nouveau à la personne qui vous l’a envoyé.',
    notInvited: 'Seules les personnes invitées peuvent voter à ce sondage. Si vous avez reçu une invitation, ouvrez '
      + 'le lien qu’elle contient.',
    yourName: 'Votre nom',
    namePlaceholder: 'Laissez vide pour rester anonyme',
    namesAtClose: 'Tout le monde sur ce sondage voit les noms donnés, jamais qui a choisi quoi.',
    namesLive: 'Tout le monde sur ce sondage voit les noms donnés. Les résultats bougent à chaque bulletin : celles et '
      + 'ceux qui regardent peuvent deviner qui a choisi quoi.',
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
    onlyThisBrowser: 'Seul ce navigateur peut gérer ce sondage : depuis un autre appareil, ou une fois ses données '
      + 'effacées, il ne peut plus être fermé ni supprimé avant l’heure.',
    close: 'Clore le vote',
    delete: 'Supprimer le sondage',
    closeQuestion: 'Clore le vote pour de bon ? Personne ne pourra plus voter ni modifier son bulletin, et tout le '
      + 'monde verra les résultats définitifs. Un sondage clos ne peut pas être rouvert.',
    keepOpen: 'Le garder ouvert',
    closeForGood: 'Clore pour de bon',
    deleteQuestion: 'Supprimer ce sondage et tous ses bulletins ? Les personnes qui le regardent le verront '
      + 'disparaître. C’est irréversible.',
    keep: 'Le garder',
    deleteForGood: 'Supprimer pour de bon',
    deletedToast: 'Le sondage a été supprimé.',
  },

  invitations: {
    heading: 'Invitations',
    count: (count: number) => counted(count, 'invitation', 'invitations'),
    used: (used: number, count: number) => `${number(used)} sur ${number(count)} utilisées`,
    hint: 'Seules les personnes que vous invitez peuvent voter. Envoyez à chacune un lien bien à elle, qui vaut un '
      + 'bulletin. Vous voyez quels liens ont servi, jamais ce que chaque personne a choisi. Vous pouvez voter '
      + 'vous-même sans lien.',
    invite: 'Inviter',
    inviting: 'Invitation…',
    inviteSomeone: 'Inviter quelqu’un',
    namePlaceholder: 'Nom ou surnom (facultatif)',
    loading: 'Chargement des invitations…',
    showMore: 'Afficher plus',
    newestShown: (count: number) => `Les ${number(count)} plus récentes sont affichées.`,
    invitationFor: (label: string) => `Invitation pour ${label}`,
    invitationNumber: (number: number) => `Invitation ${number}`,
    shareHint: 'Envoyez ce lien à cette personne seulement. Il vaut un bulletin, que seul le navigateur d’où elle vote '
      + 'peut modifier.',
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

  feeder: {
    heading: 'Distributeur de bulletins',
    devOnly: 'dév. seulement',
    count: 'Nombre de bulletins au hasard',
    cast: 'Déposer des bulletins au hasard',
    casting: (cast: number, count: number) => `Dépôt ${cast} sur ${count}…`,
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
      Choisir un seul favori jette l’essentiel de ce que pensent les gens. Deux options proches se partagent leurs
      soutiens, et une option que la plupart trouvent bien peut perdre face à une autre que la moitié du groupe
      n’aime pas. <AppName /> demande plus qu’un seul choix, de l’une de ces deux façons.
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
      + 'et C à A, et des résultats plus récents ont montré que toute règle raisonnable peut être manipulée. Évaluer '
      + 'plutôt que classer évite une bonne part de ces écueils. C’est pourquoi les auteurs du jugement majoritaire '
      + 'ont étudié comment des jurys notent des patineurs et des vins, autant que comment des citoyens élisent.',
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
      `Un identifiant aléatoire dans un cookie, pour que ce navigateur puisse modifier ses bulletins et gérer ses `
        + `sondages, ${days} jours après son dernier bulletin ou sondage, autant que dure un sondage. C’est le seul `
        + 'cookie : ni publicité, ni mesure d’audience, ni pistage.',
      'Le fuseau horaire de votre appareil (Europe/Paris, par exemple), ajouté aux statistiques sous forme de totaux '
        + 'seulement. Jamais votre adresse.',
      'L’adresse de votre réseau, gardée en mémoire un jour au plus, pour limiter le nombre de sondages que chaque '
        + 'réseau crée. Elle n’est jamais écrite nulle part.',
      'Vos réglages et le dernier nom que vous avez donné, dans ce navigateur seulement.',
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
};
