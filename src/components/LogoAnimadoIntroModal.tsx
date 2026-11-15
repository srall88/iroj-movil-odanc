import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface LogoAnimadoIntroModalProps {
  onComplete: () => void;
}

export const LogoAnimadoIntroModal: React.FC<LogoAnimadoIntroModalProps> = ({ onComplete }) => {
  const [progreso, setProgreso] = useState<number>(0);

  useEffect(() => {
    const duracionMs = 2800; // 2.8 segundos de barra de carga
    const intervaloMs = 30;
    const incremento = 100 / (duracionMs / intervaloMs);

    const timer = setInterval(() => {
      setProgreso((prev) => {
        const siguiente = prev + incremento;
        if (siguiente >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 200);
          return 100;
        }
        return siguiente;
      });
    }, intervaloMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-slate-950 to-[#1e0708] flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* 1. Header Flotante Superior */}
      <header className="relative z-20 px-4 pt-4 safe-top flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-lg">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ODANC LIMA ESTE · IROJ</span>
        </div>

        {/* Botón Omitir para entrar de inmediato si el usuario lo desea */}
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black tracking-wide active:scale-95 transition-all cursor-pointer shadow-lg"
        >
          <span>Omitir</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 2. Centro: Logo Animado IROJ en Toda la Pantalla */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 my-auto">
        <div className="relative w-full max-w-sm flex flex-col items-center justify-center">
          {/* Resplandor de aura detrás del logo animado */}
          <div className="absolute inset-0 bg-[#8B1E23]/30 blur-3xl rounded-full scale-125 -z-10 animate-pulse pointer-events-none" />

          {/* Imagen Gif del Logo Animado IROJ */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center p-2">
            <img
              src="/Logo animado IROJ.gif"
              alt="Logo Animado IROJ"
              className="w-full h-full object-contain drop-shadow-[0_12px_40px_rgba(139,30,35,0.6)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Logo.png';
              }}
            />
          </div>

          {/* Subtítulo institucional centrado */}
          <div className="text-center space-y-1 mt-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase drop-shadow-md">
              SISTEMA IROJ
            </h2>
            <p className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
              Corte Superior de Justicia de Lima Este
            </p>
          </div>
        </div>
      </main>

      {/* 3. Barra de Progreso Inferior Sincronizada */}
      <footer className="relative z-20 px-6 pb-6 safe-bottom space-y-2.5 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between text-[11px] font-bold text-white">
          <span className="flex items-center gap-2 text-amber-300 drop-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Cargando indicadores y filtros...</span>
          </span>
          <span className="tabular-nums font-mono text-xs text-amber-200 drop-shadow-sm font-extrabold">
            {Math.round(progreso)}%
          </span>
        </div>

        {/* Barra de carga */}
        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/25 backdrop-blur-md shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#8B1E23] rounded-full transition-all duration-75 ease-linear shadow-[0_0_14px_rgba(245,158,11,0.9)]"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
