import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { emailjsConfig, mySocials, profile, ui } from "../constants";
import { useT } from "../state/AppState";
import Frame, { Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SectionHeader from "../components/SectionHeader";

function Field({ id, label, as = "input", ...props }) {
  const Tag = as;
  return (
    <label htmlFor={id} className="block">
      <span className="label">&gt; {label}_</span>
      <Tag id={id} name={id} className="field mt-1 resize-none text-[13px]" required {...props} />
    </label>
  );
}

function CopyEmail() {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button type="button" onClick={copy} className="btn-sys" aria-live="polite">
      {copied ? t(ui.copied) : <Scramble text={t(ui.copyEmail)} />}
    </button>
  );
}

export default function Contact() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Carregado só quando é preciso, para não pesar no arranque.
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: form.name,
          to_name: emailjsConfig.toName,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        emailjsConfig.publicKey
      );
      setForm({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const statusLine = t(
    { idle: ui.statusIdle, sending: ui.statusSending, sent: ui.statusSent, error: ui.statusError }[status]
  );

  const links = [
    ...mySocials.map((s) => ({ ...s, display: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") })),
    { name: "Email", href: `mailto:${profile.email}`, display: profile.email },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader index="05" label={t(ui.contactLabel)} title={ui.contactTitle} aside={profile.location.toUpperCase()} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-sm leading-7 text-ink-2">
              {t(ui.contactIntro)}
            </p>
            <p className="label mt-4">{t(profile.availability)}</p>
            <div className="mt-6">
              <CopyEmail />
            </div>
            <ul className="mt-10 border-t border-line">
              {links.map((l) => (
                <li key={l.name} className="border-b border-line">
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface/70 sm:px-2"
                  >
                    <span className="shrink-0 whitespace-nowrap text-[12px] text-ink">
                      <span className="text-mute">[ </span>
                      <Scramble text={l.name.toUpperCase()} />
                      <span className="text-mute"> ]</span>
                    </span>
                    <span className="min-w-0 truncate text-[11px] text-ink-2">{l.display}</span>
                    <span className="text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.12}>
            <Frame archive="TRANSMIT://" node="CONTACT" title={ui.newMessage}>
              <Rule />
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="name" label={t(ui.fieldName)} type="text" autoComplete="name" value={form.name} onChange={onChange} placeholder={ui.phName} />
                  <Field id="email" label={ui.fieldEmail} type="email" autoComplete="email" value={form.email} onChange={onChange} placeholder={ui.phEmail} />
                </div>
                <Field id="message" label={t(ui.fieldMessage)} as="textarea" rows={5} value={form.message} onChange={onChange} placeholder={t(ui.phMessage)} />
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="label" role="status" aria-live="polite">
                    [ STATUS ] :{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={status}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={status === "error" ? "text-red-700" : status === "sent" ? "text-ink" : ""}
                      >
                        {statusLine}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  <button type="submit" className="btn-sys-solid disabled:opacity-50" disabled={status === "sending"}>
                    {status === "sending" ? t(ui.sending) : <Scramble text={t(ui.send)} />}
                  </button>
                </div>
              </form>
            </Frame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
