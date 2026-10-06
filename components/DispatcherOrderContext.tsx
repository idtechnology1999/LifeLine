import React, { createContext, useContext, useMemo, useState } from 'react';

export type DeliveryOrder = {
  id: string;
  pickup: string;
  pickupAddress: string;
  pickupPhone: string;
  deliveryTo: string;
  customerName: string;
  customerPhone: string;
  distanceKm: number;
  earning: number;
  timeAgo: string;
  etaMin: number;
};

const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'o1',
    pickup: 'Emerald Pharmacy',
    pickupAddress: '123 Main Street, Gbagada Lagos',
    pickupPhone: '+234-814-123-4567',
    deliveryTo: '36, Yaba Onike Street, Gbagada',
    customerName: 'Sarah Johnson',
    customerPhone: '+234-802-555-1122',
    distanceKm: 2.3,
    earning: 2500,
    timeAgo: '2 min ago',
    etaMin: 6,
  },
  {
    id: 'o2',
    pickup: 'Emerald Pharmacy',
    pickupAddress: '123 Main Street, Gbagada Lagos',
    pickupPhone: '+234-814-123-4567',
    deliveryTo: '14, Randle Avenue, Surulere',
    customerName: 'David Okafor',
    customerPhone: '+234-806-987-6543',
    distanceKm: 4.1,
    earning: 3200,
    timeAgo: '8 min ago',
    etaMin: 11,
  },
];

export type OrderPhase = 'none' | 'active';
export type DeliveryPhase = 'toPickup' | 'toCustomer';

type DispatcherOrderContextValue = {
  orders: DeliveryOrder[];
  activeOrder: DeliveryOrder | null;
  phase: OrderPhase;
  deliveryPhase: DeliveryPhase;
  online: boolean;
  setOnline: (v: boolean) => void;
  acceptOrder: (id: string) => void;
  declineOrder: (id: string) => void;
  arrivedAtPickup: () => void;
  completeDelivery: () => void;
  clearActive: () => void;
};

const DispatcherOrderContext = createContext<DispatcherOrderContextValue | null>(null);

export function DispatcherOrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [phase, setPhase] = useState<OrderPhase>('none');
  const [deliveryPhase, setDeliveryPhase] = useState<DeliveryPhase>('toPickup');
  const [online, setOnline] = useState(true);

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? null,
    [orders, activeOrderId]
  );

  const value: DispatcherOrderContextValue = {
    orders,
    activeOrder,
    phase,
    deliveryPhase,
    online,
    setOnline,
    acceptOrder: (id) => {
      setActiveOrderId(id);
      setDeliveryPhase('toPickup');
      setPhase('active');
    },
    declineOrder: (id) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (activeOrderId === id) {
        setActiveOrderId(null);
        setPhase('none');
      }
    },
    arrivedAtPickup: () => {
      setDeliveryPhase('toCustomer');
    },
    completeDelivery: () => {
      if (activeOrderId) {
        setOrders((prev) => prev.filter((o) => o.id !== activeOrderId));
      }
      setActiveOrderId(null);
      setDeliveryPhase('toPickup');
      setPhase('none');
    },
    clearActive: () => {
      setActiveOrderId(null);
      setDeliveryPhase('toPickup');
      setPhase('none');
    },
  };

  return <DispatcherOrderContext.Provider value={value}>{children}</DispatcherOrderContext.Provider>;
}

export function useDispatcherOrder() {
  const ctx = useContext(DispatcherOrderContext);
  if (!ctx) throw new Error('useDispatcherOrder must be used within DispatcherOrderProvider');
  return ctx;
}
