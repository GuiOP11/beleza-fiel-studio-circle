import { createFileRoute } from '@tanstack/react-router';
import { ClientExperience } from '@/components/beleza/simple-loyalty';
export const Route=createFileRoute('/convite/$token')({head:()=>({meta:[{title:'Seu convite — BelezaFiel'},{name:'description',content:'Seu acesso individual aos pontos, cupons e benefícios do salão.'},{property:'og:title',content:'Seu convite — BelezaFiel'},{property:'og:description',content:'Seu acesso individual aos pontos, cupons e benefícios do salão.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Page});
function Page(){const {token}=Route.useParams();return <ClientExperience token={token}/>;}
