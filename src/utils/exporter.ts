import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { MenuItem, BrandConfig } from '../types';
import { formatPrice } from './format';

/**
 * Capture a single DOM element by ID and export as PNG Blob or data URL
 */
export async function captureElementToCanvas(
  elementId: string,
  scale: number = 3
): Promise<HTMLCanvasElement | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas;
  } catch (err) {
    console.error('Canvas capture failed:', err);
    return null;
  }
}

/**
 * Export a single element as PNG file download
 */
export async function exportSingleCardPng(elementId: string, filename: string = 'menu-tag.png') {
  const canvas = await captureElementToCanvas(elementId, 3);
  if (!canvas) return false;

  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, filename.endsWith('.png') ? filename : `${filename}.png`);
    }
  }, 'image/png');

  return true;
}

/**
 * Bulk Export all rendered cards as a ZIP file of PNGs
 */
export async function exportBulkCardsZip(
  cardElements: { id: string; name: string }[],
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  const zip = new JSZip();
  const folder = zip.folder('menu-tags-png') || zip;

  let count = 0;
  for (const item of cardElements) {
    count++;
    if (onProgress) onProgress(count, cardElements.length);

    const canvas = await captureElementToCanvas(item.id, 2.5);
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const cleanName = item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      folder.file(`${count.toString().padStart(3, '0')}_${cleanName}.png`, base64Data, { base64: true });
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `menu_tags_bulk_${Date.now()}.zip`);
  return true;
}

/**
 * Export all cards to a multi-page PDF document
 */
export async function exportCardsPdf(
  cardElementIds: string[],
  paperSize: 'a4' | 'letter' = 'a4',
  onProgress?: (current: number, total: number) => void
): Promise<boolean> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let isFirstPage = true;
  let count = 0;

  for (const elId of cardElementIds) {
    count++;
    if (onProgress) onProgress(count, cardElementIds.length);

    const canvas = await captureElementToCanvas(elId, 2.5);
    if (!canvas) continue;

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate display dimensions maintaining aspect ratio centered on page
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const aspectRatio = canvasWidth / canvasHeight;

    let printW = pageWidth - 20; // 10mm margins on sides
    let printH = printW / aspectRatio;

    if (printH > pageHeight - 20) {
      printH = pageHeight - 20;
      printW = printH * aspectRatio;
    }

    const x = (pageWidth - printW) / 2;
    const y = (pageHeight - printH) / 2;

    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    pdf.addImage(imgData, 'PNG', x, y, printW, printH);
  }

  pdf.save(`menu_tags_catalog_${Date.now()}.pdf`);
  return true;
}

/**
 * Generate lightweight SVG vector markup string for an item
 */
export function generateSvgCode(item: MenuItem, brand: BrandConfig): string {
  const width = 300;
  const height = 200;
  const isVeg = item.dietaryType === 'Veg';
  const symbolColor = isVeg ? '#16a34a' : '#dc2626';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${brand.backgroundColor}" rx="${brand.cornerRadius}" stroke="${brand.borderColor}" stroke-width="2"/>
  
  <!-- Header / Business -->
  <text x="20" y="30" font-family="sans-serif" font-size="12" font-weight="600" fill="${brand.primaryColor}">${brand.businessName.toUpperCase()}</text>
  <text x="${width - 30}" y="30" font-family="sans-serif" font-size="11" fill="${brand.textColor}">${item.category || ''}</text>
  
  <!-- Veg / NonVeg Symbol -->
  <rect x="20" y="45" width="16" height="16" fill="none" stroke="${symbolColor}" stroke-width="1.5" rx="2"/>
  <circle cx="28" cy="53" r="4" fill="${symbolColor}"/>
  
  <!-- Dish Name -->
  <text x="44" y="58" font-family="serif" font-size="16" font-weight="bold" fill="${brand.textColor}">${item.menuName}</text>
  
  <!-- Description -->
  <text x="20" y="85" font-family="sans-serif" font-size="10" fill="${brand.textColor}" opacity="0.8">${item.description ? item.description.slice(0, 60) + '...' : ''}</text>
  
  <!-- Price -->
  <text x="${width - 20}" y="150" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="end" fill="${brand.primaryColor}">${brand.showPrice && item.price ? formatPrice(item.price, brand.currencySymbol) : ''}</text>
  
  <!-- Footer -->
  <line x1="20" y1="170" x2="${width - 20}" y2="170" stroke="${brand.borderColor}" stroke-width="1"/>
  <text x="20" y="185" font-family="sans-serif" font-size="9" fill="${brand.textColor}" opacity="0.6">${brand.footerText}</text>
</svg>`;
}

/**
 * Download SVG file for a card
 */
export function exportSingleSvg(item: MenuItem, brand: BrandConfig) {
  const svgContent = generateSvgCode(item, brand);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const cleanName = item.menuName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  saveAs(blob, `menu_tag_${cleanName}.svg`);
}

/**
 * Trigger native browser window.print() for print sheet
 */
export function triggerPrintSheet() {
  window.print();
}
