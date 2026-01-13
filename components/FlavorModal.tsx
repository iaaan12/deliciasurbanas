import React, { useState, useEffect } from 'react';
import { X, Check, Minus, Plus, Sandwich } from 'lucide-react';
import { Product } from '../types';

interface FlavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (product: Product, selectedFlavors: string) => void;
}

export const FlavorModal: React.FC<FlavorModalProps> = ({ isOpen, onClose, product, onConfirm }) => {
  const [selections, setSelections] = useState<Record<string, Record<string, number>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Resetear selecciones al abrir
  useEffect(() => {
    if (isOpen && product?.customization) {
      const initial: Record<string, Record<string, number>> = {};
      product.customization.groups.forEach(g => {
        initial[g.title] = {};
        g.options.forEach(opt => initial[g.title][opt] = 0);
      });
      setSelections(initial);
      setIsSuccess(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product || !product.customization) return null;

  const handleUpdate = (groupTitle: string, option: string, delta: number, limit: number, minStep: number = 1) => {
    setSelections(prev => {
      const groupSelections = { ...prev[groupTitle] };
      const currentCount = groupSelections[option] || 0;
      const totalInGroup = (Object.values(groupSelections) as number[]).reduce((a, b) => a + b, 0);

      if (delta > 0) {
        if (totalInGroup >= limit) return prev;
        if (currentCount === 0) {
            if (totalInGroup + minStep <= limit) {
                groupSelections[option] = minStep;
            } else {
                return prev;
            }
        } else {
            if (totalInGroup + 1 <= limit) {
                groupSelections[option] = currentCount + 1;
            }
        }
      } else {
        if (currentCount <= 0) return prev;
        if (currentCount === minStep) {
            groupSelections[option] = 0;
        } else if (currentCount > minStep) {
            groupSelections[option] = currentCount - 1;
        } else {
            groupSelections[option] = 0;
        }
      }
      return { ...prev, [groupTitle]: groupSelections };
    });
  };

  const isComplete = product.customization.groups.every(group => {
    const total = (Object.values(selections[group.title] || {}) as number[]).reduce((a, b) => a + b, 0);
    return total === group.limit;
  });

  const handleConfirm = () => {
    if (!isComplete) return;

    // Visual feedback start
    setIsSuccess(true);

    setTimeout(() => {
        const flavorTextParts: string[] = [];
        Object.entries(selections).forEach(([groupTitle, opts]) => {
          const activeOpts = Object.entries(opts).filter(([_, qty]) => qty > 0);
          if (activeOpts.length > 0) {
            const groupDesc = activeOpts.map(([name, qty]) => `${qty}x ${name}`).join(', ');
            flavorTextParts.push(groupDesc);
          }
        });

        onConfirm(product, flavorTextParts.join(' + '));
        onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#18181b] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/5 animate-in zoom-in-95">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18181b]">
          <div>
            <h3 className="text-xl font-bold text-white leading-none">{product.name}</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Armá tu docena a gusto</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">
          {product.customization.groups.map((group, idx) => {
            const currentTotal = (Object.values(selections[group.title] || {}) as number[]).reduce((a, b) => a + b, 0);
            const remaining = group.limit - currentTotal;
            const isGroupComplete = currentTotal === group.limit;
            const minStep = group.minSelection || 1;

            return (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-end">
                   <h4 className="text-sm font-bold text-orange-500 uppercase tracking-widest">{group.title}</h4>
                   <span className={`text-xs font-black px-2 py-1 rounded-md border ${isGroupComplete ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-800 text-slate-300 border-white/10'}`}>
                      {isGroupComplete ? <span className="flex items-center gap-1"><Check className="w-3 h-3"/> Listo</span> : `Faltan ${remaining}`}
                   </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {group.options.map((opt) => {
                    const qty = selections[group.title]?.[opt] || 0;
                    const canAdd = qty === 0 ? (currentTotal + minStep <= group.limit) : (currentTotal + 1 <= group.limit);

                    return (
                      <div key={opt} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${qty > 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#0f1113] border-white/5'}`}>
                        <span className={`text-sm font-medium ${qty > 0 ? 'text-white' : 'text-slate-400'}`}>{opt}</span>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpdate(group.title, opt, -1, group.limit, minStep)}
                            disabled={qty === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-black text-white">{qty}</span>
                          <button 
                            onClick={() => handleUpdate(group.title, opt, 1, group.limit, minStep)}
                            disabled={!canAdd}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#18181b] border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-orange-500/50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-5 border-t border-white/5 bg-[#18181b]">
          <button
            onClick={handleConfirm}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              isSuccess
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : isComplete 
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSuccess ? (
                <>
                    <Check className="w-5 h-5 animate-in zoom-in" /> ¡Agregado!
                </>
            ) : (
                <>
                    {isComplete ? 'Agregar al Pedido' : 'Completá las selecciones'}
                    {isComplete && <Sandwich className="w-4 h-4" />}
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};