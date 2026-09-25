/**
 * Editorial + support content for the non-shop pages.
 * All copy is original to this demo; nothing is lifted from a live retailer.
 */

/* ---------------- How to order ---------------- */

export const orderSteps = [
  {
    step: '01',
    title: 'Create an account',
    copy: 'Confirm you are of legal age and add a shipping address. It takes about a minute, and new accounts start with 500 Leaf Points.',
  },
  {
    step: '02',
    title: 'Fill your cart',
    copy: 'Minimum order is $60 before shipping. Mix & Match bundles count toward the free-shipping threshold of $99.',
  },
  {
    step: '03',
    title: 'Choose how to pay',
    copy: 'Interac e-Transfer or credit card. e-Transfer orders get payment instructions by email the moment you check out.',
  },
  {
    step: '04',
    title: 'We pack and ship',
    copy: 'Orders paid before 1pm ET ship the same business day, sealed in a plain box with a tracked, signature-required label.',
  },
  {
    step: '05',
    title: 'Track it to the door',
    copy: 'A tracking number lands in your inbox within an hour of pickup. Government-issued photo ID is checked on delivery.',
  },
];

export const paymentMethods = [
  { name: 'Interac e-Transfer', detail: 'Accepted everywhere we ship. Instructions are emailed at checkout.', fee: 'No fee' },
  { name: 'Credit card', detail: 'Visa and Mastercard, processed by an encrypted third party.', fee: '2.5% fee' },
  { name: 'Leaf Points', detail: 'Redeem points against any order, with no minimum.', fee: 'No fee' },
];

/* ---------------- Rewards ---------------- */

export const rewardTiers = [
  {
    name: 'Seedling',
    threshold: 'From $0',
    rate: '2% back',
    perks: ['500 points on sign-up', 'Birthday bonus', 'Restock notices first'],
  },
  {
    name: 'Grower',
    threshold: 'From $500 spent',
    rate: '4% back',
    perks: ['Everything in Seedling', 'Free shipping over $75', 'Early access to small lots'],
    featured: true,
  },
  {
    name: 'Cultivar',
    threshold: 'From $1,500 spent',
    rate: '6% back',
    perks: ['Everything in Grower', 'Always free shipping', 'First refusal on single-lot drops'],
  },
];

export const rewardFacts = [
  { value: '100 pts', label: 'equals $1 off, at any basket size' },
  { value: 'Never', label: 'expires, as long as you order once a year' },
  { value: '$15 / $15', label: 'for you and a friend on every referral' },
];

/* ---------------- FAQ (shared by /faq and the About page) ---------------- */

export const faqGroups = [
  {
    group: 'Ordering',
    items: [
      {
        q: 'Is there a minimum order?',
        a: '$60 before shipping. Orders over $99 ship free; below that, flat-rate tracked shipping is $15 wherever we deliver.',
      },
      {
        q: 'How do I pay?',
        a: 'Interac e-Transfer or credit card. e-Transfer instructions are emailed at checkout and orders are released the moment payment clears, usually within an hour during business hours.',
      },
      {
        q: 'Can I change an order after placing it?',
        a: 'Yes, until it is packed. Email support with your order number; once a tracking number exists, the box is already sealed and on its way.',
      },
    ],
  },
  {
    group: 'Shipping',
    items: [
      {
        q: 'Where do you ship, and how fast?',
        a: 'By tracked courier. Most urban addresses see delivery in one to two business days; rural and remote routes take three to five.',
      },
      {
        q: 'What does the package look like?',
        a: 'A plain corrugated box with a printed shipping label and no branding, product names or scent. Contents are double-sealed in odour-barrier bags.',
      },
      {
        q: 'What if my parcel is late or lost?',
        a: 'If tracking has not moved in four business days, tell us and we will open a trace. Confirmed lost parcels are reshipped or refunded in full — that is on us, not on you.',
      },
    ],
  },
  {
    group: 'Products',
    items: [
      {
        q: 'Why is THC a percentage for some products and milligrams for others?',
        a: 'Percentages describe how much of a dried flower or extract is THC by weight. Milligrams describe a fixed dose in something you swallow. They are not comparable numbers, so we never mix them into one figure.',
      },
      {
        q: 'Can I see the lab results?',
        a: 'Every order ships with the certificate of analysis for the exact lot inside it. Ask support for a copy of any lot you have bought and we will send the PDF.',
      },
      {
        q: 'How should I store what I buy?',
        a: 'Airtight, out of light, between 15 and 20°C. Flower dries out fastest; edibles and tinctures are happiest in a cupboard rather than a fridge.',
      },
    ],
  },
  {
    group: 'Account & returns',
    items: [
      {
        q: 'How is my age verified?',
        a: 'You confirm your age before entering the store, again at checkout, and the courier checks government-issued photo ID at the door. Nobody signs on your behalf.',
      },
      {
        q: 'Can I return an order?',
        a: 'Unopened, sealed products can be returned within 14 days for a refund minus shipping. Opened cannabis products cannot be resold, so we handle those case by case.',
      },
      {
        q: 'Do you store my payment details?',
        a: 'No. Payments are processed by an encrypted third-party provider and we keep only the last four digits for order lookup.',
      },
    ],
  },
];

