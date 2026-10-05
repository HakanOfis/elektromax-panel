// Formulierstructuur van het Elektromax-paneel (Turkse labels).
// Pad-notatie: "<bron>:<pad>" met bron = content | ui | extras; de taal wordt ertussen gezet
// (content:home.intro → content.<taal>.home.intro). Zonder bron = content.
// type: text | textarea | list | lines (titelregels, als één zin vertaald) | number | items | image | blocks
// fixed: aantal ligt vast (de site koppelt er iconen/routes aan).

export const LANGS = [
  { code: "nl", label: "Felemenkçe (NL)", short: "NL" },
  { code: "en", label: "İngilizce (EN)", short: "EN" },
  { code: "tr", label: "Türkçe (TR)", short: "TR" },
];

export function langPath(path, lang) {
  const [root, rest] = path.includes(":") ? path.split(":") : ["content", path];
  return `${root}.${lang}.${rest}`;
}

// Gedeelde bedrijfsgegevens (niet per taal).
export const COMPANY_FIELDS = [
  { path: "company.phone", label: "Telefon (arama ve WhatsApp için)", hint: "Ülke koduyla: +32 485 77 26 30" },
  { path: "company.email", label: "E-posta" },
  {
    path: "company.socials",
    label: "Sosyal medya",
    type: "items",
    fields: [
      { key: "label", label: "Platform adı (Instagram, X…)" },
      { key: "handle", label: "Kullanıcı adı" },
      { key: "url", label: "Bağlantı (https://…)" },
    ],
  },
];

export const IMAGE_SLOTS = [
  { key: "hero", label: "Ana sayfa – büyük fotoğraf", hint: "Dikey fotoğraf en iyi sonucu verir." },
  { key: "heroSmall", label: "Ana sayfa – küçük fotoğraf" },
  { key: "keuring", label: "Keuring bölümü fotoğrafı" },
  { key: "trust", label: "Ana sayfa – 'faydalar' fotoğrafı" },
  { key: "service-genel-elektrik", label: "Hizmet: Genel elektrik işleri" },
  { key: "service-keuring-arei", label: "Hizmet: Keuring / AREI" },
  { key: "service-yeni-bina-santiye", label: "Hizmet: Yeni bina & şantiye" },
  { key: "service-ev-laadpalen", label: "Hizmet: Şarj istasyonu" },
  { key: "service-kamera-interkom", label: "Hizmet: Kamera & diyafon" },
  { key: "servicesHero", label: "Hizmetler sayfası – üst arka plan" },
  { key: "projectsHero", label: "Projeler sayfası – üst arka plan" },
  { key: "aboutHero", label: "Hakkımızda – üst arka plan" },
  { key: "about", label: "Hakkımızda – fotoğraf" },
  { key: "contactHero", label: "İletişim – üst arka plan" },
];

const LIST_SKIP_NOTE = "Liste sayısı sitede sabit.";

