/**
 * Everything the web app says, in Indonesian: en.tsx, translated. Voters are
 * addressed as «Anda»; a poll is a «voting», a ballot a «suara». Indonesian
 * has no plural forms: a noun after a number stays as it is.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import AppName from '../ui/AppName';
import type { Messages } from './en';
import {
  formatDate, formatDecimal, formatMoment, formatNumber, formatPercent, formatUtcDay, timeAgo, waitUntil,
} from './format';

const number = (count: number) => formatNumber('id', count);
const counted = (count: number, noun: string) => `${number(count)} ${noun}`;

function inWords(at: number): string {
  const { count, unit } = waitUntil(at);
  return counted(count, unit === 'minute' ? 'menit' : 'jam');
}

export const id: Messages = {
  number,
  percent: (share: number) => formatPercent('id', share),
  decimal: (value: number, digits: number) => formatDecimal('id', value, digits),
  date: (isoDate: string) => formatDate('id', isoDate),
  moment: (isoDate: string) => formatMoment('id', isoDate),
  day: (day: string) => formatUtcDay('id', day),
  timeAgo: (isoDate: string) => timeAgo('id', isoDate) ?? 'baru saja',
  waitUntil: inWords,

  loading: 'Memuat…',
  backHome: 'Kembali ke beranda',
  tryAgain: 'Coba lagi',
  close: 'Tutup',
  dismiss: 'Abaikan',

  errors: {
    unexpected: 'Terjadi masalah. Silakan coba lagi.',
    unreachable: 'Server tidak dapat dijangkau. Periksa koneksi Anda lalu coba lagi.',
    failed: (status: number) => `Terjadi masalah (kesalahan ${status}). Silakan coba lagi.`,
  },

  problems: {
    'unknown-voter': 'Peramban ini tidak dikenal oleh super-vote. Muat ulang halaman untuk memulai dari awal.',
    'not-poll-creator': 'Hanya pembuat voting yang dapat melakukannya.',
    'not-invited': 'Hanya orang yang diundang yang dapat memberi suara di voting ini. Jika Anda diundang, buka tautan dari undangan Anda.',
    'not-admin-link': 'Tautan admin ini bukan milik voting ini. Pastikan tautan disalin secara utuh.',
    'handover-unavailable': 'Tautan ini tidak dapat menyerahkan voting: tautan sudah pernah digunakan.',
    'cross-site': 'Permintaan ini datang dari situs web lain dan ditolak. Buka super-vote secara langsung.',
    'poll-not-found': 'Tidak ada voting dengan tautan atau kode ini. Mungkin salah ketik, atau voting sudah dihapus.',
    'poll-closed': 'Voting ini sudah ditutup: tidak lagi menerima suara.',
    'invitation-used': 'Seseorang sudah memberi suara dengan undangan ini, di peramban lain atau di perangkat lain.',
    'collision': 'Perubahan itu bertabrakan dengan perubahan lain yang dibuat pada saat yang sama. Silakan coba lagi.',
    'too-many-polls': (wait: string) => 'Koneksi ini sudah membuat voting untuk hari ini. Agar adil bagi semua orang, '
      + `setiap koneksi hanya boleh membuat beberapa per hari: Anda dapat membuat lagi dalam ${wait}.`,
    'too-many-wrong-codes': (wait: string) => 'Terlalu banyak kode yang salah dari koneksi ini: untuk menjaga voting dari '
      + `tebakan, kode dari koneksi ini ditolak selama ${wait} ke depan. Tautan tetap berfungsi.`,
    'server-error': 'Terjadi masalah di pihak kami. Silakan coba lagi sebentar lagi.',
  },

  mentions: {
    Excellent: 'Luar biasa',
    VeryGood: 'Sangat baik',
    Good: 'Baik',
    Fair: 'Cukup baik',
    Passable: 'Memadai',
    Inadequate: 'Kurang',
    Bad: 'Buruk',
  },

  votingSystems: {
    MAJORITY_JUDGMENT: 'Penilaian mayoritas',
    APPROVAL: 'Voting persetujuan',
  },

  visibilities: {
    PUBLIC: 'Publik',
    UNLISTED: 'Pribadi',
  },

  app: {
    home: 'Beranda',
    settings: 'Pengaturan',
    footer: <><AppName /> gratis dan bersumber terbuka.</>,
    footerLinks: 'Tentang super-vote',
    about: 'Tentang dan ilmu di baliknya',
    privacy: 'Privasi dan batasan',
    legal: 'Informasi hukum',
    statistics: 'Statistik',
    sourceCode: 'Kode sumber',
    notFound: 'Halaman tidak ditemukan',
    nothingHere: 'Tidak ada apa pun di alamat ini.',
  },

  settings: {
    language: 'Bahasa',
    appearance: 'Tampilan',
    light: 'Terang',
    automatic: 'Otomatis',
    dark: 'Gelap',
    mentionColours: 'Warna penilaian',
    greenToRed: 'Hijau ke merah',
    shadesOfGrey: 'Gradasi abu-abu',
    shadesOfGreyHint: 'Gradasi abu-abu terbaca sama apa pun warna yang Anda lihat: semakin terang, semakin baik.',
    majorityJudgmentBallot: 'Surat suara penilaian mayoritas',
    colourScale: 'Skala warna',
    dropdowns: 'Menu tarik-turun',
    castingYourBallot: 'Cara memberi suara',
    live: 'Langsung',
    envelope: 'Amplop',
    liveHint: 'Setiap perubahan langsung dihitung saat Anda membuatnya.',
    envelopeHint: 'Isi surat suara Anda, lalu kirim sekaligus.',
  },

  home: {
    title: 'super-vote · putuskan bersama',
    lead: 'Matematika bilang ini lebih adil.',
    createQuestion: 'Perlu membuat voting?',
    createPoll: 'Putuskan bersama!',
    yourPolls: 'Putuskan bersama…',
    publicPolls: 'Voting publik',
    noPublicPolls: 'Belum ada voting publik.',
    public: 'Publik',
    closed: 'Ditutup',

    howItWorks: 'Cara kerjanya',
    steps: [
      { title: 'Bertanya', text: 'Sebuah pertanyaan dan pilihannya.' },
      { title: 'Bagikan', text: 'Tautan, kode QR, atau kode.' },
      { title: 'Putuskan', text: 'Semua orang menilai, hasil masuk secara langsung.' },
    ],

    agent: {
      title: 'Siap untuk AI',
      text: 'Tempelkan ini ke asisten yang bisa menjelajah web, bersama pertanyaan Anda sendiri.',
      prompt: (site: string, guide: string) => `Gunakan ${site} untuk membuat voting bagi tim saya (petunjuk untuk `
        + `agen: ${guide}). Pertanyaannya: “Di mana kita mengadakan acara luar kantor?” Pilihannya: Lisboa, Berlin, `
        + 'Barcelona. Gunakan penilaian mayoritas, dan sembunyikan hasil sampai saya menutup voting. '
        + 'Serahkan voting itu kepada saya, lalu berikan tautan untuk dibagikan ke tim.',
      copy: 'Salin teks',
      copied: 'Teks disalin',
      caption: 'Jawabannya dua tautan: buka yang pertama agar voting menjadi milik Anda, kirim yang kedua ke grup.',
    },

    systems: {
      title: 'Dua cara memutuskan',
      majorityJudgment: {
        title: 'Penilaian mayoritas',
        text: 'Nilai setiap pilihan dari Luar biasa sampai Buruk. Nilai mayoritas terbaik menang.',
      },
      approval: {
        title: 'Persetujuan',
        text: 'Centang setiap pilihan yang akan Anda terima. Yang paling banyak dicentang menang.',
      },
    },

    compare: {
      title: 'Lebih adil daripada kebanyakan pemilu resmi',
      text: 'Kebanyakan pemilu hanya meminta satu nama. Kandidat yang mirip saling membagi pemilihnya, dan yang ditolak '
        + 'kebanyakan orang tetap bisa menang. Penilaian mayoritas, dari penelitian Michel Balinski dan Rida Laraki, '
        + 'justru mengukur apa yang dipikirkan semua orang tentang setiap pilihan.',
      science: 'Ilmu di baliknya',
      single: 'Satu pilihan',
      singleNote: 'kebanyakan pemilu',
      approval: 'Persetujuan',
      majorityJudgment: 'Penilaian mayoritas',
      criteria: {
        nuance: 'Sampaikan pendapat Anda tentang tiap pilihan',
        splitting: 'Pilihan yang mirip tidak memecah suara',
        lesserEvil: 'Tidak perlu memilih yang paling sedikit buruknya',
        tactics: 'Sulit dimanipulasi',
        quick: 'Cepat diisi',
        familiar: 'Sudah dikenal',
      },
      marks: { yes: 'Ya', partly: 'Sebagian', no: 'Tidak' },
      caption: <><AppName /> menawarkan persetujuan dan penilaian mayoritas. Tidak ada aturan pemungutan suara yang
        sempurna, tetapi sebagian jauh lebih adil daripada yang lain.</>,
    },

    supportTitle: 'Gratis, sumber terbuka, tanpa iklan',
    supportText: 'Anda bukan produknya: tujuannya mempromosikan sistem pemungutan suara yang lebih baik. Dibuat oleh satu '
      + 'orang, di waktu luangnya. Jika ini membantu grup Anda memutuskan, Anda bisa membantunya.',

    limitsTitle: 'Perlu diketahui',
    limits: {
      everyday: <><strong>Untuk keputusan sehari-hari,</strong> bukan pemilu resmi: tanpa akun, seseorang bisa
        memberi suara lagi dari peramban lain. Undangan menghitung setiap orang hanya sekali.</>,
      private: <><strong>Pribadi, tetapi tidak disembunyikan dari server.</strong> Tidak ada orang lain yang melihat suara Anda,
        dan suara yang disimpan tidak menyebutkan siapa yang memberikannya.</>,
      browser: (days: number) => <><strong>Terikat ke peramban ini,</strong> lewat satu cookie, disimpan {days} hari
        setelah suara atau voting terakhir Anda. Tanpa iklan, tanpa pelacakan.</>,
      deleted: (days: number) => <><strong>Dihapus setelah {days} hari,</strong> baik voting maupun suaranya.</>,
      disclaimer: <><strong>Tanpa jaminan.</strong> <AppName /> mempromosikan cara memberi suara yang lebih baik. Dibuat oleh satu
        orang, dengan perhatian terbaik pada keamanan, privasi, kinerja, arsitektur, dan kualitas kode, tetapi tidak
        terakreditasi, diaudit, atau ditinjau secara independen: hasilnya tidak dijamin akurat, atau benar-benar
        mewakili kehendak suatu kelompok. Itu memerlukan akreditasi, tinjauan ahli atas sisi teknis, dan dukungan
        berkelanjutan, yang tidak bisa diberikan satu orang tanpa sponsor dan para ahli.</>,
    },
    limitsLink: 'Semua tentang privasi dan batasan',
  },
  join: {
    label: 'Punya kode?',
    typeTheCode: 'Ketik kode yang Anda terima.',
    notACode: 'Kode terdiri dari enam huruf dan angka, seperti K7M-4QX.',
    joining: 'Bergabung…',
    join: 'Beri suara!',
  },

  newPoll: {
    title: 'Putuskan bersama · super-vote',
    heading: 'Putuskan bersama',
    question: 'Pertanyaan',
    questionPlaceholder: 'Kita makan di mana hari Jumat?',
    options: 'Pilihan',
    option: (row: number) => `Pilihan ${row}`,
    remove: (option: string) => `Hapus ${option}`,
    optionsHint: (max: number) => `Hingga ${max} pilihan. Baris baru muncul saat Anda mengetik.`,

    votingSystem: 'Sistem pemungutan suara',
    systems: {
      MAJORITY_JUDGMENT: 'Penilaian mayoritas',
      APPROVAL: 'Persetujuan',
    },
    systemHints: {
      MAJORITY_JUDGMENT: 'Pemilih menilai setiap pilihan dari Luar biasa sampai Buruk. Pilihan yang dinilai terbaik oleh '
        + 'mayoritas menang: bernuansa, dan sulit dimanipulasi.',
      APPROVAL: 'Pemilih mencentang setiap pilihan yang akan diterimanya. Pilihan yang paling banyak disetujui menang: cepat dan sederhana.',
    },

    whoCanFindIt: 'Siapa yang dapat menemukannya',
    visibilityHints: {
      PUBLIC: 'Ditampilkan di beranda, agar siapa pun dapat menemukannya.',
      UNLISTED: 'Tidak ditampilkan di mana pun: hanya orang yang Anda beri tautan atau kodenya yang dapat menemukannya.',
    },

    whoCanVote: 'Siapa yang dapat memberi suara',
    anyone: 'Siapa saja',
    invitedOnly: 'Hanya yang diundang',
    anyoneHint: <>
      Siapa saja yang memiliki tautan atau kodenya. Orang yang bertekad bisa memberi suara lagi dari peramban lain:
      untuk menghitung setiap orang hanya sekali, undang mereka.
    </>,
    invitedHint: 'Setiap orang mendapat tautan sendiri, berlaku untuk satu suara. Anda melihat tautan mana yang sudah dipakai, '
      + 'bukan apa yang dipilih seseorang.',

    whoVoted: 'Siapa yang sudah memberi suara',
    anonymous: 'Anonim',
    showNames: 'Tampilkan nama',
    anonymousHint: 'Tidak ada yang melihat siapa yang memberi suara, hanya berapa banyak.',
    showNamesHint: 'Pemilih boleh mencantumkan nama, yang ditampilkan di bawah hasil. Tidak ada yang melihat siapa memilih apa.',

    results: 'Hasil',
    resultsChoices: {
      LIVE: 'Langsung',
      AFTER_BALLOTS: 'Tertunda',
      AFTER_CLOSING: 'Saat ditutup',
    },
    resultsHints: {
      LIVE: 'Hati-hati: semua orang melihat hasil bergerak oleh setiap suara. Dalam grup kecil, itu menunjukkan siapa memilih apa.',
      AFTER_BALLOTS: 'Disembunyikan sampai sejumlah suara masuk, untuk melindungi para pemilih pertama. Setelah itu, setiap suara '
        + 'menggerakkan hasil, yang masih dapat membuka identitas pemilih yang datang kemudian.',
      AFTER_CLOSING: 'Ditampilkan setelah Anda menutup voting. Sampai saat itu, semua orang hanya melihat berapa banyak yang sudah memberi suara.',
    },
    ballotsBeforeResults: 'Jumlah suara sebelum hasil ditampilkan',

    optionOrder: 'Urutan pilihan',
    orders: {
      ALPHABETICAL: 'A sampai Z',
      SHUFFLED: 'Diacak',
      AS_WRITTEN: 'Sesuai penulisan',
    },
    orderHints: {
      ALPHABETICAL: 'Dari A sampai Z, angka menurut nilainya: 2 sebelum 10. Tulis tanggal dengan tahun lebih dulu, misalnya 2026-10-24.',
      SHUFFLED: 'Urutan baru untuk setiap pemilih di setiap kunjungan, sehingga tidak ada pilihan yang diuntungkan oleh posisinya.',
      AS_WRITTEN: 'Urutan Anda. Posisi pertama menarik lebih banyak dukungan, jadi ini bisa terlihat seperti upaya memengaruhi hasil.',
    },

    deletedAfter: (days: number) => `Voting dihapus ${days} hari setelah dibuat, beserta suaranya.`,
    notForElections: <>
      <AppName /> untuk keputusan sehari-hari, bukan untuk pemungutan suara resmi atau yang mengikat.{' '}
      <Link to="/privacy">Privasi dan batasan</Link>
    </>,
    noNewPolls: 'Server ini tidak menerima voting baru saat ini.',
    creating: 'Membuat…',
    create: 'Ajukan pertanyaan',

    problems: {
      titleMissing: 'Beri judul pada voting Anda.',
      titleTooLong: (max: number) => `Judul paling panjang ${max} karakter.`,
      titleInvisible: 'Judul hanya boleh berisi karakter yang terlihat.',
      tooFewOptions: 'Tambahkan setidaknya dua pilihan.',
      tooManyOptions: (max: number) => `Sebuah voting paling banyak memiliki ${max} pilihan.`,
      optionTooLong: (max: number) => `Sebuah pilihan paling panjang ${max} karakter.`,
      optionInvisible: 'Sebuah pilihan hanya boleh berisi karakter yang terlihat.',
      optionTwice: (option: string) => `“${option}” tercantum dua kali. Setiap pilihan harus berbeda.`,
      resultsAfterBallots: (min: number) => `Pilih jumlah suara berupa bilangan bulat, minimal ${min}.`,
    },
  },

  poll: {
    title: (title: string) => `${title} · super-vote`,
    takingOver: 'Mengambil alih voting ini…',
    deleted: 'Voting ini telah dihapus',
    deletedText: 'Voting ini telah dihapus, beserta hasilnya.',
    notFound: 'Voting tidak ditemukan',
    notFoundText: 'Tautannya mungkin tidak lengkap, atau votingnya sudah dihapus.',
    notLoaded: 'Voting tidak dapat dimuat',
    loadingPoll: 'Memuat voting…',
    byInvitation: 'Dengan undangan',
    optionOrder: { SHUFFLED: 'Pilihan diacak', ALPHABETICAL: 'Pilihan diurutkan', AS_WRITTEN: 'Pilihan sesuai urutan' },
    closed: 'Ditutup',
    keepTitle: 'Simpan tautan admin Anda',
    keepText: 'Buka di peramban atau perangkat lain untuk mengelola voting ini dari sana, bukan dari sini: menutup, '
      + 'menghapus, mengundang orang. Simpan untuk diri sendiri: siapa pun yang memilikinya dapat melakukan hal yang sama.',
    readyToInvite: <><strong>Voting Anda siap.</strong> Undang orang di bawah ini: masing-masing mendapat tautan sendiri.</>,
    readyToShare: <><strong>Voting Anda siap.</strong> Bagikan tautannya untuk mengumpulkan suara.</>,
    closedAgo: (ago: string) => `Voting ditutup ${ago}. Ini hasil akhirnya.`,
    deletedOn: (date: string) => `Voting ini beserta suaranya akan dihapus pada ${date}.`,
    lastPoll: (wait: string) => `Itu voting terakhir Anda untuk sekarang: Anda dapat membuat lagi dalam ${wait}.`,
    pollsLeft: (count: number, wait: string) => `Anda dapat membuat ${counted(count, 'voting lagi')} dalam ${wait} ke depan.`,
    fairShare: (perDay: number) => `Agar adil bagi semua orang, setiap koneksi dapat membuat ${perDay} voting per hari.`,
  },

  ballot: {
    yourBallot: 'Suara Anda',
    withdraw: 'Tarik',
    submit: 'Kirim suara saya',
    rateEveryOption: 'Nilai setiap pilihan untuk mengirim',
    submitting: 'Mengirim…',
    majorityJudgmentLive: 'Beri setiap pilihan sebuah penilaian. Pilihan yang belum Anda nilai dihitung sebagai Buruk.',
    majorityJudgmentEnvelope: 'Beri setiap pilihan sebuah penilaian, lalu kirim suara Anda.',
    approval: 'Centang setiap pilihan yang akan membuat Anda puas.',
    invited: 'Undangan Anda berisi satu suara, yang hanya dapat diubah oleh peramban ini. Orang yang mengundang Anda melihat bahwa '
      + 'undangan itu sudah dipakai, bukan apa yang Anda pilih.',
    counted: 'Suara Anda sudah dihitung. Anda dapat mengubahnya dari peramban ini sampai voting ditutup.',
    notVoted: 'Anda belum memberi suara.',
    hide: 'Sembunyikan suara saya',
    hidden: 'Suara Anda sudah dihitung dan disembunyikan di sini: tidak ada yang melihat layar ini yang bisa melihat pilihan Anda.',
    change: 'Ubah suara saya',
    invitationUsed: 'Undangan ini sudah dipakai, di peramban lain atau di perangkat lain. Suaranya hanya dapat diubah '
      + 'di sana.',
    invitationNotValid: 'Tautan undangan ini tidak valid. Minta yang baru kepada orang yang mengundang Anda.',
    notInvited: 'Hanya orang yang diundang yang dapat memberi suara di voting ini. Jika Anda diundang, buka tautan dari undangan Anda.',
    yourName: 'Nama Anda',
    namePlaceholder: 'Anonim',
    namesGiven: 'Opsional. Semua orang melihat nama yang diberikan, tetapi bukan pilihannya.',
    namesLive: 'Hasil langsung dapat memberi petunjuk tentang siapa memilih apa.',
    notRatedYet: 'Belum dinilai',
    chooseAMention: 'Pilih penilaian…',
    optionsYouApprove: 'Pilihan yang Anda setujui',
  },

  results: {
    heading: 'Hasil',
    ballots: (count: number) => counted(count, 'suara'),
    noBallotsYet: 'Belum ada suara. Hasil terisi seiring suara masuk.',
    keptUntilBallots: (count: number) => `Hasil ditampilkan setelah ${count} suara masuk, agar pilihan para `
      + 'pemilih pertama tetap menjadi milik mereka.',
    keptUntilYouClose: 'Hasil ditampilkan setelah Anda menutup voting.',
    keptUntilClosed: 'Hasil ditampilkan setelah voting ditutup.',
    download: 'Unduh hasil',
    final: 'Akhir',
    connecting: 'Menghubungkan…',
    live: 'Langsung',
    reconnecting: 'Menghubungkan kembali…',
    whoVoted: 'Siapa yang sudah memberi suara',
    anonymousVoters: (count: number) => counted(count, 'pemilih anonim'),
    andAnonymousVoters: (count: number) => `dan ${counted(count, 'pemilih anonim')}`,
    moreVoters: (count: number) => `dan ${counted(count, 'pemilih lagi')}`,
    rank: (rank: number) => `Peringkat ${rank}`,
    approvals: (count: number) => counted(count, 'persetujuan'),
    noBallotsFor: (option: string) => `${option}: belum ada suara`,
    profile: (option: string, mentions: string) => `${option}: ${mentions}`,
    mentionShare: (mention: string, share: string) => `${mention}: ${share}`,
    tick: (percent: number) => `${percent}%`,
    exAequo: 'ex aequo',
    majorityMention: 'Nilai mayoritas:',
    gmjScore: 'Skor GMJ:',
    gmjScoreTitle: (score: string) => `Skor penilaian biasa GMJ: ${score}. Skor ini menentukan urutan antara pilihan yang `
      + 'memiliki nilai mayoritas yang sama.',
    orBetter: (share: string, mention: string) => `${share} menilai ${mention} atau lebih baik`,
  },

  owner: {
    manage: 'Kelola voting Anda',
    adminLink: 'Tautan admin voting',
    adminLinkHint: 'Tautan admin Anda: buka di peramban atau perangkat lain untuk mengelola voting dari sana, bukan dari '
      + 'sini. Simpan untuk diri sendiri.',
    showAdminLink: 'Tampilkan tautan admin',
    onlyThisBrowser: 'Hanya peramban ini yang dapat menutup atau menghapus voting ini lebih awal.',
    close: 'Tutup voting',
    delete: 'Hapus voting',
    closeQuestion: 'Tutup voting untuk selamanya? Tidak ada lagi yang dapat memberi suara atau mengubah suaranya, dan semua '
      + 'orang melihat hasil akhir.',
    keepOpen: 'Biarkan terbuka',
    closeForGood: 'Tutup untuk selamanya',
    deleteQuestion: 'Hapus voting ini beserta suaranya untuk selamanya? Semua orang yang sedang melihatnya akan melihatnya hilang.',
    keep: 'Pertahankan',
    deleteForGood: 'Hapus untuk selamanya',
    deletedToast: 'Voting telah dihapus.',
  },

  invitations: {
    heading: 'Undangan',
    count: (count: number) => counted(count, 'undangan'),
    used: (used: number, count: number) => `${number(used)} dari ${number(count)} terpakai`,
    hint: 'Hanya orang yang Anda undang yang dapat memberi suara, masing-masing dengan tautan sendiri, berlaku untuk satu '
      + 'suara. Anda melihat tautan mana yang sudah dipakai, bukan apa yang dipilih seseorang. Anda dapat memberi suara tanpa undangan.',
    invite: 'Undang',
    inviting: 'Mengundang…',
    inviteSomeone: 'Undang seseorang',
    namePlaceholder: 'Nama atau nama panggilan (opsional)',
    loading: 'Memuat undangan…',
    showMore: 'Tampilkan lebih banyak',
    newestShown: (count: number) => `${number(count)} terbaru ditampilkan.`,
    invitationFor: (label: string) => `Undangan untuk ${label}`,
    invitationNumber: (number: number) => `Undangan ${number}`,
    shareHint: 'Hanya untuk orang ini. Berisi satu suara, yang hanya dapat diubah oleh peramban tempat mereka memberi suara.',
    linkLabel: 'Tautan undangan',
    message: (title: string) => `Anda diundang untuk memberi suara di “${title}”. Tautan ini hanya untuk Anda.`,
    isUsed: 'Terpakai',
    notUsedYet: 'Belum terpakai',
    share: (name: string) => `Bagikan tautan untuk ${name}`,
    takeBack: (name: string) => `Tarik kembali tautan untuk ${name}`,
    takeBackQuestion: 'Tarik kembali undangan ini? Tautannya akan berhenti berfungsi.',
    keep: 'Pertahankan',
    takeItBack: 'Tarik kembali',
  },

  share: {
    share: 'Bagikan',
    title: 'Bagikan voting ini',
    anyone: 'Siapa pun yang memiliki kode atau tautannya dapat memberi suara.',
    unlisted: 'Voting ini tidak ditampilkan di tempat lain.',
    linkLabel: 'Tautan ke voting',
    joinCode: 'Kode gabung',
    toEnterAt: (host: string) => `untuk dimasukkan di ${host}`,
    copy: 'Salin',
    copied: 'Disalin',
    copyCode: 'Salin kode gabung',
    qrCode: (url: string) => `Kode QR untuk ${url}`,
    throughAnApp: 'Bagikan lewat aplikasi',
    byEmail: 'Kirim lewat email',
    message: (title: string) => `Beri suara di “${title}”`,
    orCode: (code: string, host: string) => `Atau masukkan kode ${code} di ${host}.`,
  },

  statistics: {
    title: 'Statistik · super-vote',
    heading: <><AppName /> di seluruh dunia</>,
    lead: 'Berapa banyak voting, suara, dan pengunjung, kapan, dan dari mana.',
    show: 'Tampilkan',
    measures: {
      voters: {
        label: 'Pengunjung', plural: 'pengunjung',
        noun: () => 'pengunjung',
        count: (count: number) => counted(count, 'pengunjung'),
      },
      polls: {
        label: 'Voting', plural: 'voting',
        noun: () => 'voting',
        count: (count: number) => counted(count, 'voting'),
      },
      ballots: {
        label: 'Suara', plural: 'suara',
        noun: () => 'suara',
        count: (count: number) => counted(count, 'suara'),
      },
    },
    totals: {
      polls: 'Voting dibuat',
      openPolls: 'Terbuka sekarang',
      ballots: 'Suara diberikan',
      voters: 'Pengunjung',
    },
    lastDays: 'Selama 90 hari terakhir',
    where: 'Di mana',
    byRegion: 'Menurut wilayah',
    noRegion: 'Belum ada wilayah.',
    tapADot: 'Ketuk sebuah titik untuk melihat angkanya.',
    unplaced: (visitors: string, polls: string, ballots: string) => 'Tidak ditampilkan di wilayah mana pun, karena tidak ada zona '
      + `waktu atau karena orangnya belum cukup untuk ditampilkan: ${visitors}, ${polls}, dan ${ballots}.`,
    howCounted: 'Cara penghitungan',
    howCountedText: <>
      Pengunjung adalah peramban atau aplikasi yang datang ke <AppName />: satu orang dengan dua perangkat dihitung dua kali.
      Satu suara dihitung sekali, sebanyak apa pun pemiliknya mengubahnya.
    </>,
    places: (updated: string) => 'Lokasi berasal dari zona waktu yang diatur di perangkat Anda, bukan dari alamat Anda, dan '
      + 'hanya total yang disimpan. Sebuah lokasi muncul setelah tiga pengunjung berasal dari sana. Angka diperbarui setiap '
      + 'jam, sehingga tidak dapat dicocokkan dengan suara sebuah voting saat suara itu masuk. '
      + `Terakhir diperbarui ${updated}.`,
    sources: <>
      Setiap titik adalah kota yang menjadi nama suatu zona waktu, mewakili semua orang di zona itu. Hari dalam UTC. Daratan
      dari <a href="https://www.naturalearthdata.com" target="_blank" rel="noreferrer">Natural Earth</a>, zona waktu
      dari <a href="https://www.iana.org/time-zones" target="_blank" rel="noreferrer">basis data IANA</a>.
    </>,
    onDay: (count: string, noun: string, day: string) => <><strong>{count}</strong> {noun} pada {day}</>,
    overLastDays: (counts: string, days: number) => `${counts} selama ${days} hari terakhir`,
    busiest: (day: string, count: string) => `, terbanyak pada ${day}: ${count}.`,
    topLine: (count: string) => `Tertinggi: ${count}`,
    regionAndCity: 'Wilayah dan kota',
    map: (what: string) => `Peta dunia ${what} menurut zona waktu. Tabel di bawah mencantumkan angka yang sama.`,
    zoomIn: 'Perbesar',
    zoomOut: 'Perkecil',
    nothingYet: 'Belum ada lokasi untuk ditampilkan.',
    fewer: 'lebih sedikit',
    upTo: (count: string) => `hingga ${count}`,
    pollPlaces: 'Dari mana suara berasal',
    pollPlacesNone: 'Sebuah wilayah muncul setelah tiga suara berasal dari sana.',
    pollPlacesHint: 'Dari zona waktu setiap pemilih, bukan alamatnya. Sebuah lokasi muncul setelah tiga suara berasal dari '
      + 'sana, dan angka diperbarui setiap jam.',
    regions: {
      Africa: 'Afrika',
      America: 'Benua Amerika',
      Antarctica: 'Antartika',
      Arctic: 'Arktik',
      Asia: 'Asia',
      Atlantic: 'Kepulauan Atlantik',
      Australia: 'Australia',
      Europe: 'Eropa',
      Indian: 'Samudra Hindia',
      Pacific: 'Pasifik',
    } as Record<string, string>,
  },

  about: {
    title: 'Tentang · super-vote',
    heading: <>Tentang <AppName /></>,
    lead: (days: number) => <>
      Cara gratis dan bersumber terbuka bagi sebuah grup untuk memutuskan bersama: makan di mana, pergi ke mana, memilih
      apa. Tanpa akun, tanpa iklan, tanpa pelacakan. Voting dihapus {days} hari setelah dibuat.
    </>,
    howDecided: 'Bagaimana hasil ditentukan',
    howDecidedText: <>
      Satu pilihan saja membuang sebagian besar pendapat orang: pilihan yang mirip membagi pendukungnya, dan pilihan yang
      dianggap baik oleh hampir semua orang bisa kalah dari pilihan yang tidak disukai separuh grup. <AppName /> menanyakan
      lebih banyak, dengan dua cara.
    </>,
    majorityJudgment: 'Penilaian mayoritas',
    majorityJudgmentText: <>
      Setiap pemilih menilai setiap pilihan, dari <em>Luar biasa</em> sampai <em>Buruk</em>. <strong>Nilai mayoritas</strong>{' '}
      sebuah pilihan adalah nilai terbaik yang diberikan, atau dilampaui, oleh lebih dari separuh pemilih: mediannya.
      Pilihan dengan nilai mayoritas terbaik menang. Jika beberapa pilihan memiliki nilai yang sama, <strong>skor GMJ</strong>{' '}
      yang menentukan di antara mereka: skor ini mengukur seberapa jauh nilai-nilai condong di atas atau di bawah nilai
      itu. Pilihan yang masih sama ditampilkan <em>ex aequo</em>, dan tidak ada aturan tersembunyi yang memilih salah satunya.
    </>,
    approval: 'Voting persetujuan',
    approvalText: 'Setiap pemilih mencentang setiap pilihan yang akan membuatnya puas. Pilihan yang disetujui paling banyak '
      + 'pemilih menang. Caranya cepat, dan tidak pernah menghukum Anda karena mendukung lebih dari satu pilihan.',
    science: 'Ilmu di baliknya',
    scienceText: 'Tidak ada aturan pemungutan suara yang sempurna: Condorcet melihat pada 1785 bahwa sebuah grup dapat lebih '
      + 'menyukai A daripada B, B daripada C, dan C daripada A, dan setiap aturan yang masuk akal dapat dimanipulasi. '
      + 'Menilai alih-alih meranking menghindari banyak masalah itu, seperti yang diketahui juri anggur dan wasit seluncur indah.',
    notes: {
      pnas2007: 'Memperkenalkan penilaian mayoritas: menilai, lalu meranking menurut nilai median.',
      book2011: 'Bukunya: teori, sifat-sifatnya, serta pemilu dan juri yang nyata.',
      judge2014: 'Mengapa menilai menghindari paradoks meranking, dan tahan terhadap manipulasi.',
      fabre2021: <>Skor “penilaian biasa” yang digunakan <AppName /> untuk memutus seri antara nilai mayoritas yang sama.</>,
      brams1978: 'Argumen untuk menyetujui setiap pilihan yang dapat diterima.',
      laslier2009: 'Bagaimana orang memberi suara secara strategis pada voting persetujuan, dan akibatnya.',
      gibbard1973: 'Bersama Satterthwaite: setiap aturan pemungutan suara yang masuk akal dapat dimanipulasi. Pertanyaannya adalah seberapa jauh.',
      satterthwaite1975: 'Hasil yang sama, ditemukan secara independen.',
    },
    whoMakesIt: 'Siapa yang membuatnya',
    whoMakesItText: <>
      <AppName /> dibuat oleh satu orang di Québec, di waktu luangnya, dan gratis untuk semua orang. Kodenya terbuka:
      siapa pun dapat membaca bagaimana suara dihitung, menjalankan salinan sendiri, atau mengusulkan perubahan.
    </>,
    seeTheCode: 'Lihat kode sumber di GitHub',
  },

  privacy: {
    title: 'Privasi dan batasan · super-vote',
    heading: 'Privasi dan batasan',
    lead: <>
      <AppName /> dibuat agar tidak ada yang bisa mengetahui apa yang Anda pilih. Berikut apa yang disimpannya, siapa
      melihat apa, dan apa yang belum bisa dilakukannya.
    </>,

    forWhat: 'Untuk apa',
    forWhatText: 'Memutuskan bersama di antara orang-orang yang saling percaya: teman, keluarga, tim, kelas, '
      + 'perkumpulan. Tidak cocok untuk pemilu, maupun untuk pemungutan suara apa pun yang berakibat hukum, keuangan, atau '
      + 'resmi: itu membutuhkan setiap pemilih diidentifikasi dan dihitung sekali, serta hasil yang dapat diverifikasi '
      + 'siapa pun, yang belum dapat dijanjikan super-vote.',

    kept: 'Apa yang disimpan, dan berapa lama',
    keptItems: (days: number) => [
      `Sebuah voting: pertanyaan, pilihan, dan pengaturannya, sampai dihapus, paling lambat ${days} hari setelah dibuat. `
        + 'Pembuatnya dapat menghapusnya lebih cepat.',
      'Suara Anda pada sebuah voting, disimpan dengan kunci yang tidak menyebutkan siapa Anda, dan dihapus bersama voting. '
        + 'Anda dapat menariknya sampai voting ditutup.',
      'Nama yang Anda berikan, pada voting yang menampilkan nama, disimpan terpisah dari suara Anda agar tidak ada yang menghubungkan keduanya.',
      'Salinan voting, suara, dan nama di atas, dibuat setiap malam untuk pemulihan dari kecelakaan, dan disimpan 7 hari: '
        + 'apa yang dihapus akan hilang juga dari salinan dalam waktu seminggu.',
      `Pengenal acak dalam sebuah cookie, agar peramban ini dapat mengubah suaranya dan mengelola votingnya, selama ${days} `
        + 'hari setelah suara atau voting terakhirnya, selama sebuah voting berlangsung. Ini satu-satunya cookie: tanpa iklan, '
        + 'tanpa analitik, tanpa pelacakan.',
      'Zona waktu perangkat Anda (misalnya Europe/Paris), ditambahkan ke statistik hanya sebagai total. Bukan alamat Anda.',
      'Alamat jaringan Anda, disimpan di memori paling lama sehari, untuk membatasi berapa banyak voting yang dibuat setiap jaringan. '
        + 'Tidak pernah dituliskan.',
      'Pengaturan Anda dan nama yang terakhir Anda berikan, hanya di peramban ini.',
      'Semua yang disimpan server ada di satu mesin di Montréal, Kanada, negara yang diakui Uni Eropa '
        + 'sebagai pelindung data pribadi yang memadai.',
    ],

    whoSees: 'Siapa melihat apa',
    whoSeesItems: [
      'Semua orang di sebuah voting melihat hasil sebagai total, bila pembuatnya memilih menampilkannya, dan nama yang '
        + 'dipilih pemilih untuk diberikan.',
      'Pembuat voting melihat hal yang sama, dan undangan mana yang sudah dipakai: bukan apa yang dipilih seseorang.',
      'Tidak ada yang melihat suara Anda. Bahkan di layar Anda sendiri, suara itu tersembunyi setelah dihitung.',
      'Orang yang menjalankan server melihat permintaan saat terjadi. Apa yang disimpan tidak menyebutkan siapa memilih apa, '
        + 'tetapi super-vote tidak menyembunyikan suara dari server yang sedang berjalan: orang yang menjalankannya dipercaya tidak mengintip.',
    ],

    limits: 'Batasan yang perlu diketahui',
    limitsItems: [
      'Tanpa undangan, satu orang dapat memberi suara beberapa kali dari peramban atau perangkat yang berbeda. super-vote '
        + 'mengandalkan itikad baik, dan jumlah suara menunjukkan bila terjadi penyalahgunaan. Untuk menghitung setiap orang sekali, undang mereka.',
      'Suara dan voting Anda milik peramban ini. Dari perangkat lain, atau setelah datanya dihapus, Anda tidak dapat '
        + 'lagi mengubah atau mengelolanya, dan tidak ada akun untuk memulihkannya.',
      'Hasil langsung bergerak setiap suara masuk: dalam grup kecil, orang yang menonton dapat mengetahui siapa memilih apa. '
        + 'Pembuat voting memilih kapan hasil ditampilkan, dan diberi peringatan.',
      'Penghitungan tidak dapat diperiksa secara independen: Anda memercayai server, yang kodenya terbuka untuk dibaca siapa pun.',
      'super-vote gratis dan berjalan di satu server kecil: kadang bisa tidak tersedia. Jangan mengandalkannya untuk '
        + 'hal yang mendesak.',
    ],

    rights: 'Data Anda, pilihan Anda',
    rightsText: 'Suara Anda tidak terhubung dengan Anda, jadi super-vote tidak dapat menemukannya untuk Anda: tarik suara, atau '
      + 'hapus voting yang Anda buat, dari peramban ini. Menghapus data peramban ini untuk super-vote menghilangkan '
      + 'cookie dan pengaturannya.',
    contact: <>
      Pertanyaan, permintaan terkait data Anda, atau voting yang ingin dilaporkan:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">tulis kepada kami di
      GitHub</a>. Untuk kelemahan keamanan, lihat{' '}
      <a href="https://github.com/jeanbottein/super-vote/security/policy" target="_blank" rel="noreferrer">kebijakan
      keamanan</a>.
    </>,
    openSource: <>
      Tidak ada di sini yang perlu diterima begitu saja: kode <AppName />, termasuk penghitungan dan perlindungan suara,
      <a href="https://github.com/jeanbottein/super-vote" target="_blank" rel="noreferrer"> terbuka untuk dibaca
      siapa pun</a>.
    </>,
  },

  legal: {
    title: 'Informasi hukum · super-vote',
    heading: 'Informasi hukum',
    publisher: 'Penerbit',
    publisherText: <>
      <AppName /> diterbitkan oleh seorang individu di Québec, Kanada, tanpa tujuan komersial. Nama dan alamatnya tidak
      dicantumkan di sini: penyedia hosting memilikinya.
    </>,
    law: 'Hukum yang berlaku',
    lawText: <>
      <AppName /> diterbitkan dari Québec, berdasarkan hukum Québec dan Kanada. Layanan ini terbuka bagi orang di mana pun,
      dan siapa pun yang membuat voting atau memberi suara di dalamnya juga tunduk pada hukum tempat mereka berada.
      Apa yang disimpan <AppName /> tentang Anda, dan alasannya, sama untuk semua orang, di mana pun mereka berada:{' '}
      <Link to="/privacy">Privasi dan batasan</Link>.
    </>,
    host: 'Penyedia hosting',
    hostAddress: [
      'OVH Hosting Inc.',
      '1801 McGill College Avenue, Suite 800',
      'Montréal QC H3A 2N4',
      'Kanada',
    ],
    hostPhone: (phone: ReactNode) => <>Telepon: {phone}</>,
    report: 'Melaporkan sebuah voting',
    reportText: <>
      Voting ditulis oleh orang yang membuatnya. Untuk melaporkan voting yang melanggar hukum, berdasarkan judulnya, pilihannya,
      atau nama pemilih:{' '}
      <a href="https://github.com/jeanbottein/super-vote/issues" target="_blank" rel="noreferrer">tulis kepada kami di
      GitHub</a>. Setiap laporan segera ditinjau, dan yang melanggar hukum dihapus.
    </>,
  },
};
