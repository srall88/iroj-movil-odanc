import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface VideoIntroModalProps {
  onComplete: () => void;
}

export const VideoIntroModal: React.FC<VideoIntroModalProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progreso, setProgreso] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(true);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intentar reproducir automáticamente
    video.play().catch(() => {
      // Si el navegador bloquea autoplay con sonido, asegurar muted
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
    });

    const handleTimeUpdate = () => {
      if (video.duration && video.duration > 0) {
        const p = (video.currentTime / video.duration) * 100;
        setProgreso(Math.min(p, 100));
      }
    };

    const handleEnded = () => {
      setProgreso(100);
      // Breve pausa para ver la barra al 100% y avanzar
      setTimeout(() => {
        onComplete();
      }, 350);
    };

    const handleCanPlay = () => {
      setCargando(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [onComplete]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
      {/* 1. Header Flotante Superior */}
      <header className="relative z-20 px-4 pt-4 safe-top flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ODANC LIMA ESTE · IROJ</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Mute / Unmute */}
          <button
            onClick={toggleAudio}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95"
            title="Activar / Silenciar sonido"
          >
            {muted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Botón Omitir Video */}
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black tracking-wide active:scale-95 transition-all"
          >
            <span>Omitir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Video Central en Pantalla Completa */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-auto">
        <video
          ref={videoRef}
          src="/imagenes/video-portada.mp4"
          playsInline
          autoPlay
          muted={muted}
          className="w-full h-full max-h-[75vh] object-contain drop-shadow-2xl"
          onError={(e) => {
            // Fallback a ruta raíz si es necesario
            const target = e.target as HTMLVideoElement;
            if (!target.src.endsWith('/video-portada.mp4')) {
              target.src = '/video-portada.mp4';
            }
          }}
        />

        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* 3. Barra de Progreso Sincronizada con el Video (Termina cuando termina el video) */}
      <footer className="relative z-20 px-5 pb-6 safe-bottom space-y-2.5 bg-gradient-to-t from-black via-black/80 to-transparent pt-6">
        <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Presentación Institucional IROJ</span>
          </span>
          <span className="tabular-nums font-mono">
            {Math.round(progreso)}%
          </span>
        </div>

        {/* Contenedor de la barra de progreso */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/10 backdrop-blur-xs">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-[#8B1E23] rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,158,11,0.6)]"
            style={{ width: `${progreso}%` }}
          />
        </div>

        <p className="text-[10px] text-center text-white/60 font-medium">
          El sistema ingresará automáticamente al concluir el video
        </p>
      </footer>
    </div>
  );
};
