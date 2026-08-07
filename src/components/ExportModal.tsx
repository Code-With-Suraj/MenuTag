import React, { useState } from 'react';
import {
  Download,
  FileArchive,
  FileText,
  Image,
  Code,
  Printer,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { MenuItem, TagSize, BrandConfig, TemplateId } from '../types';
import {
  exportBulkCardsZip,
  exportCardsPdf,
  exportSingleCardPng,
  exportSingleSvg,
  triggerPrintSheet,
} from '../utils/exporter';

interface ExportModalProps {
  items: MenuItem[];
  selectedTemplate: TemplateId;
  selectedSize: TagSize;
  brandConfig: BrandConfig;
  onClose: () => void;
  onOpenPrintSheet: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  items,
  selectedTemplate,
  selectedSize,
  brandConfig,
  onClose,
  onOpenPrintSheet,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [exportComplete, setExportComplete] = useState<string | null>(null);

  // 1. Export ZIP of PNG images
  const handleExportZip = async () => {
    if (items.length === 0) return;
    setIsExporting(true);
    setExportComplete(null);
    setProgressMsg('Rendering high-res card PNGs for ZIP archive...');

    const elements = items.map((i) => ({
      id: `preview-card-${i.id}`,
      name: i.menuName,
    }));

    try {
      await exportBulkCardsZip(elements, (current, total) => {
        const pct = Math.round((current / total) * 100);
        setProgressPercent(pct);
        setProgressMsg(`Capturing tag ${current} of ${total} (${pct}%)...`);
      });
      setExportComplete(`Successfully generated ZIP archive with ${items.length} PNG tags!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingFalse();
    }
  };

  // 2. Export PDF Document
  const handleExportPdf = async () => {
    if (items.length === 0) return;
    setIsExporting(true);
    setExportComplete(null);
    setProgressMsg('Building printable PDF catalog...');

    const cardIds = items.map((i) => `preview-card-${i.id}`);

    try {
      await exportCardsPdf(cardIds, 'a4', (current, total) => {
        const pct = Math.round((current / total) * 100);
        setProgressPercent(pct);
        setProgressMsg(`Processing page ${current} of ${total} (${pct}%)...`);
      });
      setExportComplete(`PDF file with ${items.length} menu tags ready and downloaded!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingFalse();
    }
  };

  // 3. Export Single Item SVG
  const handleExportFirstSvg = () => {
    if (items[0]) {
      exportSingleSvg(items[0], brandConfig);
      setExportComplete(`Downloaded vector SVG for "${items[0].menuName}"`);
    }
  };

  const setIsLoadingFalse = () => {
    setTimeout(() => {
      setIsExporting(false);
      setProgressPercent(0);
      setProgressMsg('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 print:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>Export & Print Menu Tags ({items.length} Items)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred format for printing or digital presentation.
          </p>
        </div>

        {/* Progress Bar */}
        {isExporting && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>{progressMsg}</span>
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Completion Message */}
        {exportComplete && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{exportComplete}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Option 1: ZIP PNGs */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileArchive className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">ZIP Archive (PNGs)</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Download all {items.length} card images as high-res PNG files inside a ZIP folder.
            </p>
          </button>

          {/* Option 2: PDF Document */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Multi-Page PDF Catalog</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Print-ready PDF with centered tags on A4 pages.
            </p>
          </button>

          {/* Option 3: Print Sheet View */}
          <button
            onClick={() => {
              onClose();
              onOpenPrintSheet();
            }}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">A4 Sheet Grid with Crop Marks</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Direct browser printing on cardstock with crop marks for cutting.
            </p>
          </button>

          {/* Option 4: SVG Vector */}
          <button
            onClick={handleExportFirstSvg}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">SVG Vector Code</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Export clean vector markup for professional print shops.
            </p>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
