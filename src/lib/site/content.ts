import { defaultSiteContentAr } from "./content-ar";
import { faqEn } from "./faq";
import type { Lang } from "./i18n";
import { conform } from "./shape";
import type { Tr } from "./translatable";

// Every editable text and image on the public website, in English. The Arabic
// copy has the same shape (content-ar.ts). The dashboard edits it section by
// section (see SITE_SECTIONS); both languages live in one row of the `site` table.

const img = (n: string) => `/site/img${n}.jpg`;

export const defaultSiteContent = {
  general: {
    name: "Syria Guide Tours",
    tagline: "LICENSED CULTURAL EXPEDITIONS",
    logo: "/site/logo.png",
    seoTitle: "Syria Guide Tours | Licensed Cultural Expeditions in Syria",
    seoDescription:
      "Curated private and small-group cultural expeditions across Syria led by certified Syrian tour guides, historians and local scholars.",
    bookLabel: "Book an Expedition",
    bookHref: "/contact",
    menu: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Tours", href: "/tours" },
      { label: "Our Guide", href: "/guide" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/contact#faq" },
      { label: "Contact & Booking", href: "/contact" },
    ],
  },

  contact: {
    whatsapp: "+963 933 789012",
    phones: "+963 11 223 4900 / +963 944 123456",
    email: "concierge@syrianlocalguides.com",
    partnershipsEmail: "partnerships@syrianlocalguides.com",
    offices: [
      {
        icon: "location_city",
        title: "Damascus HQ",
        address: "Bab Sharqi (Eastern Gate), Straight Street, Old City Heritage District",
        hours: "Open Daily: 08:30 – 19:00",
      },
      {
        icon: "domain",
        title: "Aleppo Office",
        address: "Al-Jamiliyah Quarter, adjacent to Baron Street & National Museum",
        hours: "Open Sat–Thu: 09:00 – 17:30",
      },
    ],
  },

  footer: {
    about:
      "Curating distinguished expeditions, archaeological surveys, and authentic cultural hospitality throughout Damascus, Aleppo, Palmyra, Bosra, and the Mediterranean littoral.",
    badges: [
      { icon: "verified", text: "Ministry of Tourism Licensed" },
      { icon: "shield", text: "VIP & Diplomatic Protocol" },
    ],
    linksTitle: "Quick Links",
    links: [
      { label: "Home Overview", href: "/" },
      { label: "Our Historians & Guides", href: "/about" },
      { label: "Curated Tour Itineraries", href: "/tours" },
      { label: "Heritage Dispatch & Blog", href: "/blog" },
      { label: "Travel Advisory & FAQ", href: "/contact#faq" },
      { label: "Custom Inquiries", href: "/contact" },
    ],
    officesTitle: "Regional Offices",
    newsletterTitle: "The Levant Dispatch",
    newsletterText:
      "Receive seasonal cultural dispatches, visa protocol updates, and newly unlocked archaeological routes.",
    newsletterPlaceholder: "Enter your diplomatic or personal email",
    newsletterButton: "Subscribe to Dispatch",
    copyright:
      "© 2025 Syria Guide Tours. Registered & Licensed under Syrian Ministry of Tourism. All rights reserved.",
    bottomLinks: [
      { label: "Safety & Protocol", href: "/about#safety" },
      { label: "Visa Facilitation", href: "/contact#faq" },
      { label: "Agency Inquiries", href: "/contact#partnership" },
    ],
  },

  home: {
    hero: {
      image: img("02"),
      badge: "Ministry of Tourism Licensed Guides",
      status: "2025–2026 Expeditions Booking Now",
      kicker: "The Cradle of Timeless Civilizations",
      title: "Reopening the Cradle of Civilizations with Syrian Warmth & Resilience.",
      text: "Curated private and small-group cultural expeditions led by certified Syrian tour guides, historians, and local scholars. Connecting international travelers, cultural delegations, and expatriates to the living soul of Syria.",
      searchButton: "Explore Tours",
      perks: [
        { icon: "shield_lock", text: "Full Visa Facilitation Included" },
        { icon: "car_rental", text: "Chauffeured Armored / Premium Fleet" },
      ],
      note: "All tours certified carbon-balanced & community-invested",
    },
    mission: {
      eyebrow: "Beyond Headlines, Into History",
      title: "Look Past the Headlines — Experience the Living Reality of Syria",
      text1:
        "We are a team of passionate, officially licensed tour guides based in the historic heart of Damascus, certified by the Syrian Ministry of Tourism. For us, tourism is not just a business; it is a calling to revive the true spirit of travel, bridging cultures and turning international travelers into lifelong friends.",
      text2:
        "Our mission is to deliver unforgettable, authentic, and immersive travel experiences. We go beyond standard sightseeing loops by weaving together expert historical storytelling, rich culinary journeys, and meaningful interactions with local communities.",
      quote: "“Welcome to the land of light and jasmine”",
      quoteText: "We welcome you to our ancient cities with true Damascene hospitality, to tell the real stories of history from their very source.",
      founderTitle: "Founded by Sandra",
      founderNote: "Damascus Univ. Faculty of Tourism • Lic. No. 842/SY",
      image: img("04"),
      cardIcon: "balance",
      cardTitle: "Ministry Vetted",
      cardText: "Autonomous security & itinerary clearance",
    },
    tours: {
      eyebrow: "Curated Expeditions",
      title: "Flagship Syrian Itineraries",
      text: "Hand-crafted journeys designed with archaeological depth, private access, and luxury heritage accommodations.",
      button: "View All Tours",
    },
    custom: {
      icon: "design_services",
      title: "Need a Tailor-Made Diplomatic or Family Itinerary?",
      text: "We design custom schedules matching specific diplomatic agendas, academic missions, or family ancestral visits.",
      button: "Request Custom Itinerary",
      href: "/contact",
    },
    why: {
      eyebrow: "Institutional Trust & Field Excellence",
      title: "Why Discerning Voyagers Choose Us",
      text: "Traveling in Syria requires seasoned on-the-ground intelligence, licensed legal clearances, and elevated hospitality.",
      items: [
        {
          icon: "verified",
          title: "100% Ministry Licensed",
          text: "Certified by the Syrian Ministry of Tourism and based directly in historic Old Damascus, ensuring authentic institutional backing and valid clearance.",
          tag: "Direct Old City presence",
        },
        {
          icon: "handshake",
          title: "Living Cultural Bridge",
          text: "Reviving Syrian travel with warmth, resilience, and genuine human connection—turning curious international visitors into cherished lifelong friends.",
          tag: "Genuine Syrian hospitality",
        },
        {
          icon: "route",
          title: "Beyond Standard Loops",
          text: "Deep archaeological storytelling, private Syrian family courtyards, rich culinary heritage, and meaningful encounters with master craftspeople.",
          tag: "Immersive custom access",
        },
        {
          icon: "shield_with_heart",
          title: "Care, Safety & Discretion",
          text: "Diplomatic-grade security clearances, seamless inter-city fleet logistics, and dedicated 24/7 personal accompaniment from border to border.",
          tag: "Diplomatic-grade standards",
        },
      ],
    },
    banner: {
      icon: "military_tech",
      title: "Serving Embassies, UN Missions & Cultural Institutions",
      text: "Experienced in handling diplomatic protocol, official delegation transport, archival researchers, and media security escorts with complete discretion.",
      button: "Diplomatic Inquiries",
      href: "/contact",
    },
    testimonials: {
      eyebrow: "Voices From Syria",
      title: "Traveler & Scholar Testimonials",
      note: "Over 450 verified international visitors guided since 2021",
      items: [
        {
          quote:
            "As an archaeologist who had not been to Syria since 2009, I was deeply moved by the care, profound academic depth, and logistical grace provided by Syria Guide Tours. Standing in Palmyra again was transformative.",
          name: "Dr. Eleanor Vance",
          role: "Near Eastern Studies, Oxford University",
        },
        {
          quote:
            "The entire trip was flawless. The visa paperwork was handled smoothly, checkpoints were effortless thanks to our guide’s credentials, and our stay in the old courtyard boutique hotel in Damascus was unforgettable.",
          name: "Marc-Antoine Bellon",
          role: "Cultural Traveler, Geneva",
        },
        {
          quote:
            "Returning to my grandparents’ home country for the first time was emotional. The team curated our family roots journey with exceptional sensitivity, connecting us with village elders and historic records.",
          name: "Layla Haddad",
          role: "Diaspora Heritage Guest, Montreal",
        },
      ],
    },
    blog: {
      eyebrow: "The Syrian Dispatch",
      title: "Essays on History, Architecture & Living Culture",
      button: "Read All Journal Articles",
    },
    cta: {
      eyebrow: "Begin Your Journey to Syria",
      title: "Ready to walk through the gates of history?",
      text: "Our trip coordinators assist with every detail: from entry permits and visa paperwork to personal dietary requests, private security arrangements, and custom route design.",
      checks: [
        { text: "Complimentary Itinerary Draft in 24 Hours" },
        { text: "Direct WhatsApp Concierge" },
        { text: "Zero Obligation Consultation" },
      ],
      button: "Book a Consultation",
      whatsappButton: "Chat via WhatsApp",
    },
  },

  tours: {
    hero: {
      badge: "Authorized Historical Itineraries",
      title: "Unforgettable Journeys Across Syria",
      text: "More than sightseeing – come experience Syria’s rich traditions, delicious local cuisine, and stunning landscapes with welcoming friends who make you feel right at home.",
      statValue: "100%",
      statLabel: "Warm Syrian Hospitality",
    },
    filters: {
      title: "Tour Categories",
      text: "Choose your route by travel style and interest",
      all: "All Tours",
      categories: [
        { key: "unesco", icon: "history_edu", label: "UNESCO & Ancient Wonders", note: "Palmyra, Bosra & Aleppo" },
        { key: "old-quarters", icon: "location_city", label: "Historic Quarters & Old Towns", note: "Old Damascus & Aleppo" },
        { key: "forts", icon: "fort", label: "Castles & Coastline", note: "Krak des Chevaliers & Masyaf" },
        { key: "desert", icon: "sunny", label: "Desert Adventures & Oases", note: "Syrian Desert & Palmyra" },
        { key: "gastronomy", icon: "restaurant", label: "Street Food & Vibrant Souks", note: "Silk Road Flavors" },
      ],
      regions: [
        { key: "damascus", label: "Damascus & Southern Syria" },
        { key: "aleppo", label: "Aleppo & the North" },
        { key: "coast", label: "The Coast & Coastal Castles" },
        { key: "desert", label: "The Desert & Palmyra" },
      ],
      emptyTitle: "No tours match the current filters",
      emptyText: "Reset your search options, or ask us to design a fully private tour around your interests and preferred dates.",
    },
    scheduled: {
      eyebrow: "Join Us Anytime!",
      eyebrowNote: "Pick the dates that work best for you!",
      title: "Ready to Go Adventures All Year Round?",
      text: "We run regular weekly and monthly trips across all seasons. Enjoy effortless planning, instant booking confirmation, and unforgettable moments exploring the real Syria with new local friends.",
      badgeTitle: "Trips running 365 days a year",
      badgeText: "",
      detailsButton: "Schedule & Details",
      bookButton: "Book Instantly",
    },
    bespoke: {
      badge: "Private & Custom Tours",
      badgeNote: "Flexible • No Rules 100%",
      title: "Want to make your dream trip to Syria true?",
      checks: [
        { text: "Hate strict schedules? Love freedom?" },
        { text: "Tired of boring, repeated tours? Want a trip made just for you?" },
      ],
      highlight: "We are here to make your trip to Syria a real and unforgettable experience!",
      perks: [
        { icon: "schedule", title: "Total Freedom of Timing", text: "You choose the start date, the length of your stay, and your daily touring hours — no fixed group or set departure." },
        { icon: "route", title: "A Route Built for You", text: "A custom route focused on your exact interests: photography, architecture, ancient history, or food." },
        { icon: "directions_car", title: "Private Car & Expert Guide", text: "A modern, comfortable vehicle with a professional driver, and a licensed guide dedicated to you and your family for the whole trip." },
        { icon: "published_with_changes", title: "Change Plans on the Go", text: "Change the day’s plan, stay longer at a site, or add a spontaneous activity at any moment, smoothly." },
      ],
      ctaTitle: "Talk to our private tour advisor now",
      ctaText: "Our team is available around the clock to answer instantly, give advice, and design your private program within minutes.",
      whatsappButton: "Chat instantly on WhatsApp",
      formButton: "Email us / Private request form",
    },
    inclusions: {
      title: "Standard Inclusions Across All Expeditions",
      text: "Every journey organized by Syria Guide Tours is comprehensively managed from entry to departure.",
      items: [
        { icon: "badge", title: "Official Visa & Permits", text: "Ministry of Foreign Affairs clearance, security verification, and expedited entry approvals for all registered travelers." },
        { icon: "history_edu", title: "Licensed Historians", text: "Certified guide-lecturers with advanced degrees in Levantine archaeology, Arabic literature, and Byzantine history." },
        { icon: "bed", title: "Heritage Mansions", text: "Curated stays in preserved Damascus courtyards (bayt ash-sha'mi) and Aleppo boutique stone quarters." },
        { icon: "health_and_safety", title: "24/7 Field Coordination", text: "Real-time route surveillance, bilingual ground managers, satellite communications, and certified first-aid logistics." },
      ],
    },
    detail: {
      newsletterEyebrow: "Cultural Dispatch",
      newsletterTitle: "Receive Quarterly Epigraphic & Field Updates",
      newsletterText:
        "Curated historical papers, restoration milestones, and seasonal security briefs delivered directly from our Damascus research desk.",
      relatedEyebrow: "Expand Your Horizon",
      relatedTitle: "Complementary Expeditions in Syria",
      bookingNote: "Price based on 2 travelers in private curated SUV. Solo traveler tariffs and group discounts available on request.",
      bookingPerks: [
        { icon: "verified", text: "Zero upfront fee until security clearances confirmed" },
        { icon: "support_agent", text: "24/7 dedicated diplomatic and logistical oversight" },
        { icon: "hotel", text: "Handpicked boutique heritage lodge included" },
      ],
      customTitle: "Custom Extension?",
      customText: "Combine this route with Krak des Chevaliers, Homs, or Aleppo.",
    },
  },

  about: {
    hero: {
      eyebrow: "Who We Are",
      title: "About Syria Guide Tours",
      text1:
        "We are a team of passionate, licensed tour guides based in the historic heart of Old Damascus. Fully certified by the Syrian Ministry of Tourism, we believe that travel is more than just sightseeing—it is a living experience. Our mission is to share Syria’s rich cultural heritage, legendary warmth, and local lifestyle with the world.",
      text2:
        "Moving away from traditional, cookie-cutter tour itineraries, we invite you to experience genuine Syrian hospitality. Join our guided tours in Syria, explore hidden gems with local experts, and truly live like a local.",
      stats: [
        { value: "100%", label: "Licensed Guides" },
        { value: "14+", label: "Provinces Covered" },
        { value: "24/7", label: "Ground Support" },
      ],
      emblemTop: "LEVANTE",
      emblemBottom: "Est. 2011",
      quote:
        "Every limestone paver between Bab Sharqi and the Citadel of Aleppo holds a witness to the human continuum. We do not just guide; we translate memory.",
      quoteBy: "Founding Consortium of Syrian Historians & Archaeologists",
    },
    purpose: {
      eyebrow: "Our Core Purpose",
      title: "Our Vision & Our Mission",
      vision: {
        kicker: "Future Outlook",
        title: "Our Vision: A Bridge to the World",
        text: "To be the main bond connecting Syrian culture with travelers from everywhere. We want our visitors to discover the real Syria, far beyond the news headlines—to experience our daily life, breathtaking nature, ancient history, vibrant traditions, and authentic hospitality. Our dream is to build a global community where every traveler arrives as a guest and leaves as a lifelong friend.",
        tag: "Cultural Connection & Lifelong Friendships",
      },
      mission: {
        kicker: "Our Commitment",
        title: "Our Mission",
        text: "Our mission is to deliver unforgettable, authentic, and immersive travel experiences for foreign tourists visiting Syria. We go beyond the standard sightseeing loops by weaving together expert historical storytelling, rich culinary journeys, and meaningful, first-hand interactions with local communities. We are here to guide you through our history, immerse you in our culture, and help you live the real Syrian experience alongside the people who call it home.",
        tag: "Authentic Storytelling & Living Heritage",
      },
      values: [
        { icon: "history_edu", title: "Historical Integrity", text: "Academic accuracy and verified regional chronicles." },
        { icon: "storefront", title: "Local Communities", text: "Direct economic support to historic artisans and crafts." },
        { icon: "security", title: "Total Traveler Safety", text: "Full protocol clearances and professional escort." },
        { icon: "restaurant", title: "Culinary Immersion", text: "Traditional Syrian gastronomy and family hospitality." },
      ],
    },
    founder: {
      image: img("33"),
      badge: "Founder & Lead Tour Guide",
      eyebrow: "Founder & Lead Guide",
      title: "Meet Sandra | Founder & Lead Tour Guide",
      creds: [
        { icon: "school", text: "Faculty of Tourism, Damascus University" },
        { icon: "badge", text: "Licensed Tour Guide" },
        { icon: "location_on", text: "Damascus Base" },
      ],
      quote: "Hi, I’m Sandra. A Syrian tour guide and tour operator in my twenties who is deeply in love with history and heritage!",
      paragraphs: [
        { text: "My passion for travel led me to graduate from the Faculty of Tourism at Damascus University. With years of hands-on experience organizing trips and guiding travelers from whole the world, I specialize in creating seamless, authentic journeys across Syria." },
        { text: "To me, tourism is more than a job; it’s a way to bridge cultures and turn international travelers into lifelong friends. I don't just show you ancient monuments and dates, I introduce you to the living soul of Syria, from our rich history to our incredible local food and warm communities." },
        { text: "Think of me not just as your official guide, but as your passionate local friend. I can’t wait to welcome you and show you the beauty of Syria through my eyes!" },
      ],
      button: "Plan a Trip with Sandra",
    },
    team: {
      eyebrow: "Academic Leadership",
      title: "Meet Our Senior Guides & Researchers",
      text: "Not general tour escorts, but esteemed scholars, field researchers, and cultural figures who have dedicated decades to the preservation of Syrian antiquities.",
      members: [
        { image: img("62"), field: "Archaeology & Epigraphy", name: "Dr. Tariq Al-Husseini", bio: "Former Professor of Classical Archaeology at Damascus University. Spent 28 years surveying the Roman Decumanus, Bosra’s basalt theatre, and Late Antique mosaics.", languages: "EN • AR • DE", experience: "28+ Years" },
        { image: img("63"), field: "Levantine Art & Architecture", name: "Nour Shammas", bio: "Sorbonne-educated specialist in Mamluk and Ottoman civic architecture. Renowned for unlocking private historical palatial courtyards and archival collections throughout Damascus.", languages: "EN • FR • AR", experience: "16 Years" },
        { image: img("64"), field: "Conservation Architect", name: "Rami Kabbani", bio: "Lead restoration consultant for northern Syrian citadels and the reconstructed Souq Al-Saqatiyya in Aleppo. Expert on defensive medieval fortifications and masonry chemistry.", languages: "EN • AR • IT", experience: "21 Years" },
        { image: img("65"), field: "Cultural Anthropology", name: "Layla Mansour", bio: "Specialized in the living heritage of Syrian mountain villages, western Aramaic preservation in the Qalamoun range, and traditional artisanal culinary practices.", languages: "EN • AR • ES", experience: "14 Years" },
      ],
    },
    accreditations: {
      eyebrow: "Institutional Credentials",
      title: "Accredited by National & Global Bodies",
      text: "Committed to the highest standards of safety, ethics, and scholarly integrity.",
      items: [
        { icon: "approval", title: "Ministry of Tourism", text: "Class-A licensed guiding consortium registered officially under License No. 418/DAM." },
        { icon: "badge", title: "WFTGA Member", text: "Adhering to international codes of interpretation, ethical heritage standards, and neutrality." },
        { icon: "museum", title: "DGAM Collaboration", text: "Privileged academic coordination granting authorized access to active scientific excavations." },
        { icon: "medical_services", title: "Red Crescent Certified", text: "100% of field guides and expedition drivers undergo annual emergency response training." },
      ],
    },
    safety: {
      eyebrow: "Traveler Safety & Protocol",
      title: "Travel Syria with Absolute Peace of Mind",
      text: "We understand that visiting Syria requires unwavering clarity and logistical precision. For over a decade, we have provided an unblemished record of safety for diplomats, international journalists, cultural missions, and travelers worldwide.",
      items: [
        { title: "Official Visa & Security Clearance Support", text: "Full assistance with Syrian Ministry of Tourism clearances, border reception at Beirut / Amman / Damascus Airport." },
        { title: "Vetted Luxury Transport & Insured Logistics", text: "Modern, climate-controlled, GPS-equipped private Mercedes and Toyota fleet with veteran professional drivers." },
        { title: "24/7 Dedicated Concierge & Operational Oversight", text: "Continuous coordination hub tracking road conditions, weather, and venue reservations in real-time." },
      ],
      image: img("66"),
      imageTitle: "Reliable Ground Operation",
      imageText: "Direct border-to-border escort and personalized itinerary coordination across all Syrian provinces.",
    },
    cta: {
      eyebrow: "Tailored Tours & Inquiries",
      title: "Begin Your Journey with Syria’s Preeminent Historians",
      text: "Whether planning a private diplomatic study tour, an archaeological photographic survey, or an individual heritage pilgrimage, our specialists are ready to curate every detail.",
      primary: "Request Custom Itinerary",
      secondary: "Explore Curated Tours",
      notes: [
        { icon: "schedule", text: "Responses within 12 hours" },
        { icon: "lock", text: "Confidential Diplomatic Handling" },
      ],
    },
  },

  guide: {
    hero: {
      eyebrow: "OUR ACCREDITED TEAM & FOUNDER",
      status: "Status: Available for 2025/2026 Expeditions • Certified by Syrian Ministry of Tourism",
      title: "Explore Syria with Certified Local Experts",
      text: "Syria Guide Tours connects you with passionate, licensed professionals who bring history to life and ensure your journey is safe and unforgettable.",
      primary: "Book your next tour with us!",
      secondary: "Explore our expert guides",
      stats: [
        { icon: "verified_user", value: "100%", label: "Ministry Licensed" },
        { icon: "history_edu", value: "12+ Years", label: "of Guiding Expertise" },
        { icon: "groups", value: "350+", label: "Tailored Tours Provided" },
        { icon: "shield", value: "Premium", label: "& Secure Protocols" },
      ],
    },
    profile: {
      eyebrow: "FEATURED PROFILE",
      image: img("60"),
      chip: "Licensed Tour Guide #8412 • Founder",
      chipClass: "Class A",
      chipNote: "Accredited by Syrian Ministry of Tourism & WFTGA Registered",
      role: "Founder & Lead Tour Guide",
      name: "Sandra",
      title: "Senior Cultural Diplomat",
      education: "Bachelor’s Degree in Office Management & Tourism Guiding",
      languages: "🇸🇾 Arabic (Native) | 🇬🇧 English (Professional)",
      credentials: "Verified Credentials: Syrian Ministry of Tourism License Class-A • WFTGA Compliant",
      about: [
        { text: "Hi, I am Sandra! I am a licensed tour guide and trip organizer with a lifelong passion for Syria’s unparalleled history, ancient archaeology, and vibrant culture. By combining my background in professional management with my deep love for travel, I founded Syria Guide Tours." },
        { text: "For me, tourism is about creating unforgettable human connections. I don’t just show you places; I bring you into the heart of Syrian life. I am excited to be your companion, guide, and friend on the ground!" },
      ],
      stats: [
        { value: "12+", label: "Years Field Experience" },
        { value: "350+", label: "Curated Delegations" },
        { value: "100%", label: "Safety Track Record" },
      ],
      button: "Reserve Sandra",
    },
    offers: {
      eyebrow: "CURATED EXPERIENCES",
      title: "What I Offer On My Tours",
      text: "Every itinerary blends rigorous historical exploration with visceral Levantine hospitality, private culinary admissions, and seamless logistical execution.",
      items: [
        { icon: "explore", title: "Hidden Gems & Famous Icons", tag: "Discovery", text: "We will explore world-famous landmarks, but I will also take you off the beaten path to secret alleys and stories known only to locals.", example: "E.g., Umayyad Minarets & Hidden Al-Qaymariyya Courtyards" },
        { icon: "restaurant", title: "Culinary Journeys", tag: "Gastronomy", text: "Get ready to taste authentic Syrian flavors, featuring a special focus on the legendary, spice-infused dishes of the Aleppo kitchen.", example: "E.g., Kibbeh Safarjaliyeh, Fattet Makdous, Artisanal Spices" },
        { icon: "handshake", title: "Local Interactions", tag: "Community", text: "I design itineraries that let you connect directly with local artisans, shopkeepers, and families to experience true Syrian hospitality.", example: "E.g., Brocade Weavers, Inlaid Wood Crafters, Mosaic Guilds" },
        { icon: "route", title: "Tailored Adventures", tag: "Bespoke", text: "From bustling traditional souks to outdoor experiences, every detail is organized smoothly and professionally.", example: "E.g., Krak des Chevaliers expeditions, Palmyra desert dawn" },
      ],
    },
    why: {
      eyebrow: "THE LOCAL ADVANTAGE",
      title: "Why Syria Guide Tours?",
      text: "Navigating Syria demands uncompromising compliance, verified clearances, and deep regional relationships built over decades.",
      items: [
        { icon: "shield", title: "100% Licensed", text: "Every guide operating under our platform holds an official license issued by the Ministry of Tourism in Syria.", tag: "Official Class-A Status" },
        { icon: "location_on", title: "Deep Local Knowledge", text: "We don't just navigate; we provide deep cultural, historical, and logistical expertise.", tag: "Direct Community Roots" },
        { icon: "public", title: "Multilingual Support", text: "While our primary international tours are conducted in English, we can arrange guides for other languages upon advanced request.", tag: "FR • DE • ES • IT On Request" },
      ],
      bannerTitle: "Institutional Assurance",
      bannerText: "24/7 Diplomatic & Field Operations Support throughout all Syrian Governorates",
      bannerTag: "Verified Security Protocols",
    },
    booking: {
      eyebrow: "DIRECT TOUR SCHEDULING",
      title: "Booking & Availability",
      text: "Seamless reservations with verified logistics and direct consultation.",
      flexTitle: "Flexible Operations",
      flexText: "Our guiding services are available year-round, 24/7, matching your travel schedule.",
      noticeTitle: "Booking Notice & Lead Times",
      dayTours: "Day Tours: Can be arranged up to 48 hours in advance.",
      multiDay: "Multi-Day Itineraries: We highly recommend booking 1 to 2 weeks in advance so we can secure clearances and tailor the perfect route for you.",
      response: "Average response time: Under 2 hours",
      visaNote: "Visa & Security Clearance Included with all guided packages",
      cardName: "Sandra",
      cardRole: "Assigned Lead Expeditioner",
      options: [
        { text: "Multi-Day Syrian Grand Traverse (7-10 Days)" },
        { text: "Damascus Old City Heritage Day Tour (1 Day)" },
        { text: "Aleppo Citadel & Souk In-Depth (3 Days)" },
        { text: "Krak des Chevaliers & Coastal Byzantine (2 Days)" },
        { text: "Bespoke Diplomatic / Photographic Route" },
      ],
      submit: "Request Sandra as Your Lead Guide",
      success: "Thank you! Sandra’s expedition desk has received your request. We will contact you within 2 hours with visa and routing availability.",
    },
    network: {
      eyebrow: "OUR LOCAL TEAM",
      title: "Meet our Guides",
      text: "Our team of local guides is here to welcome you, share amazing stories, and make you feel right at home in every city you visit.",
      items: [
        { initials: "TA", field: "Archaeology & Roman Era", name: "Dr. Tariq Al-Husseini", role: "Palmyra & Bosra Roman Antiquities Specialist", bio: "Former adjunct lecturer at Damascus University with 20+ years documenting classical Roman theater acoustics and Nabataean trade networks.", license: "Lic. #7109", languages: "Arabic • English • French" },
        { initials: "RK", field: "Aleppo Heritage & Souks", name: "Rami Kabbani", role: "Northern Levant Architectural Restorer", bio: "Native of Aleppo’s Al-Jadida Quarter, deeply integrated with the traditional soapmakers, silk weavers, and UNESCO restoration teams.", license: "Lic. #8922", languages: "Arabic • English • German" },
        { initials: "LM", field: "Christian Heritage & Coastal", name: "Layla Mansour", role: "Maaloula, Sednaya & Crusader Castles", bio: "Fluent Western Neo-Aramaic and English speaker focusing on monastic traditions, Crusader fortifications, and Phoenician coastal citadels.", license: "Lic. #9034", languages: "Arabic • English • Aramaic" },
      ],
    },
  },

  contactPage: {
    hero: {
      status: "2025/2026 Expeditions Booking Window Active",
      eyebrow: "Concierge & Visa Advisory Desk",
      title: "Plan Your Journey to the Cradle of Civilization",
     
      text: "Whether you are visiting for custom research, a long-term stay, or a private trip designed around your personal interests. Our licensed local team handles all your visa paperwork and logistics, ensuring a safe, smooth, and welcoming journey.",
      badgeTitle: "100% Official & Licensed",
      badgeText: "by the Syrian Ministry of Tourism (License #4188/DM)",
      badgeNote: "Beirut & Jordan Airport VIP pickup available",
    },
    form: {
      title: "Expedition Reservation Form",
     
      text: "Please provide your details below. Syrian entry regulations require preliminary security and passport pre-clearance, which our team coordinates directly with the immigration registry on your behalf.",
      customTour: "Custom Tailored / Research Itinerary (Flexible)",
      classes: [
        { text: "Private VIP (Exclusive dedicated historian & chauffeured 4WD)" },
        { text: "Boutique Small Group (Max 8-10 guests)" },
        { text: "Diplomatic, UN, or Institutional Delegation" },
        { text: "Archaeological & University Survey Party" },
        { text: "Syrian Diaspora Heritage Homecoming" },
      ],
      flexibility: [{ text: "Exact dates required" }, { text: "±3 Days Flexible" }, { text: "Flexible within month" }],
      submit: "Request Itinerary & Booking Quote",
      note: "No advance payment charged now",
      successTitle: "Inquiry Received with Distinction",
      successText: "A Senior Tour Coordinator has logged your request. We will draft your tailored logistical dossier and contact you via WhatsApp & email within 24 hours.",
    },
    assist: {
      kicker: "Direct Ground Operations",
      status: "Active 24/7",
      title: "Need Immediate Assistance?",
      text: "For urgent border liaison, upcoming travel windows under 14 days, or diplomatic delegation protocol, reach our direct operations lead:",
      whatsappTitle: "WhatsApp Quick Concierge",
      whatsappNote: "(English & Arabic)",
      emailTitle: "Official & Institutional Mail",
    },
    steps: {
      title: "What Happens Next?",
      items: [
        { title: "Prompt 24-Hour Consultation", text: "A dedicated Damascus tour curator assesses your party profile, travel timing, and specific regional interests." },
        { title: "Bespoke Dossier & Security Clearance", text: "We supply an itemized day-by-day itinerary and initiate your Ministry of Tourism visa pre-approval code." },
        { title: "Secure Confirmation & Arrival Protocol", text: "Finalize arrangements with full transparent terms and receive your personal driver / border transfer liaison guide." },
      ],
    },
    offices: {
      title: "Resident Bureaus",
      image: img("67"),
      caption: "Welcoming tea served at our Bab Sharqi courtyard reception.",
    },
    partnership: {
      eyebrow: "Professional Alliances & Heritage Synergies",
      title: "Partner & Collaborate With Us",
      question: "Want to work with us? Have an idea, a project, or expertise you want to showcase?",
      text: "Whether you are an International or Regional Tourism Company, Independent Business Owner, Cultural Project, or Certified Local Guide, collaborate with Syria Guide Tours to elevate and expand cultural tourism across Syria.",
      groups: [
        { icon: "travel_explore", title: "Companies & Travel Agencies", text: "Joint itineraries, incoming client reception handling, certified visa clearance facilitation, and tailored bespoke group packages across Syrian provinces.", tag: "B2B Contracted Alliances" },
        { icon: "storefront", title: "Local Businesses & Cultural Projects", text: "Artisan workshops, boutique Levantine heritage stays, traditional culinary experiences, and restoration initiatives integrated directly into our guest routes.", tag: "Direct Cultural Showcase" },
        { icon: "badge", title: "Licensed Tour Guides & Researchers", text: "Field archaeologists, multilingual historians, and licensed regional docents seeking institutional delegation assignments and specialized heritage research expeditions.", tag: "Scholarly Field Accreditation" },
      ],
      benefitsEyebrow: "Why Partner With Us",
      benefitsTitle: "Collaboration Benefits & Synergies",
      benefitsText: "We build respectful, long-standing alliances grounded in professional heritage preservation, ethical promotion, and sustainable local economic impact.",
      benefits: [
        { icon: "visibility", title: "Direct Visibility & Verified Promotion", text: "Present your crafts, accommodations, or regional tours to verified diplomatic, academic, and cultural travelers." },
        { icon: "verified", title: "Official Logistics & Field Clearance Support", text: "Coordination under Syrian Ministry of Tourism license #4188/DM with verified transport corridors and site access." },
        { icon: "groups", title: "Scholarly & Institutional Network Access", text: "Direct bridge with international universities, archaeological missions, museum curators, and cultural preservation funds." },
        { icon: "alt_route", title: "Custom Tailored Packaging & Integration", text: "Seamless inclusion of authentic culinary, craft, or lodging elements into our high-touch private expeditions." },
      ],
      formTitle: "Partnership Application Form",
      formText: "Please share your collaboration initiative or service credentials below. All submissions are directly evaluated by our senior coordination committee within 48 business hours.",
      categories: [
        { text: "Tourism Company or Inbound/Outbound Travel Agency" },
        { text: "Local Business, Artisan Atelier or Cultural Project" },
        { text: "Licensed Tour Guide or Academic Researcher" },
        { text: "Heritage Hotel, Boutique Stay or Dining" },
        { text: "Other Cultural or Institutional Venture" },
      ],
      submit: "Submit Partnership Request",
      successTitle: "Partnership Request Received",
      successText: "Your proposal has been forwarded directly to our Executive Committee. A partnership director will contact you via WhatsApp and email to discuss practical next steps.",
    },
    routes: {
      eyebrow: "Geographic Operational Scope",
      title: "Regional Exploration Hubs & Routes",
      text: "Our private vehicles operate across every secured cultural province, with seamless overland entry corridors through Beirut International Airport (BEY) or direct Damascus (DAM).",
      mapImage: "/site/img68.png",
      mapTitle: "Active Field Support",
      mapText: "Damascus • Maaloula • Krak des Chevaliers • Homs • Hama • Aleppo • Palmyra • Bosra",
      items: [
        { title: "Beirut Transfer Corridor", tag: "Fastest Gateway", text: "VIP Mercedes private transport direct from Beirut Rafic Hariri Airport across the Masnaa border into Old Damascus in under 2.5 hours, fully assisted through passport control." },
        { title: "Silk Route Central Corridor", tag: "M5 Highway", text: "Completely paved, modernized, and patrolled expressway connecting Damascus north through Homs and the Norias of Hama directly to the Citadel of Aleppo." },
        { title: "Desert Oasis & Roman South", tag: "Archaeology", text: "Escorted access to the colonnades of Palmyra and the black basalt theater of Bosra with licensed scholarly guides specialized in classical antiquity." },
      ],
    },
    faq: {
      eyebrow: "Crucial Pre-Departure Insights",
      title: "Frequently Asked Questions",
      text: "Clear, authoritative answers regarding visas, border security, payment currency protocols, and arrival logistics.",
      items: faqEn(),
      ctaTitle: "Have a specific bespoke or diplomatic inquiry?",
      ctaText: "Our senior curators are at your disposal for confidential logistical briefings.",
      ctaButton: "Speak Directly with Lead Historian",
    },
    gallery: [
      { image: img("69"), title: "Palmyra UNESCO Survey", text: "Archaeological Field Protocol" },
      { image: img("70"), title: "Citadels of the Levant", text: "Medieval Fortifications & Architecture" },
      { image: img("71"), title: "Damascus Old City", text: "Continuously Inhabited Since Antiquity" },
    ],
  },

  blog: {
    hero: {
      eyebrow: "The Levantine Chronicles",
      issue: "Volume IV • Issue 08 • Academic & Field Dispatch",
      title: "Stories, Heritage & Field Dispatches from the Heart of Syria",
      text: "Thoughtful explorations of ancient archaeological wonders, living crafts, Levantine culinary heritage, and practical travel guides — curated and researched by our licensed local scholars and on-the-ground guides.",
      badgeTitle: "Primary Source Research",
      badgeText: "Licensed Antiquities Guides",
    },
    categories: [
      // `key` is the category saved on each post; `label` is what visitors see.
      { key: "Archaeology & Antiquities", label: "Archaeology & Antiquities" },
      { key: "Living Old Quarters", label: "Living Old Quarters" },
      { key: "Syrian Culinary Traditions", label: "Syrian Culinary Traditions" },
      { key: "Traveler Field Guides & Advice", label: "Traveler Field Guides & Advice" },
      { key: "Artisans & Silk Road Crafts", label: "Artisans & Silk Road Crafts" },
    ],
    gridEyebrow: "Scholarly Field Logs & Guides",
    gridTitle: "Curated Archaeological & Cultural Articles",
    standards: {
      eyebrow: "E-E-A-T Academic & Ground Standard",
      title: "Written by Local Scholars, Archaeologists & On-the-Ground Guides",
      text: "Our publications are not tourist summaries compiled from afar. Every article represents firsthand documentation, verified by Syrian university historians, licensed antiquities custodians, and active fieldwork expeditions across all 14 governorates.",
      items: [
        { icon: "account_balance", title: "Primary Source Records", text: "Direct access to archaeological digs and national archival manuscripts." },
        { icon: "verified_user", title: "Real-Time Field Safety", text: "Daily road clearance verification and ministry-coordinated protocols." },
        { icon: "volunteer_activism", title: "Guild Support", text: "100% of editorial honorariums directly benefit Syrian artisan workshops." },
      ],
      sealTitle: "Syria Guide Tours",
      sealText: "Licensed under Syria Ministry of Tourism Decision No. 428/A. Dedicated to the unadulterated preservation of Syrian civilizational memory.",
      sealButton: "Meet Our Guides & Historians",
    },
    newsletter: {
      image: img("48"),
      imageTitle: "Archival Journal",
      imageText: "Published Quarterly & Upon New Excavation Releases",
      eyebrow: "Private Levantine Circular",
      title: "Receive Our Seasonal Heritage Dispatches & Field Updates",
      text: "Curated once every month: newly unlocked archaeological routes, visa policy updates, festival announcements in Damascus & Aleppo, and photographic essays. No promotional clutter.",
      button: "Subscribe to Dispatch",
      notes: [{ text: "Encrypted & Privacy Guaranteed" }, { text: "English & Arabic Editions" }, { text: "Unsubscribe Anytime" }],
    },
  },
};

