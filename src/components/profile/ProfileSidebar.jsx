import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useAttendanceStore from '../../store/useAttendanceStore';
import useNotificationStore from '../../store/useNotificationStore';
import useUIStore from '../../store/useUIStore';
import { User, Mail, Shield, MapPin, Clock, Calendar, TrendingUp, Award, Settings, Bell, Lock, X, LogOut } from 'lucide-react';
import { cn } from '../layout/Sidebar';

export default function ProfileSidebar() {
  const { user, logout } = useAuthStore();
  const { isPunchedIn } = useAttendanceStore();
  const { isProfileSidebarOpen, closeProfileSidebar } = useUIStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [activeModal, setActiveModal] = useState(null); // 'password' | 'notifications'
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [prefForm, setPrefForm] = useState({ email: true, desktop: true, whatsapp: false });
  const [errors, setErrors] = useState({});

  const stats = [
    { label: 'Leads Managed', value: '124', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Conversions', value: '18', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Performance', value: '92%', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (!isProfileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeProfileSidebar}
      ></div>

      {/* Sidebar Content */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-in-out">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-200">
              G
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">User Profile</h2>
          </div>
          <button 
            onClick={closeProfileSidebar} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
          {/* User Identity */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 mb-4">
              {user?.name?.[0].toUpperCase() || 'U'}
            </div>
            <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">{user?.name}</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
              {user?.role}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="truncate flex-1">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Verified Account</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0", stat.bg, stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-lg font-black text-gray-900 leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Section */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Attendance Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  isPunchedIn ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                )}>
                  {isPunchedIn ? 'Punched In' : 'Logged Out'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Month Total</span>
                <span className="text-xs font-black text-gray-900">164.5 Hrs</span>
              </div>
            </div>
          </div>

          {/* Settings Shortcuts */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">Account Control</p>
            <button 
              onClick={() => setActiveModal('password')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                <span className="text-xs font-bold text-gray-700">Change Password</span>
              </div>
              <X className="w-3 h-3 text-gray-200 group-hover:text-gray-400 rotate-45 transform" />
            </button>
            <button 
              onClick={() => setActiveModal('notifications')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-bold text-gray-700">Notifications Settings</span>
              </div>
              <X className="w-3 h-3 text-gray-200 group-hover:text-gray-400 rotate-45 transform" />
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        {activeModal === 'password' && (
          <div className="absolute inset-0 z-50 bg-white p-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Change Password</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={passwordForm.new}
                  onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                />
              </div>
              <button 
                onClick={() => {
                  if (passwordForm.new !== passwordForm.confirm) {
                    addNotification("Passwords do not match", "error");
                    return;
                  }
                  addNotification("Password updated successfully!", "success");
                  setActiveModal(null);
                }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mt-8 shadow-xl shadow-gray-200"
              >
                Update Credentials
              </button>
            </div>
          </div>
        )}

        {/* Notifications Modal */}
        {activeModal === 'notifications' && (
          <div className="absolute inset-0 z-50 bg-white p-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Notifications</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Alerts', icon: Mail, color: 'text-blue-500' },
                { id: 'desktop', label: 'Desktop Notifications', icon: Bell, color: 'text-indigo-500' },
                { id: 'whatsapp', label: 'WhatsApp Updates', icon: Award, color: 'text-emerald-500' }
              ].map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <pref.icon className={cn("w-5 h-5", pref.color)} />
                    <span className="text-sm font-bold text-gray-700">{pref.label}</span>
                  </div>
                  <button 
                    onClick={() => setPrefForm({...prefForm, [pref.id]: !prefForm[pref.id]})}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      prefForm[pref.id] ? "bg-indigo-600" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      prefForm[pref.id] ? "right-1" : "left-1"
                    )}></div>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => {
                  addNotification("Preferences saved successfully!", "success");
                  setActiveModal(null);
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mt-8 shadow-xl shadow-indigo-100"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Footer (Fixed Logout) */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <button 
            onClick={() => { logout(); closeProfileSidebar(); }}
            className="w-full py-4 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-rose-100"
          >
            <LogOut className="w-5 h-5" /> Sign Out from Account
          </button>
        </div>
      </div>
    </div>
  );
}
