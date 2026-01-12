
import React, { useMemo } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Utensils, ArrowRight, PlusCircle, AlignLeft } from 'lucide-react';
import { CartItem, Product } from '../types';
import { MENU_ITEMS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onAddItem: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onAddItem
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Lógica de recomendación: Productos que NO están en el carrito
  const recommendations = useMemo(() => {
    return MENU_ITEMS
      .filter(item => !items.find(cartItem => cartItem.id === item.id)) // Excluir los que ya están
      .filter(item => item.category === 'Bebidas' || item.category === 'Guarniciones') // Solo complementos
      .sort(() => 0.5 - Math.random()) // Aleatorio simple
      .slice(0, 3); // Máximo 3 sugerencias
  }, [items, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#18181b] shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 custom-scrollbar">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-orange-500" />
                  Tu Pedido
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Revisá tus ítems</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              {items.length === 0 ? (
                <div className="text-center py-20 bg-[#18181b] rounded-3xl border-2 border-dashed border-white/5">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">Tu carrito está vacío.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-orange-600 font-black text-sm uppercase tracking-wide hover:underline transition-transform duration-300 hover:scale-105 inline-block"
                  >
                    Ir al menú
                  </button>
                </div>
              ) : (
                <>
                  {/* Lista de Items */}
                  <ul className="space-y-4">
                    {items.map((item, index) => (
                      <li key={`${item.id}-${index}`} className="p-4 bg-[#0f1113] rounded-2xl border border-white/5 flex gap-4 transition-all hover:border-orange-500/20 hover:shadow-sm">
                        <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-center text-orange-500">
                          <Utensils className="w-5 h-5" />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-sm font-black text-white uppercase italic leading-tight">{item.name}</h3>
                              <p className="ml-4 font-bold text-white text-sm">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 mb-2">${item.price.toLocaleString('es-AR')} u.</p>
                            
                            {item.selectedFlavors && (
                                <div className="bg-[#18181b] p-2 rounded-lg border border-white/5 mb-2">
                                    <p className="text-[10px] text-slate-300 flex gap-1 leading-relaxed">
                                        <AlignLeft className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                                        {item.selectedFlavors}
                                    </p>
                                </div>
                            )}
                          </div>
                          
                          <div className="flex items-end justify-between mt-1">
                            <div className="flex items-center bg-[#18181b] border border-white/5 rounded-lg h-8">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-white/5 text-slate-500 hover:text-white transition-colors rounded-l-lg"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-white/5 text-slate-500 hover:text-white transition-colors rounded-r-lg"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemove(item.id)}
                              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Recomendaciones */}
                  {recommendations.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-orange-500" /> ¿Agregamos algo más?
                      </h3>
                      <div className="space-y-3">
                        {recommendations.map(rec => (
                          <div key={rec.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#0f1113] border border-white/5 hover:border-orange-500/30 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white leading-tight group-hover:text-orange-500 transition-colors">{rec.name}</span>
                                <span className="text-[10px] text-slate-500 font-bold">${rec.price.toLocaleString('es-AR')}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => onAddItem(rec)}
                              className="p-2 bg-[#18181b] text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all border border-white/5"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-white/5 px-6 py-6 bg-[#18181b] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-10">
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Final</span>
                <span className="text-3xl font-black text-white tracking-tighter">${total.toLocaleString('es-AR')}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-white text-black rounded-2xl py-5 font-black text-sm uppercase tracking-wider hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-orange-600/30 active:scale-[0.98] flex items-center justify-center gap-2 group"
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
