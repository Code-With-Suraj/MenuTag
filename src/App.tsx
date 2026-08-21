import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CsvUploader } from './components/CsvUploader';
import { ValidationReport } from './components/ValidationReport';
import { Customizer } from './components/Customizer';
import { CardGridPreview } from './components/CardGridPreview';
import { PrintSheetView } from './components/PrintSheetView';
import { ExportModal } from './components/ExportModal';
import { TemplateGallery } from './components/TemplateGallery';
import { CsvGuide } from './components/CsvGuide';
import { FaqSection } from './components/FaqSection';
import { MenuCard } from './components/MenuCard';

import { MenuItem, TemplateId, TagSize, BrandConfig } from './types';
import { TEMPLATES } from './data/templates';
import { SAMPLE_MENU_ITEMS, SAMPLE_CSV_CONTENT } from './data/samples';
import { parseRawCsvString } from './utils/parser';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'guide' | 'faq'>('generator');
  
  // Data State
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [filename, setFilename] = useState<string>('Sample_Buffet_Menu.csv');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    SAMPLE_MENU_ITEMS.map((i) => i.id)
  );

  // Design State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('luxury-restaurant');
  const [selectedSize, setSelectedSize] = useState<TagSize>('medium');
  
  const currentTemplateDef = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    businessName: currentTemplateDef.defaultBrandConfig.businessName || 'L’Aura Fine Dining',
    logoUrl: undefined,
    footerText: currentTemplateDef.defaultBrandConfig.footerText || 'Executive Chef Selection • Fresh Daily',
    website: 'www.menu.studio',
    primaryColor: currentTemplateDef.defaultBrandConfig.primaryColor || '#d97706',
    secondaryColor: currentTemplateDef.defaultBrandConfig.secondaryColor || '#fef3c7',
    backgroundColor: currentTemplateDef.defaultBrandConfig.backgroundColor || '#0f172a',
    textColor: currentTemplateDef.defaultBrandConfig.textColor || '#f8fafc',
    accentColor: currentTemplateDef.defaultBrandConfig.accentColor || '#f59e0b',
    borderColor: currentTemplateDef.defaultBrandConfig.borderColor || '#d97706',
    borderStyle: currentTemplateDef.defaultBrandConfig.borderStyle || 'gold-foil',
    cornerRadius: currentTemplateDef.defaultBrandConfig.cornerRadius || 8,
    shadow: 'lg',
    fontFamily: currentTemplateDef.defaultBrandConfig.fontFamily || 'serif',
    showLogo: true,
    showBusinessName: true,
    showQrCode: true,
    showNutrition: true,
    showAllergens: true,
    showSpiceIcon: true,
    showDietIcon: true,
    showPrice: true,
    currencySymbol: currentTemplateDef.defaultBrandConfig.currencySymbol || '$',
    showCategory: true,
    showBadges: true,
    showCropMarks: false,
    showFoldLine: true,
  });

  // Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);

  const uploaderRef = useRef<HTMLDivElement>(null);

  // Handler: Select Template
  const handleSelectTemplate = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const tmplDef = TEMPLATES.find((t) => t.id === templateId);
    if (tmplDef && tmplDef.defaultBrandConfig) {
      setBrandConfig((prev) => ({
        ...prev,
        ...tmplDef.defaultBrandConfig,
      }));
    }
  };

  // Handler: Update Brand Config
  const handleUpdateBrandConfig = (updated: Partial<BrandConfig>) => {
    setBrandConfig((prev) => ({ ...prev, ...updated }));
  };

  // Handler: Reset to Template Defaults
  const handleResetToTemplateDefaults = () => {
    if (currentTemplateDef && currentTemplateDef.defaultBrandConfig) {
      setBrandConfig((prev) => ({
        ...prev,
        ...currentTemplateDef.defaultBrandConfig,
      }));
    }
  };

  // Handler: Load Preset Samples
  const handleLoadSample = (sampleType?: string) => {
    let presetItems = SAMPLE_MENU_ITEMS;
    let name = 'Sample_Buffet_Menu.csv';

    if (sampleType === 'cafe') {
      setSelectedTemplate('modern-cafe');
      const tmpl = TEMPLATES.find((t) => t.id === 'modern-cafe');
      if (tmpl) setBrandConfig((prev) => ({ ...prev, ...tmpl.defaultBrandConfig }));
      name = 'Sample_Cafe_Bakery.csv';
    } else if (sampleType === 'hotel') {
      setSelectedTemplate('hotel-buffet');
      const tmpl = TEMPLATES.find((t) => t.id === 'hotel-buffet');
      if (tmpl) setBrandConfig((prev) => ({ ...prev, ...tmpl.defaultBrandConfig }));
      name = 'Sample_Hotel_Grand_Buffet.csv';
    } else if (sampleType === 'street') {
      setSelectedTemplate('street-food');
      const tmpl = TEMPLATES.find((t) => t.id === 'street-food');
      if (tmpl) setBrandConfig((prev) => ({ ...prev, ...tmpl.defaultBrandConfig }));
      name = 'Sample_Food_Truck.csv';
    } else if (sampleType === 'fine-dining') {
      setSelectedTemplate('luxury-restaurant');
      const tmpl = TEMPLATES.find((t) => t.id === 'luxury-restaurant');
      if (tmpl) setBrandConfig((prev) => ({ ...prev, ...tmpl.defaultBrandConfig }));
      name = 'Sample_Fine_Dining.csv';
    }

    setItems(presetItems);
    setFilename(name);
    setSelectedItemIds(presetItems.map((i) => i.id));
    setActiveTab('generator');

    // Scroll to generator area
    uploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler: Parsed CSV Upload
  const handleParsedCsv = (parsedItems: MenuItem[], fileTitle: string) => {
    setItems(parsedItems);
    setFilename(fileTitle);
    setSelectedItemIds(parsedItems.map((i) => i.id));
  };

  // Selection handlers
  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItemIds(items.map((i) => i.id));
  };

  const handleDeselectAll = () => {
    setSelectedItemIds([]);
  };

  // Single Item Updates
  const handleUpdateSingleItem = (updated: MenuItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItemIds((prev) => prev.filter((i) => i !== id));
  };

  const selectedItems = items.filter((i) => selectedItemIds.includes(i.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itemCount={selectedItemIds.length}
        onQuickSampleLoad={() => handleLoadSample()}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="pb-16">
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <Hero
              onLoadSample={handleLoadSample}
              onScrollToUploader={() => uploaderRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />

            <div ref={uploaderRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
              {/* Step 1: CSV Upload */}
              <CsvUploader
                onParsedData={handleParsedCsv}
                currentFilename={filename}
                itemCount={items.length}
              />

              {/* Step 2: Data Quality & Auto Validation */}
              {items.length > 0 && (
                <ValidationReport items={items} onUpdateItems={setItems} />
              )}

              {/* Step 3: Design & Customization */}
              <Customizer
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                brandConfig={brandConfig}
                onUpdateBrandConfig={handleUpdateBrandConfig}
                onResetToTemplateDefaults={handleResetToTemplateDefaults}
              />

              {/* Step 4: Live Card Gallery & Filters */}
              {items.length > 0 && (
                <CardGridPreview
                  items={items}
                  selectedTemplate={selectedTemplate}
                  selectedSize={selectedSize}
                  brandConfig={brandConfig}
                  selectedItemIds={selectedItemIds}
                  onToggleSelectItem={handleToggleSelectItem}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
                  onUpdateSingleItem={handleUpdateSingleItem}
                  onDeleteItem={handleDeleteItem}
                  onUpdateBrandConfig={handleUpdateBrandConfig}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 8 Design Templates Gallery */}
        {activeTab === 'templates' && (
          <TemplateGallery
            selectedTemplate={selectedTemplate}
            onApplyTemplate={(id) => {
              handleSelectTemplate(id);
              setActiveTab('generator');
            }}
          />
        )}

        {/* Tab 3: CSV Format Guide */}
        {activeTab === 'guide' && <CsvGuide />}

        {/* Tab 4: Printing & FAQ */}
        {activeTab === 'faq' && <FaqSection />}
      </main>

      {/* Export Options Modal */}
      {isExportModalOpen && (
        <ExportModal
          items={selectedItems.length > 0 ? selectedItems : items}
          allItems={items}
          selectedTemplate={selectedTemplate}
          selectedSize={selectedSize}
          brandConfig={brandConfig}
          onClose={() => setIsExportModalOpen(false)}
          onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
        />
      )}

      {/* A4 / Letter Print Sheet View */}
      {isPrintSheetOpen && (
        <PrintSheetView
          items={selectedItems.length > 0 ? selectedItems : items}
          selectedTemplate={selectedTemplate}
          selectedSize={selectedSize}
          brandConfig={brandConfig}
          onClose={() => setIsPrintSheetOpen(false)}
        />
      )}

      {/* Dedicated Live Render Sandbox for Guaranteed 100% Export Capture */}
      <div
        id="offscreen-export-cache"
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: '0px',
          width: '2400px',
          opacity: 1,
          visibility: 'visible',
          zIndex: -99999,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {items.map((item) => (
          <div key={item.id} id={`live-export-card-${item.id}`}>
            <MenuCard
              item={item}
              sizeKey={selectedSize}
              brand={brandConfig}
              templateId={selectedTemplate}
              cardElementId={`export-card-inner-${item.id}`}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Menu Tag Studio • Bulk Food Tag & Menu Card Studio. 100% Client-Side Generator.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('guide')} className="hover:underline">
              CSV Format
            </button>
            <button onClick={() => setActiveTab('templates')} className="hover:underline">
              Templates
            </button>
            <button onClick={() => setActiveTab('faq')} className="hover:underline">
              Print Tips
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
