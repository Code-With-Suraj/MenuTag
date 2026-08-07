import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileCheck,
  RefreshCw,
  Sparkles,
  Download,
  AlertCircle,
  Code2,
} from 'lucide-react';
import { parseCsvFile, parseRawCsvString } from '../utils/parser';
import { MenuItem } from '../types';
import { SAMPLE_CSV_CONTENT } from '../data/samples';

interface CsvUploaderProps {
  onParsedData: (items: MenuItem[], filename: string) => void;
  currentFilename?: string;
  itemCount: number;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({
  onParsedData,
  currentFilename,
  itemCount,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pastedCsv, setPastedCsv] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('spreadsheet')) {
      setErrorMsg('Please upload a valid .csv spreadsheet file.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { items } = await parseCsvFile(file);
      if (items.length === 0) {
        setErrorMsg('The CSV file is empty or could not be parsed.');
      } else {
        onParsedData(items, file.name);
      }
    } catch (err: any) {
      setErrorMsg(`Error parsing CSV: ${err.message || 'Invalid format'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedCsv.trim()) {
      setErrorMsg('Please paste valid CSV content.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { items } = parseRawCsvString(pastedCsv);
      if (items.length === 0) {
        setErrorMsg('No valid rows found in pasted text.');
      } else {
        onParsedData(items, 'Pasted_Menu_Data.csv');
        setShowPasteArea(false);
      }
    } catch (err: any) {
      setErrorMsg(`Failed to parse pasted CSV: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_menu_tags.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>1. Upload Menu Spreadsheet (CSV)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload your menu list in CSV format. Instant parsing, 100% private in browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSampleCsv}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample CSV File</span>
          </button>

          <button
            onClick={() => setShowPasteArea(!showPasteArea)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{showPasteArea ? 'Upload File' : 'Paste CSV Text'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {showPasteArea ? (
        <div className="space-y-3">
          <textarea
            value={pastedCsv}
            onChange={(e) => setPastedCsv(e.target.value)}
            placeholder="Paste your CSV row data here... (e.g. Menu Name,Category,Price,Diet...)"
            rows={6}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowPasteArea(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessPastedText}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5"
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Process CSV Data</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
              : currentFilename
              ? 'border-emerald-500/50 bg-emerald-950/10'
              : 'border-slate-700 bg-slate-950/40 hover:border-slate-500 hover:bg-slate-950/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,text/csv,application/vnd.ms-excel"
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4 text-amber-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm font-semibold">Parsing Spreadsheet Data...</p>
            </div>
          ) : currentFilename ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <FileCheck className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-100">{currentFilename}</p>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                ✓ {itemCount} Menu Items Ready For Tag Generation
              </p>
              <p className="text-[11px] text-slate-400 mt-2 hover:underline">
                Click or drag to replace with another CSV file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-200">
                Drag & Drop your CSV spreadsheet here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or <span className="text-amber-400 font-semibold underline">browse files</span> from your device
              </p>
              <p className="text-[11px] text-slate-400 mt-3">
                Supports fields: Menu Name, Category, Price, Calories, Allergen, Diet, Spice Level, QR URL, Notes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
