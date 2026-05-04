import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function Contacto() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('Idea/Mejora');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(t('contact.errorAuth'));
      }

      const { error: insertError } = await supabase
        .from('suggestions')
        .insert([{ user_id: user.id, category, content }]);

      if (insertError) throw insertError;

      setFeedback({ type: 'success', message: t('contact.successMessage') });
      setContent('');
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || t('contact.errorGeneric') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t('contact.title')}</h1>
            <p className="text-slate-400 mt-1">{t('contact.subtitle')}</p>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <p>{feedback.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
              {t('contact.categoryLabel')}
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Idea/Mejora">{t('contact.categories.idea')}</option>
              <option value="Bug/Error">{t('contact.categories.bug')}</option>
              <option value="Duda/Soporte">{t('contact.categories.support')}</option>
              <option value="Otro">{t('contact.categories.other')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
              {t('contact.contentLabel')}
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={5}
              placeholder={t('contact.contentPlaceholder')}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              t('contact.submitting')
            ) : (
              <>
                <Send size={18} />
                {t('contact.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
