import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Scissors,
  Maximize2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { MenuItem, TagSize, BrandConfig, TemplateId, PrintPaperSize } from '../types';
import { MenuCard } from './MenuCard';

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

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-4 sm:p-6">
      {/* Non-Printable Header Bar */}
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span>Print Sheet Layout ({items.length} Tags)</span>
          </h2>
          <p className="text-xs text-slate-400">
            A4 / US Letter sheet grid with crop marks for clean scissor/paper-cutter cutting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Paper Size selector */}
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value as PrintPaperSize)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
          >
            <option value="A4">A4 Sheet (210 × 297 mm)</option>
            <option value="LETTER">US Letter Sheet (8.5 × 11 in)</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showCropMarks}
              onChange={(e) => setShowCropMarks(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Crop Guides ✂️</span>
          </label>

          <button
            onClick={handleTriggerPrint}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet Now</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas Container */}
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div
          className={`bg-white text-slate-900 p-8 shadow-2xl rounded-sm print:p-0 print:shadow-none ${
            paperSize === 'A4' ? 'w-[210mm] min-h-[297mm]' : 'w-[8.5in] min-h-[11in]'
          }`}
          style={{
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {/* Print Sheet Banner */}
          <div className="border-b border-slate-200 pb-2 mb-6 flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono print:border-b">
            <span>{brandConfig.businessName || 'MENU TAG STUDIO'} • PRINT SHEET</span>
            <span>PAPER: {paperSize} • {items.length} TAGS</span>
          </div>

          {/* Grid Layout of Menu Cards */}
          <div className="flex flex-wrap gap-4 justify-center items-start">
            {items.map((item) => (
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
      </div>
    </div>
  );
};
