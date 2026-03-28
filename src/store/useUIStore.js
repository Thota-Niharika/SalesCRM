import { create } from 'zustand';

const useUIStore = create((set) => ({
  isProfileSidebarOpen: false,
  toggleProfileSidebar: () => set((state) => ({ isProfileSidebarOpen: !state.isProfileSidebarOpen })),
  closeProfileSidebar: () => set({ isProfileSidebarOpen: false }),
}));

export default useUIStore;