/** Flat list, used where grouping is not wanted. */
export const faqs = faqGroups.flatMap((g) => g.items);

/* ---------------- Reviews ---------------- */

export const siteReviews = [
  {
    name: 'Dana R.',
    location: 'Victoria, BC',
    rating: 5,
    date: 'Sep 2026',
    product: 'Aurora Haze',
    title: 'Third order, still consistent',
    text: 'The thing that keeps me here is that the second jar tastes like the first one. Packaging is genuinely unmarked — my building manager hands them over without a second glance.',
  },
  {
    name: 'Joon K.',
    location: 'Toronto, ON',
    rating: 5,
    date: 'Sep 2026',
    product: 'Pacific Fog',
    title: 'Strong, and honest about it',
    text: 'The listing says take half of what you think you need, which turned out to be good advice. Lab sheet was in the box as promised.',
  },
  {
    name: 'Renée L.',
    location: 'Montréal, QC',
    rating: 5,
    date: 'Aug 2026',
    product: 'Sunrise Gummies',
    title: 'Good starting point',
    text: 'I had not tried an edible in years and the 5 mg pieces made that easy. Scored down the middle so you can take half.',
  },
  {
    name: 'Marta V.',
    location: 'Calgary, AB',
    rating: 5,
    date: 'Aug 2026',
    product: 'Clearfield CBD Oil',
    title: 'The dropper has markings',
    text: 'Sounds small, but every other tincture I have bought makes you guess. Neutral taste, no cannabis funk.',
  },
  {
    name: 'Owen H.',
    location: 'Halifax, NS',
    rating: 4,
    date: 'Aug 2026',
    product: 'Northline 510 Cart',
    title: 'No burnt last third',
    text: 'Runs cool right down to the bottom of the tank. Docked a star because the battery is sold separately and that was not obvious to me.',
  },
  {
    name: 'Priya S.',
    location: 'Winnipeg, MB',
    rating: 5,
    date: 'Jul 2026',
    product: 'Midnight Orchard',
    title: 'Quiets the 2am spiral',
    text: 'Arrived in two days to a rural address, which I did not expect. It does exactly what the description said it would.',
  },
  {
    name: 'Cal D.',
    location: 'Saskatoon, SK',
    rating: 4,
    date: 'Jul 2026',
    product: 'Driftwood All-In-One',
    title: 'Good travel option',
    text: 'USB-C is the right call. I would buy a one-gram version in a heartbeat.',
  },
  {
    name: 'Nadia F.',
    location: 'Ottawa, ON',
    rating: 5,
    date: 'Jun 2026',
    product: 'Four-Piece Brass Grinder',
    title: 'Feels like a tool',
    text: 'Heavy, sharp, and the magnet actually holds. It will outlast me.',
  },
  {
    name: 'Yusuf E.',
    location: 'Edmonton, AB',
    rating: 5,
    date: 'Jun 2026',
    product: 'Pressed Hash Block',
    title: 'Proper hash',
    text: 'Pliable, warms up nicely, tastes like the stuff I remember from twenty years ago. Support answered a question in under an hour.',
  },
];

export const reviewSummary = {
  average: 4.8,
  count: 12418,
  distribution: [
    { stars: 5, percent: 84 },
    { stars: 4, percent: 12 },
    { stars: 3, percent: 3 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 0 },
  ],
};

/* ---------------- Blog ---------------- */

