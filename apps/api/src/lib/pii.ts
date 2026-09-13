export function maskEmail(email: string): string {
  const [localPart, domain] = email.trim().split('@');
  if (!localPart || !domain) {
    return '***';
  }
  return `${localPart[0] ?? '*'}***@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) {
    return '****';
  }
  return `${'*'.repeat(Math.max(digits.length - 4, 4))}${digits.slice(-4)}`;
}

