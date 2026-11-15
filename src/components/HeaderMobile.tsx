import React from 'react';
import { LogOut, ArrowLeft, ShieldCheck } from 'lucide-react';

interface HeaderMobileProps {
  onSalir: () => void;
  tituloAccion?: string;
  onVolver?: () => void;
  mostrarVolver?: boolean;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({
  onSalir,
  tituloAccion = 'Salir',
  onVolver,
  mostrarVolver = false
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 pt-3 pb-3 safe-top shadow-xs transition-all">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Identidad Institucional Superior: ODANC LIMA ESTE */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
            <img 
              src="/imagenes/logo-iroj.jpg" 
              alt="Logo IROJ" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/Logo IROJ.jpg";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black text-slate-900 tracking-tight truncate">
                ODANC LIMA ESTE
              </h1>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 truncate leading-tight">
              Oficina Descentralizada de la Autoridad Nacional de Control
            </p>
          </div>
        </div>

        {/* Botón Salir o Regresar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {mostrarVolver && onVolver ? (
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 active:scale-95 transition-all touch-target"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          ) : (
            <button
              onClick={onSalir}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 active:scale-95 transition-all touch-target"
              title="Salir a la portada"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{tituloAccion}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
