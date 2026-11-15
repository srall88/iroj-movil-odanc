import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Scale, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calendar,
  Share2,
  Check
} from 'lucide-react';
import { EvaluacionItem } from '../types';
import { TarjetaBentoDependencia } from './TarjetaBentoDependencia';

interface ConsultaCascadaProps {
  evaluaciones: EvaluacionItem[];
  distritos: string[];
  mesActivo: string;
  anio: number;
  historialPorOrgano: Map<number, EvaluacionItem[]>;
}

export const ConsultaCascadaView: React.FC<ConsultaCascadaProps> = ({
  evaluaciones,
  distritos,
  mesActivo,
  anio,
  historialPorOrgano
}) => {
  // Estados de selección en cascada
  const [distritoSel, setDistritoSel] = useState<string | null>(null);
  const [sedeSel, setSedeSel] = useState<string | null>(null);
  const [juzgadoSel, setJuzgadoSel] = useState<EvaluacionItem | null>(null);
  const [busquedaJuzgado, setBusquedaJuzgado] = useState<string>('');

  // 1. Sedes disponibles para el distrito seleccionado
  const sedesDelDistrito = useMemo(() => {
    if (!distritoSel) return [];
    const evals = evaluaciones.filter(e => e.distrito === distritoSel);
    const sedesMap = new Map<string, number>();

    for (const e of evals) {
      const sede = e.sede || 'Sede Principal';
      sedesMap.set(sede, (sedesMap.get(sede) || 0) + 1);
    }

    return Array.from(sedesMap.entries()).map(([sede, count]) => ({
      sede,
      count
    })).sort((a, b) => b.count - a.count);
  }, [evaluaciones, distritoSel]);

  // 2. Juzgados disponibles para la sede seleccionada
  const juzgadosDeLaSede = useMemo(() => {
    if (!distritoSel || !sedeSel) return [];
    let list = evaluaciones.filter(
      e => e.distrito === distritoSel && (e.sede === sedeSel || (!e.sede && sedeSel === 'Sede Principal'))
    );

    if (busquedaJuzgado.trim()) {
      const q = busquedaJuzgado.toLowerCase().trim();
      list = list.filter(e => 
        e.dependencia.toLowerCase().includes(q) || 
        e.ndep.toString().includes(q) ||
        (e.especialidad && e.especialidad.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => a.ndep - b.ndep);
  }, [evaluaciones, distritoSel, sedeSel, busquedaJuzgado]);

  // Reset total
  const handleReset = () => {
    setDistritoSel(null);
    setSedeSel(null);
    setJuzgadoSel(null);
    setBusquedaJuzgado('');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Barra de progreso de la selección */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Consulta Guiada IROJ</span>
          {(distritoSel || sedeSel || juzgadoSel) && (
            <button
              onClick={handleReset}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar
            </button>
          )}
        </div>

        {/* Pasos visuales (Breadcrumbs interactivos) */}
        <div className="flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar py-0.5">
          {/* Paso 1: Distrito */}
          <button
            onClick={() => { setSedeSel(null); setJuzgadoSel(null); }}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0 ${
              !distritoSel
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>{distritoSel || '1. Distrito'}</span>
          </button>

          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

          {/* Paso 2: Sede */}
          <button
            onClick={() => { if (distritoSel) setJuzgadoSel(null); }}
            disabled={!distritoSel}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0 ${
              distritoSel && !sedeSel
                ? 'bg-indigo-600 text-white shadow-sm'
                : sedeSel
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>{sedeSel || '2. Sede'}</span>
          </button>

          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

          {/* Paso 3: Juzgado */}
          <div
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0 ${
              juzgadoSel
                ? 'bg-indigo-50 text-indigo-700'
                : sedeSel
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span className="truncate max-w-[120px]">
              {juzgadoSel ? `NDEP ${juzgadoSel.ndep}` : '3. Juzgado'}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PASO 1: SELECCIONAR DISTRITO                             */}
      {/* ======================================================== */}
      {!distritoSel && (
        <div className="space-y-3">
          <div className="px-1">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" /> Paso 1: Selecciona el Distrito
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Elige el distrito judicial para ver sus sedes y dependencias activas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {distritos.map((dist) => {
              const count = evaluaciones.filter(e => e.distrito === dist).length;

              return (
                <button
                  key={dist}
                  onClick={() => setDistritoSel(dist)}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left flex items-center justify-between group active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {dist}
                      </h3>
                      <span className="text-xs text-slate-500">
                        {count} {count === 1 ? 'dependencia evaluada' : 'dependencias evaluadas'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASO 2: SELECCIONAR SEDE                                 */}
      {/* ======================================================== */}
      {distritoSel && !sedeSel && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" /> Paso 2: Selecciona la Sede
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sedes territoriales en <strong>{distritoSel}</strong>
              </p>
            </div>
            <button
              onClick={() => setDistritoSel(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {sedesDelDistrito.map(({ sede, count }) => (
              <button
                key={sede}
                onClick={() => setSedeSel(sede)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 shadow-sm text-left flex items-center justify-between group active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sede}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {count} {count === 1 ? 'juzgado/sala' : 'juzgados/salas'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASO 3: SELECCIONAR JUZGADO                              */}
      {/* ======================================================== */}
      {distritoSel && sedeSel && !juzgadoSel && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-600" /> Paso 3: Elige el Juzgado
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">
                {distritoSel} • {sedeSel}
              </p>
            </div>
            <button
              onClick={() => setSedeSel(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver
            </button>
          </div>

          {/* Filtro rápido dentro de la sede */}
          <div className="relative">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busquedaJuzgado}
              onChange={(e) => setBusquedaJuzgado(e.target.value)}
              placeholder="Filtrar por nombre o NDEP..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="space-y-2.5">
            {juzgadosDeLaSede.map((item) => (
              <button
                key={item.id}
                onClick={() => setJuzgadoSel(item)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3 shadow-sm text-left flex items-center justify-between group active:scale-98 transition-all"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200">
                      NDEP {item.ndep}
                    </span>
                    {item.especialidad && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                        {item.especialidad}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                    {item.dependencia}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                    item.puntaje_final >= 80 ? 'bg-rose-100 text-rose-800' :
                    item.puntaje_final >= 60 ? 'bg-orange-100 text-orange-800' :
                    item.puntaje_final >= 40 ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.puntaje_final} pts
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    {item.nivel_riesgo}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PASO 4: FICHA DETALLADA DE VALORES E INDICADORES IROJ   */}
      {/* ======================================================== */}
      {juzgadoSel && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ficha de Indicadores IROJ
            </h2>
            <button
              onClick={() => setJuzgadoSel(null)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Elegir otro
            </button>
          </div>

          {/* Tarjeta Bento con todo el detalle de los 5 KPIs y evolución */}
          <TarjetaBentoDependencia 
            evaluacion={juzgadoSel}
            historialMeses={historialPorOrgano.get(juzgadoSel.ndep) || []}
          />

          {/* Botones de navegación adicional */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setJuzgadoSel(null)}
              className="flex-1 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-center"
            >
              Volver a juzgados de {sedeSel}
            </button>
            <button
              onClick={handleReset}
              className="py-2.5 px-4 text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl shadow-sm hover:bg-indigo-100 active:scale-95 transition-all"
            >
              Cambiar Distrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
