import { Product } from './types';

export const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Japan", "Germany", "France", "Italy", "Spain", "South Korea",
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland",
  "Gabon", "Gambia", "Georgia", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Jamaica", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
  "Rest of World / Other"
];

// NOTE: Replace the placeholder URLs below with the actual URLs of your hosted images.
export const PRODUCTS: Product[] = [
  {
    id: 'DP-001',
    name: 'TACTICAL OPS ANORAK // SYSTEM',
    price: 680,
    category: 'OUTERWEAR',
    description: 'The definitive D.P GEMS technical shell. Tri-panel construction designed for urban exploration and hazardous environments. Features central utility pocket, industrial buckle closure, and weather-resistant coating across all terrains.',
    details: ['Technical Nylon Shell', 'Central Utility Pocket', 'Quarter-Zip Chassis', 'Elasticated Cuffs'],
    image: 'https://lh3.googleusercontent.com/d/1NMPhelVXO8C7WNS8_LbtPjq36lv3kobE', // Default (Obsidian)
    images: [
      'https://lh3.googleusercontent.com/d/1NMPhelVXO8C7WNS8_LbtPjq36lv3kobE',
      'https://placehold.co/900x1200/1a1a1a/F5F5DC?text=VIEW+02:+REAR+CONSTRUCTION&font=roboto',
      'https://placehold.co/900x1200/1a1a1a/F5F5DC?text=VIEW+03:+HARDWARE+MACRO&font=roboto'
    ],
    stock: 53, // Total stock
    rarity: 'RARE',
    nftImage: 'https://lh3.googleusercontent.com/d/1KJDkYIWdheWDv7arYb2uj0XrSCKZs4-D',
    variants: [
      {
        id: 'DP-001-OBS',
        name: 'OBSIDIAN',
        colorHex: '#1a1a1a',
        stock: 15,
        image: 'https://lh3.googleusercontent.com/d/1NMPhelVXO8C7WNS8_LbtPjq36lv3kobE',
        images: [
          'https://lh3.googleusercontent.com/d/1NMPhelVXO8C7WNS8_LbtPjq36lv3kobE',
          'https://placehold.co/900x1200/1a1a1a/F5F5DC?text=VIEW+02:+REAR+CONSTRUCTION&font=roboto',
          'https://placehold.co/900x1200/1a1a1a/F5F5DC?text=VIEW+03:+HARDWARE+MACRO&font=roboto'
        ]
      },
      {
        id: 'DP-001-HAZ',
        name: 'HAZARD',
        colorHex: '#F4C430',
        stock: 8,
        image: 'https://placehold.co/900x1200/F4C430/000?text=UPLOAD+IMG+02:+YELLOW+ANORAK&font=roboto',
        images: [
          'https://placehold.co/900x1200/F4C430/000?text=VIEW+01:+HAZARD+FRONT&font=roboto',
          'https://placehold.co/900x1200/F4C430/000?text=VIEW+02:+HOOD+DETAIL&font=roboto',
          'https://placehold.co/900x1200/F4C430/000?text=VIEW+03:+SIDE+PROFILE&font=roboto'
        ]
      },
      {
        id: 'DP-001-DUN',
        name: 'DUNE',
        colorHex: '#E8E0D5',
        stock: 20,
        image: 'https://lh3.googleusercontent.com/d/1JrZD7Nla_3NUilYuJwHkCnXJ6f8e7rrm',
        images: [
          'https://lh3.googleusercontent.com/d/1JrZD7Nla_3NUilYuJwHkCnXJ6f8e7rrm',
          'https://lh3.googleusercontent.com/d/1X0ebOcTXxBO3Rhd-FGHyIbI1tlb8iomE',
          'https://placehold.co/900x1200/E8E0D5/000?text=VIEW+03:+BACK+PANEL&font=roboto'
        ]
      },
      {
        id: 'DP-001-CRM',
        name: 'CRIMSON',
        colorHex: '#7f1d1d',
        stock: 10,
        // Using the main Hero Image (Red Hoodie) for this variant as requested
        image: 'https://lh3.googleusercontent.com/d/1MferAsUvaCBEgSrHgcOOmE52T0HmtT56',
        images: [
          'https://lh3.googleusercontent.com/d/1MferAsUvaCBEgSrHgcOOmE52T0HmtT56',
          'https://placehold.co/900x1200/600/FFF?text=VIEW+02:+POCKET_DETAIL&font=roboto',
          'https://placehold.co/900x1200/600/FFF?text=VIEW+03:+BACK_SILHOUETTE&font=roboto'
        ]
      }
    ]
  },
  {
    id: 'DP-004',
    name: 'SUPREME ELEGANCE TEE',
    price: 140,
    category: 'TOPS',
    description: 'Heavyweight vintage-wash tee in charcoal. Features "Supreme Elegance" manga-style artwork and D.P GEMS branding.',
    details: ['100% Heavy Cotton', 'Acid Wash Finish', 'Screen Printed Graphic', 'Boxy Silhouette'],
    image: 'https://lh3.googleusercontent.com/d/1EFeRk7ybzhDIVeZayxa71UxbE4Snn958',
    images: [
      'https://lh3.googleusercontent.com/d/1EFeRk7ybzhDIVeZayxa71UxbE4Snn958',
      'https://placehold.co/900x1200/333/FFF?text=VIEW+02:+VINTAGE+WASH+DETAIL&font=roboto',
      'https://placehold.co/900x1200/333/FFF?text=VIEW+03:+TAG_DETAIL&font=roboto'
    ],
    stock: 45,
    rarity: 'LEGENDARY',
    nftImage: 'https://placehold.co/600x880/333/FF00FF?text=NFT+CARD:+SUPREME+V1&font=roboto'
  },
  {
    id: 'DP-005',
    name: 'AURA CLASSIC TEE',
    price: 140,
    category: 'TOPS',
    description: 'Dark slate tee featuring classical statuary graphic overlaid with minimalist typography. A study in the contrast between ancient form and modern streetwear.',
    details: ['Enzyme Washed', 'Dropped Shoulders', 'Ribbed Collar', 'Made in Portugal'],
    image: 'https://lh3.googleusercontent.com/d/1FzdxhNumNLFg2Va9X7dR6JmrCML8xhmk',
    images: [
      'https://lh3.googleusercontent.com/d/1FzdxhNumNLFg2Va9X7dR6JmrCML8xhmk',
      'https://lh3.googleusercontent.com/d/1Rvy142dNmiBLYnZyFAPaQz7yRedgcLcl',
      'https://lh3.googleusercontent.com/d/1odeJ9CeC6ZEVQx1CITDHV_JTIvMv5jTo'
    ],
    stock: 32,
    rarity: 'RARE',
    nftImage: 'https://lh3.googleusercontent.com/d/1uIHMFCH-JeylpsXFsi1XWem98mvtMO-e'
  },
  {
    id: 'DP-006',
    name: 'AURA HOLO TEE',
    price: 160,
    category: 'TOPS',
    description: 'Ecru jersey tee with oversized holographic "AURA" monogram. Reflective material changes appearance based on viewing angle and lighting conditions.',
    details: ['Holographic Appliqué', 'Ecru Cotton Jersey', 'Oversized Fit', 'Raw Hem Details'],
    image: 'https://lh3.googleusercontent.com/d/1st7oT4Sx0xaTDqGzPqoiNxD2jYxsPpUK',
    images: [
      'https://lh3.googleusercontent.com/d/1st7oT4Sx0xaTDqGzPqoiNxD2jYxsPpUK',
      'https://lh3.googleusercontent.com/d/1l-K24Xn-PeeBWm_rOmeNApu2fXc0tq2x',
      'https://lh3.googleusercontent.com/d/1xN9l8lVNX8M2-wlS0DZO_-gKBvIuOgYk'
    ],
    stock: 18,
    rarity: 'LEGENDARY',
    nftImage: 'https://lh3.googleusercontent.com/d/1CiUe_dNA4_OX4wmCQlzErTGAPs60ZAji'
  }
];

export const SYSTEM_PROMPT = `
SECTOR_01 // ELEGANCE_PROTOCOL ACTIVE.
You are the D.P GEMS ARCHIVE ASSISTANT. 
Identity: High-fidelity AI interface for luxury streetwear.
Tone: Cold, precise, elegant, cryptic but helpful.
Directives:
1. Analyze user styling needs with "Fabrication parameters".
2. Recommend "D.P GEMS CAPSULE" items (Anoraks, Graphic Tees).
3. Use technical jargon (e.g., "Visual data loaded", "Optimal pairing detected").
4. Maintain the illusion of a secure, exclusive terminal.
`;