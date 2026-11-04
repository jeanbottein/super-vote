/**
 * Everything the web app says, in Arabic (Modern Standard): en.tsx,
 * translated. The page is laid out right to left (format.ts, `direction`).
 * A poll is a «تصويت», a ballot a «صوت». Counted nouns take Arabic's plural
 * forms (1, 2, 3–10, 11–99, 100), and every number goes through `number`, so
 * that digits are written the same way throughout.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, pluralForm, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('ar', count);

interface Nouns {
  /** One, said whole: «صوت واحد». */
  one: string;
  /** Two, said whole: «صوتان». */
  two: string;
  /** After 3 to 10. */
  few: string;
  /** After 11 to 99. */
  many: string;
  /** After 100, and for 0. */
  other: string;
}

/** The count with its noun as Arabic says it: «صوت واحد», «صوتان», «٣ أصوات», «١١ صوتًا». */
function counted(count: number, nouns: Nouns): string {
  const n = number(count);
  return pluralForm('ar', count, {
    zero: `${n} ${nouns.other}`,
    one: nouns.one,
    two: nouns.two,
    few: `${n} ${nouns.few}`,
    many: `${n} ${nouns.many}`,
    other: `${n} ${nouns.other}`,
  });
}

/** The noun alone, for a count written elsewhere. */
function noun(count: number, nouns: { singular: string; dual: string; few: string; many: string }): string {
  return pluralForm('ar', count, {
    one: nouns.singular, two: nouns.dual, few: nouns.few, many: nouns.many, other: nouns.singular,
  });
}

const BALLOTS: Nouns = { one: 'صوت واحد', two: 'صوتان', few: 'أصوات', many: 'صوتًا', other: 'صوت' };
const POLLS: Nouns = { one: 'تصويت واحد', two: 'تصويتان', few: 'تصويتات', many: 'تصويتًا', other: 'تصويت' };
const VISITORS: Nouns = { one: 'زائر واحد', two: 'زائران', few: 'زوار', many: 'زائرًا', other: 'زائر' };

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return unit === 'minute'
    ? counted(count, { one: 'دقيقة واحدة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة', other: 'دقيقة' })
    : counted(count, { one: 'ساعة واحدة', two: 'ساعتان', few: 'ساعات', many: 'ساعة', other: 'ساعة' });
}

