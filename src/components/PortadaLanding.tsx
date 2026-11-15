import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck,
  Award,
  Sparkles
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
    <div className="relative min-h-screen flex flex-col justify-between px-5 pt-5 pb-8 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 overflow-hidden select-none">
      {/* Background Snippet - Subtle Grid & Warm Aura */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-96 bg-gradient-to-b from-amber-100/30 via-indigo-50/20 to-transparent pointer-events-none blur-2xl"></div>

      {/* 1. Header Institucional Superior */}
      <header className="relative z-10 text-center space-y-1.5 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-amber-200/90 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.08)]">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase">
            ODANC LIMA ESTE
          </span>
        </div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
          Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </header>

      {/* 2. Hero Visual Central con Logo Oficial IROJ (Logo.png) */}
      <main className="relative z-10 text-center my-auto py-5 space-y-6">
        {/* Contenedor del Logo con elevación limpia y badges */}
        <div className="relative inline-block mx-auto">
          <div className="relative w-36 h-36 mx-auto rounded-3xl bg-white p-2.5 border border-slate-200/80 shadow-[0_12px_36px_rgba(15,23,42,0.08)] flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="/Logo.png" 
              alt="Logo IROJ - ODANC Lima Este" 
              className="w-full h-full object-contain drop-shadow-xs"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/logo.png')) {
                  target.src = '/logo.png';
                } else if (!target.src.endsWith('/imagenes/logo.png')) {
                  target.src = '/imagenes/logo.png';
                }
              }}
            />
          </div>

          {/* Badge Período */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg border border-slate-700/60 whitespace-nowrap">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>OCTUBRE {anio}</span>
          </div>
        </div>

        {/* Títulos Principales de Sistema */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              IROJ
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
              Móvil
            </span>
          </div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest max-w-xs mx-auto leading-snug">
            Índice de Rendimiento de Órganos Jurisdiccionales
          </h2>
          <p className="text-[12px] text-slate-600 max-w-xs mx-auto leading-relaxed">
            Monitoreo resolutivo, semáforo de riesgo y métricas jurisdiccionales en tiempo real para magistrados y directivos.
          </p>
        </div>

        {/* 3. Contadores de Dependencias y Distritos en Diseño Bento */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-1">
          {/* Dependencias evaluadas */}
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left relative overflow-hidden group">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Dependencias</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block tabular-nums">
              {totalDependencias}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-700">En Evaluación</span>
            </div>
          </div>

          {/* Distritos Judiciales */}
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left relative overflow-hidden group">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Distritos</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block tabular-nums">
              {totalDistritos}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-slate-600">Sedes Lima Este</span>
            </div>
          </div>
        </div>

        {/* 4. Botón Único de Acción "Ingresar al Sistema" */}
        <div className="pt-2 max-w-xs mx-auto">
          <button
            onClick={onIngresar}
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white font-black text-sm tracking-wide shadow-[0_8px_20px_rgba(15,23,42,0.22)] active:scale-[0.98] transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            <span>INGRESAR AL SISTEMA</span>
            <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
          </button>
        </div>
      </main>

      {/* 5. Footer Institucional Inferior */}
      <footer className="relative z-10 text-center pt-4 border-t border-slate-200/60">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Corte Superior de Justicia de Lima Este
        </p>
        <p className="text-[9px] font-medium text-slate-500 mt-0.5">
          Poder Judicial del Perú · Versión Móvil Oficial
        </p>
      </footer>
    </div>
  );
};
