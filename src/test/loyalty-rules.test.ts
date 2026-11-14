import { describe, expect, it } from 'vitest';
import { redemptionBalance, canUseCoupon } from '@/lib/loyalty-rules';
describe('Coupon and visit rules',()=>{
 it('deducts 300 points from a 780-point balance only with a slot',()=>{expect(redemptionBalance(780,300,true)).toBe(480);expect(()=>redemptionBalance(780,300,false)).toThrow('Horário indisponível');});
 it('does not permit spending more than the balance',()=>{expect(()=>redemptionBalance(200,300,true)).toThrow('Pontos insuficientes');});
 it('allows only the owner to mark an unused coupon as used',()=>{expect(canUseCoupon('owner','scheduled')).toBe(true);expect(canUseCoupon('client','scheduled')).toBe(false);expect(canUseCoupon('owner','used')).toBe(false);});
});