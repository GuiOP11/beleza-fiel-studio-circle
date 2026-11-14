import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
export const getLoyaltyWorkspace = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase;
 const {data:role,error:roleError}=await db.from('user_roles').select('company_id,role').eq('user_id',context.userId).limit(1).maybeSingle();
 if(roleError)throw new Error('Não foi possível carregar seu acesso.');
 if(!role)return null;
 const owner=role.role==='owner';
 const [{data:company,error:ce},{data:clients,error:cle},{data:rewards,error:re},{data:slots,error:se},{data:redemptions,error:rde}]=await Promise.all([
 db.from('companies').select('id,name').eq('id',role.company_id).single(),
 db.from('clients').select('id,company_id,name,phone,points,user_id').eq('company_id',role.company_id).order('name'),
 db.from('loyalty_rewards').select('*').eq('company_id',role.company_id).eq('active',true).order('points'),
 db.from('booking_slots').select('*').eq('company_id',role.company_id).order('starts_at'),
 db.from('reward_redemptions').select('*').eq('company_id',role.company_id).order('created_at',{ascending:false}),
 ]);
 if(ce||cle||re||se||rde||!company)throw new Error('Não foi possível carregar os dados do salão.');
 const {data:invites,error:ie}=owner?await db.from('clients').select('id,invite_token').eq('company_id',role.company_id):{data:[],error:null};
 if(ie)throw new Error('Não foi possível carregar os convites.');
 return {role:role.role,company,clients:clients??[],rewards:rewards??[],slots:slots??[],redemptions:redemptions??[],invites:invites??[]};
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
