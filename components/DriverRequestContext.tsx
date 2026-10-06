import React, { createContext, useContext, useMemo, useState } from 'react';

export type EmergencyRequest = {
  id: string;
  title: string;
  timeAgo: string;
  price: number;
  pickup: string;
  destination: string;
  distanceMi: number;
  durationMin: number;
  patientName: string;
  patientPhone: string;
};

const INITIAL_REQUESTS: EmergencyRequest[] = [
  {
    id: 'r1',
    title: 'Cardiac Emergency',
    timeAgo: '2 min ago',
    price: 6500,
    pickup: '36, Adesakin Avenue Gbagada',
    destination: "St. Mary's Hospital",
    distanceMi: 2.3,
    durationMin: 6,
    patientName: 'Sarah Johnson',
    patientPhone: '+234-814-123-4567',
  },
  {
    id: 'r2',
    title: 'Accident/Trauma',
    timeAgo: '5 min ago',
    price: 9500,
    pickup: '23, Isawo road Ikorodu',
    destination: 'Oak General Hospital',
    distanceMi: 3.8,
    durationMin: 6,
    patientName: 'David Okafor',
    patientPhone: '+234-802-555-1122',
  },
];

export type RequestPhase = 'none' | 'detail' | 'negotiate' | 'active';

type DriverRequestContextValue = {
  requests: EmergencyRequest[];
  activeRequest: EmergencyRequest | null;
  phase: RequestPhase;
  online: boolean;
  setOnline: (v: boolean) => void;
  viewDetails: (id: string) => void;
  decline: (id: string) => void;
  goToNegotiate: () => void;
  goBackToDetail: () => void;
  acceptSystemPrice: () => void;
  sendOffer: (amount: number) => void;
  arrivedAtPickup: () => void;
  clearActive: () => void;
};

const DriverRequestContext = createContext<DriverRequestContextValue | null>(null);

export function DriverRequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<EmergencyRequest[]>(INITIAL_REQUESTS);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [phase, setPhase] = useState<RequestPhase>('none');
  const [online, setOnline] = useState(true);
  const [offerPrice, setOfferPrice] = useState<number | null>(null);

  const baseRequest = requests.find((r) => r.id === activeRequestId) ?? null;
  const activeRequest = useMemo(() => {
    if (!baseRequest) return null;
    return offerPrice != null && phase !== 'detail' ? { ...baseRequest, price: offerPrice } : baseRequest;
  }, [baseRequest, offerPrice, phase]);

  const value: DriverRequestContextValue = {
    requests,
    activeRequest,
    phase,
    online,
    setOnline,
    viewDetails: (id) => {
      setActiveRequestId(id);
      setOfferPrice(null);
      setPhase('detail');
    },
    decline: (id) => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (activeRequestId === id) {
        setActiveRequestId(null);
        setPhase('none');
      }
    },
    goToNegotiate: () => setPhase('negotiate'),
    goBackToDetail: () => setPhase('detail'),
    acceptSystemPrice: () => setPhase('active'),
    sendOffer: (amount) => {
      setOfferPrice(amount);
      setPhase('active');
    },
    arrivedAtPickup: () => {
      if (activeRequestId) {
        setRequests((prev) => prev.filter((r) => r.id !== activeRequestId));
      }
      setActiveRequestId(null);
      setOfferPrice(null);
      setPhase('none');
    },
    clearActive: () => {
      setActiveRequestId(null);
      setOfferPrice(null);
      setPhase('none');
    },
  };

  return <DriverRequestContext.Provider value={value}>{children}</DriverRequestContext.Provider>;
}

export function useDriverRequest() {
  const ctx = useContext(DriverRequestContext);
  if (!ctx) throw new Error('useDriverRequest must be used within DriverRequestProvider');
  return ctx;
}
