import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  History, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Clock,
  FileText,
  Gavel,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { EvaluacionItem } from '../types';

interface FichaIndicadoresProps {
  evaluacionActual: EvaluacionItem;
  mesesDisponibles: string[];
  mesActivo: string;
  anio: number;
  onCambiarMes: (mes: string) => void;
  onVolverFiltros: () => void;
  historialMeses: EvaluacionItem[];
}

export const FichaIndicadoresView: React.FC<FichaIndicadoresProps> = ({
  evaluacionActual,
  mesesDisponibles,
  mesActivo,
  anio,
  onCambiarMes,
  onVolverFiltros,
  historialMeses
}) => {
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);

  // Orden cronológico de meses
  const ordenCronologico = ['MARZO', 'MAYO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const historialOrdenado = [...historialMeses].sort((a, b) => {
    return ordenCronologico.indexOf(a.mes.toUpperCase()) - ordenCronologico.indexOf(b.mes.toUpperCase());
  });

  // Nivel y color del Semáforo IROJ (Réplica Imagen 1)
  const getSemaforoInfo = (nivel: string, puntaje: number) => {
    const n = nivel?.toUpperCase();
    if (n === 'CRITICO' || n === 'MUY ALTO' || puntaje >= 80) {
      return {
        label: 'CRÍTICO',
        colorText: 'text-rose-700',
        colorBg: 'bg-rose-50/90',
        colorBorder: 'border-rose-400',
        dot: 'bg-rose-500',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        desc: 'Nivel Crítico de Riesgo. Requiere medidas de control inmediato.',
        arrow: '▲'
      };
    }
    if (n === 'ALTO' || (puntaje >= 60 && puntaje < 80)) {
      return {
        label: 'ALTO',
        colorText: 'text-orange-700',
        colorBg: 'bg-orange-50/90',
        colorBorder: 'border-orange-400',
        dot: 'bg-orange-500',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        desc: 'Nivel Alto de Riesgo. Por debajo del umbral mínimo resolutivo mensual.',
        arrow: '▼'
      };
    }
    if (n === 'MEDIO' || (puntaje >= 40 && puntaje < 60)) {
      return {
        label: 'MEDIO',
        colorText: 'text-amber-700',
        colorBg: 'bg-amber-50/90',
        colorBorder: 'border-amber-400',
        dot: 'bg-amber-500',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        desc: 'Nivel Medio de Riesgo. Rendimiento regular en seguimiento.',
        arrow: '◆'
      };
    }
    return {
      label: 'BAJO',
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-50/90',
      colorBorder: 'border-emerald-400',
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Nivel Bajo de Riesgo. Desempeño y avance resolutivo óptimo.',
      arrow: '●'
    };
  };

  const semaforo = getSemaforoInfo(evaluacionActual.nivel_riesgo, evaluacionActual.puntaje_final);

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 pt-3 pb-24 space-y-3.5 max-w-md mx-auto select-none">
      {/* Botón Superior para volver a los filtros */}
      <button
        onClick={onVolverFiltros}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cambiar filtros guiados</span>
      </button>

      {/* 1. CAMBIO RÁPIDO DE MES (Réplica exacta Imagen 1) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            CAMBIO RÁPIDO DE MES ({anio})
          </span>
          <span className="text-[11px] font-black text-sky-600 flex items-center gap-1">
            <span>{mesActivo}</span>
            <span className="text-slate-400">8</span>
          </span>
        </div>

        {/* Píldoras de Meses con Selector Activo Azul (Réplica Imagen 1) */}
        <div className="grid grid-cols-4 gap-1.5">
          {mesesDisponibles.map((m) => {
            const isSelected = m.toUpperCase() === mesActivo.toUpperCase();
            const abbrev = m.substring(0, 3);
            return (
              <button
                key={m}
                onClick={() => onCambiarMes(m)}
                className={`py-2 px-1 text-xs font-black rounded-xl border capitalize transition-all active:scale-95 text-center ${
                  isSelected
                    ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {abbrev}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tarjeta Identidad del Órgano (Réplica Imagen 1) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>OPJ (NO PENALES)</span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Cód: {evaluacionActual.ndep}
          </span>
        </div>

        <h2 className="text-base font-black text-slate-900 leading-snug">
          {evaluacionActual.dependencia}
        </h2>

        {/* Fila de Insignias: Distrito, Sede, Mes */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
            <span>📍</span>
            <span>{evaluacionActual.distrito}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
            <span>🏢</span>
            <span>Sede: {evaluacionActual.sede || 'La merced'}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
            <span>📅</span>
            <span>{mesActivo} {anio}</span>
          </div>
        </div>
      </div>

      {/* 3. Tarjeta Meta Estándar R.A. (Réplica Imagen 1) */}
      <div className="bg-sky-50/50 border border-sky-200/90 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-lg shrink-0">
            🏛️
          </div>
          <div>
            <span className="text-xs font-black text-sky-800 uppercase tracking-wide block">
              META ESTÁNDAR R.A. 90-2025
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Meta anual de referencia establecida
            </span>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-white border border-sky-300 text-sky-900 text-base font-black tabular-nums shadow-2xs">
          1,400
        </div>
      </div>

      {/* 4. Grid de 6 Tarjetas Bento de Métricas & KPIs (Réplica EXACTA Imagen 1) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* KPI 1: Total Producción / Carga (Borde Azul #0284c7) */}
        <div className="bg-white border-2 border-sky-500/80 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider">
              TOTAL EXPEDIENTES
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700">
              📊 Detalle
            </span>
          </div>
          <div className="py-0.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.val_carga}
            </span>
            <span className="text-[11px] font-bold text-sky-600 block mt-0.5">
              Mes de {mesActivo}: {Math.round(evaluacionActual.val_carga * 0.1)}
            </span>
          </div>
        </div>

        {/* KPI 2: Meta / Año Anterior (Borde Azul #0284c7) */}
        <div className="bg-white border-2 border-sky-500/80 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider">
            AÑO MÁS ANTIGUO
          </span>
          <div className="py-0.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.val_antiguedad}
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Año del más antiguo
            </span>
          </div>
        </div>

        {/* KPI 3: Escritos Pendientes (Borde Ámbar #f59e0b) */}
        <div className="bg-white border-2 border-amber-400/90 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
            ESCRITOS PENDIENTES
          </span>
          <div className="py-0.5">
            <span className="text-3xl font-black text-amber-800 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.val_escritos}
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Por proveer en el mes
            </span>
          </div>
        </div>

        {/* KPI 4: Impugnaciones (Borde Naranja #f97316) */}
        <div className="bg-white border-2 border-orange-500/80 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase text-orange-700 tracking-wider">
              IMPUGNACIONES
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white shadow-2xs">
              📁 Ver
            </span>
          </div>
          <div className="py-0.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.val_impugnacion}
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Toca para ver etapas
            </span>
          </div>
        </div>

        {/* KPI 5: Procesos en Ejecución (Borde Púrpura #a855f7) */}
        <div className="bg-white border-2 border-purple-500/80 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
              EN EJECUCIÓN
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700">
              📗 Ver
            </span>
          </div>
          <div className="py-0.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.val_ejecucion}
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              En trámite activo
            </span>
          </div>
        </div>

        {/* KPI 6: Puntaje Oficial IROJ (Borde Esmeralda/Teal #10b981) */}
        <div className="bg-white border-2 border-emerald-500/80 rounded-3xl p-3.5 shadow-sm space-y-1.5 flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
            PUNTAJE IROJ
          </span>
          <div className="py-0.5">
            <span className="text-3xl font-black text-emerald-600 tracking-tight tabular-nums block font-mono">
              {evaluacionActual.puntaje_final} <span className="text-sm font-bold text-slate-400">pts</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Referencia a {mesActivo}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Nivel Resolutivo Oficial (Tarjeta Ancha Inferior - Réplica Imagen 1) */}
      <div className={`rounded-3xl p-4 border-2 ${semaforo.colorBorder} ${semaforo.colorBg} shadow-sm space-y-2`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
              NIVEL RESOLUTIVO IROJ
            </span>
            <span className={`text-2xl font-black tracking-tight ${semaforo.colorText} flex items-center gap-1.5`}>
              <span>{semaforo.arrow}</span>
              <span>{semaforo.label}</span>
            </span>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-white border border-red-300 text-red-700 text-xs font-black shadow-2xs">
            Oficial
          </span>
        </div>

        <p className="text-xs font-semibold text-slate-600 leading-snug">
          {semaforo.desc}
        </p>
      </div>

      {/* 6. Botón Ver Histórico de los Meses Anteriores */}
      <div className="pt-1">
        <button
          onClick={() => setMostrarHistorico(!mostrarHistorico)}
          className="w-full flex items-center justify-between py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs font-bold text-xs text-slate-800 active:scale-[0.98] transition-all"
        >
          <span className="flex items-center gap-2 text-indigo-700">
            <History className="w-4 h-4" />
            <span>Ver histórico de los meses anteriores</span>
          </span>
          {mostrarHistorico ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {mostrarHistorico && (
          <div className="mt-2 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
              Evolución cronológica mes a mes:
            </span>

            <div className="space-y-1.5 pt-0.5">
              {historialOrdenado.map((h) => {
                const hSemaforo = getSemaforoInfo(h.nivel_riesgo, h.puntaje_final);
                const esMesActual = h.mes.toUpperCase() === mesActivo.toUpperCase();

                return (
                  <div
                    key={h.mes}
                    onClick={() => onCambiarMes(h.mes)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      esMesActual
                        ? 'bg-[#0284c7] text-white border-[#0284c7]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block">
                        {h.mes} {anio}
                      </span>
                      <span className={`text-[10px] font-bold ${esMesActual ? 'text-amber-200' : 'text-slate-500'}`}>
                        Nivel {hSemaforo.label}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-sm font-black tabular-nums font-mono">
                        {h.puntaje_final} pts
                      </span>
                      <span className={`w-2 h-2 rounded-full ${hSemaforo.dot}`}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. Botón Realizar Otra Consulta */}
      <div className="pt-1">
        <button
          onClick={onVolverFiltros}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm active:scale-[0.98] transition-all"
        >
          Realizar otra consulta
        </button>
      </div>

      {/* 8. Pie Institucional */}
      <footer className="text-center pt-4 pb-2 border-t border-slate-200/80">
        <p className="text-xs font-bold text-slate-800 tracking-tight">
          Corte Superior de Justicia de Lima Este
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          ODANC · Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </footer>
    </div>
  );
};
