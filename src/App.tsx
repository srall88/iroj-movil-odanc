import React, { useState, useMemo } from 'react';
import datasetRaw from './data/consultasData.json';
import { DatasetIROJ, EvaluacionItem, PantallaType } from './types';
import { PortadaLanding } from './components/PortadaLanding';
import { FiltrosGuiadosView } from './components/FiltrosGuiadosView';
import { FichaIndicadoresView } from './components/FichaIndicadoresView';
import { LogoAnimadoIntroModal } from './components/LogoAnimadoIntroModal';
import { PullToRefresh } from './components/PullToRefresh';

export default function App() {
  // Datos reactivos que pueden actualizarse al jalar hacia abajo
  const [dataset, setDataset] = useState<DatasetIROJ>(datasetRaw as unknown as DatasetIROJ);

  // Estado de navegación: 'portada' | 'filtros' | 'ficha'
  const [pantalla, setPantalla] = useState<PantallaType>('portada');

  // Estado para mostrar el Logo Animado en pantalla completa con barra de carga
  const [mostrarIntro, setMostrarIntro] = useState<boolean>(false);

  // Meses disponibles
  const mesesDisponibles = dataset.meses || ['OCTUBRE', 'AGOSTO', 'MAYO', 'MARZO'];
  
  // Selección actual
  const [ndepSeleccionado, setNdepSeleccionado] = useState<number | null>(7028);
  const [mesSeleccionado, setMesSeleccionado] = useState<string>(
    mesesDisponibles.includes('OCTUBRE') ? 'OCTUBRE' : mesesDisponibles[0]
  );

  // Mapa de evaluaciones por NDEP para acceso y evolución
  const evaluacionesPorOrgano = useMemo(() => {
    const mapa = new Map<number, EvaluacionItem[]>();
    for (const ev of dataset.evaluaciones || []) {
      if (!mapa.has(ev.ndep)) {
        mapa.set(ev.ndep, []);
      }
      mapa.get(ev.ndep)!.push(ev);
    }
    return mapa;
  }, [dataset]);

  // Evaluación activa
  const evaluacionActual = useMemo(() => {
    if (ndepSeleccionado === null) return null;
    const lista = evaluacionesPorOrgano.get(ndepSeleccionado) || [];
    
    // Buscar la del mes seleccionado
    const evMes = lista.find(e => e.mes.toUpperCase() === mesSeleccionado.toUpperCase());
    if (evMes) return evMes;

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

  // Función para jalar hacia abajo y actualizar datos y diseño en vivo desde Vercel
  const handlePullRefresh = async () => {
    try {
      // 1. Limpiar Service Worker y caché para que el navegador descargue la versión más reciente
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(k => caches.delete(k)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }

      // 2. Descargar el dataset oficial actualizado desde Vercel
      const cacheBust = Date.now();
      let res = await fetch(`/consultasData.json?t=${cacheBust}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`/data/consultasData.json?t=${cacheBust}`, { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        setDataset(data);
      }

      // 3. Si está corriendo en web / Vercel (http o https), recargar para aplicar nuevos cambios de interfaz
      if (window.location.protocol.startsWith('http')) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch {
      // Si ocurre cualquier error, forzar recarga limpia si estamos conectados
      if (window.location.protocol.startsWith('http')) {
        window.location.reload();
      }
    }
  };

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
      <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-800 selection:text-white overflow-x-hidden">
        {/* Background Pattern Discreto */}
        <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10"></div>

        {/* Intro con Logo Animado IROJ en Pantalla Completa y Barra de Carga */}
        {mostrarIntro && (
          <LogoAnimadoIntroModal
            onComplete={() => {
              setMostrarIntro(false);
              setPantalla('filtros');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

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
              // Activar intro con Logo Animado IROJ a pantalla completa y barra de carga
              setMostrarIntro(true);
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
    </PullToRefresh>
  );
}
