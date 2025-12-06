export interface AgriDataPoint {
  year: number;
  rainfall_mm: number;
  avg_temp_c: number;
  millet_yield_kg_ha: number;
  sorghum_yield_kg_ha: number;
  maize_yield_kg_ha: number;
}

export interface PredictionResult {
  predictedYield: number;
  optimalPlantingPeriod: string;
  confidence: string;
  advice: string;
}

export interface AnalysisReport {
  correlationRainfall: string;
  correlationTemp: string;
  summary: string;
  recommendation: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PREDICTOR = 'PREDICTOR',
  ANALYSIS = 'ANALYSIS'
}