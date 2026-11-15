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
  RotateCcw,
  Check
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

  // Cálculo de progreso
  const pasoProgreso = (distritoSel ? 1 : 0) + (sedeSel ? 1 : 0) + (organoSel !== null ? 1 : 0) + (mesSel ? 1 : 0);

  return (
    <div className="px-4 py-4 space-y-4 max-w-md mx-auto select-none">
      {/* Título de la sección de Filtros Guiados con barra de progreso */}
      <div className="space-y-2 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Filtros Guiados
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Completa los 4 pasos para consultar el indicador IROJ
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

        {/* Micro Barra de Progreso de 4 Pasos */}
        <div className="flex items-center gap-1.5 pt-1">
          {[1, 2, 3, 4].map((step) => {
            const isDone = step <= pasoProgreso;
            return (
              <div 
                key={step} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  isDone ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Contenedor de Pasos */}
      <div className="space-y-3">
        {/* ========================================================== */}
        {/* PASO 1: SELECCIONAR DISTRITO                              */}
        {/* ========================================================== */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                distritoSel ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {distritoSel ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Paso 1: Distrito Judicial</span>
            </label>
            {distritoSel && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Seleccionado
              </span>
            )}
          </div>

          <select
            value={distritoSel}
            onChange={(e) => {
              setDistritoSel(e.target.value);
              setSedeSel('');
              setOrganoSel(null);
            }}
            className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
          >
            <option value="">-- Selecciona el Distrito Judicial --</option>
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
        <div className={`bg-white border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all ${
          distritoSel ? 'border-slate-200/90 opacity-100' : 'border-slate-200/50 opacity-60 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                sedeSel ? 'bg-emerald-600 text-white' : distritoSel ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {sedeSel ? <Check className="w-3 h-3" /> : '2'}
              </span>
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Paso 2: Sede Judicial</span>
            </label>
            {sedeSel && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Seleccionada
              </span>
            )}
          </div>

          <select
            value={sedeSel}
            onChange={(e) => {
              setSedeSel(e.target.value);
              setOrganoSel(null);
            }}
            disabled={!distritoSel}
            className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {distritoSel ? '-- Selecciona la Sede Judicial --' : 'Primero selecciona el distrito'}
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
        <div className={`bg-white border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all ${
          sedeSel ? 'border-slate-200/90 opacity-100' : 'border-slate-200/50 opacity-60 pointer-events-none'
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                organoSel !== null ? 'bg-emerald-600 text-white' : sedeSel ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {organoSel !== null ? <Check className="w-3 h-3" /> : '3'}
              </span>
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Paso 3: Órgano Jurisdiccional</span>
            </label>
            {organosDisponibles.length > 0 && (
              <span className="text-[10px] text-slate-500 font-bold">
                {organosDisponibles.length} órganos
              </span>
            )}
          </div>

          {sedeSel && organosDisponibles.length > 3 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={busquedaOrgano}
                onChange={(e) => setBusquedaOrgano(e.target.value)}
                placeholder="Buscar por nombre o NDEP..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          <select
            value={organoSel !== null ? organoSel.toString() : ''}
            onChange={(e) => setOrganoSel(e.target.value ? Number(e.target.value) : null)}
            disabled={!sedeSel}
            className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {sedeSel ? '-- Elige el Juzgado o Sala --' : 'Primero selecciona la sede'}
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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </span>
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Paso 4: Mes de Evaluación</span>
            </label>
            <span className="text-xs font-black text-slate-900 uppercase">
              {mesSel} {anio}
            </span>
          </div>

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

      {/* Botón Principal: Consultar Indicadores (Natural Reach / Thumb Zone) */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (organoSel !== null) {
              onConsultar(organoSel, mesSel);
            }
          }}
          disabled={!puedeConsultar}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 font-black text-sm rounded-2xl shadow-md active:scale-[0.98] transition-all touch-target ${
            puedeConsultar
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white cursor-pointer shadow-slate-900/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>CONSULTAR INDICADORES</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {!puedeConsultar && (
          <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
            Completa los 3 primeros pasos para consultar el IROJ.
          </p>
        )}
      </div>

      {/* Pie de Página Institucional */}
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
