import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/beleza/workspace';
export const Route = createFileRoute('/portal')({
 head: () => ({meta:[
 {title:'Portal da cliente — BelezaFiel'},
 {name:'description',content:'Seus pontos, recompensas e momentos de beleza no Studio Bella.'},
 {property:'og:title',content:'Portal da cliente — BelezaFiel'},
 {property:'og:description',content:'Seus pontos, recompensas e momentos de beleza no Studio Bella.'},
 {property:'og:type',content:'website'},
 {name:'twitter:card',content:'summary_large_image'}
 ]}),
 component: Page,
});
function Page() { return <Workspace view="portal"/>; }
