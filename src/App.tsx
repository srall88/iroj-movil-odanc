import React, { useState, useMemo, useEffect } from 'react';
import datasetRaw from './data/consultasData.json';
import { DatasetIROJ, EvaluacionItem, TabType } from './types';
import { HeaderMobile } from './components/HeaderMobile';
import { BuscadorFlotante } from './components/BuscadorFlotante';
import { SegmentedControls } from './components/SegmentedControls';
import { TarjetaBentoDependencia } from './components/TarjetaBentoDependencia';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardInicio } from './components/DashboardInicio';
import { RankingView } from './components/RankingView';
import { ResumenEjecutivoView } from './components/ResumenEjecutivoView';
import { ModalMesSelector } from './components/ModalMesSelector';
import { Building2, Frown } from 'lucide-react';

const dataset = datasetRaw as unknown as DatasetIROJ;

export default function App() {
  // Estado de navegación
  const [tabActiva, setTabActiva] = useState<TabType>('inicio');

  // Estado de meses y modal
  const mesesDisponibles = dataset.meses || ['AGOSTO'];
  const [mesActivo, setMesActivo] = useState<string>(
    mesesDisponibles.includes('AGOSTO') ? 'AGOSTO' : mesesDisponibles[mesesDisponibles.length - 1]
  );
  const [modalMesAbierto, setModalMesAbierto] = useState<boolean>(false);

  // Estados de filtros y búsqueda
  const [busqueda, setBusqueda] = useState<string>('');
  const [especialidadActiva, setEspecialidadActiva] = useState<string>('TODAS');
  const [nivelRiesgoActivo, setNivelRiesgoActivo] = useState<string>('TODOS');
  const [distritoActivo, setDistritoActivo] = useState<string>('TODOS');

  // Estado de conectividad offline/online
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Evaluaciones correspondientes al mes seleccionado
  const evaluacionesDelMes = useMemo(() => {
    return (dataset.evaluaciones || []).filter(
      (e) => e.mes.toUpperCase() === mesActivo.toUpperCase()
    );
  }, [mesActivo]);

  // Mapa histórico de todas las evaluaciones por NDEP para mostrar evolución en el Accordion
  const historialPorOrgano = useMemo(() => {
    const mapa = new Map<number, EvaluacionItem[]>();
    for (const ev of dataset.evaluaciones || []) {
      if (!mapa.has(ev.ndep)) {
        mapa.set(ev.ndep, []);
      }
      mapa.get(ev.ndep)!.push(ev);
    }
    return mapa;
  }, []);

  // Filtro reactivo en memoria (Zero-latency instant search)
  const evaluacionesFiltradas = useMemo(() => {
    let resultado = [...evaluacionesDelMes];

    // 1. Filtro por Especialidad
    if (especialidadActiva !== 'TODAS') {
      resultado = resultado.filter(
        (e) => e.especialidad?.toUpperCase() === especialidadActiva.toUpperCase()
      );
    }

    // 2. Filtro por Nivel de Riesgo
    if (nivelRiesgoActivo !== 'TODOS') {
      resultado = resultado.filter((e) => {
        const nivel = e.nivel_riesgo?.toUpperCase();
        if (nivelRiesgoActivo === 'CRITICO') return nivel === 'CRITICO' || nivel === 'MUY ALTO';
        return nivel === nivelRiesgoActivo;
      });
    }

    // 3. Filtro por Distrito
    if (distritoActivo !== 'TODOS') {
      resultado = resultado.filter(
        (e) => e.distrito?.toUpperCase() === distritoActivo.toUpperCase()
      );
    }

    // 4. Búsqueda de texto libre (Nombre, NDEP, Sede, Distrito)
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      resultado = resultado.filter((e) => {
        return (
          e.dependencia.toLowerCase().includes(q) ||
          e.ndep.toString().includes(q) ||
          (e.sede && e.sede.toLowerCase().includes(q)) ||
          (e.distrito && e.distrito.toLowerCase().includes(q)) ||
          (e.especialidad && e.especialidad.toLowerCase().includes(q))
        );
      });
    }

    return resultado;
  }, [evaluacionesDelMes, especialidadActiva, nivelRiesgoActivo, distritoActivo, busqueda]);

  // Sugerencias predictivas basadas en las palabras del catálogo
  const sugerenciasPredictivas = useMemo(() => {
    if (!busqueda || busqueda.length < 2) return [];
    const q = busqueda.toLowerCase();
    const matches = new Set<string>();

    for (const e of evaluacionesDelMes) {
      if (e.distrito && e.distrito.toLowerCase().includes(q)) matches.add(e.distrito);
      if (e.sede && e.sede.toLowerCase().includes(q)) matches.add(e.sede);
      if (e.especialidad && e.especialidad.toLowerCase().includes(q)) matches.add(e.especialidad);
    }

    return Array.from(matches).slice(0, 4);
  }, [busqueda, evaluacionesDelMes]);

  // Resumen del mes actual
  const resumenMesActual = dataset.resumen_por_mes?.[mesActivo] || {
    total_evaluados: evaluacionesDelMes.length,
    promedio_puntaje: 0,
    distribucion_niveles: { CRITICO: 0, ALTO: 0, MEDIO: 0, BAJO: 0 },
    top_riesgo: [],
    top_optimo: []
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Header Mobile Premium */}
      <HeaderMobile
        mesActivo={mesActivo}
        anio={dataset.anio_predeterminado || 2026}
        totalEvaluados={evaluacionesDelMes.length}
        onOpenMesSelector={() => setModalMesAbierto(true)}
        isOnline={isOnline}
      />

      {/* Contenido Principal según Pestaña Activa */}
      <main className="flex-1 max-w-md w-full mx-auto">
        {/* PESTAÑA 1: INICIO (Dashboard Ejecutivo) */}
        {tabActiva === 'inicio' && (
          <DashboardInicio
            resumen={resumenMesActual}
            mesActivo={mesActivo}
            anio={dataset.anio_predeterminado || 2026}
            onNavigateTab={setTabActiva}
            onSelectOrgano={(ndep) => {
              setBusqueda(ndep.toString());
              setTabActiva('dependencias');
            }}
          />
        )}

        {/* PESTAÑA 2: DEPENDENCIAS (Buscador y Tarjetas Bento) */}
        {tabActiva === 'dependencias' && (
          <div className="space-y-1">
            {/* Buscador Flotante con Autocomplete */}
            <BuscadorFlotante
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              totalResultados={evaluacionesFiltradas.length}
              totalTotal={evaluacionesDelMes.length}
              sugerencias={sugerenciasPredictivas}
              onSelectSugerencia={(sug) => setBusqueda(sug)}
            />

            {/* Segmented Controls táctiles */}
            <SegmentedControls
              especialidades={dataset.especialidades || []}
              especialidadActiva={especialidadActiva}
              setEspecialidadActiva={setEspecialidadActiva}
              nivelRiesgoActivo={nivelRiesgoActivo}
              setNivelRiesgoActivo={setNivelRiesgoActivo}
              distritos={dataset.distritos || []}
              distritoActivo={distritoActivo}
              setDistritoActivo={setDistritoActivo}
            />

            {/* Lista de Tarjetas Bento */}
            <div className="px-4 py-3 space-y-3">
              {evaluacionesFiltradas.length > 0 ? (
                evaluacionesFiltradas.map((ev) => (
                  <TarjetaBentoDependencia
                    key={ev.id}
                    evaluacion={ev}
                    historialMeses={historialPorOrgano.get(ev.ndep) || []}
                  />
                ))
              ) : (
                <div className="text-center py-12 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/60 my-4">
                  <Frown className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">No se encontraron juzgados</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Intenta cambiar los términos de búsqueda o selecciona "Todas las áreas".
                  </p>
                  <button
                    onClick={() => {
                      setBusqueda('');
                      setEspecialidadActiva('TODAS');
                      setNivelRiesgoActivo('TODOS');
                      setDistritoActivo('TODOS');
                    }}
                    className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-xl active:scale-95 transition-all"
                  >
                    Restablecer filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: RANKING */}
        {tabActiva === 'ranking' && (
          <RankingView
            topRiesgo={resumenMesActual.top_riesgo || []}
            topOptimo={resumenMesActual.top_optimo || []}
            mesActivo={mesActivo}
            anio={dataset.anio_predeterminado || 2026}
          />
        )}

        {/* PESTAÑA 4: RESUMEN EJECUTIVO */}
        {tabActiva === 'resumen' && (
          <ResumenEjecutivoView
            evaluaciones={evaluacionesDelMes}
            mesActivo={mesActivo}
            anio={dataset.anio_predeterminado || 2026}
          />
        )}
      </main>

      {/* Bottom Navigation Bar fija estilo Apple / iOS */}
      <BottomNavBar tabActiva={tabActiva} setTabActiva={setTabActiva} />

      {/* Modal / Bottom Sheet para cambiar mes */}
      <ModalMesSelector
        abierto={modalMesAbierto}
        onClose={() => setModalMesAbierto(false)}
        meses={mesesDisponibles}
        mesActivo={mesActivo}
        anio={dataset.anio_predeterminado || 2026}
        onSelectMes={(m) => setMesActivo(m)}
      />
    </div>
  );
}
