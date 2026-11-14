export const CLIENTS_PAGE_SIZE = 50;

export function cleanClientSearch(value: string) {
  return value.replace(/[%_,().:*\\"'`]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}

export function clientPageRange(page: number) {
  const from = page * CLIENTS_PAGE_SIZE;
  return { from, to: from + CLIENTS_PAGE_SIZE - 1 };
}

export function promotionMessage(name: string, studio: string, promotion: string) {
  return `Olá, ${name}! 💕\n\n${promotion.trim()}\n\nCom carinho, ${studio}.`;
}

export function promotionLink(phone: string, message: string) {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!/^55[1-9]\d\d{8,9}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}