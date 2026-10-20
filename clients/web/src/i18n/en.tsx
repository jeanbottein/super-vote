/**
 * Everything the web app says, in English: the source every translation
 * follows (fr.tsx). A translation has exactly this shape, which TypeScript
 * checks: a message missing, or one too many, does not compile.
 *
 * Messages are strings, elements, or functions of plain values (numbers,
 * strings, elements) returning either. The server's sentences are English
 * whatever the language: what people read of them is worded here, from the
 * problem's type (problems, below).
 */
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, plural, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('en', count);
const counted = (count: number, one: string, other: string) => `${number(count)} ${plural('en', count, one, other)}`;

export const en = {
  /** The language's own name, as its speakers write it: what the language pickers show. */
  name: 'English',

  number,
  percent: (share: number) => formatPercent('en', share),
  decimal: (value: number, digits: number) => formatDecimal('en', value, digits),
  date: (isoDate: string) => formatDate('en', isoDate),
  moment: (isoDate: string) => formatMoment('en', isoDate),
  day: (day: string) => formatUtcDay('en', day),
  timeAgo: (isoDate: string) => timeAgo('en', isoDate) ?? 'just now',
  /** "5 hours", "1 minute": until a moment, in milliseconds since the epoch. */
  waitUntil: (at: number) => {
    const { count, unit } = waitUntil(at);
    return unit === 'minute' ? counted(count, 'minute', 'minutes') : counted(count, 'hour', 'hours');
  },

  loading: 'Loading…',
  backHome: 'Back to the home page',
  tryAgain: 'Try again',
  close: 'Close',
  dismiss: 'Dismiss',

  errors: {
    unexpected: 'Something went wrong. Please try again.',
    unreachable: 'The server cannot be reached. Check your connection and try again.',
    failed: (status: number) => `Something went wrong (error ${status}). Please try again.`,
  },

  /** What people read when the server refuses something, by the problem's type (docs/API.md, "Errors"). */
  problems: {
    'unknown-voter': 'This browser is not one super-vote knows. Reload the page to start afresh.',
    'not-poll-creator': "Only the poll's creator can do that.",
    'not-invited': 'Only invited people can vote on this poll. If you were invited, open the link from your invitation.',
    'handover-unavailable': 'This link cannot hand the poll over: it was used already.',
    'cross-site': 'This request came from another website, and was refused. Open super-vote itself.',
    'poll-not-found': 'No poll has this link or code. It may be mistyped, or the poll was deleted.',
    'poll-closed': 'This poll is closed: it takes no more ballots.',
    'invitation-used': 'Someone has already voted with this invitation, in another browser or on another device.',
    'collision': 'That change collided with another one made at the same moment. Please try again.',
    'too-many-polls': (wait: string) => 'This connection has created its polls for the day. As '
      + "super-vote's resources are limited, each connection can create a limited number of polls a day, to be fair "
      + `to everyone: you can create more in ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Too many wrong codes were tried from this connection. To keep polls '
      + `safe from guessing, codes from it are refused for the next ${wait}, but links to polls still work.`,
    'server-error': 'Something went wrong on our side. Please try again in a moment.',
  },

  mentions: {
    Excellent: 'Excellent',
    VeryGood: 'Very Good',
    Good: 'Good',
    Fair: 'Fair',
    Passable: 'Passable',
    Inadequate: 'Inadequate',
    Bad: 'Bad',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Majority judgment',
    APPROVAL: 'Approval voting',
  },

  visibilities: {
    PUBLIC: 'Public',
    UNLISTED: 'Private',
  },

  app: {
    home: 'Home',
    settings: 'Settings',
    footer: <><AppName /> is free and open source.</>,
    footerLinks: 'About super-vote',
    about: 'About and the science behind it',
    privacy: 'Privacy and limits',
    statistics: 'Statistics',
    sourceCode: 'Source code',
    notFound: 'Page not found',
    nothingHere: 'There is nothing at this address.',
  },

  settings: {
    language: 'Language',
    appearance: 'Appearance',
    light: 'Light',
    automatic: 'Automatic',
    dark: 'Dark',
    mentionColours: 'Mention colours',
    greenToRed: 'Green to red',
    shadesOfGrey: 'Shades of grey',
    shadesOfGreyHint: 'Shades of grey read the same whatever colours you see: the lighter, the better.',
    majorityJudgmentBallot: 'Majority judgment ballot',
    colourScale: 'Colour scale',
    dropdowns: 'Dropdowns',
    castingYourBallot: 'Casting your ballot',
    live: 'Live',
    envelope: 'Envelope',
    liveHint: 'Every change counts the moment you make it.',
    envelopeHint: 'Fill in your ballot, then submit it in one go.',
  },

  home: {
    title: 'super-vote · decide together',
    headline: 'Decide together, fairly.',
    lead: 'Create a private poll, share its link or code with your group, and watch the results come in live. '
      + 'Nobody needs an account.',
    createPoll: 'Create a poll',
    yourPolls: 'Your polls',
    publicPolls: 'Public polls',
    noPublicPolls: 'No public polls yet.',
    public: 'Public',
    closed: 'Closed',

    howItWorks: 'How it works',
    steps: [
      { title: 'Ask the question', text: 'Write it, list the options, and choose how the results show. No account, nothing to install.' },
      { title: 'Share it', text: 'Send the link to your group chat, show its QR code on a screen, or read its code out loud.' },
      { title: 'Decide', text: 'Everyone grades every option. The results move live, and the option the group rates best wins.' },
    ],

    gradeTitle: 'Grade every option, not just one',
    gradeText: 'Most votes ask for a single choice, which hides most of what people think. With majority '
      + 'judgment, every voter gives every option a mention, from Excellent to Bad, and the option a majority '
      + 'rates best wins.',
    example: {
      question: 'Where do we eat tonight?',
      options: ['Pizza', 'Sushi', 'Burgers'],
      caption: 'Sushi has the most fans, but most of the group rates pizza Good or better: pizza wins. Point at a '
        + 'mention, or tap it, to see how many gave it.',
    },

    whyTitle: 'Why it matters',
    whyText: 'How a group decides shapes what it decides. A single choice splits similar options, and can let an '
      + 'option many people reject win with a loud minority behind it. Grading is how judges score wines and '
      + "figure skaters, and how Michel Balinski and Rida Laraki's majority judgment elects.",
    reasons: [
      { title: 'Consensus wins', text: 'The winner is the option most people judge good, not the one with the most devoted fans.' },
      { title: 'No wasted vote', text: 'Supporting one option never hurts another you like: each is judged on its own, so nobody votes for the lesser evil.' },
      { title: 'Every view shows', text: 'Every voter grades every option, so the results show how much each is liked, and how much it is rejected.' },
    ],
    vision: <>
      <AppName /> is free, open source and private by design: no account, no ads, no tracking. Its aim is to make
      better ways of deciding as easy as a group chat: for friends and teams today, for associations and
      communities tomorrow.
    </>,

    limitsTitle: 'Good to know',
    limits: {
      everyday: <><strong>For everyday decisions.</strong> Not for official or binding votes, such as elections:
        without accounts, someone set on it can vote again from another browser. Invitations count each person
        once.</>,
      private: <><strong>Private, but not hidden from the server.</strong> Nobody else sees your ballot, and the
        ballots kept do not say who cast them; the server, run by the project, handles your ballot as you cast
        it.</>,
      browser: (days: number) => <><strong>Tied to this browser.</strong> Your ballots and polls can only be changed
        or managed from the browser you made them in. One cookie remembers them, for {days} days after your last ballot
        or poll, and nothing else: no advertising, no tracking.</>,
      deleted: (days: number) => <><strong>Deleted after {days} days.</strong> Polls go with their ballots: they are
        for deciding, not archiving.</>,
    },
    limitsLink: 'All about privacy and limits',
  },

  join: {
    label: 'Got a code?',
    typeTheCode: 'Type the code you were given.',
    joining: 'Joining…',
    join: 'Join',
  },

  newPoll: {
    title: 'New poll · super-vote',
    heading: 'New poll',
    question: 'Question',
    questionPlaceholder: 'Where do we eat on Friday?',
    options: 'Options',
    option: (row: number) => `Option ${row}`,
    remove: (option: string) => `Remove ${option}`,
    optionsHint: (max: number) => `Up to ${max} options. A new row appears as you type.`,

    votingSystem: 'Voting system',
    systems: {
      MAJORITY_JUDGMENT: 'Majority judgment',
      APPROVAL: 'Approval',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Voters rate every option from Excellent to Bad. The option a majority rates best wins: '
        + 'nuanced, and hard to game.',
      APPROVAL: 'Voters tick every option they would accept. The most approved option wins: quick and simple.',
    },

    whoCanFindIt: 'Who can find it',
    visibilityHints: {
      PUBLIC: 'Listed on the home page, for anyone to find.',
      UNLISTED: 'Not listed anywhere: only people you share the link or the code with can find it.',
    },

    whoCanVote: 'Who can vote',
    anyone: 'Anyone',
    invitedOnly: 'Invited only',
    anyoneHint: <>
      Anyone with the link or the code can vote. Someone set on it can vote again from another browser or
      device: <AppName /> counts on good faith, and the number of ballots shows if someone did. To count each
      person once, invite them.
    </>,
    invitedHint: 'You send each person a link of their own, which holds one ballot. You will see which links were '
      + 'used, never what anyone chose.',

    whoVoted: 'Who voted',
    anonymous: 'Anonymous',
    showNames: 'Show names',
    anonymousHint: 'Nobody sees who voted, only how many did.',
    showNamesHint: 'Voters may give a name, shown under the results. Nobody sees who chose what.',

    results: 'Results',
    resultsChoices: {
      LIVE: 'Live',
      AFTER_BALLOTS: 'Delayed',
      AFTER_CLOSING: 'At close',
    },
    resultsHints: {
      LIVE: 'Careful: everyone sees the results move as each ballot arrives. In a small group, that shows who chose '
        + 'what.',
      AFTER_BALLOTS: 'Results stay hidden until that many ballots are in, so the first voters are not exposed. After '
        + 'that they move with each new ballot, which can still show what a later voter chose.',
      AFTER_CLOSING: 'Results show once you close the poll. Until then, everyone sees how many have voted.',
    },
    ballotsBeforeResults: 'Ballots before the results show',

    optionOrder: 'Order of the options',
    orders: {
      ALPHABETICAL: 'A to Z',
      SHUFFLED: 'Shuffled',
      AS_WRITTEN: 'As written',
    },
    orderHints: {
      ALPHABETICAL: 'Voters see them from A to Z, numbers by their value: 2 before 10. Dates sort right when '
        + 'written year first, such as 2026-10-24.',
      SHUFFLED: 'Each voter sees them in an order of their own, drawn again each time they open the poll, so that '
        + 'no option gains from its place.',
      AS_WRITTEN: 'Voters see the options in your order. The first places draw more support than the others, so an '
        + 'order of your choosing can be taken for an attempt to sway the result.',
    },

    deletedAfter: (days: number) => `Polls are deleted ${days} days after they are created, with their ballots.`,
    notForElections: <>
      <AppName /> is for everyday decisions, not for official or binding votes.{' '}
      <Link to="/privacy">Privacy and limits</Link>
    </>,
    noNewPolls: 'This server takes no new polls at the moment.',
    creating: 'Creating…',
    create: 'Create poll',

    problems: {
      titleMissing: 'Give your poll a title.',
      titleTooLong: (max: number) => `A title can be at most ${max} characters long.`,
      titleInvisible: 'A title can only hold visible characters.',
      tooFewOptions: 'Add at least two options.',
      tooManyOptions: (max: number) => `A poll can have at most ${max} options.`,
      optionTooLong: (max: number) => `An option can be at most ${max} characters long.`,
      optionInvisible: 'An option can only hold visible characters.',
      optionTwice: (option: string) => `"${option}" is listed twice. Each option must be different.`,
      resultsAfterBallots: (min: number) => `Choose a whole number of ballots, at least ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Taking this poll over…',
    deleted: 'This poll was deleted',
    deletedText: 'It was deleted, and its results with it.',
    notFound: 'Poll not found',
    notFoundText: 'The link may be incomplete, or the poll was deleted.',
    notLoaded: 'The poll could not be loaded',
    loadingPoll: 'Loading the poll…',
    byInvitation: 'By invitation',
    created: (ago: string) => `Created ${ago}`,
    closed: 'Closed',
    readyToInvite: <><strong>Your poll is ready.</strong> Invite people below: each gets a link of their own.</>,
    readyToShare: <><strong>Your poll is ready.</strong> Share its link to collect ballots.</>,
    closedAgo: (ago: string) => `Voting closed ${ago}. These are the final results.`,
    deletedOn: (date: string) => `This poll and its ballots will be deleted on ${date}.`,
    lastPoll: (wait: string) => `That was your last poll for now: you can create more in ${wait}.`,
    pollsLeft: (count: number, wait: string) => `You can create ${counted(count, 'more poll', 'more polls')} in the next ${wait}.`,
    fairShare: (perDay: number) => <>
      As <AppName />'s resources are limited, each connection can create {perDay} polls a day, to be fair to
      everyone.
    </>,
  },

  ballot: {
    yourBallot: 'Your ballot',
    withdraw: 'Withdraw',
    submit: 'Submit my ballot',
    rateEveryOption: 'Rate every option to submit',
    submitting: 'Submitting…',
    majorityJudgmentLive: 'Give every option a mention. Options you have not rated count as Bad.',
    majorityJudgmentEnvelope: 'Give every option a mention, then submit your ballot.',
    approval: 'Tick every option you would be happy with.',
    shuffled: 'The options are shuffled for each voter, so that none gains from its place.',
    alphabetical: 'The options are listed from A to Z.',
    invited: 'Your invitation holds one ballot, which only this browser can change once cast. Whoever invited you '
      + 'sees that it was used, never what you chose.',
    counted: 'Your ballot is counted. You can change it from this browser until the poll closes.',
    notVoted: 'You have not voted yet.',
    hide: 'Hide my ballot',
    hidden: 'Your ballot is counted. It stays hidden here, so nobody looking at this screen sees your choices.',
    change: 'Change my ballot',
    invitationUsed: 'This invitation was already used, in another browser or on another device. Its ballot can only '
      + 'be changed there.',
    invitationNotValid: 'This invitation link is not valid. Ask whoever invited you for a new one.',
    notInvited: 'Only invited people can vote on this poll. If you were invited, open the link from your invitation.',
    yourName: 'Your name',
    namePlaceholder: 'Leave blank to stay anonymous',
    namesAtClose: 'Everyone on this poll sees the names given, never who chose what.',
    namesLive: 'Everyone on this poll sees the names given. The results move as ballots arrive, so people watching '
      + 'may tell who chose what.',
    notRatedYet: 'Not rated yet',
    chooseAMention: 'Choose a mention…',
    optionsYouApprove: 'Options you approve',
  },

  results: {
    heading: 'Results',
    ballots: (count: number) => counted(count, 'ballot', 'ballots'),
    noBallotsYet: 'No ballots yet. The results fill in as they arrive.',
    keptUntilBallots: (count: number) => `The results show once ${count} ballots are in, so the first voters' `
      + 'choices stay theirs.',
    keptUntilYouClose: 'The results show once you close the poll.',
    keptUntilClosed: 'The results show once the poll closes.',
    download: 'Download the results',
    final: 'Final',
    connecting: 'Connecting…',
    live: 'Live',
    reconnecting: 'Reconnecting…',
    whoVoted: 'Who voted',
    anonymousVoters: (count: number) => counted(count, 'anonymous voter', 'anonymous voters'),
    andAnonymousVoters: (count: number) => `and ${counted(count, 'anonymous voter', 'anonymous voters')}`,
    moreVoters: (count: number) => `and ${counted(count, 'more voter', 'more voters')}`,
    rank: (rank: number) => `Rank ${rank}`,
    approvals: (count: number) => counted(count, 'approval', 'approvals'),
    noBallotsFor: (option: string) => `${option}: no ballots yet`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    /** The results' axis: compact, as axes are labelled, so that a narrow card keeps its labels apart. */
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Majority Mention:',
    gmjScore: 'GMJ Score:',
    gmjScoreTitle: (score: string) => `GMJ's usual judgment score: ${score}. It breaks ties between options with the `
      + 'same majority mention.',
    orBetter: (share: string, mention: string) => `${share} say ${mention} or better`,
  },

  owner: {
    manage: 'Manage your poll',
    onlyThisBrowser: 'Only this browser can manage this poll: from another device, or once its data is cleared, it '
      + 'can no longer be closed or deleted early.',
    close: 'Close voting',
    delete: 'Delete poll',
    closeQuestion: 'Close voting for good? Nobody can vote or change their ballot any more, and everyone sees the '
      + 'final results. A closed poll cannot be reopened.',
    keepOpen: 'Keep it open',
    closeForGood: 'Close for good',
    deleteQuestion: 'Delete this poll and all its ballots? Everyone watching it will see it disappear. This cannot '
      + 'be undone.',
    keep: 'Keep it',
    deleteForGood: 'Delete for good',
    deletedToast: 'The poll was deleted.',
  },

  invitations: {
    heading: 'Invitations',
    count: (count: number) => counted(count, 'invitation', 'invitations'),
    used: (used: number, count: number) => `${number(used)} of ${number(count)} used`,
    hint: 'Only the people you invite can vote. Send each one a link of their own, which holds one ballot. You see '
      + 'which links were used, never what anyone chose. You can vote yourself without one.',
    invite: 'Invite',
    inviting: 'Inviting…',
    inviteSomeone: 'Invite someone',
    namePlaceholder: 'Name or nickname (optional)',
    loading: 'Loading the invitations…',
    showMore: 'Show more',
    newestShown: (count: number) => `The newest ${number(count)} are shown.`,
    invitationFor: (label: string) => `Invitation for ${label}`,
    invitationNumber: (number: number) => `Invitation ${number}`,
    shareHint: 'Send this link to this person only. It holds one ballot, which only the browser they vote from can '
      + 'change.',
    linkLabel: 'Link of the invitation',
    message: (title: string) => `You are invited to vote on “${title}”. This link is for you alone.`,
    isUsed: 'Used',
    notUsedYet: 'Not used yet',
    share: (name: string) => `Share the link for ${name}`,
    takeBack: (name: string) => `Take back the link for ${name}`,
    takeBackQuestion: 'Take back this invitation? Its link will stop working.',
    keep: 'Keep it',
    takeItBack: 'Take it back',
  },

  share: {
    share: 'Share',
    title: 'Share this poll',
    invitedOnly: 'Anyone with the code or the link can see the poll. Only the people you invite can vote.',
    anyone: 'Anyone with the code or the link can vote.',
    unlisted: 'The poll is not listed anywhere else.',
    linkLabel: 'Link to the poll',
    joinCode: 'Join code',
    toEnterAt: (host: string) => `to enter at ${host}`,
    copy: 'Copy',
    copied: 'Copied',
    qrCode: (url: string) => `QR code for ${url}`,
    throughAnApp: 'Share through an app',
    byEmail: 'Send by email',
  },

  feeder: {
    heading: 'Ballot feeder',
    devOnly: 'dev only',
    count: 'Number of random ballots',
    cast: 'Cast random ballots',
    casting: (cast: number, count: number) => `Casting ${cast} of ${count}…`,
  },

  statistics: {
    title: 'Statistics · super-vote',
    heading: <><AppName /> around the world</>,
    lead: 'How many polls, ballots and visitors, when, and from where.',
    show: 'Show',
    measures: {
      voters: {
        label: 'Visitors', plural: 'visitors',
        noun: (count: number) => plural('en', count, 'visitor', 'visitors'),
        count: (count: number) => counted(count, 'visitor', 'visitors'),
      },
      polls: {
        label: 'Polls', plural: 'polls',
        noun: (count: number) => plural('en', count, 'poll', 'polls'),
        count: (count: number) => counted(count, 'poll', 'polls'),
      },
      ballots: {
        label: 'Ballots', plural: 'ballots',
        noun: (count: number) => plural('en', count, 'ballot', 'ballots'),
        count: (count: number) => counted(count, 'ballot', 'ballots'),
      },
    },
    totals: {
      polls: 'Polls created',
      openPolls: 'Open now',
      ballots: 'Ballots cast',
      voters: 'Visitors',
    },
    lastDays: 'Over the last 90 days',
    where: 'Where',
    byRegion: 'By region',
    noRegion: 'No region yet.',
    tapADot: 'Tap a dot to see its numbers.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Not shown in any region, for want of a time '
      + `zone or of enough people to show: ${visitors}, ${polls} and ${ballots}.`,
    howCounted: 'How these are counted',
    howCountedText: <>
      A visitor is a browser or an app that came to <AppName />: one person on two devices counts twice. A ballot
      counts once, however often its voter changes it.
    </>,
    places: (updated: string) => 'Places come from the time zone your device is set to, never from your address, and '
      + 'only totals are kept. A place shows once three visitors come from it. The numbers are updated every hour, '
      + `so that they cannot be matched with the ballots of one poll as they come in. Last updated ${updated}.`,
    sources: <>
      Each dot is the city a time zone is named after, standing for everyone in that zone. Days are in UTC. Land
      from <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>, time
      zones from the <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA database</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} on {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} over the last ${days} days`,
    busiest: (day: string, count: string) => `, the most on ${day}: ${count}.`,
    topLine: (count: string) => `Top line: ${count}`,
    regionAndCity: 'Region and city',
    map: (what: string) => `World map of ${what} by time zone. The table below lists the same numbers.`,
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    nothingYet: 'No place to show yet.',
    fewer: 'fewer',
    upTo: (count: string) => `up to ${count}`,
    pollPlaces: 'Where the ballots come from',
    pollPlacesNone: 'A region shows once three ballots come from it.',
    pollPlacesHint: "From each voter's time zone, never their address. A place shows once three ballots come from it, "
      + 'and the numbers are updated every hour.',
    regions: {
      Africa: 'Africa',
      America: 'The Americas',
      Antarctica: 'Antarctica',
      Arctic: 'Arctic',
      Asia: 'Asia',
      Atlantic: 'Atlantic islands',
      Australia: 'Australia',
      Europe: 'Europe',
      Indian: 'Indian Ocean',
      Pacific: 'Pacific',
    } as Record<string, string>,
  },

  about: {
    title: 'About · super-vote',
    heading: <>About <AppName /></>,
    lead: (days: number) => <>
      A free, open-source way for a group to decide together: where to eat, where to go, what to pick. No account,
      no ads, no tracking. Polls are deleted {days} days after they are created.
    </>,
    howDecided: 'How the results are decided',
    howDecidedText: <>
      Picking a single favourite throws most of what people think away. Two similar options split their
      supporters, and an option most people find fine can lose to one that half the group dislikes.{' '}
      <AppName /> asks for more than a single choice, in one of two ways.
    </>,
    majorityJudgment: 'Majority judgment',
    majorityJudgmentText: <>
      Every voter grades every option, from <em>Excellent</em> to <em>Bad</em>. An option's{' '}
      <strong>majority mention</strong> is the best grade that more than half of the voters give it or better: its
      median. The option with the best majority mention wins. When several share it, the <strong>GMJ score</strong>{' '}
      decides between them: it measures how far the grades lean above or below that mention. Options still equal
      are shown <em>ex aequo</em>, and no hidden rule picks one.
    </>,
    approval: 'Approval voting',
    approvalText: 'Every voter ticks each option they would be happy with. The option approved by the most voters '
      + 'wins. It is quick, and it never punishes you for supporting more than one option.',
    science: 'The science behind it',
    scienceText: 'No voting rule is perfect: Condorcet saw in 1785 that a group can prefer A to B, B to C and C to A, '
      + 'and later results showed that every reasonable rule can be gamed. Grading rather than ranking sidesteps '
      + "much of this. That is why majority judgment's authors studied how judges score figure skaters and wines as "
      + 'well as how citizens elect.',
    notes: {
      pnas2007: 'Introduces majority judgment: grade, then rank by the median grade.',
      book2011: 'The book: the theory, its properties, and real elections and juries.',
      judge2014: 'Why grading avoids the paradoxes of ranking, and resists manipulation.',
      fabre2021: <>The "usual judgment" score <AppName /> uses to break ties between equal majority mentions.</>,
      brams1978: 'The case for approving every acceptable option.',
      laslier2009: 'How people vote strategically under approval voting, and what comes of it.',
      gibbard1973: 'With Satterthwaite: every reasonable voting rule can be gamed. The question is how much.',
      satterthwaite1975: 'The same result, found independently.',
    },
    whoMakesIt: 'Who makes it',
    whoMakesItText: <>
      <AppName /> is made by one person in Québec, in their free time, and is free for everyone. Its code is open:
      anyone can read how ballots are counted, run their own copy, or suggest a change.
    </>,
    seeTheCode: 'See the source code on GitHub',
  },

  privacy: {
    title: 'Privacy and limits · super-vote',
    heading: 'Privacy and limits',
    lead: <>
      <AppName /> is built so that nobody can tell what you chose. Here is what it keeps, who sees what, and what
      it cannot do yet.
    </>,

    forWhat: 'What it is for',
    forWhatText: 'Deciding together among people who trust each other: friends, family, a team, a class, an '
      + 'association. It is not suited to elections, nor to any vote with legal, financial or official '
      + 'consequences: those need every voter identified and counted once, and results that anyone can verify, '
      + 'which super-vote cannot promise yet.',

    kept: 'What is kept, and for how long',
    keptItems: (days: number) => [
      `A poll: its question, its options and its settings, until it is deleted, ${days} days after it was created at `
        + 'the latest. Its creator can delete it sooner.',
      'Your ballot on a poll, stored under a key that does not say who you are, and deleted with the poll. You can '
        + 'withdraw it until the poll closes.',
      'The name you give, on polls that show names, stored apart from your ballot so that nothing joins the two.',
      `A random identifier in a cookie, so that this browser can change its ballots and manage its polls, for ${days} `
        + 'days after its last ballot or poll, as long as a poll lasts. It is the only cookie: no advertising, no '
        + 'analytics, no tracking.',
      "Your device's time zone (Europe/Paris, say), added to the statistics as totals only. Never your address.",
      "Your network's address, held in memory for a day at most, to limit how many polls each network creates. It "
        + 'is never written down.',
      'Your settings and the name you last gave, in this browser only.',
    ],

    whoSees: 'Who sees what',
    whoSeesItems: [
      'Everyone on a poll sees the results as totals, when its creator chose to show them, and the names voters '
        + 'chose to give.',
      "A poll's creator sees the same, and which invitations were used: never what anyone chose.",
      'Nobody sees your ballot. Even on your own screen, it starts hidden once counted.',
      'Whoever runs the server sees requests as they happen. What is stored does not say who chose what, but '
        + 'super-vote does not hide ballots from the running server: the people running it are trusted not to look.',
    ],

    limits: 'Limits to know',
    limitsItems: [
      'Without invitations, one person can vote several times from different browsers or devices. super-vote counts '
        + 'on good faith, and the number of ballots shows when it is abused. To count each person once, invite them.',
      'Your ballots and polls belong to this browser. From another device, or once its data is cleared, you can no '
        + 'longer change them or manage them, and there is no account to get them back.',
      "Live results move as each ballot arrives: in a small group, people watching can tell who chose what. A poll's "
        + 'creator chooses when results show, and is warned.',
      'The count cannot be checked independently: you trust the server, whose code is open for anyone to read.',
      'super-vote is free and runs on one small server: it may be unavailable at times. Do not rely on it for '
        + 'anything urgent.',
    ],

    rights: 'Your data, your choices',
    rightsText: 'Your ballots are not linked to you, so super-vote cannot find them for you: withdraw a ballot, or '
      + "delete a poll you created, from this browser. Clearing this browser's data for super-vote removes its "
      + 'cookie and settings.',
    contact: <>
      Questions, a request about your data, or a poll to report:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">write to us on
      GitHub</a>. A security weakness: see the{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">security
      policy</a>.
    </>,
    openSource: <>
      Nothing here needs to be taken on faith: <AppName />'s code, the counting and the protection of ballots
      included, is <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">open for
      anyone to read</a>.
    </>,
  },
};

export type Messages = typeof en;
