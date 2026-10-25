export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college?: string;
  department?: string;
  semester?: string;
  avatar?: string;
  settings?: UserSettings;
  createdAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  urgentThresholdHours: number;
  upcomingThresholdHours: number;
  defaultPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  theme: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  color: string;
  department?: string;
  semester?: string;
  description?: string;
  userId: string;
  stats?: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export type SubmissionType =
  | 'LAB_RECORD'
  | 'TECHNICAL_REPORT'
  | 'HOMEWORK'
  | 'DPP'
  | 'MINI_PROJECT'
  | 'ESSAY'
  | 'OTHER';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
    instructor?: string;
  };
  dueDate: string;
  priority: Priority;
  status: AssignmentStatus;
  submissionType: SubmissionType;
  estimatedHours?: number;
  actualHours?: number;
  referenceUrl?: string;
  attachmentNotes?: string;
  completedAt?: string;
  reminderOffsets?: string;
  urgency?: {
    hoursRemaining: number;
    isOverdue: boolean;
    isUrgent: boolean;
    isApproaching: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  assignmentId?: string;
  assignment?: {
    id: string;
    title: string;
    dueDate: string;
    priority: Priority;
    subject?: {
      code: string;
      color: string;
    };
  };
  title: string;
  message: string;
  type: 'URGENT' | 'UPCOMING' | 'OVERDUE' | 'SYSTEM' | 'COMPLETED';
  isRead: boolean;
  sentAt: string;
  createdAt: string;
}

export interface DashboardAnalytics {
  kpis: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    completionRate: number;
    totalEstimatedHours: number;
    totalActualHours: number;
    highPriorityPending: number;
  };
  urgentTasks: (Assignment & { hoursRemaining: number })[];
  subjectBreakdown: {
    id: string;
    name: string;
    code: string;
    color: string;
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  }[];
  submissionTypeData: {
    type: string;
    label: string;
    count: number;
  }[];
  next7DaysTimeline: {
    date: string;
    day: string;
    due: number;
    completed: number;
  }[];
  recentNotifications: InAppNotification[];
}
