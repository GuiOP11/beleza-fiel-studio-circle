import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { ChevronLeft, ChevronRight, Copy, Gift, Plus, Search, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { listClients } from '@/lib/loyalty.functions';
import { CLIENTS_PAGE_SIZE } from '@/lib/client-list';
import { useAccount } from './access';
import { ClientPromotion, type PromotionClient } from './client-promotion';

type Props = {
  studio: string;
  onNew: () => void;
  onAdjust: (client: { id: string; name: string; points: number }) => void;
};

export function OwnerClients({ studio, onNew, onAdjust }: Props) {
  const list = useServerFn(listClients);
  const { user, loading } = useAccount();
  const [promotionClient, setPromotionClient] = useState<PromotionClient | null>(null);
  const [page, setPage] = useState(0);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  // Espera a dona parar de digitar antes de consultar o banco.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(input.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isPending, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['owner-clients', user?.id, page, search],
    queryFn: () => list({ data: { page, search } }),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
    enabled: !loading && Boolean(user),
  });

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? CLIENTS_PAGE_SIZE;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min(total, (page + 1) * pageSize);
  const updating = isFetching || input.trim() !== search;

  useEffect(() => {
    if (data && !isPlaceholderData && page >= pages) setPage(pages - 1);
  }, [data, isPlaceholderData, page, pages]);

  const pagination = <nav aria-label="Páginas de clientes" className="flex flex-wrap items-center justify-between gap-3 my-5 text-xs text-muted-foreground">
    <span role="status">{updating ? 'Atualizando…' : `${first}–${last} de ${total}`}</span>
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" aria-label="Página anterior" disabled={page === 0 || updating} onClick={() => setPage(p => Math.max(0, p - 1))}><ChevronLeft />Anterior</Button>
      <label className="flex items-center gap-2">Página<select aria-label="Ir para página" className="border border-border rounded-md bg-background text-foreground h-8 px-2" value={page} disabled={updating} onChange={event => setPage(Number(event.target.value))}>{Array.from({ length: pages }, (_, index) => <option key={index} value={index}>{index + 1}</option>)}</select>de {pages}</label>
      <Button size="sm" variant="outline" aria-label="Próxima página" disabled={page + 1 >= pages || updating} onClick={() => setPage(p => p + 1)}>Próxima<ChevronRight /></Button>
    </div>
  </nav>;

  async function copyInvite(token: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/convite/${token}`);
      toast.success('Link da cliente copiado! Envie pelo WhatsApp.');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  }

  return (
    <>
      <div className="simple-heading">
        <h2>Clientes e pontos</h2>
        <Button onClick={onNew}><Plus />Nova cliente</Button>
      </div>
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        <input
          className="field ps-10!"
          aria-label="Buscar cliente"
          placeholder="Buscar por nome ou telefone"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {error ? (
        <div className="simple-empty">
          <h3>Não conseguimos carregar as clientes</h3>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      ) : isPending ? (
        <p className="simple-loading">Carregando clientes…</p>
      ) : (
        <>
          {total > 0 && pagination}
          <div className="simple-clients" aria-busy={isFetching}>
            {data?.rows.map((c) => (
              <article className="simple-client" key={c.id}>
                <div className="avatar">{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <h3>{c.name}</h3>
                  <p>{c.phone || 'WhatsApp não informado'}</p>
                </div>
                <strong className="client-points">{c.points}<small> pontos</small></strong>
                <div className="client-actions">
                  <Button size="sm" variant="outline" disabled={updating} onClick={() => onAdjust({ id: c.id, name: c.name, points: c.points })}>
                    <Gift />Ajustar pontos
                  </Button>
                  <Button size="sm" variant="outline" disabled={updating} onClick={() => void copyInvite(c.invite_token)}>
                    <Copy />Copiar link da cliente
                  </Button>
                  <Button size="sm" variant="outline" disabled={updating} onClick={() => setPromotionClient({ name: c.name, phone: c.phone })}><MessageCircle />Enviar promoção</Button>
                </div>
              </article>
            ))}
          </div>
          {total === 0 && (
            <div className="simple-empty">
              <h3>{search ? 'Nenhuma cliente encontrada' : 'Nenhuma cliente aqui ainda'}</h3>
              <p>{search ? 'Tente outro nome ou telefone.' : 'Cadastre uma cliente para começar a acompanhar os pontos.'}</p>
            </div>
          )}
          {total > 0 && pagination}
        </>
      )}
      {promotionClient && <ClientPromotion client={promotionClient} studio={studio} onClose={() => setPromotionClient(null)} />}
    </>
  );
}
