/**
 * Format menu item price with given currency symbol and visibility flag
 */
export function formatPrice(
  price: string | number | undefined | null,
  currencySymbol: string = '$'
): string {
  if (price === undefined || price === null || price === '') return '';

  const raw = String(price).trim();
  if (!raw) return '';

  // Strip leading standard currency symbols if present ($ , ₹ , € , £ , ¥ , AED , SAR , Rs. , RS , USD , INR , C$ , A$)
  const cleaned = raw.replace(/^(?:\$|₹|€|£|¥|AED|SAR|Rs\.?|RS|USD|INR|C\$|A\$)\s*/i, '');

  if (!currencySymbol || currencySymbol.trim() === '') {
    return cleaned;
  }

  const symbol = currencySymbol.trim();
  // Multi-character code like AED, SAR, USD, EUR gets a space unless it ends with a symbol like $
  const needsSpace = symbol.length > 1 && !symbol.endsWith('$');
  return `${symbol}${needsSpace ? ' ' : ''}${cleaned}`;
}
