import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/beleza/workspace';
export const Route = createFileRoute('/recompensas')({
 head: () => ({meta:[
 {title:'Recompensas — BelezaFiel'},
 {name:'description',content:'Benefícios especiais para as clientes fiéis do seu estúdio.'},
 {property:'og:title',content:'Recompensas — BelezaFiel'},
 {property:'og:description',content:'Benefícios especiais para as clientes fiéis do seu estúdio.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 component: Page,
});
function Page() { return <Workspace view="rewards"/>; }
