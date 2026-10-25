const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('assignment_reminder_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('assignment_reminder_token', token);
}

export function removeStoredToken() {
  localStorage.removeItem('assignment_reminder_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.[0]?.message || 'An error occurred while communicating with the server.';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: any) =>
    request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: any) =>
    request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  demoLogin: () =>
    request<{ success: boolean; token: string; user: any }>('/auth/demo-login', {
      method: 'POST',
    }),
  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),
  getMe: () => request<{ success: boolean; user: any }>('/auth/me'),
  updateProfile: (payload: any) =>
    request<{ success: boolean; user: any }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Subjects
  getSubjects: () => request<{ success: boolean; subjects: any[] }>('/subjects'),
  getSubject: (id: string) => request<{ success: boolean; subject: any }>(`/subjects/${id}`),
  createSubject: (payload: any) =>
    request<{ success: boolean; subject: any }>('/subjects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateSubject: (id: string, payload: any) =>
    request<{ success: boolean; subject: any }>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteSubject: (id: string) =>
    request<{ success: boolean; message: string }>(`/subjects/${id}`, {
      method: 'DELETE',
    }),

  // Assignments
  getAssignments: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ success: boolean; count: number; assignments: any[] }>(`/assignments${query}`);
  },
  getAssignment: (id: string) => request<{ success: boolean; assignment: any }>(`/assignments/${id}`),
  createAssignment: (payload: any) =>
    request<{ success: boolean; assignment: any }>('/assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAssignment: (id: string, payload: any) =>
    request<{ success: boolean; assignment: any }>(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  updateAssignmentStatus: (id: string, status: string, actualHours?: number) =>
    request<{ success: boolean; assignment: any }>(`/assignments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, actualHours }),
    }),
  deleteAssignment: (id: string) =>
    request<{ success: boolean; message: string }>(`/assignments/${id}`, {
      method: 'DELETE',
    }),

  // Notifications
  getNotifications: () =>
    request<{ success: boolean; unreadCount: number; notifications: any[] }>('/notifications'),
  markNotificationRead: (id: string) =>
    request<{ success: boolean; notification: any }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () =>
    request<{ success: boolean; message: string }>('/notifications/mark-all-read', {
      method: 'POST',
    }),
  deleteNotification: (id: string) =>
    request<{ success: boolean; message: string }>(`/notifications/${id}`, {
      method: 'DELETE',
    }),
  clearReadNotifications: () =>
    request<{ success: boolean; message: string }>('/notifications', {
      method: 'DELETE',
    }),
  triggerDeadlineCheck: () =>
    request<{ success: boolean; message: string }>('/notifications/check-now', {
      method: 'POST',
    }),

  // Analytics
  getDashboardAnalytics: () =>
    request<{ success: boolean; data: any }>('/analytics/dashboard'),

  // Settings
  getSettings: () => request<{ success: boolean; settings: any }>('/settings'),
  updateSettings: (payload: any) =>
    request<{ success: boolean; settings: any }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
