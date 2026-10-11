import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { seo } from "./src/constants/index.js";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Injeta o título e a descrição de src/constants no index.html,
// para todo o conteúdo continuar centralizado num só ficheiro.
const seoFromConstants = () => ({
  name: "seo-from-constants",
  transformIndexHtml: (html) =>
    html
      .replaceAll("%SEO_TITLE%", escape(seo.title))
      .replaceAll("%SEO_DESCRIPTION%", escape(seo.description)),
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFromConstants()],
  base: "/PortfolioPedroTorres/",
  build: {
    // three.js só entra no chunk lazy da cena 3D (~850 kB, carregado após o primeiro paint)
    chunkSizeWarningLimit: 1000,
  },
});
