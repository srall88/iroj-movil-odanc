import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';

interface PortadaLandingProps {
  totalDependencias: number;
  totalDistritos: number;
  mesActivo: string;
  anio: number;
  onIngresar: () => void;
}

export const PortadaLanding: React.FC<PortadaLandingProps> = ({
  totalDependencias,
  totalDistritos,
  mesActivo,
  anio,
  onIngresar
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between px-5 pt-6 pb-8 bg-slate-50 overflow-hidden select-none">
      {/* Background Snippet (ibelick - grid pattern + subtle aura) */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-45"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-aura-glow pointer-events-none"></div>

      {/* 1. Header Institucional Superior */}
      <div className="relative z-10 text-center space-y-1 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full shadow-xs mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span className="text-[11px] font-black tracking-wide text-amber-900 uppercase">
            ODANC LIMA ESTE
          </span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider max-w-xs mx-auto">
          Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </div>

      {/* 2. Hero Visual Central con Logo Oficial IROJ */}
      <div className="relative z-10 text-center my-auto py-4 space-y-5">
        {/* Imagen Logo IROJ */}
        <div className="relative inline-block mx-auto">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-white p-2 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
            <img 
              src="/imagenes/logo-iroj.jpg" 
              alt="Logo Oficial IROJ" 
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                // Fallback si la ruta no carga
                (e.target as HTMLImageElement).src = "/Logo IROJ.jpg";
              }}
            />
          </div>
          {/* Badge Período */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
            OCTUBRE {anio}
          </div>
        </div>

        {/* Títulos Principales */}
        <div className="space-y-1.5 pt-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            IROJ
          </h1>
          <h2 className="text-xs font-black text-indigo-950 uppercase tracking-widest max-w-xs mx-auto leading-snug">
            Índice de Rendimiento de Órganos Jurisdiccionales
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed pt-1">
            Sistema oficial de consulta estratégica de indicadores y semáforo de riesgo en tiempo real.
          </p>
        </div>

        {/* 3. Contadores de Dependencias y Distritos */}
        <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto pt-2">
          {/* Dependencias actuales */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Dependencias</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block tabular-nums">
              {totalDependencias}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-micro-pulse"></span>
              En Evaluación
            </span>
          </div>

          {/* Distritos Judiciales */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Distritos</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block tabular-nums">
              {totalDistritos}
            </span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">
              Jurisdicciones
            </span>
          </div>
        </div>

        {/* Chip de Corte Oficial Octubre 2026 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mes Activo: <strong className="text-indigo-950 font-black">Octubre {anio}</strong></span>
        </div>
      </div>

      {/* 4. Botón Único de Ingreso y Pie de Página */}
      <div className="relative z-10 space-y-4 pt-2">
        <button
          onClick={onIngresar}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-slate-900/15 active:scale-[0.98] transition-all touch-target"
        >
          <span>Ingresar al Sistema</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Pie de Página Institucional */}
        <div className="text-center pt-1 border-t border-slate-200/80">
          <p className="text-xs font-bold text-slate-800 tracking-tight">
            Corte Superior de Justicia de Lima Este
          </p>
        </div>
      </div>
    </div>
  );
};
