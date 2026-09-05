import React, { useEffect, useState } from 'react';
import { ThermalReceiptData } from '../types';
import { Share2, Check, ArrowLeft, Copy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAudioFeedback } from '../utils/audio';

interface ThermalReceiptModalProps {
  receipt: ThermalReceiptData | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (receipt) {
      playAudioFeedback('receipt');
      // Fire authentic celebratory zero-waste confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#6FFBBE', '#FFB95F', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  }, [receipt]);

  if (!receipt) return null;

  const handleShare = async () => {
    playAudioFeedback('click');
    const shareText = `🍳 Bugün Kalanla (Kitchen OS) ile "${receipt.recipeTitle}" hazırlayarak ₺${receipt.totalSavedTL} mutfak bütçesini ve ~${receipt.co2SavedKg} kg CO₂e karbon salımını kurtardım! 🌿 "Ne kaldıysa, ondan başla."`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kalanla Kurtarma Fişi ₺${receipt.totalSavedTL}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setToastMessage('FIŞ METNİ VE ÖZETİ PANİĞE KOPYALANDI');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage('PAYLAŞIM HAZIRLANDI');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0E]/90 backdrop-blur-md flex flex-col items-center justify-start p-4 py-8 animate-in fade-in duration-200">
      {/* Top Telemetry Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 text-white">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-wider">GERİ</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] text-[#10B981] uppercase tracking-widest font-bold">
            İŞLEM // MODÜL
          </span>
          <span className="font-mono text-xs text-white uppercase tracking-wider">Termal Fiş Önizleme</span>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-sm bg-[#14141A] border border-[#1F1F23] flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Pill Banner */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-sm border border-[#10B981] text-[#10B981] bg-[#10B981]/10 mb-4 shadow-sm">
        <Check className="w-3.5 h-3.5" />
        <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
          KURTARMA ONAYLANDI // TELEMETRİ ARŞİVİ
        </span>
      </div>

      {/* Physical Thermal Paper Receipt Container */}
      <div className="relative w-full max-w-[320px] shadow-2xl rounded-sm transition-transform duration-300">
        {/* Top Serrated Edge */}
        <div className="w-full h-3 bg-white sawtooth-top" />

        {/* Paper Body */}
        <div className="w-full bg-white text-black px-5 py-4 flex flex-col font-mono text-xs select-none relative overflow-hidden">
          {/* Punched hole */}
          <div className="w-4 h-4 bg-[#0A0A0E] rounded-full mx-auto -mt-6 mb-3" />

          {/* Receipt Header */}
          <div className="flex flex-col items-center text-center relative z-10 border-b border-black pb-3">
            <h3 className="font-mono font-bold text-sm tracking-tight uppercase">
              KALANLA ZERO-WASTE
            </h3>
            <p className="text-[9px] font-mono text-zinc-600 mt-0.5 uppercase tracking-wider">
              TERMINAL #04 • {receipt.date || '24.10.2024'}
            </p>

            <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-dashed border-zinc-400 text-zinc-600 text-[9px]">
              <span>{receipt.txCode || 'TR-IST-034 // #8821'}</span>
              <span>{receipt.time || '19:42'}</span>
            </div>
          </div>

          {/* Dish Prepared Box */}
          <div className="relative z-10 bg-zinc-100 p-2.5 rounded-none flex flex-col gap-0.5 my-2.5 border border-zinc-300">
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">
              HAZIRLANAN TARİF // SIFIR ZİYAN
            </span>
            <span className="text-xs font-bold text-black uppercase tracking-tight">
              {receipt.recipeTitle}
            </span>
          </div>

          {/* Itemized Table */}
          <div className="relative z-10 flex flex-col gap-1.5 my-2 border-b border-dashed border-zinc-400 pb-2.5">
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1.5 truncate min-w-0">
                  <span className="font-bold">0{idx + 1}.</span>
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-[#10B981] font-bold">
                    [✓ %100]
                  </span>
                  <span className="font-bold tabular-nums">₺{item.priceTL.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Eco Savings */}
          <div className="py-2 border-b border-black font-mono">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold">TOPLAM TASARRUF</span>
              <span className="text-base font-bold text-[#10B981]">
                ₺{receipt.totalSavedTL.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
              <span>CO2 SALINIM ENGELİ</span>
              <span className="font-bold">~{receipt.co2SavedKg.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
              <span>HAZIRLIK SÜRESİ</span>
              <span className="font-bold">{receipt.durationMinutes} DAKİKA</span>
            </div>
          </div>

          {/* Barcode mockup */}
          <div className="pt-4 pb-2 text-center relative z-10">
            <div className="inline-block w-44 h-8 bg-zinc-900" />
            <p className="font-mono text-[8px] tracking-[0.3em] text-zinc-600 mt-1">
              {receipt.barcodeNumber || '869000102938'}
            </p>
          </div>

          {/* Slogan */}
          <div className="relative z-10 flex flex-col items-center text-center mt-2 pt-2 border-t border-dashed border-zinc-400">
            <span className="text-[10px] italic text-zinc-600 font-medium">
              "Ne kaldıysa, ondan başla."
            </span>
            <span className="text-[8px] tracking-widest text-zinc-400 font-bold uppercase mt-0.5">
              KALANLA // KITCHEN OS
            </span>
          </div>
        </div>

        {/* Bottom Serrated Edge */}
        <div className="w-full h-3 bg-white sawtooth-bottom" />
      </div>

      {/* Interactive Social Proof & Action Deck */}
      <div className="w-full max-w-[320px] flex flex-col gap-2 mt-5">
        <button
          onClick={handleShare}
          className="w-full py-3 bg-[#10B981] hover:bg-emerald-400 text-black font-mono text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-98"
        >
          <Share2 className="w-4 h-4 text-black" />
          <span>Fişi Hikayede Paylaş</span>
        </button>

        <button
          onClick={() => {
            playAudioFeedback('click');
            onClose();
          }}
          className="w-full py-2.5 bg-[#14141A] hover:bg-[#1F1F23] text-zinc-300 border border-[#1F1F23] font-mono text-[11px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active:scale-98 transition-colors"
        >
          <span>Kapat & Envanteri Güncelle</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mt-3 px-4 py-2 rounded-sm bg-[#14141A] border border-[#10B981] text-[#10B981] font-mono text-[10px] font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-2">
          <Copy className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