export const blogPosts = [
  {
    slug: 'terpenes-explained',
    title: 'Terpenes, and why two 22% strains feel nothing alike',
    excerpt:
      'THC sets the ceiling. Terpenes decide what the room looks like. A plain-language guide to the six you will actually meet.',
    category: 'Learn',
    date: '12 September 2026',
    readTime: '6 min read',
    image: '/images/editorial/blog-terpenes.jpg',
    alt: 'Cannabis leaves and rolling papers arranged on a pink surface',
    body: [
      {
        heading: 'Potency is the least interesting number on the label',
        text: 'Two jars can test within a percentage point of each other and produce completely different afternoons. The number that changes the experience is rarely THC — it is the aromatic compounds sitting alongside it, which is why we print the dominant three on every listing.',
      },
      {
        heading: 'The six you will actually meet',
        text: 'Limonene reads bright and citrus-forward. Myrcene is the heavy, mango-and-earth note in most evening strains. Pinene is sharp and clear. Caryophyllene is peppery and the only terpene that binds to a cannabinoid receptor. Linalool is lavender-soft. Terpinolene is the floral, slightly fruity one that shows up in nearly every sativa people call "creative".',
      },
      {
        heading: 'How to use this when you shop',
        text: 'Find a lot you liked, look at its top two terpenes, and use those as the filter next time instead of chasing a higher percentage. It is a far better predictor of whether you will enjoy something than the number on the front of the jar.',
      },
    ],
  },
  {
    slug: 'edible-dosing',
    title: 'Start low, go slow: a dosing guide that is actually specific',
    excerpt:
      'Ninety minutes is the number that matters. Here is what 2.5, 5 and 10 mg feel like, and why re-dosing early is the single most common mistake.',
    category: 'Guides',
    date: '28 August 2026',
    readTime: '5 min read',
    image: '/images/editorial/blog-dosing.jpg',
    alt: 'Pre-rolled joints arranged on a decorative tray',
    body: [
      {
        heading: 'Why edibles behave differently',
        text: 'Inhaled THC reaches you in minutes. Swallowed THC goes through the liver first, where a portion converts into a compound that is both stronger and longer-lasting. That conversion is why an edible can feel disproportionate to its milligram count, and why it takes so long to arrive.',
      },
      {
        heading: 'What the numbers feel like',
        text: '2.5 mg is a light, sociable shift most people would not call "high". 5 mg is a clear effect with a two-to-four hour tail. 10 mg is a substantial dose that will occupy your evening. Above that, you are in territory that experienced consumers build up to rather than jump into.',
      },
      {
        heading: 'The rule that prevents bad nights',
        text: 'Take your dose, then do something else for ninety minutes before deciding anything. Almost every uncomfortable edible story is someone taking a second piece at the forty-minute mark and meeting both doses at once.',
      },
    ],
  },
  {
    slug: 'storing-flower',
    title: 'Storing flower: humidity, light, and the myth of the fridge',
    excerpt:
      'Most flower goes stale for three avoidable reasons. None of them require a special gadget to fix.',
    category: 'Guides',
    date: '14 August 2026',
    readTime: '4 min read',
    image: '/images/editorial/blog-storage.jpg',
    alt: 'Cannabis arranged on a marble table with matches and a glass',
    body: [
      {
        heading: 'Light is the fastest way to ruin a jar',
        text: 'UV degrades cannabinoids and terpenes quicker than anything else in a normal home. A cupboard beats a windowsill, and violet or amber glass beats clear glass by a wide margin.',
      },
      {
        heading: 'Aim for 58 to 62% humidity',
        text: 'Below that, flower turns brittle and harsh. Above it, you are inviting mould. A two-dollar humidity pack in an airtight jar holds the range for months without any thought from you.',
      },
      {
        heading: 'Skip the fridge and the freezer',
        text: 'Both cycle moisture every time you open the door, and cold trichomes snap off at a touch. A stable cupboard at room temperature outperforms both, every time.',
      },
    ],
  },
  {
    slug: 'inside-a-small-lot',
    title: 'Inside a small lot: what happens between harvest and your door',
    excerpt:
      'Six weeks, one independent lab, and roughly five lots rejected for every one we buy. A walk through the unglamorous part.',
    category: 'Behind the scenes',
    date: '30 July 2026',
    readTime: '7 min read',
    image: '/images/editorial/blog-harvest.jpg',
    alt: 'Close-up of a cannabis plant before harvest',
    body: [
      {
        heading: 'Week one: the visit',
        text: 'We go to the grow. Not for the tour — for the drying room, which tells you more about a producer in ten minutes than a spec sheet does in ten pages. Airflow, temperature, how densely the racks are hung.',
      },
      {
        heading: 'Weeks two to four: the cure',
        text: 'Flower rests in controlled humidity while the chlorophyll breaks down. Rushing this is the single most common reason legal cannabis tastes like hay, and it is the step most often cut when a producer needs revenue this month.',
      },
      {
        heading: 'Week five: the lab',
        text: 'An independent lab screens for cannabinoids, terpenes, pesticides, residual solvents, heavy metals and microbials. We publish what comes back, including the batches that came in lower than the grower hoped.',
      },
      {
        heading: 'Week six: the box',
        text: 'Packed the day it is ordered, double-sealed against odour, into a plain carton. The least interesting-looking part of the process, and the part customers mention most.',
      },
    ],
  },
];

