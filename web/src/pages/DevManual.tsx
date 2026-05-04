import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, ChevronDown, Search, X } from 'lucide-react';
import { MANUAL_SECTIONS } from '../features/developer/data/manual.data';
import MarkdownRenderer from '../shared/components/MarkdownRenderer';

// ─── Section accordion ────────────────────────────────────────────────────────

function SectionItem({ section, index }: { section: typeof MANUAL_SECTIONS[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors ${
      open ? 'border-violet-500/30 bg-slate-900/80' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
    }`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-start gap-4 px-5 py-5 text-left"
      >
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          open ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-500'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <p className={`font-semibold leading-snug ${open ? 'text-white' : 'text-slate-200'}`}>
            {section.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{section.description}</p>
        </div>

        <ChevronDown size={17} className={`mt-1 shrink-0 text-slate-500 transition-transform duration-300 ${
          open ? 'rotate-180 text-violet-400' : ''
        }`} />
      </button>

      {/* Expandable content */}
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" ref={contentRef}>
          <div className="border-t border-slate-800/80 px-5 pb-6 pt-5">
            <MarkdownRenderer content={section.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevManual() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MANUAL_SECTIONS.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.content.toLowerCase().includes(query.toLowerCase()),
      )
    : MANUAL_SECTIONS;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero */}
      <div className="relative border-b border-slate-800/60 bg-gradient-to-b from-violet-950/30 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link to="/developer" className="mb-6 inline-flex items-center gap-2 text-sm text-violet-400 transition-colors hover:text-violet-300">
            <ArrowLeft size={16} />
            {t('developer.manual.backToPanel')}
          </Link>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3">
              <BookOpen size={28} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('developer.manual.title')}</h1>
              <p className="mt-1 text-slate-400">{t('developer.manual.subtitle')}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-8">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('developer.manual.searchPlaceholder')}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Search size={36} className="mx-auto text-slate-700" />
            <p className="mt-4 text-slate-400">{t('developer.manual.noResults')}</p>
            <button type="button" onClick={() => setQuery('')}
              className="mt-3 text-sm text-violet-400 hover:text-violet-300">
              {t('developer.manual.clearSearch')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {query && (
              <p className="mb-4 text-sm text-slate-500">
                {t('developer.manual.results', { count: filtered.length })} &ldquo;{query}&rdquo;
              </p>
            )}
            {filtered.map(section => (
              <SectionItem
                key={section.id}
                section={section}
                index={MANUAL_SECTIONS.indexOf(section)}
              />
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-xs text-slate-600">
          {t('developer.manual.footerText')}{' '}
          <Link to="/contacto" className="text-violet-700 hover:text-violet-500">
            {t('developer.manual.footerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
