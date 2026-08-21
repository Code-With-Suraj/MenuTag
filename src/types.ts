export type DietType = 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain' | 'Egg' | 'Gluten Free' | 'Unknown';

export type SpiceLevel = 'None' | 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';

export interface MenuItem {
  id: string;
  menuName: string;
  category?: string;
  price?: string | number;
  calories?: string | number;
  protein?: string;
  fat?: string;
  carbs?: string;
  prepTime?: string;
  portionSize?: string;
  allergen?: string; // Comma separated, e.g. "Dairy, Gluten, Nuts"
  dietaryType?: DietType;
  spiceLevel?: SpiceLevel;
  chefRecommendation?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  seasonal?: boolean;
  glutenFree?: boolean;
  vegan?: boolean;
  jain?: boolean;
  egg?: boolean;
  containsNuts?: boolean;
  containsDairy?: boolean;
  qrUrl?: string;
  description?: string;
  customNote?: string;
  rawRow?: Record<string, any>;
}

export type TemplateCategory =
  | 'all'
  | 'premium'
  | 'events'
  | 'hospitality'
  | 'food-catering'
  | 'modern-digital';

export type TemplateId =
  // 4 Reference Signature Styles (from image showcase)
  | 'laura-fine-dining'
  | 'bistro-cafe'
  | 'la-patisserie'
  | 'taco-truck'
  // Existing 8 Pro Templates
  | 'luxury-restaurant'
  | 'modern-cafe'
  | 'bakery-artisanal'
  | 'street-food'
  | 'hotel-buffet'
  | 'wedding-buffet'
  | 'corporate-cafeteria'
  | 'kids-menu'
  // 17 New Professional & 3D Templates
  | 'modern-minimal'
  | 'glassmorphism-3d'
  | 'premium-3d-luxury'
  | 'floating-3d-card'
  | 'modern-event-night'
  | 'corporate-premium'
  | 'contemporary-restaurant'
  | 'organic-farm-fresh'
  | 'indian-royal'
  | 'indian-heritage'
  | 'indian-street-food'
  | 'futuristic-tech'
  | 'premium-patisserie'
  | 'rustic-premium'
  | 'scandinavian-clean'
  | 'midnight-gala'
  | 'social-media-card'
  | 'wedding-elegance';

export type TagSize =
  | 'standing-tag'
  | 'vertical-buffet'
  | 'small'
  | 'medium'
  | 'large'
  | 'tent-a6'
  | 'tent-a5'
  | 'custom';

export interface TagDimensions {
  widthInInches: number;
  heightInInches: number;
  label: string;
  aspectRatio: string;
  description: string;
  isTentCard?: boolean;
}

export type BorderStyleType = 'solid' | 'double' | 'dashed' | 'gold-foil' | 'scalloped' | 'none';
export type FontFamilyType = 'serif' | 'sans' | 'display' | 'mono';

export interface BrandConfig {
  businessName: string;
  logoUrl?: string;
  logoEmblem?: string; // e.g. 'utensils' | 'chef-hat' | 'crown' | 'coffee' | 'cake' | 'leaf' | 'sparkles' | 'flame'
  footerText?: string;
  website?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  borderStyle: BorderStyleType;
  cornerRadius: number; // in pixels
  shadow: 'none' | 'sm' | 'md' | 'lg';
  fontFamily: FontFamilyType;
  // Display Toggles
  showLogo: boolean;
  showBusinessName: boolean;
  showQrCode: boolean;
  showNutrition: boolean;
  showAllergens: boolean;
  showSpiceIcon: boolean;
  showDietIcon: boolean;
  showPrice: boolean;
  currencySymbol: string; // e.g. '$', '₹', '€', '£', '¥', 'AED', 'SAR', etc.
  showCategory: boolean;
  showBadges: boolean;
  showCropMarks: boolean;
  showFoldLine: boolean; // For tent cards
  // Custom dimensions for 'custom' size
  customWidthInches?: number;
  customHeightInches?: number;
}

export interface ValidationWarning {
  row: number;
  itemId?: string;
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  menuName?: string;
}

export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  warningCount: number;
  errorCount: number;
  warnings: ValidationWarning[];
  duplicateNames: string[];
  missingNamesCount: number;
}

export type PrintPaperSize = 'A4' | 'LETTER' | 'A3';

export interface PrintSheetConfig {
  paperSize: PrintPaperSize;
  orientation: 'portrait' | 'landscape';
  marginMm: number;
  gridGapMm: number;
  showCropMarks: boolean;
  showFoldGuide: boolean;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  category: 'premium' | 'events' | 'hospitality' | 'food-catering' | 'modern-digital';
  previewBg: string;
  accentColor: string;
  is3D?: boolean;
  defaultBrandConfig: Partial<BrandConfig>;
  suitableFor: string[];
}
