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
  // Conteo total real de órganos judiciales (por defecto 166)
  const totalTotalOrganos = useMemo(() => {
    const unicos = new Set(evaluacionesTotales.map(e => e.ndep));
    return unicos.size > 0 ? unicos.size : 166;
  }, [evaluacionesTotales]);

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

  // Conteo de órganos por distrito para la subventana del Paso 1
  const distritosConConteo = useMemo(() => {
    return distritos.map(d => {
      const unicos = new Set(evaluacionesTotales.filter(e => e.distrito === d).map(e => e.ndep));
      return {
        nombre: d,
        cantidad: unicos.size > 0 ? unicos.size : 18
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

  // Órgano seleccionado objeto
  const organoSeleccionadoObj = useMemo(() => {
    if (organoSel === null) return null;
    return evaluacionesTotales.find(e => e.ndep === organoSel);
  }, [evaluacionesTotales, organoSel]);

  const puedeConsultar = distritoSel !== '' && sedeSel !== '' && organoSel !== null;

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-start select-none">
      {/* 1. Header Superior Compacto (Granate y Plomo, pegado arriba) */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 safe-top">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Botón Izquierdo: Volver a Portada */}
          <button
            onClick={onSalir}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold text-slate-700 active:scale-95"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Inicio</span>
          </button>

          {/* Badge Central: ODANC LIMA ESTE */}
          <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#8B1E23] text-[11px] font-black">
            <Scale className="w-3.5 h-3.5 text-[#8B1E23]" />
            <span>ODANC LIMA ESTE</span>
          </div>

          {/* Botón Derecho: Salir */}
          <button
            onClick={onSalir}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-[11px] font-bold text-[#8B1E23] active:scale-95"
          >
            <LogOut className="w-3 h-3" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* 2. Contenido de los Filtros Guiados (Ubicado en la parte superior sin espacios vacíos) */}
      <main className="px-3.5 pt-1.5 pb-24 space-y-2 max-w-md mx-auto w-full">
        {/* Título de la Sección + Total Real de Órganos Disponibles */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Filtros Guiados
            </h1>
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#8B1E23] text-[11px] font-extrabold shadow-2xs">
              {totalTotalOrganos} Órganos disponibles
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Toque cada paso para abrir su selector interactivo en subventana:
          </p>
        </div>

        {/* Tarjetas de los 4 Pasos en Granate y Plomo */}
        <div className="space-y-2.5 pt-0.5">
          {/* ========================================================== */}
          {/* PASO 1: DISTRITO JUDICIAL                                  */}
          {/* ========================================================== */}
          <div
            onClick={() => {
              setBusquedaModal('');
              setModalPaso(1);
            }}
            className="bg-white border-2 border-[#8B1E23] rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-lg shrink-0">
                📍
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E23] block">
                  PASO 1: DISTRITO JUDICIAL
                </span>
                <span className="text-sm font-black text-slate-900 block truncate">
                  {distritoSel || '-- Seleccione Distrito --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5 text-[#8B1E23]" />
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
            className={`bg-white border-2 rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
              sedeSel ? 'border-[#8B1E23]' : 'border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                🏢
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                  PASO 2: SEDE JUDICIAL
                </span>
                <span className="text-sm font-black text-slate-900 block truncate">
                  {sedeSel || '-- Seleccione Sede --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5 text-[#8B1E23]" />
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
            className={`bg-white border-2 rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
              organoSel ? 'border-[#8B1E23]' : 'border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                ⚖
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                  PASO 3: ÓRGANO JURISDICCIONAL
                </span>
                <span className="text-sm font-black text-slate-900 block truncate">
                  {organoSeleccionadoObj ? organoSeleccionadoObj.dependencia : '-- Seleccione Órgano --'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5 text-[#8B1E23]" />
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
            className="bg-white border-2 border-[#8B1E23] rounded-2xl p-3.5 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-lg shrink-0">
                📅
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E23] block">
                  PASO 4: MES DE EVALUACIÓN ({anio})
                </span>
                <span className="text-sm font-black text-slate-900 block capitalize">
                  {mesSel.toLowerCase()}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-100 text-slate-700 text-xs font-extrabold shrink-0"
            >
              <Check className="w-3.5 h-3.5 text-[#8B1E23]" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>
      </main>

      {/* 3. Botón Fijo Inferior Granate: CONSULTAR INDICADORES */}
      <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200 z-20 safe-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              if (organoSel !== null) {
                onConsultar(organoSel, mesSel);
              }
            }}
            disabled={!puedeConsultar}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
              puedeConsultar
                ? 'bg-[#8B1E23] hover:bg-[#73191d] text-white shadow-red-900/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>CONSULTAR INDICADORES</span>
            <span className="text-base">📊</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. SUBVENTANA INTERACTIVA MODAL (Granate y Plomo)           */}
      {/* ========================================================== */}
      {modalPaso > 0 && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp">
            {/* Header del Modal */}
            <div className="px-5 pt-4 pb-3 border-b border-slate-200 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8B1E23] block">
                  PASO {modalPaso} DE 4
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">
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
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={busquedaModal}
                    onChange={(e) => setBusquedaModal(e.target.value)}
                    placeholder="Filtrar por nombre..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[#8B1E23]"
                  />
                </div>
              </div>
            )}

            {/* Lista de Opciones como Tarjetas */}
            <div className="p-4 space-y-2 overflow-y-auto flex-1 overscroll-contain">
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
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-2 border-[#8B1E23] bg-red-50/70 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📍</span>
                        <span className={`text-sm font-extrabold ${isSelected ? 'text-[#8B1E23] font-black' : 'text-slate-900'}`}>
                          {item.nombre}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#8B1E23] text-white' : 'bg-slate-100 text-slate-700'
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
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-2 border-[#8B1E23] bg-red-50/70 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">🏢</span>
                          <span className={`text-sm font-extrabold ${isSelected ? 'text-[#8B1E23] font-black' : 'text-slate-900'}`}>
                            {item.nombre}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#8B1E23] text-white' : 'bg-slate-100 text-slate-700'
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
                          setModalPaso(0); // Cerrar
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                          isSelected
                            ? 'border-2 border-[#8B1E23] bg-red-50/70 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <span className="text-base mt-0.5">⚖</span>
                          <div className="min-w-0">
                            <span className={`text-xs font-black block leading-snug ${isSelected ? 'text-[#8B1E23]' : 'text-slate-900'}`}>
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
                          isSelected ? 'bg-[#8B1E23] text-white' : 'bg-slate-100 text-slate-700'
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
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-2 border-[#8B1E23] bg-red-50/70 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📅</span>
                        <span className={`text-sm font-extrabold capitalize ${isSelected ? 'text-[#8B1E23] font-black' : 'text-slate-900'}`}>
                          {m.toLowerCase()} {anio}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#8B1E23]" />
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
