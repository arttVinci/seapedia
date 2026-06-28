export function formatCurrency(amount: number | undefined | null): string {
  if (amount == null) return 'Rp 0';
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
