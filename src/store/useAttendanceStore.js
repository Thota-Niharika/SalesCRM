import { create } from 'zustand';

const useAttendanceStore = create((set, get) => ({
  isPunchedIn: false,
  isOnBreak: false,
  inOfficeRadius: true,
  punchTime: null,

  punchIn: () => set({ isPunchedIn: true, punchTime: new Date() }),
  punchOut: () => set({ isPunchedIn: false, isOnBreak: false }),
  toggleBreak: () => set((state) => ({ isOnBreak: !state.isOnBreak })),
  setInOfficeRadius: (status) => {
    set({ inOfficeRadius: status });
    if (!status && get().isPunchedIn && !get().isOnBreak) {
      // Auto-start break if outside radius while punched in
      set({ isOnBreak: true });
    }
  }
}));

export default useAttendanceStore;
