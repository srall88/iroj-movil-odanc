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
  Gavel
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
        colorBg: 'bg-rose-50',
        colorBorder: 'border-rose-300',
        dot: 'bg-rose-500',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        barGrad: 'bg-gradient-to-r from-orange-500 to-rose-600',
        desc: 'Nivel Crítico de Riesgo. Requiere atención y control inmediato.'
      };
    }
    if (n === 'ALTO' || (puntaje >= 60 && puntaje < 80)) {
      return {
        label: 'ALTO',
        colorText: 'text-orange-700',
        colorBg: 'bg-orange-50',
        colorBorder: 'border-orange-300',
        dot: 'bg-orange-500',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        barGrad: 'bg-gradient-to-r from-amber-500 to-orange-500',
        desc: 'Nivel Alto de Riesgo. Requiere medidas correctivas.'
      };
    }
    if (n === 'MEDIO' || (puntaje >= 40 && puntaje < 60)) {
      return {
        label: 'MEDIO',
        colorText: 'text-amber-700',
        colorBg: 'bg-amber-50',
        colorBorder: 'border-amber-300',
        dot: 'bg-amber-500',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        barGrad: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        desc: 'Nivel Medio de Riesgo. Rendimiento regular en seguimiento.'
      };
    }
    return {
      label: 'BAJO',
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-50',
      colorBorder: 'border-emerald-300',
      dot: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      barGrad: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      desc: 'Nivel Bajo de Riesgo. Desempeño y avance óptimo.'
    };
  };

  const semaforo = getSemaforoInfo(evaluacionActual.nivel_riesgo, evaluacionActual.puntaje_final);

  return (
    <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
      {/* Botón Superior para volver a los filtros */}
      <button
        onClick={onVolverFiltros}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Filtros Guiados</span>
      </button>

      {/* 1. Encabezado con Datos del Órgano Jurisdiccional */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 text-[10px] font-black bg-slate-100 text-slate-700 rounded-md border border-slate-200 tabular-nums">
            NDEP {evaluacionActual.ndep}
          </span>
          {evaluacionActual.especialidad && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              {evaluacionActual.especialidad}
            </span>
          )}
        </div>

        <h2 className="text-base font-black text-slate-900 leading-snug tracking-tight">
          {evaluacionActual.dependencia}
        </h2>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {evaluacionActual.sede || 'Sede Principal'}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {evaluacionActual.distrito || 'Lima Este'}
          </span>
        </div>
      </div>

      {/* 2. Selector de Cambio Rápido de Mes de Evaluación */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Mes de Evaluación:
          </span>
          <span className="text-[11px] font-black text-slate-900 uppercase">
            {mesActivo} {anio}
          </span>
        </div>

        {/* Botones de Meses */}
        <div className="grid grid-cols-4 gap-1.5">
          {mesesDisponibles.map((m) => {
            const isSelected = m.toUpperCase() === mesActivo.toUpperCase();
            return (
              <button
                key={m}
                onClick={() => onCambiarMes(m)}
                className={`py-1.5 px-1 text-xs font-black rounded-xl border capitalize transition-all active:scale-95 ${
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
      <div className={`bg-white border ${semaforo.colorBorder} rounded-3xl p-5 shadow-sm text-center space-y-3`}>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">
          Indicador Oficial IROJ
        </span>

        {/* Nivel de Semáforo Destacado */}
        <div className="flex items-center justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${semaforo.badgeBg}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${semaforo.dot} animate-micro-pulse`}></span>
            <span className="text-sm font-black tracking-wide">
              NIVEL {semaforo.label}
            </span>
          </div>
        </div>

        {/* Puntaje Numérico */}
        <div>
          <span className="text-4xl font-black text-slate-900 tracking-tight tabular-nums font-mono">
            {evaluacionActual.puntaje_final}
          </span>
          <span className="text-xs font-bold text-slate-400 ml-1">/ 100 pts</span>
        </div>

        {/* Barra Visual */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${semaforo.barGrad}`}
            style={{ width: `${Math.min(evaluacionActual.puntaje_final, 100)}%` }}
          />
        </div>

        <p className="text-xs font-semibold text-slate-600">
          {semaforo.desc}
        </p>
      </div>

      {/* 4. Los 5 KPIs de las CANTIDADES (Sin porcentajes ni fórmulas) */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 px-1">
          Cantidades de los 5 KPIs
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {/* KPI 1: Trámite */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
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
            <div className="text-right">
              <span className="text-base font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_carga}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">expedientes</span>
            </div>
          </div>

          {/* KPI 2: Año Anterior */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
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
            <div className="text-right">
              <span className="text-base font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_antiguedad}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">año</span>
            </div>
          </div>

          {/* KPI 3: Escritos */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Scale className="w-4 h-4" />
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
            <div className="text-right">
              <span className="text-base font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_escritos}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">escritos</span>
            </div>
          </div>

          {/* KPI 4: Impugnaciones */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Gavel className="w-4 h-4" />
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
            <div className="text-right">
              <span className="text-base font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_impugnacion}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">expedientes</span>
            </div>
          </div>

          {/* KPI 5: Ejecución */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 className="w-4 h-4" />
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
            <div className="text-right">
              <span className="text-base font-black text-slate-900 tabular-nums font-mono">
                {evaluacionActual.val_ejecucion}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block">procesos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Botón Ver Histórico de los Meses Anteriores (En orden mes a mes) */}
      <div className="pt-1">
        <button
          onClick={() => setMostrarHistorico(!mostrarHistorico)}
          className="w-full flex items-center justify-between py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-sm font-bold text-xs text-slate-800 active:scale-[0.98] transition-all touch-target"
        >
          <span className="flex items-center gap-2 text-indigo-700">
            <History className="w-4 h-4" />
            <span>Ver histórico de los meses anteriores</span>
          </span>
          {mostrarHistorico ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Desglose Histórico Cronológico Mes a Mes */}
        {mostrarHistorico && (
          <div className="mt-2.5 bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2 animate-fadeIn">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
              Evolución en orden mes a mes:
            </span>

            {historialOrdenado.map((h, idx) => {
              const sem = getSemaforoInfo(h.nivel_riesgo, h.puntaje_final);
              const isMesActual = h.mes.toUpperCase() === mesActivo.toUpperCase();

              return (
                <div
                  key={idx}
                  onClick={() => onCambiarMes(h.mes)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all active:scale-[0.98] ${
                    isMesActual
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sem.dot}`}></span>
                    <span className="font-extrabold capitalize">
                      {h.mes.toLowerCase()} {h.anio}
                    </span>
                    {isMesActual && (
                      <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
                        Actual
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isMesActual ? 'bg-white text-slate-900' : sem.badgeBg
                    }`}>
                      {sem.label}
                    </span>
                    <strong className="tabular-nums font-mono text-sm">
                      {h.puntaje_final} pts
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botón para Realizar otra Consulta */}
      <div className="pt-2">
        <button
          onClick={onVolverFiltros}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-2xl border border-slate-200 active:scale-[0.98] transition-all touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Realizar otra consulta</span>
        </button>
      </div>

      {/* Pie de Página Institucional */}
      <div className="text-center pt-4 border-t border-slate-200/80">
        <p className="text-xs font-bold text-slate-800 tracking-tight">
          Corte Superior de Justicia de Lima Este
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          ODANC · Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </div>
    </div>
  );
};
