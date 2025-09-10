export interface ProfileSection {
  title: string;
  content: string;
  image?: string;
  stats?: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

export interface ProfileCardData {
  id: string;
  title: string;
  subtitle: string;
  frontImage: string;
  icon: string;
  color: string;
  gradient: string;
  sections: ProfileSection[];
  highlights: string[];
}

// Explicit type export for better compatibility
export type { ProfileCardData as ProfileCard };

export const farmProfileData: ProfileCardData[] = [
  {
    id: 'charcoal',
    title: 'Sustainable Charcoal Excellence',
    subtitle: 'Premium charcoal production & processing',
    frontImage: 'https://cdn.shopify.com/s/files/1/1569/9031/files/BM_charcoal_medley_1000.jpg?v=1623433896',
    icon: 'solar:fire-bold-duotone',
    color: 'sunset-orange',
    gradient: 'from-sunset-orange to-earth-brown',
    highlights: [
      '5 distinct product lines',
      '21-day quality storage',
      'Export compliance certified',
      'Zero chemical additives'
    ],
    sections: [
      {
        title: 'Production Excellence',
        content: 'Our charcoal is produced exclusively from natural hardwoods with no chemical additives, ensuring clean burning and superior quality. Invader bush is harvested, carefully loaded into kilns, and carbonised over a three-day period by our skilled workforce.',
        image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        stats: [
          { label: 'Production Time', value: '3 Days', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Quality Storage', value: '21 Days', icon: 'solar:box-bold-duotone' },
          { label: 'Product Lines', value: '5 Types', icon: 'solar:multiple-forward-right-bold-duotone' }
        ]
      },
      {
        title: 'Premium Product Portfolio',
        content: 'Farm Aris offers a comprehensive range of high-quality products: Aris Barbeque Charcoal for households (5kg & 25kg bags, sifted 25–39mm), restaurant grade (10kg & 25kg bags, sifted 40–180mm), Aris Charcoal Briquettes (4kg & 25kg bags), Aris Mushara Charcoal using traditional earth method (20kg bags), and Aris Firewood (10kg & 20kg bags).',
        image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Traditional Mushara Method',
        content: 'Our Namibian Mushara Charcoal is globally recognized for its premium quality and eco-friendly production. Using the traditional earth method, this charcoal is produced in a way that conserves the environment and ensures no forests are depleted. It delivers an authentic grilling experience with long-lasting burn, consistent heat, and natural flavour.',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Innovative Briquette Technology',
        content: 'Farm Aris produces high-efficiency charcoal briquettes using fine coal powder combined with organic binding materials such as tree bark, bamboo shavings, and agricultural residues. This process transforms waste into a renewable fuel source with superior burning qualities, featuring slow even burning, high heat output with 2–10% ash content, smokeless performance, and easy storage.',
        image: 'https://images.unsplash.com/photo-1494358331928-ec2c3de61d2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Premium Namibian Firewood',
        content: 'Our firewood products are sourced exclusively from fallen Namibian hardwood trees, in strict compliance with national forestry legislation. The dry Namibian climate gives hardwoods such as Sekeldooring and Kameeldoring exceptional density, low moisture content, and superior burning qualities. Cut into convenient 300–400mm logs and packaged in 10kg and 20kg bags.',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      }
    ]
  },
  {
    id: 'agriculture',
    title: 'Agricultural Heritage & Innovation',
    subtitle: '100+ hectares of sustainable farming excellence',
    frontImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    icon: 'solar:leaf-bold-duotone',
    color: 'acacia-green',
    gradient: 'from-acacia-green to-safari-khaki',
    highlights: [
      '100+ hectares cultivated',
      '8 major crop varieties',
      'Drip & pivot irrigation',
      'Training hub for students'
    ],
    sections: [
      {
        title: 'Diverse Crop Production',
        content: 'Farm Aris cultivates a diverse range of horticultural and staple crops across more than 100 hectares, including maize, beans, watermelons, tomatoes, butternuts, onions, green peppers, and cabbages. We follow sustainable, market-driven cropping programs that emphasize soil fertility and efficient water management.',
        image: 'https://images.unsplash.com/photo-1561814471-00e25c3b608e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        stats: [
          { label: 'Total Area', value: '100+ Ha', icon: 'solar:map-bold-duotone' },
          { label: 'Crop Types', value: '8 Major', icon: 'solar:plants-bold-duotone' },
          { label: 'Irrigation', value: '2 Systems', icon: 'solar:water-sun-bold-duotone' }
        ]
      },
      {
        title: 'Sustainable Water Management',
        content: 'Our advanced irrigation systems include both drip and pivot irrigation methods, ensuring efficient water usage while maximizing crop yield. This sustainable approach to water management allows us to maintain consistent production while minimizing environmental impact and operating costs.',
        image: 'https://images.unsplash.com/photo-1574266398667-d0b3b33c0e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Agricultural Training Hub',
        content: 'The farm serves as a comprehensive training hub for agricultural students and interns, providing hands-on exposure to every stage of production — from seed selection and nursery management to harvesting, packaging, and marketing. This educational component ensures knowledge transfer and skill development in the agricultural sector.',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Integrated Livestock Systems',
        content: 'Farm Aris integrates livestock farming with a focus on cattle, goats, and sheep. Our husbandry systems prioritize animal welfare, breeding excellence, veterinary supervision, and balanced feeding practices. We operate under a sustainable model where livestock production complements crop farming, with manure being recycled to enrich soils.',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Quality Control & Processing',
        content: 'Our commitment to excellence extends through strict post-harvest quality control measures. Every product undergoes careful inspection, proper packaging, and quality assurance testing to ensure our customers receive the finest agricultural products that meet both local and international standards.',
        image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      }
    ]
  },
  {
    id: 'wildlife',
    title: 'Wildlife Conservation & Eco-Tourism',
    subtitle: '5,000 hectares of pristine Namibian wilderness',
    frontImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    icon: 'solar:paw-bold-duotone',
    color: 'acacia-green',
    gradient: 'from-acacia-green to-namibian-blue',
    highlights: [
      '5,000 total hectares',
      '2,000 hectares game-fenced',
      'Multiple wildlife species',
      'Eco-tourism development'
    ],
    sections: [
      {
        title: 'Expansive Wildlife Sanctuary',
        content: 'Farm Aris spans approximately 5,000 hectares, of which 2,000 hectares are enclosed with game-proof fencing. This vast wilderness area provides a safe haven for various wildlife species while maintaining the natural ecosystem balance essential for biodiversity conservation.',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        stats: [
          { label: 'Total Land', value: '5,000 Ha', icon: 'solar:map-bold-duotone' },
          { label: 'Game Area', value: '2,000 Ha', icon: 'solar:home-wifi-bold-duotone' },
          { label: 'Wildlife Species', value: '8+ Types', icon: 'solar:paw-bold-duotone' }
        ]
      },
      {
        title: 'Indigenous Wildlife Portfolio',
        content: 'The farm is currently home to kudus, elands, antelopes, and ostriches, with ambitious future plans to introduce additional wildlife such as giraffes, oryx, springboks, and impalas. This carefully planned expansion will enhance both conservation efforts and visitor experiences.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Biodiversity Conservation Mission',
        content: 'Our game farming strategy focuses on protecting indigenous wildlife and maintaining healthy ecosystems. Through careful habitat management, breeding programs, and conservation practices, we ensure the long-term sustainability of Namibias unique wildlife heritage.',
        image: 'https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Eco-Tourism Excellence',
        content: 'Farm Aris offers exceptional eco-tourism experiences including guided safaris, professional birdwatching excursions, and immersive cultural experiences. Our knowledgeable guides provide educational insights into local wildlife behavior, conservation efforts, and traditional Namibian culture.',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Sustainable Tourism Impact',
        content: 'Our eco-tourism initiatives generate sustainable income while funding conservation efforts and supporting local communities. Visitors contribute directly to wildlife protection, habitat preservation, and community development projects, creating a positive cycle of environmental and social impact.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      }
    ]
  },
  {
    id: 'hospitality',
    title: 'Premium Hospitality & Community',
    subtitle: 'Authentic safari camping & community partnership',
    frontImage: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'earth-brown',
    gradient: 'from-earth-brown to-savanna-gold',
    highlights: [
      '10 spacious safari tents',
      'Modern ablution facilities',
      'Community training programs',
      'Authentic outdoor experiences'
    ],
    sections: [
      {
        title: 'Premium Safari Accommodation',
        content: 'Farm Aris offers unique on-site camping facilities featuring 10 spacious safari tents (6m x 2.9m x 2.5m), each furnished with comfortable double beds. These professionally designed accommodations provide guests with an authentic outdoor experience while maintaining comfort and safety standards.',
        image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        stats: [
          { label: 'Safari Tents', value: '10 Units', icon: 'solar:tent-bold-duotone' },
          { label: 'Tent Size', value: '6m x 2.9m', icon: 'solar:ruler-bold-duotone' },
          { label: 'Capacity', value: '20 Guests', icon: 'solar:users-group-rounded-bold-duotone' }
        ]
      },
      {
        title: 'Modern Amenities & Facilities',
        content: 'Our eco-friendly campsite includes modern ablution blocks with hot showers, well-equipped outdoor cooking areas, and traditional braai facilities. Visitors with their own tents, caravans, or campervans are welcome to utilize our comprehensive camping grounds and facilities.',
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Community Training & Development',
        content: 'Farm Aris serves as a vital training hub for the local community, offering practical agricultural education, sustainable farming workshops, and skills development programs. Our commitment to community development creates lasting positive impact throughout the region.',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Authentic Experience Integration',
        content: 'Our unique location allows guests to experience the perfect combination of nature, farm life, and wildlife encounters in one setting. This integrated approach provides visitors with comprehensive insights into Namibian agricultural practices, conservation efforts, and cultural heritage.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      },
      {
        title: 'Sustainable Hospitality Practices',
        content: 'Our hospitality operations follow strict environmental guidelines, utilizing solar power, water conservation systems, and waste management practices. This sustainable approach ensures minimal environmental impact while providing exceptional guest experiences and supporting long-term conservation goals.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
      }
    ]
  }
];