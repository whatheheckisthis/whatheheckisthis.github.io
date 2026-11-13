import { useState, type FormEvent } from "react";
import { SITE } from "../content/site";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!SITE.contactEndpoint) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const r = await fetch(SITE.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const j = await r.json().catch(() => ({ ok: false }));
      if (r.ok && j.ok) { setStatus("sent"); setName(""); setEmail(""); setMessage(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label htmlFor="cf-name">Your name</label>
      <input id="cf-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <label htmlFor="cf-email">Your email <span className="muted">(so I can reply)</span></label>
      <input id="cf-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="cf-message">Message</label>
      <textarea id="cf-message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
      <div className="contact-form__hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="contact-form__actions">
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Say hello"}</button>
        {SITE.coffee ? (
          <a className="button button--ghost" href={SITE.coffee}>Buy me a coffee</a>
        ) : null}
      </div>
      <p className="contact-form__status" role="status" aria-live="polite">
        {status === "sent" ? "Thanks, your message is on its way." : status === "error" ? "Sorry, that didn't send. Please try again, or reach me on LinkedIn." : ""}
      </p>
    </form>
  );
}
