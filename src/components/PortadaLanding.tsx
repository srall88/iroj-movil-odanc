import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  BarChart2
} from 'lucide-react';

interface PortadaLandingProps {
  totalDependencias: number;
  totalDistritos: number;
  mesActivo: string;
  anio: number;
  onIngresar: () => void;
  onConsultaDirecta: () => void;
}

export const PortadaLanding: React.FC<PortadaLandingProps> = ({
  totalDependencias,
  totalDistritos,
  mesActivo,
  anio,
  onIngresar,
  onConsultaDirecta
}) => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between px-5 pt-4 pb-8 bg-slate-50 overflow-hidden">
      {/* Background Snippet (ibelick - grid pattern + radial aura) */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-aura-glow pointer-events-none"></div>

      {/* 1. Header Institucional Superior */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          {/* Logo CSJLE */}
          <div className="flex items-center gap-2">
            <img 
              src="/imagenes/logo csjle.png" 
              alt="Logo CSJLE" 
              className="h-9 w-auto object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="leading-tight">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                Poder Judicial del Perú
              </span>
              <span className="text-[11px] font-extrabold text-indigo-950 block">
                Corte de Lima Este
              </span>
            </div>
          </div>

          {/* Logo ODANC */}
          <div className="flex items-center gap-1.5 pl-2">
            <img 
              src="/imagenes/logo-odanc.png" 
              alt="Logo ODANC" 
              className="h-8 w-auto object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div className="text-right leading-tight">
              <span className="text-[10px] font-bold text-amber-700 block">
                ODANC
              </span>
              <span className="text-[9px] text-slate-500 font-semibold block">
                Lima Este
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Visual Central con Logo IROJ */}
      <div className="relative z-10 text-center py-4 my-auto space-y-4">
        {/* Emblema / Imagen del IROJ */}
        <div className="relative inline-block mx-auto">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-amber-500 p-1 shadow-2xl shadow-indigo-500/25">
            <div className="w-full h-full bg-white rounded-[22px] overflow-hidden flex items-center justify-center p-2 relative">
              <img 
                src="/imagenes/Portada de carga.jpg" 
                alt="Logo IROJ" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  // Fallback si no carga la imagen
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/5">
                <Scale className="w-12 h-12 text-indigo-700 drop-shadow" />
              </div>
            </div>
          </div>

          {/* Micro chip oficial */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
            Oficial 2026
          </div>
        </div>

        {/* Título Principal */}
        <div className="pt-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 bg-clip-text text-transparent">
            IROJ
          </h1>
          <p className="mt-2 text-sm font-bold text-indigo-900 uppercase tracking-wide">
            Índice de Rendimiento de Órganos Jurisdiccionales
          </p>
          <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Sistema oficial de consulta y monitoreo de metas, carga procesal y semáforo resolutivo en tiempo real.
          </p>
        </div>

        {/* 3. Contadores y Métricas Clave de la Evaluación */}
        <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto pt-2">
          {/* Dependencias actuales */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-600 mb-0.5">
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dependencias</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">
              {totalDependencias}
            </span>
            <span className="text-[10px] font-medium text-emerald-600 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-micro-pulse"></span>
              En Evaluación
            </span>
          </div>

          {/* Distritos Judiciales */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-0.5">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Distritos</span>
            </div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">
              {totalDistritos}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              Jurisdicciones
            </span>
          </div>
        </div>

        {/* Chip de corte estadístico */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200/70 rounded-full text-xs font-semibold text-indigo-900">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mes de Evaluación Activo: <strong className="capitalize">{mesActivo.toLowerCase()} {anio}</strong></span>
        </div>
      </div>

      {/* 4. Botones de Acción */}
      <div className="relative z-10 space-y-2 pt-2">
        <button
          onClick={onIngresar}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
        >
          <span>Ingresar al Sistema</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onConsultaDirecta}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-sm active:scale-98 transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Consulta por Distrito ➔ Sede ➔ Juzgado</span>
        </button>

        <div className="pt-2 text-center text-[10px] text-slate-400">
          ODANC Lima Este · Oficina Descentralizada de la Autoridad Nacional de Control
        </div>
      </div>
    </div>
  );
};
