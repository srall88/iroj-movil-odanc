import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface VideoIntroModalProps {
  onComplete: () => void;
}

export const VideoIntroModal: React.FC<VideoIntroModalProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progreso, setProgreso] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;
    video.muted = false;

    // Reproducir directamente con sonido abierto (el usuario acaba de hacer click en INGRESAR)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback únicamente si la política de autoplay del dispositivo exige iniciar en silencio
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      });
    }

    const handleTimeUpdate = () => {
      if (video.duration && video.duration > 0) {
        const p = (video.currentTime / video.duration) * 100;
        setProgreso(Math.min(p, 100));
      }
    };

    const handleEnded = () => {
      setProgreso(100);
      setTimeout(() => {
        onComplete();
      }, 300);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Video en Pantalla Completa Total (object-cover cubre toda la pantalla del celular sin franjas) */}
      <video
        ref={videoRef}
        src="/imagenes/video-portada.mp4"
        playsInline
        autoPlay
        muted={muted}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          if (!target.src.endsWith('/video-portada.mp4')) {
            target.src = '/video-portada.mp4';
          }
        }}
      />

      {/* 2. Capa de Overlay Sutil para controles */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* 3. Header Flotante Superior */}
      <header className="relative z-20 px-4 pt-4 safe-top flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ODANC LIMA ESTE</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Sonido */}
          <button
            onClick={toggleAudio}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 cursor-pointer"
            title="Activar / Silenciar sonido"
          >
            {muted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Botón Omitir */}
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black tracking-wide active:scale-95 transition-all cursor-pointer"
          >
            <span>Omitir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 4. Barra de Progreso Sincronizada con el Video (Termina al 100% cuando concluye el video) */}
      <footer className="relative z-20 px-5 pb-6 safe-bottom space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-white">
          <span className="flex items-center gap-1.5 text-amber-300 drop-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Presentación IROJ 2026</span>
          </span>
          <span className="tabular-nums font-mono drop-shadow-sm">
            {Math.round(progreso)}%
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden p-0.5 border border-white/20 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#8B1E23] rounded-full transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
