import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, ArrowRight, Check, Code2, FileText,
  Gamepad2, ImageIcon, Loader2, Tag, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';
import Header from '../shared/layout/Header';
import Footer from '../shared/layout/Footer';

// ─── Constants ────────────────────────────────────────────────────────────────

const GENRES = [
  'Acción', 'Aventura', 'Puzzle', 'Plataformas', 'Arcade',
  'Estrategia', 'Rol (RPG)', 'Simulación', 'Deportes',
  'Multijugador', 'Educativo', 'Otro',
];
const MODES = ['Singleplayer', 'Multijugador', 'Online', 'Cooperativo', 'Competitivo'];

const STEP_ICONS = [Gamepad2, Code2, ImageIcon, Check] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 44);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

function fileExt(file: File) { return file.name.split('.').pop() ?? 'bin'; }

function fileSize(file: File) {
  return file.size > 1024 * 1024
    ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
    : `${(file.size / 1024).toFixed(0)} KB`;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors';

function Field({ label, required, hint, counter, children }: {
  label: string; required?: boolean; hint?: string; counter?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}{required && <span className="ml-1 text-rose-400">*</span>}
        </label>
        {counter && <span className="text-xs text-slate-600">{counter}</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

type DropZoneProps = {
  label: string; hint: string; accept: string; icon: React.ElementType;
  file: File | null; onChange: (f: File) => void; onClear: () => void;
};

function FileDropZone({ label, hint, accept, icon: Icon, file, onChange, onClear }: DropZoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) onChange(f);
  }, [onChange]);

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ''; }} />

        {isImage && file ? (
          <div className="relative">
            <img src={URL.createObjectURL(file)} alt="preview" className="h-44 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
              <button type="button" onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white">
                {t('developer.gameNew.change')}
              </button>
            </div>
            <button type="button" onClick={onClear}
              className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1 text-slate-300 hover:text-white">
              <X size={13} />
            </button>
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center justify-center gap-3 px-4 py-8"
            onClick={() => inputRef.current?.click()}>
            {file ? (
              <>
                <Icon size={26} className="text-violet-400" />
                <div className="text-center">
                  <p className="max-w-[220px] truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{fileSize(file)}</p>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); onClear(); }}
                  className="text-xs text-rose-400 hover:text-rose-300">{t('developer.gameNew.removeFile')}</button>
              </>
            ) : (
              <>
                <Icon size={26} className="text-slate-600" />
                <div className="text-center">
                  <p className="text-sm text-slate-400">{hint}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{t('developer.gameNew.clickOrDrag')}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2">
      {STEP_ICONS.map((Icon, idx) => {
        const n      = idx + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                done   ? 'border-violet-500 bg-violet-500 text-white' :
                active ? 'border-violet-400 bg-violet-500/20 text-violet-300' :
                         'border-slate-700 bg-slate-900 text-slate-600'
              }`}>
                {done ? <Check size={15} /> : <Icon size={15} />}
              </div>
              <span className={`hidden text-[10px] font-semibold uppercase tracking-wide sm:block ${
                active ? 'text-violet-300' : done ? 'text-violet-500' : 'text-slate-600'
              }`}>{labels[idx]}</span>
            </div>
            {idx < STEP_ICONS.length - 1 && (
              <div className={`mx-2 h-0.5 w-12 shrink-0 transition-colors sm:w-16 ${
                n < current ? 'bg-violet-500' : 'bg-slate-800'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Review row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 py-2.5 last:border-0">
      <span className="shrink-0 text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm text-white">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevGameNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId]   = useState<string | null>(null);

  // Step 1 — Información
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre]           = useState('');
  const [modes, setModes]           = useState<string[]>([]);

  // Step 2 — Técnico
  const [version, setVersion]       = useState('');
  const [edadMinima, setEdadMinima] = useState('');
  const [price, setPrice]           = useState('');
  const [gameUrl, setGameUrl]       = useState('');
  const [distFile, setDistFile]     = useState<File | null>(null);

  // Step 3 — Assets
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rulesFile, setRulesFile]         = useState<File | null>(null);

  // ── Auth check ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/'); return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'developer' && profile?.role !== 'admin') { navigate('/'); return; }
      setUserId(session.user.id);
    };
    void check();
  }, [navigate]);

  // ── Validation ────────────────────────────────────────────────────────────────

  const validate = (s: number): string | null => {
    if (s === 1) {
      if (!title.trim()) return t('developer.gameNew.validation.titleRequired');
    }
    if (s === 2) {
      const hasUrl  = gameUrl.trim().length > 0;
      const hasDist = !!distFile;
      if (!hasUrl && !hasDist) return t('developer.gameNew.validation.urlOrFile');
      if (hasUrl && !gameUrl.startsWith('https://')) return t('developer.gameNew.validation.urlHttps');
    }
    if (s === 3) {
      if (!thumbnailFile) return t('developer.gameNew.validation.thumbnailRequired');
    }
    return null;
  };

  const advance = () => {
    const err = validate(step);
    if (err) { toast.error(err); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Upload helper ─────────────────────────────────────────────────────────────

  const upload = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage
      .from('game-assets')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw new Error(`Storage: ${error.message}`);
    const { data } = supabase.storage.from('game-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!userId || !thumbnailFile) return;
    setSubmitting(true);
    const tid = toast.loading(t('developer.gameNew.uploading'));

    try {
      const slug = slugify(title);

      // Upload thumbnail (required)
      const thumbnailUrl = await upload(thumbnailFile, `${slug}/thumbnail.${fileExt(thumbnailFile)}`);

      // Upload rules .md (optional)
      let manualUrl: string | null = null;
      if (rulesFile) {
        manualUrl = await upload(rulesFile, `${slug}/rules.md`);
      }

      // Upload dist (optional) — sets game_url if no URL provided
      let finalGameUrl = gameUrl.trim() || null;
      if (distFile) {
        const distUrl = await upload(distFile, `${slug}/dist.${fileExt(distFile)}`);
        if (!finalGameUrl) finalGameUrl = distUrl;
      }

      toast.loading(t('developer.gameNew.creating'), { id: tid });

      const { error } = await supabase.from('games').insert({
        developer_id:    userId,
        title:           title.trim(),
        slug,
        description:     description.trim() || null,
        genre:           genre || null,
        available_modes: modes.length ? modes : null,
        version:         version.trim() || null,
        edad_minima:     edadMinima !== '' ? parseInt(edadMinima, 10) : null,
        price:           price !== '' ? parseInt(price, 10) : null,
        game_url:        finalGameUrl,
        thumbnail_url:   thumbnailUrl,
        manual_url:      manualUrl,
        status:          'draft',
        created_at:      new Date().toISOString(),
        updated_at:      new Date().toISOString(),
      });

      if (error) throw error;

      toast.success(t('developer.gameNew.success'), { id: tid });
      navigate('/developer');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('developer.gameNew.error'), { id: tid });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step renders ─────────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      <Field label={t('developer.gameEdit.fields.title')} required counter={`${title.length}/60`}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          maxLength={60} placeholder={t('developer.gameNew.values.notSpecified')} className={inputCls} />
      </Field>

      <Field label={t('developer.gameEdit.fields.description')} counter={`${description.length}/500`}>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          maxLength={500} rows={4} placeholder="Describe tu juego en 50–500 caracteres…"
          className={`${inputCls} resize-none`} />
      </Field>

      <Field label={t('developer.gameEdit.fields.genre')}>
        <select value={genre} onChange={e => setGenre(e.target.value)} className={inputCls}>
          <option value="">{t('developer.gameNew.values.notSpecified')}</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </Field>

      <Field label={t('developer.gameEdit.fields.modes')}>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {MODES.map(m => (
            <button key={m} type="button"
              onClick={() => setModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                modes.includes(m)
                  ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}>
              {m}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label={t('developer.gameEdit.fields.version')} hint={t('developer.gameEdit.hints.version')}>
          <input type="text" value={version} onChange={e => setVersion(e.target.value)}
            placeholder="1.0.0" className={`${inputCls} font-mono`} />
        </Field>
        <Field label={t('developer.gameEdit.fields.minAge')} hint={t('developer.gameEdit.hints.minAge')}>
          <input type="number" value={edadMinima} onChange={e => setEdadMinima(e.target.value)}
            min={0} max={18} placeholder="0" className={inputCls} />
        </Field>
        <Field label={t('developer.gameEdit.fields.price')} hint={t('developer.gameEdit.hints.price')}>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)}
            min={0} placeholder="0" className={inputCls} />
        </Field>
      </div>

      <Field label={t('developer.gameEdit.fields.url')} required hint={t('developer.gameEdit.hints.url')}>
        <input type="url" value={gameUrl} onChange={e => setGameUrl(e.target.value)}
          placeholder="https://mi-servidor.com/juego" className={inputCls} />
      </Field>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-600">{t('developer.gameNew.orUpload')}</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <FileDropZone
        label={t('developer.gameEdit.fields.dist')}
        hint={t('developer.gameEdit.hints.dist')}
        accept=".html,.js,.zip"
        icon={Code2}
        file={distFile}
        onChange={setDistFile}
        onClear={() => setDistFile(null)}
      />

      {(gameUrl.trim() || distFile) && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <Check size={14} className="text-emerald-400" />
          <p className="text-xs text-emerald-300">
            {gameUrl.trim()
              ? t('developer.gameNew.values.urlConfigured')
              : t('developer.gameNew.values.fileSelected', { name: distFile?.name })}
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FileDropZone
        label={`${t('developer.gameEdit.fields.thumbnail')} *`}
        hint={t('developer.gameEdit.hints.thumbnail')}
        accept="image/jpeg,image/png,image/webp"
        icon={ImageIcon}
        file={thumbnailFile}
        onChange={f => {
          if (f.size > 2 * 1024 * 1024) { toast.error(t('developer.gameNew.validation.imageSize')); return; }
          setThumbnailFile(f);
        }}
        onClear={() => setThumbnailFile(null)}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-600">{t('developer.gameNew.rulesOptional')}</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <FileDropZone
          label={t('developer.gameEdit.fields.rules')}
          hint={t('developer.gameEdit.hints.rules')}
          accept=".md"
          icon={FileText}
          file={rulesFile}
          onChange={f => {
            if (!f.name.endsWith('.md')) { toast.error(t('developer.gameNew.validation.rulesFormat')); return; }
            setRulesFile(f);
          }}
          onClear={() => setRulesFile(null)}
        />

        <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 px-4 py-3">
          <p className="text-xs leading-relaxed text-slate-500">
            <code className="font-mono text-violet-400">Markdown (.md)</code>
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const hasUrl  = !!gameUrl.trim();
    const hasDist = !!distFile;

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <p className="text-xs text-violet-300">
            {t('developer.gameNew.initialStatus')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">

          {/* Info summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{t('developer.gameNew.reviewTitle')}</h3>
            <ReviewRow label={t('developer.gameNew.review.name')}        value={title} />
            <ReviewRow label={t('developer.gameNew.review.description')} value={
              description
                ? <span className="line-clamp-2 text-left">{description}</span>
                : <span className="text-slate-500 italic">{t('developer.gameNew.values.notSpecified')}</span>
            } />
            <ReviewRow label={t('developer.gameNew.review.genre')}       value={genre || <span className="text-slate-500 italic">{t('developer.gameNew.values.notSpecified')}</span>} />
            <ReviewRow label={t('developer.gameNew.review.modes')}       value={modes.length ? modes.join(', ') : <span className="text-slate-500 italic">{t('developer.gameNew.values.notIndicated')}</span>} />
            <ReviewRow label={t('developer.gameNew.review.version')}     value={version || <span className="text-slate-500 italic">—</span>} />
            <ReviewRow label={t('developer.gameNew.review.minAge')}      value={edadMinima && parseInt(edadMinima) > 0 ? `+${edadMinima}` : t('developer.gameNew.values.forAll')} />
            <ReviewRow label={t('developer.gameNew.review.price')}       value={price && parseInt(price) > 0 ? `${price} €` : t('developer.gameNew.values.free')} />
            <ReviewRow label={t('developer.gameNew.review.urlDist')}     value={
              hasUrl ? <span className="max-w-[200px] truncate font-mono text-xs">{gameUrl}</span>
                     : hasDist ? <span className="text-emerald-400">{distFile?.name}</span>
                               : <span className="text-slate-500 italic">{t('developer.gameNew.values.notSpecified')}</span>
            } />
            <ReviewRow label={t('developer.gameNew.review.rules')}       value={rulesFile ? <span className="text-emerald-400">{rulesFile.name}</span> : <span className="text-slate-500 italic">{t('developer.gameNew.values.withoutDoc')}</span>} />
          </div>

          {/* Thumbnail preview */}
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {thumbnailFile ? (
                <img src={URL.createObjectURL(thumbnailFile)} alt={t('developer.gameNew.review.thumbnail')}
                  className="h-36 w-full object-cover sm:h-48" />
              ) : (
                <div className="flex h-36 w-full items-center justify-center sm:h-48">
                  <ImageIcon size={36} className="text-slate-700" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Layout ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">

        {/* Back */}
        <Link to="/developer" className="mb-6 inline-flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300">
          <ArrowLeft size={15} />
          {t('developer.gameNew.backToPortal')}
        </Link>

        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">{t('developer.gameNew.pageTitle')}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('developer.gameNew.initialStatus')}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator current={step} labels={[
            t('developer.gameNew.steps.info'),
            t('developer.gameNew.steps.technical'),
            t('developer.gameNew.steps.assets'),
            t('developer.gameNew.steps.review'),
          ]} />
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-7">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="flex items-center gap-2 font-semibold text-white">
              {step === 1 && <><Gamepad2 size={16} className="text-violet-400" /> {t('developer.gameNew.stepTitles.info')}</>}
              {step === 2 && <><Code2     size={16} className="text-violet-400" /> {t('developer.gameNew.stepTitles.technical')}</>}
              {step === 3 && <><ImageIcon size={16} className="text-violet-400" /> {t('developer.gameNew.stepTitles.assets')}</>}
              {step === 4 && <><Tag       size={16} className="text-violet-400" /> {t('developer.gameNew.stepTitles.review')}</>}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {t('developer.gameNew.stepOf', { step, total: STEP_ICONS.length })}
            </p>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={back} disabled={step === 1}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-30">
            <ArrowLeft size={15} />
            {t('developer.gameNew.buttons.back')}
          </button>

          {step < 4 ? (
            <button type="button" onClick={advance}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
              {t('developer.gameNew.buttons.next')}
              <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {submitting ? t('developer.gameNew.buttons.submitting') : t('developer.gameNew.buttons.submit')}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
            style={{ width: `${(step / STEP_ICONS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-600">
          {t('developer.gameNew.percentComplete', { percent: Math.round((step / STEP_ICONS.length) * 100) })}
        </p>
      </main>

      <Footer />
    </div>
  );
}
