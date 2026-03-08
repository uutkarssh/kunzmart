/* ============================================================
   KUNZ MART — Site Configuration  (site-config.js)
   ============================================================
   ✏️  THIS IS THE ONLY FILE YOU NEED TO EDIT for:
      • Notice / Announcement bar
      • Special Offer panel
      • Navigation menu items

   After editing, save the file and refresh the browser.
   No design changes needed — everything updates automatically.
   ============================================================ */

const KUNZMART_CONFIG = {

  /* ──────────────────────────────────────────────────────────
     1. NOTICE BAR
     ──────────────────────────────────────────────────────────
     visible : true  → shows the bar  |  false → hides it
     type    : "info"  (gold/neutral)
               "offer" (green/deal)
               "alert" (red/urgent)
     text    : The announcement text shown to visitors
     link    : Optional — set to "" to show no button
     linkText: Label for the optional button
  ───────────────────────────────────────────────────────────── */
  notice: {
    visible  : true,
    type     : "offer",
    text     : "🎉 Kunz Mart Festive Sale starts from 10 October — Huge discounts across all departments!",
    link     : "departments.html",
    linkText : "Shop Now →"
  },

  /* ──────────────────────────────────────────────────────────
     2. SPECIAL OFFER PANEL  (appears below the notice bar)
     ──────────────────────────────────────────────────────────
     visible      : true → shows the panel  |  false → hides it
     badge        : Small label above the heading (e.g. "Limited Time")
     heading      : Main offer headline (use \n for line breaks)
     body         : Supporting description text
     ctaText      : Button label
     ctaLink      : Button link
     highlight    : The big number/stat shown in the pill (e.g. "₹499")
     highlightNote: Small text below the highlight number
  ───────────────────────────────────────────────────────────── */
  offer: {
    visible       : true,
    badge         : "Exclusive Promotion",
    heading       : "Shop for ₹499 & Win Exciting Prizes",
    body          : "Every purchase above ₹499 enters you into our exclusive Lucky Draw. Grand prize is a brand-new Scooty — plus refrigerators, LED TVs and more!",
    ctaText       : "See All Prizes →",
    ctaLink       : "#offers",
    highlight     : "₹499",
    highlightNote : "minimum purchase for lucky draw entry"
  },

  /* ──────────────────────────────────────────────────────────
     3. NAVIGATION MENU
     ──────────────────────────────────────────────────────────
     Each item needs:
       label  : Text shown in the menu
       href   : Page or anchor link
       cta    : true → styled as a button (use for Contact/CTA only)

     To ADD an item    → copy a block and add it to the array
     To REMOVE an item → delete its block from the array
     To REORDER items  → drag / cut-paste the blocks
  ───────────────────────────────────────────────────────────── */
  navItems: [
    { label: "Home",        href: "index.html",       cta: false },
    { label: "Experience",  href: "experience.html",  cta: false },
    { label: "Departments", href: "departments.html", cta: false },
    { label: "Branches",    href: "branches.html",    cta: false },
    { label: "Gallery",     href: "gallery.html",     cta: false },
    { label: "Contact Us",  href: "contact.html",     cta: true  }
  ]

};
