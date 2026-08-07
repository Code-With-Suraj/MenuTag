import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Printer, ShieldCheck, Sparkles, Scissors } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What paper quality is best for printing menu tags?',
      a: 'We strongly recommend 250 GSM to 350 GSM matte or semi-gloss cardstock paper. Heavy cardstock ensures table tags and buffet display clips stand firm without sagging or fluttering.',
    },
    {
      q: 'How do I protect menu tags against hot steam and food spills in buffets?',
      a: 'Lamination or acrylic standees! Thermal laminating pouches (3-mil or 5-mil thickness) make your tags completely waterproof, wipeable, and reusable across multiple events.',
    },
    {
      q: 'How do tent cards work for buffet tables?',
      a: 'When you select Tent Card size (A6 Folded or A5 Folded), Menu Tag Studio automatically generates a top crease line with an inverted back flap. When folded along the middle crease, the tag stands on its own and displays your dish name to guests on both sides of the buffet line!',
    },
    {
      q: 'Is my CSV data kept private?',
      a: '100% Private! All CSV parsing, QR code rendering, and image/PDF generation run purely client-side inside your web browser. No menu items or business data are ever uploaded or stored on any server.',
    },
    {
      q: 'Can I print directly onto pre-cut cardstock?',
      a: 'Yes! Toggle on "Scissors Crop Marks" in the design customizer. This prints faint corner crosshairs so you can easily trim your sheets using a paper cutter or scissors.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 print:hidden">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Printing & Hardware Tips</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Frequently Asked Questions & Print Advice
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Get the most out of your bulk generated food tags for catering, hotels, and cafes.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-100 hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
