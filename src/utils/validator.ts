import { MenuItem, ValidationSummary, ValidationWarning } from '../types';

export function validateMenuItems(items: MenuItem[]): ValidationSummary {
  const warnings: ValidationWarning[] = [];
  const seenNames = new Map<string, number>();
  let duplicateCount = 0;
  let missingNamesCount = 0;

  items.forEach((item, index) => {
    const rowNum = index + 1;

    // 1. Check Menu Name
    if (!item.menuName || item.menuName.trim() === '' || item.menuName.startsWith('Item #')) {
      missingNamesCount++;
      warnings.push({
        row: rowNum,
        itemId: item.id,
        field: 'menuName',
        message: 'Menu Name is missing or auto-generated placeholder.',
        severity: 'error',
        menuName: item.menuName,
      });
    } else {
      const nameKey = item.menuName.trim().toLowerCase();
      if (seenNames.has(nameKey)) {
        duplicateCount++;
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'menuName',
          message: `Duplicate dish name "${item.menuName}" (also on row ${seenNames.get(nameKey)})`,
          severity: 'warning',
          menuName: item.menuName,
        });
      } else {
        seenNames.set(nameKey, rowNum);
      }
    }

    // 2. Check Price
    if (item.price !== undefined && item.price !== '') {
      const numericPrice = Number(String(item.price).replace(/[^0-9.-]+/g, ''));
      if (isNaN(numericPrice)) {
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'price',
          message: `Invalid price format "${item.price}". Expected numeric value.`,
          severity: 'info',
          menuName: item.menuName,
        });
      } else if (numericPrice < 0) {
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'price',
          message: `Price cannot be negative (${item.price}).`,
          severity: 'error',
          menuName: item.menuName,
        });
      }
    }

    // 3. Check Calories
    if (item.calories !== undefined && item.calories !== '') {
      const numCal = Number(String(item.calories).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numCal) && numCal < 0) {
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'calories',
          message: `Calories cannot be negative (${item.calories}).`,
          severity: 'error',
          menuName: item.menuName,
        });
      } else if (!isNaN(numCal) && numCal > 2500) {
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'calories',
          message: `Unusually high calories (${numCal} kcal). Please double check portion.`,
          severity: 'info',
          menuName: item.menuName,
        });
      }
    }

    // 4. Check Category
    if (!item.category || item.category === 'General' || item.category.trim() === '') {
      warnings.push({
        row: rowNum,
        itemId: item.id,
        field: 'category',
        message: 'No category assigned (defaulted to "General").',
        severity: 'info',
        menuName: item.menuName,
      });
    }

    // 5. Check QR URL
    if (item.qrUrl && item.qrUrl.trim() !== '') {
      try {
        new URL(item.qrUrl);
      } catch {
        warnings.push({
          row: rowNum,
          itemId: item.id,
          field: 'qrUrl',
          message: `QR URL "${item.qrUrl}" is not a valid web URL.`,
          severity: 'warning',
          menuName: item.menuName,
        });
      }
    }

    // 6. Check Dietary Type
    if (item.dietaryType === 'Unknown') {
      warnings.push({
        row: rowNum,
        itemId: item.id,
        field: 'dietaryType',
        message: 'Dietary type (Veg/Non-Veg/Vegan) could not be determined.',
        severity: 'info',
        menuName: item.menuName,
      });
    }
  });

  const errorCount = warnings.filter((w) => w.severity === 'error').length;
  const warningCount = warnings.filter((w) => w.severity === 'warning').length;
  const validRows = items.length - errorCount;

  return {
    totalRows: items.length,
    validRows: Math.max(0, validRows),
    warningCount,
    errorCount,
    warnings,
    duplicateNames: Array.from(seenNames.keys()).filter((name) => {
      let count = 0;
      items.forEach((i) => {
        if (i.menuName?.trim().toLowerCase() === name) count++;
      });
      return count > 1;
    }),
    missingNamesCount,
  };
}
