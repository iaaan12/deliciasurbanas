import React from 'react';
import { ShoppingCart, ClipboardList } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onOrdersClick: () => void;
  logoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onOrdersClick, logoUrl }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f1113]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-3 group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/20 bg-white">
              <img 
                src={logoUrl}
                alt="Logo Delicias Urbanas" 
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none italic uppercase">
                DELICIAS <span className="text-orange-500">URBANAS</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                Comidas al Paso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOrdersClick}
              className="p-3 text-slate-400 hover:text-orange-500 transition-all duration-300 ease-out group flex flex-col items-center hover:bg-white/5 rounded-2xl active:scale-95 hover:scale-105"
              title="Mis Pedidos"
            >
              <ClipboardList className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase hidden sm:block mt-1">Mis Pedidos</span>
            </button>
            
            <button
              onClick={onCartClick}
              className="relative p-3 text-slate-400 hover:text-orange-500 transition-all duration-300 ease-out group flex flex-col items-center hover:bg-white/5 rounded-2xl active:scale-95 hover:scale-105"
              title="Mi Carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase hidden sm:block mt-1">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full shadow-lg border-2 border-white/20 animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};