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
  AlertTriangle
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

  // Nivel y color del Semáforo IROJ
  const getSemaforoInfo = (nivel: string, puntaje: number) => {
    const n = nivel?.toUpperCase();
    if (n === 'CRITICO' || n === 'MUY ALTO' || puntaje >= 80) {
      return {
        label: 'CRÍTICO',
        colorText: 'text-rose-700',
        colorBg: 'bg-rose-50/80',
        colorBorder: 'border-rose-200',
        dot: 'bg-rose-500',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        barGrad: 'bg-gradient-to-r from-orange-500 to-rose-600',
        desc: 'Nivel Crítico de Riesgo. Requiere atención y control inmediato.',
        icon: ShieldAlert
      };
    }
    if (n === 'ALTO' || (puntaje >= 60 && puntaje < 80)) {
      return {
        label: 'ALTO',
        colorText: 'text-orange-700',
        colorBg: 'bg-orange-50/80',
        colorBorder: 'border-orange-200',
        dot: 'bg-orange-500',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        barGrad: 'bg-gradient-to-r from-amber-500 to-orange-500',
        desc: 'Nivel Alto de Riesgo. Requiere medidas correctivas.',
        icon: AlertTriangle
      };
    }
    if (n === 'MEDIO' || (puntaje >= 40 && puntaje < 60)) {
      return {
        label: 'MEDIO',
        colorText: 'text-amber-700',
        colorBg: 'bg-amber-50/80',
        colorBorder: 'border-amber-200',
        dot: 'bg-amber-500',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        barGrad: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        desc: 'Nivel Medio de Riesgo. Rendimiento regular en seguimiento.',
        icon: Clock
      };
    }
    return {
      label: 'BAJO',
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-50/80',
      colorBorder: 'border-emerald-200',
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      barGrad: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      desc: 'Nivel Bajo de Riesgo. Desempeño y avance óptimo.',
      icon: ShieldCheck
    };
  };

  const semaforo = getSemaforoInfo(evaluacionActual.nivel_riesgo, evaluacionActual.puntaje_final);
  const StatusIcon = semaforo.icon;

  return (
    <div className="px-4 py-4 space-y-4 max-w-md mx-auto select-none">
      {/* Botón Superior para volver a los filtros */}
      <button
        onClick={onVolverFiltros}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cambiar órgano o distrito</span>
      </button>

      {/* 1. Tarjeta Ejecutiva de la Dependencia */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black tracking-wide">
                NDEP {evaluacionActual.ndep}
              </span>
              {evaluacionActual.especialidad && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold truncate">
                  {evaluacionActual.especialidad}
                </span>
              )}
            </div>
            <h2 className="text-sm font-black text-slate-900 leading-snug pt-1">
              {evaluacionActual.dependencia}
            </h2>
          </div>
        </div>

        {/* Metadatos Territoriales (Distrito y Sede) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{evaluacionActual.distrito}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{evaluacionActual.sede || 'Sede Principal'}</span>
          </div>
        </div>
      </div>

      {/* 2. Selector Rápido del Mes de Evaluación */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mes de Evaluación</span>
          </span>
          <span className="text-xs font-black text-slate-900 uppercase">
            {mesActivo} {anio}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {mesesDisponibles.map((m) => {
            const isSelected = m.toUpperCase() === mesActivo.toUpperCase();
            return (
              <button
                key={m}
                onClick={() => onCambiarMes(m)}
                className={`py-2 px-1 text-xs font-extrabold rounded-xl border capitalize transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Indicador Principal IROJ (Puntaje y Semáforo de Riesgo) */}
      <div className={`bg-white border ${semaforo.colorBorder} rounded-3xl p-5 shadow-sm text-center space-y-3.5`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
            Indicador IROJ
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${semaforo.badgeBg}`}>
            <span className={`w-2 h-2 rounded-full ${semaforo.dot} animate-pulse`}></span>
            <span className="text-xs font-black tracking-wide">
              {semaforo.label}
            </span>
          </div>
        </div>

        {/* Puntaje Numérico Gigante y Elegante */}
        <div className="py-1">
          <span className="text-5xl font-black text-slate-900 tracking-tight tabular-nums font-mono">
            {evaluacionActual.puntaje_final}
          </span>
          <span className="text-xs font-bold text-slate-400 ml-1.5">/ 100</span>
        </div>

        {/* Barra Visual de Avance */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${semaforo.barGrad}`}
            style={{ width: `${Math.min(evaluacionActual.puntaje_final, 100)}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-slate-600 leading-relaxed px-2">
          {semaforo.desc}
        </p>
      </div>

      {/* 4. Los 5 KPIs de las CANTIDADES (Sin porcentajes ni fórmulas) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Cantidades de los 5 KPIs
          </h3>
          <span className="text-[10px] font-bold text-slate-400">Valores Reales</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* KPI 1: Trámite */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Trámite
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Expedientes en trámite activo
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_carga}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">expedientes</span>
            </div>
          </div>

          {/* KPI 2: Año Anterior */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Año Anterior
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Año del expediente más antiguo
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_antiguedad}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">año</span>
            </div>
          </div>

          {/* KPI 3: Escritos */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Escritos
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Escritos pendientes de proveer
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_escritos}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">escritos</span>
            </div>
          </div>

          {/* KPI 4: Impugnaciones */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Impugnaciones
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Expedientes en impugnación
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_impugnacion}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">expedientes</span>
            </div>
          </div>

          {/* KPI 5: Ejecución */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Ejecución
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Procesos en etapa de ejecución
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="text-xl font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_ejecucion}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">procesos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Botón Ver Histórico de los Meses Anteriores (En orden mes a mes) */}
      <div className="pt-2">
        <button
          onClick={() => setMostrarHistorico(!mostrarHistorico)}
          className="w-full flex items-center justify-between py-4 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs font-bold text-xs text-slate-800 active:scale-[0.98] transition-all touch-target"
        >
          <span className="flex items-center gap-2 text-indigo-700">
            <History className="w-4 h-4" />
            <span>Ver histórico de los meses anteriores</span>
          </span>
          {mostrarHistorico ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Desglose Histórico Cronológico Mes a Mes */}
        {mostrarHistorico && (
          <div className="mt-2.5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
              Evolución en orden cronológico (mes a mes):
            </span>

            <div className="space-y-2 pt-1">
              {historialOrdenado.map((h) => {
                const hSemaforo = getSemaforoInfo(h.nivel_riesgo, h.puntaje_final);
                const esMesActual = h.mes.toUpperCase() === mesActivo.toUpperCase();

                return (
                  <div
                    key={h.mes}
                    onClick={() => onCambiarMes(h.mes)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      esMesActual
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase block">
                        {h.mes} {anio}
                      </span>
                      <span className={`text-[10px] font-bold ${esMesActual ? 'text-amber-300' : 'text-slate-500'}`}>
                        Nivel {hSemaforo.label}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-base font-black tabular-nums font-mono">
                        {h.puntaje_final} <span className="text-[10px] opacity-70">pts</span>
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

      {/* 6. Botón de Acción Final: Realizar Otra Consulta */}
      <div className="pt-2">
        <button
          onClick={onVolverFiltros}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm active:scale-[0.98] transition-all touch-target"
        >
          Realizar otra consulta
        </button>
      </div>

      {/* 7. Pie de Página Institucional */}
      <footer className="text-center pt-6 pb-2 border-t border-slate-200/80">
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
