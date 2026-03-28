import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CreditCard,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, leads: 24 },
  { name: 'Tue', revenue: 3000, leads: 13 },
  { name: 'Wed', revenue: 2000, leads: 38 },
  { name: 'Thu', revenue: 2780, leads: 39 },
  { name: 'Fri', revenue: 1890, leads: 48 },
  { name: 'Sat', revenue: 2390, leads: 38 },
  { name: 'Sun', revenue: 3490, leads: 43 },
];

export default function Dashboard() {
  const role = useAuthStore(state => state.role);
  const user = useAuthStore(state => state.user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMetrics = () => {
    // ... same as before ...
    switch (role) {
      case 'Admin':
        return [
          { title: 'Total Revenue', value: '₹124,500', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Pending EMI', value: '42 Overdue', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { title: 'Active Students', value: '1,204', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Payment Approvals pending', value: '12', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' }
        ];
      case 'Manager':
        return [
          { title: 'Team Revenue', value: '₹45,200', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Conversion Rate', value: '12.4%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Team Leads', value: '342', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }
        ];
      case 'Associate':
      default:
        return [
          { title: 'My Leads', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Follow-ups due', value: '8', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'My Revenue', value: '₹4,500', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ];
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}. Here's what's happening.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetrics().map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${metric.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg} ${metric.color} transition-transform group-hover:scale-110`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue vs Leads Over Time</h3>
          <div className="h-80 w-full relative">
            {isClient && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    formatter={(value, name) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Leads']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 text-left">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Urgent Tasks
          </h3>
          <div className="space-y-4 text-left">
            {[1, 2, 3].map(i => (
              <div key={i} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <p className="text-sm font-semibold text-gray-900 text-left">Follow up with John Doe</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-rose-500 font-medium whitespace-nowrap">Overdue by 2 hours</span>
                  <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Action &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
