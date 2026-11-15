import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Scale, 
  Calendar, 
  Search, 
  ArrowRight, 
  Check, 
  X, 
  ArrowLeft,
  LogOut,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { EvaluacionItem } from '../types';

interface FiltrosGuiadosProps {
  evaluacionesTotales: EvaluacionItem[];
  distritos: string[];
  meses: string[];
  anio: number;
  onConsultar: (ndep: number, mes: string) => void;
  onSalir: () => void;
}

export const FiltrosGuiadosView: React.FC<FiltrosGuiadosProps> = ({
  evaluacionesTotales,
  distritos,
  meses,
  anio,
  onConsultar,
  onSalir
}) => {
  // Estados de los 4 pasos
  const [distritoSel, setDistritoSel] = useState<string>('Ate');
  const [sedeSel, setSedeSel] = useState<string>('La merced');
  const [organoSel, setOrganoSel] = useState<number | null>(7028);
  
  // Mes por defecto Octubre si existe
  const [mesSel, setMesSel] = useState<string>(
    meses.includes('OCTUBRE') ? 'OCTUBRE' : meses[meses.length - 1] || 'OCTUBRE'
  );

  // Subventana interactiva abierta: 0 = ninguna, 1 = Distrito, 2 = Sede, 3 = Órgano, 4 = Mes
  const [modalPaso, setModalPaso] = useState<number>(0);
  const [busquedaModal, setBusquedaModal] = useState<string>('');

  // 1. Sedes disponibles para el distrito seleccionado
  const sedesDisponibles = useMemo(() => {
    if (!distritoSel) return [];
    const evals = evaluacionesTotales.filter(e => e.distrito === distritoSel);
    const sMap = new Map<string, number>();
    for (const e of evals) {
      const s = e.sede || 'Sede Principal';
      sMap.set(s, (sMap.get(s) || 0) + 1);
    }
    return Array.from(sMap.entries()).map(([nombre, cantidad]) => ({
      nombre,
      cantidad: Math.round(cantidad / Math.max(1, meses.length))
    })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [evaluacionesTotales, distritoSel, meses.length]);

  // Conteo de órganos por distrito para la subventana del Paso 1 (Réplica Imagen 2)
  const distritosConConteo = useMemo(() => {
    return distritos.map(d => {
      const unicos = new Set(evaluacionesTotales.filter(e => e.distrito === d).map(e => e.ndep));
      return {
        nombre: d,
        cantidad: unicos.size
      };
    });
  }, [distritos, evaluacionesTotales]);

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

    return Array.from(organosMap.values()).sort((a, b) => a.ndep - b.ndep);
  }, [evaluacionesTotales, distritoSel, sedeSel]);

  // Si no se encuentra seleccionado por defecto, tomar el primero
  React.useEffect(() => {
    if (distritoSel && sedesDisponibles.length > 0 && !sedeSel) {
      setSedeSel(sedesDisponibles[0].nombre);
    }
  }, [distritoSel, sedesDisponibles, sedeSel]);

  React.useEffect(() => {
    if (sedeSel && organosDisponibles.length > 0 && organoSel === null) {
      setOrganoSel(organosDisponibles[0].ndep);
    }
  }, [sedeSel, organosDisponibles, organoSel]);

  // Total de órganos disponibles según filtro
  const totalOrganosDisponibles = useMemo(() => {
    if (sedeSel) return organosDisponibles.length;
    if (distritoSel) {
      return new Set(evaluacionesTotales.filter(e => e.distrito === distritoSel).map(e => e.ndep)).size;
    }
    return new Set(evaluacionesTotales.map(e => e.ndep)).size;
  }, [evaluacionesTotales, distritoSel, sedeSel, organosDisponibles]);

  // Órgano seleccionado objeto
  const organoSeleccionadoObj = useMemo(() => {
    if (organoSel === null) return null;
    return evaluacionesTotales.find(e => e.ndep === organoSel);
  }, [evaluacionesTotales, organoSel]);

  const handleReset = () => {
    setDistritoSel('');
    setSedeSel('');
    setOrganoSel(null);
  };

  const puedeConsultar = distritoSel !== '' && sedeSel !== '' && organoSel !== null;

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      {/* 1. Header Superior (Réplica Imagen 3) */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 safe-top">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Botón Izquierdo: Volver a Portada */}
          <button
            onClick={onSalir}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </button>

          {/* Badge Central: ODANC LIMA ESTE */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[11px] font-bold">
            <Scale className="w-3.5 h-3.5 text-sky-700" />
            <span>ODANC (Lima Este)</span>
          </div>

          {/* Botón Derecho: Salir */}
          <button
            onClick={onSalir}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-red-600 hover:bg-red-100 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* 2. Contenido de los Filtros Guiados (Réplica Imagen 3) */}
      <main className="px-4 pt-4 pb-28 space-y-4 max-w-md mx-auto w-full">
        {/* Título de la Sección + Badge de Órganos Disponibles */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Filtros Guiados
            </h1>
            <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-extrabold shadow-2xs">
              {totalOrganosDisponibles} Órganos disponibles
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Toque cada paso para abrir su selector interactivo en subventana:
          </p>
        </div>

        {/* Tarjetas de los 4 Pasos (Réplica exacta Imagen 3) */}
        <div className="space-y-3 pt-1">
          {/* ========================================================== */}
          {/* PASO 1: DISTRITO JUDICIAL                                  */}
          {/* ========================================================== */}
          <div
            onClick={() => {
              setBusquedaModal('');
              setModalPaso(1);
            }}
            className="bg-white border-2 border-sky-500/80 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-red-500 text-lg shrink-0">
                📍
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 block">
                  PASO 1: DISTRITO JUDICIAL
                </span>
                <span className="text-base font-black text-slate-900 block truncate">
                  {distritoSel || '-- Seleccione Distrito --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/80 bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* ========================================================== */}
          {/* PASO 2: SEDE JUDICIAL                                      */}
          {/* ========================================================== */}
          <div
            onClick={() => {
              if (distritoSel) {
                setBusquedaModal('');
                setModalPaso(2);
              }
            }}
            className={`bg-white border-2 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
              distritoSel ? 'border-sky-500/80' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-lg shrink-0">
                🏢
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 block">
                  PASO 2: SEDE JUDICIAL
                </span>
                <span className="text-base font-black text-slate-900 block truncate">
                  {sedeSel || '-- Seleccione Sede --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/80 bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* ========================================================== */}
          {/* PASO 3: ÓRGANO JURISDICCIONAL                              */}
          {/* ========================================================== */}
          <div
            onClick={() => {
              if (sedeSel) {
                setBusquedaModal('');
                setModalPaso(3);
              }
            }}
            className={`bg-white border-2 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
              sedeSel ? 'border-purple-500/80' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg shrink-0">
                ⚖
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 block">
                  PASO 3: ÓRGANO JURISDICCIONAL
                </span>
                <span className="text-sm font-black text-slate-900 block truncate">
                  {organoSeleccionadoObj ? organoSeleccionadoObj.dependencia : '-- Seleccione Órgano --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/80 bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>

          {/* ========================================================== */}
          {/* PASO 4: MES DE EVALUACIÓN (2026)                           */}
          {/* ========================================================== */}
          <div
            onClick={() => {
              setBusquedaModal('');
              setModalPaso(4);
            }}
            className="bg-white border-2 border-purple-500/80 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg shrink-0">
                📅
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 block">
                  PASO 4: MES DE EVALUACIÓN ({anio})
                </span>
                <span className="text-base font-black text-slate-900 block capitalize">
                  {mesSel.toLowerCase()}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/80 bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>
      </main>

      {/* 3. Botón Fijo Inferior: CONSULTAR INDICADORES (Réplica Imagen 3) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-20 safe-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              if (organoSel !== null) {
                onConsultar(organoSel, mesSel);
              }
            }}
            disabled={!puedeConsultar}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
              puedeConsultar
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>CONSULTAR INDICADORES</span>
            <span className="text-lg">📊</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. SUBVENTANA INTERACTIVA MODAL / BOTTOM SHEET (Imagen 2) */}
      {/* ========================================================== */}
      {modalPaso > 0 && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp">
            {/* Header del Modal (Réplica Imagen 2) */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 block">
                  PASO {modalPaso} DE 4
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {modalPaso === 1 && 'Seleccione Distrito Judicial'}
                  {modalPaso === 2 && 'Seleccione Sede Judicial'}
                  {modalPaso === 3 && 'Seleccione Órgano Jurisdiccional'}
                  {modalPaso === 4 && `Seleccione Mes de Evaluación (${anio})`}
                </h3>
              </div>

              <button
                onClick={() => setModalPaso(0)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Buscador interno si hay más de 4 opciones */}
            {(modalPaso === 3 || (modalPaso === 2 && sedesDisponibles.length > 4)) && (
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={busquedaModal}
                    onChange={(e) => setBusquedaModal(e.target.value)}
                    placeholder="Filtrar por nombre o código..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Lista de Opciones como Tarjetas (Réplica Imagen 2) */}
            <div className="p-4 space-y-2.5 overflow-y-auto flex-1 overscroll-contain">
              {/* PASO 1: DISTRITOS */}
              {modalPaso === 1 && (
                distritosConConteo.map((item) => {
                  const isSelected = item.nombre === distritoSel;
                  return (
                    <div
                      key={item.nombre}
                      onClick={() => {
                        setDistritoSel(item.nombre);
                        setSedeSel('');
                        setOrganoSel(null);
                        setModalPaso(2); // Auto-avanzar al paso 2
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-2 border-sky-600 bg-sky-50/80 shadow-xs'
                          : 'border-slate-200/90 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📍</span>
                        <span className={`text-sm font-extrabold ${isSelected ? 'text-sky-950 font-black' : 'text-slate-900'}`}>
                          {item.nombre}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'
                      }`}>
                        {item.cantidad} órganos
                      </span>
                    </div>
                  );
                })
              )}

              {/* PASO 2: SEDES */}
              {modalPaso === 2 && (
                sedesDisponibles
                  .filter(s => s.nombre.toLowerCase().includes(busquedaModal.toLowerCase()))
                  .map((item) => {
                    const isSelected = item.nombre === sedeSel;
                    return (
                      <div
                        key={item.nombre}
                        onClick={() => {
                          setSedeSel(item.nombre);
                          setOrganoSel(null);
                          setModalPaso(3); // Auto-avanzar al paso 3
                        }}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-2 border-sky-600 bg-sky-50/80 shadow-xs'
                            : 'border-slate-200/90 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">🏢</span>
                          <span className={`text-sm font-extrabold ${isSelected ? 'text-sky-950 font-black' : 'text-slate-900'}`}>
                            {item.nombre}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isSelected ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700'
                        }`}>
                          {item.cantidad} órganos
                        </span>
                      </div>
                    );
                  })
              )}

              {/* PASO 3: ÓRGANOS */}
              {modalPaso === 3 && (
                organosDisponibles
                  .filter(o => 
                    o.dependencia.toLowerCase().includes(busquedaModal.toLowerCase()) ||
                    o.ndep.toString().includes(busquedaModal)
                  )
                  .map((item) => {
                    const isSelected = item.ndep === organoSel;
                    return (
                      <div
                        key={item.ndep}
                        onClick={() => {
                          setOrganoSel(item.ndep);
                          setModalPaso(0); // Cerrar y listo para consultar
                        }}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-2 border-purple-600 bg-purple-50/80 shadow-xs'
                            : 'border-slate-200/90 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <span className="text-base mt-0.5">⚖</span>
                          <div className="min-w-0">
                            <span className={`text-xs font-black block leading-snug ${isSelected ? 'text-purple-950' : 'text-slate-900'}`}>
                              {item.dependencia}
                            </span>
                            {item.especialidad && (
                              <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                                {item.especialidad}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Cód: {item.ndep}
                        </span>
                      </div>
                    );
                  })
              )}

              {/* PASO 4: MESES */}
              {modalPaso === 4 && (
                meses.map((m) => {
                  const isSelected = m.toUpperCase() === mesSel.toUpperCase();
                  return (
                    <div
                      key={m}
                      onClick={() => {
                        setMesSel(m);
                        setModalPaso(0);
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-2 border-purple-600 bg-purple-50/80 shadow-xs'
                          : 'border-slate-200/90 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📅</span>
                        <span className={`text-sm font-extrabold capitalize ${isSelected ? 'text-purple-950 font-black' : 'text-slate-900'}`}>
                          {m.toLowerCase()} {anio}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
