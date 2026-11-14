import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialClients, company, tenantRows, type Client } from '@/lib/beleza';
interface Store { clients:Client[]; setClients:React.Dispatch<React.SetStateAction<Client[]>>; campaigns:string[]; setCampaigns:React.Dispatch<React.SetStateAction<string[]>>; redemptions:string[]; setRedemptions:React.Dispatch<React.SetStateAction<string[]>>; }
const StoreContext=createContext<Store|null>(null);
export function BeautyProvider({children}:{children:ReactNode}) { const [clients,setClients]=useState(()=>tenantRows(initialClients,company.id));const [campaigns,setCampaigns]=useState<string[]>([]);const [redemptions,setRedemptions]=useState<string[]>([]);return <StoreContext.Provider value={{clients,setClients,campaigns,setCampaigns,redemptions,setRedemptions}}>{children}</StoreContext.Provider>; }
export function useBeauty() {const value=useContext(StoreContext);if(!value)throw new Error('BeautyProvider required');return value;}
