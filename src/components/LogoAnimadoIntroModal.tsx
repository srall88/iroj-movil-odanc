import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface LogoAnimadoIntroModalProps {
  onComplete: () => void;
}

export const LogoAnimadoIntroModal: React.FC<LogoAnimadoIntroModalProps> = ({ onComplete }) => {
  const [progreso, setProgreso] = useState<number>(0);

  useEffect(() => {
    // Duración exacta de 7 segundos (7000 ms) solicitada
    const duracionMs = 7000;
    const intervaloMs = 35;
    const incremento = 100 / (duracionMs / intervaloMs);

    const timer = setInterval(() => {
      setProgreso((prev) => {
        const siguiente = prev + incremento;
        if (siguiente >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 250);
          return 100;
        }
        return siguiente;
      });
    }, intervaloMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* 1. Logo Animado IROJ en Toda la Pantalla Vertical (Formato 9:16 nativo 270x480) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black z-0">
        <img
          src="/Logo animado IROJ.gif"
          alt="Logo Animado IROJ"
          className="w-full h-full object-cover sm:object-contain drop-shadow-[0_0_35px_rgba(139,30,35,0.6)]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/Logo.png';
          }}
        />

        {/* Gradientes sutiles superior e inferior para legibilidad perfecta */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
      </div>

      {/* 2. Header Flotante Superior */}
      <header className="relative z-20 px-4 pt-4 safe-top flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-xl">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ODANC LIMA ESTE · IROJ</span>
        </div>

        {/* Botón Omitir para salto voluntario inmediato */}
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs font-black tracking-wide active:scale-95 transition-all cursor-pointer shadow-xl"
        >
          <span>Omitir</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Espaciador central transparente (el logo cubre todo el fondo vertical) */}
      <div className="flex-1 pointer-events-none" />

      {/* 3. Barra de Progreso Inferior Sincronizada a 7 Segundos */}
      <footer className="relative z-20 px-6 pb-6 safe-bottom space-y-2 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between text-[11px] font-bold text-white drop-shadow-md">
          <span className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Cargando indicadores de gestión...</span>
          </span>
          <span className="tabular-nums font-mono text-xs text-amber-200 font-extrabold">
            {Math.round(progreso)}%
          </span>
        </div>

        {/* Barra de carga de 7 segundos con resplandor */}
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/25 backdrop-blur-md shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#8B1E23] rounded-full transition-all duration-75 ease-linear shadow-[0_0_16px_rgba(245,158,11,0.9)]"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
