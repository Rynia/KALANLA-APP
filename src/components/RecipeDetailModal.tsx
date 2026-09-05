import React from 'react';
import { RescueRecipe } from '../types';
import { X, Clock, Flame, Coins, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { playAudioFeedback } from '../utils/audio';

interface RecipeDetailModalProps {
  recipe: RescueRecipe | null;
  onClose: () => void;
  onCookRecipe: (recipe: RescueRecipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onCookRecipe,
}) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0E]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14141A] border border-[#1F1F23] rounded-sm shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Image */}
        <div className="relative w-full h-44 bg-zinc-800 shrink-0">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14141A] via-transparent to-black/70" />

          {/* Close button */}
          <button
            onClick={() => {
              playAudioFeedback('click');
              onClose();
            }}
            className="absolute top-3 right-3 w-7 h-7 rounded-sm bg-black/80 border border-[#2A2A2E] text-zinc-400 flex items-center justify-center hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between">
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[#10B981] bg-black/80 text-[#10B981] font-bold">
              +₺{recipe.savedTL} KURTARILDI
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2 py-0.5 border border-zinc-800 bg-black/80 text-zinc-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FFB95F]" />
                {recipe.durationMinutes} DK
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 border border-zinc-800 bg-black/80 text-zinc-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#EF4444]" />
                {recipe.calories} KCAL
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="font-mono text-[9px] text-[#10B981] uppercase tracking-wider font-bold">
                REÇETE DETAYI // SIFIR ZİYAN
              </span>
            </div>
            <h2 className="text-lg font-light text-white tracking-wide">
              {recipe.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Matched items */}
          <div className="bg-[#0A0A0E] p-3 rounded-sm border border-[#2A2A2E] space-y-2">
            <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
              Kurtarılan Malzemeler
            </span>
            <div className="flex flex-wrap gap-1">
              {recipe.requiredItemNames.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px]"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                  <span>{ing.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
              Hazırlanış Adımları ({recipe.durationMinutes} Dk)
            </span>
            <div className="space-y-2">
              {recipe.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-sm bg-[#0A0A0E] border border-[#2A2A2E]"
                >
                  <span className="w-5 h-5 rounded-none bg-zinc-900 border border-zinc-800 text-[#10B981] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <p className="font-sans text-xs text-zinc-300 leading-relaxed font-light">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#14141A] border-t border-[#1F1F23] shrink-0">
          <button
            onClick={() => {
              onCookRecipe(recipe);
              onClose();
            }}
            className="w-full py-3 bg-[#10B981] hover:bg-emerald-400 text-black font-mono text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Yemeği Yaptım & Kurtardım</span>
            <span className="font-mono text-[10px] bg-black text-[#10B981] px-1.5 py-0.5 rounded-none font-bold">
              +₺{recipe.savedTL}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
