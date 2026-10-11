import { profile, ui } from "../constants";
import { useT } from "../state/AppState";
import useNow from "../components/useNow";

export default function Footer() {
  const t = useT();
  const now = useNow(30_000);
  const local = now.toLocaleTimeString("en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit" });
  return (
    <footer className="wrap pb-8 pt-16">
      <div className="h-px w-full bg-line" />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {now.getFullYear()} {profile.name.toUpperCase()} · {t(ui.builtWith)}
        </p>
        <p className="label">
          {profile.location.toUpperCase()} · {ui.local} {local}
        </p>
        <a href="#home" className="btn-sys self-start sm:self-auto">
          {ui.top}
        </a>
      </div>
    </footer>
  );
}
