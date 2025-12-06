import React from 'react';
import { AgriDataPoint } from '../types';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CloudRain, ThermometerSun, Wheat } from 'lucide-react';

interface DashboardProps {
  data: AgriDataPoint[];
  loading: boolean;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <SproutLoader />
        <p className="text-stone-500 font-medium">Génération des données climatiques...</p>
      </div>
    );
  }

  const StatCard = ({ title, value, unit, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start justify-between">
      <div>
        <p className="text-stone-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-stone-800">
          {value} <span className="text-sm font-normal text-stone-400">{unit}</span>
        </h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  // Calculate averages for cards
  const avgRain = Math.round(data.reduce((acc, curr) => acc + curr.rainfall_mm, 0) / data.length);
  const avgTemp = (data.reduce((acc, curr) => acc + curr.avg_temp_c, 0) / data.length).toFixed(1);
  const maxMillet = Math.max(...data.map(d => d.millet_yield_kg_ha));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Aperçu Climatique & Agricole</h2>
          <p className="text-stone-500">Données historiques simulées (2013-2023)</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
        >
          Régénérer Données
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pluviométrie Moyenne" 
          value={avgRain} 
          unit="mm/an" 
          icon={CloudRain} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Température Moyenne" 
          value={avgTemp} 
          unit="°C" 
          icon={ThermometerSun} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Rendement Max (Mil)" 
          value={maxMillet} 
          unit="kg/ha" 
          icon={Wheat} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mixed Chart: Rain vs Yield */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Corrélation Pluie / Récoltes</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="year" scale="band" />
                <YAxis yAxisId="left" label={{ value: 'Pluie (mm)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Rendement (kg)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="rainfall_mm" name="Pluie" fill="#3b82f6" barSize={20} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="millet_yield_kg_ha" name="Mil" stroke="#10b981" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="sorghum_yield_kg_ha" name="Sorgho" stroke="#f59e0b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Temperature Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Évolution Température</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="year" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Area type="monotone" dataKey="avg_temp_c" name="Temp (°C)" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const SproutLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 animate-bounce">
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);
