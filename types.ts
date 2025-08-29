export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Blocked = 'Blocked',
}

export enum ProcessType {
    Permitting = 'permitting',
    Construction = 'construction',
    Management = 'management',
}

export interface Attachment {
  id: string;
  name: string;
  url: string; // data URL
  type: 'image' | 'document';
}

export interface PermitDetail {
  recordNumber: string;
  recordStatus: string;
  applicant: { name: string; phone: string; email: string; mailingAddress: string; };
  licensedProfessional: { name: string; company: string; address: string; phone: string; licenseInfo: string; };
  owner: { name: string; address: string; };
  projectDescription: string;
  scopeOfWork: string;
  applicationInfo: {
    deckSqFt: number;
    additionSqFt: number;
    trades: string[];
  };
  gisInfo: {
    parcelNumber: string;
    jurisdictions: { type: string; value: string }[];
    landDevelopment: { type: string; value: string }[];
    waterAreas: { type: string; value: string }[];
    zoningBase: { baseZone: string; caseNumber: string; }[];
    zoningOverlay: { type: string; value: string }[];
  }
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  notes?: string;
  personId?: string;
  startDate?: string;
  endDate?: string;
  fee?: {
    amount: number;
    paid: boolean;
  };
  attachments?: Attachment[];
  permitDetails?: PermitDetail;
}

export interface Process {
  tasks: Task[];
}

export interface Person {
  id:string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatarUrl: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  personId?: string; // Optional: for system events
  type: 'comment' | 'event';
  text: string;
  attachments?: Attachment[];
}

export interface Property {
  id: number;
  address: string;
  imageUrl: string;
  permitting: Process;
  construction: Process;
  management: Process;
  activityLog: LogEntry[];
}

export interface Message {
    sender: 'user' | 'ai';
    text: string;
}