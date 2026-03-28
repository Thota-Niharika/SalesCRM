import React, { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { CreditCard, CheckCircle, AlertOctagon, Clock, DollarSign, X, User, Calendar, ChevronDown, Scissors, Plus, Trash2, FileText, Download, Printer } from 'lucide-react';
import { cn } from '../../components/layout/Sidebar';
import CanDo from '../../components/auth/CanDo';
import useNotificationStore from '../../store/useNotificationStore';
import { MOCK_LEADS, MOCK_EMIS as INITIAL_EMIS } from '../../utils/mockData';

export default function PaymentPanel() {
  const role = useAuthStore(state => state.role);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [emis, setEmis] = useState(INITIAL_EMIS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splittingEmi, setSplittingEmi] = useState(null);
  const [splitInstallments, setSplitInstallments] = useState([]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
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

    addNotification(`Payment of ₹${formData.amount} recorded for ${studentName}`, "success");
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

  const openSplitModal = (emi) => {
    setSplittingEmi(emi);
    // Initialize with 2 installments
    const half = emi.amount / 2;
    setSplitInstallments([
      { id: Date.now() + 1, amount: half, dueDate: emi.dueDate },
      { id: Date.now() + 2, amount: half, dueDate: '' }
    ]);
    setIsSplitModalOpen(true);
  };

  const handleAddSplit = () => {
    setSplitInstallments([...splitInstallments, { id: Date.now(), amount: 0, dueDate: '' }]);
  };

  const handleRemoveSplit = (id) => {
    if (splitInstallments.length > 2) {
      setSplitInstallments(splitInstallments.filter(inst => inst.id !== id));
    }
  };

  const handleUpdateSplit = (id, field, value) => {
    setSplitInstallments(splitInstallments.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const handleConfirmSplit = () => {
    const totalSplit = splitInstallments.reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0);
    
    if (Math.abs(totalSplit - splittingEmi.amount) > 0.01) {
      addNotification(`Total split amount (₹${totalSplit.toFixed(2)}) must equal original amount (₹${splittingEmi.amount})`, "error");
      return;
    }

    if (splitInstallments.some(inst => !inst.dueDate || !inst.amount)) {
      addNotification("Please fill all split fields correctly", "error");
      return;
    }

    // Process split
    const newEmisList = emis.filter(e => e.id !== splittingEmi.id);
    const splitEmis = splitInstallments.map((inst, idx) => ({
      id: `${splittingEmi.id}-${String.fromCharCode(65 + idx)}`,
      student: splittingEmi.student,
      amount: parseFloat(inst.amount),
      dueDate: inst.dueDate,
      status: 'Pending'
    }));

    setEmis([...newEmisList, ...splitEmis]);
    setIsSplitModalOpen(false);
    addNotification(`EMI ${splittingEmi.id} split into ${splitInstallments.length} installments`, "success");
  };

  const handleOpenInvoice = (emi) => {
    setSelectedInvoice(emi);
    setIsInvoiceModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Split EMI Modal */}
      {isSplitModalOpen && splittingEmi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-h-[90vh] max-w-2xl w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 text-left flex flex-col overflow-hidden">
            <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Split Installment</h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Original Amount: ₹{splittingEmi.amount}</p>
                </div>
              </div>
              <button onClick={() => setIsSplitModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 pr-4">
              {splitInstallments.map((inst, idx) => (
                <div key={inst.id} className="flex items-end gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group transition-all hover:bg-white hover:border-blue-200">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Part {idx + 1} Amount (₹)</label>
                    <input 
                      type="number"
                      value={inst.amount}
                      onChange={(e) => handleUpdateSplit(inst.id, 'amount', e.target.value)}
                      className="w-full bg-white border-gray-200 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                    <input 
                      type="date"
                      value={inst.dueDate}
                      onChange={(e) => handleUpdateSplit(inst.id, 'dueDate', e.target.value)}
                      className="w-full bg-white border-gray-200 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {splitInstallments.length > 2 && (
                    <button 
                      onClick={() => handleRemoveSplit(inst.id)}
                      className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mb-0.5"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 shrink-0 space-y-4">
              <button 
                onClick={handleAddSplit}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Another Part
              </button>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-2xl text-white">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Split Amount</p>
                  <p className="text-xl font-black leading-none">₹{splitInstallments.reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Original</p>
                  <p className="text-sm font-bold opacity-60 leading-none tracking-tighter">₹{splittingEmi.amount}</p>
                </div>
              </div>

              <button 
                onClick={handleConfirmSplit}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                Confirm Split & Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsInvoiceModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden text-left flex flex-col">
            <div className="p-6 flex justify-between items-center border-b border-gray-100 shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg italic shadow-lg shadow-indigo-200">
                    G
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 leading-tight">GYANTRIX</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Education Management System</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrint} className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-all flex items-center gap-2 text-xs font-bold">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button onClick={() => setIsInvoiceModalOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 print-only bg-white text-left scrollbar-hide">
              <div className="flex justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-gray-500 font-medium">#{selectedInvoice.id}-INV</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Issue</p>
                  <p className="font-bold text-gray-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
                  <p className="text-xl font-bold text-gray-900 mb-1">{selectedInvoice.student}</p>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Student ID: {selectedInvoice.student.split(' ')[0].toLowerCase()}-01<br />
                    Enrolled Course: Digital Marketing & Data Science
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Info</p>
                  <p className="font-bold text-gray-900 mb-1">Method: UPI / Online Transfer</p>
                  <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Status: {selectedInvoice.status}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-3xl overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Description</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-bold text-base">Course Installment - {selectedInvoice.id}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Scheduled payment due: {selectedInvoice.dueDate}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900 text-lg">₹{selectedInvoice.amount.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-6 py-4 text-right font-bold text-gray-400 uppercase text-[10px]">Total Paid</td>
                      <td className="px-6 py-4 text-right font-black text-2xl text-indigo-600">₹{selectedInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6 flex justify-between items-end italic text-gray-400">
                <div className="text-[9px] font-medium leading-relaxed">
                  * This is a computer-generated receipt.<br/>
                  No signature required. 
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Authorized</p>
                  <p className="text-[9px]">Gyantrix Education</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 no-print">
              <button 
                onClick={handlePrint}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Official Receipt (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-all duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="flex items-center justify-between mb-8 text-left">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                  <p className="text-xs text-gray-500 font-medium text-left">Log a new transaction to the system</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all hover:rotate-90">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-5 text-left">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider text-left">Select Student/Lead</label>
                <div className="relative group text-left">
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
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Amount (₹)</label>
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
                <div className="space-y-1 text-left">
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
                <div className="space-y-1 text-left">
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
                <div className="space-y-1 text-left">
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
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
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-left">
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
                  <td className="px-6 py-4 font-bold text-gray-900">₹{emi.amount}</td>
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
                    <div className="flex items-center justify-end gap-2">
                       {emi.status !== 'Paid' && (
                        <button 
                          onClick={() => openSplitModal(emi)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all text-xs"
                          title="Split into installments"
                        >
                          <Scissors className="w-3.5 h-3.5" /> Split
                        </button>
                      )}

                      {emi.status === 'Paid' && (
                        <button 
                          onClick={() => handleOpenInvoice(emi)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold transition-all text-xs"
                          title="View Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>
                      )}
                      
                      <CanDo allowedRoles={['Admin']}>
                        {emi.status !== 'Paid' && (
                          <button 
                            onClick={() => handleApprove(emi.id)}
                            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                      </CanDo>
                    </div>

                    {role !== 'Admin' && emi.status !== 'Paid' && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block mt-1">PENDING APPROVAL</span>
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
