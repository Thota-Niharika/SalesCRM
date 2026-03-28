export const LEAD_STAGES = [
  'New',
  'Contacted',
  'Interested',
  'Under Review',
  'Converted',
  'Lost'
];

export const MOCK_LEADS = [
  {
    id: 'L-1001',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+1 555-0101',
    course: 'Full Stack Development',
    stage: 'New',
    assignedTo: 'alex@crm.com',
    lastActivity: '2026-03-25T10:00:00Z',
    isStale: true, // Activity > 2 days
    activities: [
      { id: 1, type: 'note', text: 'Lead from Facebook Ads', user: 'System', date: '2026-03-25T10:00:00Z' }
    ]
  },
  {
    id: 'L-1002',
    name: 'John Connor',
    email: 'john.c@example.com',
    phone: '+1 555-0102',
    course: 'Data Science',
    stage: 'Contacted',
    assignedTo: 'alex@crm.com',
    lastActivity: '2026-03-27T08:30:00Z',
    isStale: false,
    activities: [
      { id: 2, type: 'call', text: 'Called and left voicemail', user: 'alex@crm.com', date: '2026-03-27T08:30:00Z' },
      { id: 1, type: 'status_change', text: 'Lead moved to Contacted', user: 'alex@crm.com', date: '2026-03-27T08:25:00Z' }
    ]
  },
  {
    id: 'L-1003',
    name: 'Kyle Reese',
    email: 'kyle.r@example.com',
    phone: '+1 555-0103',
    course: 'Cybersecurity',
    stage: 'Converted',
    assignedTo: 'manager1',
    lastActivity: '2026-03-26T14:15:00Z',
    isStale: false,
    activities: [
      { id: 1, type: 'status_change', text: 'Lead moved to Converted', user: 'admin@crm.com', date: '2026-03-26T14:15:00Z' }
    ]
  }
];

export const MOCK_TASKS = [
  {
    id: 'T-101',
    title: 'Follow up with Sarah Connor',
    description: 'Check if she received the course brochure and has any questions.',
    dueDate: '2026-03-28T14:00:00Z',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'alex@crm.com',
    relatedTo: 'Sarah Connor'
  },
  {
    id: 'T-102',
    title: 'Document Verification',
    description: 'Verify the identity documents uploaded by John Connor.',
    dueDate: '2026-03-27T10:00:00Z',
    status: 'Overdue',
    priority: 'Medium',
    assignedTo: 'alex@crm.com',
    relatedTo: 'John Connor'
  },
  {
    id: 'T-103',
    title: 'Send Invoice',
    description: 'Generate and send the first installment invoice to Kyle Reese.',
    dueDate: '2026-03-29T11:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'manager1',
    relatedTo: 'Kyle Reese'
  },
  {
    id: 'T-104',
    title: 'Welcome Call',
    description: 'Call the new student helping them with LMS login.',
    dueDate: '2026-03-28T16:00:00Z',
    status: 'Pending',
    priority: 'Low',
    assignedTo: 'alex@crm.com',
    relatedTo: 'Sarah Connor'
  }
];
