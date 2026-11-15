import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  Check, 
  AlertCircle,
  Clock,
  FileText,
  Scale,
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

  // Colores y badges según nivel de riesgo
  const getBadgeStyle = (nivel: string) => {
    switch (nivel?.toUpperCase()) {
      case 'CRITICO':
      case 'MUY ALTO':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500',
          label: 'CRÍTICO'
        };
      case 'ALTO':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-500',
          label: 'ALTO RIESGO'
        };
      case 'MEDIO':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          label: 'MEDIO'
        };
      case 'BAJO':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-500',
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md shadow-black/20 transition-all hover:border-slate-700">
      {/* Cabecera de la Tarjeta Bento */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-md border border-slate-700">
              NDEP {evaluacion.ndep}
            </span>
            {evaluacion.especialidad && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 rounded-md border border-indigo-500/20">
                {evaluacion.especialidad}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-bold text-white leading-snug tracking-tight">
            {evaluacion.dependencia}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 truncate">
              <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
              {evaluacion.sede || 'Sede no especificada'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              {evaluacion.distrito || 'Lima Este'}
            </span>
          </div>
        </div>

        {/* Badge Semafórico con micro-luz pulsante */}
        <div className="flex flex-col items-end shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-micro-pulse`}></span>
            {badge.label}
          </span>
          <div className="mt-1 text-right">
            <span className="text-xl font-extrabold text-white tracking-tight">
              {evaluacion.puntaje_final}
            </span>
            <span className="text-[10px] text-slate-400 ml-0.5">pts</span>
          </div>
        </div>
      </div>

      {/* Barra de Progreso IROJ (Puntaje 0 - 100) */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-medium">
          <span>Índice IROJ: {evaluacion.puntaje_final}/100</span>
          <span>Umbral Óptimo &lt; 40 pts</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              evaluacion.puntaje_final >= 80
                ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                : evaluacion.puntaje_final >= 60
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : evaluacion.puntaje_final >= 40
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.min(evaluacion.puntaje_final, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid Bento de los 5 KPIs Oficiales del IROJ */}
      <div className="mt-3 grid grid-cols-5 gap-1.5 text-center bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Trámite</span>
          <span className="text-[10px] text-slate-500">25%</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{evaluacion.pond_carga}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800/60 pl-1">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Año Ant.</span>
          <span className="text-[10px] text-slate-500">25%</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{evaluacion.pond_ant}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800/60 pl-1">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Escritos</span>
          <span className="text-[10px] text-slate-500">25%</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{evaluacion.pond_esc}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800/60 pl-1">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Impug.</span>
          <span className="text-[10px] text-slate-500">15%</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{evaluacion.pond_imp}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800/60 pl-1">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Ejec.</span>
          <span className="text-[10px] text-slate-500">10%</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{evaluacion.pond_eje}</span>
        </div>
      </div>

      {/* Accordion Drawer expandible */}
      {expandido && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fadeIn">
          {/* Desglose de Valores Reales */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Variables Numéricas Reales
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Carga en Trámite:</span>
                <strong className="text-white text-sm">{evaluacion.val_carga} exp.</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Año más antiguo:</span>
                <strong className="text-white text-sm">{evaluacion.val_antiguedad}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Escritos Pendientes:</span>
                <strong className="text-white text-sm">{evaluacion.val_escritos} esc.</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Impugnaciones:</span>
                <strong className="text-white text-sm">{evaluacion.val_impugnacion} exp.</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-400 block">Expedientes en Ejecución:</span>
                <strong className="text-white text-sm">{evaluacion.val_ejecucion} exp.</strong>
              </div>
            </div>
          </div>

          {/* Evolución Mes a Mes */}
          {historialMeses.length > 1 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Evolución Histórica
              </h4>
              <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                {historialMeses.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-none">
                    <span className="text-slate-300 font-medium capitalize">{h.mes.toLowerCase()} {h.anio}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        h.nivel_riesgo === 'CRITICO' || h.nivel_riesgo === 'ALTO'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {h.nivel_riesgo}
                      </span>
                      <strong className="text-white">{h.puntaje_final} pts</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón para compartir o copiar ficha */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={handleCopiar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl active:scale-95 transition-all"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
              {copiado ? '¡Copiado!' : 'Compartir Ficha'}
            </button>
          </div>
        </div>
      )}

      {/* Botón Expandir / Colapsar */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="mt-2.5 w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 active:scale-98 transition-all"
      >
        <span>{expandido ? 'Ocultar detalles' : 'Ver desglose completo y evolución'}</span>
        {expandido ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
