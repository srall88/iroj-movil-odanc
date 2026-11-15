import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award
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
    <div className="relative min-h-screen flex flex-col justify-between px-5 pt-4 pb-8 bg-gradient-to-b from-slate-50 via-white to-slate-100/90 overflow-hidden select-none">
      {/* Background Snippet - Subtle Pattern & Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-30"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. Header Institucional Superior */}
      <header className="relative z-10 text-center space-y-1 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-md border border-amber-300/60 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase">
            ODANC LIMA ESTE
          </span>
        </div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider max-w-xs mx-auto leading-tight">
          Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </header>

      {/* 2. Hero Visual Central con Logo Oficial IROJ Solo y Grande (Sin recuadro blanco ni mes pegado) */}
      <main className="relative z-10 text-center my-auto py-2 space-y-4">
        {/* Logo IROJ SOLO, grande, transparente y sin recuadro artificial */}
        <div className="relative flex items-center justify-center mx-auto my-2">
          <img 
            src="/Logo.png" 
            alt="Logo IROJ Oficial" 
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 active:scale-95"
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

        {/* Título y Subtítulo IROJ */}
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              IROJ
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              Oficial
            </span>
          </div>
          <h2 className="text-xs font-black text-indigo-950 uppercase tracking-widest max-w-xs mx-auto leading-snug">
            Índice de Rendimiento de Órganos Jurisdiccionales
          </h2>
          <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-relaxed pt-0.5">
            Métricas resolutivas y semáforo de riesgo jurisdiccional en tiempo real.
          </p>
        </div>

        {/* 3. Tarjetas Bento de Métricas (166 Dependencias | 8 Distritos) */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-1">
          {/* Dependencias evaluadas */}
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left relative overflow-hidden">
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
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Distritos</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block tabular-nums">
              {totalDistritos}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-slate-600">Sedes Judiciales</span>
            </div>
          </div>
        </div>

        {/* 4. MES MOVIDO DESPUÉS DE LAS TARJETAS (Tal como solicitó el usuario) */}
        <div className="max-w-xs mx-auto pt-1">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-900/95 text-amber-300 rounded-full shadow-md border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider">
              OCTUBRE {anio}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">· Corte Oficial</span>
          </div>
        </div>

        {/* 5. Botón Principal de Ingreso (Thumb-zone natural reach) */}
        <div className="pt-2 max-w-xs mx-auto">
          <button
            onClick={onIngresar}
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white font-black text-sm tracking-wide shadow-[0_10px_25px_rgba(15,23,42,0.25)] active:scale-[0.98] transition-all duration-200 touch-target"
          >
            <span>INGRESAR AL SISTEMA</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </main>

      {/* 6. Footer Institucional Inferior */}
      <footer className="relative z-10 text-center pt-3 border-t border-slate-200/70">
        <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
          Corte Superior de Justicia de Lima Este
        </p>
        <p className="text-[9px] font-medium text-slate-500 mt-0.5">
          Poder Judicial del Perú · Plataforma Móvil
        </p>
      </footer>
    </div>
  );
};