export const ar: Messages = {
  number,
  percent: (share: number) => formatPercent('ar', share),
  decimal: (value: number, digits: number) => formatDecimal('ar', value, digits),
  date: (isoDate: string) => formatDate('ar', isoDate),
  moment: (isoDate: string) => formatMoment('ar', isoDate),
  day: (day: string) => formatUtcDay('ar', day),
  timeAgo: (isoDate: string) => timeAgo('ar', isoDate) ?? 'الآن',
  waitUntil: inWords,

  loading: 'جارٍ التحميل…',
  backHome: 'العودة إلى الصفحة الرئيسية',
  tryAgain: 'حاول مرة أخرى',
  close: 'إغلاق',
  dismiss: 'تجاهل',

  errors: {
    unexpected: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    unreachable: 'تعذّر الوصول إلى الخادم. تحقّق من اتصالك ثم حاول مرة أخرى.',
    failed: (status: number) => `حدث خطأ ما (الخطأ ${number(status)}). يرجى المحاولة مرة أخرى.`,
  },

  problems: {
    'unknown-voter': 'هذا المتصفح غير معروف لدى super-vote. أعد تحميل الصفحة للبدء من جديد.',
    'not-poll-creator': 'لا يستطيع فعل ذلك إلا من أنشأ التصويت.',
    'not-invited': 'لا يستطيع التصويت هنا إلا المدعوون. إن كنت مدعوًّا، فافتح الرابط الوارد في دعوتك.',
    'not-admin-link': 'رابط الإدارة هذا لا يخص هذا التصويت. تأكّد من أنه نُسخ كاملًا.',
    'handover-unavailable': 'لا يمكن لهذا الرابط تسليم التصويت: فقد استُخدم من قبل.',
    'cross-site': 'جاء هذا الطلب من موقع إلكتروني آخر فتم رفضه. افتح super-vote مباشرةً.',
    'poll-not-found': 'لا يوجد تصويت بهذا الرابط أو هذا الرمز. ربما كُتب خطأً، أو حُذف التصويت.',
    'poll-closed': 'هذا التصويت مغلق: لم يعد يقبل أصواتًا.',
    'invitation-used': 'صوّت شخص بالفعل بهذه الدعوة، في متصفح آخر أو على جهاز آخر.',
    'collision': 'تعارض هذا التغيير مع تغيير آخر أُجري في اللحظة نفسها. يرجى المحاولة مرة أخرى.',
    'too-many-polls': (wait: string) => 'أنشأ هذا الاتصال تصويتاته المسموحة لهذا اليوم. حرصًا على العدل بين الجميع، '
      + `يستطيع كل اتصال إنشاء عدد قليل منها في اليوم: يمكنك إنشاء المزيد بعد ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'رموز خاطئة كثيرة جدًا من هذا الاتصال: لحماية التصويتات '
      + `من التخمين، سيتم رفض رموزه خلال ${wait} القادمة. أما الروابط فتظل تعمل.`,
    'server-error': 'حدث خطأ من جانبنا. يرجى المحاولة مرة أخرى بعد قليل.',
  },

  mentions: {
    Excellent: 'ممتاز',
    VeryGood: 'جيد جدًا',
    Good: 'جيد',
    Fair: 'متوسط',
    Passable: 'مقبول',
    Inadequate: 'غير كافٍ',
    Bad: 'سيئ',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'الحكم بالأغلبية',
    APPROVAL: 'التصويت بالموافقة',
  },

  visibilities: {
    PUBLIC: 'عام',
    UNLISTED: 'خاص',
  },

  app: {
    home: 'الرئيسية',
    settings: 'الإعدادات',
    footer: <><AppName /> مجاني ومفتوح المصدر.</>,
    footerLinks: 'حول super-vote',
    about: 'حول الموقع والعلم وراءه',
    privacy: 'الخصوصية والحدود',
    legal: 'الإشعار القانوني',
    statistics: 'الإحصاءات',
    sourceCode: 'الشيفرة المصدرية',
    notFound: 'الصفحة غير موجودة',
    nothingHere: 'لا يوجد شيء في هذا العنوان.',
  },

  settings: {
    language: 'اللغة',
    appearance: 'المظهر',
    light: 'فاتح',
    automatic: 'تلقائي',
    dark: 'داكن',
    mentionColours: 'ألوان التقديرات',
    greenToRed: 'من الأخضر إلى الأحمر',
    shadesOfGrey: 'درجات الرمادي',
    shadesOfGreyHint: 'تُقرأ درجات الرمادي بالطريقة نفسها مهما كانت الألوان التي تراها: كلما كان اللون أفتح كان التقدير أفضل.',
    majorityJudgmentBallot: 'ورقة اقتراع الحكم بالأغلبية',
    colourScale: 'مقياس ألوان',
    dropdowns: 'قوائم منسدلة',
    castingYourBallot: 'الإدلاء بصوتك',
    live: 'فوري',
    envelope: 'مظروف',
    liveHint: 'يُحتسب كل تغيير لحظة إجرائه.',
    envelopeHint: 'املأ ورقة اقتراعك ثم أرسلها دفعة واحدة.',
  },

  home: {
    title: 'super-vote · لنقرّر معًا',
    lead: 'الرياضيات تقول إن هذا أعدل.',
    createQuestion: 'هل تحتاج إلى إنشاء تصويت؟',
    createPoll: 'لنقرّر معًا!',
    yourPolls: 'لنقرّر معًا…',
    publicPolls: 'التصويتات العامة',
    noPublicPolls: 'لا توجد تصويتات عامة بعد.',
    public: 'عام',
    closed: 'مغلق',

    howItWorks: 'كيف يعمل',
    steps: [
      { title: 'اسأل', text: 'سؤال وخياراته.' },
      { title: 'شارك', text: 'رابط أو رمز QR أو رمز.' },
      { title: 'قرّر', text: 'يقيّم الجميع وتصل النتائج مباشرةً.' },
    ],

    agent: {
      title: 'جاهز للذكاء الاصطناعي',
      text: 'الصق هذا في مساعد يستطيع تصفّح الويب، مع سؤالك أنت.',
      prompt: (site: string, guide: string) => `استخدم ${site} لإنشاء تصويت لفريقي (تعليمات `
        + `للوكلاء: ${guide}). السؤال: «أين نقيم رحلة الفريق؟» الخيارات: لشبونة، برلين، `
        + 'برشلونة. استخدم الحكم بالأغلبية، وأبقِ النتائج مخفية حتى أغلق التصويت. '
        + 'سلّمني التصويت، ثم أعطني الرابط الذي سأشاركه مع الفريق.',
      copy: 'نسخ النص',
      copied: 'تم نسخ النص',
      caption: 'يردّ برابطين: افتح الأول لتجعل التصويت لك، وأرسل الثاني إلى المجموعة.',
    },

    systems: {
      title: 'طريقتان للقرار',
      majorityJudgment: {
        title: 'الحكم بالأغلبية',
        text: 'قيّم كل خيار من «ممتاز» إلى «سيئ». يفوز أفضل تقدير بالأغلبية.',
      },
      approval: {
        title: 'الموافقة',
        text: 'ضع علامة على كل خيار تقبله. يفوز الأكثر علامات.',
      },
    },

    compare: {
      title: 'أعدل من معظم الانتخابات الرسمية',
      text: 'تطلب معظم الانتخابات اسمًا واحدًا. فيقتسم المرشحون المتشابهون ناخبيهم، وقد يفوز مرشح ترفضه الأغلبية. '
        + 'أما الحكم بالأغلبية، المستمد من أبحاث ميشيل بالينسكي وريدا لاراكي، فيقيس بدلًا من ذلك '
        + 'ما يفكّر فيه الجميع بشأن كل خيار.',
      science: 'العلم وراء ذلك',
      single: 'اختيار واحد',
      singleNote: 'معظم الانتخابات',
      approval: 'الموافقة',
      majorityJudgment: 'الحكم بالأغلبية',
      criteria: {
        nuance: 'قل رأيك في كل خيار',
        splitting: 'الخيارات المتشابهة لا تشتّت الأصوات',
        lesserEvil: 'لا حاجة للتصويت لأخفّ الضررين',
        tactics: 'يصعب التلاعب به',
        quick: 'سريع التعبئة',
        familiar: 'مألوف',
      },
      marks: { yes: 'نعم', partly: 'جزئيًا', no: 'لا' },
      caption: <>يقدّم <AppName /> الموافقة والحكم بالأغلبية. لا توجد قاعدة تصويت مثالية، لكن بعضها أعدل بكثير من غيره.</>,
    },

    supportTitle: 'مجاني، مفتوح المصدر، بلا إعلانات',
    supportText: 'لست أنت المنتج: الهدف هو الترويج لأنظمة تصويت أفضل. صنعه شخص واحد في وقت فراغه. '
      + 'إن ساعد مجموعتك على اتخاذ القرار، فيمكنك أن تساعده.',

    limitsTitle: 'من الجيد أن تعرف',
    limits: {
      everyday: <><strong>للقرارات اليومية،</strong> لا للانتخابات الرسمية: ولأنه بلا حسابات، يمكن لشخص أن يصوّت
        مرة أخرى من متصفح آخر. أما الدعوات فتحتسب كل شخص مرة واحدة.</>,
      private: <><strong>خاص، لكنه غير مخفيّ عن الخادم.</strong> لا يرى أحد غيرك صوتك، والأصوات المحفوظة
        لا تقول من أدلى بها.</>,
      browser: (days: number) => <><strong>مرتبط بهذا المتصفح،</strong> عبر ملف تعريف ارتباط واحد، يُحفظ {number(days)} يومًا
        بعد آخر صوت أو تصويت لك. بلا إعلانات ولا تتبّع.</>,
      deleted: (days: number) => <><strong>تُحذف بعد {number(days)} يومًا،</strong> التصويتات وأصواتها معًا.</>,
      disclaimer: <><strong>بلا ضمان.</strong> يروّج <AppName /> لطرق تصويت أفضل. يصنعه شخص واحد،
        بأقصى عناية بالأمان والخصوصية والأداء والبنية وجودة الشيفرة، لكنه غير معتمد ولا مدقَّق
        ولا مراجَع بشكل مستقل: فلا ضمان لدقة نتائجه ولا لتمثيلها الحقيقي لإرادة مجموعة. فذلك يتطلب اعتمادًا
        ومراجعة تقنية من خبراء ودعمًا مستمرًا، ولا يستطيع شخص واحد تقديم ذلك من دون رعاة وخبراء.</>,
    },
    limitsLink: 'كل شيء عن الخصوصية والحدود',
  },
  join: {
    label: 'هل لديك رمز؟',
    typeTheCode: 'اكتب الرمز الذي أُعطيته.',
    notACode: 'يتكوّن الرمز من ستة أحرف وأرقام، مثل K7M-4QX.',
    joining: 'جارٍ الانضمام…',
    join: 'صوّت!',
  },

  newPoll: {
    title: 'لنقرّر معًا · super-vote',
    heading: 'لنقرّر معًا',
    question: 'السؤال',
    questionPlaceholder: 'أين نأكل يوم الجمعة؟',
    options: 'الخيارات',
    option: (row: number) => `الخيار ${number(row)}`,
    remove: (option: string) => `إزالة ${option}`,
    optionsHint: (max: number) => `حتى ${number(max)} خيارًا. يظهر صف جديد أثناء الكتابة.`,

    votingSystem: 'نظام التصويت',
    systems: {
      MAJORITY_JUDGMENT: 'الحكم بالأغلبية',
      APPROVAL: 'الموافقة',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'يقيّم المصوّتون كل خيار من «ممتاز» إلى «سيئ». يفوز الخيار الذي تقيّمه الأغلبية أفضل تقييم: '
        + 'دقيق ويصعب التلاعب به.',
      APPROVAL: 'يضع المصوّتون علامة على كل خيار يقبلونه. يفوز الخيار الأكثر موافقة: سريع وبسيط.',
    },

    whoCanFindIt: 'من يمكنه العثور عليه',
    visibilityHints: {
      PUBLIC: 'مدرج في الصفحة الرئيسية ليجده الجميع.',
      UNLISTED: 'غير مدرج في أي مكان: لا يجده إلا من تشاركهم الرابط أو الرمز.',
    },

    whoCanVote: 'من يمكنه التصويت',
    anyone: 'أي شخص',
    invitedOnly: 'المدعوون فقط',
    anyoneHint: <>
      أي شخص لديه الرابط أو الرمز. من عقد العزم يستطيع التصويت مرة أخرى من متصفح آخر: لاحتساب كل شخص
      مرة واحدة، قم بدعوته.
    </>,
    invitedHint: 'يحصل كل شخص على رابط خاص به، صالح لصوت واحد. ترى أي الروابط استُخدمت، ولا ترى أبدًا ما اختاره أي شخص.',

    whoVoted: 'من صوّت',
    anonymous: 'مجهول',
    showNames: 'إظهار الأسماء',
    anonymousHint: 'لا يرى أحد من صوّت، بل كم عدد من صوّتوا فقط.',
    showNamesHint: 'يجوز للمصوّتين كتابة اسم، يظهر تحت النتائج. لا يرى أحد من اختار ماذا.',

    results: 'النتائج',
    resultsChoices: {
      LIVE: 'مباشرة',
      AFTER_BALLOTS: 'مؤجّلة',
      AFTER_CLOSING: 'عند الإغلاق',
    },
    resultsHints: {
      LIVE: 'تنبيه: يرى الجميع كيف يحرّك كل صوت النتائج. وفي مجموعة صغيرة، يكشف ذلك من اختار ماذا.',
      AFTER_BALLOTS: 'مخفية حتى يصل هذا العدد من الأصوات، لحماية أوائل المصوّتين. وبعد ذلك يحرّكها كل صوت، '
        + 'وهذا قد يكشف مع ذلك هوية من يصوّت لاحقًا.',
      AFTER_CLOSING: 'تظهر عندما تغلق التصويت. وحتى ذلك الحين لا يرى الجميع سوى عدد من صوّتوا.',
    },
    ballotsBeforeResults: 'عدد الأصوات قبل ظهور النتائج',

    optionOrder: 'ترتيب الخيارات',
    orders: {
      ALPHABETICAL: 'أبجدي',
      SHUFFLED: 'عشوائي',
      AS_WRITTEN: 'كما كُتب',
    },
    orderHints: {
      ALPHABETICAL: 'بالترتيب الأبجدي، والأرقام بقيمتها: 2 قبل 10. اكتب التواريخ بالسنة أولًا، مثل 2026-10-24.',
      SHUFFLED: 'ترتيب جديد لكل مصوّت في كل زيارة، حتى لا يستفيد أي خيار من موضعه.',
      AS_WRITTEN: 'ترتيبك أنت. تجذب المواضع الأولى دعمًا أكبر، فقد يبدو ذلك محاولة للتأثير في النتيجة.',
    },

    deletedAfter: (days: number) => `تُحذف التصويتات بعد ${number(days)} يومًا من إنشائها، مع أصواتها.`,
    notForElections: <>
      <AppName /> مخصص للقرارات اليومية، لا للتصويتات الرسمية أو الملزمة.{' '}
      <Link to="/privacy">الخصوصية والحدود</Link>
    </>,
    noNewPolls: 'هذا الخادم لا يقبل تصويتات جديدة في الوقت الحالي.',
    creating: 'جارٍ الإنشاء…',
    create: 'اطرح السؤال',

    problems: {
      titleMissing: 'أعطِ تصويتك عنوانًا.',
      titleTooLong: (max: number) => `يمكن أن يصل طول العنوان إلى ${number(max)} حرفًا على الأكثر.`,
      titleInvisible: 'لا يمكن أن يحتوي العنوان إلا على أحرف مرئية.',
      tooFewOptions: 'أضف خيارين على الأقل.',
      tooManyOptions: (max: number) => `يمكن أن يحتوي التصويت على ${number(max)} خيارًا على الأكثر.`,
      optionTooLong: (max: number) => `يمكن أن يصل طول الخيار إلى ${number(max)} حرفًا على الأكثر.`,
      optionInvisible: 'لا يمكن أن يحتوي الخيار إلا على أحرف مرئية.',
      optionTwice: (option: string) => `«${option}» مدرج مرتين. يجب أن يكون كل خيار مختلفًا.`,
      resultsAfterBallots: (min: number) => `اختر عددًا صحيحًا من الأصوات، لا يقل عن ${number(min)}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'جارٍ تولّي هذا التصويت…',
    deleted: 'تم حذف هذا التصويت',
    deletedText: 'تم حذفه، وحُذفت نتائجه معه.',
    notFound: 'التصويت غير موجود',
    notFoundText: 'ربما كان الرابط ناقصًا، أو حُذف التصويت.',
    notLoaded: 'تعذّر تحميل التصويت',
    loadingPoll: 'جارٍ تحميل التصويت…',
    byInvitation: 'بالدعوة',
    optionOrder: { SHUFFLED: 'الخيارات مرتبة عشوائيًا', ALPHABETICAL: 'الخيارات مرتبة أبجديًا', AS_WRITTEN: 'الخيارات بترتيب كتابتها' },
    closed: 'مغلق',
    keepTitle: 'احتفظ برابط الإدارة',
    keepText: 'افتحه في متصفح أو جهاز آخر لإدارة هذا التصويت من هناك بدلًا من هنا: إغلاقه، '
      + 'حذفه، دعوة الناس. احتفظ به لنفسك: من يملكه يستطيع فعل الشيء نفسه.',
    readyToInvite: <><strong>تصويتك جاهز.</strong> ادعُ الناس أدناه: يحصل كل شخص على رابط خاص به.</>,
    readyToShare: <><strong>تصويتك جاهز.</strong> شارك رابطه لجمع الأصوات.</>,
    closedAgo: (ago: string) => `أُغلق التصويت ${ago}. هذه هي النتائج النهائية.`,
    deletedOn: (date: string) => `سيُحذف هذا التصويت وأصواته في ${date}.`,
    lastPoll: (wait: string) => `كان ذلك آخر تصويت لك في الوقت الحالي: يمكنك إنشاء المزيد بعد ${wait}.`,
    pollsLeft: (count: number, wait: string) => `يمكنك إنشاء ${counted(count, { one: 'تصويت إضافي واحد', two: 'تصويتين إضافيين', few: 'تصويتات إضافية', many: 'تصويتًا إضافيًا', other: 'تصويت إضافي' })} خلال ${wait} القادمة.`,
    fairShare: (perDay: number) => `حرصًا على العدل بين الجميع، يستطيع كل اتصال إنشاء ${number(perDay)} تصويتًا في اليوم.`,
  },

  ballot: {
    yourBallot: 'صوتك',
    withdraw: 'سحب',
    submit: 'إرسال صوتي',
    rateEveryOption: 'قيّم كل خيار لتتمكن من الإرسال',
    submitting: 'جارٍ الإرسال…',
    majorityJudgmentLive: 'امنح كل خيار تقديرًا. الخيارات التي لم تقيّمها تُحتسب «سيئ».',
    majorityJudgmentEnvelope: 'امنح كل خيار تقديرًا، ثم أرسل صوتك.',
    approval: 'ضع علامة على كل خيار ترضى عنه.',
    invited: 'تتضمن دعوتك صوتًا واحدًا لا يستطيع تغييره إلا هذا المتصفح. يرى من دعاك أنها استُخدمت، '
      + 'ولا يرى أبدًا ما اخترته.',
    counted: 'تم احتساب صوتك. يمكنك تغييره من هذا المتصفح حتى يُغلق التصويت.',
    notVoted: 'لم تصوّت بعد.',
    hide: 'إخفاء صوتي',
    hidden: 'تم احتساب صوتك وهو مخفيّ هنا: لا يرى أحد ينظر إلى هذه الشاشة اختياراتك.',
    change: 'تغيير صوتي',
    invitationUsed: 'استُخدمت هذه الدعوة بالفعل، في متصفح آخر أو على جهاز آخر. ولا يمكن تغيير صوتها '
      + 'إلا هناك.',
    invitationNotValid: 'رابط الدعوة هذا غير صالح. اطلب رابطًا جديدًا ممن دعاك.',
    notInvited: 'لا يستطيع التصويت هنا إلا المدعوون. إن كنت مدعوًّا، فافتح الرابط الوارد في دعوتك.',
    yourName: 'اسمك',
    namePlaceholder: 'مجهول',
    namesGiven: 'اختياري. يرى الجميع الأسماء المكتوبة، لكنهم لا يرون اختياراتهم.',
    namesLive: 'قد توحي النتائج المباشرة بمن اختار ماذا.',
    notRatedYet: 'لم يُقيَّم بعد',
    chooseAMention: 'اختر تقديرًا…',
    optionsYouApprove: 'الخيارات التي توافق عليها',
  },

  results: {
    heading: 'النتائج',
    ballots: (count: number) => counted(count, BALLOTS),
    noBallotsYet: 'لا توجد أصوات بعد. تمتلئ النتائج كلما وصلت الأصوات.',
    keptUntilBallots: (count: number) => `تظهر النتائج عندما يصل ${counted(count, BALLOTS)}، حتى تبقى `
      + 'اختيارات أوائل المصوّتين لهم.',
    keptUntilYouClose: 'تظهر النتائج عندما تغلق التصويت.',
    keptUntilClosed: 'تظهر النتائج عندما يُغلق التصويت.',
    download: 'تنزيل النتائج',
    final: 'نهائية',
    connecting: 'جارٍ الاتصال…',
    live: 'مباشرة',
    reconnecting: 'جارٍ إعادة الاتصال…',
    whoVoted: 'من صوّت',
    anonymousVoters: (count: number) => counted(count, { one: 'مصوّت مجهول واحد', two: 'مصوّتان مجهولان', few: 'مصوّتين مجهولين', many: 'مصوّتًا مجهولًا', other: 'مصوّت مجهول' }),
    andAnonymousVoters: (count: number) => `و${counted(count, { one: 'مصوّت مجهول واحد', two: 'مصوّتان مجهولان', few: 'مصوّتين مجهولين', many: 'مصوّتًا مجهولًا', other: 'مصوّت مجهول' })}`,
    moreVoters: (count: number) => `و${counted(count, { one: 'مصوّت آخر', two: 'مصوّتان آخران', few: 'مصوّتين آخرين', many: 'مصوّتًا آخر', other: 'مصوّت آخر' })}`,
    rank: (rank: number) => `المرتبة ${number(rank)}`,
    approvals: (count: number) => counted(count, { one: 'موافقة واحدة', two: 'موافقتان', few: 'موافقات', many: 'موافقة', other: 'موافقة' }),
    noBallotsFor: (option: string) => `${option}: لا توجد أصوات بعد`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${number(percent)}٪`,
    exAequo: 'تعادل',
    majorityMention: 'تقدير الأغلبية:',
    gmjScore: 'درجة GMJ:',
    gmjScoreTitle: (score: string) => `درجة الحكم المعتاد في GMJ: ${score}. تحسم التعادل بين الخيارات التي لها `
      + 'تقدير الأغلبية نفسه.',
    orBetter: (share: string, mention: string) => `${share} يقولون «${mention}» أو أفضل`,
  },

  owner: {
    manage: 'إدارة تصويتك',
    adminLink: 'رابط إدارة التصويت',
    adminLinkHint: 'رابط الإدارة الخاص بك: افتحه في متصفح أو جهاز آخر لإدارة التصويت من هناك بدلًا من هنا. '
      + 'احتفظ به لنفسك.',
    showAdminLink: 'إظهار رابط الإدارة',
    onlyThisBrowser: 'هذا المتصفح وحده يستطيع إغلاق هذا التصويت أو حذفه قبل موعده.',
    close: 'إغلاق التصويت',
    delete: 'حذف التصويت',
    closeQuestion: 'هل تريد إغلاق التصويت نهائيًا؟ لن يستطيع أحد التصويت أو تغيير صوته بعد ذلك، وسيرى الجميع '
      + 'النتائج النهائية.',
    keepOpen: 'إبقاؤه مفتوحًا',
    closeForGood: 'إغلاق نهائي',
    deleteQuestion: 'هل تريد حذف هذا التصويت وأصواته نهائيًا؟ سيراه كل من يشاهده يختفي.',
    keep: 'الإبقاء عليه',
    deleteForGood: 'حذف نهائي',
    deletedToast: 'تم حذف التصويت.',
  },

  invitations: {
    heading: 'الدعوات',
    count: (count: number) => counted(count, { one: 'دعوة واحدة', two: 'دعوتان', few: 'دعوات', many: 'دعوة', other: 'دعوة' }),
    used: (used: number, count: number) => `استُخدم ${number(used)} من ${number(count)}`,
    hint: 'لا يصوّت إلا من تدعوهم، كلٌّ برابط خاص به صالح لصوت واحد. ترى أي الروابط استُخدمت، '
      + 'ولا ترى أبدًا ما اختاره أي شخص. يمكنك أنت التصويت دون دعوة.',
    invite: 'دعوة',
    inviting: 'جارٍ الدعوة…',
    inviteSomeone: 'دعوة شخص',
    namePlaceholder: 'الاسم أو اللقب (اختياري)',
    loading: 'جارٍ تحميل الدعوات…',
    showMore: 'عرض المزيد',
    newestShown: (count: number) => `تُعرض أحدث ${number(count)}.`,
    invitationFor: (label: string) => `دعوة إلى ${label}`,
    invitationNumber: (n: number) => `الدعوة ${number(n)}`,
    shareHint: 'لهذا الشخص وحده. تتضمن صوتًا واحدًا لا يستطيع تغييره إلا المتصفح الذي يصوّت منه.',
    linkLabel: 'رابط الدعوة',
    message: (title: string) => `أنت مدعوّ للتصويت في «${title}». هذا الرابط لك وحدك.`,
    isUsed: 'مستخدمة',
    notUsedYet: 'لم تُستخدم بعد',
    share: (name: string) => `مشاركة رابط ${name}`,
    takeBack: (name: string) => `سحب رابط ${name}`,
    takeBackQuestion: 'هل تريد سحب هذه الدعوة؟ سيتوقف رابطها عن العمل.',
    keep: 'الإبقاء عليها',
    takeItBack: 'سحبها',
  },

  share: {
    share: 'مشاركة',
    title: 'مشاركة هذا التصويت',
    anyone: 'يستطيع أي شخص لديه الرمز أو الرابط التصويت.',
    unlisted: 'التصويت غير مدرج في أي مكان آخر.',
    linkLabel: 'رابط التصويت',
    joinCode: 'رمز الانضمام',
    toEnterAt: (host: string) => `لإدخاله في ${host}`,
    copy: 'نسخ',
    copied: 'تم النسخ',
    copyCode: 'نسخ رمز الانضمام',
    qrCode: (url: string) => `رمز QR لـ ${url}`,
    throughAnApp: 'المشاركة عبر تطبيق',
    byEmail: 'الإرسال بالبريد الإلكتروني',
    message: (title: string) => `صوّت في «${title}»`,
    orCode: (code: string, host: string) => `أو أدخل الرمز ${code} في ${host}.`,
  },

  statistics: {
    title: 'الإحصاءات · super-vote',
    heading: <><AppName /> حول العالم</>,
    lead: 'كم عدد التصويتات والأصوات والزوار، ومتى، ومن أين.',
    show: 'عرض',
    measures: {
      voters: {
        label: 'الزوار', plural: 'زوار',
        noun: (count: number) => noun(count, { singular: 'زائر', dual: 'زائرين', few: 'زوار', many: 'زائرًا' }),
        count: (count: number) => counted(count, VISITORS),
      },
      polls: {
        label: 'التصويتات', plural: 'تصويتات',
        noun: (count: number) => noun(count, { singular: 'تصويت', dual: 'تصويتين', few: 'تصويتات', many: 'تصويتًا' }),
        count: (count: number) => counted(count, POLLS),
      },
      ballots: {
        label: 'الأصوات', plural: 'أصوات',
        noun: (count: number) => noun(count, { singular: 'صوت', dual: 'صوتين', few: 'أصوات', many: 'صوتًا' }),
        count: (count: number) => counted(count, BALLOTS),
      },
    },
    totals: {
      polls: 'التصويتات المنشأة',
      openPolls: 'المفتوحة الآن',
      ballots: 'الأصوات المُدلى بها',
      voters: 'الزوار',
    },
    lastDays: 'خلال آخر ٩٠ يومًا',
    where: 'أين',
    byRegion: 'حسب المنطقة',
    noRegion: 'لا توجد منطقة بعد.',
    tapADot: 'اضغط على نقطة لترى أرقامها.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'غير معروضة في أي منطقة، لعدم توفر منطقة زمنية '
      + `أو عدد كافٍ من الناس لعرضها: ${visitors}، ${polls} و${ballots}.`,
    howCounted: 'كيف تُحتسب',
    howCountedText: <>
      الزائر هو متصفح أو تطبيق جاء إلى <AppName />: شخص واحد بجهازين يُحتسب مرتين. ويُحتسب الصوت مرة واحدة، مهما غيّره صاحبه.
    </>,
    places: (updated: string) => 'تأتي الأماكن من المنطقة الزمنية المضبوطة على جهازك، لا من عنوانك أبدًا، ولا '
      + 'تُحفظ إلا المجاميع. يظهر المكان عندما يأتي منه ثلاثة زوار. تُحدَّث الأرقام كل ساعة، '
      + 'حتى لا يمكن مطابقتها مع أصوات تصويت واحد فور وصولها. '
      + `آخر تحديث ${updated}.`,
    sources: <>
      كل نقطة هي المدينة التي تحمل المنطقة الزمنية اسمها، وتمثّل كل من في تلك المنطقة. الأيام بالتوقيت العالمي المنسّق. اليابسة
      من <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>، والمناطق الزمنية
      من <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">قاعدة بيانات IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <>{day}: <strong>{count}</strong> {noun}</>,
    overLastDays: (counts: string, days: number) => `${counts} خلال آخر ${number(days)} يومًا`,
    busiest: (day: string, count: string) => `، والأكثر في ${day}: ${count}.`,
    topLine: (count: string) => `الأعلى: ${count}`,
    regionAndCity: 'المنطقة والمدينة',
    map: (what: string) => `خريطة العالم لـ${what} حسب المنطقة الزمنية. يعرض الجدول أدناه الأرقام نفسها.`,
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    nothingYet: 'لا يوجد مكان لعرضه بعد.',
    fewer: 'أقل',
    upTo: (count: string) => `حتى ${count}`,
    pollPlaces: 'من أين تأتي الأصوات',
    pollPlacesNone: 'تظهر المنطقة عندما تأتي منها ثلاثة أصوات.',
    pollPlacesHint: 'بحسب المنطقة الزمنية لكل مصوّت، لا عنوانه أبدًا. يظهر المكان عندما تأتي منه ثلاثة أصوات، '
      + 'وتُحدَّث الأرقام كل ساعة.',
    regions: {
      Africa: 'أفريقيا',
      America: 'الأمريكتان',
      Antarctica: 'القارة القطبية الجنوبية',
      Arctic: 'القطب الشمالي',
      Asia: 'آسيا',
      Atlantic: 'جزر الأطلسي',
      Australia: 'أستراليا',
      Europe: 'أوروبا',
      Indian: 'المحيط الهندي',
      Pacific: 'المحيط الهادئ',
    } as Record<string, string>,
  },

  about: {
    title: 'حول · super-vote',
    heading: <>حول <AppName /></>,
    lead: (days: number) => <>
      طريقة مجانية ومفتوحة المصدر لتقرّر مجموعة معًا: أين تأكل، وأين تذهب، وماذا تختار. بلا حساب،
      بلا إعلانات، بلا تتبّع. تُحذف التصويتات بعد {number(days)} يومًا من إنشائها.
    </>,
    howDecided: 'كيف تُحدَّد النتائج',
    howDecidedText: <>
      الاختيار الواحد يضيّع معظم ما يفكّر فيه الناس: فالخيارات المتشابهة تقتسم مؤيديها، وقد يخسر خيار يراه
      الجميع مقبولًا أمام خيار تكرهه نصف المجموعة. يطلب <AppName /> أكثر من ذلك، بطريقتين.
    </>,
    majorityJudgment: 'الحكم بالأغلبية',
    majorityJudgmentText: <>
      يقيّم كل مصوّت كل خيار، من <em>ممتاز</em> إلى <em>سيئ</em>. و<strong>تقدير الأغلبية</strong> لخيار ما
      هو أفضل تقدير يمنحه له أكثر من نصف المصوّتين أو يمنحونه ما هو أعلى منه: أي وسيطه. يفوز الخيار الذي له
      أفضل تقدير بالأغلبية. وإذا اشترك عدة خيارات فيه، تحسم <strong>درجة GMJ</strong> بينها: فهي تقيس مدى ميل
      التقديرات فوق ذلك التقدير أو تحته. أما الخيارات التي ما زالت متساوية فتُعرض <em>متعادلة</em>، ولا تختار
      أي قاعدة خفية واحدًا منها.
    </>,
    approval: 'التصويت بالموافقة',
    approvalText: 'يضع كل مصوّت علامة على كل خيار يرضى عنه. يفوز الخيار الذي وافق عليه أكبر عدد من المصوّتين. وهو سريع، '
      + 'ولا يعاقبك أبدًا على تأييد أكثر من خيار.',
    science: 'العلم وراء ذلك',
    scienceText: 'لا توجد قاعدة تصويت مثالية: فقد رأى كوندورسيه عام ١٧٨٥ أن مجموعة قد تفضّل أ على ب، وب على ج، وج على أ، '
      + 'وأن كل قاعدة معقولة يمكن التلاعب بها. والتقييم بدلًا من الترتيب يتفادى الكثير من ذلك، '
      + 'كما يعرف محكّمو النبيذ وحكّام التزلج الفني.',
    notes: {
      pnas2007: 'يقدّم الحكم بالأغلبية: قيّم، ثم رتّب حسب الدرجة الوسيطة.',
      book2011: 'الكتاب: النظرية وخصائصها، وانتخابات وهيئات محلفين حقيقية.',
      judge2014: 'لماذا يتفادى التقييم مفارقات الترتيب، ويقاوم التلاعب.',
      fabre2021: <>درجة «الحكم المعتاد» التي يستخدمها <AppName /> لحسم التعادل بين تقديرات الأغلبية المتساوية.</>,
      brams1978: 'الحجة لصالح الموافقة على كل خيار مقبول.',
      laslier2009: 'كيف يصوّت الناس بشكل استراتيجي في التصويت بالموافقة، وما ينتج عن ذلك.',
      gibbard1973: 'مع ساترثويت: كل قاعدة تصويت معقولة يمكن التلاعب بها. والسؤال هو إلى أي مدى.',
      satterthwaite1975: 'النتيجة نفسها، توصّل إليها باحث آخر بشكل مستقل.',
    },
    whoMakesIt: 'من يصنعه',
    whoMakesItText: <>
      يصنع <AppName /> شخص واحد في كيبيك في وقت فراغه، وهو مجاني للجميع. شيفرته مفتوحة:
      يستطيع أي شخص قراءة كيفية احتساب الأصوات، أو تشغيل نسخته الخاصة، أو اقتراح تغيير.
    </>,
    seeTheCode: 'عرض الشيفرة المصدرية على GitHub',
  },

  privacy: {
    title: 'الخصوصية والحدود · super-vote',
    heading: 'الخصوصية والحدود',
    lead: <>
      صُمّم <AppName /> بحيث لا يستطيع أحد معرفة ما اخترته. وهنا ما يحتفظ به، ومن يرى ماذا، وما لا يستطيعه
      بعد.
    </>,

    forWhat: 'فيمَ يُستخدم',
    forWhatText: 'اتخاذ القرارات معًا بين أناس يثق بعضهم ببعض: أصدقاء، عائلة، فريق، صف دراسي، '
      + 'جمعية. وهو غير مناسب للانتخابات، ولا لأي تصويت له عواقب قانونية أو مالية أو رسمية: '
      + 'فهذه تتطلب التحقق من هوية كل مصوّت واحتسابه مرة واحدة، ونتائج يستطيع أي شخص التحقق منها، '
      + 'وهذا ما لا يستطيع super-vote الوعد به بعد.',

    kept: 'ما يُحفظ، ولكم من الوقت',
    keptItems: (days: number) => [
      `تصويت: سؤاله وخياراته وإعداداته، حتى يُحذف، بعد ${number(days)} يومًا من إنشائه على أبعد تقدير. `
        + 'ويستطيع من أنشأه حذفه قبل ذلك.',
      'صوتك في تصويت، يُحفظ بمفتاح لا يدل على هويتك، ويُحذف مع التصويت. ويمكنك '
        + 'سحبه حتى يُغلق التصويت.',
      'الاسم الذي تكتبه، في التصويتات التي تُظهر الأسماء، يُحفظ بمعزل عن صوتك حتى لا يربط شيء بينهما.',
      'نسخ من التصويتات والأصوات والأسماء المذكورة أعلاه، تؤخذ كل ليلة للتعافي من حادث، وتُحفظ 7 أيام: '
        + 'وما يُحذف يختفي منها خلال أسبوع.',
      `معرّف عشوائي في ملف تعريف ارتباط، ليتمكن هذا المتصفح من تغيير أصواته وإدارة تصويتاته، مدة ${number(days)} `
        + 'يومًا بعد آخر صوت أو تصويت له، ما دام تصويت قائمًا. وهو ملف تعريف الارتباط الوحيد: بلا إعلانات، بلا تحليلات، '
        + 'بلا تتبّع.',
      'المنطقة الزمنية لجهازك (Europe/Paris مثلًا)، تُضاف إلى الإحصاءات مجاميعَ فقط. ولا يُستخدم عنوانك أبدًا.',
      'عنوان شبكتك، يُحتفظ به في الذاكرة يومًا واحدًا على الأكثر، للحد من عدد التصويتات التي تنشئها كل شبكة. '
        + 'ولا يُكتب أبدًا.',
      'إعداداتك وآخر اسم كتبته، في هذا المتصفح فقط.',
      'كل ما يحتفظ به الخادم موجود على جهاز واحد في مونتريال بكندا، وهي دولة يعترف الاتحاد الأوروبي بأنها '
        + 'توفر حماية كافية للبيانات الشخصية.',
    ],

    whoSees: 'من يرى ماذا',
    whoSeesItems: [
      'يرى الجميع في تصويت ما النتائج مجاميعَ، حين يختار من أنشأه إظهارها، والأسماء التي '
        + 'اختار المصوّتون كتابتها.',
      'يرى من أنشأ التصويت الأمر نفسه، ويرى كذلك أي الدعوات استُخدمت: ولا يرى أبدًا ما اختاره أي شخص.',
      'لا يرى أحد صوتك. حتى على شاشتك أنت، يبدأ مخفيًا بعد احتسابه.',
      'من يشغّل الخادم يرى الطلبات لحظة حدوثها. وما يُحفظ لا يقول من اختار ماذا، '
        + 'لكن super-vote لا يخفي الأصوات عن الخادم أثناء عمله: ونثق بأن من يشغّله لن ينظر.',
    ],

    limits: 'حدود ينبغي معرفتها',
    limitsItems: [
      'من دون دعوات، يستطيع شخص واحد التصويت عدة مرات من متصفحات أو أجهزة مختلفة. يعتمد super-vote '
        + 'على حسن النية، ويكشف عدد الأصوات الإساءة. ولاحتساب كل شخص مرة واحدة، قم بدعوته.',
      'أصواتك وتصويتاتك تخص هذا المتصفح. ومن جهاز آخر، أو بعد مسح بياناته، لن تستطيع '
        + 'تغييرها أو إدارتها، ولا يوجد حساب لاستعادتها.',
      'تتحرك النتائج المباشرة مع وصول كل صوت: وفي مجموعة صغيرة يستطيع المتابعون معرفة من اختار '
        + 'ماذا. ويختار من ينشئ التصويت متى تظهر النتائج، ويتلقى تحذيرًا.',
      'لا يمكن التحقق من الإحصاء بشكل مستقل: فأنت تثق بالخادم، الذي شيفرته مفتوحة لقراءة أي شخص.',
      'super-vote مجاني ويعمل على خادم صغير: وقد يكون غير متاح أحيانًا. لا تعتمد عليه '
        + 'في أي أمر عاجل.',
    ],

    rights: 'بياناتك، خياراتك',
    rightsText: 'أصواتك غير مرتبطة بك، لذا لا يستطيع super-vote العثور عليها من أجلك: اسحب صوتًا، أو '
      + 'احذف تصويتًا أنشأته، من هذا المتصفح. ومسح بيانات هذا المتصفح الخاصة بـ super-vote يزيل '
      + 'ملف تعريف الارتباط والإعدادات.',
    contact: <>
      أسئلة، أو طلب يخص بياناتك، أو تصويت تريد الإبلاغ عنه:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">راسلنا على GitHub</a>.
      وبشأن ثغرة أمنية: راجع{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">سياسة الأمان</a>.
    </>,
    openSource: <>
      لا شيء هنا يُؤخذ على الثقة وحدها: فشيفرة <AppName />، بما فيها الإحصاء وحماية الأصوات،{' '}
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">مفتوحة لقراءة أي شخص</a>.
    </>,
  },

  legal: {
    title: 'الإشعار القانوني · super-vote',
    heading: 'الإشعار القانوني',
    publisher: 'الناشر',
    publisherText: <>
      ينشر <AppName /> شخص طبيعي في كيبيك بكندا، دون غرض تجاري. ولا يُذكر اسمه وعنوانه هنا:
      فهما لدى المضيف.
    </>,
    law: 'القانون الواجب التطبيق',
    lawText: <>
      يُنشر <AppName /> من كيبيك، بموجب قوانين كيبيك وكندا. وهو مفتوح للناس في كل مكان،
      ومن ينشئ تصويتًا أو يصوّت في تصويت يخضع كذلك لقوانين المكان الذي يوجد فيه.
      وما يحتفظ به <AppName /> عنك ولماذا هو نفسه للجميع، أينما كانوا:{' '}
      <Link to="/privacy">الخصوصية والحدود</Link>.
    </>,
    host: 'المضيف',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'كندا',
    ],
    hostPhone: (phone: ReactNode) => <>الهاتف: {phone}</>,
    report: 'الإبلاغ عن تصويت',
    reportText: <>
      يكتب التصويتات من ينشئونها. للإبلاغ عن تصويت يخالف القانون، بسبب عنوانه أو خياراته
      أو اسم أحد المصوّتين:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">راسلنا على GitHub</a>.
      يُنظر في كل بلاغ بسرعة، ويُزال ما كان مخالفًا للقانون.
    </>,
  },
};
