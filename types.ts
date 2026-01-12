
export type Category = 'Pollo' | 'Sándwiches' | 'Guarniciones' | 'Bebidas' | 'Promociones';

export type OrderStatus = 'Pendiente' | 'Cancelado' | 'Preparando';

export interface FlavorGroup {
  title: string;
  limit: number;
  minSelection?: number; // Minimum quantity required per flavor (e.g., 4)
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  customization?: {
    groups: FlavorGroup[];
  };
}

export interface CartItem extends Product {
  quantity: number;
  selectedFlavors?: string; // Texto formateado: "6x Jamón, 6x Queso"
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  pickupTime: string;
  notes?: string;
}

export interface Order {
  id: string;
  details: OrderDetails;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: OrderStatus;
}
