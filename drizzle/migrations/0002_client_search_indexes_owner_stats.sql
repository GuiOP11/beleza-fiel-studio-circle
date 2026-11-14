-- Escala para 10.000+ clientes: busca rápida, índices e estatísticas calculadas no banco.

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- Listagem paginada e ordenada por nome, por empresa
CREATE INDEX IF NOT EXISTS clients_company_name_idx ON public.clients (company_id, name, id);

-- Busca parcial (ILIKE '%texto%') por nome e telefone
CREATE INDEX IF NOT EXISTS clients_name_trgm_idx  ON public.clients USING gin (name  extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS clients_phone_trgm_idx ON public.clients USING gin (phone extensions.gin_trgm_ops);

-- Resgates: lista recente e contagem de pendentes
CREATE INDEX IF NOT EXISTS redemption_company_created_idx ON public.reward_redemptions (company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS redemption_company_status_idx  ON public.reward_redemptions (company_id, status);

-- Números do painel calculados no banco (sem baixar todos os clientes)
CREATE OR REPLACE FUNCTION public.owner_stats(cid uuid)
RETURNS TABLE (client_count bigint, total_points bigint, pending_count bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT coalesce(public.owns_company(cid), false) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.clients WHERE company_id = cid),
    (SELECT coalesce(sum(points), 0) FROM public.clients WHERE company_id = cid)::bigint,
    (SELECT count(*) FROM public.reward_redemptions WHERE company_id = cid AND status = 'scheduled');
END $$;

REVOKE ALL ON FUNCTION public.owner_stats(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.owner_stats(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.owner_stats(uuid) FROM anon;