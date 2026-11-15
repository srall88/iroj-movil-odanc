import React from 'react';
import { Home, Compass, Building2, Trophy, BarChart3 } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  tabActiva: TabType;
  setTabActiva: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  tabActiva,
  setTabActiva
}) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Inicio', icon: Home },
    { id: 'cascada' as TabType, label: 'Distritos', icon: Compass },
    { id: 'dependencias' as TabType, label: 'Juzgados', icon: Building2 },
    { id: 'ranking' as TabType, label: 'Ranking', icon: Trophy },
    { id: 'resumen' as TabType, label: 'Resumen', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 safe-bottom shadow-lg transition-all">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActiva = tabActiva === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                isActiva
                  ? 'text-indigo-600 font-extrabold'
                  : 'text-slate-400 hover:text-slate-700 font-semibold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActiva ? 'bg-indigo-50 text-indigo-600 shadow-xs ring-1 ring-indigo-200' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
