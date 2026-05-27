const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const WS_URL = API_URL.replace('http', 'ws').replace('/api', '');
export const api = {
  getAssignments: async () => {
    const res = await fetch(`${API_URL}/assignments`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },
  
  getAssignment: async (id: string) => {
    const res = await fetch(`${API_URL}/assignments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch assignment');
    return res.json();
  },
  
  createAssignment: async (data: any) => {
    const res = await fetch(`${API_URL}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create assignment');
    return res.json();
  },
  
  deleteAssignment: async (id: string) => {
    const res = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete assignment');
    return res.json();
  },

  updateAssignment: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update assignment');
    return res.json();
  },

  archiveAssignment: async (id: string) => {
    const res = await fetch(`${API_URL}/assignments/${id}/archive`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to archive assignment');
    return res.json();
  },

  restoreAssignment: async (id: string) => {
    const res = await fetch(`${API_URL}/assignments/${id}/restore`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to restore assignment');
    return res.json();
  },

  permanentDeleteAssignment: async (id: string) => {
    const res = await fetch(`${API_URL}/assignments/${id}/permanent`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to permanently delete assignment');
    return res.json();
  },

  getArchivedAssignments: async () => {
    const res = await fetch(`${API_URL}/assignments/settings/archives`);
    if (!res.ok) throw new Error('Failed to fetch archived assignments');
    return res.json();
  },

  getDeletedAssignments: async () => {
    const res = await fetch(`${API_URL}/assignments/settings/bin`);
    if (!res.ok) throw new Error('Failed to fetch deleted assignments');
    return res.json();
  },

  // generateAIPaper and saveGeneratedAssignment removed in favor of background queue flow

  // Classes
  getClasses: async () => {
    const res = await fetch(`${API_URL}/classes`);
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },
  getClass: async (id: string) => {
    const res = await fetch(`${API_URL}/classes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch class');
    return res.json();
  },
  createClass: async (data: any) => {
    const res = await fetch(`${API_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create class');
    return res.json();
  },
  updateClass: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update class');
    return res.json();
  },
  deleteClass: async (id: string) => {
    const res = await fetch(`${API_URL}/classes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete class');
    return res.json();
  },
  
  archiveClass: async (id: string) => {
    const res = await fetch(`${API_URL}/classes/${id}/archive`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to archive class');
    return res.json();
  },

  restoreClass: async (id: string) => {
    const res = await fetch(`${API_URL}/classes/${id}/restore`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to restore class');
    return res.json();
  },

  permanentDeleteClass: async (id: string) => {
    const res = await fetch(`${API_URL}/classes/${id}/permanent`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to permanently delete class');
    return res.json();
  },

  getArchivedClasses: async () => {
    const res = await fetch(`${API_URL}/classes/settings/archives`);
    if (!res.ok) throw new Error('Failed to fetch archived classes');
    return res.json();
  },

  getDeletedClasses: async () => {
    const res = await fetch(`${API_URL}/classes/settings/bin`);
    if (!res.ok) throw new Error('Failed to fetch deleted classes');
    return res.json();
  },
  
  // Settings - Profile
  getProfile: async () => {
    const res = await fetch(`${API_URL}/user`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
  updateProfile: async (data: any) => {
    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Settings - Organization
  getOrganization: async () => {
    const res = await fetch(`${API_URL}/org`);
    if (!res.ok) throw new Error('Failed to fetch organization');
    return res.json();
  },
  updateOrganization: async (data: any) => {
    const res = await fetch(`${API_URL}/org`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update organization');
    return res.json();
  },

  // Settings - Team
  getTeam: async () => {
    const res = await fetch(`${API_URL}/user/team`);
    if (!res.ok) throw new Error('Failed to fetch team');
    return res.json();
  },
  inviteTeamMember: async (data: any) => {
    const res = await fetch(`${API_URL}/user/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to invite member');
    return res.json();
  },
  updateTeamMember: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/user/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update member');
    return res.json();
  },
  deleteTeamMember: async (id: string) => {
    const res = await fetch(`${API_URL}/org/team/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove team member');
    return res.json();
  },
  getAnalytics: async () => {
    const res = await fetch(`${API_URL}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },
  seedAnalytics: async () => {
    const res = await fetch(`${API_URL}/analytics/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed analytics');
    return res.json();
  },

  // Settings - Billing
  getBilling: async () => {
    const res = await fetch(`${API_URL}/billing/status`);
    if (!res.ok) throw new Error('Failed to fetch billing');
    return res.json();
  },

  // Settings - Integrations
  getIntegrations: async () => {
    const res = await fetch(`${API_URL}/integrations`);
    if (!res.ok) throw new Error('Failed to fetch integrations');
    return res.json();
  },
  toggleIntegration: async (id: string) => {
    const res = await fetch(`${API_URL}/integrations/${id}/toggle`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to toggle integration');
    return res.json();
  },

  // Library / Resources
  getResources: async () => {
    const res = await fetch(`${API_URL}/library`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },
  createResource: async (data: any) => {
    const res = await fetch(`${API_URL}/library`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create resource');
    return res.json();
  },
  toggleResourceStar: async (id: string) => {
    const res = await fetch(`${API_URL}/library/${id}/star`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to star resource');
    return res.json();
  },
  deleteResource: async (id: string) => {
    const res = await fetch(`${API_URL}/library/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete resource');
    return res.json();
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_URL}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },
  markNotificationsRead: async () => {
    const res = await fetch(`${API_URL}/notifications/read-all`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to mark notifications read');
    return res.json();
  },

  // User Profile
  getUser: async () => {
    const res = await fetch(`${API_URL}/user`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
  updateUser: async (data: any) => {
    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  // Students
  getStudents: async () => {
    const res = await fetch(`${API_URL}/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },
  createStudent: async (data: any) => {
    const res = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create student');
    return res.json();
  },
  updateStudent: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },
  deleteStudent: async (id: string) => {
    const res = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  }
};
