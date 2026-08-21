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
  Heart,
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
}) => {
  const sizeInfo = TAG_SIZES[sizeKey] || TAG_SIZES.medium;
  const isTentCard = Boolean(sizeInfo.isTentCard);

  // Calculate face dimensions in inches
  const faceWidthInches = sizeKey === 'custom' ? brand.customWidthInches || 3.5 : sizeInfo.widthInInches;
  const faceHeightInches = isTentCard
    ? (sizeKey === 'custom' ? (brand.customHeightInches || 5.0) / 2 : sizeInfo.heightInInches / 2)
    : (sizeKey === 'custom' ? brand.customHeightInches || 2.5 : sizeInfo.heightInInches);

  // 96 DPI pixel calculations
  const dpi = 96;
  const cardWidthPx = Math.round(faceWidthInches * dpi);
  const faceHeightPx = Math.round(faceHeightInches * dpi);
  const totalCardHeightPx = isTentCard ? faceHeightPx * 2 : faceHeightPx;

  // Aspect ratio & physical geometry analysis
  const cardArea = faceWidthInches * faceHeightInches; // Standard 3.5" x 2.5" = 8.75 sq.in
  const isVertical = faceHeightInches > faceWidthInches * 1.1; // e.g. 2.25x4.25, 2.75x5.0
  const isVeryTall = faceHeightInches >= 3.6;
  const isHorizontal = faceWidthInches > faceHeightInches * 1.1;

  // Fluid mathematical scale factor calculated relative to standard base (3.5" x 2.5")
  // Automatically scales smoothly with card area & geometry from small cards (0.7x) to tall/large cards (1.5x - 2.5x)
  const baseScale = Math.sqrt(cardArea / 8.75);
  const verticalBonus = isVertical ? Math.min(1.4, Math.sqrt(faceHeightInches / 2.5)) : 1.0;
  const scale = Math.max(0.68, Math.min(2.5, baseScale * verticalBonus));

  // Title & description length awareness for non-clipping text
  const titleLength = (item.menuName || '').length;
  const titleScaleMod = titleLength > 32 ? 0.78 : titleLength > 22 ? 0.86 : titleLength > 15 ? 0.93 : 1.0;
  const fontTitle = Math.max(10, Math.min(28, Math.round(14.5 * scale * titleScaleMod)));

  const descLength = (item.description || '').length;
  const descScaleMod = descLength > 85 ? 0.86 : descLength > 55 ? 0.92 : 1.0;
  const fontBody = Math.max(8, Math.min(15, Math.round(9.8 * scale * descScaleMod)));

  const fontSmall = Math.max(6.8, Math.min(13, Math.round(8.2 * scale)));
  const fontPrice = Math.max(10.5, Math.min(32, Math.round(14.5 * scale)));
  const fontBadge = Math.max(7, Math.min(13, Math.round(8.2 * scale)));
  const paddingCard = Math.max(6, Math.min(26, Math.round(12 * scale)));
  const qrDimension = Math.max(20, Math.min(68, Math.round(28 * scale)));
  const iconBaseSize = Math.max(8.5, Math.min(20, Math.round(11 * scale)));
  const vegBoxSize = Math.max(10.5, Math.min(22, Math.round(13.5 * scale)));
  const vegDotSize = Math.max(5, Math.min(11, Math.round(6.8 * scale)));

  // Dedicated Showcase Scaling for the 4 Photo Reference Templates (high-visibility print & display)
  const isShowcase =
    templateId === 'laura-fine-dining' ||
    templateId === 'bistro-cafe' ||
    templateId === 'la-patisserie' ||
    templateId === 'taco-truck';

  // Compute adaptive showcase scale factor that auto-adjusts to ANY tag size
  const scScale = isShowcase
    ? Math.max(0.78, Math.min(2.7, baseScale * (isVertical ? 1.35 : 1.18)))
    : scale;

  const scBrandTitle = Math.max(12, Math.min(28, Math.round(14 * scScale)));
  const scSub = Math.max(8, Math.min(15, Math.round(8.5 * scScale)));
  const scDishTitle = Math.max(13, Math.min(34, Math.round(17 * scScale * titleScaleMod)));
  const scBody = Math.max(9, Math.min(17, Math.round(11 * scScale * descScaleMod)));
  const scMeta = Math.max(8.5, Math.min(16, Math.round(9.5 * scScale)));
  const scPrice = Math.max(16, Math.min(48, Math.round(24 * scScale)));
  const scBadge = Math.max(8, Math.min(14, Math.round(9 * scScale)));
  const scCoinSize = Math.max(18, Math.min(38, Math.round(22 * scScale)));
  const scCoinIcon = Math.max(9, Math.min(18, Math.round(11 * scScale)));
  const scCrownSize = Math.max(14, Math.min(36, Math.round(18 * scScale)));
  const scCornerSize = Math.max(16, Math.min(42, Math.round(24 * scScale)));
  const scPadding = Math.max(8, Math.min(28, Math.round(14 * scScale)));
  const scQrDim = Math.max(28, Math.min(78, Math.round(44 * scScale)));

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

  // Dynamic Veg / Non-Veg / Vegan / Jain / Egg Symbol
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
    } else if (type === 'Vegan') {
      colorClass = 'border-emerald-600 text-emerald-600';
      dotColor = 'bg-emerald-500';
    } else if (type === 'Jain') {
      colorClass = 'border-emerald-700 text-emerald-700';
      dotColor = 'bg-emerald-600';
    }

    // Special Indian Royal / Heritage Gold Accent Badge
    if (templateId === 'indian-royal' || templateId === 'indian-heritage') {
      return (
        <div
          className="flex items-center gap-1 rounded border bg-amber-50/95 shadow-xs flex-shrink-0"
          style={{
            padding: `${Math.max(1, Math.round(1.5 * scale))}px ${Math.max(3, Math.round(5 * scale))}px`,
            fontSize: `${fontBadge}px`,
            borderColor: type === 'Non-Veg' ? '#b91c1c' : '#047857',
            color: type === 'Non-Veg' ? '#991b1b' : '#065f46',
          }}
          title={`Dietary: ${type}`}
        >
          <div
            className="rounded-[2px] flex items-center justify-center bg-white border-2 flex-shrink-0"
            style={{
              width: `${vegBoxSize}px`,
              height: `${vegBoxSize}px`,
              borderColor: type === 'Non-Veg' ? '#dc2626' : '#16a34a',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${vegDotSize}px`,
                height: `${vegDotSize}px`,
                backgroundColor: type === 'Non-Veg' ? '#dc2626' : '#16a34a',
              }}
            />
          </div>
          <span className="font-black uppercase tracking-wider font-mono leading-none">
            {type === 'Jain' ? 'JAIN' : type === 'Non-Veg' ? 'NON-VEG' : 'PURE VEG'}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`border-2 rounded-[2px] flex items-center justify-center flex-shrink-0 bg-white/95 shadow-xs ${colorClass}`}
        style={{
          width: `${vegBoxSize}px`,
          height: `${vegBoxSize}px`,
        }}
        title={`Dietary: ${type || 'Veg'}`}
      >
        <div
          className={`rounded-full ${dotColor}`}
          style={{
            width: `${vegDotSize}px`,
            height: `${vegDotSize}px`,
          }}
        />
      </div>
    );
  };

  // Spice meter
  const renderSpiceMeter = () => {
    if (!brand.showSpiceIcon || !item.spiceLevel || item.spiceLevel === 'None') return null;

    const level = item.spiceLevel;
    let peppers = '🌶';
    if (level === 'Medium') peppers = '🌶🌶';
    if (level === 'Hot' || level === 'Extra Hot') peppers = '🌶🌶🌶';

    return (
      <span
        className="tracking-tighter filter drop-shadow-xs flex-shrink-0 select-none"
        style={{ fontSize: `${fontTitle * 0.85}px` }}
        title={`Spice: ${level}`}
      >
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
      badges.push({ name: 'Dairy', icon: <Milk style={{ width: `${iconBaseSize}px`, height: `${iconBaseSize}px` }} /> });
    }
    if (lower.includes('gluten') || item.glutenFree === false) {
      badges.push({ name: 'Gluten', icon: <Wheat style={{ width: `${iconBaseSize}px`, height: `${iconBaseSize}px` }} /> });
    }
    if (lower.includes('nut') || item.containsNuts) {
      badges.push({ name: 'Nuts', icon: <Nut style={{ width: `${iconBaseSize}px`, height: `${iconBaseSize}px` }} /> });
    }
    if (lower.includes('egg') || item.egg) {
      badges.push({ name: 'Egg', icon: <Egg style={{ width: `${iconBaseSize}px`, height: `${iconBaseSize}px` }} /> });
    }

    if (badges.length === 0) return null;

    return (
      <div
        className="flex items-center gap-1 flex-wrap leading-none pt-0.5"
        style={{ fontSize: `${fontSmall}px` }}
      >
        <span className="opacity-60 uppercase font-semibold">Contains:</span>
        {badges.map((b, idx) => (
          <span
            key={idx}
            className="rounded bg-black/10 dark:bg-white/10 font-medium flex items-center gap-0.5"
            style={{
              padding: `${Math.max(1, Math.round(1.5 * scale))}px ${Math.max(3, Math.round(4 * scale))}px`,
            }}
            title={`Allergen: ${b.name}`}
          >
            {b.icon}
            <span>{b.name}</span>
          </span>
        ))}
      </div>
    );
  };

  // Highlight Badges (Chef choice, Bestseller, New, Jain, Vegan)
  const renderHighlightBadges = () => {
    if (!brand.showBadges) return null;

    const badgeStyle = {
      padding: `${Math.max(1, Math.round(2 * scale))}px ${Math.max(4, Math.round(6 * scale))}px`,
      fontSize: `${fontBadge}px`,
      lineHeight: '1.1',
    };

    return (
      <div className="flex items-center gap-1 flex-wrap pt-0.5">
        {item.chefRecommendation && (
          <span
            className="rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center gap-0.5 shadow-xs"
            style={badgeStyle}
          >
            <Star style={{ width: `${iconBaseSize * 0.85}px`, height: `${iconBaseSize * 0.85}px` }} className="fill-slate-950" />
            <span>CHEF CHOICE</span>
          </span>
        )}

        {item.bestSeller && (
          <span
            className="rounded-full bg-orange-600 text-white font-extrabold flex items-center gap-0.5 shadow-xs"
            style={badgeStyle}
          >
            <Flame style={{ width: `${iconBaseSize * 0.85}px`, height: `${iconBaseSize * 0.85}px` }} className="fill-white" />
            <span>BEST SELLER</span>
          </span>
        )}

        {item.isNew && (
          <span
            className="rounded-full bg-emerald-600 text-white font-extrabold flex items-center gap-0.5 shadow-xs"
            style={badgeStyle}
          >
            <Sparkles style={{ width: `${iconBaseSize * 0.85}px`, height: `${iconBaseSize * 0.85}px` }} />
            <span>NEW</span>
          </span>
        )}

        {item.jain && templateId !== 'indian-royal' && templateId !== 'indian-heritage' && (
          <span
            className="rounded bg-emerald-700 text-white font-bold"
            style={badgeStyle}
          >
            JAIN 🪷
          </span>
        )}

        {item.vegan && (
          <span
            className="rounded bg-emerald-600 text-white font-bold flex items-center gap-0.5"
            style={badgeStyle}
          >
            <Leaf style={{ width: `${iconBaseSize * 0.85}px`, height: `${iconBaseSize * 0.85}px` }} />
            <span>VEGAN</span>
          </span>
        )}
      </div>
    );
  };

  // Brand Logo / Emblem Renderer
  const renderBrandLogo = () => {
    if (brand.showLogo === false) return null;

    if (brand.logoUrl) {
      const maxLogoH = Math.max(14, Math.min(46, Math.round(24 * scale)));
      const maxLogoW = Math.max(60, Math.min(160, Math.round(110 * scale)));
      return (
        <div className="flex items-center flex-shrink-0">
          <img
            src={brand.logoUrl}
            alt="Brand Logo"
            crossOrigin="anonymous"
            className="w-auto object-contain flex-shrink-0 filter drop-shadow-xs"
            style={{
              maxHeight: `${maxLogoH}px`,
              maxWidth: `${maxLogoW}px`,
            }}
          />
        </div>
      );
    }

    const emblem = brand.logoEmblem || (
      templateId === 'bakery-artisanal' || templateId === 'premium-patisserie' ? 'cake' :
      templateId === 'luxury-restaurant' || templateId === 'premium-3d-luxury' || templateId === 'indian-royal' ? 'crown' :
      templateId === 'modern-cafe' ? 'coffee' :
      templateId === 'street-food' || templateId === 'indian-street-food' ? 'flame' :
      templateId === 'hotel-buffet' || templateId === 'contemporary-restaurant' ? 'chef-hat' :
      templateId === 'wedding-buffet' || templateId === 'wedding-elegance' ? 'crown' :
      templateId === 'organic-farm-fresh' || templateId === 'scandinavian-clean' || templateId === 'corporate-cafeteria' ? 'leaf' :
      'sparkles'
    );

    const emblemBoxDim = Math.max(15, Math.min(36, Math.round(22 * scale)));
    const emblemIconDim = Math.max(9, Math.min(22, Math.round(13 * scale)));

    return (
      <div
        className="rounded flex items-center justify-center flex-shrink-0 shadow-xs border"
        style={{
          width: `${emblemBoxDim}px`,
          height: `${emblemBoxDim}px`,
          backgroundColor: `${brand.primaryColor}22`,
          color: brand.primaryColor,
          borderColor: `${brand.primaryColor}55`,
        }}
        title="Brand Logo"
      >
        {emblem === 'chef-hat' && <ChefHat style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'crown' && <Crown style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'coffee' && <Coffee style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'cake' && <CakeSlice style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'leaf' && <Leaf style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'sparkles' && <Sparkles style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {emblem === 'flame' && <Flame style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
        {(!emblem || emblem === 'utensils') && <Utensils style={{ width: `${emblemIconDim}px`, height: `${emblemIconDim}px` }} />}
      </div>
    );
  };

  // Border Style CSS Mapper
  const getBorderClasses = () => {
    if (templateId === 'laura-fine-dining' || (templateId === 'luxury-restaurant' && brand.backgroundColor === '#0a1128')) {
      return 'border-2 border-amber-500/80 shadow-[0_0_20px_rgba(217,119,6,0.35)] ring-1 ring-amber-400/60';
    }
    if (templateId === 'bistro-cafe') {
      return 'border-2 border-emerald-600/30 shadow-[0_8px_20px_rgba(27,67,50,0.15)] ring-1 ring-emerald-400/20';
    }
    if (templateId === 'la-patisserie') {
      return 'border-2 border-amber-900/30 shadow-[0_8px_24px_rgba(69,26,3,0.18)]';
    }
    if (templateId === 'taco-truck') {
      return 'border-2 border-amber-400/80 shadow-[0_0_22px_rgba(234,88,12,0.35)] ring-1 ring-orange-500/50';
    }
    if (templateId === 'premium-3d-luxury') {
      return 'border-2 border-amber-400/90 shadow-[0_20px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,215,0,0.6)] ring-1 ring-amber-500/50';
    }
    if (templateId === 'glassmorphism-3d') {
      return 'border border-white/30 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(56,189,248,0.2)]';
    }
    if (templateId === 'floating-3d-card') {
      return 'border border-indigo-500/40 shadow-[0_22px_45px_-10px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)]';
    }
    if (templateId === 'indian-royal') {
      return 'border-3 border-amber-500/90 shadow-[0_12px_24px_rgba(69,10,10,0.4)] ring-2 ring-amber-400/40';
    }
    if (templateId === 'futuristic-tech') {
      return 'border-2 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-cyan-400/40';
    }
    if (templateId === 'modern-event-night') {
      return 'border-2 border-cyan-500/80 shadow-[0_0_18px_rgba(6,182,212,0.35)]';
    }

    switch (brand.borderStyle) {
      case 'double':
        return 'border-4 border-double';
      case 'gold-foil':
        return 'border-2 border-amber-500/80 shadow-[0_0_12px_rgba(217,119,6,0.3)] ring-1 ring-amber-400/50';
      case 'scalloped':
      case 'dashed':
        return 'border-2 border-dashed';
      case 'none':
        return 'border-0';
      case 'solid':
      default:
        return 'border-2 border-solid';
    }
  };

  // Card Surface Rendering with Smart Adaptive Layout & Scaling
  const renderCardSurface = (isInvertedBack: boolean = false) => {
    const is3D = templateId === 'premium-3d-luxury' || templateId === 'glassmorphism-3d' || templateId === 'floating-3d-card';
    const descClampClass = faceHeightInches < 2.0 ? 'line-clamp-1' : faceHeightInches < 3.2 ? 'line-clamp-2' : 'line-clamp-3';

    // SPECIAL REFERENCE TEMPLATE 1: L'AURA FINE DINING (Royal Navy & Gold Filigree Corner Luxury)
    if (templateId === 'laura-fine-dining') {
      return (
        <div
          className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all select-none font-serif ${
            isInvertedBack ? 'rotate-180' : ''
          }`}
          style={{
            padding: `${scPadding}px`,
            backgroundColor: brand.backgroundColor || '#0a1128',
            color: '#f8fafc',
            borderRadius: `${Math.max(6, Math.round(brand.cornerRadius * scScale))}px`,
          }}
        >
          {/* Authentic Gold Filigree Corner Ornaments SVG */}
          <div
            className="absolute top-1.5 left-1.5 text-amber-400/90 pointer-events-none"
            style={{ width: `${scCornerSize}px`, height: `${scCornerSize}px` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V4C2 2.89543 2.89543 2 4 2H14M2 2L8 8M2 8C5.31371 8 8 5.31371 8 2" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div
            className="absolute top-1.5 right-1.5 text-amber-400/90 pointer-events-none rotate-90"
            style={{ width: `${scCornerSize}px`, height: `${scCornerSize}px` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V4C2 2.89543 2.89543 2 4 2H14M2 2L8 8M2 8C5.31371 8 8 5.31371 8 2" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div
            className="absolute bottom-1.5 left-1.5 text-amber-400/90 pointer-events-none -rotate-90"
            style={{ width: `${scCornerSize}px`, height: `${scCornerSize}px` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V4C2 2.89543 2.89543 2 4 2H14M2 2L8 8M2 8C5.31371 8 8 5.31371 8 2" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
            </svg>
          </div>
          <div
            className="absolute bottom-1.5 right-1.5 text-amber-400/90 pointer-events-none rotate-180"
            style={{ width: `${scCornerSize}px`, height: `${scCornerSize}px` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 14V4C2 2.89543 2.89543 2 4 2H14M2 2L8 8M2 8C5.31371 8 8 5.31371 8 2" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Inner Golden Hairline Inset */}
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-500/30 rounded-lg pointer-events-none" />

          {/* Top Centered Header: Crown + L'AURA + FINE DINING */}
          <div className="flex flex-col items-center justify-center text-center relative z-10 pt-1">
            <Crown
              style={{ width: `${scCrownSize}px`, height: `${scCrownSize}px` }}
              className="text-amber-400 mb-1"
            />
            <h2
              className="font-bold tracking-widest text-amber-300 uppercase leading-none font-serif"
              style={{ fontSize: `${scBrandTitle}px` }}
            >
              {brand.businessName || "L'AURA"}
            </h2>
            <div className="flex items-center gap-1.5 opacity-90 mt-1">
              <span className="w-5 h-[1px] bg-amber-400/70 inline-block" />
              <span
                className="font-sans font-bold tracking-widest uppercase text-amber-200"
                style={{ fontSize: `${scSub}px` }}
              >
                {brand.footerText || 'FINE DINING'}
              </span>
              <span className="w-5 h-[1px] bg-amber-400/70 inline-block" />
            </div>
          </div>

          {/* Middle Content: Dish Name, Description, Spice/Kcal, Allergen Coins */}
          <div
            className={`flex-1 flex flex-col ${
              isVeryTall ? 'justify-evenly py-2' : isVertical ? 'justify-around py-1.5' : 'justify-center py-1'
            } items-center text-center px-1.5 relative z-10 min-h-0`}
            style={{ gap: `${Math.max(3, Math.round((isVeryTall ? 8 : isVertical ? 5 : 3.5) * Math.min(1.4, scScale)))}px` }}
          >
            <h3
              className="font-bold text-slate-50 font-serif leading-tight drop-shadow-sm max-w-full break-words line-clamp-2"
              style={{ fontSize: `${scDishTitle}px` }}
            >
              {item.menuName}
            </h3>

            {item.description && (
              <p
                className={`text-slate-200 font-sans opacity-95 leading-relaxed max-w-xs break-words ${descClampClass}`}
                style={{ fontSize: `${scBody}px` }}
              >
                {item.description}
              </p>
            )}

            {/* Spice + Calorie Center Row */}
            <div
              className="flex items-center justify-center gap-2.5 text-amber-300 font-sans font-semibold text-center flex-wrap"
              style={{ fontSize: `${scMeta}px` }}
            >
              {renderSpiceMeter()}
              {item.spiceLevel && <span>{item.spiceLevel}</span>}
              {item.calories && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1">🪙 {item.calories} kcal</span>
                </>
              )}
            </div>

            {/* Allergens & Golden Allergen Coin Badges */}
            {brand.showAllergens && item.allergen && (
              <div className="flex flex-col items-center gap-1 pt-0.5 max-w-full">
                <span
                  className="text-amber-200/90 font-sans font-medium text-center truncate max-w-full"
                  style={{ fontSize: `${scMeta * 0.9}px` }}
                >
                  Allergens: {item.allergen}
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {['Dairy', 'Nuts', 'Gluten', 'Egg'].map((alg, idx) => (
                    <div
                      key={idx}
                      className="rounded-full border border-amber-400/80 bg-amber-950/80 flex items-center justify-center text-amber-300 shadow-sm"
                      style={{ width: `${scCoinSize}px`, height: `${scCoinSize}px` }}
                      title={`Allergen: ${alg}`}
                    >
                      {alg === 'Dairy' && (
                        <Milk style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
                      )}
                      {alg === 'Nuts' && (
                        <Nut style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
                      )}
                      {alg === 'Gluten' && (
                        <Wheat style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
                      )}
                      {alg === 'Egg' && (
                        <Egg style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Centered Large Gold Price */}
          {brand.showPrice && item.price !== undefined && item.price !== '' && (
            <div className="flex flex-col items-center justify-center relative z-10 pt-1 pb-1">
              <span
                className="font-bold text-amber-300 font-serif leading-none drop-shadow-md"
                style={{ fontSize: `${scPrice}px` }}
              >
                {formatPrice(item.price, brand.currencySymbol)}
              </span>
            </div>
          )}
        </div>
      );
    }

    // SPECIAL REFERENCE TEMPLATE 2: BISTRO CAFÉ (Sage Mint Vintage Arched Botanical Frame)
    if (templateId === 'bistro-cafe') {
      return (
        <div
          className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all select-none p-1.5 ${
            isInvertedBack ? 'rotate-180' : ''
          }`}
          style={{
            backgroundColor: '#d8eee2',
            borderRadius: `${Math.max(8, Math.round(brand.cornerRadius * scScale))}px`,
          }}
        >
          {/* Inner Cream Arched Parchment */}
          <div
            className="w-full h-full flex flex-col justify-between relative overflow-hidden bg-[#fbf9f4] border border-[#8dc6af]/60 rounded-xl p-3 shadow-inner"
            style={{
              padding: `${scPadding}px`,
              borderRadius: `${Math.max(6, Math.round((brand.cornerRadius - 2) * scScale))}px`,
            }}
          >
            {/* 4 Corner Pin-Dots */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#8dc6af]/70" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8dc6af]/70" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#8dc6af]/70" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8dc6af]/70" />

            {/* Top Header: BISTRO - CAFÉ - Leaf & Veg Badge */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="absolute top-0 right-0">{renderVegSymbol()}</div>
              <h2
                className="font-bold tracking-widest text-[#1b4332] uppercase font-serif leading-none"
                style={{ fontSize: `${scBrandTitle * 1.15}px` }}
              >
                {brand.businessName || 'BISTRO'}
              </h2>
              <span
                className="font-sans font-semibold tracking-widest text-[#2d6a4f] uppercase mt-0.5"
                style={{ fontSize: `${scSub}px` }}
              >
                — {brand.footerText || 'CAFÉ'} —
              </span>
              <Leaf
                style={{ width: `${scCrownSize * 0.9}px`, height: `${scCrownSize * 0.9}px` }}
                className="text-[#2d6a4f] mt-1"
              />
            </div>

            {/* Middle Dish & Descriptions */}
            <div
              className={`flex-1 flex flex-col ${
                isVeryTall ? 'justify-evenly py-2' : isVertical ? 'justify-around py-1.5' : 'justify-center py-1'
              } items-center text-center px-1.5 relative z-10 min-h-0`}
              style={{ gap: `${Math.max(3, Math.round((isVeryTall ? 8 : isVertical ? 5 : 3.5) * Math.min(1.4, scScale)))}px` }}
            >
              <h3
                className="font-bold text-[#1b4332] font-serif leading-tight break-words line-clamp-2 max-w-full"
                style={{ fontSize: `${scDishTitle}px` }}
              >
                {item.menuName}
              </h3>

              {item.description && (
                <p
                  className={`text-[#374151] font-sans leading-relaxed max-w-xs break-words ${descClampClass}`}
                  style={{ fontSize: `${scBody}px` }}
                >
                  {item.description}
                </p>
              )}

              {/* Centered Green Capsule Badges */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-0.5">
                <span
                  className="px-2.5 py-1 rounded-full bg-[#2d6a4f] text-white font-bold uppercase tracking-wider shadow-xs"
                  style={{ fontSize: `${scBadge}px` }}
                >
                  • {item.dietaryType || 'VEG'}
                </span>
                {item.chefRecommendation && (
                  <span
                    className="px-2.5 py-1 rounded-full bg-[#1b4332] text-emerald-100 font-bold uppercase tracking-wider shadow-xs"
                    style={{ fontSize: `${scBadge}px` }}
                  >
                    CHEF'S SPECIAL
                  </span>
                )}
              </div>

              {/* Metadata: 330 kcal • Mild */}
              <div
                className="text-[#4b5563] font-sans font-semibold text-center flex-wrap"
                style={{ fontSize: `${scMeta}px` }}
              >
                {item.calories && <span>{item.calories} kcal</span>}
                {item.spiceLevel && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{item.spiceLevel}</span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Centered Olive Price */}
            {brand.showPrice && item.price !== undefined && item.price !== '' && (
              <div className="flex items-center justify-center relative z-10 pt-1 pb-0.5">
                <span
                  className="font-bold text-[#1b4332] font-serif leading-none"
                  style={{ fontSize: `${scPrice}px` }}
                >
                  {formatPrice(item.price, brand.currencySymbol)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // SPECIAL REFERENCE TEMPLATE 3: LA PÂTISSERIE (Parisian French Bakery Scalloped Arch)
    if (templateId === 'la-patisserie') {
      return (
        <div
          className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all select-none p-1.5 ${
            isInvertedBack ? 'rotate-180' : ''
          }`}
          style={{
            backgroundColor: '#faeed4',
            borderRadius: `${Math.max(8, Math.round(brand.cornerRadius * scScale))}px`,
          }}
        >
          {/* Inner Vintage Parchment with Carved Top Arch in Chocolate */}
          <div
            className="w-full h-full flex flex-col justify-between relative overflow-hidden bg-[#fdfbf7] border border-[#b45309]/30 rounded-xl p-3 shadow-inner"
            style={{
              padding: `${scPadding}px`,
              borderRadius: `${Math.max(6, Math.round((brand.cornerRadius - 2) * scScale))}px`,
            }}
          >
            {/* Top Carved Banner & Script Logo */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="absolute top-0 right-0">{renderVegSymbol()}</div>
              <h2
                className="font-serif italic font-extrabold tracking-wide text-[#451a03] leading-none"
                style={{ fontSize: `${scBrandTitle * 1.25}px` }}
              >
                {brand.businessName || 'La Pâtisserie'}
              </h2>
              <span
                className="font-sans font-bold tracking-widest text-[#78350f] uppercase mt-0.5"
                style={{ fontSize: `${scSub}px` }}
              >
                {brand.footerText || 'ARTISANAL BAKERY'}
              </span>
              <CakeSlice
                style={{ width: `${scCrownSize * 0.9}px`, height: `${scCrownSize * 0.9}px` }}
                className="text-[#78350f] mt-1"
              />
            </div>

            {/* Middle Content */}
            <div
              className={`flex-1 flex flex-col ${
                isVeryTall ? 'justify-evenly py-2' : isVertical ? 'justify-around py-1.5' : 'justify-center py-1'
              } items-center text-center px-1.5 relative z-10 min-h-0`}
              style={{ gap: `${Math.max(3, Math.round((isVeryTall ? 8 : isVertical ? 5 : 3.5) * Math.min(1.4, scScale)))}px` }}
            >
              <h3
                className="font-bold text-[#451a03] font-serif leading-tight break-words line-clamp-2 max-w-full"
                style={{ fontSize: `${scDishTitle}px` }}
              >
                {item.menuName}
              </h3>

              {item.description && (
                <p
                  className={`text-[#5c2d12] font-sans leading-relaxed max-w-xs break-words ${descClampClass}`}
                  style={{ fontSize: `${scBody}px` }}
                >
                  {item.description}
                </p>
              )}

              {/* Calorie Coin with Divider lines */}
              {item.calories && (
                <div
                  className="flex items-center justify-center gap-1.5 text-[#78350f] font-sans font-semibold flex-wrap"
                  style={{ fontSize: `${scMeta}px` }}
                >
                  <span>🪙 {item.calories} kcal</span>
                </div>
              )}

              {/* Allergens */}
              {brand.showAllergens && item.allergen && (
                <span
                  className="text-[#9a3412] font-sans text-center truncate max-w-full"
                  style={{ fontSize: `${scMeta * 0.9}px` }}
                >
                  Allergens: {item.allergen}
                </span>
              )}
            </div>

            {/* Bottom Centered Chocolate Price with Ornate Bracket */}
            {brand.showPrice && item.price !== undefined && item.price !== '' && (
              <div className="flex items-center justify-center relative z-10 pt-1 pb-0.5">
                <span
                  className="font-bold text-[#451a03] font-serif leading-none"
                  style={{ fontSize: `${scPrice}px` }}
                >
                  {formatPrice(item.price, brand.currencySymbol)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // SPECIAL REFERENCE TEMPLATE 4: TACO TRUCK (Dark Blackboard & Woodblock Street Food)
    if (templateId === 'taco-truck') {
      return (
        <div
          className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all select-none font-sans ${
            isInvertedBack ? 'rotate-180' : ''
          }`}
          style={{
            padding: `${scPadding}px`,
            backgroundColor: '#121214',
            color: '#ffffff',
            borderRadius: `${Math.max(6, Math.round(brand.cornerRadius * scScale))}px`,
          }}
        >
          {/* Yellow Corner Brackets */}
          <div
            className="absolute top-1.5 left-1.5 border-t-2 border-l-2 border-amber-400"
            style={{ width: `${scCornerSize * 0.8}px`, height: `${scCornerSize * 0.8}px` }}
          />
          <div
            className="absolute top-1.5 right-1.5 border-t-2 border-r-2 border-amber-400"
            style={{ width: `${scCornerSize * 0.8}px`, height: `${scCornerSize * 0.8}px` }}
          />
          <div
            className="absolute bottom-1.5 left-1.5 border-b-2 border-l-2 border-amber-400"
            style={{ width: `${scCornerSize * 0.8}px`, height: `${scCornerSize * 0.8}px` }}
          />
          <div
            className="absolute bottom-1.5 right-1.5 border-b-2 border-r-2 border-amber-400"
            style={{ width: `${scCornerSize * 0.8}px`, height: `${scCornerSize * 0.8}px` }}
          />

          {/* Top Header: Giant Condensed Woodblock Typography */}
          <div className="relative z-10 flex flex-col">
            <h2
              className="font-black tracking-tight text-amber-400 uppercase leading-none font-display"
              style={{ fontSize: `${scBrandTitle * 1.35}px` }}
            >
              {brand.businessName || 'TACO TRUCK'}
            </h2>
            <h3
              className="font-black tracking-tight text-orange-500 uppercase leading-tight font-display mt-0.5 break-words line-clamp-2"
              style={{ fontSize: `${scDishTitle}px` }}
            >
              {item.menuName}
            </h3>
          </div>

          {/* Middle Body */}
          <div
            className={`flex-1 flex flex-col ${
              isVeryTall ? 'justify-evenly py-2' : isVertical ? 'justify-around py-1.5' : 'justify-center py-1'
            } relative z-10 min-h-0`}
            style={{ gap: `${Math.max(3, Math.round((isVeryTall ? 8 : isVertical ? 5 : 3.5) * Math.min(1.4, scScale)))}px` }}
          >
            {item.description && (
              <p
                className={`text-slate-200 font-sans leading-relaxed break-words ${descClampClass}`}
                style={{ fontSize: `${scBody}px` }}
              >
                {item.description}
              </p>
            )}

            {/* Badges: VEGAN + SPICY */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span
                className="px-2.5 py-1 rounded bg-emerald-700 text-white font-extrabold uppercase tracking-wider flex items-center gap-1"
                style={{ fontSize: `${scBadge}px` }}
              >
                <Leaf style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
                <span>VEGAN</span>
              </span>
              <span
                className="px-2.5 py-1 rounded bg-red-600 text-white font-extrabold uppercase tracking-wider flex items-center gap-1"
                style={{ fontSize: `${scBadge}px` }}
              >
                <span>SPICY</span>
                <Flame style={{ width: `${scCoinIcon}px`, height: `${scCoinIcon}px` }} />
              </span>
            </div>

            {item.calories && (
              <span
                className="text-slate-300 font-mono font-semibold"
                style={{ fontSize: `${scMeta}px` }}
              >
                {item.calories} kcal
              </span>
            )}
          </div>

          {/* Bottom Split Footer: Bold Yellow Price + QR Code */}
          <div className="flex items-end justify-between relative z-10 pt-1 border-t border-zinc-800">
            {brand.showPrice && item.price !== undefined && item.price !== '' && (
              <span
                className="font-black text-amber-400 font-display leading-none"
                style={{ fontSize: `${scPrice}px` }}
              >
                {formatPrice(item.price, brand.currencySymbol)}
              </span>
            )}

            {brand.showQrCode && (
              <div
                className="rounded bg-white p-1 shadow-xs flex-shrink-0"
                style={{ width: `${scQrDim}px`, height: `${scQrDim}px` }}
              >
                <QRCodeSVG
                  value={item.qrData || 'https://menu.order'}
                  size={scQrDim - 8}
                  level="M"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all select-none ${getFontFamilyClass()} ${
          isInvertedBack ? 'rotate-180' : ''
        }`}
        style={{
          padding: `${paddingCard}px`,
          backgroundColor: templateId === 'glassmorphism-3d' ? `${brand.backgroundColor}dd` : brand.backgroundColor,
          color: brand.textColor,
          borderRadius: `${Math.max(4, Math.round(brand.cornerRadius * (scale < 0.85 ? 0.75 : 1.0)))}px`,
          borderColor: brand.borderColor,
        }}
      >
        {/* Visual Highlights & Textures */}
        {templateId === 'glassmorphism-3d' && (
          <>
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </>
        )}

        {templateId === 'premium-3d-luxury' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />
            <div className="absolute top-1 left-1 right-1 bottom-1 border border-amber-500/30 rounded-lg pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/10 rounded-full blur-lg pointer-events-none" />
          </>
        )}

        {templateId === 'floating-3d-card' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70" />
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-indigo-600/10 rounded-full blur-lg pointer-events-none" />
          </>
        )}

        {templateId === 'indian-royal' && (
          <>
            <div className="absolute top-1 left-1 right-1 bottom-1 border border-amber-400/40 rounded-lg pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-amber-500/20 rounded-b-full border-b border-amber-400/40" />
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />
          </>
        )}

        {templateId === 'indian-heritage' && (
          <div className="absolute top-1 left-1 right-1 bottom-1 border border-dashed border-orange-400/40 rounded pointer-events-none" />
        )}

        {templateId === 'futuristic-tech' && (
          <>
            <div
              className="absolute top-1.5 right-2 font-mono text-emerald-400/60 tracking-widest pointer-events-none"
              style={{ fontSize: `${Math.max(6, Math.round(7 * scale))}px` }}
            >
              [SYS://0{item.id.slice(-2) || '1'}]
            </div>
            <div className="absolute bottom-1.5 left-2 w-1 h-1 bg-emerald-400 animate-pulse pointer-events-none" />
          </>
        )}

        {templateId === 'contemporary-restaurant' && (
          <div
            className="absolute top-0 left-0 bottom-0"
            style={{
              width: `${Math.max(3, Math.round(4 * scale))}px`,
              backgroundColor: brand.primaryColor,
            }}
          />
        )}

        {templateId === 'social-media-card' && (
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600"
            style={{ height: `${Math.max(2, Math.round(3 * scale))}px` }}
          />
        )}

        {templateId === 'rustic-premium' && (
          <div className="absolute top-1 left-1 right-1 bottom-1 border border-dashed border-amber-900/30 rounded pointer-events-none" />
        )}

        {/* ======================================================== */}
        {/* TOP HEADER ROW: Logo, Business Name, Category & Badges   */}
        {/* ======================================================== */}
        <div
          className={`flex items-center justify-between gap-1.5 pb-1 relative z-10 flex-shrink-0 ${
            templateId === 'modern-minimal' ? 'border-b-2 border-zinc-900/80' : 'border-b'
          }`}
          style={{ borderColor: `${brand.borderColor}40` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {renderBrandLogo()}
            {brand.showBusinessName !== false && (
              <span
                className={`font-bold uppercase tracking-wider truncate leading-tight ${
                  templateId === 'premium-3d-luxury' ? 'tracking-widest text-amber-300 font-serif' : ''
                }`}
                style={{
                  color: brand.primaryColor,
                  fontSize: `${fontSmall * 1.15}px`,
                }}
              >
                {brand.businessName || 'MENU TAG STUDIO'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {templateId === 'social-media-card' && (
              <span
                className="font-semibold text-rose-500 flex items-center gap-0.5 bg-rose-50 rounded-full"
                style={{
                  fontSize: `${fontSmall}px`,
                  padding: `${Math.max(1, Math.round(1.5 * scale))}px ${Math.max(3, Math.round(5 * scale))}px`,
                }}
              >
                <Heart style={{ width: `${iconBaseSize * 0.8}px`, height: `${iconBaseSize * 0.8}px` }} className="fill-rose-500" />
                <span>1.4k</span>
              </span>
            )}

            {brand.showCategory !== false && item.category && (
              <span
                className={`font-semibold uppercase tracking-wider rounded-full flex-shrink-0 truncate leading-tight ${
                  templateId === 'glassmorphism-3d'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                    : templateId === 'premium-3d-luxury'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                    : templateId === 'futuristic-tech'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono'
                    : ''
                }`}
                style={{
                  backgroundColor: is3D ? undefined : `${brand.accentColor}20`,
                  color: is3D ? undefined : brand.accentColor,
                  fontSize: `${fontBadge}px`,
                  padding: `${Math.max(1.5, Math.round(2 * scale))}px ${Math.max(4, Math.round(7 * scale))}px`,
                  maxWidth: `${Math.round(110 * scale)}px`,
                }}
              >
                {item.category}
              </span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MIDDLE MAIN ROW: Title, Veg/Non-Veg, Badges, Desc, Notes */}
        {/* ======================================================== */}
        <div
          className={`flex-1 min-h-0 flex flex-col ${
            isVeryTall ? 'justify-evenly py-2' : isVertical ? 'justify-around py-1.5' : 'justify-center py-1'
          } relative z-10 overflow-hidden`}
          style={{ gap: `${Math.max(2, Math.round((isVeryTall ? 6 : isVertical ? 4.5 : 3.5) * scale))}px` }}
        >
          {/* Dish Name & Veg Symbol */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {renderVegSymbol()}
              <h3
                className={`font-bold leading-tight break-words line-clamp-2 ${
                  templateId === 'modern-minimal'
                    ? 'font-sans font-black tracking-tight text-slate-900'
                    : templateId === 'premium-3d-luxury'
                    ? 'font-serif tracking-wide text-amber-100 drop-shadow-sm'
                    : templateId === 'indian-royal'
                    ? 'font-serif font-extrabold text-amber-100 tracking-wide'
                    : templateId === 'futuristic-tech'
                    ? 'font-mono text-emerald-300 tracking-wide'
                    : ''
                }`}
                style={{ fontSize: `${fontTitle}px` }}
              >
                {item.menuName}
              </h3>
            </div>
            {renderSpiceMeter()}
          </div>

          {/* Badges Row */}
          {renderHighlightBadges()}

          {/* Description */}
          {item.description && (
            <p
              className={`opacity-85 leading-snug break-words ${descClampClass}`}
              style={{ fontSize: `${fontBody}px` }}
            >
              {item.description}
            </p>
          )}

          {/* Prep Time / Portion Note */}
          {(item.prepTime || item.portionSize || item.customNote) && (
            <div
              className="flex items-center gap-1.5 opacity-80 flex-wrap leading-tight"
              style={{ fontSize: `${fontSmall}px` }}
            >
              {item.prepTime && (
                <span className="flex items-center gap-0.5 font-mono">
                  <Clock style={{ width: `${iconBaseSize * 0.8}px`, height: `${iconBaseSize * 0.8}px` }} className="opacity-70" />
                  {item.prepTime}
                </span>
              )}
              {item.portionSize && <span className="font-medium">• {item.portionSize}</span>}
              {item.customNote && <span className="font-semibold text-amber-500">• {item.customNote}</span>}
            </div>
          )}

          {/* Allergens */}
          {renderAllergenIcons()}
        </div>

        {/* ======================================================== */}
        {/* BOTTOM FOOTER ROW: Nutrition, Slogan, Price & QR Code   */}
        {/* ======================================================== */}
        <div
          className={`flex items-end justify-between gap-1.5 pt-1 relative z-10 flex-shrink-0 ${
            templateId === 'modern-minimal' ? 'border-t border-zinc-300' : 'border-t'
          }`}
          style={{ borderColor: `${brand.borderColor}40` }}
        >
          {/* Left: Nutrition & Footer slogan */}
          <div className="space-y-0.5 min-w-0">
            {brand.showNutrition && (item.calories || item.protein) && (
              <div
                className={`font-mono opacity-85 flex items-center flex-wrap ${
                  templateId === 'corporate-cafeteria' || templateId === 'corporate-premium'
                    ? 'bg-slate-900/40 rounded border border-slate-700/50'
                    : ''
                }`}
                style={{
                  fontSize: `${fontSmall}px`,
                  gap: `${Math.max(2, Math.round(4 * scale))}px`,
                  padding: templateId === 'corporate-cafeteria' || templateId === 'corporate-premium'
                    ? `${Math.max(1, Math.round(1.5 * scale))}px ${Math.max(2, Math.round(4 * scale))}px`
                    : undefined,
                }}
              >
                {item.calories && (
                  <span className="font-bold text-amber-400">{item.calories} kcal</span>
                )}
                {item.protein && <span>P:{item.protein}</span>}
                {item.carbs && faceWidthInches >= 3.0 && <span>C:{item.carbs}</span>}
                {item.fat && faceWidthInches >= 3.0 && <span>F:{item.fat}</span>}
              </div>
            )}

            {brand.footerText && (
              <p
                className="opacity-65 truncate leading-none"
                style={{ fontSize: `${fontSmall * 0.95}px` }}
              >
                {brand.footerText}
              </p>
            )}
          </div>

          {/* Right: Price & QR Code */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {brand.showQrCode && (item.qrUrl || brand.website) && (
              <div
                className={`rounded shadow-xs flex-shrink-0 flex items-center justify-center ${
                  templateId === 'glassmorphism-3d'
                    ? 'bg-white/90 border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                    : templateId === 'premium-3d-luxury'
                    ? 'bg-amber-50 border border-amber-400 shadow-sm'
                    : 'bg-white border border-slate-200'
                }`}
                style={{ padding: `${Math.max(1, Math.round(2 * scale))}px` }}
              >
                <QRCodeSVG
                  value={item.qrUrl || brand.website || 'https://menu.studio'}
                  size={qrDimension}
                  level="L"
                />
              </div>
            )}

            {brand.showPrice && item.price !== undefined && item.price !== '' && (
              <div
                className={`font-black leading-none rounded-lg flex-shrink-0 transition-all ${
                  templateId === 'premium-3d-luxury'
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-slate-950 shadow-[0_4px_10px_rgba(217,119,6,0.4)] border border-amber-200'
                    : templateId === 'glassmorphism-3d'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_4px_15px_rgba(6,182,212,0.3)] backdrop-blur-md'
                    : templateId === 'floating-3d-card'
                    ? 'bg-indigo-600 text-white shadow-[0_6px_14px_rgba(99,102,241,0.4)] border border-indigo-400'
                    : templateId === 'indian-royal'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md border border-amber-300 font-serif'
                    : templateId === 'futuristic-tech'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-400 font-mono shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : templateId === 'modern-minimal'
                    ? 'bg-transparent text-zinc-900 font-mono tracking-tighter px-0 py-0'
                    : ''
                }`}
                style={{
                  fontSize: `${fontPrice}px`,
                  padding:
                    templateId === 'modern-minimal'
                      ? '0px'
                      : `${Math.max(2, Math.round(3.5 * scale))}px ${Math.max(5, Math.round(8 * scale))}px`,
                  backgroundColor:
                    templateId === 'premium-3d-luxury' ||
                    templateId === 'glassmorphism-3d' ||
                    templateId === 'floating-3d-card' ||
                    templateId === 'indian-royal' ||
                    templateId === 'futuristic-tech' ||
                    templateId === 'modern-minimal'
                      ? undefined
                      : `${brand.primaryColor}18`,
                  color:
                    templateId === 'premium-3d-luxury' ||
                    templateId === 'glassmorphism-3d' ||
                    templateId === 'floating-3d-card' ||
                    templateId === 'indian-royal' ||
                    templateId === 'futuristic-tech' ||
                    templateId === 'modern-minimal'
                      ? undefined
                      : brand.primaryColor,
                }}
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
      className={`relative group bg-white p-0.5 sm:p-1 rounded-xl transition-all shadow-md hover:shadow-xl ${getBorderClasses()}`}
      style={{
        width: `${cardWidthPx}px`,
        height: `${totalCardHeightPx}px`,
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
            <div className="w-full h-1/2 border-b border-dashed border-amber-500/40 relative overflow-hidden">
              {renderCardSurface(true)}
              <div
                className="absolute bottom-0 left-0 right-0 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-center uppercase tracking-widest font-mono select-none"
                style={{ fontSize: `${Math.max(6, Math.round(7 * scale))}px` }}
              >
                FOLD HERE ✂️ TABLE TENT CREASE LINE
              </div>
            </div>

            {/* Bottom Half: Front Upright View */}
            <div className="w-full h-1/2 overflow-hidden">
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
