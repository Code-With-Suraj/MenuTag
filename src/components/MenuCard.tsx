import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPrice } from '../utils/format';
import {
  MenuItem,
  TagSize,
  BrandConfig,
  TemplateId,
} from '../types';
import { TAG_SIZES } from '../data/templates';
import {
  Flame,
  Star,
  Sparkles,
  Milk,
  Wheat,
  Nut,
  Egg,
  Leaf,
  Clock,
  Scissors,
  Utensils,
  Crown,
  Coffee,
  ChefHat,
  CakeSlice,
} from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  sizeKey: TagSize;
  brand: BrandConfig;
  templateId: TemplateId;
  cardElementId?: string;
  isPrintPreview?: boolean;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  sizeKey,
  brand,
  templateId,
  cardElementId,
  isPrintPreview = false,
}) => {
  const sizeInfo = TAG_SIZES[sizeKey] || TAG_SIZES.medium;
  const isTentCard = sizeInfo.isTentCard;

  // Calculate pixel dimensions for scale display (based on 96dpi standard printing ratio)
  const dpi = 96;
  const cardWidthPx = Math.round(
    (sizeKey === 'custom' ? brand.customWidthInches || 3.5 : sizeInfo.widthInInches) * dpi
  );
  const cardHeightPx = Math.round(
    (sizeKey === 'custom' ? brand.customHeightInches || 2.5 : sizeInfo.heightInInches) * dpi
  );

  // Font family class mapper
  const getFontFamilyClass = () => {
    switch (brand.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'display':
        return 'font-extrabold tracking-tight';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  // Veg vs Non-Veg vs Egg Symbol
  const renderVegSymbol = () => {
    if (!brand.showDietIcon) return null;

    const type = item.dietaryType;
    let colorClass = 'border-emerald-600 text-emerald-600';
    let dotColor = 'bg-emerald-600';

    if (type === 'Non-Veg') {
      colorClass = 'border-red-600 text-red-600';
      dotColor = 'bg-red-600';
    } else if (type === 'Egg') {
      colorClass = 'border-amber-600 text-amber-600';
      dotColor = 'bg-amber-500';
    } else if (type === 'Vegan' || type === 'Jain') {
      colorClass = 'border-emerald-600 text-emerald-600';
      dotColor = 'bg-emerald-500';
    }

    return (
      <div
        className={`w-4 h-4 border-2 rounded-[2px] flex items-center justify-center flex-shrink-0 bg-white/90 shadow-sm ${colorClass}`}
        title={`Dietary: ${type}`}
      >
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      </div>
    );
  };

  // Spice peppers
  const renderSpiceMeter = () => {
    if (!brand.showSpiceIcon || !item.spiceLevel || item.spiceLevel === 'None') return null;

    const level = item.spiceLevel;
    let peppers = '🌶';
    if (level === 'Medium') peppers = '🌶🌶';
    if (level === 'Hot' || level === 'Extra Hot') peppers = '🌶🌶🌶';

    return (
      <span className="text-xs tracking-tighter filter drop-shadow-sm" title={`Spice: ${level}`}>
        {peppers}
      </span>
    );
  };

  // Allergen Badges
  const renderAllergenIcons = () => {
    if (!brand.showAllergens || !item.allergen) return null;

    const lower = item.allergen.toLowerCase();
    const badges = [];

    if (lower.includes('dairy') || item.containsDairy) {
      badges.push({ name: 'Dairy', icon: <Milk className="w-3 h-3" /> });
    }
    if (lower.includes('gluten') || item.glutenFree === false) {
      badges.push({ name: 'Gluten', icon: <Wheat className="w-3 h-3" /> });
    }
    if (lower.includes('nut') || item.containsNuts) {
      badges.push({ name: 'Nuts', icon: <Nut className="w-3 h-3" /> });
    }
    if (lower.includes('egg') || item.egg) {
      badges.push({ name: 'Egg', icon: <Egg className="w-3 h-3" /> });
    }

    if (badges.length === 0) return null;

    return (
      <div className="flex items-center gap-1 flex-wrap text-[10px]">
        <span className="opacity-60 text-[9px]">Contains:</span>
        {badges.map((b, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-medium flex items-center gap-0.5"
            title={`Allergen: ${b.name}`}
          >
            {b.icon}
            <span>{b.name}</span>
          </span>
        ))}
      </div>
    );
  };

  // Badges (Chef choice, Bestseller)
  const renderHighlightBadges = () => {
    if (!brand.showBadges) return null;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {item.chefRecommendation && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] flex items-center gap-0.5 shadow-sm">
            <Star className="w-2.5 h-2.5 fill-slate-950" />
            <span>CHEF CHOICE</span>
          </span>
        )}

        {item.bestSeller && (
          <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white font-extrabold text-[9px] flex items-center gap-0.5 shadow-sm">
            <Flame className="w-2.5 h-2.5 fill-white" />
            <span>BEST SELLER</span>
          </span>
        )}

        {item.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] flex items-center gap-0.5 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>NEW</span>
          </span>
        )}

        {item.jain && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[9px]">
            JAIN 🪷
          </span>
        )}

        {item.vegan && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px] flex items-center gap-0.5">
            <Leaf className="w-2.5 h-2.5" />
            VEGAN
          </span>
        )}
      </div>
    );
  };

  // Brand Logo / Emblem Renderer
  const renderBrandLogo = () => {
    if (brand.showLogo === false) return null;

    if (brand.logoUrl) {
      return (
        <div className="flex items-center flex-shrink-0">
          <img
            src={brand.logoUrl}
            alt="Brand Logo"
            crossOrigin="anonymous"
            className="h-6 sm:h-7 max-w-[130px] w-auto object-contain flex-shrink-0 filter drop-shadow-xs"
            style={{ maxHeight: '28px' }}
          />
        </div>
      );
    }

    // Built-in emblem icon based on template or choice
    const emblem = brand.logoEmblem || (
      templateId === 'bakery-artisanal' ? 'cake' :
      templateId === 'luxury-restaurant' ? 'crown' :
      templateId === 'modern-cafe' ? 'coffee' :
      templateId === 'street-food' ? 'flame' :
      templateId === 'hotel-buffet' ? 'chef-hat' :
      templateId === 'wedding-buffet' ? 'crown' :
      templateId === 'corporate-cafeteria' ? 'leaf' :
      templateId === 'kids-menu' ? 'sparkles' :
      'utensils'
    );

    return (
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 shadow-xs border"
        style={{
          backgroundColor: `${brand.primaryColor}22`,
          color: brand.primaryColor,
          borderColor: `${brand.primaryColor}55`,
        }}
        title="Brand Logo"
      >
        {emblem === 'chef-hat' && <ChefHat className="w-3.5 h-3.5" />}
        {emblem === 'crown' && <Crown className="w-3.5 h-3.5" />}
        {emblem === 'coffee' && <Coffee className="w-3.5 h-3.5" />}
        {emblem === 'cake' && <CakeSlice className="w-3.5 h-3.5" />}
        {emblem === 'leaf' && <Leaf className="w-3.5 h-3.5" />}
        {emblem === 'sparkles' && <Sparkles className="w-3.5 h-3.5" />}
        {emblem === 'flame' && <Flame className="w-3.5 h-3.5" />}
        {(!emblem || emblem === 'utensils') && <Utensils className="w-3.5 h-3.5" />}
      </div>
    );
  };

  // Border Style CSS Mapper
  const getBorderClasses = () => {
    switch (brand.borderStyle) {
      case 'double':
        return 'border-4 border-double';
      case 'gold-foil':
        return 'border-2 border-amber-500/80 shadow-[0_0_10px_rgba(217,119,6,0.3)] ring-1 ring-amber-400/50';
      case 'scalloped':
        return 'border-2 border-dashed';
      case 'dashed':
        return 'border-2 border-dashed';
      case 'none':
        return 'border-0';
      case 'solid':
      default:
        return 'border-2 border-solid';
    }
  };

  // Single Tag Front Surface Content
  const renderCardSurface = (isInvertedBack: boolean = false) => {
    return (
      <div
        className={`w-full h-full p-3.5 flex flex-col justify-between relative overflow-hidden transition-all ${getFontFamilyClass()} ${
          isInvertedBack ? 'rotate-180' : ''
        }`}
        style={{
          backgroundColor: brand.backgroundColor,
          color: brand.textColor,
          borderRadius: `${brand.cornerRadius}px`,
          borderColor: brand.borderColor,
        }}
      >
        {/* Template Special Accents */}
        {templateId === 'wedding-buffet' && (
          <div className="absolute top-1 left-1 right-1 bottom-1 border border-amber-400/30 pointer-events-none rounded" />
        )}

        {/* Top Header Row: Business Name / Logo & Category */}
        <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: `${brand.borderColor}40` }}>
          <div className="flex items-center gap-2 min-w-0">
            {renderBrandLogo()}
            {brand.showBusinessName !== false && (
              <span
                className="font-bold text-[11px] uppercase tracking-wider truncate"
                style={{ color: brand.primaryColor }}
              >
                {brand.businessName || 'MENU TAG STUDIO'}
              </span>
            )}
          </div>

          {brand.showCategory !== false && item.category && (
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ backgroundColor: `${brand.accentColor}20`, color: brand.accentColor }}
            >
              {item.category}
            </span>
          )}
        </div>

        {/* Middle Main Row: Dish Name, Symbols, Description */}
        <div className="my-auto py-1 space-y-1.5">
          {/* Dish Name & Veg Symbol */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {renderVegSymbol()}
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {item.menuName}
              </h3>
            </div>
            {renderSpiceMeter()}
          </div>

          {/* Badges Row */}
          {renderHighlightBadges()}

          {/* Description */}
          {item.description && (
            <p className="text-[11px] opacity-85 leading-snug line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Prep Time / Portion Note */}
          {(item.prepTime || item.portionSize || item.customNote) && (
            <div className="flex items-center gap-2 text-[10px] opacity-75">
              {item.prepTime && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {item.prepTime}
                </span>
              )}
              {item.portionSize && <span>• {item.portionSize}</span>}
              {item.customNote && <span className="font-semibold text-amber-500">• {item.customNote}</span>}
            </div>
          )}

          {/* Allergens */}
          {renderAllergenIcons()}
        </div>

        {/* Bottom Footer Row: Price, Calories, QR Code */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t" style={{ borderColor: `${brand.borderColor}40` }}>
          {/* Left: Nutrition & Footer slogan */}
          <div className="space-y-0.5 min-w-0">
            {brand.showNutrition && (item.calories || item.protein) && (
              <div className="text-[10px] font-mono opacity-80 flex items-center gap-1.5">
                {item.calories && (
                  <span className="font-bold">{item.calories} kcal</span>
                )}
                {item.protein && <span>P: {item.protein}</span>}
                {item.carbs && <span>C: {item.carbs}</span>}
                {item.fat && <span>F: {item.fat}</span>}
              </div>
            )}

            {brand.footerText && (
              <p className="text-[9px] opacity-60 truncate">
                {brand.footerText}
              </p>
            )}
          </div>

          {/* Right: Price & QR Code */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {brand.showQrCode && (item.qrUrl || brand.website) && (
              <div className="p-1 bg-white rounded shadow-sm border border-slate-200">
                <QRCodeSVG
                  value={item.qrUrl || brand.website || 'https://menu.studio'}
                  size={32}
                  level="L"
                />
              </div>
            )}

            {brand.showPrice && item.price !== undefined && item.price !== '' && (
              <div
                className="font-black text-sm sm:text-base leading-none px-2 py-1 rounded"
                style={{ backgroundColor: `${brand.primaryColor}15`, color: brand.primaryColor }}
              >
                {formatPrice(item.price, brand.currencySymbol)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id={cardElementId || `card-${item.id}`}
      className={`relative group bg-white p-1 rounded-xl transition-all shadow-md hover:shadow-xl ${getBorderClasses()}`}
      style={{
        width: `${cardWidthPx}px`,
        height: isTentCard ? `${cardHeightPx * 2}px` : `${cardHeightPx}px`,
        borderColor: brand.borderColor,
      }}
    >
      {/* Scissors Crop Marks at Corners if enabled */}
      {brand.showCropMarks && (
        <>
          <div className="absolute -top-2 -left-2 text-slate-400 pointer-events-none text-[8px] flex items-center gap-0.5">
            <Scissors className="w-3 h-3 text-slate-400 rotate-90" />
          </div>
          <div className="absolute -top-2 -right-2 text-slate-400 pointer-events-none text-[8px]">
            +
          </div>
          <div className="absolute -bottom-2 -left-2 text-slate-400 pointer-events-none text-[8px]">
            +
          </div>
          <div className="absolute -bottom-2 -right-2 text-slate-400 pointer-events-none text-[8px]">
            +
          </div>
        </>
      )}

      {/* Render Main Front Card */}
      <div className="w-full h-full flex flex-col">
        {isTentCard ? (
          <>
            {/* Top Half: Inverted Back View for folded tent card */}
            <div className="w-full h-1/2 border-b-2 border-dashed border-amber-500/40 relative">
              {renderCardSurface(true)}
              <div className="absolute bottom-0 left-0 right-0 bg-amber-500/10 text-amber-600 text-[8px] text-center uppercase tracking-widest font-mono">
                FOLD HERE ✂️ TABLE TENT CREASE LINE
              </div>
            </div>

            {/* Bottom Half: Front Upright View */}
            <div className="w-full h-1/2">
              {renderCardSurface(false)}
            </div>
          </>
        ) : (
          renderCardSurface(false)
        )}
      </div>
    </div>
  );
};
