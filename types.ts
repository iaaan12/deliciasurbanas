
export type Category = 'Pollo' | 'Sándwiches' | 'Guarniciones' | 'Bebidas';

export type OrderStatus = 'Pendiente' | 'Cancelado' | 'Preparando';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
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
