import React, { useState, useEffect } from "react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

export function LetsWorkTogether() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const [status, setStatus] = useState<{ isOpen: boolean; text: string; color: string }>({
    isOpen: false,
    text: "Cargando horario...",
    color: "bg-slate-400"
  });

  useEffect(() => {
    const checkShopStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ...
      const totalMinutes = now.getHours() * 60 + now.getMinutes();

      // Horarios en minutos
      const morningOpen = 8 * 60;       // 08:00
      const morningClose = 15 * 60;     // 15:00
      const afternoonOpen = 17 * 60 + 30; // 17:30
      const afternoonClose = 21 * 60;   // 21:00

      const isSunday = day === 0;

      // Verificar si está abierto
      if (!isSunday) {
        if ((totalMinutes >= morningOpen && totalMinutes < morningClose) || 
            (totalMinutes >= afternoonOpen && totalMinutes < afternoonClose)) {
          setStatus({
            isOpen: true,
            text: "¡ABIERTO AHORA!",
            color: "bg-emerald-500"
          });
          return;
        }
      }

      // Si llegamos acá, está cerrado. Calcular próxima apertura.
      let targetDate = new Date(now);
      let foundNextSlot = false;

      // Caso 1: Es día de semana y es temprano (antes de las 8)
      if (!isSunday && totalMinutes < morningOpen) {
        targetDate.setHours(8, 0, 0, 0);
        foundNextSlot = true;
      }
      // Caso 2: Es día de semana y es siesta (entre 15:00 y 17:30)
      else if (!isSunday && totalMinutes >= morningClose && totalMinutes < afternoonOpen) {
        targetDate.setHours(17, 30, 0, 0);
        foundNextSlot = true;
      }
      // Caso 3: Es tarde o es domingo, buscar el próximo día a las 8 AM
      else {
        // Avanzar días hasta encontrar uno que no sea domingo (Lunes)
        // Si es sábado a la noche -> Domingo (skip) -> Lunes
        // Si es domingo -> Lunes
        // Si es Lunes a la noche -> Martes
        do {
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(8, 0, 0, 0);
        } while (targetDate.getDay() === 0); // 0 es domingo
        foundNextSlot = true;
      }

      if (foundNextSlot) {
        const diff = targetDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        setStatus({
          isOpen: false,
          text: `CERRADO • ABRE EN ${timeString}`,
          color: "bg-red-500"
        });
      }
    };

    const timer = setInterval(checkShopStatus, 1000);
    checkShopStatus(); // Ejecutar inmediatamente

    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  const handleBookCall = () => {
    window.open("https://wa.me/5493875020884", "_blank");
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-20 bg-[#0f1113] overflow-hidden border-t border-white/5">
      <div className="relative flex flex-col items-center gap-12 max-w-4xl w-full">
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
              }}
            >
              Excelente Elección
            </span>
            <h3
              className="text-3xl font-black tracking-tight text-white sm:text-4xl italic uppercase"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
              }}
            >
              Hablemos por WhatsApp
            </h3>
          </div>

          <button
            onClick={handleBookCall}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer hover:scale-105"
          >
            <div className="relative flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3 transition-all duration-500 sm:px-8 sm:py-4 shadow-xl bg-orange-500 border-orange-500 hover:bg-white hover:border-white active:scale-95">
              <Calendar className={`size-4 sm:size-5 transition-colors duration-300 ${isButtonHovered ? "text-black" : "text-white"}`} />
              <span className={`text-sm font-black tracking-wide sm:text-base transition-colors duration-300 ${isButtonHovered ? "text-black" : "text-white"}`}>
                Consultar Fecha
              </span>
              <ArrowUpRight className={`size-4 sm:size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-colors duration-300 ${isButtonHovered ? "text-black" : "text-white"}`} />
            </div>
          </button>
        </div>

        {/* Indicador de estado dinámico */}
        <div
          className="flex items-center gap-3 transition-all duration-500 bg-[#18181b] px-4 py-2 rounded-full border border-white/5 shadow-sm"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(-20px)" : "translateY(0)",
          }}
        >
          <span className="relative flex size-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className={`relative inline-flex size-2 rounded-full transition-colors duration-500 ${status.color}`} />
          </span>
          <span className={`text-xs sm:text-sm font-black tracking-widest uppercase ${status.isOpen ? 'text-slate-400' : 'text-red-400'} tabular-nums`}>
            {status.text}
          </span>
        </div>

        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2
              className="relative text-center text-5xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] uppercase italic"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  ¿Hacemos
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  <span className="text-orange-500">un pedido?</span>
                </span>
              </span>
            </h2>

            <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all duration-500 ease-out"
                style={{
                  borderColor: isHovered ? "#ffffff" : "#52525b",
                  backgroundColor: isHovered ? "#ffffff" : "transparent",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
              />
              <ArrowUpRight
                className="size-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-7"
                style={{
                  color: isHovered ? "#000000" : "#ffffff",
                  transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}