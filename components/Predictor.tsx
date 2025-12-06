import React, { useState } from 'react';
import { predictCropYield } from '../services/geminiService';
import { PredictionResult } from '../types';
import { Sprout, Droplets, Thermometer, ArrowRight, Sparkles } from 'lucide-react';

export const Predictor: React.FC = () => {
  const [rainfall, setRainfall] = useState<number>(800);
  const [temp, setTemp] = useState<number>(28);
  const [crop, setCrop] = useState<string>('Millet');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prediction = await predictCropYield(rainfall, temp, crop);
    setResult(prediction);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">Simulateur de Récolte</h2>
        <p className="text-stone-500">Estimez les rendements futurs selon les prévisions météo.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit">
          <form onSubmit={handlePredict} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <Droplets size={16} className="text-blue-500" />
                Prévision Pluie (mm)
              </label>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-sm font-bold text-emerald-700 mt-1">{rainfall} mm</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <Thermometer size={16} className="text-orange-500" />
                Température Moyenne (°C)
              </label>
              <input
                type="range"
                min="20"
                max="45"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-sm font-bold text-emerald-700 mt-1">{temp} °C</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                <Sprout size={16} className="text-green-500" />
                Culture Ciblée
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Millet">Mil (Millet)</option>
                <option value="Sorghum">Sorgho</option>
                <option value="Maize">Maïs</option>
                <option value="Cotton">Coton</option>
                <option value="Sesame">Sésame</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Lancer la Prédiction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 p-8 border-2 border-dashed border-stone-200 rounded-2xl">
              <Sprout size={48} className="mb-4 opacity-20" />
              <p className="text-center">Configurez les paramètres météo pour voir les prédictions de l'IA.</p>
            </div>
          )}

          {result && (
            <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-xl animate-fade-in relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium uppercase tracking-wider mb-1">
                  <Sparkles size={14} /> Prédiction IA
                </div>
                <h3 className="text-4xl font-bold mb-6">{result.predictedYield} <span className="text-xl font-normal text-emerald-200">kg/ha</span></h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-emerald-200 text-xs uppercase font-bold mb-1">Période de Semis Optimale</p>
                    <p className="text-lg font-medium">{result.optimalPlantingPeriod}</p>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-emerald-200 text-xs uppercase font-bold mb-1">Confiance du Modèle</p>
                    <p className="text-lg font-medium">{result.confidence}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-emerald-200 text-xs uppercase font-bold mb-2">Conseil Agronomique</p>
                    <p className="text-sm leading-relaxed opacity-90">{result.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};