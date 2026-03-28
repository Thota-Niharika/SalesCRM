import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_LEADS, LEAD_STAGES } from '../../utils/mockData';
import { ArrowLeft, UserCircle2, Phone, Mail, BookOpen, Clock, Activity, CheckCircle2, AlertCircle, X, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import CanDo from '../../components/auth/CanDo';
import useAuthStore, { MOCK_USERS } from '../../store/useAuthStore';
import { cn } from '../../components/layout/Sidebar';
import useNotificationStore from '../../store/useNotificationStore';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const leadInitial = MOCK_LEADS.find(l => l.id === id);
  const [lead, setLead] = useState(leadInitial);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const addNotification = useNotificationStore(state => state.addNotification);

  if (!lead) {
    return <div className="p-8 text-center text-gray-500">Lead not found</div>;
  }

  const currentStageIndex = LEAD_STAGES.indexOf(lead.stage);

  const handleStageChange = (newStage) => {
    const newStageIndex = LEAD_STAGES.indexOf(newStage);
    
    // UI RULE ENFORCEMENT: Only allow next sequential stage, or dropping to 'Lost'
    if (newStage !== 'Lost' && newStageIndex !== currentStageIndex + 1) {
      addNotification("Stages must proceed sequentially.", "error");
      return;
    }

    const newActivity = {
      id: Date.now(),
      type: 'status_change',
      text: `Lead moved from ${lead.stage} to ${newStage}`,
      user: user.email,
      date: new Date().toISOString()
    };

    setLead({
      ...lead,
      stage: newStage,
      activities: [newActivity, ...lead.activities],
      lastActivity: new Date().toISOString(),
      isStale: false
    });
    
    addNotification(`Lead ${lead.name} stage updated to ${newStage}`, "success");
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
    const newActivity = {
      id: Date.now(),
      type: 'call',
      text: `Outgoing call to ${lead.phone}`,
      user: user.email,
      date: new Date().toISOString()
    };
    setLead(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities],
      lastActivity: new Date().toISOString()
    }));
    addNotification("Opening dialer...", "info");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${lead.email}`;
    const newActivity = {
      id: Date.now(),
      type: 'email',
      text: `Email sent to ${lead.email}`,
      user: user.email,
      date: new Date().toISOString()
    };
    setLead(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities],
      lastActivity: new Date().toISOString()
    }));
    addNotification("Opening email client...", "info");
  };

  const handleReassign = (newUserEmail) => {
    const newActivity = {
      id: Date.now(),
      type: 'reassign',
      text: `Lead reassigned from ${lead.assignedTo} to ${newUserEmail}`,
      user: user.email,
      date: new Date().toISOString()
    };
    setLead(prev => ({
      ...prev,
      assignedTo: newUserEmail,
      activities: [newActivity, ...prev.activities],
      lastActivity: new Date().toISOString()
    }));
    setIsReassignModalOpen(false);
    addNotification(`Lead successfully reassigned to ${newUserEmail}`, "success");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Reassign Modal */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsReassignModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reassign Lead</h2>
              <button onClick={() => setIsReassignModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6 font-medium uppercase tracking-wider">Select Team Member</p>
            <div className="space-y-3">
              {Object.values(MOCK_USERS).map(u => (
                <button
                  key={u.email}
                  onClick={() => handleReassign(u.email)}
                  disabled={u.email === lead.assignedTo}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                    u.email === lead.assignedTo
                      ? "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
                      : "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50/30 active:scale-[0.98]"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.role} • {u.email}</p>
                  </div>
                  {u.email === lead.assignedTo && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">CURRENT</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/leads')}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {lead.name}
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
              {lead.id}
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Details) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border-4 border-white shadow-sm">
                {lead.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 leading-tight">{lead.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                  <UserPlus className="w-3.5 h-3.5 text-gray-400" />
                  {lead.assignedTo}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{lead.course}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider text-[10px]">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleCall}
                  className="flex justify-center items-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold rounded-xl transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button 
                  onClick={handleEmail}
                  className="flex justify-center items-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-bold rounded-xl transition-all active:scale-95"
                >
                  <Mail className="w-4 h-4" /> Email
                </button>
                <CanDo allowedRoles={['Manager', 'Admin']} disableOnly>
                  <button 
                    onClick={() => setIsReassignModalOpen(true)}
                    className="col-span-2 flex justify-center items-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-bold rounded-xl transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" /> Reassign Lead
                  </button>
                </CanDo>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Pipeline & Activity) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Pipeline Controller */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-5 relative flex items-center">
              <span className="bg-white pr-3 z-10">Sales Pipeline Stage</span>
              <div className="absolute left-0 top-1/2 w-full h-px bg-gray-100"></div>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {LEAD_STAGES.map((stage, idx) => {
                const isActive = lead.stage === stage;
                const isPast = LEAD_STAGES.indexOf(lead.stage) > idx;
                
                // Rule: can only click the IMMEDIATELY NEXT stage or 'Lost'
                const isNext = LEAD_STAGES.indexOf(lead.stage) + 1 === idx;
                const isLost = stage === 'Lost';
                const isClickable = !isActive && !isPast && (isNext || isLost);

                return (
                  <button
                    key={stage}
                    disabled={!isClickable}
                    onClick={() => handleStageChange(stage)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                        : isPast 
                          ? "bg-blue-50 text-blue-700 border border-blue-200 opacity-60 cursor-not-allowed"
                          : isClickable
                            ? "bg-white text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
                            : "bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed",
                      isLost && isClickable && "hover:border-rose-500 hover:text-rose-600"
                    )}
                  >
                    {isPast || isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current opacity-50" />}
                    {stage}
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Users can only move leads to the next immediate stage.
            </p>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                Audit & Activity Timeline
              </h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                + Add Note
              </button>
            </div>
            
            <div className="space-y-6 pl-2 text-left">
              {lead.activities.map((activity, idx) => (
                <div key={activity.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white bg-blue-500"></div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
                    <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserCircle2 className="w-3.5 h-3.5" /> {activity.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
