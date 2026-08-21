import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  Grid,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { MenuItem, TagSize, BrandConfig, TemplateId } from '../types';
import { MenuCard } from './MenuCard';

interface CardGridPreviewProps {
  items: MenuItem[];
  selectedTemplate: TemplateId;
  selectedSize: TagSize;
  brandConfig: BrandConfig;
  selectedItemIds: string[];
  onToggleSelectItem: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenExportModal: () => void;
  onOpenPrintSheet: () => void;
  onUpdateSingleItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateBrandConfig?: (updated: Partial<BrandConfig>) => void;
}

export const CardGridPreview: React.FC<CardGridPreviewProps> = ({
  items,
  selectedTemplate,
  selectedSize,
  brandConfig,
  selectedItemIds,
  onToggleSelectItem,
  onSelectAll,
  onDeselectAll,
  onOpenExportModal,
  onOpenPrintSheet,
  onUpdateSingleItem,
  onDeleteItem,
  onUpdateBrandConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<string>('all');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [inspectItem, setInspectItem] = useState<MenuItem | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;

      const matchesDiet =
        dietFilter === 'all' ||
        (dietFilter === 'veg' && item.dietaryType === 'Veg') ||
        (dietFilter === 'nonveg' && item.dietaryType === 'Non-Veg') ||
        (dietFilter === 'vegan' && (item.dietaryType === 'Vegan' || item.vegan)) ||
        (dietFilter === 'jain' && (item.dietaryType === 'Jain' || item.jain));

      return matchesSearch && matchesCat && matchesDiet;
    });
  }, [items, searchQuery, categoryFilter, dietFilter]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl print:hidden space-y-4">
      {/* Top Filter & Tools Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">
              3. Live Card Gallery Preview ({filteredItems.length} Tags)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time preview of rendered menu tags. Select items to print or export.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dish or category..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Diet Dropdown */}
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
          >
            <option value="all">All Diets</option>
            <option value="veg">Veg 🟢</option>
            <option value="nonveg">Non-Veg 🔴</option>
            <option value="vegan">Vegan 🌱</option>
            <option value="jain">Jain 🪷</option>
          </select>
        </div>
      </div>

      {/* Bulk Select Bar & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-1.5 font-medium text-amber-400 hover:underline"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Select All ({items.length})</span>
          </button>

          <button
            onClick={onDeselectAll}
            className="flex items-center gap-1.5 font-medium text-slate-400 hover:text-slate-200"
          >
            <Square className="w-4 h-4" />
            <span>Clear Selection</span>
          </button>

          <span className="text-slate-500 font-mono hidden sm:inline">
            {selectedItemIds.length} items checked
          </span>

          {/* Quick Price Toggle & Currency Selector */}
          {onUpdateBrandConfig && (
            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5">
              <button
                type="button"
                onClick={() => onUpdateBrandConfig({ showPrice: !brandConfig.showPrice })}
                className={`px-2 py-1 rounded-lg font-bold text-xs border flex items-center gap-1 transition-all ${
                  brandConfig.showPrice
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle price display on all cards"
              >
                <span>Price: {brandConfig.showPrice ? 'ON 🏷️' : 'OFF 🚫'}</span>
              </button>

              {brandConfig.showPrice && (
                <select
                  value={brandConfig.currencySymbol}
                  onChange={(e) => onUpdateBrandConfig({ currencySymbol: e.target.value })}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-mono font-bold cursor-pointer"
                  title="Change currency symbol"
                >
                  <option value="₹">Symbol: ₹ (INR)</option>
                  <option value="$">Symbol: $ (USD)</option>
                  <option value="€">Symbol: € (EUR)</option>
                  <option value="£">Symbol: £ (GBP)</option>
                  <option value="AED">Symbol: AED</option>
                  <option value="SAR">Symbol: SAR</option>
                  <option value="Rs.">Symbol: Rs.</option>
                  <option value="¥">Symbol: ¥ (JPY)</option>
                  <option value="">No Symbol</option>
                </select>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2 text-slate-400">
            <ZoomOut
              className="w-3.5 h-3.5 cursor-pointer hover:text-slate-200"
              onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.1))}
            />
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
            />
            <ZoomIn
              className="w-3.5 h-3.5 cursor-pointer hover:text-slate-200"
              onClick={() => setZoomScale((z) => Math.min(1.4, z + 0.1))}
            />
          </div>

          <button
            onClick={onOpenPrintSheet}
            className="px-3 py-1.5 rounded-lg font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet View</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ({selectedItemIds.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid Card View */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-sm font-semibold">No menu tags match your active filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setDietFilter('all');
            }}
            className="mt-2 text-xs text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto py-4">
          <div
            className="flex flex-wrap justify-center gap-6"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
            }}
          >
            {filteredItems.map((item) => {
              const isChecked = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`relative group transition-all rounded-xl p-1.5 ${
                    isChecked ? 'ring-2 ring-amber-400' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Select Checkbox & Overlay Action Buttons */}
                  <div className="absolute -top-2 -left-2 z-20 flex items-center gap-1">
                    <button
                      onClick={() => onToggleSelectItem(item.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-lg transition-all ${
                        isChecked
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                      title={isChecked ? 'Uncheck item' : 'Check item for print'}
                    >
                      {isChecked ? '✓' : ''}
                    </button>
                  </div>

                  <div className="absolute -top-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => setInspectItem(item)}
                      className="p-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 shadow-md"
                      title="Inspect / Quick Edit"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:bg-slate-800 shadow-md"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Render Menu Card Tag Component */}
                  <MenuCard
                    item={item}
                    sizeKey={selectedSize}
                    brand={brandConfig}
                    templateId={selectedTemplate}
                    cardElementId={`preview-card-${item.id}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspect & Single Card Quick Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Inspect & Edit Single Card</span>
            </h3>

            {/* Live Render Preview */}
            <div className="flex justify-center py-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <MenuCard
                item={inspectItem}
                sizeKey={selectedSize}
                brand={brandConfig}
                templateId={selectedTemplate}
                cardElementId={`inspect-card-${inspectItem.id}`}
              />
            </div>

            {/* Quick Editable Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Dish Name:</label>
                <input
                  type="text"
                  value={inspectItem.menuName}
                  onChange={(e) => {
                    const updated = { ...inspectItem, menuName: e.target.value };
                    setInspectItem(updated);
                    onUpdateSingleItem(updated);
                  }}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Price ({brandConfig.currencySymbol || 'Amount'}):</label>
                  <input
                    type="text"
                    value={inspectItem.price || ''}
                    onChange={(e) => {
                      const updated = { ...inspectItem, price: e.target.value };
                      setInspectItem(updated);
                      onUpdateSingleItem(updated);
                    }}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Category:</label>
                  <input
                    type="text"
                    value={inspectItem.category || ''}
                    onChange={(e) => {
                      const updated = { ...inspectItem, category: e.target.value };
                      setInspectItem(updated);
                      onUpdateSingleItem(updated);
                    }}
                    className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description:</label>
                <textarea
                  value={inspectItem.description || ''}
                  onChange={(e) => {
                    const updated = { ...inspectItem, description: e.target.value };
                    setInspectItem(updated);
                    onUpdateSingleItem(updated);
                  }}
                  rows={2}
                  className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectItem(null)}
                className="px-5 py-2 rounded-lg font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
