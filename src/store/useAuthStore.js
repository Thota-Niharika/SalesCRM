import { create } from 'zustand';

// Mock user data for the three roles
export const MOCK_USERS = {
  associate: { id: 1, name: 'Alex Associate', email: 'alex@crm.com', role: 'Associate', reportingManager: 'manager1' },
  manager: { id: 2, name: 'Mike Manager', email: 'mike@crm.com', role: 'Manager', team: ['alex@crm.com'] },
  admin: { id: 3, name: 'Adam Admin', email: 'admin@crm.com', role: 'Admin' },
};

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  role: null, // 'Associate', 'Manager', 'Admin'
  
  login: (email, password) => {
    // Mock login logic
    let mockUser = null;
    if (email.includes('admin')) mockUser = MOCK_USERS.admin;
    else if (email.includes('manager')) mockUser = MOCK_USERS.manager;
    else if (email.includes('alex')) mockUser = MOCK_USERS.associate;
    else mockUser = MOCK_USERS.associate; // Default fallback

    set({ user: mockUser, isAuthenticated: true, role: mockUser.role });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, role: null });
  },

  hasPermission: (permission) => {
    const { role } = get();
    if (!role) return false;
    if (role === 'Admin') return true;

    // Define basic permission logic
    const permissions = {
      'Approve Payment': false,
      'Assign Lead': role === 'Manager',
    };
    return permissions[permission] || false;
  }
}));

export default useAuthStore;
