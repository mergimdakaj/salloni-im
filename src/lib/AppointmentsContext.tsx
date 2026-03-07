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
  isSlotBooked: (date: Date, time: string, staffId: string) => boolean;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Initial mock data
const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '1', client: 'Vlora M.', serviceId: '2', staffId: '2', date: new Date().toISOString(), status: 'booked' },
];

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    // Initial load from localStorage to prevent flash of empty content if offline/loading
    const saved = localStorage.getItem('salon_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    if (db) {
      // Firebase Mode
      const q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firebaseAppointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        setAppointments(firebaseAppointments);
        // Sync to local storage for offline backup/faster initial load next time
        localStorage.setItem('salon_appointments', JSON.stringify(firebaseAppointments));
      }, (error) => {
        console.error("Error fetching appointments:", error);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage Mode (Fallback)
      localStorage.setItem('salon_appointments', JSON.stringify(appointments));
    }
  }, [db]); // Re-run if db connection changes (unlikely but safe)

  // Effect for LocalStorage mode updates
  useEffect(() => {
    if (!db) {
      localStorage.setItem('salon_appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const addAppointment = async (newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointmentData = {
      ...newAppointment,
      status: 'booked' as const,
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        await addDoc(collection(db, 'appointments'), appointmentData);
        // State updates automatically via onSnapshot
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Gabim gjatë ruajtjes së rezervimit. Ju lutem provoni përsëri.");
      }
    } else {
      // Local Fallback
      const appointment: Appointment = {
        ...appointmentData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setAppointments(prev => [...prev, appointment]);
    }
  };

  const isSlotBooked = (date: Date, time: string, staffId: string) => {
    return appointments.some(appt => {
      const apptDate = new Date(appt.date);
      const checkDate = new Date(date);
      
      // Parse time string "HH:mm"
      const [hours, minutes] = time.split(':').map(Number);
      checkDate.setHours(hours, minutes, 0, 0);

      return (
        appt.staffId === staffId &&
        appt.status !== 'cancelled' && // Don't block cancelled slots
        apptDate.getFullYear() === checkDate.getFullYear() &&
        apptDate.getMonth() === checkDate.getMonth() &&
        apptDate.getDate() === checkDate.getDate() &&
        apptDate.getHours() === checkDate.getHours() &&
        apptDate.getMinutes() === checkDate.getMinutes()
      );
    });
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, isSlotBooked }}>
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
