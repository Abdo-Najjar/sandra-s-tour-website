// Default FAQ for the contact page (/contact#faq), in English and Arabic.
// Seeded into the database with the rest of the website content and editable
// from the dashboard. A new heading starts on the page whenever `group` changes.

type Entry = [q: string, a: string, qAr: string, aAr: string];

const section = (group: string, groupAr: string, items: Entry[]) =>
  items.map(([q, a, qAr, aAr]) => ({ group, groupAr, q, qAr, a, aAr }));

// One list per language for the website content (content.ts / content-ar.ts).
export const faqEn = () => bilingualFaq.map(({ group, q, a }) => ({ group, q, a }));
export const faqAr = () => bilingualFaq.map(({ groupAr, qAr, aAr }) => ({ group: groupAr, q: qAr, a: aAr }));

const bilingualFaq = [
  ...section("Safety & Travel Advisory", "السلامة وإرشادات السفر", [
    [
      "Is Syria safe to travel to?",
      "Yes, Syria is generally open and accessible for travelers. While the situation has evolved significantly, safety depends on the specific regions you plan to visit and the current local stability. It is always recommended to travel with a licensed agency that monitors local conditions in real-time.",
      "هل السفر إلى سوريا آمن؟",
      "نعم، سوريا مفتوحة بشكل عام ويمكن للمسافرين زيارتها. ورغم أن الأوضاع تطورت بشكل كبير، تعتمد السلامة على المناطق التي تخطط لزيارتها وعلى الاستقرار المحلي الحالي. يُنصح دائماً بالسفر مع وكالة مرخصة تتابع الأوضاع المحلية لحظة بلحظة.",
    ],
    [
      "Is it safe to travel to Syria after the fall of Assad regime?",
      "The transition has brought structural changes and ongoing stabilization efforts. Many major cultural hubs and historic cities are welcoming visitors, but political transitions can cause dynamic shifts. Working with an experienced travel provider ensures that your itinerary only covers verified and secure routes.",
      "هل السفر إلى سوريا آمن بعد سقوط نظام الأسد؟",
      "جلبت المرحلة الانتقالية تغييرات هيكلية وجهوداً مستمرة لتحقيق الاستقرار. كثير من المراكز الثقافية الكبرى والمدن التاريخية ترحب بالزوار، لكن المراحل الانتقالية قد تحمل تغيرات متسارعة. العمل مع جهة سفر خبيرة يضمن أن يقتصر برنامجك على طرق موثوقة وآمنة.",
    ],
    [
      "Is everyone safe in all parts of Syria?",
      "No, safety conditions vary across different provinces and border zones. While central and historically prominent tourist destinations have stabilized, certain remote regions or areas undergoing active restructuring require strict caution or should be avoided entirely.",
      "هل الجميع بأمان في كل أنحاء سوريا؟",
      "لا، تختلف ظروف السلامة بين المحافظات والمناطق الحدودية. ففي حين استقرت الوجهات السياحية المركزية والتاريخية البارزة، تتطلب بعض المناطق النائية أو التي تشهد إعادة تنظيم حذراً شديداً أو يجب تجنبها تماماً.",
    ],
    [
      "What happens in case of safety threats or tour cancellations?",
      "We prioritize your well-being with responsive contingency plans. In the event of a sudden safety concern or sudden route disruption, tours will be adapted or canceled immediately. Travelers will be offered flexible rebooking options, alternative safe destinations, or partial/full refunds depending on the specific situation.",
      "ماذا يحدث في حال وجود تهديدات أمنية أو إلغاء الجولات؟",
      "سلامتك أولويتنا، ولدينا خطط طوارئ سريعة الاستجابة. في حال ظهور مخاوف أمنية مفاجئة أو تعطل أحد الطرق، يتم تعديل الجولة أو إلغاؤها فوراً. ونقدم للمسافرين خيارات مرنة لإعادة الحجز، أو وجهات آمنة بديلة، أو استرداداً جزئياً أو كاملاً حسب الحالة.",
    ],
    [
      "How do you ensure that women travelers are safe and secure in Syria?",
      "Female travelers are supported through dedicated local guidance and culturally respectful planning. We provide knowledgeable local guides who understand regional customs, arrange secure accommodations in vetted neighborhoods, and offer 24/7 check-in support to ensure a seamless, respectful, and comfortable journey.",
      "كيف تضمنون سلامة وأمان المسافرات في سوريا؟",
      "نقدم للمسافرات إرشاداً محلياً مخصصاً وتخطيطاً يحترم الثقافة المحلية. نوفر مرشدين محليين خبراء بالعادات، ونرتب إقامة آمنة في أحياء موثوقة، ونقدم متابعة على مدار الساعة لضمان رحلة سلسة ومريحة ومحترمة.",
    ],
    [
      "Are the guides trained to handle emergency situations?",
      "Yes, all assigned tour guides undergo professional emergency response training. They are fully equipped to handle first-aid scenarios, coordinate with local safety authorities, manage sudden itinerary adjustments, and guide travelers safely through unexpected operational changes.",
      "هل المرشدون مدربون على التعامل مع حالات الطوارئ؟",
      "نعم، يخضع جميع مرشدينا لتدريب احترافي على الاستجابة للطوارئ. وهم مؤهلون للتعامل مع حالات الإسعافات الأولية، والتنسيق مع الجهات الأمنية المحلية، وإدارة أي تعديل مفاجئ في البرنامج، وإرشاد المسافرين بأمان خلال أي تغيير غير متوقع.",
    ],
    [
      "What security measures, such as communication or transport protocols, are in place?",
      "We maintain rigorous security, transport, and communication standards. This includes using regularly inspected private vehicles with experienced local drivers, mapping out verified routes beforehand, and maintaining constant communication links with our main office to track transit progress efficiently.",
      "ما الإجراءات الأمنية المتبعة، مثل بروتوكولات التواصل والنقل؟",
      "نلتزم بمعايير صارمة في الأمن والنقل والتواصل. يشمل ذلك استخدام سيارات خاصة تخضع لفحص دوري مع سائقين محليين ذوي خبرة، وتحديد طرق موثوقة مسبقاً، والحفاظ على تواصل دائم مع مكتبنا الرئيسي لمتابعة سير الرحلة بدقة.",
    ],
  ]),

  ...section("Security & Local Interaction", "الأمن والتعامل مع السكان المحليين", [
    [
      "What should travelers expect regarding checkpoints and local security measures?",
      "Security measures vary, but checkpoints are a normal part of the transit landscape. They are in place to maintain regional stability and ensure safe travel. When traveling with our agency, your guide handles all necessary paperwork and ID checks seamlessly, making the process quick and hassle-free for you.",
      "ماذا يتوقع المسافرون بخصوص الحواجز والإجراءات الأمنية المحلية؟",
      "تختلف الإجراءات الأمنية، لكن الحواجز جزء طبيعي من التنقل. وهي موجودة للحفاظ على الاستقرار وضمان سلامة السفر. عند السفر مع وكالتنا، يتولى مرشدك جميع الأوراق وعمليات التحقق من الهوية بسلاسة، فتكون العملية سريعة ومن دون أي عناء.",
    ],
    [
      "What is your primary safety advice for tourists planning a journey to Syria?",
      "The most critical advice is to book through a licensed agency and stay informed. Always follow your guide’s instructions, keep your physical passport with you, avoid photographing sensitive infrastructure, and respect regional cultural norms.",
      "ما أهم نصيحة أمان للسياح الذين يخططون لرحلة إلى سوريا؟",
      "أهم نصيحة هي الحجز عبر وكالة مرخصة والبقاء على اطلاع. اتبع دائماً تعليمات مرشدك، واحتفظ بجواز سفرك معك، وتجنب تصوير المنشآت الحساسة، واحترم العادات الثقافية المحلية.",
    ],
    [
      "Is it a good idea to chat with the local people?",
      "Yes, engaging with locals is highly recommended and usually a highlight of the trip. Syrian people are globally renowned for their incredible hospitality and are often very welcoming to international tourists.",
      "هل من الجيد التحدث مع السكان المحليين؟",
      "نعم، التواصل مع السكان المحليين أمر ننصح به بشدة، وغالباً ما يكون من أجمل لحظات الرحلة. يشتهر السوريون عالمياً بكرم ضيافتهم، وعادةً ما يرحبون كثيراً بالسياح الأجانب.",
    ],
    [
      "What precautions should tourists take when conversing with locals?",
      "Keep conversations friendly and avoid sensitive subjects. It is best to steer clear of sensitive political debates, regional conflicts, or deeply personal religious topics unless you are in a highly familiar setting.",
      "ما الاحتياطات التي يجب مراعاتها عند التحدث مع السكان المحليين؟",
      "حافظ على أحاديث ودية وتجنب المواضيع الحساسة. من الأفضل الابتعاد عن النقاشات السياسية الحساسة والنزاعات الإقليمية والمواضيع الدينية الشخصية، إلا إذا كنت في جو مألوف جداً.",
    ],
    [
      "Is it appropriate to share my social media handles with locals?",
      "Yes, sharing social media contacts is common and perfectly fine. It is a wonderful way to stay in touch with friends you make along the way, provided you feel comfortable doing so.",
      "هل من المناسب مشاركة حساباتي على مواقع التواصل مع السكان المحليين؟",
      "نعم، تبادل حسابات التواصل الاجتماعي أمر شائع ولا مشكلة فيه. إنها طريقة رائعة للبقاء على تواصل مع الأصدقاء الذين تتعرف عليهم خلال الرحلة، طالما أنك مرتاح لذلك.",
    ],
    [
      "Can tourists openly discuss politics while in the country?",
      "No, discussing local or international politics openly is strongly discouraged. To ensure a smooth and safe trip, it is best to focus conversations on culture, history, food, and travel experiences.",
      "هل يمكن للسياح مناقشة السياسة بشكل علني داخل البلاد؟",
      "لا، لا يُنصح أبداً بمناقشة السياسة المحلية أو الدولية بشكل علني. لضمان رحلة سلسة وآمنة، من الأفضل التركيز في الأحاديث على الثقافة والتاريخ والطعام وتجارب السفر.",
    ],
    [
      "What is the safety situation for LGBTQ+ travelers?",
      "Syria is a socially conservative society where public displays of affection are discouraged for everyone. While international travelers are welcomed regardless of their background, it is highly recommended to maintain complete discretion regarding personal relationships to respect local cultural norms.",
      "ما وضع السلامة بالنسبة للمسافرين من مجتمع الميم (LGBTQ+)؟",
      "سوريا مجتمع محافظ اجتماعياً، ولا يُستحسن إظهار المودة في الأماكن العامة للجميع. ورغم الترحيب بالمسافرين الأجانب أياً كانت خلفياتهم، يُنصح بشدة بالتحفظ التام فيما يخص العلاقات الشخصية احتراماً للعادات المحلية.",
    ],
  ]),

  ...section("History, Culture & Social Norms", "التاريخ والثقافة والعادات الاجتماعية", [
    [
      "How far back does Syrian history go?",
      "Syria boasts one of the oldest civilizations in human history, dating back over 10,000 years. It is home to some of the world’s earliest urban settlements, ancient empires, and historic trade routes.",
      "إلى أي زمن يعود تاريخ سوريا؟",
      "تفخر سوريا بواحدة من أقدم الحضارات في التاريخ البشري، إذ يعود تاريخها إلى أكثر من 10,000 عام. وهي موطن لبعض أقدم المستوطنات الحضرية في العالم، وإمبراطوريات عريقة، وطرق تجارية تاريخية.",
    ],
    [
      "What are the recommended dress code guidelines during the tour?",
      "Modest and respectful clothing is recommended. For both men and women, it is best to avoid overly revealing outfits. Loose-fitting clothes that cover the shoulders and knees are ideal for daily sightseeing.",
      "ما إرشادات اللباس الموصى بها خلال الجولة؟",
      "يُنصح بارتداء ملابس محتشمة ولائقة. من الأفضل للرجال والنساء تجنب الملابس الكاشفة. الملابس الفضفاضة التي تغطي الكتفين والركبتين مثالية لجولات المشاهدة اليومية.",
    ],
    [
      "Do female tourists have to wear a hijab (headscarf)?",
      "No, wearing a hijab is not mandatory for female travelers in daily public life. However, women are required to cover their heads with a scarf when entering active religious sites, such as mosques.",
      "هل يجب على السائحات ارتداء الحجاب؟",
      "لا، ارتداء الحجاب ليس إلزامياً للمسافرات في الحياة العامة اليومية. لكن يجب على النساء تغطية الرأس بوشاح عند دخول الأماكن الدينية، مثل المساجد.",
    ],
    [
      "What is the proper etiquette when visiting religious sites?",
      "Respectful behavior and modest attire are required. Visitors must remove their shoes before entering mosques, women must cover their heads, and everyone should maintain a quiet, respectful demeanor. Avoid taking photos of people praying without permission.",
      "ما آداب زيارة الأماكن الدينية؟",
      "يُشترط السلوك المحترم واللباس المحتشم. يجب على الزوار خلع أحذيتهم قبل دخول المساجد، وعلى النساء تغطية رؤوسهن، وعلى الجميع الحفاظ على الهدوء والاحترام. تجنب تصوير المصلين دون إذن.",
    ],
    [
      "What are the main religious demographics in Syria?",
      "Syria is a diverse multi-faith nation. The majority of the population practices Islam, alongside a deeply rooted and historical Christian community.",
      "ما التركيبة الدينية الرئيسية في سوريا؟",
      "سوريا بلد متنوع متعدد الأديان. غالبية السكان مسلمون، إلى جانب مجتمع مسيحي عريق ذي جذور تاريخية عميقة.",
    ],
    [
      "Is smoking permitted in public spaces?",
      "Smoking is incredibly common and generally permitted in most public areas. While it is widely accepted in cafes, restaurants, and streets, it is prohibited inside closed government buildings and specific public transit vehicles.",
      "هل التدخين مسموح في الأماكن العامة؟",
      "التدخين شائع جداً ومسموح عموماً في معظم الأماكن العامة. ورغم أنه مقبول على نطاق واسع في المقاهي والمطاعم والشوارع، إلا أنه ممنوع داخل المباني الحكومية المغلقة وبعض وسائل النقل العام.",
    ],
    [
      "Is tipping customary, and how much should I give?",
      "Yes, tipping is customary and highly appreciated in the service industry. For restaurants, a tip of 10% is standard. For tour drivers and guides, tipping is discretionary but customary for good service.",
      "هل البقشيش (الإكرامية) معتاد، وكم يجب أن أعطي؟",
      "نعم، البقشيش معتاد ومقدَّر كثيراً في قطاع الخدمات. في المطاعم تكون نسبة 10% هي المعتادة. أما للسائقين والمرشدين فالأمر اختياري، لكنه معتاد مقابل الخدمة الجيدة.",
    ],
    [
      "Is it culturally acceptable to shake hands or hug people?",
      "Handshakes are standard for professional and casual greetings. However, conservative individuals may prefer not to shake hands with the opposite sex; in such cases, placing your right hand over your heart is a polite alternative. Hugs are generally reserved for close friends.",
      "هل المصافحة أو العناق مقبولان ثقافياً؟",
      "المصافحة هي التحية المعتادة في المواقف الرسمية والعادية. لكن قد يفضّل بعض الأشخاص المحافظين عدم مصافحة الجنس الآخر، وفي هذه الحالة يُعد وضع اليد اليمنى على القلب بديلاً مهذباً. أما العناق فيقتصر عادةً على الأصدقاء المقربين.",
    ],
    [
      "Is there an active nightlife scene?",
      "Yes, major cities like Damascus and Aleppo feature vibrant nightlife hubs. You can easily find traditional cafes, modern lounges, rooftop bars, and restaurants open late into the night.",
      "هل توجد حياة ليلية نشطة؟",
      "نعم، تضم المدن الكبرى مثل دمشق وحلب أماكن سهر نابضة بالحياة. يمكنك بسهولة إيجاد مقاهٍ تقليدية وصالات حديثة وبارات على الأسطح ومطاعم تبقى مفتوحة حتى ساعات متأخرة من الليل.",
    ],
  ]),

  ...section("Logistics, Visas & Transit", "الترتيبات والتأشيرات والعبور", [
    [
      "Can I travel to Syria independently as an individual tourist?",
      "Independent leisure travel without an agency is generally restricted. To obtain a tourist visa and ensure security, most travelers must book their itinerary through a licensed local tour operator.",
      "هل يمكنني السفر إلى سوريا بشكل مستقل كسائح فردي؟",
      "السفر السياحي المستقل دون وكالة مقيّد بشكل عام. للحصول على تأشيرة سياحية وضمان الأمان، يجب على معظم المسافرين حجز برنامجهم عبر منظم رحلات محلي مرخص.",
    ],
    [
      "What are the steps to apply for a Syrian tourist visa?",
      "The process involves securing a security clearance first. When you book a trip with us, you provide your passport copy, and we submit the paperwork to the authorities. Once approved, you receive a visa authorization letter.",
      "ما خطوات التقديم على التأشيرة السياحية السورية؟",
      "تبدأ العملية بالحصول على موافقة أمنية أولاً. عند حجز رحلتك معنا، ترسل لنا نسخة من جواز سفرك ونقدّم نحن الأوراق للجهات المختصة. وبعد الموافقة تحصل على رسالة الموافقة على التأشيرة.",
    ],
    [
      "What do I need to clear my Visa on Arrival (VOA)?",
      "You need your passport, your printed visa authorization letter, and the visa fee in cash.",
      "ماذا أحتاج للحصول على التأشيرة عند الوصول؟",
      "تحتاج إلى جواز سفرك، ورسالة الموافقة على التأشيرة مطبوعة، ورسوم التأشيرة نقداً.",
    ],
    [
      "Can US citizens travel to Syria, and how long does the visa take?",
      "Yes, American citizens can apply, but the vetting process takes longer. Security clearance processing for USA passport holders typically takes several weeks to a few months, so early booking is essential.",
      "هل يمكن للمواطنين الأمريكيين السفر إلى سوريا، وكم تستغرق التأشيرة؟",
      "نعم، يمكن للمواطنين الأمريكيين التقديم، لكن عملية التدقيق تستغرق وقتاً أطول. عادةً ما تستغرق الموافقة الأمنية لحاملي الجواز الأمريكي من عدة أسابيع إلى بضعة أشهر، لذا فالحجز المبكر ضروري.",
    ],
    [
      "How much does the Visa on Arrival cost?",
      "The visa fee varies significantly depending on your nationality. Fees must be paid in cash (usually USD or Euros) directly at the border checkpoint or airport customs desk.",
      "كم تبلغ تكلفة التأشيرة عند الوصول؟",
      "تختلف رسوم التأشيرة كثيراً حسب جنسيتك. ويجب دفعها نقداً (عادةً بالدولار الأمريكي أو اليورو) مباشرةً عند المنفذ الحدودي أو مكتب الجمارك في المطار.",
    ],
    [
      "Will having a travel history to Palestine/Israel affect my entry?",
      "Yes, passport stamps or entry/exit evidence from Israel will result in an immediate denial of entry. Ensure your passport contains no physical evidence of travel to Israel before applying.",
      "هل يؤثر سفري السابق إلى فلسطين/إسرائيل على دخولي؟",
      "نعم، وجود أختام أو أي دليل دخول أو خروج من إسرائيل في جواز السفر يؤدي إلى رفض الدخول فوراً. تأكد من خلو جوازك من أي دليل على السفر إلى إسرائيل قبل التقديم.",
    ],
    [
      "Can unmarried couples share a single hotel room?",
      "Yes, international tourist couples are generally permitted to share a room without issues. While local laws are stricter for citizens, hotels treat foreign tourists with flexibility.",
      "هل يمكن للأزواج غير المتزوجين مشاركة غرفة فندقية واحدة؟",
      "نعم، يُسمح عادةً للأزواج من السياح الأجانب بمشاركة الغرفة دون مشاكل. ورغم أن القوانين المحلية أكثر صرامة مع المواطنين، تتعامل الفنادق مع السياح الأجانب بمرونة.",
    ],
    [
      "How many days can I stay on a standard Visa on Arrival?",
      "A standard tourist visa is typically valid for a stay of up to 15 to 30 days.",
      "كم يوماً يمكنني البقاء بالتأشيرة العادية عند الوصول؟",
      "عادةً ما تكون التأشيرة السياحية العادية صالحة لإقامة تتراوح بين 15 و30 يوماً.",
    ],
    [
      "Which neighboring countries can I use to cross the border?",
      "The most common and secure overland tourist route is via Lebanon (Beirut). Land crossings from Jordan are also operational depending on current regional border policies.",
      "من أي دول مجاورة يمكنني عبور الحدود؟",
      "الطريق البري الأكثر شيوعاً وأماناً للسياح هو عبر لبنان (بيروت). كما تعمل المعابر البرية من الأردن حسب السياسات الحدودية الحالية.",
    ],
  ]),

  ...section("Flights & Tour Specifics", "الرحلات الجوية وتفاصيل الجولات", [
    [
      "Are these itineraries designed as private tours?",
      "Yes, we specialize in fully customized private tours. Your itinerary, vehicle, and guide are dedicated exclusively to you or your private group.",
      "هل هذه البرامج مصممة كجولات خاصة؟",
      "نعم، نحن متخصصون في الجولات الخاصة المصممة بالكامل حسب الطلب. برنامجك وسيارتك ومرشدك مخصصون لك أو لمجموعتك الخاصة فقط.",
    ],
    [
      "Which airlines currently operate flights into the country?",
      "Flights are primarily operated by regional carriers. Airlines such as Syrian Air, Cham Wings, and select regional partners connect major destinations to international hubs like Beirut, Amman, or Cairo.",
      "ما شركات الطيران التي تسيّر رحلات إلى البلاد حالياً؟",
      "تُسيَّر الرحلات بشكل رئيسي عبر شركات طيران إقليمية. تربط شركات مثل السورية للطيران وأجنحة الشام وبعض الشركاء الإقليميين الوجهات الرئيسية بمراكز دولية مثل بيروت وعمّان والقاهرة.",
    ],
    [
      "What is the most efficient way to fly in and out?",
      "Many travelers find it easiest to fly into Beirut International Airport (OLBA) and then take a private car transfer across the land border to Damascus, which is only a few hours away. Alternatively, you can check direct regional flights into Damascus International Airport.",
      "ما أفضل طريقة للوصول والمغادرة جواً؟",
      "يجد كثير من المسافرين أن الأسهل هو السفر جواً إلى مطار بيروت الدولي ثم الانتقال بسيارة خاصة عبر الحدود البرية إلى دمشق، التي تبعد بضع ساعات فقط. أو يمكنك البحث عن رحلات إقليمية مباشرة إلى مطار دمشق الدولي.",
    ],
    [
      "Who will accompany me throughout the duration of the tour?",
      "You will be accompanied by a licensed, English-speaking guide and a dedicated private driver from the moment you clear the border until your departure.",
      "من سيرافقني طوال مدة الجولة؟",
      "سيرافقك مرشد مرخص يتحدث الإنجليزية وسائق خاص مخصص لك، من لحظة عبورك الحدود حتى مغادرتك.",
    ],
  ]),

  ...section("Accommodation & Group Policies", "الإقامة وسياسات الرحلات الجماعية", [
    [
      "If I join a group tour alone, can I share a twin room or must I pay for a single room?",
      "We always try to match solo travelers of the same gender to share a twin room. However, if no roommate is available, or if you prefer total privacy, a single room supplement fee will apply.",
      "إذا انضممت إلى جولة جماعية بمفردي، هل يمكنني مشاركة غرفة مزدوجة أم يجب أن أدفع لغرفة مفردة؟",
      "نحاول دائماً جمع المسافرين المنفردين من الجنس نفسه في غرفة مزدوجة. لكن إن لم يتوفر شريك في الغرفة، أو إن كنت تفضل الخصوصية التامة، تُضاف رسوم الغرفة المفردة.",
    ],
    [
      "Are shared rooms mixed-gender, and do I pay extra if no roommate is found?",
      "Shared rooms are strictly assigned by gender (men with men, women with women). If the tour group cannot find a matching roommate for you, a single room supplement fee is required to secure your private accommodation.",
      "هل الغرف المشتركة مختلطة، وهل أدفع مبلغاً إضافياً إن لم يتوفر شريك في الغرفة؟",
      "تُوزَّع الغرف المشتركة حسب الجنس حصراً (الرجال مع الرجال والنساء مع النساء). وإن لم يتوفر شريك مناسب لك في المجموعة، تُطلب رسوم الغرفة المفردة لتأمين إقامتك الخاصة.",
    ],
    [
      "Is there a minimum number of travelers required for a group tour to run?",
      "Yes, group tours usually require a minimum number of participants (typically 4 to 6 people). If a group doesn’t fill up, we will offer you the choice to convert it to a private tour, reschedule, or receive a refund.",
      "هل هناك حد أدنى لعدد المسافرين لتنفيذ الجولة الجماعية؟",
      "نعم، تتطلب الجولات الجماعية عادةً حداً أدنى من المشاركين (من 4 إلى 6 أشخاص غالباً). وإن لم يكتمل العدد، نمنحك الخيار بين تحويلها إلى جولة خاصة أو تغيير موعدها أو استرداد المبلغ.",
    ],
  ]),

  ...section("Food, Drinks & Safety", "الطعام والشراب والسلامة الشخصية", [
    [
      "What type of water is safe to drink while visiting Syria?",
      "You should only drink bottled mineral water, which is cheap and easy to find everywhere. Avoid tap water, ice cubes in public markets, or unfiltered water to prevent stomach issues.",
      "ما نوع المياه الآمنة للشرب خلال زيارة سوريا؟",
      "اشرب المياه المعدنية المعبأة فقط، فهي رخيصة ومتوفرة في كل مكان. تجنب مياه الصنبور ومكعبات الثلج في الأسواق العامة والمياه غير المفلترة لتفادي مشاكل المعدة.",
    ],
    [
      "Can the tour accommodate travelers with special dietary needs or allergies?",
      "Yes, special diets can be accommodated easily. Syrian cuisine offers a wide variety of fresh options. Just inform us of your allergies, vegetarian, vegan, or halal preferences before the trip so we can alert the hotels and restaurants.",
      "هل يمكن للجولة تلبية احتياجات المسافرين الغذائية الخاصة أو الحساسية؟",
      "نعم، يمكن تلبية الأنظمة الغذائية الخاصة بسهولة. فالمطبخ السوري يقدم تشكيلة واسعة من الخيارات الطازجة. أخبرنا فقط بأي حساسية أو تفضيلات نباتية أو حلال قبل الرحلة لننبّه الفنادق والمطاعم.",
    ],
    [
      "Are vegetarian or vegan food options readily available?",
      "Yes, Syrian food is excellent for vegetarians and vegans. Traditional appetizers (Mezza) like hummus, mutabbal, falafel, fattoush, and stuffed vine leaves are naturally plant-based and served everywhere.",
      "هل تتوفر خيارات طعام نباتية بسهولة؟",
      "نعم، الطعام السوري ممتاز للنباتيين. فالمقبلات التقليدية (المازة) مثل الحمص والمتبل والفلافل والفتوش وورق العنب نباتية بطبيعتها وتُقدَّم في كل مكان.",
    ],
    [
      "Is alcohol available to buy or drink in Syria?",
      "Yes, alcohol is legally available. It is served in licensed restaurants, bars, hotels, and sold in specific shops, particularly in Christian neighborhoods and modern districts of Damascus and Aleppo.",
      "هل يتوفر الكحول للشراء أو الشرب في سوريا؟",
      "نعم، الكحول متوفر بشكل قانوني. يُقدَّم في المطاعم والبارات والفنادق المرخصة، ويُباع في متاجر محددة، خاصة في الأحياء المسيحية والأحياء الحديثة في دمشق وحلب.",
    ],
    [
      "Is it legal to bring alcoholic beverages into or out of the country?",
      "Yes, you can bring reasonable quantities of alcohol through customs for personal consumption, in line with standard international airport and land border duty-free limits.",
      "هل يُسمح قانونياً بإدخال المشروبات الكحولية إلى البلاد أو إخراجها منها؟",
      "نعم، يمكنك إدخال كميات معقولة من الكحول عبر الجمارك للاستهلاك الشخصي، ضمن الحدود المعتادة للسوق الحرة في المطارات والمعابر البرية.",
    ],
    [
      "What are the most famous traditional dishes I should try?",
      "You must try Kibbeh (stuffed minced meat shells), Shish Tawook (grilled chicken skewers), Shawarma, and traditional desserts like Baklava or Syrian ice cream (Booza) coated in pistachios.",
      "ما أشهر الأطباق التقليدية التي يجب أن أجربها؟",
      "لا بد أن تجرب الكبة، والشيش طاووق (أسياخ الدجاج المشوي)، والشاورما، والحلويات التقليدية مثل البقلاوة أو البوظة السورية المغطاة بالفستق الحلبي.",
    ],
    [
      "Is traditional Syrian food very spicy?",
      "No, Syrian food is flavorful but rarely hot or spicy. It relies on aromatic herbs and spices like cumin, mint, olive oil, and pomegranate molasses rather than hot chili peppers.",
      "هل الطعام السوري التقليدي حار جداً؟",
      "لا، الطعام السوري غني بالنكهات لكنه نادراً ما يكون حاراً. فهو يعتمد على الأعشاب والبهارات العطرية مثل الكمون والنعناع وزيت الزيتون ودبس الرمان بدلاً من الفلفل الحار.",
    ],
    [
      "Is it safe to eat street food in local markets?",
      "Yes, but you should choose busy stalls with high turnover. Eating fresh falafel, shawarma, or baked goods from popular local spots is generally safe, but use common sense regarding hygiene.",
      "هل تناول طعام الشارع في الأسواق المحلية آمن؟",
      "نعم، لكن اختر الأكشاك المزدحمة ذات الإقبال الكبير. تناول الفلافل أو الشاورما أو المخبوزات الطازجة من الأماكن المحلية المشهورة آمن عموماً، مع الانتباه إلى النظافة.",
    ],
    [
      "Are there any specific food restrictions or religious bans tourists should know?",
      "There are no legal food restrictions for tourists. However, because the majority of the population practices Islam, pork is not widely served outside of specific Christian restaurants and butcher shops.",
      "هل هناك قيود غذائية أو محظورات دينية يجب أن يعرفها السياح؟",
      "لا توجد قيود غذائية قانونية على السياح. لكن بما أن غالبية السكان مسلمون، فلحم الخنزير غير منتشر إلا في بعض المطاعم ومحلات اللحوم المسيحية.",
    ],
    [
      "Do tourists frequently get stomach bugs or illnesses during the trip?",
      "Most travelers stay perfectly healthy. However, a change in climate and local oil usage can sometimes cause mild stomach upset. Stick to bottled water and peel fresh fruits to minimize risks.",
      "هل يصاب السياح كثيراً بمشاكل في المعدة أو بأمراض خلال الرحلة؟",
      "يبقى معظم المسافرين بصحة جيدة تماماً. لكن تغيّر المناخ واستخدام الزيوت المحلية قد يسبب أحياناً اضطراباً خفيفاً في المعدة. التزم بالمياه المعبأة وقشّر الفواكه الطازجة لتقليل المخاطر.",
    ],
    [
      "Will I be monitored or followed 24 hours a day during my stay?",
      "No, you are not under constant personal surveillance. You are free to explore tourist areas, markets, and restaurants. Your tour guide is there to help with logistics, language barriers, and navigation, not to restrict your movements.",
      "هل سأكون مراقَباً أو متابَعاً على مدار الساعة خلال إقامتي؟",
      "لا، لن تكون تحت مراقبة شخصية دائمة. أنت حر في استكشاف المناطق السياحية والأسواق والمطاعم. مرشدك موجود لمساعدتك في الترتيبات واللغة والتنقل، لا لتقييد حركتك.",
    ],
  ]),

  ...section("Money & Expenses", "المال والمصاريف", [
    [
      "Which foreign currencies are widely accepted for exchange?",
      "US Dollars (USD) and Euros (EUR) are the preferred currencies. Ensure your bills are clean, crisp, newer editions, and free of any tears or markings, as local banks and exchange offices are highly strict about bill condition.",
      "ما العملات الأجنبية المقبولة على نطاق واسع للصرف؟",
      "الدولار الأمريكي واليورو هما العملتان المفضلتان. تأكد من أن أوراقك النقدية نظيفة وجديدة الإصدار وخالية من أي تمزق أو كتابة، فالبنوك ومكاتب الصرافة المحلية صارمة جداً بشأن حالة الأوراق.",
    ],
    [
      "What is the best way to manage and carry money in Syria?",
      "Syria is entirely a cash-based economy for tourists. You must bring enough physical cash in USD or Euros to cover your entire trip, including meals, souvenirs, tips, and visa fees.",
      "ما أفضل طريقة لإدارة المال وحمله في سوريا؟",
      "تعتمد سوريا كلياً على النقد بالنسبة للسياح. يجب أن تحضر معك ما يكفي من النقد بالدولار أو اليورو لتغطية رحلتك كاملة، بما في ذلك الوجبات والهدايا التذكارية والبقشيش ورسوم التأشيرة.",
    ],
    [
      "Are international credit or debit cards accepted anywhere?",
      "No, international credit and debit cards (Visa, Mastercard, Amex) do not work due to international banking sanctions. You cannot use them in hotels, shops, or restaurants.",
      "هل تُقبل البطاقات الائتمانية أو بطاقات الخصم الدولية في أي مكان؟",
      "لا، البطاقات الائتمانية وبطاقات الخصم الدولية (فيزا، ماستركارد، أمريكان إكسبريس) لا تعمل بسبب العقوبات المصرفية الدولية. ولا يمكنك استخدامها في الفنادق أو المتاجر أو المطاعم.",
    ],
    [
      "Are there accessible ATMs where I can use international cards?",
      "No, local ATMs are not linked to international networks. You cannot withdraw cash from your home bank account while inside the borders.",
      "هل توجد أجهزة صراف آلي يمكنني استخدام البطاقات الدولية فيها؟",
      "لا، أجهزة الصراف الآلي المحلية غير مرتبطة بالشبكات الدولية. ولا يمكنك سحب النقود من حسابك المصرفي في بلدك أثناء وجودك داخل البلاد.",
    ],
    [
      "How much cash should I withdraw in Beirut before crossing over?",
      "If you plan to pull cash from ATMs in Lebanon, withdraw enough USD to cover all your personal daily spending for your entire itinerary in Syria, plus an emergency buffer.",
      "كم يجب أن أسحب من النقود في بيروت قبل العبور؟",
      "إذا كنت تنوي السحب من أجهزة الصراف الآلي في لبنان، فاسحب ما يكفي من الدولارات لتغطية كل مصاريفك اليومية الشخصية طوال برنامجك في سوريا، إضافة إلى مبلغ احتياطي للطوارئ.",
    ],
    [
      "Can I withdraw money from ATMs in Jordan for my trip?",
      "Yes, you can withdraw USD or local currency in Jordan before your tour starts, but you must do this before passing through the final border checkpoint into Syria.",
      "هل يمكنني سحب المال من أجهزة الصراف الآلي في الأردن لرحلتي؟",
      "نعم، يمكنك سحب الدولار أو العملة المحلية في الأردن قبل بدء جولتك، لكن يجب أن تفعل ذلك قبل عبور آخر نقطة حدودية إلى سوريا.",
    ],
    [
      "Where is the safest and best place to exchange foreign currency?",
      "The best and only legal way is to exchange your money at official, government-licensed exchange offices (like Al-Haram or Syrian commercial banks) or directly at your hotel front desk. Your guide will assist you with this on day one.",
      "أين أفضل وأأمن مكان لصرف العملات الأجنبية؟",
      "الطريقة الأفضل والقانونية الوحيدة هي صرف أموالك في مكاتب الصرافة الرسمية المرخصة حكومياً (مثل الهرم أو المصارف التجارية السورية) أو مباشرة في مكتب استقبال الفندق. وسيساعدك مرشدك في ذلك من اليوم الأول.",
    ],
    [
      "What are the average daily costs for personal expenses?",
      "Personal costs are quite low. Budgeting around $25 to $50 USD per day is usually more than enough to cover casual meals, water, coffee, small souvenirs, and standard tips.",
      "ما متوسط المصاريف الشخصية اليومية؟",
      "المصاريف الشخصية منخفضة جداً. ميزانية تتراوح بين 25 و50 دولاراً يومياً تكفي عادةً وتزيد لتغطية الوجبات الخفيفة والمياه والقهوة والهدايا التذكارية الصغيرة والبقشيش المعتاد.",
    ],
  ]),

  ...section("Practical Travel Info & Technology", "معلومات السفر العملية والتكنولوجيا", [
    [
      "Is Syria currently a viable country for tourism?",
      "Yes, cultural tourism has active operational routes. Travelers from all over the world visit to explore historic sites, ancient markets, and architectural landmarks through organized, verified tours.",
      "هل سوريا حالياً بلد مناسب للسياحة؟",
      "نعم، للسياحة الثقافية مسارات فعّالة وقائمة. يزورها مسافرون من كل أنحاء العالم لاستكشاف المواقع التاريخية والأسواق القديمة والمعالم المعمارية ضمن جولات منظمة وموثوقة.",
    ],
    [
      "What is the capital city of Syria?",
      "The capital is Damascus, which is recognized as one of the oldest continuously inhabited cities in the entire world.",
      "ما عاصمة سوريا؟",
      "العاصمة هي دمشق، وتُعد من أقدم المدن المأهولة باستمرار في العالم كله.",
    ],
    [
      "What are the best shopping options for tourists?",
      "The best shopping is found in traditional Souks (old markets). You can buy premium olive oil soaps, hand-woven textiles (Brocade), traditional spices, sweets, brass items, and mother-of-pearl inlaid woodwork.",
      "ما أفضل خيارات التسوق للسياح؟",
      "أفضل تسوق تجده في الأسواق التقليدية القديمة. يمكنك شراء صابون زيت الزيتون الفاخر، والمنسوجات اليدوية (البروكار)، والبهارات التقليدية، والحلويات، والمصنوعات النحاسية، والمشغولات الخشبية المطعّمة بالصدف.",
    ],
    [
      "Will I have reliable internet access during the tour?",
      "Yes, most hotels and modern cafes offer Wi-Fi access. However, connection speeds can fluctuate, and power cuts may temporarily affect local routers.",
      "هل سيتوفر لي إنترنت موثوق خلال الجولة؟",
      "نعم، توفر معظم الفنادق والمقاهي الحديثة خدمة الواي فاي. لكن سرعة الاتصال قد تتذبذب، وقد يؤثر انقطاع الكهرباء مؤقتاً على أجهزة الراوتر المحلية.",
    ],
    [
      "Can foreign tourists buy local prepaid SIM cards?",
      "Yes, you can easily purchase a temporary tourist SIM card from local telecom providers (Syriatel or MTN) using your passport. This gives you mobile data throughout your stay.",
      "هل يمكن للسياح الأجانب شراء شرائح اتصال محلية مسبقة الدفع؟",
      "نعم، يمكنك بسهولة شراء شريحة سياحية مؤقتة من شركات الاتصالات المحلية (سيريتل أو MTN) باستخدام جواز سفرك، لتحصل على بيانات الجوال طوال إقامتك.",
    ],
    [
      "Can I activate or buy an eSIM to use in Syria?",
      "No, local mobile networks do not widely support international consumer eSIM profiles yet. It is best to purchase a physical tourist SIM card upon arrival.",
      "هل يمكنني تفعيل أو شراء شريحة eSIM لاستخدامها في سوريا؟",
      "لا، شبكات الجوال المحلية لا تدعم بعد شرائح eSIM الدولية على نطاق واسع. الأفضل شراء شريحة سياحية فعلية عند الوصول.",
    ],
    [
      "What are the main economic industries in the country?",
      "The primary traditional industries include agriculture, textile manufacturing, oil and mineral production, and historical handicraft trades.",
      "ما أهم القطاعات الاقتصادية في البلاد؟",
      "تشمل القطاعات التقليدية الرئيسية الزراعة، وصناعة النسيج، وإنتاج النفط والمعادن، والحرف اليدوية التاريخية.",
    ],
    [
      "What is the electricity voltage and plug type used?",
      "The standard voltage is 220V with a frequency of 50Hz. The country primarily uses Type C, E, and L plug outlets (two round pins). Bringing a universal adapter is highly recommended.",
      "ما جهد الكهرباء ونوع المقابس المستخدمة؟",
      "الجهد المعتاد 220 فولت بتردد 50 هرتز. وتستخدم البلاد بشكل أساسي مقابس من النوع C وE وL (بدبوسين دائريين). يُنصح بشدة بإحضار محوّل عالمي.",
    ],
    [
      "What rules should I follow regarding photography etiquette?",
      "Never take photos of military personnel, checkpoints, or government buildings. Always ask for permission before taking close-up pictures of local people, especially women or religious worshippers.",
      "ما القواعد التي يجب اتباعها في آداب التصوير؟",
      "لا تصوّر أبداً العسكريين أو الحواجز أو المباني الحكومية. واطلب الإذن دائماً قبل التقاط صور قريبة للسكان المحليين، خاصة النساء أو المصلين.",
    ],
    [
      "How fast is the internet connection speed?",
      "Mobile 4G networks and hotel Wi-Fi are adequate for basic text messaging, checking emails, and light browsing, but broadband speeds are generally slow and not ideal for heavy video streaming or uploading large files.",
      "ما سرعة الاتصال بالإنترنت؟",
      "شبكات الجيل الرابع وواي فاي الفنادق كافية للرسائل النصية وتصفح البريد الإلكتروني والتصفح الخفيف، لكن سرعات الإنترنت بطيئة عموماً وغير مناسبة لبث الفيديو بكثافة أو رفع الملفات الكبيرة.",
    ],
    [
      "I have a Google Pixel phone and the Wi-Fi isn’t working—why?",
      "Certain phone models, including some Google Pixel devices, have software settings that automatically restrict connections or location services when operating within countries under US technology sanctions. Your guide can help you adjust your network configurations or use a local VPN to bypass this.",
      "لدي هاتف Google Pixel والواي فاي لا يعمل، لماذا؟",
      "بعض طرازات الهواتف، ومنها بعض أجهزة Google Pixel، تحتوي على إعدادات برمجية تقيّد الاتصال أو خدمات الموقع تلقائياً عند استخدامها في دول خاضعة للعقوبات التقنية الأمريكية. يمكن لمرشدك مساعدتك في ضبط إعدادات الشبكة أو استخدام VPN لتجاوز ذلك.",
    ],
    [
      "Do you recommend getting a specific travel insurance policy?",
      "Yes, specialized travel insurance is highly recommended. Standard international insurance policies often exclude regions with active travel advisories, so you must secure a policy from a provider that explicitly covers travel within Syria.",
      "هل تنصحون بالحصول على تأمين سفر معين؟",
      "نعم، يُنصح بشدة بتأمين سفر متخصص. فوثائق التأمين الدولية العادية غالباً ما تستثني المناطق التي عليها تحذيرات سفر، لذا يجب الحصول على وثيقة من شركة تغطي السفر داخل سوريا صراحةً.",
    ],
    [
      "Which months of the year offer the best weather for travel?",
      "The best months to visit are during the spring (April to May) and autumn (September to October). The weather during these periods is mild and pleasant, avoiding the intense heat of summer and the freezing rain of winter.",
      "ما أشهر السنة التي يكون فيها الطقس أفضل للسفر؟",
      "أفضل الأشهر للزيارة هي فصل الربيع (من نيسان/أبريل إلى أيار/مايو) والخريف (من أيلول/سبتمبر إلى تشرين الأول/أكتوبر). يكون الطقس فيها معتدلاً ولطيفاً، بعيداً عن حر الصيف الشديد وأمطار الشتاء الباردة.",
    ],
    [
      "Is it ethical to travel to Syria for tourism right now?",
      "Yes, tourism provides direct, vital economic support to local families. Spending money at family-owned guesthouses, restaurants, artisan workshops, and local markets directly helps ordinary citizens rebuild their livelihoods.",
      "هل السفر إلى سوريا للسياحة الآن أمر أخلاقي؟",
      "نعم، توفر السياحة دعماً اقتصادياً مباشراً وحيوياً للعائلات المحلية. فإنفاق المال في بيوت الضيافة العائلية والمطاعم وورش الحرفيين والأسواق المحلية يساعد المواطنين مباشرةً على إعادة بناء مصادر رزقهم.",
    ],
    [
      "How many hours do daily power outages and electricity cuts last?",
      "Public grid electricity is subject to severe rationing, and power cuts can last for several hours a day. However, most tourist hotels, restaurants, and shops use private generators to provide continuous power and charging outlets for guests.",
      "كم ساعة يستمر انقطاع الكهرباء يومياً؟",
      "تخضع كهرباء الشبكة العامة لتقنين شديد، وقد يستمر الانقطاع عدة ساعات يومياً. لكن معظم الفنادق السياحية والمطاعم والمتاجر تستخدم مولدات خاصة لتوفير كهرباء مستمرة ومقابس شحن للضيوف.",
    ],
    [
      "Which days of the week do local museums close?",
      "Most state-run museums and historical indoor sites are closed on Tuesdays, though schedule changes can occur. Outdoor archaeological landmarks generally remain open all week.",
      "في أي أيام الأسبوع تُغلق المتاحف المحلية؟",
      "تُغلق معظم المتاحف الحكومية والمواقع التاريخية المغلقة أيام الثلاثاء، مع احتمال حدوث تغييرات في المواعيد. أما المواقع الأثرية المفتوحة فتبقى عادةً مفتوحة طوال الأسبوع.",
    ],
    [
      "What are the must-see tourist attractions I shouldn’t miss?",
      "The top highlights include the Umayyad Mosque and the Souk Al-Hamidiyah in Old Damascus, the ancient desert city of Palmyra, the massive Krak des Chevaliers crusader castle, and the historic old quarters of Aleppo.",
      "ما أهم المعالم السياحية التي لا يجب أن تفوتني؟",
      "من أبرزها الجامع الأموي وسوق الحميدية في دمشق القديمة، ومدينة تدمر الأثرية في البادية، وقلعة الحصن الصليبية الضخمة، والأحياء القديمة التاريخية في حلب.",
    ],
  ]),

  ...section("Health & Communications", "الصحة والاتصالات", [
    [
      "Can I use my international VPN services while in the country?",
      "Yes, using a VPN is highly recommended. Many global websites, booking platforms, and social applications are blocked due to international tech sanctions. Downloading and setting up a reliable premium VPN before crossing the border ensures you stay connected to your work and family accounts without interruptions.",
      "هل يمكنني استخدام خدمات VPN الدولية أثناء وجودي في البلاد؟",
      "نعم، يُنصح بشدة باستخدام VPN. فكثير من المواقع العالمية ومنصات الحجز وتطبيقات التواصل محجوبة بسبب العقوبات التقنية الدولية. تنزيل VPN موثوق وإعداده قبل عبور الحدود يضمن بقاءك على اتصال بحسابات العمل والعائلة دون انقطاع.",
    ],
    [
      "What happens if I get sick or need medical attention during the tour?",
      "Your guide will immediately assist you in accessing private medical care. Major cities like Damascus and Aleppo have highly qualified, English-speaking doctors and excellent private hospitals. We also keep a first-aid kit in our vehicles and can help locate specific imported medications in local pharmacies if needed.",
      "ماذا يحدث إذا مرضت أو احتجت إلى رعاية طبية خلال الجولة؟",
      "سيساعدك مرشدك فوراً في الوصول إلى رعاية طبية خاصة. ففي المدن الكبرى مثل دمشق وحلب أطباء مؤهلون جداً يتحدثون الإنجليزية ومستشفيات خاصة ممتازة. كما نحتفظ بحقيبة إسعافات أولية في سياراتنا، ويمكننا المساعدة في إيجاد أدوية مستوردة معينة في الصيدليات المحلية عند الحاجة.",
    ],
  ]),

  ...section("Culture & Photography Restrictions", "الثقافة ومحاذير التصوير", [
    [
      "Can I bring and use a drone for travel photography or videography?",
      "No, bringing or operating commercial or recreational drones is strictly prohibited. Drones will be confiscated at the border or airport security checkpoints. Stick to standard handheld cameras or smartphones, and always ask your guide before filming in public spaces.",
      "هل يمكنني إحضار طائرة درون واستخدامها للتصوير؟",
      "لا، إحضار أو تشغيل الطائرات المسيّرة (الدرون) التجارية أو الترفيهية ممنوع منعاً باتاً، وستُصادر على الحدود أو عند نقاط التفتيش في المطار. اكتفِ بالكاميرات المحمولة أو الهواتف الذكية، واسأل مرشدك دائماً قبل التصوير في الأماكن العامة.",
    ],
    [
      "Is it safe and appropriate to travel with children?",
      "Yes, Syrian culture is incredibly family-oriented and welcoming to children. However, because itineraries involve walking through ancient, uneven stone souks and long drives between cities, we recommend private customized tours so you can set a flexible, child-friendly pace for rest stops and meals.",
      "هل السفر مع الأطفال آمن ومناسب؟",
      "نعم، الثقافة السورية عائلية جداً ومرحبة بالأطفال. لكن بما أن البرامج تتضمن المشي في أسواق حجرية قديمة غير مستوية ورحلات طويلة بالسيارة بين المدن، ننصح بالجولات الخاصة المصممة حسب الطلب لتحديد إيقاع مرن ومناسب للأطفال في الاستراحات والوجبات.",
    ],
  ]),

  ...section("Booking & Flexibility", "الحجز والمرونة", [
    [
      "How far in advance do I need to book my tour and submit my passport?",
      "For most nationalities, we recommend booking at least 3 to 4 weeks in advance to allow smooth processing of your security clearance. For US, UK, and Canadian passport holders, the vetting process can take longer, so booking 2 to 3 months ahead is highly advised.",
      "قبل كم من الوقت يجب أن أحجز جولتي وأرسل جواز سفري؟",
      "لمعظم الجنسيات، ننصح بالحجز قبل 3 إلى 4 أسابيع على الأقل لضمان سير الموافقة الأمنية بسلاسة. أما لحاملي الجوازات الأمريكية والبريطانية والكندية فقد يستغرق التدقيق وقتاً أطول، لذا يُنصح بشدة بالحجز قبل شهرين إلى ثلاثة أشهر.",
    ],
    [
      "What is your refund policy if my security clearance or visa is denied?",
      "If your government security clearance is rejected, we provide a full refund of your tour deposit (minus minor bank transfer or administrative fees, if applicable). We believe you shouldn’t pay for circumstances beyond your control.",
      "ما سياسة الاسترداد إذا رُفضت موافقتي الأمنية أو تأشيرتي؟",
      "إذا رُفضت موافقتك الأمنية الحكومية، نعيد لك عربون الجولة كاملاً (مع خصم رسوم التحويل البنكي أو الرسوم الإدارية البسيطة إن وُجدت). نؤمن بأنه لا يجب أن تدفع ثمن ظروف خارجة عن إرادتك.",
    ],
  ]),

  ...section("Daily Life & Customs", "الحياة اليومية والعادات", [
    [
      "Are museums and historical sites accessible for travelers with physical disabilities?",
      "Accessibility is limited in ancient heritage areas. Old souks, crusader castles, and archaeological ruins feature uneven cobblestones, steep stairs, and lack wheelchair ramps. If you have mobility concerns, please let us know in advance so we can tailor the itinerary to accessible viewpoints and comfortable routes.",
      "هل المتاحف والمواقع التاريخية مهيأة للمسافرين من ذوي الإعاقة الحركية؟",
      "إمكانية الوصول محدودة في المناطق التراثية القديمة. فالأسواق القديمة والقلاع الصليبية والمواقع الأثرية فيها أرضيات حجرية غير مستوية ودرج شديد الانحدار ولا تتوفر فيها منحدرات للكراسي المتحركة. إن كانت لديك صعوبات في الحركة، أخبرنا مسبقاً لنصمم البرنامج حول نقاط مشاهدة يسهل الوصول إليها وطرق مريحة.",
    ],
    [
      "Can I buy a souvenir that is an actual ancient antique?",
      "No, purchasing or exporting genuine archaeological artifacts is strictly illegal under heritage protection laws. However, you can buy beautiful, high-quality modern replicas of ancient mosaics, pottery, and traditional crafts made by local artisans, which are perfectly legal to take home.",
      "هل يمكنني شراء تذكار يكون قطعة أثرية قديمة حقيقية؟",
      "لا، شراء القطع الأثرية الحقيقية أو تصديرها مخالف تماماً لقوانين حماية التراث. لكن يمكنك شراء نسخ حديثة جميلة وعالية الجودة من الفسيفساء والفخار القديم والحرف التقليدية التي يصنعها حرفيون محليون، وهي قانونية تماماً ويمكنك أخذها معك.",
    ],
  ]),
];
