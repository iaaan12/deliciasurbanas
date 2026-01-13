import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { OrdersDrawer } from './components/OrdersDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FlavorModal } from './components/FlavorModal';
import { LetsWorkTogether } from './components/ui/lets-work-section';
import { MENU_ITEMS } from './constants';
import { Product, CartItem, Category, Order, OrderDetails } from './types';
import { Search, Flame, Sandwich, IceCream, Pizza, Instagram, MapPin, Phone, Clock, ShoppingCart } from 'lucide-react';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const logoUrl = "https://i.imgur.com/RUVPwCt.png";

  useEffect(() => {
    const savedOrders = localStorage.getItem('delicias_urbanas_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to load orders", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('delicias_urbanas_orders', JSON.stringify(orders));
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'Pendiente' || o.status === 'Preparando').length;
  }, [orders]);

  const addToCart = (product: Product, selectedFlavors?: string) => {
    setCart(prev => {
      if (selectedFlavors) {
          const existing = prev.find(item => item.id === product.id && item.selectedFlavors === selectedFlavors);
          if (existing) {
             return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...product, quantity: 1, selectedFlavors }];
      }

      const existing = prev.find(item => item.id === product.id && !item.selectedFlavors);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantitySafe = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
      }).filter(item => item.quantity > 0));
  };
  
  const addToCartWithCustomization = (product: Product, selectedFlavors: string) => {
      const customItem = {
          ...product,
          id: `${product.id}-${Date.now()}`,
          quantity: 1,
          selectedFlavors
      };
      setCart(prev => [...prev, customItem]);
  };
  
  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateOrder = (details: OrderDetails) => {
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      details,
      items: [...cart],
      total,
      timestamp: Date.now(),
      status: 'Pendiente'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelado' as const } : order
      );
      localStorage.setItem('delicias_urbanas_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const displayCategories: Category[] = ['Pollo', 'Sándwiches', 'Guarniciones', 'Bebidas'];

  const categories: { name: Category | 'Todos'; icon: any }[] = [
    { name: 'Todos', icon: Pizza },
    { name: 'Pollo', icon: Flame },
    { name: 'Sándwiches', icon: Sandwich },
    { name: 'Guarniciones', icon: IceCream },
    { name: 'Bebidas', icon: IceCream },
  ];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const currentTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen pb-20 bg-[#0f1113] overflow-x-hidden relative">
      {/* Top Banner */}
      <a 
        href="https://wa.me/5493875020884" 
        target="_blank" 
        rel="noreferrer"
        className="block w-full bg-[#1c4532] hover:bg-[#255b42] text-white text-[10px] sm:text-xs font-bold text-center py-2.5 px-4 transition-colors tracking-wide uppercase border-b border-[#2a6b4d]"
      >
        Para pedidos más grandes o tortas saladas, comunicarse directamente por WhatsApp
      </a>

      <Header 
        cartCount={totalItems}
        ordersCount={activeOrdersCount}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        logoUrl={logoUrl}
      />

      {/* HERO SECTION */}
      <section className="relative bg-[#0f1113] text-white py-20 sm:py-32 overflow-hidden border-b border-white/5">
        
        {/* BACKGROUND IMAGE START */}
        <div className="absolute inset-0 z-0">
            <img 
                 src="https://i.imgur.com/ibEvRnc.jpeg" 
                 alt="Fondo Delicias Urbanas" 
                 className="w-full h-full object-cover opacity-60" 
                 style={{ objectPosition: 'center 60%' }}
            />
            {/* Gradient Overlay para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1113]/95 via-[#0f1113]/80 to-[#0f1113]/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1113] via-transparent to-transparent"></div>
        </div>
        {/* BACKGROUND IMAGE END */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 flex items-center justify-center relative z-20">
              <img 
                src={logoUrl} 
                alt="Logo Delicias Urbanas" 
                className="w-full h-full object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'; }}
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight uppercase animate-in slide-in-from-left-4 duration-500 text-white drop-shadow-2xl font-heading">
                  DELICIAS URBANAS
                </h2>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="flex items-center gap-2 text-slate-200 bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 cursor-default hover:scale-105 backdrop-blur-sm">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold">Av. San Martín 532, Salta</span>
                 </div>
                 <a href="https://instagram.com/delicias.urbanas" target="_blank" className="flex items-center gap-2 text-slate-200 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-bold">@delicias.urbanas</span>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-[#18181b] rounded-[2.5rem] shadow-2xl p-4 sm:p-8 border border-white/5">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="¿Qué delicia buscás hoy?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f1113] border border-white/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium text-lg transition-all text-white placeholder-slate-600"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 whitespace-nowrap flex items-center gap-3 text-sm active:scale-95 hover:scale-105 ${
                    selectedCategory === cat.name
                      ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40'
                      : 'bg-[#0f1113] text-slate-400 hover:bg-[#27272a]'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-8">
            {selectedCategory === 'Todos' ? 'NUESTRO MENÚ' : selectedCategory.toUpperCase()}
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-[#18181b] rounded-3xl border-2 border-dashed border-white/5">
              <p className="text-slate-500 text-lg font-bold">No encontramos esa delicia...</p>
              <button
                onClick={() => {setSearchQuery(''); setSelectedCategory('Todos');}}
                className="mt-4 text-orange-600 font-extrabold hover:underline transition-all duration-300 hover:scale-105 inline-block"
              >
                Ver todo el menú
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {displayCategories.map(cat => {
                if (selectedCategory !== 'Todos' && selectedCategory !== cat) return null;
                const items = groupedItems[cat];
                if (!items || items.length === 0) return null;

                return (
                  <div key={cat} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 mb-8">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter shrink-0">
                         {cat}
                       </h3>
                       <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent w-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {items.map(item => (
                        <ProductCard 
                          key={item.id} 
                          product={item} 
                          onAddToCart={addToCart} 
                          onCustomize={(p) => setCustomizingProduct(p)} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <LetsWorkTogether />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantitySafe}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        onAddItem={addToCart}
      />

      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onCancelOrder={handleCancelOrder}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onConfirm={handleCreateOrder}
      />

      <FlavorModal 
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        product={customizingProduct}
        onConfirm={addToCartWithCustomization}
      />

      {totalItems > 0 && (
        <div className="fixed bottom-6 left-6 z-[90] animate-in slide-in-from-bottom-4 fade-in duration-500">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center gap-3 bg-white text-[#1A1A1A] pl-4 pr-6 py-4 rounded-full shadow-2xl shadow-[#121212]/50 border border-slate-700 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-orange-500/20"
          >
            <div className="relative">
              <div className="bg-orange-500 rounded-full p-2 text-white group-hover:bg-orange-400 transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 bg-[#18181b] text-orange-600 text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Tu Pedido</span>
              <span className="text-sm font-black text-[#1A1A1A] leading-none">${currentTotal.toLocaleString('es-AR')}</span>
            </div>
          </button>
        </div>
      )}

      <footer className="bg-[#0f1113] text-slate-500 py-20 mt-0 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left">
              <div>
                 <div className="flex items-center gap-3 mb-6 justify-center sm:justify-start">
                    <img src={logoUrl} className="w-10 h-10 rounded-full border border-orange-500" alt="logo" referrerPolicy="no-referrer" />
                    <h1 className="text-white font-black italic uppercase text-xl">DELICIAS <span className="text-orange-500">URBANAS</span></h1>
                 </div>
                 <p className="text-sm text-slate-400">Sabores auténticos en el corazón de Salta.</p>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs flex items-center gap-2 justify-center sm:justify-start">
                    <Clock className="w-4 h-4 text-orange-500" /> Horarios
                 </h4>
                 <div className="space-y-2">
                    <p className="text-sm text-slate-300 font-bold">Lunes a Sábado</p>
                    <p className="text-sm text-slate-400">08:00 - 15:00 hs</p>
                    <p className="text-sm text-slate-400">17:30 - 21:00 hs</p>
                 </div>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs flex items-center gap-2 justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 text-orange-500" /> Ubicación
                 </h4>
                 <p className="text-sm text-slate-400">Av. San Martín 532, Salta</p>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs flex items-center gap-2 justify-center sm:justify-start">
                    <Phone className="w-4 h-4 text-orange-500" /> Contacto
                 </h4>
                 <p className="text-sm text-slate-400 mb-2">+54 9 387 502-0884</p>
                 <a 
                   href="https://instagram.com/delicias.urbanas" 
                   target="_blank" 
                   rel="noreferrer"
                   className="text-sm text-orange-500 hover:text-white transition-colors flex items-center gap-2 justify-center sm:justify-start font-bold"
                 >
                    <Instagram className="w-4 h-4" /> Seguir en Instagram
                 </a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;