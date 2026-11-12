import { useState, type FormEvent } from "react";
import { SITE } from "../content/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your site"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label htmlFor="cf-name">Your name</label>
      <input id="cf-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <label htmlFor="cf-message">Message</label>
      <textarea id="cf-message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
      <div className="contact-form__actions">
        <button type="submit">Say hello</button>
        {SITE.coffee ? (
          <a className="button button--ghost" href={SITE.coffee}>Buy me a coffee</a>
        ) : null}
      </div>
    </form>
  );
}
