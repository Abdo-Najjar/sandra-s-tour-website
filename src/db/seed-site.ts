// Website sample content from the Stitch "Syria Guide Tours" design.
import { bookings, db, messages, pages, posts, site, subscribers, tours } from "./index";
import { defaultSiteContent, SITE_ROW_ID } from "../lib/site/content";
import { defaultSiteContentAr } from "../lib/site/content-ar";
import { mergeArDetails, postsAr, termsAr, toursAr } from "./seed-site-ar";
import { partialDetails, tourDetails, type TourDetails } from "../lib/site/tour";
import { tr } from "../lib/site/translatable";

const img = (n: string) => `/site/img${n}.jpg`;

const sandraSpec = { icon: "person", label: "Lead Historian", value: "Sandra Mansour", note: "Damascus Univ." };

const commonExcludes = [
  "International flights to Damascus / Beirut",
  "Syrian visa stamp fee at border (Security pre-approval letter is provided)",
  "Personal travel and health insurance",
  "Discretionary gratuities for local drivers and stewards",
];

const commonFaq = [
  {
    q: "How does the visa pre-approval process work for foreign passport holders?",
    a: "Upon reserving your date, we submit your passport copy to the Syrian Ministry of Tourism and Syrian Immigration. A formal security clearance letter is issued within 3 to 7 working days. You simply present this letter at Damascus airport or the Lebanese/Jordanian land borders to obtain your visa on arrival.",
  },
  {
    q: "Can this tour be combined with other routes?",
    a: "Absolutely. Most travelers combine routes into a comprehensive 7-day or 10-day Grand Levant Circuit. Use the custom request button in the booking card and we will design it with you.",
  },
];

type SeedTour = {
  slug: string;
  title: string;
  category: string;
  region: string;
  image: string;
  price: number;
  durationDays: number;
  summary: string;
  featured?: boolean;
  details: Partial<TourDetails>;
};

