import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LEADS } from '../../utils/mockData';
import { Search, Filter, AlertCircle, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../components/layout/Sidebar';

export default function LeadList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);

  // Filter leads based on role (Associate sees only own, Manager/Admin sees all)
  const roleFilteredLeads = MOCK_LEADS.filter(lead => {
    if (role === 'Admin') return true;
    if (role === 'Manager') {
      // Manager sees own leads + team's leads
      // MOCK_USERS.manager.team has ['alex@crm.com']
      return lead.assignedTo === user.email || user.team?.includes(lead.assignedTo);
    }
    // Associate
    return lead.assignedTo === user.email;
  });

  const displayedLeads = roleFilteredLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', course: 'Full Stack Development' });
  const [errors, setErrors] = useState({});
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleAddLead = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newLead.name) newErrors.name = 'Name is required';
    if (!newLead.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!newLead.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addNotification("Please fix validation errors", "error");
      return;
    }

    // Success
    addNotification(`Lead ${newLead.name} added successfully!`, "success");
    setIsAddModalOpen(false);
    setNewLead({ name: '', email: '', phone: '', course: 'Full Stack Development' });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  className={cn("w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500", errors.name ? "border-rose-300 ring-rose-200" : "border-gray-200")}
                  value={newLead.name}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Enter student name"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    className={cn("w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500", errors.email ? "border-rose-300 ring-rose-200" : "border-gray-200")}
                    value={newLead.email}
                    onChange={e => setNewLead({...newLead, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    className={cn("w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500", errors.phone ? "border-rose-300 ring-rose-200" : "border-gray-200")}
                    value={newLead.phone}
                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="+91 0000000000"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newLead.course}
                  onChange={e => setNewLead({...newLead, course: e.target.value})}
                >
                  <option>Full Stack Development</option>
                  <option>Data Science</option>
                  <option>Cybersecurity</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">Create Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your admissions pipeline.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
        >
          + Add New Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 appearance-none font-medium text-gray-700 outline-none transition-all cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Under Review">Under Review</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 h-48">
                    <p>No leads found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                displayedLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className={cn(
                      "hover:bg-blue-50/50 transition-colors cursor-pointer group",
                      lead.isStale && "bg-rose-50/30"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {lead.isStale && (
                          <AlertCircle className="w-4 h-4 text-rose-500" title="Stale Lead - No activity for 2+ days" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.id} • {lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-full",
                        lead.stage === 'New' && "bg-blue-100 text-blue-700",
                        lead.stage === 'Contacted' && "bg-purple-100 text-purple-700",
                        lead.stage === 'Interested' && "bg-amber-100 text-amber-700",
                        lead.stage === 'Converted' && "bg-emerald-100 text-emerald-700"
                      )}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{lead.course}</td>
                    <td className="px-6 py-4 text-gray-500">{lead.assignedTo}</td>
                    <td className="px-6 py-4">
                      {lead.lastActivity ? (
                        <>
                          <div className={lead.isStale ? "text-rose-600 font-medium" : "text-gray-600"}>
                            {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true })}
                          </div>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 inline-block transition-transform group-hover:translate-x-1" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination stub */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <p>Showing <span className="font-medium text-gray-900">{displayedLeads.length}</span> results</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
