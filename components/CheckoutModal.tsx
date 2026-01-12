
import React, { useState, useMemo, useEffect } from 'react';
import { X, CheckCircle2, Clock, Phone, User, MessageCircle, AlertCircle, MapPin, ExternalLink, Store, Loader2, Banknote, QrCode, Copy } from 'lucide-react';
import { CartItem, OrderDetails, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onConfirm: (details: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onConfirm
}) => {
  const [details, setDetails] = useState<OrderDetails>({
    customerName: '',
    phone: '',
    pickupTime: '',
    notes: '',
    paymentMethod: 'Efectivo'
  });
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shopAddress = "Av. San Martín 532, Salta";
  const shopPhoneDisplay = "+54 9 387 502-0884";
  const shopPhoneLink = "5493875020884";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Av. San Martín 532, Salta, Argentina")}`;
  
  // Datos de pago
  const MP_ALIAS = "deliciasurbanas13";
  const MP_HOLDER = "Nahida Esther Leonor Zamar";

  const [orderSummary, setOrderSummary] = useState<{ items: CartItem[], total: number } | null>(null);

  const currentTotal = useMemo(() => 
    cartItems.reduce((s, i) => s + (i.price * i.quantity), 0)
  , [cartItems]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validar horario al abrir el modal o cambiar la hora
  const validateTime = (time: string) => {
    if (!time) {
      setTimeError(null);
      return false;
    }

    const day = new Date().getDay();
    if (day === 0) { // 0 es Domingo
      setTimeError("Lo sentimos, los domingos permanecemos cerrados.");
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Rangos permitidos en minutos
    // Mañana: 08:00 (480) a 15:00 (900)
    const isMorning = totalMinutes >= 480 && totalMinutes <= 900;
    
    // Tarde: 17:30 (1050) a 21:00 (1260)
    const isAfternoon = totalMinutes >= 1050 && totalMinutes <= 1260;

    if (!isMorning && !isAfternoon) {
      setTimeError("El local está cerrado a esta hora. (Horarios: 08-15hs y 17:30-21hs)");
      return false;
    }

    setTimeError(null);
    return true;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setDetails({ ...details, pickupTime: newTime });
    validateTime(newTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeError || !validateTime(details.pickupTime)) {
      return; // No enviar si hay error
    }
    
    setIsSubmitting(true);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    setOrderSummary({
      items: [...cartItems],
      total: currentTotal
    });
    onConfirm(details);
    setStep('success');
    setIsSubmitting(false);
  };

  const handleWhatsAppSend = () => {
    if (!orderSummary) return;

    const itemsText = orderSummary.items
      .map(item => {
        let line = `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-AR')})`;
        if (item.selectedFlavors) {
          line += `%0A  _(${item.selectedFlavors})_`;
        }
        return line;
      })
      .join('%0A');

    const paymentInfo = details.paymentMethod === 'Transferencia' 
        ? `💳 *Pago:* Transferencia/MP (Adjunto comprobante)`
        : `💵 *Pago:* Efectivo en el local`;

    const message = `¡Hola Delicias Urbanas! 👋%0A%0A` +
      `*NUEVO PEDIDO PARA RETIRAR*%0A` +
      `----------------------------------%0A` +
      `👤 *Cliente:* ${details.customerName}%0A` +
      `📞 *Teléfono:* ${details.phone}%0A` +
      `🕒 *Retiro:* ${details.pickupTime} hs%0A` +
      `----------------------------------%0A` +
      `*PRODUCTOS:*%0A${itemsText}%0A` +
      `----------------------------------%0A` +
      `💰 *TOTAL: $${orderSummary.total.toLocaleString('es-AR')}*%0A` +
      `${paymentInfo}%0A` +
      (details.notes ? `%0A📝 *Notas:* ${details.notes}` : '');

    window.open(`https://wa.me/${shopPhoneLink}?text=${message}`, '_blank');
    setWhatsappSent(true);
  };

  const handleClose = () => {
    setStep('form');
    setOrderSummary(null);
    setWhatsappSent(false);
    setTimeError(null);
    onClose();
  };

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) {
      const day = new Date().getDay();
      if (day === 0) setTimeError("Lo sentimos, los domingos permanecemos cerrados.");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={whatsappSent ? handleClose : undefined} />
      
      <div className="relative bg-[#18181b] sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden h-full sm:h-auto sm:max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200 border border-white/5">
        
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Header Fijo */}
            <div className="px-6 py-5 border-b border-white/5 bg-[#18181b] z-20 shadow-sm flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-white italic uppercase tracking-tighter flex items-center gap-2">
                  <Store className="w-6 h-6 text-orange-500" />
                  Datos de Retiro
                </h2>
                <button 
                  type="button" 
                  onClick={handleClose} 
                  className="p-2 -mr-2 text-slate-400 hover:text-white transition-transform duration-300 hover:scale-105"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Información del Local siempre visible */}
              <div className="grid grid-cols-2 gap-3">
                 <a 
                   href={googleMapsUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-[#0f1113] p-2.5 rounded-xl border border-white/5 hover:border-orange-500/50 transition-all group"
                 >
                    <div className="bg-[#18181b] p-1.5 rounded-lg shadow-sm group-hover:text-orange-500 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 group-hover:text-orange-500 transition-colors">Dirección</span>
                       <span className="text-xs font-bold text-slate-300 truncate leading-none">{shopAddress}</span>
                    </div>
                 </a>

                 <a 
                   href={`https://wa.me/${shopPhoneLink}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-[#0f1113] p-2.5 rounded-xl border border-white/5 hover:border-green-500/50 transition-all group"
                 >
                    <div className="bg-[#18181b] p-1.5 rounded-lg shadow-sm group-hover:text-green-500 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 group-hover:text-green-500 transition-colors">Contacto</span>
                       <span className="text-xs font-bold text-slate-300 truncate leading-none">{shopPhoneDisplay}</span>
                    </div>
                 </a>
              </div>
            </div>

            {/* Cuerpo Scrolleable */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0f1113]/50 custom-scrollbar space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5 ml-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      required
                      type="text"
                      value={details.customerName}
                      onChange={(e) => setDetails({ ...details, customerName: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-[#0f1113] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium transition-all placeholder-slate-600 disabled:opacity-50"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5 ml-1">
                    Tu Teléfono (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      required
                      type="tel"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-[#0f1113] text-white border border-white/10 rounded-xl px-4 py-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium transition-all placeholder-slate-600 disabled:opacity-50"
                      placeholder="Ej: 387 123456"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5 ml-1">
                    Horario de Retiro
                  </label>
                  <div className="relative">
                    <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${timeError ? 'text-red-400' : 'text-slate-500'}`} />
                    <input
                      required
                      type="time"
                      value={details.pickupTime}
                      onChange={handleTimeChange}
                      disabled={isSubmitting}
                      className={`w-full bg-[#0f1113] text-white border rounded-xl px-4 py-3.5 pl-10 focus:outline-none focus:ring-2 font-medium transition-all [color-scheme:dark] disabled:opacity-50 ${
                        timeError 
                          ? 'border-red-500/50 focus:ring-red-500/30' 
                          : 'border-white/10 focus:ring-orange-500/30'
                      }`}
                    />
                  </div>
                  {timeError ? (
                    <p className="text-xs font-bold text-red-400 mt-2 flex items-start gap-1.5 bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {timeError}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1.5 font-bold uppercase tracking-wide ml-1">
                      Horarios: 08-15hs y 17:30-21hs (Lun-Sáb)
                    </p>
                  )}
                </div>

                {/* Selección de Método de Pago */}
                <div>
                   <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                    Método de Pago
                   </label>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDetails({...details, paymentMethod: 'Efectivo'})}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${details.paymentMethod === 'Efectivo' ? 'bg-orange-500/10 border-orange-500 text-white' : 'bg-[#0f1113] border-white/5 text-slate-400 hover:bg-[#1f2125]'}`}
                      >
                         <Banknote className={`w-6 h-6 ${details.paymentMethod === 'Efectivo' ? 'text-orange-500' : 'text-slate-500'}`} />
                         <span className="text-xs font-bold uppercase">Efectivo al Retirar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetails({...details, paymentMethod: 'Transferencia'})}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${details.paymentMethod === 'Transferencia' ? 'bg-orange-500/10 border-orange-500 text-white' : 'bg-[#0f1113] border-white/5 text-slate-400 hover:bg-[#1f2125]'}`}
                      >
                         <QrCode className={`w-6 h-6 ${details.paymentMethod === 'Transferencia' ? 'text-orange-500' : 'text-slate-500'}`} />
                         <span className="text-xs font-bold uppercase">Transferencia / MP</span>
                      </button>
                   </div>

                   {/* Datos para Transferencia */}
                   {details.paymentMethod === 'Transferencia' && (
                     <div className="mt-4 p-4 bg-[#0f1113] rounded-xl border border-orange-500/30 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-3 text-orange-400">
                           <AlertCircle className="w-4 h-4" />
                           <p className="text-xs font-bold uppercase">Asegurá tu pedido pagando ahora</p>
                        </div>
                        <div className="space-y-3">
                           <div className="bg-[#18181b] p-3 rounded-lg border border-white/5">
                              <div className="mb-2 border-b border-white/5 pb-2 flex justify-between items-center">
                                 <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Alias</p>
                                    <p className="text-sm font-mono text-white tracking-wide select-all">{MP_ALIAS}</p>
                                 </div>
                                 <button type="button" onClick={() => copyToClipboard(MP_ALIAS)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                 </button>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase">Titular</p>
                                 <p className="text-xs font-medium text-white">{MP_HOLDER}</p>
                              </div>
                           </div>
                           <p className="text-[10px] text-slate-400 text-center italic">
                             Envia el comprobante junto al pedido por WhatsApp
                           </p>
                        </div>
                     </div>
                   )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5 ml-1">
                    Notas adicionales (Opcional)
                  </label>
                  <textarea
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full bg-[#0f1113] text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 min-h-[80px] resize-none font-medium text-sm transition-all placeholder-slate-600 disabled:opacity-50"
                    placeholder="¿Alguna aclaración sobre tu pedido?"
                  />
                </div>
              </div>
            </div>

            {/* Footer Fijo */}
            <div className="p-5 border-t border-white/5 bg-[#18181b] flex-shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-400">Total a Pagar</span>
                <span className="text-2xl font-black text-white tracking-tighter">
                  ${currentTotal.toLocaleString('es-AR')}
                </span>
              </div>
              <button
                type="submit"
                disabled={!!timeError || isSubmitting}
                className={`w-full text-black font-black py-4 rounded-xl shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
                  timeError || isSubmitting
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-white shadow-black/20 hover:bg-orange-600 hover:text-white hover:shadow-orange-600/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> PROCESANDO...
                  </>
                ) : (
                  <>
                    CONFIRMAR PEDIDO <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col h-full bg-[#18181b]">
            <div className="flex-1 overflow-y-auto p-8 text-center space-y-6 custom-scrollbar">
              {!whatsappSent ? (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-4 text-left animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="w-10 h-10 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-amber-500 font-black text-xs uppercase tracking-wider mb-1">¡Paso Obligatorio!</p>
                    <p className="text-amber-200 text-sm font-medium">Enviá el pedido por WhatsApp para confirmar tu retiro.</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="bg-green-500/20 p-4 rounded-full animate-in zoom-in">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tighter italic uppercase">
                  {whatsappSent ? '¡PEDIDO ENVIADO!' : 'CASI LISTO...'}
                </h2>
                <p className="text-slate-400 font-medium">
                  {whatsappSent 
                    ? "Ya enviamos tus datos. ¡Te esperamos en el local!"
                    : `Hacé clic abajo para enviar el pedido por WhatsApp.`
                  }
                </p>
                {details.paymentMethod === 'Transferencia' && !whatsappSent && (
                    <p className="text-xs text-orange-400 font-bold mt-2">No olvides adjuntar el comprobante</p>
                )}
              </div>
              
              <button
                onClick={handleWhatsAppSend}
                className={`w-full bg-green-600 text-white font-black py-5 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-green-600/30 flex items-center justify-center gap-3 active:scale-[0.98] ${!whatsappSent ? 'animate-pulse scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <MessageCircle className="w-7 h-7" />
                {whatsappSent ? 'RE-ENVIAR WHATSAPP' : 'ENVIAR POR WHATSAPP'}
              </button>

              <div className="bg-[#0f1113] p-4 rounded-2xl border border-white/5 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <p className="text-sm font-bold text-slate-200">Ubicación del local:</p>
                </div>
                <p className="text-xs text-slate-500 mb-3">{shopAddress}</p>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#18181b] border border-white/10 py-2 rounded-lg text-xs font-black text-slate-300 flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all duration-300 hover:scale-105 shadow-sm"
                >
                  CÓMO LLEGAR (GOOGLE MAPS) <ExternalLink className="w-3 h-3 text-orange-500" />
                </a>
              </div>

              {orderSummary && (
                <div className="bg-[#0f1113] p-5 rounded-2xl text-left border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Resumen del Pedido</p>
                  <ul className="text-xs space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {orderSummary.items.map((item, index) => (
                      <li key={`${item.id}-${index}`} className="flex flex-col border-b border-white/5 pb-1 mb-1">
                        <div className="flex justify-between">
                            <span className="text-slate-300 font-semibold">{item.quantity}x {item.name}</span>
                            <span className="font-bold text-white">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </div>
                        {item.selectedFlavors && (
                            <span className="text-[10px] text-slate-500 italic pl-2">{item.selectedFlavors}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-end">
                    <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">TOTAL</span>
                    <span className="font-black text-2xl text-orange-500 tracking-tight">${orderSummary.total.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer en paso de éxito */}
            <div className="p-5 border-t border-white/5 bg-[#18181b] z-20">
              {whatsappSent ? (
                <button
                  onClick={handleClose}
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-slate-200 transition-all duration-300 hover:scale-105 shadow-lg animate-in slide-in-from-bottom-4"
                >
                  VOLVER AL INICIO
                </button>
              ) : (
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest animate-pulse text-center">
                  Debes enviar el mensaje para finalizar
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
