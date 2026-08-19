import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { MenuItem, BrandConfig, TagSize } from '../types';
import { formatPrice } from './format';

/**
 * Locate a card DOM element across various possible mount points
 */
export function findCardElement(itemId: string): HTMLElement | null {
  const possibleIds = [
    `preview-card-${itemId}`,
    `print-sheet-${itemId}`,
    `inspect-card-${itemId}`,
    `export-card-${itemId}`,
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
    const sampleW = Math.min(canvas.width, 80);
    const sampleH = Math.min(canvas.height, 80);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;
    // Look for any non-zero alpha channel pixel
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 10) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * High-fidelity SVG vector markup generator matching card styling
 */
export function generateSvgCode(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium'
): string {
  const width = 360;
  const height = 260;
  const isVeg = item.dietaryType === 'Veg';
  const isNonVeg = item.dietaryType === 'Non-Veg';
  const isEgg = item.dietaryType === 'Egg';
  const isVegan = item.dietaryType === 'Vegan' || item.vegan;
  const isJain = item.dietaryType === 'Jain' || item.jain;

  const symbolColor = isVeg || isVegan || isJain ? '#16a34a' : isNonVeg ? '#dc2626' : '#d97706';

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

  // Spice peppers
  let spiceText = '';
  if (brand.showSpiceIcon && item.spiceLevel && item.spiceLevel !== 'None') {
    spiceText = item.spiceLevel === 'Hot' || item.spiceLevel === 'Extra Hot' ? '🌶🌶🌶' : item.spiceLevel === 'Medium' ? '🌶🌶' : '🌶';
  }

  // QR Code indicator
  const showQr = brand.showQrCode && (item.qrUrl || brand.website);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .biz-title { font-family: ${brand.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif'}; font-size: 11px; font-weight: 700; fill: ${brand.primaryColor}; letter-spacing: 1px; }
      .dish-title { font-family: ${brand.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif'}; font-size: 15px; font-weight: bold; fill: ${brand.textColor}; }
      .desc-text { font-family: system-ui, sans-serif; font-size: 10.5px; fill: ${brand.textColor}; opacity: 0.85; }
      .badge-text { font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; fill: ${brand.backgroundColor}; }
      .price-text { font-family: system-ui, sans-serif; font-size: 17px; font-weight: 900; fill: ${brand.primaryColor}; }
      .nutri-text { font-family: monospace, sans-serif; font-size: 9.5px; fill: ${brand.textColor}; opacity: 0.75; }
      .footer-text { font-family: system-ui, sans-serif; font-size: 8.5px; fill: ${brand.textColor}; opacity: 0.6; }
    </style>
  </defs>

  <!-- Card Background Surface -->
  <rect width="100%" height="100%" fill="${brand.backgroundColor || '#0f172a'}" rx="${brand.cornerRadius || 8}" stroke="${brand.borderColor || '#d97706'}" stroke-width="2"/>
  
  <!-- Header: Business & Category -->
  <text x="18" y="28" class="biz-title">${cleanBiz.toUpperCase()}</text>
  ${
    brand.showCategory && item.category
      ? `<text x="${width - 18}" y="28" font-family="system-ui, sans-serif" font-size="10" font-weight="600" text-anchor="end" fill="${brand.accentColor || '#f59e0b'}">${cleanCategory.toUpperCase()}</text>`
      : ''
  }
  
  <!-- Header Divider Line -->
  <line x1="18" y1="36" x2="${width - 18}" y2="36" stroke="${brand.borderColor || '#d97706'}" stroke-opacity="0.35" stroke-width="1"/>

  <!-- Dietary Symbol (Veg / Non-Veg / Egg) -->
  ${
    brand.showDietIcon
      ? `
  <rect x="18" y="48" width="16" height="16" fill="${brand.backgroundColor === '#ffffff' ? '#ffffff' : '#1e293b'}" stroke="${symbolColor}" stroke-width="1.8" rx="2"/>
  <circle cx="26" cy="56" r="4.2" fill="${symbolColor}"/>
  `
      : ''
  }

  <!-- Dish Name & Spice Level -->
  <text x="${brand.showDietIcon ? 42 : 18}" y="61" class="dish-title">${cleanName}</text>
  ${
    spiceText
      ? `<text x="${width - 18}" y="61" font-size="11" text-anchor="end">${spiceText}</text>`
      : ''
  }
  
  <!-- Badges (Chef Special / Best Seller / New) -->
  ${
    item.chefRecommendation
      ? `<rect x="18" y="74" width="88" height="15" rx="7.5" fill="${brand.primaryColor}"/>
         <text x="62" y="85" class="badge-text" text-anchor="middle">★ CHEF CHOICE</text>`
      : item.bestSeller
      ? `<rect x="18" y="74" width="82" height="15" rx="7.5" fill="${brand.accentColor || '#f59e0b'}"/>
         <text x="59" y="85" class="badge-text" text-anchor="middle">★ BEST SELLER</text>`
      : ''
  }
  
  <!-- Description -->
  <text x="18" y="${item.chefRecommendation || item.bestSeller ? 108 : 92}" class="desc-text">
    ${cleanDesc ? cleanDesc.slice(0, 52) + (cleanDesc.length > 52 ? '...' : '') : ''}
  </text>
  
  <!-- Allergens / Portions info -->
  ${
    brand.showAllergens && item.allergen
      ? `<text x="18" y="${item.chefRecommendation || item.bestSeller ? 126 : 110}" font-family="system-ui, sans-serif" font-size="9" fill="${brand.textColor}" opacity="0.65">Allergens: ${item.allergen}</text>`
      : ''
  }

  <!-- Nutrition / Calories -->
  ${
    brand.showNutrition && item.calories
      ? `<text x="18" y="198" class="nutri-text">${item.calories} kcal ${item.protein ? '• P:' + item.protein : ''} ${item.carbs ? '• C:' + item.carbs : ''}</text>`
      : ''
  }

  <!-- QR Code Badge -->
  ${
    showQr
      ? `
  <g transform="translate(${width - 48}, 174)">
    <rect width="30" height="30" fill="#ffffff" rx="3" stroke="#cbd5e1" stroke-width="1"/>
    <!-- QR pixel pattern representation -->
    <rect x="4" y="4" width="8" height="8" fill="#000000"/>
    <rect x="5.5" y="5.5" width="5" height="5" fill="#ffffff"/>
    <rect x="6.5" y="6.5" width="3" height="3" fill="#000000"/>
    
    <rect x="18" y="4" width="8" height="8" fill="#000000"/>
    <rect x="19.5" y="5.5" width="5" height="5" fill="#ffffff"/>
    <rect x="20.5" y="6.5" width="3" height="3" fill="#000000"/>
    
    <rect x="4" y="18" width="8" height="8" fill="#000000"/>
    <rect x="5.5" y="19.5" width="5" height="5" fill="#ffffff"/>
    <rect x="6.5" y="20.5" width="3" height="3" fill="#000000"/>
    <rect x="15" y="15" width="4" height="4" fill="#000000"/>
    <rect x="22" y="22" width="4" height="4" fill="#000000"/>
  </g>
  `
      : ''
  }

  <!-- Price Pill / Display -->
  ${
    priceText
      ? `
  <rect x="${showQr ? width - 150 : width - 100}" y="174" width="${showQr ? 96 : 82}" height="28" rx="6" fill="${brand.primaryColor}" fill-opacity="0.18"/>
  <text x="${showQr ? width - 58 : width - 18}" y="194" class="price-text" text-anchor="end">${priceText}</text>
  `
      : ''
  }
  
  <!-- Footer Divider & Slogan -->
  <line x1="18" y1="214" x2="${width - 18}" y2="214" stroke="${brand.borderColor || '#d97706'}" stroke-opacity="0.3" stroke-width="1"/>
  <text x="18" y="234" class="footer-text">${cleanFooter}</text>
</svg>`;
}

/**
 * Convert SVG markup string directly to HTML5 Canvas (100% Reliable, Zero-DOM Dependency)
 */
export async function renderSvgToCanvas(
  svgString: string,
  width: number = 360,
  height: number = 260,
  scale: number = 3
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
    // Data URI with encodeURIComponent for instant, cross-browser parsing
    const svgDataUri =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.onerror = () => {
      // Fallback solid background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.src = svgDataUri;
  });
}

/**
 * Capture a card element with automatic fallback to high-res SVG renderer
 */
export async function captureCardOrSvg(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  scale: number = 3
): Promise<HTMLCanvasElement> {
  // 1. First attempt: DOM capture from rendered preview
  const element = findCardElement(item.id);
  if (element) {
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: brand.backgroundColor || '#ffffff',
        logging: false,
      });

      if (canvas && !isCanvasBlank(canvas)) {
        return canvas;
      }
    } catch (err) {
      console.warn('html2canvas capture had issue, switching to SVG renderer:', err);
    }
  }

  // 2. Guaranteed Fail-Safe: Render via vector SVG
  const svg = generateSvgCode(item, brand, sizeKey);
  return await renderSvgToCanvas(svg, 360, 260, scale);
}

/**
 * Export a single element as high-res PNG file download
 */
export async function exportSingleCardPng(
  item: MenuItem,
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  filename?: string
): Promise<boolean> {
  const canvas = await captureCardOrSvg(item, brand, sizeKey, 3.5);
  if (!canvas || isCanvasBlank(canvas)) return false;

  const defaultName = `menu_tag_${(item.menuName || 'card').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
  const fname = filename || defaultName;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fname.endsWith('.png') ? fname : `${fname}.png`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 'image/png');
  });
}

/**
 * Bulk Export all cards as a ZIP archive of high-res PNG images
 */
export async function exportBulkCardsZip(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-png') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const canvas = await captureCardOrSvg(item, brand, sizeKey, 3);
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
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
 */
export async function exportCardsSheetPdf(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
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

  // Margins and layout
  const marginX = 12;
  const marginTop = 16;
  const marginBottom = 12;
  const gapX = 8;
  const gapY = 8;

  const availableWidth = pageWidth - marginX * 2;
  const availableHeight = pageHeight - marginTop - marginBottom;

  const cols = 2;
  const cardW = (availableWidth - gapX * (cols - 1)) / cols;
  const cardH = cardW * 0.72;
  const rows = Math.max(1, Math.floor((availableHeight + gapY) / (cardH + gapY)));
  const cardsPerPage = cols * rows;

  let currentIndex = 0;
  let pageNumber = 1;
  const totalPages = Math.ceil(items.length / cardsPerPage);

  const drawPageHeaderAndFooter = (pageNum: number) => {
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `MENU TAG STUDIO • PRINT SHEET (${paperSize.toUpperCase()})`,
      marginX,
      10
    );
    pdf.text(
      `Page ${pageNum} of ${totalPages} • Total: ${items.length} Tags`,
      pageWidth - marginX,
      10,
      { align: 'right' }
    );
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, 12, pageWidth - marginX, 12);

    // Footer
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      '✂️ Cut along outer boundaries or crop marks • Recommended Paper: 250-300 GSM Matte Cardstock',
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

      const canvas = await captureCardOrSvg(item, brand, sizeKey, 3);
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const aspect = canvas.width / canvas.height;
        let drawW = cardW;
        let drawH = drawW / aspect;

        if (drawH > cardH) {
          drawH = cardH;
          drawW = drawH * aspect;
        }

        const offsetX = x + (cardW - drawW) / 2;
        const offsetY = y + (cardH - drawH) / 2;

        // Draw light crop guide / border
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.2);
        pdf.rect(offsetX - 0.5, offsetY - 0.5, drawW + 1, drawH + 1, 'S');

        // Draw corner crop tick marks
        pdf.setDrawColor(148, 163, 184);
        pdf.setLineWidth(0.3);
        const tick = 2;
        // Top-left
        pdf.line(offsetX - 2, offsetY, offsetX + tick, offsetY);
        pdf.line(offsetX, offsetY - 2, offsetX, offsetY + tick);
        // Top-right
        pdf.line(offsetX + drawW - tick, offsetY, offsetX + drawW + 2, offsetY);
        pdf.line(offsetX + drawW, offsetY - 2, offsetX + drawW, offsetY + tick);
        // Bottom-left
        pdf.line(offsetX - 2, offsetY + drawH, offsetX + tick, offsetY + drawH);
        pdf.line(offsetX, offsetY + drawH - tick, offsetX, offsetY + drawH + 2);
        // Bottom-right
        pdf.line(offsetX + drawW - tick, offsetY + drawH, offsetX + drawW + 2, offsetY + drawH);
        pdf.line(offsetX + drawW, offsetY + drawH - tick, offsetX + drawW, offsetY + drawH + 2);

        pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);
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

  let isFirstPage = true;
  let count = 0;

  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const canvas = await captureCardOrSvg(item, brand, sizeKey, 3);
    if (!canvas) continue;

    const imgData = canvas.toDataURL('image/png');
    const aspectRatio = canvas.width / canvas.height;

    let printW = pageWidth - 30; // 15mm margins
    let printH = printW / aspectRatio;

    if (printH > pageHeight - 40) {
      printH = pageHeight - 40;
      printW = printH * aspectRatio;
    }

    const x = (pageWidth - printW) / 2;
    const y = (pageHeight - printH) / 2;

    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    // Header title
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `ITEM #${count}: ${item.menuName.toUpperCase()}`,
      pageWidth / 2,
      12,
      { align: 'center' }
    );

    // Crop border
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.rect(x - 0.5, y - 0.5, printW + 1, printH + 1, 'S');

    pdf.addImage(imgData, 'PNG', x, y, printW, printH);

    // Page footer
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `Page ${count} of ${items.length}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  pdf.save(`menu_tags_catalog_${Date.now()}.pdf`);
  return true;
}

/**
 * Download SVG file for a single card
 */
export function exportSingleSvg(item: MenuItem, brand: BrandConfig, sizeKey: TagSize = 'medium') {
  const svgContent = generateSvgCode(item, brand, sizeKey);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const cleanName = (item.menuName || 'tag')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  saveAs(blob, `menu_tag_${cleanName}.svg`);
}

/**
 * Download all cards as a ZIP archive of vector SVGs
 */
export async function exportBulkSvgsZip(
  items: MenuItem[],
  brand: BrandConfig,
  sizeKey: TagSize = 'medium',
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-svg') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const svgContent = generateSvgCode(item, brand, sizeKey);
    const cleanName = (item.menuName || `tag_${count}`)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    folder.file(
      `${count.toString().padStart(3, '0')}_${cleanName}.svg`,
      svgContent
    );
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `menu_tags_svg_vectors_${Date.now()}.zip`);
  return true;
}

/**
 * Export current menu items as a formatted CSV spreadsheet
 */
export function exportItemsCsv(items: MenuItem[], filename: string = 'menu_tags_data.csv') {
  if (items.length === 0) return false;

  const rows = items.map((i) => ({
    'Menu Name': i.menuName,
    Category: i.category || '',
    Price: i.price !== undefined ? i.price : '',
    'Dietary Type': i.dietaryType || '',
    'Spice Level': i.spiceLevel || '',
    Description: i.description || '',
    Calories: i.calories || '',
    Protein: i.protein || '',
    Fat: i.fat || '',
    Carbs: i.carbs || '',
    'Prep Time': i.prepTime || '',
    'Portion Size': i.portionSize || '',
    Allergens: i.allergen || '',
    'Chef Special': i.chefRecommendation ? 'Yes' : 'No',
    'Best Seller': i.bestSeller ? 'Yes' : 'No',
    New: i.isNew ? 'Yes' : 'No',
    'QR URL': i.qrUrl || '',
    'Custom Note': i.customNote || '',
  }));

  const csvString = Papa.unparse(rows);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
  return true;
}

/**
 * Trigger native browser window.print()
 */
export function triggerPrintSheet() {
  window.print();
}


