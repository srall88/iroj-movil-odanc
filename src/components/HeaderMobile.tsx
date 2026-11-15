import React from 'react';
import { Calendar, ChevronDown, Wifi, WifiOff } from 'lucide-react';

interface HeaderMobileProps {
  mesActivo: string;
  anio: number;
  totalEvaluados: number;
  onOpenMesSelector: () => void;
  isOnline: boolean;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  mesActivo,
  anio,
  totalEvaluados,
  onOpenMesSelector,
  isOnline
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 pt-3 pb-3 safe-top transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Logo Institucional + Título */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-indigo-600 to-blue-500 p-[1.5px] shadow-lg shadow-indigo-950/50 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-base font-extrabold bg-gradient-to-r from-amber-400 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                PJ
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight truncate">
                IROJ Móvil
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                PWA
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 truncate">
              ODANC · CSJ Lima Este
            </p>
          </div>
        </div>

        {/* Selector de Mes Táctil + Estado */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenMesSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 shadow-sm active:scale-95 transition-transform"
            aria-label="Cambiar mes de evaluación"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize">{mesActivo.toLowerCase()} {anio}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Chip de Corte Estadístico y Conectividad */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-micro-pulse"></span>
          <span>{totalEvaluados} órganos evaluados</span>
        </div>
        <div className="flex items-center gap-1">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Wifi className="w-2.5 h-2.5" /> En línea
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <WifiOff className="w-2.5 h-2.5" /> Offline local
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
