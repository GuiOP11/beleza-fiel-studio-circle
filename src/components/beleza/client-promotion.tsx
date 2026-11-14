import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { promotionMessage, promotionLink } from '@/lib/client-list';

export type PromotionClient = { name: string; phone: string };
type Props = { client: PromotionClient; studio: string; onClose: () => void };

export function ClientPromotion({ client, studio, onClose }: Props) {
  const [phone, setPhone] = useState(client.phone);
  const [promotion, setPromotion] = useState('Lembrei de você! 💕 Que tal agendar sua próxima manutenção? Me responda para combinarmos um horário.');
  const [confirmed, setConfirmed] = useState(false);
  const message = promotionMessage(client.name, studio, promotion);
  const link = promotionLink(phone, message);
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent>
      <DialogTitle>Promoção pelo WhatsApp</DialogTitle>
      <DialogDescription>{client.name} · {studio}</DialogDescription>
      <label className="field-label" htmlFor="promotion-phone">WhatsApp da cliente</label>
      <input id="promotion-phone" className="field" type="tel" value={phone} onChange={event => { setPhone(event.target.value); setConfirmed(false); }} placeholder="DDD + número" />
      {phone && !link && <p className="text-sm text-destructive">Informe um telefone válido com DDD.</p>}
      <label className="field-label" htmlFor="promotion-model">Modelo de mensagem</label>
      <select id="promotion-model" className="field" defaultValue="return" onChange={event => setPromotion(event.target.value === 'return' ? 'Lembrei de você! 💕 Que tal agendar sua próxima manutenção? Me responda para combinarmos um horário.' : '')}><option value="return">Convite para manutenção</option><option value="offer">Escrever uma promoção</option></select>
      <label className="field-label" htmlFor="promotion-text">Sua promoção</label>
      <textarea id="promotion-text" className="field min-h-24 resize-y" rows={3} maxLength={1500} value={promotion} onChange={event => setPromotion(event.target.value)} placeholder="Escreva a oferta que deseja compartilhar" />
      {promotion.trim() && <div className="border-t border-border pt-3"><h3 className="text-sm font-semibold mb-2">Mensagem para {client.name}</h3><p className="text-sm whitespace-pre-wrap break-words text-muted-foreground">{message}</p></div>}
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1" />Confirmo que este é o WhatsApp de {client.name}.</label>
      <p className="text-xs text-muted-foreground">Você confirma o envio no WhatsApp. Nenhuma mensagem é enviada automaticamente.</p>
      <Button disabled={!link || !promotion.trim() || !confirmed} onClick={() => { if (link && confirmed && promotion.trim()) window.open(link, '_blank', 'noopener,noreferrer'); }}><MessageCircle />Abrir no WhatsApp</Button>
    </DialogContent>
  </Dialog>;
}