export const SECTIONS = [
  {
    id: "hero",
    title: "Ana sayfa – üst bölüm",
    fields: [
      { path: "extras:heroBadge", label: "Üstteki küçük etiket" },
      { path: "extras:heroTitle", label: "Büyük başlık satırları", type: "lines", fixed: 2, hint: "2. satır sarı görünür." },
      { path: "extras:heroAccent", label: "Başlık altı kısa slogan" },
      { path: "content:home.intro", label: "Tanıtım metni", type: "textarea" },
      { path: "extras:heroChecks", label: "Onay işaretli maddeler", type: "list" },
      { path: "extras:freeQuote", label: "Teklif butonu yazısı" },
      { path: "extras:floatingOk", label: "Yüzen kart başlığı" },
      { path: "extras:floatingOkSub", label: "Yüzen kart alt yazısı" },
      { path: "extras:floatingYears", label: "Sarı daire alt yazısı ('yıllık ustalık')" },
      {
        path: "extras:stats",
        label: "Sayaçlar (4 kutu)",
        type: "items",
        fixed: 4,
        fields: [
          { key: "value", label: "Sayı", type: "number" },
          { key: "suffix", label: "Sayıdan sonra (+, yıl…)" },
          { key: "label", label: "Açıklama" },
        ],
      },
    ],
  },
  {
    id: "services",
    title: "Hizmetler (5 hizmet)",
    fields: [
      { path: "ui:home.servicesTitle", label: "Ana sayfa – hizmetler başlığı" },
      { path: "ui:home.servicesLead", label: "Ana sayfa – hizmetler açıklaması", type: "textarea" },
      { path: "ui:servicesPage.title", label: "Hizmetler sayfası başlığı" },
      { path: "ui:servicesPage.lead", label: "Hizmetler sayfası açıklaması", type: "textarea" },
      {
        path: "content:services",
        label: "Hizmetler",
        type: "items",
        fixed: 5,
        hint: LIST_SKIP_NOTE,
        fields: [
          { key: "title", label: "Hizmet adı" },
          { key: "badge", label: "Küçük etiket (boş bırakılabilir)" },
          { key: "intro", label: "Kısa açıklama", type: "textarea" },
          { key: "blocks", label: "Detay sayfası bölümleri", type: "blocks" },
          { key: "cta.title", label: "Sayfa sonu kutusu – başlık" },
          { key: "cta.subtitle", label: "Sayfa sonu kutusu – açıklama", type: "textarea" },
          { key: "cta.primaryLabel", label: "Sayfa sonu – ana buton" },
          { key: "cta.secondaryLabel", label: "Sayfa sonu – ikinci buton" },
          { key: "seoTitle", label: "Google başlığı" },
          { key: "seoDescription", label: "Google açıklaması", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "works",
    title: "Tüm işler listesi",
    fields: [
      { path: "extras:allWorksKicker", label: "Küçük başlık" },
      { path: "extras:allWorksTitle", label: "Başlık" },
      { path: "extras:allWorksLead", label: "Açıklama", type: "textarea" },
      { path: "extras:works", label: "İşler", type: "items", fields: [{ key: "label", label: "İş adı" }], hint: "Yeni eklenen işler şimşek ikonuyla görünür." },
    ],
  },
  {
    id: "keuring",
    title: "Keuring bölümü",
    fields: [
      { path: "extras:keuring.kicker", label: "Küçük başlık" },
      { path: "extras:keuring.title", label: "Başlık" },
      { path: "extras:keuring.lead", label: "Açıklama", type: "textarea" },
      { path: "extras:keuring.facts", label: "Sarı kutular", type: "items", fixed: 2, fields: [{ key: "value", label: "Büyük yazı" }, { key: "label", label: "Alt yazı" }] },
      { path: "extras:keuring.points", label: "Maddeler", type: "list" },
      { path: "extras:keuring.cta", label: "Buton" },
    ],
  },
  {
    id: "process",
    title: "Çalışma şekli",
    fields: [
      { path: "extras:processKicker", label: "Küçük başlık" },
      { path: "extras:processTitle", label: "Başlık" },
      { path: "extras:process", label: "Adımlar", type: "items", fields: [{ key: "title", label: "Adım" }, { key: "text", label: "Açıklama", type: "textarea" }] },
    ],
  },
  {
    id: "trust",
    title: "Faydalar (ana sayfa)",
    fields: [
      { path: "ui:home.audienceTitle", label: "Başlık" },
      { path: "content:home.audience", label: "Açıklama", type: "textarea" },
      { path: "content:home.trust", label: "Kartlar", type: "items", fields: [{ key: "title", label: "Başlık" }, { key: "text", label: "Açıklama", type: "textarea" }] },
    ],
  },
  {
    id: "projects",
    title: "Projeler",
    fields: [
      { path: "ui:projectsPage.title", label: "Başlık" },
      { path: "ui:projectsPage.lead", label: "Açıklama", type: "textarea" },
      {
        path: "content:projects",
        label: "Projeler",
        type: "items",
        fields: [
          { key: "image", label: "Fotoğraf", type: "image" },
          { key: "title", label: "Proje adı" },
          { key: "description", label: "Açıklama", type: "textarea" },
          { key: "tags", label: "Etiketler", type: "list" },
        ],
      },
      { path: "ui:projectsPage.ctaTitle", label: "Sayfa sonu başlığı" },
      { path: "ui:projectsPage.ctaLead", label: "Sayfa sonu açıklaması", type: "textarea" },
    ],
  },
  {
    id: "about",
    title: "Hakkımızda",
    fields: [
      { path: "content:about.title", label: "Başlık" },
      { path: "content:about.intro", label: "Tanıtım metni", type: "textarea", hint: "Boş satır yeni paragraf başlatır." },
      { path: "content:about.workingStyle", label: "Çalışma şeklimiz (maddeler)", type: "list" },
      { path: "content:about.values", label: "Değerler", type: "items", fields: [{ key: "title", label: "Başlık" }, { key: "text", label: "Açıklama", type: "textarea" }] },
      { path: "ui:aboutPage.localFocus", label: "Yerel bölüm başlığı" },
      { path: "content:about.localFocus", label: "Yerel bölüm metni", type: "textarea" },
    ],
  },
  {
    id: "area",
    title: "Hizmet bölgesi",
    fields: [
      { path: "extras:areaKicker", label: "Küçük başlık" },
      { path: "extras:areaTitle", label: "Başlık" },
      { path: "extras:areaLead", label: "Açıklama", type: "textarea" },
      { path: "extras:towns", label: "Belediyeler", type: "list" },
      { path: "extras:areaMore", label: "Listenin sonundaki yazı" },
    ],
  },
  {
    id: "faq",
    title: "Sık sorulan sorular",
    fields: [
      { path: "extras:faqKicker", label: "Küçük başlık" },
      { path: "extras:faqTitle", label: "Başlık" },
      { path: "extras:faq", label: "Sorular", type: "items", fields: [{ key: "q", label: "Soru" }, { key: "a", label: "Cevap", type: "textarea" }] },
    ],
  },
  {
    id: "contact",
    title: "İletişim sayfası",
    fields: [
      { path: "ui:contactPage.title", label: "Başlık" },
      { path: "content:contactPage.intro", label: "Giriş metni", type: "textarea" },
      { path: "content:contactPage.formHelp", label: "Form açıklaması", type: "textarea" },
      { path: "ui:contactPage.subjectOptions", label: "Konu seçenekleri", type: "list" },
      { path: "content:contactPage.closing", label: "Sağdaki kapanış metni", type: "textarea" },
      { path: "content:contact.addressLine", label: "Bölge / adres satırı" },
    ],
  },
  {
    id: "offer",
    title: "Teklif açılır penceresi",
    fields: [
      { path: "extras:offer.badge", label: "Etiket" },
      { path: "extras:offer.title", label: "Başlık" },
      { path: "extras:offer.lines", label: "Maddeler", type: "list" },
      { path: "extras:offer.dismiss", label: "'İlgilenmiyorum' yazısı" },
      { path: "extras:offer.waMessage", label: "WhatsApp hazır mesajı" },
    ],
  },
  {
    id: "general",
    title: "Genel: kapanış, alt bilgi, Google",
    fields: [
      { path: "extras:ctaTitle", label: "Sayfa sonu sarı kutu – başlık" },
      { path: "extras:ctaLead", label: "Sayfa sonu sarı kutu – açıklama", type: "textarea" },
      { path: "extras:waMessage", label: "WhatsApp butonu hazır mesajı" },
      { path: "ui:footer.shortDesc", label: "Alt bilgi açıklaması", type: "textarea" },
      { path: "ui:meta.homeTitle", label: "Google – ana sayfa başlığı" },
      { path: "ui:meta.homeDescription", label: "Google – ana sayfa açıklaması", type: "textarea" },
      { path: "ui:meta.servicesTitle", label: "Google – hizmetler başlığı" },
      { path: "ui:meta.servicesDescription", label: "Google – hizmetler açıklaması", type: "textarea" },
      { path: "ui:meta.projectsTitle", label: "Google – projeler başlığı" },
      { path: "ui:meta.projectsDescription", label: "Google – projeler açıklaması", type: "textarea" },
      { path: "ui:meta.aboutTitle", label: "Google – hakkımızda başlığı" },
      { path: "ui:meta.aboutDescription", label: "Google – hakkımızda açıklaması", type: "textarea" },
      { path: "ui:meta.contactTitle", label: "Google – iletişim başlığı" },
      { path: "ui:meta.contactDescription", label: "Google – iletişim açıklaması", type: "textarea" },
    ],
  },
];
