/**
 * Formatage monétaire officiel AHOUE (Charte Graphique v1.0)
 * Règles :
 * - Montants toujours en FCFA
 * - Espace insécable (\u00A0) entre les milliers et avant FCFA (ex: 25 000 FCFA)
 */
export const formatFCFA = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0\u00A0FCFA';
  }
  const isNegative = Number(amount) < 0;
  const absVal = Math.round(Math.abs(Number(amount)));
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return `${isNegative ? '-' : ''}${formatted}\u00A0FCFA`;
};

export const formatShortFCFA = (amount) => {
  const num = Math.round(Number(amount) || 0);
  if (Math.abs(num) >= 1000) {
    const k = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1).replace('.', ',');
    return `${k}\u00A0k\u00A0FCFA`;
  }
  return formatFCFA(num);
};
