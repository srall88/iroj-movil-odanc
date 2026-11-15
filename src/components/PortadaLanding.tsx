import React from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Scale, 
  CheckCircle2, 
  Activity, 
  CalendarCheck 
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
    <div className="relative min-h-screen flex flex-col justify-between px-4 pt-5 pb-5 bg-gradient-to-b from-slate-50 via-white to-red-50/20 overflow-hidden select-none">
      {/* 1. Header Superior con los 2 Logos Oficiales (CSJLE + IROJ) */}
      <div className="relative z-10 text-center space-y-2.5 max-w-sm mx-auto w-full">
        {/* Dos logos lado a lado en tarjetas blancas redondeadas */}
        <div className="flex items-center justify-center gap-3">
          {/* Logo 1: Corte Superior de Justicia de Lima Este */}
          <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0">
            <img 
              src="/imagenes/logo csjle.png" 
              alt="Corte Superior de Justicia de Lima Este" 
              width={56}
              height={56}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Logo.png';
              }}
            />
          </div>

          {/* Logo 2: Logo Animado IROJ Oficial */}
          <div className="w-16 h-16 bg-white rounded-2xl p-1 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="/Logo animado IROJ.gif" 
              alt="Logo Animado IROJ" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Logo.png';
              }}
            />
          </div>
        </div>

        {/* 2. ODANC LIMA ESTE y Significado */}
        <div className="space-y-0.5 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#8B1E23] shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#8B1E23] shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider">
              ODANC LIMA ESTE
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block px-2 text-center leading-tight">
            Oficina Descentralizada de la Autoridad Nacional de Control
          </p>
        </div>

        {/* 3. Título Principal IROJ + Indicador de Riesgos de Órganos Jurisdiccionales */}
        <div className="space-y-1 pt-0.5 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-[#8B1E23] tracking-tight leading-none">
            IROJ
          </h1>
          <h2 className="text-xs sm:text-sm font-black text-[#8B1E23] uppercase tracking-wide leading-snug px-2">
            Indicador de Riesgos de Órganos Jurisdiccionales
          </h2>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium px-3 text-center">
            Monitoreo y evaluación del desempeño de los órganos jurisdiccionales de Lima Este — ODANC
          </p>
        </div>
      </div>

      {/* 4. Tarjetas Bento con los 4 KPIs Ordenados y Centrados (Sin desbordes) */}
      <div className="relative z-10 my-auto py-2 max-w-sm mx-auto w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-center">
            {/* KPI 1: Dependencias Activas */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center min-h-[96px]">
              <div className="w-6 h-6 flex items-center justify-center text-slate-700 mb-1">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-2xl font-black text-slate-900 block tabular-nums leading-none">
                {totalDependencias}
              </span>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-tight">
                Dependencias
              </span>
              <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
                Órganos Activos
              </span>
            </div>

            {/* KPI 2: Distritos Judiciales */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center min-h-[96px]">
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                <MapPin className="w-5 h-5 text-[#8B1E23]" />
              </div>
              <span className="text-2xl font-black text-slate-900 block tabular-nums leading-none">
                {totalDistritos}
              </span>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-tight">
                Distritos
              </span>
              <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
                Sedes Judiciales
              </span>
            </div>

            {/* KPI 3: 5 Factores (Evaluación IROJ) */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center min-h-[96px]">
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xl font-black text-slate-900 block leading-none">
                5 Factores
              </span>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-tight">
                Algoritmo IROJ
              </span>
              <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
                Ponderación Riesgo
              </span>
            </div>

            {/* KPI 4: Inspecciones y Visitas Judiciales */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center min-h-[96px]">
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xl font-black text-slate-900 block leading-none">
                Inspecciones
              </span>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-tight">
                Visitas Judiciales
              </span>
              <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
                Control In Situ
              </span>
            </div>
          </div>

          {/* Franja de Datos Oficiales Actualizados */}
          <div className="bg-red-50/70 border border-red-200/70 rounded-full px-3 py-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium text-[10px]">
              Datos oficiales actualizados:
            </span>
            <span className="font-black text-[#8B1E23] text-[10px] flex items-center gap-1">
              OCTUBRE {anio} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            </span>
          </div>
        </div>
      </div>

      {/* 5. Botón de Ingresar al Sistema */}
      <div className="relative z-10 pt-1 max-w-sm mx-auto w-full">
        <button
          onClick={onIngresar}
          className="w-full py-4 px-6 bg-[#8B1E23] hover:bg-[#73191d] active:scale-[0.98] text-white font-black text-sm tracking-wide rounded-2xl shadow-lg shadow-red-900/25 flex items-center justify-center gap-2.5 transition-all touch-target cursor-pointer"
        >
          <span>INGRESAR AL SISTEMA</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* 6. Footer: Corte Superior de Justicia de Lima Este */}
      <footer className="relative z-10 text-center pt-2 pb-0.5 border-t border-slate-200/60 mt-1">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Corte Superior de Justicia de Lima Este
        </p>
      </footer>
    </div>
  );
};
