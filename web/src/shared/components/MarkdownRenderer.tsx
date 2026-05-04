import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Copy, Check, Info, AlertTriangle, Lightbulb, XCircle, CheckCircle2 } from 'lucide-react';
import SdkFlowDiagram from '../../features/developer/components/SdkFlowDiagram';
import EloTable from '../../features/developer/components/EloTable';

// ─── Remark plugin: GitHub-style alerts ([!NOTE], [!TIP], …) ─────────────────
// remark-gfm 4.x does not ship alert support, so we handle it ourselves.
// The plugin tags matching blockquotes with hProperties.className so that
// remark-rehype emits <blockquote class="markdown-alert markdown-alert-note">
// which BlockquoteWrapper picks up below.

function remarkGfmAlerts() {
  return (tree: object) => {
    function walk(node: any) {
      if (node?.children) node.children.forEach(walk);
      if (node?.type !== 'blockquote') return;
      const first = node.children?.[0];
      if (first?.type !== 'paragraph') return;
      const txt = first.children?.[0];
      if (txt?.type !== 'text') return;
      const m = (txt.value as string).match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i);
      if (!m) return;
      const type = m[1].toLowerCase();
      node.data = { ...(node.data ?? {}), hProperties: { className: ['markdown-alert', `markdown-alert-${type}`] } };
      txt.value = (txt.value as string).slice(m[0].length);
      if (!txt.value) first.children.shift();
      if (!first.children.length) node.children.shift();
    }
    walk(tree);
  };
}

// ─── Code block with copy ────────────────────────────────────────────────────

