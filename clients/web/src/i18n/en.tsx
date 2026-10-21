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
import type { ReactNode } from 'react';
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
    'not-admin-link': 'This admin link is not this poll’s. Check that it was copied whole.',
    'handover-unavailable': 'This link cannot hand the poll over: it was used already.',
    'cross-site': 'This request came from another website, and was refused. Open super-vote itself.',
    'poll-not-found': 'No poll has this link or code. It may be mistyped, or the poll was deleted.',
    'poll-closed': 'This poll is closed: it takes no more ballots.',
    'invitation-used': 'Someone has already voted with this invitation, in another browser or on another device.',
    'collision': 'That change collided with another one made at the same moment. Please try again.',
    'too-many-polls': (wait: string) => 'This connection has created its polls for today. To be fair to everyone, '
      + `each gets a few a day: you can create more in ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Too many wrong codes from this connection: to keep polls safe '
      + `from guessing, its codes are refused for the next ${wait}. Links still work.`,
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
    legal: 'Legal notice',
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
    lead: 'Maths says it’s fairer.',
    createQuestion: 'Need to create a vote?',
    createPoll: 'Decide together!',
    yourPolls: 'Decide together…',
    publicPolls: 'Public polls',
    noPublicPolls: 'No public polls yet.',
    public: 'Public',
    closed: 'Closed',

    howItWorks: 'How it works',
    steps: [
      { title: 'Ask', text: 'A question and its options.' },
      { title: 'Share', text: 'A link, a QR code or a code.' },
      { title: 'Decide', text: 'Everyone grades, results come in live.' },
    ],

    agent: {
      title: 'Ready for AI',
      text: 'Paste this into an assistant that can browse the web, with your own question.',
      prompt: (site: string, guide: string) => `Use ${site} to create a poll for my team (instructions for `
        + `agents: ${guide}). The question: “Where should we hold the offsite?” The options: Lisbon, Berlin, `
        + 'Barcelona. Use majority judgment, and keep the results hidden until I close the poll. Hand the poll '
        + 'over to me, then give me the link to share with the team.',
      copy: 'Copy the prompt',
      copied: 'Prompt copied',
      caption: 'It answers with two links: open the first to make the poll yours, send the second to the group.',
    },

    systems: {
      title: 'Two ways to decide',
      majorityJudgment: {
        title: 'Majority judgment',
        text: 'Grade every option from Excellent to Bad. The best majority grade wins.',
      },
      approval: {
        title: 'Approval',
        text: 'Tick every option you would accept. The most ticked wins.',
      },
    },

    compare: {
      title: 'Fairer than most official elections',
      text: 'Most elections ask for a single name. Similar candidates split their voters, and one that most people '
        + 'reject can still win. Majority judgment, from the research of Michel Balinski and Rida Laraki, measures '
        + 'what everyone thinks of every option instead.',
      science: 'The science behind it',
      single: 'One choice',
      singleNote: 'most elections',
      approval: 'Approval',
      majorityJudgment: 'Majority judgment',
      criteria: {
        nuance: 'Say what you think of each option',
        splitting: 'Similar options do not split the vote',
        lesserEvil: 'No voting for the lesser evil',
        tactics: 'Hard to game',
        quick: 'Quick to fill in',
        familiar: 'Familiar',
      },
      marks: { yes: 'Yes', partly: 'Partly', no: 'No' },
      caption: <><AppName /> offers approval and majority judgment. No voting rule is perfect, but some are much
        fairer than others.</>,
    },

    supportTitle: 'Free, open source, no ads',
    supportText: 'You are not the product: the goal is to promote better voting systems. Made by one person, in '
      + 'their free time. If it helped your group decide, you can help it.',

    limitsTitle: 'Good to know',
    limits: {
      everyday: <><strong>For everyday decisions,</strong> not official elections: without accounts, someone can
        vote again from another browser. Invitations count each person once.</>,
      private: <><strong>Private, but not hidden from the server.</strong> Nobody else sees your ballot, and the
        ballots kept do not say who cast them.</>,
      browser: (days: number) => <><strong>Tied to this browser,</strong> through one cookie, kept {days} days
        after your last ballot or poll. No ads, no tracking.</>,
      deleted: (days: number) => <><strong>Deleted after {days} days,</strong> polls and ballots alike.</>,
      disclaimer: <><strong>No guarantee.</strong> <AppName /> promotes better ways to vote. It is made by one person,
        with the best care for security, privacy, performance, architecture and code quality, but it is not
        accredited, audited or independently reviewed: its results are not guaranteed to be accurate, or a true
        representation of a group's will. That would take accreditation, expert review of the technical side and
        ongoing support, which one person cannot offer without sponsors and experts.</>,
    },
    limitsLink: 'All about privacy and limits',
  },
  join: {
    label: 'Got a code?',
    typeTheCode: 'Type the code you were given.',
    notACode: 'A code is six letters and digits, such as K7M-4QX.',
    joining: 'Joining…',
    join: 'Vote!',
  },

  newPoll: {
    title: 'Decide together · super-vote',
    heading: 'Decide together',
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
      Anyone with the link or the code. Someone set on it can vote again from another browser: to count each person
      once, invite them.
    </>,
    invitedHint: 'Each person gets a link of their own, good for one ballot. You see which links were used, never what '
      + 'anyone chose.',

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
      LIVE: 'Careful: everyone sees each ballot move the results. In a small group, that shows who chose what.',
      AFTER_BALLOTS: 'Hidden until that many ballots are in, to protect the first voters. After that, each ballot moves '
        + 'them, which can still give a later voter away.',
      AFTER_CLOSING: 'Shown once you close the poll. Until then, everyone sees only how many voted.',
    },
    ballotsBeforeResults: 'Ballots before the results show',

    optionOrder: 'Order of the options',
    orders: {
      ALPHABETICAL: 'A to Z',
      SHUFFLED: 'Shuffled',
      AS_WRITTEN: 'As written',
    },
    orderHints: {
      ALPHABETICAL: 'From A to Z, numbers by value: 2 before 10. Write dates year first, such as 2026-10-24.',
      SHUFFLED: 'A new order for each voter at each visit, so that no option gains from its place.',
      AS_WRITTEN: 'Your order. The first places draw more support, so it can look like an attempt to sway the result.',
    },

    deletedAfter: (days: number) => `Polls are deleted ${days} days after they are created, with their ballots.`,
    notForElections: <>
      <AppName /> is for everyday decisions, not for official or binding votes.{' '}
      <Link to="/privacy">Privacy and limits</Link>
    </>,
    noNewPolls: 'This server takes no new polls at the moment.',
    creating: 'Creating…',
    create: 'Ask the question',

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
    optionOrder: { SHUFFLED: 'Options shuffled', ALPHABETICAL: 'Options sorted', AS_WRITTEN: 'Options ordered' },
    closed: 'Closed',
    keepTitle: 'Keep your admin link',
    keepText: 'Open it in another browser or device to manage this poll from there instead of here: close it, '
      + 'delete it, invite people. Keep it to yourself: whoever has it can do the same.',
    readyToInvite: <><strong>Your poll is ready.</strong> Invite people below: each gets a link of their own.</>,
    readyToShare: <><strong>Your poll is ready.</strong> Share its link to collect ballots.</>,
    closedAgo: (ago: string) => `Voting closed ${ago}. These are the final results.`,
    deletedOn: (date: string) => `This poll and its ballots will be deleted on ${date}.`,
    lastPoll: (wait: string) => `That was your last poll for now: you can create more in ${wait}.`,
    pollsLeft: (count: number, wait: string) => `You can create ${counted(count, 'more poll', 'more polls')} in the next ${wait}.`,
    fairShare: (perDay: number) => `To be fair to everyone, each connection can create ${perDay} polls a day.`,
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
    invited: 'Your invitation holds one ballot, which only this browser can change. Whoever invited you sees it was '
      + 'used, never what you chose.',
    counted: 'Your ballot is counted. You can change it from this browser until the poll closes.',
    notVoted: 'You have not voted yet.',
    hide: 'Hide my ballot',
    hidden: 'Your ballot is counted, and hidden here: nobody looking at this screen sees your choices.',
    change: 'Change my ballot',
    invitationUsed: 'This invitation was already used, in another browser or on another device. Its ballot can only '
      + 'be changed there.',
    invitationNotValid: 'This invitation link is not valid. Ask whoever invited you for a new one.',
    notInvited: 'Only invited people can vote on this poll. If you were invited, open the link from your invitation.',
    yourName: 'Your name',
    namePlaceholder: 'Leave blank to stay anonymous',
    namesAtClose: 'Everyone on this poll sees the names given, never who chose what.',
    namesLive: 'Everyone here sees the names given. As the results move live, people watching may tell who chose what.',
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
    adminLink: 'Admin link of the poll',
    adminLinkHint: 'Your admin link: open it in another browser or device to manage the poll from there instead of '
      + 'here. Keep it to yourself.',
    showAdminLink: 'Show the admin link',
    onlyThisBrowser: 'Only this browser can close or delete this poll early.',
    close: 'Close voting',
    delete: 'Delete poll',
    closeQuestion: 'Close voting for good? Nobody can vote or change their ballot any more, and everyone sees the final '
      + 'results.',
    keepOpen: 'Keep it open',
    closeForGood: 'Close for good',
    deleteQuestion: 'Delete this poll and its ballots for good? Everyone watching it sees it disappear.',
    keep: 'Keep it',
    deleteForGood: 'Delete for good',
    deletedToast: 'The poll was deleted.',
  },

  invitations: {
    heading: 'Invitations',
    count: (count: number) => counted(count, 'invitation', 'invitations'),
    used: (used: number, count: number) => `${number(used)} of ${number(count)} used`,
    hint: 'Only the people you invite can vote, each with a link of their own, good for one ballot. You see which '
      + 'links were used, never what anyone chose. You can vote without one.',
    invite: 'Invite',
    inviting: 'Inviting…',
    inviteSomeone: 'Invite someone',
    namePlaceholder: 'Name or nickname (optional)',
    loading: 'Loading the invitations…',
    showMore: 'Show more',
    newestShown: (count: number) => `The newest ${number(count)} are shown.`,
    invitationFor: (label: string) => `Invitation for ${label}`,
    invitationNumber: (number: number) => `Invitation ${number}`,
    shareHint: 'For this person only. It holds one ballot, which only the browser they vote from can change.',
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
    anyone: 'Anyone with the code or the link can vote.',
    unlisted: 'The poll is not listed anywhere else.',
    linkLabel: 'Link to the poll',
    joinCode: 'Join code',
    toEnterAt: (host: string) => `to enter at ${host}`,
    copy: 'Copy',
    copied: 'Copied',
    copyCode: 'Copy the join code',
    qrCode: (url: string) => `QR code for ${url}`,
    throughAnApp: 'Share through an app',
    byEmail: 'Send by email',
    message: (title: string) => `Vote on “${title}”`,
    orCode: (code: string, host: string) => `Or enter the code ${code} at ${host}.`,
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
      A single choice throws most of what people think away: similar options split their supporters, and one most
      people find fine can lose to one half the group dislikes. <AppName /> asks for more, in one of two ways.
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
    scienceText: 'No voting rule is perfect: Condorcet saw in 1785 that a group can prefer A to B, B to C and C to A, and '
      + 'every reasonable rule can be gamed. Grading rather than ranking sidesteps much of this, as judges of wines '
      + 'and figure skaters know.',
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
      'Copies of the polls, ballots and names above, made every night to recover from an accident, and kept 7 days: '
        + 'what is deleted is gone from them within a week.',
      `A random identifier in a cookie, so that this browser can change its ballots and manage its polls, for ${days} `
        + 'days after its last ballot or poll, as long as a poll lasts. It is the only cookie: no advertising, no '
        + 'analytics, no tracking.',
      "Your device's time zone (Europe/Paris, say), added to the statistics as totals only. Never your address.",
      "Your network's address, held in memory for a day at most, to limit how many polls each network creates. It "
        + 'is never written down.',
      'Your settings and the name you last gave, in this browser only.',
      'All that the server keeps, on one machine in Montréal, Canada, a country the European Union recognises as '
        + 'protecting personal data adequately.',
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

  legal: {
    title: 'Legal notice · super-vote',
    heading: 'Legal notice',
    publisher: 'Publisher',
    publisherText: <>
      <AppName /> is published by a private person in Québec, Canada, with no commercial purpose. Their name and
      address are not given here: the host has them.
    </>,
    law: 'Applicable law',
    lawText: <>
      <AppName /> is published from Québec, under the laws of Québec and of Canada. It is open to people everywhere,
      and whoever creates a poll or votes on one also answers to the laws of the place they are in.
      What <AppName /> keeps about you, and why, is the same for everyone, wherever they are:{' '}
      <Link to="/privacy">Privacy and limits</Link>.
    </>,
    host: 'Host',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Canada',
    ],
    hostPhone: (phone: ReactNode) => <>Telephone: {phone}</>,
    report: 'Reporting a poll',
    reportText: <>
      Polls are written by the people who create them. To report one that breaks the law, by its title, its options
      or a voter's name:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">write to us on
      GitHub</a>. Every report is looked at promptly, and what is unlawful is removed.
    </>,
  },
};

export type Messages = typeof en;
