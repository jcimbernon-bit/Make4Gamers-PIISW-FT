import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Code2,
  FileText,
  Gamepad2,
  ImageIcon,
  Loader2,
  Save,
  Tag,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';
import Header from '../shared/layout/Header';
import Footer from '../shared/layout/Footer';

// ─── Types ───────────────────────────────────────────────────────────────────

type GameData = {
  id: string;
  developer_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  game_url: string | null;
  manual_url: string | null;
  status: string | null;
  version: string | null;
  genre: string | null;
  available_modes: string[] | null;
  edad_minima: number | null;
  price: number | null;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const GENRES = [
  'Acción', 'Aventura', 'Puzzle', 'Plataformas', 'Arcade',
  'Estrategia', 'Rol (RPG)', 'Simulación', 'Deportes',
  'Multijugador', 'Educativo', 'Otro',
];

const MODES = ['Singleplayer', 'Multijugador', 'Online', 'Cooperativo', 'Competitivo'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useStatusBadge() {
  const { t } = useTranslation();
  return (status: string | null) => {
    const s = (status ?? '').toLowerCase();
    if (s === 'published') return { label: t('developer.status.published'), cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (s === 'review')    return { label: t('developer.status.review'),    cls: 'bg-amber-500/15  text-amber-300  border-amber-500/30'  };
    if (s === 'rejected')  return { label: t('developer.status.rejected'),  cls: 'bg-rose-500/15   text-rose-300   border-rose-500/30'   };
    if (s === 'inactive')  return { label: t('developer.status.inactive'),  cls: 'bg-slate-500/15  text-slate-300  border-slate-500/30'  };
    if (s === 'draft')     return { label: t('developer.status.draft'),     cls: 'bg-slate-500/15  text-slate-400  border-slate-600/30'  };
    return { label: status ?? t('developer.status.unknown'), cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
  };
}

function fileExt(file: File) {
  return file.name.split('.').pop() ?? 'bin';
}

// ─── File drop zone ───────────────────────────────────────────────────────────

type DropZoneProps = {
  label: string;
  hint: string;
  accept: string;
  icon: React.ElementType;
  file: File | null;
  previewUrl?: string | null;
  onChange: (f: File) => void;
  onClear: () => void;
};

function FileDropZone({ label, hint, accept, icon: Icon, file, previewUrl, onChange, onClear }: DropZoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  }, [onChange]);

  const showImagePreview = file ? file.type.startsWith('image/') : !!previewUrl;
  const previewSrc = file?.type.startsWith('image/') ? URL.createObjectURL(file) : (previewUrl ?? null);

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ''; }}
        />

        {showImagePreview && previewSrc ? (
          <div className="relative">
            <img src={previewSrc} alt="preview" className="h-44 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
              <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white">
                {t('developer.gameEdit.change')}
              </button>
            </div>
            {file && (
              <button type="button" onClick={onClear} className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1 text-slate-300 transition-colors hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center justify-center gap-3 px-4 py-8" onClick={() => inputRef.current?.click()}>
            {file ? (
              <>
                <Icon size={26} className="text-violet-400" />
                <div className="text-center">
                  <p className="max-w-[220px] truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`}
                  </p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }} className="text-xs text-rose-400 hover:text-rose-300">
                  {t('developer.gameEdit.removeFile')}
                </button>
              </>
            ) : (
              <>
                <Icon size={26} className="text-slate-600" />
                <div className="text-center">
                  <p className="text-sm text-slate-400">{hint}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{t('developer.gameEdit.clickOrDrag')}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-white">
        <Icon size={16} className="text-violet-400" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}{required && <span className="ml-1 text-rose-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevGameEdit() {
  const { t } = useTranslation();
  const statusBadge = useStatusBadge();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving]           = useState(false);
  const [game, setGame]               = useState<GameData | null>(null);

  // Form state
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion]       = useState('');
  const [genre, setGenre]           = useState('');
  const [modes, setModes]           = useState<string[]>([]);
  const [gameUrl, setGameUrl]       = useState('');
  const [edadMinima, setEdadMinima] = useState('');
  const [price, setPrice]           = useState('');

  // File uploads
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rulesFile, setRulesFile]         = useState<File | null>(null);
  const [distFile, setDistFile]           = useState<File | null>(null);

  // ── Load ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).maybeSingle();

      if (profile?.role !== 'developer' && profile?.role !== 'admin') {
        navigate('/'); return;
      }

      const { data: gameData, error } = await supabase
        .from('games').select('*').eq('id', id).maybeSingle();

      if (error || !gameData) {
        toast.error(t('developer.gameEdit.notFoundError'));
        navigate('/developer'); return;
      }

      if (gameData.developer_id !== session.user.id && profile?.role !== 'admin') {
        toast.error(t('developer.gameEdit.permissionError'));
        navigate('/developer'); return;
      }

      const g = gameData as GameData;
      setGame(g);
      setTitle(g.title ?? '');
      setDescription(g.description ?? '');
      setVersion(g.version ?? '');
      setGenre(g.genre ?? '');
      setModes(g.available_modes ?? []);
      setGameUrl(g.game_url ?? '');
      setEdadMinima(g.edad_minima != null ? String(g.edad_minima) : '');
      setPrice(g.price != null ? String(g.price) : '');
      setPageLoading(false);
    };
    if (id) void load();
  }, [id, navigate]);

  // ── Upload helper ─────────────────────────────────────────────────────────────

  const upload = async (file: File, path: string): Promise<string> => {
    const { error } = await supabase.storage
      .from('game-assets')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw new Error(`Storage: ${error.message}`);
    const { data } = supabase.storage.from('game-assets').getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Save ──────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!game) return;
    if (!title.trim()) { toast.error(t('developer.gameEdit.nameRequired')); return; }

    setSaving(true);
    const tid = toast.loading(t('developer.gameEdit.saving'));

    try {
      let thumbnailUrl = game.thumbnail_url;
      let manualUrl    = game.manual_url;
      let finalGameUrl = gameUrl.trim() || game.game_url;

      if (thumbnailFile) {
        thumbnailUrl = await upload(thumbnailFile, `${game.slug}/thumbnail.${fileExt(thumbnailFile)}`);
      }
      if (rulesFile) {
        manualUrl = await upload(rulesFile, `${game.slug}/rules.${fileExt(rulesFile)}`);
      }
      if (distFile) {
        const distUrl = await upload(distFile, `${game.slug}/dist.${fileExt(distFile)}`);
        if (!gameUrl.trim()) finalGameUrl = distUrl;
      }

      const payload: Record<string, unknown> = {
        title:           title.trim(),
        description:     description.trim() || null,
        version:         version.trim() || null,
        genre:           genre || null,
        available_modes: modes.length ? modes : null,
        game_url:        finalGameUrl || null,
        thumbnail_url:   thumbnailUrl,
        manual_url:      manualUrl,
        edad_minima:     edadMinima !== '' ? parseInt(edadMinima, 10) : null,
        price:           price !== '' ? parseInt(price, 10) : null,
        updated_at:      new Date().toISOString(),
      };

      const { error } = await supabase.from('games').update(payload).eq('id', game.id);
      if (error) throw error;

      toast.success(t('developer.gameEdit.saved'), { id: tid });

      setGame(g => g ? {
        ...g,
        title:           title.trim(),
        description:     description.trim() || null,
        version:         version.trim() || null,
        genre:           genre || null,
        available_modes: modes.length ? modes : null,
        game_url:        finalGameUrl ?? null,
        thumbnail_url:   thumbnailUrl ?? null,
        manual_url:      manualUrl    ?? null,
        edad_minima:     edadMinima !== '' ? parseInt(edadMinima, 10) : null,
        price:           price !== '' ? parseInt(price, 10) : null,
      } : null);

      setThumbnailFile(null);
      setRulesFile(null);
      setDistFile(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('developer.gameEdit.saveError'), { id: tid });
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!game) return null;

  const { label: statusLabel, cls: statusCls } = statusBadge(game.status);

  const SaveBtn = () => (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
    >
      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
      {saving ? t('developer.gameEdit.saving') : t('developer.gameEdit.save')}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* Page header */}
        <div className="mb-7">
          <Link to="/developer" className="mb-4 inline-flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300">
            <ArrowLeft size={15} />
            {t('developer.gameEdit.backToGames')}
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{game.title}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCls}`}>
                  {statusLabel}
                </span>
                {game.version && <span className="font-mono text-xs text-slate-500">v{game.version}</span>}
                <span className="font-mono text-xs text-slate-600">{game.slug}</span>
              </div>
            </div>
            <SaveBtn />
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Basic info */}
            <Section title={t('developer.gameEdit.sections.basic')} icon={Gamepad2}>

              <Field label={t('developer.gameEdit.fields.title')} required>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={60}
                  placeholder="Nombre visible en la plataforma"
                  className={inputCls}
                />
                <p className="mt-1 text-right text-xs text-slate-600">{title.length}/60</p>
              </Field>

              <Field label={t('developer.gameEdit.fields.description')}>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe tu juego en 50–500 caracteres…"
                  className={`${inputCls} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-slate-600">{description.length}/500</p>
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label={t('developer.gameEdit.fields.version')} hint={t('developer.gameEdit.hints.version')}>
                  <input
                    type="text"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    placeholder="1.0.0"
                    className={`${inputCls} font-mono`}
                  />
                </Field>
                <Field label={t('developer.gameEdit.fields.minAge')} hint={t('developer.gameEdit.hints.minAge')}>
                  <input
                    type="number"
                    value={edadMinima}
                    onChange={e => setEdadMinima(e.target.value)}
                    min={0}
                    max={18}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
                <Field label={t('developer.gameEdit.fields.price')} hint={t('developer.gameEdit.hints.price')}>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    min={0}
                    placeholder="0"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label={t('developer.gameEdit.fields.genre')}>
                <select value={genre} onChange={e => setGenre(e.target.value)} className={inputCls}>
                  <option value="">Sin especificar</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <Field label={t('developer.gameEdit.fields.modes')}>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {MODES.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        modes.includes(m)
                          ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* URL + dist */}
            <Section title={t('developer.gameEdit.sections.urlDist')} icon={Code2}>

              <Field label={t('developer.gameEdit.fields.url')} hint={t('developer.gameEdit.hints.url')}>
                <input
                  type="url"
                  value={gameUrl}
                  onChange={e => setGameUrl(e.target.value)}
                  placeholder="https://mi-servidor.com/juego"
                  className={inputCls}
                />
              </Field>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-600">{t('developer.gameEdit.orUpload')}</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <FileDropZone
                label={t('developer.gameEdit.fields.dist')}
                hint={t('developer.gameEdit.hints.dist', '.html, .js, .zip — el HTML se usará como game_url')}
                accept=".html,.js,.zip"
                icon={Code2}
                file={distFile}
                onChange={setDistFile}
                onClear={() => setDistFile(null)}
              />

              <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 px-4 py-3">
                <p className="font-mono text-xs text-slate-500">
                  game-assets/<span className="text-violet-400">{game.slug}</span>/dist.*
                </p>
              </div>
            </Section>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">

            {/* Thumbnail */}
            <Section title={t('developer.gameEdit.sections.thumbnail')} icon={ImageIcon}>
              <FileDropZone
                label={t('developer.gameEdit.fields.thumbnail')}
                hint={t('developer.gameEdit.hints.thumbnail')}
                accept="image/jpeg,image/png,image/webp"
                icon={ImageIcon}
                file={thumbnailFile}
                previewUrl={game.thumbnail_url}
                onChange={setThumbnailFile}
                onClear={() => setThumbnailFile(null)}
              />
              <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 px-4 py-3">
                <p className="font-mono text-xs text-slate-500">
                  game-assets/<span className="text-violet-400">{game.slug}</span>/thumbnail.*
                </p>
              </div>
            </Section>

            {/* Rules doc */}
            <Section title={t('developer.gameEdit.sections.rules')} icon={FileText}>
              {game.manual_url && !rulesFile && (
                <a
                  href={game.manual_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
                >
                  <FileText size={13} className="shrink-0 text-violet-400" />
                  <span className="truncate">{t('developer.gameEdit.viewCurrentDoc')}</span>
                </a>
              )}

              <FileDropZone
                label={t('developer.gameEdit.fields.rules')}
                hint={t('developer.gameEdit.hints.rules')}
                accept=".pdf,.doc,.docx,.txt,.md"
                icon={FileText}
                file={rulesFile}
                onChange={setRulesFile}
                onClear={() => setRulesFile(null)}
              />

              <div className="rounded-xl border border-slate-700/50 bg-slate-950/60 px-4 py-3">
                <p className="font-mono text-xs text-slate-500">
                  game-assets/<span className="text-violet-400">{game.slug}</span>/rules.*
                </p>
              </div>
            </Section>

            {/* Price summary card */}
            <Section title={t('developer.gameEdit.sections.publication')} icon={Tag}>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2.5">
                  <span className="text-xs text-slate-400">{t('developer.gameEdit.fields.currentStatus')}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusCls}`}>{statusLabel}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2.5">
                  <span className="text-xs text-slate-400">{t('developer.gameEdit.fields.price')}</span>
                  <span className="text-sm font-semibold text-white">
                    {price !== '' && parseInt(price, 10) > 0 ? `${price} €` : t('developer.gameEdit.free')}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2.5">
                  <span className="text-xs text-slate-400">{t('developer.gameEdit.fields.minAge')}</span>
                  <span className="text-sm font-semibold text-white">
                    {edadMinima !== '' && parseInt(edadMinima, 10) > 0 ? `+${edadMinima}` : t('developer.gameEdit.forAll')}
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                {t('developer.gameEdit.statusNote')}{' '}
                <Link to="/contacto" className="text-violet-400 hover:text-violet-300">{t('developer.gameEdit.contactLink')}</Link>.
              </p>
            </Section>

            {/* Storage note */}
            <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4">
              <p className="text-xs leading-relaxed text-slate-400">
                {t('developer.gameEdit.storageNote')}{' '}
                <code className="font-mono text-violet-400">game-assets/{game.slug}/</code>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom save bar */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
          <p className="text-sm text-slate-500">
            {t('developer.gameEdit.slugLabel')}:{' '}
            <code className="font-mono text-xs text-slate-400">{game.slug}</code>
          </p>
          <SaveBtn />
        </div>
      </main>

      <Footer />
    </div>
  );
}
