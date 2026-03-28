import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertTriangle, GraduationCap, Link, ChevronRight, UserCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { MOCK_EMIS } from '../../utils/mockData';
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

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-200">
              <tr>
                <th className="px-8 py-5">Student</th>
                <th className="px-6 py-5">Enrollment</th>
                <th className="px-6 py-5 text-center">LMS Status</th>
                <th className="px-6 py-5 text-center">EMI Health</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 italic-row-hover">
              {MOCK_STUDENTS.map((student) => {
                const studentEmi = MOCK_EMIS.find(e => e.student === student.name && e.status === 'Overdue');
                
                return (
                  <tr 
                    key={student.id} 
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 group-hover:scale-110 transition-transform shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">{student.course}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                          student.lmsAccess ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        )}>
                          {student.lmsAccess ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {student.lmsAccess ? 'Active' : 'Missing'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center">
                        {studentEmi ? (
                          <span className="bg-rose-100 text-rose-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-200 flex items-center gap-1.5 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        ) : (
                          <span className="bg-gray-50 text-gray-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100 flex items-center gap-1.5 opacity-60">
                            Clear
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-lg hover:shadow-indigo-100"
                      >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
