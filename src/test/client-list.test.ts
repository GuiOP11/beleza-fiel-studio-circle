import { describe, expect, it } from 'vitest';
import { cleanClientSearch, clientPageRange, promotionMessage, promotionLink } from '@/lib/client-list';

describe('Client list and individual promotions', () => {
  it('reaches every one of 2,000 inserted clients without a 1,000-row cutoff', () => {
    const ranges = Array.from({ length: 40 }, (_, page) => clientPageRange(page));
    expect(ranges[0]).toEqual({ from: 0, to: 49 });
    expect(ranges[39]).toEqual({ from: 1950, to: 1999 });
    expect(new Set(ranges.flatMap(({ from, to }) => Array.from({ length: to - from + 1 }, (_, i) => from + i))).size).toBe(2000);
  });
  it('handles search punctuation without injecting a second filter', () => {
    expect(cleanClientSearch('Teste 2000')).toBe('Teste 2000');
    expect(cleanClientSearch('49990002000')).toBe('49990002000');
    expect(cleanClientSearch('a),name.eq.b%')).toBe('a name eq b');
  });
  it('personalizes the promotion with the full registered name', () => {
    expect(promotionMessage('Ana Maria', 'Meu Salão', '  Hoje: 10% de desconto!  ')).toBe('Olá, Ana Maria! 💕\n\nHoje: 10% de desconto!\n\nCom carinho, Meu Salão.');
  });
  it('uses the confirmed Brazilian phone and encodes the message', () => {
    const message = promotionMessage('Ana Maria', 'Meu Salão', '10% de desconto');
    const link = promotionLink('(49) 99900-2000', message);
    expect(link).toBe(`https://wa.me/5549999002000?text=${encodeURIComponent(message)}`);
    expect(promotionLink('+55 (49) 99900-2000', message)).toBe(link);
    expect(promotionLink('123', message)).toBeNull();
  });
});