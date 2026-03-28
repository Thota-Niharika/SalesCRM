import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Home, 
  CreditCard, 
  BookOpen, 
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const role = useAuthStore((state) => state.role);

  // Define navigation options
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Associate', 'Manager', 'Admin'] },
    { name: 'Leads', path: '/leads', icon: Users, roles: ['Associate', 'Manager', 'Admin'] },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, roles: ['Associate', 'Manager'] },
    { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['Manager', 'Admin'] },
    { name: 'Students & PRM', path: '/students', icon: BookOpen, roles: ['Manager', 'Admin'] },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm relative z-10 transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
          CRM Hub
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">{role} Portal</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {filteredNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                )} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="px-3 py-3 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50">
          <p className="text-sm font-medium text-indigo-900">Need Help?</p>
          <p className="text-xs text-indigo-600/70 mt-0.5">Contact Support</p>
        </div>
      </div>
    </aside>
  );
}
