import React, { useState, useMemo } from 'react';
import { BarChart3, Building2, MapPin, Scale } from 'lucide-react';
import { EvaluacionItem } from '../types';

interface ResumenEjecutivoProps {
  evaluaciones: EvaluacionItem[];
  mesActivo: string;
  anio: number;
}

export const ResumenEjecutivoView: React.FC<ResumenEjecutivoProps> = ({
  evaluaciones,
  mesActivo,
  anio
}) => {
  const [agrupacion, setAgrupacion] = useState<'distrito' | 'especialidad'>('distrito');

  // Calcular métricas agrupadas
  const grupos = useMemo(() => {
    const map = new Map<string, {
      nombre: string;
      total: number;
      sumaPuntajes: number;
      critico: number;
      alto: number;
      medio: number;
      bajo: number;
    }>();

    for (const ev of evaluaciones) {
      const clave = agrupacion === 'distrito' 
        ? (ev.distrito || 'Sin Distrito') 
        : (ev.especialidad || 'Sin Especialidad');

      if (!map.has(clave)) {
        map.set(clave, {
          nombre: clave,
          total: 0,
          sumaPuntajes: 0,
          critico: 0,
          alto: 0,
          medio: 0,
          bajo: 0
        });
      }

      const g = map.get(clave)!;
      g.total += 1;
      g.sumaPuntajes += (ev.puntaje_final || 0);

      const nivel = ev.nivel_riesgo?.toUpperCase();
      if (nivel === 'CRITICO' || nivel === 'MUY ALTO') g.critico += 1;
      else if (nivel === 'ALTO') g.alto += 1;
      else if (nivel === 'MEDIO') g.medio += 1;
      else g.bajo += 1;
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [evaluaciones, agrupacion]);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Cabecera */}
      <div>
        <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-indigo-400" /> Resumen Ejecutivo Consolidado
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribución y promedios oficiales de {mesActivo.toLowerCase()} {anio}.
        </p>
      </div>

      {/* Switch Agrupación: Por Distrito vs Por Especialidad */}
      <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex gap-1">
        <button
          onClick={() => setAgrupacion('distrito')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            agrupacion === 'distrito'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Por Distrito ({grupos.length})
        </button>

        <button
          onClick={() => setAgrupacion('especialidad')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            agrupacion === 'especialidad'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Por Especialidad ({grupos.length})
        </button>
      </div>

      {/* Tarjetas Bento de cada grupo */}
      <div className="space-y-3">
        {grupos.map((g) => {
          const prom = (g.sumaPuntajes / g.total).toFixed(1);
          const pCrit = ((g.critico / g.total) * 100).toFixed(0);
          const pAlt = ((g.alto / g.total) * 100).toFixed(0);
          const pMed = ((g.medio / g.total) * 100).toFixed(0);
          const pBaj = ((g.bajo / g.total) * 100).toFixed(0);

          return (
            <div key={g.nombre} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{g.nombre}</h3>
                  <span className="text-xs text-slate-400">{g.total} dependencias evaluadas</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{prom}</span>
                  <span className="text-[10px] text-slate-400 block">promedio</span>
                </div>
              </div>

              {/* Barra de distribución porcentual */}
              <div className="mt-3">
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  {g.critico > 0 && (
                    <div style={{ width: `${pCrit}%` }} className="bg-rose-500 h-full" title={`Crítico: ${g.critico}`} />
                  )}
                  {g.alto > 0 && (
                    <div style={{ width: `${pAlt}%` }} className="bg-orange-500 h-full" title={`Alto: ${g.alto}`} />
                  )}
                  {g.medio > 0 && (
                    <div style={{ width: `${pMed}%` }} className="bg-amber-500 h-full" title={`Medio: ${g.medio}`} />
                  )}
                  {g.bajo > 0 && (
                    <div style={{ width: `${pBaj}%` }} className="bg-emerald-500 h-full" title={`Óptimo: ${g.bajo}`} />
                  )}
                </div>

                {/* Leyenda micro de conteo */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Crítico: <strong className="text-slate-200">{g.critico}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Alto: <strong className="text-slate-200">{g.alto}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Medio: <strong className="text-slate-200">{g.medio}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Óptimo: <strong className="text-slate-200">{g.bajo}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
