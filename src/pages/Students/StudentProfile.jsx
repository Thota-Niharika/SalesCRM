import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, BookOpen, Link, CheckCircle, AlertTriangle, Clock, User, Mail, Phone, Activity, CreditCard, MessageCircle } from 'lucide-react';
import { MOCK_STUDENTS } from './StudentPanel';
import { MOCK_EMIS } from '../Payments/PaymentPanel';
import { cn } from '../../components/layout/Sidebar';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = MOCK_STUDENTS.find(s => s.id === id);
  const studentEmis = MOCK_EMIS.filter(e => e.student === student?.name);
  const hasOverdue = studentEmis.some(e => e.status === 'Overdue');

  if (!student) {
    return <div className="p-8 text-center text-gray-500 font-medium">Student not found</div>;
  }

  const handleCall = () => {
    window.location.href = `tel:${student.id}`; // In mock, student.id has numbers
    addNotification(`Calling ${student.name}...`, "info");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${student.name.toLowerCase().replace(' ', '.')}@example.com`;
    addNotification(`Opening email to ${student.name}...`, "info");
  };

  const handleWhatsApp = () => {
    const cleanPhone = student.id.replace(/[^0-9]/g, ''); // Mock fallback
    window.open(`https://wa.me/91${cleanPhone || '9999999999'}`, '_blank');
    addNotification("Opening WhatsApp...", "success");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/students')}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {student.name}
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 uppercase tracking-tight">
              {student.id}
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Column (Profile & Status) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm relative overflow-hidden text-left">
            <div className={cn(
              "absolute top-0 left-0 w-full h-2 bg-gradient-to-r",
              hasOverdue ? "from-rose-500 to-orange-400" : "from-emerald-500 to-teal-400"
            )}></div>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-3xl border-4 border-white shadow-xl mb-4">
                {student.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{student.course}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider",
                  student.lmsAccess ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                )}>
                  LMS: {student.lmsAccess ? 'Level 4 Access' : 'Access Revoked'}
                </span>
                {hasOverdue && (
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="font-medium text-gray-900">{student.name.toLowerCase().replace(' ', '.')}@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</p>
                  <p className="font-medium text-gray-900">+1 555-90{student.id.split('-')[1]}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Reach</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 text-gray-700 rounded-2xl text-xs font-bold transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </button>
                <button 
                  onClick={handleEmail}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-2xl text-xs font-bold transition-all active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button 
                  onClick={handleWhatsApp}
                  className="col-span-2 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                >
                  <MessageCircle className="w-4 h-4" /> Message via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Details & Payments) */}
        <div className="space-y-6 lg:col-span-2 text-left">
          
          {/* Commitments Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm text-left">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <Link className="w-4 h-4" /> Post-Sales Commitments
            </h3>
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <p className="text-gray-900 font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                {student.commitments}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> VERIFIED BY OPERATIONS
              </div>
            </div>
          </div>

          {/* Payment Schedule Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm text-left">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> EMI & Financial Health
            </h3>
            
            <div className="space-y-4">
              {studentEmis.length > 0 ? (
                studentEmis.map(emi => (
                  <div key={emi.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        emi.status === 'Paid' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">₹{emi.amount} - {emi.status}</p>
                        <p className="text-xs text-gray-500">Scheduled for {emi.dueDate}</p>
                      </div>
                    </div>
                    {emi.status === 'Paid' ? (
                      <span className="text-emerald-600">
                        <CheckCircle className="w-6 h-6" />
                      </span>
                    ) : (
                      <span className="text-amber-500">
                        <AlertTriangle className="w-6 h-6" />
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="font-medium">No active EMI installments</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Logs Dashboard Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm text-left">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4" /> PRM Audit Logs
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Course Commencement Logged</p>
                  <p className="text-xs text-gray-500 mt-1">LMS orientation completed by Alex Associate • Mar 12, 2026</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-100"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Mentorship Agreement Generated</p>
                  <p className="text-xs text-gray-500 mt-1">Special commitment noted: {student.commitments} • Mar 10, 2026</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
