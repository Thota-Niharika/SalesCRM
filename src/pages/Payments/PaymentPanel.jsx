import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { CreditCard, CheckCircle, AlertOctagon, Clock, DollarSign, X, User, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '../../components/layout/Sidebar';
import CanDo from '../../components/auth/CanDo';
import useNotificationStore from '../../store/useNotificationStore';
import { MOCK_LEADS } from '../../utils/mockData';

export const MOCK_EMIS = [
  { id: 'E-01', student: 'Sarah Connor', amount: 500, dueDate: '2026-03-20', status: 'Overdue' },
  { id: 'E-02', student: 'John Connor', amount: 500, dueDate: '2026-03-30', status: 'Pending' },
  { id: 'E-03', student: 'Kyle Reese', amount: 1000, dueDate: '2026-03-15', status: 'Paid' },
];

export default function PaymentPanel() {
  const role = useAuthStore(state => state.role);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [emis, setEmis] = useState(MOCK_EMIS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    method: 'UPI',
    type: 'Full Payment',
    date: new Date().toISOString().split('T')[0]
  });

  const handleApprove = (id) => {
    setEmis(emis.map(e => e.id === id ? { ...e, status: 'Paid' } : e));
    addNotification(`Payment for ${id} approved`, 'success');
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.amount) {
      addNotification("Please fill all required fields", "error");
      return;
    }

    const studentName = MOCK_LEADS.find(l => l.id === formData.studentId)?.name || "Unknown Student";
    
    // Simulate recording
    const newPayment = {
      id: `P-${Date.now().toString().slice(-4)}`,
      student: studentName,
      amount: parseFloat(formData.amount),
      date: formData.date,
      status: 'Paid'
    };

    addNotification(`Payment of $${formData.amount} recorded for ${studentName}`, "success");
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      studentId: '',
      amount: '',
      method: 'UPI',
      type: 'Full Payment',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-all duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                  <p className="text-xs text-gray-500 font-medium">Log a new transaction to the system</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all hover:rotate-90">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Select Student/Lead</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <select 
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-11 pr-10 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                  >
                    <option value="">Select Student</option>
                    {MOCK_LEADS.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name} ({lead.id})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Amount ($)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-11 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-11 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Payment Method</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <select 
                      value={formData.method}
                      onChange={(e) => setFormData({...formData, method: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-11 pr-10 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Category</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 border rounded-2xl py-3 pl-11 pr-10 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                    >
                      <option value="Full Payment">Full Payment</option>
                      <option value="EMI Installment">EMI Installment</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
              >
                Confirm Payment & Log Entries
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & EMI Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Manage payment entries, approvals, and EMI collections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4" /> Record New Payment
        </button>
      </div>

      {/* EMI Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-left">
            <Clock className="w-5 h-5 text-gray-400" /> Active EMI Schedule
          </h3>
          <span className="text-xs font-medium text-gray-400">Total {emis.length} Items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">EMI ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {emis.map((emi) => (
                <tr key={emi.id} className={cn("hover:bg-gray-50 transition-colors group", emi.status === 'Overdue' && 'bg-rose-50/10')}>
                  <td className="px-6 py-4 font-bold text-gray-900">{emi.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">{emi.student}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${emi.amount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(emi.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-gray-500')}>
                      {emi.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 w-max",
                      emi.status === 'Paid' && "bg-emerald-50 text-emerald-700",
                      emi.status === 'Pending' && "bg-amber-50 text-amber-700",
                      emi.status === 'Overdue' && "bg-rose-50 text-rose-700"
                    )}>
                      {emi.status === 'Paid' && <CheckCircle className="w-3.5 h-3.5" />}
                      {emi.status === 'Overdue' && <AlertOctagon className="w-3.5 h-3.5" />}
                      {emi.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <CanDo allowedRoles={['Admin']}>
                      {emi.status !== 'Paid' && (
                        <button 
                          onClick={() => handleApprove(emi.id)}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                          Approve
                        </button>
                      )}
                    </CanDo>
                    {role !== 'Admin' && emi.status !== 'Paid' && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">PENDING APPROVAL</span>
                    )}
                    {emi.status === 'Paid' && (
                      <span className="text-xs text-emerald-600 font-bold">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
