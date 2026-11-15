import React from 'react';
import { Calendar, ChevronDown, Wifi, WifiOff } from 'lucide-react';

interface HeaderMobileProps {
  mesActivo: string;
  anio: number;
  totalEvaluados: number;
  onOpenMesSelector: () => void;
  isOnline: boolean;
  onGoHome: () => void;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  mesActivo,
  anio,
  totalEvaluados,
  onOpenMesSelector,
  isOnline,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 pt-3 pb-3 safe-top shadow-xs transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Logo Institucional + Título */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2.5 min-w-0 text-left active:scale-98 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-amber-500 p-[1.5px] shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-0.5">
              <img 
                src="/imagenes/logo csjle.png" 
                alt="CSJLE" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight truncate">
                IROJ Móvil
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                CSJLE
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 truncate">
              ODANC · Lima Este
            </p>
          </div>
        </button>

        {/* Selector de Mes Táctil */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenMesSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-xs active:scale-95 transition-all"
            aria-label="Cambiar mes de evaluación"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="capitalize">{mesActivo.toLowerCase()} {anio}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Chip de Corte Estadístico y Conectividad */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-0.5 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-micro-pulse"></span>
          <span><strong className="text-slate-800 font-bold">{totalEvaluados}</strong> dependencias evaluadas</span>
        </div>
        <div className="flex items-center gap-1">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              <Wifi className="w-2.5 h-2.5 text-emerald-600" /> En línea
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
              <WifiOff className="w-2.5 h-2.5 text-amber-600" /> Offline
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
