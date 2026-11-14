import { describe, it, expect } from 'vitest';
import { company, initialClients, inactiveClients, tenantRows, redeemPoints, tier } from '../lib/beleza';
describe('BelezaFiel rules',()=>{
 it('isolates company demo data',()=>{ expect(tenantRows(initialClients,company.id).some(c=>c.id==='other')).toBe(false);expect(tenantRows(initialClients,company.id)).toHaveLength(7); });
 it('flags clients at 20 days and excludes those inside the return window',()=>{const rows=inactiveClients(initialClients,company.id);expect(rows.map(c=>c.id)).toContain('fernanda');expect(rows.map(c=>c.id)).not.toContain('marina');expect(rows).toHaveLength(5);});
 it('deducts reward points and blocks insufficient balances',()=>{expect(redeemPoints(780,300)).toBe(480);expect(()=>redeemPoints(200,300)).toThrow();});
 it('calculates tiers from the current balance',()=>{expect(tier(780)).toBe('Prata');expect(tier(480)).toBe('Bronze');expect(tier(1250)).toBe('Ouro');expect(tier(1600)).toBe('VIP');});
});
