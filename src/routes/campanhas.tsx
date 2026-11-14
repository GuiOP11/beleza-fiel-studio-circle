import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/campanhas')({
 head: () => ({meta:[
 {title:'Campanhas — BelezaFiel'},
 {name:'description',content:'Prepare ofertas de horários vagos e convites individuais pelo WhatsApp.'},
 {property:'og:title',content:'Campanhas — BelezaFiel'},
 {property:'og:description',content:'Prepare ofertas de horários vagos e convites individuais pelo WhatsApp.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 beforeLoad: () => { throw redirect({to:'/painel'}); },
});
