import { create } from "zustand";
import { getTechnicians } from "../actions/employeeActions";

type Technician = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
};

type BookingState = {
  bookingToEdit: string | null;
  setBookingToEdit: (bookingId: string) => void;
};

const useBookingStore = create<BookingState>((set) => ({
  bookingToEdit: null,
  setBookingToEdit: async (bookingId: string) => {
    set({ bookingToEdit: bookingId });
  },
}));

export default useBookingStore;

type TechnicianState = {
    technicians: Technician[]|null,
    setTechnicans : () => void
}
const useTechnicanStore = create<TechnicianState> ((set) => ({
    technicians: null,
    setTechnicans: async() =>{
        const technicians = await getTechnicians()
        set({technicians:technicians})
    }
}))