import { useEffect, useState } from 'react';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { useTranslation } from 'react-i18next';

interface GameRulesProps {
  markdownUrl: string;
}

const GameRules = ({ markdownUrl }: GameRulesProps) => {
  const { t } = useTranslation();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRules() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(markdownUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();

        // micromark convierte el markdown a HTML preservando etiquetas HTML en bruto
        // (allowDangerousHtml permite <video>, <iframe>, etc.)
        const rendered = micromark(text, {
          allowDangerousHtml: true,
          extensions: [gfm()],
          htmlExtensions: [gfmHtml()],
        });

        setHtml(rendered);
      } catch (err) {
        console.error('Error cargando reglas:', err);
        setError('No se pudieron cargar las reglas.');
      } finally {
        setLoading(false);
      }
    }

    if (markdownUrl) loadRules();
  }, [markdownUrl]);

  if (loading) return <p className="text-slate-300">{t("gameplay.rulesLoading")}</p>;
  if (error)   return <p className="text-rose-300">{t("gameplay.rulesError")}</p>;

  return (
    <article
      className="
        prose prose-slate max-w-none dark:prose-invert
        prose-headings:font-bold
        prose-a:text-violet-400 hover:prose-a:underline
        prose-img:rounded-lg
        prose-video:rounded-lg prose-video:w-full
        prose-table:border-collapse prose-table:w-full
        prose-th:border prose-th:border-slate-600 prose-th:bg-slate-800 prose-th:px-3 prose-th:py-2
        prose-td:border prose-td:border-slate-600 prose-td:px-3 prose-td:py-2
        [&_video]:w-full [&_video]:rounded-lg [&_video]:mt-4
        [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:aspect-video [&_iframe]:mt-4
      "
      // dangerouslySetInnerHTML es necesario para renderizar las etiquetas HTML
      // del markdown (video, iframe, etc.). El contenido viene de tu propio servidor.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default GameRules;
