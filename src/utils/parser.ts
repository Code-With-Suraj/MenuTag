import Papa from 'papaparse';
import { MenuItem, DietType, SpiceLevel } from '../types';

/**
 * Maps CSV column headers flexibly to internal MenuItem fields
 */
function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

export function parseDietaryType(val?: string): DietType {
  if (!val) return 'Unknown';
  const clean = val.toString().trim().toLowerCase();
  
  if (clean.includes('non') || clean.includes('chicken') || clean.includes('mutton') || clean.includes('fish') || clean.includes('meat') || clean.includes('pork') || clean.includes('beef')) {
    return 'Non-Veg';
  }
  if (clean.includes('vegan')) return 'Vegan';
  if (clean.includes('jain')) return 'Jain';
  if (clean.includes('egg')) return 'Egg';
  if (clean.includes('gluten free') || clean.includes('gf')) return 'Gluten Free';
  if (clean.includes('veg')) return 'Veg';
  
  return 'Unknown';
}

export function parseSpiceLevel(val?: string | number): SpiceLevel {
  if (!val) return 'None';
  const str = val.toString().trim().toLowerCase();
  
  if (str === '3' || str.includes('hot') || str.includes('spicy') || str.includes('high') || str.includes('🌶🌶🌶')) {
    return 'Hot';
  }
  if (str === '2' || str.includes('medium') || str.includes('mod') || str.includes('🌶🌶')) {
    return 'Medium';
  }
  if (str === '1' || str.includes('mild') || str.includes('low') || str.includes('🌶')) {
    return 'Mild';
  }
  return 'None';
}

function parseBoolean(val?: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  const str = String(val).trim().toLowerCase();
  return str === 'true' || str === 'yes' || str === '1' || str === 'y';
}

