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
    `export-card-${itemId}`,
    `preview-card-${itemId}`,
    `inspect-card-${itemId}`,
    `print-sheet-${itemId}`,
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
 * Capture a single DOM element and export as high-resolution HTML5 Canvas
 */
export async function captureElementToCanvas(
  elementOrId: string | HTMLElement,
  scale: number = 3
): Promise<HTMLCanvasElement | null> {
  const element =
    typeof elementOrId === 'string' ? findCardElement(elementOrId) : elementOrId;
  if (!element) return null;

  try {
    // Wait for fonts & rendering
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure cloned element is un-clipped and visible
        const clonedEl = clonedDoc.getElementById(element.id);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.visibility = 'visible';
          clonedEl.style.opacity = '1';
        }
      },
    });
    return canvas;
  } catch (err) {
    console.error('Canvas capture error for element:', elementOrId, err);
    return null;
  }
}

/**
 * Export a single element as high-res PNG file download
 */
export async function exportSingleCardPng(
  itemId: string,
  filename: string = 'menu-tag.png'
): Promise<boolean> {
  const canvas = await captureElementToCanvas(itemId, 3.5);
  if (!canvas) {
    console.warn(`Could not find card element for item: ${itemId}`);
    return false;
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename.endsWith('.png') ? filename : `${filename}.png`);
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
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-png') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const canvas = await captureElementToCanvas(item.id, 3);
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

  // Compute grid columns & rows based on standard tag aspect ratio
  const availableWidth = pageWidth - marginX * 2;
  const availableHeight = pageHeight - marginTop - marginBottom;

  // Let's determine column count (2 columns is optimal for standard food tags on A4)
  const cols = 2;
  const cardW = (availableWidth - gapX * (cols - 1)) / cols;
  // Standard card height based on 4:3 or 3:2 ratio ~ 0.7 aspect ratio
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

      const canvas = await captureElementToCanvas(item.id, 2.5);
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const aspect = canvas.width / canvas.height;
        let drawW = cardW;
        let drawH = drawW / aspect;

        if (drawH > cardH) {
          drawH = cardH;
          drawW = drawH * aspect;
        }

        // Center card within its grid cell
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

    const canvas = await captureElementToCanvas(item.id, 3);
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
 * Generate accurate and clean SVG vector markup for an item
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
  const symbolColor = isVeg ? '#16a34a' : isNonVeg ? '#dc2626' : '#d97706';

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
  const cleanBiz = (brand.businessName || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Card Background -->
  <rect width="100%" height="100%" fill="${brand.backgroundColor}" rx="${brand.cornerRadius}" stroke="${brand.borderColor}" stroke-width="2"/>
  
  <!-- Header / Business & Category -->
  <text x="20" y="32" font-family="${brand.fontFamily === 'serif' ? 'serif' : 'sans-serif'}" font-size="11" font-weight="700" fill="${brand.primaryColor}" letter-spacing="1">${cleanBiz.toUpperCase()}</text>
  ${
    brand.showCategory && item.category
      ? `<text x="${width - 20}" y="32" font-family="sans-serif" font-size="10" font-weight="600" text-anchor="end" fill="${brand.accentColor}">${cleanCategory.toUpperCase()}</text>`
      : ''
  }
  
  <line x1="20" y1="42" x2="${width - 20}" y2="42" stroke="${brand.borderColor}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Dietary Symbol (Veg / Non-Veg) -->
  ${
    brand.showDietIcon
      ? `
  <rect x="20" y="56" width="18" height="18" fill="none" stroke="${symbolColor}" stroke-width="1.8" rx="2"/>
  <circle cx="29" cy="65" r="4.5" fill="${symbolColor}"/>
  `
      : ''
  }

  <!-- Dish Name -->
  <text x="${brand.showDietIcon ? 46 : 20}" y="70" font-family="${brand.fontFamily === 'serif' ? 'serif' : 'sans-serif'}" font-size="16" font-weight="bold" fill="${brand.textColor}">${cleanName}</text>
  
  <!-- Spice / Badges -->
  ${
    item.chefRecommendation
      ? `<rect x="20" y="86" width="90" height="16" rx="8" fill="${brand.primaryColor}"/>
         <text x="65" y="98" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle" fill="${brand.backgroundColor}">★ CHEF CHOICE</text>`
      : ''
  }
  
  <!-- Description -->
  <text x="20" y="${item.chefRecommendation ? 120 : 105}" font-family="sans-serif" font-size="11" fill="${brand.textColor}" opacity="0.85">
    ${cleanDesc ? cleanDesc.slice(0, 50) + (cleanDesc.length > 50 ? '...' : '') : ''}
  </text>
  
  <!-- Nutrition / Calories -->
  ${
    brand.showNutrition && item.calories
      ? `<text x="20" y="195" font-family="monospace" font-size="10" fill="${brand.textColor}" opacity="0.75">${item.calories} kcal ${item.protein ? '• P:' + item.protein : ''}</text>`
      : ''
  }

  <!-- Price -->
  ${
    priceText
      ? `<text x="${width - 20}" y="200" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="end" fill="${brand.primaryColor}">${priceText}</text>`
      : ''
  }
  
  <!-- Footer Divider & Text -->
  <line x1="20" y1="215" x2="${width - 20}" y2="215" stroke="${brand.borderColor}" stroke-opacity="0.3" stroke-width="1"/>
  <text x="20" y="235" font-family="sans-serif" font-size="9" fill="${brand.textColor}" opacity="0.6">${cleanFooter}</text>
</svg>`;
}

/**
 * Download SVG file for a single card
 */
export function exportSingleSvg(item: MenuItem, brand: BrandConfig) {
  const svgContent = generateSvgCode(item, brand);
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
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  if (items.length === 0) return false;

  const zip = new JSZip();
  const folder = zip.folder('menu-tags-svg') || zip;

  let count = 0;
  for (const item of items) {
    count++;
    if (onProgress) onProgress(count, items.length);

    const svgContent = generateSvgCode(item, brand);
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

