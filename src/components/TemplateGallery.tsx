import React from 'react';
import { LayoutGrid, Sparkles, Check, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { TemplateId } from '../types';

interface TemplateGalleryProps {
  selectedTemplate: TemplateId;
  onApplyTemplate: (id: TemplateId) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onApplyTemplate,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6 print:hidden">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Pro Design Library</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          8 Professionally Designed Menu Tag Templates
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Each template is pre-configured with industry-standard typography, color palettes, border finishes, and visual hierarchy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all group ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Visual Preview Box */}
                <div
                  className={`h-28 rounded-xl p-3 flex flex-col justify-between text-xs font-bold shadow-inner ${tmpl.previewBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="uppercase text-[9px] tracking-wider opacity-70">
                      {tmpl.defaultBrandConfig.businessName || 'BRAND'}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm">Delicious Menu Dish Name</h4>
                    <p className="text-[10px] opacity-80 font-normal line-clamp-1">
                      Chef special description note
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-[11px] font-mono">
                    <span>250 kcal</span>
                    <span className="font-bold">{tmpl.defaultBrandConfig.currencySymbol || '₹'}280</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{tmpl.name}</h3>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{tmpl.tagline}</p>
                  <p className="text-xs text-slate-400 mt-1">{tmpl.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {tmpl.suitableFor.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onApplyTemplate(tmpl.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Template</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
