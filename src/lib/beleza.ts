export interface Company { id: string; name: string; owner: string; }
export interface Client { id: string; company_id: string; name: string; phone: string; service: string; points: number; total_spent: number; days_since_visit: number; cycle_days: number; }
export interface Appointment { id: string; company_id: string; client_id: string; service: string; date: string; time: string; status: 'confirmed' | 'completed'; }
export interface LoyaltyReward { id: string; company_id: string; name: string; description: string; points: number; category: string; }
export const company: Company = { id: 'studio-bella', name: 'Studio Bella', owner: 'Mariana' };
export const initialClients: Client[] = [
 {id:'ana',company_id:company.id,name:'Ana Clara Santos',phone:'',service:'Manutenção de cílios',points:780,total_spent:2340,days_since_visit:28,cycle_days:20},
 {id:'juliana',company_id:company.id,name:'Juliana Oliveira',phone:'',service:'Unhas em gel',points:1250,total_spent:3750,days_since_visit:25,cycle_days:20},
 {id:'camila',company_id:company.id,name:'Camila Rodrigues',phone:'',service:'Extensão de cílios',points:420,total_spent:1260,days_since_visit:23,cycle_days:20},
 {id:'beatriz',company_id:company.id,name:'Beatriz Costa',phone:'',service:'Unhas em gel',points:920,total_spent:2760,days_since_visit:21,cycle_days:20},
 {id:'fernanda',company_id:company.id,name:'Fernanda Lima',phone:'',service:'Design de sobrancelhas',points:560,total_spent:1680,days_since_visit:20,cycle_days:20},
 {id:'marina',company_id:company.id,name:'Marina Alves',phone:'',service:'Manutenção de cílios',points:320,total_spent:960,days_since_visit:7,cycle_days:20},
 {id:'luiza',company_id:company.id,name:'Luiza Martins',phone:'',service:'Unhas em gel',points:1600,total_spent:4800,days_since_visit:12,cycle_days:20},
 {id:'other',company_id:'other-studio',name:'Cliente de outro estúdio',phone:'',service:'Unhas',points:200,total_spent:600,days_since_visit:30,cycle_days:20},
];
export const rewards: LoyaltyReward[] = [
 {id:'spa',company_id:company.id,name:'Spa das mãos',description:'Um momento de cuidado extra para você.',points:300,category:'Autocuidado'},
 {id:'brows',company_id:company.id,name:'Design de sobrancelhas',description:'Realce seu olhar com um design personalizado.',points:500,category:'Beleza'},
 {id:'lashes',company_id:company.id,name:'Manutenção de cílios',description:'Seu olhar renovado, por nossa conta.',points:1000,category:'Exclusivo'},
];
export const appointments: Appointment[] = [
 {id:'a1',company_id:company.id,client_id:'ana',service:'Manutenção de cílios',date:'2026-11-14',time:'14:00',status:'confirmed'},
 {id:'a2',company_id:company.id,client_id:'juliana',service:'Unhas em gel',date:'2026-11-14',time:'15:30',status:'confirmed'},
 {id:'a3',company_id:company.id,client_id:'marina',service:'Design de sobrancelhas',date:'2026-11-14',time:'17:00',status:'confirmed'},
 {id:'a4',company_id:company.id,client_id:'ana',service:'Extensão de cílios',date:'2026-10-17',time:'14:00',status:'completed'},
 {id:'a5',company_id:company.id,client_id:'ana',service:'Design de sobrancelhas',date:'2026-09-26',time:'10:00',status:'completed'},
];
export function tenantRows<T extends {company_id:string}>(rows:T[],companyId:string):T[] { return rows.filter(row=>row.company_id===companyId); }
export function inactiveClients(rows:Client[],companyId:string) { return tenantRows(rows,companyId).filter(c=>c.days_since_visit>=c.cycle_days); }
export function tier(points:number) { return points>=1500?'VIP':points>=1000?'Ouro':points>=500?'Prata':'Bronze'; }
export function redeemPoints(points:number,cost:number) { if(cost<=0||points<cost) throw new Error('Pontos insuficientes');return points-cost; }
export function messageFor(client:Client) { return `Oi, ${client.name.split(' ')[0]}! 💕 Sentimos sua falta aqui no Studio Bella! Já está na hora de renovar ${client.service.toLowerCase()}. Agende seu próximo horário e ganhe um cuidado especial de presente. Vamos reservar um momento só seu? ✨`; }
export const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(value);
