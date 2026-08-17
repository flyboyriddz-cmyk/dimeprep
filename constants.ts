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
    id: 'DPGEMS-0080',
    name: 'GSM DECRYPT CHASSIS // DPGEMS-0080',
    price: 480,
    category: 'OUTERWEAR',
    description: 'High-fidelity classified technical chassis from Sector 1. Integrates GSM decryption signal fibers with a weather-resistant tri-panel weave.',
    details: ['Decryption Signal Fabric', 'Tri-Panel Technical Weave', 'Quarter-Zip Chassis', 'Waterproof Hard-Shell'],
    image: 'https://lh3.googleusercontent.com/d/1jqmB5cjPVC09huC1OidCyPmQGLPKq5VA',
    images: [
      'https://lh3.googleusercontent.com/d/1jqmB5cjPVC09huC1OidCyPmQGLPKq5VA',
      'https://lh3.googleusercontent.com/d/1CPW1Is5BXjxmgtB-WS83u3EG6CIwmTTd',
      'https://lh3.googleusercontent.com/d/1y9OI6t5dO5YCxG-v9JGId2CoeGVyj1Ux'
    ],
    stock: 12,
    rarity: 'LEGENDARY',
    nftImage: 'https://lh3.googleusercontent.com/d/1v7p6UBsVVk2RBdAOdqmuWo-_OHrsm0dF'
  },
  {
    id: 'DPGEMS-0081',
    name: 'BREACH ARMOR HOOD // DPGEMS-0081',
    price: 320,
    category: 'HOODIES',
    description: 'Heavyweight loopback breach armor engineered for terminal Operators. High-density radioactive weave providing optimal thermal insulation in hazardous zones.',
    details: ['Heavyweight 450gsm Cotton', 'Integrated Face Shroud', 'Sealed Thermal Lining', 'Tactical Utility Pocket'],
    image: 'https://lh3.googleusercontent.com/d/1YduZtZPCB3Cxny2WWyknjn4UwBnI5c_i',
    images: [
      'https://lh3.googleusercontent.com/d/1YduZtZPCB3Cxny2WWyknjn4UwBnI5c_i',
      'https://lh3.googleusercontent.com/d/1EgCVR1KdVWSdKoh_CCoFy0nV-nJvJShY',
      'https://lh3.googleusercontent.com/d/1y-nsFxAtnCwBdC9sqOPT2T71hE18zxDx'
    ],
    stock: 8,
    rarity: 'RARE',
    nftImage: 'https://lh3.googleusercontent.com/d/1NYtJUkexkqfmf6NeWbzInbSYtwYUNnbv'
  },
  {
    id: 'DPGEMS-0082',
    name: 'DATA-LINK TRACKER // DPGEMS-0082',
    price: 250,
    category: 'TOPS',
    description: 'CLASSIFIED DEPLOYMENT // DATA-LINK. Heavy cotton garment featuring high-contrast screenprint and integrated Sector 1 authentication tags.',
    details: ['100% Heavy Cotton Jersey', 'Double-Stitch Reinforcements', 'High-Contrast Screenprint', 'Sector 01 Verification Tag'],
    image: 'https://lh3.googleusercontent.com/d/1YUunqfdEqi2EYEp4jtZjanPoUuxCBAoM',
    images: [
      'https://lh3.googleusercontent.com/d/1YUunqfdEqi2EYEp4jtZjanPoUuxCBAoM',
      'https://lh3.googleusercontent.com/d/1mKrycCMBTqiedZ4mCtf0W1I6MayDHNUq'
    ],
    stock: 15,
    rarity: 'RARE',
    nftImage: 'https://lh3.googleusercontent.com/d/1NYtJUkexkqfmf6NeWbzInbSYtwYUNnbv'
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
    nftImage: 'https://lh3.googleusercontent.com/d/1CiUe_dNA4_OX4wmCQlzErTGAPs60ZAji',
    isArchived: true
  },
  {
    id: 'DP-012',
    name: 'VOID RUNNER TEE',
    price: 145,
    category: 'TOPS',
    description: 'Oversized graphic tee featuring high-contrast void runner artwork. Engineered for durability in high-latency environments.',
    details: ['100% Cotton Jersey', 'High-Density Print', 'Drop Shoulder', 'Sector 01 Tag'],
    image: 'https://lh3.googleusercontent.com/d/1W1cJG4VidxmmKuCMdriiXExoSAn-FMYl',
    images: [
      'https://lh3.googleusercontent.com/d/1W1cJG4VidxmmKuCMdriiXExoSAn-FMYl',
      'https://placehold.co/900x1200/111/FFF?text=GRAPHIC+MACRO',
      'https://placehold.co/900x1200/111/FFF?text=REAR+VIEW'
    ],
    stock: 42,
    rarity: 'RARE',
    isArchived: true
  },
  {
    id: 'DP-013',
    name: 'PROTOCOL BREACH TEE',
    price: 150,
    category: 'TOPS',
    description: 'Oversized heavyweight tee featuring "PROTOCOL BREACH" graphics in radioactive green. Designed for those who bypass the firewall.',
    details: ['Heavyweight Cotton', 'Acid Green Print', 'Drop Shoulder', 'Sector 01 Patch'],
    image: 'https://lh3.googleusercontent.com/d/19--La6s9BGDoxUN1o0WxRTyhI6btis-k',
    images: [
      'https://lh3.googleusercontent.com/d/19--La6s9BGDoxUN1o0WxRTyhI6btis-k',
      'https://placehold.co/900x1200/111/FFF?text=SIDE+VIEW',
      'https://placehold.co/900x1200/111/FFF?text=BACK+VIEW'
    ],
    stock: 30,
    rarity: 'RARE',
    isArchived: true
  },
  {
    id: 'DP-014',
    name: 'SECTOR CORE HOODIE',
    price: 195,
    category: 'HOODIES',
    description: 'Heavyweight loopback french terry hoodie. Features dropped shoulders, kangaroo pocket with hidden secure zip, and tonal embroidery. Essential armor for the modern operator.',
    details: ['450gsm Heavyweight Cotton', 'Hidden Secure Pocket', 'Ribbed Cuffs & Hem', 'Oversized Fit'],
    image: 'https://lh3.googleusercontent.com/d/1mlxU4qxvL_UBRBU2EypuAlISL9lcmq71',
    images: [
      'https://lh3.googleusercontent.com/d/1mlxU4qxvL_UBRBU2EypuAlISL9lcmq71',
      'https://lh3.googleusercontent.com/d/15uMt6p0klidgRjDTBnJyqR3ogeUfxUXQ',
      'https://lh3.googleusercontent.com/d/1olcvNuxInbYD4qGTVlXpRk0IQZWY-vj9',
      'https://lh3.googleusercontent.com/d/1Mm9VDH2vHN5lyCyda3scpd67Sy0UtC4u'
    ],
    stock: 40,
    rarity: 'RARE',
    variants: [
      {
        id: 'DP-014-BLK',
        name: 'VOID BLACK',
        colorHex: '#1a1a1a',
        stock: 15,
        image: 'https://lh3.googleusercontent.com/d/1mlxU4qxvL_UBRBU2EypuAlISL9lcmq71',
        images: ['https://lh3.googleusercontent.com/d/1mlxU4qxvL_UBRBU2EypuAlISL9lcmq71']
      },
      {
        id: 'DP-014-GRY',
        name: 'ASH GREY',
        colorHex: '#808080',
        stock: 10,
        image: 'https://lh3.googleusercontent.com/d/15uMt6p0klidgRjDTBnJyqR3ogeUfxUXQ',
        images: ['https://lh3.googleusercontent.com/d/15uMt6p0klidgRjDTBnJyqR3ogeUfxUXQ']
      },
      {
         id: 'DP-014-NVY',
         name: 'MIDNIGHT',
         colorHex: '#1a237e',
         stock: 8,
         image: 'https://lh3.googleusercontent.com/d/1olcvNuxInbYD4qGTVlXpRk0IQZWY-vj9',
         images: ['https://lh3.googleusercontent.com/d/1olcvNuxInbYD4qGTVlXpRk0IQZWY-vj9']
      },
      {
         id: 'DP-014-RED',
         name: 'FLARE',
         colorHex: '#b71c1c',
         stock: 7,
         image: 'https://lh3.googleusercontent.com/d/1Mm9VDH2vHN5lyCyda3scpd67Sy0UtC4u',
         images: ['https://lh3.googleusercontent.com/d/1Mm9VDH2vHN5lyCyda3scpd67Sy0UtC4u']
      }
    ],
    isArchived: true
  },
  {
    id: 'DP-015',
    name: 'SECTOR CORE SWEATPANTS',
    price: 180,
    category: 'SWEATS',
    description: 'Heavyweight loopback french terry sweatpants. Features relaxed tapered fit, elasticated cuffs, and tonal embroidery. Essential armor for the modern operator.',
    details: ['450gsm Heavyweight Cotton', 'Deep Welt Pockets', 'Elasticated Cuffs', 'Relaxed Tapered Fit'],
    image: 'https://lh3.googleusercontent.com/d/1f3SZPJ1-RnjmRyoa5X-rmLagh7wKXVC5',
    images: [
      'https://lh3.googleusercontent.com/d/1f3SZPJ1-RnjmRyoa5X-rmLagh7wKXVC5',
      'https://lh3.googleusercontent.com/d/1zDV8fpFTLXEUMbpDxorRKpmeMyf266qh',
      'https://lh3.googleusercontent.com/d/17UC1IPt1i6THywjq87f-T_vgQNxF42R5',
      'https://lh3.googleusercontent.com/d/1yzEsixI-9b2AjAgEprUTBzkMIuC_tMt8'
    ],
    stock: 45,
    rarity: 'COMMON',
    variants: [
      {
        id: 'DP-015-BLK',
        name: 'VOID BLACK',
        colorHex: '#1a1a1a',
        stock: 15,
        image: 'https://lh3.googleusercontent.com/d/1f3SZPJ1-RnjmRyoa5X-rmLagh7wKXVC5',
        images: ['https://lh3.googleusercontent.com/d/1f3SZPJ1-RnjmRyoa5X-rmLagh7wKXVC5']
      },
      {
        id: 'DP-015-GRY',
        name: 'ASH GREY',
        colorHex: '#808080',
        stock: 12,
        image: 'https://lh3.googleusercontent.com/d/1zDV8fpFTLXEUMbpDxorRKpmeMyf266qh',
        images: ['https://lh3.googleusercontent.com/d/1zDV8fpFTLXEUMbpDxorRKpmeMyf266qh']
      },
      {
         id: 'DP-015-NVY',
         name: 'MIDNIGHT',
         colorHex: '#1a237e',
         stock: 10,
         image: 'https://lh3.googleusercontent.com/d/17UC1IPt1i6THywjq87f-T_vgQNxF42R5',
         images: ['https://lh3.googleusercontent.com/d/17UC1IPt1i6THywjq87f-T_vgQNxF42R5']
      },
      {
         id: 'DP-015-RED',
         name: 'FLARE',
         colorHex: '#b71c1c',
         stock: 8,
         image: 'https://lh3.googleusercontent.com/d/1yzEsixI-9b2AjAgEprUTBzkMIuC_tMt8',
         images: ['https://lh3.googleusercontent.com/d/1yzEsixI-9b2AjAgEprUTBzkMIuC_tMt8']
      }
    ],
    isArchived: true
  },
  {
    id: 'DP-007',
    name: 'OPERATOR 5-PANEL CAP',
    price: 55,
    category: 'HATS',
    description: 'Structured low-profile cap in water-resistant ripstop. Features "SYSTEM_SECURE" embroidery and rapid-adjust shock cord.',
    details: ['Ripstop Nylon', 'Shock Cord Adjustment', 'Reflective Brim Edge', 'Internal Taping'],
    image: 'https://placehold.co/900x1200/000000/FFFFFF?text=OPERATOR+CAP+VIEW+1',
    images: [
       'https://placehold.co/900x1200/000000/FFFFFF?text=OPERATOR+CAP+VIEW+1',
       'https://placehold.co/900x1200/000000/FFFFFF?text=OPERATOR+CAP+SIDE',
       'https://placehold.co/900x1200/000000/FFFFFF?text=OPERATOR+CAP+BACK'
    ],
    stock: 100,
    rarity: 'COMMON',
    isArchived: true
  },
  {
    id: 'DP-008',
    name: 'GSM SIGNAL BEANIE',
    price: 48,
    category: 'HATS',
    description: 'Dense knit beanie featuring rubberized GSM logo patch. Optimized for thermal retention in cold sectors.',
    details: ['Acrylic/Wool Blend', 'Rubber Patch', 'Cuffed Design', 'One Size'],
    image: 'https://lh3.googleusercontent.com/d/1urXajHcVkiRcWaZbg6EreHMQbjQCpyHH',
    images: [
      'https://lh3.googleusercontent.com/d/1urXajHcVkiRcWaZbg6EreHMQbjQCpyHH',
      'https://placehold.co/900x1200/222/FFF?text=KNIT+DETAIL',
      'https://placehold.co/900x1200/222/FFF?text=PATCH+MACRO'
    ],
    stock: 60,
    rarity: 'COMMON',
    isArchived: true
  },
  {
    id: 'DP-009',
    name: 'VISUAL AURA CAP // VOID',
    price: 58,
    category: 'HATS',
    description: 'Six-panel dad hat in washed black. Embroidered with the "Visual Aura" sigil in tonal thread.',
    details: ['Washed Cotton Twill', 'Unstructured Crown', 'Antique Brass Buckle', 'Tonal Embroidery'],
    image: 'https://lh3.googleusercontent.com/d/1ZAdYsyKrAPrnEPY5l4m99bdlfKw4vozN',
    images: [
      'https://lh3.googleusercontent.com/d/1ZAdYsyKrAPrnEPY5l4m99bdlfKw4vozN',
      'https://placehold.co/900x1200/111/FFF?text=EMBROIDERY+DETAIL',
      'https://placehold.co/900x1200/111/FFF?text=REAR+STRAP'
    ],
    stock: 35,
    rarity: 'RARE',
    isArchived: true
  },
  {
    id: 'DP-010',
    name: 'VISUAL AURA CAP // AZURE',
    price: 58,
    category: 'HATS',
    description: 'Vibrant azure variation of the Visual Aura cap. High-saturation dye for maximum visual impact.',
    details: ['Cotton Twill', 'Contrast Embroidery', 'Adjustable Slider', 'Curved Brim'],
    image: 'https://lh3.googleusercontent.com/d/1xtuadyeLVF8OWnpSIWOSFtUfg0ssvwyW',
    images: [
      'https://lh3.googleusercontent.com/d/1xtuadyeLVF8OWnpSIWOSFtUfg0ssvwyW',
      'https://placehold.co/900x1200/0044aa/FFF?text=SIDE+PROFILE',
      'https://placehold.co/900x1200/0044aa/FFF?text=TOP+DOWN'
    ],
    stock: 28,
    rarity: 'COMMON',
    isArchived: true
  },
  {
    id: 'DP-011',
    name: 'GEO-MESH BUCKET',
    price: 65,
    category: 'HATS',
    description: 'Hybrid bucket hat with mesh ventilation panels and geometric brim stitching. Field-tested for tropical climates.',
    details: ['Nylon/Mesh Hybrid', 'Geometric Stitching', 'Shock Cord Toggle', 'Packable'],
    image: 'https://lh3.googleusercontent.com/d/1OAAM36VJhrtBXkdpvwPTFyv5FenbrGFW',
    images: [
      'https://lh3.googleusercontent.com/d/1OAAM36VJhrtBXkdpvwPTFyv5FenbrGFW',
      'https://placehold.co/900x1200/333/FFF?text=MESH+DETAIL',
      'https://placehold.co/900x1200/333/FFF?text=INTERIOR+TAG'
    ],
    stock: 15,
    rarity: 'LEGENDARY',
    isArchived: true
  }
];
export const SYSTEM_PROMPT = "";                                  
