import React from 'react';
import {
  Palette,
  Maximize2,
  Building,
  Sliders,
  Eye,
  Type,
  Layout,
  Upload,
  RotateCcw,
  Sparkles,
  Scissors,
  Layers,
  DollarSign,
  Coins,
  Check,
} from 'lucide-react';
import { formatPrice } from '../utils/format';
import {
  TemplateId,
  TagSize,
  BrandConfig,
  BorderStyleType,
  FontFamilyType,
} from '../types';
import { TEMPLATES, TAG_SIZES } from '../data/templates';

interface CustomizerProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  selectedSize: TagSize;
  onSelectSize: (size: TagSize) => void;
  brandConfig: BrandConfig;
  onUpdateBrandConfig: (updated: Partial<BrandConfig>) => void;
  onResetToTemplateDefaults: () => void;
}

export const Customizer: React.FC<CustomizerProps> = ({
  selectedTemplate,
  onSelectTemplate,
  selectedSize,
  onSelectSize,
  brandConfig,
  onUpdateBrandConfig,
  onResetToTemplateDefaults,
}) => {
  const [activeTab, setActiveTab] = React.useState<'templates' | 'size' | 'branding' | 'colors' | 'toggles'>(
    'templates'
  );
  const [customizerCategory, setCustomizerCategory] = React.useState<string>('all');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateBrandConfig({ logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl print:hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>2. Design & Branding Customizer</span>
          </h2>
          <p className="text-xs text-slate-400">
            Choose templates, dimensions, brand colors, typography, and card elements.
          </p>
        </div>

        <button
          onClick={onResetToTemplateDefaults}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-800 border border-slate-800 flex items-center gap-1 transition-colors"
          title="Reset colors and fonts to chosen template default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Theme</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-1 py-3 no-scrollbar text-xs border-b border-slate-800">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'templates'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>26 Pro Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('size')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'size'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Card Size & Tent</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'branding'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Brand & Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'colors'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors & Style</span>
        </button>

        <button
          onClick={() => setActiveTab('toggles')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 transition-colors ${
            activeTab === 'toggles'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Display Toggles</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="pt-4">
        {/* 1. TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Signature Showcase Bar (From Image Reference) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-emerald-950/40 border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Signature Showcase Templates (Photo Reference)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Apply</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'laura-fine-dining',
                    title: 'L’AURA',
                    sub: 'Gold Filigree',
                    dish: 'Paneer Tikka',
                    bg: 'bg-[#0a1128] text-amber-300 border-amber-500/80',
                    icon: '👑',
                  },
                  {
                    id: 'bistro-cafe',
                    title: 'BISTRO CAFÉ',
                    sub: 'Sage Mint Arched',
                    dish: 'Truffle Pasta',
                    bg: 'bg-[#d8eee2] text-[#1b4332] border-emerald-500/80',
                    icon: '🌿',
                  },
                  {
                    id: 'la-patisserie',
                    title: 'La Pâtisserie',
                    sub: 'French Bakery',
                    dish: 'Chocolate Éclair',
                    bg: 'bg-[#faeed4] text-[#451a03] border-amber-700/80',
                    icon: '🥐',
                  },
                  {
                    id: 'taco-truck',
                    title: 'TACO TRUCK',
                    sub: 'Fiery Blackboard',
                    dish: 'Mexican Tacos',
                    bg: 'bg-zinc-950 text-amber-400 border-orange-500/80',
                    icon: '🌮',
                  },
                ].map((item) => {
                  const isSel = selectedTemplate === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTemplate(item.id as any)}
                      className={`p-2 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSel
                          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md bg-amber-500/20'
                          : 'border-slate-700/80 bg-slate-900/80 hover:border-slate-600'
                      }`}
                    >
                      <div className={`h-8 rounded-lg px-2 flex items-center justify-between text-[11px] font-bold border ${item.bg}`}>
                        <span className="truncate">{item.title}</span>
                        <span>{item.icon}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-300 font-medium truncate">{item.sub}</span>
                        {isSel && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: 'All Templates (30)' },
                { id: 'premium', label: '👑 Premium & Luxury (6)' },
                { id: 'hospitality', label: '🌿 Bistros & Cafes (6)' },
                { id: 'food-catering', label: '🍽️ Bakery & Food (9)' },
                { id: 'events', label: '🎉 Events & Weddings (5)' },
                { id: 'modern-digital', label: '🧊 Modern & 3D (4)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCustomizerCategory(c.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    customizerCategory === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {TEMPLATES.filter(
                (tmpl) => customizerCategory === 'all' || tmpl.category === customizerCategory
              ).map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg scale-[1.01]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    {tmpl.is3D && (
                      <span className="absolute top-1.5 right-1.5 text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 z-10">
                        3D
                      </span>
                    )}

                    <div>
                      <div
                        className={`h-12 rounded-lg p-2 flex items-center justify-between text-xs font-bold ${tmpl.previewBg}`}
                      >
                        <span className="truncate max-w-[100px]">{tmpl.name}</span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-200 mt-2 line-clamp-1">{tmpl.tagline}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{tmpl.description}</p>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                      {tmpl.suitableFor.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CARD SIZE & TENT CARDS TAB */}
        {activeTab === 'size' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(TAG_SIZES) as TagSize[]).map((sizeKey) => {
                const info = TAG_SIZES[sizeKey];
                const isSelected = selectedSize === sizeKey;
                return (
                  <div
                    key={sizeKey}
                    onClick={() => onSelectSize(sizeKey)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{info.label}</span>
                      {info.isTentCard && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                          Tent Card
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-amber-400 mt-1">
                      {info.widthInInches}" × {info.heightInInches}"
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{info.description}</p>
                  </div>
                );
              })}
            </div>

            {selectedSize === 'custom' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Custom Width (Inches):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="12"
                    value={brandConfig.customWidthInches || 3.5}
                    onChange={(e) =>
                      onUpdateBrandConfig({ customWidthInches: parseFloat(e.target.value) || 3.5 })
                    }
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 text-white w-24 text-center"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Custom Height (Inches):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="12"
                    value={brandConfig.customHeightInches || 2.5}
                    onChange={(e) =>
                      onUpdateBrandConfig({ customHeightInches: parseFloat(e.target.value) || 2.5 })
                    }
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 text-white w-24 text-center"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. BRANDING & LOGO TAB */}
        {activeTab === 'branding' && (
          <div className="space-y-4 text-xs">
            {/* Header Toggles: Show Logo & Show Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={brandConfig.showLogo !== false}
                  onChange={(e) => onUpdateBrandConfig({ showLogo: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200 font-semibold">Show Brand Logo / Emblem Icon</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={brandConfig.showBusinessName !== false}
                  onChange={(e) => onUpdateBrandConfig({ showBusinessName: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200 font-semibold">Show Business / Restaurant Name</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Business Name / Restaurant:</label>
                <input
                  type="text"
                  value={brandConfig.businessName}
                  onChange={(e) => onUpdateBrandConfig({ businessName: e.target.value })}
                  placeholder="e.g. L'Aura Fine Dining"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Upload Brand Logo / Image:</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="brand-logo-input"
                  />
                  <label
                    htmlFor="brand-logo-input"
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer flex items-center gap-1.5 font-medium"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{brandConfig.logoUrl ? 'Change Image' : 'Upload Custom Logo'}</span>
                  </label>
                  {brandConfig.logoUrl && (
                    <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                      <img
                        src={brandConfig.logoUrl}
                        alt="Logo preview"
                        className="h-6 w-auto max-w-[60px] object-contain rounded bg-slate-900 px-1"
                      />
                      <button
                        onClick={() => onUpdateBrandConfig({ logoUrl: undefined })}
                        className="text-[11px] text-red-400 hover:underline px-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logo Emblem Presets */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Or Select Brand Emblem Icon:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'crown', label: '👑 Crown' },
                  { id: 'chef-hat', label: '👨‍🍳 Chef Hat' },
                  { id: 'utensils', label: '🍴 Utensils' },
                  { id: 'coffee', label: '☕ Coffee' },
                  { id: 'cake', label: '🍰 Bakery' },
                  { id: 'leaf', label: '🌱 Organic' },
                  { id: 'sparkles', label: '✨ Luxury' },
                  { id: 'flame', label: '🔥 Grill/Spicy' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateBrandConfig({ logoEmblem: item.id, logoUrl: undefined, showLogo: true })}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      (brandConfig.logoEmblem === item.id && !brandConfig.logoUrl)
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Footer Slogan / Text:</label>
                <input
                  type="text"
                  value={brandConfig.footerText || ''}
                  onChange={(e) => onUpdateBrandConfig({ footerText: e.target.value })}
                  placeholder="e.g. Executive Chef Selection • Fresh Daily"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Website / QR Link:</label>
                <input
                  type="text"
                  value={brandConfig.website || ''}
                  onChange={(e) => onUpdateBrandConfig({ website: e.target.value })}
                  placeholder="e.g. https://www.laurarestaurant.com"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. COLORS & STYLING TAB */}
        {activeTab === 'colors' && (
          <div className="space-y-4 text-xs">
            {/* Color Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Primary Color</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.primaryColor}
                    onChange={(e) => onUpdateBrandConfig({ primaryColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Background Fill</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.backgroundColor}
                    onChange={(e) => onUpdateBrandConfig({ backgroundColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.backgroundColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Text Color</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.textColor}
                    onChange={(e) => onUpdateBrandConfig({ textColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.textColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Accent Color</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.accentColor}
                    onChange={(e) => onUpdateBrandConfig({ accentColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.accentColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Border Color</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.borderColor}
                    onChange={(e) => onUpdateBrandConfig({ borderColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.borderColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Badge Fill</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                  <input
                    type="color"
                    value={brandConfig.secondaryColor}
                    onChange={(e) => onUpdateBrandConfig({ secondaryColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{brandConfig.secondaryColor}</span>
                </div>
              </div>
            </div>

            {/* Typography & Border Style controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Border Style:</label>
                <select
                  value={brandConfig.borderStyle}
                  onChange={(e) => onUpdateBrandConfig({ borderStyle: e.target.value as BorderStyleType })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="solid">Solid Line</option>
                  <option value="gold-foil">Gold Foil Metallic Frame</option>
                  <option value="double">Double Luxury Border</option>
                  <option value="scalloped">Scalloped Artisanal</option>
                  <option value="dashed">Dashed Pattern</option>
                  <option value="none">Borderless</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Typography Style:</label>
                <select
                  value={brandConfig.fontFamily}
                  onChange={(e) => onUpdateBrandConfig({ fontFamily: e.target.value as FontFamilyType })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="serif">Classic Serif (Playfair / Cormorant)</option>
                  <option value="sans">Modern Sans (Inter / Plus Jakarta)</option>
                  <option value="display">Bold Display (Impact / Outfit)</option>
                  <option value="mono">Clean Monospace (Nutritional / Tech)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Corner Radius: <span className="text-amber-400">{brandConfig.cornerRadius}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={brandConfig.cornerRadius}
                  onChange={(e) => onUpdateBrandConfig({ cornerRadius: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. DISPLAY TOGGLES TAB */}
        {activeTab === 'toggles' && (
          <div className="space-y-4">
            {/* Price & Currency Special Controls Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-base border border-amber-500/30">
                    {brandConfig.currencySymbol || '₹'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                      <span>Price Visibility & Currency Control</span>
                      <Coins className="w-4 h-4 text-amber-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Toggle whether price is displayed on cards & select preferred currency symbol (₹ , $ , € , £ , etc.)
                    </p>
                  </div>
                </div>

                {/* Show Price Main Toggle */}
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={brandConfig.showPrice}
                    onChange={(e) => onUpdateBrandConfig({ showPrice: e.target.checked })}
                    className="accent-amber-500 rounded w-4 h-4"
                  />
                  <span className={`font-bold text-xs ${brandConfig.showPrice ? 'text-amber-300' : 'text-slate-400'}`}>
                    {brandConfig.showPrice ? 'Show Price (ON) 🏷️' : 'Hide Price (OFF) 🚫'}
                  </span>
                </label>
              </div>

              {/* Currency Selector Presets */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold text-xs block">Select Currency Symbol / Code:</label>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {[
                    { code: '₹', label: 'INR (₹)' },
                    { code: '$', label: 'USD/CAD/AUD ($)' },
                    { code: '€', label: 'EUR (€)' },
                    { code: '£', label: 'GBP (£)' },
                    { code: 'AED', label: 'UAE (AED)' },
                    { code: 'SAR', label: 'Saudi (SAR)' },
                    { code: 'Rs.', label: 'Rupees (Rs.)' },
                    { code: '¥', label: 'JPY/CNY (¥)' },
                    { code: 'C$', label: 'Canada (C$)' },
                    { code: 'A$', label: 'Australia (A$)' },
                    { code: '', label: 'No Symbol' },
                  ].map((curr) => {
                    const isSelected = brandConfig.currencySymbol === curr.code;
                    return (
                      <button
                        key={curr.code || 'none'}
                        type="button"
                        onClick={() => onUpdateBrandConfig({ currencySymbol: curr.code })}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        {curr.code || 'None'}
                      </button>
                    );
                  })}
                </div>

                {/* Free Text Custom Currency Input */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Custom Symbol/Code:</span>
                    <input
                      type="text"
                      value={brandConfig.currencySymbol}
                      onChange={(e) => onUpdateBrandConfig({ currencySymbol: e.target.value })}
                      placeholder="e.g. S$, RM, ฿, Fr, kr"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-xs w-28 focus:outline-none focus:border-amber-500 text-center"
                    />
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Live Sample:{' '}
                    <span className="font-bold text-amber-400">
                      {brandConfig.showPrice
                        ? formatPrice(280, brandConfig.currencySymbol) || '280'
                        : '[Price Hidden]'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Display Toggles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showLogo !== false}
                  onChange={(e) => onUpdateBrandConfig({ showLogo: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200 font-medium">Brand Logo 👑☕</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showBusinessName !== false}
                  onChange={(e) => onUpdateBrandConfig({ showBusinessName: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200 font-medium">Business Name 🏷️</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showDietIcon}
                  onChange={(e) => onUpdateBrandConfig({ showDietIcon: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Veg/NonVeg Icon 🟢🔴</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showSpiceIcon}
                  onChange={(e) => onUpdateBrandConfig({ showSpiceIcon: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Spice Meter 🌶🌶</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showAllergens}
                  onChange={(e) => onUpdateBrandConfig({ showAllergens: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Allergen Badges 🥛🌾</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showNutrition}
                  onChange={(e) => onUpdateBrandConfig({ showNutrition: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Calories & Macros</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showQrCode}
                  onChange={(e) => onUpdateBrandConfig({ showQrCode: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Live QR Code</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showCategory}
                  onChange={(e) => onUpdateBrandConfig({ showCategory: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Category Tag</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showBadges}
                  onChange={(e) => onUpdateBrandConfig({ showBadges: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200">Chef Special / BestSeller</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={brandConfig.showCropMarks}
                  onChange={(e) => onUpdateBrandConfig({ showCropMarks: e.target.checked })}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-slate-200 font-semibold text-amber-300 flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5" />
                  Scissors Crop Marks
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
