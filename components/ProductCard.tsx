import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between h-full min-h-[240px]">
      
      {/* Background decoration on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100%] rounded-tr-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors duration-300">
            {product.category}
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 italic uppercase leading-none tracking-tight mb-3 group-hover:text-orange-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
          {product.description}
        </p>
      </div>

      <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Precio</span>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            ${product.price.toLocaleString('es-AR')}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="group/btn relative overflow-hidden bg-slate-900 hover:bg-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-orange-500/30 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 transition-all duration-300 group-hover/btn:rotate-90 group-hover/btn:scale-0 opacity-100 group-hover/btn:opacity-0 absolute" />
          <ArrowRight className="w-5 h-5 transition-all duration-300 -rotate-90 scale-0 opacity-0 group-hover/btn:rotate-0 group-hover/btn:scale-100 group-hover/btn:opacity-100 absolute" />
        </button>
      </div>
    </div>
  );
};