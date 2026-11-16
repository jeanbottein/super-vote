/**
 * Everything the web app says, in Korean: en.tsx, translated, in the polite
 * 합니다/해요 style. A poll is a «투표», a ballot a «표». Korean has no plural
 * forms.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('ko', count);

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return `${number(count)}${unit === 'minute' ? '분' : '시간'}`;
}

export const ko: Messages = {
  number,
  percent: (share: number) => formatPercent('ko', share),
  decimal: (value: number, digits: number) => formatDecimal('ko', value, digits),
  date: (isoDate: string) => formatDate('ko', isoDate),
  moment: (isoDate: string) => formatMoment('ko', isoDate),
  day: (day: string) => formatUtcDay('ko', day),
  timeAgo: (isoDate: string) => timeAgo('ko', isoDate) ?? '방금',
  waitUntil: inWords,

  loading: '불러오는 중…',
  backHome: '홈으로 돌아가기',
  tryAgain: '다시 시도',
  close: '닫기',
  dismiss: '숨기기',

  errors: {
    unexpected: '문제가 발생했습니다. 다시 시도해 주세요.',
    unreachable: '서버에 연결할 수 없습니다. 연결을 확인하고 다시 시도해 주세요.',
    failed: (status: number) => `문제가 발생했습니다(오류 ${status}). 다시 시도해 주세요.`,
  },

  problems: {
    'unknown-voter': 'super-vote가 알지 못하는 브라우저입니다. 페이지를 새로 고침하여 처음부터 다시 시작해 주세요.',
    'not-poll-creator': '이 투표를 만든 사람만 할 수 있습니다.',
    'not-invited': '이 투표에는 초대받은 사람만 참여할 수 있습니다. 초대를 받았다면 초대장의 링크를 열어 주세요.',
    'not-admin-link': '이 관리 링크는 이 투표의 것이 아닙니다. 끝까지 복사되었는지 확인해 주세요.',
    'handover-unavailable': '이 링크로는 투표를 넘겨줄 수 없습니다. 이미 사용되었습니다.',
    'cross-site': '이 요청은 다른 웹사이트에서 왔기 때문에 거부되었습니다. super-vote를 직접 열어 주세요.',
    'poll-not-found': '이 링크나 코드의 투표가 없습니다. 잘못 입력했거나 투표가 삭제되었을 수 있습니다.',
    'poll-closed': '이 투표는 마감되어 더 이상 표를 받지 않습니다.',
    'invitation-used': '누군가 이 초대로 이미 다른 브라우저나 다른 기기에서 투표했습니다.',
    'collision': '이 변경이 같은 순간에 이루어진 다른 변경과 충돌했습니다. 다시 시도해 주세요.',
    'too-many-polls': (wait: string) => '이 연결은 오늘 만들 수 있는 투표를 모두 만들었습니다. 모두에게 공평하도록, '
      + `연결마다 하루에 만들 수 있는 수는 제한되어 있습니다. ${wait} 후에 더 만들 수 있습니다.`,
    'too-many-wrong-codes': (wait: string) => '이 연결에서 잘못된 코드가 너무 많이 입력되었습니다. 투표를 추측으로부터 보호하기 위해 '
      + `앞으로 ${wait} 동안 이 연결의 코드를 거부합니다. 링크는 계속 작동합니다.`,
    'server-error': '저희 쪽에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },

  mentions: {
    Excellent: '훌륭함',
    VeryGood: '매우 좋음',
    Good: '좋음',
    Fair: '괜찮음',
    Passable: '그럭저럭',
    Inadequate: '부족함',
    Bad: '나쁨',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: '다수 판정',
    APPROVAL: '승인 투표',
  },

  visibilities: {
    PUBLIC: '공개',
    UNLISTED: '비공개',
  },

  app: {
    home: '홈',
    settings: '설정',
    footer: <><AppName />는 무료 오픈 소스입니다.</>,
    footerLinks: 'super-vote 소개',
    about: '소개와 그 뒤의 과학',
    privacy: '개인정보 보호와 한계',
    legal: '법적 고지',
    statistics: '통계',
    sourceCode: '소스 코드',
    notFound: '페이지를 찾을 수 없습니다',
    nothingHere: '이 주소에는 아무것도 없습니다.',
  },

  settings: {
    language: '언어',
    appearance: '화면 모드',
    light: '라이트',
    automatic: '자동',
    dark: '다크',
    mentionColours: '평가 색상',
    greenToRed: '초록에서 빨강으로',
    shadesOfGrey: '회색 음영',
    shadesOfGreyHint: '회색 음영은 어떤 색을 보든 똑같이 읽힙니다. 밝을수록 좋은 평가입니다.',
    majorityJudgmentBallot: '다수 판정 투표용지',
    colourScale: '색상 척도',
    dropdowns: '드롭다운',
    castingYourBallot: '투표하는 방식',
    live: '즉시',
    envelope: '봉투',
    liveHint: '바꾸는 순간 바로 집계됩니다.',
    envelopeHint: '투표용지를 작성한 다음 한 번에 제출합니다.',
  },

  home: {
    title: 'super-vote · 함께 결정하세요',
    lead: '수학이 말합니다. 이 방식이 더 공정하다고.',
    createQuestion: '투표를 만들어야 하나요?',
    createPoll: '함께 결정해요!',
    yourPolls: '함께 결정하기…',
    publicPolls: '공개 투표',
    noPublicPolls: '아직 공개 투표가 없습니다.',
    public: '공개',
    closed: '마감',

    howItWorks: '이용 방법',
    steps: [
      { title: '질문하기', text: '질문과 선택지를 정합니다.' },
      { title: '공유하기', text: '링크, QR 코드 또는 코드로.' },
      { title: '결정하기', text: '모두가 평가하고, 결과가 실시간으로 들어옵니다.' },
    ],

    agent: {
      title: 'AI에도 준비됨',
      text: '웹을 탐색할 수 있는 어시스턴트에 여러분의 질문과 함께 붙여 넣으세요.',
      prompt: (site: string, guide: string) => `${site}를 사용해 우리 팀을 위한 투표를 만들어 줘(에이전트용 안내: `
        + `${guide}). 질문: “워크숍은 어디서 할까요?” 선택지: 리스본, 베를린, `
        + '바르셀로나. 다수 판정을 사용하고, 내가 투표를 마감할 때까지 결과를 숨겨 줘. '
        + '투표를 나에게 넘겨 준 다음, 팀과 공유할 링크를 알려 줘.',
      copy: '문구 복사',
      copied: '문구를 복사했습니다',
      caption: '링크 두 개로 답합니다. 첫 번째를 열어 투표를 내 것으로 만들고, 두 번째를 그룹에 보내세요.',
    },

    systems: {
      title: '결정하는 두 가지 방법',
      majorityJudgment: {
        title: '다수 판정',
        text: '모든 선택지를 훌륭함부터 나쁨까지 평가합니다. 가장 좋은 다수 평가를 받은 선택지가 이깁니다.',
      },
      approval: {
        title: '승인',
        text: '받아들일 수 있는 선택지를 모두 체크합니다. 가장 많이 체크된 선택지가 이깁니다.',
      },
    },

    compare: {
      title: '대부분의 공식 선거보다 공정합니다',
      text: '대부분의 선거는 이름 하나만 적게 합니다. 비슷한 후보들은 지지자를 나눠 갖고, 대다수가 거부하는 후보가 이길 수도 있습니다. '
        + '미셸 발린스키와 리다 라라키의 연구에서 나온 다수 판정은 '
        + '모든 사람이 각 선택지를 어떻게 생각하는지를 측정합니다.',
      science: '그 뒤의 과학',
      single: '하나만 선택',
      singleNote: '대부분의 선거',
      approval: '승인',
      majorityJudgment: '다수 판정',
      criteria: {
        nuance: '선택지마다 생각을 표현할 수 있음',
        splitting: '비슷한 선택지가 표를 나누지 않음',
        lesserEvil: '차악에게 투표하지 않아도 됨',
        tactics: '조작하기 어려움',
        quick: '빠르게 작성 가능',
        familiar: '익숙함',
      },
      marks: { yes: '예', partly: '부분적', no: '아니요' },
      caption: <><AppName />는 승인 투표와 다수 판정을 제공합니다. 완벽한 투표 규칙은 없지만, 다른 것보다 훨씬 공정한 규칙은 있습니다.</>,
    },

    supportTitle: '무료, 오픈 소스, 광고 없음',
    supportText: '여러분은 상품이 아닙니다. 목표는 더 나은 투표 제도를 알리는 것입니다. 한 사람이 여가 시간에 만들었습니다. '
      + '여러분의 그룹이 결정하는 데 도움이 되었다면, 여러분도 이 서비스를 도와줄 수 있습니다.',

    limitsTitle: '알아 두세요',
    limits: {
      everyday: <><strong>일상적인 결정용이며</strong> 공식 선거용이 아닙니다. 계정이 없어서 누군가 다른 브라우저에서 다시 투표할 수 있습니다. 초대를 사용하면 한 사람을 한 번만 셉니다.</>,
      private: <><strong>비공개이지만 서버에는 숨겨지지 않습니다.</strong> 다른 누구도 여러분의 표를 볼 수 없으며, 보관된 표는 누가 던졌는지 알려 주지 않습니다.</>,
      browser: (days: number) => <><strong>이 브라우저에 묶입니다.</strong> 쿠키 하나를 통해, 마지막 투표나 투표 생성 후 {days}일 동안 유지됩니다.
        광고도 추적도 없습니다.</>,
      deleted: (days: number) => <><strong>{days}일 후 삭제됩니다.</strong> 투표와 표 모두 마찬가지입니다.</>,
      disclaimer: <><strong>보증하지 않습니다.</strong> <AppName />는 더 나은 투표 방식을 알립니다. 한 사람이
        보안, 개인정보 보호, 성능, 구조, 코드 품질에 최선을 다해 만들었지만, 인증이나 감사, 독립적인 검토를 받지 않았습니다.
        결과가 정확하다거나 그룹의 의사를 정확히 반영한다는 보장은 없습니다. 그러려면 인증, 기술 부분에 대한 전문가 검토,
        지속적인 지원이 필요한데, 후원자와 전문가 없이 한 사람이 제공할 수 있는 것이 아닙니다.</>,
    },
    limitsLink: '개인정보 보호와 한계에 대한 모든 것',
  },
  join: {
    label: '코드가 있나요?',
    typeTheCode: '받은 코드를 입력하세요.',
    notACode: '코드는 K7M-4QX처럼 문자와 숫자 여섯 개로 이루어집니다.',
    joining: '참여하는 중…',
    join: '투표하기!',
  },

  newPoll: {
    title: '함께 결정하기 · super-vote',
    heading: '함께 결정하기',
    question: '질문',
    questionPlaceholder: '금요일에 어디서 먹을까요?',
    options: '선택지',
    option: (row: number) => `선택지 ${row}`,
    remove: (option: string) => `${option} 삭제`,
    optionsHint: (max: number) => `선택지는 최대 ${max}개입니다. 입력하면 새 줄이 나타납니다.`,

    votingSystem: '투표 방식',
    systems: {
      MAJORITY_JUDGMENT: '다수 판정',
      APPROVAL: '승인',
    },
    systemHints: {
      MAJORITY_JUDGMENT: '투표자가 모든 선택지를 훌륭함부터 나쁨까지 평가합니다. 과반수가 가장 높게 평가한 선택지가 이깁니다. '
        + '세밀하고 조작하기 어렵습니다.',
      APPROVAL: '투표자가 받아들일 수 있는 선택지를 모두 체크합니다. 가장 많이 승인된 선택지가 이깁니다. 빠르고 간단합니다.',
    },

    whoCanFindIt: '찾을 수 있는 사람',
    visibilityHints: {
      PUBLIC: '홈에 표시되어 누구나 찾을 수 있습니다.',
      UNLISTED: '어디에도 표시되지 않습니다. 링크나 코드를 공유한 사람만 찾을 수 있습니다.',
    },

    whoCanVote: '투표할 수 있는 사람',
    anyone: '누구나',
    invitedOnly: '초대받은 사람만',
    anyoneHint: <>
      링크나 코드가 있는 누구나. 마음먹은 사람은 다른 브라우저에서 다시 투표할 수 있습니다. 한 사람을 한 번만 세려면 초대하세요.
    </>,
    invitedHint: '모두가 한 표만 유효한 자신만의 링크를 받습니다. 어떤 링크가 사용되었는지는 볼 수 있지만, 누가 무엇을 선택했는지는 볼 수 없습니다.',

    whoVoted: '투표한 사람',
    anonymous: '익명',
    showNames: '이름 표시',
    anonymousHint: '누가 투표했는지는 아무도 볼 수 없고, 몇 명이 투표했는지만 볼 수 있습니다.',
    showNamesHint: '투표자는 이름을 남길 수 있으며, 결과 아래에 표시됩니다. 누가 무엇을 선택했는지는 아무도 볼 수 없습니다.',

    results: '결과',
    resultsChoices: {
      LIVE: '실시간',
      AFTER_BALLOTS: '지연',
      AFTER_CLOSING: '마감 시',
    },
    resultsHints: {
      LIVE: '주의: 표가 들어올 때마다 결과가 움직이는 것을 모두가 봅니다. 소규모 그룹에서는 누가 무엇을 선택했는지 드러납니다.',
      AFTER_BALLOTS: '첫 투표자를 보호하기 위해 그만큼의 표가 모일 때까지 숨겨집니다. 그 후에는 표가 들어올 때마다 결과가 움직이므로, 나중에 투표하는 사람은 여전히 드러날 수 있습니다.',
      AFTER_CLOSING: '투표를 마감하면 표시됩니다. 그때까지는 모두가 몇 명이 투표했는지만 봅니다.',
    },
    ballotsBeforeResults: '결과를 보여 주기 전까지 필요한 표 수',

    optionOrder: '선택지 순서',
    orders: {
      ALPHABETICAL: '가나다·A~Z순',
      SHUFFLED: '무작위',
      AS_WRITTEN: '입력한 순서',
    },
    orderHints: {
      ALPHABETICAL: 'A에서 Z까지, 숫자는 값 순서입니다(2가 10보다 앞). 날짜는 2026-10-24처럼 연도부터 쓰세요.',
      SHUFFLED: '투표자마다, 방문할 때마다 새로운 순서로 보여 주어 위치 때문에 이득을 보는 선택지가 없게 합니다.',
      AS_WRITTEN: '직접 정한 순서입니다. 앞쪽 순서는 더 많은 지지를 받기 때문에 결과에 영향을 주려는 시도로 보일 수 있습니다.',
    },

    deletedAfter: (days: number) => `투표는 만든 지 ${days}일 후 표와 함께 삭제됩니다.`,
    notForElections: <>
      <AppName />는 일상적인 결정용이며, 공식적이거나 구속력 있는 투표용이 아닙니다.{' '}
      <Link to="/privacy">개인정보 보호와 한계</Link>
    </>,
    noNewPolls: '이 서버는 현재 새 투표를 받지 않습니다.',
    creating: '만드는 중…',
    create: '질문하기',

    problems: {
      titleMissing: '투표에 제목을 붙여 주세요.',
      titleTooLong: (max: number) => `제목은 최대 ${max}자까지 가능합니다.`,
      titleInvisible: '제목에는 눈에 보이는 문자만 사용할 수 있습니다.',
      tooFewOptions: '선택지를 두 개 이상 추가해 주세요.',
      tooManyOptions: (max: number) => `투표에는 선택지를 최대 ${max}개까지 둘 수 있습니다.`,
      optionTooLong: (max: number) => `선택지는 최대 ${max}자까지 가능합니다.`,
      optionInvisible: '선택지에는 눈에 보이는 문자만 사용할 수 있습니다.',
      optionTwice: (option: string) => `“${option}”이(가) 두 번 나열되었습니다. 선택지는 서로 달라야 합니다.`,
      resultsAfterBallots: (min: number) => `${min} 이상의 정수로 표 수를 선택해 주세요.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: '이 투표를 넘겨받는 중…',
    deleted: '이 투표는 삭제되었습니다',
    deletedText: '삭제되었으며, 결과도 함께 사라졌습니다.',
    notFound: '투표를 찾을 수 없습니다',
    notFoundText: '링크가 불완전하거나 투표가 삭제되었을 수 있습니다.',
    notLoaded: '투표를 불러올 수 없습니다',
    loadingPoll: '투표를 불러오는 중…',
    byInvitation: '초대 전용',
    optionOrder: { SHUFFLED: '선택지 무작위', ALPHABETICAL: '선택지 정렬됨', AS_WRITTEN: '선택지 입력 순서' },
    closed: '마감',
    keepTitle: '관리 링크를 보관하세요',
    keepText: '다른 브라우저나 기기에서 열면 여기가 아닌 그곳에서 이 투표를 관리할 수 있습니다. 마감, 삭제, 사람 초대가 가능합니다. '
      + '혼자만 간직하세요. 링크를 가진 사람은 같은 일을 할 수 있습니다.',
    readyToInvite: <><strong>투표가 준비되었습니다.</strong> 아래에서 사람들을 초대하세요. 모두가 자신만의 링크를 받습니다.</>,
    readyToShare: <><strong>투표가 준비되었습니다.</strong> 링크를 공유해 표를 모으세요.</>,
    closedAgo: (ago: string) => `투표가 ${ago} 마감되었습니다. 최종 결과입니다.`,
    deletedOn: (date: string) => `이 투표와 표는 ${date}에 삭제됩니다.`,
    lastPoll: (wait: string) => `지금으로서는 마지막 투표였습니다. ${wait} 후에 더 만들 수 있습니다.`,
    pollsLeft: (count: number, wait: string) => `앞으로 ${wait} 동안 투표를 ${number(count)}개 더 만들 수 있습니다.`,
    fairShare: (perDay: number) => `모두에게 공평하도록, 연결마다 하루에 투표를 ${perDay}개 만들 수 있습니다.`,
  },

  ballot: {
    yourBallot: '내 투표',
    withdraw: '철회',
    submit: '내 표 제출',
    rateEveryOption: '제출하려면 모든 선택지를 평가하세요',
    submitting: '제출하는 중…',
    majorityJudgmentLive: '모든 선택지에 평가를 매기세요. 평가하지 않은 선택지는 나쁨으로 계산됩니다.',
    majorityJudgmentEnvelope: '모든 선택지에 평가를 매긴 다음 표를 제출하세요.',
    approval: '만족할 수 있는 선택지를 모두 체크하세요.',
    invited: '초대는 한 표를 가지며, 이 브라우저에서만 바꿀 수 있습니다. 초대한 사람은 사용되었다는 것만 볼 수 있고, '
      + '무엇을 선택했는지는 볼 수 없습니다.',
    counted: '표가 집계되었습니다. 투표가 마감될 때까지 이 브라우저에서 바꿀 수 있습니다.',
    notVoted: '아직 투표하지 않았습니다.',
    hide: '내 표 숨기기',
    hidden: '표가 집계되었고 여기서는 숨겨져 있습니다. 이 화면을 보는 사람은 여러분의 선택을 볼 수 없습니다.',
    change: '내 표 바꾸기',
    invitationUsed: '이 초대는 이미 다른 브라우저나 다른 기기에서 사용되었습니다. 그 표는 그곳에서만 바꿀 수 있습니다.',
    invitationNotValid: '이 초대 링크는 유효하지 않습니다. 초대한 사람에게 새 링크를 요청하세요.',
    notInvited: '이 투표에는 초대받은 사람만 참여할 수 있습니다. 초대를 받았다면 초대장의 링크를 열어 주세요.',
    yourName: '이름',
    namePlaceholder: '익명',
    namesGiven: '선택 사항입니다. 모두가 입력된 이름은 볼 수 있지만 선택은 볼 수 없습니다.',
    namesLive: '실시간 결과는 누가 무엇을 선택했는지 짐작하게 할 수 있습니다.',
    notRatedYet: '아직 평가하지 않음',
    chooseAMention: '평가를 선택하세요…',
    optionsYouApprove: '승인하는 선택지',
  },

  results: {
    heading: '결과',
    ballots: (count: number) => `표 ${number(count)}개`,
    noBallotsYet: '아직 표가 없습니다. 표가 도착하는 대로 결과가 채워집니다.',
    keptUntilBallots: (count: number) => `표가 ${count}개 모이면 결과가 표시됩니다. 첫 투표자들의 선택이 그들만의 것으로 남도록 하기 위해서입니다.`,
    keptUntilYouClose: '투표를 마감하면 결과가 표시됩니다.',
    keptUntilClosed: '투표가 마감되면 결과가 표시됩니다.',
    download: '결과 다운로드',
    final: '최종',
    connecting: '연결하는 중…',
    live: '실시간',
    reconnecting: '다시 연결하는 중…',
    whoVoted: '투표한 사람',
    anonymousVoters: (count: number) => `익명 투표자 ${number(count)}명`,
    andAnonymousVoters: (count: number) => `그리고 익명 투표자 ${number(count)}명`,
    moreVoters: (count: number) => `그리고 ${number(count)}명 더`,
    rank: (rank: number) => `${rank}위`,
    approvals: (count: number) => `승인 ${number(count)}개`,
    noBallotsFor: (option: string) => `${option}: 아직 표 없음`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: '공동 순위',
    majorityMention: '다수 평가:',
    gmjScore: 'GMJ 점수:',
    gmjScoreTitle: (score: string) => `GMJ의 통상 판정 점수: ${score}. 다수 평가가 같은 선택지 사이의 순위를 가립니다.`,
    orBetter: (share: string, mention: string) => `${share}가 “${mention}” 이상이라고 답함`,
  },

  owner: {
    manage: '투표 관리',
    adminLink: '투표 관리 링크',
    adminLinkHint: '내 관리 링크입니다. 다른 브라우저나 기기에서 열면 여기가 아닌 그곳에서 투표를 관리할 수 있습니다. 혼자만 간직하세요.',
    showAdminLink: '관리 링크 보기',
    onlyThisBrowser: '이 브라우저만 이 투표를 일찍 마감하거나 삭제할 수 있습니다.',
    close: '투표 마감',
    delete: '투표 삭제',
    closeQuestion: '투표를 영구히 마감할까요? 이후로는 누구도 투표하거나 표를 바꿀 수 없으며, 모두가 최종 결과를 보게 됩니다.',
    keepOpen: '계속 열어 두기',
    closeForGood: '영구히 마감',
    deleteQuestion: '이 투표와 표를 영구히 삭제할까요? 보고 있는 모든 사람에게 투표가 사라지는 모습이 보입니다.',
    keep: '유지',
    deleteForGood: '영구히 삭제',
    deletedToast: '투표가 삭제되었습니다.',
  },

  invitations: {
    heading: '초대',
    count: (count: number) => `초대 ${number(count)}개`,
    used: (used: number, count: number) => `${number(count)}개 중 ${number(used)}개 사용됨`,
    hint: '초대한 사람만 투표할 수 있으며, 각자 한 표만 유효한 자신만의 링크를 가집니다. 어떤 링크가 사용되었는지는 볼 수 있지만 누가 무엇을 선택했는지는 볼 수 없습니다. 여러분은 초대 없이 투표할 수 있습니다.',
    invite: '초대',
    inviting: '초대하는 중…',
    inviteSomeone: '누군가 초대하기',
    namePlaceholder: '이름 또는 별명(선택)',
    loading: '초대를 불러오는 중…',
    showMore: '더 보기',
    newestShown: (count: number) => `가장 최근 ${number(count)}개를 표시합니다.`,
    invitationFor: (label: string) => `${label}님에게 보내는 초대`,
    invitationNumber: (number: number) => `초대 ${number}`,
    shareHint: '이 사람 전용입니다. 한 표를 가지며, 투표하는 브라우저에서만 바꿀 수 있습니다.',
    linkLabel: '초대 링크',
    message: (title: string) => `“${title}” 투표에 초대되었습니다. 이 링크는 여러분만 쓸 수 있습니다.`,
    isUsed: '사용됨',
    notUsedYet: '아직 사용되지 않음',
    share: (name: string) => `${name}님 링크 공유`,
    takeBack: (name: string) => `${name}님 링크 회수`,
    takeBackQuestion: '이 초대를 회수할까요? 링크가 더 이상 작동하지 않습니다.',
    keep: '유지',
    takeItBack: '회수',
  },

  share: {
    share: '공유',
    title: '이 투표 공유',
    anyone: '코드나 링크가 있으면 누구나 투표할 수 있습니다.',
    unlisted: '이 투표는 다른 어디에도 표시되지 않습니다.',
    linkLabel: '투표 링크',
    joinCode: '참여 코드',
    toEnterAt: (host: string) => `${host}에서 입력`,
    copy: '복사',
    copied: '복사됨',
    copyCode: '참여 코드 복사',
    qrCode: (url: string) => `${url} QR 코드`,
    throughAnApp: '앱으로 공유',
    byEmail: '이메일로 보내기',
    message: (title: string) => `“${title}”에 투표하세요`,
    orCode: (code: string, host: string) => `또는 ${host}에서 코드 ${code}을(를) 입력하세요.`,
  },

  statistics: {
    title: '통계 · super-vote',
    heading: <>전 세계의 <AppName /></>,
    lead: '투표, 표, 방문자가 얼마나 되는지, 언제, 어디서.',
    show: '표시',
    measures: {
      voters: {
        label: '방문자', plural: '방문자',
        noun: () => '명의 방문자',
        count: (count: number) => `방문자 ${number(count)}명`,
      },
      polls: {
        label: '투표', plural: '투표',
        noun: () => '개의 투표',
        count: (count: number) => `투표 ${number(count)}개`,
      },
      ballots: {
        label: '표', plural: '표',
        noun: () => '표',
        count: (count: number) => `표 ${number(count)}개`,
      },
    },
    totals: {
      polls: '만들어진 투표',
      openPolls: '현재 진행 중',
      ballots: '던져진 표',
      voters: '방문자',
    },
    lastDays: '최근 90일',
    where: '장소',
    byRegion: '지역별',
    noRegion: '아직 지역이 없습니다.',
    tapADot: '점을 눌러 숫자를 확인하세요.',
    unplaced: (visitors: string, polls: string, ballots: string) => '어느 지역에도 표시되지 않음. 시간대가 없거나 표시할 만큼 사람이 충분하지 않기 때문입니다: '
      + `${visitors}, ${polls}, ${ballots}.`,
    howCounted: '집계 방식',
    howCountedText: <>
      방문자는 <AppName />에 온 브라우저나 앱입니다. 한 사람이 기기 두 대를 쓰면 두 번 집계됩니다. 표는 투표자가 몇 번 바꾸더라도 한 번만 집계됩니다.
    </>,
    places: (updated: string) => '장소는 기기에 설정된 시간대에서 가져오며 주소는 절대 사용하지 않고, 합계만 보관합니다. '
      + '장소는 그곳에서 방문자 세 명이 왔을 때 표시됩니다. 숫자는 한 시간마다 갱신되어, '
      + '표가 도착하는 대로 한 투표의 표와 대조할 수 없습니다. '
      + `마지막 갱신: ${updated}.`,
    sources: <>
      각 점은 시간대의 이름이 된 도시이며 그 시간대의 모든 사람을 나타냅니다. 날짜는 UTC입니다. 육지는{' '}
      <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>, 시간대는{' '}
      <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA 데이터베이스</a>에서 가져왔습니다.
    </>,
    onDay: (count: string, noun: string, day: string) => <>{day}: <strong>{count}</strong> {noun}</>,
    overLastDays: (counts: string, days: number) => `최근 ${days}일간 ${counts}`,
    busiest: (day: string, count: string) => `, 가장 많은 날은 ${day}: ${count}.`,
    topLine: (count: string) => `최대값: ${count}`,
    regionAndCity: '지역과 도시',
    map: (what: string) => `시간대별 ${what} 세계 지도. 아래 표에 같은 숫자가 나열되어 있습니다.`,
    zoomIn: '확대',
    zoomOut: '축소',
    nothingYet: '아직 표시할 장소가 없습니다.',
    fewer: '더 적음',
    upTo: (count: string) => `최대 ${count}`,
    pollPlaces: '표가 오는 곳',
    pollPlacesNone: '지역은 그곳에서 표 세 개가 왔을 때 표시됩니다.',
    pollPlacesHint: '각 투표자의 시간대를 기준으로 하며 주소는 절대 사용하지 않습니다. 장소는 그곳에서 표 세 개가 왔을 때 표시되며, 숫자는 한 시간마다 갱신됩니다.',
    regions: {
      Africa: '아프리카',
      America: '아메리카',
      Antarctica: '남극',
      Arctic: '북극',
      Asia: '아시아',
      Atlantic: '대서양 섬',
      Australia: '호주',
      Europe: '유럽',
      Indian: '인도양',
      Pacific: '태평양',
    } as Record<string, string>,
  },

  about: {
    title: '소개 · super-vote',
    heading: <><AppName /> 소개</>,
    lead: (days: number) => <>
      그룹이 함께 결정할 수 있는 무료 오픈 소스 방법입니다. 어디서 먹을지, 어디로 갈지, 무엇을 고를지. 계정도, 광고도, 추적도 없습니다.
      투표는 만든 지 {days}일 후 삭제됩니다.
    </>,
    howDecided: '결과는 어떻게 정해지나요',
    howDecidedText: <>
      하나만 고르는 방식은 사람들의 생각 대부분을 버립니다. 비슷한 선택지는 지지자를 나눠 갖고, 거의 모두가 괜찮다고 여기는 선택지가
      그룹의 절반이 싫어하는 선택지에 질 수도 있습니다. <AppName />는 두 가지 방식으로 더 많은 것을 묻습니다.
    </>,
    majorityJudgment: '다수 판정',
    majorityJudgmentText: <>
      모든 투표자가 모든 선택지를 <em>훌륭함</em>부터 <em>나쁨</em>까지 평가합니다. 선택지의 <strong>다수 평가</strong>는
      투표자의 절반 넘는 사람이 그 이상으로 준 가장 좋은 평가, 즉 중앙값입니다. 다수 평가가 가장 좋은 선택지가 이깁니다.
      여러 선택지가 같다면 <strong>GMJ 점수</strong>가 가립니다. 평가들이 그 다수 평가의 위나 아래로 얼마나 치우쳤는지를 측정합니다.
      그래도 같은 선택지는 <em>공동 순위</em>로 표시되며, 숨겨진 규칙이 하나를 고르지 않습니다.
    </>,
    approval: '승인 투표',
    approvalText: '모든 투표자가 만족할 수 있는 선택지를 모두 체크합니다. 가장 많은 투표자가 승인한 선택지가 이깁니다. 빠르고, 선택지를 여러 개 지지한다고 해서 불이익이 없습니다.',
    science: '그 뒤의 과학',
    scienceText: '완벽한 투표 규칙은 없습니다. 콩도르세는 1785년에 그룹이 A를 B보다, B를 C보다, C를 A보다 선호할 수 있다는 것과, '
      + '합리적인 규칙은 모두 조작될 수 있다는 것을 알아챘습니다. 순위를 매기는 대신 평가하면 그 상당 부분을 피할 수 있습니다. '
      + '와인 심사위원과 피겨 스케이팅 심판이 아는 것처럼요.',
    notes: {
      pnas2007: '다수 판정을 소개합니다: 평가한 다음 중앙값 평가로 순위를 매깁니다.',
      book2011: '책: 이론, 그 성질, 그리고 실제 선거와 심사위원단.',
      judge2014: '평가가 왜 순위 매기기의 역설을 피하고 조작에 강한지.',
      fabre2021: <><AppName />가 같은 다수 평가 사이의 동점을 가리는 데 쓰는 “통상 판정” 점수.</>,
      brams1978: '받아들일 수 있는 모든 선택지를 승인해야 하는 이유.',
      laslier2009: '승인 투표에서 사람들이 전략적으로 어떻게 투표하는지, 그리고 그 결과.',
      gibbard1973: '새터스웨이트와 함께: 합리적인 투표 규칙은 모두 조작될 수 있습니다. 문제는 얼마나 되느냐입니다.',
      satterthwaite1975: '독립적으로 도출된 같은 결과.',
    },
    whoMakesIt: '만든 사람',
    whoMakesItText: <>
      <AppName />는 퀘벡의 한 사람이 여가 시간에 만들었고 누구나 무료로 쓸 수 있습니다. 코드는 공개되어 있습니다.
      누구나 표가 어떻게 집계되는지 읽고, 자신의 복사본을 실행하고, 변경을 제안할 수 있습니다.
    </>,
    seeTheCode: 'GitHub에서 소스 코드 보기',
  },

  privacy: {
    title: '개인정보 보호와 한계 · super-vote',
    heading: '개인정보 보호와 한계',
    lead: <>
      <AppName />는 아무도 여러분이 무엇을 선택했는지 알 수 없도록 만들어졌습니다. 무엇을 보관하는지, 누가 무엇을 볼 수 있는지,
      아직 할 수 없는 것이 무엇인지 설명합니다.
    </>,

    forWhat: '용도',
    forWhatText: '서로 신뢰하는 사람들, 즉 친구, 가족, 팀, 학급, 단체가 함께 결정하는 데 쓰입니다. '
      + '선거나 법적, 금전적, 공식적 결과를 낳는 투표에는 적합하지 않습니다. 그런 투표에는 모든 투표자의 신원 확인과 한 번만의 집계, '
      + '누구나 검증할 수 있는 결과가 필요한데, super-vote는 아직 그것을 약속할 수 없습니다.',

    kept: '보관하는 것과 기간',
    keptItems: (days: number) => [
      `투표: 질문, 선택지, 설정. 삭제될 때까지, 늦어도 만든 지 ${days}일 후까지입니다. 만든 사람은 더 일찍 삭제할 수 있습니다.`,
      '투표에서의 내 표: 내가 누구인지 알려 주지 않는 키로 저장되며 투표와 함께 삭제됩니다. 투표가 마감될 때까지 철회할 수 있습니다.',
      '이름을 표시하는 투표에서 입력한 이름: 둘을 연결하는 것이 없도록 표와 따로 저장됩니다.',
      '위 투표, 표, 이름의 사본: 사고에서 복구하기 위해 매일 밤 만들어 7일 동안 보관합니다. 삭제된 것은 일주일 안에 사본에서도 사라집니다.',
      `쿠키 안의 무작위 식별자: 이 브라우저가 자신의 표를 바꾸고 자신의 투표를 관리할 수 있도록, 마지막 표나 투표 후 ${days}일 동안, `
        + '투표가 지속되는 동안 유지됩니다. 유일한 쿠키이며 광고도, 분석도, 추적도 없습니다.',
      '기기의 시간대(예: Europe/Paris): 합계로만 통계에 더해집니다. 주소는 절대 사용하지 않습니다.',
      '네트워크 주소: 네트워크마다 만들 수 있는 투표 수를 제한하기 위해 최대 하루 동안 메모리에만 유지합니다. 기록되지 않습니다.',
      '설정과 마지막으로 입력한 이름: 이 브라우저에만 저장됩니다.',
      '서버가 보관하는 모든 것은 EU가 개인정보를 적절히 보호하는 국가로 인정한 캐나다의 몬트리올에 있는 한 대의 기계에 있습니다.',
    ],

    whoSees: '누가 무엇을 보나요',
    whoSeesItems: [
      '투표의 모든 사람은 만든 사람이 표시하기로 했다면 합계로 된 결과와, 투표자가 남기기로 한 이름을 봅니다.',
      '투표를 만든 사람도 같은 것을 보고, 어떤 초대가 사용되었는지도 봅니다. 누가 무엇을 선택했는지는 절대 볼 수 없습니다.',
      '아무도 여러분의 표를 볼 수 없습니다. 본인 화면에서도 집계된 뒤에는 처음에 숨겨져 있습니다.',
      '서버를 운영하는 사람은 요청이 일어나는 대로 봅니다. 저장된 것은 누가 무엇을 선택했는지 알려 주지 않지만, super-vote는 실행 중인 서버로부터 표를 숨기지 않습니다. 운영하는 사람들이 보지 않을 것이라고 신뢰합니다.',
    ],

    limits: '알아야 할 한계',
    limitsItems: [
      '초대가 없으면 한 사람이 서로 다른 브라우저나 기기에서 여러 번 투표할 수 있습니다. super-vote는 선의를 전제로 하며, 남용되면 표의 수에 드러납니다. 한 사람을 한 번만 세려면 초대하세요.',
      '내 표와 투표는 이 브라우저에 속합니다. 다른 기기에서, 또는 데이터를 지운 뒤에는 더 이상 바꾸거나 관리할 수 없고, 되찾을 계정도 없습니다.',
      '실시간 결과는 표가 도착할 때마다 움직입니다. 소규모 그룹에서는 지켜보는 사람이 누가 무엇을 선택했는지 알 수 있습니다. 투표를 만드는 사람이 결과가 언제 표시될지 선택하며, 경고를 받습니다.',
      '집계는 독립적으로 확인할 수 없습니다. 코드가 누구에게나 읽을 수 있게 공개된 서버를 신뢰하는 것입니다.',
      'super-vote는 무료이며 작은 서버 하나에서 실행됩니다. 때때로 이용할 수 없을 수 있습니다. 급한 일에는 의존하지 마세요.',
    ],

    rights: '내 데이터, 내 선택',
    rightsText: '내 표는 나와 연결되어 있지 않으므로 super-vote가 대신 찾아 줄 수 없습니다. 이 브라우저에서 표를 철회하거나 직접 만든 투표를 삭제하세요. '
      + '이 브라우저에서 super-vote의 데이터를 지우면 쿠키와 설정이 삭제됩니다.',
    contact: <>
      질문, 데이터에 대한 요청 또는 신고할 투표:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">GitHub에서 문의해 주세요</a>.
      보안 취약점은{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">보안 정책</a>을 확인하세요.
    </>,
    openSource: <>
      여기 있는 어떤 것도 믿음에 의지할 필요가 없습니다. 집계와 표의 보호를 포함한 <AppName />의 코드는{' '}
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">누구나 읽을 수 있게 공개</a>되어 있습니다.
    </>,
  },

  legal: {
    title: '법적 고지 · super-vote',
    heading: '법적 고지',
    publisher: '발행인',
    publisherText: <>
      <AppName />는 캐나다 퀘벡의 개인이 상업적 목적 없이 발행합니다. 이름과 주소는 여기에 적지 않으며, 호스팅 업체가 보유하고 있습니다.
    </>,
    law: '준거법',
    lawText: <>
      <AppName />는 퀘벡에서 퀘벡주와 캐나다의 법에 따라 발행됩니다. 전 세계 사람들에게 열려 있으며, 투표를 만들거나 투표하는 사람은 자신이 있는 곳의 법도 따릅니다.
      <AppName />가 여러분에 대해 무엇을 보관하고 그 이유가 무엇인지는 어디에 있든 모두에게 같습니다:{' '}
      <Link to="/privacy">개인정보 보호와 한계</Link>.
    </>,
    host: '호스팅 업체',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      '캐나다',
    ],
    hostPhone: (phone: ReactNode) => <>전화: {phone}</>,
    report: '투표 신고',
    reportText: <>
      투표는 만든 사람이 작성합니다. 법을 어기는 투표를 제목, 선택지 또는 투표자의 이름으로 신고하려면:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">GitHub에서 문의해 주세요</a>.
      모든 신고는 신속하게 검토되며 불법적인 내용은 삭제됩니다.
    </>,
  },
};