function CodeBlock({ language, content }: { language: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 my-1">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
          </div>
          {language && (
            <span className="ml-1 rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-500">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-200">
        <code>{content}</code>
      </pre>
    </div>
  );
}

// ─── Callout detection from GitHub alert syntax ───────────────────────────────

type AlertVariant = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const ALERT_CONFIG: Record<AlertVariant, {
  icon: React.ElementType; border: string; bg: string; title: string; titleCls: string; iconCls: string;
}> = {
  note:      { icon: Info,          border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    title: 'Nota',       titleCls: 'text-blue-300',    iconCls: 'text-blue-400'    },
  tip:       { icon: Lightbulb,     border: 'border-violet-500/30',  bg: 'bg-violet-500/8',  title: 'Consejo',    titleCls: 'text-violet-300',  iconCls: 'text-violet-400'  },
  important: { icon: CheckCircle2,  border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', title: 'Importante', titleCls: 'text-emerald-300', iconCls: 'text-emerald-400' },
  warning:   { icon: AlertTriangle, border: 'border-amber-500/30',   bg: 'bg-amber-500/8',   title: 'Atención',   titleCls: 'text-amber-300',   iconCls: 'text-amber-400'   },
  caution:   { icon: XCircle,       border: 'border-rose-500/30',    bg: 'bg-rose-500/8',    title: 'Cuidado',    titleCls: 'text-rose-300',    iconCls: 'text-rose-400'    },
};

function Callout({ variant, children }: { variant: AlertVariant; children: React.ReactNode }) {
  const { icon: Icon, border, bg, title, titleCls, iconCls } = ALERT_CONFIG[variant];
  return (
    <div className={`my-1 flex gap-3 rounded-xl border p-4 ${border} ${bg}`}>
      <Icon size={17} className={`mt-0.5 shrink-0 ${iconCls}`} />
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-xs font-bold uppercase tracking-widest ${titleCls}`}>{title}</p>
        <div className="text-sm leading-relaxed text-slate-300 [&>p]:mb-0">{children}</div>
      </div>
    </div>
  );
}

// ─── Color palette ────────────────────────────────────────────────────────────

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const PALETTE: { name: string; hex: string[] }[] = [
  { name: 'Slate',   hex: ['#f8fafc','#f1f5f9','#e2e8f0','#cbd5e1','#94a3b8','#64748b','#475569','#334155','#1e293b','#0f172a','#020617'] },
  { name: 'Violet',  hex: ['#f5f3ff','#ede9fe','#ddd6fe','#c4b5fd','#a78bfa','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#2e1065'] },
  { name: 'Indigo',  hex: ['#eef2ff','#e0e7ff','#c7d2fe','#a5b4fc','#818cf8','#6366f1','#4f46e5','#4338ca','#3730a3','#312e81','#1e1b4b'] },
  { name: 'Emerald', hex: ['#ecfdf5','#d1fae5','#a7f3d0','#6ee7b7','#34d399','#10b981','#059669','#047857','#065f46','#064e3b','#022c22'] },
  { name: 'Amber',   hex: ['#fffbeb','#fef3c7','#fde68a','#fcd34d','#fbbf24','#f59e0b','#d97706','#b45309','#92400e','#78350f','#451a03'] },
  { name: 'Rose',    hex: ['#fff1f2','#ffe4e6','#fecdd3','#fda4af','#fb7185','#f43f5e','#e11d48','#be123c','#9f1239','#881337','#4c0519'] },
];

function ColorPalette() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-5">
      <div className="min-w-max">
        {/* Shade headers */}
        <div className="mb-3 grid" style={{ gridTemplateColumns: '5rem repeat(11, 2.25rem)' }}>
          <div />
          {SHADES.map(s => (
            <p key={s} className="text-center font-mono text-[10px] font-semibold text-slate-500">{s}</p>
          ))}
        </div>

        {/* Color rows */}
        <div className="space-y-2">
          {PALETTE.map(({ name, hex }) => (
            <div key={name} className="grid items-center" style={{ gridTemplateColumns: '5rem repeat(11, 2.25rem)' }}>
              <span className="pr-2 text-xs font-medium text-slate-400">{name}</span>
              {hex.map((color, i) => (
                <div
                  key={i}
                  title={`${name}-${SHADES[i]}: ${color}`}
                  className="mx-auto h-8 w-8 cursor-default rounded-lg shadow-sm transition-transform duration-150 hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Custom blockquote — detects remark-gfm 4.x alert classes ───────────────

function BlockquoteWrapper({ className = '', children }: { className?: string; children: React.ReactNode }) {
  // remark-gfm 4.x converts > [!NOTE] to <blockquote class="markdown-alert markdown-alert-note">
  const alertMatch = className.match(/markdown-alert-(\w+)/);
  if (alertMatch) {
    const rawVariant = alertMatch[1].toLowerCase();
    if (rawVariant in ALERT_CONFIG) {
      const variant = rawVariant as AlertVariant;
      // Filter out the auto-generated title <p class="markdown-alert-title"> remark-gfm injects
      const childArray = Array.isArray(children) ? children : [children];
      const content = childArray.filter(child => {
        const el = child as React.ReactElement | null;
        return !el?.props?.className?.includes?.('markdown-alert-title');
      });
      return <Callout variant={variant}>{content}</Callout>;
    }
  }

  // Default blockquote
  return (
    <blockquote className="my-1 border-l-4 border-violet-500/40 pl-4 text-slate-400 italic">
      {children}
    </blockquote>
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGfmAlerts]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-semibold text-slate-200 mt-1">{children}</h4>,

          // Paragraph
          p: ({ children }) => <p className="text-sm leading-relaxed text-slate-300">{children}</p>,

          // Code blocks — intercepted at pre level
          pre: ({ children }) => {
            const codeEl = (Array.isArray(children) ? children[0] : children) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
            const language = (codeEl?.props?.className ?? '').replace('language-', '');
            const content  = String(codeEl?.props?.children ?? '').replace(/\n$/, '');
            return <CodeBlock language={language} content={content} />;
          },

          // Inline code
          code: ({ children, className }) => {
            if (className) return <code className={className}>{children}</code>;
            return (
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-violet-300">
                {children}
              </code>
            );
          },

          // Custom markdown components triggered by class names
          div: ({ className, children }) => {
            if (className?.includes('m4g-palette'))    return <ColorPalette />;
            if (className?.includes('m4g-sdk-flow'))   return <SdkFlowDiagram />;
            if (className?.includes('m4g-elo-table'))  return <EloTable />;
            return <div className={className}>{children}</div>;
          },

          // Blockquote / callout
          blockquote: ({ className, children }) => <BlockquoteWrapper className={className}>{children}</BlockquoteWrapper>,

          // Lists
          ul: ({ children }) => <ul className="ml-5 list-disc space-y-1.5 text-sm text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="ml-5 list-decimal space-y-1.5 text-sm text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // Horizontal rule
          hr: () => <hr className="border-slate-800" />,

          // Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="text-violet-400 underline-offset-2 hover:text-violet-300 hover:underline transition-colors">
              {children}
            </a>
          ),

          // Inline formatting
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em:     ({ children }) => <em className="italic text-slate-400">{children}</em>,

          // Table (remark-gfm)
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-800/60 text-xs uppercase text-slate-400">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-800 text-slate-300">{children}</tbody>,
          tr:    ({ children }) => <tr className="transition-colors hover:bg-white/5">{children}</tr>,
          th:    ({ children }) => <th className="px-4 py-3 text-left font-semibold">{children}</th>,
          td:    ({ children }) => <td className="px-4 py-3">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
