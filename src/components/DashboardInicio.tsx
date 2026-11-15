import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  BarChart,
  Scale,
  MapPin
} from 'lucide-react';
import { ResumenPorMes, EvaluacionItem, TabType } from '../types';

interface DashboardInicioProps {
  resumen?: ResumenPorMes;
  mesActivo: string;
  anio: number;
  onNavigateTab: (tab: TabType) => void;
  onSelectOrgano: (ndep: number) => void;
  onOpenCascada: () => void;
}

export const DashboardInicio: React.FC<DashboardInicioProps> = ({
  resumen,
  mesActivo,
  anio,
  onNavigateTab,
  onOpenCascada
}) => {
  if (!resumen) return null;

  const { total_evaluados, promedio_puntaje, distribucion_niveles, top_riesgo } = resumen;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Banner Principal Institucional en Modo Claro */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 shadow-lg shadow-indigo-900/15">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" /> ODANC · Corte Superior de Lima Este
          </div>
          <h2 className="text-xl font-black mt-1 tracking-tight">
            Monitor de Gestión IROJ
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1 max-w-xs leading-relaxed">
            Evaluación oficial de {mesActivo.toLowerCase()} {anio} para {total_evaluados} dependencias jurisdiccionales.
          </p>
          <div className="mt-4 flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenCascada}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Consulta Guiada <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('dependencias')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-indigo-700/60 hover:bg-indigo-700 text-white border border-indigo-500/40 rounded-xl active:scale-95 transition-all"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </div>

      {/* Grid Bento de Métricas Globales */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Evaluados</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {total_evaluados}
          </div>
          <span className="text-[11px] font-semibold text-slate-500">100% de la corte</span>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Promedio IROJ</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">
            {promedio_puntaje} <span className="text-xs font-bold text-slate-400">pts</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">Media distrital</span>
        </div>
      </div>

      {/* Distribución por Niveles de Riesgo */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-indigo-600" /> Semáforo de Cumplimiento
          </h3>
          <span className="text-[11px] text-slate-500 font-bold capitalize">
            {mesActivo.toLowerCase()} {anio}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Crítico */}
          <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-rose-700 block uppercase">Crítico (&gt;80)</span>
              <strong className="text-xl font-black text-rose-950">{distribucion_niveles.CRITICO}</strong>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-micro-pulse"></div>
          </div>

          {/* Alto */}
          <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-orange-700 block uppercase">Alto (60-79)</span>
              <strong className="text-xl font-black text-orange-950">{distribucion_niveles.ALTO}</strong>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-orange-500"></div>
          </div>

          {/* Medio */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 block uppercase">Medio (40-59)</span>
              <strong className="text-xl font-black text-amber-950">{distribucion_niveles.MEDIO}</strong>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
          </div>

          {/* Bajo */}
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 block uppercase">Óptimo (&lt;40)</span>
              <strong className="text-xl font-black text-emerald-950">{distribucion_niveles.BAJO}</strong>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {/* Acceso Rápido a Órganos con Mayor Riesgo */}
      {top_riesgo && top_riesgo.length > 0 && (
        <div className="bg-white border border-slate-200/90 p-4 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Órganos de Atención Prioritaria
            </h3>
            <button
              onClick={() => onNavigateTab('ranking')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Ver ranking →
            </button>
          </div>

          <div className="space-y-2">
            {top_riesgo.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      NDEP {item.ndep}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                    {item.dependencia}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500">{item.sede}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-rose-600">
                    {item.puntaje_final}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ficha Explicativa de Metodología */}
      <div className="bg-slate-100/70 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 space-y-1">
        <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Ponderaciones Oficiales IROJ
        </h4>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Trámite (25%) + Año Anterior (25%) + Escritos (25%) + Impugnaciones (15%) + Ejecución (10%). El puntaje acumulado clasifica a la dependencia en el semáforo resolutivo.
        </p>
      </div>
    </div>
  );
};
