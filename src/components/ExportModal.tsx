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
  AlertCircle,
  Loader2,
  Sparkles,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { MenuItem, TagSize, BrandConfig, TemplateId } from '../types';
import {
  exportBulkCardsZip,
  exportCardsSheetPdf,
  exportCardsCatalogPdf,
  exportSingleCardPng,
  exportSingleSvg,
  exportBulkSvgsZip,
  exportItemsCsv,
} from '../utils/exporter';

interface ExportModalProps {
  items: MenuItem[];
  allItems: MenuItem[];
  selectedTemplate: TemplateId;
  selectedSize: TagSize;
  brandConfig: BrandConfig;
  onClose: () => void;
  onOpenPrintSheet: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  items,
  allItems,
  selectedTemplate,
  selectedSize,
  brandConfig,
  onClose,
  onOpenPrintSheet,
}) => {
  const [exportScope, setExportScope] = useState<'selected' | 'all'>('selected');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [singleDishId, setSingleDishId] = useState<string>(
    items[0]?.id || allItems[0]?.id || ''
  );

  const [isExporting, setIsExporting] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [exportComplete, setExportComplete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetItems = exportScope === 'selected' && items.length > 0 ? items : allItems;

  const resetStatus = () => {
    setExportComplete(null);
    setErrorMessage(null);
  };

  // 1. Export Print-Ready Grid Sheet PDF
  const handleExportSheetPdf = async () => {
    if (targetItems.length === 0) return;
    setIsExporting(true);
    resetStatus();
    setProgressMsg(`Generating printable ${paperSize.toUpperCase()} grid sheet PDF...`);

    try {
      const success = await exportCardsSheetPdf(
        targetItems,
        paperSize,
        (current, total) => {
          const pct = Math.round((current / total) * 100);
          setProgressPercent(pct);
          setProgressMsg(`Processing tag ${current} of ${total} (${pct}%)...`);
        }
      );
      if (success) {
        setExportComplete(
          `Print-ready ${paperSize.toUpperCase()} Grid Sheet PDF with ${targetItems.length} menu tags downloaded successfully!`
        );
      } else {
        setErrorMessage('Failed to generate Sheet PDF. Please ensure cards are rendered.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Export failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsLoadingFalse();
    }
  };

  // 2. Export 1-Card-Per-Page Catalog PDF
  const handleExportCatalogPdf = async () => {
    if (targetItems.length === 0) return;
    setIsExporting(true);
    resetStatus();
    setProgressMsg(`Building multi-page ${paperSize.toUpperCase()} PDF catalog...`);

    try {
      const success = await exportCardsCatalogPdf(
        targetItems,
        paperSize,
        (current, total) => {
          const pct = Math.round((current / total) * 100);
          setProgressPercent(pct);
          setProgressMsg(`Rendering catalog page ${current} of ${total} (${pct}%)...`);
        }
      );
      if (success) {
        setExportComplete(
          `Single-card catalog PDF with ${targetItems.length} pages ready and downloaded!`
        );
      } else {
        setErrorMessage('Could not generate PDF. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Export error: ${err?.message || 'Error occurred'}`);
    } finally {
      setIsLoadingFalse();
    }
  };

  // 3. Export High-Res PNG ZIP Archive
  const handleExportZip = async () => {
    if (targetItems.length === 0) return;
    setIsExporting(true);
    resetStatus();
    setProgressMsg('Rendering 300 DPI high-res card PNGs for ZIP archive...');

    try {
      const success = await exportBulkCardsZip(targetItems, (current, total) => {
        const pct = Math.round((current / total) * 100);
        setProgressPercent(pct);
        setProgressMsg(`Capturing tag ${current} of ${total} (${pct}%)...`);
      });
      if (success) {
        setExportComplete(
          `Successfully bundled and downloaded ZIP archive with ${targetItems.length} high-res PNG tags!`
        );
      } else {
        setErrorMessage('Failed to capture PNG images. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`ZIP export error: ${err?.message || 'Error'}`);
    } finally {
      setIsLoadingFalse();
    }
  };

  // 4. Export Vector SVGs ZIP Archive
  const handleExportSvgZip = async () => {
    if (targetItems.length === 0) return;
    setIsExporting(true);
    resetStatus();
    setProgressMsg('Packaging scalable vector SVG files...');

    try {
      const success = await exportBulkSvgsZip(
        targetItems,
        brandConfig,
        (current, total) => {
          const pct = Math.round((current / total) * 100);
          setProgressPercent(pct);
          setProgressMsg(`Generating SVG ${current} of ${total} (${pct}%)...`);
        }
      );
      if (success) {
        setExportComplete(
          `Downloaded ZIP archive containing ${targetItems.length} clean vector SVG files!`
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to generate SVG zip.');
    } finally {
      setIsLoadingFalse();
    }
  };

  // 5. Export Clean CSV Data File
  const handleExportCsv = () => {
    resetStatus();
    try {
      exportItemsCsv(targetItems, `menu_items_export_${Date.now()}.csv`);
      setExportComplete(
        `Exported structured CSV data file with ${targetItems.length} rows!`
      );
    } catch (err: any) {
      setErrorMessage('CSV export failed.');
    }
  };

  // 6. Single Dish PNG Download
  const handleDownloadSinglePng = async () => {
    const item = targetItems.find((i) => i.id === singleDishId) || targetItems[0];
    if (!item) return;

    setIsExporting(true);
    resetStatus();
    setProgressMsg(`Rendering high-res PNG for "${item.menuName}"...`);
    setProgressPercent(50);

    try {
      const cleanName = item.menuName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const success = await exportSingleCardPng(item.id, `menu_tag_${cleanName}.png`);
      if (success) {
        setExportComplete(`Downloaded PNG for "${item.menuName}"!`);
      } else {
        setErrorMessage(`Could not capture card "${item.menuName}".`);
      }
    } catch (err: any) {
      setErrorMessage('Download failed.');
    } finally {
      setIsLoadingFalse();
    }
  };

  // 7. Single Dish SVG Download
  const handleDownloadSingleSvg = () => {
    const item = targetItems.find((i) => i.id === singleDishId) || targetItems[0];
    if (!item) return;
    resetStatus();
    exportSingleSvg(item, brandConfig);
    setExportComplete(`Downloaded SVG vector for "${item.menuName}"!`);
  };

  const setIsLoadingFalse = () => {
    setTimeout(() => {
      setIsExporting(false);
      setProgressPercent(0);
      setProgressMsg('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto print:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>Export & Print Menu Cards ({targetItems.length} Items)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose print-ready PDF sheets, high-resolution PNG image bundles, vector SVGs, or spreadsheet data.
          </p>
        </div>

        {/* Scope & Settings Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          {/* Target Scope */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Export Scope:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setExportScope('selected')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  exportScope === 'selected'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Selected ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  exportScope === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({allItems.length})
              </button>
            </div>
          </div>

          {/* Paper Size */}
          <div className="flex items-center gap-2 justify-start sm:justify-end">
            <span className="text-slate-400 font-semibold">PDF Paper:</span>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as 'a4' | 'letter')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-medium"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">US Letter (8.5 × 11 in)</option>
            </select>
          </div>
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

        {/* Completion Notice */}
        {exportComplete && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{exportComplete}</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 1. PDF Print Sheet Grid */}
          <button
            onClick={handleExportSheetPdf}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm">Print Sheet PDF</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                Recommended
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Multi-card grid on {paperSize.toUpperCase()} with cutting crop marks for printing on cardstock.
            </p>
          </button>

          {/* 2. PNG ZIP Bundle */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileArchive className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">ZIP of High-Res PNGs</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Download all {targetItems.length} cards as separate 300 DPI PNG images in a ZIP archive.
            </p>
          </button>

          {/* 3. Multi-Page PDF Catalog */}
          <button
            onClick={handleExportCatalogPdf}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">1-Card-Per-Page PDF</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Multi-page PDF document with one large centered card per {paperSize.toUpperCase()} page.
            </p>
          </button>

          {/* 4. Interactive Print View */}
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
            <h3 className="font-bold text-slate-100 text-sm">Interactive Print Sheet</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Preview paginated sheets on screen and trigger instant browser print.
            </p>
          </button>

          {/* 5. Vector SVG ZIP */}
          <button
            onClick={handleExportSvgZip}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Vector SVGs (ZIP)</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Pure scalable vector graphics for laser engravers and professional print shops.
            </p>
          </button>

          {/* 6. Clean CSV Export */}
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">CSV Data Backup</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Download current edited menu items and metadata as a standard CSV file.
            </p>
          </button>
        </div>

        {/* Single Item Quick Download Section */}
        {targetItems.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Download Single Dish Tag:</span>
              <span className="text-[10px] text-slate-400">Quick Single Item</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={singleDishId}
                onChange={(e) => setSingleDishId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
              >
                {targetItems.map((item, idx) => (
                  <option key={item.id} value={item.id}>
                    #{idx + 1}: {item.menuName} ({item.category || 'General'})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSinglePng}
                  disabled={isExporting}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>PNG</span>
                </button>

                <button
                  onClick={handleDownloadSingleSvg}
                  disabled={isExporting}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>SVG</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
