import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Search,
  Box,
  Layers,
  Utensils,
  PartyPopper,
  Building,
  Flame,
  Crown,
} from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';
import { TemplateId, TemplateCategory } from '../types';

interface TemplateGalleryProps {
  selectedTemplate: TemplateId;
  onApplyTemplate: (id: TemplateId) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onApplyTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tmpl) => {
      const matchesCategory = activeCategory === 'all' || tmpl.category === activeCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.suitableFor.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'premium':
        return <Crown className="w-3.5 h-3.5" />;
      case 'events':
        return <PartyPopper className="w-3.5 h-3.5" />;
      case 'hospitality':
        return <Building className="w-3.5 h-3.5" />;
      case 'food-catering':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'modern-digital':
        return <Box className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 print:hidden">
      {/* Header & Description */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>30 Professionally Designed Card Architectures</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Curated Pro Menu Tag & Label Library
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          From 5-star hotel buffets and royal Indian banquets to modern 3D glassmorphic displays.
          Select any template to instantly render your menu with industry-grade typography and print alignment.
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as TemplateCategory)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 30 templates, venues..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTemplates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          const is3D = tmpl.is3D;

          return (
            <div
              key={tmpl.id}
              className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group relative overflow-hidden ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              {/* 3D Badge if applicable */}
              {is3D && (
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Box className="w-2.5 h-2.5" />
                    <span>3D STYLE</span>
                  </span>
                </div>
              )}

              <div className="space-y-3.5">
                {/* Visual Realistic Mini Card Preview */}
                <div
                  className={`h-32 rounded-xl p-3.5 flex flex-col justify-between text-xs font-bold transition-all relative overflow-hidden shadow-md ${
                    tmpl.previewBg
                  } ${is3D ? 'shadow-lg ring-1 ring-white/10' : ''}`}
                >
                  {/* Decorative Accents inside mini preview */}
                  {tmpl.id === 'laura-fine-dining' && (
                    <>
                      <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-amber-400" />
                      <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-amber-400" />
                      <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-amber-400" />
                      <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-amber-400" />
                    </>
                  )}
                  {tmpl.id === 'bistro-cafe' && (
                    <div className="absolute inset-1 border border-emerald-600/40 rounded-lg pointer-events-none" />
                  )}
                  {tmpl.id === 'taco-truck' && (
                    <>
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />
                    </>
                  )}
                  {tmpl.id === 'indian-royal' && (
                    <div className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-amber-400/50 rounded pointer-events-none" />
                  )}
                  {tmpl.id === 'glassmorphism-3d' && (
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-cyan-400/30 rounded-full blur-xl pointer-events-none" />
                  )}
                  {tmpl.id === 'futuristic-tech' && (
                    <div className="absolute top-1.5 right-1.5 font-mono text-[7px] text-emerald-400/80">
                      [SYS-01]
                    </div>
                  )}

                  {/* Header Row */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="uppercase text-[9px] tracking-wider font-extrabold opacity-80 truncate max-w-[120px]">
                      {tmpl.defaultBrandConfig.businessName || 'BRAND'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-1 ring-white/40" />
                      {tmpl.id === 'indian-royal' && (
                        <span className="text-[8px] px-1 rounded bg-amber-400/30 text-amber-200 font-mono">
                          VEG
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dish Title */}
                  <div className="relative z-10">
                    <h4 className="font-bold text-xs sm:text-sm leading-tight truncate">
                      Signature House Special
                    </h4>
                    <p className="text-[10px] opacity-75 font-normal line-clamp-1 mt-0.5">
                      Chef crafted fresh preparation
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="flex justify-between items-end text-[10px] font-mono relative z-10 pt-1 border-t border-current/20">
                    <span className="opacity-80">280 kcal</span>
                    <span className="font-black text-xs px-1.5 py-0.5 rounded bg-black/20 text-current">
                      {tmpl.defaultBrandConfig.currencySymbol || '₹'}350
                    </span>
                  </div>
                </div>

                {/* Template Info & Metadata */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-slate-100 text-sm">{tmpl.name}</h3>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">{tmpl.tagline}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              </div>

              {/* Bottom Venue Tags & Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-wrap gap-1 min-h-[22px]">
                  {tmpl.suitableFor.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800/80"
                    >
                      {s}
                    </span>
                  ))}
                  {tmpl.suitableFor.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 font-mono">
                      +{tmpl.suitableFor.length - 3}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onApplyTemplate(tmpl.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Active Template (In Preview)</span>
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

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-sm text-slate-300 font-semibold">No templates found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500">Try clearing your search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
