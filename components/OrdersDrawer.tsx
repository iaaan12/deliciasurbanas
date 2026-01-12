import React, { useState } from 'react';
import { X, ClipboardList, Clock, AlertTriangle, PhoneCall, Check, RotateCcw, MessageCircle } from 'lucide-react';
import { Order } from '../types';

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

export const OrdersDrawer: React.FC<OrdersDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onCancelOrder
}) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancelClick = (id: string) => {
    setConfirmingId(id);
  };

  const handleWhatsAppCancel = (order: Order) => {
    const shopPhone = "5493875020884";
    const message = `⚠️ *CANCELACIÓN DE PEDIDO*%0A` +
      `----------------------------------%0A` +
      `Hola Delicias Urbanas, quiero *CANCELAR* mi pedido:%0A` +
      `🆔 *Orden:* #${order.id.slice(-6)}%0A` +
      `👤 *Cliente:* ${order.details.customerName}%0A` +
      `🕒 *Era para las:* ${order.details.pickupTime} hs%0A` +
      `----------------------------------%0A` +
      `Disculpen las molestias.`;

    window.open(`https://wa.me/${shopPhone}?text=${message}`, '_blank');
  };

  const confirmCancel = (order: Order) => {
    onCancelOrder(order.id);
    setConfirmingId(null);
    handleWhatsAppCancel(order);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-orange-500" />
                Mis Pedidos
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-500 transition-transform duration-300 hover:scale-105">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <ClipboardList className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium">No tenés pedidos recientes.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden group shadow-sm">
                    <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Pendiente' ? 'bg-orange-500 text-white' : 
                      order.status === 'Cancelado' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {order.status}
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-400 uppercase">Orden #{order.id.slice(-6)}</p>
                      <p className="text-sm font-black text-slate-800 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-orange-500" /> Retiro a las {order.details.pickupTime} hs
                      </p>
                    </div>

                    <ul className="space-y-1 mb-4">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-bold text-slate-800">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-lg font-black text-slate-900">${order.total.toLocaleString('es-AR')}</span>
                      
                      {order.status === 'Pendiente' && confirmingId !== order.id && (
                        <button
                          onClick={() => handleCancelClick(order.id)}
                          className="text-xs font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1 border border-red-100"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          CANCELAR
                        </button>
                      )}

                      {confirmingId === order.id && (
                        <div className="flex items-center gap-2">
                           <button
                            onClick={() => confirmCancel(order)}
                            className="text-[10px] font-black bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> CONFIRMAR
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="text-[10px] font-black bg-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-300 transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> NO
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {order.status === 'Cancelado' && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">
                            Este pedido ha sido cancelado
                          </p>
                        </div>
                        <button
                          onClick={() => handleWhatsAppCancel(order)}
                          className="w-full bg-slate-900 text-white text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                        >
                          <MessageCircle className="w-3 h-3 text-green-400" />
                          AVISAR CANCELACIÓN POR WHATSAPP
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <a 
            href="https://wa.me/5493875020884"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-slate-900 text-white block hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-500/20">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">¿Dudas con tu retiro?</p>
                <p className="text-sm font-black tracking-tight hover:underline decoration-orange-500 underline-offset-4">+54 9 387 502-0884</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};