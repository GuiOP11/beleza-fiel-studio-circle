import { createFileRoute } from '@tanstack/react-router';
import { OwnerEntry } from '@/components/beleza/simple-loyalty';
export const Route=createFileRoute('/auth')({head:()=>({meta:[{title:'Acesso ao salão — BelezaFiel'},{name:'description',content:'Acesse os pontos, cupons e agendamentos do seu salão.'},{property:'og:title',content:'Acesso ao salão — BelezaFiel'},{property:'og:description',content:'Acesse os pontos, cupons e agendamentos do seu salão.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:OwnerEntry});
