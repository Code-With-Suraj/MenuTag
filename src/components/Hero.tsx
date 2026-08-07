import React, { useState } from 'react';
import {
  FileUp,
  Sparkles,
  Printer,
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
  Coffee,
  Crown,
  Flame,
  UtensilsCrossed,
  QrCode,
  Coins,
  CheckCircle2,
  Scissors,
  Download,
  Check,
  Building2,
  Wine,
  PartyPopper,
  FileSpreadsheet,
  Gauge,
  Lock,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { TemplateId } from '../types';

interface HeroProps {
  onLoadSample: (sampleType?: string) => void;
  onScrollToUploader: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoadSample, onScrollToUploader }) => {
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<TemplateId>('luxury-restaurant');
  const [previewCurrency, setPreviewCurrency] = useState('$');
  const [showPricePreview, setShowPricePreview] = useState(true);

  const activeTemplateDef = TEMPLATES.find((t) => t.id === activePreviewTemplate) || TEMPLATES[0];

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 print:hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HERO MAIN HEADER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>TagChef v2.0 • Bulk Food Tag & Menu Card Studio</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-[10px] uppercase font-bold tracking-wider">
                100% Browser Client-Side
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bulk Generate Professional{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Menu Tags & Buffet Display Cards
              </span>{' '}
              in Seconds
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Upload your CSV spreadsheet from Excel, Google Sheets or POS system and automatically generate print-ready buffet labels, counter tent cards, and QR menu tags. Features automatic Veg/Non-Veg symbols, allergen badges, multi-currency support, and A4 print sheet layouts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onScrollToUploader}
                className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileUp className="w-4 h-4 text-slate-950" />
                <span>Upload CSV Spreadsheet</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => onLoadSample()}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/40 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try Instant Demo Data</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Login Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Server Uploads (100% Private)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Print-Ready 300 DPI PDF/PNG</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Card Studio Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Interactive Live Tag Preview
                  </span>
                </div>
                
                {/* Currency Quick Toggle */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400">Currency:</span>
                  <select
                    value={previewCurrency}
                    onChange={(e) => setPreviewCurrency(e.target.value)}
                    className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
              </div>

              {/* Template Quick Selection Switcher */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {TEMPLATES.slice(0, 4).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setActivePreviewTemplate(tmpl.id);
                      if (tmpl.defaultBrandConfig.currencySymbol) {
                        setPreviewCurrency(tmpl.defaultBrandConfig.currencySymbol);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                      activePreviewTemplate === tmpl.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>

              {/* Simulated Tag Box */}
              <div
                className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between shadow-xl min-h-[200px] ${activeTemplateDef.previewBg}`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-80 font-bold mb-1">
                    <span>{activeTemplateDef.defaultBrandConfig.businessName || 'L’AURA FINE DINING'}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" title="Vegetarian" />
                  </div>

                  <h3 className="text-lg font-bold font-serif leading-tight">
                    Paneer Tikka Angara
                  </h3>

                  <p className="text-xs opacity-80 mt-1 line-clamp-2">
                    Cottage cheese marinated in clay-oven spices, served with mint chutney and charred bell peppers.
                  </p>
                </div>

                <div className="pt-3 border-t border-current/20 flex items-end justify-between text-xs mt-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span>🌶🌶 Medium</span>
                      <span>•</span>
                      <span>320 kcal</span>
                    </div>
                    <div className="text-[9px] opacity-75">Allergens: Dairy, Nuts</div>
                  </div>

                  <div className="text-right">
                    {showPricePreview ? (
                      <span className="text-lg font-black font-mono">
                        {previewCurrency === 'AED' ? 'AED 280' : `${previewCurrency}280`}
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-60 font-mono">[Price Hidden]</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Control Strip */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setShowPricePreview(!showPricePreview)}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Price Display: <strong>{showPricePreview ? 'Visible' : 'Hidden'}</strong></span>
                </button>

                <button
                  onClick={() => onLoadSample()}
                  className="text-amber-400 hover:underline font-semibold text-xs flex items-center gap-1"
                >
                  <span>Apply Theme to Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* QUICK BUSINESS PRESETS BAR */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-2">
            <div>
              <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Instant Preset Datasets & Layouts</span>
              </h2>
              <p className="text-xs text-slate-400">Click any venue type to pre-fill the workspace with realistic menu items and matching styling.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => onLoadSample('fine-dining')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Dark Gold</span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-100 group-hover:text-amber-300">Luxury Fine Dining</div>
                <div className="text-[10px] text-slate-400">Starters, Mains, Wine List</div>
              </div>
            </button>

            <button
              onClick={() => onLoadSample('cafe')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Coffee className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Pastel Mint</span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-100 group-hover:text-emerald-300">Cafe & Bakery</div>
                <div className="text-[10px] text-slate-400">Espresso, Croissants, Desserts</div>
              </div>
            </button>

            <button
              onClick={() => onLoadSample('hotel')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/60 transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <UtensilsCrossed className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">Clean White</span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-100 group-hover:text-sky-300">Hotel Grand Buffet</div>
                <div className="text-[10px] text-slate-400">Live Counters, Tent Cards</div>
              </div>
            </button>

            <button
              onClick={() => onLoadSample('street')}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/60 transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">Retro Bold</span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-100 group-hover:text-orange-300">Food Truck & Festival</div>
                <div className="text-[10px] text-slate-400">Burgers, Tacos, Street Food</div>
              </div>
            </button>
          </div>
        </div>

        {/* HIGH-DENSITY FEATURE MATRIX & CAPABILITIES */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Built for Modern Hospitality Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Everything you need to manage food tag printing at scale without hiring a graphic designer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">Dietary & Allergen Auto-Tagging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically detects Veg 🟢, Non-Veg 🔴, Egg 🥚, Vegan 🌱, and Jain 🪷 tags directly from your CSV text. Renders allergen icons for dairy, gluten, nuts, soy, and shellfish.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">Price Display & Multi-Currency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle prices ON or OFF for buffet displays where price tags aren't needed. Instantly change currency symbols between USD ($), INR (₹), EUR (€), GBP (£), JPY (¥), AED, SAR, and custom codes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">Live Scannable QR Codes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Include web links in your CSV to generate real vector QR codes on each card. Guests can scan tags to view full allergen disclosures, chef stories, or digital ordering menus.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">A4 / Letter Print Sheet Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates neatly aligned grid print sheets (2x4 or 3x5 layout) with optional corner crop marks and folding guidelines for table tents. Print directly or save as PDF.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">Batch ZIP & Vector SVG Exports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need individual files for digital signage or social media? Download a zipped package containing all high-resolution PNG images or individual vector SVGs with one click.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-100">100% Private & Browser Client-Side</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your menu items, secret recipes, and pricing remain completely private. All image rendering, barcode generation, and PDF export logic run inside your browser engine.
              </p>
            </div>

          </div>
        </div>

        {/* STEP-BY-STEP WORKFLOW FLOW */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              How TagChef Works in 4 Simple Steps
            </h2>
            <p className="text-xs text-slate-400">From spreadsheet data to laminated buffet tags in under 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="text-amber-400 font-mono text-2xl font-black">01</div>
              <h4 className="font-bold text-slate-100 text-sm">Upload Menu CSV</h4>
              <p className="text-xs text-slate-400">Drop your `.csv` file exported from Excel, Google Sheets, or POS system.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="text-amber-400 font-mono text-2xl font-black">02</div>
              <h4 className="font-bold text-slate-100 text-sm">Auto-Validate Data</h4>
              <p className="text-xs text-slate-400">Review missing prices, diet tags, calories, and spice levels in the live validator.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="text-amber-400 font-mono text-2xl font-black">03</div>
              <h4 className="font-bold text-slate-100 text-sm">Pick Theme & Size</h4>
              <p className="text-xs text-slate-400">Choose from 8 pro templates, select card sizes (Compact, Medium, Tent Card).</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <div className="text-amber-400 font-mono text-2xl font-black">04</div>
              <h4 className="font-bold text-slate-100 text-sm">Print or Export ZIP</h4>
              <p className="text-xs text-slate-400">Click print A4 sheet, export crisp PDF, or download a ZIP of high-res PNG images.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

