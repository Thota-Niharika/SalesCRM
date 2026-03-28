import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import useNotificationStore from '../../store/useNotificationStore';
import useUIStore from '../../store/useUIStore';
import { Bell, LogOut, User, MapPin, Coffee, PlaySquare, CheckSquare, X } from 'lucide-react';
import { cn } from './Sidebar';
import { formatDistanceToNow } from 'date-fns';

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const { isPunchedIn, isOnBreak, inOfficeRadius, punchIn, punchOut, toggleBreak } = useAttendanceStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const { toggleProfileSidebar } = useUIStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const navigate = useNavigate();

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
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "relative p-2 transition-colors rounded-full hover:bg-gray-100",
              isNotificationsOpen ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <button 
                    onClick={() => { markAllAsRead(); setIsNotificationsOpen(false); }}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-2">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-medium">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={cn(
                        "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-2",
                        n.read ? "border-transparent opacity-60" : "border-indigo-600 bg-indigo-50/30"
                      )}>
                        <p className={cn("text-sm leading-tight mb-1", n.read ? "text-gray-600" : "font-bold text-gray-900")}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 text-center">
                  <button className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors py-1">
                    View all history
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

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
                onClick={() => { toggleProfileSidebar(); }}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
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
