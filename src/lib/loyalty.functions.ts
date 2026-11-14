import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const CLIENTS_PAGE_SIZE = 50;
const RECENT_LIMIT = 100;

export const getLoyaltyWorkspace=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase;
 const {data:role,error:roleError}=await db.from('user_roles').select('company_id,role').eq('user_id',context.userId).limit(1).maybeSingle();
 if(roleError)throw new Error('Não foi possível carregar seu acesso.');
 if(!role)return null;
 const owner=role.role==='owner';
 const now=new Date().toISOString();
 // Nunca carregamos a lista de clientes aqui: a dona usa listClients (paginado);
 // a cliente recebe apenas o próprio cadastro.
 const clientsQuery=owner
  ?Promise.resolve({data:[] as {id:string;company_id:string;name:string;phone:string;points:number;user_id:string|null}[],error:null})
  :db.from('clients').select('id,company_id,name,phone,points,user_id').eq('company_id',role.company_id).eq('user_id',context.userId).limit(1);
 const slotsQuery=owner
  ?db.from('booking_slots').select('*').eq('company_id',role.company_id).gte('starts_at',now).order('starts_at').limit(200)
  :db.from('booking_slots').select('*').eq('company_id',role.company_id).eq('booked',false).gte('starts_at',now).order('starts_at').limit(100);
 const [{data:company,error:ce},{data:clients,error:cle},{data:rewards,error:re},{data:slots,error:se},{data:redemptions,error:rde},statsRes]=await Promise.all([
  db.from('companies').select('id,name').eq('id',role.company_id).single(),
  clientsQuery,
  db.from('loyalty_rewards').select('*').eq('company_id',role.company_id).eq('active',true).order('points'),
  slotsQuery,
  db.from('reward_redemptions').select('*, clients(name), booking_slots(starts_at)').eq('company_id',role.company_id).order('created_at',{ascending:false}).limit(RECENT_LIMIT),
  owner?db.rpc('owner_stats',{cid:role.company_id}):Promise.resolve({data:null,error:null}),
 ]);
 if(ce||cle||re||se||rde||statsRes.error||!company)throw new Error('Não foi possível carregar os dados do salão.');
 const row=Array.isArray(statsRes.data)?statsRes.data[0]:null;
 const stats=row?{clientCount:Number(row.client_count),totalPoints:Number(row.total_points),pendingCount:Number(row.pending_count)}:null;
 return {role:role.role,company,clients:clients??[],rewards:rewards??[],slots:slots??[],redemptions:redemptions??[],stats};
});
export type LoyaltyWorkspace=NonNullable<Awaited<ReturnType<typeof getLoyaltyWorkspace>>>;
const ownerActionSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('client'),companyId:z.string().uuid(),name:z.string().trim().min(2),phone:z.string(),points:z.number().int().nonnegative()}),
 z.object({action:z.literal('points'),clientId:z.string().uuid(),points:z.number().int().nonnegative()}),
 z.object({action:z.literal('reward'),companyId:z.string().uuid(),name:z.string().trim().min(2),description:z.string(),points:z.number().int().positive(),kind:z.enum(['service','product'])}),
 z.object({action:z.literal('slot'),companyId:z.string().uuid(),startsAt:z.string().datetime()}),
 z.object({action:z.literal('use'),redemptionId:z.string().uuid()}),
]);
export const ownerAction=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(ownerActionSchema).handler(async({data,context})=>{
 const db=context.supabase;let error;
 if(data.action==='client')({error}=await db.rpc('create_beauty_client',{cid:data.companyId,client_name:data.name,client_phone:data.phone,initial_points:data.points}));
 if(data.action==='points')({error}=await db.rpc('set_beauty_points',{client:data.clientId,balance:data.points}));
 if(data.action==='reward')({error}=await db.rpc('create_beauty_reward',{cid:data.companyId,reward_name:data.name,reward_description:data.description,cost:data.points,reward_kind:data.kind}));
 if(data.action==='slot')({error}=await db.rpc('create_beauty_slot',{cid:data.companyId,slot_time:data.startsAt}));
 if(data.action==='use')({error}=await db.rpc('use_beauty_coupon',{redemption:data.redemptionId}));
 if(error)throw new Error('Não foi possível salvar. Confira os dados e tente novamente.');return {success:true};
});
export const setupStudio=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({studio:z.string().trim().min(2),name:z.string().trim().min(2)})).handler(async({data,context})=>{const {error}=await context.supabase.rpc('setup_beauty_company',{studio_name:data.studio,owner_name:data.name});if(error)throw new Error('Não foi possível criar o salão. Esta conta pode já estar vinculada a um acesso.');return {success:true};});
export const joinClient=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({token:z.string().uuid()})).handler(async({data,context})=>{const {error}=await context.supabase.rpc('join_beauty_client',{token:data.token});if(error)throw new Error('Convite indisponível ou já vinculado a outra conta. Peça um novo link ao salão.');return {success:true};});
export const redeemAndBook=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({rewardId:z.string().uuid(),slotId:z.string().uuid()})).handler(async({data,context})=>{const {data:id,error}=await context.supabase.rpc('redeem_beauty_reward',{reward:data.rewardId,slot:data.slotId});if(error)throw new Error('Resgate não concluído. Confira seus pontos e escolha um horário disponível.');return {id};});

// Busca segura para o filtro do PostgREST: remove caracteres que quebram a sintaxe/curingas.
const cleanSearch=(v:string)=>v.replace(/[%_,()*\\"'`]/g,' ').replace(/\s+/g,' ').trim().slice(0,60);
export const listClients=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({page:z.number().int().min(0).max(100000),search:z.string().max(80)})).handler(async({data,context})=>{
 const db=context.supabase;
 const {data:role,error:roleError}=await db.from('user_roles').select('company_id,role').eq('user_id',context.userId).limit(1).maybeSingle();
 if(roleError||!role||role.role!=='owner')throw new Error('Acesso não disponível.');
 const from=data.page*CLIENTS_PAGE_SIZE;
 let query=db.from('clients').select('id,name,phone,points,invite_token',{count:'exact'}).eq('company_id',role.company_id);
 const term=cleanSearch(data.search);
 if(term)query=query.or(`name.ilike.%${term}%,phone.ilike.%${term}%`);
 const {data:rows,count,error}=await query.order('name').order('id').range(from,from+CLIENTS_PAGE_SIZE-1);
 if(error)throw new Error('Não foi possível carregar as clientes.');
 return {rows:rows??[],total:count??0,pageSize:CLIENTS_PAGE_SIZE};
});
