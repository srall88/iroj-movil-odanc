import React, { useState } from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';
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
      {/* Switch de Modo en Modo Claro */}
      <div className="bg-slate-200/60 p-1 rounded-2xl border border-slate-200 flex gap-1">
        <button
          onClick={() => setModo('riesgo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            modo === 'riesgo'
              ? 'bg-white text-rose-700 shadow-sm border border-rose-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Atención Prioritaria ({topRiesgo.length})
        </button>

        <button
          onClick={() => setModo('optimo')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            modo === 'optimo'
              ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          Desempeño Óptimo ({topOptimo.length})
        </button>
      </div>

      {/* Título y descripción */}
      <div className="px-1">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          {modo === 'riesgo' ? (
            <>🚨 Órganos con Mayor Riesgo IROJ</>
          ) : (
            <>⭐ Órganos con Cumplimiento Sobresaliente</>
          )}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {modo === 'riesgo'
            ? `Dependencias con mayor puntaje acumulado en ${mesActivo.toLowerCase()} ${anio} que requieren intervención preventiva.`
            : `Dependencias con menor puntaje de riesgo y excelente rendimiento en ${mesActivo.toLowerCase()} ${anio}.`}
        </p>
      </div>

      {/* Lista de Juzgados Rankeados */}
      <div className="space-y-3">
        {listaActual.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Medalla o Número de Posición */}
            <div className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-md border ${
              index === 0
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/30'
                : index === 1
                ? 'bg-slate-300 text-slate-900 border-slate-200'
                : index === 2
                ? 'bg-amber-700 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-300 shadow-xs'
            }`}>
              {index + 1}
            </div>

            <TarjetaBentoDependencia evaluacion={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
