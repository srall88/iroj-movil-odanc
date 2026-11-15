import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Volume2, VolumeX } from 'lucide-react';

interface LogoAnimadoIntroModalProps {
  onComplete: () => void;
}

export const LogoAnimadoIntroModal: React.FC<LogoAnimadoIntroModalProps> = ({ onComplete }) => {
  const [progreso, setProgreso] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Reproducir sonido del logo animado de forma directa
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0;
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Si el navegador móvil requiere primer toque para sonido desmuteado
          audio.muted = true;
          setMuted(true);
          audio.play().catch(() => {});
        });
      }
    }

    // 2. Duración exacta de 5 segundos (5000 ms) solicitada
    const duracionMs = 5000;
    const intervaloMs = 35;
    const incremento = 100 / (duracionMs / intervaloMs);

    const timer = setInterval(() => {
      setProgreso((prev) => {
        const siguiente = prev + incremento;
        if (siguiente >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (audio) {
              audio.pause();
            }
            onComplete();
          }, 250);
          return 100;
        }
        return siguiente;
      });
    }, intervaloMs);

    return () => {
      clearInterval(timer);
      if (audio) {
        audio.pause();
      }
    };
  }, [onComplete]);

  const toggleSonido = () => {
    if (audioRef.current) {
      const nuevoEstado = !audioRef.current.muted;
      audioRef.current.muted = nuevoEstado;
      setMuted(nuevoEstado);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Elemento de Audio Institucional Oficial (188 KB) */}
      <audio ref={audioRef} autoPlay preload="auto">
        <source src="/sonido-intro.mp3" type="audio/mpeg" />
        <source src="/sonido-intro.m4a" type="audio/mp4" />
      </audio>

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

        <div className="flex items-center gap-2">
          {/* Botón Activar / Silenciar Sonido */}
          <button
            onClick={toggleSonido}
            className="w-8 h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/25 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-xl"
            title="Activar / Silenciar sonido"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-white/70" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Botón Omitir para salto voluntario inmediato */}
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/80 backdrop-blur-md border border-white/25 text-white text-xs font-black tracking-wide active:scale-95 transition-all cursor-pointer shadow-xl"
          >
            <span>Omitir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Espaciador central transparente (el logo cubre todo el fondo vertical) */}
      <div className="flex-1 pointer-events-none" />

      {/* 3. Barra de Progreso Inferior Sincronizada a 5 Segundos */}
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

        {/* Barra de carga de 5 segundos con resplandor */}
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
