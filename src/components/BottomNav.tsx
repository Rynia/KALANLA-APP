import React from 'react';
import { TabType } from '../types';
import { Radar, PlusCircle, Flame, Leaf } from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  urgentCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  urgentCount,
}) => {
  const handleSelect = (tab: TabType) => {
    playAudioFeedback('click');
    onTabChange(tab);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'gor',
      label: 'GÖR',
      icon: <Radar className="w-4 h-4" />,
      badge: urgentCount > 0 ? urgentCount : undefined,
    },
    {
      id: 'ekle',
      label: 'EKLE',
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: 'pisir',
      label: 'PİŞİR',
      icon: <Flame className="w-4 h-4" />,
    },
    {
      id: 'kazancin',
      label: 'KAZANÇ',
      icon: <Leaf className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe">
      <div className="max-w-md sm:max-w-lg mx-auto px-4 pb-3 pt-1">
        <div className="pointer-events-auto h-16 rounded-sm bg-[#14141A]/95 backdrop-blur-2xl border border-[#1F1F23] shadow-2xl flex items-center justify-around px-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-12 transition-colors duration-150 active:scale-95 ${
                  isActive
                    ? 'text-[#10B981]'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-1/4 w-3.5 h-3.5 rounded-none bg-[#EF4444] text-black text-[8px] font-mono font-black flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className="font-mono text-xs font-bold tracking-wider">
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <div className="w-1 h-1 bg-[#10B981] mt-1 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
