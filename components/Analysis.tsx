import React from 'react';
import { AnalysisReport } from '../types';
import { FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AnalysisProps {
  report: AnalysisReport | null;
  loading: boolean;
}

export const Analysis: React.FC<AnalysisProps> = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-stone-600">L'IA analyse les corrélations agricoles...</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Rapport d'Analyse Agronomique</h2>
        <p className="text-stone-500">Généré par Gemini 2.5 Flash basé sur les données historiques.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">Résumé Global</h3>
          </div>
          <p className="mt-3 text-stone-700 leading-relaxed">{report.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 border-b md:border-b-0 md:border-r border-stone-100">
             <h4 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               Impact Pluviométrique
             </h4>
             <p className="text-stone-600 text-sm leading-relaxed">{report.correlationRainfall}</p>
          </div>
          <div className="p-6">
             <h4 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-orange-500"></span>
               Impact Température
             </h4>
             <p className="text-stone-600 text-sm leading-relaxed">{report.correlationTemp}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <CheckCircle className="text-emerald-400" size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Recommandation Stratégique</h3>
            <p className="text-stone-300 leading-relaxed">{report.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};