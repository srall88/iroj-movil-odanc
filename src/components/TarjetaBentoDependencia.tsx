import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Check, 
  FileText,
  Calendar
} from 'lucide-react';
import { EvaluacionItem } from '../types';

interface TarjetaBentoProps {
  evaluacion: EvaluacionItem;
  historialMeses?: EvaluacionItem[];
}

export const TarjetaBentoDependencia: React.FC<TarjetaBentoProps> = ({
  evaluacion,
  historialMeses = []
}) => {
  const [expandido, setExpandido] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Semáforo institucional en tema claro
  const getBadgeStyle = (nivel: string) => {
    switch (nivel?.toUpperCase()) {
      case 'CRITICO':
      case 'MUY ALTO':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
          borderTop: 'border-t-rose-500',
          label: 'CRÍTICO'
        };
      case 'ALTO':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-700',
          dot: 'bg-orange-500',
          borderTop: 'border-t-orange-500',
          label: 'ALTO RIESGO'
        };
      case 'MEDIO':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          borderTop: 'border-t-amber-500',
          label: 'MEDIO'
        };
      case 'BAJO':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          borderTop: 'border-t-emerald-500',
          label: 'ÓPTIMO / BAJO'
        };
    }
  };

  const badge = getBadgeStyle(evaluacion.nivel_riesgo);

  const handleCopiar = () => {
    const texto = `[IROJ CSJLE] ${evaluacion.dependencia} (NDEP: ${evaluacion.ndep})\nMes: ${evaluacion.mes} ${evaluacion.anio}\nPuntaje IROJ: ${evaluacion.puntaje_final} pts (${evaluacion.nivel_riesgo})\nTrámite: ${evaluacion.pond_carga} pts | Escritos: ${evaluacion.pond_esc} pts | Impug.: ${evaluacion.pond_imp} pts | Ejec.: ${evaluacion.pond_eje} pts`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-4 shadow-taste-card hover:shadow-taste-elevated transition-all border-t-4 ${badge.borderTop}`}>
      {/* Cabecera de la Tarjeta Bento */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-black bg-slate-100 text-slate-700 rounded-md border border-slate-200 tabular-nums">
              NDEP {evaluacion.ndep}
            </span>
            {evaluacion.especialidad && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/70">
                {evaluacion.especialidad}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-bold text-slate-900 leading-snug tracking-tight">
            {evaluacion.dependencia}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {evaluacion.sede || 'Sede Principal'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {evaluacion.distrito || 'Lima Este'}
            </span>
          </div>
        </div>

        {/* Badge Semafórico con micro-luz pulsante */}
        <div className="flex flex-col items-end shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-micro-pulse`}></span>
            {badge.label}
          </span>
          <div className="mt-1 text-right">
            <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums font-mono">
              {evaluacion.puntaje_final}
            </span>
            <span className="text-[10px] font-bold text-slate-400 ml-0.5">pts</span>
          </div>
        </div>
      </div>

      {/* Barra de Progreso IROJ (0 a 100) */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-bold">
          <span>Puntaje IROJ: <strong className="text-slate-800 tabular-nums">{evaluacion.puntaje_final}</strong>/100</span>
          <span>Umbral Óptimo &lt; 40 pts</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              evaluacion.puntaje_final >= 80
                ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                : evaluacion.puntaje_final >= 60
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : evaluacion.puntaje_final >= 40
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${Math.min(evaluacion.puntaje_final, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid Bento de los 5 KPIs Oficiales del IROJ (Tabular Numerics) */}
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/90">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Trámite</span>
          <span className="text-[9px] text-slate-400 font-semibold">25%</span>
          <span className="text-xs font-black text-slate-900 mt-0.5 tabular-nums font-mono">{evaluacion.pond_carga}</span>
        </div>
        <div className="flex flex-col border-l border-slate-200 pl-1">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Año Ant.</span>
          <span className="text-[9px] text-slate-400 font-semibold">25%</span>
          <span className="text-xs font-black text-slate-900 mt-0.5 tabular-nums font-mono">{evaluacion.pond_ant}</span>
        </div>
        <div className="flex flex-col border-l border-slate-200 pl-1">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Escritos</span>
          <span className="text-[9px] text-slate-400 font-semibold">25%</span>
          <span className="text-xs font-black text-slate-900 mt-0.5 tabular-nums font-mono">{evaluacion.pond_esc}</span>
        </div>
        <div className="flex flex-col border-l border-slate-200 pl-1">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Impug.</span>
          <span className="text-[9px] text-slate-400 font-semibold">15%</span>
          <span className="text-xs font-black text-slate-900 mt-0.5 tabular-nums font-mono">{evaluacion.pond_imp}</span>
        </div>
        <div className="flex flex-col border-l border-slate-200 pl-1">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Ejec.</span>
          <span className="text-[9px] text-slate-400 font-semibold">10%</span>
          <span className="text-xs font-black text-slate-900 mt-0.5 tabular-nums font-mono">{evaluacion.pond_eje}</span>
        </div>
      </div>

      {/* Accordion Drawer expandible */}
      {expandido && (
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-fadeIn">
          {/* Desglose de Valores Numéricos Reales */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Valores Numéricos Reales
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block">Carga en Trámite:</span>
                <strong className="text-slate-900 text-sm font-black tabular-nums">{evaluacion.val_carga} exp.</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block">Año más antiguo:</span>
                <strong className="text-slate-900 text-sm font-black tabular-nums">{evaluacion.val_antiguedad}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block">Escritos Pendientes:</span>
                <strong className="text-slate-900 text-sm font-black tabular-nums">{evaluacion.val_escritos} esc.</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block">Impugnaciones:</span>
                <strong className="text-slate-900 text-sm font-black tabular-nums">{evaluacion.val_impugnacion} exp.</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
                <span className="text-[10px] font-semibold text-slate-500 block">Expedientes en Ejecución:</span>
                <strong className="text-slate-900 text-sm font-black tabular-nums">{evaluacion.val_ejecucion} exp.</strong>
              </div>
            </div>
          </div>

          {/* Evolución Histórica Mes a Mes */}
          {historialMeses.length > 1 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Evolución Mes a Mes
              </h4>
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {historialMeses.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/70 last:border-none">
                    <span className="text-slate-700 font-semibold capitalize">{h.mes.toLowerCase()} {h.anio}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        h.nivel_riesgo === 'CRITICO' || h.nivel_riesgo === 'ALTO'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {h.nivel_riesgo}
                      </span>
                      <strong className="text-slate-900 tabular-nums font-mono">{h.puntaje_final} pts</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón para compartir ficha */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={handleCopiar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl active:scale-[0.98] transition-all"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              {copiado ? '¡Copiado!' : 'Compartir Ficha'}
            </button>
          </div>
        </div>
      )}

      {/* Botón Expandir / Colapsar */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="mt-2.5 w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 active:scale-[0.98] transition-all"
      >
        <span>{expandido ? 'Ocultar desglose' : 'Ver desglose completo y evolución'}</span>
        {expandido ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
