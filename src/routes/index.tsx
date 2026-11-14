import { createFileRoute } from "@tanstack/react-router";
import { ClientExperience } from "@/components/beleza/simple-loyalty";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Seus benefícios — BelezaFiel" },
    { name: "description", content: "Veja seus pontos, resgate seus benefícios e marque sua próxima visita." },
    { property: "og:title", content: "Seus benefícios — BelezaFiel" },
    { property: "og:description", content: "Seu talento encanta. O cuidado faz suas clientes voltarem." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <ClientExperience />;
}
