/**
 * Everything the web app says, in Japanese: en.tsx, translated, in the polite
 * です・ます style. A poll is a «投票», a ballot a «票». Japanese has no plural
 * forms and sets no space around its numbers.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('ja', count);

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return `${number(count)}${unit === 'minute' ? '分' : '時間'}`;
}

export const ja: Messages = {
  number,
  percent: (share: number) => formatPercent('ja', share),
  decimal: (value: number, digits: number) => formatDecimal('ja', value, digits),
  date: (isoDate: string) => formatDate('ja', isoDate),
  moment: (isoDate: string) => formatMoment('ja', isoDate),
  day: (day: string) => formatUtcDay('ja', day),
  timeAgo: (isoDate: string) => timeAgo('ja', isoDate) ?? 'たった今',
  waitUntil: inWords,

  loading: '読み込み中…',
  backHome: 'ホームに戻る',
  tryAgain: 'もう一度試す',
  close: '閉じる',
  dismiss: '非表示にする',

  errors: {
    unexpected: '問題が発生しました。もう一度お試しください。',
    unreachable: 'サーバーに接続できません。接続を確認して、もう一度お試しください。',
    failed: (status: number) => `問題が発生しました（エラー ${status}）。もう一度お試しください。`,
  },

  problems: {
    'unknown-voter': 'このブラウザーは super-vote に認識されていません。ページを再読み込みして、最初からやり直してください。',
    'not-poll-creator': 'これを行えるのは、この投票を作成した人だけです。',
    'not-invited': 'この投票に参加できるのは招待された人だけです。招待された場合は、招待状のリンクを開いてください。',
    'not-admin-link': 'この管理リンクは、この投票のものではありません。最後まで正しくコピーされているか確認してください。',
    'handover-unavailable': 'このリンクでは投票を引き継げません。すでに使用されています。',
    'cross-site': 'このリクエストは別のウェブサイトから送られたため、拒否されました。super-vote を直接開いてください。',
    'poll-not-found': 'このリンクまたはコードの投票はありません。入力ミスか、投票が削除された可能性があります。',
    'poll-closed': 'この投票は終了しました。これ以上票を受け付けません。',
    'invitation-used': 'すでに誰かがこの招待で、別のブラウザーまたは別のデバイスから投票しました。',
    'collision': 'この変更は、同時に行われた別の変更と衝突しました。もう一度お試しください。',
    'too-many-polls': (wait: string) => 'この接続は、今日作成できる投票の数に達しました。すべての人に公平であるよう、'
      + `1 日に作成できる数には限りがあります。${wait}後にまた作成できます。`,
    'too-many-wrong-codes': (wait: string) => 'この接続から間違ったコードが多数入力されました。投票を推測から守るため、'
      + `今後 ${wait}はこの接続のコードを受け付けません。リンクは引き続き使えます。`,
    'server-error': 'こちら側で問題が発生しました。しばらくしてからもう一度お試しください。',
  },

  mentions: {
    Excellent: '非常に優れている',
    VeryGood: 'とても良い',
    Good: '良い',
    Fair: 'まあまあ',
    Passable: '可',
    Inadequate: '不十分',
    Bad: '悪い',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: '多数判定',
    APPROVAL: '承認投票',
  },

  visibilities: {
    PUBLIC: '公開',
    UNLISTED: '非公開',
  },

  app: {
    home: 'ホーム',
    settings: '設定',
    footer: <><AppName /> は無料のオープンソースです。</>,
    footerLinks: 'super-vote について',
    about: '概要と背景にある科学',
    privacy: 'プライバシーと制限',
    legal: '法的情報',
    statistics: '統計',
    sourceCode: 'ソースコード',
    notFound: 'ページが見つかりません',
    nothingHere: 'このアドレスには何もありません。',
  },

  settings: {
    language: '言語',
    appearance: '外観',
    light: 'ライト',
    automatic: '自動',
    dark: 'ダーク',
    mentionColours: '評価の色',
    greenToRed: '緑から赤',
    shadesOfGrey: 'グレーの濃淡',
    shadesOfGreyHint: 'グレーの濃淡は、見える色がどうであっても同じように読み取れます。明るいほど良い評価です。',
    majorityJudgmentBallot: '多数判定の投票用紙',
    colourScale: 'カラースケール',
    dropdowns: 'ドロップダウン',
    castingYourBallot: '投票のしかた',
    live: '即時',
    envelope: '封筒',
    liveHint: '変更はした瞬間に集計されます。',
    envelopeHint: '投票用紙に記入してから、まとめて提出します。',
  },

  home: {
    title: 'super-vote · みんなで決めよう',
    lead: '数学によれば、こちらのほうが公平です。',
    createQuestion: '投票をつくりますか？',
    createPoll: 'みんなで決めよう！',
    yourPolls: 'みんなで決める…',
    publicPolls: '公開の投票',
    noPublicPolls: '公開の投票はまだありません。',
    public: '公開',
    closed: '終了',

    howItWorks: 'しくみ',
    steps: [
      { title: '質問する', text: '質問と選択肢を用意します。' },
      { title: '共有する', text: 'リンク、QR コード、またはコードで。' },
      { title: '決める', text: '全員が評価し、結果がリアルタイムで届きます。' },
    ],

    agent: {
      title: 'AI にも対応',
      text: 'ウェブを閲覧できるアシスタントに、あなた自身の質問と一緒に貼り付けてください。',
      prompt: (site: string, guide: string) => `${site} を使って、チーム向けの投票を作成してください（エージェント向けの説明：`
        + `${guide}）。質問：「合宿はどこでやりますか？」選択肢：リスボン、ベルリン、`
        + 'バルセロナ。多数判定を使い、私が投票を終了するまで結果は非表示にしてください。'
        + '投票を私に引き継いでから、チームに共有するリンクを教えてください。',
      copy: '文章をコピー',
      copied: '文章をコピーしました',
      caption: '2 つのリンクが返ってきます。1 つ目を開いて投票を自分のものにし、2 つ目をグループに送ってください。',
    },

    systems: {
      title: '決め方は 2 つ',
      majorityJudgment: {
        title: '多数判定',
        text: 'すべての選択肢を「非常に優れている」から「悪い」まで評価します。多数評価が最も高いものが勝ちです。',
      },
      approval: {
        title: '承認',
        text: '受け入れられる選択肢をすべてチェックします。最も多くチェックされたものが勝ちです。',
      },
    },

    compare: {
      title: '多くの公的な選挙より公平',
      text: 'ほとんどの選挙では名前を 1 つだけ書きます。似た候補者同士で票が割れ、多くの人が拒否する候補者が勝つこともあります。'
        + 'ミシェル・バリンスキとリダ・ララキの研究から生まれた多数判定は、'
        + 'すべての人がそれぞれの選択肢をどう思っているかを測ります。',
      science: '背景にある科学',
      single: '1 つだけ選ぶ',
      singleNote: 'ほとんどの選挙',
      approval: '承認',
      majorityJudgment: '多数判定',
      criteria: {
        nuance: '選択肢ごとの考えを伝えられる',
        splitting: '似た選択肢で票が割れない',
        lesserEvil: '「まだましな方」に入れなくてよい',
        tactics: '操作されにくい',
        quick: '記入が早い',
        familiar: 'なじみがある',
      },
      marks: { yes: 'はい', partly: '一部', no: 'いいえ' },
      caption: <><AppName /> は承認と多数判定を提供します。完璧な投票ルールはありませんが、他よりずっと公平なものはあります。</>,
    },

    supportTitle: '無料、オープンソース、広告なし',
    supportText: 'あなたは商品ではありません。目的は、より良い投票方式を広めることです。1 人が空き時間に作っています。'
      + 'あなたのグループが決めるのに役立ったなら、このサービスを支えることもできます。',

    limitsTitle: '知っておくべきこと',
    limits: {
      everyday: <><strong>日常の決めごと向けで、</strong>公的な選挙には向きません。アカウントがないため、別のブラウザーからもう一度投票できてしまいます。招待を使えば、一人ひとりを 1 回だけ数えられます。</>,
      private: <><strong>非公開ですが、サーバーには見えます。</strong>ほかの誰にもあなたの票は見えず、保存された票からは誰が投じたかわかりません。</>,
      browser: (days: number) => <><strong>このブラウザーに紐づきます。</strong>Cookie を 1 つ使い、最後の投票または投票作成から {days} 日間保持します。
        広告も追跡もありません。</>,
      deleted: (days: number) => <><strong>{days} 日後に削除されます。</strong>投票も票も同じです。</>,
      disclaimer: <><strong>保証はありません。</strong><AppName /> はより良い投票方法を広めるものです。1 人で、
        セキュリティ、プライバシー、性能、設計、コード品質に最大限気を配って作っていますが、認定、監査、
        第三者による独立した審査は受けていません。結果が正確であること、グループの意思を正しく反映していることは保証されません。
        それには、認定、技術面の専門家による審査、継続的なサポートが必要で、スポンサーや専門家なしに 1 人で提供することはできません。</>,
    },
    limitsLink: 'プライバシーと制限のすべて',
  },
  join: {
    label: 'コードをお持ちですか？',
    typeTheCode: '受け取ったコードを入力してください。',
    notACode: 'コードは、K7M-4QX のような 6 つの英字と数字です。',
    joining: '参加中…',
    join: '投票する！',
  },

  newPoll: {
    title: 'みんなで決める · super-vote',
    heading: 'みんなで決める',
    question: '質問',
    questionPlaceholder: '金曜日はどこで食べる？',
    options: '選択肢',
    option: (row: number) => `選択肢 ${row}`,
    remove: (option: string) => `${option} を削除`,
    optionsHint: (max: number) => `最大 ${max} 件の選択肢。入力すると新しい行が現れます。`,

    votingSystem: '投票方式',
    systems: {
      MAJORITY_JUDGMENT: '多数判定',
      APPROVAL: '承認',
    },
    systemHints: {
      MAJORITY_JUDGMENT: '投票者がすべての選択肢を「非常に優れている」から「悪い」まで評価します。過半数が最も高く評価した選択肢が勝ちます。'
        + 'きめ細かく、操作されにくい方式です。',
      APPROVAL: '投票者が受け入れられる選択肢をすべてチェックします。最も承認された選択肢が勝ちます。手早く簡単です。',
    },

    whoCanFindIt: '見つけられる人',
    visibilityHints: {
      PUBLIC: 'ホームに一覧表示され、誰でも見つけられます。',
      UNLISTED: 'どこにも一覧表示されません。リンクやコードを共有した人だけが見つけられます。',
    },

    whoCanVote: '投票できる人',
    anyone: '誰でも',
    invitedOnly: '招待された人のみ',
    anyoneHint: <>
      リンクまたはコードを知っている人なら誰でも。その気になれば、別のブラウザーからもう一度投票できます。
      一人ひとりを 1 回だけ数えるには、招待してください。
    </>,
    invitedHint: '一人ひとりに、1 票だけ有効な専用リンクが届きます。どのリンクが使われたかはわかりますが、誰が何を選んだかはわかりません。',

    whoVoted: '投票した人',
    anonymous: '匿名',
    showNames: '名前を表示',
    anonymousHint: '誰が投票したかは見えず、何人が投票したかだけがわかります。',
    showNamesHint: '投票者は名前を入力でき、結果の下に表示されます。誰が何を選んだかは誰にもわかりません。',

    results: '結果',
    resultsChoices: {
      LIVE: 'リアルタイム',
      AFTER_BALLOTS: '遅延',
      AFTER_CLOSING: '終了時',
    },
    resultsHints: {
      LIVE: '注意：票が入るたびに結果が動くのが全員に見えます。少人数のグループでは、誰が何を選んだかがわかってしまいます。',
      AFTER_BALLOTS: '最初の投票者を守るため、指定の票数が集まるまで非表示になります。その後は票が入るたびに結果が動くので、後から投票する人はそれでも特定されうります。',
      AFTER_CLOSING: '投票を終了すると表示されます。それまでは、全員に何人が投票したかだけが見えます。',
    },
    ballotsBeforeResults: '結果を表示するまでの票数',

    optionOrder: '選択肢の順序',
    orders: {
      ALPHABETICAL: '五十音・A〜Z順',
      SHUFFLED: 'シャッフル',
      AS_WRITTEN: '入力した順',
    },
    orderHints: {
      ALPHABETICAL: 'A から Z の順で、数字は値の順です（2 は 10 より前）。日付は 2026-10-24 のように年から書いてください。',
      SHUFFLED: '投票者ごと、訪問ごとに新しい順序になり、位置によって得をする選択肢がなくなります。',
      AS_WRITTEN: 'あなたが決めた順序です。上位の位置は支持を集めやすいため、結果を左右しようとしているように見えることがあります。',
    },

    deletedAfter: (days: number) => `投票は作成から ${days} 日後に、票とともに削除されます。`,
    notForElections: <>
      <AppName /> は日常の決めごと向けで、公的な投票や拘束力のある投票向けではありません。{' '}
      <Link to="/privacy">プライバシーと制限</Link>
    </>,
    noNewPolls: 'このサーバーは現在、新しい投票を受け付けていません。',
    creating: '作成中…',
    create: '質問を投稿',

    problems: {
      titleMissing: '投票にタイトルを付けてください。',
      titleTooLong: (max: number) => `タイトルは ${max} 文字以内にしてください。`,
      titleInvisible: 'タイトルには見える文字しか使えません。',
      tooFewOptions: '選択肢を 2 つ以上追加してください。',
      tooManyOptions: (max: number) => `1 つの投票に使える選択肢は最大 ${max} 件です。`,
      optionTooLong: (max: number) => `選択肢は ${max} 文字以内にしてください。`,
      optionInvisible: '選択肢には見える文字しか使えません。',
      optionTwice: (option: string) => `「${option}」が 2 回載っています。選択肢はそれぞれ異なる必要があります。`,
      resultsAfterBallots: (min: number) => `${min} 以上の整数の票数を指定してください。`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'この投票を引き継いでいます…',
    deleted: 'この投票は削除されました',
    deletedText: '削除され、結果も一緒に消えました。',
    notFound: '投票が見つかりません',
    notFoundText: 'リンクが途中で切れているか、投票が削除された可能性があります。',
    notLoaded: '投票を読み込めませんでした',
    loadingPoll: '投票を読み込み中…',
    byInvitation: '招待制',
    optionOrder: { SHUFFLED: '選択肢はシャッフル', ALPHABETICAL: '選択肢は並べ替え済み', AS_WRITTEN: '選択肢は入力順' },
    closed: '終了',
    keepTitle: '管理リンクを保管してください',
    keepText: '別のブラウザーやデバイスで開くと、ここではなくそちらからこの投票を管理できます。終了、削除、招待ができます。'
      + '他の人には教えないでください。持っている人は同じことができます。',
    readyToInvite: <><strong>投票の準備ができました。</strong>下で人を招待してください。一人ひとりに専用リンクが届きます。</>,
    readyToShare: <><strong>投票の準備ができました。</strong>リンクを共有して票を集めましょう。</>,
    closedAgo: (ago: string) => `投票は${ago}に終了しました。これが最終結果です。`,
    deletedOn: (date: string) => `この投票と票は ${date} に削除されます。`,
    lastPoll: (wait: string) => `今回が当面の最後の投票です。${wait}後にまた作成できます。`,
    pollsLeft: (count: number, wait: string) => `今後 ${wait}のあいだに、あと ${number(count)} 件の投票を作成できます。`,
    fairShare: (perDay: number) => `すべての人に公平であるよう、1 つの接続で 1 日に作成できる投票は ${perDay} 件です。`,
  },

  ballot: {
    yourBallot: 'あなたの投票',
    withdraw: '取り下げる',
    submit: '投票を提出',
    rateEveryOption: 'すべての選択肢を評価すると提出できます',
    submitting: '提出中…',
    majorityJudgmentLive: 'すべての選択肢に評価を付けてください。評価していない選択肢は「悪い」として数えられます。',
    majorityJudgmentEnvelope: 'すべての選択肢に評価を付けてから、投票を提出してください。',
    approval: '満足できる選択肢をすべてチェックしてください。',
    invited: 'あなたの招待は 1 票分で、変更できるのはこのブラウザーだけです。招待した人には使用済みであることだけが見え、'
      + '何を選んだかは見えません。',
    counted: '投票は集計されました。投票が終了するまで、このブラウザーから変更できます。',
    notVoted: 'まだ投票していません。',
    hide: '投票を隠す',
    hidden: '投票は集計され、ここでは隠されています。この画面を見ている人には、あなたの選択は見えません。',
    change: '投票を変更',
    invitationUsed: 'この招待はすでに別のブラウザーまたは別のデバイスで使われました。その票は、そちらでしか変更できません。',
    invitationNotValid: 'この招待リンクは無効です。招待した人に新しいリンクを頼んでください。',
    notInvited: 'この投票に参加できるのは招待された人だけです。招待された場合は、招待状のリンクを開いてください。',
    yourName: 'お名前',
    namePlaceholder: '匿名',
    namesGiven: '任意です。入力された名前は全員に見えますが、選択は見えません。',
    namesLive: 'リアルタイムの結果から、誰が何を選んだかが推測されることがあります。',
    notRatedYet: '未評価',
    chooseAMention: '評価を選択…',
    optionsYouApprove: '承認する選択肢',
  },

  results: {
    heading: '結果',
    ballots: (count: number) => `${number(count)} 票`,
    noBallotsYet: 'まだ票がありません。票が届くにつれて結果が埋まっていきます。',
    keptUntilBallots: (count: number) => `${count} 票が集まると結果が表示されます。最初の投票者の選択を守るためです。`,
    keptUntilYouClose: '投票を終了すると結果が表示されます。',
    keptUntilClosed: '投票が終了すると結果が表示されます。',
    download: '結果をダウンロード',
    final: '最終',
    connecting: '接続中…',
    live: 'リアルタイム',
    reconnecting: '再接続中…',
    whoVoted: '投票した人',
    anonymousVoters: (count: number) => `匿名の投票者 ${number(count)} 人`,
    andAnonymousVoters: (count: number) => `ほか匿名の投票者 ${number(count)} 人`,
    moreVoters: (count: number) => `ほか ${number(count)} 人`,
    rank: (rank: number) => `${rank} 位`,
    approvals: (count: number) => `承認 ${number(count)} 件`,
    noBallotsFor: (option: string) => `${option}：まだ票がありません`,
    profile: (option: string, mentions: string) => `${option}：${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}：${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: '同順位',
    majorityMention: '多数評価：',
    gmjScore: 'GMJ スコア：',
    gmjScoreTitle: (score: string) => `GMJ の通常判定スコア：${score}。多数評価が同じ選択肢の間で順位を決めます。`,
    orBetter: (share: string, mention: string) => `${share} が「${mention}」以上と回答`,
  },

  owner: {
    manage: '投票を管理',
    adminLink: '投票の管理リンク',
    adminLinkHint: 'あなたの管理リンクです。別のブラウザーやデバイスで開くと、ここではなくそちらから投票を管理できます。他の人には教えないでください。',
    showAdminLink: '管理リンクを表示',
    onlyThisBrowser: 'この投票を途中で終了または削除できるのは、このブラウザーだけです。',
    close: '投票を終了',
    delete: '投票を削除',
    closeQuestion: '投票を完全に終了しますか？ 誰ももう投票も変更もできなくなり、全員に最終結果が表示されます。',
    keepOpen: '開いたままにする',
    closeForGood: '完全に終了',
    deleteQuestion: 'この投票と票を完全に削除しますか？ 見ている人全員に、消える様子が見えます。',
    keep: '残す',
    deleteForGood: '完全に削除',
    deletedToast: '投票を削除しました。',
  },

  invitations: {
    heading: '招待',
    count: (count: number) => `招待 ${number(count)} 件`,
    used: (used: number, count: number) => `${number(count)} 件中 ${number(used)} 件が使用済み`,
    hint: '招待した人だけが、それぞれ 1 票だけ有効な専用リンクで投票できます。どのリンクが使われたかはわかりますが、誰が何を選んだかはわかりません。あなた自身は招待なしで投票できます。',
    invite: '招待する',
    inviting: '招待中…',
    inviteSomeone: '誰かを招待',
    namePlaceholder: '名前またはニックネーム（任意）',
    loading: '招待を読み込み中…',
    showMore: 'さらに表示',
    newestShown: (count: number) => `新しい ${number(count)} 件を表示しています。`,
    invitationFor: (label: string) => `${label} への招待`,
    invitationNumber: (number: number) => `招待 ${number}`,
    shareHint: 'この人専用です。1 票分で、変更できるのは投票に使ったブラウザーだけです。',
    linkLabel: '招待リンク',
    message: (title: string) => `「${title}」の投票に招待されました。このリンクはあなた専用です。`,
    isUsed: '使用済み',
    notUsedYet: '未使用',
    share: (name: string) => `${name} へのリンクを共有`,
    takeBack: (name: string) => `${name} へのリンクを取り消す`,
    takeBackQuestion: 'この招待を取り消しますか？ リンクは使えなくなります。',
    keep: '残す',
    takeItBack: '取り消す',
  },

  share: {
    share: '共有',
    title: 'この投票を共有',
    anyone: 'コードまたはリンクを知っていれば誰でも投票できます。',
    unlisted: 'この投票は、ほかのどこにも一覧表示されません。',
    linkLabel: '投票へのリンク',
    joinCode: '参加コード',
    toEnterAt: (host: string) => `${host} で入力`,
    copy: 'コピー',
    copied: 'コピーしました',
    copyCode: '参加コードをコピー',
    qrCode: (url: string) => `${url} の QR コード`,
    throughAnApp: 'アプリで共有',
    byEmail: 'メールで送る',
    message: (title: string) => `「${title}」に投票してください`,
    orCode: (code: string, host: string) => `または ${host} でコード ${code} を入力してください。`,
  },

  statistics: {
    title: '統計 · super-vote',
    heading: <>世界の <AppName /></>,
    lead: '投票・票・訪問者の数を、時期と場所別に。',
    show: '表示',
    measures: {
      voters: {
        label: '訪問者', plural: '訪問者',
        noun: () => '人の訪問者',
        count: (count: number) => `訪問者 ${number(count)} 人`,
      },
      polls: {
        label: '投票', plural: '投票',
        noun: () => '件の投票',
        count: (count: number) => `投票 ${number(count)} 件`,
      },
      ballots: {
        label: '票', plural: '票',
        noun: () => '票',
        count: (count: number) => `${number(count)} 票`,
      },
    },
    totals: {
      polls: '作成された投票',
      openPolls: '現在開いている',
      ballots: '投じられた票',
      voters: '訪問者',
    },
    lastDays: '過去 90 日間',
    where: '場所',
    byRegion: '地域別',
    noRegion: '地域はまだありません。',
    tapADot: '点をタップすると数字が表示されます。',
    unplaced: (visitors: string, polls: string, ballots: string) => 'どの地域にも表示されません。タイムゾーンがないか、表示するのに十分な人数がいないためです：'
      + `${visitors}、${polls}、${ballots}。`,
    howCounted: '数え方',
    howCountedText: <>
      訪問者とは、<AppName /> に来たブラウザーまたはアプリです。1 人が 2 台のデバイスで来ると 2 回数えられます。票は、投票者が何度変更しても 1 回だけ数えられます。
    </>,
    places: (updated: string) => '場所は、お使いのデバイスに設定されたタイムゾーンから決まり、住所は使われません。保存されるのは合計だけです。'
      + '場所は、そこから 3 人の訪問者が来ると表示されます。数字は 1 時間ごとに更新され、'
      + '1 つの投票の票が届くたびにそれと結びつけられることはありません。'
      + `最終更新：${updated}。`,
    sources: <>
      各点は、タイムゾーンの名前の由来となった都市で、そのゾーンにいる全員を表します。日付は UTC です。陸地は{' '}
      <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>、タイムゾーンは{' '}
      <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA データベース</a>によります。
    </>,
    onDay: (count: string, noun: string, day: string) => <>{day}：<strong>{count}</strong> {noun}</>,
    overLastDays: (counts: string, days: number) => `過去 ${days} 日間で ${counts}`,
    busiest: (day: string, count: string) => `、最多は ${day}：${count}。`,
    topLine: (count: string) => `最大値：${count}`,
    regionAndCity: '地域と都市',
    map: (what: string) => `タイムゾーン別の${what}の世界地図。下の表に同じ数字が一覧されています。`,
    zoomIn: '拡大',
    zoomOut: '縮小',
    nothingYet: '表示できる場所はまだありません。',
    fewer: 'より少ない',
    upTo: (count: string) => `最大 ${count}`,
    pollPlaces: '票の出どころ',
    pollPlacesNone: '地域は、そこから 3 票が届くと表示されます。',
    pollPlacesHint: '各投票者のタイムゾーンによるもので、住所は使われません。場所は、そこから 3 票が届くと表示され、数字は 1 時間ごとに更新されます。',
    regions: {
      Africa: 'アフリカ',
      America: '南北アメリカ',
      Antarctica: '南極',
      Arctic: '北極',
      Asia: 'アジア',
      Atlantic: '大西洋の島々',
      Australia: 'オーストラリア',
      Europe: 'ヨーロッパ',
      Indian: 'インド洋',
      Pacific: '太平洋',
    } as Record<string, string>,
  },

  about: {
    title: '概要 · super-vote',
    heading: <><AppName /> について</>,
    lead: (days: number) => <>
      グループがみんなで決めるための、無料でオープンソースの手段です。どこで食べるか、どこへ行くか、何を選ぶか。
      アカウントも広告も追跡もありません。投票は作成から {days} 日後に削除されます。
    </>,
    howDecided: '結果の決め方',
    howDecidedText: <>
      1 つだけ選ぶ方式では、人々の考えの大半が捨てられてしまいます。似た選択肢は支持者を分け合い、ほとんどの人が
      悪くないと思う選択肢が、半数が嫌う選択肢に負けることもあります。<AppName /> は 2 つの方法で、より多くを尋ねます。
    </>,
    majorityJudgment: '多数判定',
    majorityJudgmentText: <>
      投票者全員が、すべての選択肢を<em>非常に優れている</em>から<em>悪い</em>まで評価します。選択肢の
      <strong>多数評価</strong>とは、投票者の過半数がそれ以上の評価を付けた最良の評価、つまり中央値です。
      多数評価が最も良い選択肢が勝ちます。複数が同じ場合は、<strong>GMJ スコア</strong>で決めます。これは、評価がその
      多数評価の上下にどれだけ偏っているかを測ります。それでも並んだ選択肢は<em>同順位</em>と表示され、
      隠されたルールで 1 つを選ぶことはありません。
    </>,
    approval: '承認投票',
    approvalText: '投票者全員が、満足できる選択肢をすべてチェックします。最も多くの投票者に承認された選択肢が勝ちます。手早く済み、複数の選択肢を支持しても不利になりません。',
    science: '背景にある科学',
    scienceText: '完璧な投票ルールはありません。コンドルセは 1785 年に、グループが A を B より、B を C より、C を A より好む可能性があること、'
      + 'そして妥当なルールはどれも操作されうることに気づきました。順位を付けるのではなく評価することで、その多くは避けられます。'
      + 'ワインの審査員やフィギュアスケートの審判がよく知っていることです。',
    notes: {
      pnas2007: '多数判定を紹介する論文：評価し、中央値の評価で順位を付けます。',
      book2011: '書籍：理論、その性質、実際の選挙や審査員団。',
      judge2014: '評価がなぜ順位付けのパラドックスを避け、操作に強いのか。',
      fabre2021: <><AppName /> が、同じ多数評価の間の同点を決めるために使う「通常判定」スコア。</>,
      brams1978: '受け入れられるすべての選択肢を承認することの擁護。',
      laslier2009: '承認投票で人々がどのように戦略的に投票し、その結果どうなるか。',
      gibbard1973: 'サタースウェイトと共に：妥当な投票ルールはどれも操作されうる。問題はその程度です。',
      satterthwaite1975: '独立に得られた、同じ結果。',
    },
    whoMakesIt: '作っている人',
    whoMakesItText: <>
      <AppName /> はケベックの 1 人が空き時間に作っており、誰でも無料で使えます。コードは公開されています。
      票がどう数えられるかを誰でも読み、自分のコピーを動かし、変更を提案できます。
    </>,
    seeTheCode: 'GitHub でソースコードを見る',
  },

  privacy: {
    title: 'プライバシーと制限 · super-vote',
    heading: 'プライバシーと制限',
    lead: <>
      <AppName /> は、あなたが何を選んだかを誰にも知られないように作られています。ここでは、何を保持するか、誰が何を見られるか、
      まだできないことを説明します。
    </>,

    forWhat: '用途',
    forWhatText: 'お互いを信頼できる人たち、つまり友人、家族、チーム、クラス、団体の間で、みんなで決めるためのものです。'
      + '選挙や、法的・金銭的・公的な結果を伴う投票には向きません。そうした投票では、投票者全員の本人確認と 1 回だけの集計、'
      + '誰でも検証できる結果が必要で、super-vote にはまだそれを約束できません。',

    kept: '保持するものと期間',
    keptItems: (days: number) => [
      `投票：質問、選択肢、設定。削除されるまで、遅くとも作成から ${days} 日後まで。作成者はそれより早く削除できます。`,
      'あなたの票：あなたが誰かを示さないキーで保存され、投票とともに削除されます。投票が終了するまで取り下げられます。',
      '名前を表示する投票であなたが入力した名前：両者を結びつけるものがないよう、票とは別に保存されます。',
      '上記の投票・票・名前のコピー：事故から復旧するため毎晩作成し、7 日間保持します。削除したものは 1 週間以内にそこからも消えます。',
      `Cookie 内のランダムな識別子：このブラウザーが自分の票を変更し、自分の投票を管理できるようにするためのもので、最後の投票または投票作成から ${days} 日間、`
        + '投票が続くかぎり保持します。これが唯一の Cookie です。広告も分析も追跡もありません。',
      'お使いのデバイスのタイムゾーン（たとえば Europe/Paris）：合計としてのみ統計に加えられます。住所は決して使いません。',
      'お使いのネットワークのアドレス：各ネットワークが作成できる投票の数を制限するため、最長 1 日間メモリ上にのみ保持します。書き込まれることはありません。',
      'あなたの設定と最後に入力した名前：このブラウザー内にのみ保存されます。',
      'サーバーが保持するすべては、EU が個人データを十分に保護していると認めているカナダの、モントリオールにある 1 台のマシンにあります。',
    ],

    whoSees: '誰が何を見られるか',
    whoSeesItems: [
      '投票の参加者全員が、作成者が表示を選んだ場合は合計としての結果と、投票者が入力することにした名前を見られます。',
      '投票の作成者も同じものに加え、どの招待が使われたかを見られます。誰が何を選んだかは決して見えません。',
      '誰にもあなたの票は見えません。あなた自身の画面でも、集計後は最初は隠されています。',
      'サーバーを運用する人は、リクエストが起きるたびに見られます。保存されるものは誰が何を選んだかを示しませんが、super-vote は動作中のサーバーから票を隠しません。運用する人は見ないと信頼されています。',
    ],

    limits: '知っておくべき制限',
    limitsItems: [
      '招待がなければ、1 人が異なるブラウザーやデバイスから何度も投票できます。super-vote は善意を前提としており、不正があれば票の数に表れます。一人ひとりを 1 回だけ数えるには、招待してください。',
      'あなたの票と投票は、このブラウザーのものです。別のデバイスから、またはデータを消去した後は、変更も管理もできなくなり、取り戻すためのアカウントもありません。',
      'リアルタイムの結果は票が届くたびに動きます。少人数のグループでは、見ている人が誰が何を選んだかを推測できます。投票の作成者は結果をいつ表示するかを選び、警告を受けます。',
      '集計を独立して確認することはできません。サーバーを信頼することになりますが、そのコードは誰でも読めるよう公開されています。',
      'super-vote は無料で、小さなサーバーで動いています。ときどき利用できないことがあります。急ぎの用事には頼らないでください。',
    ],

    rights: 'あなたのデータ、あなたの選択',
    rightsText: 'あなたの票はあなたと結びついていないため、super-vote があなたの代わりに見つけることはできません。このブラウザーから、票を取り下げるか、自分で作成した投票を削除してください。'
      + 'このブラウザーの super-vote のデータを消去すると、Cookie と設定が削除されます。',
    contact: <>
      質問、データに関するご依頼、報告したい投票：{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">GitHub でご連絡ください</a>。
      セキュリティ上の弱点については、{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">セキュリティポリシー</a>をご覧ください。
    </>,
    openSource: <>
      ここに書かれたことを鵜呑みにする必要はありません。集計や票の保護を含む <AppName /> のコードは、
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">誰でも読めるよう公開されています</a>。
    </>,
  },

  legal: {
    title: '法的情報 · super-vote',
    heading: '法的情報',
    publisher: '発行者',
    publisherText: <>
      <AppName /> は、カナダのケベックにいる個人が、営利目的なしに公開しています。氏名と住所はここには記載されていません。ホスティング事業者が把握しています。
    </>,
    law: '準拠法',
    lawText: <>
      <AppName /> はケベックから、ケベック州とカナダの法律に基づいて公開されています。世界中の人に開かれており、投票を作成する人や投票する人は、
      その人がいる場所の法律にも従います。<AppName /> があなたについて何を保持し、なぜ保持するかは、どこにいても全員に共通です：{' '}
      <Link to="/privacy">プライバシーと制限</Link>。
    </>,
    host: 'ホスティング事業者',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'カナダ',
    ],
    hostPhone: (phone: ReactNode) => <>電話：{phone}</>,
    report: '投票の報告',
    reportText: <>
      投票は、それを作成した人が書いています。法律に違反する投票を、そのタイトル、選択肢、または投票者の名前について報告するには：{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">GitHub でご連絡ください</a>。
      すべての報告は速やかに確認され、違法なものは削除されます。
    </>,
  },
};
