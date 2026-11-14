<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application structure
- Live loyalty data is accessed through authenticated server functions and owner/client RLS; the legacy demo workspace is not mounted.
- The public index and invitation routes show only the client experience; owner access is separate and protected routes use the _authenticated layout.
- Home-screen support is manifest-only; no offline cache or app-shell service worker is registered in previews.
- WhatsApp actions are individual click-to-chat links with explicit phone input; never pretend a prepared campaign was automatically delivered.

- Points debit, coupon creation and slot reservation occur in one locking database function to prevent double spending and double booking.
- Invite tokens link a signed-in client to an unclaimed client row; never select invite tokens in client workspace responses.
- Owner-created studios grant ownership only over the newly created studio; client invitation accounts cannot create or elevate roles for an existing studio.
