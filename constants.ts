import { Product } from './types';

const SABORES_COMUNES = ['Jamón y Queso', 'Salame y Queso'];
const SABORES_ESPECIALES = [
  'Ternera, Tomate y Huevo',
  'Aceituna, Huevo y Queso',
  'Roquefort y Jamón',
  'Jamón Crudo y Queso'
];

export const MENU_ITEMS: Product[] = [
  // --- SECCIÓN POLLO ---
  {
    id: 'c1', // Cambiado de p1 a c1 para que no sea promo
    name: 'Pollo al Spiedo Entero',
    description: 'Nuestro clásico pollo asado lentamente al spiedo, tierno y sabroso.',
    price: 15000,
    category: 'Pollo',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p3',
    name: 'PROMO: Pollo Entero + Arroz',
    description: '¡Ideal familia! Pollo entero al spiedo con una guarnición de arroz incluida.',
    price: 17000,
    category: 'Pollo',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p2',
    name: 'PROMO: Medio Pollo + Arroz',
    description: '¡Oportunidad! Medio pollo al spiedo con una guarnición de arroz incluida.',
    price: 11000,
    category: 'Pollo',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600'
  },

  // --- SECCIÓN SÁNDWICHES (DOCENAS) ---
  {
    id: 'd1',
    name: 'Docena Sándwiches Comunes',
    description: '12 sándwiches de miga clásicos. Elegí entre Jamón y Queso o Salame y Queso.',
    price: 16500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?auto=format&fit=crop&q=80&w=600',
    customization: {
      groups: [
        { title: 'Elegí 12 sabores (Min 2)', limit: 12, minSelection: 2, options: SABORES_COMUNES }
      ]
    }
  },
  {
    id: 'd2',
    name: 'Docena Sándwiches Surtidos',
    description: 'La combinación perfecta: 4 Especiales y 8 Comunes a elección.',
    price: 20000,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1626078299034-75466d7412f1?auto=format&fit=crop&q=80&w=600',
    customization: {
      groups: [
        { title: 'Elegí 4 sabores especiales (Min 2)', limit: 4, minSelection: 2, options: SABORES_ESPECIALES },
        { title: 'Elegí 8 sabores comunes (Min 2)', limit: 8, minSelection: 2, options: SABORES_COMUNES }
      ]
    }
  },
  {
    id: 'd3',
    name: 'Docena Sándwiches Especiales',
    description: '12 sándwiches premium. Ternera, Roquefort, Crudo y más.',
    price: 27500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600',
    customization: {
      groups: [
        { title: 'Elegí 12 sabores especiales (Min 2)', limit: 12, minSelection: 2, options: SABORES_ESPECIALES }
      ]
    }
  },

  // --- SECCIÓN SÁNDWICHES (INDIVIDUALES) ---
  {
    id: 's1',
    name: 'Sándwich Jamón y Queso',
    description: 'Clásico sándwich con abundante jamón cocido y queso tybo.',
    price: 1500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907d3f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's2',
    name: 'Sándwich Salame y Queso',
    description: 'Sabroso salame milán y queso en fetas en pan fresco.',
    price: 1500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1626078299034-75466d7412f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's3',
    name: 'Sándwich Ternera y Queso',
    description: 'Finas fetas de ternera con queso derretido o natural.',
    price: 2000,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's4',
    name: 'Sándwich Ternera y Lechuga',
    description: 'Ternera seleccionada con lechuga fresca y crocante.',
    price: 2000,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1509722747041-619f383b8326?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's5',
    name: 'Ternera, Tomate y Huevo',
    description: 'Completo: ternera, tomate fresco y huevo duro picado.',
    price: 2500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1547496502-ffa222d79a80?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's6',
    name: 'Aceituna, Huevo y Queso',
    description: 'Opción vegetariana con aceitunas verdes, huevo y mucho queso.',
    price: 2500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1539252554452-da37fa1d9357?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's7',
    name: 'Roquefort y Jamón',
    description: 'Para los amantes del sabor fuerte: roquefort premium y jamón.',
    price: 2500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1559466273-d95e71deb58a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's8',
    name: 'Jamón Crudo y Queso',
    description: 'Jamón crudo estacionado y queso de campo.',
    price: 2500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's9',
    name: 'Sándwich de Milanesa',
    description: 'Clásico argentino: milanesa de carne en pan francés con lechuga y tomate.',
    price: 4500,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 's10',
    name: 'Baguette Especial',
    description: 'Sándwich en pan baguette con ingredientes a elección.',
    price: 3000,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
    customization: {
      groups: [
        {
          title: 'Elegí el relleno',
          limit: 1,
          minSelection: 1,
          options: ['Ternera, Tomate y Huevo', 'Ternera y Queso', 'Salame y Queso']
        }
      ]
    }
  },
  {
    id: 's11',
    name: 'Pebete',
    description: 'Clásico pan pebete suave con relleno a elección.',
    price: 1000,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600',
    customization: {
      groups: [
        {
          title: 'Elegí el relleno',
          limit: 1,
          minSelection: 1,
          options: ['Jamón y Queso', 'Salame y Queso']
        }
      ]
    }
  },

  // --- GUARNICIONES ---
  {
    id: 'g1',
    name: 'Guarnición de Arroz',
    description: 'Arroz blanco al dente, el acompañamiento ideal.',
    price: 3000,
    category: 'Guarniciones',
    image: 'https://images.unsplash.com/photo-1539755530862-00f623c00f52?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'g2',
    name: 'Papas Doradas al Horno',
    description: 'Papas cortadas en cubos, doradas al horno con un toque de romero.',
    price: 3000,
    category: 'Guarniciones',
    image: 'https://images.unsplash.com/photo-1619684784943-415eb634e062?auto=format&fit=crop&q=80&w=600'
  },

  // --- BEBIDAS ---
  {
    id: 'b1',
    name: 'Coca Cola 250ml',
    description: 'Botella de vidrio o lata pequeña bien helada.',
    price: 1500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b2',
    name: 'Fanta 250ml',
    description: 'Sabor naranja refrescante.',
    price: 1500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b3',
    name: 'Sprite 250ml',
    description: 'Sabor lima-limón.',
    price: 1500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1625772290748-39093c022a16?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b4',
    name: 'Coca Cola 350ml',
    description: 'Lata clásica.',
    price: 2000,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b5',
    name: 'Fanta 350ml',
    description: 'Lata de Fanta naranja.',
    price: 2000,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b6',
    name: 'Sprite 350ml',
    description: 'Lata de Sprite lima-limón.',
    price: 2000,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b7',
    name: 'Coca Cola 600ml',
    description: 'Botella individual.',
    price: 2500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1596803244618-8dce7f5067d8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b8',
    name: 'Fanta 600ml',
    description: 'Botella individual de Fanta.',
    price: 2500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b9',
    name: 'Sprite 600ml',
    description: 'Botella individual de Sprite.',
    price: 2500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1625772290748-39093c022a16?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'b10',
    name: 'Monster Energy',
    description: 'Cualquier sabor disponible (Original, Mango Loco, Ultra, etc).',
    price: 4500,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1538c?auto=format&fit=crop&q=80&w=600'
  }
];