import React, { useState } from 'react';
import { Trophy, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { EvaluacionItem } from '../types';
import { TarjetaBentoDependencia } from './TarjetaBentoDependencia';

interface RankingViewProps {
  topRiesgo: EvaluacionItem[];
  topOptimo: EvaluacionItem[];
  mesActivo: string;
  anio: number;
}

export const RankingView: React.FC<RankingViewProps> = ({
  topRiesgo,
  topOptimo,
  mesActivo,
  anio
}) => {
  const [modo, setModo] = useState<'riesgo' | 'optimo'>('riesgo');

  const listaActual = modo === 'riesgo' ? topRiesgo : topOptimo;

  return (
    <div className="px-4 py-4 space-y-3.5">
      {/* Switch de Modo de Ranking */}
      <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex gap-1">
        <button
          onClick={() => setModo('riesgo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            modo === 'riesgo'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Atención Prioritaria ({topRiesgo.length})
        </button>

        <button
          onClick={() => setModo('optimo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            modo === 'optimo'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Desempeño Óptimo ({topOptimo.length})
        </button>
      </div>

      {/* Título y descripción */}
      <div className="px-1">
        <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
          {modo === 'riesgo' ? (
            <>🚨 Órganos con Mayor Riesgo IROJ</>
          ) : (
            <>⭐ Órganos con Mayor Cumplimiento</>
          )}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {modo === 'riesgo'
            ? `Top juzgados con mayor puntaje acumulado en ${mesActivo.toLowerCase()} ${anio}. Requieren plan de acción preventivo.`
            : `Top juzgados con menor puntaje de riesgo y cumplimiento sobresaliente en ${mesActivo.toLowerCase()} ${anio}.`}
        </p>
      </div>

      {/* Lista de Juzgados Rankeados con Tarjetas Bento */}
      <div className="space-y-3">
        {listaActual.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Medalla o Número de Posición */}
            <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-md border ${
              index === 0
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : index === 1
                ? 'bg-slate-300 text-slate-950 border-slate-200'
                : index === 2
                ? 'bg-amber-700 text-white border-amber-600'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }">
              {index + 1}
            </div>

            <TarjetaBentoDependencia evaluacion={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
