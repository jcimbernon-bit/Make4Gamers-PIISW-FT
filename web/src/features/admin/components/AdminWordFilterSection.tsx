import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import { ShieldAlert, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function getForbiddenWordErrorMessage(error: { code?: string; message?: string } | null) {
  if (!error) return 'No se pudo completar la operacion.';

  if (error.code === '23505') {
    return 'La palabra ya existe en el filtro.';
  }

  if (error.code === '42501' || /row-level security|permission denied/i.test(error.message || '')) {
    return 'No tienes permisos para modificar el filtro de palabras.';
  }

  return error.message || 'No se pudo completar la operacion.';
}

export default function AdminFiltro() {
  const { t } = useTranslation();
  const [words, setWords] = useState<any[]>([]);
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const { data } = await supabase.from('forbidden_words').select('*').order('word');
    setWords(data || []);
    setLoading(false);
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedWord = newWord.toLowerCase().trim();
    if (!normalizedWord) return;

    const { error } = await supabase
      .from('forbidden_words')
      .insert([{ word: normalizedWord }]);

    if (error) {
      console.error('Error creando palabra prohibida:', error);
      toast.error(getForbiddenWordErrorMessage(error));
    } else {
      toast.success(t('admin.wordFilterPage.added'));
      setNewWord('');
      fetchWords();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('forbidden_words').delete().eq('id', id);
    if (error) {
      console.error('Error eliminando palabra prohibida:', error);
      toast.error(getForbiddenWordErrorMessage(error));
      return;
    }
    fetchWords();
    toast.success(t('admin.wordFilterPage.deleted'));
  };

  if (loading) return <div className="text-center text-white py-20">{t('admin.wordFilterPage.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-slate-900 border border-slate-800 rounded-2xl">
        <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-8 transition-colors font-medium">
        <ArrowLeft size={20} />
        {t('admin.backHome')}
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-red-500" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-white">{t('admin.wordFilterPage.title')}</h1>
          <p className="text-slate-400">{t('admin.wordFilterPage.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleAddWord} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder={t('admin.wordFilterPage.placeholder')}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white"
        />
        <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> {t('admin.wordFilterPage.add')}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {words.map(w => (
          <div key={w.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700">
            <span className="text-slate-300 font-mono">{w.word}</span>
            <button onClick={() => handleDelete(w.id)} className="text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
