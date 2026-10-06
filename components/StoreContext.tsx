import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  usageNotes: string;
  price: number;
  stock: number;
  expiresAt: string | null;
  available: boolean;
  emoji: string;
  addedAgo: string;
  imageUris: string[];
};

export type OrderItem = { name: string; qty: number; lineTotal: number };

export type NewOrder = {
  id: string;
  customerName: string;
  timeAgo: string;
  urgent: boolean;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryFee: number;
};

export type ActiveOrderStatus = 'Preparing' | 'Ready' | 'Enroute';

export type ActiveOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  status: ActiveOrderStatus;
  statusNote: string;
  deliveryAddress: string;
  deliveryNote: string;
  etaMinutes: number;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Blood Pressure Monitor',
    category: 'Medical Equipment',
    description: 'Digital blood pressure monitor for home and clinical use.',
    usageNotes: '',
    price: 12500,
    stock: 15,
    expiresAt: null,
    available: true,
    emoji: '🩺',
    addedAgo: '2 hours ago',
    imageUris: [],
  },
  {
    id: 'p2',
    name: 'Paracetamol 500mg',
    category: 'Drugs',
    description: 'Pain relief and fever reducer tablets.',
    usageNotes: 'Take 1-2 tablets every 4-6 hours as needed.',
    price: 1500,
    stock: 8,
    expiresAt: 'Aug 15, 2026',
    available: true,
    emoji: '💊',
    addedAgo: '5 hours ago',
    imageUris: [],
  },
  {
    id: 'p3',
    name: 'Surgical Masks (Box of 50)',
    category: 'Consumables',
    description: 'Disposable 3-ply surgical masks, box of 50.',
    usageNotes: '',
    price: 1000,
    stock: 0,
    expiresAt: 'Jan 30, 2027',
    available: false,
    emoji: '😷',
    addedAgo: '1 day ago',
    imageUris: [],
  },
  {
    id: 'p4',
    name: 'Digital Thermometer',
    category: 'Medical Equipment',
    description: 'Fast-read digital thermometer.',
    usageNotes: '',
    price: 2500,
    stock: 42,
    expiresAt: null,
    available: true,
    emoji: '🌡️',
    addedAgo: '3 hours ago',
    imageUris: [],
  },
  {
    id: 'p5',
    name: 'Ibuprofen 200mg',
    category: 'Drugs',
    description: 'Anti-inflammatory pain relief tablets.',
    usageNotes: 'Take with food.',
    price: 2500,
    stock: 5,
    expiresAt: 'Mar 20, 2026',
    available: true,
    emoji: '💊',
    addedAgo: '6 hours ago',
    imageUris: [],
  },
];

const INITIAL_NEW_ORDERS: NewOrder[] = [
  {
    id: 'o1',
    customerName: 'Sarah Johnson',
    timeAgo: '3 min ago',
    urgent: false,
    items: [
      { name: 'Blood Pressure Monitor', qty: 1, lineTotal: 9500 },
      { name: 'Paracetamol 500mg', qty: 2, lineTotal: 2500 },
    ],
    deliveryAddress: '36, Yaba onike street Gbagada',
    deliveryFee: 1500,
  },
  {
    id: 'o2',
    customerName: 'Michael Chen',
    timeAgo: '8 min ago',
    urgent: true,
    items: [
      { name: 'First Aid Kit', qty: 1, lineTotal: 5400 },
      { name: 'Thermometer Digital', qty: 1, lineTotal: 14600 },
    ],
    deliveryAddress: '456 Oak Avenue, Gbagada Lagos',
    deliveryFee: 500,
  },
];

const INITIAL_ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 'a1',
    customerName: 'Emma Wilson',
    customerPhone: '+234-813-220-9981',
    itemsCount: 3,
    total: 7500,
    status: 'Preparing',
    statusNote: '15 min',
    deliveryAddress: '14, Allen Avenue, Ikeja Lagos',
    deliveryNote: '',
    etaMinutes: 15,
  },
  {
    id: 'a2',
    customerName: 'James Brown',
    customerPhone: '+234-802-441-7723',
    itemsCount: 2,
    total: 4390,
    status: 'Ready',
    statusNote: 'Ready for Delivery',
    deliveryAddress: '9, Adeniran Ogunsanya St, Surulere Lagos',
    deliveryNote: '',
    etaMinutes: 0,
  },
  {
    id: 'a3',
    customerName: 'Sarah Johnson',
    customerPhone: '+234-123-4567',
    itemsCount: 3,
    total: 23500,
    status: 'Enroute',
    statusNote: 'Out for Delivery',
    deliveryAddress: '123 Main Street, Apt 4B, Gbagada Lagos',
    deliveryNote: 'Please call when arriving, apartment building has locked entrance',
    etaMinutes: 12,
  },
];

type NewProductInput = Omit<Product, 'id' | 'addedAgo'>;

type StoreContextValue = {
  storeOnline: boolean;
  setStoreOnline: (v: boolean) => void;
  products: Product[];
  addProduct: (input: NewProductInput) => Product;
  updateProduct: (id: string, input: NewProductInput) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  toggleAvailable: (id: string) => void;
  newOrders: NewOrder[];
  activeOrders: ActiveOrder[];
  acceptOrder: (id: string) => void;
  declineOrder: (id: string) => void;
  completeDelivery: (id: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [storeOnline, setStoreOnline] = useState(true);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [newOrders, setNewOrders] = useState<NewOrder[]>(INITIAL_NEW_ORDERS);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(INITIAL_ACTIVE_ORDERS);

  const value: StoreContextValue = {
    storeOnline,
    setStoreOnline,
    products,
    addProduct: (input) => {
      const product: Product = { ...input, id: `p${Date.now()}`, addedAgo: 'Just now' };
      setProducts((prev) => [product, ...prev]);
      return product;
    },
    updateProduct: (id, input) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)));
    },
    deleteProduct: (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    adjustStock: (id, delta) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
      );
    },
    toggleAvailable: (id) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
    },
    newOrders,
    activeOrders,
    acceptOrder: (id) => {
      const order = newOrders.find((o) => o.id === id);
      if (!order) return;
      setNewOrders((prev) => prev.filter((o) => o.id !== id));
      const total = order.items.reduce((s, i) => s + i.lineTotal, 0) + order.deliveryFee;
      setActiveOrders((prev) => [
        {
          id: order.id,
          customerName: order.customerName,
          customerPhone: '',
          itemsCount: order.items.length,
          total,
          status: 'Preparing',
          statusNote: '20 min',
          deliveryAddress: order.deliveryAddress,
          deliveryNote: '',
          etaMinutes: 20,
        },
        ...prev,
      ]);
    },
    declineOrder: (id) => {
      setNewOrders((prev) => prev.filter((o) => o.id !== id));
    },
    completeDelivery: (id) => {
      setActiveOrders((prev) => prev.filter((o) => o.id !== id));
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