export const getPost = (slug) => blogPosts.find((p) => p.slug === slug);

/* ---------------- Account (mock) ---------------- */

export const mockAccount = {
  name: 'Jordan Avery',
  email: 'jordan.avery@example.ca',
  memberSince: 'March 2025',
  tier: 'Grower',
  points: 2480,
  pointsToNextTier: 620,
  referralCode: 'JORDAN-NL15',
  address: { line1: '88 Wychwood Lane', line2: 'Apt 4', city: 'Toronto, ON M6G 2X1' },
};

export const mockOrders = [
  {
    id: 'NL-48213',
    date: '18 September 2026',
    status: 'Delivered',
    total: 106,
    items: [
      { name: 'Pacific Fog', qty: 1 },
      { name: 'Sunrise Gummies', qty: 2 },
      { name: 'Four-Piece Brass Grinder', qty: 1 },
    ],
  },
  {
    id: 'NL-47980',
    date: '2 September 2026',
    status: 'Delivered',
    total: 64,
    items: [
      { name: 'Aurora Haze', qty: 1 },
      { name: 'Cocoa Noir Squares', qty: 1 },
    ],
  },
  {
    id: 'NL-47611',
    date: '11 August 2026',
    status: 'Refunded',
    total: 19,
    items: [{ name: 'Stillwater Brewing Tea', qty: 1 }],
  },
];

/** The demo order that /order-tracking recognises. */
export const trackedOrder = {
  id: 'NL-48213',
  email: 'jordan.avery@example.ca',
  carrier: 'NorthPost Tracked',
  tracking: 'NP4417 8832 0091',
  eta: 'Delivered 20 September 2026, 11:42',
  steps: [
    { label: 'Order received', detail: 'Payment confirmed by e-Transfer', date: '18 Sep, 09:14', done: true },
    { label: 'Packed', detail: 'Sealed in plain packaging, lab sheet enclosed', date: '18 Sep, 12:40', done: true },
    { label: 'Handed to courier', detail: 'Tracked, signature required', date: '18 Sep, 17:05', done: true },
    { label: 'In transit', detail: 'Sorting facility, Mississauga ON', date: '19 Sep, 04:22', done: true },
    { label: 'Delivered', detail: 'ID checked at the door', date: '20 Sep, 11:42', done: true },
  ],
};

/* ---------------- Vendors ---------------- */

export const vendorCriteria = [
  {
    title: 'Small lots only',
    copy: 'We buy in quantities a single grower can watch over. If a lot cannot be traced to one room and one harvest date, it is not for us.',
  },
  {
    title: 'Testing before the conversation',
    copy: 'Send a recent full-panel certificate of analysis from an independent lab. Cannabinoids and terpenes, plus contaminant screens.',
  },
  {
    title: 'A real cure',
    copy: 'Minimum fourteen days in controlled humidity. We will ask about your drying room, and we will want to see it.',
  },
  {
    title: 'Terms that are not a trap',
    copy: 'We pay on 14-day terms, we do not ask for exclusivity, and we do not charge listing fees. You keep your name on the lot.',
  },
];

/* ---------------- Shipping & returns ---------------- */

export const shippingZones = [
  { region: 'Major cities', time: '1–2 business days', note: 'Addresses on a daily courier route usually arrive next day.' },
  { region: 'Suburban & regional', time: '2–3 business days', note: 'One hop through a sorting hub before the last leg.' },
  { region: 'Rural routes', time: '2–4 business days', note: 'Delivery days can be fixed rather than daily.' },
  { region: 'Remote & island', time: '4–7 business days', note: 'Tracked, but hubs update less often on these routes.' },
];