export type SiteContent = typeof defaultSiteContent;
export type SiteSection = keyof SiteContent;

// Default copy for each language.
export function defaultContent(lang: Lang): SiteContent {
  return lang === "ar" ? defaultSiteContentAr : defaultSiteContent;
}

// All website text is one row in the `site` table: {"en": {...}, "ar": {...}}.
export const SITE_ROW_ID = 1;

// Stored JSON may be partial or from an older version: fill in the gaps
// with that language's defaults.
export function withDefaults(stored: unknown, lang: Lang = "en"): SiteContent {
  return conform(stored, defaultContent(lang));
}

// One language's website text from the stored {en, ar} row.
export function siteData(stored: unknown, lang: Lang): SiteContent {
  const o = stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {};
  return withDefaults(o[lang], lang);
}

// Both languages, complete (the value written back to the row).
export function siteDataBoth(stored: unknown): Tr<SiteContent> {
  return { en: siteData(stored, "en"), ar: siteData(stored, "ar") };
}

export const defaultSiteData = (): Tr<SiteContent> => ({ en: defaultSiteContent, ar: defaultSiteContentAr });

// The dashboard edits the content one section at a time.
export const SITE_SECTIONS: { key: SiteSection; label: string; description: string; preview: string }[] = [
  { key: "general", label: "General & menu", description: "Site name, logo, top menu and booking button", preview: "/" },
  { key: "contact", label: "Contact details", description: "WhatsApp, phones, email and offices", preview: "/contact" },
  { key: "home", label: "Home page", description: "Hero, about, why us, reviews and booking call", preview: "/" },
  { key: "tours", label: "Tours page", description: "Header, categories, private tours and what's included", preview: "/tours" },
  { key: "about", label: "About page", description: "Vision and mission, founder, team, licences and safety", preview: "/about" },
  { key: "guide", label: "Guide page", description: "Sandra's profile, services, booking and guide network", preview: "/guide" },
  { key: "contactPage", label: "Contact & booking page", description: "Booking form, steps, partnerships, routes and FAQ", preview: "/contact" },
  { key: "blog", label: "Blog page", description: "Blog header, categories, editorial standards and newsletter", preview: "/blog" },
  { key: "footer", label: "Footer", description: "Summary, links, newsletter and copyright", preview: "/" },
];
