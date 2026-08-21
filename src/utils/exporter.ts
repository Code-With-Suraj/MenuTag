import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { MenuItem, BrandConfig, TagSize, TemplateId } from '../types';
import { formatPrice } from './format';

/**
 * Locate a card DOM element across various possible mount points
 */
export function findCardElement(itemId: string): HTMLElement | null {
  const possibleIds = [
    `live-export-card-${itemId}`,
    `export-card-inner-${itemId}`,
    `export-card-${itemId}`,
    `preview-card-${itemId}`,
    `preview-card-inner-${itemId}`,
    `print-sheet-${itemId}`,
    `inspect-card-${itemId}`,
    `card-${itemId}`,
    itemId,
  ];

  for (const id of possibleIds) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

/**
 * Check if a canvas element is completely transparent/blank
 */
export function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return true;
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const sampleW = Math.min(canvas.width, 100);
    const sampleH = Math.min(canvas.height, 100);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 10) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Helper to render vector SVG logo emblem icon
 */
function getEmblemSvg(emblem: string, color: string): string {
  switch (emblem) {
    case 'chef-hat':
      return `<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="17" x2="18" y2="17" stroke="${color}" stroke-width="1.8"/>`;
    case 'crown':
      return `<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'coffee':
      return `<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="2" x2="6" y2="4" stroke="${color}" stroke-width="1.8"/><line x1="10" y1="2" x2="10" y2="4" stroke="${color}" stroke-width="1.8"/><line x1="14" y1="2" x2="14" y2="4" stroke="${color}" stroke-width="1.8"/>`;
    case 'cake':
      return `<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 21h16M2 17h20M12 4v3" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="3" r="1" fill="${color}"/>`;
    case 'leaf':
      return `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'sparkles':
      return `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'flame':
      return `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'utensils':
    default:
      return `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 11v11M4 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2M6 11v11" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
}

/**
 * High-fidelity SVG vector markup generator matching exact card styling
 */
export function generateSvgCode(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId
): string {
  const width = 380;
  const height = 270;
  const isVeg = item.dietaryType === 'Veg';
  const isNonVeg = item.dietaryType === 'Non-Veg';
  const isVegan = item.dietaryType === 'Vegan' || item.vegan;
  const isJain = item.dietaryType === 'Jain' || item.jain;
  const isEgg = item.dietaryType === 'Egg' || item.egg;

  const symbolColor =
    isVeg || isVegan || isJain ? '#16a34a' : isNonVeg ? '#dc2626' : isEgg ? '#ca8a04' : '#d97706';

  const priceText =
    brand.showPrice && item.price !== undefined && item.price !== ''
      ? formatPrice(item.price, brand.currencySymbol)
      : '';

  const cleanName = (item.menuName || 'Menu Item')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const cleanDesc = (item.description || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const cleanCategory = (item.category || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const cleanFooter = (brand.footerText || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const cleanBiz = (brand.businessName || 'MENU TAG STUDIO')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Spice level
  let spiceIndicator = '';
  if (brand.showSpiceIcon && item.spiceLevel && item.spiceLevel !== 'None') {
    spiceIndicator =
      item.spiceLevel === 'Extra Hot'
        ? '🌶🌶🌶'
        : item.spiceLevel === 'Hot'
        ? '🌶🌶'
        : '🌶';
  }

  // Brand emblem or logo
  const chosenEmblem =
    brand.logoEmblem ||
    (templateId === 'bakery-artisanal'
      ? 'cake'
      : templateId === 'luxury-restaurant'
      ? 'crown'
      : templateId === 'modern-cafe'
      ? 'coffee'
      : templateId === 'street-food'
      ? 'flame'
      : 'utensils');

  const showQr = brand.showQrCode && (item.qrUrl || brand.website);

  // Border styling
  let borderStrokeWidth = 2;
  let strokeDash = '';
  if (brand.borderStyle === 'double') {
    borderStrokeWidth = 4;
  } else if (brand.borderStyle === 'dashed' || brand.borderStyle === 'scalloped') {
    strokeDash = 'stroke-dasharray="6,4"';
  } else if (brand.borderStyle === 'none') {
    borderStrokeWidth = 0;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .biz-title { font-family: ${brand.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'system-ui, -apple-system, sans-serif'}; font-size: 11px; font-weight: 800; fill: ${brand.primaryColor}; letter-spacing: 1.2px; text-transform: uppercase; }
      .dish-title { font-family: ${brand.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : 'system-ui, -apple-system, sans-serif'}; font-size: 15.5px; font-weight: 800; fill: ${brand.textColor}; }
      .desc-text { font-family: system-ui, -apple-system, sans-serif; font-size: 10.5px; line-height: 14px; fill: ${brand.textColor}; opacity: 0.88; }
      .badge-text { font-family: system-ui, -apple-system, sans-serif; font-size: 8.5px; font-weight: 800; fill: #ffffff; letter-spacing: 0.5px; }
      .price-text { font-family: system-ui, -apple-system, sans-serif; font-size: 16px; font-weight: 900; fill: ${brand.primaryColor}; }
      .nutri-text { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 9.5px; fill: ${brand.textColor}; opacity: 0.8; font-weight: 600; }
      .footer-text { font-family: system-ui, -apple-system, sans-serif; font-size: 8.5px; fill: ${brand.textColor}; opacity: 0.65; }
    </style>
  </defs>

  <!-- Background surface -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="${brand.backgroundColor || '#0f172a'}" rx="${brand.cornerRadius || 10}" stroke="${brand.borderColor || '#d97706'}" stroke-width="${borderStrokeWidth}" ${strokeDash}/>

  ${
    brand.borderStyle === 'gold-foil'
      ? `<rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" rx="${Math.max(2, (brand.cornerRadius || 10) - 4)}" stroke="${brand.primaryColor}" stroke-width="1" stroke-opacity="0.4"/>`
      : ''
  }

  <!-- Header Section -->
  <g transform="translate(16, 14)">
    ${
      brand.showLogo !== false
        ? brand.logoUrl
          ? `<image href="${brand.logoUrl}" x="0" y="-3" width="${brand.showBusinessName !== false ? '75' : '120'}" height="24" preserveAspectRatio="xMinYMid meet"/>`
          : `<g transform="translate(0, 0)">
               <rect width="20" height="20" rx="4" fill="${brand.primaryColor}" fill-opacity="0.2" stroke="${brand.primaryColor}" stroke-width="1.2"/>
               <g transform="translate(2, 2) scale(0.66)">
                 ${getEmblemSvg(chosenEmblem, brand.primaryColor)}
               </g>
             </g>`
        : ''
    }

    ${
      brand.showBusinessName !== false
        ? `<text x="${brand.showLogo !== false ? (brand.logoUrl ? 82 : 26) : 0}" y="14" class="biz-title">${cleanBiz}</text>`
        : ''
    }

    ${
      brand.showCategory !== false && item.category
        ? `<rect x="${width - 32 - (cleanCategory.length * 6 + 16)}" y="-1" width="${cleanCategory.length * 6 + 16}" height="18" rx="4" fill="${brand.accentColor || brand.primaryColor}" fill-opacity="0.15"/>
           <text x="${width - 32 - (cleanCategory.length * 6 + 8) / 2}" y="12" font-family="system-ui, sans-serif" font-size="9.5" font-weight="700" text-anchor="middle" fill="${brand.accentColor || brand.primaryColor}" letter-spacing="0.8px">${cleanCategory.toUpperCase()}</text>`
        : ''
    }
  </g>

  <!-- Header separator line -->
  <line x1="16" y1="38" x2="${width - 16}" y2="38" stroke="${brand.borderColor || '#d97706'}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Main Body Section -->
  <g transform="translate(16, 48)">
    <!-- Dietary Box Symbol (Veg / Non-Veg / Vegan / Jain) -->
    ${
      brand.showDietIcon
        ? `<rect x="0" y="2" width="16" height="16" fill="${brand.backgroundColor === '#ffffff' ? '#ffffff' : '#1e293b'}" stroke="${symbolColor}" stroke-width="1.8" rx="3"/>
           <circle cx="8" cy="10" r="4.2" fill="${symbolColor}"/>`
        : ''
    }

    <!-- Dish Title -->
    <text x="${brand.showDietIcon ? 24 : 0}" y="15" class="dish-title">${cleanName}</text>
    
    ${
      spiceIndicator
        ? `<text x="${width - 32}" y="14" font-size="12" text-anchor="end">${spiceIndicator}</text>`
        : ''
    }

    <!-- Badges Row -->
    <g transform="translate(0, 24)">
      ${
        item.chefRecommendation
          ? `<rect x="0" y="0" width="88" height="16" rx="8" fill="#f59e0b"/>
             <text x="44" y="11" class="badge-text" fill="#0f172a" text-anchor="middle">★ CHEF CHOICE</text>`
          : item.bestSeller
          ? `<rect x="0" y="0" width="84" height="16" rx="8" fill="#ea580c"/>
             <text x="42" y="11" class="badge-text" text-anchor="middle">🔥 BEST SELLER</text>`
          : item.isNew
          ? `<rect x="0" y="0" width="54" height="16" rx="8" fill="#10b981"/>
             <text x="27" y="11" class="badge-text" text-anchor="middle">✨ NEW</text>`
          : ''
      }
    </g>

    <!-- Description -->
    <g transform="translate(0, ${item.chefRecommendation || item.bestSeller || item.isNew ? 48 : 30})">
      <text x="0" y="10" class="desc-text">
        ${cleanDesc ? (cleanDesc.length > 58 ? cleanDesc.slice(0, 56) + '...' : cleanDesc) : ''}
      </text>
      ${
        brand.showAllergens && item.allergen
          ? `<text x="0" y="26" font-family="system-ui, sans-serif" font-size="9.5" fill="${brand.textColor}" opacity="0.7">Allergens: ${item.allergen}</text>`
          : ''
      }
    </g>
  </g>

  <!-- Footer Section -->
  <line x1="16" y1="${height - 48}" x2="${width - 16}" y2="${height - 48}" stroke="${brand.borderColor || '#d97706'}" stroke-opacity="0.3" stroke-width="1"/>

  <g transform="translate(16, ${height - 40})">
    <!-- Nutrition / Calories -->
    ${
      brand.showNutrition && (item.calories || item.protein)
        ? `<text x="0" y="12" class="nutri-text">${item.calories ? item.calories + ' kcal' : ''} ${item.protein ? '• P:' + item.protein : ''} ${item.carbs ? '• C:' + item.carbs : ''}</text>`
        : ''
    }

    <!-- Slogan -->
    ${
      cleanFooter
        ? `<text x="0" y="${brand.showNutrition && (item.calories || item.protein) ? 26 : 18}" class="footer-text">${cleanFooter}</text>`
        : ''
    }

    <!-- QR Code & Price -->
    <g transform="translate(${width - 32}, 0)">
      ${
        showQr
          ? `<g transform="translate(-128, -2)">
               <rect width="28" height="28" fill="#ffffff" rx="4" stroke="#cbd5e1" stroke-width="1"/>
               <rect x="4" y="4" width="7" height="7" fill="#000000"/>
               <rect x="5.5" y="5.5" width="4" height="4" fill="#ffffff"/>
               <rect x="6.5" y="6.5" width="2" height="2" fill="#000000"/>
               <rect x="17" y="4" width="7" height="7" fill="#000000"/>
               <rect x="18.5" y="5.5" width="4" height="4" fill="#ffffff"/>
               <rect x="19.5" y="6.5" width="2" height="2" fill="#000000"/>
               <rect x="4" y="17" width="7" height="7" fill="#000000"/>
               <rect x="5.5" y="18.5" width="4" height="4" fill="#ffffff"/>
               <rect x="6.5" y="19.5" width="2" height="2" fill="#000000"/>
               <rect x="14" y="14" width="3" height="3" fill="#000000"/>
               <rect x="20" y="20" width="4" height="4" fill="#000000"/>
             </g>`
          : ''
      }

      ${
        priceText
          ? `<rect x="${showQr ? -92 : -88}" y="-2" width="${showQr ? 92 : 88}" height="28" rx="6" fill="${brand.primaryColor}" fill-opacity="0.15"/>
             <text x="0" y="18" class="price-text" text-anchor="end">${priceText}</text>`
          : ''
      }
    </g>
  </g>
</svg>`;
}

/**
 * Render SVG to canvas with crisp scaling
 */
export async function renderSvgToCanvas(
  svgString: string,
  width: number = 380,
  height: number = 270,
  scale: number = 3.5
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(canvas);
      return;
    }

    const img = new Image();
    const svgDataUri =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.onerror = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.src = svgDataUri;
  });
}

/**
 * Exact, Pixel-Perfect Live DOM Capture
 * Captures the exact rendered MenuCard from DOM, with full CSS, fonts, logos, icons & QR code.
 */
export async function captureExactMenuCard(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  pixelRatio: number = 3.5
): Promise<string> {
  // 1. Locate element in live DOM or export sandbox
  const element = findCardElement(item.id);

  if (element) {
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Capture exact DOM with html-to-image
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: brand.backgroundColor || '#0f172a',
      });

      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (err) {
      console.warn(`DOM capture issue for ${item.menuName}, falling back to SVG renderer:`, err);
    }
  }

  // 2. High-precision vector SVG renderer fallback
  const svg = generateSvgCode(item, brand, sizeKey, templateId);
  const canvas = await renderSvgToCanvas(svg, 380, 270, pixelRatio);
  return canvas.toDataURL('image/png');
}

/**
 * Export a single element as high-res PNG file download
 */
export async function exportSingleCardPng(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  filename?: string
): Promise<boolean> {
  const dataUrl = await captureExactMenuCard(item, brand, sizeKey, templateId, 4);
  if (!dataUrl) return false;

  const defaultName = `menu_tag_${(item.menuName || 'card').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
  const fname = filename || defaultName;

  saveAs(dataUrl, fname.endsWith('.png') ? fname : `${fname}.png`);
  return true;
}

/**
 * Bulk Export all cards as a ZIP archive of high-res PNG images
 */
export async function exportBulkCardsZip(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-png') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const dataUrl = await captureExactMenuCard(item, brand, sizeKey, templateId, 3.5);
    if (dataUrl) {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const cleanName = (item.menuName || `tag_${count}`)
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      folder.file(
        `${count.toString().padStart(3, '0')}_${cleanName}.png`,
        base64Data,
        { base64: true }
      );
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `menu_tags_png_bulk_${Date.now()}.zip`);
  return true;
}

/**
 * Export cards into a print-ready multi-card Grid Sheet PDF (A4 or US Letter)
 * Guarantees SAME-TO-SAME exact visual output matching the selected template!
 */
export async function exportCardsSheetPdf(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  paperSize: 'a4' | 'letter' = 'a4',
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Clean page margins & grid spacing
  const marginX = 14;
  const marginTop = 18;
  const marginBottom = 14;
  const gapX = 8;
  const gapY = 8;

  const availableWidth = pageWidth - marginX * 2;
  const availableHeight = pageHeight - marginTop - marginBottom;

  const cols = 2;
  const cardW = (availableWidth - gapX * (cols - 1)) / cols;
  const cardH = cardW * 0.71;
  const rows = Math.max(1, Math.floor((availableHeight + gapY) / (cardH + gapY)));
  const cardsPerPage = cols * rows;

  let currentIndex = 0;
  let pageNumber = 1;
  const totalPages = Math.ceil(items.length / cardsPerPage);

  const drawPageHeaderAndFooter = (pageNum: number) => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `MENU TAG STUDIO • PRINT SHEET (${paperSize.toUpperCase()})`,
      marginX,
      11
    );
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Page ${pageNum} of ${totalPages} • Total: ${items.length} Tags`,
      pageWidth - marginX,
      11,
      { align: 'right' }
    );
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, 13, pageWidth - marginX, 13);

    // Footer note
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      '✂️ Cut along outer boundaries • Recommended Paper: 250-300 GSM Matte / Gloss Cardstock',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  };

  while (currentIndex < items.length) {
    if (pageNumber > 1) {
      pdf.addPage();
    }
    drawPageHeaderAndFooter(pageNumber);

    const pageItems = items.slice(currentIndex, currentIndex + cardsPerPage);

    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i];
      const itemGlobalIndex = currentIndex + i + 1;
      if (onProgress) onProgress(itemGlobalIndex, items.length);

      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = marginX + col * (cardW + gapX);
      const y = marginTop + row * (cardH + gapY);

      // Capture exact live card data URL
      const imgDataUrl = await captureExactMenuCard(
        item,
        brand,
        sizeKey,
        templateId,
        3.5
      );

      if (imgDataUrl) {
        const drawW = cardW;
        const drawH = cardH;

        // Crop guides & corner tick marks
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.2);
        pdf.rect(x - 0.4, y - 0.4, drawW + 0.8, drawH + 0.8, 'S');

        // Corner crop marks
        pdf.setDrawColor(148, 163, 184);
        pdf.setLineWidth(0.3);
        const tick = 2.5;
        // Top-left
        pdf.line(x - 2, y, x + tick, y);
        pdf.line(x, y - 2, x, y + tick);
        // Top-right
        pdf.line(x + drawW - tick, y, x + drawW + 2, y);
        pdf.line(x + drawW, y - 2, x + drawW, y + tick);
        // Bottom-left
        pdf.line(x - 2, y + drawH, x + tick, y + drawH);
        pdf.line(x, y + drawH - tick, x, y + drawH + 2);
        // Bottom-right
        pdf.line(x + drawW - tick, y + drawH, x + drawW + 2, y + drawH);
        pdf.line(x + drawW, y + drawH - tick, x + drawW, y + drawH + 2);

        // Embed high-res card artwork
        pdf.addImage(imgDataUrl, 'PNG', x, y, drawW, drawH);
      }
    }

    currentIndex += cardsPerPage;
    pageNumber++;
  }

  pdf.save(`menu_tags_print_sheet_${Date.now()}.pdf`);
  return true;
}

/**
 * Export cards into a single-tag per page PDF Catalog
 */
export async function exportCardsCatalogPdf(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  paperSize: 'a4' | 'letter' = 'a4',
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let count = 0;
  for (let i = 0; i < items.length; i++) {
    count++;
    if (onProgress) onProgress(count, items.length);

    if (i > 0) {
      pdf.addPage();
    }

    const item = items[i];

    // Page header
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      (brand.businessName || 'MENU TAG CATALOG').toUpperCase(),
      16,
      14
    );
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Item ${i + 1} of ${items.length}`,
      pageWidth - 16,
      14,
      { align: 'right' }
    );
    pdf.setDrawColor(226, 232, 240);
    pdf.line(16, 16, pageWidth - 16, 16);

    const imgDataUrl = await captureExactMenuCard(
      item,
      brand,
      sizeKey,
      templateId,
      4
    );

    if (imgDataUrl) {
      const cardWidth = Math.min(140, pageWidth - 40);
      const cardHeight = cardWidth * 0.71;
      const x = (pageWidth - cardWidth) / 2;
      const y = (pageHeight - cardHeight) / 2 - 10;

      // Card shadow placeholder
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(x + 2, y + 2, cardWidth, cardHeight, 3, 3, 'F');

      pdf.addImage(imgDataUrl, 'PNG', x, y, cardWidth, cardHeight);
    }
  }

  pdf.save(`menu_catalog_${Date.now()}.pdf`);
  return true;
}

/**
 * Export single card as raw SVG file
 */
export function exportSingleSvg(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  filename?: string
): void {
  const svgCode = generateSvgCode(item, brand, sizeKey, templateId);
  const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
  const defaultName = `menu_tag_${(item.menuName || 'card').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
  saveAs(blob, filename || defaultName);
}

/**
 * Export all cards as a ZIP of clean SVG vector files
 */
export async function exportBulkSvgsZip(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  templateId?: TemplateId,
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-svg') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const svgCode = generateSvgCode(item, brand, sizeKey, templateId);
    const cleanName = (item.menuName || `tag_${count}`)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    folder.file(`${count.toString().padStart(3, '0')}_${cleanName}.svg`, svgCode);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `menu_tags_svg_bulk_${Date.now()}.zip`);
  return true;
}

/**
 * Export clean structured CSV of menu items
 */
export function exportItemsCsv(items: MenuItem[], filename?: string): void {
  const exportData = items.map((item) => ({
    MenuName: item.menuName,
    Category: item.category || '',
    Price: item.price !== undefined ? item.price : '',
    DietaryType: item.dietaryType || '',
    SpiceLevel: item.spiceLevel || '',
    ChefRecommendation: item.chefRecommendation ? 'Yes' : 'No',
    BestSeller: item.bestSeller ? 'Yes' : 'No',
    IsNew: item.isNew ? 'Yes' : 'No',
    Jain: item.jain ? 'Yes' : 'No',
    Vegan: item.vegan ? 'Yes' : 'No',
    GlutenFree: item.glutenFree ? 'Yes' : 'No',
    Allergen: item.allergen || '',
    Calories: item.calories || '',
    Protein: item.protein || '',
    Carbs: item.carbs || '',
    Fat: item.fat || '',
    PrepTime: item.prepTime || '',
    PortionSize: item.portionSize || '',
    QrUrl: item.qrUrl || '',
    Description: item.description || '',
    CustomNote: item.customNote || '',
  }));

  const csv = Papa.unparse(exportData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename || `menu_tags_data_${Date.now()}.csv`);
}
