/**
 * Site navigation map — one source of truth for the desktop mega-menu,
 * the mobile sheet and the footer columns.
 *
 * Category sub-links use `?tag=` which the shop matches against a product's
 * type, name and effects, so "Indica" or "Cartridges" narrow the grid without
 * needing a separate route per sub-type.
 */
export const NAV = [
  { to: '/deals', label: 'Deals' },
  {
    label: 'Shop',
    to: '/shop',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'All products', to: '/shop' },
          { label: 'Best sellers', to: '/shop?sort=rating' },
          { label: 'Mix & Match', to: '/mix-and-match' },
          { label: 'New arrivals', to: '/deals' },
        ],
      },
      {
        title: 'Categories',
        links: [
          { label: 'Flowers', to: '/shop?category=flower' },
          { label: 'Vapes', to: '/shop?category=vapes' },
          { label: 'Concentrates', to: '/shop?category=concentrates' },
          { label: 'Edibles', to: '/shop?category=edibles' },
          { label: 'CBD', to: '/shop?category=cbd' },
          { label: 'Accessories', to: '/shop?category=accessories' },
        ],
      },
    ],
  },
  {
    label: 'Promotions',
    to: '/deals',
    links: [
      { label: 'Current deals', to: '/deals' },
      { label: 'Mix & Match bundles', to: '/mix-and-match' },
      { label: 'Leaf Points rewards', to: '/rewards' },
      { label: 'Refer a friend', to: '/rewards#referral' },
    ],
  },
  {
    label: 'Flowers',
    to: '/shop?category=flower',
    links: [
      { label: 'All flower', to: '/shop?category=flower' },
      { label: 'Indica', to: '/shop?category=flower&tag=indica' },
      { label: 'Sativa', to: '/shop?category=flower&tag=sativa' },
      { label: 'Hybrid', to: '/shop?category=flower&tag=hybrid' },
    ],
  },
  {
    label: 'Vapes',
    to: '/shop?category=vapes',
    links: [
      { label: 'All vapes', to: '/shop?category=vapes' },
      { label: 'Cartridges', to: '/shop?category=vapes&tag=cartridge' },
      { label: 'All-in-ones', to: '/shop?category=vapes&tag=disposable' },
    ],
  },
  {
    label: 'Concentrates',
    to: '/shop?category=concentrates',
    links: [
      { label: 'All concentrates', to: '/shop?category=concentrates' },
      { label: 'Live rosin', to: '/shop?category=concentrates&tag=badder' },
      { label: 'Hash', to: '/shop?category=concentrates&tag=hash' },
    ],
  },
  {
    label: 'Edibles',
    to: '/shop?category=edibles',
    links: [
      { label: 'All edibles', to: '/shop?category=edibles' },
      { label: 'Gummies', to: '/shop?category=edibles&tag=chew' },
      { label: 'Chocolate', to: '/shop?category=edibles&tag=chocolate' },
      { label: 'Drinks & tea', to: '/shop?category=edibles&tag=leaf' },
    ],
  },
  {
    label: 'CBD',
    to: '/shop?category=cbd',
    links: [
      { label: 'All CBD', to: '/shop?category=cbd' },
      { label: 'Tinctures', to: '/shop?category=cbd&tag=tincture' },
      { label: 'Topicals', to: '/shop?category=cbd&tag=topical' },
    ],
  },
  {
    label: 'Accessories',
    to: '/shop?category=accessories',
    links: [
      { label: 'All accessories', to: '/shop?category=accessories' },
      { label: 'Grinders', to: '/shop?category=accessories&tag=brass' },
      { label: 'Storage', to: '/shop?category=accessories&tag=glass' },
    ],
  },
  {
    label: 'Contact Us',
    to: '/contact',
    links: [
      { label: 'Contact support', to: '/contact' },
      { label: 'How to order', to: '/how-to-order' },
      { label: 'Order tracking', to: '/order-tracking' },
      { label: 'Shipping & returns', to: '/shipping' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Reviews', to: '/reviews' },
    ],
  },
  {
    label: 'Vendors',
    to: '/vendors',
    links: [
      { label: 'Become a vendor', to: '/vendors' },
      { label: 'What we look for', to: '/vendors#apply' },
      { label: 'About CanabisLeafHub', to: '/about' },
      { label: 'Field Notes', to: '/blog' },
    ],
  },
];

/** Footer columns, derived separately so the footer stays scannable. */
export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Deals', to: '/deals' },
      { label: 'Mix & Match', to: '/mix-and-match' },
      { label: 'Flowers', to: '/shop?category=flower' },
      { label: 'Edibles', to: '/shop?category=edibles' },
      { label: 'CBD', to: '/shop?category=cbd' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How to order', to: '/how-to-order' },
      { label: 'Order tracking', to: '/order-tracking' },
      { label: 'Shipping & Returns', to: '/shipping' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
      { label: 'My account', to: '/account' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Field Notes', to: '/blog' },
      { label: 'Reviews', to: '/reviews' },
      { label: 'Leaf Points', to: '/rewards' },
      { label: 'Vendors', to: '/vendors' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Age Verification', to: '/about#age' },
      { label: 'Responsible Use', to: '/about#responsible' },
    ],
  },
];
