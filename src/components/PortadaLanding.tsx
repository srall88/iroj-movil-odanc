import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Scale,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface PortadaLandingProps {
  totalDependencias: number;
  totalDistritos: number;
  mesActivo: string;
  anio: number;
  onIngresar: () => void;
}

export const PortadaLanding: React.FC<PortadaLandingProps> = ({
  totalDependencias,
  totalDistritos,
  mesActivo,
  anio,
  onIngresar
}) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between px-5 pt-8 pb-8 bg-gradient-to-b from-slate-50 via-white to-red-50/20 overflow-hidden select-none">
      {/* 1. Header Superior con los 2 Logos Oficiales (CSJLE + IROJ) en Tarjetas Blancas */}
      <div className="relative z-10 text-center space-y-4">
        {/* Dos logos lado a lado con recuadro blanco redondeado y sombra suave (Réplica exacta Imagen 4) */}
        <div className="flex items-center justify-center gap-3.5">
          {/* Logo 1: Corte Superior de Justicia de Lima Este */}
          <div className="w-20 h-20 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center">
            <img 
              src="/imagenes/logo csjle.png" 
              alt="Corte Superior de Justicia de Lima Este" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Logo.png';
              }}
            />
          </div>

          {/* Logo 2: IROJ / ODANC */}
          <div className="w-20 h-20 bg-white rounded-2xl p-2 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center">
            <img 
              src="/Logo.png" 
              alt="Logo IROJ" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Badge Institucional Superior */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#8B1E23] shadow-xs">
          <Scale className="w-3.5 h-3.5 text-[#8B1E23]" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            PODER JUDICIAL DEL PERÚ
          </span>
        </div>

        {/* Título Principal y Subtítulo Institucional */}
        <div className="space-y-1 pt-1">
          <h1 className="text-4xl sm:text-5xl font-black text-[#8B1E23] tracking-tight leading-none">
            IROJ
          </h1>
          <h2 className="text-xs font-black text-[#8B1E23] uppercase tracking-wider max-w-xs mx-auto leading-snug">
            CORTE SUPERIOR DE JUSTICIA DE LIMA ESTE
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-0.5">
            ODANC · OFICINA DESCENTRALIZADA DE CONTROL
          </p>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed pt-2">
            Sistema de Monitoreo y Evaluación de Indicadores Jurisdiccionales. Consulta ágil de indicadores, producción y semáforo de riesgo por órgano jurisdiccional.
          </p>
        </div>
      </div>

      {/* 2. Tarjeta Bento Central de Métricas y Corte de Datos (Réplica Imagen 4) */}
      <div className="relative z-10 my-auto py-4 max-w-xs mx-auto w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* Columna Izquierda: Dependencias Activas */}
            <div className="space-y-1">
              <div className="w-8 h-8 mx-auto flex items-center justify-center text-slate-700">
                <Building2 className="w-6 h-6 text-slate-600" />
              </div>
              <span className="text-3xl font-black text-slate-900 block tabular-nums leading-none">
                {totalDependencias}
              </span>
              <span className="text-[11px] font-bold text-slate-600 block leading-tight">
                Dependencias Activas
              </span>
            </div>

            {/* Columna Derecha: Distritos / Sedes */}
            <div className="space-y-1 border-l border-slate-100 pl-2">
              <div className="w-8 h-8 mx-auto flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-3xl font-black text-slate-900 block tabular-nums leading-none">
                {totalDistritos} Distritos
              </span>
              <span className="text-[11px] font-bold text-slate-600 block leading-tight">
                Sedes Judiciales
              </span>
            </div>
          </div>

          {/* Franja Inferior de Datos Oficiales */}
          <div className="bg-red-50/70 border border-red-200/70 rounded-full px-3.5 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium text-[11px]">
              Datos oficiales actualizados:
            </span>
            <span className="font-black text-[#8B1E23] text-[11px] flex items-center gap-1">
              OCTUBRE {anio} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Botón Principal Inferior Granate/Rojo Institucional (Réplica Imagen 4) */}
      <div className="relative z-10 pt-2 max-w-xs mx-auto w-full">
        <button
          onClick={onIngresar}
          className="w-full py-4 px-6 bg-[#8B1E23] hover:bg-[#73191d] active:scale-[0.98] text-white font-black text-sm tracking-wide rounded-2xl shadow-lg shadow-red-900/25 flex items-center justify-center gap-2.5 transition-all touch-target cursor-pointer"
        >
          <span>INGRESAR AL SISTEMA</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* 4. Footer Inferior */}
      <footer className="relative z-10 text-center pt-5 border-t border-slate-200/60 mt-4">
        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Corte Superior de Justicia de Lima Este
        </p>
        <p className="text-[9px] font-medium text-slate-400 mt-0.5">
          ODANC · Oficina Descentralizada de la Autoridad Nacional de Control
        </p>
      </footer>
    </div>
  );
};
