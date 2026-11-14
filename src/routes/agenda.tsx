import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/agenda')({
 head: () => ({meta:[
 {title:'Minha agenda — BelezaFiel'},
 {name:'description',content:'Acompanhe os próximos atendimentos e cuidados agendados.'},
 {property:'og:title',content:'Minha agenda — BelezaFiel'},
 {property:'og:description',content:'Acompanhe os próximos atendimentos e cuidados agendados.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 beforeLoad: () => { throw redirect({to:'/painel'}); },
});
