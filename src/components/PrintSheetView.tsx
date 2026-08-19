import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Scissors,
  Download,
  CheckCircle2,
  Loader2,
  Layers,
} from 'lucide-react';
import { MenuItem, TagSize, BrandConfig, TemplateId, PrintPaperSize } from '../types';
import { MenuCard } from './MenuCard';
import { exportCardsSheetPdf } from '../utils/exporter';

interface PrintSheetViewProps {
  items: MenuItem[];
  selectedTemplate: TemplateId;
  selectedSize: TagSize;
  brandConfig: BrandConfig;
  onClose: () => void;
}

export const PrintSheetView: React.FC<PrintSheetViewProps> = ({
  items,
  selectedTemplate,
  selectedSize,
  brandConfig,
  onClose,
}) => {
  const [paperSize, setPaperSize] = useState<PrintPaperSize>('A4');
  const [showCropMarks, setShowCropMarks] = useState(true);
  const [cardsPerPage, setCardsPerPage] = useState<number>(() => {
    if (selectedSize === 'small') return 8;
    if (selectedSize === 'medium') return 6;
    if (selectedSize === 'large') return 4;
    return 4;
  });

  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState<string | null>(null);

  // Divide cards into paginated sheets
  const pages: MenuItem[][] = [];
  for (let i = 0; i < items.length; i += cardsPerPage) {
    pages.push(items.slice(i, i + cardsPerPage));
  }

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsPdfExporting(true);
    setPdfSuccess(null);
    try {
      const format = paperSize === 'LETTER' ? 'letter' : 'a4';
      await exportCardsSheetPdf(items, format);
      setPdfSuccess(`Print-ready ${paperSize} PDF downloaded!`);
      setTimeout(() => setPdfSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPdfExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-4 sm:p-6">
      {/* Non-Printable Header Bar */}
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span>Print Sheet View ({items.length} Tags • {pages.length} Pages)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Paginated sheet layout with crop marks, margins, and paper size formatting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Paper Size selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-slate-400">Paper:</span>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PrintPaperSize)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="LETTER">US Letter (8.5 × 11 in)</option>
            </select>
          </div>

          {/* Cards Per Sheet */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-slate-400">Per Sheet:</span>
            <select
              value={cardsPerPage}
              onChange={(e) => setCardsPerPage(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value={4}>4 Tags</option>
              <option value={6}>6 Tags</option>
              <option value={8}>8 Tags</option>
              <option value={10}>10 Tags</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showCropMarks}
              onChange={(e) => setShowCropMarks(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Crop Guides ✂️</span>
          </label>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfExporting}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            {isPdfExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download PDF</span>
          </button>

          {/* Native Print Button */}
          <button
            onClick={handleTriggerPrint}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {pdfSuccess && (
        <div className="max-w-5xl mx-auto mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{pdfSuccess}</span>
        </div>
      )}

      {/* Printable Sheet Canvas Container */}
      <div className="printable-sheet-root max-w-4xl mx-auto flex flex-col items-center gap-8">
        {pages.map((pageItems, pageIdx) => (
          <div
            key={pageIdx}
            className={`printable-sheet-page bg-white text-slate-900 p-8 shadow-2xl rounded-sm print:p-0 print:shadow-none ${
              paperSize === 'A4' ? 'w-[210mm] min-h-[297mm]' : 'w-[8.5in] min-h-[11in]'
            }`}
            style={{
              margin: '0 auto 2rem auto',
              boxSizing: 'border-box',
            }}
          >
            {/* Print Sheet Header */}
            <div className="border-b border-slate-200 pb-2 mb-6 flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono print:border-b">
              <span>{brandConfig.businessName || 'MENU TAG STUDIO'} • PRINT SHEET</span>
              <span>
                PAGE {pageIdx + 1} OF {pages.length} • {paperSize} • {pageItems.length} TAGS
              </span>
            </div>

            {/* Grid Layout of Menu Cards */}
            <div className="flex flex-wrap gap-6 justify-center items-start">
              {pageItems.map((item) => (
                <div key={item.id} className="relative print:break-inside-avoid">
                  <MenuCard
                    item={item}
                    sizeKey={selectedSize}
                    brand={{ ...brandConfig, showCropMarks }}
                    templateId={selectedTemplate}
                    cardElementId={`print-sheet-${item.id}`}
                    isPrintPreview={true}
                  />
                </div>
              ))}
            </div>

            {/* Sheet Footer Cut Guide */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-center text-[9px] text-slate-400 font-mono uppercase">
              ✂️ Cut along outer borders or crop marks • Recommended Paper: 250 - 300 GSM Matte Cardstock
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