export const returnRules = [
  {
    title: 'Sealed products',
    copy: 'Returnable within 14 days of delivery for a full refund of the product price. Send it back in its original seal and we cover nothing but the return label.',
  },
  {
    title: 'Opened cannabis',
    copy: 'Cannot legally be resold, so it cannot come back. If something is wrong with a lot — too dry, off-smelling, not what the label says — tell us within 7 days and we will replace or credit it.',
  },
  {
    title: 'Accessories',
    copy: 'Unused accessories can be returned within 30 days. Grinders and glass carry a one-year warranty against manufacturing defects.',
  },
  {
    title: 'Damaged or lost parcels',
    copy: 'Photograph damage before opening further and email us the same day. Confirmed lost parcels are reshipped or refunded in full.',
  },
];

/* ---------------- Mix & Match ---------------- */

export const mixMatchSteps = [
  { title: 'Pick any four', copy: 'Flower, edibles, vapes or concentrates, in any combination. Repeats count.' },
  { title: 'Discount applies itself', copy: 'The saving shows up in your cart the moment the fourth eligible item lands. No code.' },
  { title: 'Keep going', copy: 'Every eligible item after the fourth is discounted too, up to the legal possession limit.' },
];

/* ---------------- Legal pages ---------------- */

export const legalDocs = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    updated: '1 September 2026',
    intro:
      'We collect the least we can to verify your age, ship your order and answer your questions. This page explains exactly what that is.',
    sections: [
      {
        heading: 'What we collect',
        text: 'Your name, email, shipping address and date of birth when you create an account. Order history, so you can reorder and we can handle returns. The last four digits of a card, for order lookup only.',
      },
      {
        heading: 'What we never collect',
        text: 'Full card numbers, which go straight to our payment processor. Browsing behaviour for advertising. Anything from third-party data brokers.',
      },
      {
        heading: 'Who sees it',
        text: 'Our fulfilment team, to pack your order. The courier, who sees a name and address and nothing about the contents. Nobody else. We do not sell, rent or trade personal data.',
      },
      {
        heading: 'How long we keep it',
        text: 'Account data for as long as your account is open. Order records for seven years, because tax law requires it. Close your account and everything else is deleted within 30 days.',
      },
      {
        heading: 'Your rights',
        text: 'You can request a copy of your data, correct it, or ask us to delete it at any time by emailing privacy@northleaf.example. We reply within 30 days, usually much sooner.',
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    updated: '1 September 2026',
    intro:
      'The short version: you must be of legal age where you live, orders are for personal use, and we will always tell you plainly if something goes wrong.',
    sections: [
      {
        heading: 'Eligibility',
        text: 'You must meet the legal age for cannabis where you live, and be ordering to an address we deliver to. Government-issued photo ID is checked on delivery; parcels are returned if it cannot be.',
      },
      {
        heading: 'Order limits',
        text: 'A single order may not exceed 30 g of dried cannabis or its legal equivalent, which is the public possession limit. Orders above it are cancelled and refunded in full.',
      },
      {
        heading: 'Pricing and payment',
        text: 'Prices include applicable duty. Sales tax is added at checkout based on your shipping address. Orders are released once payment clears.',
      },
      {
        heading: 'Personal use only',
        text: 'Products may not be resold, gifted to minors, or shipped onward. Accounts found reselling are closed and outstanding orders refunded.',
      },
      {
        heading: 'Changes to these terms',
        text: 'If we change something material, we email account holders at least 14 days before it takes effect. Orders placed before a change are governed by the terms at the time of purchase.',
      },
    ],
  },
  'responsible-use': {
    eyebrow: 'Health',
    title: 'Responsible Use',
    updated: '1 September 2026',
    intro:
      'Cannabis is legal, not harmless. These are the guidelines we would give a friend, not a disclaimer written to be ignored.',
    sections: [
      {
        heading: 'Start low, go slow',
        text: 'Begin with the smallest dose on the label — one inhale, or 2.5 mg of an edible — and wait. Inhaled effects peak within 15 minutes; edibles can take 90 minutes or longer.',
      },
      {
        heading: 'Never drive impaired',
        text: 'Wait at least six hours after inhaling and longer after an edible. Impairment outlasts the feeling of being high, and roadside tests do not care how you feel.',
      },
      {
        heading: 'Store it like medicine',
        text: 'Locked, sealed and out of sight of children and pets. Edibles look like ordinary sweets, which is exactly why they need a separate, childproof home.',
      },
      {
        heading: 'Know when to stop',
        text: 'Avoid cannabis if you are pregnant or breastfeeding, have a personal or family history of psychosis, or are taking medication that interacts with it. Ask a pharmacist if unsure.',
      },
      {
        heading: 'Where to get help',
        text: 'If use stops feeling like a choice, talking to someone helps. Your provincial health line can connect you with confidential support, free of charge.',
      },
    ],
  },
};
