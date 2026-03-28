import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import useNotificationStore from '../../store/useNotificationStore';
import { Bell, LogOut, User, MapPin, Coffee, PlaySquare, CheckSquare } from 'lucide-react';
import { cn } from './Sidebar';

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const { isPunchedIn, isOnBreak, inOfficeRadius, punchIn, punchOut, toggleBreak } = useAttendanceStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 sticky top-0">
      
      {/* Left section: Context or search */}
      <div className="flex items-center gap-4">
        {isPunchedIn && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-300",
            inOfficeRadius 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-amber-50 text-amber-700 border-amber-200"
          )}>
            <MapPin className="w-3.5 h-3.5" />
            {inOfficeRadius ? 'Inside Office Radius' : 'Outside Radius - Break Auto-started'}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        
        {/* Attendance Controls */}
        <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
          {!isPunchedIn ? (
            <button 
              onClick={punchIn}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95"
            >
              <CheckSquare className="w-4 h-4" />
              Punch In
            </button>
          ) : (
            <>
              <button 
                onClick={toggleBreak}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95 border",
                  isOnBreak 
                    ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                )}
              >
                {isOnBreak ? <PlaySquare className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                {isOnBreak ? 'Resume Work' : 'Break'}
              </button>
              <button 
                onClick={punchOut}
                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95"
              >
                Punch Out
              </button>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 leading-none">{user?.name || 'Guest'}</p>
            <p className="text-xs text-gray-500 mt-1">{user?.role || 'Sign In'}</p>
          </div>

          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right transform scale-95 group-hover:scale-100 z-50">
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 font-medium px-2 pb-1">Account</p>
              <p className="text-sm font-medium text-gray-900 px-2 truncate">{user?.email}</p>
            </div>
            <div className="p-1">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
