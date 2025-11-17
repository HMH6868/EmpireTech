export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password: string): boolean {
  // Tối thiểu 8 ký tự, có chữ hoa, có số
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function sanitizeInput(input: string): string {
  // Loại bỏ <>, &, dấu ngoặc kép
  return input
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/&/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '');
}

export function isValidSlug(slug: string): boolean {
  // Chỉ cho phép a-z, 0-9, dấu gạch ngang
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
}
