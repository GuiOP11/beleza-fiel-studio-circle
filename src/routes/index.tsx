import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/beleza/workspace";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Visão geral — BelezaFiel" },
    { name: "description", content: "Acompanhe suas clientes, fidelização e oportunidades de retorno no BelezaFiel." },
    { property: "og:title", content: "Visão geral — BelezaFiel" },
    { property: "og:description", content: "Seu talento encanta. O cuidado faz suas clientes voltarem." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <Workspace view="dashboard" />;
}
