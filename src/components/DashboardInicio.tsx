import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  BarChart,
  Scale
} from 'lucide-react';
import { ResumenPorMes, EvaluacionItem, TabType } from '../types';

interface DashboardInicioProps {
  resumen?: ResumenPorMes;
  mesActivo: string;
  anio: number;
  onNavigateTab: (tab: TabType) => void;
  onSelectOrgano: (ndep: number) => void;
}

export const DashboardInicio: React.FC<DashboardInicioProps> = ({
  resumen,
  mesActivo,
  anio,
  onNavigateTab
}) => {
  if (!resumen) return null;

  const { total_evaluados, promedio_puntaje, distribucion_niveles, top_riesgo } = resumen;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Banner de Bienvenida Institucional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/40 p-4 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" /> ODANC · Corte de Lima Este
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">
            Monitor de Gestión IROJ
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs">
            Evaluación oficial de {mesActivo.toLowerCase()} {anio} para {total_evaluados} órganos jurisdiccionales.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('dependencias')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md active:scale-95 transition-all"
            >
              Consultar Juzgados <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('ranking')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl active:scale-95 transition-all"
            >
              Ver Top Riesgo
            </button>
          </div>
        </div>
      </div>

      {/* Grid Bento de Métricas Globales */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Evaluados</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {total_evaluados}
          </div>
          <span className="text-[11px] text-slate-400">100% de la corte</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Promedio IROJ</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {promedio_puntaje} <span className="text-xs font-normal text-slate-400">pts</span>
          </div>
          <span className="text-[11px] text-slate-400">Media distrital</span>
        </div>
      </div>

      {/* Distribución por Niveles de Riesgo */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-indigo-400" /> Semáforo de Cumplimiento
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            {mesActivo} {anio}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Crítico */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-400 block uppercase">Crítico (&gt;80)</span>
              <strong className="text-lg font-black text-white">{distribucion_niveles.CRITICO}</strong>
            </div>
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-micro-pulse"></div>
          </div>

          {/* Alto */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-orange-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-400 block uppercase">Alto (60-79)</span>
              <strong className="text-lg font-black text-white">{distribucion_niveles.ALTO}</strong>
            </div>
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          </div>

          {/* Medio */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 block uppercase">Medio (40-59)</span>
              <strong className="text-lg font-black text-white">{distribucion_niveles.MEDIO}</strong>
            </div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          </div>

          {/* Bajo */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-950/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 block uppercase">Óptimo (&lt;40)</span>
              <strong className="text-lg font-black text-white">{distribucion_niveles.BAJO}</strong>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {/* Acceso Rápido a Órganos con Mayor Riesgo */}
      {top_riesgo && top_riesgo.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Órganos Prioritarios
            </h3>
            <button
              onClick={() => onNavigateTab('ranking')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Ver todos →
            </button>
          </div>

          <div className="space-y-2">
            {top_riesgo.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      NDEP {item.ndep}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-1">
                    {item.dependencia}
                  </h4>
                  <span className="text-[11px] text-slate-400">{item.sede}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-rose-400">
                    {item.puntaje_final}
                  </span>
                  <span className="text-[10px] text-slate-400 block">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ficha Explicativa de Ponderaciones IROJ */}
      <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl text-xs text-slate-400 space-y-1.5">
        <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Metodología Oficial IROJ
        </h4>
        <p className="text-[11px] leading-relaxed">
          El IROJ evalúa 5 componentes con pesos ponderados: Trámite (25%), Año Anterior (25%), Escritos Pendientes (25%), Impugnaciones (15%) y Ejecución (10%).
        </p>
      </div>
    </div>
  );
};
