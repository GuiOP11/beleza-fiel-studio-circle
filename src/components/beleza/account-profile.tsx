import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, UserRound, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAccount, SignOut } from './access';
import { prepareProfilePhoto, validateProfilePhoto } from '@/lib/profile-photo';

const BUCKET = 'profile-photos';

export function AccountProfile({ owner = false }: { owner?: boolean }) {
  const { user, loading } = useAccount();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const queryKey = ['account-profile', user?.id];
  const { data: profile, isPending, error, refetch } = useQuery({
    queryKey,
    enabled: !loading && Boolean(user),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from('profiles').select('name,avatar_path').eq('id', user.id).single();
      if (error) throw new Error('Não foi possível carregar seu perfil.');
      let photo: string | null = null;
      if (data.avatar_path) {
        const { data: signed, error: photoError } = await supabase.storage.from(BUCKET).createSignedUrl(data.avatar_path, 3600);
        if (photoError) throw new Error('Não foi possível carregar sua foto.');
        photo = signed.signedUrl;
      }
      return { ...data, photo };
    },
  });

  async function changePhoto(file: File) {
    if (!user || busy) return;
    const validation = validateProfilePhoto(file);
    if (validation) { toast.error(validation); return; }
    setBusy(true);
    let uploadedPath: string | null = null;
    try {
      const photo = await prepareProfilePhoto(file);
      const path = `${user.id}/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, photo, { contentType: 'image/webp', upsert: false });
      if (error) throw new Error('Não foi possível enviar sua foto. Tente novamente.');
      uploadedPath = path;
      const { data: saved, error: saveError } = await supabase.from('profiles').update({ avatar_path: path }).eq('id', user.id).select('id').single();
      if (saveError || !saved) throw new Error('Não foi possível salvar sua foto.');
      uploadedPath = null;
      if (profile?.avatar_path) await supabase.storage.from(BUCKET).remove([profile.avatar_path]);
      await queryClient.invalidateQueries({ queryKey });
      toast.success('Foto atualizada!');
    } catch (error) {
      if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
      toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar a foto.');
    } finally { setBusy(false); }
  }

  async function removePhoto() {
    if (!user || busy || !profile?.avatar_path) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('profiles').update({ avatar_path: null }).eq('id', user.id).select('id').single();
      if (error) throw new Error('Não foi possível remover sua foto.');
      await supabase.storage.from(BUCKET).remove([profile.avatar_path]);
      await queryClient.invalidateQueries({ queryKey });
      toast.success('Foto removida.');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Não foi possível remover sua foto.'); }
    finally { setBusy(false); }
  }

  if (!user) return null;
  return <>
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label="Meu perfil" className="gap-2">
      {profile?.photo ? <img src={profile.photo} alt="Minha foto" className="size-8 shrink-0 rounded-full object-cover" /> : <span className="size-8 rounded-full bg-rose-soft text-rose flex items-center justify-center"><UserRound size={18} /></span>}
      <span>Meu perfil</span>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogTitle>Meu perfil</DialogTitle>
        <DialogDescription>Sua foto e sua conta no BelezaFiel.</DialogDescription>
        {isPending ? <p role="status">Carregando perfil…</p> : error ? <div className="grid gap-3"><p role="alert">Não foi possível carregar seu perfil.</p><Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div> : <>
          <div className="flex flex-col items-center gap-3 py-4">
            {profile?.photo ? <img src={profile.photo} alt="Foto do perfil" className="size-28 rounded-full object-cover border border-border" /> : <span className="size-28 rounded-full bg-rose-soft text-rose flex items-center justify-center"><UserRound size={44} /></span>}
            <h2 className="text-lg font-semibold text-center break-words max-w-full">{profile?.name || 'Minha conta'}</h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" disabled={busy} onClick={() => input.current?.click()}><Camera />{busy ? 'Salvando…' : profile?.photo ? 'Trocar foto' : 'Adicionar foto'}</Button>
              {profile?.avatar_path && <Button variant="ghost" size="icon" disabled={busy} title="Remover foto" aria-label="Remover foto" onClick={removePhoto}><Trash2 /></Button>}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG ou WebP · até 5 MB</p>
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="Selecionar foto do perfil" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void changePhoto(file); }} />
          </div>
        </>}
        <div className="border-t border-border py-4 grid gap-2"><span className="text-xs text-muted-foreground flex items-center gap-2"><Mail size={14} />E-mail da conta</span><p className="text-sm break-all" aria-label="E-mail da conta">{user.email || 'E-mail não informado'}</p></div>
        <div className="border-t border-border pt-3 flex justify-end"><SignOut owner={owner} /></div>
      </DialogContent>
    </Dialog>
  </>;
}