export function parseCsvFile(file: File): Promise<{ items: MenuItem[]; rawHeaders: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const rawHeaders = results.meta.fields || [];
        const items: MenuItem[] = (results.data as Record<string, any>[]).map((row, index) => {
          // Flexible field extraction
          const getVal = (possibleKeys: string[]): any => {
            for (const key of Object.keys(row)) {
              const normalized = normalizeHeader(key);
              if (possibleKeys.some((p) => normalized.includes(normalizeHeader(p)))) {
                return row[key];
              }
            }
            return undefined;
          };

          const menuName =
            getVal(['menuname', 'menu name', 'dish', 'item name', 'item', 'title', 'dish name']) ||
            `Item #${index + 1}`;

          const category = getVal(['category', 'type', 'section', 'course']) || 'General';
          const price = getVal(['price', 'cost', 'rate', 'price ($)']) || '';
          const calories = getVal(['calories', 'cal', 'kcal']) || '';
          const protein = getVal(['protein']) || '';
          const fat = getVal(['fat']) || '';
          const carbs = getVal(['carbs', 'carbohydrates']) || '';
          const prepTime = getVal(['preptime', 'prep time', 'time', 'cooking time']) || '';
          const portionSize = getVal(['portionsize', 'portion size', 'serving', 'portion']) || '';
          const allergen = getVal(['allergen', 'allergens', 'contains']) || '';
          
          const rawDiet = getVal(['diet', 'dietarytype', 'dietary type', 'veg/nonveg', 'veg nonveg', 'type']) || '';
          const dietaryType = parseDietaryType(rawDiet);

          const rawSpice = getVal(['spicelevel', 'spice level', 'spice', 'spiciness']) || '';
          const spiceLevel = parseSpiceLevel(rawSpice);

          const chefRecommendation = parseBoolean(getVal(['chefrecommendation', 'chef choice', 'chef special', 'recommended']));
          const bestSeller = parseBoolean(getVal(['bestseller', 'best seller', 'popular', 'top seller']));
          const isNew = parseBoolean(getVal(['new', 'isnew', 'just added']));
          const seasonal = parseBoolean(getVal(['seasonal', 'season']));
          const glutenFree = parseBoolean(getVal(['glutenfree', 'gluten free'])) || allergen.toLowerCase().includes('gluten free');
          const vegan = parseBoolean(getVal(['vegan'])) || dietaryType === 'Vegan';
          const jain = parseBoolean(getVal(['jain'])) || dietaryType === 'Jain';
          const egg = parseBoolean(getVal(['egg'])) || dietaryType === 'Egg';
          const containsNuts = parseBoolean(getVal(['containsnuts', 'contains nuts'])) || allergen.toLowerCase().includes('nut');
          const containsDairy = parseBoolean(getVal(['containsdairy', 'contains dairy'])) || allergen.toLowerCase().includes('dairy');

          const qrUrl = getVal(['qrurl', 'qr url', 'qr', 'link', 'url']) || '';
          const description = getVal(['description', 'details', 'info', 'summary']) || '';
          const customNote = getVal(['customnote', 'custom note', 'note', 'footnote', 'badge']) || '';

          return {
            id: `item-${Date.now()}-${index}`,
            menuName,
            category,
            price,
            calories,
            protein,
            fat,
            carbs,
            prepTime,
            portionSize,
            allergen,
            dietaryType,
            spiceLevel,
            chefRecommendation,
            bestSeller,
            isNew,
            seasonal,
            glutenFree,
            vegan,
            jain,
            egg,
            containsNuts,
            containsDairy,
            qrUrl,
            description,
            customNote,
            rawRow: row,
          };
        });

        resolve({ items, rawHeaders });
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

export function parseRawCsvString(csvString: string): { items: MenuItem[]; rawHeaders: string[] } {
  const results = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: 'greedy',
  });

  const rawHeaders = results.meta.fields || [];
  const items: MenuItem[] = (results.data as Record<string, any>[]).map((row, index) => {
    const getVal = (possibleKeys: string[]): any => {
      for (const key of Object.keys(row)) {
        const normalized = normalizeHeader(key);
        if (possibleKeys.some((p) => normalized.includes(normalizeHeader(p)))) {
          return row[key];
        }
      }
      return undefined;
    };

    const menuName = getVal(['menuname', 'menu name', 'dish', 'item name', 'item']) || `Item #${index + 1}`;
    const category = getVal(['category']) || 'General';
    const price = getVal(['price']) || '';
    const calories = getVal(['calories']) || '';
    const protein = getVal(['protein']) || '';
    const fat = getVal(['fat']) || '';
    const carbs = getVal(['carbs']) || '';
    const prepTime = getVal(['preptime', 'prep time']) || '';
    const portionSize = getVal(['portionsize', 'portion size']) || '';
    const allergen = getVal(['allergen', 'allergens']) || '';
    const dietaryType = parseDietaryType(getVal(['diet', 'dietarytype', 'veg/nonveg']));
    const spiceLevel = parseSpiceLevel(getVal(['spicelevel', 'spice level', 'spice']));

    return {
      id: `sample-${index}`,
      menuName,
      category,
      price,
      calories,
      protein,
      fat,
      carbs,
      prepTime,
      portionSize,
      allergen,
      dietaryType,
      spiceLevel,
      chefRecommendation: parseBoolean(getVal(['chefrecommendation'])),
      bestSeller: parseBoolean(getVal(['bestseller'])),
      isNew: parseBoolean(getVal(['new'])),
      seasonal: parseBoolean(getVal(['seasonal'])),
      glutenFree: parseBoolean(getVal(['glutenfree'])),
      vegan: parseBoolean(getVal(['vegan'])),
      jain: parseBoolean(getVal(['jain'])),
      egg: parseBoolean(getVal(['egg'])),
      containsNuts: parseBoolean(getVal(['containsnuts'])),
      containsDairy: parseBoolean(getVal(['containsdairy'])),
      qrUrl: getVal(['qrurl', 'qr url']),
      description: getVal(['description']),
      customNote: getVal(['customnote']),
      rawRow: row,
    };
  });

  return { items, rawHeaders };
}
