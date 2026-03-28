import React, { useState } from 'react';
import { MOCK_TASKS } from '../../utils/mockData';
import useAuthStore from '../../store/useAuthStore';
import { CheckCircle, Clock, AlertCircle, Calendar, User, Search, Filter } from 'lucide-react';
import { cn } from '../../components/layout/Sidebar';
import { formatDistanceToNow } from 'date-fns';

export default function TaskList() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);

  const filteredTasks = tasks.filter(task => {
    // Role based filtering: 
    // Admin sees all.
    // Manager sees own + team's.
    // Associate sees only own.
    const isAssigned = role === 'Admin' || 
                       task.assignedTo === user.email || 
                       (role === 'Manager' && user.team?.includes(task.assignedTo));
    
    if (!isAssigned) return false;

    // Status filtering
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    
    // Search filtering
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' } 
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Overdue': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your follow-ups and daily activities.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 outline-none cursor-pointer appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
                <option value="Completed">Completed</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-500">
            <p className="text-sm">No tasks found matching your criteria.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={cn(
              "bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex items-start gap-4",
              task.status === 'Completed' ? "opacity-75 bg-gray-50/50" : "border-gray-200"
            )}>
              <button 
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-1 flex-shrink-0 transition-transform active:scale-90 hover:scale-110"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={cn(
                      "font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                      task.status === 'Completed' && "line-through text-gray-400"
                    )}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0",
                    getPriorityColor(task.priority)
                  )}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-4 text-xs font-medium">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={cn(
                      task.status !== 'Completed' && new Date(task.dueDate) < new Date() ? "text-rose-600 font-bold" : ""
                    )}>
                      Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{task.relatedTo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 italic font-normal">
                    Assigned: {task.assignedTo === user.email ? 'Me' : task.assignedTo}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
