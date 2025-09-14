export interface Drink {
  id: string;
  name: string;
  category: string;
  image: string;
  size: string;
  description: string;
  premium?: boolean;
}

export const drinkCategories = {
  beer: {
    name: 'Premium Beer',
    icon: 'solar:wineglass-bold-duotone',
    description: 'Finest selection of local and international beers'
  },
  wine: {
    name: 'Wine Collection',
    icon: 'solar:wineglass-triangle-bold-duotone', 
    description: 'Curated wines from South African vineyards'
  },
  ciders: {
    name: 'Premium Ciders',
    icon: 'solar:cup-bold-duotone',
    description: 'Refreshing ciders and fruit-based beverages'
  },
  whiskey: {
    name: 'Whiskey & Spirits',
    icon: 'solar:bottle-bold-duotone',
    description: 'Premium spirits and whiskey selection'
  },
  cocktails: {
    name: 'Signature Cocktails',
    icon: 'solar:cup-music-bold-duotone',
    description: 'Handcrafted cocktails and mixed drinks'
  },
  nonAlcoholic: {
    name: 'Non-Alcoholic',
    icon: 'solar:cup-paper-bold-duotone',
    description: 'Refreshing non-alcoholic beverages'
  }
};

export const drinks: Drink[] = [
  // Premium Beers
  {
    id: 'tafel-lager-330',
    name: 'Tafel Lager',
    category: 'beer',
    image: '/images/drinks/Tafel Lager 330ml.png',
    size: '330ml',
    description: 'Namibia\'s finest premium lager',
    premium: true
  },
  {
    id: 'tafel-lager-500',
    name: 'Tafel Lager',
    category: 'beer',
    image: '/images/drinks/Tafel Lager Beer Can 500ml.png',
    size: '500ml',
    description: 'Namibia\'s finest premium lager',
    premium: true
  },
  {
    id: 'tafel-radler',
    name: 'Tafel Radler',
    category: 'beer',
    image: '/images/drinks/Tafel-Radler.jpg',
    size: '330ml',
    description: 'Refreshing lager with citrus twist'
  },
  {
    id: 'windhoek-lager',
    name: 'Windhoek Lager',
    category: 'beer',
    image: '/images/drinks/Windhoek Lager Nrb 440ml.png',
    size: '440ml',
    description: 'Classic Namibian lager',
    premium: true
  },
  {
    id: 'windhoek-premium',
    name: 'Windhoek Premium Draught',
    category: 'beer',
    image: '/images/drinks/Windhoek Premium Draught Beer Can 500ml.png',
    size: '500ml',
    description: 'Premium draught beer experience',
    premium: true
  },
  {
    id: 'castle-lite',
    name: 'Castle Lite',
    category: 'beer',
    image: '/images/drinks/Castle Lite Premium Lager Beer 500ml.png',
    size: '500ml',
    description: 'Premium light lager'
  },
  {
    id: 'carling-black-label',
    name: 'Carling Black Label',
    category: 'beer',
    image: '/images/drinks/Carling Black Label Local Beer 330ml.png',
    size: '330ml',
    description: 'Bold and refreshing local beer'
  },
  {
    id: 'heineken-330',
    name: 'Heineken',
    category: 'beer',
    image: '/images/drinks/Heineken 330 ml.png',
    size: '330ml',
    description: 'World-famous premium lager',
    premium: true
  },
  {
    id: 'heineken-500',
    name: 'Heineken',
    category: 'beer',
    image: '/images/drinks/Heineken Lager Can 500ml.png',
    size: '500ml',
    description: 'World-famous premium lager',
    premium: true
  },
  {
    id: 'corona-extra',
    name: 'Corona Extra',
    category: 'beer',
    image: '/images/drinks/Corona Extra Premium Beer 355ml.png',
    size: '355ml',
    description: 'Mexican premium beer with lime',
    premium: true
  },
  {
    id: 'flying-fish',
    name: 'Flying Fish Lemon',
    category: 'beer',
    image: '/images/drinks/Flying Fish Pressed Lemon Flavour Beer Can 500ml.png',
    size: '500ml',
    description: 'Refreshing lemon-flavored beer'
  },

  // Ciders & Fruit Beverages
  {
    id: 'hunters-dry-330',
    name: 'Hunter\'s Dry',
    category: 'ciders',
    image: '/images/drinks/Hunters Dry 330ml.png',
    size: '330ml',
    description: 'Crisp and refreshing cider'
  },
  {
    id: 'hunters-dry-440',
    name: 'Hunter\'s Dry',
    category: 'ciders',
    image: '/images/drinks/Hunters Dry Can 440ml.png',
    size: '440ml',
    description: 'Crisp and refreshing cider'
  },
  {
    id: 'hunters-gold',
    name: 'Hunter\'s Gold',
    category: 'ciders',
    image: '/images/drinks/Hunters Gold 330m.png',
    size: '330ml',
    description: 'Premium golden cider'
  },
  {
    id: 'hunters-extreme',
    name: 'Hunter\'s Extreme',
    category: 'ciders',
    image: '/images/drinks/Hunter\'S Extreme 275ml.png',
    size: '275ml',
    description: 'Bold and intense cider experience'
  },
  {
    id: 'savanna-dry',
    name: 'Savanna Dry',
    category: 'ciders',
    image: '/images/drinks/Savanna Dry 500ml.png',
    size: '500ml',
    description: 'Africa\'s premium dry cider'
  },
  {
    id: 'savanna-angry-lemon',
    name: 'Savanna Angry Lemon',
    category: 'ciders',
    image: '/images/drinks/Savanna Dry 500ml Angry Lemon.png',
    size: '500ml',
    description: 'Zesty lemon-infused cider'
  },
  {
    id: 'savanna-light',
    name: 'Savanna Light',
    category: 'ciders',
    image: '/images/drinks/Savanna Light 330ml.png',
    size: '330ml',
    description: 'Light and crisp cider'
  },
  {
    id: 'strongbow-gold',
    name: 'Strongbow Gold Apple',
    category: 'ciders',
    image: '/images/drinks/Strongbow Gold Apple 440ml Can.png',
    size: '440ml',
    description: 'Premium golden apple cider',
    premium: true
  },
  {
    id: 'strongbow-berries',
    name: 'Strongbow Red Berries',
    category: 'ciders',
    image: '/images/drinks/Strongbow Red Berries 440ml Can.png',
    size: '440ml',
    description: 'Mixed berry flavored cider',
    premium: true
  },
  {
    id: 'brutal-fruit',
    name: 'Brutal Fruit Ruby Apple',
    category: 'ciders',
    image: '/images/drinks/Brutal Fruit Can 500ml Ruby Apple Spritzer.png',
    size: '500ml',
    description: 'Sparkling apple spritzer'
  },

  // Premium Cocktails & Mixed Drinks
  {
    id: 'bernini-blush',
    name: 'Bernini Blush',
    category: 'cocktails',
    image: '/images/drinks/Bernini Blush 275ml.png',
    size: '275ml',
    description: 'Elegant sparkling wine cocktail',
    premium: true
  },
  {
    id: 'bernini-classic',
    name: 'Bernini Classic',
    category: 'cocktails',
    image: '/images/drinks/Bernini Classic 275ml.png',
    size: '275ml',
    description: 'Classic sparkling wine cocktail',
    premium: true
  },
  {
    id: 'caribbean-twist',
    name: 'Caribbean Twist Peach',
    category: 'cocktails',
    image: '/images/drinks/Caribbean Twist 275ml Peach Paradise.png',
    size: '275ml',
    description: 'Tropical peach paradise cocktail'
  },
  {
    id: 'belgravia-gin',
    name: 'Belgravia Gin & Dry Lemon',
    category: 'whiskey',
    image: '/images/drinks/Belgravia Gin & Dry Lemon 440ml Can.png',
    size: '440ml',
    description: 'Premium gin with dry lemon',
    premium: true
  },

  // Non-Alcoholic Premium Options
  {
    id: 'clausthaler-original',
    name: 'Clausthaler Original',
    category: 'nonAlcoholic',
    image: '/images/drinks/CLAUSTHALER original 500ml.png',
    size: '500ml',
    description: 'Premium non-alcoholic beer'
  },
  {
    id: 'clausthaler-lemon',
    name: 'Clausthaler Lemon',
    category: 'nonAlcoholic',
    image: '/images/drinks/CLAUSTHALER Lemon 500ml.png',
    size: '500ml',
    description: 'Non-alcoholic beer with lemon'
  }
];

// Group drinks by category
export const getDrinksByCategory = (category: string): Drink[] => {
  return drinks.filter(drink => drink.category === category);
};

// Get premium drinks only
export const getPremiumDrinks = (): Drink[] => {
  return drinks.filter(drink => drink.premium);
};