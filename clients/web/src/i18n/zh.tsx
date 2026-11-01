/**
 * Everything the web app says, in Chinese (Simplified): en.tsx, translated.
 * Voters are addressed as «你»; a poll is a «投票», a ballot a «选票». Chinese
 * has no plural forms and sets no space around its numbers.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('zh', count);

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return `${number(count)} ${unit === 'minute' ? '分钟' : '小时'}`;
}

export const zh: Messages = {
  number,
  percent: (share: number) => formatPercent('zh', share),
  decimal: (value: number, digits: number) => formatDecimal('zh', value, digits),
  date: (isoDate: string) => formatDate('zh', isoDate),
  moment: (isoDate: string) => formatMoment('zh', isoDate),
  day: (day: string) => formatUtcDay('zh', day),
  timeAgo: (isoDate: string) => timeAgo('zh', isoDate) ?? '刚刚',
  waitUntil: inWords,

  loading: '加载中…',
  backHome: '返回首页',
  tryAgain: '重试',
  close: '关闭',
  dismiss: '忽略',

  errors: {
    unexpected: '出了点问题，请重试。',
    unreachable: '无法连接到服务器。请检查网络连接后重试。',
    failed: (status: number) => `出了点问题（错误 ${status}），请重试。`,
  },

  problems: {
    'unknown-voter': 'super-vote 不认识这个浏览器。请刷新页面，重新开始。',
    'not-poll-creator': '只有创建该投票的人才能这样做。',
    'not-invited': '只有受邀的人才能参与这个投票。如果你受到了邀请，请打开邀请中的链接。',
    'not-admin-link': '这个管理链接不属于该投票。请检查它是否被完整复制。',
    'handover-unavailable': '这个链接无法转交投票：它已被使用过。',
    'cross-site': '这个请求来自其他网站，已被拒绝。请直接打开 super-vote。',
    'poll-not-found': '没有投票使用这个链接或代码。可能输入有误，或者该投票已被删除。',
    'poll-closed': '该投票已关闭，不再接受选票。',
    'invitation-used': '已有人用这份邀请投过票，在另一个浏览器或另一台设备上。',
    'collision': '这次更改与同一时刻的另一次更改冲突了，请重试。',
    'too-many-polls': (wait: string) => '这个网络连接今天创建的投票已达上限。为了对所有人公平，'
      + `每个连接每天只能创建少量投票：${wait}后可以再创建。`,
    'too-many-wrong-codes': (wait: string) => '这个网络连接输入的错误代码过多：为了防止他人猜测投票代码，'
      + `接下来的 ${wait}内将拒绝它的代码。链接仍然有效。`,
    'server-error': '我们这边出了点问题，请稍后再试。',
  },

  mentions: {
    Excellent: '优秀',
    VeryGood: '很好',
    Good: '良好',
    Fair: '尚可',
    Passable: '及格',
    Inadequate: '不足',
    Bad: '很差',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: '多数评判',
    APPROVAL: '赞成投票',
  },

  visibilities: {
    PUBLIC: '公开',
    UNLISTED: '私密',
  },

  app: {
    home: '首页',
    settings: '设置',
    footer: <><AppName /> 免费且开源。</>,
    footerLinks: '关于 super-vote',
    about: '关于与背后的科学',
    privacy: '隐私与限制',
    legal: '法律声明',
    statistics: '统计',
    sourceCode: '源代码',
    notFound: '页面未找到',
    nothingHere: '这个地址下什么都没有。',
  },

  settings: {
    language: '语言',
    appearance: '外观',
    light: '浅色',
    automatic: '自动',
    dark: '深色',
    mentionColours: '评价颜色',
    greenToRed: '从绿到红',
    shadesOfGrey: '灰度',
    shadesOfGreyHint: '无论你看到哪些颜色，灰度的读法都一样：越浅越好。',
    majorityJudgmentBallot: '多数评判选票',
    colourScale: '色阶',
    dropdowns: '下拉菜单',
    castingYourBallot: '投出你的选票',
    live: '即时',
    envelope: '信封',
    liveHint: '你的每次更改都会立即计入。',
    envelopeHint: '填好选票，然后一次性提交。',
  },

  home: {
    title: 'super-vote · 一起做决定',
    lead: '数学说，这样更公平。',
    createQuestion: '需要发起一次投票？',
    createPoll: '一起做决定！',
    yourPolls: '一起做决定…',
    publicPolls: '公开投票',
    noPublicPolls: '还没有公开投票。',
    public: '公开',
    closed: '已关闭',

    howItWorks: '如何运作',
    steps: [
      { title: '提问', text: '一个问题和它的选项。' },
      { title: '分享', text: '一个链接、一个二维码或一个代码。' },
      { title: '决定', text: '每个人打分，结果实时呈现。' },
    ],

    agent: {
      title: '为 AI 准备好了',
      text: '把这段话连同你自己的问题，粘贴给一个能浏览网页的助手。',
      prompt: (site: string, guide: string) => `用 ${site} 为我的团队创建一个投票（给智能体的说明：`
        + `${guide}）。问题：“我们去哪里团建？”选项：里斯本、柏林、`
        + '巴塞罗那。使用多数评判，并在我关闭投票之前隐藏结果。'
        + '把投票转交给我，然后给我一个可以分享给团队的链接。',
      copy: '复制文本',
      copied: '文本已复制',
      caption: '它会回复两个链接：打开第一个，把投票变成你的；把第二个发给大家。',
    },

    systems: {
      title: '两种决定方式',
      majorityJudgment: {
        title: '多数评判',
        text: '给每个选项打分，从优秀到很差。多数评价最高者获胜。',
      },
      approval: {
        title: '赞成投票',
        text: '勾选所有你能接受的选项。被勾选最多者获胜。',
      },
    },

    compare: {
      title: '比大多数正式选举更公平',
      text: '大多数选举只要求写下一个名字。相似的候选人会分走各自的选民，而一个被多数人反对的人仍可能获胜。'
        + '多数评判源自米歇尔·巴林斯基（Michel Balinski）和里达·拉拉基（Rida Laraki）的研究，'
        + '它衡量的是每个人对每个选项的看法。',
      science: '背后的科学',
      single: '单选',
      singleNote: '大多数选举',
      approval: '赞成投票',
      majorityJudgment: '多数评判',
      criteria: {
        nuance: '说出你对每个选项的看法',
        splitting: '相似的选项不会分散选票',
        lesserEvil: '无需选“较小的恶”',
        tactics: '难以操纵',
        quick: '填写迅速',
        familiar: '熟悉易懂',
      },
      marks: { yes: '是', partly: '部分', no: '否' },
      caption: <><AppName /> 提供赞成投票和多数评判。没有哪种投票规则是完美的，但有些比另一些公平得多。</>,
    },

    supportTitle: '免费、开源、无广告',
    supportText: '你不是产品：目标是推广更好的投票制度。由一个人利用业余时间制作。如果它帮你的小组做出了决定，你也可以帮帮它。',

    limitsTitle: '须知',
    limits: {
      everyday: <><strong>用于日常决定，</strong>而非正式选举：没有账户，有人可以从另一个浏览器再次投票。邀请可以让每个人只计一次。</>,
      private: <><strong>私密，但对服务器并非隐藏。</strong>其他人看不到你的选票，保存下来的选票也不会说明是谁投的。</>,
      browser: (days: number) => <><strong>绑定到这个浏览器，</strong>通过一个 cookie，在你最后一次投票或创建投票后保留 {days} 天。
        没有广告，没有追踪。</>,
      deleted: (days: number) => <><strong>{days} 天后删除，</strong>投票和选票都一样。</>,
      disclaimer: <><strong>不作保证。</strong><AppName /> 倡导更好的投票方式。它由一个人制作，
        在安全、隐私、性能、架构和代码质量上都尽了最大努力，但它未经认证、审计或独立审查：不保证其结果准确，
        也不保证真实反映一个群体的意愿。这需要认证、技术方面的专家审查和持续支持，
        而没有赞助者和专家，一个人无法提供这些。</>,
    },
    limitsLink: '关于隐私与限制的全部内容',
  },
  join: {
    label: '有代码吗？',
    typeTheCode: '输入你拿到的代码。',
    notACode: '代码由六个字母和数字组成，例如 K7M-4QX。',
    joining: '正在加入…',
    join: '投票！',
  },

  newPoll: {
    title: '一起做决定 · super-vote',
    heading: '一起做决定',
    question: '问题',
    questionPlaceholder: '周五我们去哪里吃饭？',
    options: '选项',
    option: (row: number) => `选项 ${row}`,
    remove: (option: string) => `移除 ${option}`,
    optionsHint: (max: number) => `最多 ${max} 个选项。输入时会自动出现新的一行。`,

    votingSystem: '投票制度',
    systems: {
      MAJORITY_JUDGMENT: '多数评判',
      APPROVAL: '赞成投票',
    },
    systemHints: {
      MAJORITY_JUDGMENT: '投票者为每个选项打分，从优秀到很差。多数人评价最高的选项获胜：细致入微，且难以操纵。',
      APPROVAL: '投票者勾选所有能接受的选项。获得最多赞成的选项获胜：快捷简单。',
    },

    whoCanFindIt: '谁能找到它',
    visibilityHints: {
      PUBLIC: '列在首页上，任何人都能找到。',
      UNLISTED: '不会在任何地方列出：只有你分享了链接或代码的人才能找到。',
    },

    whoCanVote: '谁可以投票',
    anyone: '任何人',
    invitedOnly: '仅限受邀者',
    anyoneHint: <>
      任何拥有链接或代码的人。有心人可以从另一个浏览器再次投票：要让每个人只计一次，请邀请他们。
    </>,
    invitedHint: '每个人都会得到专属于自己的链接，仅限投一票。你能看到哪些链接已被使用，但永远看不到谁选了什么。',

    whoVoted: '谁投了票',
    anonymous: '匿名',
    showNames: '显示姓名',
    anonymousHint: '没有人能看到谁投了票，只能看到有多少人投票。',
    showNamesHint: '投票者可以留下姓名，显示在结果下方。没有人能看到谁选了什么。',

    results: '结果',
    resultsChoices: {
      LIVE: '实时',
      AFTER_BALLOTS: '延迟',
      AFTER_CLOSING: '关闭时',
    },
    resultsHints: {
      LIVE: '注意：每个人都能看到每张选票如何改变结果。在小群体中，这会暴露谁选了什么。',
      AFTER_BALLOTS: '在收到足够多的选票之前保持隐藏，以保护最早投票的人。之后每张选票都会改变结果，这仍可能暴露后来的投票者。',
      AFTER_CLOSING: '在你关闭投票后显示。在此之前，所有人只能看到有多少人投了票。',
    },
    ballotsBeforeResults: '显示结果前所需的选票数',

    optionOrder: '选项顺序',
    orders: {
      ALPHABETICAL: '按字母顺序',
      SHUFFLED: '随机',
      AS_WRITTEN: '按填写顺序',
    },
    orderHints: {
      ALPHABETICAL: '按字母顺序排列，数字按数值：2 排在 10 之前。写日期时年份在前，例如 2026-10-24。',
      SHUFFLED: '每位投票者每次访问都是新的顺序，这样没有选项会因位置而占便宜。',
      AS_WRITTEN: '你的顺序。靠前的位置会获得更多支持，所以这可能看起来像是在左右结果。',
    },

    deletedAfter: (days: number) => `投票在创建 ${days} 天后连同选票一起删除。`,
    notForElections: <>
      <AppName /> 用于日常决定，而非正式或有约束力的投票。{' '}
      <Link to="/privacy">隐私与限制</Link>
    </>,
    noNewPolls: '该服务器目前不接受新投票。',
    creating: '正在创建…',
    create: '提出问题',

    problems: {
      titleMissing: '请给你的投票起个标题。',
      titleTooLong: (max: number) => `标题最多 ${max} 个字符。`,
      titleInvisible: '标题只能包含可见字符。',
      tooFewOptions: '请至少添加两个选项。',
      tooManyOptions: (max: number) => `一个投票最多有 ${max} 个选项。`,
      optionTooLong: (max: number) => `选项最多 ${max} 个字符。`,
      optionInvisible: '选项只能包含可见字符。',
      optionTwice: (option: string) => `“${option}”出现了两次。每个选项必须不同。`,
      resultsAfterBallots: (min: number) => `请选择一个整数的选票数，至少为 ${min}。`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: '正在接管这个投票…',
    deleted: '该投票已被删除',
    deletedText: '它已被删除，结果也随之消失。',
    notFound: '未找到投票',
    notFoundText: '链接可能不完整，或者该投票已被删除。',
    notLoaded: '无法加载该投票',
    loadingPoll: '正在加载投票…',
    byInvitation: '凭邀请',
    optionOrder: { SHUFFLED: '选项随机排列', ALPHABETICAL: '选项按字母排序', AS_WRITTEN: '选项按填写顺序' },
    closed: '已关闭',
    keepTitle: '保管好你的管理链接',
    keepText: '在另一个浏览器或设备上打开它，就能从那里而不是这里管理这个投票：关闭、删除、邀请他人。请自己保管：'
      + '拿到它的人可以做同样的事。',
    readyToInvite: <><strong>你的投票已就绪。</strong>请在下方邀请他人：每个人都会得到专属于自己的链接。</>,
    readyToShare: <><strong>你的投票已就绪。</strong>分享它的链接来收集选票。</>,
    closedAgo: (ago: string) => `投票已于${ago}关闭。这是最终结果。`,
    deletedOn: (date: string) => `该投票及其选票将于 ${date} 删除。`,
    lastPoll: (wait: string) => `这是你目前的最后一个投票：${wait}后可以再创建。`,
    pollsLeft: (count: number, wait: string) => `在接下来的 ${wait}内，你还可以创建 ${number(count)} 个投票。`,
    fairShare: (perDay: number) => `为了对所有人公平，每个连接每天可以创建 ${perDay} 个投票。`,
  },

  ballot: {
    yourBallot: '你的选票',
    withdraw: '撤回',
    submit: '提交我的选票',
    rateEveryOption: '为每个选项打分后才能提交',
    submitting: '正在提交…',
    majorityJudgmentLive: '给每个选项一个评价。未评价的选项按“很差”计算。',
    majorityJudgmentEnvelope: '给每个选项一个评价，然后提交你的选票。',
    approval: '勾选所有你会满意的选项。',
    invited: '你的邀请对应一张选票，只有这个浏览器可以更改。邀请你的人能看到它已被使用，但永远看不到你选了什么。',
    counted: '你的选票已计入。在投票关闭前，你可以从这个浏览器更改它。',
    notVoted: '你还没有投票。',
    hide: '隐藏我的选票',
    hidden: '你的选票已计入，并在此隐藏：看着这块屏幕的人看不到你的选择。',
    change: '更改我的选票',
    invitationUsed: '这份邀请已在另一个浏览器或另一台设备上使用过。它的选票只能在那里更改。',
    invitationNotValid: '这个邀请链接无效。请向邀请你的人要一个新的。',
    notInvited: '只有受邀的人才能参与这个投票。如果你受到了邀请，请打开邀请中的链接。',
    yourName: '你的姓名',
    namePlaceholder: '匿名',
    namesGiven: '可选。所有人都能看到所留的姓名，但看不到他们的选择。',
    namesLive: '实时结果可能会暗示谁选了什么。',
    notRatedYet: '尚未评价',
    chooseAMention: '选择一个评价…',
    optionsYouApprove: '你赞成的选项',
  },

  results: {
    heading: '结果',
    ballots: (count: number) => `${number(count)} 张选票`,
    noBallotsYet: '还没有选票。结果会随着选票到来而逐步呈现。',
    keptUntilBallots: (count: number) => `收到 ${count} 张选票后才会显示结果，这样最早投票者的选择仍属于他们自己。`,
    keptUntilYouClose: '你关闭投票后会显示结果。',
    keptUntilClosed: '投票关闭后会显示结果。',
    download: '下载结果',
    final: '最终',
    connecting: '正在连接…',
    live: '实时',
    reconnecting: '正在重新连接…',
    whoVoted: '谁投了票',
    anonymousVoters: (count: number) => `${number(count)} 位匿名投票者`,
    andAnonymousVoters: (count: number) => `以及 ${number(count)} 位匿名投票者`,
    moreVoters: (count: number) => `以及另外 ${number(count)} 位投票者`,
    rank: (rank: number) => `第 ${rank} 名`,
    approvals: (count: number) => `${number(count)} 个赞成`,
    noBallotsFor: (option: string) => `${option}：还没有选票`,
    profile: (option: string, mentions: string) => `${option}：${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}：${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: '并列',
    majorityMention: '多数评价：',
    gmjScore: 'GMJ 得分：',
    gmjScoreTitle: (score: string) => `GMJ 的通常评判得分：${score}。用于在多数评价相同的选项之间分出高下。`,
    orBetter: (share: string, mention: string) => `${share} 的人给出“${mention}”或更好`,
  },

  owner: {
    manage: '管理你的投票',
    adminLink: '投票的管理链接',
    adminLinkHint: '你的管理链接：在另一个浏览器或设备上打开它，就能从那里而不是这里管理投票。请自己保管。',
    showAdminLink: '显示管理链接',
    onlyThisBrowser: '只有这个浏览器可以提前关闭或删除这个投票。',
    close: '关闭投票',
    delete: '删除投票',
    closeQuestion: '永久关闭投票？之后没有人可以投票或更改选票，所有人都会看到最终结果。',
    keepOpen: '保持开放',
    closeForGood: '永久关闭',
    deleteQuestion: '永久删除这个投票及其选票？正在查看它的人会看到它消失。',
    keep: '保留',
    deleteForGood: '永久删除',
    deletedToast: '投票已删除。',
  },

  invitations: {
    heading: '邀请',
    count: (count: number) => `${number(count)} 份邀请`,
    used: (used: number, count: number) => `已使用 ${number(used)} / ${number(count)}`,
    hint: '只有你邀请的人可以投票，每人一个专属链接，仅限投一票。你能看到哪些链接已被使用，但永远看不到谁选了什么。你自己无需邀请即可投票。',
    invite: '邀请',
    inviting: '正在邀请…',
    inviteSomeone: '邀请某人',
    namePlaceholder: '姓名或昵称（可选）',
    loading: '正在加载邀请…',
    showMore: '显示更多',
    newestShown: (count: number) => `显示最新的 ${number(count)} 份。`,
    invitationFor: (label: string) => `给 ${label} 的邀请`,
    invitationNumber: (number: number) => `邀请 ${number}`,
    shareHint: '仅限这个人使用。它对应一张选票，只有对方投票时用的浏览器可以更改。',
    linkLabel: '邀请链接',
    message: (title: string) => `你受邀参与“${title}”的投票。这个链接只属于你。`,
    isUsed: '已使用',
    notUsedYet: '尚未使用',
    share: (name: string) => `分享给 ${name} 的链接`,
    takeBack: (name: string) => `收回给 ${name} 的链接`,
    takeBackQuestion: '收回这份邀请？它的链接将失效。',
    keep: '保留',
    takeItBack: '收回',
  },

  share: {
    share: '分享',
    title: '分享这个投票',
    anyone: '任何拥有代码或链接的人都可以投票。',
    unlisted: '该投票不会在其他任何地方列出。',
    linkLabel: '投票链接',
    joinCode: '加入代码',
    toEnterAt: (host: string) => `在 ${host} 输入`,
    copy: '复制',
    copied: '已复制',
    copyCode: '复制加入代码',
    qrCode: (url: string) => `${url} 的二维码`,
    throughAnApp: '通过应用分享',
    byEmail: '通过电子邮件发送',
    message: (title: string) => `来参与“${title}”的投票`,
    orCode: (code: string, host: string) => `或在 ${host} 输入代码 ${code}。`,
  },

  statistics: {
    title: '统计 · super-vote',
    heading: <><AppName /> 遍及全球</>,
    lead: '有多少投票、选票和访客，何时，来自何处。',
    show: '显示',
    measures: {
      voters: {
        label: '访客', plural: '访客',
        noun: () => '位访客',
        count: (count: number) => `${number(count)} 位访客`,
      },
      polls: {
        label: '投票', plural: '投票',
        noun: () => '个投票',
        count: (count: number) => `${number(count)} 个投票`,
      },
      ballots: {
        label: '选票', plural: '选票',
        noun: () => '张选票',
        count: (count: number) => `${number(count)} 张选票`,
      },
    },
    totals: {
      polls: '已创建的投票',
      openPolls: '当前开放',
      ballots: '已投出的选票',
      voters: '访客',
    },
    lastDays: '最近 90 天',
    where: '地点',
    byRegion: '按地区',
    noRegion: '还没有地区。',
    tapADot: '点按一个圆点查看它的数字。',
    unplaced: (visitors: string, polls: string, ballots: string) => '未显示在任何地区，原因是缺少时区或人数不足以显示：'
      + `${visitors}、${polls}和${ballots}。`,
    howCounted: '如何统计',
    howCountedText: <>
      访客指访问过 <AppName /> 的浏览器或应用：一个人用两台设备会计两次。一张选票只计一次，无论投票者更改多少次。
    </>,
    places: (updated: string) => '地点来自你设备设置的时区，绝不来自你的地址，而且只保存合计数。某个地点有三位访客来自那里时才会显示。'
      + '数字每小时更新一次，这样就无法在选票陆续到来时把它们与某个投票的选票对应起来。'
      + `最后更新：${updated}。`,
    sources: <>
      每个圆点是以某个时区命名的城市，代表该时区内的所有人。日期按 UTC 计算。陆地数据来自{' '}
      <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>，时区来自{' '}
      <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA 数据库</a>。
    </>,
    onDay: (count: string, noun: string, day: string) => <>{day}：<strong>{count}</strong> {noun}</>,
    overLastDays: (counts: string, days: number) => `最近 ${days} 天共 ${counts}`,
    busiest: (day: string, count: string) => `，最多的是 ${day}：${count}。`,
    topLine: (count: string) => `最高值：${count}`,
    regionAndCity: '地区与城市',
    map: (what: string) => `按时区划分的${what}世界地图。下方表格列出了相同的数字。`,
    zoomIn: '放大',
    zoomOut: '缩小',
    nothingYet: '暂无可显示的地点。',
    fewer: '更少',
    upTo: (count: string) => `最多 ${count}`,
    pollPlaces: '选票来自何处',
    pollPlacesNone: '某个地区有三张选票来自那里时才会显示。',
    pollPlacesHint: '依据每位投票者的时区，绝不依据其地址。某个地点有三张选票来自那里时才会显示，数字每小时更新一次。',
    regions: {
      Africa: '非洲',
      America: '美洲',
      Antarctica: '南极洲',
      Arctic: '北极',
      Asia: '亚洲',
      Atlantic: '大西洋岛屿',
      Australia: '澳大利亚',
      Europe: '欧洲',
      Indian: '印度洋',
      Pacific: '太平洋',
    } as Record<string, string>,
  },

  about: {
    title: '关于 · super-vote',
    heading: <>关于 <AppName /></>,
    lead: (days: number) => <>
      一种免费、开源的方式，让一个群体一起做决定：去哪里吃饭、去哪里玩、选什么。无需账户，没有广告，没有追踪。
      投票在创建 {days} 天后删除。
    </>,
    howDecided: '结果如何决定',
    howDecidedText: <>
      单选会丢掉人们大部分的想法：相似的选项会分走各自的支持者，而一个几乎人人觉得还不错的选项，可能输给一个让半数人反感的选项。
      <AppName /> 用两种方式问得更多。
    </>,
    majorityJudgment: '多数评判',
    majorityJudgmentText: <>
      每位投票者给每个选项打分，从<em>优秀</em>到<em>很差</em>。一个选项的<strong>多数评价</strong>，是超过半数的投票者给它的
      或比它更高的最好评价：也就是它的中位数。多数评价最好的选项获胜。当多个选项并列时，由 <strong>GMJ 得分</strong>
      在它们之间决出高下：它衡量各评价在该评价之上或之下偏离了多少。仍然相同的选项以<em>并列</em>显示，
      没有任何隐藏规则替你挑出一个。
    </>,
    approval: '赞成投票',
    approvalText: '每位投票者勾选所有自己会满意的选项。获得最多投票者赞成的选项获胜。它快捷，而且绝不会因为你支持多个选项而惩罚你。',
    science: '背后的科学',
    scienceText: '没有哪种投票规则是完美的：孔多塞在 1785 年就发现，一个群体可能偏好 A 胜过 B、B 胜过 C、C 胜过 A，'
      + '而且每一种合理的规则都可以被操纵。打分而不是排序可以避开其中许多问题，品酒评委和花样滑冰裁判对此深有体会。',
    notes: {
      pnas2007: '提出多数评判：打分，然后按中位数评价排序。',
      book2011: '这本书：理论、其性质，以及真实的选举和评审团。',
      judge2014: '为什么打分可以避免排序的悖论，并且抵抗操纵。',
      fabre2021: <><AppName /> 用来在多数评价相同的选项之间打破平局的“通常评判”得分。</>,
      brams1978: '为认可每一个可接受的选项辩护。',
      laslier2009: '人们在赞成投票下如何策略性地投票，以及由此产生的结果。',
      gibbard1973: '与萨特思韦特一起：每一种合理的投票规则都可以被操纵。问题在于程度。',
      satterthwaite1975: '同样的结果，独立得出。',
    },
    whoMakesIt: '谁在制作',
    whoMakesItText: <>
      <AppName /> 由魁北克的一个人利用业余时间制作，对所有人免费。它的代码是开放的：任何人都可以阅读选票是如何统计的、运行自己的副本，或提出修改建议。
    </>,
    seeTheCode: '在 GitHub 上查看源代码',
  },

  privacy: {
    title: '隐私与限制 · super-vote',
    heading: '隐私与限制',
    lead: <>
      <AppName /> 的设计使得没有人能知道你选了什么。这里说明它保存什么、谁能看到什么，以及它目前还做不到什么。
    </>,

    forWhat: '用途',
    forWhatText: '在彼此信任的人之间一起做决定：朋友、家人、团队、班级、协会。它不适合选举，也不适合任何有法律、财务或官方后果的投票：'
      + '那些需要每位投票者都被识别且只计一次，以及任何人都能核实的结果，而 super-vote 目前还无法承诺这些。',

    kept: '保存什么，保存多久',
    keptItems: (days: number) => [
      `投票：它的问题、选项和设置，保存到被删除为止，最迟在创建 ${days} 天后。创建者可以提前删除。`,
      '你在某个投票中的选票，存放在不会说明你是谁的密钥之下，并随投票一起删除。在投票关闭之前，你可以撤回它。',
      '你在显示姓名的投票中留下的姓名，与你的选票分开存放，使两者之间没有任何关联。',
      '上述投票、选票和姓名的副本，每晚制作，用于事故后的恢复，保留 7 天：被删除的内容会在一周内从中消失。',
      `cookie 中的一个随机标识符，让这个浏览器能更改自己的选票并管理自己的投票，在其最后一次投票或创建投票后保留 ${days} 天，`
        + '只要有投票存在。它是唯一的 cookie：没有广告，没有分析，没有追踪。',
      '你设备的时区（例如 Europe/Paris），仅作为合计数加入统计。绝不涉及你的地址。',
      '你的网络地址，最多在内存中保留一天，用来限制每个网络创建的投票数量。它从不被写入存储。',
      '你的设置和你最后一次留下的姓名，仅保存在这个浏览器中。',
      '服务器保存的一切都位于加拿大蒙特利尔的一台机器上，欧盟承认该国对个人数据提供充分保护。',
    ],

    whoSees: '谁能看到什么',
    whoSeesItems: [
      '投票中的每个人都会看到以合计数呈现的结果（如果创建者选择显示的话），以及投票者愿意留下的姓名。',
      '投票的创建者看到同样的内容，还能看到哪些邀请已被使用：永远看不到谁选了什么。',
      '没有人能看到你的选票。即使在你自己的屏幕上，计入之后它也是隐藏的。',
      '运行服务器的人能实时看到请求。保存下来的内容不会说明谁选了什么，但 super-vote 不会对正在运行的服务器隐藏选票：运行它的人被信任不会去看。',
    ],

    limits: '需要了解的限制',
    limitsItems: [
      '没有邀请时，一个人可以从不同的浏览器或设备多次投票。super-vote 依靠善意，而选票数量会在被滥用时显示出来。要让每个人只计一次，请邀请他们。',
      '你的选票和投票属于这个浏览器。换一台设备，或清除其数据后，你将无法再更改或管理它们，也没有账户可以找回它们。',
      '实时结果会随每张选票的到来而变化：在小群体中，旁观者可以推断出谁选了什么。创建投票的人可以选择何时显示结果，并会收到警告。',
      '计票结果无法独立核实：你要信任服务器，而它的代码对任何人开放阅读。',
      'super-vote 免费，运行在一台小服务器上：有时可能无法使用。请不要在紧急事项上依赖它。',
    ],

    rights: '你的数据，你的选择',
    rightsText: '你的选票与你没有关联，所以 super-vote 无法替你找到它们：请在这个浏览器中撤回选票，或删除你创建的投票。'
      + '清除这个浏览器中 super-vote 的数据，会移除它的 cookie 和设置。',
    contact: <>
      问题、关于你数据的请求，或要举报的投票：{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">在 GitHub 上联系我们</a>。
      安全漏洞：请参阅{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">安全政策</a>。
    </>,
    openSource: <>
      这里的一切都无需凭信任接受：<AppName /> 的代码，包括计票和选票的保护，
      都<a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">向任何人开放阅读</a>。
    </>,
  },

  legal: {
    title: '法律声明 · super-vote',
    heading: '法律声明',
    publisher: '发布者',
    publisherText: <>
      <AppName /> 由加拿大魁北克的一位个人发布，不以商业为目的。其姓名和地址不在此提供：托管方持有这些信息。
    </>,
    law: '适用法律',
    lawText: <>
      <AppName /> 从魁北克发布，适用魁北克和加拿大的法律。它向各地的人开放，创建或参与投票的人同时也受其所在地法律的约束。
      <AppName /> 保存关于你的哪些信息以及原因，对所有人都一样，无论他们身在何处：{' '}
      <Link to="/privacy">隐私与限制</Link>。
    </>,
    host: '托管方',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      '加拿大',
    ],
    hostPhone: (phone: ReactNode) => <>电话：{phone}</>,
    report: '举报投票',
    reportText: <>
      投票由创建者撰写。如需举报违反法律的投票，无论是其标题、选项还是投票者的姓名：{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">在 GitHub 上联系我们</a>。
      每一份举报都会被迅速查看，违法内容将被移除。
    </>,
  },
};
