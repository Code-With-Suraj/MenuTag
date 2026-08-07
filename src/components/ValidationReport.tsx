import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  X,
  Save,
} from 'lucide-react';
import { MenuItem, ValidationSummary } from '../types';
import { validateMenuItems } from '../utils/validator';

interface ValidationReportProps {
  items: MenuItem[];
  onUpdateItems: (updated: MenuItem[]) => void;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({ items, onUpdateItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});

  const summary: ValidationSummary = validateMenuItems(items);

  const handleStartEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = items.map((i) => (i.id === editingId ? ({ ...i, ...editForm } as MenuItem) : i));
    onUpdateItems(updated);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const handleAddNewItem = () => {
    const newItem: MenuItem = {
      id: `item-manual-${Date.now()}`,
      menuName: 'New Dish Item',
      category: 'Starters',
      price: '250',
      dietaryType: 'Veg',
      spiceLevel: 'Medium',
      description: 'Delicious dish description',
    };
    onUpdateItems([newItem, ...items]);
    setEditingId(newItem.id);
    setEditForm(newItem);
    setIsExpanded(true);
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {summary.errorCount > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : summary.warningCount > 0 ? (
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">CSV Data Quality & Auto Validation</h3>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  summary.errorCount > 0
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : summary.warningCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {summary.errorCount > 0
                  ? `${summary.errorCount} Errors Detected`
                  : summary.warningCount > 0
                  ? `${summary.warningCount} Warnings`
                  : 'Data 100% Valid'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {summary.validRows} / {summary.totalRows} records verified ready for bulk print.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNewItem}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Warning Log & Item Quick Editor */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
          {summary.warnings.length > 0 && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto space-y-2">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Validation Feedback & Issues:
              </p>
              {summary.warnings.map((warn, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/80"
                >
                  {warn.severity === 'error' ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : warn.severity === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-slate-200">
                      Row {warn.row} [{warn.menuName || 'Item'}]:
                    </span>{' '}
                    <span className="text-slate-300">{warn.message}</span>
                  </div>
                  {warn.itemId && (
                    <button
                      onClick={() => {
                        const target = items.find((i) => i.id === warn.itemId);
                        if (target) handleStartEdit(target);
                      }}
                      className="text-[10px] text-amber-400 hover:underline px-1.5 py-0.5 rounded bg-amber-500/10"
                    >
                      Fix Item
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Table Editor */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Dish Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Diet</th>
                  <th className="p-2">Spice</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.slice(0, 15).map((item, idx) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-2 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-semibold text-slate-100">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.menuName || ''}
                            onChange={(e) => setEditForm({ ...editForm, menuName: e.target.value })}
                            className="p-1 rounded bg-slate-950 border border-amber-500 text-xs w-full text-white"
                          />
                        ) : (
                          item.menuName
                        )}
                      </td>
                      <td className="p-2 text-slate-300">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="p-1 rounded bg-slate-950 border border-slate-700 text-xs w-full text-white"
                          />
                        ) : (
                          item.category || '—'
                        )}
                      </td>
                      <td className="p-2 font-mono text-amber-400">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="p-1 rounded bg-slate-950 border border-slate-700 text-xs w-20 text-white"
                          />
                        ) : (
                          item.price ? `$${item.price}` : '—'
                        )}
                      </td>
                      <td className="p-2">
                        {isEditing ? (
                          <select
                            value={editForm.dietaryType || 'Veg'}
                            onChange={(e) => setEditForm({ ...editForm, dietaryType: e.target.value as any })}
                            className="p-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          >
                            <option value="Veg">Veg 🟢</option>
                            <option value="Non-Veg">Non-Veg 🔴</option>
                            <option value="Vegan">Vegan 🌱</option>
                            <option value="Jain">Jain 🪷</option>
                            <option value="Egg">Egg 🥚</option>
                          </select>
                        ) : (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.dietaryType === 'Veg'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : item.dietaryType === 'Non-Veg'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.dietaryType || 'Veg'}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-slate-400">{item.spiceLevel || 'None'}</td>
                      <td className="p-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-slate-400 hover:text-amber-400"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {items.length > 15 && (
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Showing top 15 of {items.length} items. All items will be rendered in card preview.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
