import React from 'react';
import { X, Calendar, Check } from 'lucide-react';

interface ModalMesSelectorProps {
  abierto: boolean;
  onClose: () => void;
  meses: string[];
  mesActivo: string;
  anio: number;
  onSelectMes: (mes: string) => void;
}

export const ModalMesSelector: React.FC<ModalMesSelectorProps> = ({
  abierto,
  onClose,
  meses,
  mesActivo,
  anio,
  onSelectMes
}) => {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl safe-bottom animate-slideUp"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Seleccionar Mes de Corte
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {meses.map((m) => {
            const isSelected = m.toUpperCase() === mesActivo.toUpperCase();

            return (
              <button
                key={m}
                onClick={() => {
                  onSelectMes(m);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <span className="capitalize">{m.toLowerCase()} {anio}</span>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Los datos se actualizan instantáneamente sin recargar la página.
        </p>
      </div>
    </div>
  );
};
