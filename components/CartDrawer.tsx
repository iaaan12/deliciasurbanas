import React from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Utensils, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 custom-scrollbar">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                  Tu Pedido
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Revisá tus ítems</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Tu carrito está vacío.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-orange-600 font-black text-sm uppercase tracking-wide hover:underline transition-transform duration-300 hover:scale-105 inline-block"
                  >
                    Ir al menú
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 transition-all hover:border-orange-200 hover:shadow-sm">
                      <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-orange-500">
                        <Utensils className="w-5 h-5" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-black text-slate-900 uppercase italic leading-tight">{item.name}</h3>
                            <p className="ml-4 font-bold text-slate-900 text-sm">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">${item.price.toLocaleString('es-AR')} u.</p>
                        </div>
                        
                        <div className="flex items-end justify-between mt-3">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg h-8">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-8 h-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors rounded-l-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-8 h-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-6 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Final</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">${total.toLocaleString('es-AR')}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-sm uppercase tracking-wider hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-orange-600/30 active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Confirmar Pedido <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};