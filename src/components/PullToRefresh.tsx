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

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 5 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0 && window.scrollY <= 5) {
        // Resistencia táctil elástica
        const damped = Math.min(diff * 0.4, 85);
        setPullY(damped);
        // Evitar recarga nativa de navegador
        if (e.cancelable && diff > 10) {
          e.preventDefault();
        }
      } else {
        setPullY(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (pullY >= 50 && !isRefreshing) {
        setIsRefreshing(true);
        setPullY(60);

        try {
          await Promise.resolve(onRefresh());
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setIsRefreshing(false);
            setPullY(0);
          }, 600);
        } catch {
          setIsRefreshing(false);
          setPullY(0);
        }
      } else {
        setPullY(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, isRefreshing, onRefresh]);

  const thresholdReached = pullY >= 50;

  return (
    <div className="relative">
      {/* Indicador Flotante de Pull-to-refresh */}
      {(pullY > 0 || isRefreshing) && (
        <div
          className="fixed left-0 right-0 top-2 z-50 flex justify-center pointer-events-none transition-all duration-150"
          style={{ transform: `translateY(${Math.min(pullY * 0.8, 60)}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_8px_20px_rgba(15,23,42,0.12)] text-xs font-black text-slate-800">
            {showSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">¡Datos actualizados!</span>
              </>
            ) : isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#8B1E23] animate-spin" />
                <span className="text-[#8B1E23]">Actualizando desde Vercel...</span>
              </>
            ) : thresholdReached ? (
              <>
                <RefreshCw className="w-4 h-4 text-[#8B1E23] rotate-180 transition-transform duration-200" />
                <span className="text-[#8B1E23]">Suelta para actualizar</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
                <span className="text-slate-600">Desliza hacia abajo...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Contenido envuelto con desplazamiento elástico */}
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
