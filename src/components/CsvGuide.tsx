import React from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info,
  Code,
} from 'lucide-react';
import { SAMPLE_CSV_CONTENT } from '../data/samples';

export const CsvGuide: React.FC = () => {
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_menu_tags.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fields = [
    { name: 'Menu Name', req: 'Required', desc: 'The title of the dish, beverage or bakery item (e.g. Paneer Tikka Angara)' },
    { name: 'Category', req: 'Optional', desc: 'Section heading (e.g. Starters, Main Course, Bakery, Desserts)' },
    { name: 'Price', req: 'Optional', desc: 'Price string or numeric value (e.g. 280, $15.99)' },
    { name: 'Calories', req: 'Optional', desc: 'Energy value in kcal (e.g. 320, 610)' },
    { name: 'Diet / Diet Type', req: 'Optional', desc: 'Auto displays Veg 🟢 / Non-Veg 🔴 / Egg 🥚 / Vegan 🌱 / Jain 🪷' },
    { name: 'Spice Level', req: 'Optional', desc: 'Mild (🌶), Medium (🌶🌶), Hot (🌶🌶🌶)' },
    { name: 'Allergen', req: 'Optional', desc: 'Comma separated list (e.g. Dairy, Gluten, Nuts, Soy, Shellfish)' },
    { name: 'Chef Recommendation', req: 'Optional', desc: 'Boolean value (TRUE / FALSE or YES / NO) to show CHEF CHOICE ⭐ badge' },
    { name: 'Best Seller', req: 'Optional', desc: 'Boolean value (TRUE / FALSE) to show BEST SELLER 🔥 badge' },
    { name: 'New / Seasonal', req: 'Optional', desc: 'Boolean value to highlight NEW 🆕 or SEASONAL 🍃' },
    { name: 'QR URL', req: 'Optional', desc: 'Web link to render live scannable QR code on tag' },
    { name: 'Description', req: 'Optional', desc: 'Brief description of ingredients or cooking technique' },
    { name: 'Prep Time / Portion', req: 'Optional', desc: 'e.g. "15 min", "Serves 2", "6 pcs"' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-400" />
            <span>CSV File Specification & Formatting Guide</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Menu Tag Studio automatically detects columns with standard headers exported from Excel, Google Sheets, or POS systems.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-2 shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Field Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100">Supported CSV Header Fields</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Field Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Description & Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fields.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-amber-300 font-mono">{f.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.req === 'Required'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {f.req}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accepted Veg/NonVeg Values box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Veg & Non-Veg Recognized Values</span>
          </h4>
          <p className="text-xs text-slate-400">
            The parser normalizes dietary values automatically:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
            <li>🟢 <strong className="text-emerald-400">Veg:</strong> Veg, VEG, veg, Vegetarian</li>
            <li>🔴 <strong className="text-red-400">Non-Veg:</strong> Non Veg, Non-Veg, Chicken, Mutton, Fish, Meat</li>
            <li>🥚 <strong className="text-amber-400">Egg:</strong> Egg, Contains Egg</li>
            <li>🌱 <strong className="text-emerald-300">Vegan:</strong> Vegan, Plant Based</li>
            <li>🪷 <strong className="text-emerald-300">Jain:</strong> Jain, Pure Jain</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Exporting from Google Sheets or Excel</span>
          </h4>
          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
            <li>Open your menu spreadsheet in Microsoft Excel or Google Sheets.</li>
            <li>Ensure the first row contains column titles (e.g., Menu Name, Category, Price).</li>
            <li>Click <strong>File → Download → Comma Separated Values (.csv)</strong>.</li>
            <li>Upload the downloaded `.csv` file directly into Menu Tag Studio!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
