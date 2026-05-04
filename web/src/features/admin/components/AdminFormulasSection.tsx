import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Settings2, Save, Check, AlertCircle, 
  Trophy, Gamepad2, ChevronUp
} from 'lucide-react';
import { getScoringSettings, updateScoringSetting } from '../services/settings.service';


const DEFAULT_THRESHOLDS: Record<string, number> = {
  // Globales
  global_bronce: 50,
  global_plata: 150,
  global_oro: 300,
  global_obsidiana: 450,
  // Por Juego
  game_ps1: 500,
  game_ps3: 1000,
  game_ps4: 2500,
  game_ps5: 5000
};

export default function AdminFormulas() {
  const { t } = useTranslation();

  const [thresholds, setThresholds] = useState<Record<string, number>>(DEFAULT_THRESHOLDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate('/'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      const response = await getScoringSettings(supabase);
      if (response.success && response.data) {
        const dbSettings = response.data.reduce((acc: Record<string, number>, curr: any) => {

          acc[curr.setting_key] = Number(curr.setting_value);
          return acc;
        }, {});
        
        setThresholds({ ...DEFAULT_THRESHOLDS, ...dbSettings });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  const handleValueChange = (key: string, newValue: string) => {
    setThresholds(prev => ({ ...prev, [key]: Number(newValue) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(thresholds)) {
        await updateScoringSetting(supabase, key, value);
      }
      setMessage({ type: 'success', text: 'Umbrales de progresión actualizados correctamente.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Settings2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            
            Umbrales de Rango
          </h1>
          <p className="text-slate-400 mt-2">Define cuántos puntos exactos necesita un usuario para subir de nivel.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 hover:scale-[1.02]"
        >
          {saving ? <Settings2 className="animate-spin" size={20} /> : <Save size={20} />}
          Guardar Cambios
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PANEL 1: Rangos Globales */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-amber-500" size={24} />
              Niveles Globales
            </h2>
            <span className="text-xs font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Puntos Totales</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl opacity-70 grayscale">
              <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-slate-500"/> <span className="text-white font-bold">Hierro</span></div>
              <span className="text-slate-400 font-mono">0 pts (Base)</span>
            </div>

            {[
              { id: 'global_bronce', label: 'Bronce', color: 'bg-orange-600' },
              { id: 'global_plata', label: 'Plata', color: 'bg-slate-300' },
              { id: 'global_oro', label: 'Oro', color: 'bg-yellow-500' },
              { id: 'global_obsidiana', label: 'Obsidiana', color: 'bg-purple-600' }
            ].map(tier => (
              <div key={tier.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${tier.color} shadow-[0_0_10px_currentColor] opacity-80`} />
                  <span className="text-white font-bold">{tier.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronUp size={16} className="text-slate-600" />
                  <input 
                    type="number"
                    value={thresholds[tier.id]}
                    onChange={(e) => handleValueChange(tier.id, e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-right text-indigo-400 font-mono font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                  <span className="text-slate-500 text-sm font-medium">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 2: Rangos de Juego (Mandos) */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="text-indigo-400" size={24} />
              Mandos por Juego
            </h2>
            <span className="text-xs font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">Puntos del Juego</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl opacity-70 grayscale">
              <div className="flex items-center gap-3"><span className="text-white font-bold">Mando SNES</span></div>
              <span className="text-slate-400 font-mono">0 pts (Base)</span>
            </div>

            {[
              { id: 'game_ps1', label: 'Mando PS1' },
              { id: 'game_ps3', label: 'Mando PS3' },
              { id: 'game_ps4', label: 'Mando PS4' },
              { id: 'game_ps5', label: 'Mando PS5' }
            ].map(tier => (
              <div key={tier.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all">
                <span className="text-white font-bold">{tier.label}</span>
                <div className="flex items-center gap-2">
                  <ChevronUp size={16} className="text-slate-600" />
                  <input 
                    type="number"
                    value={thresholds[tier.id]}
                    onChange={(e) => handleValueChange(tier.id, e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-right text-indigo-400 font-mono font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                  <span className="text-slate-500 text-sm font-medium">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}