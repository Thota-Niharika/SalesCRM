import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertTriangle, GraduationCap, Link } from 'lucide-react';
import { MOCK_EMIS } from '../Payments/PaymentPanel';
import { cn } from '../../components/layout/Sidebar';

export const MOCK_STUDENTS = [
  { id: 'S-2001', name: 'Sarah Connor', course: 'Full Stack Development', lmsAccess: true, commitments: 'Extra 1 month mentorship' },
  { id: 'S-2002', name: 'John Connor', course: 'Data Science', lmsAccess: false, commitments: 'None' },
  { id: 'S-2003', name: 'Kyle Reese', course: 'Cybersecurity', lmsAccess: true, commitments: 'Resume building support' },
];

export default function StudentPanel() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students & PRM Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor post-sales experience, LMS access, and student health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STUDENTS.map((student) => {
          // Check for EMI issues
          const studentEmi = MOCK_EMIS.find(e => e.student === student.name && e.status === 'Overdue');

          return (
            <div key={student.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative">
              {studentEmi && (
                <div className="absolute -top-3 -right-3 bg-rose-100 text-rose-700 px-3 py-1 text-xs font-bold rounded-full border border-rose-200 flex items-center gap-1 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" /> EMI Overdue
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-xs text-gray-500">{student.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <BookOpen className="w-4 h-4" /> Course
                  </span>
                  <span className="font-medium text-gray-900">{student.course}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <GraduationCap className="w-4 h-4" /> LMS Access
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-semibold",
                    student.lmsAccess ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {student.lmsAccess ? 'Active' : 'Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Link className="w-4 h-4" /> Commitments
                  </span>
                  <span className="font-medium text-gray-700">{student.commitments}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 uppercase tracking-widest text-[10px]">
                <button 
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="w-full py-3 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
