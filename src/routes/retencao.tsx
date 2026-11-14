import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/retencao')({
 head: () => ({meta:[
 {title:'Radar de retenção — BelezaFiel'},
 {name:'description',content:'Identifique clientes no ciclo de retorno e prepare um convite personalizado.'},
 {property:'og:title',content:'Radar de retenção — BelezaFiel'},
 {property:'og:description',content:'Identifique clientes no ciclo de retorno e prepare um convite personalizado.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 beforeLoad: () => { throw redirect({to:'/painel'}); },
});
