import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Scale, 
  Clock, 
  FileText, 
  Gavel,
  ShieldCheck,
  ShieldAlert,
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
  onVolverFiltros
}) => {
  // Nivel y color del Semáforo IROJ
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
        barGrad: 'bg-gradient-to-r from-orange-500 to-rose-600',
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
        barGrad: 'bg-gradient-to-r from-amber-500 to-orange-500',
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
        barGrad: 'bg-gradient-to-r from-yellow-400 to-amber-500',
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
      barGrad: 'bg-gradient-to-r from-emerald-500 to-teal-500',
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

      {/* 1. CAMBIO RÁPIDO DE MES (Sin número 8) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            CAMBIO RÁPIDO DE MES ({anio})
          </span>
          <span className="text-xs font-black text-[#8B1E23] uppercase">
            {mesActivo}
          </span>
        </div>

        {/* Píldoras de Meses con Selector Granate / Azul */}
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
                    ? 'bg-[#8B1E23] text-white border-[#8B1E23] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {abbrev}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tarjeta Identidad del Órgano (Sin 'OPJ NO PENALES') */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-[#8B1E23] text-[11px] font-black">
            Cód: {evaluacionActual.ndep}
          </span>
          {evaluacionActual.especialidad && (
            <span className="text-xs font-bold text-slate-500">
              {evaluacionActual.especialidad}
            </span>
          )}
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

      {/* ========================================================== */}
      {/* 3. ORDEN DE LOS KPIS:                                      */}
      {/* 1°: NIVEL IROJ                                            */}
      {/* 2°: PUNTAJE IROJ                                          */}
      {/* 3°: TRÁMITE, AÑO ANTERIOR, ESCRITOS, IMPUGNACIONES, EJEC.  */}
      {/* ========================================================== */}

      {/* 1° NIVEL IROJ (Tarjeta Principal Destacada) */}
      <div className={`rounded-3xl p-4 border-2 ${semaforo.colorBorder} ${semaforo.colorBg} shadow-sm space-y-2`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
              Nivel IROJ
            </span>
            <span className={`text-2xl font-black tracking-tight ${semaforo.colorText} flex items-center gap-1.5`}>
              <span>{semaforo.arrow}</span>
              <span>{semaforo.label}</span>
            </span>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-black shadow-2xs">
            Oficial
          </span>
        </div>

        <p className="text-xs font-semibold text-slate-600 leading-snug">
          {semaforo.desc}
        </p>
      </div>

      {/* 2° PUNTAJE IROJ */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider block">
            Puntaje IROJ
          </span>
          <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
            {evaluacionActual.puntaje_final} <span className="text-xs font-bold text-slate-400">/ 100 pts</span>
          </span>
        </div>

        <div className="w-32 space-y-1">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${semaforo.barGrad}`}
              style={{ width: `${Math.min(evaluacionActual.puntaje_final, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 text-right block">
            {mesActivo} {anio}
          </span>
        </div>
      </div>

      {/* 3° LOS KPIS DE CANTIDADES (2 Columnas, Sin botones 'Ver' ni 'Detalle') */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700 px-1 block">
          Cantidades de Indicadores
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {/* KPI 1: TRÁMITE (Antes Total Expedientes) */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 mb-1">
              <FileText className="w-4 h-4 text-sky-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Trámite
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
                {evaluacionActual.val_carga}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                Expedientes activos
              </span>
            </div>
          </div>

          {/* KPI 2: AÑO ANTERIOR */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Año Anterior
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
                {evaluacionActual.val_antiguedad}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                Año del más antiguo
              </span>
            </div>
          </div>

          {/* KPI 3: ESCRITOS */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 mb-1">
              <Scale className="w-4 h-4 text-purple-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Escritos
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
                {evaluacionActual.val_escritos}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                Escritos pendientes
              </span>
            </div>
          </div>

          {/* KPI 4: IMPUGNACIONES */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 mb-1">
              <Gavel className="w-4 h-4 text-orange-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                Impugnaciones
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
                {evaluacionActual.val_impugnacion}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                En impugnación
              </span>
            </div>
          </div>

          {/* KPI 5: EJECUCIÓN (Abarca 2 columnas para balance estético) */}
          <div className="col-span-2 bg-white border-2 border-slate-200 rounded-3xl p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Ejecución
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Procesos en etapa de ejecución
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-slate-900 tracking-tight tabular-nums block font-mono">
                {evaluacionActual.val_ejecucion}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block">procesos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Botón Realizar Otra Consulta */}
      <div className="pt-2">
        <button
          onClick={onVolverFiltros}
          className="w-full py-4 px-6 bg-[#8B1E23] hover:bg-[#73191d] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          Realizar otra consulta
        </button>
      </div>

      {/* 5. Pie de Página: Primero ODANC y luego Corte Superior */}
      <footer className="text-center pt-5 pb-2 border-t border-slate-200/80 space-y-0.5">
        <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
          ODANC LIMA ESTE
        </p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
          Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Corte Superior de Justicia de Lima Este
        </p>
      </footer>
    </div>
  );
};
