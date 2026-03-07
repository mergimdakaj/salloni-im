import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES as INITIAL_SERVICES, STAFF as INITIAL_STAFF } from './data';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: 'Flokë' | 'Thonjtë' | 'Grim' | 'Fytyrë' | 'Trup' | 'Nuse';
  color: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  fallbackAvatar: string;
  bio: string;
  experience: number;
  diplomas: string[];
  serviceIds: string[];
  isSenior?: boolean;
}

interface DataContextType {
  services: Service[];
  staff: Staff[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('salon_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    // Changed key to v2 to force refresh of staff data (including new image paths)
    const saved = localStorage.getItem('salon_staff_v2');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  useEffect(() => {
    localStorage.setItem('salon_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('salon_staff_v2', JSON.stringify(staff));
  }, [staff]);

  const addService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: Math.random().toString(36).substr(2, 9)
    };
    setServices(prev => [...prev, service]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const newMember: Staff = {
      ...newStaff,
      id: Math.random().toString(36).substr(2, 9)
    };
    setStaff(prev => [...prev, newMember]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <DataContext.Provider value={{ services, staff, addService, updateService, addStaff, updateStaff, deleteStaff }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
