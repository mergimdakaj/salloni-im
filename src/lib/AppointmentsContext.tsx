import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

export interface Appointment {
  id: string;
  client: string;
  serviceId: string;
  staffId: string;
  date: string; // ISO string
  status: 'booked' | 'completed' | 'cancelled';
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deleteAllAppointments: () => Promise<void>;
  isSlotBooked: (date: Date, time: string, staffId: string) => boolean;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Të dhënat fillestare (opsionale)
const INITIAL_APPOINTMENTS: Appointment[] = [];

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('salon_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    if (db) {
      const q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firebaseAppointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        setAppointments(firebaseAppointments);
        localStorage.setItem('salon_appointments', JSON.stringify(firebaseAppointments));
      }, (error) => {
        console.error("Error fetching appointments:", error);
      });

      return () => unsubscribe();
    }
  }, [db]);

  useEffect(() => {
    localStorage.setItem('salon_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = async (newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointmentData = {
      ...newAppointment,
      status: 'booked' as const,
      createdAt: new Date().toISOString()
    };

    const localAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
    };

    if (db) {
      try {
        await addDoc(collection(db, 'appointments'), appointmentData);
      } catch (e: any) {
        console.error("Error adding to Firebase: ", e);
        setAppointments(prev => [localAppointment, ...prev]);
      }
    } else {
      setAppointments(prev => [localAppointment, ...prev]);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (db) {
      try {
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'appointments', id));
      } catch (e: any) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      }
    } else {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  const deleteAllAppointments = async () => {
    if (db) {
      try {
        const { doc, writeBatch } = await import('firebase/firestore');
        const batch = writeBatch(db);
        appointments.forEach(apt => {
          batch.delete(doc(db, 'appointments', apt.id));
        });
        await batch.commit();
      } catch (e: any) {
        console.error("Error deleting all: ", e);
        setAppointments([]);
      }
    } else {
      setAppointments([]);
    }
  };

  const isSlotBooked = (date: Date, time: string, staffId: string) => {
    return appointments.some(appt => {
      const apptDate = new Date(appt.date);
      const checkDate = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      checkDate.setHours(hours, minutes, 0, 0);

      return (
        appt.staffId === staffId &&
        appt.status !== 'cancelled' &&
        apptDate.getFullYear() === checkDate.getFullYear() &&
        apptDate.getMonth() === checkDate.getMonth() &&
        apptDate.getDate() === checkDate.getDate() &&
        apptDate.getHours() === checkDate.getHours() &&
        apptDate.getMinutes() === checkDate.getMinutes()
      );
    });
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, deleteAppointment, deleteAllAppointments, isSlotBooked }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}
