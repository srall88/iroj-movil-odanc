import React, { useState, useMemo } from 'react';
import datasetRaw from './data/consultasData.json';
import { DatasetIROJ, EvaluacionItem, PantallaType } from './types';
import { PortadaLanding } from './components/PortadaLanding';
import { FiltrosGuiadosView } from './components/FiltrosGuiadosView';
import { FichaIndicadoresView } from './components/FichaIndicadoresView';

const dataset = datasetRaw as unknown as DatasetIROJ;

export default function App() {
  // Estado de navegación: 'portada' | 'filtros' | 'ficha'
  const [pantalla, setPantalla] = useState<PantallaType>('portada');

  // Meses disponibles (ordenados y con OCTUBRE como predeterminado)
  const mesesDisponibles = dataset.meses || ['OCTUBRE', 'AGOSTO', 'MAYO', 'MARZO'];
  
  // Selección actual
  const [ndepSeleccionado, setNdepSeleccionado] = useState<number | null>(7028);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(
    mesesDisponibles.includes('OCTUBRE') ? 'OCTUBRE' : mesesDisponibles[0]
  );

  // Mapa de evaluaciones por NDEP para acceso y evolución histórica
  const evaluacionesPorOrgano = useMemo(() => {
    const mapa = new Map<number, EvaluacionItem[]>();
    for (const ev of dataset.evaluaciones || []) {
      if (!mapa.has(ev.ndep)) {
        mapa.set(ev.ndep, []);
      }
      mapa.get(ev.ndep)!.push(ev);
    }
    return mapa;
  }, []);

  // Evaluación activa que se está visualizando
  const evaluacionActual = useMemo(() => {
    if (ndepSeleccionado === null) return null;
    const lista = evaluacionesPorOrgano.get(ndepSeleccionado) || [];
    
    // Buscar la del mes seleccionado
    const evMes = lista.find(e => e.mes.toUpperCase() === mesSeleccionado.toUpperCase());
    if (evMes) return evMes;

    // Si ese mes específico no tiene registro para ese órgano, tomar el último disponible
    return lista[0] || null;
  }, [ndepSeleccionado, mesSeleccionado, evaluacionesPorOrgano]);

  // Historial de meses del órgano seleccionado
  const historialOrgano = useMemo(() => {
    if (ndepSeleccionado === null) return [];
    return evaluacionesPorOrgano.get(ndepSeleccionado) || [];
  }, [ndepSeleccionado, evaluacionesPorOrgano]);

  // Manejador al consultar desde los filtros guiados
  const handleConsultar = (ndep: number, mes: string) => {
    setNdepSeleccionado(ndep);
    setMesSeleccionado(mes);
    setPantalla('ficha');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* Background Snippet (ibelick - Grid + Aura glow) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10"></div>

      {/* ============================================================ */}
      {/* 1. PANTALLA: PORTADA DE ENTRADA (Réplica Imagen 4)           */}
      {/* ============================================================ */}
      {pantalla === 'portada' && (
        <PortadaLanding
          totalDependencias={dataset.total_organos || 166}
          totalDistritos={(dataset.distritos || []).length || 8}
          mesActivo="OCTUBRE"
          anio={dataset.anio_predeterminado || 2026}
          onIngresar={() => {
            setPantalla('filtros');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* ============================================================ */}
      {/* 2. PANTALLA: FILTROS GUIADOS (Réplica Imagen 3 y 2)          */}
      {/* ============================================================ */}
      {pantalla === 'filtros' && (
        <main className="flex-1">
          <FiltrosGuiadosView
            evaluacionesTotales={dataset.evaluaciones || []}
            distritos={dataset.distritos || []}
            meses={mesesDisponibles}
            anio={dataset.anio_predeterminado || 2026}
            onConsultar={handleConsultar}
            onSalir={() => {
              setPantalla('portada');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* ============================================================ */}
      {/* 3. PANTALLA: FICHA DE INDICADORES IROJ (Réplica Imagen 1)    */}
      {/* ============================================================ */}
      {pantalla === 'ficha' && evaluacionActual && (
        <main className="flex-1">
          <FichaIndicadoresView
            evaluacionActual={evaluacionActual}
            mesesDisponibles={mesesDisponibles}
            mesActivo={mesSeleccionado}
            anio={dataset.anio_predeterminado || 2026}
            onCambiarMes={(m) => setMesSeleccionado(m)}
            onVolverFiltros={() => {
              setPantalla('filtros');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            historialMeses={historialOrgano}
          />
        </main>
      )}
    </div>
  );
}