export const seedTours: SeedTour[] = [
  {
    slug: "grand-levant-odyssey",
    title: "The Grand Levant Odyssey",
    category: "unesco",
    region: "damascus",
    image: img("12"),
    price: 1850,
    durationDays: 10,
    featured: true,
    summary:
      "A comprehensive cultural odyssey linking Damascus, Aramaic-speaking Maaloula, the historic Krak des Chevaliers, the old souks of Aleppo and the timeless oasis of Palmyra, on fixed and guaranteed dates.",
    details: {
      badge: "UNESCO Highlights",
      subtitle: "A 10-Day Comprehensive Odyssey Across Syria’s UNESCO Heritage",
      durationLabel: "10 Days / 9 Nights",
      groupLabel: "Max 8 Guests",
      pace: "Easy-Moderate",
      departureIcon: "verified",
      departure: "Fixed departures: 1st & 3rd Saturday of every month",
      departureTag: "Every month",
      rating: "4.98",
      reviews: "68",
      route: "Ministry Route #201",
      checklist: [
        "Guaranteed monthly departures",
        "Heritage-house hotels in Damascus and Aleppo with security clearances and visa pre-approval",
        "Modern air-conditioned 4x4 with a licensed historian and archaeologist",
      ],
      specs: [
        { icon: "schedule", label: "Duration", value: "10 Days / 9 Nights", note: "Heritage Mansions" },
        { icon: "pin_drop", label: "Departure", value: "Damascus", note: "Airport or Beirut pickup" },
        { icon: "hiking", label: "Field Pace", value: "Easy-Moderate", note: "Daily walking" },
        { icon: "translate", label: "Interpretation", value: "English", note: "FR & DE on Request" },
        { icon: "badge", label: "Clearances", value: "All Included", note: "72h Expedited" },
        sandraSpec,
      ],
      gallery: [
        { image: img("12"), kicker: "Palmyra", title: "The Grand Colonnade at Golden Hour", text: "Sunset traversal along the monumental avenue of Queen Zenobia’s oasis." },
        { image: img("13"), kicker: "Damascus", title: "Umayyad Mosque Courtyard", text: "" },
        { image: img("14"), kicker: "Homs Gap", title: "Krak des Chevaliers", text: "" },
        { image: img("27"), kicker: "Aleppo", title: "The Citadel & Restored Souks", text: "" },
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "The Ultimate Comprehensive Journey Through the Levant",
      overview:
        "Traverse the Umayyad Mosque, ancient Palmyra colonnades, restored Aleppo souks, and the legendary Crusader castle with chief restoration scholars.\n\nThis guaranteed-departure itinerary links Syria’s great heritage corridors in one unhurried journey: the walled Old City of Damascus, the Aramaic mountain village of Maaloula, Krak des Chevaliers, the revived souks of Aleppo and the desert oasis of Palmyra.",
      highlights: [
        { icon: "mosque", title: "Umayyad Grand Mosque", text: "Inspect the 8th-century mosaics and the shrine of Saint John the Baptist with a licensed historian." },
        { icon: "record_voice_over", title: "Living Aramaic in Maaloula", text: "Hear the dialect spoken by Jesus Christ, still alive in the Qalamoun mountains." },
        { icon: "fort", title: "Krak des Chevaliers", text: "Explore the immense Crusader fortress above the Valley of the Christians." },
        { icon: "storefront", title: "Aleppo’s Restored Souks", text: "Walk the UNESCO-restored covered markets beneath the Citadel." },
      ],
      itinerary: [
        { title: "Arrival in Damascus & Bab Touma Welcome", subtitle: "Day 1", body: "VIP border protocol from Beirut/Amman or Damascus International Airport. Private transfer to a restored 18th-century Ottoman mansion in Old Damascus. Evening rooftop orientation dinner overlooking Mount Qasioun." },
        { title: "Umayyad Grand Mosque, Azem Palace & Al-Hamidiyah", subtitle: "Day 2", body: "Full-day survey of the walled Old City. Inspect the 8th-century Umayyad mosaics, the shrine of Saint John the Baptist, Azem Palace courtyards, and the vaulted iron-roofed souks." },
        { title: "Maaloula (Western Aramaic) & Krak des Chevaliers", subtitle: "Day 3", body: "Ascend the Qalamoun Mountains to hear the living dialect of Jesus Christ in Maaloula. Continue to the Valley of the Christians to explore the immense Krak des Chevaliers fortress." },
        { title: "Aleppo Citadel & Palmyra Oasis Sanctuary", subtitle: "Days 4–10", body: "Explore the surviving marvels of Northern Syria, UNESCO restored covered souks of Aleppo, and traverse the Syrian Badia towards Palmyra's temple precincts before return logistics." },
      ],
      includes: [
        "All checkpoint coordination and Ministry of Tourism permits",
        "Heritage hotel board in Damascus and Aleppo",
        "Licensed multilingual historian guide throughout",
        "Modern air-conditioned 4x4 with professional driver",
      ],
      excludes: commonExcludes,
      faq: commonFaq,
    },
  },
  {
    slug: "ancient-damascus-barada-valley",
    title: "Ancient Damascus & Barada Valley",
    category: "old-quarters",
    region: "damascus",
    image: img("13"),
    price: 550,
    durationDays: 4,
    featured: true,
    summary:
      "Discover the secrets of the world’s oldest inhabited capital: the Great Umayyad Mosque, Azem Palace, Damascene crafts and the quiet orchards of the Barada, on a carefully scheduled tour.",
    details: {
      badge: "Oldest Inhabited City",
      subtitle: "Courtyards, Souks & Ancient Churches of the World’s Oldest Capital",
      durationLabel: "4 Days / 3 Nights",
      groupIcon: "person",
      groupLabel: "Small groups & private parties",
      pace: "Leisurely",
      departureIcon: "calendar_today",
      departure: "Departs every Thursday, all year round",
      departureTag: "52 dates a year",
      rating: "5.0",
      reviews: "94",
      checklist: [
        "Private evening access to Azem Palace and the khans of Straight Street",
        "Meet the master craftsmen of Damascene brocade and mosaic",
        "Full Damascene hospitality in historic courtyard houses and restaurants",
      ],
      specs: [
        { icon: "schedule", label: "Duration", value: "4 Days / 3 Nights", note: "Courtyard boutique hotel" },
        { icon: "pin_drop", label: "Departure", value: "Old Damascus", note: "Every Thursday" },
        { icon: "hiking", label: "Field Pace", value: "Leisurely", note: "Walking tours" },
        sandraSpec,
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "Walk the Straight Street of Biblical Lore",
      overview:
        "Explore private Damascene mansions closed to regular tourism, the Umayyad Mosque, Azem Palace and the artisans of the old souks, then unwind in the quiet orchards of the Barada valley.",
      highlights: [
        { icon: "mosque", title: "Umayyad Mosque", text: "Golden Byzantine-era mosaics and the shrine of Saint John the Baptist." },
        { icon: "villa", title: "Private Courtyard Mansions", text: "Evening access to Azem Palace and restored Ottoman homes." },
        { icon: "checkroom", title: "Damascene Brocade Masters", text: "Meet the last weavers of the legendary Damask silk brocade." },
      ],
      itinerary: [
        { title: "Old City Orientation & Straight Street", subtitle: "Day 1", body: "Welcome at your courtyard hotel, then an evening walk along Straight Street and the Christian quarter of Bab Touma." },
        { title: "Umayyad Mosque, Azem Palace & Souk al-Hamidiyah", subtitle: "Day 2", body: "A full day with your historian inside the Umayyad Mosque, Azem Palace and the covered markets." },
        { title: "Artisans, Khans & Damascene Table", subtitle: "Day 3", body: "Brocade and mosaic workshops, Khan As'ad Pasha, and a family-style dinner in a heritage house." },
        { title: "Barada Valley Orchards & Farewell", subtitle: "Day 4", body: "A gentle morning in the Barada gardens before transfer to the airport or border." },
      ],
      includes: ["Boutique courtyard hotel in the Old City", "Licensed historian guide", "All site admissions", "Daily breakfast and two traditional dinners"],
      excludes: commonExcludes,
      faq: commonFaq,
    },
  },
  {
    slug: "citadels-of-the-levant",
    title: "Citadels of the Levant",
    category: "forts",
    region: "coast",
    image: img("14"),
    price: 1100,
    durationDays: 6,
    featured: true,
    summary:
      "Trace the military architecture of the Near East from the towering Citadel of Aleppo to Krak des Chevaliers, Masyaf and Saladin’s Castle on a coordinated coastal and mountain route.",
    details: {
      badge: "Crusader & Ayyubid",
      subtitle: "From the Citadel of Aleppo to the Crusader Coast",
      durationLabel: "6 Days / 5 Nights",
      groupLabel: "Max 10 Guests",
      pace: "Moderate",
      departureIcon: "event_repeat",
      departure: "Regular departures: the 10th & 25th of every month",
      departureTag: "All year round",
      rating: "4.96",
      reviews: "38",
      checklist: [
        "Expert architectural commentary inside the great fortresses",
        "Sea-view coastal stays in Tartus and Latakia",
        "All monument, museum and permit fees included",
      ],
      specs: [
        { icon: "schedule", label: "Duration", value: "6 Days / 5 Nights", note: "Coastal stays" },
        { icon: "pin_drop", label: "Departure", value: "Aleppo", note: "Or Damascus" },
        { icon: "hiking", label: "Field Pace", value: "Moderate", note: "Tower climbs" },
        sandraSpec,
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "The Military Architecture of the Near East",
      overview:
        "Trace the great fortresses of the Levant: the Citadel of Aleppo, Krak des Chevaliers, Masyaf and Saladin’s castle, ending on the Mediterranean shore at Tartus and Latakia.",
      highlights: [
        { icon: "castle", title: "Citadel of Aleppo", text: "The vast Ayyubid fortress crowning the old city." },
        { icon: "fort", title: "Krak des Chevaliers", text: "The finest surviving Crusader castle, praised by T.E. Lawrence." },
        { icon: "waves", title: "Tartus & Latakia", text: "Sea-view stays and the Templar quarter of Tortosa." },
      ],
      itinerary: [
        { title: "Aleppo Citadel & Souks", subtitle: "Days 1–2", body: "The Citadel, the restored covered souks and the Great Mosque of Aleppo." },
        { title: "Masyaf & Saladin’s Castle", subtitle: "Days 3–4", body: "Mountain fortresses of the Ismailis and the Crusaders on the coastal range." },
        { title: "Krak des Chevaliers & Tartus", subtitle: "Days 5–6", body: "The great concentric castle, then the Cathedral of Our Lady of Tortosa before returning." },
      ],
      includes: ["Coastal sea-view hotels", "All monument and museum fees", "Licensed architectural historian", "Private transport"],
      excludes: commonExcludes,
      faq: commonFaq,
    },
  },
  {
    slug: "living-stones-of-bosra",
    title: "The Living Stones of Bosra",
    category: "unesco",
    region: "damascus",
    image: img("15"),
    price: 320,
    durationDays: 2,
    summary:
      "A Hauran expedition to Bosra and its complete Roman theatre carved from black basalt, with Nabataean and early Islamic monuments.",
    details: {
      badge: "Black Basalt City",
      subtitle: "The Black Basalt Roman Theatre & the Hauran Plains",
      durationLabel: "2 Days / 1 Night",
      groupLabel: "Flexible group size",
      pace: "Easy",
      departureIcon: "calendar_view_week",
      departure: "Weekly departures every Friday and Saturday",
      departureTag: "Ready to book",
      rating: "4.95",
      reviews: "42",
      checklist: [
        "A unique acoustic experience inside Bosra’s Roman theatre",
        "Bosra’s Byzantine cathedral and the Mosque of Omar",
        "An authentic Hauran feast in a village home with olive oil and saj bread",
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "A Roman Theatre Carved from Black Basalt",
      overview:
        "Marvel at the black basalt Roman theatre at Bosra, one of the best preserved in the world, the Nabataean arch, the Byzantine cathedral and the early Islamic mosque of Omar.",
      highlights: [
        { icon: "theater_comedy", title: "The Roman Theatre", text: "A complete 15,000-seat theatre inside an Ayyubid citadel." },
        { icon: "church", title: "Byzantine Cathedral", text: "One of the earliest domed cathedral plans in the Christian world." },
      ],
      itinerary: [
        { title: "Damascus to Bosra", subtitle: "Day 1", body: "Drive south across the Hauran plains, explore the theatre and the Nabataean quarter, dinner in a village house." },
        { title: "Byzantine Bosra & Return", subtitle: "Day 2", body: "The cathedral, the mosque of Omar and the bazaar before returning to Damascus." },
      ],
      includes: ["Village guesthouse stay", "Licensed historian", "All admissions", "Hauran feast"],
      excludes: commonExcludes,
    },
  },
  {
    slug: "palmyra-silk-road-desert-traverse",
    title: "Palmyra & The Silk Road Desert Traverse",
    category: "desert",
    region: "desert",
    image: img("19"),
    price: 480,
    durationDays: 2,
    featured: true,
    summary:
      "A 2-day private archaeological expedition from Damascus with VIP security clearances, private historian accompaniment, and sunset access to the Valley of the Tombs.",
    details: {
      badge: "Queen Zenobia",
      subtitle: "A 2-Day Curated Silk Road Expedition & Subterranean Field Study",
      durationLabel: "2 Days / 1 Night",
      groupIcon: "shield",
      groupLabel: "Max 8 Explorers or Private VIP",
      pace: "Moderate",
      departureIcon: "schedule",
      departure: "Fixed departures: mid and end of every month",
      departureTag: "Security pre-coordinated",
      rating: "4.98",
      reviews: "42",
      route: "Ministry Route #482",
      checklist: [
        "Accompanied by an archaeologist specialising in Palmyra and the Roman East",
        "A secure, fully coordinated route with the official authorities",
        "A traditional Bedouin evening with wood-fire tea at the oasis camp",
      ],
      specs: [
        { icon: "schedule", label: "Duration", value: "2 Days / 1 Night", note: "Heritage Lodge" },
        { icon: "pin_drop", label: "Departure", value: "Damascus", note: "Private Chauffeur" },
        { icon: "hiking", label: "Field Pace", value: "Moderate Walking", note: "Field Study Level" },
        { icon: "translate", label: "Interpretation", value: "English", note: "FR & DE on Request" },
        { icon: "badge", label: "Clearances", value: "All Included", note: "72h Expedited" },
        sandraSpec,
      ],
      gallery: [
        { image: img("19"), kicker: "Decumanus Maximus", title: "The Grand Colonnaded Avenue", text: "Golden hour traversal alongside Palmyrene monumental archways and inscription corbels." },
        { image: img("20"), kicker: "Subterranean Hypogea", title: "Valley of the Tombs", text: "" },
        { image: img("21"), kicker: "Levant Hospitality", title: "Badiya Sunset & Cardamom Tea", text: "" },
        { image: img("22"), kicker: "Scholarly Field Briefing", title: "Sandra Mansour & On-Site Curators", text: "" },
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "An Unhurried Journey into Queen Zenobia’s Sun-Kissed Oasis",
      overview:
        "Rising from the scorched expanse of the Syrian Desert (al-Badiya), the oasis of Palmyra—known biblically and locally as Tadmur—stood for centuries as the indispensable crossroads between Greco-Roman Mediterranean ports and Persian Silk Road merchant caravans. This 2-day private itinerary is not a hurried sightseeing detour; it is an immersive, scholarly traverse designed for travelers seeking rigorous context, licensed safety clearance, and poetic resonance.\n\nAccompanied throughout by senior field historian Sandra Mansour, our travelers experience the monument’s complex syncretic identity: where Corinthian capitals were reimagined to honor Palmyrene deities Bel, Yarhibol, and Aglibol. You will witness firsthand the remarkable post-restoration ground reality, exploring both celebrated monumental axes and safeguarded subterranean hypogea closed to ordinary visitors.",
      highlights: [
        { icon: "temple_buddhist", title: "Temple of Bel Enceinte", text: "Private perimeter access accompanied by Department of Antiquities conservators detailing the structural stabilization and stone reconstruction." },
        { icon: "change_history", title: "Monumental 30° Axis Arch", text: "Scholarly breakdown of the ingenious architectural wedge that unified two mismatched street alignments without sacrificing urban harmony." },
        { icon: "account_balance", title: "Valley of the Tombs Hypogea", text: "VIP descent into intact subterranean funerary chambers adorned with limestone family banqueting portraits and Aramaic inscriptions." },
        { icon: "castle", title: "Fakhr-al-Din Citadel Sunset", text: "Panoramic twilight vantage from the 13th-century hilltop Mamluk fortress surveying the entire oasis, desert sea, and ancient colonnade." },
        { icon: "spa", title: "Afqa Oasis Spring & Groves", text: "Walk through the ancient sulphur thermal channels and ancient date palm orchards that sustained caravans over two millennia." },
        { icon: "local_fire_department", title: "Desert Stargazing & Mansaf", text: "An authentic Bedouin feast beneath the crystal-clear night canopy of al-Badiya, paired with local elder oral histories and Oud melodies." },
      ],
      itinerary: [
        {
          title: "Damascus to the Desert Oasis & Sunset Colonnade",
          subtitle: "Crossing the Syrian Badiya • Bagdad Café • Tetrapylon",
          body: "07:30 — Private air-conditioned 4x4 pickup from your boutique hotel in the Old City of Damascus. Following seamless manifest checks, we journey east across the Antilebanon rainshadow into the arid desert plateau.\n11:00 — Traditional mint tea and local almond dates stop at the iconic Bagdad Café desert outpost, followed by an overview of caravan route topography.\n13:30 — Arrival in Tadmur / Palmyra. Check-in and traditional lunch at Palmyra Heritage Oasis Lodge.\n15:30 – 18:30 — In-depth architectural exploration of the Grand Colonnade, the Roman Theatre, the Agora, and the monumental Tetrapylon. Sunset study as the limestone glows deep honey and ember.\n20:00 — Traditional dinner at the desert oasis tent featuring roasted lamb mansaf, fresh mountain herbs, and an astronomy briefing under zero light-pollution skies.",
        },
        {
          title: "Dawn at the Tombs, Museum Briefing & Return",
          subtitle: "Valley of the Tombs • Conservation Labs • Return to Damascus",
          body: "06:00 — Optional dawn excursion to Fakhr-al-Din al-Ma'ani Castle for morning light casting long shadows across the archaeological park.\n08:30 — Fresh Levantine breakfast at the lodge (sheep labneh, wild thyme, local flatbreads, and Syrian coffee).\n09:30 — Special access exploration of the Valley of the Tombs, including the Tower Tomb of Elahbel and subterranean hypogea with preserved polychrome relief traces.\n12:00 — Curatorial meeting at the Palmyra Archaeological Conservation Center, reviewing artifact cataloging and recent stabilization works.\n14:00 — Farewell oasis lunch before a relaxed return journey back to Damascus, arriving by approximately 18:30.",
        },
      ],
      includes: [
        "Official Syrian Ministry of Tourism road & site clearances",
        "Private modern 4x4 expedition transport with professional driver",
        "Full-time licensed lead archaeologist (Sandra Mansour)",
        "1-Night stay at boutique Palmyra Heritage Oasis Lodge",
        "All site admissions, hypogea access & local monument fees",
        "Full board traditional meals, bottled mineral water & desert tea",
      ],
      excludes: [...commonExcludes, "Handcrafted souvenirs and personal artisan purchases"],
      logistics: [
        { icon: "wb_sunny", title: "Desert Climate & Attire", text: "Sturdy ankle-support footwear is mandatory for uneven limestone surfaces. Breathable linen or cotton for daytime; a wool scarf or warm jacket is essential for desert nights." },
        { icon: "photo_camera", title: "Photography Guidelines", text: "Handheld digital SLR and mirrorless photography is warmly permitted across all monument sites. Aerial drones and tripods inside museum interiors require advance Ministry permit." },
        { icon: "shield", title: "Clearance Timeline", text: "We submit all traveler passports to the Syrian Tourism Directorate 72 hours prior to departure. Checkpoints along the highway are cleared effortlessly by our driver." },
      ],
      testimonials: [
        { quote: "Standing under the monumental arch at sunset with Sandra explaining Queen Zenobia's defiance was easily the most profound archaeological experience of my lifetime. The logistics were flawless, dignified, and exceptionally safe.", name: "Dr. Alistair Finch", role: "Near Eastern Studies, Oxford", date: "October 2024" },
        { quote: "As an independent female traveler from Switzerland, I had natural apprehensions. From the first WhatsApp consultation to our dinner under the desert stars, Syria Guide Tours delivered supreme care and world-class scholarship.", name: "Elena Wyss", role: "Zurich, Switzerland", date: "January 2025" },
      ],
      faq: [
        { q: "Is traveling to Palmyra secure and approved by international travel protocols?", a: "Yes. The Damascus-Palmyra corridor is secured and civilian transport travels daily. Our expeditions operate strictly under official Syrian Ministry of Tourism route manifests with active check-in tracking. We provide pre-trip security briefings and 24/7 communications." },
        ...commonFaq,
      ],
      mapImage: "/site/img24.png",
      mapRoute: "Damascus → Ad-Dumayr → Palmyra",
      mapDistance: "235 km from Damascus",
    },
  },
  {
    slug: "krak-des-chevaliers-coastal-heritage",
    title: "Krak des Chevaliers & Coastal Heritage",
    category: "forts",
    region: "coast",
    image: img("29"),
    price: 360,
    durationDays: 2,
    summary:
      "Ascend the concentric stone curtains described by T.E. Lawrence as the finest castle in christendom, traverse the fertile Christian Valley of Marmarita, and trace Phoenician seawalls into Templar Tortosa.",
    details: {
      badge: "UNESCO World Heritage",
      subtitle: "Crusader Citadels, Phoenician Seawalls & The Fragrant Valley of the Christians",
      durationLabel: "2 Days / 1 Night",
      groupLabel: "Private VIP / Curated Group",
      pace: "Moderate",
      departureIcon: "event_available",
      departure: "On-demand departures from Damascus or Homs",
      departureTag: "Fully flexible",
      rating: "4.96",
      reviews: "38",
      route: "Ministry Route #319",
      checklist: [
        "A tour inside Krak des Chevaliers with a licensed archaeologist guide",
        "Overnight in the Valley of the Christians with dinner facing the floodlit castle",
        "Tartus Cathedral and a seafood lunch at the old harbour",
      ],
      specs: [
        { icon: "schedule", label: "Duration", value: "2 Days / 1N", note: "Boutique stay in Al-Wadi" },
        { icon: "directions_car", label: "Chassis & Transit", value: "4x4 Luxury", note: "Damascus / Homs Departure" },
        { icon: "hiking", label: "Expedition Pace", value: "Moderate", note: "Tower climbs & ramparts" },
        { icon: "translate", label: "Interpretation", value: "English", note: "French & German upon request" },
        { icon: "badge", label: "Permits & Access", value: "Fast-Track", note: "All DGAM security cleared" },
        { icon: "person", label: "Curator Lead", value: "Sandra M.", note: "& Dr. Tariq Al-Husseini" },
      ],
      gallery: [
        { image: img("29"), kicker: "Qal'at al-Hosn Sanctuary", title: "The Western Concentric Talus & Valley Overlook", text: "Towering 650 meters above the strategic Homs Gap, presiding over historic trade routes connecting the Mediterranean to the Orontes basin." },
        { image: img("30"), kicker: "Internal Ward Architecture", title: "The Hospitaller Grand Loggia", text: "" },
        { image: img("31"), kicker: "Tartus Heritage", title: "Templar Sea Gate", text: "" },
        { image: img("32"), kicker: "Epigraphy & Survey", title: "Baybars Inscription", text: "" },
      ],
      overviewEyebrow: "Historical Curatorial Narrative",
      overviewTitle: "\"Perhaps the Most Wholly Admirable Castle in the World\"",
      overview:
        "Perched like a limestone titan high above the lush rolling terraces of the Wadi al-Nasara, Krak des Chevaliers represents the zenith of high-medieval defensive fortifications. Built originally on the footprint of an 11th-century Kurdish garrison fortress, the site was transformed by the Order of Saint John of Jerusalem between 1142 and 1271 into an impregnable concentric citadel.\n\nWhen the Mamluk Sultan Baybars captured the bastion after a legendary siege in 1271, he did not dismantle its colossal walls; he repaired the breach, appended circular towers, and engraved royal victory epigraphs in cursive Thuluth script. Today every level—from the aqueduct-fed cisterns to the soaring Gothic banqueting hall—stands accessible to travelers under expert historical custody.",
      quote: "There is no military building in Europe or the Orient that possesses this astonishing balance of monumental scale, geometric precision, and delicate Gothic sophistication.",
      quoteBy: "Dr. Tariq Al-Husseini, Syrian Antiquities Restoration Directorate",
      highlights: [
        { icon: "architecture", title: "The Hospitaller Grand Loggia", text: "Explore pure 13th-century Rayonnant Gothic vaults, delicate cloverleaf rosettes, and the famous Latin moral epigraph carved above the doorway." },
        { icon: "history_edu", title: "Sultan Baybars' Royal Inscriptions", text: "Examine the colossal Arabic frieze on the southern round tower detailing the 1271 Mamluk capitulation terms." },
        { icon: "water_drop", title: "Subterranean Water Reservoirs", text: "Venture into the barrel-vaulted undercroft, vast granary vaults, and the hydraulic moat system engineered to withstand multi-year sieges." },
        { icon: "visibility", title: "360° Bastion Panoramic Vista", text: "Ascend the Warden's Keep for a panorama sweeping from Mount Lebanon's snow peaks across the Homs Gap." },
        { icon: "church", title: "Cathedral of Our Lady of Tortosa", text: "Discover the Romanesque-Gothic fortified cathedral in the seaside port of Tartus." },
        { icon: "local_dining", title: "Marmarita Olive Oil & Valley Table", text: "Tasting of cold-pressed coastal olive oils, mountain za'atar, and an evening mezze facing the illuminated ramparts." },
      ],
      itinerary: [
        {
          title: "Damascus to Krak des Chevaliers & Sunset Ramparts",
          subtitle: "Distance: ~165 km • Private 4x4",
          body: "08:00 — Chauffeured pickup from your Damascus heritage hotel and scenic ascent through the Anti-Lebanon mountain corridors with a curatorial briefing en route.\n12:00 — Check-in at boutique valley lodgings in Marmarita and a private terrace lunch with a view of the castle ridge.\n14:00 — In-depth exploration of Qal'at al-Hosn with Sandra Mansour: the Crusader chapel, knight dormitories, Mamluk baths and subterranean granaries.\n18:00 — Golden hour atop the high bastion, then a candlelit dinner facing the floodlit fortress.",
        },
        {
          title: "Phoenician Ramparts, Old Tartus & Mediterranean Shore",
          subtitle: "Distance: ~65 km coastal drive + Damascus return",
          body: "08:00 — Village breakfast of fresh labneh, figs, and wild honey, then a scenic descent to the Mediterranean port of Tartus.\n10:00 — The Cathedral of Our Lady of Tortosa and the narrow alleys of the Templar quarter.\n13:00 — Seafood lunch at a stone tavern fronting the ancient harbor.\n16:00 — Leisurely return to Damascus or Homs, arriving by early evening.",
        },
      ],
      includes: [
        "Ministry of Tourism & Antiquities permits with VIP security clearances",
        "Dedicated licensed archaeologist guide (Sandra Mansour) throughout",
        "1-Night boutique heritage lodging in Marmarita / Al-Wadi",
        "Private 4x4 with professional chauffeur",
        "Full board dining (2 Lunches, 1 Dinner, 1 Breakfast)",
        "All site admissions (Krak des Chevaliers, Tartus Cathedral & Museum)",
      ],
      excludes: commonExcludes,
      logistics: [
        { icon: "hiking", title: "Footwear", text: "Sturdy treaded walking shoes are mandatory. The medieval ramps and spiral stairways have polished limestone textures." },
        { icon: "photo_camera", title: "Photography", text: "DSLR and mirrorless cameras are welcome throughout the castle and Tartus. Drones require a separate permit." },
        { icon: "thermostat", title: "Climate", text: "The castle ridge is windy and cool even in summer; bring a light layer for the sunset ramparts." },
      ],
      faq: commonFaq,
      mapImage: "/site/img34.png",
      mapRoute: "Damascus → Homs Gap → Krak → Tartus",
      mapDistance: "165 km from Damascus",
    },
  },
  {
    slug: "syrian-culinary-heritage",
    title: "Syrian Culinary Heritage & Silk Road Tasting",
    category: "gastronomy",
    region: "aleppo",
    image: img("17"),
    price: 890,
    durationDays: 5,
    summary:
      "Uncover the famous spices of Aleppo and the heritage sweets of Damascus, with live cooking workshops led by the finest family cooks in authentic Damascene and Aleppine homes.",
    details: {
      badge: "Silk Road Flavors",
      subtitle: "Spices of Aleppo, Sweets of Damascus & Family Kitchens",
      durationLabel: "5 Days / 4 Nights",
      groupLabel: "Max 8 Guests",
      pace: "Leisurely",
      departureIcon: "dinner_dining",
      departure: "Fixed departure: 2nd Wednesday of every month",
      departureTag: "Limited seats",
      rating: "4.97",
      reviews: "31",
      checklist: [
        "A tasting tour of Souq al-Bzouriyeh with veteran spice merchants",
        "An exclusive workshop on Aleppo cherry kebab and authentic muhammara",
        "Watch Damascene ice cream pounded and rolled in Aleppo pistachios",
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "A Journey Through the World’s Oldest Continuous Kitchens",
      overview:
        "Taste your way from the spice stalls of Souq al-Bzouriyeh in Damascus to the family kitchens of Aleppo, where Silk Road caravans shaped the most refined cuisine of the Levant.",
      highlights: [
        { icon: "restaurant", title: "Aleppo Cooking Workshop", text: "Sour-cherry kebab and muhammara with a family of Aleppine chefs." },
        { icon: "icecream", title: "Bakdash Ice Cream", text: "Watch the pounding of mastic ice cream rolled in Aleppo pistachios." },
      ],
      itinerary: [
        { title: "Damascus Spice Souks", subtitle: "Days 1–2", body: "Souq al-Bzouriyeh, sweet makers of Midan and a courtyard dinner." },
        { title: "Aleppo Kitchens", subtitle: "Days 3–5", body: "Cooking workshops, kibbeh varieties and the restored Aleppo souks." },
      ],
      includes: ["Heritage hotels", "All tastings and workshops", "Culinary historian guide", "Private transport"],
      excludes: commonExcludes,
    },
  },
  {
    slug: "palmyra-sunrise-desert-nomads",
    title: "Palmyra Sunrise & Desert Nomads",
    category: "desert",
    region: "desert",
    image: img("16"),
    price: 620,
    durationDays: 3,
    summary:
      "An authentic journey to Zenobia’s capital: sunrise over the Valley of the Tombs, Palmyra’s green oasis and an evening with the desert people under a star-filled sky.",
    details: {
      badge: "Queen Zenobia",
      subtitle: "Sunrise over the Valley of the Tombs & a Night with the Bedouin",
      durationLabel: "3 Days / 2 Nights",
      groupIcon: "shield",
      groupLabel: "Secure escort & protection",
      pace: "Moderate",
      departureIcon: "schedule",
      departure: "Fixed departures: mid and end of every month",
      departureTag: "Security pre-coordinated",
      rating: "4.95",
      reviews: "27",
      checklist: [
        "Accompanied by an archaeologist specialising in Palmyra and the Roman East",
        "A secure, fully coordinated route with the official authorities",
        "A traditional Bedouin evening with wood-fire tea at the oasis camp",
      ],
      overviewEyebrow: "Curatorial Perspective",
      overviewTitle: "Dawn in Zenobia’s Desert Capital",
      overview:
        "Watch the sun rise over the funerary towers of Palmyra, walk the oasis groves and spend an evening of Bedouin hospitality under a sky full of stars.",
      itinerary: [
        { title: "Across the Badiya to Palmyra", subtitle: "Day 1", body: "Desert crossing from Damascus and a first sunset on the colonnade." },
        { title: "Sunrise, Tombs & the Oasis", subtitle: "Day 2", body: "Sunrise at the Valley of the Tombs, the oasis groves and a Bedouin camp evening." },
        { title: "Return to Damascus", subtitle: "Day 3", body: "A relaxed morning and the drive back to the capital." },
      ],
      includes: ["Desert lodge and camp nights", "Licensed archaeologist", "All clearances", "Full board"],
      excludes: commonExcludes,
    },
  },
];

export const seedPosts = [
  {
    slug: "palmyra-revisited",
    title: "Palmyra Revisited: Decoding the Architectural Mastery of Queen Zenobia's Desert Oasis",
    category: "Archaeology & Antiquities",
    excerpt:
      "A deep dive by our archaeological team into the monumental colonnades, funerary towers, and trade crossroads that shaped Tadmur into the ancient world's most glamorous merchant empire.",
    cover: img("50"),
    author: "Sandra (Lead Guide) & Dr. Tariq Al-Husseini",
    readMinutes: 8,
    tags: "Palmyra, UNESCO, LevantineHistory, Archaeology, QueenZenobia, SilkRoad",
    publishedAt: "2025-10-24",
    featured: true,
    body: `## The Oasis Crossroads: Where Silk, Spices, and Semitic Sovereignty Converged

To understand Palmyra’s architectural audacity, one must first confront the sheer geographical insolence of its location. Positioned nearly 215 kilometers northeast of Damascus, Palmyra—originally recorded as Tadmur in 2nd-millennium BCE Babylonian cuneiform tablets—existed because of a warm sulfurous spring known as Efqa. This subterranean aquifer sustained date palm groves and rendered trans-desert caravan travel feasible.

Palmyra’s wealth did not derive from agrarian harvest but from the perilous protection and transport of luxury goods between the Persian Gulf and the Mediterranean ports. Palmyrene archers guarded the caravans carrying silk from Han Dynasty China, Indian black pepper, Arabian frankincense, and Roman purple dyes.

> “I am a queen; and as long as I live, I will rule.” — Queen Zenobia (Bat-Zabbai)

## The Great Colonnade & The Thirty-Degree Monumental Bend

The defining visual spine of the city is the 1.1-kilometer Great Colonnade, constructed across three imperial phases between the 2nd and 3rd centuries CE. Between the Temple of Bel and the main urban artery lay an abrupt topographical shift: a 30-degree realignment. Rather than bulldozing sacred sanctuaries to enforce strict symmetry, Palmyrene architects devised the iconic Monumental Arch.

![Detail of mid-shaft brackets unique to Palmyra](/site/img51.jpg)

The arch is fundamentally an optical masterpiece: two divergent facades joined at an angle. As caravan travelers approached from the southeast, the arch appeared perfectly aligned with the Bel temenos; once passing beneath it, the roadway pivoted 30 degrees toward the Tetrapylon without jarring the visual continuity.

## The Vertical Eternity: Tower Tombs and the Cult of the Ancestors

Outside the city walls stands Palmyra’s world-renowned necropolis: the Valley of the Tombs. Palmyrene merchant clans constructed multi-story towers reaching up to five stories tall—vertical apartment complexes for the deceased, each niche sealed with a high-relief limestone bust.

- **Bilingual epitaphs:** Greek public titles paired with Aramaic tribal genealogies.
- **Hypogea vaults:** subterranean burial chambers holding up to 400 individuals.
- **Silk Road textiles:** remnants of Chinese damask silk uncovered within burials.
- **Anastylosis restoration:** joint heritage scaffolding stabilizing cracked architraves.

### Field Guide Insight — Sandra Mansour

Enter the Valley of the Tombs at exactly 4:30 PM in late autumn. The golden hour casts amber light into the vertical shafts of the Tower of Elahbel, illuminating the plaster ceiling coffers and Palmyrene Aramaic epitaphs with a glow no museum lighting can simulate.

## Zenobia’s Defiance: When an Oasis Ruled the Levant and Egypt

Following the assassination of her husband Odaenathus in 267 CE, Queen Septimia Zenobia seized control of the Palmyrene Empire as regent for her young son. In a rapid campaign that stunned Rome, her cavalry annexed Syria, Palestine, and Egypt before she minted coins bearing her own likeness as Augusta. Though Aurelian captured the city in 272 CE, Zenobia cemented Palmyra as an eternal emblem of Levantine fortitude.

## Traveler Advisory: Logistics & Permits (2025/2026)

- **Ministry security manifest:** visitors must travel with an accredited guide on an authorized tour company manifest.
- **Route from Damascus:** about 3.5 hours by private 4x4 via Al-Qaryatayn.
- **Best season:** October to April, with mild daytime temperatures of 18°C–24°C.
- **Photography:** cameras are welcome; civilian drone flights are prohibited.`,
  },
  {
    slug: "secret-courtyards-of-damascus",
    title: "The Secret Courtyards of Damascus: A Guide to Bayt Nizam, Bayt Sibai, and Traditional Living Architecture",
    category: "Living Old Quarters",
    excerpt:
      "Step past the modest external clay walls into hidden paradise courtyards fragrant with Seville orange trees, basalt ablaq stone patterns, and centuries of residential urban grace.",
    cover: img("42"),
    author: "Lina S. (Damascus Guide)",
    readMinutes: 6,
    tags: "Damascus, Architecture, OldCity",
    publishedAt: "2025-10-28",
    body: `Behind the plain mud-brick walls of Old Damascus lie some of the most beautiful domestic spaces in the Islamic world. The Damascene house turns its back to the street and opens inward to a courtyard of fountains, citrus trees and striped ablaq stone.

## Bayt Nizam and Bayt Sibai

These two 18th-century mansions show the house at its most refined: painted wooden ceilings, marble inlay and the iwan, a vaulted open hall facing north to catch the summer breeze.

- Visit in the late afternoon, when the courtyards are cool and quiet.
- Look up: the painted ceilings are the real treasure.
- Ask your guide about private homes that open only to small groups.`,
  },
  {
    slug: "secrets-of-the-aleppo-kitchen",
    title: "The Secrets of the Aleppo Kitchen: How 12 Spices and Sour Cherries Define a Culinary Heritage",
    category: "Syrian Culinary Traditions",
    excerpt:
      "Explore the gastronomy of Aleppo, where Silk Road spice trades converged with Levant fruit orchards to produce world-renowned sour cherry kebabs and intricate kibbeh varieties.",
    cover: img("43"),
    author: "Chef Mahmoud Al-Halabi",
    readMinutes: 5,
    tags: "Aleppo, Food, Kibbeh",
    publishedAt: "2025-11-02",
    body: `Aleppo sat at the end of the Silk Road for centuries, and its kitchen remembers every caravan. Spices from India and Persia met the orchards of northern Syria to create dishes found nowhere else.

## Kebab bil-Karaz

The city’s signature dish pairs lamb kebab with a sauce of sour wild cherries. It appears only in early summer, when the cherries are in season.

## Sixty Kinds of Kibbeh

Aleppine cooks claim more than sixty varieties of kibbeh: fried, baked, raw, stuffed with quince or cooked in yoghurt.`,
  },
  {
    slug: "navigating-krak-des-chevaliers",
    title: "Navigating Krak des Chevaliers: Tactical Genius and Crusader Engineering on the Syrian Coastal Ridge",
    category: "Archaeology & Antiquities",
    excerpt:
      "An architectural breakdown of the world's most formidable concentric castle, examining subterranean granaries, water aqueducts, and concentric defense layers praised by T.E. Lawrence.",
    cover: img("44"),
    author: "Dr. Tariq Al-Husseini",
    readMinutes: 7,
    tags: "Krak, Crusaders, Castles",
    publishedAt: "2025-11-10",
    body: `Krak des Chevaliers commands the Homs Gap, the only natural passage between the Syrian interior and the Mediterranean. Whoever held the castle controlled the road.

## Two Rings of Stone

The castle is concentric: an outer wall with round towers, a moat fed by an aqueduct, and an inner fortress rising on a steep sloping talus.

> “Perhaps the best preserved and most wholly admirable castle in the world.” — T.E. Lawrence

## What to See

- The Gothic loggia and the knights’ hall
- The long vaulted entrance ramp, built to slow attackers
- Sultan Baybars’ inscription on the southern tower`,
  },
  {
    slug: "first-time-in-syria",
    title: "First Time in Syria: Clearances, Visas, Currency & Practical Etiquette for 2025/2026",
    category: "Traveler Field Guides & Advice",
    excerpt:
      "Clear, updated guidance on obtaining the Syrian security clearance, border crossing from Beirut or Amman, banking practicalities, and local guest customs.",
    cover: img("45"),
    author: "Sandra (Founder & Host)",
    readMinutes: 9,
    tags: "Visa, Travel Tips, Safety",
    publishedAt: "2025-11-15",
    body: `Planning a first trip to Syria raises many questions. Here is what our guests ask most often.

## The Security Clearance

Most foreign passport holders need a pre-approval before arrival. We file it for you: send us a scan of your passport page and we handle the rest. Approval usually takes 5 to 12 working days.

## Money

International cards do not work in Syria. Bring clean US dollar or euro notes; your tour package covers permits, hotels and transport.

## Etiquette

- Dress modestly in mosques and old quarters.
- Always accept tea when it is offered—it is the start of every friendship.
- Ask before photographing people.`,
  },
  {
    slug: "maaloula-living-echo-of-aramaic",
    title: "Maaloula and the Living Echo of Aramaic: Walking the Gorge with Native Speakers",
    category: "Living Old Quarters",
    excerpt:
      "How a mountain enclave in the Qalamoun range safeguards Western Neo-Aramaic, the language spoken by Jesus, preserved through liturgy, oral tradition, and rugged geography.",
    cover: img("46"),
    author: "Elias Khoury (Qalamoun Guide)",
    readMinutes: 6,
    tags: "Maaloula, Aramaic, Heritage",
    publishedAt: "2025-11-19",
    body: `Maaloula clings to the cliffs of the Qalamoun mountains, an hour north of Damascus. Its people still speak Western Neo-Aramaic, the language of Jesus.

## The Gorge of Saint Thecla

A narrow cleft in the rock leads to the convent of Saint Thecla. Walking it with a local speaker, you will hear the Lord’s Prayer recited in Aramaic.`,
  },
  {
    slug: "damascene-brocade-and-mosaic-guilds",
    title: "The Damascene Brocade and Mosaic Guilds: Inside the Workshops Preserving Silk and Wood Inlay",
    category: "Artisans & Silk Road Crafts",
    excerpt:
      "Step inside the family-run atelier producing genuine Syrian brocade and see master marquetry artisans craft mother-of-pearl masterpieces.",
    cover: img("47"),
    author: "Nour Al-Assad (Heritage Fellow)",
    readMinutes: 5,
    tags: "Crafts, Brocade, Damascus",
    publishedAt: "2025-11-24",
    body: `Damask silk gave its name to a whole family of fabrics. Today only a handful of looms still weave true Damascene brocade.

## Wood and Mother-of-Pearl

In the workshops near Bab Sharqi, artisans cut thousands of tiny pieces of walnut, bone and shell to build the geometric patterns of Damascene marquetry. A single box can take weeks.`,
  },
];

export async function seedWebsite() {
  // One row with both languages: {"en": {...}, "ar": {...}}.
  await db.insert(site).values({ id: SITE_ROW_ID, data: { en: defaultSiteContent, ar: defaultSiteContentAr } });

  const tourRows = await db
    .insert(tours)
    .values(
      seedTours.map((t, i) => {
        const ar = toursAr[t.slug];
        return {
        slug: t.slug,
        title: tr(t.title, ar?.title),
        category: t.category,
        region: t.region,
        image: t.image,
        price: t.price,
        durationDays: t.durationDays,
        summary: tr(t.summary, ar?.summary),
        details: { en: tourDetails(t.details), ar: ar ? partialDetails(mergeArDetails(t.details, ar.details)) : {} },
        featured: t.featured ?? false,
        sortOrder: i,
        };
      }),
    )
    .returning({ id: tours.id, title: tours.title });

  await db.insert(posts).values(
    seedPosts.map((p) => {
      const ar: Partial<Record<string, string>> = postsAr[p.slug] ?? {};
      return {
        ...p,
        title: tr(p.title, ar.title),
        category: tr(p.category, ar.category),
        excerpt: tr(p.excerpt, ar.excerpt),
        author: tr(p.author, ar.author),
        tags: tr(p.tags, ar.tags),
        body: tr(p.body, ar.body),
      };
    }),
  );

  const now = Date.now();
  const ago = (days: number) => new Date(now - days * 86_400_000).toISOString().slice(0, 19).replace("T", " ");
  await db.insert(bookings).values([
    { tourId: tourRows[0].id, tourTitle: tourRows[0].title.en, name: "Claire Dubois", email: "claire@example.com", phone: "+33 6 12 34 56 78", nationality: "France", tourClass: "Boutique Small Group (Max 8-10 guests)", arrivalDate: "2026-04-11", adults: 2, children: 0, flexibility: "±3 Days Flexible", note: "We are interested in Roman architecture.", source: "contact", status: "new", createdAt: ago(1) },
    { tourId: tourRows[4].id, tourTitle: tourRows[4].title.en, name: "Johan Berg", email: "johan@example.com", phone: "+46 70 123 45 67", nationality: "Sweden", tourClass: "Private VIP", arrivalDate: "2026-03-20", adults: 1, children: 0, flexibility: "Exact dates required", note: "", source: "tour", status: "contacted", createdAt: ago(4) },
    { tourId: null, tourTitle: "Bespoke Diplomatic / Photographic Route", name: "Amal Haddad", email: "amal@example.com", phone: "+1 514 555 0199", nationality: "Canada", tourClass: "Syrian Diaspora Heritage Homecoming", arrivalDate: "2026-05-02", adults: 3, children: 2, flexibility: "Flexible within month", note: "Family roots visit to Homs.", source: "guide", status: "confirmed", createdAt: ago(9) },
  ]);

  await db.insert(messages).values([
    { kind: "partnership", name: "Levant Heritage Travel", email: "hello@example.com", phone: "+961 3 123 456", location: "Beirut, Lebanon", category: "Tourism Company or Inbound/Outbound Travel Agency", body: "We would like to send small groups from Beirut each month and co-operate on visa handling.", createdAt: ago(2) },
    { kind: "partnership", name: "Bayt Al-Yasmin Guesthouse", email: "stay@example.com", phone: "+963 944 000 111", location: "Damascus, Syria", category: "Heritage Hotel, Boutique Stay or Dining", body: "Our restored courtyard house has 8 rooms. We would love to host your guests.", read: true, createdAt: ago(6) },
  ]);

  await db.insert(subscribers).values([{ email: "reader@example.com" }, { email: "historian@example.com" }]);

  await db.insert(pages).values([
    {
      slug: "terms",
      title: tr("Booking Terms & Conditions", termsAr.title),
      subtitle: tr("Clear, fair terms for every expedition", termsAr.subtitle),
      body: tr("## Reservations\n\nA booking request does not require payment. We confirm availability and clearances first.\n\n## Payments\n\nDeposits are settled once your security clearance is approved.\n\n## Cancellations\n\n- Free cancellation up to 30 days before arrival\n- 50% refund between 30 and 14 days\n- No refund within 14 days", termsAr.body),
      showInMenu: false,
    },
  ]);

  console.log(`Seeded website: ${seedTours.length} tours, ${seedPosts.length} posts, 3 bookings, 2 messages.`);
}
