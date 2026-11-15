import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface BuscadorFlotanteProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  totalResultados: number;
  totalTotal: number;
  sugerencias?: string[];
  onSelectSugerencia?: (sug: string) => void;
}

export const BuscadorFlotante: React.FC<BuscadorFlotanteProps> = ({
  busqueda,
  setBusqueda,
  totalResultados,
  totalTotal,
  sugerencias = [],
  onSelectSugerencia
}) => {
  return (
    <div className="relative z-20 px-4 pt-3 pb-1">
      {/* Caja de Búsqueda Flotante */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar juzgado, NDEP, sede o distrito..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-500 shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="absolute right-3 p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full active:scale-90 transition-transform"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Contador de coincidencias */}
      <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
        <span>
          Mostrando <strong className="text-white">{totalResultados}</strong> de {totalTotal} dependencias
        </span>
        {busqueda && (
          <span className="text-indigo-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Filtro predictivo activo
          </span>
        )}
      </div>

      {/* Sugerencias predictivas rápidas (chips) cuando se escribe algo */}
      {busqueda.length >= 2 && sugerencias.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">Sugerencias:</span>
          {sugerencias.slice(0, 4).map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSugerencia ? onSelectSugerencia(sug) : setBusqueda(sug)}
              className="px-2.5 py-1 text-xs bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg text-indigo-300 whitespace-nowrap active:scale-95 transition-all shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
