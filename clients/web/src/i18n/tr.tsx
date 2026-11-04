/**
 * Everything the web app says, in Turkish: en.tsx, translated. Voters are
 * addressed as «siz»; a poll is an «oylama», a ballot an «oy». A noun after a
 * number stays singular («5 oy»), so counts need no plural forms.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('tr', count);
const counted = (count: number, noun: string) => `${number(count)} ${noun}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return counted(count, unit === 'minute' ? 'dakika' : 'saat');
}

export const tr: Messages = {
  number,
  percent: (share: number) => formatPercent('tr', share),
  decimal: (value: number, digits: number) => formatDecimal('tr', value, digits),
  date: (isoDate: string) => formatDate('tr', isoDate),
  moment: (isoDate: string) => formatMoment('tr', isoDate),
  day: (day: string) => formatUtcDay('tr', day),
  timeAgo: (isoDate: string) => timeAgo('tr', isoDate) ?? 'az önce',
  waitUntil: inWords,

  loading: 'Yükleniyor…',
  backHome: 'Ana sayfaya dön',
  tryAgain: 'Tekrar dene',
  close: 'Kapat',
  dismiss: 'Gizle',

  errors: {
    unexpected: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
    unreachable: 'Sunucuya ulaşılamıyor. Bağlantınızı kontrol edip tekrar deneyin.',
    failed: (status: number) => `Bir şeyler ters gitti (hata ${status}). Lütfen tekrar deneyin.`,
  },

  problems: {
    'unknown-voter': 'Bu tarayıcıyı super-vote tanımıyor. Baştan başlamak için sayfayı yenileyin.',
    'not-poll-creator': 'Bunu yalnızca oylamayı oluşturan kişi yapabilir.',
    'not-invited': 'Bu oylamada yalnızca davet edilenler oy verebilir. Davet edildiyseniz davetinizdeki bağlantıyı açın.',
    'not-admin-link': 'Bu yönetici bağlantısı bu oylamaya ait değil. Eksiksiz kopyalandığından emin olun.',
    'handover-unavailable': 'Bu bağlantı oylamayı devredemez: zaten kullanılmış.',
    'cross-site': 'Bu istek başka bir web sitesinden geldi ve reddedildi. super-vote’u doğrudan açın.',
    'poll-not-found': 'Hiçbir oylamanın bu bağlantısı ya da kodu yok. Yanlış yazılmış olabilir ya da oylama silinmiş olabilir.',
    'poll-closed': 'Bu oylama kapandı: artık oy kabul etmiyor.',
    'invitation-used': 'Biri bu davetle zaten oy verdi, başka bir tarayıcıda ya da başka bir cihazda.',
    'collision': 'Bu değişiklik, aynı anda yapılan başka bir değişiklikle çakıştı. Lütfen tekrar deneyin.',
    'too-many-polls': (wait: string) => 'Bu bağlantı bugünkü oylamalarını oluşturdu. Herkese adil davranmak için '
      + `her bağlantı günde birkaç oylama oluşturabilir: ${wait} sonra yenilerini oluşturabilirsiniz.`,
    'too-many-wrong-codes': (wait: string) => 'Bu bağlantıdan çok fazla yanlış kod geldi: oylamaları tahmin '
      + `denemelerinden korumak için kodları önümüzdeki ${wait} boyunca reddedilecek. Bağlantılar çalışmaya devam eder.`,
    'server-error': 'Bizim tarafta bir şeyler ters gitti. Lütfen birazdan tekrar deneyin.',
  },

  mentions: {
    Excellent: 'Mükemmel',
    VeryGood: 'Çok iyi',
    Good: 'İyi',
    Fair: 'Fena değil',
    Passable: 'Geçer',
    Inadequate: 'Yetersiz',
    Bad: 'Kötü',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Çoğunluk yargısı',
    APPROVAL: 'Onay oylaması',
  },

  visibilities: {
    PUBLIC: 'Herkese açık',
    UNLISTED: 'Özel',
  },

  app: {
    home: 'Ana sayfa',
    settings: 'Ayarlar',
    footer: <><AppName /> ücretsiz ve açık kaynaklıdır.</>,
    footerLinks: 'super-vote hakkında',
    about: 'Hakkında ve arkasındaki bilim',
    privacy: 'Gizlilik ve sınırlar',
    legal: 'Yasal bildirim',
    statistics: 'İstatistikler',
    sourceCode: 'Kaynak kodu',
    notFound: 'Sayfa bulunamadı',
    nothingHere: 'Bu adreste hiçbir şey yok.',
  },

  settings: {
    language: 'Dil',
    appearance: 'Görünüm',
    light: 'Açık',
    automatic: 'Otomatik',
    dark: 'Koyu',
    mentionColours: 'Değerlendirme renkleri',
    greenToRed: 'Yeşilden kırmızıya',
    shadesOfGrey: 'Gri tonları',
    shadesOfGreyHint: 'Gri tonları hangi renkleri görürseniz görün aynı okunur: ne kadar açıksa o kadar iyi.',
    majorityJudgmentBallot: 'Çoğunluk yargısı oy pusulası',
    colourScale: 'Renk ölçeği',
    dropdowns: 'Açılır listeler',
    castingYourBallot: 'Oyunuzu verme',
    live: 'Anında',
    envelope: 'Zarf',
    liveHint: 'Her değişiklik yaptığınız anda sayılır.',
    envelopeHint: 'Oy pusulanızı doldurun, sonra hepsini bir seferde gönderin.',
  },

  home: {
    title: 'super-vote · birlikte karar verin',
    lead: 'Matematik, bunun daha adil olduğunu söylüyor.',
    createQuestion: 'Bir oylama mı yapmanız gerekiyor?',
    createPoll: 'Birlikte karar verelim!',
    yourPolls: 'Birlikte karar verin…',
    publicPolls: 'Herkese açık oylamalar',
    noPublicPolls: 'Henüz herkese açık oylama yok.',
    public: 'Herkese açık',
    closed: 'Kapalı',

    howItWorks: 'Nasıl çalışır',
    steps: [
      { title: 'Sorun', text: 'Bir soru ve seçenekleri.' },
      { title: 'Paylaşın', text: 'Bir bağlantı, bir QR kodu ya da bir kod.' },
      { title: 'Karar verin', text: 'Herkes puanlar, sonuçlar canlı gelir.' },
    ],

    agent: {
      title: 'Yapay zekâya hazır',
      text: 'Bunu, web’de gezinebilen bir asistana, kendi sorunuzla birlikte yapıştırın.',
      prompt: (site: string, guide: string) => `${site} ile ekibim için bir oylama oluştur (ajanlar için `
        + `yönergeler: ${guide}). Soru: “Ekip gezisini nerede yapalım?” Seçenekler: Lizbon, Berlin, `
        + 'Barselona. Çoğunluk yargısını kullan ve ben oylamayı kapatana kadar sonuçları gizli tut. '
        + 'Oylamayı bana devret, sonra ekiple paylaşacağım bağlantıyı ver.',
      copy: 'Metni kopyala',
      copied: 'Metin kopyalandı',
      caption: 'İki bağlantıyla yanıt verir: oylamayı kendinize almak için ilkini açın, ikincisini gruba gönderin.',
    },

    systems: {
      title: 'Karar vermenin iki yolu',
      majorityJudgment: {
        title: 'Çoğunluk yargısı',
        text: 'Her seçeneği Mükemmel’den Kötü’ye kadar puanlayın. En iyi çoğunluk notu kazanır.',
      },
      approval: {
        title: 'Onay',
        text: 'Kabul edeceğiniz her seçeneği işaretleyin. En çok işaretlenen kazanır.',
      },
    },

    compare: {
      title: 'Çoğu resmî seçimden daha adil',
      text: 'Çoğu seçim tek bir isim ister. Benzer adaylar seçmenlerini böler ve çoğunluğun reddettiği biri yine '
        + 'de kazanabilir. Michel Balinski ve Rida Laraki’nin araştırmalarından doğan çoğunluk yargısı ise herkesin '
        + 'her seçenek hakkında ne düşündüğünü ölçer.',
      science: 'Arkasındaki bilim',
      single: 'Tek seçim',
      singleNote: 'çoğu seçim',
      approval: 'Onay',
      majorityJudgment: 'Çoğunluk yargısı',
      criteria: {
        nuance: 'Her seçenek hakkında ne düşündüğünüzü söyleyin',
        splitting: 'Benzer seçenekler oyu bölmez',
        lesserEvil: 'Daha az kötüye oy vermek yok',
        tactics: 'Manipüle etmesi zor',
        quick: 'Doldurması hızlı',
        familiar: 'Tanıdık',
      },
      marks: { yes: 'Evet', partly: 'Kısmen', no: 'Hayır' },
      caption: <><AppName /> onay ve çoğunluk yargısı sunar. Hiçbir oylama kuralı kusursuz değildir, ama bazıları
        diğerlerinden çok daha adildir.</>,
    },

    supportTitle: 'Ücretsiz, açık kaynak, reklamsız',
    supportText: 'Ürün siz değilsiniz: amaç daha iyi oylama sistemlerini tanıtmak. Tek bir kişi tarafından, boş '
      + 'zamanında yapıldı. Grubunuzun karar vermesine yardımcı olduysa, siz de ona yardım edebilirsiniz.',

    limitsTitle: 'Bilmekte fayda var',
    limits: {
      everyday: <><strong>Günlük kararlar için,</strong> resmî seçimler için değil: hesap olmadığından biri başka bir
        tarayıcıdan yeniden oy verebilir. Davetler herkesi yalnızca bir kez sayar.</>,
      private: <><strong>Özel, ama sunucudan gizli değil.</strong> Başka kimse oyunuzu görmez ve saklanan oylar
        kimin verdiğini söylemez.</>,
      browser: (days: number) => <><strong>Bu tarayıcıya bağlı:</strong> tek bir çerezle, son oyunuzdan ya da oylamanızdan
        sonra {days} gün saklanır. Reklam yok, izleme yok.</>,
      deleted: (days: number) => <><strong>{days} gün sonra silinir:</strong> hem oylamalar hem oylar.</>,
      disclaimer: <><strong>Garanti yok.</strong> <AppName /> daha iyi oylama yollarını savunur. Tek bir kişi tarafından
        güvenlik, gizlilik, performans, mimari ve kod kalitesine azami özenle yapılır, ancak akredite edilmemiş,
        denetlenmemiş ve bağımsız olarak gözden geçirilmemiştir: sonuçlarının doğru olduğu ya da bir grubun
        iradesini gerçekten yansıttığı garanti edilmez. Bunun için akreditasyon, teknik tarafın uzman incelemesi ve
        sürekli destek gerekir; tek bir kişi sponsorlar ve uzmanlar olmadan bunları sağlayamaz.</>,
    },
    limitsLink: 'Gizlilik ve sınırlar hakkında her şey',
  },
  join: {
    label: 'Kodunuz var mı?',
    typeTheCode: 'Size verilen kodu yazın.',
    notACode: 'Bir kod altı harf ve rakamdan oluşur, örneğin K7M-4QX.',
    joining: 'Katılınıyor…',
    join: 'Oy ver!',
  },

  newPoll: {
    title: 'Birlikte karar verin · super-vote',
    heading: 'Birlikte karar verin',
    question: 'Soru',
    questionPlaceholder: 'Cuma günü nerede yemek yiyelim?',
    options: 'Seçenekler',
    option: (row: number) => `Seçenek ${row}`,
    remove: (option: string) => `${option} seçeneğini kaldır`,
    optionsHint: (max: number) => `En fazla ${max} seçenek. Yazdıkça yeni bir satır belirir.`,

    votingSystem: 'Oylama sistemi',
    systems: {
      MAJORITY_JUDGMENT: 'Çoğunluk yargısı',
      APPROVAL: 'Onay',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Oy verenler her seçeneği Mükemmel’den Kötü’ye kadar puanlar. Çoğunluğun en iyi puanladığı '
        + 'seçenek kazanır: ince ayrımlı ve manipüle etmesi zor.',
      APPROVAL: 'Oy verenler kabul edecekleri her seçeneği işaretler. En çok onaylanan seçenek kazanır: hızlı ve basit.',
    },

    whoCanFindIt: 'Kimler bulabilir',
    visibilityHints: {
      PUBLIC: 'Ana sayfada listelenir, herkes bulabilir.',
      UNLISTED: 'Hiçbir yerde listelenmez: yalnızca bağlantıyı ya da kodu paylaştığınız kişiler bulabilir.',
    },

    whoCanVote: 'Kimler oy verebilir',
    anyone: 'Herkes',
    invitedOnly: 'Yalnızca davetliler',
    anyoneHint: <>
      Bağlantıya ya da koda sahip herkes. Kararlı biri başka bir tarayıcıdan yeniden oy verebilir: herkesi yalnızca
      bir kez saymak için onları davet edin.
    </>,
    invitedHint: 'Her kişi, bir oy için geçerli kendi bağlantısını alır. Hangi bağlantıların kullanıldığını görürsünüz, '
      + 'kimsenin ne seçtiğini asla.',

    whoVoted: 'Kimler oy verdi',
    anonymous: 'Anonim',
    showNames: 'İsimleri göster',
    anonymousHint: 'Kimse kimin oy verdiğini görmez, yalnızca kaç kişinin verdiğini görür.',
    showNamesHint: 'Oy verenler bir isim verebilir, sonuçların altında gösterilir. Kimse kimin neyi seçtiğini görmez.',

    results: 'Sonuçlar',
    resultsChoices: {
      LIVE: 'Canlı',
      AFTER_BALLOTS: 'Gecikmeli',
      AFTER_CLOSING: 'Kapanışta',
    },
    resultsHints: {
      LIVE: 'Dikkat: herkes her oyun sonuçları nasıl oynattığını görür. Küçük bir grupta bu, kimin neyi seçtiğini gösterir.',
      AFTER_BALLOTS: 'İlk oy verenleri korumak için o kadar oy gelene kadar gizli kalır. Ondan sonra her oy sonuçları '
        + 'oynatır; bu, daha sonra oy veren birini yine de ele verebilir.',
      AFTER_CLOSING: 'Oylamayı kapattığınızda gösterilir. O zamana kadar herkes yalnızca kaç kişinin oy verdiğini görür.',
    },
    ballotsBeforeResults: 'Sonuçlar gösterilmeden önceki oy sayısı',

    optionOrder: 'Seçeneklerin sırası',
    orders: {
      ALPHABETICAL: 'A’dan Z’ye',
      SHUFFLED: 'Karışık',
      AS_WRITTEN: 'Yazıldığı gibi',
    },
    orderHints: {
      ALPHABETICAL: 'A’dan Z’ye, sayılar değerine göre: 2, 10’dan önce. Tarihleri yıl önce gelecek şekilde yazın, örneğin 2026-10-24.',
      SHUFFLED: 'Her kişi için her ziyarette yeni bir sıra; böylece hiçbir seçenek yerinden kazanç sağlamaz.',
      AS_WRITTEN: 'Sizin sıranız. İlk sıralar daha çok destek çeker; bu yüzden sonucu etkileme girişimi gibi görünebilir.',
    },

    deletedAfter: (days: number) => `Oylamalar, oluşturulmalarından ${days} gün sonra oylarıyla birlikte silinir.`,
    notForElections: <>
      <AppName /> günlük kararlar içindir; resmî ya da bağlayıcı oylamalar için değil.{' '}
      <Link to="/privacy">Gizlilik ve sınırlar</Link>
    </>,
    noNewPolls: 'Bu sunucu şu anda yeni oylama kabul etmiyor.',
    creating: 'Oluşturuluyor…',
    create: 'Soruyu sor',

    problems: {
      titleMissing: 'Oylamanıza bir başlık verin.',
      titleTooLong: (max: number) => `Bir başlık en fazla ${max} karakter uzunluğunda olabilir.`,
      titleInvisible: 'Bir başlık yalnızca görünür karakterler içerebilir.',
      tooFewOptions: 'En az iki seçenek ekleyin.',
      tooManyOptions: (max: number) => `Bir oylamada en fazla ${max} seçenek olabilir.`,
      optionTooLong: (max: number) => `Bir seçenek en fazla ${max} karakter uzunluğunda olabilir.`,
      optionInvisible: 'Bir seçenek yalnızca görünür karakterler içerebilir.',
      optionTwice: (option: string) => `“${option}” iki kez listelenmiş. Her seçenek farklı olmalı.`,
      resultsAfterBallots: (min: number) => `En az ${min} olmak üzere tam sayı bir oy sayısı seçin.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Bu oylama devralınıyor…',
    deleted: 'Bu oylama silindi',
    deletedText: 'Silindi, sonuçları da onunla birlikte.',
    notFound: 'Oylama bulunamadı',
    notFoundText: 'Bağlantı eksik olabilir ya da oylama silinmiş olabilir.',
    notLoaded: 'Oylama yüklenemedi',
    loadingPoll: 'Oylama yükleniyor…',
    byInvitation: 'Davetle',
    optionOrder: { SHUFFLED: 'Seçenekler karışık', ALPHABETICAL: 'Seçenekler sıralı', AS_WRITTEN: 'Seçenekler yazıldığı sırada' },
    closed: 'Kapalı',
    keepTitle: 'Yönetici bağlantınızı saklayın',
    keepText: 'Bu oylamayı buradan değil başka bir tarayıcıdan ya da cihazdan yönetmek için orada açın: kapatma, '
      + 'silme, kişileri davet etme. Kendinize saklayın: ona sahip olan aynı şeyi yapabilir.',
    readyToInvite: <><strong>Oylamanız hazır.</strong> Aşağıdan kişileri davet edin: her biri kendi bağlantısını alır.</>,
    readyToShare: <><strong>Oylamanız hazır.</strong> Oy toplamak için bağlantısını paylaşın.</>,
    closedAgo: (ago: string) => `Oylama ${ago} kapandı. Bunlar nihai sonuçlar.`,
    deletedOn: (date: string) => `Bu oylama ve oyları ${date} tarihinde silinecek.`,
    lastPoll: (wait: string) => `Şimdilik son oylamanızdı: ${wait} sonra yenilerini oluşturabilirsiniz.`,
    pollsLeft: (count: number, wait: string) => `Önümüzdeki ${wait} içinde ${counted(count, 'oylama daha')} oluşturabilirsiniz.`,
    fairShare: (perDay: number) => `Herkese adil davranmak için her bağlantı günde ${perDay} oylama oluşturabilir.`,
  },

  ballot: {
    yourBallot: 'Oyunuz',
    withdraw: 'Geri çek',
    submit: 'Oyumu gönder',
    rateEveryOption: 'Göndermek için her seçeneği puanlayın',
    submitting: 'Gönderiliyor…',
    majorityJudgmentLive: 'Her seçeneğe bir değerlendirme verin. Puanlamadığınız seçenekler Kötü sayılır.',
    majorityJudgmentEnvelope: 'Her seçeneğe bir değerlendirme verin, sonra oyunuzu gönderin.',
    approval: 'Memnun kalacağınız her seçeneği işaretleyin.',
    invited: 'Davetiniz, yalnızca bu tarayıcının değiştirebileceği bir oy içerir. Sizi davet eden, kullanıldığını görür; '
      + 'ne seçtiğinizi asla.',
    counted: 'Oyunuz sayıldı. Oylama kapanana kadar bu tarayıcıdan değiştirebilirsiniz.',
    notVoted: 'Henüz oy vermediniz.',
    hide: 'Oyumu gizle',
    hidden: 'Oyunuz sayıldı ve burada gizli: bu ekrana bakan hiç kimse seçimlerinizi görmez.',
    change: 'Oyumu değiştir',
    invitationUsed: 'Bu davet zaten kullanıldı, başka bir tarayıcıda ya da başka bir cihazda. Oyu yalnızca orada '
      + 'değiştirilebilir.',
    invitationNotValid: 'Bu davet bağlantısı geçerli değil. Sizi davet eden kişiden yenisini isteyin.',
    notInvited: 'Bu oylamada yalnızca davet edilenler oy verebilir. Davet edildiyseniz davetinizdeki bağlantıyı açın.',
    yourName: 'Adınız',
    namePlaceholder: 'Anonim',
    namesGiven: 'İsteğe bağlı. Herkes verilen isimleri görür, ama seçimleri görmez.',
    namesLive: 'Canlı sonuçlar kimin neyi seçtiğine dair ipucu verebilir.',
    notRatedYet: 'Henüz puanlanmadı',
    chooseAMention: 'Bir değerlendirme seçin…',
    optionsYouApprove: 'Onayladığınız seçenekler',
  },

  results: {
    heading: 'Sonuçlar',
    ballots: (count: number) => counted(count, 'oy'),
    noBallotsYet: 'Henüz oy yok. Sonuçlar geldikçe dolar.',
    keptUntilBallots: (count: number) => `Sonuçlar ${count} oy geldiğinde gösterilir; böylece ilk oy verenlerin `
      + 'seçimleri kendilerine ait kalır.',
    keptUntilYouClose: 'Sonuçlar oylamayı kapattığınızda gösterilir.',
    keptUntilClosed: 'Sonuçlar oylama kapandığında gösterilir.',
    download: 'Sonuçları indir',
    final: 'Nihai',
    connecting: 'Bağlanılıyor…',
    live: 'Canlı',
    reconnecting: 'Yeniden bağlanılıyor…',
    whoVoted: 'Kimler oy verdi',
    anonymousVoters: (count: number) => counted(count, 'anonim kişi'),
    andAnonymousVoters: (count: number) => `ve ${counted(count, 'anonim kişi')}`,
    moreVoters: (count: number) => `ve ${counted(count, 'kişi daha')}`,
    rank: (rank: number) => `${rank}. sıra`,
    approvals: (count: number) => counted(count, 'onay'),
    noBallotsFor: (option: string) => `${option}: henüz oy yok`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `%${percent}`,
    exAequo: 'ex aequo',
    majorityMention: 'Çoğunluk notu:',
    gmjScore: 'GMJ puanı:',
    gmjScoreTitle: (score: string) => `GMJ’nin olağan yargı puanı: ${score}. Aynı çoğunluk notuna sahip seçenekler `
      + 'arasındaki eşitliği bozar.',
    orBetter: (share: string, mention: string) => `${share} “${mention}” ya da daha iyi diyor`,
  },

  owner: {
    manage: 'Oylamanızı yönetin',
    adminLink: 'Oylamanın yönetici bağlantısı',
    adminLinkHint: 'Yönetici bağlantınız: oylamayı buradan değil başka bir tarayıcıdan ya da cihazdan yönetmek için '
      + 'orada açın. Kendinize saklayın.',
    showAdminLink: 'Yönetici bağlantısını göster',
    onlyThisBrowser: 'Bu oylamayı erken kapatabilecek ya da silebilecek tek tarayıcı bu.',
    close: 'Oylamayı kapat',
    delete: 'Oylamayı sil',
    closeQuestion: 'Oylama kalıcı olarak kapatılsın mı? Artık kimse oy veremez ya da oyunu değiştiremez ve herkes nihai '
      + 'sonuçları görür.',
    keepOpen: 'Açık kalsın',
    closeForGood: 'Kalıcı olarak kapat',
    deleteQuestion: 'Bu oylama ve oyları kalıcı olarak silinsin mi? Onu izleyen herkes kaybolduğunu görür.',
    keep: 'Kalsın',
    deleteForGood: 'Kalıcı olarak sil',
    deletedToast: 'Oylama silindi.',
  },

  invitations: {
    heading: 'Davetler',
    count: (count: number) => counted(count, 'davet'),
    used: (used: number, count: number) => `${number(count)} davetten ${number(used)} tanesi kullanıldı`,
    hint: 'Yalnızca davet ettiğiniz kişiler oy verebilir; her biri bir oy için geçerli kendi bağlantısıyla. Hangi '
      + 'bağlantıların kullanıldığını görürsünüz, kimsenin ne seçtiğini asla. Siz davetsiz oy verebilirsiniz.',
    invite: 'Davet et',
    inviting: 'Davet ediliyor…',
    inviteSomeone: 'Birini davet et',
    namePlaceholder: 'Ad ya da takma ad (isteğe bağlı)',
    loading: 'Davetler yükleniyor…',
    showMore: 'Daha fazla göster',
    newestShown: (count: number) => `En yeni ${number(count)} davet gösteriliyor.`,
    invitationFor: (label: string) => `${label} için davet`,
    invitationNumber: (number: number) => `Davet ${number}`,
    shareHint: 'Yalnızca bu kişi için. Yalnızca oy verdiği tarayıcının değiştirebileceği bir oy içerir.',
    linkLabel: 'Davet bağlantısı',
    message: (title: string) => `“${title}” oylamasında oy vermeye davet edildiniz. Bu bağlantı yalnızca size özel.`,
    isUsed: 'Kullanıldı',
    notUsedYet: 'Henüz kullanılmadı',
    share: (name: string) => `${name} için bağlantıyı paylaş`,
    takeBack: (name: string) => `${name} için bağlantıyı geri al`,
    takeBackQuestion: 'Bu davet geri alınsın mı? Bağlantısı çalışmaz hâle gelir.',
    keep: 'Kalsın',
    takeItBack: 'Geri al',
  },

  share: {
    share: 'Paylaş',
    title: 'Bu oylamayı paylaş',
    anyone: 'Koda ya da bağlantıya sahip herkes oy verebilir.',
    unlisted: 'Oylama başka hiçbir yerde listelenmez.',
    linkLabel: 'Oylamanın bağlantısı',
    joinCode: 'Katılım kodu',
    toEnterAt: (host: string) => `${host} adresinde girmek için`,
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    copyCode: 'Katılım kodunu kopyala',
    qrCode: (url: string) => `${url} için QR kodu`,
    throughAnApp: 'Bir uygulama ile paylaş',
    byEmail: 'E-posta ile gönder',
    message: (title: string) => `“${title}” oylamasında oy verin`,
    orCode: (code: string, host: string) => `Ya da ${host} adresinde ${code} kodunu girin.`,
  },

  statistics: {
    title: 'İstatistikler · super-vote',
    heading: <>Dünyada <AppName /></>,
    lead: 'Kaç oylama, oy ve ziyaretçi; ne zaman ve nereden.',
    show: 'Göster',
    measures: {
      voters: {
        label: 'Ziyaretçiler', plural: 'ziyaretçi',
        noun: () => 'ziyaretçi',
        count: (count: number) => counted(count, 'ziyaretçi'),
      },
      polls: {
        label: 'Oylamalar', plural: 'oylama',
        noun: () => 'oylama',
        count: (count: number) => counted(count, 'oylama'),
      },
      ballots: {
        label: 'Oylar', plural: 'oy',
        noun: () => 'oy',
        count: (count: number) => counted(count, 'oy'),
      },
    },
    totals: {
      polls: 'Oluşturulan oylamalar',
      openPolls: 'Şu anda açık',
      ballots: 'Verilen oylar',
      voters: 'Ziyaretçiler',
    },
    lastDays: 'Son 90 günde',
    where: 'Nerede',
    byRegion: 'Bölgeye göre',
    noRegion: 'Henüz bölge yok.',
    tapADot: 'Sayılarını görmek için bir noktaya dokunun.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Hiçbir bölgede gösterilmiyor; saat dilimi '
      + `ya da göstermeye yetecek kişi olmadığı için: ${visitors}, ${polls} ve ${ballots}.`,
    howCounted: 'Nasıl sayılıyor',
    howCountedText: <>
      Ziyaretçi, <AppName /> sitesine gelen bir tarayıcı ya da uygulamadır: iki cihazı olan bir kişi iki kez sayılır.
      Bir oy, sahibi onu kaç kez değiştirirse değiştirsin bir kez sayılır.
    </>,
    places: (updated: string) => 'Yerler, cihazınızın ayarlı olduğu saat diliminden gelir, adresinizden asla, ve yalnızca '
      + 'toplamlar saklanır. Bir yer, oradan üç ziyaretçi geldiğinde görünür. Sayılar her saat güncellenir; '
      + 'böylece bir oylamanın oyları geldikçe onlarla eşleştirilemezler. '
      + `Son güncelleme: ${updated}.`,
    sources: <>
      Her nokta, bir saat diliminin adını aldığı şehirdir ve o dilimdeki herkesi temsil eder. Günler UTC’dir. Kara
      verileri <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>’ten, saat
      dilimleri <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">IANA veritabanı</a>’ndan.
    </>,
    onDay: (count: string, noun: string, day: string) => <>{day}: <strong>{count}</strong> {noun}</>,
    overLastDays: (counts: string, days: number) => `Son ${days} günde ${counts}`,
    busiest: (day: string, count: string) => `, en çok ${day} günü: ${count}.`,
    topLine: (count: string) => `Zirve: ${count}`,
    regionAndCity: 'Bölge ve şehir',
    map: (what: string) => `Saat dilimine göre ${what} dünya haritası. Aşağıdaki tablo aynı sayıları listeler.`,
    zoomIn: 'Yakınlaştır',
    zoomOut: 'Uzaklaştır',
    nothingYet: 'Gösterilecek yer henüz yok.',
    fewer: 'daha az',
    upTo: (count: string) => `en fazla ${count}`,
    pollPlaces: 'Oylar nereden geliyor',
    pollPlacesNone: 'Bir bölge, oradan üç oy geldiğinde görünür.',
    pollPlacesHint: 'Her oy verenin saat diliminden, adresinden asla. Bir yer, oradan üç oy geldiğinde görünür ve '
      + 'sayılar her saat güncellenir.',
    regions: {
      Africa: 'Afrika',
      America: 'Amerika kıtaları',
      Antarctica: 'Antarktika',
      Arctic: 'Arktik',
      Asia: 'Asya',
      Atlantic: 'Atlas adaları',
      Australia: 'Avustralya',
      Europe: 'Avrupa',
      Indian: 'Hint Okyanusu',
      Pacific: 'Pasifik',
    } as Record<string, string>,
  },

  about: {
    title: 'Hakkında · super-vote',
    heading: <><AppName /> hakkında</>,
    lead: (days: number) => <>
      Bir grubun birlikte karar vermesi için ücretsiz, açık kaynaklı bir yol: nerede yemek yenecek, nereye gidilecek,
      neyin seçileceği. Hesap yok, reklam yok, izleme yok. Oylamalar, oluşturulmalarından {days} gün sonra silinir.
    </>,
    howDecided: 'Sonuçlar nasıl belirlenir',
    howDecidedText: <>
      Tek bir seçim, insanların düşündüklerinin çoğunu çöpe atar: benzer seçenekler destekçilerini böler ve neredeyse
      herkesin makul bulduğu bir seçenek, grubun yarısının hoşlanmadığı bir seçeneğe yenilebilir. <AppName /> iki
      yolla daha fazlasını sorar.
    </>,
    majorityJudgment: 'Çoğunluk yargısı',
    majorityJudgmentText: <>
      Her oy veren her seçeneği <em>Mükemmel</em>’den <em>Kötü</em>’ye kadar puanlar. Bir seçeneğin{' '}
      <strong>çoğunluk notu</strong>, oy verenlerin yarısından fazlasının ona verdiği ya da daha yükseğini verdiği en
      iyi nottur: yani medyanı. En iyi çoğunluk notuna sahip seçenek kazanır. Birkaçı aynı nota sahipse aralarında{' '}
      <strong>GMJ puanı</strong> karar verir: notların o notun ne kadar üstüne ya da altına yattığını ölçer. Hâlâ eşit
      olan seçenekler <em>ex aequo</em> gösterilir ve gizli hiçbir kural birini seçmez.
    </>,
    approval: 'Onay oylaması',
    approvalText: 'Her oy veren memnun kalacağı her seçeneği işaretler. En çok oy verenin onayladığı seçenek kazanır. '
      + 'Hızlıdır ve birden fazla seçeneği desteklediğiniz için sizi asla cezalandırmaz.',
    science: 'Arkasındaki bilim',
    scienceText: 'Hiçbir oylama kuralı kusursuz değildir: Condorcet 1785’te bir grubun A’yı B’ye, B’yi C’ye ve C’yi '
      + 'A’ya tercih edebileceğini gördü; makul her kural da manipüle edilebilir. Sıralamak yerine puanlamak, şarap '
      + 'jürilerinin ve artistik patinaj hakemlerinin bildiği gibi, bunun çoğunu aşar.',
    notes: {
      pnas2007: 'Çoğunluk yargısını tanıtır: puanla, sonra medyan nota göre sırala.',
      book2011: 'Kitap: kuram, özellikleri ve gerçek seçimler ile jüriler.',
      judge2014: 'Puanlamanın sıralamanın paradokslarından neden kaçındığı ve manipülasyona neden direndiği.',
      fabre2021: <><AppName />’in eşit çoğunluk notları arasında eşitliği bozmak için kullandığı “olağan yargı” puanı.</>,
      brams1978: 'Kabul edilebilir her seçeneği onaylamanın savunusu.',
      laslier2009: 'İnsanlar onay oylamasında nasıl stratejik oy verir ve bunun sonucu ne olur.',
      gibbard1973: 'Satterthwaite ile birlikte: makul her oylama kuralı manipüle edilebilir. Soru, ne kadar olduğudur.',
      satterthwaite1975: 'Aynı sonuç, bağımsız olarak bulundu.',
    },
    whoMakesIt: 'Kim yapıyor',
    whoMakesItText: <>
      <AppName />, Québec’te tek bir kişi tarafından boş zamanında yapılıyor ve herkes için ücretsiz. Kodu açık: herkes
      oyların nasıl sayıldığını okuyabilir, kendi kopyasını çalıştırabilir ya da bir değişiklik önerebilir.
    </>,
    seeTheCode: 'Kaynak kodunu GitHub’da gör',
  },

  privacy: {
    title: 'Gizlilik ve sınırlar · super-vote',
    heading: 'Gizlilik ve sınırlar',
    lead: <>
      <AppName />, kimsenin ne seçtiğinizi bilemeyeceği şekilde yapıldı. Burada neyi sakladığı, kimin neyi gördüğü ve
      henüz neleri yapamadığı yazıyor.
    </>,

    forWhat: 'Ne için',
    forWhatText: 'Birbirine güvenen insanlar arasında birlikte karar vermek için: arkadaşlar, aile, bir ekip, bir sınıf, '
      + 'bir dernek. Seçimler için ya da yasal, mali veya resmî sonuçları olan hiçbir oylama için uygun değildir: bunlar '
      + 'her oy verenin kimliğinin belirlenip yalnızca bir kez sayılmasını ve herkesin doğrulayabileceği sonuçlar '
      + 'gerektirir; super-vote bunları henüz vaat edemez.',

    kept: 'Neler saklanıyor ve ne kadar süreyle',
    keptItems: (days: number) => [
      `Bir oylama: sorusu, seçenekleri ve ayarları; silinene kadar, en geç oluşturulmasından ${days} gün sonrasına `
        + 'kadar. Onu oluşturan kişi daha erken silebilir.',
      'Bir oylamadaki oyunuz, kim olduğunuzu söylemeyen bir anahtarla saklanır ve oylamayla birlikte silinir. Oylama '
        + 'kapanana kadar geri çekebilirsiniz.',
      'İsim gösteren oylamalarda verdiğiniz isim, hiçbir şey ikisini birleştirmesin diye oyunuzdan ayrı saklanır.',
      'Yukarıdaki oylamaların, oyların ve isimlerin, bir kazadan kurtarmak için her gece alınan ve 7 gün saklanan '
        + 'kopyaları: silinen şey bir hafta içinde onlardan da gider.',
      `Bir çerezdeki rastgele bir tanımlayıcı; bu tarayıcı oylarını değiştirebilsin ve oylamalarını yönetebilsin diye, `
        + `son oyundan ya da oylamasından sonra ${days} gün, bir oylama sürdüğü sürece. Tek çerez budur: reklam yok, `
        + 'analiz yok, izleme yok.',
      'Cihazınızın saat dilimi (örneğin Europe/Paris), istatistiklere yalnızca toplam olarak eklenir. Adresiniz asla.',
      'Ağınızın adresi, her ağın kaç oylama oluşturduğunu sınırlamak için en fazla bir gün bellekte tutulur. '
        + 'Asla yazılmaz.',
      'Ayarlarınız ve en son verdiğiniz isim, yalnızca bu tarayıcıda.',
      'Sunucunun sakladığı her şey, Kanada’nın Montréal şehrindeki tek bir makinededir; Avrupa Birliği bu ülkeyi '
        + 'kişisel verileri yeterli düzeyde koruyan bir ülke olarak tanır.',
    ],

    whoSees: 'Kim neyi görür',
    whoSeesItems: [
      'Bir oylamadaki herkes, oluşturan kişi göstermeyi seçtiyse sonuçları toplamlar olarak ve oy verenlerin vermeyi '
        + 'seçtiği isimleri görür.',
      'Bir oylamayı oluşturan kişi aynısını ve hangi davetlerin kullanıldığını görür: kimsenin ne seçtiğini asla.',
      'Oyunuzu kimse görmez. Kendi ekranınızda bile, sayıldıktan sonra gizli başlar.',
      'Sunucuyu işleten kişi istekleri olurken görür. Saklanan şey kimin neyi seçtiğini söylemez, ama super-vote '
        + 'oyları çalışan sunucudan gizlemez: onu işleten kişilerin bakmayacağına güvenilir.',
    ],

    limits: 'Bilinmesi gereken sınırlar',
    limitsItems: [
      'Davet olmadan bir kişi farklı tarayıcılardan ya da cihazlardan birkaç kez oy verebilir. super-vote iyi niyete '
        + 'güvenir ve oy sayısı kötüye kullanıldığında bunu gösterir. Herkesi yalnızca bir kez saymak için onları davet edin.',
      'Oyunuz ve oylamalarınız bu tarayıcıya aittir. Başka bir cihazdan ya da verileri temizlendikten sonra onları artık '
        + 'değiştiremez ya da yönetemezsiniz ve onları geri almak için bir hesap yoktur.',
      'Canlı sonuçlar her oy geldiğinde oynar: küçük bir grupta izleyenler kimin neyi seçtiğini anlayabilir. Bir oylamayı '
        + 'oluşturan kişi sonuçların ne zaman görüneceğini seçer ve uyarılır.',
      'Sayım bağımsız olarak doğrulanamaz: kodu herkesin okuyabileceği şekilde açık olan sunucuya güvenirsiniz.',
      'super-vote ücretsizdir ve küçük bir sunucuda çalışır: zaman zaman kullanılamayabilir. Acil hiçbir şey için ona '
        + 'güvenmeyin.',
    ],

    rights: 'Verileriniz, seçimleriniz',
    rightsText: 'Oylarınız size bağlı değildir, bu yüzden super-vote onları sizin için bulamaz: bu tarayıcıdan bir oyu '
      + 'geri çekin ya da oluşturduğunuz bir oylamayı silin. Bu tarayıcının super-vote verilerini temizlemek, çerezini '
      + 've ayarlarını kaldırır.',
    contact: <>
      Sorular, verilerinizle ilgili bir talep ya da bildirilecek bir oylama:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">bize GitHub’da
      yazın</a>. Bir güvenlik açığı için{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">güvenlik
      politikasına</a> bakın.
    </>,
    openSource: <>
      Buradaki hiçbir şeye körü körüne inanmanız gerekmez: <AppName />’in kodu, sayım ve oyların korunması dahil,{' '}
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer">herkesin okumasına
      açıktır</a>.
    </>,
  },

  legal: {
    title: 'Yasal bildirim · super-vote',
    heading: 'Yasal bildirim',
    publisher: 'Yayıncı',
    publisherText: <>
      <AppName />, Kanada’nın Québec eyaletindeki özel bir kişi tarafından ticari bir amaç gütmeden yayımlanır. Adı ve
      adresi burada verilmez: barındırma sağlayıcısında bulunur.
    </>,
    law: 'Uygulanacak hukuk',
    lawText: <>
      <AppName />, Québec’ten, Québec ve Kanada yasaları uyarınca yayımlanır. Her yerdeki insanlara açıktır ve bir
      oylama oluşturan ya da bir oylamada oy veren kişi, bulunduğu yerin yasalarına da tabidir.
      <AppName />’in sizinle ilgili neyi sakladığı ve nedeni, nerede olurlarsa olsunlar herkes için aynıdır:{' '}
      <Link to="/privacy">Gizlilik ve sınırlar</Link>.
    </>,
    host: 'Barındırma sağlayıcısı',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Kanada',
    ],
    hostPhone: (phone: ReactNode) => <>Telefon: {phone}</>,
    report: 'Bir oylamayı bildirme',
    reportText: <>
      Oylamaları onları oluşturan kişiler yazar. Yasayı ihlal eden bir oylamayı başlığı, seçenekleri ya da bir oy
      verenin adı nedeniyle bildirmek için:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">bize GitHub’da
      yazın</a>. Her bildirim hızla incelenir ve yasa dışı olan kaldırılır.
    </>,
  },
};
