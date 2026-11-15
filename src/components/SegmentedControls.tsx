import React from 'react';

interface SegmentedControlsProps {
  especialidades: string[];
  especialidadActiva: string;
  setEspecialidadActiva: (esp: string) => void;
  nivelRiesgoActivo: string;
  setNivelRiesgoActivo: (nivel: string) => void;
  distritos: string[];
  distritoActivo: string;
  setDistritoActivo: (dist: string) => void;
}

export const SegmentedControls: React.FC<SegmentedControlsProps> = ({
  especialidades,
  especialidadActiva,
  setEspecialidadActiva,
  nivelRiesgoActivo,
  setNivelRiesgoActivo,
  distritos,
  distritoActivo,
  setDistritoActivo
}) => {
  const niveles = [
    { id: 'TODOS', label: 'Todos' },
    { id: 'CRITICO', label: '🔴 Crítico (>80)' },
    { id: 'ALTO', label: '🟠 Alto (60-79)' },
    { id: 'MEDIO', label: '🟡 Medio (40-59)' },
    { id: 'BAJO', label: '🟢 Bajo (<40)' }
  ];

  return (
    <div className="px-4 py-2 space-y-2 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs">
      {/* 1. Carrusel de Especialidades */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setEspecialidadActiva('TODAS')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap active:scale-95 transition-all shrink-0 ${
            especialidadActiva === 'TODAS'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Todas las áreas
        </button>

        {especialidades.map((esp) => (
          <button
            key={esp}
            onClick={() => setEspecialidadActiva(esp)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap active:scale-95 transition-all shrink-0 ${
              especialidadActiva === esp
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {esp}
          </button>
        ))}
      </div>

      {/* 2. Filtro rápido por Semáforo de Riesgo y Distrito */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {niveles.map((n) => (
          <button
            key={n.id}
            onClick={() => setNivelRiesgoActivo(n.id)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap active:scale-95 transition-all shrink-0 ${
              nivelRiesgoActivo === n.id
                ? 'bg-indigo-50 text-indigo-800 border border-indigo-300 ring-1 ring-indigo-500/20'
                : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
            }`}
          >
            {n.label}
          </button>
        ))}

        {distritos.length > 0 && (
          <select
            value={distritoActivo}
            onChange={(e) => setDistritoActivo(e.target.value)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-slate-700 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shrink-0"
          >
            <option value="TODOS">📍 Todos los Distritos</option>
            {distritos.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
