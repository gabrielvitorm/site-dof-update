export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeBrazilianPhoneToE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 20) {
    return null;
  }
  if (digits.startsWith('55')) {
    return `+${digits}`;
  }
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }
  return `+${digits}`;
}

