import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Scale, 
  Calendar, 
  Search, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { EvaluacionItem } from '../types';

interface FiltrosGuiadosProps {
  evaluacionesTotales: EvaluacionItem[];
  distritos: string[];
  meses: string[];
  anio: number;
  onConsultar: (ndep: number, mes: string) => void;
}

export const FiltrosGuiadosView: React.FC<FiltrosGuiadosProps> = ({
  evaluacionesTotales,
  distritos,
  meses,
  anio,
  onConsultar
}) => {
  // Estados de los 4 pasos
  const [distritoSel, setDistritoSel] = useState<string>('');
  const [sedeSel, setSedeSel] = useState<string>('');
  const [organoSel, setOrganoSel] = useState<number | null>(null);
  
  // Mes por defecto Octubre si existe
  const [mesSel, setMesSel] = useState<string>(
    meses.includes('OCTUBRE') ? 'OCTUBRE' : meses[meses.length - 1] || 'OCTUBRE'
  );

  // Filtro de búsqueda rápida en el paso 3
  const [busquedaOrgano, setBusquedaOrgano] = useState<string>('');

  // 1. Sedes disponibles para el distrito seleccionado
  const sedesDisponibles = useMemo(() => {
    if (!distritoSel) return [];
    const evals = evaluacionesTotales.filter(e => e.distrito === distritoSel);
    const sMap = new Map<string, number>();
    for (const e of evals) {
      const s = e.sede || 'Sede Principal';
      sMap.set(s, (sMap.get(s) || 0) + 1);
    }
    return Array.from(sMap.keys()).sort();
  }, [evaluacionesTotales, distritoSel]);

  // 2. Órganos disponibles para la sede seleccionada
  const organosDisponibles = useMemo(() => {
    if (!distritoSel || !sedeSel) return [];
    
    // Obtenemos los órganos únicos (por NDEP) para no duplicar por mes
    const organosMap = new Map<number, { ndep: number; dependencia: string; especialidad: string }>();
    
    for (const e of evaluacionesTotales) {
      const coincideSede = e.sede === sedeSel || (!e.sede && sedeSel === 'Sede Principal');
      if (e.distrito === distritoSel && coincideSede) {
        if (!organosMap.has(e.ndep)) {
          organosMap.set(e.ndep, {
            ndep: e.ndep,
            dependencia: e.dependencia,
            especialidad: e.especialidad
          });
        }
      }
    }

    let list = Array.from(organosMap.values());

    if (busquedaOrgano.trim()) {
      const q = busquedaOrgano.toLowerCase().trim();
      list = list.filter(o => 
        o.dependencia.toLowerCase().includes(q) || 
        o.ndep.toString().includes(q) ||
        (o.especialidad && o.especialidad.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => a.ndep - b.ndep);
  }, [evaluacionesTotales, distritoSel, sedeSel, busquedaOrgano]);

  const handleReset = () => {
    setDistritoSel('');
    setSedeSel('');
    setOrganoSel(null);
    setBusquedaOrgano('');
  };

  const puedeConsultar = distritoSel !== '' && sedeSel !== '' && organoSel !== null;

  return (
    <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
      {/* Título de la sección de Filtros Guiados */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Filtros Guiados
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sigue los 4 pasos para consultar el indicador IROJ
          </p>
        </div>
        {(distritoSel || sedeSel || organoSel) && (
          <button
            onClick={handleReset}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Limpiar
          </button>
        )}
      </div>

      {/* Contenedor de Pasos */}
      <div className="space-y-3.5">
        {/* ========================================================== */}
        {/* PASO 1: SELECCIONAR DISTRITO                              */}
        {/* ========================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2">
          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
              1
            </span>
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Seleccionar Distrito</span>
          </label>

          <select
            value={distritoSel}
            onChange={(e) => {
              setDistritoSel(e.target.value);
              setSedeSel('');
              setOrganoSel(null);
            }}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          >
            <option value="">-- Elige un Distrito Judicial --</option>
            {distritos.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================================== */}
        {/* PASO 2: SEDE JUDICIAL                                     */}
        {/* ========================================================== */}
        <div className={`bg-white border rounded-2xl p-3.5 shadow-sm space-y-2 transition-all ${
          distritoSel ? 'border-slate-200/90 opacity-100' : 'border-slate-200/50 opacity-60 pointer-events-none'
        }`}>
          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
              distritoSel ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              2
            </span>
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Sede Judicial</span>
          </label>

          <select
            value={sedeSel}
            onChange={(e) => {
              setSedeSel(e.target.value);
              setOrganoSel(null);
            }}
            disabled={!distritoSel}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {distritoSel ? '-- Elige una Sede Judicial --' : 'Primero selecciona el distrito'}
            </option>
            {sedesDisponibles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================================== */}
        {/* PASO 3: ÓRGANO JURISDICCIONAL                             */}
        {/* ========================================================== */}
        <div className={`bg-white border rounded-2xl p-3.5 shadow-sm space-y-2 transition-all ${
          sedeSel ? 'border-slate-200/90 opacity-100' : 'border-slate-200/50 opacity-60 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                sedeSel ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                3
              </span>
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Órgano Jurisdiccional</span>
            </label>
            {organosDisponibles.length > 0 && (
              <span className="text-[10px] text-slate-500 font-bold">
                {organosDisponibles.length} disponibles
              </span>
            )}
          </div>

          {sedeSel && organosDisponibles.length > 4 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={busquedaOrgano}
                onChange={(e) => setBusquedaOrgano(e.target.value)}
                placeholder="Filtrar por nombre o NDEP..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          <select
            value={organoSel !== null ? organoSel.toString() : ''}
            onChange={(e) => setOrganoSel(e.target.value ? Number(e.target.value) : null)}
            disabled={!sedeSel}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {sedeSel ? '-- Elige el Juzgado / Sala --' : 'Primero selecciona la sede'}
            </option>
            {organosDisponibles.map((o) => (
              <option key={o.ndep} value={o.ndep}>
                [NDEP {o.ndep}] {o.dependencia}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================================== */}
        {/* PASO 4: MES DE EVALUACIÓN                                 */}
        {/* ========================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-sm space-y-2.5">
          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
              4
            </span>
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Mes de Evaluación</span>
          </label>

          <div className="grid grid-cols-4 gap-1.5">
            {meses.map((m) => {
              const isSelected = m.toUpperCase() === mesSel.toUpperCase();
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMesSel(m)}
                  className={`py-2 px-1 text-xs font-extrabold rounded-xl border capitalize transition-all active:scale-95 text-center ${
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
      </div>

      {/* Botón Principal: Consultar Indicadores */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (organoSel !== null) {
              onConsultar(organoSel, mesSel);
            }
          }}
          disabled={!puedeConsultar}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 font-extrabold text-sm rounded-2xl shadow-md active:scale-[0.98] transition-all touch-target ${
            puedeConsultar
              ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-slate-900/15'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Consultar Indicadores</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {!puedeConsultar && (
          <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
            Completa los 3 primeros pasos para consultar el IROJ.
          </p>
        )}
      </div>

      {/* Pie de Página Institucional */}
      <div className="text-center pt-6 border-t border-slate-200/80">
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
