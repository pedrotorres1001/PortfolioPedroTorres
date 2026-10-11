import { profile } from "../constants";
import useNow from "../components/useNow";

export default function Footer() {
  const now = useNow(30_000);
  const local = now.toLocaleTimeString("en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit" });
  return (
    <footer className="wrap pb-8 pt-16">
      <div className="h-px w-full bg-line" />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {now.getFullYear()} {profile.name.toUpperCase()} · BUILT WITH REACT + THREE.JS
        </p>
        <p className="label">
          {profile.location.toUpperCase()} · LOCAL {local}
        </p>
        <a href="#home" className="btn-sys self-start sm:self-auto">
          [↑ TOP]
        </a>
      </div>
    </footer>
  );
}
