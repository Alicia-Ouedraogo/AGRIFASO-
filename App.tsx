import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Analysis } from './components/Analysis';
import { Predictor } from './components/Predictor';
import { ViewState, AgriDataPoint, AnalysisReport } from './types';
import { generateMockData, analyzeTrends } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [data, setData] = useState<AgriDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    setLoadingAnalysis(true);
    
    // 1. Generate Historical Data
    const generatedData = await generateMockData();
    setData(generatedData);
    setLoadingData(false);

    // 2. Automatically analyze the generated data
    if (generatedData.length > 0) {
      const report = await analyzeTrends(generatedData);
      setAnalysis(report);
    }
    setLoadingAnalysis(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            data={data} 
            loading={loadingData} 
            onRefresh={loadData} 
          />
        );
      case ViewState.ANALYSIS:
        return (
          <Analysis 
            report={analysis} 
            loading={loadingAnalysis} 
          />
        );
      case ViewState.PREDICTOR:
        return <Predictor />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;