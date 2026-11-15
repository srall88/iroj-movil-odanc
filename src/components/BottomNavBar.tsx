import React from 'react';
import { Home, Building2, Trophy, BarChart3 } from 'lucide-react';
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
    { id: 'dependencias' as TabType, label: 'Juzgados', icon: Building2 },
    { id: 'ranking' as TabType, label: 'Ranking', icon: Trophy },
    { id: 'resumen' as TabType, label: 'Resumen', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 safe-bottom transition-all">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActiva = tabActiva === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl active:scale-90 transition-all ${
                isActiva
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActiva ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : ''
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
