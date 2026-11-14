import { useEffect, useRef, useState } from "react";
import { SITE } from "../content/site";
import { AVATAR_QA, AVATAR_SCOPE, answer } from "../content/avatar";

// Bare-bones take on Supabase's Realtime Avatar Stack: Presence shows who else is reading,
// and Dhruv's avatar opens a scripted Q&A bounded to his practice. No auth, no LLM.
type Peer = { id: string; hue: number };
type Msg = { from: "you" | "me"; text: string };

function usePresence(room: string) {
  const [peers, setPeers] = useState<Peer[]>([]);
  useEffect(() => {
    if (!SITE.supabaseUrl || !SITE.supabaseKey) return;
    const me = { id: Math.random().toString(36).slice(2, 10), hue: Math.floor(Math.random() * 360) };
    let stop = () => {};
    import("@supabase/realtime-js").then(({ RealtimeClient }) => {
      const ws = SITE.supabaseUrl.replace(/^http/, "ws") + "/realtime/v1";
      const client = new RealtimeClient(ws, { params: { apikey: SITE.supabaseKey } });
      const ch = client.channel(room, { config: { presence: { key: me.id } } });
      ch.on("presence", { event: "sync" }, () => {
        const state = ch.presenceState<Peer>();
        setPeers(Object.values(state).flatMap((v) => (v[0] && v[0].id !== me.id ? [{ id: v[0].id, hue: v[0].hue }] : [])));
      }).subscribe((status) => {
        if (status === "SUBSCRIBED") ch.track(me);
      });
      stop = () => { ch.unsubscribe(); client.disconnect(); };
    });
    return () => stop();
  }, [room]);
  return peers;
}

export default function SiteAvatar() {
  const peers = usePresence("portfolio");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => { log.current?.scrollTo(0, log.current.scrollHeight); }, [msgs]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "you", text }, { from: "me", text: answer(text) ?? AVATAR_SCOPE }]);
    setDraft("");
  };

  const shown = peers.slice(0, 3);
  const extra = peers.length - shown.length;

  return (
    <div className="sa">
      {open ? (
        <div className="sa-panel" role="dialog" aria-label="Ask Dhruv about his practice">
          <div className="sa-head">
            <strong>Ask about my practice</strong>
            <button type="button" className="sa-x" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <div className="sa-log" ref={log}>
            <p className="sa-me">Hi, I'm Dhruv. Ask me about identity governance, access control assurance or hybrid Entra ID and AD.</p>
            {msgs.map((m, i) => <p key={i} className={m.from === "me" ? "sa-me" : "sa-you"}>{m.text}</p>)}
          </div>
          <div className="sa-chips">
            {AVATAR_QA.map((x) => <button type="button" key={x.q} onClick={() => ask(x.q)}>{x.q}</button>)}
          </div>
          <form className="sa-form" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a question" maxLength={200} aria-label="Your question" />
            <button type="submit">Ask</button>
          </form>
        </div>
      ) : null}
      <div className="sa-stack">
        {shown.map((p) => (
          <span key={p.id} className="sa-peer" style={{ background: `hsl(${p.hue} 55% 55%)` }} title="Someone else reading now" />
        ))}
        {extra > 0 ? <span className="sa-peer sa-more" title={`${extra} more reading now`}>+{extra}</span> : null}
        <button type="button" className="sa-dhruv" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Ask Dhruv about his practice">
          <img src={SITE.photo.src} alt="" width={48} height={48} />
        </button>
      </div>
    </div>
  );
}
