import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, BrainCircuit, Sprout, Menu, X } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view
          ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-sm'
          : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-700 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sprout /> AgriFaso
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-white border-r border-stone-200 z-40 flex flex-col
      `}>
        <div className="p-6 border-b border-stone-100 hidden md:block">
          <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
            <Sprout className="text-emerald-600" />
            AgriFaso
          </h1>
          <p className="text-xs text-stone-500 mt-1">Analyse Données Locales</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Tableau de Bord" />
          <NavItem view={ViewState.ANALYSIS} icon={BrainCircuit} label="Analyse IA" />
          <NavItem view={ViewState.PREDICTOR} icon={Sprout} label="Prédictions" />
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="bg-emerald-50 rounded-lg p-3 text-xs text-emerald-800">
            <p className="font-semibold">Statut API</p>
            <p className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Gemini 2.5 Connecté
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};