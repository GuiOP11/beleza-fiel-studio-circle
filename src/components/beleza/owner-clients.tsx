import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { ChevronLeft, ChevronRight, Copy, Gift, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { listClients } from '@/lib/loyalty.functions';

type Props = {
  onNew: () => void;
  onAdjust: (client: { id: string; name: string; points: number }) => void;
};

export function OwnerClients({ onNew, onAdjust }: Props) {
  const list = useServerFn(listClients);
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

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ['owner-clients', page, search],
    queryFn: () => list({ data: { page, search } }),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });

  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min(total, (page + 1) * pageSize);

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
          className="field pl-10"
          aria-label="Buscar cliente"
          placeholder="Buscar por nome ou telefone"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {error && !data ? (
        <div className="simple-empty">
          <h3>Não conseguimos carregar as clientes</h3>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      ) : isPending ? (
        <p className="simple-loading">Carregando clientes…</p>
      ) : (
        <>
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
                  <Button size="sm" variant="outline" onClick={() => onAdjust({ id: c.id, name: c.name, points: c.points })}>
                    <Gift />Ajustar pontos
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void copyInvite(c.invite_token)}>
                    <Copy />Copiar link da cliente
                  </Button>
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
          {total > 0 && (
            <div className="flex items-center justify-between gap-3 mt-5 text-xs text-muted-foreground">
              <span>{first}–{last} de {total}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={page === 0 || isFetching} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                  <ChevronLeft />Anterior
                </Button>
                <span>Página {page + 1} de {pages}</span>
                <Button size="sm" variant="outline" disabled={page + 1 >= pages || isFetching} onClick={() => setPage((p) => p + 1)}>
                  Próxima<ChevronRight />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
