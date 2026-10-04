const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export interface PasswordStrength {
  /** Quantidade de segmentos preenchidos (0 = campo vazio). */
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
}

const strengthLabels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'] as const;

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: 0, label: '' };

  let points = 0;
  if (password.length >= 8) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password)) points += 1;

  const capped = password.length < MIN_PASSWORD_LENGTH ? Math.min(points, 1) : points;
  const level = Math.max(1, capped) as 1 | 2 | 3 | 4;

  return { level, label: strengthLabels[level] };
}
