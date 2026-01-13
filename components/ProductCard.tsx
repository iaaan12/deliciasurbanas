
import React, { useState } from 'react';
import { Plus, ArrowRight, Sparkles, Flame, ListPlus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCustomize?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onCustomize }) => {
  const [isAdded, setIsAdded] = useState(false);
  const isPromo = product.id.startsWith('p');
  const hasCustomization = !!product.customization;

  const handleClick = () => {
    if (hasCustomization && onCustomize) {
      onCustomize(product);
    } else {
      onAddToCart(product);
      // Trigger temporary success state
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <div className={`group relative rounded-[2rem] p-6 transition-all duration-500 flex flex-col justify-between h-full min-h-[240px]
      ${isPromo 
        ? 'bg-gradient-to-br from-[#1c1c20] via-[#2a1b12] to-[#1c1c20] border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.25)] hover:border-orange-500/80 scale-[1.02]' 
        : 'bg-[#18181b] border border-white/5 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30'
      }`}>
      
      {/* Promo Badge */}
      {isPromo && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/40 tracking-[0.2em] uppercase flex items-center gap-1.5 border border-white/10 whitespace-nowrap">
            <Flame className="w-3 h-3 fill-white animate-pulse" />
            Oferta Especial
          </div>
        </div>
      )}

      {/* Background decoration on hover */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100%] rounded-tr-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none 
        ${isPromo ? 'bg-orange-500/10' : 'bg-orange-500/5'}`} 
      />

      <div className="relative z-10 pt-2">
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300
            ${isPromo 
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' 
              : 'bg-[#0f1113] text-slate-400 group-hover:bg-orange-900/20 group-hover:text-orange-500'
            }`}>
            {product.category}
          </span>
          {isPromo && <Sparkles className="w-4 h-4 text-orange-400/50" />}
        </div>

        <h3 className={`text-2xl font-extrabold leading-tight tracking-tight mb-3 transition-colors duration-300
          ${isPromo ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200' : 'text-white group-hover:text-orange-500'}`}>
          {product.name.replace('PROMO:', '').trim()}
        </h3>
        
        <p className={`text-sm font-medium leading-relaxed line-clamp-3 ${isPromo ? 'text-orange-100/70' : 'text-slate-400'}`}>
          {product.description}
        </p>
      </div>

      <div className={`relative z-10 mt-8 pt-6 border-t flex items-center justify-between
        ${isPromo ? 'border-orange-500/20' : 'border-white/5'}`}>
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isPromo ? 'text-orange-400' : 'text-slate-500'}`}>
            Precio
          </span>
          <span className={`text-2xl font-black tracking-tighter ${isPromo ? 'text-white drop-shadow-sm' : 'text-white'}`}>
            ${product.price.toLocaleString('es-AR')}
          </span>
        </div>

        <button
          onClick={handleClick}
          className={`group/btn relative overflow-hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95
            ${isAdded 
                ? 'bg-green-500 text-white scale-110 shadow-green-500/30'
                : isPromo 
                    ? 'bg-orange-500 text-white hover:bg-white hover:text-orange-600 shadow-orange-500/20' 
                    : 'bg-white hover:bg-orange-500 text-black hover:text-white shadow-black/20 hover:shadow-orange-500/30'
            }`}
        >
          {isAdded ? (
             <Check className="w-6 h-6 animate-in zoom-in duration-300" />
          ) : hasCustomization ? (
             <ListPlus className="w-5 h-5 absolute transition-all duration-300 group-hover/btn:scale-110" />
          ) : (
            <>
              <Plus className="w-5 h-5 transition-all duration-300 group-hover/btn:rotate-90 group-hover/btn:scale-0 opacity-100 group-hover/btn:opacity-0 absolute" />
              <ArrowRight className="w-5 h-5 transition-all duration-300 -rotate-90 scale-0 opacity-0 group-hover/btn:rotate-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 absolute" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
