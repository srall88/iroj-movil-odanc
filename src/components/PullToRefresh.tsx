import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ArrowDown, Check } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullY, setPullY] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const startYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const pullYRef = useRef<number>(0);
  const isRefreshingRef = useRef<boolean>(false);
  const onRefreshRef = useRef(onRefresh);

  // Mantener actualizado el handler sin reiniciar listeners
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    const getScrollTop = () => {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (getScrollTop() <= 2 && !isRefreshingRef.current) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
        pullYRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isRefreshingRef.current) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;
      const scrollTop = getScrollTop();

      if (diff > 0 && scrollTop <= 2) {
        // Amortiguación elástica de arrastre
        const damped = Math.min(diff * 0.45, 90);
        pullYRef.current = damped;
        setPullY(damped);

        if (e.cancelable && diff > 8) {
          e.preventDefault();
        }
      } else {
        pullYRef.current = 0;
        setPullY(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const finalPull = pullYRef.current;

      if (finalPull >= 45 && !isRefreshingRef.current) {
        setIsRefreshing(true);
        isRefreshingRef.current = true;
        setPullY(55);

        // Feedback háptico en celulares compatibles
        try {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(25);
          }
        } catch {}

        try {
          await Promise.resolve(onRefreshRef.current());
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setIsRefreshing(false);
            isRefreshingRef.current = false;
            pullYRef.current = 0;
            setPullY(0);
          }, 650);
        } catch {
          setIsRefreshing(false);
          isRefreshingRef.current = false;
          pullYRef.current = 0;
          setPullY(0);
        }
      } else {
        pullYRef.current = 0;
        setPullY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const thresholdReached = pullY >= 45;

  return (
    <div className="relative min-h-screen">
      {/* 1. Indicador Flotante Superior de Pull-to-refresh */}
      {(pullY > 0 || isRefreshing) && (
        <div
          className="fixed left-0 right-0 top-3 z-50 flex justify-center pointer-events-none transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${Math.min(pullY * 0.75, 55)}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-300 shadow-[0_8px_25px_rgba(15,23,42,0.18)] text-xs font-black text-slate-800">
            {showSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">¡Actualizado con éxito!</span>
              </>
            ) : isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#8B1E23] animate-spin" />
                <span className="text-[#8B1E23]">Descargando cambios de Vercel...</span>
              </>
            ) : thresholdReached ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#8B1E23] rotate-180 transition-transform duration-200" />
                <span className="text-[#8B1E23]">Suelta para actualizar</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
                <span className="text-slate-600">Desliza para actualizar...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. Contenedor con Desplazamiento Elástico Suave */}
      <div
        style={{
          transform: pullY > 0 ? `translateY(${pullY * 0.35}px)` : 'none',
          transition: isDraggingRef.current ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
