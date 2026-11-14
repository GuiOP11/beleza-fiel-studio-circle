import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/beleza/workspace';
export const Route = createFileRoute('/clientes')({
 head: () => ({meta:[
 {title:'Minhas clientes — BelezaFiel'},
 {name:'description',content:'Gerencie clientes, pontos e relacionamentos no seu estúdio.'},
 {property:'og:title',content:'Minhas clientes — BelezaFiel'},
 {property:'og:description',content:'Gerencie clientes, pontos e relacionamentos no seu estúdio.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 component: Page,
});
function Page() { return <Workspace view="clients"/>; }
