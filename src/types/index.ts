export interface EvaluacionItem {
  id: number;
  organo_id: number;
  mes: string;
  anio: number;
  estado: string;
  val_carga: number;
  val_antiguedad: number;
  val_escritos: number;
  val_impugnacion: number;
  val_ejecucion: number;
  punt_carga: number;
  punt_ant: number;
  punt_esc: number;
  punt_imp: number;
  punt_eje: number;
  pond_carga: number;
  pond_ant: number;
  pond_esc: number;
  pond_imp: number;
  pond_eje: number;
  puntaje_final: number;
  nivel_riesgo: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO' | string;
  color: string | null;
  ndep: number;
  dependencia: string;
  distrito: string;
  sede: string;
  especialidad: string;
}

export interface OrganoItem {
  id: number;
  ndep: number;
  dependencia: string;
  especialidad: string;
  distrito: string;
  sede: string;
}

export interface ResumenPorMes {
  total_evaluados: number;
  promedio_puntaje: number;
  distribucion_niveles: {
    CRITICO: number;
    ALTO: number;
    MEDIO: number;
    BAJO: number;
  };
  top_riesgo: EvaluacionItem[];
  top_optimo: EvaluacionItem[];
}

export interface DatasetIROJ {
  generado_en: string;
  corte: string;
  institucion: string;
  anio_predeterminado: number;
  meses: string[];
  distritos: string[];
  sedes: string[];
  especialidades: string[];
  total_organos: number;
  resumen_por_mes: Record<string, ResumenPorMes>;
  organos: OrganoItem[];
  evaluaciones: EvaluacionItem[];
}

export type TabType = 'inicio' | 'dependencias' | 'ranking' | 'resumen';
