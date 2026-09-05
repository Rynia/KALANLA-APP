import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, urgentCount }) => {
  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'gor':
        return '01 // ENVANTER RADARI';
      case 'ekle':
        return '02 // MALZEME EKLE';
      case 'pisir':
        return '02 // SIFIR ZİYAN REÇETELERİ';
      case 'kazancin':
        return '03 // TELEMETRİ RAPORU';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0E]/95 backdrop-blur-xl border-b border-[#1F1F23] shrink-0 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Left Brand Area */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] text-white uppercase">
              KALANLA
            </h1>
            <span className="text-[10px] font-mono border border-[#10B981] text-[#10B981] px-1.5 py-0.5 ml-2.5 align-middle font-bold tracking-wider rounded-none">
              KITCHEN OS v2.4
            </span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1 flex items-center gap-2">
            <span>Ne kaldıysa, ondan başla.</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="hidden sm:inline text-[#10B981]/90">{getTabSubtitle()}</span>
          </p>
        </div>

        {/* Right Status & Savings Area */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              GÖSTERGE
            </p>
            <p className="text-white font-mono text-sm uppercase tracking-wider">
              OPTIMIZED
            </p>
          </div>

          <div className="hidden sm:block w-[1px] h-8 bg-zinc-800" />

          <div className="text-right">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              SİSTEM DURUMU
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    urgentCount > 0 ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    urgentCount > 0 ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                  }`}
                />
              </span>
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider ${
                  urgentCount > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'
                }`}
              >
                {urgentCount > 0 ? `${urgentCount} RİSKTE` : '48S RADAR'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
